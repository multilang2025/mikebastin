<?php
/**
 * Audit log of every executed write action. One custom table.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

class AISA_Audit_Log {

	/** @return string Fully-qualified table name. */
	public static function table() {
		global $wpdb;
		return $wpdb->prefix . 'aisa_audit';
	}

	/** Create the table on activation. */
	public static function install() {
		global $wpdb;
		$table   = self::table();
		$charset = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$table} (
			id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT UNSIGNED NOT NULL,
			action VARCHAR(64) NOT NULL,
			post_id BIGINT UNSIGNED DEFAULT NULL,
			payload LONGTEXT NULL,
			created_at DATETIME NOT NULL,
			PRIMARY KEY (id),
			KEY user_id (user_id),
			KEY post_id (post_id)
		) {$charset};";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}

	/**
	 * Record a write action.
	 *
	 * @param string   $action  Tool name.
	 * @param int|null $post_id Affected post.
	 * @param array    $payload Tool input.
	 */
	public static function record( $action, $post_id, array $payload ) {
		global $wpdb;
		$wpdb->insert(
			self::table(),
			array(
				'user_id'    => get_current_user_id(),
				'action'     => $action,
				'post_id'    => $post_id ? (int) $post_id : null,
				'payload'    => wp_json_encode( $payload ),
				'created_at' => current_time( 'mysql' ),
			),
			array( '%d', '%s', '%d', '%s', '%s' )
		);
	}
}
