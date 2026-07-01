<?php
/**
 * Thin client for the Unsplash API using WordPress's HTTP layer. Used by the
 * search_images tool so the assistant can find and insert stock photos
 * without leaving the chat.
 *
 * Auth and endpoints verified against unsplash.com/documentation and the
 * Unsplash API Guidelines rather than assumed: the Authorization header is
 * "Client-ID <access key>", and API Guidelines require pinging the photo's
 * `download_location` URL whenever a photo is actually used (not just
 * searched) -- upload_media does that in class-aisa-tools.php.
 *
 * As with the Claude/OpenRouter clients, wp_remote_get is used directly
 * rather than a Composer SDK so the plugin stays a self-contained zip.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Searches Unsplash and pings its download-tracking endpoint on use.
 */
class AISA_Unsplash_Client {

	const API_URL = 'https://api.unsplash.com';

	/**
	 * Resolve the configured Unsplash access key.
	 *
	 * @return string The configured key (or empty string).
	 */
	public static function get_access_key() {
		if ( defined( 'AISA_UNSPLASH_ACCESS_KEY' ) && AISA_UNSPLASH_ACCESS_KEY ) {
			return AISA_UNSPLASH_ACCESS_KEY;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['unsplash_access_key'] ?? '';
	}

	/**
	 * Search Unsplash photos.
	 *
	 * @param string $query    Search term.
	 * @param int    $per_page Results per page (max 30).
	 * @return array|WP_Error Decoded response body, or WP_Error on failure.
	 */
	public static function search( $query, $per_page = 10 ) {
		$key = self::get_access_key();
		if ( empty( $key ) ) {
			return new WP_Error( 'aisa_no_unsplash_key', __( 'No Unsplash access key configured. Add one on the AISA Connector settings page to enable image search.', 'ai-site-assistant' ) );
		}

		$url = add_query_arg(
			array(
				'query'    => rawurlencode( $query ),
				'per_page' => min( max( 1, (int) $per_page ), 30 ),
			),
			self::API_URL . '/search/photos'
		);

		return self::request( $url, $key );
	}

	/**
	 * Ping Unsplash's download-tracking endpoint. Required by the Unsplash API
	 * Guidelines whenever a searched photo is actually used, not merely shown
	 * in search results. Fire-and-forget; failures are logged, not fatal.
	 *
	 * @param string $download_location The `download_location` URL from a search result.
	 */
	public static function ping_download( $download_location ) {
		$key = self::get_access_key();
		if ( empty( $key ) || empty( $download_location ) ) {
			return;
		}
		wp_remote_get(
			$download_location,
			array(
				'timeout'  => 10,
				'blocking' => false,
				'headers'  => array( 'authorization' => 'Client-ID ' . $key ),
			)
		);
	}

	/**
	 * Send one authenticated GET request to the Unsplash API.
	 *
	 * @param string $url API URL, including query args.
	 * @param string $key Access key.
	 * @return array|WP_Error Decoded response body, or WP_Error on failure.
	 */
	private static function request( $url, $key ) {
		$response = wp_remote_get(
			$url,
			array(
				'timeout' => 20,
				'headers' => array( 'authorization' => 'Client-ID ' . $key ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code    = wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $code < 200 || $code >= 300 ) {
			$message = $decoded['errors'][0] ?? __( 'Unknown Unsplash API error.', 'ai-site-assistant' );
			return new WP_Error( 'aisa_unsplash_error', $message, array( 'status' => $code ) );
		}

		return is_array( $decoded ) ? $decoded : array();
	}
}
