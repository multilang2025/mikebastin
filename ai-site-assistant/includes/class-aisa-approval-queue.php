<?php
/**
 * wp-admin page where a human reviews and decides on queued db_write ops.
 *
 * This is the only place an AISA_Pending_Ops row queued by db_write ever
 * actually touches the database -- AISA_Tools::db_write() only records the
 * statement, it never runs it.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lists pending ops and handles Approve/Deny.
 */
class AISA_Approval_Queue {

	/**
	 * Register hooks.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 21 );
		add_action( 'admin_post_aisa_approve_op', array( __CLASS__, 'handle_approve' ) );
		add_action( 'admin_post_aisa_deny_op', array( __CLASS__, 'handle_deny' ) );
	}

	/**
	 * Add the "Pending Approvals" submenu page under the AISA menu.
	 */
	public static function menu() {
		add_submenu_page(
			'aisa-chat',
			__( 'Pending Approvals', 'ai-site-assistant' ),
			self::menu_label(),
			'manage_options',
			'aisa-approvals',
			array( __CLASS__, 'render' )
		);
	}

	/**
	 * Menu label, with a count badge when something is actually waiting.
	 *
	 * @return string
	 */
	private static function menu_label() {
		$count = count( AISA_Pending_Ops::all_pending() );
		if ( $count < 1 ) {
			return __( 'Pending Approvals', 'ai-site-assistant' );
		}
		return sprintf(
			/* translators: %d: number of pending operations. */
			__( 'Pending Approvals %s', 'ai-site-assistant' ),
			'<span class="awaiting-mod"><span class="pending-count">' . (int) $count . '</span></span>'
		);
	}

	/**
	 * Render the list of pending ops, each with Approve/Deny buttons, plus
	 * a one-off notice (from the redirect after a decision) if present.
	 */
	public static function render() {
		$notice = isset( $_GET['aisa_notice'] ) ? sanitize_key( wp_unslash( $_GET['aisa_notice'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- display-only, read via a one-time query var right after our own redirect.
		$rows   = AISA_Pending_Ops::all_pending();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AISA Connector — Pending Approvals', 'ai-site-assistant' ); ?></h1>
			<p class="description">
				<?php esc_html_e( 'A write the assistant could only reach through a raw database statement waits here until you approve it. Nothing below has happened to your site yet.', 'ai-site-assistant' ); ?>
			</p>
			<?php if ( 'approved' === $notice ) : ?>
				<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Approved and executed.', 'ai-site-assistant' ); ?></p></div>
			<?php elseif ( 'denied' === $notice ) : ?>
				<div class="notice notice-info is-dismissible"><p><?php esc_html_e( 'Denied. Nothing was changed.', 'ai-site-assistant' ); ?></p></div>
			<?php elseif ( 'failed' === $notice ) : ?>
				<div class="notice notice-error is-dismissible"><p><?php esc_html_e( 'Approved, but the statement failed -- see the Approval Log for the error.', 'ai-site-assistant' ); ?></p></div>
			<?php elseif ( 'gone' === $notice ) : ?>
				<div class="notice notice-warning is-dismissible"><p><?php esc_html_e( 'That operation was already decided, or expired, or does not exist.', 'ai-site-assistant' ); ?></p></div>
			<?php endif; ?>

			<?php if ( empty( $rows ) ) : ?>
				<p><?php esc_html_e( 'Nothing is waiting on approval.', 'ai-site-assistant' ); ?></p>
			<?php else : ?>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Requested', 'ai-site-assistant' ); ?></th>
							<th><?php esc_html_e( 'By', 'ai-site-assistant' ); ?></th>
							<th><?php esc_html_e( 'What it does', 'ai-site-assistant' ); ?></th>
							<th><?php esc_html_e( 'Statement', 'ai-site-assistant' ); ?></th>
							<th><?php esc_html_e( 'Expires', 'ai-site-assistant' ); ?></th>
							<th><?php esc_html_e( 'Decision', 'ai-site-assistant' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $rows as $row ) : ?>
							<?php
							$user    = get_userdata( (int) $row->user_id );
							$payload = json_decode( (string) $row->payload, true );
							$sql     = is_array( $payload ) ? (string) ( $payload['sql'] ?? '' ) : '';
							?>
							<tr>
								<td><?php echo esc_html( $row->created_at ); ?></td>
								<td><?php echo esc_html( $user ? $user->user_login : '#' . (int) $row->user_id ); ?></td>
								<td><?php echo esc_html( $row->summary ); ?></td>
								<td><code style="white-space: pre-wrap; word-break: break-word;"><?php echo esc_html( $sql ); ?></code></td>
								<td><?php echo esc_html( $row->expires_at ); ?></td>
								<td>
									<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block; margin-right: 6px;">
										<input type="hidden" name="action" value="aisa_approve_op" />
										<input type="hidden" name="token" value="<?php echo esc_attr( $row->token ); ?>" />
										<?php wp_nonce_field( 'aisa_decide_op_' . $row->token ); ?>
										<button type="submit" class="button button-primary"><?php esc_html_e( 'Approve', 'ai-site-assistant' ); ?></button>
									</form>
									<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;">
										<input type="hidden" name="action" value="aisa_deny_op" />
										<input type="hidden" name="token" value="<?php echo esc_attr( $row->token ); ?>" />
										<?php wp_nonce_field( 'aisa_decide_op_' . $row->token ); ?>
										<button type="submit" class="button"><?php esc_html_e( 'Deny', 'ai-site-assistant' ); ?></button>
									</form>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * admin-post handler: approve one op and execute it immediately.
	 *
	 * The nonce is namespaced per-token (not the fixed-action nonce
	 * check_admin_referer() defaults to) so a stale, already-rendered
	 * approval page can't be used to approve a *different*, newer op that
	 * happens to reuse the same action name.
	 */
	public static function handle_approve() {
		$token = isset( $_POST['token'] ) ? sanitize_text_field( wp_unslash( $_POST['token'] ) ) : '';
		check_admin_referer( 'aisa_decide_op_' . $token );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ai-site-assistant' ) );
		}

		$op = AISA_Pending_Ops::get( $token );
		if ( ! $op || 'pending' !== $op->status ) {
			self::redirect( 'gone' );
		}

		AISA_Pending_Ops::set_status( $token, 'approved' );

		$payload = json_decode( (string) $op->payload, true );
		$sql     = is_array( $payload ) ? (string) ( $payload['sql'] ?? '' ) : '';

		global $wpdb;
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- already validated (single INSERT/UPDATE/DELETE, no DDL, no multiple statements) by AISA_Tools::db_write() at queue time; this is the one place that validated statement is allowed to actually run, gated on an explicit human click.
		$affected = $wpdb->query( $sql );

		if ( false === $affected ) {
			AISA_Pending_Ops::set_result(
				$token,
				'failed',
				array(
					'error' => $wpdb->last_error,
				)
			);
			AISA_Audit_Log::record( 'db_write_failed', null, array( 'sql' => $sql, 'error' => $wpdb->last_error ) );
			self::redirect( 'failed' );
		}

		AISA_Pending_Ops::set_result(
			$token,
			'executed',
			array(
				'affected_rows' => (int) $affected,
			)
		);
		AISA_Audit_Log::record( 'db_write', null, array( 'sql' => $sql, 'affected_rows' => (int) $affected ) );
		self::redirect( 'approved' );
	}

	/**
	 * admin-post handler: deny one op. Nothing is executed.
	 */
	public static function handle_deny() {
		$token = isset( $_POST['token'] ) ? sanitize_text_field( wp_unslash( $_POST['token'] ) ) : '';
		check_admin_referer( 'aisa_decide_op_' . $token );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ai-site-assistant' ) );
		}

		$op = AISA_Pending_Ops::get( $token );
		if ( ! $op || 'pending' !== $op->status ) {
			self::redirect( 'gone' );
		}

		AISA_Pending_Ops::set_status( $token, 'denied' );
		self::redirect( 'denied' );
	}

	/**
	 * Redirect back to the queue page with a one-off result notice.
	 *
	 * @param string $notice One of 'approved', 'denied', 'failed', 'gone'.
	 */
	private static function redirect( $notice ) {
		wp_safe_redirect( admin_url( 'admin.php?page=aisa-approvals&aisa_notice=' . $notice ) );
		exit;
	}
}
