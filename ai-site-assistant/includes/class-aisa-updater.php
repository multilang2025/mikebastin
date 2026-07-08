<?php
/**
 * Self-contained update checker that surfaces GitHub Releases as native
 * WordPress plugin updates.
 *
 * On each update check it fetches the repo's latest release, compares the tag
 * (e.g. v0.2.0) against the installed version, and — when newer — points the
 * WordPress updater at the release's ai-site-assistant.zip asset so the update
 * installs with one click from the Plugins screen.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Wires GitHub Releases into the WordPress plugin update system.
 */
class AISA_Updater {

	const REPO       = 'multilang2025/mikebastin';
	const SLUG       = 'ai-site-assistant';
	const ASSET_NAME = 'ai-site-assistant.zip';
	const CACHE_KEY  = 'aisa_update_release';

	/**
	 * Register the update hooks.
	 */
	public static function init() {
		add_filter( 'pre_set_site_transient_update_plugins', array( __CLASS__, 'check' ) );
		add_filter( 'plugins_api', array( __CLASS__, 'info' ), 20, 3 );
		add_filter( 'http_request_args', array( __CLASS__, 'authorize_download' ), 10, 2 );
		add_action( 'upgrader_process_complete', array( __CLASS__, 'flush_cache' ), 10, 2 );
	}

	/**
	 * The configured GitHub token, if any.
	 *
	 * @return string Token, or empty string.
	 */
	private static function token() {
		return ( defined( 'AISA_GITHUB_TOKEN' ) && AISA_GITHUB_TOKEN ) ? AISA_GITHUB_TOKEN : '';
	}

	/**
	 * The plugin's basename (folder/file) used as the update array key.
	 *
	 * @return string
	 */
	private static function basename() {
		return plugin_basename( AISA_PATH . 'ai-site-assistant.php' );
	}

	/**
	 * Fetch the latest GitHub release, cached in a transient to avoid hitting
	 * the API on every admin page load.
	 *
	 * WordPress's own "Check Again" button (Dashboard -> Updates) loads the
	 * page with ?force-check=1 and, via its own much shorter internal
	 * throttle, re-runs the plugin-update check within the same request. This
	 * class hooks that exact same signal so a manual force-check also busts
	 * *our* cache -- otherwise a user could click Check Again indefinitely
	 * within the cache window and keep seeing a stale answer.
	 *
	 * @return array Decoded release payload, or an empty array on failure.
	 */
	private static function fetch_release() {
		if ( ! empty( $_GET['force-check'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only cache-bust signal, matches WP core's own use of this same query var.
			delete_transient( self::CACHE_KEY );
		}

		$cached = get_transient( self::CACHE_KEY );
		if ( false !== $cached ) {
			return $cached;
		}

		$args = array(
			'timeout' => 15,
			'headers' => array(
				'Accept'     => 'application/vnd.github+json',
				'User-Agent' => 'AI-Site-Assistant',
			),
		);
		// Optional token lets updates work on a private repo.
		$token = self::token();
		if ( $token ) {
			$args['headers']['Authorization'] = 'Bearer ' . $token;
		}

		$response = wp_remote_get(
			'https://api.github.com/repos/' . self::REPO . '/releases/latest',
			$args
		);

		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			// Cache the miss briefly so a flaky API doesn't slow every request.
			set_transient( self::CACHE_KEY, array(), 15 * MINUTE_IN_SECONDS );
			return array();
		}

		$release = json_decode( wp_remote_retrieve_body( $response ), true );
		$release = is_array( $release ) ? $release : array();
		// Well under GitHub's 60/hour unauthenticated rate limit for a single
		// site, and short enough that a fresh release shows up on its own
		// without needing the force-check bust above.
		set_transient( self::CACHE_KEY, $release, HOUR_IN_SECONDS );

		return $release;
	}

	/**
	 * Extract the version number from a release tag (strips a leading v).
	 *
	 * @param array $release Release payload.
	 * @return string Version string, or empty.
	 */
	private static function version( array $release ) {
		return ltrim( $release['tag_name'] ?? '', 'vV' );
	}

	/**
	 * Find the download URL for the packaged plugin zip on the release.
	 *
	 * With a token (private repo) we use the authenticated asset API URL, which
	 * authorize_download() signs; without one (public repo) the plain browser
	 * download URL needs no auth and is simpler.
	 *
	 * @param array $release Release payload.
	 * @return string Asset download URL, or empty.
	 */
	private static function package_url( array $release ) {
		$token = self::token();
		foreach ( (array) ( $release['assets'] ?? array() ) as $asset ) {
			if ( self::ASSET_NAME === ( $asset['name'] ?? '' ) ) {
				return $token ? ( $asset['url'] ?? '' ) : ( $asset['browser_download_url'] ?? '' );
			}
		}
		return '';
	}

	/**
	 * Attach the GitHub token to the release-asset download so private-repo
	 * updates can install. Only the api.github.com asset URL for this repo is
	 * authorized; the signed redirect it returns is fetched without the header
	 * (adding it there would break the download).
	 *
	 * @param array  $args HTTP request args.
	 * @param string $url  Request URL.
	 * @return array
	 */
	public static function authorize_download( $args, $url ) {
		$token  = self::token();
		$prefix = 'https://api.github.com/repos/' . self::REPO . '/releases/assets/';
		if ( ! $token || 0 !== strpos( $url, $prefix ) ) {
			return $args;
		}
		if ( empty( $args['headers'] ) || ! is_array( $args['headers'] ) ) {
			$args['headers'] = array();
		}
		$args['headers']['Authorization'] = 'Bearer ' . $token;
		$args['headers']['Accept']        = 'application/octet-stream';
		return $args;
	}

	/**
	 * Inject an available update into the update_plugins transient.
	 *
	 * @param object $transient The update_plugins transient.
	 * @return object
	 */
	public static function check( $transient ) {
		if ( empty( $transient->checked ) ) {
			return $transient;
		}

		$release = self::fetch_release();
		$latest  = self::version( $release );
		$package = self::package_url( $release );
		if ( ! $latest || ! $package ) {
			return $transient;
		}

		$basename = self::basename();
		$current  = $transient->checked[ $basename ] ?? AISA_VERSION;

		if ( version_compare( $latest, $current, '>' ) ) {
			$transient->response[ $basename ] = (object) array(
				'slug'        => self::SLUG,
				'plugin'      => $basename,
				'new_version' => $latest,
				'package'     => $package,
				'url'         => 'https://github.com/' . self::REPO,
			);
		}

		return $transient;
	}

	/**
	 * Provide the "View details" payload for the plugin information modal.
	 *
	 * @param false|object|array $result The result object or array.
	 * @param string             $action The requested plugins_api action.
	 * @param object             $args   The plugins_api arguments.
	 * @return false|object|array
	 */
	public static function info( $result, $action, $args ) {
		if ( 'plugin_information' !== $action || self::SLUG !== ( $args->slug ?? '' ) ) {
			return $result;
		}

		$release = self::fetch_release();
		if ( empty( $release ) ) {
			return $result;
		}

		return (object) array(
			'name'          => 'AISA Connector',
			'slug'          => self::SLUG,
			'version'       => self::version( $release ),
			'download_link' => self::package_url( $release ),
			'sections'      => array(
				'changelog' => wp_kses_post( $release['body'] ?? '' ),
			),
		);
	}

	/**
	 * Clear the cached release after a plugin update so the next check is fresh.
	 *
	 * @param WP_Upgrader $upgrader Upgrader instance.
	 * @param array       $data     Update context.
	 */
	public static function flush_cache( $upgrader, $data ) {
		if ( isset( $data['type'], $data['action'] ) && 'plugin' === $data['type'] && 'update' === $data['action'] ) {
			delete_transient( self::CACHE_KEY );
		}
	}
}
