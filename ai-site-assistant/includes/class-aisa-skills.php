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
		'eeat'            => 'Strengthen Experience, Expertise, Authoritativeness, and Trust signals in a post.',
		'fact_checking'   => 'Verify a claim, statistic, date, price, quote, or study before writing it, or check an existing one.',
		'nlp_readability' => 'Improve clarity, topical coverage, and readability without rewriting the whole post.',
		'internal_links'  => 'Find and add relevant internal links between existing posts and pages.',
		'meta_tags'       => 'Write or improve SEO meta title/description and Open Graph/Twitter tags.',
		'schema'          => 'Inspect or write Rank Math structured-data (schema.org) entries.',
		'page_builders'   => 'How post_content maps to Classic, Gutenberg, Divi, and Elementor, and what is/isn\'t editable.',
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
			'eeat'            => 'EEAT (Experience, Expertise, Authoritativeness, Trust): strengthen first-hand '
				. 'experience and credibility. append_to_post an author/credentials box and a "Sources" '
				. "list of reputable references; use replace_in_post to add the author's qualifications, "
				. 'a "last reviewed" date, and concrete first-hand detail. Do not invent credentials, '
				. 'citations, statistics, or dates — if you lack a real source, say so and ask. If you '
				. 'add a factual claim you are not certain of, load the fact_checking skill first.',
			'fact_checking'   => 'FACT-CHECKING: never invent or guess a statistic, date, price, quote, or named '
				. 'study. Before you add such a fact to content — or when the user asks you to verify '
				. 'existing claims — call fact_check with the specific statement. Trust its verdict: if '
				. 'it returns False or Misleading, correct or remove the claim; if Unverifiable, do not '
				. 'present it as fact. Cite the returned source URLs (as links or in a Sources list) '
				. 'rather than fabricating references.',
			'nlp_readability' => 'NLP / readability: improve clarity and topical coverage WITHOUT rewriting the whole '
				. 'post. Work section by section with replace_in_post: shorten sentences, add a clear '
				. 'subheading, define entities, and add the synonyms/related terms a search engine '
				. "expects. Keep the author's meaning and voice.",
			'internal_links'  => 'Internal links: use search_posts to find relevant existing posts/pages on the site, '
				. 'then replace_in_post to wrap an exact phrase in an <a href> to that URL. Use '
				. 'descriptive anchor text (not "click here"); add only a few genuinely relevant links.',
			'meta_tags'       => 'Meta tags: use get_seo then set_seo. A good meta_title is about 50-60 characters and '
				. 'includes the focus keyword near the front; a good meta_description is about 150-160 '
				. 'characters, compelling, and includes the keyword. Set og_/twitter_ fields when asked '
				. 'to optimise social sharing.',
			'schema'          => 'Schema / structured data: get_schema to inspect current Rank Math schema, then set_meta '
				. 'with the appropriate rank_math_schema_* key, passing the schema object as a JSON '
				. 'string. Match the content type (Article, FAQPage, HowTo, Product, etc.).',
			'page_builders'   => 'PAGE BUILDERS: get_post returns post_content, which holds the content for Classic, '
				. 'Gutenberg, and Divi. For Gutenberg keep block comment markers (<!-- wp:... -->) intact '
				. 'when you edit. Elementor stores its content in the _elementor_data meta field, not in '
				. 'post_content — if a page looks empty or like raw shortcodes/JSON, tell the user it is '
				. 'an Elementor page and that body edits are not supported yet (SEO meta and schema still '
				. 'work). Always confirm a replace_in_post match exists before relying on it.',
		);
		return $bodies[ $name ] ?? null;
	}
}
