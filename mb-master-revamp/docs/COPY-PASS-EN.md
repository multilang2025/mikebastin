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
| 2 | Services index, lead generation hub, multilingual SEM, conversion tracking | done |
| 3 | Multilingual SEO, French SEO, German SEO, Spanish SEO | done |
| 4 | Dutch SEO, Italian SEO, Portuguese SEO, local SEO | done |
| 5 | Website localization, translation services, app and software localization, AI consulting | next |
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

### Batch 2: services index, lead generation, SEM, conversion tracking

- **One CTA across the English site.** "Book a discovery call" and "Book
  the discovery call" become "Book a free consultation" (an owner-confirmed
  offer) in the nav, the footer, the service template, the post template
  and the lead generation page. The footer's "See what the numbers did"
  becomes "See client results", matching the homepage. The step on
  `/how-i-work/` keeps its name until batch 7.
- **Services index**: meta title now carries its assigned primary, "global
  SEO services" (it read "Multilingual SEO services"); the description
  dropped "nineteen services across five groups" (a count about our list,
  and wrong since the twentieth page); the h2 opens on the reader's gain;
  the lede, which repeated the eyebrow, now names the next step and the
  hero gains the consultation button.
- **Lead generation**: the first of the three parts printed a truncated
  sentence ("from what buyers there actually type, "), now complete; the
  per-market paragraph cut from five clauses to one sentence; "How a B2B
  lead generation agency should work" becomes "How our ... works"; the
  meta description no longer ends on ad billing, which belongs to SEM.
- **Multilingual SEM**: the lede was a verb-less fragment, now a sentence
  that opens on the reader; the meta description carries the billing
  decision, the one line a competitor cannot copy; the second body heading
  no longer repeats the first.
- **Conversion tracking**: the meta description loses its "not only the
  traffic" framing; the first body line reads as one sentence.
- **Left alone, waiting on the owner**: the Houston "quote pipeline doubled"
  line on SEM (Q2) and "a law firm working in four languages" on lead
  generation (Q4).

### Batch 3: multilingual, French, German and Spanish SEO

These four were already in good shape: heroes open on the reader, and
Spanish carries real Search Console figures as proof. The changes are
corrections more than rewrites.

- **Multilingual SEO meta title** read "International SEO agency and
  consulting", the homepage's assigned primary, so the two pages competed
  for one term. It now carries its own, "multilingual SEO agency"
  (`lib/keywords.ts`).
- **Multilingual SEO**: the meta description's "a number of its own" says
  what the number is; the first audit paragraph called a competitor's
  workflow "patched-up machine translation" and now says what native pages
  win; "What actually goes into" loses "actually".
- **French SEO**: the meta description reads as one clean claim.
- **German SEO**: a list that read as a run-on ("Legal questions, sensitive
  data, ... are") is a proper example list; one misindented block fixed.
- **Spanish SEO**: "each behave" corrected to "each behaves"; a claim that
  each market "reads a site more strictly than the last one" (unprovable)
  becomes "judges a site by its own rules"; the orphan press-mentions line
  says why it matters to the buyer.
- **Left alone, waiting on the owner**: the Houston doubling (Q2) and the
  law firm's language count (Q4), both on the multilingual SEO page.

### Batch 4: Dutch, Italian, Portuguese and local SEO

- **Italian SEO hero** spoke to an SEO rather than a buyer: the h1 ended
  "for an uncontested market" and the h2 was "terms sit at difficulty 0 to 1
  in Ahrefs, so entry costs little", mechanism in the hero. The h1 now names
  the buyer, as the French and German pages do ("for companies selling into
  Italy"), and the h2 says what low competition means to them. Meta title
  and description follow; the description loses "difficulty 0 to 1".
- **Italian level stays vague** (owner rule, 27 Sep 2026): the heading
  "Read fluently here" described a reading level and becomes "Managed here,
  written by native Italians". The objection "You do not speak Italian, so
  how is this Italian SEO" becomes the buyer's actual question, "How much
  Italian do you speak?", which the existing answer meets.
- **Portuguese SEO**: the h2 described the market and now says what the
  buyer gets; the meta description was 170 characters with `pt-PT` and
  `pt-BR` codes in it, now 151 in plain words.
- **Payment methods and ranking** (Dutch and Portuguese): both pages claimed
  iDEAL or PIX end up "a ranking factor by a longer route", which is not
  something we can show. Both now make the honest case: search traffic is
  worth what it converts, and the expected payment method converts more.
- **Local SEO**: "Treat the profile as a product surface" becomes "like a
  shopfront".
- **Left alone, waiting on the owner**: the Portuguese "working level"
  wording (Q11).
