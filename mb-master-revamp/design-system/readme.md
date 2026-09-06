# Mikebastin

The design system for **mikebastin.com**.

It covers the portfolio and consultancy site of an
international search consultant working in English, French, Spanish and Dutch out of
Valencia. Written from the shipped code, not from a brief: where the two disagree,
this system follows the code.

## Sources

| Source | What came from it |
|---|---|
| `multilang2025/mikebastin`, PR #53 (`refs/pull/53/head`, tree `873209987e0e`) | Everything here. Read 2026-08-21. |
| `mb-master-revamp/docs/DESIGN-SYSTEM-HANDOFF.md` | The band system, the closed palette, the eight page templates, the copy rules, the gap list. |
| `mb-master-revamp/site/app/globals.css` | Token source of record. Colours, type, grain, swell, reduced-motion rules, copied verbatim. |
| `mb-master-revamp/site/components/*.tsx` | The eleven shipped components. |
| `mb-master-revamp/site/app/{page,results/page,services/page,layout}.tsx` | Page composition, section rhythm, real copy. |
| `mb-master-revamp/site/lib/projects.ts` | The eight portfolio projects and their verified figures. |
| `mb-master-revamp/site/app/fonts/*.woff2`, `public/work/*.webp` | Fonts and client screenshots, copied into `assets/`. |

The reader is not assumed to have repository access. Every font, image and token value
needed to build with this system is stored locally here.

## Index

| File / folder | What is inside |
|---|---|
| `styles.css` | The one entry point. Imports only. |
| `tokens/colors.css` | Night Swell / Morning Glass, band scopes, theme scopes. |
| `tokens/typography.css` | Families, weights, the fluid scale, tracking, measures. |
| `tokens/spacing.css` | Shell, band rhythm, spacing steps, radii, motion timings. |
| `tokens/fonts.css` | `@font-face` for Fraunces, Cormorant Garamond, Inter. |
| `tokens/elements.css` | Base elements plus `.band`, `.shell`, `.grain`, `.eyebrow`, `.caps`, `.ulink`, `.swell`, `.shimmer`, `.hero-glow`, reduced-motion. |
| `components/` | 22 components in seven groups. See the table below. |
| `ui_kits/web/index.html` | Click-through of the site: Spread, Ledger, Service, Frames, Plain. |
| `ui_kits/web/index-v1.html` | First version, with the self-drawing gold and silver swell. Kept for reference. |
| `ui_kits/web/index-v2-language-cycle.html` | The hero that cycled one claim through EN, FR, ES and NL. |
| `ui_kits/web/index-print.html` | Print copy, built on `doc-page.js`. Plumbing for PDF export, not a deliverable. |
| `assets/globe.webm` | The earth footage, re-encoded to 620x620 for the quote band, with `globe-poster.jpg`. |
| `guidelines/` | 16 foundation specimen cards (colour, type, spacing, brand). |
| `assets/fonts`, `assets/work`, `assets/brand` | The real binaries. |
| `SKILL.md` | Agent-skill manifest, for use from Claude Code. |

### Components

| Group | Components |
|---|---|
| `components/layout` | `Band`, `SiteNav`, `SiteFooter`, `ThemeToggle` |
| `components/actions` | `Button`, `TextLink` |
| `components/forms` | `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `CheckboxGroup`, `FieldError` |
| `components/core` | `Chip`, `FilterPill` |
| `components/portfolio` | `Spread`, `TestimonialCard` |
| `components/data` | `Counter`, `StatCell`, `ImpressionsChart`, `LocaleTable`, `ConsolidationDiagram` |
| `components/motion` | `Reveal` |

**Intentional additions.** The shipped codebase has eleven components and no styled form
control of any kind. Seven were added here because the handoff names them as the first
thing to design and `/contact/` cannot be built without them: `Field`, `Input`,
`Textarea`, `Select`, `Checkbox`, `CheckboxGroup`, `FieldError`. `Button` and
`TextLink` were also added: buttons were ad hoc per page, and `TextLink` is the shipped
`.ulink` class as a component. `Band`, `Chip`, `FilterPill` and `StatCell` are
extractions of markup that repeats across the shipped pages, not new ideas.
`SmoothScroll` is deliberately not here: it has no visual surface.

**Substitutions.** The shipped components animate with `motion/react`. The versions here
reproduce the same distances, durations and easing with CSS transitions and an
`IntersectionObserver`, so they run without that dependency. Visual result is the same;
if you port back into the repository, keep whichever the codebase already uses.

## Page templates

Named in the handoff, agreed in chat before that, and not written down anywhere else.

| Template | Route | What it is |
|---|---|---|
| **Spread** | `/` | The portfolio homepage. Eight full-bleed client spreads, numbered I to VIII, alternating bands. The most designed surface on the site. |
| **Case** | `/work/<client>/` | One case study per spread. Credibility furniture matters more than decoration. |
| **Service** | `/services/<slug>/` | The commercial pages, 13 after consolidation. Highest conversion pressure. |
| **Market** | `/services/<language>-seo/` | A Service variant per language market. French is populated; German next. |
| **Ledger** | `/results/` | Numbers, charts and proof. Consumes `Counter`, `ImpressionsChart`, `LocaleTable`. |
| **Journal** | `/blog/<slug>/` | Long-form article. The least designed template and the one with most room. |
| **Index** | `/blog/`, `/services/`, `/work/` | Three listing pages that should not each be a bespoke design. |
| **Plain** | `/about/`, `/how-i-work/`, `/contact/` | Prose pages with a single job each. |

Mirrored under `/fr/` and `/es/`, with route segments localised rather than only leaf
slugs. A fourth locale (`/nl/`) is planned; the structure scales to it, and it should not
be designed for yet.

## Content fundamentals

**Voice.** Quietly specific. Numbers and named clients carry the claims, so the prose does
not have to. First-person plural ("we"), never "I". Second person for the reader.

**Copy rules that constrain design.** These are enforced by `site/scripts/copy-lint.mjs` in
the repository, and all 141 English content files pass it. They change layout decisions,
not only wording:

- **No em dashes or en dashes anywhere.** Ranges read "43 to 13". A design that uses a
  dash as a visual device has to be rethought rather than tweaked.
- **No ampersands.** "Services and pricing", never "Services & Pricing". Nav labels and
  any tight horizontal slot have to fit the longer word.
- **No sentence starts with "This" or "That".**
- **No emoji in body content.** Social posts only, one per post.
- **UK English**: optimise, localise, colour.
- **Rejected words**, in every inflected form: comprehensive, seamless, tailored, robust,
  innovative, dynamic, crafted, leverage. Placeholder copy in a mockup fails the lint if
  it reaches the repository, so write real copy in mockups too.

**Casing.** Sentence case for headings and body. Caps labels are uppercase with 0.11em
tracking, used for metric labels and table headers only.

**Names.** Reviewer names display as first name plus last initial. The full name is the
record, the initial is the display: never render a full reviewer name.

**Numbers.** Tabular figures everywhere a number carries a claim. Real figures or none:
where a hard number is not on record, the prose stays qualitative rather than guessing.

**Examples, verbatim from the site.**
- Hero: "Ranking is one language. *Converting is another.*"
- Pull quote: "A site that ranks everywhere and *converts nowhere* has a language problem, not a traffic problem."
- Eyebrow: "Reading the swell for twenty-five years, in four languages"
- Section head: "Forty thousand impressions. Six clicks."
- Footer: "Tell me which language is losing you money."

## Visual foundations

### The band system, which is the one idea to understand first

Colour is not applied per component. Every section of every page is a **band**, and the
band carries the token values; components only ever read variable names. Two band classes
alternate down the page:

- `.band-a` is the ground that follows the theme. With `data-theme="dark"` (the default)
  it resolves to **Night Swell**.
- `.band-b` is always the opposite ground.

The theme toggle flips the mapping. It touches neither markup nor component CSS. A
component that hardcodes a colour breaks the toggle silently, which is why the rule is
variables only, and why every component here has to be checked on both grounds.

### Palette, closed

Night Swell (`#0A1B28`) and Morning Glass (`#F5F0E4`) are the two grounds. Aubergine is
retired and must not come back. No hex outside `tokens/colors.css`.

`--berry` is the only accent: focus rings, selection, the eyebrow, metric figures, the
hero shimmer, the one flagged cell in a table. Gold and silver are unused: they drew the retired swell
mark and nothing has claimed them since. Treat them as available rather than as part of the
working palette, and consider dropping them. `--deep` appears only in the fallback gradient plate behind a project with no
screenshot. If a new component seems to need "a colour", the answer is almost always
`--dim`, `--chip` or `--rule`, not a new hue.

### Typography

Fraunces for display (h1 to h3, `.display`), optical sizing on, tracking `-.016em`,
`text-wrap: balance`. Cormorant Garamond italic for the eyebrow and nothing else, always
directly above a heading. It is a light, high-contrast serif, and set in berry it was the
least readable text on the site: the type is now `--ink` and berry moved to a 28px lead
rule beside it, which keeps the accent and takes the contrast from about 5.5:1 to full body
contrast. It runs at `clamp(1.2rem, 1.8vw, 1.55rem)` and weight 400, the heaviest the
loaded file carries. Do not put the colour back on the text and do not set it smaller. Inter for body at **weight 350** and
line-height **1.62**; 500 for emphasis and buttons, 600 for headings set in Inter.

The scale is fluid `clamp()` throughout, so one component works from mobile to desktop
without breakpoints. Measures: 58ch for a lede, 62ch for body, 46ch inside a spread.

### Backgrounds and texture

Flat bands. No gradients on body sections, no glassmorphism except the translucent header
and the theme toggle. Depth comes from `.grain`, an inline SVG noise overlay at 3.5% with
`mix-blend-mode: overlay` and no raster asset. Keep it on hero and other large flat bands:
it is doing real work there. `.hero-glow` adds one slow radial berry glow, hero only, one
per page.

### Imagery

Client homepage screenshots, `.webp`, cropped 5:4, object-position top, with an inset
`0 0 90px rgb(0 0 0 / .35)` shadow so the crop sits into the band. Where no usable capture
exists, the `--deep` gradient plate carries the domain name in Fraunces rather than a
wrong image. No stock photography and no illustration.

Globes need a specific ruling, because the obvious image for a multilingual business is
also the most worn one. The homepage pull quote carries one: photoreal footage of the earth
supplied by the owner, run large at `clamp(330px, 58vw, 760px)` and bleeding off the right
edge of the band, with the quote set over it. It is the only moving image and the only
photographic element on the site, which is what earns it the size. A generic stock globe is
still banned, and a second one anywhere would be one too many.

The footage lives at `assets/globe.webm` and carries its own black
space background. Rather than crop it to a hard disc, the edge is feathered with a radial
mask so the black dissolves into the band on either ground while the atmospheric rim
survives, and a `--deep` halo sits behind it picking up the blue the footage already has.
No ring: a hard edge fights the feather.

The supplied original is 3840x2160 and 19 MB, which is far more than a 760px masked
circle can show and too heavy to publish. `assets/globe.webm` is that clip re-encoded to
620x620 at 1.2 MB, with `assets/globe-poster.jpg` as the first-paint frame. Keep the
original in `uploads/` as the master; ship the webm. The quote carries a `--bg` text-shadow so it stays
legible where it crosses the globe.

### Animation

Micro and once. Reveal is a 26px rise with a 6px deblur over 850ms on
`cubic-bezier(.22,.7,.28,1)`, staggered 70ms. Bars grow from zero over 1.2s on first
sight. Counters ease out expo and settle. Two continuous animations run on the homepage, and they are the only ones on the site that
do not stop. The hero swell is three wave layers travelling left at 15s, 21s and 27s: the
differing speeds are deliberate parallax, so the lines drift apart and reconverge instead of
moving as one block. The second band carries the wireframe globe at 60s, slow enough never
to compete with the quote beside it. Both freeze under `prefers-reduced-motion`. Band
colour transitions take 500ms so a theme flip reads as a change of light rather than a
flash. No bounces and no page-load choreography. Parallax is confined to the hero
swell's three layers and the homepage spreads. Everything decorative stops dead under `prefers-reduced-motion`.

### States

- **Hover, primary button:** background darkens to `--berry-deep`. No lightening, no shadow.
- **Hover, secondary:** border goes berry, fill goes `--berry-soft`, label goes berry.
- **Hover, link:** the hairline underline draws in from the right.
- **Hover, chart row:** the row goes berry and every other row drops to 55% opacity.
- **Press:** 1px down. No scale on buttons.
- **Focus:** `2px solid var(--berry)`, offset 3px, on both grounds. Never suppressed.
- **Selected text:** berry fill, white ink.

### Borders, dividers, corners

One hairline: `1px var(--rule)`. Grids are built as a 1px gap over a `--rule` background
so the hairlines are the grid rather than borders drawn per cell. Tables have bottom rules
only: no zebra rows, no outer border, no shaded header. Radii are near-square: 3px for
chips, 4px for cards and fields, 999px only for the filter pill. No mixed radii in one
composition.

### Shadows

Almost none. The only shadow in the shipped code is the inset vignette on project
screenshots. Surfaces separate with `--shade` fills and hairlines instead.

### Layout

`.shell` is `min(1180px, 86vw)`, centred. Sticky header 62px, translucent
(`color-mix(in oklab, var(--bg) 82%, transparent)`) with a 12px blur and a hairline bottom.
The theme toggle is fixed top-right, so keep the header's right padding clear. Section
padding is `clamp(64px, 9vw, 128px)`, hero top `clamp(96px, 14vw, 190px)`. Wide content
scrolls inside its own container; the page body never scrolls horizontally.

## Iconography

There is no icon library in the codebase and none is added here. The site draws its few
marks inline: the four-bar mark in the header, the eight-ray
sun and crescent in the theme toggle, a five-point star for reviews, a rotated-border
caret on the select, a rotated-border tick in the checkbox, and one 1.2px curve in the
consolidation diagram. All of them inherit `currentColor` or read a token. No emoji, and
no unicode glyphs used as icons.

**Unicode in use:** curly quotes, the ellipsis, and the middot for inline metadata. The em
dash and en dash are banned site-wide.

**Logo.** There is no logo file in the sources. The mark is four bars of unequal length
drawn inline in `SiteNav`, the top one berry and the rest `--dim`: four languages, one
leading. It is deliberately the same shape as the impression bars on the Ledger page, so
the mark and the evidence share a vocabulary. "Mike Bastin" sits beside it in Fraunces 600.
See `guidelines/brand-mark.html`.

The two-line gold-over-silver swell that shipped in the repository is **retired**: the
colour pairing was rejected, and the hero now carries a language cycle instead, where one
claim moves through EN, FR, ES and NL on the site's own Reveal timing. Its CSS is out of
`tokens/elements.css` and its specimen card is deleted. `--gold` and `--silver` stay in
the palette but nothing uses them now; drop them if nothing claims them.

`assets/brand/icon.svg` has been redrawn as the four-bar mark so the browser tab matches
the header.

> ⚠️ **Substitution flag.** `assets/brand/apple-icon.png` is still a raster of the retired
> swell and cannot be regenerated here. It needs a real export of the four-bar mark at
> 180×180. Until then, that one file contradicts the rest of the system. `assets/brand/icon.svg` is the same mark as a favicon;
`apple-icon.png` is still the retired swell and needs re-exporting. Nothing here was drawn
from memory or invented; if a real wordmark exists, drop it into `assets/brand/` and it replaces the type
treatment.

## Non-negotiables checklist

- [ ] Every colour is a `var(--token)`. No literal hex outside `tokens/colors.css`.
- [ ] The component renders correctly on `.band-a` and `.band-b`.
- [ ] Focus is visible on both grounds: `2px solid var(--berry)`, offset 3px.
- [ ] Contrast meets WCAG AA in both themes, not only the light one.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No monospace UI font, no aubergine, no superhero imagery. The "Silver Surfer"
      nickname is prose only; the visual vocabulary is original surf and wave motifs used
      as seasoning, not as a theme.
- [ ] Body text is weight 350 at 1.62, not 400.
- [ ] Copy passes the lint: no dashes, no ampersands, no rejected words.

## Still to design

From the handoff's gap list, in its order. The form set (1) and the button variants (2) are
built here; the rest are open.

1. ~~A form: input, textarea, select, checkbox, error state, on both bands.~~ Built.
2. ~~Button and link variants, each resolved on both bands.~~ Built (primary, secondary,
   ghost, disabled).
3. **The Journal template.** Article typography, pull quotes, figures with captions, code,
   tables, related links. Nothing exists yet.
4. **Index cards.** One card that works for a post, a service and a case study rather than
   three.
5. **A dashboard surface.** Task cards and quick actions, discussed for a later phase.

## Getting work back into the repository

Live `DesignSync` does not run from a cloud session: it needs an interactive
`/design-login`. Two routes that do work: Claude Design's "Send to Claude Code Web", which
seeds this project into the workspace directly, or attach the files and have the session
wire them into `site/components/` and `site/app/globals.css`. Either way the token layer in
`globals.css` is the integration point, and `tokens/colors.css` here is a copy of it, so
build against the tokens from the start.
