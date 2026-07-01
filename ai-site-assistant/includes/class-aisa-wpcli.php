<?php
/**
 * WP-CLI-equivalent site administration, without a shell binary.
 *
 * Mirrors what WordPress admins reach for WP-CLI for (plugins, themes,
 * options, users, cache, rewrite rules) but dispatches straight into native
 * WP core functions in-process. No exec()/shell_exec() anywhere, so this
 * works on locked-down shared hosting exactly like the rest of the plugin.
 *
 * Split into a read side (wp_cli_get, always allowed) and a write side
 * (wp_cli_set, gated by the same write-approval flow as every other
 * destructive tool) so the coarse, tool-name-based gate in AISA_Agent stays
 * simple and correct -- no per-input gating logic to get wrong.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Native-PHP WP-CLI-equivalent command dispatcher.
 */
class AISA_WPCLI {

	/**
	 * Options writable via wp_cli_set. Kept tight -- this deliberately excludes
	 * anything that could change who can log in or what code runs (active_plugins,
	 * template/stylesheet, siteurl/home, users_can_register, default_role, ...).
	 *
	 * @var string[]
	 */
	const OPTION_ALLOWLIST = array(
		'blogname',
		'blogdescription',
		'blog_public',
		'date_format',
		'time_format',
		'start_of_week',
		'timezone_string',
		'default_category',
		'posts_per_page',
		'permalink_structure',
	);

	/**
	 * "command action" pairs that require the write-approval gate.
	 *
	 * @var string[]
	 */
	const DESTRUCTIVE = array(
		'plugin activate',
		'plugin deactivate',
		'theme activate',
		'option update',
	);

	/**
	 * Read-only site administration lookups.
	 *
	 * @param array $in Tool input: { command, action, args? }.
	 * @return array Tool result.
	 */
	public static function get( array $in ) {
		$command = sanitize_key( (string) ( $in['command'] ?? '' ) );
		$action  = sanitize_key( (string) ( $in['action'] ?? '' ) );
		$args    = array_map( 'sanitize_text_field', (array) ( $in['args'] ?? array() ) );

		switch ( "{$command} {$action}" ) {
			case 'plugin list':
				if ( ! current_user_can( 'activate_plugins' ) ) {
					return self::error( 'Permission denied.' );
				}
				if ( ! function_exists( 'get_plugins' ) ) {
					require_once ABSPATH . 'wp-admin/includes/plugin.php';
				}
				$active = (array) get_option( 'active_plugins', array() );
				$rows   = array();
				foreach ( get_plugins() as $file => $data ) {
					$rows[] = array(
						'file'    => $file,
						'name'    => $data['Name'],
						'version' => $data['Version'],
						'active'  => in_array( $file, $active, true ),
					);
				}
				return self::ok( $rows );

			case 'theme list':
				if ( ! current_user_can( 'switch_themes' ) ) {
					return self::error( 'Permission denied.' );
				}
				$current = get_stylesheet();
				$rows    = array();
				foreach ( wp_get_themes() as $stylesheet => $theme ) {
					$rows[] = array(
						'stylesheet' => $stylesheet,
						'name'       => $theme->get( 'Name' ),
						'version'    => $theme->get( 'Version' ),
						'active'     => $current === $stylesheet,
					);
				}
				return self::ok( $rows );

			case 'option get':
				if ( ! current_user_can( 'manage_options' ) ) {
					return self::error( 'Permission denied.' );
				}
				$name = sanitize_key( $args[0] ?? '' );
				if ( ! in_array( $name, self::OPTION_ALLOWLIST, true ) ) {
					return self::error( 'Option "' . $name . '" is not on the allowlist. Available: ' . implode( ', ', self::OPTION_ALLOWLIST ) . '.' );
				}
				return self::ok(
					array(
						'name'  => $name,
						'value' => get_option( $name ),
					)
				);

			case 'user list':
				if ( ! current_user_can( 'list_users' ) ) {
					return self::error( 'Permission denied.' );
				}
				$rows = array();
				foreach ( get_users( array( 'number' => 50 ) ) as $user ) {
					$rows[] = array(
						'id'    => $user->ID,
						'login' => $user->user_login,
						'email' => $user->user_email,
						'roles' => $user->roles,
					);
				}
				return self::ok( $rows );

			case 'core version':
				return self::ok(
					array(
						'wordpress' => get_bloginfo( 'version' ),
						'php'       => PHP_VERSION,
					)
				);

			default:
				return self::error( 'Unknown or read-only-unsupported "' . $command . ' ' . $action . '". ' . self::usage() );
		}
	}

	/**
	 * Site administration writes. Gated by AISA_Agent's write-approval flow
	 * because "wp_cli_set" is in AISA_Tools::destructive_tools().
	 *
	 * @param array $in Tool input: { command, action, target, value? }.
	 * @return array Tool result.
	 */
	public static function set( array $in ) {
		$command = sanitize_key( (string) ( $in['command'] ?? '' ) );
		$action  = sanitize_key( (string) ( $in['action'] ?? '' ) );
		$target  = sanitize_text_field( (string) ( $in['target'] ?? '' ) );

		switch ( "{$command} {$action}" ) {
			case 'plugin activate':
				if ( ! current_user_can( 'activate_plugins' ) ) {
					return self::error( 'Permission denied.' );
				}
				$result = activate_plugin( $target );
				if ( is_wp_error( $result ) ) {
					return self::error( $result->get_error_message() );
				}
				AISA_Audit_Log::record( 'wp_cli_plugin_activate', null, array( 'plugin' => $target ) );
				return self::ok(
					array(
						'plugin' => $target,
						'active' => true,
					)
				);

			case 'plugin deactivate':
				if ( ! current_user_can( 'activate_plugins' ) ) {
					return self::error( 'Permission denied.' );
				}
				deactivate_plugins( $target );
				AISA_Audit_Log::record( 'wp_cli_plugin_deactivate', null, array( 'plugin' => $target ) );
				return self::ok(
					array(
						'plugin' => $target,
						'active' => false,
					)
				);

			case 'theme activate':
				if ( ! current_user_can( 'switch_themes' ) ) {
					return self::error( 'Permission denied.' );
				}
				$theme = wp_get_theme( $target );
				if ( ! $theme->exists() ) {
					return self::error( 'Theme "' . $target . '" was not found.' );
				}
				switch_theme( $target );
				AISA_Audit_Log::record( 'wp_cli_theme_activate', null, array( 'theme' => $target ) );
				return self::ok(
					array(
						'theme'  => $target,
						'active' => true,
					)
				);

			case 'option update':
				if ( ! current_user_can( 'manage_options' ) ) {
					return self::error( 'Permission denied.' );
				}
				$name = sanitize_key( $target );
				if ( ! in_array( $name, self::OPTION_ALLOWLIST, true ) ) {
					return self::error( 'Option "' . $name . '" is not on the allowlist. Available: ' . implode( ', ', self::OPTION_ALLOWLIST ) . '.' );
				}
				$value = sanitize_text_field( (string) ( $in['value'] ?? '' ) );
				update_option( $name, $value );
				AISA_Audit_Log::record( 'wp_cli_option_update', null, array( 'name' => $name ) );
				return self::ok(
					array(
						'name'  => $name,
						'value' => $value,
					)
				);

			default:
				return self::error( 'Unknown or unsupported "' . $command . ' ' . $action . '". ' . self::usage() );
		}
	}

	/**
	 * Short usage hint echoed back on an unknown command/action pair.
	 *
	 * @return string
	 */
	private static function usage() {
		return 'Supported: plugin list/activate/deactivate, theme list/activate, '
			. 'option get/update (allowlisted keys only), user list, core version.';
	}

	/**
	 * Build a standard success tool result.
	 *
	 * @param mixed $data Result payload.
	 * @return array
	 */
	private static function ok( $data ) {
		return array( 'content' => wp_json_encode( $data ) );
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
