# Design system handoff — mikebastin.com

For Claude Design. Written 21 Aug 2026 from the shipped code, not from the
original brief, so where the two disagree this file follows the code.

**Live preview:** https://preview.mikebastin.com/
**Token source of record:** `site/app/globals.css`
**Rules that constrain design choices:** `CLAUDE.md`, `docs/HANDOFF.md` §2/§22/§23

---

## 1. How to work with this

The design system does not exist yet. What exists is a working site with a
consistent token layer and eleven components, built page by page. The job is
to lift that into a named, documented system that can be extended without
re-deciding the same things.

Two constraints that are not negotiable, because the owner has already
rejected the alternatives:

- **Palette is closed.** Night Swell / Morning Glass only, listed in full
  below. Aubergine is retired and must not come back. No hex outside this set.
- **No monospace UI fonts**, and no Marvel or superhero visual language. The
  "Silver Surfer" nickname is prose only; the visual vocabulary is original
  surf and wave motifs, used as seasoning rather than as a theme.

---

## 2. The band system, which is the one idea to understand first

Colour is not applied per component. Every section of every page is a
**band**, and the band carries the token values; components only ever read
variable names. Two band classes alternate down the page:

| Class | Role | Background | Ink |
|---|---|---|---|
| `.band-a` | Morning Glass, the light ground | `#F5F0E4` | `#0F2837` |
| `.band-b` | Night Swell, the dark ground | `#0A1B28` | `#F5EFE2` |

The theme toggle flips which set `.band-a` resolves to. It does not touch
markup, and it does not touch component CSS. Anything you design has to work
on both grounds without knowing which one it is on. A component that hardcodes
a colour breaks the toggle silently, which is why the rule is variables only.

Under `prefers-color-scheme: dark` the mapping inverts by default, and an
explicit user choice overrides it.

### Full token set

```
                     .band-a (light)      .band-b (dark)
--bg                 #F5F0E4              #0A1B28
--ink                #0F2837              #F5EFE2
--dim                #58707F              #AFC0CC
--gold               #9A6E1C              #D9A94A
--gold-soft          #8A5A16              #E8CD7A
--berry              #C42640              #F2556A     <- the accent
--berry-deep         #9E1B31              #C9304A
--berry-soft         berry @ 10%          berry @ 13%
--deep               #1C6580              #155268
--silver             #6E8291              #BCC9D3
--rule               ink @ 16%            ink @ 15%
--chip               ink @ 5.5%           ink @ 7%
--glow               berry @ 9%           berry @ 14%
--shade              ink @ 4%             ink @ 4%
```

`--berry` is the only accent. It carries focus rings, selection, the eyebrow,
and the one shimmer treatment on the hero. Gold is secondary and used
sparingly. If a new component needs "a colour", the answer is almost always
`--dim`, `--chip` or `--rule`, not a new hue.

---

## 3. Typography

Three families, each with one job:

| Token | Family | Used for |
|---|---|---|
| `--font-display` | Fraunces | h1, h2, h3, `.display`. Optical sizing on, letter-spacing `-.016em`, `text-wrap: balance` |
| `--font-script` | Cormorant Garamond, italic | `.eyebrow` only. Sits above a heading, in berry |
| `--font-sans` | Inter | Body. Weight **350**, line-height **1.62** |

Body weight 350 rather than 400 is deliberate and easy to lose in a redesign.

Layout container is `.shell`: `width: min(1180px, 86vw)`, centred. A `.grain`
utility adds an inline SVG noise overlay at 3.5% opacity with
`mix-blend-mode: overlay`, which is how depth is achieved without a raster
asset. Keep it: it is doing real work on the large flat bands.

---

## 4. Page templates, named

These names did not exist in a file before this one. Use them as the shared
vocabulary; the routes are the second column.

| Template | Route | What it is |
|---|---|---|
| **Spread** | `/` | The portfolio homepage. Eight full-bleed client spreads, numbered I to VIII in Roman numerals, alternating bands. The most designed surface on the site |
| **Case** | `/work/<client>/` | One case study per spread. Links out to the client site and inward to its matching service page. This is the EEAT layer, so credibility furniture matters more than decoration |
| **Service** | `/services/<slug>/` | The commercial pages. 13 of them after consolidation. Highest conversion pressure |
| **Market** | `/services/<language>-seo/` | A Service variant for the six language markets. Shipped with French populated; German is next, then Spanish, Italian, Dutch, Portuguese last |
| **Ledger** | `/results/` | Numbers, charts and proof. Consumes `Counter`, `ImpressionsChart`, `LocaleTable` |
| **Journal** | `/blog/<slug>/` | Long-form article. Currently the least designed template and the one with most room |
| **Index** | `/blog/`, `/services/`, `/work/` | Listing pages. Three of them, and they should not each be a bespoke design |
| **Plain** | `/about/`, `/how-i-work/`, `/contact/` | Prose pages with a single job each |

Mirrored under `/fr/` and `/es/`, with route segments localised, not just leaf
slugs. A fourth locale (`/nl/`) is planned but should not be designed for yet;
the structure already scales to it.

---

## 5. Components that exist today

In `site/components/`. Eleven, and the split between "real component" and
"one-page thing that got extracted" is not yet drawn. Drawing it is part of
the job.

| Component | Notes for the system |
|---|---|
| `SiteNav`, `SiteFooter` | The only two on every page. Start here |
| `Spread` | The homepage unit. Carries the Roman numeral, the client image, the band |
| `Testimonials` | Reviewer names render through `displayName()`, which trims to first name plus last initial. **Never render `t.name` directly** — the full name is the record, the initial is the display |
| `Counter`, `ImpressionsChart`, `LocaleTable`, `ConsolidationDiagram` | The Ledger set. Four ways of showing a number, which is at least one too many |
| `Reveal`, `SmoothScroll` | Motion. Must respect `prefers-reduced-motion` |
| `ThemeToggle` | Flips the band mapping. See section 2 |

---

## 6. Things to design that do not exist

In rough priority:

1. **A form.** There is no styled input, textarea, select, checkbox or error
   state anywhere in the codebase, and `/contact/` needs all of them on both
   bands.
2. **Button and link variants.** Currently ad hoc per page. Needs primary,
   secondary, ghost, and a disabled state, each resolved on both bands.
3. **The Journal template.** Article typography, pull quotes, figures with
   captions, code, tables, related links.
4. **Index cards.** One card that works for a post, a service and a case
   study rather than three.
5. **A dashboard surface.** Task cards and quick actions were discussed for a
   later phase; worth designing the card once, here.

---

## 7. Copy rules that change design decisions

These bite more often than people expect, so read them before designing any
component that holds text:

- **No em dashes or en dashes anywhere.** Ranges use "to". A design that
  relies on an em dash as a visual device has to be rethought, not tweaked.
- **No ampersands** in copy. "Services and pricing", never "Services & Pricing".
  This matters for nav labels and any tight horizontal space.
- **No sentence starts with "This" or "That"**, and voice is "we", never "I".
- **No emojis in body content.** Social posts only, one per post.
- **UK English** throughout: optimise, localise, colour.
- **A rejected-word list** is enforced in CI. Notably `comprehensive`,
  `seamless`, `tailored`, `robust`, `innovative`, `dynamic`, `crafted` and
  `leverage` in every inflected form. Placeholder copy in a mockup will fail
  the lint if it reaches the repo.

Run `node site/scripts/copy-lint.mjs` on anything before it ships. All 141
English content files currently pass it.

---

## 8. Non-negotiables checklist

- [ ] Every colour is a `var(--token)`, no literal hex
- [ ] Component renders correctly on `.band-a` and `.band-b`
- [ ] Focus state visible on both grounds (`2px solid var(--berry)`, offset 3px)
- [ ] Contrast meets WCAG AA in both themes, not just the light one
- [ ] Motion respects `prefers-reduced-motion`
- [ ] No monospace UI font, no aubergine, no superhero imagery
- [ ] Wide content scrolls inside its own container; the page body never
      scrolls horizontally

---

## 9. Getting work back into the repo

Live `DesignSync` is unavailable from this remote session: it needs an
interactive `/design-login`, which a cloud session cannot run. Two routes that
do work:

1. **Claude Design's "Send to Claude Code Web"**, which seeds the project into
   the workspace directly. Preferred.
2. **Paste or attach the files**, and this session wires them into
   `site/components/` and `site/app/globals.css`.

Either way the token layer in `globals.css` is the integration point. A design
that arrives as its own stylesheet with its own colours will have to be
converted before it can ship, so it is worth building against the tokens from
the start.
