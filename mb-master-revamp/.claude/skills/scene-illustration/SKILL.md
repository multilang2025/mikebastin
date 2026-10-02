---
name: scene-illustration
description: Build a static scene illustration for a mikebastin.com page, the kind that shows the work instead of describing it - browser and phone frames, search results in several languages, enquiry dashboards, AI answers citing a page, stamped translations, site structures - composed from cards in the site's own palette and type, rendered to a transparent WebP that sits on either band in either theme. Use whenever a page has too much text and not enough images, before adding any illustration that depicts a product, a result or a workflow. Also covers client portfolio images (design/work-shots), which use the client's branding instead of ours.
---

# Scene illustrations for mikebastin.com

Owner, 2 Oct 2026: "Create a reusable skill to generate similar illustrations
for the whole site, it has too much text and not enough images." The model is
the client portfolio images (`design/work-shots/gen.py`): HTML laid out like a
designer's mock-up, rendered by the local browser, saved as WebP. This skill
is the same technique turned on the site's own pages.

## Which illustration skill applies

| Need | Use |
|---|---|
| A picture of the work: a page, results, a dashboard, a workflow, a document | **This skill** |
| Ambient animated art beside a hero, never read directly | `svg-animation` |
| An inline figure inside a journal post that must follow the theme toggle | Inline SVG with `fg-*` classes (`docs/BLOG-STRUCTURE.md`) |
| A client's own site, in the client's branding | `design/work-shots/gen.py` (below) |

**Never in a hero.** Heroes carry animated SVG art (owner, 2 Oct 2026):
`svg-animation`, a recycled `DlArt` drawing (`lib/dl-art.ts`) or
`ServiceHeroArt`, in `HeroArtSlot`. Scenes go in the sections below the hero,
beside a heading and a sentence, which is where a reader looks at a picture
of the work. `scenes/services-hero.html` is kept as a below-the-fold scene
(one site found in several markets) for a page that wants it; it was tried
in the services hero and moved out on that rule.

## The files

```
design/scenes/
  kit.css        palette, fonts and every reusable piece (cards, frames, pills, results...)
  render.py      renders scenes/<name>.html to site/public/images/scenes/<name>.webp
  scenes/        one HTML file per illustration
```

Run `python design/scenes/render.py` for all scenes, or name some:
`python design/scenes/render.py svc-search services-hero`. It uses the local
Edge (or Chrome) headless, each run in a throwaway profile, and `sharp` from `site/node_modules`; nothing to
install. Output is 2x, with a 36px margin all round so shadows fade out
inside the image, and an alpha channel.

## How a scene is built

1. Copy the closest existing scene in `design/scenes/scenes/` and rename it
   for the page (`svc-` for the services index, `<slug>-` for a service or
   page, `post-<slug>` for the journal).
2. Set the canvas with `<meta name="size" content="800x600">` in CSS pixels,
   plus the same numbers in `:root{--w;--h}`. 800x600 for a section image
   shown up to about 560px wide; 700x700 for a square section image.
3. Lay out absolutely positioned cards from the kit. Keep cards inside the
   canvas: the margin is only for shadows.
4. Render, then look at it on both surfaces before wiring it in (the
   preview recipe below). Rework anything whose text would fall under about
   9px at the size the page shows it.

### The kit

| Class | What it draws |
|---|---|
| `.card` / `.card.deep` / `.card.navy` | Cream, teal or navy surface with border and shadow |
| `.browser` + `.bar` + `.url` | Browser frame with an address bar |
| `.phone` + `.screen` | Phone frame |
| `.serp` with `.u` `.t` `.s` | A search result: URL, title, snippet |
| `.rank` | Position badge |
| `.toast` with `b` and `small` | A notification, such as a new enquiry |
| `.bars` `.row` `.track` `.fill` | Horizontal bars per market |
| `.lang` | A language code chip (FR, DE...) |
| `.pill` / `.pill.berry` / `.pill.deep` | Label chips |
| `.line` / `.line.ink` / `.line.berry` | Text skeleton bars, for "a page" without words |
| `.doc` + `.stamp` | A paper document and a round stamp |
| `.strike` + `.fix` | Machine output struck out, the native correction highlighted |
| `svg .link` / `.link.deep` / `.solid` | Dashed and solid connectors |
| `.h` / `.h.serif` | Card headings |

Add to `kit.css` rather than styling inline when a piece will be used twice.

## Rules

- **Palette and type are the site's own.** Every colour in `kit.css` is a
  token value from `site/app/globals.css`; add none. Fraunces and Inter come
  from `site/app/fonts/`.
- **Transparent background, self-contained cards.** Bands alternate cream and
  navy and the theme toggle swaps them, so a scene never paints a background.
  One file serves every surface.
- **Illustrative, never a claim.** No figures that read as a client result:
  dashboards show bars without numbers, a rank badge shows a position, not a
  traffic gain. Page speed values are the good-threshold kind (1.9 s), not a
  measurement. Use `yoursite.com` for the example business. A real client
  appears only in its own portfolio image.
- **No brand marks of other companies.** Generic search results and a generic
  "AI answer" card, never a Google, ChatGPT or Perplexity logo or interface.
- **Copy rules still apply to every word in the image**: sentence case, no
  ampersands, no dashes, positive framing, "we". Foreign-language text in a
  scene must be correct in that language; keep it short and plain.
- **Alt text says what the scene shows**, in one sentence, because these
  images carry meaning (unlike `svg-animation` art, which is `aria-hidden`).
- **Size attributes** on the `<img>` are the rendered pixels divided by two
  (800x600 canvas plus the margin: `width={872} height={672}`), so the page
  reserves the right space.

## Wiring it into a page

A plain `<img>`: the build is a static export with unoptimized images, so
`next/image` gains nothing. `loading="lazy"` below the fold, `decoding="async"`
always. The services index (`site/app/services/page.tsx`, `CLUSTER_SCENE`)
is the worked example: animated `DlArt` in the hero, then one scene per
cluster beside its heading and a one-sentence intro, sides alternating.

## Preview before wiring

```bash
python design/scenes/render.py --sheet svc-search svc-ai
```

writes `design/scenes/png/sheet.jpg`: every named scene (or all of them) on
the cream band and on the navy band, side by side. Look at both before a
scene ships; the earlier draft of the services scenes only showed its
clipped shadows that way.

## Client portfolio images

`design/work-shots/gen.py` builds the eight portfolio images from each
client's own logo, colours, typefaces, hero photo, headline and languages
(read from the live site; assets in `design/work-shots/assets/`). There the
client's branding is the point, so the site palette rule does not apply. To
add a client: add an entry to `BRANDS`, put its logo and hero image in
`assets/`, run `python gen.py <slug>`.
