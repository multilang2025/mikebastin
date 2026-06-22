<?php
/**
 * REST endpoint for reading and writing SEO/schema post meta that WordPress
 * core REST does not expose (e.g. Rank Math's rank_math_schema_* entries).
 *
 * Access is restricted to a small set of SEO plugin meta-key prefixes so the
 * assistant can manage structured data and SEO meta without being able to touch
 * unrelated (and possibly sensitive) meta stored by other plugins.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Reads and writes allowlisted SEO/schema post meta via /aisa/v1/postmeta.
 */
class AISA_Meta {

	/**
	 * Meta-key prefixes the assistant may read and write.
	 *
	 * @var string[]
	 */
	const ALLOWED_PREFIXES = array( 'rank_math', '_yoast_wpseo', '_aioseo' );

	/**
	 * Register hooks.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	/**
	 * Register the /aisa/v1/postmeta routes.
	 */
	public static function routes() {
		register_rest_route(
			'aisa/v1',
			'/postmeta',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( __CLASS__, 'get_meta' ),
					'permission_callback' => array( __CLASS__, 'can_edit' ),
					'args'                => array( 'id' => array( 'required' => true ) ),
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( __CLASS__, 'set_meta' ),
					'permission_callback' => array( __CLASS__, 'can_edit' ),
				),
			)
		);
	}

	/**
	 * Permission check: the current user must be able to edit the target post.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return bool
	 */
	public static function can_edit( WP_REST_Request $request ) {
		$id = (int) $request->get_param( 'id' );
		return $id && current_user_can( 'edit_post', $id );
	}

	/**
	 * Whether a meta key is within an allowed prefix.
	 *
	 * @param string $key Meta key.
	 * @return bool
	 */
	private static function is_allowed( $key ) {
		foreach ( self::ALLOWED_PREFIXES as $prefix ) {
			if ( 0 === strpos( $key, $prefix ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Read allowlisted meta for a post, optionally filtered by prefix or keys.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public static function get_meta( WP_REST_Request $request ) {
		$id     = (int) $request->get_param( 'id' );
		$prefix = (string) $request->get_param( 'prefix' );
		$keys   = $request->get_param( 'keys' );
		if ( is_string( $keys ) ) {
			$keys = '' === $keys ? array() : array_map( 'trim', explode( ',', $keys ) );
		}
		$keys = (array) $keys;

		$all = get_post_meta( $id );
		$out = array();
		foreach ( $all as $key => $values ) {
			if ( ! self::is_allowed( $key ) ) {
				continue;
			}
			if ( '' !== $prefix && 0 !== strpos( $key, $prefix ) ) {
				continue;
			}
			if ( ! empty( $keys ) && ! in_array( $key, $keys, true ) ) {
				continue;
			}
			$out[ $key ] = maybe_unserialize( $values[0] );
		}

		return rest_ensure_response( $out );
	}

	/**
	 * Write one allowlisted meta key. The value may be a scalar or a nested
	 * structure (e.g. a schema object); string leaves are sanitized.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function set_meta( WP_REST_Request $request ) {
		$id  = (int) $request->get_param( 'id' );
		$key = (string) $request->get_param( 'key' );
		if ( ! self::is_allowed( $key ) ) {
			return new WP_Error(
				'aisa_meta_forbidden',
				__( 'That meta key is not in the allowed SEO/schema prefixes.', 'ai-site-assistant' ),
				array( 'status' => 400 )
			);
		}

		$value = self::sanitize_value( $request->get_param( 'value' ) );
		update_post_meta( $id, $key, $value );
		AISA_Audit_Log::record( 'set_meta', $id, array( 'key' => $key ) );

		return rest_ensure_response(
			array(
				'id'    => $id,
				'key'   => $key,
				'saved' => true,
			)
		);
	}

	/**
	 * Recursively sanitize a meta value, sanitizing string leaves and keeping
	 * scalars and array structure intact.
	 *
	 * @param mixed $value Raw value.
	 * @return mixed Sanitized value.
	 */
	private static function sanitize_value( $value ) {
		if ( is_array( $value ) ) {
			$out = array();
			foreach ( $value as $k => $v ) {
				$out[ sanitize_text_field( (string) $k ) ] = self::sanitize_value( $v );
			}
			return $out;
		}
		if ( is_bool( $value ) || is_int( $value ) || is_float( $value ) ) {
			return $value;
		}
		return sanitize_text_field( (string) $value );
	}
}
