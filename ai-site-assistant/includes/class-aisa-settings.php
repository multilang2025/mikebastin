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
		add_filter( 'admin_body_class', array( __CLASS__, 'body_class' ) );
		add_action( 'admin_post_aisa_gsc_disconnect', array( __CLASS__, 'handle_gsc_disconnect' ) );
		add_action( 'admin_post_aisa_gsc_select_property', array( __CLASS__, 'handle_gsc_select_property' ) );
	}

	/**
	 * Render the Google Search Console connection status/action on the
	 * Settings page: a "Connect" link, a candidate-property picker if OAuth
	 * succeeded but the property is still ambiguous, or the connected
	 * property + a Disconnect button.
	 */
	private static function render_gsc_connection_status() {
		if ( ! AISA_Gsc_Client::has_client_credentials() ) {
			echo '<p class="description">' . esc_html__( 'Save a Client ID and Secret above first, then this page will show a Connect button.', 'ai-site-assistant' ) . '</p>';
			return;
		}

		$conn = AISA_Gsc_Client::get_connection();

		if ( '' !== $conn['property'] ) {
			printf(
				'<p><strong>%s</strong> <code>%s</code></p>',
				esc_html__( 'Connected:', 'ai-site-assistant' ),
				esc_html( $conn['property'] )
			);
			?>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="aisa_gsc_disconnect" />
				<?php wp_nonce_field( 'aisa_gsc_disconnect' ); ?>
				<button type="submit" class="button"><?php esc_html_e( 'Disconnect', 'ai-site-assistant' ); ?></button>
			</form>
			<?php
			return;
		}

		if ( ! empty( $conn['candidates'] ) ) {
			?>
			<p class="description"><?php esc_html_e( 'Multiple Search Console properties are available to this Google account. Choose which one this site should use:', 'ai-site-assistant' ); ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="aisa_gsc_select_property" />
				<?php wp_nonce_field( 'aisa_gsc_select_property' ); ?>
				<select name="property">
					<?php foreach ( $conn['candidates'] as $site_url ) : ?>
						<option value="<?php echo esc_attr( $site_url ); ?>"><?php echo esc_html( $site_url ); ?></option>
					<?php endforeach; ?>
				</select>
				<button type="submit" class="button button-primary"><?php esc_html_e( 'Use this property', 'ai-site-assistant' ); ?></button>
			</form>
			<?php
			return;
		}

		printf(
			'<a class="button button-primary" href="%s">%s</a>',
			esc_url( AISA_Gsc_Client::get_auth_url() ),
			esc_html__( 'Connect Google Search Console', 'ai-site-assistant' )
		);
	}

	/**
	 * admin-post handler: clear the stored GSC connection entirely.
	 */
	public static function handle_gsc_disconnect() {
		check_admin_referer( 'aisa_gsc_disconnect' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ai-site-assistant' ) );
		}
		delete_option( AISA_Gsc_Client::CONNECTION_OPTION );
		wp_safe_redirect( admin_url( 'admin.php?page=aisa-settings&gsc=disconnected' ) );
		exit;
	}

	/**
	 * admin-post handler: save the admin's pick from the candidate-property
	 * list shown when OAuth succeeded but auto-detection was ambiguous.
	 */
	public static function handle_gsc_select_property() {
		check_admin_referer( 'aisa_gsc_select_property' );
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'ai-site-assistant' ) );
		}
		$chosen = isset( $_POST['property'] ) ? sanitize_text_field( wp_unslash( $_POST['property'] ) ) : '';
		$conn   = AISA_Gsc_Client::get_connection();
		if ( '' !== $chosen && in_array( $chosen, $conn['candidates'], true ) ) {
			$conn['property']   = $chosen;
			$conn['candidates'] = array();
			update_option( AISA_Gsc_Client::CONNECTION_OPTION, $conn, false );
		}
		wp_safe_redirect( admin_url( 'admin.php?page=aisa-settings&gsc=connected' ) );
		exit;
	}

	/**
	 * Add a fixed, non-translatable body class on AISA's own admin pages so
	 * CSS can target them reliably. WordPress's own screen-id body class is
	 * derived from sanitize_title() of the menu TITLE text, which a
	 * translation plugin (or anything filtering admin menu titles) can
	 * change -- see the note on assets() for the same underlying issue.
	 *
	 * @param string $classes Space-separated body classes.
	 * @return string
	 */
	public static function body_class( $classes ) {
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only page-identity check, no state change.
		if ( in_array( $page, array( 'aisa-chat', 'aisa-mcp-connector' ), true ) ) {
			$classes .= ' aisa-plugin-page';
		}
		return $classes;
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
			'gsc_client_id'       => isset( $input['gsc_client_id'] ) ? trim( sanitize_text_field( $input['gsc_client_id'] ) ) : '',
			'gsc_client_secret'   => isset( $input['gsc_client_secret'] ) ? trim( sanitize_text_field( $input['gsc_client_secret'] ) ) : '',
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
	 * Matches on $_GET['page'] rather than the $hook suffix WordPress passes
	 * in. That suffix is derived from sanitize_title() of the menu TITLE
	 * text, not the slug we register -- so on sites with a translation
	 * plugin (or any theme/plugin that filters admin menu titles) it never
	 * equals the hardcoded string we'd otherwise have to guess, and the
	 * assets silently never enqueue. The page slug is ours and never
	 * changes, so matching on it is exact regardless of what WordPress
	 * computes the hook suffix to.
	 *
	 * @param string $hook Current admin page hook suffix (unused; kept for the action signature).
	 */
	public static function assets( $hook ) {
		unset( $hook );
		$page = isset( $_GET['page'] ) ? sanitize_key( wp_unslash( $_GET['page'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- read-only page-identity check, no state change.
		if ( ! in_array( $page, array( 'aisa-chat', 'aisa-mcp-connector' ), true ) ) {
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
						<th scope="row"><label for="aisa_gsc_client_id"><?php esc_html_e( 'Google OAuth Client ID', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_GSC_CLIENT_ID' ) && AISA_GSC_CLIENT_ID ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_GSC_CLIENT_ID constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[gsc_client_id]"
									id="aisa_gsc_client_id" type="text" class="regular-text"
									value="<?php echo esc_attr( $opts['gsc_client_id'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="aisa_gsc_client_secret"><?php esc_html_e( 'Google OAuth Client Secret', 'ai-site-assistant' ); ?></label></th>
						<td>
							<?php if ( defined( 'AISA_GSC_CLIENT_SECRET' ) && AISA_GSC_CLIENT_SECRET ) : ?>
								<p><strong><?php esc_html_e( 'Set via the AISA_GSC_CLIENT_SECRET constant in wp-config.php.', 'ai-site-assistant' ); ?></strong></p>
							<?php else : ?>
								<input name="<?php echo esc_attr( self::OPTION_KEY ); ?>[gsc_client_secret]"
									id="aisa_gsc_client_secret" type="password" class="regular-text"
									value="<?php echo esc_attr( $opts['gsc_client_secret'] ?? '' ); ?>"
									autocomplete="off" />
							<?php endif; ?>
							<p class="description">
								<?php
								printf(
									/* translators: %s: the redirect URI to register in Google Cloud Console, shown as a copyable <code> tag. */
									esc_html__( 'Optional, powers Google Search Console diagnostics (ranking pages/queries). Create an OAuth Client ID (type: Web application) in a Google Cloud project with the Search Console API enabled, and add this exact redirect URI to its "Authorized redirect URIs": %s. Save this page, then use the Connect button below.', 'ai-site-assistant' ),
									'<code>' . esc_html( AISA_Gsc_Client::get_redirect_uri() ) . '</code>'
								);
								?>
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><?php esc_html_e( 'Google Search Console', 'ai-site-assistant' ); ?></th>
						<td><?php self::render_gsc_connection_status(); ?></td>
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
				<h1 class="aisa-title">
					<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?>
					<span class="aisa-tagline"><?php esc_html_e( 'Your AI content &amp; SEO assistant', 'ai-site-assistant' ); ?></span>
				</h1>
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
		<div class="wrap aisa-onboarding">
			<header class="aisa-onboard-header">
				<div class="aisa-brand">
					<span class="aisa-brand-logo" aria-hidden="true">AI</span>
					<span class="aisa-brand-meta">
						<span class="aisa-brand-name"><?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?></span>
						<span class="aisa-brand-by"><?php esc_html_e( 'by betranslated', 'ai-site-assistant' ); ?></span>
					</span>
				</div>
				<span class="aisa-status-pill" data-connected="<?php echo $is_connected ? '1' : '0'; ?>">
					<?php echo $is_connected ? esc_html__( 'Connected', 'ai-site-assistant' ) : esc_html__( 'Not connected', 'ai-site-assistant' ); ?>
				</span>
			</header>

			<div class="aisa-mcp-hero">
				<h1><?php esc_html_e( 'Your AI just learned WordPress.', 'ai-site-assistant' ); ?></h1>
				<p>
					<?php esc_html_e( 'Connect this site to Claude, ChatGPT, Cursor, or any MCP-compatible AI client so it can draft, edit, and manage content directly — no chat box needed here.', 'ai-site-assistant' ); ?>
				</p>
				<a href="<?php echo esc_url( admin_url( 'admin.php?page=aisa-settings' ) ); ?>" class="aisa-cta-pill">
					<?php esc_html_e( 'Open AISA Workspace', 'ai-site-assistant' ); ?>
				</a>
			</div>
			
			<?php
			// Single source of truth: AISA_Skills::CATALOG, so this panel never
			// drifts out of sync with what load_skill actually recognizes.
			$available_skills = AISA_Skills::CATALOG;
			?>
			<section class="aisa-skills-panel">
				<h2><?php esc_html_e( 'Available Skills', 'ai-site-assistant' ); ?></h2>
				<p><?php esc_html_e( 'These are the skills the assistant can load on demand.', 'ai-site-assistant' ); ?></p>
				<div class="aisa-skills-grid">
					<?php foreach ( $available_skills as $skill_name => $skill_summary ) : ?>
						<article class="aisa-skill-card">
							<h3><?php echo esc_html( $skill_name ); ?></h3>
							<p><?php echo esc_html( $skill_summary ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>
			</section>

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
						<p><?php esc_html_e( 'Pick your app below for the exact clicks — menu names may shift slightly as these apps update.', 'ai-site-assistant' ); ?></p>

						<div class="aisa-tabs">
							<input type="radio" name="aisa_client_tab" id="aisa_tab_web" class="aisa-tab-radio" checked>
							<input type="radio" name="aisa_client_tab" id="aisa_tab_desktop" class="aisa-tab-radio">
							<input type="radio" name="aisa_client_tab" id="aisa_tab_cursor" class="aisa-tab-radio">

							<div class="aisa-tab-nav">
								<label for="aisa_tab_web" class="aisa-tab-label"><?php esc_html_e( 'Claude.ai (web)', 'ai-site-assistant' ); ?></label>
								<label for="aisa_tab_desktop" class="aisa-tab-label"><?php esc_html_e( 'Claude Desktop / Code', 'ai-site-assistant' ); ?></label>
								<label for="aisa_tab_cursor" class="aisa-tab-label"><?php esc_html_e( 'Cursor', 'ai-site-assistant' ); ?></label>
							</div>

							<div class="aisa-tab-panels">
								<div class="aisa-tab-panel" data-panel="web">
									<ol class="aisa-steps">
										<li><?php esc_html_e( 'In Claude.ai, open Settings → Connectors.', 'ai-site-assistant' ); ?></li>
										<li><?php esc_html_e( 'Click "Add custom connector".', 'ai-site-assistant' ); ?></li>
										<li>
											<?php esc_html_e( 'Give it a name (e.g. "AISA"), then paste this into the server URL field:', 'ai-site-assistant' ); ?>
											<div class="aisa-copy-row">
												<input type="text" readonly class="aisa-copy-field" id="aisa_oauth_url"
													value="<?php echo $is_connected ? esc_attr( $oauth_url ) : ''; ?>"
													placeholder="&#8212;" onclick="this.select()">
												<button type="button" class="button aisa-copy-btn" data-copy-target="aisa_oauth_url"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
											</div>
										</li>
										<li><?php esc_html_e( 'Click "Add", then click "Connect" next to the new connector.', 'ai-site-assistant' ); ?></li>
										<li><?php esc_html_e( 'You\'ll be redirected here — if you manage more than one site, pick this one, then click "Allow".', 'ai-site-assistant' ); ?></li>
										<li><?php esc_html_e( 'Done. The tools will show up the next time you start a chat.', 'ai-site-assistant' ); ?></li>
									</ol>
								</div>

								<div class="aisa-tab-panel" data-panel="desktop">
									<ol class="aisa-steps">
										<li><?php esc_html_e( 'In Claude Desktop or Claude Code, open Settings → Connectors.', 'ai-site-assistant' ); ?></li>
										<li><?php esc_html_e( 'Click "Add custom connector", give it a name, then paste this into the server URL field:', 'ai-site-assistant' ); ?>
											<div class="aisa-copy-row">
												<input type="text" readonly class="aisa-copy-field" id="aisa_connection_url"
													value="<?php echo $is_connected ? esc_attr( $connection_url ) : ''; ?>"
													placeholder="&#8212;" onclick="this.select()">
												<button type="button" class="button aisa-copy-btn" id="aisa_copy_url_btn" data-copy-target="aisa_connection_url"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
											</div>
										</li>
										<li><?php esc_html_e( 'Click "Add" to finish — this URL already includes your access token, so there\'s no separate approval step.', 'ai-site-assistant' ); ?></li>
										<li>
											<?php
											printf(
												/* translators: %s: claude mcp add CLI command, kept untranslated. */
												esc_html__( 'Claude Code alternative: run %s in your terminal instead of using the Settings UI.', 'ai-site-assistant' ),
												'<code>claude mcp add --transport http aisa &lt;url&gt;</code>' // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- static markup, no user input.
											);
											?>
										</li>
									</ol>
								</div>

								<div class="aisa-tab-panel" data-panel="cursor">
									<ol class="aisa-steps">
										<li><?php esc_html_e( 'In Cursor, open Settings → MCP.', 'ai-site-assistant' ); ?></li>
										<li><?php esc_html_e( 'Click "Add new global MCP server" — this opens your mcp.json file.', 'ai-site-assistant' ); ?></li>
										<li>
											<?php esc_html_e( 'Paste this block inside the "mcpServers" object, then save the file:', 'ai-site-assistant' ); ?>
											<div class="aisa-copy-row">
												<textarea readonly class="aisa-copy-field aisa-copy-field--code" id="aisa_cursor_config" rows="4" onclick="this.select()"><?php echo $is_connected ? esc_textarea( "\"aisa\": {\n  \"url\": \"{$connection_url}\"\n}" ) : ''; ?></textarea>
												<button type="button" class="button aisa-copy-btn" data-copy-target="aisa_cursor_config"><?php esc_html_e( 'Copy', 'ai-site-assistant' ); ?></button>
											</div>
										</li>
										<li><?php esc_html_e( 'Cursor detects the change automatically — no restart needed.', 'ai-site-assistant' ); ?></li>
									</ol>
								</div>
							</div>
						</div>

						<?php if ( $is_connected ) : ?>
							<p class="aisa-pair-confirm">
								<span class="aisa-pair-check">&#10003;</span>
								<?php esc_html_e( 'This site is paired and ready for your AI client.', 'ai-site-assistant' ); ?>
							</p>
						<?php endif; ?>
					</div>
				</li>
			</ul>

			<p class="aisa-mcp-footer">
				<?php esc_html_e( 'AISA Connector', 'ai-site-assistant' ); ?> &middot;
				<a href="https://github.com/multilang2025/mikebastin" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Documentation', 'ai-site-assistant' ); ?></a> &middot;
				<a href="https://github.com/multilang2025/mikebastin/issues" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Support', 'ai-site-assistant' ); ?></a>
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
			var cursorText = document.getElementById('aisa_cursor_config');
			var statusPill = document.querySelector('.aisa-status-pill');

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
						urlText.value = data.connection_url;
						if (oauthText) {
							oauthText.value = bridgeUrl.replace(/\/$/, '') + '/mcp.php';
						}
						if (cursorText) {
							cursorText.value = '"aisa": {\n  "url": "' + data.connection_url + '"\n}';
						}
						if (step2) { step2.dataset.done = '1'; }
						step3.dataset.active = '1';
						if (statusPill) {
							statusPill.dataset.connected = '1';
							statusPill.textContent = '<?php echo esc_js( __( 'Connected', 'ai-site-assistant' ) ); ?>';
						}
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
