<?php
/**
 * Bridge to WordPress core's Abilities API (WP 6.9+), so the assistant can
 * discover and run machine-callable capabilities that OTHER plugins register
 * (SEO plugins, form plugins, etc.) without a bespoke integration per plugin.
 *
 * Verified against the Abilities API source (WordPress/abilities-api on
 * GitHub, includes/abilities-api/class-wp-ability.php and
 * includes/abilities-api.php) rather than assumed, since this is a newer
 * core API: wp_has_ability(), wp_get_ability(), wp_get_abilities(), and the
 * WP_Ability::get_name()/get_label()/get_description()/get_category()/
 * get_input_schema()/get_output_schema()/check_permissions()/execute()
 * methods used below all come straight from that source.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Discovers and executes WordPress core Abilities API entries.
 */
class AISA_Abilities {

	/**
	 * Whether the Abilities API is present on this site (core 6.9+, or the
	 * standalone plugin/Composer package on older WordPress).
	 *
	 * @return bool
	 */
	public static function available() {
		return function_exists( 'wp_get_abilities' ) && function_exists( 'wp_get_ability' );
	}

	/**
	 * List all registered abilities, or full detail for one when a name is given.
	 *
	 * @param array $in Tool input: { name?: string }.
	 * @return array Tool result.
	 */
	public static function discover( array $in ) {
		if ( ! self::available() ) {
			return self::error(
				'The WordPress Abilities API is not available on this site (requires WordPress 6.9+, '
				. 'or the standalone abilities-api plugin/Composer package on older versions).'
			);
		}

		$name = sanitize_text_field( (string) ( $in['name'] ?? '' ) );

		if ( '' !== $name ) {
			$ability = wp_get_ability( $name );
			if ( ! $ability ) {
				return self::error( 'No ability registered as "' . $name . '".' );
			}
			return array( 'content' => wp_json_encode( self::describe( $ability, true ) ) );
		}

		$rows = array();
		foreach ( wp_get_abilities() as $ability ) {
			$rows[] = self::describe( $ability, false );
		}
		return array( 'content' => wp_json_encode( $rows ) );
	}

	/**
	 * Run one ability by name. Always gated behind the write-approval flow --
	 * abilities are registered by arbitrary plugins and the API gives no
	 * reliable read/write flag to gate on, so treat every run as a write.
	 *
	 * @param array $in Tool input: { name: string, input?: object }.
	 * @return array Tool result.
	 */
	public static function run( array $in ) {
		if ( ! self::available() ) {
			return self::error( 'The WordPress Abilities API is not available on this site.' );
		}

		$name = sanitize_text_field( (string) ( $in['name'] ?? '' ) );
		if ( '' === $name ) {
			return self::error( 'Provide the ability "name" (from discover_abilities).' );
		}

		$ability = wp_get_ability( $name );
		if ( ! $ability ) {
			return self::error( 'No ability registered as "' . $name . '".' );
		}

		$input      = is_array( $in['input'] ?? null ) ? $in['input'] : array();
		$permission = $ability->check_permissions( $input );
		if ( is_wp_error( $permission ) ) {
			return self::error( $permission->get_error_message() );
		}
		if ( ! $permission ) {
			return self::error( 'Permission denied for ability "' . $name . '".' );
		}

		$result = $ability->execute( $input );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}

		AISA_Audit_Log::record( 'run_ability', null, array( 'ability' => $name ) );
		return array( 'content' => wp_json_encode( $result ) );
	}

	/**
	 * Shape one WP_Ability into a plain array for the model.
	 *
	 * @param WP_Ability $ability     The ability.
	 * @param bool       $with_schema Whether to include the full input/output schema.
	 * @return array
	 */
	private static function describe( $ability, $with_schema ) {
		$row = array(
			'name'        => $ability->get_name(),
			'label'       => $ability->get_label(),
			'description' => $ability->get_description(),
			'category'    => $ability->get_category(),
		);
		if ( $with_schema ) {
			$row['input_schema']  = $ability->get_input_schema();
			$row['output_schema'] = $ability->get_output_schema();
		}
		return $row;
	}

	/**
	 * Build a standard error tool result.
	 *
	 * @param string $message Error message.
	 * @return array
	 */
	private static function error( $message ) {
		return array(
			'content'  => $message,
			'is_error' => true,
		);
	}
}
