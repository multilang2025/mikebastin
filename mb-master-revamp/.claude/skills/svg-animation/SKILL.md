---
name: svg-animation
description: Build a custom animated SVG illustration for a mikebastin.com page — decorative hero or section art in the site's own brand tokens, self-drawing lines, travelling highlights, slow rotation, breathing pulses. Use before adding any animated (not static) SVG graphic to a page. Covers the project's established technique vocabulary (components/MarketReach.tsx is the working example), the IP boundary (original motifs only, borrow technique never content), accessibility, and the OpenRouter concept-ideation step that runs before anything gets built.
---

# Animated SVG art for mikebastin.com

## When this applies

A page needs a decorative animated SVG: a hero graphic, a section illustration that should move rather than sit static, the kind of ambient motion a reader notices peripherally while reading the copy next to it. Not for static flat illustrations with a subject a reader looks at directly — those go through the branded-illustration workflow instead (Higgsfield/Recraft, saved to `site/public/images/sections/`, wired via a service's `body[].art` field). This skill is for the other kind: abstract, ambient, always `aria-hidden`, never the thing the reader is meant to read.

## The rule this site holds hard: technique, never content

HANDOFF.md's IP boundary (design-guardian enforces it): no borrowed iconography anywhere on the site, no imagery copied from a reference. `components/MarketReach.tsx` is the precedent and the one to follow. Its animation technique — a dotted plate, slow-rotating rings, arcs carrying a travelling spark, converging on a pulsing hub — was seen on a client's own site, delaguialuzon.com. That page traces Spain's real coastline, because the firm is Spanish and its clients are diaspora reaching back into Spain. Mike Bastin has no single country to trace, so the built version replaces the coastline with an abstract dotted disc and points standing in for markets, never labelled, never a real flag or landmark. A reference site, an icon library, or a tutorial may teach how something moves. It never supplies what gets drawn.

## Where the code lives

- One component per piece, `site/components/<Name>.tsx`, plain inline SVG. No animation library is installed and none should be added for this — the whole vocabulary below is CSS keyframes and SMIL-free.
- Keyframes and classes go into `site/app/globals.css`, appended near the existing `shimmer` / `breathe` / `hero-glow` rules. Give every class a short unique prefix (`mr-` for MarketReach) so nothing collides with the next component.
- Every animated SVG is `aria-hidden="true"` and carries no text, matching `PostArt.tsx`'s existing convention for decorative art elsewhere on the site.
- Reduced motion needs no extra work. `site/app/globals.css` already forces `animation-duration: .01ms !important` on `*, *::before, *::after` under `prefers-reduced-motion: reduce`. Don't add a second mechanism; it would only ever be redundant with that one.

## The technique vocabulary

Grounded in building `MarketReach.tsx`, in [How SVG Line Animation Works](https://css-tricks.com/svg-line-animation-works/), and in the published [svg-animations skill](https://github.com/supermemoryai/skills/blob/main/svg-animations/SKILL.md) (a broader general-purpose reference; this file only covers the subset that fits this site's restrained, ambient style).

1. **Line draw-in, once, on load.** Give the path `pathLength="1"` — this sidesteps the real cross-browser gotcha where `getTotalLength()` returns slightly different values per engine, so a hand-picked dasharray never lines up exactly the same way twice. With `pathLength="1"` the numbers are always 0 to 1, no measuring required.
   ```css
   .x-draw { stroke-dasharray: 1; animation: x-draw 1.7s cubic-bezier(.45,0,.2,1) .9s both; }
   @keyframes x-draw { 0% { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
   ```
2. **Travelling spark, looping forever.** A short dash (`stroke-dasharray: .001 4`) whose `stroke-dashoffset` sweeps past the path's end into negative numbers, so it appears to run along the line and restart. Layer two or three on the same path — a bright short head plus one or two longer, fainter tails — for a comet effect rather than a blinking dot.
3. **Slow rotation.** `transform-box: fill-box; transform-origin: center;` on a `<g>` or `<circle>`, `animation: spin 70–160s linear infinite`, alternating `reverse` on concentric rings so they don't all turn the same way. Slow enough to read as alive, not as a loading spinner — anything under about a minute per turn starts to look like the latter.
4. **Breathing pulse.** A ring scaling from 1 to roughly 2–2.5 while fading to 0 opacity, `4s ease-out infinite`, staggered per instance.
5. **Stagger via a `--i` custom property**, set from a `.map()` index and referenced inside `calc()` in the animation-delay or duration. The same pattern `Reveal.tsx` already uses for its `--rd` scroll-reveal stagger, generalised to SVG timing.
6. **Entrance.** The whole piece fades and scales in once on mount (`opacity 0→1`, `scale .94→1`, roughly 1.2s), so it doesn't pop in abruptly when the section scrolls into view.

## Colours

Only the site's own tokens, never a literal hex: `var(--berry)` for the accent or signal colour, `var(--dim)` for structural lines and texture dots, `var(--chip)` for a very-low-opacity fill plate, `var(--rule)` for hairlines. These already swap correctly between light and dark in `app/globals.css`'s `:root` / `[data-theme=dark]` blocks, so a component built against them needs no separate dark-mode branch at all.

## Workflow for a new page

1. **Find the slot.** Most service and homepage sections are single-column text with real empty space beside them at desktop width — screenshot the built page first (`npm run build && npx serve out`, or the live preview) rather than assuming. A section with no natural empty space usually means no art belongs there; don't restructure a layout just to make room.
2. **Ideate before building.** Don't invent the concept alone at the keyboard. Add the page to `site/scripts/svg-animation-prompts.json` (slug, page path, angle, and the one or two sentences the page actually argues) and run:
   ```
   node scripts/svg-animation-ideas.mjs --slug <the-new-slug>
   ```
   This calls a cheap OpenRouter model (see the script's header comment for which one and why) with a system prompt carrying the IP boundary, the palette limit, and the no-text rule, and writes three genuinely different concepts to `docs/svg-animation-ideas.json`. Read them, pick one or adapt one. The model's job is breadth of concept, never the final call, never code, never copy — treat its output the way a design mood board gets treated, not the way a brief gets treated.
3. **Build it** using the technique vocabulary above. `MarketReach.tsx` is the template for file shape and for how a `MARKETS`-style data array keeps coordinates out of the JSX.
4. **Verify.** `npm run verify`, then screenshot the real built page — light and dark, desktop and the sub-1024px breakpoint. A static screenshot can't show the motion, but it shows composition, contrast, and whether anything clips or collides with the text.
5. **Commit and open a PR**, same as any other change to this repo.

## Ideating with OpenRouter — what the script actually does

`site/scripts/svg-animation-ideas.mjs` reads `svg-animation-prompts.json` (one entry per page) and, for each one, calls `openai/gpt-oss-20b` on OpenRouter — chosen 24 September 2026 by querying OpenRouter's own `/api/v1/models` pricing endpoint directly ($0.018 / $0.09 per million input/output tokens: a real model from a known family, not the single cheapest line-item that day, which tends to be too weak for coherent creative brainstorming). Re-check pricing before assuming this is still the right fit; model pricing on OpenRouter moves often enough that hardcoding a model without checking is how this file rots.

Requires `OPENROUTER_API_KEY` in the environment. The script fails loudly and exits non-zero if it's missing, rather than silently producing nothing — per this project's secrets rule (CLAUDE.md): the key is read from the environment only, never printed, never committed, never pasted into a prompt or a commit message.

```
node scripts/svg-animation-ideas.mjs              # every page in the prompts file
node scripts/svg-animation-ideas.mjs --slug local-seo   # one page only
```

Output lands in `docs/svg-animation-ideas.json`, overwritten on every run. Commit a batch you've actually read and want kept as a reference point; don't let a stale run sit uncommitted as if it were current.

The first batch this skill produced, for the local, French, German, Spanish and Dutch SEO pages plus lead-generation, is in `docs/svg-animation-ideas.json` as it shipped 24 September 2026 — worth reading before generating a fresh one for the same pages, since re-running costs real (if small) money for output you may already have.
