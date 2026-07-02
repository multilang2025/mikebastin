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

	const MAX_ITERATIONS = 16;

	/**
	 * Build the system prompt. A method rather than a const because it splices
	 * in AISA_Skills::catalog_text() — class constants can't call methods.
	 *
	 * @return string The system prompt sent with every Claude request.
	 */
	private static function system_prompt() {
		return 'You are an SEO and content assistant embedded in a WordPress admin. '
			. 'Use the provided tools to read and edit the site. Search for existing content '
			. 'before creating new content. Always read a post with get_post before changing it. '
			. "Be concise; when you finish, summarize what you changed.\n\n"
			. 'IDENTIFY THE POST. Always tell the user exactly which post or page you are '
			. 'working on — its title and ID, plus the link when you have it — before you '
			. 'change it, and again in your closing summary. This matters most when you '
			. 'chose the post yourself or are resuming an earlier task: never say "a post '
			. "of your choice\" or \"this post\" without naming the specific post.\n\n"
			. 'PERFORMANCE — AVOID TIMEOUTS. Rewriting a whole post with update_post is slow and on '
			. 'some hosts the request times out ("The response is not a valid JSON response"). So '
			. "PREFER the targeted tools and make several small edits instead of one large one:\n"
			. '- Use replace_in_post to change a sentence, fix a phrase, or insert an internal link. '
			. "Copy an EXACT, unique snippet from get_post into `find`.\n"
			. "- Use append_to_post to add a block at the end (author/EEAT box, sources, FAQ).\n"
			. '- Use set_seo / set_meta for meta tags and schema — they never touch the body, so they '
			. "are always fast.\n"
			. "- Only fall back to update_post when you are genuinely rewriting most of the post.\n\n"
			. "SKILLS. Detailed playbooks for common tasks are NOT included here to keep this prompt \n"
			. "short — load one on demand with the load_skill tool right before you act on a matching \n"
			. "task. Available skills:\n"
			. AISA_Skills::catalog_text() . "\n\n"
			. 'Do not guess at a skill\'s approach from its one-line summary alone — call load_skill '
			. 'first, then follow its playbook.';
	}

	/**
	 * Run ONE step of the conversation and hand control back to the client.
	 *
	 * Each call performs at most a single Claude API request. When the model
	 * wants to keep going (it called a read tool, or the user just approved a
	 * write), the result carries `continue => true` and the browser immediately
	 * re-POSTs to run the next step. This keeps every HTTP request short — one
	 * Claude call — so a multi-step task never stacks several blocking calls into
	 * one request and trips the host/gateway timeout, which surfaces in the UI as
	 * "The response is not a valid JSON response".
	 *
	 * @param array $messages     Conversation so far (role/content blocks).
	 * @param bool  $allow_writes Whether the user pre-approved the pending write.
	 * @return array { messages: array, reply: string, pending?: array, continue?: bool }
	 */
	public static function run( array $messages, $allow_writes = false ) {
		$tools = AISA_Tools::definitions();

		// Resume case: the conversation ends with an assistant turn whose tool
		// calls were gated and never answered (the approval round-trip). Execute
		// them now, append the tool results, and return to the client to continue
		// — without making a Claude call in this same request.
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
			return array(
				'messages' => $messages,
				'reply'    => '',
				'continue' => true,
			);
		}

		// Runaway guard: cap how many model steps one user request may drive, so
		// a tool-calling loop cannot spin (and bill) without end.
		if ( self::steps_since_user_text( $messages ) >= self::MAX_ITERATIONS ) {
			return array(
				'messages' => $messages,
				'reply'    => __( 'Stopped after the maximum number of steps. Tell me to continue if there is more to do.', 'ai-site-assistant' ),
			);
		}

		$response = AISA_Claude_Client::create(
			$messages,
			$tools,
			array( 'system' => self::system_prompt() )
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

		// The model produced a final answer (no tool call) — we are done.
		if ( 'tool_use' !== ( $response['stop_reason'] ?? '' ) ) {
			return array(
				'messages' => $messages,
				'reply'    => self::extract_text( $response['content'] ),
			);
		}

		$gate = self::handle_tool_calls( $response['content'], $allow_writes );
		if ( isset( $gate['pending'] ) ) {
			// Stop and hand the pending write back to the UI for approval.
			return array(
				'messages' => $messages,
				'reply'    => self::extract_text( $response['content'] ),
				'pending'  => $gate['pending'],
			);
		}

		// A read (or otherwise allowed) tool ran; let the client drive the next step.
		$messages[] = array(
			'role'    => 'user',
			'content' => $gate['results'],
		);
		return array(
			'messages' => $messages,
			'reply'    => self::extract_text( $response['content'] ),
			'continue' => true,
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
				$pending = array(
					'tool'  => $block['name'],
					'input' => $block['input'],
					'id'    => $block['id'],
				);
				$preview = self::preview_for_pending( $block['name'], (array) $block['input'] );
				if ( null !== $preview ) {
					$pending['preview'] = $preview;
				}
				return array( 'pending' => $pending );
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
	 * Build a visual preview (a data: URI) for a gated call the UI can show
	 * in the Approve/Cancel dialog, when one is available.
	 *
	 * Currently only upload_media committing a generate_image result has a
	 * preview: the transient is read directly here, on the PHP-to-browser
	 * REST response, which never touches the Claude conversation -- this is
	 * why generate_image returns a small image_id instead of the raw image in
	 * the first place, and it is the only place the actual bytes are read
	 * back out before the user approves the write.
	 *
	 * @param string $tool_name Tool being gated.
	 * @param array  $input     Its input.
	 * @return string|null Data URI, or null if there is nothing to preview.
	 */
	private static function preview_for_pending( $tool_name, array $input ) {
		if ( 'upload_media' !== $tool_name || empty( $input['image_id'] ) ) {
			return null;
		}
		$image_id = sanitize_key( (string) $input['image_id'] );
		$cached   = get_transient( AISA_Tools::GENERATED_IMAGE_TRANSIENT_PREFIX . $image_id );
		if ( ! is_array( $cached ) || empty( $cached['data'] ) || empty( $cached['mime_type'] ) ) {
			return null;
		}
		return 'data:' . $cached['mime_type'] . ';base64,' . $cached['data'];
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
	 * Count assistant turns since the last plain-text user message — i.e. how
	 * many model steps the current task has taken. A plain-text user message
	 * (string content) marks a fresh human request; tool_result turns (array
	 * content) do not reset the count.
	 *
	 * @param array $messages Conversation messages.
	 * @return int Steps taken since the last human text input.
	 */
	private static function steps_since_user_text( array $messages ) {
		$steps = 0;
		for ( $i = count( $messages ) - 1; $i >= 0; $i-- ) {
			$message = $messages[ $i ];
			$role    = $message['role'] ?? '';
			if ( 'user' === $role && is_string( $message['content'] ?? null ) ) {
				break;
			}
			if ( 'assistant' === $role ) {
				++$steps;
			}
		}
		return $steps;
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
