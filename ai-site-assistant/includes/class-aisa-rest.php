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

		if ( empty( $messages ) ) {
			return new WP_Error( 'aisa_empty', __( 'No messages provided.', 'ai-site-assistant' ), array( 'status' => 400 ) );
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
}
