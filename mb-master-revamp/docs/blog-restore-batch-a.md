# Blog restore, batch A

Five posts checked against their live legacy pages (`curl -sSL https://mikebastin.com/<slug>/`),
structurally diffed (headings, list items, table rows, links) against
`content/en/posts/<slug>.md`. None of the five matched the severe
strip-down numbers the task brief quoted for the first two
(`affiliate-marketing-programs`, `german-seo-best-practices`) against
what is live on mikebastin.com today: every heading, every list item
and every link from the current legacy page was already present in the
migrated file for all five posts. The one recurring real defect, found
in three of the five, was a comparison table whose data survived the
migration but landed as flattened plain-text paragraphs with no `|`
table syntax, so it would render as a wall of disconnected paragraphs
on the built site rather than a table. Fixed in all three cases. No
content was invented; nothing needed padding.

## 1. affiliate-marketing-programs (15,633 impressions)

Legacy: 15 h2, 1 list (3 items), 1 table (10 rows x 4 cols), 16 links
(10 programme links, Post Affiliate Pro source, Authority Hacker
source, 4 internal). Migrated file already had all 15 headings, the
3-item list and all 16 links intact and correctly repointed.

**Fixed:** the "Quick comparison of the 10 programmes" table had its
40 data cells flattened into 40 separate one-line paragraphs (Programme
/ Commission / Cookie / Best for, repeated per row) instead of a
markdown table. Rebuilt as a proper 4-column, 10-row markdown table
with the same programmes, commission rates and cookie windows, no data
changed.

Frontmatter `words` updated from 1076 to 1142 (now includes the
correctly-marked-up table).

## 2. german-seo-best-practices (11,166 impressions)

Legacy: 1 h2, 9 h3, 17 h4 (27 headings total), no lists or tables in
the article body (the original never had any), 16 links, all correctly
repointed to the current site's consolidated service pages
(`/services/local-seo/`, `/services/multilingual-content/`,
`/services/technical-seo/`, etc.). Migrated file matched the legacy
page heading-for-heading and link-for-link. No table or list existed
in the legacy version to restore.

No restoration needed. No changes made to this file.

## 3. chrome-extensions-for-seo (9,745 impressions)

Legacy: 12 h2 (intro plus 10 numbered extensions plus conclusion), 10
unordered lists totalling 41 list items, 9 product links (SimilarWeb
has no link in the legacy version either). Migrated file already had
all 12 headings, all 41 list items and all 9 links. The one forbidden
word in the legacy closing line, "leveraging", was already correctly
rewritten to "using" in the migrated copy.

No restoration needed. No changes made to this file.

## 4. chrome-extensions-for-translators (9,668 impressions)

Legacy: 26 headings (11 h2, 15 h3 including 4 FAQ questions), 1 table
(9 rows x 6 cols), 13 links, all first-person "I"/"my" pronouns already
correctly converted to "we"/"our" throughout, and the closing pull
quote's attribution already correctly using "Mike Bastin" rather than
the legacy page's "Michael Bastin". Migrated file had all 26 headings
and all 13 links matching the legacy page one-for-one.

**Fixed:** the "Side-by-side comparison" table (extension, best for,
free tier, languages, MV3 status, our usage) had its 54 data cells
flattened into one-line paragraphs instead of a table. Rebuilt as a
proper 6-column, 9-row markdown table, same data. Also cleaned up a
stray leading comma before the pull-quote's attribution line
(`>, [Mike Bastin]...` to `> [Mike Bastin]...`), a formatting artefact
from the migration, not a content change.

Verified all 5 external tool links (DeepL, ImTranslator, Mate
Translate, LanguageTool, CSA Research) return 200.

Frontmatter `words` updated from 1901 to 1984.

## 5. internal-linking-tools (8,197 impressions)

Legacy: 2 h2 intro sections, 7 h3 tool profiles, 2 more h2 (comparison
table, tips), 1 h2 conclusion, 76 unordered list items (Key
Features/Pros/Cons per tool plus the opening "why it matters" list), 1
ordered list (6 tips), 1 comparison table (6 rows x 4 cols, the last
cell a three-tier pricing breakdown with its own sub-links), 17 links
total. Migrated file already had every heading, all 76 unordered list
items, all 6 ordered tips and all 17 links (including the three
"Buy Personal/Freelance/Agency" checkout links) matching the legacy
page one-for-one.

**Fixed:** the comparison table had its data flattened into
one-line paragraphs, the same defect as posts 1 and 4, plus the
Autolinks Manager/Interlinks Manager pricing cell strung out as a long
run of `<br>`-separated lines. Rebuilt as a proper 4-column, 6-row
markdown table; condensed the pricing cell into "Personal, 1 site,
$39/year (buy); Freelance, 5 sites, $79/year (buy); Agency, 25 sites,
$149/year (buy)" with all three original checkout links preserved
inline, since a literal line-break dump does not read as a table cell.

Verified all 9 external tool links (Link Whisper, Linkilo, LinkBoss,
Linksy, Internal Link Juicer, Interlinks Manager, Autolinks Manager
plugin pages) and all 3 checkout links return 200.

Frontmatter `words` updated from 1243 to 1244 (negligible change; the
table rebuild is nearly word-count neutral).

## Dead links found and dropped

None outright. Five affiliate-programme links in post 1 (Amazon
Associates, ClickFunnels, Kit, Fiverr, Bluehost) returned 403/405 to
an automated `curl -I` even with a browser user agent. This reads as
bot-protection (Cloudflare or similar) on well-known, unambiguously
live affiliate pages of major brands, not as a dead target, so nothing
was removed or repointed. Every other external link across all five
posts (30+ checked) returned 200 cleanly.

## Prune-candidate flags

None. All five posts, once restored, carry either a genuine table/list
of real named tools and figures (posts 1, 3, 5), a specific technical
guide with no service-page overlap (post 2), or a first-person
practitioner walkthrough with a worked example and FAQ (post 4). None
reads as generic filler or a near-duplicate of a live service page.

## Lint check

`node scripts/copy-lint.mjs`: 141/141 English files clean, including
all five files in this batch (91/91 posts clean).

`node scripts/copy-lint-code.mjs`: 70/70 source files clean (this lint
covers `app`, `components`, `lib`, not content files, so it is
unaffected by this batch, run anyway per instructions).

No em/en dashes introduced, no forbidden vocabulary, no new
"This"/"That" sentence openers, no ampersands outside exempt query
strings, in any of the edits made. All three rebuilt tables verified
to render correctly through the site's actual renderer (`marked`,
which parses GFM pipe tables without extra configuration).
