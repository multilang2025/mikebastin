<?php
/**
 * On-demand task playbooks ("skills") the agent loads only when a task
 * actually needs them, instead of shipping every playbook in every request's
 * system prompt. Mirrors the load_skill pattern from other WordPress AI
 * connectors, and cuts the baseline token cost of every turn.
 *
 * @package AI_Site_Assistant
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registry of named playbooks, loadable one at a time via the load_skill tool.
 */
class AISA_Skills {

	/**
	 * Skill name => one-line summary shown in the system prompt's catalog so
	 * the model knows what is available without paying for the full body.
	 *
	 * @var array<string, string>
	 */
	const CATALOG = array(
		'eeat'             => 'Strengthen Experience, Expertise, Authoritativeness, and Trust signals in a post.',
		'fact_checking'    => 'Verify a claim, statistic, date, price, quote, or study before writing it, or check an existing one.',
		'nlp_readability'  => 'Improve clarity, topical coverage, and readability without rewriting the whole post.',
		'internal_links'   => 'Find and add relevant internal links between existing posts and pages.',
		'meta_tags'        => 'Write or improve SEO meta title/description and Open Graph/Twitter tags.',
		'schema'           => 'Inspect or write Rank Math structured-data (schema.org) entries.',
		'page_builders'    => 'How post_content maps to Classic, Gutenberg, Divi, and Elementor, and what is/isn\'t editable.',
		'theme_editing'    => 'Edit theme files safely using the draft-first sandbox workflow.',
		'images'           => 'Find and insert a stock photo into a post from a natural-language description.',
		'image_generation' => 'Generate original, hyper-realistic, text-free artwork tailored to a specific post.',
		'seo_intelligence' => 'Answer traffic/performance and competitor questions using Ahrefs data.',
	);

	/**
	 * Build the short catalog listing injected into the system prompt.
	 *
	 * @return string One "- name: summary" line per skill.
	 */
	public static function catalog_text() {
		$lines = array();
		foreach ( self::CATALOG as $name => $summary ) {
			$lines[] = "- {$name}: {$summary}";
		}
		return implode( "\n", $lines );
	}

	/**
	 * The full playbook body for one skill.
	 *
	 * @param string $name Skill name (see CATALOG keys).
	 * @return string|null Playbook text, or null if the name is unknown.
	 */
	public static function body( $name ) {
		$bodies = array(
			'eeat'             => 'EEAT (Experience, Expertise, Authoritativeness, Trust): strengthen first-hand '
				. 'experience and credibility. append_to_post an author/credentials box and a "Sources" '
				. "list of reputable references; use replace_in_post to add the author's qualifications, "
				. 'a "last reviewed" date, and concrete first-hand detail. Do not invent credentials, '
				. 'citations, statistics, or dates — if you lack a real source, say so and ask. If you '
				. 'add a factual claim you are not certain of, load the fact_checking skill first.',
			'fact_checking'    => 'FACT-CHECKING: never invent or guess a statistic, date, price, quote, or named '
				. 'study. Before you add such a fact to content — or when the user asks you to verify '
				. 'existing claims — call fact_check with the specific statement. Trust its verdict: if '
				. 'it returns False or Misleading, correct or remove the claim; if Unverifiable, do not '
				. 'present it as fact. Cite the returned source URLs (as links or in a Sources list) '
				. 'rather than fabricating references.',
			'nlp_readability'  => 'NLP / readability: improve clarity and topical coverage WITHOUT rewriting the whole '
				. 'post. Work section by section with replace_in_post: shorten sentences, add a clear '
				. 'subheading, define entities, and add the synonyms/related terms a search engine '
				. "expects. Keep the author's meaning and voice.",
			'internal_links'   => 'Internal links: use search_posts to find relevant existing posts/pages on the site, '
				. 'then replace_in_post to wrap an exact phrase in an <a href> to that URL. Use '
				. 'descriptive anchor text (not "click here"); add only a few genuinely relevant links.',
			'meta_tags'        => 'Meta tags: use get_seo then set_seo. A good meta_title is about 50-60 characters and '
				. 'includes the focus keyword near the front; a good meta_description is about 150-160 '
				. 'characters, compelling, and includes the keyword. Set og_/twitter_ fields when asked '
				. 'to optimise social sharing.',
			'schema'           => 'Schema / structured data: get_schema to inspect current Rank Math schema, then set_meta '
				. 'with the appropriate rank_math_schema_* key, passing the schema object as a JSON '
				. 'string. Match the content type (Article, FAQPage, HowTo, Product, etc.).',
			'page_builders'    => 'PAGE BUILDERS: get_post returns post_content, which holds the content for Classic, '
				. 'Gutenberg, and Divi. For Gutenberg keep block comment markers (<!-- wp:... -->) intact '
				. 'when you edit. Elementor stores its content in the _elementor_data meta field, not in '
				. 'post_content — if a page looks empty or like raw shortcodes/JSON, tell the user it is '
				. 'an Elementor page and that body edits are not supported yet (SEO meta and schema still '
				. 'work). Always confirm a replace_in_post match exists before relying on it.',
			'theme_editing'    => 'THEME EDITING: never write directly into the live theme. First call '
				. 'list_theme_files/read_theme_file/search_theme_files (safe on any theme, read-only) to '
				. 'find what to change. Before making ANY edit, call create_draft_theme -- it copies the '
				. 'active theme into its own "<slug>-aisa-draft" directory and returns that draft\'s '
				. 'stylesheet slug. Make all write_theme_file calls against that draft slug only (it is '
				. 'rejected otherwise). Use get_theme_preview_url on the draft slug to give the user a '
				. 'Customizer live-preview link before anything goes live. Only call publish_draft_theme '
				. '(which activates the draft as the live theme) after the user has seen the preview and '
				. 'approved it. If you abandon a draft, clean it up with delete_draft_theme.',
			'seo_intelligence' => 'SEO INTELLIGENCE (Ahrefs): use these when the user asks about traffic, '
				. 'performance, or competitors -- the WordPress database has none of that data. All three '
				. 'tools default their target to this site; pass a competitor domain to analyze theirs. '
				. "They need an Ahrefs API key (tell the user to add one in Settings if a tool reports it's "
				. 'missing). Traffic and keyword figures are Ahrefs ESTIMATES from its own index, not the '
				. "site's real analytics -- say so when you present them. Monetary fields (value, org_cost) "
				. "are in USD cents; divide by 100.\n"
				. '- "Least/worst-performing articles": ahrefs_top_pages with order="worst" (lowest organic '
				. 'traffic first). order="best" for top performers. Name the actual URLs and their '
				. "sum_traffic; offer to open or edit the weak ones.\n"
				. '- "Who are my competitors / how do I compare": ahrefs_organic_competitors lists rival '
				. 'domains with keywords_competitor (keywords they rank for that you do NOT -- your gap). '
				. 'For a head-to-head, call ahrefs_domain_metrics once for this site and once per '
				. "competitor and compare org_traffic / org_keywords / org_keywords_1_3.\n"
				. '- "Ideas to improve": combine the above -- pull a top competitor, run ahrefs_top_pages '
				. 'on THEIR domain (order="best") to see the content driving their traffic, and turn the '
				. 'keyword gap into concrete topic/section suggestions. Only then offer to draft or edit '
				. "content (which still goes through the normal approval gate).\n"
				. 'If the user has not set a market, ask which country to scope competitor data to '
				. '(the default is us).',
			'images'           => 'IMAGES: call search_images with a short descriptive query, show the user '
				. 'a few candidates (description + photographer credit), then call upload_media with the '
				. 'chosen result\'s url and download_location (pass both through unchanged -- '
				. 'download_location fulfils Unsplash\'s attribution-tracking requirement). Credit the '
				. 'photographer in the caption or alt text when the user wants attribution shown on the '
				. 'page. Only set_featured when the user asked for a featured image specifically.',
			'image_generation' => 'IMAGE GENERATION (Nano Banana Pro / Gemini): use this when no stock photo '
				. 'fits, or the user wants custom/original artwork.'
				. "\n\n"
				. 'ANALYZE FIRST. Before writing a single generate_image prompt, read the actual page you '
				. 'are illustrating -- call get_post for the target post/page (and get_page_html if you need '
				. 'to see how it actually renders, e.g. a page-builder layout). Understand the topic, tone, '
				. 'audience, and any imagery already present before deciding what to generate. Never '
				. 'generate blind from the user\'s one-line request alone.'
				. "\n\n"
				. 'STYLE IS ALREADY HANDLED. Hyper-realism and a strict no-text-in-image rule are appended '
				. 'automatically to every generate_image call server-side -- do not spend words on '
				. '"photorealistic" or "no text" yourself. Put ALL of your prompt into the actual scene: '
				. 'specific subject, setting, composition, camera angle, lighting, mood, color palette. '
				. 'Vague prompts produce generic images regardless of the style enforcement.'
				. "\n\n"
				. 'CONTRAST ACROSS MULTIPLE IMAGES. If a task calls for more than one image (e.g. one per '
				. 'section of an article), deliberately vary them so the set doesn\'t look repetitive: '
				. 'change the camera angle, subject framing, color palette, time of day, or mood between '
				. 'calls. Use the contrast_note field each time to briefly state how this image differs '
				. 'from the ones you already generated in this task -- this is also your own reminder to '
				. 'actually vary the prompt, not just the note.'
				. "\n\n"
				. 'COMMIT FLOW. generate_image does not touch the site -- it returns an image_id (never the '
				. 'raw image; do not try to inspect or describe its pixel content, you cannot see it). Pass '
				. 'that image_id into upload_media to actually save it to the media library; upload_media '
				. 'is gated, so the user sees and approves the real image before anything is written. Set '
				. 'post_id and set_featured, or use replace_in_post/append_to_post afterward to embed an '
				. '<img> tag inline near the relevant section, matching however the user wants it placed.'
				. "\n\n"
				. 'Each generation is a metered, paid API call -- write a good prompt the first time rather '
				. 'than generating repeatedly to fish for a better result; only regenerate if the result was '
				. 'genuinely off-target or blocked by a safety filter.',
		);
		return $bodies[ $name ] ?? null;
	}
}
