<?php
/**
 * REST endpoint exposing a post's SEO meta (Rank Math or Yoast) under stable,
 * plugin-agnostic field names, so external clients (the MCP server) can read and
 * write meta tags that WordPress core REST does not expose.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Reads and writes SEO meta tags via /aisa/v1/meta.
 */
class AISA_SEO {

	/**
	 * Register hooks.
	 */
	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
	}

	/**
	 * Register the /aisa/v1/meta routes.
	 */
	public static function routes() {
		register_rest_route(
			'aisa/v1',
			'/meta',
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
	 * Detect the active SEO plugin.
	 *
	 * @return string 'rankmath' or 'yoast'.
	 */
	private static function engine() {
		if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
			return 'rankmath';
		}
		if ( defined( 'WPSEO_VERSION' ) ) {
			return 'yoast';
		}
		return 'rankmath';
	}

	/**
	 * Map stable field names to the active SEO plugin's meta keys.
	 *
	 * @return array<string,string> friendly name => meta key.
	 */
	private static function field_map() {
		if ( 'yoast' === self::engine() ) {
			return array(
				'meta_title'          => '_yoast_wpseo_title',
				'meta_description'    => '_yoast_wpseo_metadesc',
				'focus_keyword'       => '_yoast_wpseo_focuskw',
				'canonical'           => '_yoast_wpseo_canonical',
				'og_title'            => '_yoast_wpseo_opengraph-title',
				'og_description'      => '_yoast_wpseo_opengraph-description',
				'twitter_title'       => '_yoast_wpseo_twitter-title',
				'twitter_description' => '_yoast_wpseo_twitter-description',
			);
		}
		return array(
			'meta_title'          => 'rank_math_title',
			'meta_description'    => 'rank_math_description',
			'focus_keyword'       => 'rank_math_focus_keyword',
			'canonical'           => 'rank_math_canonical_url',
			'og_title'            => 'rank_math_facebook_title',
			'og_description'      => 'rank_math_facebook_description',
			'twitter_title'       => 'rank_math_twitter_title',
			'twitter_description' => 'rank_math_twitter_description',
		);
	}

	/**
	 * Read SEO fields and the excerpt for a post (reusable by REST and tools).
	 *
	 * @param int $id Post ID.
	 * @return array engine + friendly field values + excerpt.
	 */
	public static function read_fields( $id ) {
		$out = array( 'engine' => self::engine() );
		foreach ( self::field_map() as $friendly => $key ) {
			$out[ $friendly ] = (string) get_post_meta( (int) $id, $key, true );
		}
		$out['excerpt'] = get_post_field( 'post_excerpt', (int) $id );
		return $out;
	}

	/**
	 * Write SEO fields for a post. Unknown fields are rejected, not written.
	 *
	 * @param int   $id   Post ID.
	 * @param array $meta Friendly field => value.
	 * @return array engine + applied + rejected field lists.
	 */
	public static function write_fields( $id, array $meta ) {
		$map      = self::field_map();
		$applied  = array();
		$rejected = array();
		foreach ( $meta as $friendly => $value ) {
			if ( ! isset( $map[ $friendly ] ) ) {
				$rejected[] = $friendly;
				continue;
			}
			$clean = ( 'canonical' === $friendly )
				? esc_url_raw( (string) $value )
				: sanitize_text_field( (string) $value );
			update_post_meta( (int) $id, $map[ $friendly ], $clean );
			$applied[] = $friendly;
		}

		if ( ! empty( $applied ) ) {
			AISA_Audit_Log::record( 'set_seo', (int) $id, array( 'fields' => $applied ) );
		}

		return array(
			'engine'   => self::engine(),
			'applied'  => $applied,
			'rejected' => $rejected,
		);
	}

	/**
	 * REST: read SEO fields and excerpt for a post.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public static function get_meta( WP_REST_Request $request ) {
		return rest_ensure_response( self::read_fields( (int) $request->get_param( 'id' ) ) );
	}

	/**
	 * REST: update SEO fields for a post.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response
	 */
	public static function set_meta( WP_REST_Request $request ) {
		$result = self::write_fields(
			(int) $request->get_param( 'id' ),
			(array) $request->get_param( 'meta' )
		);
		return rest_ensure_response( $result );
	}
}
