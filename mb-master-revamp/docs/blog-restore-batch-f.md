# Blog restore, batch F

Two posts checked against their live legacy pages (`curl -sSL https://mikebastin.com/<slug>/`),
with the actual `<table>` elements extracted from the raw HTML and compared
against `content/en/posts/<slug>.md`. Both posts carried the same defect
already confirmed by `scripts/blog-legacy-diff.mjs`: table data survived the
WP-to-MDX migration but landed as flattened one-line paragraphs (and, in
one case, bullet lists) instead of markdown table syntax. Fixed in both.
No content was invented; no figure, header or row was changed or rounded.

## 1. search-everywhere-strategy (1 missing table)

Legacy: 1 table, "Key search surfaces in 2026" (3 cols x 4 rows: Search
Surface, User Intent, Optimization Focus), sitting under the "The end of
the Google monopoly" section. The migrated file already had this data
correct, word for word, just flattened into 12 separate one-line
paragraphs instead of a table (the legacy page's "&" in "Social proof &
trends" had already been correctly converted to "Social proof and
trends" during migration, and the legacy "Optimisation Focus" header had
already been correctly US-spelled to "Optimization Focus" per this
project's `optimiz*` exception).

**Fixed:** rebuilt as a proper 3-column, 4-row markdown table, same
surfaces, intents and optimisation-focus text, nothing added or reworded.

Frontmatter `words` updated from 1133 to 1154 (now includes the
correctly-marked-up table's text, which a flattened paragraph dump was
already counting, so the delta is the table syntax overhead only).

## 2. technical-seo-for-spanish-search-engines (3 missing tables, the biggest job in this pass)

Legacy: 3 separate tables, in three different sections of the article:

1. **Keyword research tools table** (5 cols x 5 rows: Tool, Features,
   Pricing, Best Use Case, Suitability for Spanish Market), under "Keyword
   research for Spanish search engines: building the blueprints" — Google
   Keyword Planner, SISTRIX, Oncrawl, Ahrefs, Screaming Frog, with pricing
   in GBP and inline links to `/blog/what-is-search-intent-mapping/`,
   `/blog/french-ppc-campaign/` and `/blog/technical-seo-audit-checklist/`
   already correctly repointed in the migrated text.
2. **Site speed checklist table** (2 cols x 8 rows: Recommendations,
   Checklist), under "Site speed and performance: building a strong
   infrastructure" — Image Optimization, Server Optimization, Content
   Delivery, JavaScript and CSS, Reduce HTTP Requests, Mobile
   Optimization, Browser Caching, Font Optimization. Each legacy
   "Checklist" cell held a 2-3 item bullet list, which the migration had
   flattened into loose top-level list items rather than a table.
3. **Schema types table** (3 cols x 8 rows: Type, Use Case, Impact on
   Spanish SEO), under "Schema markup and rich snippets: the finishing
   details" — Local Business, Organisation, Product, Review, FAQ,
   Article, Event, Recipe.

All three tables' data in the migrated file already matched the legacy
page exactly (including the already-applied house-style spellings:
"localization"/"optimizes" per the `optimiz*`/`localiz*` US exception,
"behaviour"/"organisation" kept UK), just flattened into one-line
paragraphs (tables 1 and 3) or a run of top-level bullet lists with no
surrounding table structure (table 2).

**Fixed:** rebuilt all three as proper markdown tables, same tool names,
prices, use cases, schema types and descriptions as the legacy page, no
data changed. For table 2, each multi-item legacy checklist cell was
condensed into a semicolon-separated clause (e.g. "Compress images
(WebP); use responsive sizes; use tools like TinyPNG, adapt images for
screen sizes") rather than left as a `<ul>` dump inside a table cell,
following the same precedent set in batch A for a bulleted pricing cell,
since a literal list-in-a-cell does not render cleanly through `marked`'s
pipe-table syntax. The one internal link inside that table
(`/services/multilingual-seo/` for "Responsive design", already
repointed away from the legacy page's now-retired `/services/web-design/`
target during migration) was preserved.

Frontmatter `words` updated from 1668 to 1747.

## Dead links found and dropped

None. All internal links inside the rebuilt tables
(`/blog/what-is-search-intent-mapping/`, `/blog/french-ppc-campaign/`,
`/blog/technical-seo-audit-checklist/`, `/services/multilingual-seo/`)
were already correctly repointed in the migrated file before this pass
and were carried over unchanged.

## Prune-candidate flags

None. Both posts, once restored, carry either a live multi-surface
strategy framework with real tool/comparison data (post 1) or a full
technical-SEO toolkit with three distinct comparison tables of real
named tools, prices and schema types (post 2). Neither reads as filler.

## Verification

Both files checked against the site's own table detector
(`scripts/blog-legacy-diff.mjs`'s `hasMigratedTable` regex): 1 table
counted in `search-everywhere-strategy.md`, 3 in
`technical-seo-for-spanish-search-engines.md`, matching the diagnosed
counts exactly. Also parsed both files through the site's actual
renderer, `marked`'s lexer, directly:

- `search-everywhere-strategy.md`: 1 table, 3 cols, 4 rows.
- `technical-seo-for-spanish-search-engines.md`: 3 tables, 5 cols x 5
  rows, 2 cols x 8 rows, 3 cols x 8 rows.

All four tables parse as real GFM tables with consistent column counts
per row and a valid separator row.

`node scripts/copy-lint.mjs`: 137/137 English files clean, including
both files in this batch. No em/en dashes introduced, no forbidden
vocabulary, no ampersands, no "Michael" anywhere near the edits, and the
UK-except-`optimiz*`/`localiz*` spelling split preserved exactly as it
already stood in the migrated text.
