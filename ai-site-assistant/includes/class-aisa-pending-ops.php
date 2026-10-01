<?php
/**
 * Queue of writes awaiting human approval before they touch the database.
 *
 * Mirrors the pattern WPVibe uses for its own raw-SQL escape hatch: a
 * mutating action that has no safer plugin-native write path doesn't run
 * immediately just because an authenticated MCP client asked for it. It's
 * recorded here instead, and a human has to open a link in their own
 * browser and click Approve before AISA_Tools actually executes it.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * CRUD for the pending-operation queue (one custom table).
 */
class AISA_Pending_Ops {

	/** How long an unanswered op stays approvable before it expires. */
	const TTL_SECONDS = 10 * MINUTE_IN_SECONDS;

	/** Option key tracking which plugin version last ran install(). */
	const DB_VERSION_OPTION = 'aisa_pending_ops_db_version';

	/**
	 * Self-heal the table on sites that already had AISA active before this
	 * feature shipped -- register_activation_hook alone only fires on a
	 * fresh activation, not on a plugin-file update, so without this an
	 * already-installed site would silently 500 the first time db_write ran.
	 * dbDelta() is safe to call repeatedly; the version check just keeps
	 * that call off the hot path on every request.
	 */
	public static function maybe_install() {
		if ( get_option( self::DB_VERSION_OPTION ) === AISA_VERSION ) {
			return;
		}
		self::install();
		update_option( self::DB_VERSION_OPTION, AISA_VERSION );
	}

	/**
	 * The pending-ops table name.
	 *
	 * @return string Fully-qualified table name.
	 */
	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'aisa_pending_ops';
	}

	/** Create the table on activation. */
	public static function install() {
		global $wpdb;
		$table   = self::table();
		$charset = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$table} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			token VARCHAR(43) NOT NULL,
			tool VARCHAR(64) NOT NULL,
			summary TEXT NOT NULL,
			payload LONGTEXT NOT NULL,
			status VARCHAR(20) NOT NULL DEFAULT 'pending',
			user_id BIGINT UNSIGNED NOT NULL,
			result LONGTEXT NULL,
			created_at DATETIME NOT NULL,
			decided_at DATETIME NULL,
			expires_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			UNIQUE KEY token (token),
			KEY status (status)
		) {$charset};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Queue a write for approval.
	 *
	 * @param string $tool    Tool name that wants to run (e.g. 'db_write').
	 * @param string $summary Human-readable one-liner shown on the approval screen.
	 * @param array  $payload The tool's original input, re-used verbatim when approved.
	 * @return array { token, approve_url }
	 */
	public static function create( $tool, $summary, array $payload ) {
		global $wpdb;

		// A random token, not a wp_create_nonce() -- the admin approving this
		// may be in a different browser/session than whatever called the
		// tool (an MCP client has no browser session at all), so a nonce
		// tied to "the current logged-in user" at creation time would just
		// fail to verify later for an unrelated reason. Same reasoning as
		// AISA_GSC_Client::get_auth_url()'s OAuth state token.
		$token = wp_generate_password( 32, false );
		$now   = current_time( 'mysql' );

		$wpdb->insert(
			self::table(),
			array(
				'token'      => $token,
				'tool'       => $tool,
				'summary'    => $summary,
				'payload'    => wp_json_encode( $payload ),
				'status'     => 'pending',
				'user_id'    => get_current_user_id(),
				'created_at' => $now,
				'expires_at' => gmdate( 'Y-m-d H:i:s', strtotime( $now ) + self::TTL_SECONDS ),
			),
			array( '%s', '%s', '%s', '%s', '%s', '%d', '%s', '%s' )
		);

		return array(
			'token'       => $token,
			'approve_url' => self::approval_url( $token ),
		);
	}

	/**
	 * Fetch one op by its token, auto-expiring it if the TTL has passed.
	 *
	 * @param string $token Lookup token.
	 * @return object|null Row object, or null if not found.
	 */
	public static function get( $token ) {
		global $wpdb;
		$table = self::table();

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- our own small queue table, correctness over caching a status that changes on every poll.
		$row = $wpdb->get_row( $wpdb->prepare( 'SELECT * FROM %i WHERE token = %s', $table, $token ) );
		if ( ! $row ) {
			return null;
		}

		if ( 'pending' === $row->status && strtotime( $row->expires_at ) < time() ) {
			self::set_status( $token, 'expired' );
			$row->status = 'expired';
		}

		return $row;
	}

	/**
	 * Move an op to 'approved' or 'denied'. Execution (for an approved op)
	 * is the caller's responsibility -- this only records the decision.
	 *
	 * @param string $token  Lookup token.
	 * @param string $status 'approved' or 'denied'.
	 */
	public static function set_status( $token, $status ) {
		global $wpdb;
		$wpdb->update(
			self::table(),
			array(
				'status'     => $status,
				'decided_at' => current_time( 'mysql' ),
			),
			array( 'token' => $token ),
			array( '%s', '%s' ),
			array( '%s' )
		);
	}

	/**
	 * Record the outcome of actually running an approved op.
	 *
	 * @param string $token  Lookup token.
	 * @param string $status 'executed' or 'failed'.
	 * @param array  $result Result payload to show back to the MCP client.
	 */
	public static function set_result( $token, $status, array $result ) {
		global $wpdb;
		$wpdb->update(
			self::table(),
			array(
				'status' => $status,
				'result' => wp_json_encode( $result ),
			),
			array( 'token' => $token ),
			array( '%s', '%s' ),
			array( '%s' )
		);
	}

	/**
	 * The link a human opens in their own browser to review and decide.
	 *
	 * @param string $token Lookup token.
	 * @return string Admin URL.
	 */
	public static function approval_url( $token ) {
		return add_query_arg(
			array(
				'page'  => 'aisa-approvals',
				'token' => $token,
			),
			admin_url( 'admin.php' )
		);
	}

	/**
	 * All currently-pending (not yet decided, not yet expired) ops, newest first.
	 *
	 * @return object[] Row objects.
	 */
	public static function all_pending() {
		global $wpdb;
		$table = self::table();

		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- our own small queue table; the admin page needs the live list, not a cached one.
		$rows = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM %i WHERE status = 'pending' ORDER BY id DESC", $table ) );

		foreach ( $rows as $row ) {
			if ( strtotime( $row->expires_at ) < time() ) {
				self::set_status( $row->token, 'expired' );
				$row->status = 'expired';
			}
		}

		return array_values(
			array_filter(
				$rows,
				static function ( $row ) {
					return 'pending' === $row->status;
				}
			)
		);
	}
}
