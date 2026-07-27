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
		'gsc_intelligence' => 'Google Search Console performance diagnostics and content optimization.',
		'db_admin'         => 'Query data no other tool covers (form entries, custom plugin tables) safely with db_query.',
		'bulk_site_changes' => 'Fix the same text/link across many posts at once, then make the change visible immediately.',
		'ga_intelligence'  => 'Real visitor traffic, engagement, and traffic-source questions using Google Analytics (GA4) data.',
		'site_reports'     => 'Build a periodic performance report for a specific site, combining GA4 + Search Console + Ahrefs data.',
		'delaguialuzon_monthly_report' => 'Cross-source monthly report for Delaguía y Luzón Abogados: Formidable leads + GSC + GA4, with honest cross-checks. No Ahrefs.',
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
			'page_builders'    => 'PAGE BUILDERS: get_post returns post_content, which holds the real content for '
				. 'Classic, Gutenberg, and Divi. For Gutenberg keep block comment markers (<!-- wp:... -->) '
				. 'intact when you edit.'
				. "\n\n"
				. 'ELEMENTOR: stores its content as JSON in the _elementor_data postmeta field, not in '
				. 'post_content -- if a page looks empty or like raw shortcodes/JSON in get_post, that is '
				. 'why. replace_in_post/append_to_post/bulk_replace_in_posts will return a WARNING when '
				. 'they detect this (edits to post_content on such a page usually will not appear on the '
				. 'live site). To actually read what is on an Elementor page, use get_page_html (the '
				. 'rendered output) or db_query to inspect _elementor_data directly '
				. '(SELECT meta_value FROM {prefix}postmeta WHERE post_id = X AND meta_key = '
				. "'_elementor_data'). There is no supported write path into _elementor_data -- SEO meta "
				. '(get_seo/set_seo) and schema (get_schema/set_meta) still work normally regardless of '
				. 'builder, since those are separate postmeta fields Elementor does not touch.'
				. "\n\n"
				. 'DIVI: content is genuine shortcode markup in post_content (e.g. [et_pb_section]'
				. '[et_pb_row][et_pb_column][et_pb_text]...[/et_pb_text][/et_pb_column][/et_pb_row]'
				. '[/et_pb_section]). Only edit text strictly INSIDE an [et_pb_text]...[/et_pb_text] (or '
				. 'similar content-bearing module) pair -- never touch a shortcode tag itself or its '
				. 'attributes (_builder_version, global_colors_info, background_layout, module IDs, etc.), '
				. 'and never delete/add a section/row/column tag unless the user explicitly asked to '
				. "remove that whole block. replace_in_post/append_to_post/bulk_replace_in_posts warn when "
				. 'the touched text looks like it crosses one of these boundaries -- treat that warning as '
				. 'a reason to re-check your find/replace strings before trusting the result, not something '
				. 'to ignore. After a Divi edit, call get_page_html on the same post to verify the page '
				. 'still renders correctly (a broken attribute can blank out a whole module silently).'
				. "\n\n"
				. 'Always confirm a replace_in_post/bulk_replace_in_posts match exists (or was reported as '
				. 'skipped) before assuming an edit landed.',
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
			'db_admin'         => 'DATABASE QUERIES (db_query): the escape hatch for data no purpose-built tool '
				. 'covers -- a form plugin\'s entries, WooCommerce order meta, or any other plugin\'s custom '
				. "table. SELECT/DESCRIBE/SHOW/EXPLAIN SELECT only; there is no write path. Use \"{prefix}\" "
				. "instead of guessing the table prefix. If you don't already know a table's columns, run "
				. 'DESCRIBE {prefix}tablename first rather than guessing column names -- schema-read '
				. 'commands are free and always allowed.'
				. "\n\n"
				. 'FORMIDABLE FORMS entries are NOT a single flat table -- this is the most common mistake. '
				. 'The schema is three tables:'
				. "\n"
				. '- {prefix}frm_items: one row per submitted entry (id, form_id, created_at, ip, post_id).'
				. "\n"
				. '- {prefix}frm_item_metas: one row per ANSWERED FIELD per entry (item_id, field_id, '
				. 'meta_value) -- this is where the actual answers live, not on frm_items.'
				. "\n"
				. '- {prefix}frm_fields: one row per form FIELD DEFINITION (id, form_id, name, type) -- this '
				. 'is how you map a human field label like "Country" or "Lead Type" to the field_id used in '
				. 'frm_item_metas.'
				. "\n\n"
				. 'Worked example -- "how many forms since July 1st, and the type of leads and country of '
				. 'origin": first find the relevant field IDs (name matching may need a couple of guesses -- '
				. 'try %lead%, %type%, %country%, %origin%):'
				. "\n"
				. "  SELECT id, name, form_id FROM {prefix}frm_fields WHERE name LIKE '%lead%' OR name LIKE "
				. "'%type%' OR name LIKE '%country%' OR name LIKE '%origin%'"
				. "\n"
				. 'Then get the raw count:'
				. "\n"
				. "  SELECT COUNT(*) FROM {prefix}frm_items WHERE created_at >= '2026-07-01'"
				. "\n"
				. 'Then pull the actual answers for the fields you identified, joined back to the entry rows:'
				. "\n"
				. '  SELECT i.id, i.created_at, m.field_id, m.meta_value FROM {prefix}frm_items i JOIN '
				. '{prefix}frm_item_metas m ON m.item_id = i.id WHERE i.created_at >= \'2026-07-01\' AND '
				. 'm.field_id IN (<the ids you found>)'
				. "\n"
				. 'Group/count the meta_value results yourself to answer "type of leads" / "country of '
				. 'origin" breakdowns -- db_query returns raw rows, not aggregates, so do the tallying in '
				. 'your own response rather than expecting SQL GROUP BY to hand you a finished summary '
				. '(a GROUP BY query works fine too if you prefer to write one).'
				. "\n\n"
				. 'If a site has multiple forms, filter frm_items/frm_fields by form_id too (look it up via '
				. '{prefix}frm_forms if the user does not name the form). Every query is capped at a LIMIT '
				. '(default 100, max 1000) automatically -- raise it with the "limit" argument if you '
				. 'expect more matching rows than that.',
			'bulk_site_changes' => 'BULK SITE CHANGES: when the same fix needs to land on many posts at once '
				. '(a broken URL, a changed phone number, a shortcode swap across the whole site), use '
				. 'bulk_replace_in_posts instead of calling replace_in_post once per post -- it takes up to '
				. '50 post IDs at a time and applies the same exact find/replace to each, reporting per-post '
				. 'success/skip/failure so one miss never blocks the rest of the batch.'
				. "\n\n"
				. 'Gather the target post IDs first -- search_posts for a simple keyword match, or db_query '
				. 'if you need something more specific (e.g. posts whose content contains a particular old '
				. 'domain or path). For a large list (Screaming Frog-style redirect/404 audits routinely '
				. 'surface dozens to hundreds of URLs), work in tiers of ~50 rather than one giant batch -- '
				. 'easier to spot-check and to isolate if something in one tier needs a different find/'
				. 'replace than another.'
				. "\n\n"
				. 'After each batch (or the whole change if it is small), call flush_caches -- a content '
				. 'edit that looks correct in bulk_replace_in_posts\' response can still appear stale on '
				. 'the live site until the caching layer (object cache, Elementor, WP Rocket, W3 Total '
				. 'Cache, LiteSpeed Cache, WP Super Cache, WP Fastest Cache, or SiteGround Optimizer -- '
				. 'flush_caches detects and flushes whichever is actually active) catches up. Spot-check a '
				. 'couple of the changed pages with get_page_html afterward to confirm the fix is actually '
				. "visible, especially on a Divi or Elementor page (see the page_builders skill).",
			'ga_intelligence'  => 'GOOGLE ANALYTICS (GA4): use these when the user asks about actual VISITOR '
				. 'behavior -- traffic volume, where visitors came from, engagement, conversions -- as '
				. 'opposed to search-ranking questions (gsc_intelligence) or Ahrefs\' traffic ESTIMATES '
				. '(seo_intelligence). GA4 is Google\'s own recorded data from this site\'s actual visitors, '
				. 'not an estimate from an external index. All tools default their target to this site; '
				. 'pass "site" (a property ID, display name, or domain -- see ga_list_properties) to query '
				. 'a different property verified under the same connected Google account. GA4 data is '
				. 'near-real-time -- unlike Search Console\'s 2-3 day lag, "yesterday" is a safe end date.'
				. "\n"
				. '- "How much traffic / where from": ga_traffic_overview gives sessions, active users, '
				. 'engagement rate, and conversions, broken down by channel (Organic Search, Direct, '
				. 'Referral, Social, Paid Search). Use this to answer "is our traffic actually working" '
				. 'questions GSC can\'t, since GSC only sees search-originated visits.'
				. "\n"
				. '- "Least/worst-performing pages by real traffic": ga_top_pages with order="worst" (fewest '
				. 'sessions first) -- this is REAL recorded traffic, so a page showing 0 here and 0 in '
				. 'gsc_top_pages/ahrefs_top_pages is a much stronger "genuinely no visitors" signal than any '
				. 'one of those three alone. order="best" for top performers.'
				. "\n"
				. 'Needs Google Analytics connected (a separate OAuth grant from Google Search Console, even '
				. 'though they share the same Google Cloud OAuth Client -- tell the user to connect it '
				. 'separately in Settings if a tool reports it\'s not connected).',
			'site_reports'     => 'SITE PERFORMANCE REPORTS: use this when the user asks for a periodic report, '
				. 'audit, or summary of how a site is doing -- "how did [site] do this month," "put together '
				. 'a report for [domain]," "send me the numbers for [site]." The connected Google account '
				. '(and Ahrefs, if configured) can see MANY different websites, not just this WordPress '
				. 'install -- the single biggest mistake is silently reporting on the wrong site. Confirm '
				. 'which site FIRST.'
				. "\n\n"
				. 'STEP 1 -- IDENTIFY THE SITE. If the user names a domain that is not obviously this '
				. 'WordPress site, call gsc_list_properties AND ga_list_properties before pulling any data, '
				. 'and match the user\'s wording against what comes back (domain, siteUrl, or GA4 '
				. 'displayName). If nothing matches cleanly, ask which one they mean rather than guessing -- '
				. 'reporting the wrong site\'s numbers as if they were the requested one is worse than '
				. 'asking. Once identified, pass that exact "site" value to every tool below so all of them '
				. 'query the SAME property, not each defaulting to a different guess.'
				. "\n\n"
				. 'STEP 2 -- PICK THE PERIOD. Default to the last full calendar month unless the user '
				. 'specifies a range (e.g. "this month," "last quarter," "since July 1st"). Convert that '
				. 'into explicit start/end dates once and reuse them across every tool call (the "days" '
				. 'argument on ga_traffic_overview/ga_top_pages/gsc_top_pages) so every section of the '
				. 'report covers the identical window -- mismatched date ranges between sections is a '
				. 'common, confusing mistake.'
				. "\n\n"
				. 'STEP 3 -- PULL THE DATA, ONE SIGNAL AT A TIME:'
				. "\n"
				. '- Visitor traffic and engagement (ga_traffic_overview): sessions, active users, '
				. 'engagement rate, conversions, and the channel breakdown (Organic Search vs Direct vs '
				. 'Referral vs Social vs Paid). This is the "how much real traffic, and where from" section.'
				. "\n"
				. '- Best/worst content by real traffic (ga_top_pages, order="best" and order="worst"): '
				. 'what to highlight as working, and what needs attention.'
				. "\n"
				. '- Search visibility (gsc_top_pages order="worst"/"best", plus gsc_page_queries on a '
				. 'specific page if the user wants query-level detail): how the site is doing IN SEARCH '
				. 'specifically, separate from overall traffic -- a page can have strong GA4 sessions from '
				. 'social/referral while ranking poorly, or vice versa, and that contrast is worth calling '
				. 'out explicitly rather than blending the two signals into one number.'
				. "\n"
				. '- Competitive context, if relevant (ahrefs_domain_metrics, ahrefs_organic_competitors): '
				. 'only pull this when the user asked about competitors or market position -- it is Ahrefs\' '
				. 'own estimate, not the site\'s real numbers, and should be labeled as such if included.'
				. "\n\n"
				. 'STEP 4 -- SYNTHESIZE, DO NOT JUST DUMP NUMBERS. A report is not four tool outputs pasted '
				. 'in sequence. Structure it as: (1) a short overview -- total sessions/users and the '
				. 'headline trend; (2) where traffic came from and whether that shifted; (3) what content '
				. 'is working and what is not, framed as call-outs ("X gets real traffic but doesn\'t rank," '
				. '"Y ranks well but converts nobody"); (4) a short list of concrete next actions, each '
				. 'grounded in a specific number just shown, not a generic suggestion. Never fabricate a '
				. 'trend, percentage change, or comparison to a prior period you did not actually query -- '
				. 'if the user wants a period-over-period comparison, run the same tools again for the '
				. 'prior period and compare the real numbers, rather than estimating the delta.'
				. "\n\n"
				. 'If GA4 is not connected yet for the requested site, say so plainly and build the report '
				. 'from whatever of GSC/Ahrefs IS available rather than refusing outright -- note explicitly '
				. 'which section is missing and why.',
			'delaguialuzon_monthly_report' => 'DELAGUÍA Y LUZÓN ABOGADOS MONTHLY REPORT (delaguialuzon.com): '
				. 'trigger on "informe delaguialuzon," "delaguialuzon report," or a periodic performance/SEO/'
				. 'leads report for this client. Default report window: since the end of the last report '
				. 'through today, unless another window is given. Deliberately built WITHOUT Ahrefs -- every '
				. 'signal here comes from native AISA tools (db_query, gsc_*, ga_*) or an explicit Chrome '
				. 'handoff for the two sources AISA has no connector for (Google Ads entirely; a couple of '
				. 'specific GA4 event-level cuts, noted below).'
				. "\n\n"
				. 'WRITE THE FINAL REPORT IN FORMAL SPANISH (castellano formal), FIRST PERSON, as if Michael '
				. 'Bastin (BeTranslated) is addressing the client directly -- close but honest, never '
				. 'softening a negative finding. This instruction stays in Spanish deliberately, since it is '
				. 'about the deliverable itself: "Nombrar siempre al menos una preocupación genuina junto a '
				. 'los aspectos positivos -- el cliente valora explícitamente la honestidad sin adornos por '
				. 'encima de un informe que suene pulido." Never invent or eyeball a GSC/Ads/GA4 figure -- if '
				. 'a data source is unavailable, say so and ask for it rather than guessing.'
				. "\n\n"
				. '1. LEADS -- Formidable Forms, via db_query (see db_admin skill for the general pattern). '
				. 'Use "{prefix}" -- do not hardcode a table prefix, it can differ per install/environment.'
				. "\n"
				. '   Totals per form: SELECT f.name AS form_name, COUNT(i.id) AS entry_count FROM '
				. '{prefix}frm_items i JOIN {prefix}frm_forms f ON i.form_id = f.id GROUP BY f.id ORDER BY '
				. 'entry_count DESC'
				. "\n"
				. '   Monthly trend: SELECT DATE_FORMAT(i.created_at, \'%Y-%m\') AS ym, f.name AS form_name, '
				. 'COUNT(*) AS cnt FROM {prefix}frm_items i JOIN {prefix}frm_forms f ON i.form_id = f.id '
				. 'WHERE i.created_at >= \'YYYY-MM-DD\' GROUP BY ym, f.id ORDER BY ym ASC'
				. "\n"
				. '   Enquiry-type breakdown: each form has an "Type of enquiry" dropdown field, but its '
				. 'field_id CAN CHANGE if the form is edited -- never trust a previously-noted ID blindly. '
				. 'Look it up fresh each time: SELECT id, name, form_id FROM {prefix}frm_fields WHERE name '
				. 'LIKE \'%enquiry%\' OR name LIKE \'%type%\', then: SELECT m.meta_value AS enquiry_type, '
				. 'COUNT(*) AS cnt FROM {prefix}frm_item_metas m WHERE m.field_id = <found id> GROUP BY '
				. 'm.meta_value ORDER BY cnt DESC'
				. "\n"
				. '   Group forms by language for cross-source comparison: EN = General Enquiries + '
				. 'Immigration Form; FR = Form general FR + Formulaire d\'immigration; ES = Form general ES '
				. '+ Form Extranjeria; RU = Form general RU + Форма по вопросам иммиграции + Form pop up RU.'
				. "\n\n"
				. '2. SEO -- native gsc_* tools, NOT Ahrefs. First call gsc_list_properties and match the '
				. 'exact property for delaguialuzon.com (this account has several similarly-named '
				. 'properties/domains -- confirm before pulling data, same discipline as the site_reports '
				. 'skill). Then gsc_top_pages (order="worst" and "best") for the report window, and '
				. 'gsc_page_queries/gsc_page_report on specific pages if query-level detail is wanted. '
				. 'KNOWN LIMITATION: gsc_top_pages/gsc_page_report take a rolling "days" window ending 3 '
				. 'days ago, not an arbitrary explicit month -- there is no native way yet to pull a clean '
				. 'month-by-month clicks/impressions/position TABLE the way Ahrefs\' gsc-performance-history '
				. 'report could. State the aggregate for the whole report window plainly; if the user '
				. 'specifically wants a month-by-month breakdown, say this requires either several '
				. 'carefully-dated calls (imprecise for anything beyond the most recent months) or a future '
				. 'tool enhancement, rather than fabricating a clean table.'
				. "\n\n"
				. '3. GOOGLE ADS -- no native AISA connector. Ask the user to run Claude in Chrome to: '
				. 'navigate to the Ads campaigns report, segment by month across the report window, filter '
				. 'status to "All" (include paused/ended campaigns), and extract Cost, Clicks, Impressions, '
				. 'CTR, Avg. CPC, Conversions, Cost/conversion -- both account totals and per-campaign, plus '
				. 'which campaigns are active/paused/ended. RECONCILIATION NOTE: Google Ads clicks '
				. '(especially Performance Max) do NOT map 1:1 to GA4\'s "Paid Search" channel -- PMax shows '
				. 'up in GA4 as Cross-network/Unassigned/Paid Shopping. Never compare Ads clicks directly to '
				. 'GA4 Paid Search sessions without flagging this.'
				. "\n\n"
				. '4. GA4 (property 424430838, or whatever gsc_list_properties/ga_list_properties currently '
				. 'resolves for delaguialuzon.com -- confirm, property IDs can be reassigned) -- MOSTLY '
				. 'native now via ga_traffic_overview (channel breakdown: sessions, engagement rate, '
				. 'conversions) and ga_top_pages, scoped with "site" to this property and "days" to the '
				. 'report window. TWO THINGS STILL NEED A CHROME HANDOFF because current AISA GA4 tools '
				. 'don\'t expose these specific cuts: (a) new users broken out by channel specifically '
				. '(ga_traffic_overview reports activeUsers, not newUsers, per channel); (b) monthly volume '
				. 'of individual events -- form_start, form_submit, generate_lead, any ads_conversion_* -- '
				. 'since neither ga_traffic_overview nor ga_top_pages request eventName/eventCount '
				. 'dimensions. For those two, ask the user to pull them from the GA4 UI directly (Adquisición '
				. 'de usuarios report for new-users-by-channel; Events report or Explore for the event '
				. 'volumes) rather than guessing.'
				. "\n"
				. '   CRITICAL CROSS-CHECK once you have both: compare GA4\'s monthly form_submit/'
				. 'generate_lead counts against the REAL Formidable lead counts (step 1) for the same '
				. 'months. If GA4\'s events crash toward zero while Formidable stays stable, that is a GTM/'
				. 'GA4 TAGGING BREAK, not a real lead drop -- say so explicitly, never let it read as a '
				. 'performance problem. This has happened before: generate_lead stopped firing entirely '
				. 'from March 2026 onward; form_submit dropped intermittently in March, April, and July '
				. '2026. Treat those as known incidents to check against, not as fresh findings to '
				. 'rediscover from scratch each time.'
				. "\n"
				. '   Flag if conversion/event value is €0 across the board -- it means Ads/GA4 cost-per-'
				. 'conversion figures measure cost-per-form-submission, not real ROI, since no monetary '
				. 'value is attached to a lead.'
				. "\n\n"
				. '5. CROSS-SOURCE SYNTHESIS -- the single most valuable part of the report, always do this. '
				. 'Build one consolidated month-by-month table: average GSC position, GA4 total sessions, '
				. '% organic sessions, monthly Ads spend, and REAL Formidable leads. The critical honest '
				. 'check: did traffic/spend growth actually translate into proportional REAL lead growth? '
				. '(Known historical baseline, for context only -- always recompute for the actual current '
				. 'window, never just restate this as if it were this report\'s finding: from Jul-2025 to '
				. 'Jul-2026, traffic and spend grew roughly 6-7x while real leads stayed essentially flat at '
				. '~48-49/month. That divergence pattern -- headline traffic growth vs. flat real leads -- is '
				. 'exactly the kind of honest finding to look for and lead with, not bury under a traffic '
				. 'chart.)'
				. "\n\n"
				. '6. REPORT STRUCTURE: introducción; evolución desde el principio (SEO, leads, Ads, GA4, en '
				. 'ese orden); sección honesta "¿lo estamos haciendo bien?"; lista numerada concreta de "en '
				. 'qué debemos mejorar"; cierre. Default export: Gamma (document, text mode "preserve" since '
				. 'the full text is pre-written, Spanish language) unless the user asks for something else '
				. '(chat, Word doc, etc.).',
		);
		if ( isset( $bodies[ $name ] ) ) {
			return $bodies[ $name ];
		}

		$skill_file = plugin_dir_path( __FILE__ ) . '../skills/' . $name . '.md';
		if ( file_exists( $skill_file ) ) {
			return file_get_contents( $skill_file );
		}

		return null;
	}
	
}
