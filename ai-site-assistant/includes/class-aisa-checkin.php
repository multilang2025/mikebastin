<?php
/**
 * Optional fleet check-in. Each install can report its URL and versions to a hub
 * you control, so you can see which websites run the plugin from one dashboard.
 *
 * Everything is opt-in through wp-config.php constants. With none defined, no
 * data is ever sent and nothing is collected.
 *
 *   Reporter (put on every site that should report):
 *     define( 'AISA_CHECKIN_URL', 'https://hub.example.com/wp-json/aisa/v1/checkin' );
 *     define( 'AISA_CHECKIN_TOKEN', 'a-long-shared-secret' );
 *
 *   Hub (put on the ONE site that collects — can be one of the above too):
 *     define( 'AISA_CHECKIN_HUB', true );
 *     define( 'AISA_CHECKIN_TOKEN', 'a-long-shared-secret' );
 *
 * The token is a shared secret so only your own sites can post to the hub.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Reports each install to, and collects installs on, a self-hosted hub.
 */
class AISA_Checkin {

	/**
	 * Daily cron hook that triggers a report.
	 */
	const CRON_HOOK = 'aisa_checkin_event';

	/**
	 * Option storing collected sites on the hub.
	 */
	const HUB_OPTION = 'aisa_checkin_sites';

	/**
	 * Safety cap on the number of sites stored on the hub.
	 */
	const MAX_SITES = 500;

	/**
	 * Wire up the reporter and/or hub depending on configuration.
	 */
	public static function init() {
		if ( self::is_reporter() ) {
			add_action( 'admin_init', array( __CLASS__, 'maybe_schedule' ) );
			add_action( self::CRON_HOOK, array( __CLASS__, 'report' ) );
		}
		if ( self::is_hub() ) {
			add_action( 'rest_api_init', array( __CLASS__, 'routes' ) );
			add_action( 'admin_menu', array( __CLASS__, 'menu' ), 20 );
		}
	}

	/**
	 * Whether this site is configured to report to a hub.
	 *
	 * @return bool
	 */
	private static function is_reporter() {
		return defined( 'AISA_CHECKIN_URL' ) && AISA_CHECKIN_URL;
	}

	/**
	 * Whether this site acts as the collecting hub.
	 *
	 * @return bool
	 */
	private static function is_hub() {
		return defined( 'AISA_CHECKIN_HUB' ) && AISA_CHECKIN_HUB;
	}

	/**
	 * The shared secret token, or an empty string when unset.
	 *
	 * @return string
	 */
	private static function token() {
		return defined( 'AISA_CHECKIN_TOKEN' ) ? (string) AISA_CHECKIN_TOKEN : '';
	}

	/**
	 * Ensure the daily check-in is scheduled (reporter side).
	 */
	public static function maybe_schedule() {
		if ( ! wp_next_scheduled( self::CRON_HOOK ) ) {
			wp_schedule_event( time() + MINUTE_IN_SECONDS, 'daily', self::CRON_HOOK );
		}
	}

	/**
	 * Clear the scheduled check-in (called on deactivation).
	 */
	public static function unschedule() {
		$timestamp = wp_next_scheduled( self::CRON_HOOK );
		if ( $timestamp ) {
			wp_unschedule_event( $timestamp, self::CRON_HOOK );
		}
	}

	/**
	 * Send one check-in to the hub. Fire-and-forget (non-blocking).
	 */
	public static function report() {
		if ( ! self::is_reporter() ) {
			return;
		}
		wp_remote_post(
			(string) AISA_CHECKIN_URL,
			array(
				'timeout'  => 15,
				'blocking' => false,
				'headers'  => array(
					'content-type' => 'application/json',
					'x-aisa-token' => self::token(),
				),
				'body'     => wp_json_encode( self::snapshot() ),
			)
		);
	}

	/**
	 * Build the small payload describing this install.
	 *
	 * @return array
	 */
	private static function snapshot() {
		$engine = 'unknown';
		if ( defined( 'RANK_MATH_VERSION' ) || class_exists( 'RankMath' ) ) {
			$engine = 'rankmath';
		} elseif ( defined( 'WPSEO_VERSION' ) ) {
			$engine = 'yoast';
		}
		return array(
			'site'    => home_url(),
			'name'    => get_bloginfo( 'name' ),
			'version' => AISA_VERSION,
			'wp'      => get_bloginfo( 'version' ),
			'php'     => PHP_VERSION,
			'seo'     => $engine,
		);
	}

	/**
	 * Register the hub's collector route.
	 */
	public static function routes() {
		register_rest_route(
			'aisa/v1',
			'/checkin',
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'receive' ),
				'permission_callback' => array( __CLASS__, 'verify_token' ),
			)
		);
	}

	/**
	 * Validate the shared-secret token on an incoming check-in.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return bool
	 */
	public static function verify_token( WP_REST_Request $request ) {
		$expected = self::token();
		if ( '' === $expected ) {
			return false;
		}
		return hash_equals( $expected, (string) $request->get_header( 'x-aisa-token' ) );
	}

	/**
	 * Record one check-in on the hub.
	 *
	 * @param WP_REST_Request $request Incoming request.
	 * @return WP_REST_Response|WP_Error
	 */
	public static function receive( WP_REST_Request $request ) {
		$body = json_decode( $request->get_body(), true );
		$body = is_array( $body ) ? $body : array();

		$site = esc_url_raw( (string) ( $body['site'] ?? '' ) );
		if ( '' === $site ) {
			return new WP_Error(
				'aisa_checkin_no_site',
				__( 'Missing site URL.', 'ai-site-assistant' ),
				array( 'status' => 400 )
			);
		}

		$sites = get_option( self::HUB_OPTION, array() );
		$sites = is_array( $sites ) ? $sites : array();

		$sites[ md5( $site ) ] = array(
			'site'      => $site,
			'name'      => sanitize_text_field( (string) ( $body['name'] ?? '' ) ),
			'version'   => sanitize_text_field( (string) ( $body['version'] ?? '' ) ),
			'wp'        => sanitize_text_field( (string) ( $body['wp'] ?? '' ) ),
			'php'       => sanitize_text_field( (string) ( $body['php'] ?? '' ) ),
			'seo'       => sanitize_text_field( (string) ( $body['seo'] ?? '' ) ),
			'last_seen' => gmdate( 'Y-m-d H:i:s' ),
		);

		// Keep the option bounded by dropping the oldest entries past the cap.
		if ( count( $sites ) > self::MAX_SITES ) {
			uasort(
				$sites,
				static function ( $a, $b ) {
					return strcmp( (string) ( $a['last_seen'] ?? '' ), (string) ( $b['last_seen'] ?? '' ) );
				}
			);
			$sites = array_slice( $sites, count( $sites ) - self::MAX_SITES, null, true );
		}

		update_option( self::HUB_OPTION, $sites, false );

		return rest_ensure_response( array( 'ok' => true ) );
	}

	/**
	 * Add the hub's "Sites" listing page under the AISA menu.
	 */
	public static function menu() {
		add_submenu_page(
			'aisa-chat',
			__( 'Sites', 'ai-site-assistant' ),
			__( 'Sites', 'ai-site-assistant' ),
			'manage_options',
			'aisa-sites',
			array( __CLASS__, 'render_sites' )
		);
	}

	/**
	 * Render the hub's list of sites that have checked in.
	 */
	public static function render_sites() {
		$sites = get_option( self::HUB_OPTION, array() );
		$sites = is_array( $sites ) ? $sites : array();
		uasort(
			$sites,
			static function ( $a, $b ) {
				return strcmp( (string) ( $b['last_seen'] ?? '' ), (string) ( $a['last_seen'] ?? '' ) );
			}
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AISA Connector — Sites', 'ai-site-assistant' ); ?></h1>
			<p>
				<?php
				echo esc_html(
					sprintf(
						/* translators: %d: number of sites that have checked in. */
						_n( '%d site has checked in.', '%d sites have checked in.', count( $sites ), 'ai-site-assistant' ),
						count( $sites )
					)
				);
				?>
			</p>
			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Site', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'Plugin', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'WordPress', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'PHP', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'SEO', 'ai-site-assistant' ); ?></th>
						<th><?php esc_html_e( 'Last seen (UTC)', 'ai-site-assistant' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php if ( empty( $sites ) ) : ?>
						<tr><td colspan="6"><?php esc_html_e( 'No check-ins yet.', 'ai-site-assistant' ); ?></td></tr>
					<?php else : ?>
						<?php foreach ( $sites as $row ) : ?>
							<tr>
								<td>
									<a href="<?php echo esc_url( $row['site'] ?? '' ); ?>" target="_blank" rel="noopener noreferrer">
										<?php echo esc_html( ! empty( $row['name'] ) ? $row['name'] : ( $row['site'] ?? '' ) ); ?>
									</a><br />
									<span class="description"><?php echo esc_html( $row['site'] ?? '' ); ?></span>
								</td>
								<td><?php echo esc_html( $row['version'] ?? '' ); ?></td>
								<td><?php echo esc_html( $row['wp'] ?? '' ); ?></td>
								<td><?php echo esc_html( $row['php'] ?? '' ); ?></td>
								<td><?php echo esc_html( $row['seo'] ?? '' ); ?></td>
								<td><?php echo esc_html( $row['last_seen'] ?? '' ); ?></td>
							</tr>
						<?php endforeach; ?>
					<?php endif; ?>
				</tbody>
			</table>
		</div>
		<?php
	}
}
