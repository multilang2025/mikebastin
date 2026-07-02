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
		if ( 'toplevel_page_aisa-chat' !== $hook ) {
			return;
		}
		wp_enqueue_style( 'aisa-admin', AISA_URL . 'admin/css/admin.css', array(), AISA_VERSION );
		wp_enqueue_script( 'aisa-admin', AISA_URL . 'admin/js/app.js', array( 'wp-api-fetch' ), AISA_VERSION, true );
		wp_localize_script(
			'aisa-admin',
			'AISA',
			array(
				'restUrl' => esc_url_raw( rest_url( 'aisa/v1/chat' ) ),
				'nonce'   => wp_create_nonce( 'wp_rest' ),
			)
		);
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
				<li><?php esc_html_e( 'Write-approval gate &amp; full audit log', 'ai-site-assistant' ); ?></li>
			</ul>
			<div id="aisa-app">
				<div id="aisa-log" class="aisa-log" aria-live="polite"></div>
				<form id="aisa-form" class="aisa-form">
					<textarea id="aisa-input" rows="3"
						placeholder="<?php esc_attr_e( 'e.g. Draft a blog post about our new opening hours', 'ai-site-assistant' ); ?>"></textarea>
					<button type="submit" class="button button-primary"><?php esc_html_e( 'Send', 'ai-site-assistant' ); ?></button>
				</form>
			</div>
		</div>
		<?php
	}
}
