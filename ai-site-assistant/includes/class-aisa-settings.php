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

			<div class="card" style="max-width: 800px; margin-top: 20px; padding: 20px;">
				<h2><?php esc_html_e( 'Connect to Claude Desktop / Web (WPVibe Style)', 'ai-site-assistant' ); ?></h2>
				<p><?php esc_html_e( 'Generate a secure connection URL to use this site inside the Claude Desktop app or Claude web interface. This uses a hosted PHP bridge to proxy requests safely.', 'ai-site-assistant' ); ?></p>
				
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="aisa_bridge_url"><?php esc_html_e( 'Bridge Server URL', 'ai-site-assistant' ); ?></label></th>
						<td>
							<input id="aisa_bridge_url" type="url" class="regular-text" value="https://example-bridge.com/php-mcp-bridge" />
							<p class="description"><?php esc_html_e( 'The URL of your hosted PHP MCP bridge.', 'ai-site-assistant' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"></th>
						<td>
							<button type="button" class="button button-secondary" id="aisa_generate_bridge_btn">
								<?php esc_html_e( 'Generate Connection URL', 'ai-site-assistant' ); ?>
							</button>
							<span class="spinner" id="aisa_bridge_spinner" style="float: none;"></span>
						</td>
					</tr>
					<tr id="aisa_connection_url_row" style="display: none;">
						<th scope="row"><label for="aisa_connection_url"><?php esc_html_e( 'Claude Connection URL', 'ai-site-assistant' ); ?></label></th>
						<td>
							<input id="aisa_connection_url" type="text" class="large-text code" readonly="readonly" onclick="this.select();" />
							<p class="description" style="color: #007017; font-weight: bold;">
								<?php esc_html_e( 'Success! Paste this URL into Claude Desktop or Claude Web to connect your site.', 'ai-site-assistant' ); ?>
							</p>
						</td>
					</tr>
				</table>
			</div>

			<script>
			document.addEventListener('DOMContentLoaded', function() {
				var btn = document.getElementById('aisa_generate_bridge_btn');
				var spinner = document.getElementById('aisa_bridge_spinner');
				var urlRow = document.getElementById('aisa_connection_url_row');
				var urlInput = document.getElementById('aisa_connection_url');
				
				if (!btn) return;
				
				btn.addEventListener('click', function() {
					var bridgeUrl = document.getElementById('aisa_bridge_url').value;
					if (!bridgeUrl) {
						alert('Please enter a Bridge Server URL.');
						return;
					}
					
					spinner.classList.add('is-active');
					btn.disabled = true;
					urlRow.style.display = 'none';
					
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
							urlInput.value = data.connection_url;
							urlRow.style.display = '';
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

			<hr style="margin: 30px 0;">

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
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Render the chat page.
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
				<ul class="aisa-features">
					<li><?php esc_html_e( 'Draft, edit, publish &amp; fast-edit content by chat', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'SEO: meta &amp; schema, EEAT/readability, Ahrefs intelligence', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Media: stock photos, AI image generation, CSV/Excel-grounded advice', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Theme sandbox, write-approval gate &amp; full audit log', 'ai-site-assistant' ); ?></li>
				</ul>
			</div>
			<div id="aisa-app">
				<div id="aisa-log" class="aisa-log" aria-live="polite"></div>
				<span id="aisa-attachment-badge" class="aisa-attachment-badge" hidden></span>
				<form id="aisa-form" class="aisa-form">
					<button type="button" id="aisa-attach-btn" class="button" title="<?php esc_attr_e( 'Attach a CSV or Excel file', 'ai-site-assistant' ); ?>">📎</button>
					<input type="file" id="aisa-file-input" accept=".csv,.xls,.xlsx" hidden />
					<textarea id="aisa-input" rows="3"
						placeholder="<?php esc_attr_e( 'e.g. Draft a blog post about our new opening hours', 'ai-site-assistant' ); ?>"></textarea>
					<div class="aisa-form-actions">
						<button type="submit" id="aisa-send-btn" class="button button-primary"><?php esc_html_e( 'Send', 'ai-site-assistant' ); ?></button>
						<button type="button" id="aisa-generate-btn" class="button"><?php esc_html_e( 'Generate Images', 'ai-site-assistant' ); ?></button>
					</div>
				</form>
			</div>
		</div>
		<?php
	}

	/**
	 * Render the MCP Connector onboarding page: a plain-language setup
	 * wizard for the local MCP server plus an embedded agent chat gateway
	 * as the final "test it" step. Reuses the same #aisa-app markup/ids as
	 * the standalone workspace so admin/js/app.js runs unmodified — its
	 * attach/generate-image wiring already no-ops when those optional
	 * elements aren't present on the page.
	 */
	public static function render_mcp_connector() {
		?>
		<div class="wrap">
			<div id="aisa-header">
				<div class="aisa-title-row">
					<h1 class="aisa-title">
						<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?>
						<span class="aisa-tagline"><?php esc_html_e( 'Link up your AI assistant app', 'ai-site-assistant' ); ?></span>
					</h1>
					<a href="<?php echo esc_url( admin_url( 'admin.php?page=aisa-chat' ) ); ?>" class="button button-secondary">
						<?php esc_html_e( 'Back to Workspace', 'ai-site-assistant' ); ?>
					</a>
				</div>
				<p class="aisa-wizard-intro">
					<?php esc_html_e( 'Want to drive this site from Claude Code, Claude Desktop, or another AI app on your computer? Follow the four steps below — no technical background needed.', 'ai-site-assistant' ); ?>
				</p>
			</div>

			<ol class="aisa-wizard">
				<li class="aisa-wizard-step">
					<span class="aisa-wizard-num">1</span>
					<div class="aisa-wizard-card">
						<h2><?php esc_html_e( 'Download the connector', 'ai-site-assistant' ); ?></h2>
						<p><?php esc_html_e( 'This is a one-time setup. Open a terminal on your computer and paste this in — it fetches and prepares the connector.', 'ai-site-assistant' ); ?></p>
						<div class="aisa-copy-row">
							<code class="aisa-copy-field" id="aisa-copy-install">cd wp-mcp-server &amp;&amp; npm install</code>
							<button type="button" class="button aisa-copy-btn" data-copy-target="aisa-copy-install"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
						</div>
					</div>
				</li>
				<li class="aisa-wizard-step">
					<span class="aisa-wizard-num">2</span>
					<div class="aisa-wizard-card">
						<h2><?php esc_html_e( 'Give it a key to your site', 'ai-site-assistant' ); ?></h2>
						<p>
							<?php
							printf(
								/* translators: %s: link to the Application Passwords section of the user's own profile page. */
								esc_html__( 'First, create a site password just for this connector: go to %s and add a new one.', 'ai-site-assistant' ),
								'<a href="' . esc_url( admin_url( 'profile.php#application-passwords-section' ) ) . '">' . esc_html__( 'your profile', 'ai-site-assistant' ) . '</a>'
							);
							?>
						</p>
						<p><?php esc_html_e( 'Then paste these three lines into the .env file the connector created:', 'ai-site-assistant' ); ?></p>
						<div class="aisa-copy-row">
							<code class="aisa-copy-field" id="aisa-copy-env">WP_SITE_URL=<?php echo esc_html( home_url() ); ?>
WP_USERNAME=your admin username
WP_APP_PASSWORD=the password you just created</code>
							<button type="button" class="button aisa-copy-btn" data-copy-target="aisa-copy-env"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
						</div>
					</div>
				</li>
				<li class="aisa-wizard-step">
					<span class="aisa-wizard-num">3</span>
					<div class="aisa-wizard-card">
						<h2><?php esc_html_e( 'Connect it to your AI app', 'ai-site-assistant' ); ?></h2>
						<p><?php esc_html_e( 'Paste this into the same terminal so your AI app knows the connector is there:', 'ai-site-assistant' ); ?></p>
						<div class="aisa-copy-row">
							<code class="aisa-copy-field" id="aisa-copy-register">claude mcp add aisa -- node wp-mcp-server/src/index.mjs</code>
							<button type="button" class="button aisa-copy-btn" data-copy-target="aisa-copy-register"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
						</div>
					</div>
				</li>
				<li class="aisa-wizard-step">
					<span class="aisa-wizard-num">4</span>
					<div class="aisa-wizard-card">
						<h2><?php esc_html_e( 'Say hello', 'ai-site-assistant' ); ?></h2>
						<p><?php esc_html_e( 'Try it right here first — this talks to your site the same way the connector will.', 'ai-site-assistant' ); ?></p>
						<div id="aisa-app">
							<div id="aisa-log" class="aisa-log" aria-live="polite"></div>
							<form id="aisa-form" class="aisa-form">
								<textarea id="aisa-input" rows="3"
									placeholder="<?php esc_attr_e( 'e.g. Say hello and list my 5 most recent posts', 'ai-site-assistant' ); ?>"></textarea>
								<div class="aisa-form-actions">
									<button type="submit" id="aisa-send-btn" class="button button-primary"><?php esc_html_e( 'Send', 'ai-site-assistant' ); ?></button>
								</div>
							</form>
						</div>
					</div>
				</li>
			</ol>
		</div>
		<?php
	}
}
