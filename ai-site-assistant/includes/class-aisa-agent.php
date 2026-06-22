<?php
/**
 * The agentic loop: send messages, execute tool calls, repeat until done.
 *
 * Destructive tools are gated — if the request hasn't pre-approved writes,
 * the loop stops and returns the pending action for the UI to confirm.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Runs the tool-use loop between Claude and the WordPress tool executor.
 */
class AISA_Agent {

	const MAX_ITERATIONS = 8;

	const SYSTEM_PROMPT = 'You are an assistant embedded in a WordPress admin. '
		. 'Use the provided tools to read and edit the site. Search for existing '
		. 'content before creating new content. Always read a post with get_post '
		. 'before updating it. Be concise. When you finish, summarize what you did.';

	/**
	 * Run the conversation to completion (or until a gate stops it).
	 *
	 * @param array $messages     Conversation so far (role/content blocks).
	 * @param bool  $allow_writes Whether the user pre-approved destructive tools.
	 * @return array { messages: array, reply: string, pending?: array }
	 */
	public static function run( array $messages, $allow_writes = false ) {
		$tools = AISA_Tools::definitions();

		// Resume case: the conversation ends with an assistant turn whose tool
		// calls were gated and never answered (the approval round-trip). Execute
		// them now and append the tool results before asking Claude to continue,
		// otherwise the API rejects the dangling tool_use.
		if ( self::ends_with_unanswered_tool_use( $messages ) ) {
			$last = end( $messages );
			$gate = self::handle_tool_calls( $last['content'], $allow_writes );
			if ( isset( $gate['pending'] ) ) {
				return array(
					'messages' => $messages,
					'reply'    => '',
					'pending'  => $gate['pending'],
				);
			}
			$messages[] = array(
				'role'    => 'user',
				'content' => $gate['results'],
			);
		}

		for ( $i = 0; $i < self::MAX_ITERATIONS; $i++ ) {
			$response = AISA_Claude_Client::create(
				$messages,
				$tools,
				array( 'system' => self::SYSTEM_PROMPT )
			);

			if ( is_wp_error( $response ) ) {
				return array(
					'messages' => $messages,
					'reply'    => '⚠️ ' . $response->get_error_message(),
				);
			}

			$messages[] = array(
				'role'    => 'assistant',
				'content' => $response['content'],
			);

			if ( 'tool_use' !== ( $response['stop_reason'] ?? '' ) ) {
				return array(
					'messages' => $messages,
					'reply'    => self::extract_text( $response['content'] ),
				);
			}

			$gate = self::handle_tool_calls( $response['content'], $allow_writes );
			if ( isset( $gate['pending'] ) ) {
				// Stop and hand the pending action back to the UI for approval.
				return array(
					'messages' => $messages,
					'reply'    => self::extract_text( $response['content'] ),
					'pending'  => $gate['pending'],
				);
			}

			$messages[] = array(
				'role'    => 'user',
				'content' => $gate['results'],
			);
		}

		return array(
			'messages' => $messages,
			'reply'    => __( 'Stopped after the maximum number of steps.', 'ai-site-assistant' ),
		);
	}

	/**
	 * Execute the tool_use blocks in an assistant content array.
	 *
	 * Returns a `results` array of tool_result blocks once every call has run,
	 * or a `pending` action the moment a destructive tool is hit while writes
	 * are not yet approved.
	 *
	 * The approval model is one destructive tool per turn: AISA_Claude_Client
	 * requests serial tool use (disable_parallel_tool_use), so a gated turn
	 * carries a single tool_use block and the resume executes only that one.
	 *
	 * @param array $content      Assistant content blocks.
	 * @param bool  $allow_writes Whether destructive tools may run.
	 * @return array { results: array } or { pending: array }.
	 */
	private static function handle_tool_calls( array $content, $allow_writes ) {
		$results = array();
		foreach ( $content as $block ) {
			if ( 'tool_use' !== ( $block['type'] ?? '' ) ) {
				continue;
			}

			$is_destructive = in_array( $block['name'], AISA_Tools::destructive_tools(), true );
			if ( $is_destructive && ! $allow_writes ) {
				return array(
					'pending' => array(
						'tool'  => $block['name'],
						'input' => $block['input'],
						'id'    => $block['id'],
					),
				);
			}

			$result    = AISA_Tools::dispatch( $block['name'], (array) $block['input'] );
			$results[] = array(
				'type'        => 'tool_result',
				'tool_use_id' => $block['id'],
				'content'     => is_array( $result['content'] ) ? wp_json_encode( $result['content'] ) : $result['content'],
				'is_error'    => ! empty( $result['is_error'] ),
			);
		}

		return array( 'results' => $results );
	}

	/**
	 * Whether the conversation ends with an assistant turn whose tool calls
	 * have not yet been answered with tool results.
	 *
	 * @param array $messages Conversation messages.
	 * @return bool True when the last message is an unanswered assistant tool_use.
	 */
	private static function ends_with_unanswered_tool_use( array $messages ) {
		$last = end( $messages );
		if ( ! is_array( $last ) || 'assistant' !== ( $last['role'] ?? '' ) || ! is_array( $last['content'] ?? null ) ) {
			return false;
		}
		foreach ( $last['content'] as $block ) {
			if ( 'tool_use' === ( $block['type'] ?? '' ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Pull the concatenated text blocks out of a response content array.
	 *
	 * @param array $content Response content blocks.
	 * @return string Concatenated text.
	 */
	private static function extract_text( array $content ) {
		$text = '';
		foreach ( $content as $block ) {
			if ( 'text' === ( $block['type'] ?? '' ) ) {
				$text .= $block['text'];
			}
		}
		return trim( $text );
	}
}
