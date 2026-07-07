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
			<div class="aisa-connector-actions">
				<?php self::render_open_connector_button(); ?>
			</div>
			<div id="aisa-header">
				<h1 class="aisa-title">
					<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?>
					<span class="aisa-tagline"><?php esc_html_e( 'Your AI content &amp; SEO assistant', 'ai-site-assistant' ); ?></span>
				</h1>
				<ul class="aisa-features">
					<li><?php esc_html_e( 'Draft, edit &amp; publish posts and pages by chat', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Fast targeted edits (replace / append) that avoid timeouts', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'SEO meta &amp; schema for Rank Math and Yoast', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'EEAT &amp; readability playbooks', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Fact-checking with Perplexity Sonar (web-grounded, cited)', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Stock-photo search &amp; upload straight into your media library', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Original AI image generation (Nano Banana Pro), hyper-realistic &amp; text-free', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'SEO intelligence via Ahrefs: worst/best pages, competitors, comparison', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Theme file edits in a safe draft-first sandbox', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Attach a CSV/Excel file of keyword or competitor data for grounded SEO advice', 'ai-site-assistant' ); ?></li>
					<li><?php esc_html_e( 'Write-approval gate &amp; full audit log', 'ai-site-assistant' ); ?></li>
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
	 * Render the MCP Connector onboarding page: setup instructions for the
	 * local MCP server plus an embedded agent chat gateway. Reuses the same
	 * #aisa-app markup/ids as the standalone workspace so admin/js/app.js
	 * runs completely unmodified — its attach/generate-image wiring already
	 * no-ops when those optional elements aren't present on the page.
	 */
	public static function render_mcp_connector() {
		$rest_base = esc_url( rest_url( 'aisa/v1' ) );
		?>
		<div class="wrap">
			<div class="aisa-connector-actions">
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=aisa-chat' ) ); ?>" class="button button-secondary">
					<?php esc_html_e( 'Back to Workspace', 'ai-site-assistant' ); ?>
				</a>
			</div>
			<div id="aisa-header">
				<h1 class="aisa-title">
					<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?>
					<span class="aisa-tagline"><?php esc_html_e( 'Connect the MCP server &amp; run the agent', 'ai-site-assistant' ); ?></span>
				</h1>
			</div>

			<div class="aisa-mcp-setup">
				<h2><?php esc_html_e( '1. Configure the MCP server', 'ai-site-assistant' ); ?></h2>
				<p><?php esc_html_e( 'The AISA MCP server runs locally next to Claude Code or Claude Desktop and talks to this site over its REST API. Point it at your site and an application password.', 'ai-site-assistant' ); ?></p>
				<ol class="aisa-mcp-steps">
					<li>
						<?php esc_html_e( 'Install the server:', 'ai-site-assistant' ); ?>
						<code>cd wp-mcp-server &amp;&amp; npm install</code>
					</li>
					<li>
						<?php esc_html_e( 'Copy .env.example to .env and set:', 'ai-site-assistant' ); ?>
						<code>WP_SITE_URL=<?php echo esc_html( home_url() ); ?></code>
						<code>WP_USERNAME=&lt;your admin username&gt;</code>
						<code>WP_APP_PASSWORD=&lt;an Application Password&gt;</code>
					</li>
					<li>
						<?php
						printf(
							/* translators: %s: link to the Application Passwords section of the user's own profile page. */
							esc_html__( 'Generate an Application Password under %s.', 'ai-site-assistant' ),
							'<a href="' . esc_url( admin_url( 'profile.php#application-passwords-section' ) ) . '">' . esc_html__( 'Users → Profile → Application Passwords', 'ai-site-assistant' ) . '</a>'
						);
						?>
					</li>
					<li>
						<?php esc_html_e( 'Register the server with your MCP client:', 'ai-site-assistant' ); ?>
						<code>claude mcp add aisa -- node wp-mcp-server/src/index.mjs</code>
					</li>
					<li>
						<?php esc_html_e( "The server bridges to this plugin's tools via its allowlisted endpoint:", 'ai-site-assistant' ); ?>
						<code><?php echo esc_html( $rest_base ); ?>/tool</code>
					</li>
				</ol>
			</div>

			<h2><?php esc_html_e( '2. Try the agent chat gateway', 'ai-site-assistant' ); ?></h2>
			<p><?php esc_html_e( 'This runs the same assistant as the standalone workspace — use it to sanity-check your setup before switching to Claude Code.', 'ai-site-assistant' ); ?></p>
			<div id="aisa-app">
				<div id="aisa-log" class="aisa-log" aria-live="polite"></div>
				<form id="aisa-form" class="aisa-form">
					<textarea id="aisa-input" rows="3"
						placeholder="<?php esc_attr_e( 'e.g. List the tools available to the MCP agent', 'ai-site-assistant' ); ?>"></textarea>
					<div class="aisa-form-actions">
						<button type="submit" id="aisa-send-btn" class="button button-primary"><?php esc_html_e( 'Send', 'ai-site-assistant' ); ?></button>
					</div>
				</form>
			</div>
		</div>
		<?php
	}
}
