# Blog restore, batch E

Two posts checked against their live legacy pages
(`curl -sSL https://mikebastin.com/<slug>/`), with the actual `<table>`
elements extracted from the raw HTML and compared against
`content/en/posts/<slug>.md`. Both posts carried the same confirmed
defect from `docs/blog-legacy-diff.json`: real table data that survived
the WP-to-MDX migration but landed as flattened one-line paragraphs
instead of markdown table syntax. Fixed in both. No data invented; no
other part of either file touched.

## 1. how-to-create-a-targeted-content-strategy

Legacy: 2 tables.

**Table 1, "Top performing formats"** (3 cols x 5 rows): content type
against average engagement in minutes and conversion rate percentage
(Blog Posts, Videos, Social Media Posts, Whitepapers/Guides, Webinars).
Sat under the `### Top performing formats` heading, above the `_Source:
Internal analytics via Google Analytics..._` line, which was already
correctly attached and untouched.

**Table 2, "Repurposing examples for distribution"** (2 cols x 3 rows):
source asset against what it repurposes into (Blog Post, Webinar, Data
Report/Study), each cell holding compound text joined with `+`. Sat
under the `### Repurposing examples for distribution` heading. No
inline links in either table.

Both rebuilt as proper GFM pipe tables with the same figures and text,
nothing rounded or reworded.

Frontmatter `words` updated from 1509 to 1557 (body word count,
recomputed the same way the existing field was derived, confirmed by
matching the pre-edit body count exactly against the stored value).

Re-ran `node scripts/blog-legacy-diff.mjs --slug
how-to-create-a-targeted-content-strategy`: legacy tables=2, migrated
tables=2, no longer flagged as a mismatch.

## 2. optimising-your-website-for-valencia-based-searches

Legacy: 1 table, "Example Keywords and Their Intent" (2 cols x 4 rows):
keyword against search intent (Valencia coffee shops, Hire a plumber in
Valencia, Best schools in Valencia, Valencia real estate listings; each
row's intent Informational, Transactional or both). Sat directly under
the `**Example Keywords and Their Intent:**` line, above the `##
Improving site structure and metadata` heading. No inline links in this
table; both header cells were bold (`**Keyword**`, `**Search Intent**`)
in the legacy HTML, rendered as a plain header row in the rebuilt table
per GFM convention (bold text inside a table header is redundant since
`<th>` already renders bold).

Rebuilt as a proper 2-column, 4-row GFM pipe table, same keywords and
intents, nothing changed.

Frontmatter `words` updated from 2322 to 2342 (same recomputation
method as post 1, cross-checked against the pre-edit stored value).

Re-ran `node scripts/blog-legacy-diff.mjs --slug
optimising-your-website-for-valencia-based-searches`: legacy tables=1,
migrated tables=1, no longer flagged as a mismatch.

## Verification

All three rebuilt tables have a consistent column count per row and a
valid `| --- | ... |` separator row, so they parse as real GFM tables
under `marked`, the site's actual renderer, the same check batch A used.

`node scripts/blog-legacy-diff.mjs` was re-run scoped to each slug with
`--slug` to confirm the fix; the script writes its findings to
`docs/blog-legacy-diff.json` on every run, so that file was restored
with `git checkout -- docs/blog-legacy-diff.json` afterwards to avoid
clobbering the full-dataset findings with a two-post partial run.

`node scripts/copy-lint.mjs`: 137/137 English files clean, including
both files in this batch (87/87 posts clean). No em/en dashes, no
forbidden vocabulary, no ampersands, no "Michael" introduced by either
edit. No em/en dashes or ampersands existed in the raw legacy table data
either, so nothing needed normalising there.

## Dead links found and dropped

None. Neither table contained a link.

## Prune-candidate flags

None. Both posts, once restored, carry real named data (content-format
benchmarks and repurposing pairs in post 1, keyword-intent examples in
post 2) rather than filler.

## Not committed

Per instructions, changes were left on disk only; nothing was staged,
committed or pushed.
