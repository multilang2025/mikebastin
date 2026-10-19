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
	 * Options hard-blocked for BOTH read and write via wp_cli_get/wp_cli_set --
	 * anything that could leak a secret or let an attacker change who can log
	 * in or what code runs. Everything else is readable/writable (replaces the
	 * old narrow OPTION_ALLOWLIST with a blocklist, matching WPVibe's model --
	 * approved 2026-10-15: an allowlist means every legitimate option name has
	 * to be anticipated in advance, which is how a plugin's own settings
	 * option, e.g. `joinchat`, ended up unreachable here even though reading/
	 * patching one field of it is harmless).
	 *
	 * @var string[]
	 */
	const BLOCKED_OPTIONS = array(
		'siteurl',
		'home',
		'active_plugins',
		'active_sitewide_plugins',
		'template',
		'stylesheet',
		'stylesheet_root',
		'template_root',
		'users_can_register',
		'default_role',
		'admin_email',
		'wp_user_roles',
		'db_version',
		'initial_db_version',
		'cron',
		'recovery_keys',
		'wpvibe_bypass_approvals',
		'aisa_bypass_approvals',
	);

	/**
	 * Substring match (case-insensitive) against the option name -- covers
	 * auth_key/auth_salt/logged_in_key/nonce_salt/secure_auth_* and any
	 * plugin's own *_api_key / *_secret / *_password option without listing
	 * every one by name.
	 *
	 * @var string[]
	 */
	const BLOCKED_OPTION_SUBSTRINGS = array(
		'_key',
		'_salt',
		'secret',
		'password',
	);

	/**
	 * True if $name is blocked by BLOCKED_OPTIONS or BLOCKED_OPTION_SUBSTRINGS.
	 *
	 * @param string $name Option name.
	 * @return bool
	 */
	private static function is_blocked_option( $name ) {
		$name = strtolower( (string) $name );
		if ( in_array( $name, self::BLOCKED_OPTIONS, true ) ) {
			return true;
		}
		foreach ( self::BLOCKED_OPTION_SUBSTRINGS as $needle ) {
			if ( false !== strpos( $name, $needle ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Options that change what a URL routes to. Writing one of these without
	 * also regenerating `rewrite_rules` leaves the site serving 404s for
	 * content that otherwise saved correctly -- e.g. a `category_base` that
	 * collides with the post permalink base. WordPress core only does this
	 * regeneration itself when the change comes through wp-admin's
	 * Settings -> Permalinks screen, not through a raw update_option() call,
	 * so wp_cli_set does it explicitly here.
	 *
	 * @var string[]
	 */
	const REWRITE_AFFECTING_OPTIONS = array(
		'permalink_structure',
		'category_base',
		'tag_base',
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
		'option patch',
		'post meta_update',
		'post meta_patch',
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
				if ( self::is_blocked_option( $name ) ) {
					return self::error( 'Option "' . $name . '" is blocked for security (secrets/login/site-identity options are never readable).' );
				}
				$value = get_option( $name, null );
				if ( null === $value ) {
					return self::error( 'Option "' . $name . '" was not found.' );
				}
				return self::ok(
					array(
						'name'  => $name,
						'value' => $value,
					)
				);

			case 'post meta_get':
				if ( ! current_user_can( 'edit_posts' ) ) {
					return self::error( 'Permission denied.' );
				}
				$post_id = (int) ( $args[0] ?? 0 );
				if ( $post_id <= 0 || ! get_post( $post_id ) ) {
					return self::error( 'Post "' . ( $args[0] ?? '' ) . '" was not found.' );
				}
				$meta_key = sanitize_key( $args[1] ?? '' );
				if ( '' === $meta_key ) {
					// No key given -- list every meta key on the post (values
					// truncated so a huge serialized blob doesn't blow the response).
					$all = get_post_meta( $post_id );
					foreach ( $all as $key => $values ) {
						$all[ $key ] = array_map( function ( $v ) {
							return strlen( $v ) > 300 ? substr( $v, 0, 300 ) . '...[truncated]' : $v;
						}, $values );
					}
					return self::ok( array( 'post_id' => $post_id, 'meta' => $all ) );
				}
				$value = get_post_meta( $post_id, $meta_key, true );
				if ( '' === $value ) {
					return self::error( 'Meta key "' . $meta_key . '" is empty or not set on post ' . $post_id . '.' );
				}
				return self::ok(
					array(
						'post_id' => $post_id,
						'key'     => $meta_key,
						'value'   => $value,
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
				if ( self::is_blocked_option( $name ) ) {
					return self::error( 'Option "' . $name . '" is blocked for security (secrets/login/site-identity options are never writable). Change it through wp-admin instead.' );
				}
				// Refuse a write that would silently flip the option's stored
				// type (e.g. an array/serialized value overwritten with a plain
				// string) -- for a structured option, use `option patch` to
				// change one field instead of replacing the whole value.
				$existing = get_option( $name );
				if ( is_array( $existing ) && ! empty( $existing ) ) {
					return self::error( 'Option "' . $name . '" currently holds a structured (array) value; wp_cli_set only writes plain text here and would silently flip its type. Use command="option", action="patch" to change one field instead.' );
				}
				$value = sanitize_text_field( (string) ( $in['value'] ?? '' ) );
				update_option( $name, $value );

				$flushed = false;
				if ( in_array( $name, self::REWRITE_AFFECTING_OPTIONS, true ) ) {
					flush_rewrite_rules();
					$flushed = true;
				}

				AISA_Audit_Log::record( 'wp_cli_option_update', null, array( 'name' => $name ) );
				return self::ok(
					array(
						'name'            => $name,
						'value'           => $value,
						'rewrite_flushed' => $flushed,
					)
				);

			case 'option patch':
				if ( ! current_user_can( 'manage_options' ) ) {
					return self::error( 'Permission denied.' );
				}
				$name = sanitize_key( $target );
				if ( self::is_blocked_option( $name ) ) {
					return self::error( 'Option "' . $name . '" is blocked for security.' );
				}
				$current = get_option( $name, null );
				if ( null === $current ) {
					return self::error( 'Option "' . $name . '" was not found.' );
				}
				if ( ! is_array( $current ) && ! is_object( $current ) ) {
					return self::error( 'Option "' . $name . '" is a plain scalar; use command="option", action="update" instead.' );
				}
				$path = array_filter( explode( '.', (string) ( $in['key_path'] ?? '' ) ), function ( $seg ) {
					return '' !== $seg;
				} );
				if ( empty( $path ) ) {
					return self::error( 'A "key_path" is required, e.g. "telephone" or "nested.field".' );
				}
				if ( ! array_key_exists( 'value', $in ) ) {
					return self::error( 'A "value" is required.' );
				}
				$error   = null;
				$patched = self::patch_structure( $current, array_values( $path ), (string) $in['value'], $error );
				if ( null !== $error ) {
					return self::error( $error );
				}
				update_option( $name, $patched );
				$stored = get_option( $name );
				if ( maybe_serialize( $stored ) !== maybe_serialize( $patched ) ) {
					return self::error( 'Could not patch option "' . $name . '" -- the stored value does not match. A pre_update_option filter may have rejected the write.' );
				}
				AISA_Audit_Log::record( 'wp_cli_option_patch', null, array( 'name' => $name, 'key_path' => implode( '.', $path ) ) );
				return self::ok( array( 'name' => $name, 'key_path' => implode( '.', $path ), 'value' => $in['value'] ) );

			case 'post meta_update':
				if ( ! current_user_can( 'edit_posts' ) ) {
					return self::error( 'Permission denied.' );
				}
				$post_id = (int) $target;
				if ( $post_id <= 0 || ! get_post( $post_id ) ) {
					return self::error( 'Post "' . $target . '" was not found.' );
				}
				$meta_key = sanitize_key( (string) ( $in['meta_key'] ?? '' ) );
				if ( '' === $meta_key ) {
					return self::error( 'A "meta_key" is required.' );
				}
				$existing = get_post_meta( $post_id, $meta_key, true );
				if ( is_array( $existing ) && ! empty( $existing ) ) {
					return self::error( 'Meta key "' . $meta_key . '" currently holds a structured (array) value; use command="post", action="meta_patch" with a "key_path" to change one field instead.' );
				}
				$value = sanitize_text_field( (string) ( $in['value'] ?? '' ) );
				update_post_meta( $post_id, $meta_key, $value );
				AISA_Audit_Log::record( 'wp_cli_post_meta_update', $post_id, array( 'key' => $meta_key ) );
				return self::ok( array( 'post_id' => $post_id, 'key' => $meta_key, 'value' => $value ) );

			case 'post meta_patch':
				if ( ! current_user_can( 'edit_posts' ) ) {
					return self::error( 'Permission denied.' );
				}
				$post_id = (int) $target;
				if ( $post_id <= 0 || ! get_post( $post_id ) ) {
					return self::error( 'Post "' . $target . '" was not found.' );
				}
				$meta_key = sanitize_key( (string) ( $in['meta_key'] ?? '' ) );
				if ( '' === $meta_key ) {
					return self::error( 'A "meta_key" is required.' );
				}
				$current = get_post_meta( $post_id, $meta_key, true );
				if ( '' === $current || ! ( is_array( $current ) || is_object( $current ) ) ) {
					return self::error( 'Meta key "' . $meta_key . '" is empty or not a structured (array) value; use command="post", action="meta_update" instead.' );
				}
				$path = array_filter( explode( '.', (string) ( $in['key_path'] ?? '' ) ), function ( $seg ) {
					return '' !== $seg;
				} );
				if ( empty( $path ) ) {
					return self::error( 'A "key_path" is required, e.g. "number" or "nested.field".' );
				}
				if ( ! array_key_exists( 'value', $in ) ) {
					return self::error( 'A "value" is required.' );
				}
				$error   = null;
				$patched = self::patch_structure( $current, array_values( $path ), (string) $in['value'], $error );
				if ( null !== $error ) {
					return self::error( $error );
				}
				// update_post_meta() serializes a real PHP array itself; passing
				// the already-decoded $patched array (never a pre-serialized
				// string) is what keeps this safe -- see the WPVibe incident this
				// ported from, where re-feeding a serialized-looking STRING back
				// through a scalar update path got silently double-serialized.
				update_post_meta( $post_id, $meta_key, $patched );
				$stored = get_post_meta( $post_id, $meta_key, true );
				if ( maybe_serialize( $stored ) !== maybe_serialize( $patched ) ) {
					return self::error( 'Could not patch meta "' . $meta_key . '" on post ' . $post_id . ' -- the stored value does not match.' );
				}
				AISA_Audit_Log::record( 'wp_cli_post_meta_patch', $post_id, array( 'key' => $meta_key, 'key_path' => implode( '.', $path ) ) );
				return self::ok( array( 'post_id' => $post_id, 'key' => $meta_key, 'key_path' => implode( '.', $path ), 'value' => $in['value'] ) );

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
	 * Walk a nested array/stdClass along $path and set the leaf to $value.
	 * Shared by `option patch` and `post meta patch`. Unlike `option
	 * update`/`post meta update`, this only ever replaces one leaf, so it
	 * cannot flip the structure's own type -- the caller is still responsible
	 * for refusing to patch a plain scalar.
	 *
	 * @param mixed    $data  Current array/object value.
	 * @param string[] $path  Non-empty list of key segments.
	 * @param string   $value New leaf value.
	 * @param ?string  $error Set on failure.
	 * @return mixed Same shape as $data, with the leaf at $path set to $value.
	 */
	private static function patch_structure( $data, array $path, $value, &$error ) {
		$segment = array_shift( $path );
		$seg_key = is_numeric( $segment ) ? (int) $segment : $segment;
		$is_obj  = is_object( $data );

		if ( ! is_array( $data ) && ! $is_obj ) {
			$error = 'Cannot descend into a non-array value at "' . $segment . '".';
			return $data;
		}

		if ( empty( $path ) ) {
			if ( $is_obj ) {
				$data->{$seg_key} = $value;
			} else {
				$data[ $seg_key ] = $value;
			}
			return $data;
		}

		$exists = $is_obj ? property_exists( $data, (string) $seg_key ) : array_key_exists( $seg_key, $data );
		if ( ! $exists ) {
			$error = 'No data exists at key "' . $segment . '".';
			return $data;
		}
		if ( $is_obj ) {
			$data->{$seg_key} = self::patch_structure( $data->{$seg_key}, $path, $value, $error );
		} else {
			$data[ $seg_key ] = self::patch_structure( $data[ $seg_key ], $path, $value, $error );
		}
		return $data;
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
			. 'option get/update/patch (any key except the blocklist; patch changes one field '
			. 'of a structured option via key_path), command=post action=meta_get/meta_update/meta_patch '
			. '(same pattern, note the underscore -- not "meta get"), '
			. 'search replace (old/new, tables/dry_run/limit), user list, core version.';
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
