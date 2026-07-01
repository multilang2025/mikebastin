<?php
/**
 * Thin client for OpenRouter's chat/completions API using WordPress's HTTP
 * layer. Used by the fact_check tool to reach Perplexity's web-grounded Sonar
 * model, which returns an answer plus the sources it cited.
 *
 * OpenRouter is OpenAI-compatible, so the request/response shape mirrors
 * POST /v1/chat/completions. As with the Claude client we use wp_remote_post
 * rather than a Composer SDK so the plugin stays a self-contained zip.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sends chat/completions requests to OpenRouter (used for Sonar fact-checks).
 */
class AISA_OpenRouter_Client {

	const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

	/** Default model — Perplexity's web-grounded Sonar. */
	const DEFAULT_MODEL = 'perplexity/sonar';

	/**
	 * Resolve the configured OpenRouter API key.
	 *
	 * Prefer a constant in wp-config.php so the key never lives in the DB;
	 * fall back to the value saved on the settings page.
	 *
	 * @return string The configured key (or empty string).
	 */
	public static function get_api_key() {
		if ( defined( 'AISA_OPENROUTER_API_KEY' ) && AISA_OPENROUTER_API_KEY ) {
			return AISA_OPENROUTER_API_KEY;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['openrouter_api_key'] ?? '';
	}

	/**
	 * Resolve the model to use for fact-checks. Overridable via a constant so a
	 * site can opt into sonar-pro (or a reasoning variant) without a code change.
	 *
	 * @return string Model slug.
	 */
	public static function get_model() {
		if ( defined( 'AISA_SONAR_MODEL' ) && AISA_SONAR_MODEL ) {
			return AISA_SONAR_MODEL;
		}
		return self::DEFAULT_MODEL;
	}

	/**
	 * Send one chat/completions request.
	 *
	 * @param array $messages OpenAI-style messages (role/content strings).
	 * @param array $args     Optional overrides: model, max_tokens, temperature.
	 * @return array|WP_Error Decoded response body, or WP_Error on failure.
	 */
	public static function create( array $messages, array $args = array() ) {
		$api_key = self::get_api_key();
		if ( empty( $api_key ) ) {
			return new WP_Error( 'aisa_no_openrouter_key', __( 'No OpenRouter API key configured. Add one on the AISA Connector settings page to enable fact-checking.', 'ai-site-assistant' ) );
		}

		$body = array(
			'model'       => $args['model'] ?? self::get_model(),
			'max_tokens'  => $args['max_tokens'] ?? 1024,
			'temperature' => $args['temperature'] ?? 0.1,
			'messages'    => $messages,
		);

		$response = wp_remote_post(
			self::API_URL,
			array(
				'timeout' => 60,
				'headers' => array(
					'content-type'  => 'application/json',
					'authorization' => 'Bearer ' . $api_key,
					// OpenRouter uses these for attribution/rankings; harmless if unset.
					'http-referer'  => home_url(),
					'x-title'       => 'AISA Connector',
				),
				'body'    => wp_json_encode( $body ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code    = wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( $code < 200 || $code >= 300 ) {
			$message = $decoded['error']['message'] ?? __( 'Unknown OpenRouter API error.', 'ai-site-assistant' );
			return new WP_Error( 'aisa_openrouter_error', $message, array( 'status' => $code ) );
		}

		return is_array( $decoded ) ? $decoded : array();
	}
}
