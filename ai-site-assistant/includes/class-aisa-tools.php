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
	 * Appended to every generate_image prompt server-side, unconditionally --
	 * never left to the model to remember to ask for. Placed last in the
	 * prompt (a trailing hard-constraint reminder tends to be respected more
	 * reliably than a leading one for this class of image model).
	 *
	 * @var string
	 */
	const IMAGE_STYLE_SUFFIX = 'Style: photorealistic, hyper-realistic professional photography, '
		. 'natural lighting, ultra-detailed, sharp focus. Hard constraint -- absolutely exclude all '
		. 'text: no words, no letters, no numbers, no captions, no signage, no logos, no watermarks, '
		. 'no writing of any kind anywhere in the image.';

	/**
	 * How long a generated image stays cached server-side, waiting for
	 * upload_media to commit it. Long enough to review and approve; short
	 * enough not to leave large blobs sitting in the options table.
	 *
	 * @var int
	 */
	const GENERATED_IMAGE_TTL = 15 * MINUTE_IN_SECONDS;

	/**
	 * Transient key prefix for a generate_image result, keyed by image_id.
	 * Also read directly by AISA_Agent to build a visual preview for the
	 * write-approval dialog without needing a full dispatch() round trip.
	 *
	 * @var string
	 */
	const GENERATED_IMAGE_TRANSIENT_PREFIX = 'aisa_gen_img_';

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
				'name'         => 'db_query',
				'description'  => 'Run a read-only SELECT against this site\'s database -- the escape '
					. 'hatch for data no other tool covers: a form plugin\'s entries (Formidable, '
					. 'Gravity Forms, WPForms...), WooCommerce order meta, or any other plugin\'s custom '
					. 'table. Use "{prefix}" instead of guessing the table prefix, e.g. '
					. '"SELECT * FROM {prefix}frm_items WHERE created_at >= \'2026-07-01\' LIMIT 200". '
					. 'SELECT (and DESCRIBE/SHOW/EXPLAIN SELECT) only -- mutating statements are rejected '
					. 'outright, there is no write path here. A LIMIT is enforced automatically (default '
					. '100, max 1000) if the query doesn\'t already have one. Avoid selecting from '
					. 'wp_options/wp_usermeta/wp_users unless the user explicitly asked about site '
					. 'config, users, or secrets -- those tables can contain API keys and credentials. '
					. 'Needs an administrator account.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'sql'   => array(
							'type'        => 'string',
							'description' => 'A single SELECT (or DESCRIBE/SHOW/EXPLAIN SELECT) statement. Use "{prefix}" for the table prefix.',
						),
						'limit' => array(
							'type'        => 'integer',
							'description' => 'Row cap for SELECT results if the query has no LIMIT of its own (default 100, max 1000).',
						),
					),
					'required'             => array( 'sql' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'replace_in_post',
				'description'  => 'Make a TARGETED edit: replace an exact text snippet with new text '
					. 'in a post/page. Prefer this over update_post for small changes (links, a '
					. 'sentence) — far faster and avoids timeouts, and safer: the edit only applies if '
					. '"find" still matches the current content exactly once, so there\'s no separate '
					. 'staleness timestamp to keep in sync. Read with get_post first to get the text to '
					. 'match against. On an Elementor or Divi page, the result may include a WARNING -- '
					. 'read it; on Elementor it means this edit likely won\'t appear on the live page '
					. '(content lives in _elementor_data, not post_content), on Divi it means the touched '
					. 'text looks like it crosses a shortcode-attribute boundary.',
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
							'description' => 'Unused, accepted for backward compatibility only. The '
								. '"find" match itself is the safety check.',
						),
					),
					'required'             => array( 'id', 'find', 'replace' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'append_to_post',
				'description'  => 'Append a block of HTML to the end of a post/page (e.g. an author/'
					. 'EEAT box, a sources list, an FAQ). Faster than rewriting the whole post. Read '
					. 'with get_post first and pass back expected_modified. On an Elementor or Divi page, '
					. 'the result may include a WARNING -- read it; on Elementor it means this likely '
					. 'won\'t appear on the live page (content lives in _elementor_data, not post_content).',
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
				'name'         => 'bulk_replace_in_posts',
				'description'  => 'Apply the SAME exact text replacement across MULTIPLE posts/pages in '
					. 'one call (e.g. fixing a broken URL, phone number, or shortcode across a whole '
					. 'site). Prefer this over calling replace_in_post one post at a time. Each post is '
					. 'independently safe: a post is only touched if "find" matches its current content '
					. 'exactly once, otherwise it\'s skipped (not found, or ambiguous) and reported as '
					. 'such -- one bad match never blocks the rest of the batch. Max 50 posts per call. '
					. 'Any succeeded post on Elementor or Divi may carry a per-post "warning" field in the '
					. 'results -- read those before assuming the whole batch is safe to move on from.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'ids'     => array(
							'type'        => 'array',
							'items'       => array( 'type' => 'integer' ),
							'description' => 'Post/page IDs to update (max 50 per call).',
						),
						'find'    => array(
							'type'        => 'string',
							'description' => 'Exact text to find in each post\'s content.',
						),
						'replace' => array(
							'type'        => 'string',
							'description' => 'Replacement text, applied identically to every matching post.',
						),
					),
					'required'             => array( 'ids', 'find', 'replace' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'flush_caches',
				'description'  => 'Flush known caching layers (WordPress object cache, and whichever of '
					. 'Elementor, WP Rocket, W3 Total Cache, LiteSpeed Cache, WP Super Cache, WP Fastest '
					. 'Cache, or SiteGround Optimizer are actually active) so a content change becomes '
					. 'visible immediately instead of waiting for cache expiry. Call this after a content '
					. 'edit if the user reports not seeing the change on the live site. Only touches '
					. 'caches; never touches content. Needs an administrator account.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => new stdClass(),
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
				'description'  => 'Load the on-demand playbook for a specific task, right before you act on a '
					. "matching one -- do not guess an approach from a skill's one-line summary alone. "
					. "Available skills:\n" . AISA_Skills::catalog_text() . "\nRead-only.",
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
					. 'only), e.g. rank_math_robots -- including full JSON-LD schema objects via keys '
					. 'like rank_math_schema_Article (get_schema shows which keys exist). For '
					. 'structured values pass JSON as the value string; it round-trips as a real '
					. 'structure, not a JSON-string blob. Fast — no content rewrite.',
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
				'name'         => 'generate_image',
				'description'  => 'Generate an ORIGINAL image from a text description (Nano Banana Pro / '
					. 'Gemini 3 Pro Image) -- use this instead of search_images when no suitable stock '
					. 'photo exists, or the user wants custom artwork. Hyper-realism and a strict '
					. 'no-text-in-image constraint are enforced automatically on every generation; do not '
					. 'add those to your prompt yourself -- focus the prompt entirely on the scene: '
					. 'subject, composition, lighting, mood. Load the image_generation skill before using '
					. 'this. Returns an image_id (NOT the raw image) -- pass that id into upload_media to '
					. 'commit it. Read-only (the image is only cached server-side until you upload it).',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'prompt'        => array(
							'type'        => 'string',
							'description' => 'Describe ONLY the scene (subject, setting, composition, lighting, mood). Do not mention text/words or photorealism -- those are added automatically.',
						),
						'aspect_ratio'  => array(
							'type'        => 'string',
							'description' => 'Optional free-form hint folded into the prompt, e.g. "16:9 widescreen" or "square". Omit to let the model choose.',
						),
						'contrast_note' => array(
							'type'        => 'string',
							'description' => 'If generating more than one image for the same task, briefly state how this one differs from the others you already generated (angle, subject, palette, mood) so the set doesn\'t look repetitive.',
						),
					),
					'required'             => array( 'prompt' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'upload_media',
				'description'  => 'Commit an image into the media library, optionally attaching it to a post '
					. 'and/or setting it as the post\'s featured image. Pass EITHER url (from search_images, '
					. 'or any direct image URL) OR image_id (from generate_image) -- not both.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'url'               => array(
							'type'        => 'string',
							'description' => 'Direct image URL to download (from search_images or elsewhere).',
						),
						'image_id'          => array(
							'type'        => 'string',
							'description' => 'The image_id returned by generate_image.',
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
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'get_page_html',
				'description'  => 'Fetch a post/page\'s LIVE RENDERED HTML (its actual public output, not '
					. 'raw post_content) -- use to check how an edit actually looks, or to see content a '
					. 'page builder generates that isn\'t in post_content. No JavaScript is executed. '
					. 'Takes a post/page ID, not a URL -- call search_posts first if you only know the URL '
					. 'or title. Read-only.',
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
			array(
				'name'         => 'ahrefs_top_pages',
				'description'  => 'Rank a site\'s pages by estimated monthly organic search traffic (via '
					. 'Ahrefs). Use order="worst" to find the LEAST-performing articles (lowest traffic), '
					. 'or order="best" for top performers. Point target at a competitor domain to see '
					. 'their best-performing content for improvement ideas. Read-only. Needs an Ahrefs '
					. 'API key.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'target'  => array(
							'type'        => 'string',
							'description' => 'Domain or URL to analyze. Defaults to this site. Pass a competitor domain to analyze theirs.',
						),
						'order'   => array(
							'type'        => 'string',
							'enum'        => array( 'worst', 'best' ),
							'description' => 'worst = lowest-traffic pages first (default); best = highest first.',
						),
						'limit'   => array(
							'type'        => 'integer',
							'description' => 'Max pages to return (default 20, max 100).',
						),
						'country' => array(
							'type'        => 'string',
							'description' => 'Optional two-letter country code to scope to one market, e.g. us, gb, es.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'ahrefs_organic_competitors',
				'description'  => 'List the domains competing with a site in organic search (via Ahrefs), '
					. 'each with its domain rating, shared keywords, and keywords_competitor (keywords '
					. 'they rank for that your target does not -- your content-gap / improvement '
					. 'opportunity). Defaults to this site. Read-only. Needs an Ahrefs API key.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'target'  => array(
							'type'        => 'string',
							'description' => 'Domain to analyze. Defaults to this site.',
						),
						'country' => array(
							'type'        => 'string',
							'description' => 'Two-letter country code for the market (default us). Set to your main market.',
						),
						'limit'   => array(
							'type'        => 'integer',
							'description' => 'Max competitors to return (default 10, max 50).',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'ahrefs_domain_metrics',
				'description'  => 'Get a domain\'s headline organic SEO metrics (via Ahrefs): estimated '
					. 'monthly organic traffic, number of ranking keywords, keywords in the top 3, and '
					. 'estimated traffic value (USD cents -- divide by 100 for dollars). Call once per '
					. 'domain to compare your site head-to-head with a competitor. Read-only. Needs an '
					. 'Ahrefs API key.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'target'  => array(
							'type'        => 'string',
							'description' => 'Domain or URL. Defaults to this site.',
						),
						'country' => array(
							'type'        => 'string',
							'description' => 'Optional two-letter country code to scope to one market.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'seo_competitor_report',
				'description'  => 'One-shot competitor comparison for a specific page on this site: this '
					. 'domain\'s Ahrefs metrics, its top organic competitor (or one you specify), that '
					. 'competitor\'s metrics and best-performing pages, and the full content of the page '
					. 'you\'re improving -- all in a single call. Use this INSTEAD of calling '
					. 'ahrefs_domain_metrics, ahrefs_organic_competitors, ahrefs_top_pages, and get_post '
					. 'separately to compare one page against competitors; each of those is a full round '
					. 'trip and chaining them one-by-one is much slower for no benefit. Read-only. Needs an '
					. 'Ahrefs API key.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'page'       => array(
							'type'        => 'string',
							'description' => 'The page to improve: a post/page ID, full URL, or path (e.g. "/my-page/").',
						),
						'competitor' => array(
							'type'        => 'string',
							'description' => 'Optional competitor domain to compare against. Omit to auto-pick the top organic competitor by shared keywords.',
						),
						'country'    => array(
							'type'        => 'string',
							'description' => 'Optional two-letter country code for the market (default us).',
						),
					),
					'required'             => array( 'page' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'gsc_list_properties',
				'description'  => 'List every Google Search Console property (site) the connected Google '
					. 'account can access -- not just this WordPress site, but every domain the admin has '
					. 'verified in Search Console under that account. Pass the returned value as the '
					. '"site" argument to gsc_top_pages/gsc_page_queries/gsc_page_report to get data for '
					. 'a different domain. Read-only. Needs Google Search Console connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'gsc_top_pages',
				'description'  => 'Rank a site\'s pages by REAL Google Search Console performance '
					. '(actual clicks/impressions/CTR/position Google reports, not an estimate). Use '
					. 'order="worst" to find underperforming pages, or order="best" for top performers. '
					. 'Defaults to this WordPress site; pass "site" to query any other domain verified '
					. 'under the same connected Google account (see gsc_list_properties). Read-only. '
					. 'Needs Google Search Console connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'site'   => array(
							'type'        => 'string',
							'description' => 'Domain or exact GSC siteUrl to query (default: this site). '
								. 'See gsc_list_properties for valid values.',
						),
						'order'  => array(
							'type'        => 'string',
							'enum'        => array( 'worst', 'best' ),
							'description' => 'worst = lowest metric value first (default); best = highest first.',
						),
						'metric' => array(
							'type'        => 'string',
							'enum'        => array( 'clicks', 'impressions', 'ctr', 'position' ),
							'description' => 'Which metric to sort by (default clicks). position: lower is better.',
						),
						'limit'  => array(
							'type'        => 'integer',
							'description' => 'Max pages to return (default 10, max 100).',
						),
						'days'   => array(
							'type'        => 'integer',
							'description' => 'How many days back to look, ending 3 days ago (GSC\'s reporting lag). Default 90, max 450.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'gsc_page_queries',
				'description'  => 'List every search query a specific page ranks for in Google Search '
					. 'Console, with real clicks/impressions/CTR/position per query. Defaults to a page '
					. 'on this WordPress site (accepts an ID, URL, or path); pass "site" plus a full URL '
					. 'in "page" to inspect a page on any other domain verified under the same connected '
					. 'Google account (see gsc_list_properties). If the response has '
					. '"no_matching_rows": true, GSC genuinely has no data for that URL -- say so plainly, '
					. 'do NOT invent plausible-looking numbers. Read-only. Needs Google Search Console '
					. 'connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'page' => array(
							'type'        => 'string',
							'description' => 'The page to inspect: a post/page ID, full URL, or path (e.g. '
								. '"/my-page/") for this site -- or a full URL when "site" is set.',
						),
						'site' => array(
							'type'        => 'string',
							'description' => 'Domain or exact GSC siteUrl the page belongs to, if not this '
								. 'site. Requires "page" to be a full URL. See gsc_list_properties.',
						),
						'days' => array(
							'type'        => 'integer',
							'description' => 'How many days back to look, ending 3 days ago. Default 90, max 450.',
						),
					),
					'required'             => array( 'page' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'gsc_page_report',
				'description'  => 'One-shot Google Search Console diagnostic for a specific page: its '
					. 'overall aggregate performance (clicks/impressions/CTR/position) and every query '
					. 'it ranks for -- all in a single call. For a page on this WordPress site, also '
					. 'includes the page\'s own content (use this INSTEAD of calling get_post and '
					. 'gsc_page_queries separately). Pass "site" plus a full URL in "page" to diagnose a '
					. 'page on any other domain verified under the same connected Google account (see '
					. 'gsc_list_properties) -- content isn\'t available for those. If the response has '
					. '"no_matching_rows": true, GSC genuinely has no data for that URL -- say so plainly, '
					. 'do NOT invent plausible-looking numbers. Read-only. Needs Google Search Console '
					. 'connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'page' => array(
							'type'        => 'string',
							'description' => 'The page to diagnose: a post/page ID, full URL, or path (e.g. '
								. '"/my-page/") for this site -- or a full URL when "site" is set.',
						),
						'site' => array(
							'type'        => 'string',
							'description' => 'Domain or exact GSC siteUrl the page belongs to, if not this '
								. 'site. Requires "page" to be a full URL. See gsc_list_properties.',
						),
						'days' => array(
							'type'        => 'integer',
							'description' => 'How many days back to look, ending 3 days ago. Default 90, max 450.',
						),
					),
					'required'             => array( 'page' ),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'ga_list_properties',
				'description'  => 'List every Google Analytics (GA4) property the connected Google account '
					. 'can access. Pass a property\'s ID, display name, or a domain as the "site" argument '
					. 'to ga_traffic_overview/ga_top_pages to get data for it. Read-only. Needs Google '
					. 'Analytics connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'ga_traffic_overview',
				'description'  => 'Real Google Analytics (GA4) traffic summary: sessions, active users, '
					. 'engagement rate, and conversions for the period, broken down by traffic-source '
					. 'channel (Organic Search, Direct, Referral, Social, Paid Search, etc.). This is '
					. 'ACTUAL visitor behavior, not search-ranking data -- use gsc_top_pages/Ahrefs tools '
					. 'for search-specific questions, and this for "how much traffic / where from / do '
					. 'visitors engage." Defaults to this WordPress site; pass "site" to query any other '
					. 'property verified under the same connected Google account (see ga_list_properties). '
					. 'GA4 data is near-real-time (no multi-day lag like Search Console). Read-only. Needs '
					. 'Google Analytics connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'site' => array(
							'type'        => 'string',
							'description' => 'Property ID, display name, or domain to query (default: this site). See ga_list_properties.',
						),
						'days' => array(
							'type'        => 'integer',
							'description' => 'How many days back to look, ending yesterday. Default 28, max 365.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'ga_top_pages',
				'description'  => 'Rank a site\'s pages by REAL Google Analytics (GA4) traffic (sessions or '
					. 'views Google Analytics actually recorded, not a search-ranking estimate). Use '
					. 'order="worst" to find pages that get little to no real traffic, or order="best" for '
					. 'top performers. Defaults to this WordPress site; pass "site" to query any other '
					. 'property verified under the same connected Google account (see ga_list_properties). '
					. 'Read-only. Needs Google Analytics connected.',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'site'   => array(
							'type'        => 'string',
							'description' => 'Property ID, display name, or domain to query (default: this site). See ga_list_properties.',
						),
						'order'  => array(
							'type'        => 'string',
							'enum'        => array( 'worst', 'best' ),
							'description' => 'worst = lowest traffic first (default); best = highest first.',
						),
						'limit'  => array(
							'type'        => 'integer',
							'description' => 'Max pages to return (default 10, max 100).',
						),
						'days'   => array(
							'type'        => 'integer',
							'description' => 'How many days back to look, ending yesterday. Default 28, max 365.',
						),
					),
					'additionalProperties' => false,
				),
			),
			array(
				'name'         => 'run_site_checkup',
				'description'  => 'Run a full Google Lighthouse audit (the same checks behind Google\'s own '
					. 'PageSpeed Insights/PageSpeed tools) against a live URL: performance, accessibility, '
					. 'best practices, and SEO -- a score 0-100 for each, plus the specific failing checks '
					. 'under every score. Use this for "check my site/page" or "run a checkup" requests. '
					. 'This only READS the live page; it never changes anything by itself -- pair it with '
					. 'the site_checkup skill to actually act on what it finds (missing alt text, weak meta '
					. 'descriptions, template-level issues), which goes through the normal write-approval '
					. 'flow like any other edit. Read-only, no API key required (works at a lower rate limit '
					. 'without one).',
				'input_schema' => array(
					'type'                 => 'object',
					'properties'           => array(
						'id'         => array(
							'type'        => 'integer',
							'description' => 'A post/page ID on this site to audit (resolved to its live permalink).',
						),
						'url'        => array(
							'type'        => 'string',
							'description' => 'A full URL to audit instead of "id" -- any publicly reachable page, on this site or elsewhere.',
						),
						'strategy'   => array(
							'type'        => 'string',
							'enum'        => array( 'mobile', 'desktop' ),
							'description' => 'Which device profile to simulate (default mobile -- Google\'s own default, and usually the stricter score).',
						),
						'categories' => array(
							'type'        => 'array',
							'items'       => array(
								'type' => 'string',
								'enum' => array( 'performance', 'accessibility', 'best-practices', 'seo' ),
							),
							'description' => 'Which categories to run (default: all four).',
						),
					),
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
			'bulk_replace_in_posts',
			'flush_caches',
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
			case 'db_query':
				return self::db_query( $input );
			case 'fact_check':
				return self::fact_check( $input );
			case 'load_skill':
				return self::load_skill( $input );
			case 'replace_in_post':
				return self::replace_in_post( $input );
			case 'append_to_post':
				return self::append_to_post( $input );
			case 'bulk_replace_in_posts':
				return self::bulk_replace_in_posts( $input );
			case 'flush_caches':
				return self::flush_caches( $input );
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
			case 'generate_image':
				return self::generate_image( $input );
			case 'upload_media':
				return self::upload_media( $input );
			case 'get_page_html':
				return self::get_page_html( $input );
			case 'ahrefs_top_pages':
				return self::ahrefs_top_pages( $input );
			case 'ahrefs_organic_competitors':
				return self::ahrefs_organic_competitors( $input );
			case 'ahrefs_domain_metrics':
				return self::ahrefs_domain_metrics( $input );
			case 'seo_competitor_report':
				return self::seo_competitor_report( $input );
			case 'gsc_list_properties':
				return self::gsc_list_properties( $input );
			case 'gsc_top_pages':
				return self::gsc_top_pages( $input );
			case 'gsc_page_queries':
				return self::gsc_page_queries( $input );
			case 'gsc_page_report':
				return self::gsc_page_report( $input );
			case 'ga_list_properties':
				return self::ga_list_properties( $input );
			case 'ga_traffic_overview':
				return self::ga_traffic_overview( $input );
			case 'ga_top_pages':
				return self::ga_top_pages( $input );
			case 'run_site_checkup':
				return self::run_site_checkup( $input );
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
	 * Resolve a "page" tool argument -- a post/page ID, a full URL, or a
	 * root-relative path -- to a post ID. Shared by every tool that lets the
	 * model reference a page loosely instead of requiring an exact ID
	 * (seo_competitor_report, gsc_page_queries, gsc_page_report).
	 *
	 * @param string $raw Raw "page" input.
	 * @return int Post ID, or 0 if not found/empty.
	 */
	private static function resolve_page_post_id( $raw ) {
		$raw = trim( (string) $raw );
		if ( '' === $raw ) {
			return 0;
		}
		if ( ctype_digit( $raw ) ) {
			return (int) $raw;
		}
		$url = ( 0 === strpos( $raw, 'http' ) ) ? $raw : home_url( '/' . ltrim( $raw, '/' ) );
		return (int) url_to_postid( $url );
	}

	/**
	 * Wraps wp_json_encode(), which returns false on invalid UTF-8 instead of
	 * throwing. Real post content routinely
	 * contains this -- mixed-charset imports, copy-paste from Word/PDF, or a
	 * byte-offset substr() elsewhere slicing a multi-byte character in half
	 * -- and every tool method here used to pass that false straight through
	 * as tool_result content, which the Claude API then rejects outright.
	 * Retry once after stripping invalid byte sequences before giving up.
	 *
	 * @param mixed $data Data to encode.
	 * @return string JSON string. Never false.
	 */
	private static function safe_json_encode( $data ) {
		$json = wp_json_encode( $data );
		if ( false !== $json ) {
			return $json;
		}
		$json = wp_json_encode( self::strip_invalid_utf8( $data ) );
		if ( false !== $json ) {
			return $json;
		}
		return wp_json_encode( array( 'error' => 'Could not encode this content -- it contains characters that are not valid text.' ) );
	}

	/**
	 * Recursively strip invalid UTF-8 byte sequences from strings, arrays,
	 * and array-castable objects (e.g. a WP_Post-derived array) ahead of a
	 * retry in safe_json_encode().
	 *
	 * @param mixed $data Data to clean.
	 * @return mixed Cleaned data, same shape as the input.
	 */
	private static function strip_invalid_utf8( $data ) {
		if ( is_string( $data ) ) {
			return wp_check_invalid_utf8( $data, true );
		}
		if ( is_array( $data ) ) {
			foreach ( $data as $key => $value ) {
				$data[ $key ] = self::strip_invalid_utf8( $value );
			}
		}
		return $data;
	}

	/**
	 * Search posts and pages.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of matches.
	 */
	private static function search_posts( array $in ) {
		$query_args = array(
			's'              => $in['query'] ?? '',
			'post_type'      => $in['post_type'] ?? 'any',
			'post_status'    => $in['status'] ?? 'any',
			'posts_per_page' => min( (int) ( $in['limit'] ?? 10 ), 50 ),
		);
		// Multilingual plugins (WPML, Polylang) filter WP_Query to whichever
		// language happens to be active at request time by default -- which
		// can make a search silently miss content in other languages, or
		// return an unrelated same-language list instead of an empty result.
		// An assistant managing the whole site shouldn't be scoped to one
		// language just because of which context this request ran in.
		if ( defined( 'ICL_SITEPRESS_VERSION' ) || function_exists( 'pll_languages_list' ) ) {
			$query_args['lang'] = 'all';
		}
		$q = new WP_Query( $query_args );

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
		return array( 'content' => self::safe_json_encode( $rows ) );
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
			'content' => self::safe_json_encode(
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
			'content' => self::safe_json_encode(
				array(
					'theme'          => $theme->get( 'Name' ) . ' ' . $theme->get( 'Version' ),
					'post_types'     => array_values( get_post_types( array( 'public' => true ) ) ),
					'active_plugins' => array_values( (array) get_option( 'active_plugins', array() ) ),
				)
			),
		);
	}

	/**
	 * Run a read-only SELECT (or schema-read: DESCRIBE/SHOW/EXPLAIN SELECT)
	 * against the site's database. The escape hatch for data no purpose-built
	 * tool covers -- a form plugin's entries table, another plugin's custom
	 * table, etc. -- without needing bespoke per-plugin integrations.
	 *
	 * Security model (ported from WPVibe's db-query tool):
	 * - manage_options only (admin-equivalent), since this can read any table.
	 * - SELECT/DESCRIBE/SHOW/EXPLAIN SELECT only; every mutating keyword is
	 *   blocklisted even inside a nominal SELECT (comments stripped first so
	 *   a keyword can't be smuggled past the check inside /* ... *\/ or --).
	 * - Executable MySQL comments (/*! ... *\/) are rejected outright -- they
	 *   run at the server despite being stripped by the validator above.
	 * - Multi-statement injection (`; DROP TABLE ...`) is rejected.
	 * - `SELECT ... INTO OUTFILE/DUMPFILE` and `FOR UPDATE/SHARE` are rejected.
	 * - LIMIT is force-enforced (default 100, capped at 1000) so a query with
	 *   no LIMIT of its own can't dump an entire table.
	 * - "{prefix}" is substituted for $wpdb->prefix so the model doesn't have
	 *   to guess this site's actual table prefix.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the query's rows as JSON, or an error.
	 */
	private static function db_query( array $in ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return self::error( 'Permission denied. This tool requires an administrator account.' );
		}

		global $wpdb;

		$sql = trim( (string) ( $in['sql'] ?? '' ) );
		if ( '' === $sql ) {
			return self::error( 'A SQL query is required. Example: SELECT * FROM {prefix}posts LIMIT 10' );
		}

		$sql = str_replace( '{prefix}', $wpdb->prefix, $sql );

		// Executable MySQL comments run at the server despite being stripped
		// by the validator below, so they could smuggle a blocked keyword
		// past it. No legitimate query here needs them.
		if ( false !== strpos( $sql, '/*!' ) ) {
			return self::error( 'Executable MySQL comments (/*! ... */) are not allowed.' );
		}

		// Strip comments before validating so a blocked keyword can't hide
		// inside one, then normalize whitespace/case for keyword matching.
		$stripped   = preg_replace( '/--.*$/m', '', $sql );
		$stripped   = preg_replace( '/\/\*.*?\*\//s', '', $stripped );
		$normalized = preg_replace( '/\s+/', ' ', strtoupper( trim( $stripped ) ) );

		// Blank out string-literal contents (quoted text can legitimately
		// contain a semicolon or a blocked keyword as plain data, e.g. a URL
		// with "?a=1;b=2" or a phrase containing the word "update") so the
		// checks below only see actual SQL syntax, not literal payloads.
		$literal_free = preg_replace( "/'(?:[^'\\\\]|\\\\.|'')*'/s", "''", $stripped );

		$is_select      = ( 0 === strpos( $normalized, 'SELECT' ) );
		$is_schema_read = (bool) preg_match( '/^(DESCRIBE|DESC|SHOW|EXPLAIN SELECT)\b/', $normalized );

		if ( ! $is_select && ! $is_schema_read ) {
			return self::error( 'Only SELECT and schema reads (DESCRIBE, SHOW, EXPLAIN SELECT) are allowed. This tool has no write path.' );
		}

		$normalized_literal_free = preg_replace( '/\s+/', ' ', strtoupper( trim( $literal_free ) ) );

		if ( $is_select ) {
			$blocked = array(
				'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE',
				'CREATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE',
				'RENAME', 'REPLACE', 'LOAD', 'OUTFILE', 'DUMPFILE',
			);
			foreach ( $blocked as $keyword ) {
				if ( preg_match( '/\b' . $keyword . '\b/', $normalized_literal_free ) ) {
					return self::error( "Blocked SQL keyword in SELECT: {$keyword}." );
				}
			}
		}

		if ( preg_match( '/;\s*\S/', $literal_free ) ) {
			return self::error( 'Multiple SQL statements are not allowed.' );
		}

		if ( preg_match( '/\bINTO\s+(OUTFILE|DUMPFILE|@)/i', $normalized ) ) {
			return self::error( 'SELECT INTO is not allowed.' );
		}
		if ( preg_match( '/\bFOR\s+(UPDATE|SHARE)\b/', $normalized ) ) {
			return self::error( 'FOR UPDATE/SHARE is not allowed.' );
		}

		$sql = rtrim( $sql, '; ' );

		if ( $is_select ) {
			$limit = min( max( 1, (int) ( $in['limit'] ?? 100 ) ), 1000 );
			if ( preg_match( '/\bLIMIT\s+(\d+)/i', $sql ) ) {
				$sql = preg_replace_callback(
					'/\bLIMIT\s+(\d+)/i',
					static function ( $m ) {
						return 'LIMIT ' . min( (int) $m[1], 1000 );
					},
					$sql
				);
			} else {
				$sql .= ' LIMIT ' . $limit;
			}
		}

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$results = $wpdb->get_results( $sql, ARRAY_A );
		if ( $wpdb->last_error ) {
			return self::error( "SQL error: {$wpdb->last_error}" );
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'table_prefix'  => $wpdb->prefix,
					'rows_returned' => count( (array) $results ),
					'results'       => $results,
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
			'content' => self::safe_json_encode(
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
	 * preg_quote()d literal where straight and curly quotes match each other,
	 * and & matches &amp; -- so a snippet copied from rendered HTML (where
	 * WordPress has texturized quotes and entity-encoded &) still matches
	 * against stored post_content typed with plain characters, and vice
	 * versa. Ported from WPVibe's content-ops matcher (same real-world
	 * failure mode we hit live: invisible curly-quote/entity mismatches
	 * reading as false "not found" errors). Used only as a fallback after an
	 * exact match fails -- see replace_in_post.
	 *
	 * @param string $str Literal text to build a lenient pattern for.
	 * @return string Regex fragment (no delimiters).
	 */
	private static function lenient_match_pattern( $str ) {
		$single = "(?:'|\xE2\x80\x98|\xE2\x80\x99)";
		$double = '(?:"|\xE2\x80\x9C|\xE2\x80\x9D)';
		$pattern = strtr(
			preg_quote( $str, '/' ),
			array(
				"'"            => $single,
				'"'            => $double,
				"\xE2\x80\x98" => $single,
				"\xE2\x80\x99" => $single,
				"\xE2\x80\x9C" => $double,
				"\xE2\x80\x9D" => $double,
			)
		);
		return preg_replace( '/&amp;|&/', '(?:&amp;|&)', $pattern );
	}

	/**
	 * Replace an exact text snippet inside a post's content (targeted edit).
	 *
	 * Much cheaper than rewriting the whole post, which keeps long edits under
	 * gateway timeouts. Unlike update_post/publish_post/append_to_post, this
	 * does NOT gate on an expected_modified timestamp match: WordPress can
	 * legitimately bump post_modified with no real content edit (Heartbeat
	 * autosave from an open editor tab, a persistent object cache serving a
	 * slightly different get_post() read across two requests), which made
	 * this tool reject valid, non-conflicting edits. The find-must-match-
	 * exactly-once check below is a strictly stronger safety guarantee for
	 * this specific operation: if the snippet is still present verbatim and
	 * unique, the edit is provably safe regardless of what the timestamp
	 * says.
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

		$find = (string) ( $in['find'] ?? '' );
		if ( '' === $find ) {
			return self::error( 'The "find" text is empty.' );
		}
		$replace = wp_kses_post( $in['replace'] ?? '' );
		$count   = substr_count( $p->post_content, $find );

		if ( 1 === $count ) {
			$new_content = str_replace( $find, $replace, $p->post_content );
		} elseif ( $count > 1 ) {
			return self::error( "The \"find\" text appears {$count} times; make it longer/unique so exactly one match is replaced." );
		} else {
			// No byte-exact match -- fall back to a quote/entity-lenient
			// match before giving up, since a snippet copied from rendered
			// HTML often has plain quotes/& where the stored content has
			// texturized/entity-encoded ones.
			$pattern      = '/' . self::lenient_match_pattern( $find ) . '/u';
			$lenient_count = preg_match_all( $pattern, $p->post_content );
			if ( ! $lenient_count ) {
				return self::error( 'The "find" text was not found in the content. Read the post again and copy an exact snippet.' );
			}
			if ( $lenient_count > 1 ) {
				return self::error( "The \"find\" text appears {$lenient_count} times (accounting for quote/entity variants); make it longer/unique so exactly one match is replaced." );
			}
			$new_content = preg_replace_callback(
				$pattern,
				static function () use ( $replace ) {
					return $replace;
				},
				$p->post_content,
				1
			);
		}
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
		$message = "Replaced one snippet in #{$id}.";
		$warning = self::page_builder_warning( $id, $p->post_content, $find . ' ' . $replace );
		if ( $warning ) {
			$message .= ' WARNING: ' . $warning;
		}
		return array( 'content' => $message );
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
		$message = "Appended HTML to #{$id}.";
		$warning = self::page_builder_warning( $id, $p->post_content, $html );
		if ( $warning ) {
			$message .= ' WARNING: ' . $warning;
		}
		return array( 'content' => $message );
	}

	/**
	 * Detect page-builder risk for a targeted content edit, so the model gets
	 * a heads-up instead of silently corrupting Divi shortcode attributes or
	 * editing post_content on an Elementor page where it has no visible
	 * effect. Advisory only -- never blocks the edit, since both false
	 * positives (Divi markers in ordinary prose) and false negatives are
	 * possible without a full parser.
	 *
	 * @param int    $post_id      Post ID being edited.
	 * @param string $post_content post_content BEFORE this edit.
	 * @param string $touched_text The find/replace/html text involved in this edit.
	 * @return string|null Warning message, or null if nothing to flag.
	 */
	private static function page_builder_warning( $post_id, $post_content, $touched_text ) {
		if ( '' !== (string) get_post_meta( $post_id, '_elementor_data', true ) ) {
			return 'This page has Elementor data (_elementor_data postmeta). Elementor typically renders '
				. 'from that JSON structure, not post_content, so this edit may not appear on the live '
				. 'page -- use db_query to inspect _elementor_data if the change needs to be visible there.';
		}
		if ( false !== strpos( $post_content, '[et_pb_' )
			&& preg_match( '/_builder_version\s*=|global_colors_info\s*=|\[et_pb_[a-z_]+\s/i', $touched_text ) ) {
			return 'This page uses Divi shortcodes and the edited text touches shortcode-attribute-like '
				. 'syntax (_builder_version, global_colors_info, or a shortcode tag). Verify the page '
				. 'still renders correctly -- a boundary mistake here can corrupt a Divi module.';
		}
		return null;
	}

	/**
	 * Apply the same exact text replacement across multiple posts in one
	 * call. Each post is judged independently by the same find-must-match-
	 * exactly-once rule as replace_in_post, so one post with no match (or an
	 * ambiguous multi-match) is skipped and reported, not a hard failure for
	 * the whole batch.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a per-post summary as JSON, or an error.
	 */
	private static function bulk_replace_in_posts( array $in ) {
		$ids = array_values( array_unique( array_filter( array_map( 'intval', (array) ( $in['ids'] ?? array() ) ) ) ) );
		if ( empty( $ids ) ) {
			return self::error( 'Provide at least one post ID in "ids".' );
		}
		if ( count( $ids ) > 50 ) {
			return self::error( 'Too many ids (' . count( $ids ) . '); max 50 per call. Split into smaller batches.' );
		}

		$find = (string) ( $in['find'] ?? '' );
		if ( '' === $find ) {
			return self::error( 'The "find" text is empty.' );
		}
		$replace = wp_kses_post( $in['replace'] ?? '' );

		$results = array();
		$summary = array(
			'succeeded' => 0,
			'skipped'   => 0,
			'failed'    => 0,
		);
		foreach ( $ids as $id ) {
			$row               = self::bulk_replace_one_post( $id, $find, $replace );
			$results[]         = $row;
			$summary[ $row['status'] ] = ( $summary[ $row['status'] ] ?? 0 ) + 1;
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'summary' => $summary,
					'results' => $results,
				)
			),
		);
	}

	/**
	 * Apply one exact-match replacement to one post, for bulk_replace_in_posts.
	 *
	 * @param int    $id      Post ID.
	 * @param string $find    Exact text to find.
	 * @param string $replace Sanitized replacement HTML.
	 * @return array { id, status: succeeded|skipped|failed, message }.
	 */
	private static function bulk_replace_one_post( $id, $find, $replace ) {
		if ( ! current_user_can( 'edit_post', $id ) ) {
			return array(
				'id'      => $id,
				'status'  => 'failed',
				'message' => 'Permission denied for this post.',
			);
		}
		$p = get_post( $id );
		if ( ! $p ) {
			return array(
				'id'      => $id,
				'status'  => 'failed',
				'message' => 'Post not found.',
			);
		}

		$count = substr_count( $p->post_content, $find );
		if ( 0 === $count ) {
			return array(
				'id'      => $id,
				'status'  => 'skipped',
				'message' => 'The "find" text was not found in this post.',
			);
		}
		if ( $count > 1 ) {
			return array(
				'id'      => $id,
				'status'  => 'skipped',
				'message' => "The \"find\" text appears {$count} times in this post; skipped to avoid an ambiguous replace.",
			);
		}

		$new_content = str_replace( $find, $replace, $p->post_content );
		$result      = wp_update_post(
			array(
				'ID'           => $id,
				'post_content' => $new_content,
			),
			true
		);
		if ( is_wp_error( $result ) ) {
			return array(
				'id'      => $id,
				'status'  => 'failed',
				'message' => $result->get_error_message(),
			);
		}
		AISA_Audit_Log::record( 'bulk_replace_in_posts', $id, array( 'find' => $find ) );
		$row = array(
			'id'      => $id,
			'status'  => 'succeeded',
			'message' => 'Replaced.',
		);
		$warning = self::page_builder_warning( $id, $p->post_content, $find . ' ' . $replace );
		if ( $warning ) {
			$row['warning'] = $warning;
		}
		return $row;
	}

	/**
	 * Flush known caching layers (WordPress's own object cache, and whichever
	 * of Elementor / WP Rocket / W3 Total Cache / LiteSpeed Cache / WP Super
	 * Cache / WP Fastest Cache / SiteGround Optimizer are actually active) so
	 * a content edit becomes visible immediately instead of waiting for
	 * cache expiry.
	 * Detects what's present rather than assuming any one of them is active;
	 * never touches content, only caches.
	 *
	 * @param array $in Tool input (unused).
	 * @return array Tool result listing what was flushed, or an error.
	 */
	private static function flush_caches( array $in ) {
		if ( ! current_user_can( 'manage_options' ) ) {
			return self::error( 'Permission denied. This tool requires an administrator account.' );
		}

		$flushed = array();

		if ( wp_using_ext_object_cache() ) {
			wp_cache_flush();
			$flushed[] = 'object_cache';
		}

		if ( class_exists( '\Elementor\Plugin' ) ) {
			try {
				\Elementor\Plugin::instance()->files_manager->clear_cache();
				$flushed[] = 'elementor';
			} catch ( \Throwable $e ) {
				// Best-effort: Elementor's internal file-manager API can change
				// between versions; a failure here shouldn't block the other
				// cache layers from being flushed.
			}
		}

		if ( function_exists( 'rocket_clean_domain' ) ) {
			rocket_clean_domain();
			$flushed[] = 'wp_rocket';
		}

		if ( function_exists( 'w3tc_flush_all' ) ) {
			w3tc_flush_all();
			$flushed[] = 'w3_total_cache';
		}

		if ( defined( 'LSCWP_V4' ) ) {
			do_action( 'litespeed_purge_all' );
			$flushed[] = 'litespeed_cache';
		}

		if ( function_exists( 'wp_cache_clear_cache' ) ) {
			wp_cache_clear_cache();
			$flushed[] = 'wp_super_cache';
		}

		if ( class_exists( '\SiteGround_Optimizer\Supercacher\Supercacher' ) ) {
			\SiteGround_Optimizer\Supercacher\Supercacher::purge_cache();
			$flushed[] = 'siteground_optimizer';
		}

		if ( function_exists( 'wpfc_clear_all_cache' ) ) {
			wpfc_clear_all_cache();
			$flushed[] = 'wp_fastest_cache';
		}

		AISA_Audit_Log::record( 'flush_caches', null, array( 'flushed' => $flushed ) );

		return array(
			'content' => self::safe_json_encode(
				array(
					'flushed' => $flushed,
					'note'    => empty( $flushed )
						? 'No known caching plugin was detected active; nothing to flush beyond the object cache check above.'
						: 'Flushed the caching layers listed above.',
				)
			),
		);
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
		return array( 'content' => self::safe_json_encode( AISA_SEO::read_fields( $id ) ) );
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
		return array( 'content' => self::safe_json_encode( AISA_SEO::write_fields( $id, $fields ) ) );
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
		return array( 'content' => self::safe_json_encode( AISA_Meta::read_meta( $id, 'rank_math_schema' ) ) );
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
		return array( 'content' => self::safe_json_encode( $result ) );
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
		return array( 'content' => self::safe_json_encode( $rows ) );
	}

	/**
	 * Generate an original image via Gemini (Nano Banana Pro). The style
	 * suffix (hyper-realism + a strict no-text constraint) is appended here,
	 * server-side, unconditionally -- never left to the model to remember.
	 *
	 * The raw image is cached in a short-lived transient and only a small
	 * reference (image_id) is returned to the conversation. Sending the full
	 * base64 payload back through the LLM would be hundreds of thousands of
	 * tokens for a single image -- upload_media looks the bytes up
	 * server-side by this id instead.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with an image_id to pass into upload_media, or an error.
	 */
	private static function generate_image( array $in ) {
		if ( ! current_user_can( 'upload_files' ) ) {
			return self::error( 'Permission denied.' );
		}
		$prompt = trim( (string) ( $in['prompt'] ?? '' ) );
		if ( '' === $prompt ) {
			return self::error( 'Provide a "prompt" describing the scene.' );
		}

		$aspect = trim( (string) ( $in['aspect_ratio'] ?? '' ) );
		if ( '' !== $aspect ) {
			$prompt .= " Composition/aspect ratio: {$aspect}.";
		}
		$prompt .= ' ' . self::IMAGE_STYLE_SUFFIX;

		$result = AISA_Gemini_Client::generate_image( $prompt );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}

		$image_id = bin2hex( random_bytes( 10 ) );
		set_transient(
			self::GENERATED_IMAGE_TRANSIENT_PREFIX . $image_id,
			array(
				'data'      => $result['data'],
				'mime_type' => $result['mime_type'],
			),
			self::GENERATED_IMAGE_TTL
		);

		AISA_Audit_Log::record( 'generate_image', null, array( 'contrast_note' => (string) ( $in['contrast_note'] ?? '' ) ) );

		return array(
			'content' => self::safe_json_encode(
				array(
					'image_id'   => $image_id,
					'mime_type'  => $result['mime_type'],
					'expires_in' => '15 minutes',
					'next_step'  => 'Call upload_media with this image_id to save it into the media library.',
				)
			),
		);
	}

	/**
	 * Commit an image into the media library from EITHER a URL (search_images
	 * or any direct image URL) OR an image_id (from generate_image) --
	 * optionally attaching it to a post and/or setting it as the featured image.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result describing the uploaded attachment, or an error.
	 */
	private static function upload_media( array $in ) {
		if ( ! current_user_can( 'upload_files' ) ) {
			return self::error( 'Permission denied.' );
		}
		$url      = trim( (string) ( $in['url'] ?? '' ) );
		$image_id = trim( (string) ( $in['image_id'] ?? '' ) );
		if ( '' === $url && '' === $image_id ) {
			return self::error( 'Provide either "url" or "image_id".' );
		}
		if ( '' !== $url && '' !== $image_id ) {
			return self::error( 'Provide only one of "url" or "image_id", not both.' );
		}
		$post_id = (int) ( $in['post_id'] ?? 0 );
		if ( $post_id && ! current_user_can( 'edit_post', $post_id ) ) {
			return self::error( 'Permission denied for that post.' );
		}

		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$caption = isset( $in['caption'] ) ? sanitize_text_field( $in['caption'] ) : null;
		if ( '' !== $image_id ) {
			$attachment_id = self::sideload_generated_image( $image_id, $post_id, $caption );
		} else {
			$attachment_id = media_sideload_image( $url, $post_id, $caption, 'id' );
		}
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
			'content' => self::safe_json_encode(
				array(
					'attachment_id' => $attachment_id,
					'url'           => wp_get_attachment_url( $attachment_id ),
					'featured_on'   => ! empty( $in['set_featured'] ) && $post_id ? $post_id : null,
				)
			),
		);
	}

	/**
	 * Turn a generate_image transient into a real media library attachment.
	 * Deletes the transient once successfully committed.
	 *
	 * @param string      $image_id The image_id from generate_image.
	 * @param int         $post_id  Post to attach the media to (0 for none).
	 * @param string|null $caption  Optional caption/title.
	 * @return int|WP_Error Attachment ID, or an error.
	 */
	private static function sideload_generated_image( $image_id, $post_id, $caption ) {
		$image_id = sanitize_key( $image_id );
		$cached   = get_transient( self::GENERATED_IMAGE_TRANSIENT_PREFIX . $image_id );
		if ( ! is_array( $cached ) || empty( $cached['data'] ) ) {
			return new WP_Error( 'aisa_image_expired', 'That generated image has expired or was already used. Call generate_image again.' );
		}

		$bytes = base64_decode( $cached['data'], true ); // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_decode -- decoding our own cached Gemini image bytes, not obfuscated code.
		if ( false === $bytes ) {
			return new WP_Error( 'aisa_image_decode_failed', 'Could not decode the generated image.' );
		}

		$filename = 'ai-generated-' . $image_id . '.' . self::extension_for_mime( $cached['mime_type'] );
		$uploaded = wp_upload_bits( $filename, null, $bytes );
		if ( ! empty( $uploaded['error'] ) ) {
			return new WP_Error( 'aisa_upload_failed', $uploaded['error'] );
		}

		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' => $cached['mime_type'],
				'post_title'     => $caption ? $caption : __( 'AI-generated image', 'ai-site-assistant' ),
				'post_content'   => '',
				'post_status'    => 'inherit',
				'post_excerpt'   => $caption ? $caption : '',
			),
			$uploaded['file'],
			$post_id
		);
		if ( is_wp_error( $attachment_id ) ) {
			return $attachment_id;
		}

		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $uploaded['file'] ) );
		delete_transient( self::GENERATED_IMAGE_TRANSIENT_PREFIX . $image_id );

		return $attachment_id;
	}

	/**
	 * Map a mime type to a safe file extension for the generated-image filename.
	 *
	 * @param string $mime_type Mime type, e.g. "image/png".
	 * @return string Extension without a dot.
	 */
	private static function extension_for_mime( $mime_type ) {
		$map = array(
			'image/png'  => 'png',
			'image/jpeg' => 'jpg',
			'image/webp' => 'webp',
		);
		return $map[ $mime_type ] ?? 'png';
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
			// mb_strcut(), not substr(): a byte offset can land in the middle of
			// a multi-byte UTF-8 character (emoji, smart quotes, non-Latin
			// text), which produces invalid UTF-8 and makes safe_json_encode()
			// fall back to stripping content instead of just truncating it.
			// mb_strcut() cuts at the nearest character boundary at or before
			// the byte limit instead.
			$html = mb_strcut( $html, 0, $max_bytes ) . "\n<!-- AISA: truncated at {$max_bytes} bytes -->";
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'url'       => $permalink,
					'status'    => wp_remote_retrieve_response_code( $response ),
					'html'      => $html,
					'truncated' => $truncated,
				)
			),
		);
	}

	/**
	 * Rank a target's pages by estimated monthly organic traffic (Ahrefs).
	 * Defaults to this site; order defaults to worst-first (least-performing).
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of pages, or an error.
	 */
	private static function ahrefs_top_pages( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		$target = trim( (string) ( $in['target'] ?? '' ) );
		if ( '' === $target ) {
			$target = AISA_Ahrefs_Client::site_target();
		}
		$order = ( 'best' === ( $in['order'] ?? 'worst' ) ) ? 'sum_traffic:desc' : 'sum_traffic:asc';
		$limit = min( max( 1, (int) ( $in['limit'] ?? 20 ) ), 100 );

		$response = AISA_Ahrefs_Client::get(
			'site-explorer/top-pages',
			array(
				'target'   => $target,
				'mode'     => 'subdomains',
				'date'     => AISA_Ahrefs_Client::today(),
				'select'   => 'url,sum_traffic,top_keyword,keywords,value',
				'order_by' => $order,
				'limit'    => $limit,
				'country'  => sanitize_text_field( (string) ( $in['country'] ?? '' ) ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}
		return array(
			'content' => self::safe_json_encode(
				array(
					'target' => $target,
					'order'  => 'best' === ( $in['order'] ?? 'worst' ) ? 'best' : 'worst',
					'pages'  => $response['pages'] ?? array(),
				)
			),
		);
	}

	/**
	 * List a target's organic-search competitors and the keyword gap (Ahrefs).
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of competitors, or an error.
	 */
	private static function ahrefs_organic_competitors( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		$target = trim( (string) ( $in['target'] ?? '' ) );
		if ( '' === $target ) {
			$target = AISA_Ahrefs_Client::site_target();
		}
		$country = sanitize_text_field( (string) ( $in['country'] ?? 'us' ) );
		$limit   = min( max( 1, (int) ( $in['limit'] ?? 10 ) ), 50 );

		$response = AISA_Ahrefs_Client::get(
			'site-explorer/organic-competitors',
			array(
				'target'   => $target,
				'mode'     => 'subdomains',
				'country'  => '' !== $country ? $country : 'us',
				'date'     => AISA_Ahrefs_Client::today(),
				'select'   => 'competitor_domain,domain_rating,keywords_common,keywords_competitor,keywords_target,traffic,share',
				'order_by' => 'keywords_common:desc',
				'limit'    => $limit,
			)
		);
		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}
		return array(
			'content' => self::safe_json_encode(
				array(
					'target'      => $target,
					'country'     => '' !== $country ? $country : 'us',
					'competitors' => $response['competitors'] ?? array(),
				)
			),
		);
	}

	/**
	 * Headline organic SEO metrics for one domain (Ahrefs). Call once per
	 * domain to compare this site head-to-head with a competitor.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the metrics as JSON, or an error.
	 */
	private static function ahrefs_domain_metrics( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		$target = trim( (string) ( $in['target'] ?? '' ) );
		if ( '' === $target ) {
			$target = AISA_Ahrefs_Client::site_target();
		}

		$response = AISA_Ahrefs_Client::get(
			'site-explorer/metrics',
			array(
				'target'  => $target,
				'mode'    => 'subdomains',
				'date'    => AISA_Ahrefs_Client::today(),
				'country' => sanitize_text_field( (string) ( $in['country'] ?? '' ) ),
			)
		);
		if ( is_wp_error( $response ) ) {
			return self::error( $response->get_error_message() );
		}
		return array(
			'content' => self::safe_json_encode(
				array(
					'target'  => $target,
					'metrics' => $response['metrics'] ?? array(),
				)
			),
		);
	}

	/**
	 * One-shot competitor comparison for a single page: bundles the page's
	 * own content, this domain's Ahrefs metrics, the top (or a specified)
	 * organic competitor's metrics and best-performing pages, into a single
	 * dispatch instead of four+ separate round trips. Internally reuses
	 * get_post() / ahrefs_domain_metrics() / ahrefs_organic_competitors() /
	 * ahrefs_top_pages() so permission checks and Ahrefs call shape stay in
	 * one place.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the combined report as JSON, or an error.
	 */
	private static function seo_competitor_report( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Ahrefs_Client::is_configured() ) {
			return self::error( 'Ahrefs API key is not configured. Add one in AISA Connector → Settings.' );
		}

		$raw     = trim( (string) ( $in['page'] ?? '' ) );
		$post_id = self::resolve_page_post_id( $raw );
		if ( ! $post_id ) {
			return self::error( '' === $raw
				? 'Provide a page: a post/page ID, full URL, or path like "/my-page/".'
				: sprintf( 'Could not find a page matching "%s".', $raw ) );
		}

		$post_result = self::get_post( array( 'id' => $post_id ) );
		if ( ! empty( $post_result['is_error'] ) ) {
			return $post_result;
		}
		$page = json_decode( $post_result['content'], true );

		$country     = sanitize_text_field( (string) ( $in['country'] ?? 'us' ) );
		$site_target = AISA_Ahrefs_Client::site_target();

		$site_metrics_result = self::ahrefs_domain_metrics(
			array(
				'target'  => $site_target,
				'country' => $country,
			)
		);
		$site_metrics = empty( $site_metrics_result['is_error'] )
			? json_decode( $site_metrics_result['content'], true )
			: null;

		$competitor_target = trim( (string) ( $in['competitor'] ?? '' ) );
		$competitor_source = 'specified';
		$other_competitors  = null;

		if ( '' === $competitor_target ) {
			$competitors_result = self::ahrefs_organic_competitors(
				array(
					'target'  => $site_target,
					'country' => $country,
					'limit'   => 5,
				)
			);
			if ( ! empty( $competitors_result['is_error'] ) ) {
				return $competitors_result;
			}
			$competitors_decoded = json_decode( $competitors_result['content'], true );
			$other_competitors   = $competitors_decoded['competitors'] ?? array();
			$top                 = $other_competitors[0] ?? null;
			if ( empty( $top['competitor_domain'] ) ) {
				return self::error( 'Ahrefs returned no organic competitors for this site.' );
			}
			$competitor_target = $top['competitor_domain'];
			$competitor_source = 'auto (top organic competitor by shared keywords)';
		}

		$competitor_metrics_result = self::ahrefs_domain_metrics(
			array(
				'target'  => $competitor_target,
				'country' => $country,
			)
		);
		$competitor_metrics = empty( $competitor_metrics_result['is_error'] )
			? json_decode( $competitor_metrics_result['content'], true )
			: array( 'error' => $competitor_metrics_result['content'] ?? 'unavailable' );

		$competitor_top_pages_result = self::ahrefs_top_pages(
			array(
				'target'  => $competitor_target,
				'order'   => 'best',
				'limit'   => 5,
				'country' => $country,
			)
		);
		$competitor_top_pages = array();
		if ( empty( $competitor_top_pages_result['is_error'] ) ) {
			$decoded              = json_decode( $competitor_top_pages_result['content'], true );
			$competitor_top_pages = $decoded['pages'] ?? array();
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'page'              => $page,
					'site'              => array(
						'target'  => $site_target,
						'metrics' => $site_metrics,
					),
					'competitor'        => array(
						'target'    => $competitor_target,
						'source'    => $competitor_source,
						'metrics'   => $competitor_metrics,
						'top_pages' => $competitor_top_pages,
					),
					'other_competitors' => $other_competitors,
				)
			),
		);
	}

	/**
	 * List every Search Console property (site) the connected Google
	 * account can access, so tools can be pointed at any domain the admin
	 * owns -- not just this WordPress site.
	 *
	 * @param array $in Tool input (unused).
	 * @return array Tool result with a JSON list of properties, or an error.
	 */
	private static function gsc_list_properties( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Gsc_Client::is_configured() ) {
			return self::error( 'Google Search Console is not connected. Connect it in AISA Connector → Settings.' );
		}

		$properties = AISA_Gsc_Client::list_properties();
		if ( is_wp_error( $properties ) ) {
			return self::error( $properties->get_error_message() );
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'this_site'  => AISA_Gsc_Client::get_connection()['property'],
					'properties' => array_map(
						static function ( $property ) {
							return array(
								'site'             => $property['siteUrl'] ?? '',
								'permission_level' => $property['permissionLevel'] ?? '',
							);
						},
						$properties
					),
				)
			),
		);
	}

	/**
	 * Rank a site's pages by real Google Search Console performance.
	 * Fetches with dimensions=['page'] and a generous row limit, then sorts
	 * client-side -- the Search Analytics API has no orderBy parameter, so
	 * the only reliable way to get worst/best-first is to sort ourselves.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of pages, or an error.
	 */
	private static function gsc_top_pages( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Gsc_Client::is_configured() ) {
			return self::error( 'Google Search Console is not connected. Connect it in AISA Connector → Settings.' );
		}

		$property = AISA_Gsc_Client::resolve_property( (string) ( $in['site'] ?? '' ) );
		if ( is_wp_error( $property ) ) {
			return self::error( $property->get_error_message() );
		}

		$order  = ( 'best' === ( $in['order'] ?? 'worst' ) ) ? 'best' : 'worst';
		$metric = in_array( $in['metric'] ?? '', array( 'clicks', 'impressions', 'ctr', 'position' ), true )
			? $in['metric']
			: 'clicks';
		$limit  = min( max( 1, (int) ( $in['limit'] ?? 10 ) ), 100 );
		$days   = min( max( 7, (int) ( $in['days'] ?? 90 ) ), 450 );

		$end   = gmdate( 'Y-m-d', strtotime( '-3 days' ) );
		$start = gmdate( 'Y-m-d', strtotime( "-{$days} days", strtotime( $end ) ) );

		$rows = AISA_Gsc_Client::query(
			array(
				'dimensions' => array( 'page' ),
				'startDate'  => $start,
				'endDate'    => $end,
				'rowLimit'   => 1000,
			),
			$property
		);
		if ( is_wp_error( $rows ) ) {
			return self::error( $rows->get_error_message() );
		}

		$pages = array_map(
			static function ( $row ) {
				return array(
					'page'        => $row['keys'][0] ?? '',
					'clicks'      => $row['clicks'] ?? 0,
					'impressions' => $row['impressions'] ?? 0,
					'ctr'         => $row['ctr'] ?? 0,
					'position'    => $row['position'] ?? 0,
				);
			},
			$rows
		);

		// position is "lower is better", the inverse of the other three metrics.
		usort(
			$pages,
			static function ( $a, $b ) use ( $metric, $order ) {
				$dir = ( 'position' === $metric )
					? ( 'best' === $order ? 1 : -1 )
					: ( 'best' === $order ? -1 : 1 );
				return $dir * ( $a[ $metric ] <=> $b[ $metric ] );
			}
		);

		return array(
			'content' => self::safe_json_encode(
				array(
					'order'       => $order,
					'metric'      => $metric,
					'date_range'  => array( $start, $end ),
					'pages'       => array_slice( $pages, 0, $limit ),
				)
			),
		);
	}

	/**
	 * Resolve the "page" argument for the GSC page-level tools to a full
	 * permalink, and the property to query it against. When "site" is set
	 * (a domain other than this WordPress install), "page" must already be
	 * a full URL -- there's no local post to resolve it against.
	 *
	 * @param array $in Tool input.
	 * @return array|WP_Error { permalink, property }, or WP_Error.
	 */
	private static function resolve_gsc_page_target( array $in ) {
		$raw  = trim( (string) ( $in['page'] ?? '' ) );
		$site = trim( (string) ( $in['site'] ?? '' ) );

		$property = AISA_Gsc_Client::resolve_property( $site );
		if ( is_wp_error( $property ) ) {
			return $property;
		}

		if ( '' !== $site ) {
			if ( 0 !== strpos( $raw, 'http' ) ) {
				return new WP_Error( 'aisa_gsc_page_needs_url', 'When "site" is set, "page" must be a full URL for that site.' );
			}
			return array(
				'permalink' => $raw,
				'property'  => $property,
			);
		}

		$post_id = self::resolve_page_post_id( $raw );
		if ( ! $post_id ) {
			return new WP_Error(
				'aisa_gsc_page_not_found',
				'' === $raw
					? 'Provide a page: a post/page ID, full URL, or path like "/my-page/".'
					: sprintf( 'Could not find a page matching "%s".', $raw )
			);
		}
		return array(
			'permalink' => get_permalink( $post_id ),
			'property'  => $property,
		);
	}

	/**
	 * GSC's "equals" page filter is a byte-for-byte string match, and root
	 * pages are the ones most likely to be typed/guessed in a form GSC
	 * doesn't actually store (missing trailing slash, wrong scheme). A
	 * plain no-match returns an empty (not erroring) result, which invites
	 * the model to paper over it with a plausible-sounding guess instead of
	 * reporting "no data." Try the most likely variants before giving up.
	 *
	 * @param string $permalink As resolved by resolve_gsc_page_target().
	 * @return string[] Candidate exact-match strings, most likely first.
	 */
	private static function gsc_page_url_variants( $permalink ) {
		$variants = array( $permalink );
		if ( '/' === substr( $permalink, -1 ) ) {
			$variants[] = rtrim( $permalink, '/' );
		} else {
			$variants[] = $permalink . '/';
		}
		return $variants;
	}

	/**
	 * List every query a specific page ranks for in Google Search Console.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of queries, or an error.
	 */
	private static function gsc_page_queries( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Gsc_Client::is_configured() ) {
			return self::error( 'Google Search Console is not connected. Connect it in AISA Connector → Settings.' );
		}

		$target = self::resolve_gsc_page_target( $in );
		if ( is_wp_error( $target ) ) {
			return self::error( $target->get_error_message() );
		}
		$permalink = $target['permalink'];
		$property  = $target['property'];

		$days  = min( max( 7, (int) ( $in['days'] ?? 90 ) ), 450 );
		$end   = gmdate( 'Y-m-d', strtotime( '-3 days' ) );
		$start = gmdate( 'Y-m-d', strtotime( "-{$days} days", strtotime( $end ) ) );

		$rows    = array();
		$matched = $permalink;
		foreach ( self::gsc_page_url_variants( $permalink ) as $variant ) {
			$rows = AISA_Gsc_Client::query(
				array(
					'dimensions'           => array( 'query' ),
					'dimensionFilterGroups' => array(
						array(
							'filters' => array(
								array(
									'dimension'  => 'page',
									'operator'   => 'equals',
									'expression' => $variant,
								),
							),
						),
					),
					'startDate'            => $start,
					'endDate'              => $end,
					'rowLimit'             => 1000,
				),
				$property
			);
			if ( is_wp_error( $rows ) ) {
				return self::error( $rows->get_error_message() );
			}
			if ( ! empty( $rows ) ) {
				$matched = $variant;
				break;
			}
		}

		$queries = array_map(
			static function ( $row ) {
				return array(
					'query'       => $row['keys'][0] ?? '',
					'clicks'      => $row['clicks'] ?? 0,
					'impressions' => $row['impressions'] ?? 0,
					'ctr'         => $row['ctr'] ?? 0,
					'position'    => $row['position'] ?? 0,
				);
			},
			$rows
		);
		usort( $queries, static fn( $a, $b ) => $b['clicks'] <=> $a['clicks'] );

		return array(
			'content' => self::safe_json_encode(
				array(
					'page'              => $matched,
					'no_matching_rows'  => empty( $queries ),
					'date_range'        => array( $start, $end ),
					'queries'           => $queries,
				)
			),
		);
	}

	/**
	 * One-shot GSC diagnostic for a single page: bundles the page's own
	 * content, its aggregate performance, and every query it ranks for --
	 * instead of chaining get_post + gsc_page_queries + a page-level metrics
	 * lookup as three separate round trips.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the combined report as JSON, or an error.
	 */
	private static function gsc_page_report( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Gsc_Client::is_configured() ) {
			return self::error( 'Google Search Console is not connected. Connect it in AISA Connector → Settings.' );
		}

		$target = self::resolve_gsc_page_target( $in );
		if ( is_wp_error( $target ) ) {
			return self::error( $target->get_error_message() );
		}
		$permalink = $target['permalink'];
		$property  = $target['property'];

		$page_meta = null;
		if ( '' === trim( (string) ( $in['site'] ?? '' ) ) ) {
			$post_id = url_to_postid( $permalink );
			if ( $post_id ) {
				$post_result = self::get_post( array( 'id' => $post_id ) );
				if ( ! empty( $post_result['is_error'] ) ) {
					return $post_result;
				}
				$page_meta = json_decode( $post_result['content'], true );
			}
		}

		$queries_result = self::gsc_page_queries( $in );
		if ( ! empty( $queries_result['is_error'] ) ) {
			return $queries_result;
		}
		$queries_decoded = json_decode( $queries_result['content'], true );
		// gsc_page_queries() may have matched a trailing-slash variant of
		// $permalink instead of the exact string passed in -- reuse that
		// resolved value so the aggregate query below looks for the same
		// page GSC actually has data under, not the one we merely guessed.
		$matched_permalink = $queries_decoded['page'] ?? $permalink;

		$days  = min( max( 7, (int) ( $in['days'] ?? 90 ) ), 450 );
		$end   = gmdate( 'Y-m-d', strtotime( '-3 days' ) );
		$start = gmdate( 'Y-m-d', strtotime( "-{$days} days", strtotime( $end ) ) );

		// Aggregate: same page filter, but with NO dimensions -- GSC then
		// rolls every matching row up into a single totals row instead of
		// splitting by query.
		$agg_rows = AISA_Gsc_Client::query(
			array(
				'dimensionFilterGroups' => array(
					array(
						'filters' => array(
							array(
								'dimension'  => 'page',
								'operator'   => 'equals',
								'expression' => $matched_permalink,
							),
						),
					),
				),
				'startDate'            => $start,
				'endDate'              => $end,
				'rowLimit'             => 1,
			),
			$property
		);
		$aggregate = array(
			'clicks'      => 0,
			'impressions' => 0,
			'ctr'         => 0,
			'position'    => 0,
		);
		if ( ! is_wp_error( $agg_rows ) && ! empty( $agg_rows[0] ) ) {
			$aggregate = array(
				'clicks'      => $agg_rows[0]['clicks'] ?? 0,
				'impressions' => $agg_rows[0]['impressions'] ?? 0,
				'ctr'         => $agg_rows[0]['ctr'] ?? 0,
				'position'    => $agg_rows[0]['position'] ?? 0,
			);
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'page'                 => $matched_permalink,
					'page_meta'            => $page_meta,
					'no_matching_rows'     => $queries_decoded['no_matching_rows'] ?? false,
					'date_range'           => array( $start, $end ),
					'aggregate_performance' => $aggregate,
					'queries'              => $queries_decoded['queries'] ?? array(),
				)
			),
		);
	}

	/**
	 * List every Google Analytics (GA4) property the connected Google account
	 * can access, so tools can be pointed at any property the admin owns --
	 * not just this WordPress site's own.
	 *
	 * @param array $in Tool input (unused).
	 * @return array Tool result with a JSON list of properties, or an error.
	 */
	private static function ga_list_properties( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Ga_Client::is_configured() ) {
			return self::error( 'Google Analytics is not connected. Connect it in AISA Connector → Settings.' );
		}

		$properties = AISA_Ga_Client::list_properties();
		if ( is_wp_error( $properties ) ) {
			return self::error( $properties->get_error_message() );
		}

		$conn = AISA_Ga_Client::get_connection();
		return array(
			'content' => self::safe_json_encode(
				array(
					'this_site'  => array(
						'property' => $conn['property'],
						'name'     => $conn['property_name'],
					),
					'properties' => $properties,
				)
			),
		);
	}

	/**
	 * Extract a GA4 runReport response into a flat array of associative rows,
	 * keyed by dimension/metric name instead of positional dimensionValues/
	 * metricValues arrays.
	 *
	 * @param array $report Decoded runReport response.
	 * @return array List of associative rows.
	 */
	private static function flatten_ga_report( array $report ) {
		$dim_names = array_map(
			static function ( $h ) {
				return $h['name'] ?? '';
			},
			$report['dimensionHeaders'] ?? array()
		);
		$metric_names = array_map(
			static function ( $h ) {
				return $h['name'] ?? '';
			},
			$report['metricHeaders'] ?? array()
		);

		$rows = array();
		foreach ( (array) ( $report['rows'] ?? array() ) as $row ) {
			$flat = array();
			foreach ( (array) ( $row['dimensionValues'] ?? array() ) as $i => $value ) {
				$flat[ $dim_names[ $i ] ?? "dimension_{$i}" ] = $value['value'] ?? '';
			}
			foreach ( (array) ( $row['metricValues'] ?? array() ) as $i => $value ) {
				$raw = $value['value'] ?? '0';
				$flat[ $metric_names[ $i ] ?? "metric_{$i}" ] = is_numeric( $raw ) ? $raw + 0 : $raw;
			}
			$rows[] = $flat;
		}
		return $rows;
	}

	/**
	 * Real GA4 traffic summary: totals plus a channel-group breakdown.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with the summary as JSON, or an error.
	 */
	private static function ga_traffic_overview( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Ga_Client::is_configured() ) {
			return self::error( 'Google Analytics is not connected. Connect it in AISA Connector → Settings.' );
		}

		$property = AISA_Ga_Client::resolve_property( (string) ( $in['site'] ?? '' ) );
		if ( is_wp_error( $property ) ) {
			return self::error( $property->get_error_message() );
		}

		$days  = min( max( 1, (int) ( $in['days'] ?? 28 ) ), 365 );
		$end   = gmdate( 'Y-m-d', strtotime( '-1 day' ) );
		$start = gmdate( 'Y-m-d', strtotime( "-{$days} days", strtotime( $end ) ) );

		$report = AISA_Ga_Client::query(
			array(
				'dateRanges'         => array(
					array(
						'startDate' => $start,
						'endDate'   => $end,
					),
				),
				'dimensions'         => array( array( 'name' => 'sessionDefaultChannelGroup' ) ),
				'metrics'            => array(
					array( 'name' => 'sessions' ),
					array( 'name' => 'activeUsers' ),
					array( 'name' => 'engagementRate' ),
					array( 'name' => 'conversions' ),
				),
				'metricAggregations' => array( 'TOTAL' ),
				'limit'              => 50,
			),
			$property
		);
		if ( is_wp_error( $report ) ) {
			return self::error( $report->get_error_message() );
		}

		$by_channel = self::flatten_ga_report( $report );
		usort( $by_channel, static fn( $a, $b ) => ( $b['sessions'] ?? 0 ) <=> ( $a['sessions'] ?? 0 ) );

		$totals = array();
		if ( ! empty( $report['totals'][0] ) ) {
			$totals = self::flatten_ga_report(
				array(
					'metricHeaders' => $report['metricHeaders'] ?? array(),
					'rows'          => array( $report['totals'][0] ),
				)
			)[0] ?? array();
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'date_range'      => array( $start, $end ),
					'totals'          => $totals,
					'by_channel'      => $by_channel,
				)
			),
		);
	}

	/**
	 * Rank a site's pages by real GA4 traffic. Unlike gsc_top_pages, GA4's
	 * Data API supports server-side ordering and limiting directly, so no
	 * client-side sort is needed here.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with a JSON list of pages, or an error.
	 */
	private static function ga_top_pages( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}
		if ( ! AISA_Ga_Client::is_configured() ) {
			return self::error( 'Google Analytics is not connected. Connect it in AISA Connector → Settings.' );
		}

		$property = AISA_Ga_Client::resolve_property( (string) ( $in['site'] ?? '' ) );
		if ( is_wp_error( $property ) ) {
			return self::error( $property->get_error_message() );
		}

		$order = ( 'best' === ( $in['order'] ?? 'worst' ) ) ? 'best' : 'worst';
		$limit = min( max( 1, (int) ( $in['limit'] ?? 10 ) ), 100 );
		$days  = min( max( 1, (int) ( $in['days'] ?? 28 ) ), 365 );
		$end   = gmdate( 'Y-m-d', strtotime( '-1 day' ) );
		$start = gmdate( 'Y-m-d', strtotime( "-{$days} days", strtotime( $end ) ) );

		$report = AISA_Ga_Client::query(
			array(
				'dateRanges' => array(
					array(
						'startDate' => $start,
						'endDate'   => $end,
					),
				),
				'dimensions' => array( array( 'name' => 'pagePath' ) ),
				'metrics'    => array(
					array( 'name' => 'screenPageViews' ),
					array( 'name' => 'sessions' ),
					array( 'name' => 'activeUsers' ),
					array( 'name' => 'engagementRate' ),
				),
				'orderBys'   => array(
					array(
						'metric'    => array( 'metricName' => 'sessions' ),
						'desc'      => ( 'best' === $order ),
					),
				),
				'limit'      => $limit,
			),
			$property
		);
		if ( is_wp_error( $report ) ) {
			return self::error( $report->get_error_message() );
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'order'      => $order,
					'date_range' => array( $start, $end ),
					'pages'      => self::flatten_ga_report( $report ),
				)
			),
		);
	}

	/**
	 * Run a full Lighthouse audit (performance/accessibility/best-practices/
	 * SEO) against a live URL via Google's PageSpeed Insights API.
	 *
	 * @param array $in Tool input.
	 * @return array Tool result with scores + top failing checks as JSON, or an error.
	 */
	private static function run_site_checkup( array $in ) {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return self::error( 'Permission denied.' );
		}

		$url = trim( (string) ( $in['url'] ?? '' ) );
		if ( '' === $url && ! empty( $in['id'] ) ) {
			$post_id = (int) $in['id'];
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return self::error( 'Permission denied for this post.' );
			}
			$permalink = get_permalink( $post_id );
			if ( ! $permalink ) {
				return self::error( 'Post not found.' );
			}
			$url = $permalink;
		}
		if ( '' === $url ) {
			return self::error( 'Provide either "id" (a post/page on this site) or a full "url" to audit.' );
		}

		$strategy   = ( 'desktop' === ( $in['strategy'] ?? 'mobile' ) ) ? 'desktop' : 'mobile';
		$categories = array_values( array_intersect( (array) ( $in['categories'] ?? array() ), AISA_Pagespeed_Client::CATEGORIES ) );
		if ( empty( $categories ) ) {
			$categories = AISA_Pagespeed_Client::CATEGORIES;
		}

		$result = AISA_Pagespeed_Client::run( $url, $strategy, $categories );
		if ( is_wp_error( $result ) ) {
			return self::error( $result->get_error_message() );
		}

		return array(
			'content' => self::safe_json_encode(
				array(
					'url'      => $url,
					'strategy' => $strategy,
					'scores'   => $result['scores'],
					'issues'   => $result['issues'],
				)
			),
		);
	}
}
