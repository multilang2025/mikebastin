<?php
/**
 * Thin client for the Google Search Console API (Search Analytics +
 * Sites) using WordPress's HTTP layer. Unlike Ahrefs/Gemini, GSC requires
 * a per-site OAuth 2.0 user consent instead of a static API key -- Google
 * ties Search Console data to a Google account, not an API key, so this
 * class also owns the OAuth code-exchange and refresh-token handling.
 *
 * Storage split (mirrors the aisa_bridge_connection pattern used for the
 * MCP bridge): the OAuth Client ID/Secret are form-editable settings living
 * in AISA_Settings::OPTION_KEY (like the other provider keys). The
 * resulting refresh token, cached access token, and resolved GSC property
 * are NOT part of that form -- they live in a separate 'aisa_gsc_connection'
 * option so a normal Settings-page save (which rebuilds OPTION_KEY from
 * the submitted form) can never wipe them out.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * OAuth + Search Analytics client for Google Search Console.
 */
class AISA_Gsc_Client {

	const AUTH_URL     = 'https://accounts.google.com/o/oauth2/v2/auth';
	const TOKEN_URL     = 'https://oauth2.googleapis.com/token';
	const API_BASE      = 'https://www.googleapis.com/webmasters/v3/';
	const SCOPE         = 'https://www.googleapis.com/auth/webmasters.readonly';
	const CONNECTION_OPTION = 'aisa_gsc_connection';

	/**
	 * Resolve the configured OAuth Client ID.
	 *
	 * @return string
	 */
	public static function get_client_id() {
		if ( defined( 'AISA_GSC_CLIENT_ID' ) && AISA_GSC_CLIENT_ID ) {
			return AISA_GSC_CLIENT_ID;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['gsc_client_id'] ?? '';
	}

	/**
	 * Resolve the configured OAuth Client Secret.
	 *
	 * @return string
	 */
	public static function get_client_secret() {
		if ( defined( 'AISA_GSC_CLIENT_SECRET' ) && AISA_GSC_CLIENT_SECRET ) {
			return AISA_GSC_CLIENT_SECRET;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['gsc_client_secret'] ?? '';
	}

	/**
	 * Whether an OAuth Client ID/Secret pair is configured (enough to start
	 * the connect flow -- not the same as fully connected).
	 *
	 * @return bool
	 */
	public static function has_client_credentials() {
		return '' !== self::get_client_id() && '' !== self::get_client_secret();
	}

	/**
	 * The stored connection: refresh_token, cached access_token + its expiry,
	 * and the resolved GSC property (or a list of candidates awaiting the
	 * admin's pick, when auto-detection was ambiguous).
	 *
	 * @return array
	 */
	public static function get_connection() {
		return get_option(
			self::CONNECTION_OPTION,
			array(
				'refresh_token'       => '',
				'access_token'        => '',
				'access_token_expires' => 0,
				'property'            => '',
				'candidates'          => array(),
			)
		);
	}

	/**
	 * Whether a refresh token AND a resolved property are both in place --
	 * i.e. the tools can actually query data right now.
	 *
	 * @return bool
	 */
	public static function is_configured() {
		$conn = self::get_connection();
		return '' !== $conn['refresh_token'] && '' !== $conn['property'];
	}

	/**
	 * The redirect URI Google sends the browser back to after consent. Must
	 * be added, verbatim, to the OAuth Client's "Authorized redirect URIs"
	 * in Google Cloud Console.
	 *
	 * @return string
	 */
	public static function get_redirect_uri() {
		return rest_url( 'aisa/v1/gsc/callback' );
	}

	/**
	 * Build the URL that starts the Google consent flow. access_type=offline
	 * + prompt=consent guarantee a refresh_token comes back even if the
	 * admin previously granted this app access (Google otherwise omits it
	 * on repeat consent, since it assumes the app already has one).
	 *
	 * @return string
	 */
	public static function get_auth_url() {
		$params = array(
			'client_id'     => self::get_client_id(),
			'redirect_uri'  => self::get_redirect_uri(),
			'response_type' => 'code',
			'scope'         => self::SCOPE,
			'access_type'   => 'offline',
			'prompt'        => 'consent',
			'state'         => wp_create_nonce( 'aisa_gsc_connect' ),
		);
		return self::AUTH_URL . '?' . http_build_query( $params );
	}

	/**
	 * Exchange an authorization code (from the callback's ?code=) for an
	 * access token + refresh token.
	 *
	 * @param string $code Authorization code from Google's redirect.
	 * @return array|WP_Error { access_token, refresh_token, expires_in }, or WP_Error.
	 */
	public static function exchange_code( $code ) {
		$response = wp_remote_post(
			self::TOKEN_URL,
			array(
				'timeout' => 20,
				'body'    => array(
					'code'          => $code,
					'client_id'     => self::get_client_id(),
					'client_secret' => self::get_client_secret(),
					'redirect_uri'  => self::get_redirect_uri(),
					'grant_type'    => 'authorization_code',
				),
			)
		);
		return self::handle_token_response( $response );
	}

	/**
	 * Exchange the stored refresh token for a new access token. Google does
	 * not return a new refresh_token here -- the original one keeps working
	 * indefinitely (for a verified/production OAuth app) or up to 7 days
	 * (for an app still in "Testing" publishing status).
	 *
	 * @param string $refresh_token Stored refresh token.
	 * @return array|WP_Error { access_token, expires_in }, or WP_Error.
	 */
	private static function refresh_access_token( $refresh_token ) {
		$response = wp_remote_post(
			self::TOKEN_URL,
			array(
				'timeout' => 20,
				'body'    => array(
					'refresh_token' => $refresh_token,
					'client_id'     => self::get_client_id(),
					'client_secret' => self::get_client_secret(),
					'grant_type'    => 'refresh_token',
				),
			)
		);
		return self::handle_token_response( $response );
	}

	/**
	 * Shared decode/error-handling for both token-endpoint calls above.
	 *
	 * @param array|WP_Error $response wp_remote_post() result.
	 * @return array|WP_Error
	 */
	private static function handle_token_response( $response ) {
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $code < 200 || $code >= 300 || empty( $decoded['access_token'] ) ) {
			$message = $decoded['error_description'] ?? $decoded['error'] ?? sprintf(
				/* translators: %d: HTTP status code. */
				__( 'Google OAuth error (HTTP %d).', 'ai-site-assistant' ),
				$code
			);
			return new WP_Error( 'aisa_gsc_oauth_error', $message, array( 'status' => $code ) );
		}
		return $decoded;
	}

	/**
	 * A valid access token, refreshing the cached one first if it's missing
	 * or expiring within the next 60 seconds.
	 *
	 * @return string|WP_Error
	 */
	private static function get_access_token() {
		$conn = self::get_connection();
		if ( '' === $conn['refresh_token'] ) {
			return new WP_Error( 'aisa_gsc_not_connected', __( 'Google Search Console is not connected yet. Connect it on the AISA Connector settings page.', 'ai-site-assistant' ) );
		}

		if ( '' !== $conn['access_token'] && $conn['access_token_expires'] > time() + 60 ) {
			return $conn['access_token'];
		}

		$refreshed = self::refresh_access_token( $conn['refresh_token'] );
		if ( is_wp_error( $refreshed ) ) {
			return $refreshed;
		}

		$conn['access_token']         = $refreshed['access_token'];
		$conn['access_token_expires'] = time() + (int) ( $refreshed['expires_in'] ?? 3600 );
		update_option( self::CONNECTION_OPTION, $conn, false );

		return $conn['access_token'];
	}

	/**
	 * List every GSC property (Domain and URL-prefix) the connected Google
	 * account can access. Used right after OAuth consent to auto-detect
	 * which one matches this WordPress site.
	 *
	 * @return array|WP_Error List of { siteUrl, permissionLevel }, or WP_Error.
	 */
	public static function list_properties() {
		$token = self::get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		$response = wp_remote_get(
			self::API_BASE . 'sites',
			array(
				'timeout' => 20,
				'headers' => array(
					'Authorization' => 'Bearer ' . $token,
					'Accept'        => 'application/json',
				),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error( 'aisa_gsc_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
		}
		return $decoded['siteEntry'] ?? array();
	}

	/**
	 * Run a Search Analytics query against the resolved property.
	 *
	 * @param array $body Request body: dimensions, dimensionFilterGroups,
	 *                    startDate, endDate, rowLimit (startDate/endDate are
	 *                    filled in from default_date_range() if omitted).
	 * @return array|WP_Error List of row objects, or WP_Error.
	 */
	public static function query( array $body ) {
		$token = self::get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		$conn = self::get_connection();
		if ( '' === $conn['property'] ) {
			return new WP_Error( 'aisa_gsc_no_property', __( 'No Search Console property selected yet.', 'ai-site-assistant' ) );
		}

		if ( empty( $body['startDate'] ) || empty( $body['endDate'] ) ) {
			list( $start, $end ) = self::default_date_range();
			$body['startDate']   = $body['startDate'] ?? $start;
			$body['endDate']     = $body['endDate'] ?? $end;
		}

		$response = wp_remote_post(
			self::API_BASE . 'sites/' . rawurlencode( $conn['property'] ) . '/searchAnalytics/query',
			array(
				'timeout' => 30,
				'headers' => array(
					'Authorization' => 'Bearer ' . $token,
					'Content-Type'  => 'application/json',
					'Accept'        => 'application/json',
				),
				'body'    => wp_json_encode( $body ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( $code < 200 || $code >= 300 ) {
			return new WP_Error( 'aisa_gsc_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
		}
		return $decoded['rows'] ?? array();
	}

	/**
	 * Default date range: a 90-day window ending 3 days ago, since Search
	 * Console data has a 2-3 day reporting lag -- "yesterday" or "today"
	 * always come back empty.
	 *
	 * @return array [ start, end ] as Y-m-d strings.
	 */
	public static function default_date_range() {
		$end   = gmdate( 'Y-m-d', strtotime( '-3 days' ) );
		$start = gmdate( 'Y-m-d', strtotime( '-93 days' ) );
		return array( $start, $end );
	}
}
