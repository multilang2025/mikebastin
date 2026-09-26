# Journal post structure: length, headings, tables, figures

Owner request, 26 September 2026: "Add tables and illustrations and
restructure those articles that are too long. Add a TOC." This file is the
spec every restructuring pass works to, so the 50-odd English posts come
out consistent rather than each reflecting whoever edited it.

It sits on top of the house rules (root `CLAUDE.md`, "Non-negotiable
rules") and `docs/STYLE-GUIDE-UK-EU.md`, which still apply in full.

## What the page already does for you

- **TOC.** `app/blog/[slug]/page.tsx` builds an "On this page" outline
  from the post's `h2` and `h3` whenever there are three or more. Below
  1024px it is a disclosure above the body; on desktop it is a sticky
  rail beside the text that highlights the section being read. `h4` and
  deeper never appear in it. So the heading structure *is* the TOC: a
  post whose sections are all `h3` under one `h2`, or whose steps are `h4`,
  gets a broken outline.
- **Tables** get a bordered, scrolling wrapper (`lib/posts.ts`,
  `renderMarkdown`), so a wide table scrolls inside the column on a phone.
- **Figures** are styled by `figure.post-fig` and the `fg-*` classes in
  `app/globals.css`.

## Too long

A post is too long when its length is not earning its keep: a body over
**2,000 words**, an intro longer than three short paragraphs, the same
point made twice, or a checklist item padded out with generic filler.

- Target **1,200 to 2,200 words** for a guide. A reference checklist may
  run longer only if every section is doing distinct work.
- The intro states what the reader gets, in two or three short
  paragraphs. No extended metaphors, no "buckle up", no rhetorical
  questions stacked up before the first useful sentence.
- Cut repetition and filler, not substance. Merge sections that say the
  same thing. Move comparable facts out of prose into a table.
- **Never remove an external link** (dead, spam or competitor excepted,
  and verified by fetching). Keep every sourced statistic and its source
  blockquote. Keep the post's primary topic, title and slug.
- Fix internal links whose anchor text does not describe the target
  (an anchor saying "robots.txt" that points at the GEO service page),
  and remove links from a post to itself.
- Update stale facts found on the way (retired tools, renamed products,
  "this year" that is two years ago), with a source where it is a figure.

## Headings

- `h2` for each main section, `h3` for sub-points inside one. `h4` only
  in exceptional cases; it does not reach the TOC.
- **Sentence case**, grammatical, no trailing colon. Acronyms cased
  (SEO, URL, XML). "Robots.Txt" is wrong; "robots.txt" is right.
- No escaped list numbering in headings (`### 1\. Security`) unless the
  post is a genuine ordered procedure where the number carries meaning.
  A TOC reading "1. 2.1 2.2 3." is noise.
- Between 5 and 12 `h2`s for a long post. More than about 25 TOC entries
  in total means the outline is too granular: demote or merge.
- A closing section is fine, but not headed "Conclusion" (the phrase "In
  conclusion" is banned, and a heading saying so is the same tic). Name
  what it does: "Where to start", "The short version".

## Tables

Use a table where the content is genuinely tabular: options compared on
the same attributes, prices, tools, a check-cause-fix grid, a schedule.
Not for prose chopped into cells.

- **One to three per long post**, placed where they replace prose.
- GitHub-flavoured markdown pipe tables. A header row, short cells, no
  paragraphs inside a cell. Three to five columns; the first column is
  the row label.
- Cells obey the copy rules (no ampersands, no dashes, UK spelling).
- A figure in a table still needs its source: put the source blockquote
  directly under the table.

## Illustrations (inline SVG figures)

One or two per long post, only where a diagram explains something faster
than text: a process or order of operations, a hierarchy, a comparison
of two or three things, a funnel, a timeline. Never decoration, never a
stock-photo substitute, never a chart of numbers that are not sourced.

Written as raw HTML inside the markdown. **No blank lines anywhere
inside the `<figure>` block**, because `marked` ends an HTML block at a
blank line and the rest would render as text. Leave a blank line before
and after the block.

```html
<figure class="post-fig">
<svg viewBox="0 0 400 130" role="img" aria-label="One sentence saying what the figure shows.">
<line x1="50" y1="32" x2="350" y2="32" class="fg-rule"/>
<circle cx="50" cy="32" r="26" class="fg-box"/>
<circle cx="350" cy="32" r="26" class="fg-hot"/>
<text x="50" y="38" text-anchor="middle" class="fg-strong">1</text>
<text x="50" y="90" text-anchor="middle" class="fg-text">Crawl</text>
<text x="50" y="114" text-anchor="middle" class="fg-label">robots, sitemap</text>
</svg>
<figcaption>One or two sentences on what to take from it.</figcaption>
</figure>
```

Rules:

- **viewBox 400 wide**, height as tight as the content (roughly 100 to
  320), no empty bands top or bottom. The figure is capped at 560px on
  desktop and shrinks to about 320px on a phone, so design for the phone:
  at most four items across a row; a longer sequence goes vertical.
- **Only the `fg-*` classes for colour.** No `fill="#..."`, no `stroke`
  colours, no `style=` colours: hard-coded colours break dark mode and the
  palette rule. `fill="none"` is allowed.
  - Strokes: `fg-line` (ink), `fg-dim`, `fg-rule` (faint), `fg-accent`
    (berry, the one thing to notice).
  - Shapes: `fg-box` (card on the page background), `fg-hot` (berry
    highlight, use once), `fg-fill` (muted solid), `fg-fill-accent`.
  - Text: `fg-strong` (17), `fg-text` (16), `fg-label` (14). Nothing
    smaller. Keep labels to one to three words; a 400-unit row of four
    fits about 14 characters per label at `fg-label`.
- Text in a figure is copy: the house rules apply, and it must say
  nothing the article does not.
- `role="img"` and an `aria-label` sentence on the `<svg>`; a
  `<figcaption>` that adds the takeaway rather than repeating the label.
- No `<script>`, no external `href`, no `<foreignObject>`, no animation.
- Straight lines, circles, rects with `rx="6"`, simple paths. Arrowheads
  as a small `path` in `fg-line`/`fg-accent` rather than `<marker>` defs.
