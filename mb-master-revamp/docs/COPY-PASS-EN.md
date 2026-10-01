# English copywriting pass

Owner request, 1 October 2026: run the `copywriting` skill (marketingskills
v2.0.2) over the whole English site. The house rules win wherever the two
disagree: `CLAUDE.md`, `docs/STYLE-GUIDE-UK-EU.md` and
`.claude/skills/mb-copy-voice/SKILL.md`. Nothing here invents a price,
guarantee, turnaround or client outcome; every claim is one the site
already makes or `CLAUDE.md` records as an owner fact.

Scope is the commercial and hand-built pages. Journal posts are editorial
and belong to the `copy-editing` skill, so they are out of this pass.

Each batch is checked (`lint:copy`, `lint:code`, build, then the built-output
lints) and pushed to `main` on its own commit, so any one can be reverted
alone.

## Batches

| # | Pages | Status |
|---|---|---|
| 1 | Homepage | done |
| 2 | Services index, lead generation hub, multilingual SEM, conversion tracking | next |
| 3 | Multilingual SEO, French SEO, German SEO, Spanish SEO | to do |
| 4 | Dutch SEO, Italian SEO, Portuguese SEO, local SEO | to do |
| 5 | Website localization, translation services, app and software localization, AI consulting | to do |
| 6 | AI translation and post-editing, generative engine optimization, technical SEO, content marketing, multilingual content | to do |
| 7 | Results, how we work, contact (and its two status pages), competitor analysis checklist, project template | to do |

## Changes

### Batch 1: homepage

- **Meta title** now carries the assigned primary term, "international SEO
  agency" (`lib/keywords.ts`), which the old title missed; the stale code
  comment claiming the head term belonged elsewhere is corrected.
- **Meta description** names the reader and closes on the free consultation
  (an owner-confirmed offer) instead of repeating the h2.
- **Lede** follows situation, path, proof of progress, replacing "usually a
  research and writing job", which made the work sound small.
- **Primary CTA** "Book a discovery call" becomes "Book a free
  consultation", which says what the visitor gets. The free 20-minute audit
  was the first choice, but the button lands on the contact form, which
  offers a first call and no audit, so the CTA names the offer the page
  delivers. Secondary link "See what the
  numbers did" becomes "See client results".
- **Hero strip** "Languages that add up" becomes "One strategy across every
  language".
- **What we do**: the lede said "enquiries are the product" twice; rewritten
  once. Each row now opens on what the reader gets.
- **Why it works** had one item that did not support its heading; now three,
  each built from facts already on the site.
- **Section order** puts proof straight after what we do (the order in
  `mb-copy-voice`): hero, what we do, pull quote, testimonials, why it works,
  work, BASTIN, figures. Band alternation kept.
- **BASTIN** intro and the B line read as the reader's gain.
- **Testimonials** heading says what the section shows.
