<?php
/**
 * Plugin Name:       AI Site Assistant
 * Plugin URI:        https://example.com/ai-site-assistant
 * Description:        An AI assistant for WordPress that can read and edit your content using your own Claude API key. No daily limits — you pay your provider per use.
 * Version:           0.1.0
 * Requires at least: 6.3
 * Requires PHP:      8.1
 * Author:            betranslated
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ai-site-assistant
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

define( 'AISA_VERSION', '0.1.0' );
define( 'AISA_PATH', plugin_dir_path( __FILE__ ) );
define( 'AISA_URL', plugin_dir_url( __FILE__ ) );

require_once AISA_PATH . 'includes/class-aisa-audit-log.php';
require_once AISA_PATH . 'includes/class-aisa-claude-client.php';
require_once AISA_PATH . 'includes/class-aisa-tools.php';
require_once AISA_PATH . 'includes/class-aisa-agent.php';
require_once AISA_PATH . 'includes/class-aisa-settings.php';
require_once AISA_PATH . 'includes/class-aisa-rest.php';
require_once AISA_PATH . 'includes/class-aisa-updater.php';

/**
 * Boot the plugin once all plugins are loaded.
 */
function aisa_bootstrap() {
	AISA_Settings::init();
	AISA_REST::init();
	AISA_Updater::init();
}
add_action( 'plugins_loaded', 'aisa_bootstrap' );

/**
 * Create the audit-log table on activation.
 */
register_activation_hook( __FILE__, array( 'AISA_Audit_Log', 'install' ) );
