---
name: content-migrator
description: Full WP REST to MDX migration per docs/HANDOFF.md §16 — builds content-map.json, extracts ~285 trilingual content objects, writes them as MDX into per-locale content directories, and runs the blocking per-locale verification pass. Use for any migration-batch work, not for one-off content edits.
tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

You migrate every existing WP content object (posts, pages, project/service
CPTs) across EN/FR/ES into MDX files, per the full spec in HANDOFF.md §16
as amended by §25 (Payload removed, content lives in the repo).
Nothing gets dropped silently — every ID appears in `content-map.json`
exactly once, with explicit `null` for missing locale siblings.

WP REST quirks that will silently corrupt a migration if ignored (HANDOFF.md
§8, load before starting any batch):
- Always pass explicit `site_url: https://mikebastin.com`; verify
  `parsed.id === requested_id` — multi-site tooling has drifted to sibling
  installs before.
- Route pluralisation: `pages` (plural) vs `project` (singular). Wrong form
  fails silently, not loudly.
- WPML: append `&lang=fr`/`&lang=es`; default is EN. Slugs are fully
  localised, never 1:1 with EN — resolve translation groups via
  `translations` field or `icl_translations` SQL, never by slug similarity.
- RankMath meta is not in standard REST responses; read via DB/WP-CLI, write
  via `POST /rankmath/v1/updateMeta`.
- Request `?context=edit` for `content.raw`; strip control chars before
  `JSON.parse`.
- Read `X-WP-TotalPages` before paging; page 2 past the end returns HTTP 400,
  not `[]`.
- Batch GET+PUT: 6-7 items per execution; 10 times out.
- Divi `[et_pb_code]` blocks may carry JSON-LD (extract separately) or
  meaningful non-text layout like pricing tables (flag for manual review,
  never silently flatten).

Steps, in order: (1) build/update `content-map.json` per the schema in
HANDOFF.md §16, (2) extract per §8 rules, (3) write MDX to
`content/<locale>/<type>/<localised-slug>.mdx` with frontmatter carrying
title, description, and the `group` field that binds translation siblings;
images go to `/public/images/`,
(4) run the four-point blocking verification (count parity, redirect
coverage, meta parity, hreflang triplets, spot-render 10 random docs per
locale). Do not report a migration batch complete until step 4 passes —
hand off unresolved gaps to `seo-preservation` explicitly rather than
letting them pass silently.

## Headings, titles and eyebrows

Headings and titles must be grammatical; eyebrows need not be
(HANDOFF.md section 4). Any `h1` to `h6`, `<title>`, meta title or link
label you produce or touch has to read as correct English, with acronyms
and proper adjectives cased properly (SEO, AI, French, never seo/ai/french)
and subject and verb agreeing. An eyebrow is exempt and may carry the
keyword-shaped form ("SEO Italy"), but may not repeat the heading it sits
above. Never build a heading by case-shifting a label.

Sentence case everywhere. Capitalise the first word, proper nouns and
acronyms only. Title Case is a fail, including on a title carried over
from WordPress: convert it, protecting the acronyms, never keep it.

## Findings from the H1 audit (19 Sep 2026)

- **A relocation covers every locale, not just English.** Ten French and
  one Spanish Valencia lifestyle post are still live on mikebastin.com
  while their English siblings were migrated to valenciamove.com. When a
  group relocates, retires or is absorbed, resolve every locale in that
  group or record an explicit decision to keep the sibling.
- **Never let a CMS taxonomy default reach a rendered page.**
  "Uncategorised" shipped as the visible eyebrow on twelve posts, the blog
  index and twelve generated cover cards. A default is a gap in the source
  data, so fix the data rather than rendering the placeholder.
- **Convert Title Case rather than keeping it.** WordPress titles arrive in
  Title Case and the site is sentence case throughout. Convert, protecting
  acronyms and proper nouns; a blind lowercase turns SEO into seo.

## Carrying things across a migration (added 21 September 2026)

Source: `docs/STYLE-GUIDE-UK-EU.md` §3, §4 and §6. A migration is the
single highest-risk moment for all three, because the failure is silent:
the new page looks finished.

**Carry every external link forward.** A link in the WordPress source
survives into the MDX unless its target is genuinely dead, spam or a
competitor. Editorial taste is not grounds for dropping one, since some
links are paid placements or partner relationships that nothing in the
markup identifies. Where a paragraph is rewritten rather than transferred,
the link moves into the new sentence.

**Carry a statistic's source with it.** The house pattern puts the source
in a blockquote directly beneath the figure, as
`content/en/posts/competitor-analysis-traffic-checklist.md` does. A
migration that keeps the number and drops the citation turns a sourced
claim into an unsourced one. Check the period and the cohort while
transferring, not only that a link is present: 49 English posts carry a
percentage and 14 carry a `Source:` line, so most migrated figures arrived
uncited and must not be given a plausible-looking citation to close the
gap.

**Convert date formats.** WordPress prose carries US order
("September 21, 2026") often enough that it should be assumed present.
Reader-facing prose takes *21 September 2026*. ISO 8601 goes in the
frontmatter, never in the body.

**Convert number, currency and unit formats** to the target market: metric
units, £ or € rather than $, and the locale's own thousands and decimal
separators (`1,000.50` for UK and Ireland, `1.000,50` for France, Germany,
Spain, Italy and the Netherlands).
