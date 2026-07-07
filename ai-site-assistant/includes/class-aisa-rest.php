<?php
/**
 * REST endpoint that the admin chat UI calls. Keeps the API key server-side —
 * the browser never sees it.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers and handles the plugin's REST route.
 */
class AISA_REST {

	/**
	 * Hook the route registration.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	/**
	 * Register the chat REST route.
	 */
	public static function routes() {
		register_rest_route(
			'aisa/v1',
			'/chat',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'chat' ),
				'permission_callback' => array( __CLASS__, 'can_use' ),
				'args'                => array(
					'messages'     => array( 'required' => true ),
					'allow_writes' => array(
						'required' => false,
						'default'  => false,
					),
					'attachment'   => array(
						'required' => false,
						'default'  => null,
					),
				),
			)
		);

		register_rest_route(
			'aisa/v1',
			'/tool',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'dispatch_tool' ),
				'permission_callback' => array( __CLASS__, 'can_use' ),
				'args'                => array(
					'tool'  => array(
						'required' => true,
						'type'     => 'string',
					),
					'input' => array(
						'required' => true,
					),
				),
			)
		);
	}

	/** Only logged-in users who can edit content may use the assistant. */
	public static function can_use() {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Handle one turn. `messages` is the running conversation from the client;
	 * the API is stateless so the full history is sent each time.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error Response payload or error.
	 */
	public static function chat( WP_REST_Request $request ) {
		// A long edit can run past the default PHP time limit; a killed request
		// returns non-JSON and the UI shows "not a valid JSON response". Extend
		// it best-effort (skipped silently when the host disables the function).
		$disabled = (string) ini_get( 'disable_functions' );
		if ( function_exists( 'set_time_limit' ) && false === strpos( $disabled, 'set_time_limit' ) ) {
			set_time_limit( 300 );
		}

		$messages     = (array) $request->get_param( 'messages' );
		$allow_writes = (bool) $request->get_param( 'allow_writes' );
		$attachment   = $request->get_param( 'attachment' );

		if ( empty( $messages ) ) {
			return new WP_Error( 'aisa_empty', __( 'No messages provided.', 'ai-site-assistant' ), array( 'status' => 400 ) );
		}

		// A CSV/Excel attachment is parsed here, once, and folded into the
		// fresh user turn's own text -- AISA_Agent and the tool-use loop are
		// completely unaware of it; this doesn't touch that pipeline at all.
		if ( ! empty( $attachment ) && is_array( $attachment ) ) {
			$context = AISA_File_Parser::parse( $attachment );
			if ( is_wp_error( $context ) ) {
				return rest_ensure_response(
					array(
						'reply'    => '⚠️ ' . $context->get_error_message(),
						'messages' => $messages,
						'pending'  => null,
						'continue' => false,
					)
				);
			}
			$last = count( $messages ) - 1;
			if ( $last >= 0 && 'user' === ( $messages[ $last ]['role'] ?? '' ) && is_string( $messages[ $last ]['content'] ?? null ) ) {
				$messages[ $last ]['content'] .= "\n\n" . $context;
			}
		}

		$result = AISA_Agent::run( $messages, $allow_writes );

		return rest_ensure_response(
			array(
				'reply'    => $result['reply'],
				'messages' => $result['messages'],
				'pending'  => $result['pending'] ?? null,
				'continue' => ! empty( $result['continue'] ),
			)
		);
	}

	/**
	 * Dispatch a single tool call from an external MCP client.
	 *
	 * This is the bridge between the MCP server (Prong 2) and the plugin's
	 * existing tool executor. The MCP server authenticates with a WordPress
	 * Application Password and calls this endpoint instead of reimplementing
	 * tool logic — one codebase, one security boundary.
	 *
	 * Only an explicit allowlist of tools is reachable; the rest (like
	 * get_site_context, which embeds the system prompt) stay internal.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error Tool result or error.
	 */
	public static function dispatch_tool( WP_REST_Request $request ) {
		$tool  = sanitize_key( $request->get_param( 'tool' ) );
		$input = (array) $request->get_param( 'input' );

		$allowed = array(
			'generate_image',
			'upload_media',
			'search_images',
			'replace_in_post',
			'append_to_post',
			'fact_check',
			'get_page_html',
			'load_skill',
		);

		if ( ! in_array( $tool, $allowed, true ) ) {
			return new WP_Error(
				'aisa_tool_not_allowed',
				sprintf(
					/* translators: %s: tool name. */
					__( 'Tool "%s" is not available through this endpoint.', 'ai-site-assistant' ),
					$tool
				),
				array( 'status' => 403 )
			);
		}

		$result = AISA_Tools::dispatch( $tool, $input );

		return rest_ensure_response( $result );
	}
}
