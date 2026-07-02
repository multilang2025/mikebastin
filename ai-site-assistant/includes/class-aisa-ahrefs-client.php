<?php
/**
 * Thin client for the Ahrefs API v3 using WordPress's HTTP layer. Powers the
 * SEO-intelligence tools (worst/best pages by traffic, organic competitors,
 * domain metrics) so the assistant can answer questions the WordPress
 * database alone can't -- e.g. "what are my least-performing articles?" and
 * "how do I compare to my competitors?".
 *
 * Verified against the Ahrefs API v3 documentation (docs.ahrefs.com): base
 * https://api.ahrefs.com/v3/, auth "Authorization: Bearer <key>", and every
 * Site Explorer endpoint requires at least `select`, `target`, and `date`.
 * Responses are read-only; monetary fields (value, org_cost) come back in
 * USD cents.
 *
 * As with the Claude/OpenRouter/Unsplash clients, wp_remote_get is used
 * directly rather than a Composer SDK so the plugin stays a self-contained zip.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sends read-only requests to the Ahrefs API v3.
 */
class AISA_Ahrefs_Client {

	const API_BASE = 'https://api.ahrefs.com/v3/';

	/**
	 * Resolve the configured Ahrefs API key.
	 *
	 * Prefer a constant in wp-config.php so the key never lives in the DB;
	 * fall back to the value saved on the settings page.
	 *
	 * @return string The configured key (or empty string).
	 */
	public static function get_api_key() {
		if ( defined( 'AISA_AHREFS_API_KEY' ) && AISA_AHREFS_API_KEY ) {
			return AISA_AHREFS_API_KEY;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['ahrefs_api_key'] ?? '';
	}

	/**
	 * Whether an Ahrefs key is configured (used to decide whether to expose
	 * the SEO-intelligence tools at all).
	 *
	 * @return bool
	 */
	public static function is_configured() {
		return '' !== self::get_api_key();
	}

	/**
	 * The site's own bare host (e.g. example.com), used as the default target.
	 *
	 * @return string
	 */
	public static function site_target() {
		$host = wp_parse_url( home_url(), PHP_URL_HOST );
		return is_string( $host ) ? preg_replace( '/^www\./', '', $host ) : '';
	}

	/**
	 * Send one GET request to an Ahrefs API v3 endpoint.
	 *
	 * @param string $endpoint Endpoint path relative to the v3 base, e.g. "site-explorer/top-pages".
	 * @param array  $params   Query parameters.
	 * @return array|WP_Error Decoded response body, or WP_Error on failure.
	 */
	public static function get( $endpoint, array $params ) {
		$key = self::get_api_key();
		if ( '' === $key ) {
			return new WP_Error( 'aisa_no_ahrefs_key', __( 'No Ahrefs API key configured. Add one on the AISA Connector settings page to enable SEO intelligence.', 'ai-site-assistant' ) );
		}

		// Drop empty/null params, then let add_query_arg() URL-encode once
		// (pre-encoding here would double-encode commas/colons in select/order_by).
		$params = array_filter( $params, static fn( $v ) => '' !== $v && null !== $v );
		$url    = add_query_arg( $params, self::API_BASE . $endpoint );

		$response = wp_remote_get(
			$url,
			array(
				'timeout' => 30,
				'headers' => array(
					'Accept'        => 'application/json',
					'Authorization' => 'Bearer ' . $key,
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $code < 200 || $code >= 300 ) {
			// Ahrefs returns { "error": "..." } on failure; surface it verbatim.
			$message = $decoded['error'] ?? sprintf(
				/* translators: %d: HTTP status code. */
				__( 'Ahrefs API error (HTTP %d).', 'ai-site-assistant' ),
				$code
			);
			if ( 401 === $code || 403 === $code ) {
				$message .= ' ' . __( 'Check that the Ahrefs API key is valid and your plan includes API access.', 'ai-site-assistant' );
			}
			return new WP_Error( 'aisa_ahrefs_error', $message, array( 'status' => $code ) );
		}

		return is_array( $decoded ) ? $decoded : array();
	}

	/**
	 * Today's date in the YYYY-MM-DD form Ahrefs expects; the API returns the
	 * latest available snapshot at or before this date.
	 *
	 * @return string
	 */
	public static function today() {
		return gmdate( 'Y-m-d' );
	}
}
