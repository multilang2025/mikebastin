<?php
/**
 * OAuth + reporting client for Google Analytics (GA4), using the Google
 * Analytics Admin API (list accessible properties/data streams) and the
 * Google Analytics Data API (run reports).
 *
 * Deliberately reuses the SAME Google Cloud OAuth Client (ID/secret) as
 * AISA_Gsc_Client rather than requiring a second one -- it's one Google
 * Cloud project either way, just with an additional API enabled and an
 * additional scope requested. The two connections (refresh token, chosen
 * property) are stored separately ('aisa_ga_connection' vs
 * 'aisa_gsc_connection') since they're independent OAuth grants with
 * different scopes -- connecting one does not connect the other.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * OAuth + Data/Admin API client for Google Analytics (GA4).
 */
class AISA_Ga_Client {

	const AUTH_URL         = 'https://accounts.google.com/o/oauth2/v2/auth';
	const TOKEN_URL        = 'https://oauth2.googleapis.com/token';
	const ADMIN_API_BASE   = 'https://analyticsadmin.googleapis.com/v1beta/';
	const DATA_API_BASE    = 'https://analyticsdata.googleapis.com/v1beta/';
	const SCOPE            = 'https://www.googleapis.com/auth/analytics.readonly';
	const CONNECTION_OPTION = 'aisa_ga_connection';

	/**
	 * Reuse the same Google Cloud OAuth Client ID as the GSC integration --
	 * this is one Google Cloud project with two APIs/scopes enabled on it,
	 * not two separate apps.
	 *
	 * @return string
	 */
	public static function get_client_id() {
		return AISA_Gsc_Client::get_client_id();
	}

	/**
	 * Reuse the same Google Cloud OAuth Client Secret as the GSC integration.
	 *
	 * @return string
	 */
	public static function get_client_secret() {
		return AISA_Gsc_Client::get_client_secret();
	}

	/**
	 * Whether an OAuth Client ID/Secret pair is configured (shared with GSC).
	 *
	 * @return bool
	 */
	public static function has_client_credentials() {
		return AISA_Gsc_Client::has_client_credentials();
	}

	/**
	 * The stored connection: refresh_token, cached access_token + its expiry,
	 * the resolved GA4 property ("properties/123456789"), its display name for
	 * the admin UI, and a list of candidates awaiting the admin's pick when
	 * auto-detection was ambiguous.
	 *
	 * @return array
	 */
	public static function get_connection() {
		return get_option(
			self::CONNECTION_OPTION,
			array(
				'refresh_token'        => '',
				'access_token'         => '',
				'access_token_expires' => 0,
				'property'             => '',
				'property_name'        => '',
				'candidates'           => array(),
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
	 * be added, verbatim, to the SAME OAuth Client's "Authorized redirect
	 * URIs" in Google Cloud Console that the GSC redirect URI is already on
	 * (this is an ADDITIONAL entry, not a replacement).
	 *
	 * @return string
	 */
	public static function get_redirect_uri() {
		return rest_url( 'aisa/v1/ga/callback' );
	}

	/**
	 * Build the URL that starts the Google consent flow for Analytics access.
	 * Independent of the GSC connect flow -- granting one does not grant the
	 * other, since they request different scopes.
	 *
	 * @return string
	 */
	public static function get_auth_url() {
		$state = wp_generate_password( 32, false );
		set_transient( 'aisa_ga_state_' . $state, 1, 10 * MINUTE_IN_SECONDS );

		$params = array(
			'client_id'     => self::get_client_id(),
			'redirect_uri'  => self::get_redirect_uri(),
			'response_type' => 'code',
			'scope'         => self::SCOPE,
			'access_type'   => 'offline',
			'prompt'        => 'consent',
			'state'         => $state,
		);
		return self::AUTH_URL . '?' . http_build_query( $params );
	}

	/**
	 * Verify and consume a `state` value from get_auth_url(). Single-use.
	 *
	 * @param string $state The `state` param Google echoed back.
	 * @return bool
	 */
	public static function verify_and_consume_state( $state ) {
		$state = (string) $state;
		if ( '' === $state ) {
			return false;
		}
		$key   = 'aisa_ga_state_' . $state;
		$valid = (bool) get_transient( $key );
		delete_transient( $key );
		return $valid;
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
	 * Exchange the stored refresh token for a new access token.
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
			return new WP_Error( 'aisa_ga_oauth_error', $message, array( 'status' => $code ) );
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
			return new WP_Error( 'aisa_ga_not_connected', __( 'Google Analytics is not connected yet. Connect it on the AISA Connector settings page.', 'ai-site-assistant' ) );
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
	 * List every GA4 property the connected Google account can access, across
	 * every account it's a member of. Used right after OAuth consent to
	 * auto-detect which one matches this WordPress site, and by
	 * ga_list_properties/resolve_property() for cross-domain use.
	 *
	 * @return array|WP_Error List of { property, displayName, account }, or WP_Error.
	 */
	public static function list_properties() {
		$token = self::get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		$properties     = array();
		$page_token     = '';
		do {
			$url = self::ADMIN_API_BASE . 'accountSummaries?pageSize=200';
			if ( '' !== $page_token ) {
				$url .= '&pageToken=' . rawurlencode( $page_token );
			}
			$response = wp_remote_get(
				$url,
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
				return new WP_Error( 'aisa_ga_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
			}
			foreach ( (array) ( $decoded['accountSummaries'] ?? array() ) as $account ) {
				foreach ( (array) ( $account['propertySummaries'] ?? array() ) as $property ) {
					$properties[] = array(
						'property'    => $property['property'] ?? '',
						'displayName' => $property['displayName'] ?? '',
						'account'     => $account['displayName'] ?? '',
					);
				}
			}
			$page_token = (string) ( $decoded['nextPageToken'] ?? '' );
		} while ( '' !== $page_token );

		return $properties;
	}

	/**
	 * List a GA4 property's web data streams (used to match a property to a
	 * site's actual URL via each stream's defaultUri, the way GSC properties
	 * are matched by hostname).
	 *
	 * @param string $property "properties/123456789".
	 * @return array|WP_Error List of stream objects, or WP_Error.
	 */
	public static function list_data_streams( $property ) {
		$token = self::get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		$response = wp_remote_get(
			self::ADMIN_API_BASE . self::property_path( $property ) . '/dataStreams?pageSize=200',
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
			return new WP_Error( 'aisa_ga_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
		}
		return $decoded['dataStreams'] ?? array();
	}

	/**
	 * Match a loosely-specified domain, property ID, or display name against
	 * the GA4 properties this Google account can access, mirroring
	 * AISA_Gsc_Client::resolve_property() -- so tools can query any property
	 * the admin owns, not just the one connected to this WordPress site.
	 *
	 * Tries the cheap match first (exact property ID or a displayName
	 * substring, both already in hand from list_properties()); only falls
	 * back to the more expensive per-property data-stream lookup (needed to
	 * match by actual domain) if that doesn't find anything.
	 *
	 * @param string $raw Domain, exact "properties/123" ID, or display name substring.
	 * @return string|WP_Error Matching property ID, this site's own connected
	 *                         property if $raw is empty, or WP_Error if no
	 *                         property matches.
	 */
	public static function resolve_property( $raw ) {
		$raw = trim( (string) $raw );
		if ( '' === $raw ) {
			$conn = self::get_connection();
			if ( '' === $conn['property'] ) {
				return new WP_Error( 'aisa_ga_no_property', __( 'No Google Analytics property selected yet.', 'ai-site-assistant' ) );
			}
			return $conn['property'];
		}

		$properties = self::list_properties();
		if ( is_wp_error( $properties ) ) {
			return $properties;
		}

		foreach ( $properties as $property ) {
			if ( $property['property'] === $raw
				|| false !== stripos( $property['displayName'], $raw ) ) {
				return $property['property'];
			}
		}

		// Fall back to matching by the property's actual site URL (its web
		// data stream's defaultUri), the way GSC properties are matched.
		$target_host = AISA_Gsc_Client::normalize_host( $raw );
		foreach ( $properties as $property ) {
			$streams = self::list_data_streams( $property['property'] );
			if ( is_wp_error( $streams ) ) {
				continue;
			}
			foreach ( $streams as $stream ) {
				$uri = $stream['webStreamData']['defaultUri'] ?? '';
				if ( '' !== $uri && AISA_Gsc_Client::normalize_host( $uri ) === $target_host ) {
					return $property['property'];
				}
			}
		}

		return new WP_Error(
			'aisa_ga_unknown_property',
			sprintf(
				/* translators: %s: the site/domain/property that was requested. */
				__( '"%s" isn\'t a Google Analytics property this Google account can access. Call ga_list_properties to see what\'s available.', 'ai-site-assistant' ),
				$raw
			)
		);
	}

	/**
	 * Run a Data API report against a property.
	 *
	 * @param array  $body     Request body: dimensions, metrics, dateRanges,
	 *                         orderBys, limit (dateRanges defaults to the last
	 *                         28 days ending yesterday if omitted -- unlike
	 *                         GSC, GA4 data has no multi-day reporting lag).
	 * @param string $property Optional property ID to query instead of the
	 *                         connected site's own resolved property.
	 * @return array|WP_Error { dimensionHeaders, metricHeaders, rows }, or WP_Error.
	 */
	public static function query( array $body, $property = '' ) {
		$token = self::get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		if ( '' === $property ) {
			$conn     = self::get_connection();
			$property = $conn['property'];
		}
		if ( '' === $property ) {
			return new WP_Error( 'aisa_ga_no_property', __( 'No Google Analytics property selected yet.', 'ai-site-assistant' ) );
		}

		if ( empty( $body['dateRanges'] ) ) {
			list( $start, $end ) = self::default_date_range();
			$body['dateRanges']  = array(
				array(
					'startDate' => $start,
					'endDate'   => $end,
				),
			);
		}

		$response = wp_remote_post(
			self::DATA_API_BASE . self::property_path( $property ) . ':runReport',
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
			return new WP_Error( 'aisa_ga_api_error', $decoded['error']['message'] ?? "HTTP {$code}", array( 'status' => $code ) );
		}
		return $decoded;
	}

	/**
	 * Build the "properties/<id>" path segment for a Data/Admin API URL.
	 * rawurlencode()-ing the property string AS A WHOLE (as every call site
	 * here originally did) encodes its internal "/" into "%2F", which
	 * Google's REST routing does not accept as equivalent to "/" -- every
	 * request 404s, not just one, because the path literally doesn't match
	 * any route. Only the numeric ID needs encoding; the "properties/"
	 * segment itself is a literal path separator, not data.
	 *
	 * @param string $property "properties/123456789" (or just "123456789").
	 * @return string "properties/123456789", safe to concatenate into a URL path.
	 */
	private static function property_path( $property ) {
		$id = preg_replace( '#^properties/#', '', (string) $property );
		return 'properties/' . rawurlencode( $id );
	}

	/**
	 * Default date range: the 28 days ending yesterday. GA4 reporting data is
	 * near-real-time (unlike GSC's 2-3 day lag), so "yesterday" is a safe
	 * upper bound rather than needing to look further back.
	 *
	 * @return array [ start, end ] as Y-m-d strings.
	 */
	public static function default_date_range() {
		$end   = gmdate( 'Y-m-d', strtotime( '-1 day' ) );
		$start = gmdate( 'Y-m-d', strtotime( '-28 days' ) );
		return array( $start, $end );
	}
}
