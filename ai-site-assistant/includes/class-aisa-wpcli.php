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
		'search replace',
	);

	/**
	 * Tables "search replace" is allowed to touch, and which columns on each.
	 * Deliberately excludes wp_users/wp_usermeta (could rewrite passwords/
	 * capabilities) and any custom plugin table (unbounded blast radius) --
	 * this covers the actual "fix a URL/domain everywhere" use case without
	 * WP-CLI's full --all-tables reach.
	 *
	 * @var array<string, array{table: string, pk: string, columns: string[]}>
	 */
	private static function table_map() {
		global $wpdb;
		return array(
			'posts'    => array(
				'table'   => $wpdb->posts,
				'pk'      => 'ID',
				'columns' => array( 'post_content', 'post_title', 'post_excerpt' ),
			),
			'postmeta' => array(
				'table'   => $wpdb->postmeta,
				'pk'      => 'meta_id',
				'columns' => array( 'meta_value' ),
			),
			'options'  => array(
				'table'   => $wpdb->options,
				'pk'      => 'option_id',
				'columns' => array( 'option_value' ),
			),
		);
	}

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
				// Refuse a write that would silently flip the option's stored
				// type (e.g. an array/serialized value overwritten with a
				// plain string) -- every currently-allowlisted option is a
				// plain scalar, so this should never actually trigger today,
				// but it's cheap defensive parity for if the allowlist grows.
				$existing = get_option( $name );
				if ( is_array( $existing ) && ! empty( $existing ) ) {
					return self::error( 'Option "' . $name . '" currently holds a structured (array) value; wp_cli_set only writes plain text and would silently flip its type. Refusing the write.' );
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

			case 'search replace':
				if ( ! current_user_can( 'manage_options' ) ) {
					return self::error( 'Permission denied. Needs an administrator account.' );
				}
				return self::search_replace( $in );

			default:
				return self::error( 'Unknown or unsupported "' . $command . ' ' . $action . '". ' . self::usage() );
		}
	}

	/**
	 * WP-CLI-style bulk find/replace across wp_posts, wp_postmeta, and/or
	 * wp_options, without a shell binary -- so it can never be tripped up by
	 * a backtick or other shell-special character inside page-builder
	 * content the way a real `wp search-replace` invocation can be.
	 *
	 * Serialization-safe like WP-CLI's own implementation: a serialized PHP
	 * value is unserialized, replaced recursively, then re-serialized,
	 * rather than string-replacing the raw serialized blob (which would
	 * corrupt it by leaving stale length prefixes behind).
	 *
	 * @param array $in Tool input: { old, new, tables?, dry_run?, limit? }.
	 * @return array Tool result with a per-column row-change report.
	 */
	private static function search_replace( array $in ) {
		global $wpdb;

		$old = (string) ( $in['old'] ?? '' );
		$new = (string) ( $in['new'] ?? '' );
		if ( '' === $old ) {
			return self::error( 'An "old" string to search for is required.' );
		}
		if ( $old === $new ) {
			return self::error( '"old" and "new" are identical -- nothing to do.' );
		}

		$dry_run = ! array_key_exists( 'dry_run', $in ) || (bool) $in['dry_run'];

		$tables = array_values( array_intersect( (array) ( $in['tables'] ?? array( 'posts' ) ), array( 'posts', 'postmeta', 'options' ) ) );
		if ( empty( $tables ) ) {
			$tables = array( 'posts' );
		}
		$limit = min( max( 1, (int) ( $in['limit'] ?? 500 ) ), 2000 );

		$table_map     = self::table_map();
		$report        = array();
		$total_changed = 0;

		foreach ( $tables as $table_key ) {
			$spec = $table_map[ $table_key ];
			foreach ( $spec['columns'] as $column ) {
				// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
				$rows = $wpdb->get_results(
					$wpdb->prepare(
						"SELECT {$spec['pk']} AS pk, {$column} AS val FROM {$spec['table']} WHERE {$column} LIKE %s LIMIT %d", // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
						'%' . $wpdb->esc_like( $old ) . '%',
						$limit
					),
					ARRAY_A
				);

				$rows_changed = 0;
				foreach ( (array) $rows as $row ) {
					$updated = self::recursive_replace( $row['val'], $old, $new );
					if ( $updated === $row['val'] ) {
						continue; // A LIKE hit inside a serialized structure doesn't guarantee an actual string-leaf match.
					}
					++$rows_changed;
					if ( ! $dry_run ) {
						// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
						$wpdb->update( $spec['table'], array( $column => $updated ), array( $spec['pk'] => $row['pk'] ) );
					}
				}

				if ( $rows_changed > 0 ) {
					$report[]       = array(
						'table'  => $table_key,
						'column' => $column,
						'rows'   => $rows_changed,
						'capped' => count( (array) $rows ) >= $limit,
					);
					$total_changed += $rows_changed;
				}
			}
		}

		if ( ! $dry_run && $total_changed > 0 ) {
			AISA_Audit_Log::record( 'wp_cli_search_replace', null, array( 'old' => $old, 'rows_changed' => $total_changed ) );
			wp_cache_flush();
		}

		return self::ok(
			array(
				'dry_run'      => $dry_run,
				'rows_changed' => $total_changed,
				'by_column'    => $report,
				'note'         => $dry_run
					? 'Dry run -- no rows were written. Review the counts above, then re-run with dry_run=false to apply.'
					: 'Applied. If the site uses a page cache (WP Rocket, LiteSpeed, ...), call flush_caches next.',
			)
		);
	}

	/**
	 * Replace $old with $new inside $value, recursing into serialized PHP
	 * values, arrays, and object properties so a serialized widget/options
	 * blob comes back correctly re-serialized rather than corrupted.
	 *
	 * @param mixed  $value Raw column value, or a value already unserialized one level in.
	 * @param string $old   Text to find.
	 * @param string $new   Replacement text.
	 * @return mixed Same shape as $value, with $old replaced by $new throughout.
	 */
	private static function recursive_replace( $value, $old, $new ) {
		if ( is_string( $value ) && is_serialized( $value ) ) {
			$unserialized = @unserialize( trim( $value ) ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
			// false is ambiguous with a genuinely-serialized `b:0;`; only
			// treat it as a real failure (leave the blob untouched rather
			// than risk corrupting it) when it isn't that specific case.
			if ( false === $unserialized && 'b:0;' !== trim( $value ) ) {
				return $value;
			}
			return serialize( self::recursive_replace( $unserialized, $old, $new ) ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.serialize_serialize
		}
		if ( is_array( $value ) ) {
			$out = array();
			foreach ( $value as $k => $v ) {
				$out[ self::recursive_replace( $k, $old, $new ) ] = self::recursive_replace( $v, $old, $new );
			}
			return $out;
		}
		if ( is_object( $value ) ) {
			// An object whose class isn't loaded unserializes as a stub
			// (__PHP_Incomplete_Class) -- walking or re-serializing it would
			// silently drop data, so leave it exactly as found.
			if ( 'incomplete_class' === strtolower( get_class( $value ) ) || $value instanceof __PHP_Incomplete_Class ) {
				return $value;
			}
			foreach ( get_object_vars( $value ) as $k => $v ) {
				$value->$k = self::recursive_replace( $v, $old, $new );
			}
			return $value;
		}
		if ( is_string( $value ) ) {
			return str_replace( $old, $new, $value );
		}
		return $value;
	}

	/**
	 * Short usage hint echoed back on an unknown command/action pair.
	 *
	 * @return string
	 */
	private static function usage() {
		return 'Supported: plugin list/activate/deactivate, theme list/activate, '
			. 'option get/update (allowlisted keys only), search replace (old/new, tables/dry_run/limit), '
			. 'user list, core version.';
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
