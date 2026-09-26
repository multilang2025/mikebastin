# Blog restore, batch B

Five posts checked against their live legacy pages (`curl -sSL https://mikebastin.com/<slug>/`),
structurally diffed (headings, list items, table rows, links) against
`content/en/posts/<slug>.md`. Unlike the two examples that opened this task
(`affiliate-marketing-programs`, `german-seo-best-practices`), none of these
five had suffered the severe strip-down pattern. All five had every heading,
every list item and every link from the legacy page already present in the
migrated file. The real issues found were two broken markdown tables (data
present but not rendered as a table) and one bad internal link, both fixed.
No content was invented; nothing needed padding.

## 1. french-ppc-campaign (5,465 impressions)

Legacy: 10 h2, 0 lists, 0 tables, 7 external/internal links (prose-only
guide, no bullet points or tables in the original either).

Migrated file already carried all 10 headings and all 7 links, values and
numbers intact (€7.7 billion market size, 92% Google share, CPC/CTR/ROAS
terminology). Nothing missing.

**Fixed:** one internal link, "common mistakes businesses", pointed at the
generic `/blog/` index instead of the specific post it named in the legacy
page. Repointed to `/blog/seo-mistakes-to-avoid/` (the post exists and is
live). All other repointed links (`/how-i-work/`, `/services/technical-seo/`,
etc.) already correctly target live current-site pages replacing dead
legacy service slugs.

No word count change (frontmatter already accurate at the old figure; body
text was untouched apart from the URL).

## 2. 360-marketing-agency (4,566 impressions)

Legacy: 2 h2, 8 h3, 1 table (5 rows), 14 list items, 5 links. This post was
already a full custom rewrite in the site's own voice (not a raw WP
migration), and every heading, list item, link and the table's data were
already present in the migrated file.

**Fixed:** the "Promise vs reality" comparison table had its five rows
present as plain flattened paragraph text with no `|` table syntax, so it
would have rendered as ten disconnected paragraphs instead of a table on
the built site. Rebuilt it as a proper two-column markdown table with the
same five rows and figures (no content changed, only the markup).

Frontmatter `words` updated from 891 to 914 (actual count including the
now-correctly-marked-up table).

## 3. conversational-ai-chatbots-business (3,327 impressions)

Legacy: 16 h2, 0 h3 (subsections were bolded lead-ins inside paragraphs,
not real headings), 0 lists, 0 tables, 13 links. Migrated file has 15 h2
(one is a duplicate of the article's own title used as an opening section,
matching legacy's pattern) and all 23 bold subsection leads and all 13
links. Verified every repointed link target (`/services/multilingual-seo/`,
`/services/technical-seo/`, `/services/website-localisation/`,
`/services/translation-services/`, `/services/generative-engine-optimization/`,
`/services/ai-consulting/`, plus three blog posts) resolves to a real, live
page under the current 19/20-service consolidation.

No restoration needed. No changes made to this file.

## 4. link-building-in-spain (2,927 impressions)

Legacy: 2 h2, 6 h3, 1 table (4 rows), 0 bullet lists, 8 links, 1 sourced
statistic in a blockquote (INE internet-usage figure). Migrated file
already had every heading, every link (verified all three
`/blog/spanish-*` targets exist and are live) and the sourced statistic
with its blockquote and citation intact.

**Fixed:** the "tactic / effort / DR range / what you get" comparison table
had the same problem as post 2, four rows flattened into plain text with
no table markup. Rebuilt as a proper markdown table with the same four
rows, effort levels and DR ranges as the legacy version.

Frontmatter `words` updated from 912 to 946.

## 5. multilingual-keyword-research (2,852 impressions)

Legacy: 2 h2, 4 h3, 9 h4, 31 list items (9 unordered lists plus a 7-item
numbered "best practices" list), 8 links. Migrated file had all 31 list
items and all 8 links already present, matching one-for-one.

**Fixed:** one internal link, item 7 of the "best practices" list ("Use
long-tail keywords"), pointed at `/blog/multilingual-keyword-research/`,
this post's own URL, a broken self-referential leftover from the
migration. The legacy page pointed it at the long-tail-keywords post,
which exists and is live. Repointed to `/blog/long-tail-keywords/`.

No word count change (link text unchanged, only the URL).

**Prune-candidate flag:** this post is a generic "best practices" checklist
(seed keywords, dedicated URLs, hreflang tags, translate your keywords)
with no named client, no real number and no angle a competitor could not
also write. It overlaps heavily with the ground already covered by
`/services/multilingual-seo/` and reads as filler rather than something
that earns its own URL. Left as-is per instructions rather than padded
out; worth a look for the pruning process.

## Dead links found and dropped

None. No link target across all five posts returned a dead page; every
legacy link, once repointed to the site's current URL structure, resolves
to a real, live page. Nothing was dropped for being dead, spam or a
competitor.

## Lint check

`node scripts/copy-lint.mjs`: 141/141 English files clean, including all
five files in this batch (91/91 posts clean).

`node scripts/copy-lint-code.mjs`: 70/70 source files clean (this lint
covers `app`, `components`, `lib`, not content files, so it is unaffected
by this batch, run anyway per instructions).

No em/en dashes introduced, no forbidden vocabulary, no new "This"/"That"
sentence openers in any of the edits made.
