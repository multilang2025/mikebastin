<?php
/**
 * Alternative chat orchestration client using Gemini's free tier instead of
 * Claude, for sites that would rather stay on Gemini's rate-limited-but-free
 * quota than pay per token. Opt-in via AISA_Settings::use_gemini_chat();
 * reuses the same Gemini API key already configured for image generation.
 *
 * Translates the same Claude-shaped conversation/tool format AISA_Agent
 * already builds into Gemini's function-calling format and back, so
 * AISA_Agent and AISA_Tools need no changes at all -- this client is the
 * only place that knows Gemini's request/response shape is different.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Sends chat/tool-use requests to the Gemini API, self-throttled to stay
 * under the free tier's rate limits.
 */
class AISA_Gemini_Chat_Client {

	const DEFAULT_MODEL = 'gemini-2.5-flash';

	/**
	 * Self-imposed caps, deliberately under Google's published free-tier
	 * limits for gemini-2.5-flash (10 RPM / 250 RPD at the time this was
	 * written) so this plugin never tips a project into the metered paid
	 * tier and always fails with a clear message instead of a raw 429.
	 * Counts are approximate under concurrent requests -- WP transients
	 * aren't atomic -- which is fine for a single-admin chat UI.
	 *
	 * @var int
	 */
	const RATE_LIMIT_PER_MINUTE = 8;
	const RATE_LIMIT_PER_DAY    = 200;

	/**
	 * Resolve the model to use. Overridable via a constant, same pattern as
	 * AISA_Gemini_Client's image model override.
	 *
	 * @return string Model id.
	 */
	private static function get_model() {
		if ( defined( 'AISA_GEMINI_CHAT_MODEL' ) && AISA_GEMINI_CHAT_MODEL ) {
			return AISA_GEMINI_CHAT_MODEL;
		}
		return self::DEFAULT_MODEL;
	}

	/**
	 * Send one generateContent request, shaped and parsed to match
	 * AISA_Claude_Client::create()'s exact input/output contract.
	 *
	 * @param array $messages Conversation array (role/content), Claude-shaped.
	 * @param array $tools    Tool definitions (Claude's input_schema shape).
	 * @param array $args     Optional overrides: system.
	 * @return array|WP_Error { content: array, stop_reason: string }, or WP_Error on failure.
	 */
	public static function create( array $messages, array $tools = array(), array $args = array() ) {
		$api_key = AISA_Gemini_Client::get_api_key();
		if ( '' === $api_key ) {
			return new WP_Error( 'aisa_no_gemini_key', __( 'No Gemini API key configured. Add one on the AISA Connector settings page.', 'ai-site-assistant' ) );
		}

		$limited = self::check_rate_limit();
		if ( is_wp_error( $limited ) ) {
			return $limited;
		}

		// AISA_Claude_Client::normalize_messages() fills any unanswered
		// tool_use with a synthetic "not run" tool_result and forces every
		// tool_use input to a JSON object -- reused here rather than
		// re-implementing the same edge cases a second time.
		$normalized = AISA_Claude_Client::normalize_messages( $messages );

		$body = array( 'contents' => self::to_gemini_contents( $normalized ) );

		if ( ! empty( $args['system'] ) ) {
			$body['systemInstruction'] = array(
				'parts' => array( array( 'text' => $args['system'] ) ),
			);
		}

		if ( ! empty( $tools ) ) {
			$body['tools'] = array(
				array( 'functionDeclarations' => self::to_function_declarations( $tools ) ),
			);
		}

		$response = wp_remote_post(
			AISA_Gemini_Client::API_BASE . self::get_model() . ':generateContent',
			array(
				'timeout' => 120,
				'headers' => array(
					'content-type'   => 'application/json',
					'x-goog-api-key' => $api_key,
				),
				'body'    => wp_json_encode( $body ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$code    = (int) wp_remote_retrieve_response_code( $response );
		$decoded = json_decode( wp_remote_retrieve_body( $response ), true );

		if ( 429 === $code ) {
			// Google's own limit, not just this plugin's self-imposed one --
			// e.g. another site or key sharing the same Cloud project.
			return new WP_Error( 'aisa_gemini_rate_limited', __( "Gemini's rate limit was hit. Wait a moment and try again.", 'ai-site-assistant' ) );
		}

		if ( $code < 200 || $code >= 300 ) {
			$message = $decoded['error']['message'] ?? __( 'Unknown Gemini API error.', 'ai-site-assistant' );
			return new WP_Error( 'aisa_gemini_api_error', $message, array( 'status' => $code ) );
		}

		return self::from_gemini_response( is_array( $decoded ) ? $decoded : array() );
	}

	/**
	 * Check and count against the self-imposed per-minute/per-day caps.
	 *
	 * @return true|WP_Error True (and now counted) if under both caps, or a
	 *                       WP_Error describing which one was hit.
	 */
	private static function check_rate_limit() {
		$minute_key   = 'aisa_gemini_rpm_' . floor( time() / 60 );
		$minute_count = (int) get_transient( $minute_key );
		if ( $minute_count >= self::RATE_LIMIT_PER_MINUTE ) {
			return new WP_Error( 'aisa_gemini_rate_limited', __( "Gemini's free-tier limit for this minute is used up. Try again shortly.", 'ai-site-assistant' ) );
		}

		$day_key   = 'aisa_gemini_rpd_' . self::today_pacific();
		$day_count = (int) get_transient( $day_key );
		if ( $day_count >= self::RATE_LIMIT_PER_DAY ) {
			return new WP_Error( 'aisa_gemini_rate_limited', __( "Gemini's free daily limit is used up. It resets at midnight Pacific time -- try again tomorrow, or switch back to Claude in Settings.", 'ai-site-assistant' ) );
		}

		set_transient( $minute_key, $minute_count + 1, 70 );
		set_transient( $day_key, $day_count + 1, DAY_IN_SECONDS + HOUR_IN_SECONDS );
		return true;
	}

	/**
	 * Today's date in the US Pacific timezone, matching Google's own
	 * free-tier reset schedule (midnight Pacific) rather than whatever
	 * timezone this WordPress site is configured with.
	 *
	 * @return string Y-m-d in America/Los_Angeles.
	 */
	private static function today_pacific() {
		try {
			$now = new DateTime( 'now', new DateTimeZone( 'America/Los_Angeles' ) );
		} catch ( Exception $e ) {
			$now = new DateTime( 'now' ); // Fallback: server time, if the timezone db is unavailable.
		}
		return $now->format( 'Y-m-d' );
	}

	/**
	 * Translate a Claude-shaped, already-normalized message array into
	 * Gemini's `contents` array.
	 *
	 * Gemini's functionResponse is keyed by tool NAME, not an id the way
	 * Claude's tool_result is -- build a lookup from every tool_use block's
	 * id to its name first so tool_result blocks can be translated correctly
	 * regardless of how far back their matching tool_use was.
	 *
	 * @param array $messages Normalized Claude-shaped messages.
	 * @return array Gemini `contents` array.
	 */
	private static function to_gemini_contents( array $messages ) {
		$id_to_name = array();
		foreach ( $messages as $message ) {
			foreach ( (array) ( $message['content'] ?? array() ) as $block ) {
				if ( is_array( $block ) && 'tool_use' === ( $block['type'] ?? '' ) && isset( $block['id'], $block['name'] ) ) {
					$id_to_name[ $block['id'] ] = $block['name'];
				}
			}
		}

		$contents = array();
		foreach ( $messages as $message ) {
			$role    = 'assistant' === ( $message['role'] ?? '' ) ? 'model' : 'user';
			$content = $message['content'] ?? '';

			if ( is_string( $content ) ) {
				$contents[] = array(
					'role'  => $role,
					'parts' => array( array( 'text' => $content ) ),
				);
				continue;
			}

			$parts = array();
			foreach ( (array) $content as $block ) {
				if ( ! is_array( $block ) ) {
					continue;
				}
				$type = $block['type'] ?? '';
				if ( 'text' === $type ) {
					$parts[] = array( 'text' => (string) ( $block['text'] ?? '' ) );
				} elseif ( 'tool_use' === $type ) {
					$parts[] = array(
						'functionCall' => array(
							'name' => $block['name'],
							'args' => $block['input'] ?? (object) array(),
						),
					);
				} elseif ( 'tool_result' === $type ) {
					$name       = $id_to_name[ $block['tool_use_id'] ?? '' ] ?? 'unknown_tool';
					$result_key = empty( $block['is_error'] ) ? 'content' : 'error';
					$parts[]    = array(
						'functionResponse' => array(
							'name'     => $name,
							'response' => array( $result_key => (string) ( $block['content'] ?? '' ) ),
						),
					);
				}
			}
			if ( ! empty( $parts ) ) {
				$contents[] = array(
					'role'  => $role,
					'parts' => $parts,
				);
			}
		}
		return $contents;
	}

	/**
	 * Translate Claude-shaped tool definitions (input_schema) into Gemini's
	 * functionDeclarations (parameters).
	 *
	 * @param array $tools Claude-shaped tool definitions.
	 * @return array Gemini functionDeclarations.
	 */
	private static function to_function_declarations( array $tools ) {
		$decls = array();
		foreach ( $tools as $tool ) {
			$decls[] = array(
				'name'        => $tool['name'],
				'description' => $tool['description'],
				'parameters'  => self::strip_unsupported_schema_keys( $tool['input_schema'] ),
			);
		}
		return $decls;
	}

	/**
	 * Gemini's function-calling schema is an OpenAPI 3.0 subset that
	 * doesn't support every JSON Schema keyword our tool definitions use for
	 * Claude -- additionalProperties is rejected outright. Strip it
	 * recursively rather than hand-maintaining a second copy of every tool
	 * definition. Preserves stdClass (used for an explicitly empty object
	 * schema) as stdClass so it still encodes as `{}`, not `[]`.
	 *
	 * @param mixed $schema A JSON-schema-shaped array/stdClass, or scalar.
	 * @return mixed Same shape, with additionalProperties removed throughout.
	 */
	private static function strip_unsupported_schema_keys( $schema ) {
		if ( $schema instanceof stdClass ) {
			return (object) self::strip_unsupported_schema_keys( (array) $schema );
		}
		if ( is_array( $schema ) ) {
			unset( $schema['additionalProperties'] );
			foreach ( $schema as $key => $value ) {
				$schema[ $key ] = self::strip_unsupported_schema_keys( $value );
			}
		}
		return $schema;
	}

	/**
	 * Translate a Gemini generateContent response into the same
	 * { content, stop_reason } shape AISA_Agent already expects from Claude.
	 *
	 * Gemini defaults to allowing several functionCall parts in one
	 * response (parallel function calling); AISA_Agent's write-approval
	 * gate assumes at most one tool_use per assistant turn, the same
	 * guarantee Claude's disable_parallel_tool_use provides. Only the
	 * first function call this turn is surfaced -- any further calls in
	 * the same response are dropped rather than risk several writes
	 * executing off a single approval.
	 *
	 * @param array $decoded Decoded Gemini response body.
	 * @return array { content: array, stop_reason: string }.
	 */
	private static function from_gemini_response( array $decoded ) {
		$parts     = $decoded['candidates'][0]['content']['parts'] ?? array();
		$content   = array();
		$seen_call = false;

		foreach ( (array) $parts as $part ) {
			if ( isset( $part['text'] ) && '' !== $part['text'] ) {
				$content[] = array(
					'type' => 'text',
					'text' => $part['text'],
				);
				continue;
			}
			if ( ! isset( $part['functionCall']['name'] ) ) {
				continue;
			}
			if ( $seen_call ) {
				continue;
			}
			$seen_call = true;
			$content[] = array(
				'type'  => 'tool_use',
				'id'    => uniqid( 'gcall_', true ),
				'name'  => $part['functionCall']['name'],
				'input' => (array) ( $part['functionCall']['args'] ?? array() ),
			);
		}

		return array(
			'content'     => $content,
			'stop_reason' => $seen_call ? 'tool_use' : 'end_turn',
		);
	}
}
