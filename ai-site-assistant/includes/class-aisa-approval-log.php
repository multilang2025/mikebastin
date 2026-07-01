<?php
/**
 * Admin viewer for the audit trail AISA_Audit_Log already records.
 *
 * The audit table has existed since day one, but nothing in wp-admin let a
 * site owner actually read it -- this adds that page.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Read-only "Approval Log" page listing every write the assistant has made.
 */
class AISA_Approval_Log {

	/** Rows per page. */
	const PER_PAGE = 50;

	/**
	 * Register the admin submenu page.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ), 20 );
	}

	/**
	 * Add the "Approval Log" submenu page under the AISA menu.
	 */
	public static function menu() {
		add_submenu_page(
			'aisa-chat',
			__( 'Approval Log', 'ai-site-assistant' ),
			__( 'Approval Log', 'ai-site-assistant' ),
			'manage_options',
			'aisa-approval-log',
			array( __CLASS__, 'render' )
		);
	}

	/**
	 * Render the paginated, append-only log of every recorded write action.
	 */
	public static function render() {
		global $wpdb;
		$table = AISA_Audit_Log::table();

		$page   = max( 1, (int) ( $_GET['paged'] ?? 1 ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only list view, no state change.
		$offset = ( $page - 1 ) * self::PER_PAGE;

		$total = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- $table is our own fixed table name, no user input.
		$rows  = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$table} ORDER BY id DESC LIMIT %d OFFSET %d", // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- $table is our own fixed table name, no user input.
				self::PER_PAGE,
				$offset
			)
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AISA Connector — Approval Log', 'ai-site-assistant' ); ?></h1>
			<p>
				<?php
				echo esc_html(
					sprintf(
						/* translators: %d: total number of recorded actions. */
						_n( '%d action recorded.', '%d actions recorded.', $total, 'ai-site-assistant' ),
						$total
					)
				);
				?>
			</p>
			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'When', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'User', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'Action', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'Post', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'Details', 'ai-site-assistant' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $rows ) ) : ?>
						<tr><td colspan="5"><?php esc_html_e( 'No actions recorded yet.', 'ai-site-assistant' ); ?></td></tr>
					<?php else : ?>
						<?php foreach ( $rows as $row ) : ?>
							<?php $user = get_userdata( (int) $row->user_id ); ?>
							<tr>
								<td><?php echo esc_html( $row->created_at ); ?></td>
								<td><?php echo esc_html( $user ? $user->user_login : '#' . (int) $row->user_id ); ?></td>
								<td><code><?php echo esc_html( $row->action ); ?></code></td>
								<td>
									<?php if ( $row->post_id ) : ?>
										<a href="<?php echo esc_url( get_edit_post_link( (int) $row->post_id, 'raw' ) ); ?>">#<?php echo (int) $row->post_id; ?></a>
									<?php else : ?>
										&#8212;
									<?php endif; ?>
								</td>
								<td><code><?php echo esc_html( wp_trim_words( (string) $row->payload, 20, '…' ) ); ?></code></td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
			<?php
			$total_pages = (int) ceil( $total / self::PER_PAGE );
			if ( $total_pages > 1 ) :
				?>
				<p class="tablenav-pages">
					<?php
					echo wp_kses_post(
						paginate_links(
							array(
								'current' => $page,
								'total'   => $total_pages,
							)
						)
					);
					?>
				</p>
				<?php
			endif;
			?>
		</div>
		<?php
	}
}
