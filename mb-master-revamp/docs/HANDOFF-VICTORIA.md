# Handoff for Víctoria: rewriting the service pages

Welcome. This is everything you need to carry on the service page rewrite
from where it stopped on 6 October 2026. Read it once top to bottom, then keep
[`VICTORIA-LOG.md`](VICTORIA-LOG.md) open while you work: that is where your
questions for Mike go, and where the page tracker lives.

## 1. The job in one sentence

Every service page on preview.mikebastin.com has to **sell what the client
gets from Mike Bastin and his team**, and several still **teach the reader how
the discipline works**. Mike's words: "reads like a how to, and not services we
provide" (4 Oct) and "reads like a boring tutorial" (6 Oct). You rewrite them
until Mike is satisfied.

## 2. What to read first (about an hour)

1. `docs/STYLE-GUIDE-UK-EU.md`, sections 9 (positive framing) and 10 (service
   pages describe the service). Section 10 is the rule you apply on every page.
2. `.claude/skills/mb-copy-voice/SKILL.md`: who the buyer is and the order a
   page makes its case in.
3. The "Non-negotiable rules" and "UK and International Europe style guide"
   sections of `mb-master-revamp/CLAUDE.md`. They hold the facts about Mike
   you may use, and the ones you may not (see section 6 below).
4. The four worked examples (section 4 below), on the preview site and in the
   code, side by side.

## 3. Where the words live

- **19 of the 20 service pages** are built from one template
  (`site/app/services/[slug]/page.tsx`). Their words all sit in one file:
  `site/lib/services.ts`, one entry per page. You edit text in that file only.
  Per entry:
  - `h1`, `subhead`, `lede`: the hero. Leave `h1` alone unless Mike asks (it
    carries the page's keyword and a lint checks it).
  - `body`: the prose sections, each a `heading` and `paragraphs`.
  - `expandablesHeading`, `expandablesLede`, `expandables`: the
    click-to-open questions, each a `q` and its answer `a`.
  - `process`: the steps of an engagement.
- **The lead generation page** is hand-built:
  `site/app/services/lead-generation/page.tsx`.
- **French and Spanish pages** are markdown files in `site/content/fr/services/`
  and `site/content/es/services/`. Leave them for now: they follow once Mike
  approves and locks the English.

## 4. The worked examples (copy these)

| Page | What changed | Look at |
|---|---|---|
| Lead generation | Full rebuild: Mike and the team up front, enquiry totals with a source line, six deliverables, a "who does the work" band, real steps, the mechanism moved into the questions | `app/services/lead-generation/page.tsx` |
| International SEO (`multilingual-seo`) | First section now "What you get from…"; six expandables turned from lessons into work | `lib/services.ts`, entry `multilingual-seo` |
| French SEO | First section now "What you get from our French SEO"; Mike's native French named; seven expandables turned into work | entry `french-seo` |
| Translation services | First section turned into deliverables; BeTranslated named as Mike's agency; six expandables turned into work | entry `translation-services` |

Before and after, so you can see the pattern at a glance:

| Before (a lesson) | After (work we do) |
|---|---|
| Four markets done properly outrank nine launched at once | Market launches in waves |
| ccTLD, subdomain or subdirectory, at portfolio scale | A domain structure recommendation |
| Accents, and the queries that drop them | Research on accented and unaccented queries |
| French runs longer than English | Titles and descriptions written to French length |
| Certified, sworn, notarised and apostilled are four different things | The right certification for the body receiving your document |
| "Decide it once, early" | "We settle it once, early, because…" |
| "Use geo-IP for soft suggestions only" | "We set geo-IP to suggest a version and let visitors choose theirs" |

## 5. The recipe, page by page

1. **Read the page's headings only.** List every `heading` and every `q` in
   the entry. Mark each one: does it name something the client gets or
   something we do? Or is it a lesson, a market fact, or advice?
2. **Rewrite the first body section as "What you get from…".** Three or four
   short paragraphs, each naming one thing the client ends up with, in the
   active voice with "we".
3. **Turn each lesson heading into a noun phrase for a job.** "Why X matters"
   becomes "X set up for your market". Questions that start with "Which",
   "Whether" or "Why" are usually lessons.
4. **Turn each answer to "we do X, so you get Y".** Keep the facts and
   examples; change who is acting. Delete every instruction addressed to the
   reader ("Write them…", "Offer visitors…", "Quote the one…").
5. **Add a human fact where one is true.** Mike's native French on French
   pages, his own Spanish on Spanish pages, BeTranslated's writers on the
   German, Italian and Portuguese pages, our own sites as proof. Only facts
   from section 6.
6. **Leave proof word for word.** Client names, cited figures and their
   sources stay exactly as they are.
7. **Check `process`.** Four to six steps, first one the free offer that fits,
   last one "Month to month" for ongoing work.
8. **Run the checks** (section 7) and fix whatever they flag.
9. **Ask Mike** anything you are unsure about by adding it to the log, rather
   than guessing.

## 6. Facts you may use, and what you may not invent

**Usable** (all confirmed by Mike, details in `mb-master-revamp/CLAUDE.md`):
- Over two decades in multilingual search (never a year count or a start year).
- BeTranslated: the translation agency Mike founded and has run for twenty years.
- Languages: French native; English, Spanish and Dutch fluent; German,
  Italian and Portuguese "enough to manage SEO projects" (never a level).
  Native writers from the BeTranslated network write German, Italian and
  Portuguese commercial copy.
- Based in Valencia. Key markets: Benelux, France and Spain, then Germany.
- Own sites: ValenciaMove (1,132 URLs, five languages), BeTranslated, Matosurf.
- Clients: Delaguía y Luzón (Valencia law firm, four languages), TX
  International Freight (Houston, English only), Century 21 Perdomo
  (Dominican real estate, four languages), Bemelman Spuiterij
  (Noordwijkerhout, Dutch), Globaprom (custom software, our own brand).
- The free offers: 20-minute audit, 20-minute stack walkthrough, localization
  assessment, free consultation, GEO audit.
- Sworn translation: one to seven days. Apostilles for US and Canadian
  citizens. Engagements run month to month.

**Never invent:** a price, a turnaround, a guarantee, a certification, a
result, or a quote from a client. **No per-client figures** (one client's
clicks, enquiries, positions): only the totals in `lib/results-totals.ts`.

## 7. Checks before you push

From `mb-master-revamp/site`:

```
npm run verify
```

It runs every lint (forbidden words, dashes, "This/That" openers, negative
framing, headings, keywords, per-client figures) and the build. It must end
with no error. The ones you will meet most:
- **Forbidden words**: comprehensive, tailored, seamless, leverage, robust,
  however, additionally and the rest of the list in CLAUDE.md.
- **No em or en dashes**, no ampersands, no sentence starting "This" or "That".
- **Positive framing**: no "not X but Y", "rather than", "never", "without"
  as the selling point, no digs at other agencies.
- **Sentence case** in every heading. UK spelling, except `optimiz*` and
  `localiz*`, which take the US form.

Then open the page locally or on the preview after merge, and read only the h2
and h3 list aloud. Every line should name something the client gets or
something we do.

## 8. Workflow

- Work on a branch, open a pull request, and let CI run. CI runs the same
  `npm run verify`.
- Mike reviews on preview.mikebastin.com once a PR is merged into `main`
  (the "Deploy preview" workflow publishes it in about 18 minutes).
- Update the page tracker in [`VICTORIA-LOG.md`](VICTORIA-LOG.md) when you
  finish a page, and again when Mike signs it off.

## 9. Your queue, in order

**Priority 1, key markets (do these first):**
1. `dutch-seo`: Benelux is Mike's natural market. Lessons to turn: "What the
   footer has to carry", "Why iDEAL and Bancontact belong in an SEO
   conversation", "Netherlands, Flanders, or both", "Same language, different
   commercial vocabulary". Body heading "Dutch buyers search by country…" is
   a market fact: turn it into what we build for each country.
2. `spanish-seo`: "Why Castilian and Latin American Spanish stay separate",
   "Which Latin American market to open first", and the body heading "Spanish
   SEO is searched for from two directions".
3. `german-seo`: "Whether to split Germany, Austria and Switzerland", "Swiss
   German is written as standard German…", and the body heading "Companies all
   over Europe are looking for German SEO".

**Priority 2:**
4. `multilingual-sem`: "Paid first, organic first, or both".
5. `italian-seo` and `portuguese-seo`: low priority markets (Mike, 23 Sep).
   Lessons: "How far to take the regional split", "Where the Garante goes
   beyond the GDPR baseline", "European and Brazilian Portuguese are two
   markets…", "LGPD is Brazil's own law…", "Which one to open first".

**Check only** (already mostly written as services; read the headings, fix
any stray lesson): GEO, conversion tracking, technical SEO, local SEO, website
localization, app localization, AI consulting, AI post-editing, content
marketing, multilingual content.

## 10. Doubts (open, for Mike)

Also in the log, numbered, so you can tick them off together.
- **BeTranslated: six or twelve domains?** Pages disagree. Do not touch either
  number until Mike answers.
- **"ValenciaMove sends us enquiries every month"** and **"what we recommend
  is what already works with our own budget"** on the lead generation page:
  need Mike's yes.
- **Whether to promise "you deal with Mike directly"** on service pages.
- **When the FR and ES service pages follow** the English rewrite.

## 11. Ideas

- **A "who does the work" band on every template page.** One change to
  `app/services/[slug]/page.tsx` would give all 19 pages Mike's portrait and
  two lines on who runs the work, the way the lead generation page now does.
  It needs Mike's yes and a developer (Claude can do it).
- **Testimonials on the template pages.** Only lead generation shows the
  Google reviews. Matching one review to each service would add proof where
  18 of 19 pages have none.
- **One proof line per page from `lib/results-totals.ts`** (the monthly
  enquiry total), where it fits the service.
- **A "positioning claim" per page.** CLAUDE.md lists this as open: one thing
  per service that a competitor could not also say (like the media-budget line
  on paid search). Only Mike can supply these; collect candidates in the log.

## 12. Suggestions for working with Mike

- Show Mike two pages at a time on the preview, not ten; his feedback on the
  first pair sets the bar for the rest.
- When he says something reads wrong, write his exact words into the log with
  the date. Those quotes became the rules in this handoff.
- If a fact is not in CLAUDE.md or the style guide, ask before using it.
  Getting it right once is cheaper than correcting it in three languages.
