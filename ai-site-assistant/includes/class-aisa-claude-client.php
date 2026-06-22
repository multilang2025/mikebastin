<?php
/**
 * Thin client for the Claude Messages API using WordPress's HTTP layer.
 *
 * We use wp_remote_post rather than the official Composer SDK so the plugin
 * ships as a self-contained zip with no vendor autoloader to collide with
 * other plugins. The request/response shape mirrors POST /v1/messages.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sends requests to the Claude Messages API.
 */
class AISA_Claude_Client {

	const API_URL     = 'https://api.anthropic.com/v1/messages';
	const API_VERSION = '2023-06-01';

	/** Default model — Anthropic's most capable Opus-tier model. */
	const DEFAULT_MODEL = 'claude-opus-4-8';

	/**
	 * Send one Messages API request.
	 *
	 * @param array $messages Conversation array (role/content).
	 * @param array $tools    Tool definitions (JSON schema).
	 * @param array $args     Optional overrides: system, model, max_tokens.
	 * @return array|WP_Error Decoded response body, or WP_Error on failure.
	 */
	public static function create( array $messages, array $tools = array(), array $args = array() ) {
		$api_key = AISA_Settings::get_api_key();
		if ( empty( $api_key ) ) {
			return new WP_Error( 'aisa_no_key', __( 'No Claude API key configured.', 'ai-site-assistant' ) );
		}

		$body = array(
			'model'      => $args['model'] ?? self::DEFAULT_MODEL,
			'max_tokens' => $args['max_tokens'] ?? 8192,
			'messages'   => self::normalize_messages( $messages ),
		);

		if ( ! empty( $args['system'] ) ) {
			// Stable system prompt cached as a prefix to cut cost on multi-turn loops.
			$body['system'] = array(
				array(
					'type'          => 'text',
					'text'          => $args['system'],
					'cache_control' => array( 'type' => 'ephemeral' ),
				),
			);
		}

		if ( ! empty( $tools ) ) {
			$body['tools'] = $tools;
			// One tool call per turn. The write-approval gate (AISA_Agent) returns a
			// single pending action and resumes with a blanket allow_writes flag, so a
			// turn with several destructive tool_use blocks would execute every one of
			// them off a single approval. Forcing serial tool use keeps each write its
			// own approval round-trip.
			$body['tool_choice'] = array(
				'type'                      => 'auto',
				'disable_parallel_tool_use' => true,
			);
		}

		// Adaptive thinking is the recommended mode on Opus 4.8; it has no
		// token budget to tune and the model decides depth per request.
		$body['thinking'] = array( 'type' => 'adaptive' );

		$response = wp_remote_post(
			self::API_URL,
			array(
				'timeout' => 120,
				'headers' => array(
					'content-type'      => 'application/json',
					'x-api-key'         => $api_key,
					'anthropic-version' => self::API_VERSION,
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
			$message = $decoded['error']['message'] ?? __( 'Unknown API error.', 'ai-site-assistant' );
			return new WP_Error( 'aisa_api_error', $message, array( 'status' => $code ) );
		}

		return $decoded;
	}

	/**
	 * Make a conversation safe to send to the Messages API:
	 *
	 *  - Force every tool_use `input` to encode as a JSON object. PHP decodes an
	 *    empty `{}` to an empty array, which would re-encode as `[]` and be
	 *    rejected with "tool_use.input: Input should be an object".
	 *  - Guarantee every tool_use block is answered by a tool_result in the next
	 *    message. If the approval flow was interrupted (the user typed a new
	 *    message instead of approving), inject a synthetic tool_result so the API
	 *    does not reject the unanswered tool_use.
	 *
	 * @param array $messages Conversation messages.
	 * @return array Sanitized messages.
	 */
	private static function normalize_messages( array $messages ) {
		$out   = array();
		$count = count( $messages );

		for ( $i = 0; $i < $count; $i++ ) {
			$message      = $messages[ $i ];
			$tool_use_ids = array();

			if ( isset( $message['content'] ) && is_array( $message['content'] ) ) {
				foreach ( $message['content'] as &$block ) {
					if ( is_array( $block ) && isset( $block['type'] ) && 'tool_use' === $block['type'] ) {
						$block['input'] = isset( $block['input'] ) ? (object) $block['input'] : (object) array();
						if ( isset( $block['id'] ) ) {
							$tool_use_ids[] = $block['id'];
						}
					}
				}
				unset( $block );
			}

			$out[] = $message;

			if ( empty( $tool_use_ids ) ) {
				continue;
			}

			// Collect the tool_result IDs already present in the next message.
			$answered = array();
			$next     = $messages[ $i + 1 ] ?? null;
			if ( is_array( $next ) && isset( $next['content'] ) && is_array( $next['content'] ) ) {
				foreach ( $next['content'] as $block ) {
					if ( is_array( $block ) && isset( $block['type'], $block['tool_use_id'] ) && 'tool_result' === $block['type'] ) {
						$answered[] = $block['tool_use_id'];
					}
				}
			}

			$missing = array_diff( $tool_use_ids, $answered );
			if ( empty( $missing ) ) {
				continue;
			}

			$results = array();
			foreach ( $missing as $id ) {
				$results[] = array(
					'type'        => 'tool_result',
					'tool_use_id' => $id,
					'content'     => 'This action was not run.',
					'is_error'    => true,
				);
			}
			$out[] = array(
				'role'    => 'user',
				'content' => $results,
			);
		}

		return $out;
	}
}
