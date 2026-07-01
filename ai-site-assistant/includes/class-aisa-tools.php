<?php
/**
 * Tool definitions and the executor that runs them against WordPress.
 *
 * Claude never touches the database — it emits tool_use blocks and this class
 * executes them through the WordPress APIs with capability checks, input
 * sanitization, and staleness guards. This is the security boundary.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Defines the tools exposed to Claude and executes them against WordPress.
 */
class AISA_Tools {

	/**
	 * Meta keys the assistant is allowed to write. Keep this tight so the
	 * model can't clobber other plugins' serialized option blobs.
	 *
	 * @var string[]
	 */
	const META_ALLOWLIST = array( 'aisa_note', '_yoast_wpseo_metadesc', '_yoast_wpseo_title' );

	/**
	 * Tool definitions sent to the model. Descriptions are prescriptive about
	 * *when* to call each tool — recent Opus models under-reach otherwise.
	 *
	 * @return array
	 */
	public static function definitions() {
		return array(
			array(
				'name'         => 'search_posts',
				'description'  => 'Search posts and pages by keyword, type, or status. '
					. 'Call this first to find existing content before editing it. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'query'     => array(
							'type'        => 'string',
							'description' => 'Search term.',
						),
						'post_type' => array(
							'type'        => 'string',
							'description' => 'post, page, or any registered type.',
						),
						'status'    => array(
							'type'        => 'string',
							'description' => 'publish, draft, etc.',
						),
						'limit'     => array(
							'type'        => 'integer',
							'description' => 'Max results (default 10).',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_post',
				'description'  => 'Read the full content and metadata of one post or page by ID. '
					. 'Always call this before update_post so you edit the current version.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id' => array( 'type' => 'integer' ),
					),
					'required'             => array( 'id' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'create_post',
				'description'  => 'Create a new post or page. Always created as a draft — '
					. 'publishing is a separate, user-confirmed step.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'title'     => array( 'type' => 'string' ),
						'content'   => array(
							'type'        => 'string',
							'description' => 'HTML or block markup.',
						),
						'post_type' => array(
							'type'        => 'string',
							'description' => 'post or page (default post).',
						),
					),
					'required'             => array( 'title', 'content' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'update_post',
				'description'  => 'Update an existing post or page. Call get_post first and pass back '
					. 'the expected_modified timestamp so stale edits are rejected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'                => array( 'type' => 'integer' ),
						'title'             => array( 'type' => 'string' ),
						'content'           => array( 'type' => 'string' ),
						'expected_modified' => array(
							'type'        => 'string',
							'description' => 'The post_modified value returned by get_post.',
						),
					),
					'required'             => array( 'id', 'expected_modified' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'publish_post',
				'description'  => 'Publish a draft or pending post or page (sets its status to '
					. 'published). Call get_post first and pass back expected_modified.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'                => array( 'type' => 'integer' ),
						'expected_modified' => array(
							'type'        => 'string',
							'description' => 'The post_modified value returned by get_post.',
						),
					),
					'required'             => array( 'id', 'expected_modified' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_site_context',
				'description'  => 'Get the active theme, registered post types, and active plugins. '
					. 'Call this when you need to understand how the site is built.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => new stdClass(),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'replace_in_post',
				'description'  => 'Make a TARGETED edit: replace an exact text snippet with new text '
					. 'in a post/page. Prefer this over update_post for small changes (links, a '
					. 'sentence) — far faster and avoids timeouts. Read with get_post first and pass '
					. 'back expected_modified.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'                => array( 'type' => 'integer' ),
						'find'              => array(
							'type'        => 'string',
							'description' => 'Exact text to find in the content.',
						),
						'replace'           => array(
							'type'        => 'string',
							'description' => 'Replacement text.',
						),
						'expected_modified' => array(
							'type'        => 'string',
							'description' => 'The post_modified value from get_post.',
						),
					),
					'required'             => array( 'id', 'find', 'replace', 'expected_modified' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'append_to_post',
				'description'  => 'Append a block of HTML to the end of a post/page (e.g. an author/'
					. 'EEAT box, a sources list, an FAQ). Faster than rewriting the whole post. Read '
					. 'with get_post first and pass back expected_modified.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'                => array( 'type' => 'integer' ),
						'html'              => array(
							'type'        => 'string',
							'description' => 'HTML to append.',
						),
						'expected_modified' => array(
							'type'        => 'string',
							'description' => 'The post_modified value from get_post.',
						),
					),
					'required'             => array( 'id', 'html', 'expected_modified' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'fact_check',
				'description'  => 'Verify a factual claim against the live web using Perplexity Sonar '
					. '(search-grounded). Call this BEFORE adding or keeping any statistic, date, '
					. 'quote, price, named study, or other checkable fact in content — never invent '
					. 'or guess these. Returns a verdict (True / False / Misleading / Unverifiable), '
					. 'a short explanation, and source URLs to cite. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'claim'   => array(
							'type'        => 'string',
							'description' => 'The single, specific statement to verify, e.g. '
								. '"The Eiffel Tower is 330 metres tall.".',
						),
						'context' => array(
							'type'        => 'string',
							'description' => 'Optional context to disambiguate the claim (topic, '
								. 'time period, location).',
						),
					),
					'required'             => array( 'claim' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'load_skill',
				'description'  => 'Load the on-demand playbook for a specific task. Call this once, right '
					. 'before you act, when a task matches one of the catalog entries in the system '
					. 'prompt (eeat, fact_checking, nlp_readability, internal_links, meta_tags, schema, '
					. 'page_builders). Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'skill' => array(
							'type'        => 'string',
							'description' => 'One of: ' . implode( ', ', array_keys( AISA_Skills::CATALOG ) ) . '.',
						),
					),
					'required'             => array( 'skill' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_seo',
				'description'  => 'Read a post\'s SEO meta tags (title, description, focus keyword, '
					. 'canonical, Open Graph, Twitter) and excerpt. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array( 'id' => array( 'type' => 'integer' ) ),
					'required'             => array( 'id' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'set_seo',
				'description'  => 'Update a post\'s SEO meta tags (Rank Math or Yoast). Pass any of '
					. 'meta_title, meta_description, focus_keyword, canonical, og_title, '
					. 'og_description, twitter_title, twitter_description. Fast — no content rewrite.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'                  => array( 'type' => 'integer' ),
						'meta_title'          => array( 'type' => 'string' ),
						'meta_description'    => array( 'type' => 'string' ),
						'focus_keyword'       => array( 'type' => 'string' ),
						'canonical'           => array( 'type' => 'string' ),
						'og_title'            => array( 'type' => 'string' ),
						'og_description'      => array( 'type' => 'string' ),
						'twitter_title'       => array( 'type' => 'string' ),
						'twitter_description' => array( 'type' => 'string' ),
					),
					'required'             => array( 'id' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_schema',
				'description'  => 'Read a post\'s Rank Math structured-data (schema) entries, decoded. '
					. 'Inspect schema before changing it. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array( 'id' => array( 'type' => 'integer' ) ),
					'required'             => array( 'id' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'set_meta',
				'description'  => 'Write one SEO/schema meta key (Rank Math / Yoast / AIO SEO keys '
					. 'only), e.g. rank_math_robots. For structured values pass JSON as the value '
					. 'string. Fast — no content rewrite.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'    => array( 'type' => 'integer' ),
						'key'   => array(
							'type'        => 'string',
							'description' => 'Meta key, e.g. rank_math_robots.',
						),
						'value' => array(
							'type'        => 'string',
							'description' => 'Value (JSON string for structured data).',
						),
					),
					'required'             => array( 'id', 'key', 'value' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'wp_cli_get',
				'description'  => 'Read-only site administration lookups (like WP-CLI, but native PHP -- '
					. 'no shell). command/action pairs: "plugin list", "theme list", "option get" (pass '
					. 'the option name as args[0]; allowlisted keys only), "user list", "core version".',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'command' => array(
							'type'        => 'string',
							'description' => 'plugin, theme, option, user, or core.',
						),
						'action'  => array(
							'type'        => 'string',
							'description' => 'list, get, or version depending on command.',
						),
						'args'    => array(
							'type'        => 'array',
							'items'       => array( 'type' => 'string' ),
							'description' => 'Positional arguments, e.g. the option name for "option get".',
						),
					),
					'required'             => array( 'command', 'action' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'wp_cli_set',
				'description'  => 'Site administration writes (like WP-CLI, but native PHP -- no shell). '
					. 'command/action pairs: "plugin activate"/"plugin deactivate" (target = plugin file, '
					. 'e.g. akismet/akismet.php), "theme activate" (target = stylesheet slug), "option '
					. 'update" (target = option name, allowlisted keys only; value = new value).',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'command' => array(
							'type'        => 'string',
							'description' => 'plugin, theme, or option.',
						),
						'action'  => array(
							'type'        => 'string',
							'description' => 'activate, deactivate, or update depending on command.',
						),
						'target'  => array(
							'type'        => 'string',
							'description' => 'Plugin file, theme stylesheet slug, or option name.',
						),
						'value'   => array(
							'type'        => 'string',
							'description' => 'New value, only used for "option update".',
						),
					),
					'required'             => array( 'command', 'action', 'target' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'discover_abilities',
				'description'  => 'List capabilities other plugins have registered via the WordPress '
					. 'Abilities API (WP 6.9+) -- e.g. SEO or forms plugins. Pass "name" to get one '
					. 'ability\'s full input/output schema before calling run_ability. Read-only. Returns '
					. 'an error if the site does not have the Abilities API.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'name' => array(
							'type'        => 'string',
							'description' => 'Optional. A specific ability name to get full schema detail for.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'run_ability',
				'description'  => 'Execute one ability discovered via discover_abilities. Always treated as '
					. 'a write and requires approval, since abilities are registered by arbitrary plugins '
					. 'and the API does not expose a reliable read/write flag.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'name'  => array(
							'type'        => 'string',
							'description' => 'Ability name, from discover_abilities.',
						),
						'input' => array(
							'type'        => 'object',
							'description' => 'Input matching the ability\'s input_schema.',
						),
					),
					'required'             => array( 'name' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'list_theme_files',
				'description'  => 'List a theme\'s files (php/css/js/json/html/txt only). Defaults to the '
					. 'active theme. Read-only. Load the theme_editing skill before making any theme change.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Theme slug. Defaults to the active theme.',
						),
						'subdir'     => array(
							'type'        => 'string',
							'description' => 'Optional subdirectory to list instead of the theme root.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'read_theme_file',
				'description'  => 'Read one theme file\'s contents. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Theme slug. Defaults to the active theme.',
						),
						'path'       => array(
							'type'        => 'string',
							'description' => 'File path relative to the theme root, e.g. "style.css".',
						),
					),
					'required'             => array( 'path' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'search_theme_files',
				'description'  => 'Search a theme\'s files for an exact string, returning file/line matches. '
					. 'Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Theme slug. Defaults to the active theme.',
						),
						'query'      => array(
							'type'        => 'string',
							'description' => 'Exact text to search for.',
						),
					),
					'required'             => array( 'query' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'create_draft_theme',
				'description'  => 'Copy the active theme into a sandboxed "<slug>-aisa-draft" directory. '
					. 'ALWAYS call this before editing any theme file -- write_theme_file refuses anything '
					. 'that is not a draft. Returns the draft\'s stylesheet slug.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => new stdClass(),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'write_theme_file',
				'description'  => 'Write one file\'s contents inside a DRAFT theme (from create_draft_theme) '
					. 'only -- refused for any non-draft stylesheet. PHP files are syntax-checked before '
					. 'writing.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Draft theme stylesheet slug, from create_draft_theme.',
						),
						'path'       => array(
							'type'        => 'string',
							'description' => 'File path relative to the theme root.',
						),
						'content'    => array(
							'type'        => 'string',
							'description' => 'Full new file contents.',
						),
					),
					'required'             => array( 'stylesheet', 'path', 'content' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_theme_preview_url',
				'description'  => 'Get a Customizer live-preview link for a theme (draft or not) without '
					. 'activating it -- show this to the user before publish_draft_theme. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array( 'type' => 'string' ),
					),
					'required'             => array( 'stylesheet' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'publish_draft_theme',
				'description'  => 'Activate a draft theme (from create_draft_theme) as the live theme. Only '
					. 'call this after the user has seen get_theme_preview_url and approved it.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Draft theme stylesheet slug.',
						),
					),
					'required'             => array( 'stylesheet' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'delete_draft_theme',
				'description'  => 'Delete an abandoned draft theme\'s files. Refuses anything that is not an '
					. 'AISA draft, and refuses the currently active theme.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'stylesheet' => array(
							'type'        => 'string',
							'description' => 'Draft theme stylesheet slug.',
						),
					),
					'required'             => array( 'stylesheet' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'search_images',
				'description'  => 'Search Unsplash for stock photos. Returns each photo\'s id, description, '
					. 'a regular/small preview URL, photographer credit, and a download_location -- pass '
					. 'the chosen photo\'s url and download_location straight into upload_media. Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'query'    => array(
							'type'        => 'string',
							'description' => 'Search term, e.g. "coffee shop interior".',
						),
						'per_page' => array(
							'type'        => 'integer',
							'description' => 'Max results (default 10, max 30).',
						),
					),
					'required'             => array( 'query' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'upload_media',
				'description'  => 'Download an image URL into the media library, optionally attaching it to '
					. 'a post and/or setting it as the post\'s featured image. Use with search_images '
					. '(pass its url and download_location) or any other direct image URL.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'url'               => array(
							'type'        => 'string',
							'description' => 'Direct image URL to download.',
						),
						'download_location' => array(
							'type'        => 'string',
							'description' => 'Optional. The Unsplash download_location from search_images -- required by Unsplash\'s terms when a searched photo is actually used.',
						),
						'post_id'           => array(
							'type'        => 'integer',
							'description' => 'Optional. Attach the media to this post.',
						),
						'set_featured'      => array(
							'type'        => 'boolean',
							'description' => 'Optional. Set as post_id\'s featured image (requires post_id).',
						),
						'alt_text'          => array( 'type' => 'string' ),
						'caption'           => array( 'type' => 'string' ),
					),
					'required'             => array( 'url' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_page_html',
				'description'  => 'Fetch a post/page\'s LIVE RENDERED HTML (its actual public output, not '
					. 'raw post_content) -- use to check how an edit actually looks, or to see content a '
					. 'page builder generates that isn\'t in post_content. No JavaScript is executed. '
					. 'Read-only.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id' => array(
							'type'        => 'integer',
							'description' => 'Post/page ID. Its permalink is fetched.',
						),
					),
					'required'             => array( 'id' ),
					'additionalProperties' => false,
				),
			),
		);
	}

	/**
	 * Tools that change site state and therefore require explicit user
	 * confirmation before execution (hard-to-reverse actions).
	 *
	 * @return string[]
	 */
	public static function destructive_tools() {
		return array(
			'create_post',
			'update_post',
			'publish_post',
			'replace_in_post',
			'append_to_post',
			'set_seo',
			'set_meta',
			'wp_cli_set',
			'run_ability',
			'create_draft_theme',
			'write_theme_file',
			'publish_draft_theme',
			'delete_draft_theme',
			'upload_media',
		);
	}

	/**
	 * Dispatch a tool call to its handler.
	 *
	 * @param string $name  Tool name.
	 * @param array  $input Tool input.
	 * @return array { content: string|array, is_error?: bool }
	 */
	public static function dispatch( $name, array $input ) {
		switch ( $name ) {
			case 'search_posts':
				return self::search_posts( $input );
			case 'get_post':
				return self::get_post( $input );
			case 'create_post':
				return self::create_post( $input );
			case 'update_post':
				return self::update_post( $input );
			case 'publish_post':
				return self::publish_post( $input );
			case 'get_site_context':
				return self::get_site_context();
			case 'fact_check':
				return self::fact_check( $input );
			case 'load_skill':
				return self::load_skill( $input );
			case 'replace_in_post':
				return self::replace_in_post( $input );
			case 'append_to_post':
				return self::append_to_post( $input );
			case 'get_seo':
				return self::get_seo( $input );
			case 'set_seo':
				return self::set_seo( $input );
			case 'get_schema':
				return self::get_schema( $input );
			case 'set_meta':
				return self::set_meta( $input );
			case 'wp_cli_get':
				return AISA_WPCLI::get( $input );
			case 'wp_cli_set':
				return AISA_WPCLI::set( $input );
			case 'discover_abilities':
				return AISA_Abilities::discover( $input );
			case 'run_ability':
				return AISA_Abilities::run( $input );
			case 'list_theme_files':
				return AISA_Theme_Files::list_files( $input );
			case 'read_theme_file':
				return AISA_Theme_Files::read_file( $input );
			case 'search_theme_files':
				return AISA_Theme_Files::search_files( $input );
			case 'create_draft_theme':
				return AISA_Theme_Files::create_draft( $input );
			case 'write_theme_file':
				return AISA_Theme_Files::write_file( $input );
			case 'get_theme_preview_url':
				return AISA_Theme_Files::preview_url( $input );
			case 'publish_draft_theme':
				return AISA_Theme_Files::publish_draft( $input );
			case 'delete_draft_theme':
				return AISA_Theme_Files::delete_draft( $input );
			case 'search_images':
				return self::search_images( $input );
			case 'upload_media':
				return self::upload_media( $input );
			case 'get_page_html':
				return self::get_page_html( $input );
			default:
				return self::error( "Unknown tool: {$name}" );
		}
	}

	/**
	 * Build a standard error tool result.
	 *
	 * @param string $message Error message.
	 * @return array Tool result flagged as an error.
	 */
	private static function error( $message ) {
		return array(
			'content'  => $message,
			'is_error' => true,
		);
	}

	/**
	 * Search posts and pages.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of matches.
	 */
	private static function search_posts( array $in ) {
		$q = new WP_Query(
			array(
				's'              => $in['query'] ?? '',
				'post_type'      => $in['post_type'] ?? 'any',
				'post_status'    => $in['status'] ?? 'any',
				'posts_per_page' => min( (int) ( $in['limit'] ?? 10 ), 50 ),
			)
		);

		$rows = array();
		foreach ( $q->posts as $p ) {
			$rows[] = array(
				'id'     => $p->ID,
				'title'  => $p->post_title,
				'type'   => $p->post_type,
				'status' => $p->post_status,
				'url'    => get_permalink( $p ),
			);
		}
		return array( 'content' => wp_json_encode( $rows ) );
	}

	/**
	 * Read one post or page.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the post as JSON, or an error.
	 */
	private static function get_post( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return self::error( 'Post not found.' );
		}
		return array(
			'content' => wp_json_encode(
				array(
					'id'                => $p->ID,
					'title'             => $p->post_title,
					'content'           => $p->post_content,
					'status'            => $p->post_status,
					'type'              => $p->post_type,
					'expected_modified' => $p->post_modified,
				)
			),
		);
	}

	/**
	 * Create a new draft post or page.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result describing the created draft, or an error.
	 */
	private static function create_post( array $in ) {
		$type = sanitize_key( $in['post_type'] ?? 'post' );
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		$id = wp_insert_post(
			array(
				'post_title'   => sanitize_text_field( $in['title'] ?? '' ),
				'post_content' => wp_kses_post( $in['content'] ?? '' ),
				'post_type'    => $type,
				'post_status'  => 'draft', // Never auto-publish.
			),
			true
		);
		if ( is_wp_error( $id ) ) {
			return self::error( $id->get_error_message() );
		}
		AISA_Audit_Log::record( 'create_post', $id, $in );
		return array( 'content' => "Created draft {$type} #{$id}: " . get_edit_post_link( $id, 'raw' ) );
	}

	/**
	 * Update an existing post or page with a staleness guard.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result confirming the update, or an error.
	 */
	private static function update_post( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return self::error( 'Post not found.' );
		}
		// Staleness guard: reject if the post changed since the model read it.
		if ( ( $in['expected_modified'] ?? '' ) !== $p->post_modified ) {
			return self::error( 'Post changed since you read it. Call get_post again, then retry.' );
		}

		$update = array( 'ID' => $id );
		if ( isset( $in['title'] ) ) {
			$update['post_title'] = sanitize_text_field( $in['title'] );
		}
		if ( isset( $in['content'] ) ) {
			$update['post_content'] = wp_kses_post( $in['content'] );
		}

		$result = wp_update_post( $update, true );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}
		AISA_Audit_Log::record( 'update_post', $id, $in );
		return array( 'content' => "Updated #{$id}." );
	}

	/**
	 * Publish a draft or pending post or page, with a staleness guard.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result confirming publication, or an error.
	 */
	private static function publish_post( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return self::error( 'Post not found.' );
		}
		$type_object = get_post_type_object( $p->post_type );
		if ( ! $type_object || ! current_user_can( $type_object->cap->publish_posts ) ) {
			return self::error( 'You do not have permission to publish this post type.' );
		}
		if ( 'publish' === $p->post_status ) {
			return self::error( 'Post is already published.' );
		}
		// Staleness guard: reject if the post changed since the model read it.
		if ( ( $in['expected_modified'] ?? '' ) !== $p->post_modified ) {
			return self::error( 'Post changed since you read it. Call get_post again, then retry.' );
		}

		$result = wp_update_post(
			array(
				'ID'          => $id,
				'post_status' => 'publish',
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}
		AISA_Audit_Log::record( 'publish_post', $id, $in );
		return array( 'content' => "Published #{$id}: " . get_permalink( $id ) );
	}

	/**
	 * Return basic site context (theme, post types, active plugins).
	 *
	 * @return array Tool result with the context as JSON.
	 */
	private static function get_site_context() {
		$theme = wp_get_theme();
		return array(
			'content' => wp_json_encode(
				array(
					'theme'          => $theme->get( 'Name' ) . ' ' . $theme->get( 'Version' ),
					'post_types'     => array_values( get_post_types( array( 'public' => true ) ) ),
					'active_plugins' => array_values( (array) get_option( 'active_plugins', array() ) ),
				)
			),
		);
	}

	/**
	 * Fact-check a claim against the live web via Perplexity Sonar (OpenRouter).
	 *
	 * Read-only: it queries an external model and returns the verdict, so no
	 * approval gate is needed. The claim text is bounded to keep the request
	 * small and predictable.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the verdict, explanation, and sources, or an error.
	 */
	private static function fact_check( array $in ) {
		$claim = trim( (string) ( $in['claim'] ?? '' ) );
		if ( '' === $claim ) {
			return self::error( 'Provide a specific "claim" to fact-check.' );
		}
		// Bound the input so a runaway prompt can't be smuggled through as a "claim".
		$claim   = mb_substr( $claim, 0, 1000 );
		$context = mb_substr( trim( (string) ( $in['context'] ?? '' ) ), 0, 1000 );

		$user = 'Claim to verify: ' . $claim;
		if ( '' !== $context ) {
			$user .= "\nContext: " . $context;
		}

		$response = AISA_OpenRouter_Client::create(
			array(
				array(
					'role'    => 'system',
					'content' => "You are a rigorous fact-checker. Verify the user's claim using "
						. "current web sources. Respond in this exact format:\n"
						. "Verdict: <True | False | Misleading | Unverifiable>\n"
						. "Explanation: <2-3 sentences, citing what the sources say>\n"
						. 'Be precise about numbers and dates. If the sources disagree or are '
						. 'insufficient, say Unverifiable rather than guessing.',
				),
				array(
					'role'    => 'user',
					'content' => $user,
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}

		$verdict = $response['choices'][0]['message']['content'] ?? '';
		if ( '' === trim( (string) $verdict ) ) {
			return self::error( 'Fact-check returned no verdict. Try rephrasing the claim.' );
		}

		// Perplexity models return the sources they used as a top-level `citations`
		// array (URLs); newer responses may instead attach them as message
		// annotations. Surface whatever is present so the model can cite them.
		$sources = array();
		if ( ! empty( $response['citations'] ) && is_array( $response['citations'] ) ) {
			$sources = array_values( $response['citations'] );
		} elseif ( ! empty( $response['choices'][0]['message']['annotations'] ) && is_array( $response['choices'][0]['message']['annotations'] ) ) {
			foreach ( $response['choices'][0]['message']['annotations'] as $annotation ) {
				if ( isset( $annotation['url_citation']['url'] ) ) {
					$sources[] = $annotation['url_citation']['url'];
				}
			}
		}

		return array(
			'content' => wp_json_encode(
				array(
					'claim'   => $claim,
					'model'   => AISA_OpenRouter_Client::get_model(),
					'verdict' => trim( (string) $verdict ),
					'sources' => $sources,
				)
			),
		);
	}

	/**
	 * Return the full playbook body for one on-demand skill.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the playbook text, or an error listing valid names.
	 */
	private static function load_skill( array $in ) {
		$name = sanitize_key( (string) ( $in['skill'] ?? '' ) );
		$body = AISA_Skills::body( $name );
		if ( null === $body ) {
			return self::error(
				'Unknown skill "' . $name . '". Available: '
				. implode( ', ', array_keys( AISA_Skills::CATALOG ) ) . '.'
			);
		}
		return array( 'content' => $body );
	}

	/**
	 * Replace an exact text snippet inside a post's content (targeted edit).
	 *
	 * Much cheaper than rewriting the whole post, which keeps long edits under
	 * gateway timeouts. Guards on permission and staleness like update_post.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result confirming the replacement, or an error.
	 */
	private static function replace_in_post( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return self::error( 'Post not found.' );
		}
		if ( ( $in['expected_modified'] ?? '' ) !== $p->post_modified ) {
			return self::error( 'Post changed since you read it. Call get_post again, then retry.' );
		}

		$find = (string) ( $in['find'] ?? '' );
		if ( '' === $find ) {
			return self::error( 'The "find" text is empty.' );
		}
		$count = substr_count( $p->post_content, $find );
		if ( 0 === $count ) {
			return self::error( 'The "find" text was not found in the content. Read the post again and copy an exact snippet.' );
		}
		if ( $count > 1 ) {
			return self::error( "The \"find\" text appears {$count} times; make it longer/unique so exactly one match is replaced." );
		}

		$new_content = str_replace( $find, wp_kses_post( $in['replace'] ?? '' ), $p->post_content );
		$result      = wp_update_post(
			array(
				'ID'           => $id,
				'post_content' => $new_content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}
		AISA_Audit_Log::record( 'replace_in_post', $id, array( 'find' => $find ) );
		return array( 'content' => "Replaced one snippet in #{$id}." );
	}

	/**
	 * Append a block of HTML to the end of a post's content (targeted edit).
	 *
	 * @param array $in Tool input.
	 * @return array Tool result confirming the append, or an error.
	 */
	private static function append_to_post( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return self::error( 'Post not found.' );
		}
		if ( ( $in['expected_modified'] ?? '' ) !== $p->post_modified ) {
			return self::error( 'Post changed since you read it. Call get_post again, then retry.' );
		}

		$html = wp_kses_post( $in['html'] ?? '' );
		if ( '' === trim( $html ) ) {
			return self::error( 'The "html" to append is empty.' );
		}
		$result = wp_update_post(
			array(
				'ID'           => $id,
				'post_content' => $p->post_content . "\n\n" . $html,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}
		AISA_Audit_Log::record( 'append_to_post', $id, array( 'bytes' => strlen( $html ) ) );
		return array( 'content' => "Appended HTML to #{$id}." );
	}

	/**
	 * Read a post's SEO meta tags and excerpt.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with SEO fields as JSON, or an error.
	 */
	private static function get_seo( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		return array( 'content' => wp_json_encode( AISA_SEO::read_fields( $id ) ) );
	}

	/**
	 * Update a post's SEO meta tags (Rank Math or Yoast).
	 *
	 * @param array $in Tool input.
	 * @return array Tool result describing applied/rejected fields, or an error.
	 */
	private static function set_seo( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$fields = array();
		foreach ( array( 'meta_title', 'meta_description', 'focus_keyword', 'canonical', 'og_title', 'og_description', 'twitter_title', 'twitter_description' ) as $field ) {
			if ( isset( $in[ $field ] ) ) {
				$fields[ $field ] = (string) $in[ $field ];
			}
		}
		if ( empty( $fields ) ) {
			return self::error( 'No SEO fields provided. Pass at least one of meta_title, meta_description, etc.' );
		}
		return array( 'content' => wp_json_encode( AISA_SEO::write_fields( $id, $fields ) ) );
	}

	/**
	 * Read a post's Rank Math structured-data (schema) entries, decoded.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with schema meta as JSON, or an error.
	 */
	private static function get_schema( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		return array( 'content' => wp_json_encode( AISA_Meta::read_meta( $id, 'rank_math_schema' ) ) );
	}

	/**
	 * Write one allowlisted SEO/schema meta key. A JSON-string value is decoded
	 * to a structure first (so schema objects round-trip correctly).
	 *
	 * @param array $in Tool input.
	 * @return array Tool result confirming the write, or an error.
	 */
	private static function set_meta( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$value = $in['value'] ?? '';
		if ( is_string( $value ) && '' !== $value && ( '{' === $value[0] || '[' === $value[0] ) ) {
			$decoded = json_decode( $value, true );
			if ( null !== $decoded ) {
				$value = $decoded;
			}
		}
		$result = AISA_Meta::write_meta( $id, (string) ( $in['key'] ?? '' ), $value );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}
		return array( 'content' => wp_json_encode( $result ) );
	}

	/**
	 * Search Unsplash for stock photos.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of photos, or an error.
	 */
	private static function search_images( array $in ) {
		if ( ! current_user_can( 'upload_files' ) ) {
			return self::error( 'Permission denied.' );
		}
		$query = trim( (string) ( $in['query'] ?? '' ) );
		if ( '' === $query ) {
			return self::error( 'Provide a "query" to search for.' );
		}

		$response = AISA_Unsplash_Client::search( $query, (int) ( $in['per_page'] ?? 10 ) );
		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}

		$rows = array();
		foreach ( (array) ( $response['results'] ?? array() ) as $photo ) {
			$rows[] = array(
				'id'                => $photo['id'] ?? '',
				'description'       => $photo['alt_description'] ?? ( $photo['description'] ?? '' ),
				'url'               => $photo['urls']['regular'] ?? '',
				'thumb_url'         => $photo['urls']['thumb'] ?? '',
				'photographer'      => $photo['user']['name'] ?? '',
				'photographer_url'  => $photo['user']['links']['html'] ?? '',
				'download_location' => $photo['links']['download_location'] ?? '',
			);
		}
		return array( 'content' => wp_json_encode( $rows ) );
	}

	/**
	 * Download an image URL into the media library, optionally attaching it
	 * to a post and/or setting it as the post's featured image.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result describing the uploaded attachment, or an error.
	 */
	private static function upload_media( array $in ) {
		if ( ! current_user_can( 'upload_files' ) ) {
			return self::error( 'Permission denied.' );
		}
		$url = (string) ( $in['url'] ?? '' );
		if ( '' === $url ) {
			return self::error( 'Provide an image "url" to download.' );
		}
		$post_id = (int) ( $in['post_id'] ?? 0 );
		if ( $post_id && ! current_user_can( 'edit_post', $post_id ) ) {
			return self::error( 'Permission denied for that post.' );
		}

		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$caption       = isset( $in['caption'] ) ? sanitize_text_field( $in['caption'] ) : null;
		$attachment_id = media_sideload_image( $url, $post_id, $caption, 'id' );
		if ( is_wp_error( $attachment_id ) ) {
			return self::error( $attachment_id->get_error_message() );
		}

		if ( isset( $in['alt_text'] ) ) {
			update_post_meta( $attachment_id, '_wp_attachment_image_alt', sanitize_text_field( $in['alt_text'] ) );
		}
		if ( ! empty( $in['set_featured'] ) && $post_id ) {
			set_post_thumbnail( $post_id, $attachment_id );
		}
		if ( ! empty( $in['download_location'] ) ) {
			AISA_Unsplash_Client::ping_download( (string) $in['download_location'] );
		}

		AISA_Audit_Log::record( 'upload_media', $post_id ? $post_id : null, array( 'attachment_id' => $attachment_id ) );
		return array(
			'content' => wp_json_encode(
				array(
					'attachment_id' => $attachment_id,
					'url'           => wp_get_attachment_url( $attachment_id ),
					'featured_on'   => ! empty( $in['set_featured'] ) && $post_id ? $post_id : null,
				)
			),
		);
	}

	/**
	 * Fetch a post's live rendered HTML via its permalink. Bounded in length
	 * so a huge page can't blow up the conversation's context.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the HTML (possibly truncated), or an error.
	 */
	private static function get_page_html( array $in ) {
		$id = (int) ( $in['id'] ?? 0 );
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return self::error( 'Permission denied for this post.' );
		}
		$permalink = get_permalink( $id );
		if ( ! $permalink ) {
			return self::error( 'Post not found, or it has no public permalink.' );
		}

		$response = wp_remote_get( $permalink, array( 'timeout' => 20 ) );
		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}

		$html      = wp_remote_retrieve_body( $response );
		$max_bytes = 20000;
		$truncated = strlen( $html ) > $max_bytes;
		if ( $truncated ) {
			$html = substr( $html, 0, $max_bytes ) . "\n<!-- AISA: truncated at {$max_bytes} bytes -->";
		}

		return array(
			'content' => wp_json_encode(
				array(
					'url'       => $permalink,
					'status'    => wp_remote_retrieve_response_code( $response ),
					'html'      => $html,
					'truncated' => $truncated,
				)
			),
		);
	}
}
