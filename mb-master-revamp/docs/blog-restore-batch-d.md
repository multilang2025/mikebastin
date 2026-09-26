# Blog restore, batch D

Three posts checked against `docs/blog-legacy-diff.json`, which had already
confirmed all three lost a comparison table in the WP-to-MDX migration (1
legacy table, 0 migrated tables, each). Fetched each live legacy page
(`curl -sSL https://mikebastin.com/<slug>/`) and located the real
`<table>` element in the raw HTML, then matched it to the flattened
one-line-paragraph run sitting in roughly the same spot in the migrated
file. All three legacy tables were real data tables, not layout tables.
No page 404s. All three data sets matched what had already survived in
the flattened paragraphs exactly, so nothing had to be invented, only
re-marked-up.

## 1. competitor-analysis

Legacy table: "The toolkit we use, with honest caveats", 3 columns (Tool,
What we use it for, Reality check), 5 data rows (Ahrefs, Semrush,
SimilarWeb, Google Search Console, Manual SERP checks). No links inside
the table cells.

**Fixed:** the 15 data cells plus 3 header cells had been flattened into
18 separate one-line paragraphs instead of a markdown table. Rebuilt as
a proper 3-column, 5-row GFM pipe table, same tools and same caveats
verbatim (the legacy page's own header already reads "What we use it
for", first person already converted to "we" prior to this pass).

Frontmatter `words` updated from 1096 to 1121.

## 2. digital-marketing-advisor

Legacy table: "Digital marketing advisor vs agency at a glance", 3
columns (Dimension, Digital marketing advisor, Marketing agency), 6 data
rows (Primary role, Time on strategy, Engagement style, Best for,
Typical pricing, Risk of bias). The Dimension column's cells are bold in
the legacy markup; kept bold in the rebuild. No links inside the table.

**Fixed:** the 18 data cells plus 3 header cells had been flattened into
21 one-line paragraphs. Rebuilt as a proper 3-column, 6-row GFM pipe
table, same dimensions and same comparison text verbatim.

Frontmatter `words` updated from 2004 to 2033.

## 3. english-to-french-translation-services

Legacy table: "Service tiers and what each one covers", 4 columns
(Service, Best for, Includes, Typical turnaround), 5 data rows (Standard
translation, SEO translation, Transcreation, MTPE / post-AI editing,
Certified / sworn translation). The Service column's cells are bold in
the legacy markup, and the Certified row's "Includes" cell has
"Traducteur assermenté" in italics; both preserved in the rebuild. No
links inside the table.

**Fixed:** the 20 data cells plus 4 header cells had been flattened into
24 one-line paragraphs. Rebuilt as a proper 4-column, 5-row GFM pipe
table, same tiers and same figures verbatim.

Frontmatter `words` updated from 1828 to 1859.

## Dead links found and dropped

None. No external links appeared inside any of the three tables, so
there was nothing to carry over or check.

## Prune-candidate flags

None. All three posts carry a specific, named comparison (tools, an
advisor/agency framework, service tiers) rather than generic filler.

## Lint check

`node scripts/copy-lint.mjs`: 137/137 English files clean, including all
three files in this batch (87/87 posts clean).

## Table parsing verified

Each rebuilt table was run through this project's actual renderer
(`marked`'s lexer, via `node_modules/marked`) against the file body with
frontmatter stripped, confirming one `table` token per file with the
correct header and row counts:

- competitor-analysis: header `Tool | What we use it for | Reality
  check`, 5 rows.
- digital-marketing-advisor: header `Dimension | Digital marketing
  advisor | Marketing agency`, 6 rows.
- english-to-french-translation-services: header `Service | Best for |
  Includes | Typical turnaround`, 5 rows.

No em/en dashes introduced, no forbidden vocabulary, no ampersands, no
"Michael" anywhere near the edits. No connecting prose was written; only
the flattened paragraphs were converted to pipe-table syntax, so no new
sentences needed checking against the style rules.
