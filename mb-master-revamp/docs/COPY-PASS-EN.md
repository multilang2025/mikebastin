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
| 5 | Website localization, translation services, app and software localization, AI consulting | done |
| 6 | AI translation and post-editing, generative engine optimization, technical SEO, content marketing, multilingual content | done |
| 7 | Results, how we work, contact (and its two status pages), competitor analysis checklist, project template | done |

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

### Batch 5: website localization, translation, app localization, AI consulting

- **Translation services** led with how we file the work: the h1 was
  "Multilingual translation services sorted by document type". It now
  names the buyer's stake, "Translation services for documents a court or
  embassy must accept", and the h2 says who translates and how fast, using
  the owner's "one to seven days". The card title and the meta title
  ("Translation services, Mike Bastin") now say certified and sworn.
- **App and software localization**: the h2 explained when cost is
  decided; it now says what the buyer gets (each later market is a content
  job). "Encoding" leaves the meta description.
- **Website localization**: a claim that conversion rates "move
  measurably" with a familiar payment method (unsourced) now says what
  shoppers do; a paragraph opening "Run before launch, the pass" had no
  pass to refer to and now names it.
- **AI consulting**: the meta title carries the assigned primary, "AI
  consulting services"; "speeds up ... far faster" de-duplicated.
- Two headings lose a filler "actually".
- **Left alone, waiting on the owner**: "four languages, including
  Russian" for the law firm on the translation page (Q4).

### Batch 6: AI translation, GEO, technical SEO, content marketing, multilingual content

- **Technical SEO** opened its hero eyebrow on "Crawlability and hreflang",
  the exact mechanism-first opening `mb-copy-voice` uses as its worked
  example of what not to do. It now reads "The foundations every language
  ranks on"; the terms stay below the fold.
- **Technical SEO, positive framing**: the link-building answer sold by
  listing what we avoid ("private blog networks, link farms ... a liability
  with a delay on it"); it now says what the links we earn give you.
  "Analytics is the part that makes the rest arguable" meant the opposite of
  what it said and now reads "proves the rest". The thin "unglamorous work"
  section's link sentence talks about relevance rather than "domain rating".
- **GEO**: "answer engines cite the sources that agree with themselves" and
  "closing the specific gap that puts them there" were hard to parse; both
  rewritten. The "agency" meta title stays as it is pending Q8.
- **Content marketing**: "Run the same programme in three" was missing its
  noun ("languages").
- **Multilingual content**: the E-E-A-T list was punctuated as a run-on.
- Six headings and lines across the five pages lose a filler "actually".

### Batch 7: results, how we work, contact, checklist, project template

- **Contact contradicted the rest of the site** on languages: "We work in
  English, French and Spanish, and read Italian". Every language page says
  Dutch runs directly, and "read Italian" describes a level the owner rule
  keeps vague. It now matches the language pages: English, French, Spanish
  and Dutch directly, German, Italian, Portuguese and the rest to named
  native writers.
- **Contact**: the meta title ("Contact, Mike Bastin") carries the h1's
  term; the submit button "Send it" becomes "Send your brief"; the aside
  heading "Rather just email" becomes the question it is.
- **How we work**: the first stage is now "Free consultation", matching the
  CTA everywhere since batch 2; the six FAQ headings were questions without
  question marks; the h2 no longer says "passed through at cost", which no
  stage describes; the closing call to action was a text link and is now
  the consultation button. Five stray trailing spaces removed.
- **Results**: the meta description argued about case studies and now says
  what the page holds; the testimonials heading matches the homepage.
- **Project template**: the eyebrow "What actually happened" becomes "What
  we did". The footer already carries the CTA, so none was added.
- **Competitor analysis checklist**: an editorial pillar rather than a sales
  page, so left to the `copy-editing` pass with the journal.

## For the owner

The pass changed wording, never facts. Three things it found that only you
can settle:

1. **The results page shows our own site's rebuild as the result.** Its two
   main sections are this site's Search Console ("Forty thousand
   impressions produced six clicks") and this site's 43-to-19 service
   consolidation, under an h2 promising "what changed on real engagements".
   A buyer reads that as client work. The client case studies with real
   figures (Delaguía y Luzón, Century 21 Perdomo, Bemelman Spuiterij,
   ValenciaMove) would carry the page better. Your call, since it changes
   what the page is.
2. **Q2, Q4 and Q11 still block three lines**: the Houston doubling on SEM
   and multilingual SEO, the law firm's three or four languages on lead
   generation, multilingual SEO and translation, and the Portuguese
   "working level".
3. **Q8, "agency" on generative engine optimization**: the meta title says
   agency while the h1 says services; left as it is.
