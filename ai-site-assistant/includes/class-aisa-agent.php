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

			$results = array();
			foreach ( $response['content'] as $block ) {
				if ( 'tool_use' !== ( $block['type'] ?? '' ) ) {
					continue;
				}

				$is_destructive = in_array( $block['name'], AISA_Tools::destructive_tools(), true );
				if ( $is_destructive && ! $allow_writes ) {
					// Gate: stop and hand the pending action back to the UI.
					return array(
						'messages' => $messages,
						'reply'    => self::extract_text( $response['content'] ),
						'pending'  => array(
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

			$messages[] = array(
				'role'    => 'user',
				'content' => $results,
			);
		}

		return array(
			'messages' => $messages,
			'reply'    => __( 'Stopped after the maximum number of steps.', 'ai-site-assistant' ),
		);
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
