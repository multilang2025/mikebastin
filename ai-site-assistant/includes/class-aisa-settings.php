<?php
/**
 * Admin menu, settings page (API key), and the chat UI page.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Admin menu, the settings (API key) page, and the chat page.
 */
class AISA_Settings {

	const OPTION_KEY = 'aisa_settings';

	/**
	 * Register admin hooks.
	 */
	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'assets' ) );
	}

	/**
	 * Register the admin menu and submenu pages.
	 */
	public static function menu() {
		add_menu_page(
			__( 'AISA Connector', 'ai-site-assistant' ),
			__( 'AISA Connector', 'ai-site-assistant' ),
			'edit_posts',
			'aisa-chat',
			array( __CLASS__, 'render_chat' ),
			'dashicons-format-chat',
			58
		);
		add_submenu_page(
			'aisa-chat',
			__( 'MCP Connector', 'ai-site-assistant' ),
			__( 'MCP Connector', 'ai-site-assistant' ),
			'edit_posts',
			'aisa-mcp-connector',
			array( __CLASS__, 'render_mcp_connector' )
		);
		add_submenu_page(
			'aisa-chat',
			__( 'Settings', 'ai-site-assistant' ),
			__( 'Settings', 'ai-site-assistant' ),
			'manage_options',
			'aisa-settings',
			array( __CLASS__, 'render_settings' )
		);
	}

	/**
	 * Register the settings option and its sanitizer.
	 */
	public static function register() {
		register_setting(
			'aisa_settings_group',
			self::OPTION_KEY,
			array( 'sanitize_callback' => array( __CLASS__, 'sanitize' ) )
		);
	}

	/**
	 * Sanitize settings. The API key is stored as-is in options; for production,
	 * encrypt it at rest or read it from wp-config / an env var instead.
	 *
	 * @param array $input Raw submitted settings.
	 * @return array Sanitized settings.
	 */
	public static function sanitize( $input ) {
		return array(
			'api_key'             => isset( $input['api_key'] ) ? trim( sanitize_text_field( $input['api_key'] ) ) : '',
			'openrouter_api_key'  => isset( $input['openrouter_api_key'] ) ? trim( sanitize_text_field( $input['openrouter_api_key'] ) ) : '',
			'unsplash_access_key' => isset( $input['unsplash_access_key'] ) ? trim( sanitize_text_field( $input['unsplash_access_key'] ) ) : '',
			'ahrefs_api_key'      => isset( $input['ahrefs_api_key'] ) ? trim( sanitize_text_field( $input['ahrefs_api_key'] ) ) : '',
			'gemini_api_key'      => isset( $input['gemini_api_key'] ) ? trim( sanitize_text_field( $input['gemini_api_key'] ) ) : '',
			'use_gemini_chat'     => ! empty( $input['use_gemini_chat'] ),
		);
	}

	/**
	 * Resolve the configured API key.
	 *
	 * @return string The configured API key (or empty string).
	 */
	public static function get_api_key() {
		// Prefer a constant in wp-config.php so the key never lives in the DB.
		if ( defined( 'AISA_API_KEY' ) && AISA_API_KEY ) {
			return AISA_API_KEY;
		}
		$opts = get_option( self::OPTION_KEY, array() );
		return $opts['api_key'] ?? '';
	}

	/**
	 * Whether the chat should be driven by Gemini's free tier instead of
	 * Claude. Opt-in, and only actually engaged if a Gemini key is also
	 * configured -- otherwise a stray checkbox with no key would silently
	 * break chat instead of falling back to Claude.
	 *
	 * @return bool
	 */
	public static function use_gemini_chat() {
		$opts = get_option( self::OPTION_KEY, array() );
		return ! empty( $opts['use_gemini_chat'] ) && AISA_Gemini_Client::is_configured();
	}

	/**
	 * Enqueue the chat UI assets on the assistant page only.
	 *
	 * @param string $hook Current admin page hook suffix.
	 */
	public static function assets( $hook ) {
		$chat_pages = array( 'toplevel_page_aisa-chat', 'aisa-chat_page_aisa-mcp-connector' );
		if ( ! in_array( $hook, $chat_pages, true ) ) {
			return;
		}
		wp_enqueue_style( 'aisa-admin', AISA_URL . 'admin/css/admin.css', array(), AISA_VERSION );
		wp_enqueue_script( 'aisa-admin', AISA_URL . 'admin/js/app.js', array( 'wp-api-fetch' ), AISA_VERSION, true );
		wp_localize_script(
			'aisa-admin',
			'AISA',
			array(
				'restUrl'      => esc_url_raw( rest_url( 'aisa/v1/chat' ) ),
				'nonce'        => wp_create_nonce( 'wp_rest' ),
				'hasGeminiKey' => AISA_Gemini_Client::is_configured(),
			)
		);
	}

	/**
	 * Header action button linking the standalone chat workspace to the
	 * MCP onboarding/gateway page. Purely navigational — no state, API
	 * payload, or key handling is touched.
	 */
	private static function render_open_connector_button() {
		?>
		<a href="<?php echo esc_url( admin_url( 'admin.php?page=aisa-mcp-connector' ) ); ?>"
			class="button button-secondary aisa-open-connector">
			<?php esc_html_e( 'Open AISA Connector', 'ai-site-assistant' ); ?>
		</a>
		<?php
	}

	/**
	 * Render the settings (API key) page.
	 */
	public static function render_settings() {
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'AISA Connector — Settings', 'ai-site-assistant' ); ?></h1>
			<?php if ( defined( 'AISA_API_KEY' ) && AISA_API_KEY ) : ?>
				<p><strong><?php esc_html_e( 'API key is set via the AISA_API_KEY constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
			<?php endif; ?>
			<form method="post" action="options.php">
				<?php settings_fields( 'aisa_settings_group' ); ?>
				<?php $opts = get_option( self::OPTION_KEY, array() ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="aisa_api_key"><?php esc_html_e( 'Claude API key', 'ai-site-assistant' ); ?></label></th>
						<td>
							<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[api_key]"
								id="aisa_api_key" type="password" class="regular-text"
								value="<?php echo esc_attr( $opts['api_key'] ?? '' ); ?>"
								autocomplete="off" />
							<p class="description">
								<?php esc_html_e( 'From console.anthropic.com. You pay your provider per use — no daily limits.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="aisa_openrouter_api_key"><?php esc_html_e( 'OpenRouter API key', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_OPENROUTER_API_KEY' ) && AISA_OPENROUTER_API_KEY ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_OPENROUTER_API_KEY constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[openrouter_api_key]"
									id="aisa_openrouter_api_key" type="password" class="regular-text"
									value="<?php echo esc_attr( $opts['openrouter_api_key'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
							<p class="description">
								<?php esc_html_e( 'Optional. From openrouter.ai/keys — powers the Fact Check tool via Perplexity Sonar. Leave blank to disable fact-checking.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="aisa_unsplash_access_key"><?php esc_html_e( 'Unsplash access key', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_UNSPLASH_ACCESS_KEY' ) && AISA_UNSPLASH_ACCESS_KEY ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_UNSPLASH_ACCESS_KEY constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[unsplash_access_key]"
									id="aisa_unsplash_access_key" type="password" class="regular-text"
									value="<?php echo esc_attr( $opts['unsplash_access_key'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
							<p class="description">
								<?php esc_html_e( 'Optional. From unsplash.com/developers — powers the stock-photo search tool. Leave blank to disable it.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="aisa_ahrefs_api_key"><?php esc_html_e( 'Ahrefs API key', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_AHREFS_API_KEY' ) && AISA_AHREFS_API_KEY ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_AHREFS_API_KEY constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[ahrefs_api_key]"
									id="aisa_ahrefs_api_key" type="password" class="regular-text"
									value="<?php echo esc_attr( $opts['ahrefs_api_key'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
							<p class="description">
								<?php esc_html_e( 'Optional. From Ahrefs → Account settings → API keys (needs a plan with API access). Powers SEO intelligence: least/best-performing pages, organic competitors, and domain comparison. Each request consumes Ahrefs API units. Leave blank to disable.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="aisa_gemini_api_key"><?php esc_html_e( 'Gemini API key (Nano Banana Pro)', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_GEMINI_API_KEY' ) && AISA_GEMINI_API_KEY ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_GEMINI_API_KEY constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[gemini_api_key]"
									id="aisa_gemini_api_key" type="password" class="regular-text"
									value="<?php echo esc_attr( $opts['gemini_api_key'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
							<p class="description">
								<?php esc_html_e( 'Optional. From Google AI Studio / aistudio.google.com (Nano Banana Pro / Gemini 3 Pro Image). Powers original image generation from a text description. Each generated image is a billed, metered API call. Leave blank to disable.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Chat model', 'ai-site-assistant' ); ?></th>
						<td>
							<label>
								<input type="checkbox" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[use_gemini_chat]"
									value="1" <?php checked( ! empty( $opts['use_gemini_chat'] ) ); ?> />
								<?php esc_html_e( 'Use Gemini 2.5 Flash for chat instead of Claude', 'ai-site-assistant' ); ?>
							</label>
							<p class="description">
								<?php esc_html_e( 'Uses the Gemini API key above and its free tier instead of billing your Claude key per use. Self-throttled to stay under the free tier’s rate limits (a few requests per minute, ~200/day), so it fails with a clear "try again later" message instead of an error once used up, rather than tipping into paid usage. Requires a Gemini API key above. Note: the in-admin chat workspace is currently disabled (see the Workspace page) -- this setting has no visible effect until it’s re-enabled.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Render the chat page.
	 *
	 * The in-admin chat workspace is disabled for now while the plugin's
	 * focus shifts to the MCP Connector (driving the site from an external
	 * AI client instead of a chat box embedded in wp-admin) -- deliberately
	 * left in the admin menu, with the actual #aisa-app chat markup removed
	 * rather than the page itself, so this can be re-enabled later without
	 * rebuilding it. See render_mcp_connector() for the active path.
	 */
	public static function render_chat() {
		?>
		<div class="wrap">
			<div id="aisa-header">
				<div class="aisa-title-row">
					<h1 class="aisa-title">
						<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?>
						<span class="aisa-tagline"><?php esc_html_e( 'Your AI content &amp; SEO assistant', 'ai-site-assistant' ); ?></span>
					</h1>
					<?php self::render_open_connector_button(); ?>
				</div>
			</div>
			<div class="aisa-disabled-notice">
				<p><strong><?php esc_html_e( 'The in-admin chat workspace is temporarily disabled.', 'ai-site-assistant' ); ?></strong></p>
				<p>
					<?php esc_html_e( 'This site is now driven from an external AI app (Claude, ChatGPT, Cursor) through the MCP Connector instead of a chat box here.', 'ai-site-assistant' ); ?>
				</p>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=aisa-mcp-connector' ) ); ?>" class="button button-primary">
					<?php esc_html_e( 'Open MCP Connector', 'ai-site-assistant' ); ?>
				</a>
			</div>
		</div>
		<?php
	}

	/**
	 * Retrieve the saved bridge connection (bridge URL + MCP connection URL).
	 *
	 * @return array Keys: bridge_url, connection_url. Empty strings when not yet connected.
	 */
	public static function get_bridge_connection() {
		$saved = get_option( 'aisa_bridge_connection', array() );
		return array(
			'bridge_url'     => $saved['bridge_url'] ?? '',
			'connection_url' => $saved['connection_url'] ?? '',
		);
	}

	/**
	 * Render the MCP Connector page: connect this site's AISA Bridge to an
	 * external AI client (Claude, ChatGPT, Cursor). No chat is embedded
	 * here -- the AI client itself is where the conversation happens; this
	 * page only ever creates the WordPress Application Password, registers
	 * it with the bridge, and hands back the MCP server URL to paste
	 * elsewhere.
	 */
	public static function render_mcp_connector() {
		$saved          = self::get_bridge_connection();
		$is_connected   = ! empty( $saved['connection_url'] );
		$connection_url = $saved['connection_url'];
		$bridge_url     = $saved['bridge_url'];
		// OAuth URL: base mcp.php with no token — Claude.ai web uses this and
		// handles auth via the OAuth flow triggered by the 401 response.
		$oauth_url = $bridge_url ? untrailingslashit( $bridge_url ) . '/mcp.php' : '';
		?>
		<div class="wrap">
			<div class="aisa-mcp-hero">
				<span class="aisa-status-pill"><?php esc_html_e( 'AISA Connector Active', 'ai-site-assistant' ); ?></span>
				<h1><?php esc_html_e( 'Let your AI run this site.', 'ai-site-assistant' ); ?></h1>
				<p>
					<?php esc_html_e( 'Connect this site to Claude, ChatGPT, Cursor, or any MCP-compatible AI client so it can draft, edit, and manage content directly — no chat box needed here.', 'ai-site-assistant' ); ?>
				</p>
			</div>

			<ul class="aisa-checklist">
				<li class="aisa-checklist-step" data-done="1">
					<span class="aisa-step-marker">&#10003;</span>
					<div class="aisa-checklist-body">
						<h2><?php esc_html_e( 'Install AISA Connector', 'ai-site-assistant' ); ?></h2>
						<p><?php esc_html_e( "You're here — the plugin is active on this site.", 'ai-site-assistant' ); ?></p>
					</div>
				</li>
				<li class="aisa-checklist-step" <?php echo $is_connected ? 'data-done="1"' : ''; ?>>
					<span class="aisa-step-marker"><?php echo $is_connected ? '&#10003;' : '2'; ?></span>
					<div class="aisa-checklist-body">
						<h2><?php esc_html_e( 'Connect the AISA Bridge', 'ai-site-assistant' ); ?></h2>
						<p><?php esc_html_e( 'Paste the URL of your hosted AISA Bridge (a small PHP app you upload to your own hosting, e.g. Hostinger). This creates a WordPress Application Password automatically and registers it with the bridge — your credentials never touch the browser.', 'ai-site-assistant' ); ?></p>
						<table class="form-table" role="presentation">
							<tr>
								<td>
									<input id="aisa_bridge_url" type="url" class="regular-text"
										value="<?php echo esc_attr( $bridge_url ); ?>"
										placeholder="https://www.betranslated.us/php-mcp-bridge" />
									<button type="button" class="button button-primary" id="aisa_generate_bridge_btn">
										<?php esc_html_e( 'Connect', 'ai-site-assistant' ); ?>
									</button>
									<span class="spinner" id="aisa_bridge_spinner" style="float: none;"></span>
								</td>
							</tr>
						</table>
					</div>
				</li>
				<li class="aisa-checklist-step" id="aisa_step_3" <?php echo $is_connected ? '' : 'data-active="0"'; ?>>
					<span class="aisa-step-marker">3</span>
					<div class="aisa-checklist-body">
						<h2><?php esc_html_e( 'Add it to your AI client', 'ai-site-assistant' ); ?></h2>
						<p><strong><?php esc_html_e( 'Claude.ai (browser) — paste this, then approve when redirected:', 'ai-site-assistant' ); ?></strong></p>
						<div class="aisa-copy-row" style="margin-bottom:.8rem">
							<code class="aisa-copy-field" id="aisa_oauth_url"><?php echo $is_connected ? esc_html( $oauth_url ) : '&#8212;'; ?></code>
							<button type="button" class="button aisa-copy-btn" data-copy-target="aisa_oauth_url"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
						</div>
						<p><strong><?php esc_html_e( 'Claude Desktop / Code / Cursor — token URL:', 'ai-site-assistant' ); ?></strong></p>
						<div class="aisa-copy-row">
							<code class="aisa-copy-field" id="aisa_connection_url"><?php echo $is_connected ? esc_html( $connection_url ) : '&#8212;'; ?></code>
							<button type="button" class="button aisa-copy-btn" id="aisa_copy_url_btn" data-copy-target="aisa_connection_url"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
						</div>
						<details class="aisa-inline-link">
							<summary><?php esc_html_e( 'Per-client setup instructions', 'ai-site-assistant' ); ?></summary>
							<ul>
								<li><?php esc_html_e( 'Claude.ai web: Settings → Connectors → Add connector, paste the OAuth URL, click Connect — you\'ll be redirected to approve access.', 'ai-site-assistant' ); ?></li>
								<li><?php esc_html_e( 'Claude Desktop / Claude Code: Settings → Connectors → Add custom connector, paste the token URL.', 'ai-site-assistant' ); ?></li>
								<li><?php esc_html_e( 'Cursor: Settings → MCP → Add new MCP server, paste the token URL as an SSE/HTTP server.', 'ai-site-assistant' ); ?></li>
							</ul>
						</details>
					</div>
				</li>
			</ul>

			<p class="aisa-mcp-footer">
				<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?> &middot;
				<a href="https://github.com/multilang2025/mikebastin" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Documentation', 'ai-site-assistant' ); ?></a>
			</p>
		</div>
		<script>
		document.addEventListener('DOMContentLoaded', function() {
			var btn = document.getElementById('aisa_generate_bridge_btn');
			var spinner = document.getElementById('aisa_bridge_spinner');
			var step2 = btn ? btn.closest('.aisa-checklist-step') : null;
			var step3     = document.getElementById('aisa_step_3');
			var urlText   = document.getElementById('aisa_connection_url');
			var oauthText = document.getElementById('aisa_oauth_url');

			if (!btn) return;

			btn.addEventListener('click', function() {
				var bridgeUrl = document.getElementById('aisa_bridge_url').value;
				if (!bridgeUrl) {
					alert('Please enter a Bridge Server URL.');
					return;
				}

				spinner.classList.add('is-active');
				btn.disabled = true;

				fetch( '<?php echo esc_url_raw( rest_url( 'aisa/v1/bridge/connect' ) ); ?>', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': '<?php echo esc_js( wp_create_nonce( 'wp_rest' ) ); ?>'
					},
					body: JSON.stringify({ bridge_url: bridgeUrl })
				})
				.then(response => response.json())
				.then(data => {
					spinner.classList.remove('is-active');
					btn.disabled = false;

					if (data.connection_url) {
						urlText.textContent = data.connection_url;
						if (oauthText) {
							oauthText.textContent = bridgeUrl.replace(/\/$/, '') + '/mcp.php';
						}
						if (step2) { step2.dataset.done = '1'; }
						step3.dataset.active = '1';
					} else {
						alert('Error: ' + (data.message || 'Unknown error occurred.'));
					}
				})
				.catch(err => {
					spinner.classList.remove('is-active');
					btn.disabled = false;
					alert('Network error. See console for details.');
					console.error(err);
				});
			});
		});
		</script>
		<?php
	}
}
