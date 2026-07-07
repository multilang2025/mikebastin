<?php
/**
 * Thin client for Google's Gemini image-generation API ("Nano Banana Pro" /
 * Gemini 3 Pro Image) using WordPress's HTTP layer. Powers the generate_image
 * tool so the assistant can create original artwork from a natural-language
 * description instead of only searching stock photos.
 *
 * Verified against ai.google.dev and multiple independent curl examples
 * rather than assumed: POST to
 * https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
 * with an "x-goog-api-key" header, a `contents[].parts[].text` body, and
 * `generationConfig.responseModalities: ["IMAGE"]`. The generated image comes
 * back inline as base64 (`candidates[].content.parts[].inlineData`), never as
 * a downloadable URL -- callers must not assume a URL is available.
 *
 * Fine-grained sizing/aspect-ratio request fields are NOT sent here: public
 * documentation for this "preview" model gives inconsistent field names
 * across sources (imageConfig vs responseFormat.image) that could not be
 * cross-verified. Aspect ratio is instead folded into the natural-language
 * prompt text by the caller, which every source agrees the model honors.
 *
 * As with the other clients, wp_remote_post is used directly rather than a
 * Composer SDK so the plugin stays a self-contained zip.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Generates images via the Gemini API (Nano Banana Pro).
 */
class AISA_Gemini_Client {

	const API_BASE      = 'https://generativelanguage.googleapis.com/v1beta/models/';
	const DEFAULT_MODEL = 'gemini-3-pro-image-preview';

	/**
	 * Resolve the configured Gemini API key.
	 *
	 * Prefer a constant in wp-config.php so the key never lives in the DB;
	 * fall back to the value saved on the settings page.
	 *
	 * @return string The configured key (or empty string).
	 */
	public static function get_api_key() {
		if ( defined( 'AISA_GEMINI_API_KEY' ) && AISA_GEMINI_API_KEY ) {
			return AISA_GEMINI_API_KEY;
		}
		$opts = get_option( AISA_Settings::OPTION_KEY, array() );
		return $opts['gemini_api_key'] ?? '';
	}

	/**
	 * Whether a Gemini key is configured.
	 *
	 * @return bool
	 */
	public static function is_configured() {
		return '' !== self::get_api_key();
	}

	/**
	 * Resolve the model to use. Overridable via a constant so a site can move
	 * to a newer/stable model id without a plugin update.
	 *
	 * @return string Model id.
	 */
	public static function get_model() {
		if ( defined( 'AISA_GEMINI_IMAGE_MODEL' ) && AISA_GEMINI_IMAGE_MODEL ) {
			return AISA_GEMINI_IMAGE_MODEL;
		}
		return self::DEFAULT_MODEL;
	}

	/**
	 * Generate one image from a fully-formed prompt (the caller is
	 * responsible for any style/negative-prompt suffixing).
	 *
	 * @param string $prompt Full prompt text.
	 * @return array|WP_Error { data: base64 string, mime_type: string }, or WP_Error on failure.
	 */
	public static function generate_image( $prompt ) {
		$key = self::get_api_key();
		if ( '' === $key ) {
			return new WP_Error( 'aisa_no_gemini_key', __( 'No Gemini API key configured. Add one on the AISA Connector settings page to enable image generation.', 'ai-site-assistant' ) );
		}

		$body = array(
			'contents'         => array(
				array( 'parts' => array( array( 'text' => $prompt ) ) ),
			),
			'generationConfig' => array(
				'responseModalities' => array( 'IMAGE' ),
			),
		);

		$response = wp_remote_post(
			self::API_BASE . self::get_model() . ':generateContent',
			array(
				// Image generation can take longer than a typical API call; kept
				// under common host/gateway timeouts (~60s) so a failure surfaces
				// as a clean error rather than a hard 504.
				'timeout' => 55,
				'headers' => array(
					'content-type'   => 'application/json',
					'x-goog-api-key' => $key,
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
			$message = $decoded['error']['message'] ?? sprintf(
				/* translators: %d: HTTP status code. */
				__( 'Gemini API error (HTTP %d).', 'ai-site-assistant' ),
				$code
			);
			return new WP_Error( 'aisa_gemini_error', $message, array( 'status' => $code ) );
		}

		foreach ( (array) ( $decoded['candidates'][0]['content']['parts'] ?? array() ) as $part ) {
			if ( ! empty( $part['inlineData']['data'] ) ) {
				return array(
					'data'      => $part['inlineData']['data'],
					'mime_type' => $part['inlineData']['mimeType'] ?? 'image/png',
				);
			}
		}

		return new WP_Error(
			'aisa_gemini_no_image',
			__( 'Gemini did not return an image. It may have been blocked by a safety filter -- try rephrasing the description.', 'ai-site-assistant' )
		);
	}
}
