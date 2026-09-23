# MB Master Revamp — Project Memory

## What this is

Full rebuild of mikebastin.com's public front end: from a two-year-old,
near-zero-traffic Divi consultancy site into a graphic, high-personality
portfolio ("vibe-coded") showcasing Michael's real client projects. Brand on
the public site is **"Mike Bastin"** — never "Michael" in site-facing copy.

Single source of truth for scope, design tokens, copy rules, SEO invariants,
and phase plan: [`docs/HANDOFF.md`](docs/HANDOFF.md). Read it before touching
anything in this project. This file only holds the parts an agent needs on
every turn without re-reading the whole handoff.

Design reference (do not treat as production code): [`design/concept-v3.html`](design/concept-v3.html).

URL inventory of record (redirect coverage baseline): [`docs/sitemap-MB-EN.txt`](docs/sitemap-MB-EN.txt).

## Stack (CLOSED, per HANDOFF.md §25 — supersedes §14/§17)

Next.js 16 (App Router; 16.3.0 as installed), content as MDX files in the repo. **No database and
no CMS.** Payload was removed: it proved too complicated for an owner who
edits the site himself, and it brought a database, an admin UI, a schema to
maintain, and a migration into it. Removing it removes all four.

Same model as valenciamove.com, which the owner already runs at larger scale
(1,132 URLs across five locales, no CMS, content in-repo).

- **Editing:** primarily through Claude committing to the repo. Keystatic
  mounts at `/keystatic` as a git-backed browser editor for quick text
  fixes. Keystatic commits files like any other change; it adds no database.
- **Localisation:** one content directory per locale (`content/en`,
  `content/fr`, `content/es`). Localised slugs preserved exactly. Translation
  siblings bound by a `group` field in frontmatter matching
  `redirects/content-map.json`. **A locale version is an adaptation, not a
  rendering** (owner decision, 21 Aug): localise the examples, anecdotes and
  comparisons to the audience reading them, and replace an anecdote that only
  lands for the source audience rather than translating it. **Full parity is
  not the target** - ship a locale version when it has something to say to
  that audience. A missing sibling is not automatically a gap, so `group`
  records a real absence with an explicit null rather than a to-do. A fourth locale, `content/nl` (Belgium and
  the Netherlands), is planned once these three ship — see
  CONTENT-ARCHITECTURE.md §2. Don't build for it early; the directory
  structure already scales to it without rework.
- **Media:** `/public/images/`, no media library and no object storage.
  **The one exception the owner has left open is heavy video** (21 Sep
  2026): if the site ever carries video too large to sit in the repo and
  ship through a static export, object storage is on the table for that
  and for nothing else. It would be storage for media files, not a
  content store, and it does not reopen the database decision.
  The build is `output: "export"` with `images: { unoptimized: true }`, so
  nothing gains from `next/image`; sizes are baked at build time instead.
  Each of the 56 migrated posts shows **the featured image it already had
  on WordPress** (owner, 20 Sep), as does the hand-built
  `competitor-analysis-traffic-checklist` page, which is a cluster pillar
  and so appears on the journal index beside them.
  `lib/blog-images.ts` maps slug to file,
  alt text and the legacy upload path it came from;
  `scripts/fetch-legacy-images.mjs` rebuilds `public/images/blog/` from
  that map, writing `<slug>.webp` at 1200px and `<slug>-thumb.webp` at
  160x84 for the footer. The derivatives are committed, so a build never
  depends on the legacy site being up. `components/PostImage.tsx` picks
  the photograph, and falls back to `components/PostArt.tsx`, which draws
  a wave composition from a hash of the slug, for a post with no picture
  of its own, which today is every newly written one. The earlier 59
  cover PNGs and `scripts/gen-blog-covers.mjs` were deleted on 20 Sep,
  because each was only the post's own title on a rectangle, so the index
  printed every title twice and a post repeated its `h1`. Social images
  are separate and unaffected: they come from each route's
  `opengraph-image.tsx`.
- **Redirects:** `site/public/.htaccess`, generated from `content-map.json`
  by the `scripts/gen-*-redirects.mjs` family. Never hand-maintained. Not
  `next.config` `redirects()`, which never runs under `output: "export"`;
  the config carries no `redirects()` block at all.
- **Hosting:** the preview pipeline is GitHub Actions to
  **preview.mikebastin.com over FTPS**, built as a static export by
  `.github/workflows/deploy-preview.yml`. No Vercel: there is no
  `vercel.json` and no Vercel reference anywhere in the repo, so none of
  its defaults apply, including per-branch preview URLs, middleware, ISR
  and edge functions. The line here previously read "Hosting: Vercel",
  corrected 21 Sep 2026 against the workflow. **Vercel is now ruled out by
  the owner** (21 Sep 2026), so the question is closed rather than open:
  production goes the way the pipeline already goes, as valenciamove.com
  does. Do not propose Vercel again, and do not reach for a feature that
  assumes it.

Nothing in this directory contains real credentials. Secrets go in `.env`
(gitignored, see below), never in a committed file, never in an agent's
output, never in chat or email in plaintext. With no database the secret
surface is small: a Keystatic GitHub App credential and whatever the host
needs.

## Non-negotiable rules (apply to every piece of copy and every diff)

- Brand name is **Mike Bastin** everywhere on-site. Flag any "Michael" in
  site-facing strings.
- No ampersands (`&` or `&amp;`) in site copy — write "and"/"et"/"y". HTML
  attribute/query-string ampersands are exempt.
- No em dashes or en dashes anywhere. Commas/full stops; ranges use "to".
- **Voice is "we", not "I"** (owner decision, 21 Aug). Matches the four
  Google reviews that say "Mike and his team". Use our/us/ours, never
  my/me/mine. Exception: a reviewer's own quote is verbatim and never
  converted, and Roman numeral "I" in the portfolio numbering is not a
  pronoun.
- UK English, **with one measured exception**: the `optimiz*` and
  `localiz*` families take the US spelling (owner, 21 Sep 2026, "it's
  international and volume based SEO"). Both are this practice's own
  product vocabulary and the demand sits on the US form: `seo
  optimization` 29,000 a month against `optimisation` 5,500, `generative
  engine optimization` 26,000 against 3,800, `localization services` 2,800
  against 600. Everything else stays British, because "colour" and
  "centre" are not products and carry no such argument. Both lints
  (`copy-lint.mjs`, `copy-lint-code.mjs`) encode the exception.
  **Slugs keep their UK spelling regardless.** Eighteen legacy URLs in
  `docs/sitemap-MB-EN.txt` contain one, `/services/app-localisation/`
  among them, and the never-404 rule outranks a spelling preference. So
  `/services/website-localisation/` serves a page headed "Website
  localization services", which is deliberate rather than an oversight.
- No sentences starting with "This" or "That". No emojis in
  body content (emojis allowed on social posts only, max 1 per post).
- Forbidden vocabulary (non-exhaustive, whole-word match): comprehensive,
  tailored, seamless, leverage, elevate, crafted, maximise, facilitate,
  landscape, utilise, innovative, robust, delve, transformative,
  vital, dynamic, ever-evolving, "In conclusion", "It's important to
  note", moreover, however, thus, hence, additionally.
- "implementation" and "integration" are **allowed but not to be overused**
  (owner decision, 21 Aug). They are real technical terms here ("Trusted
  Shops integration") and one is inside a service name, so they are not a
  hard fail. The lint warns above a density threshold instead.
- No bolded links.
- **Motto** (owner, 20 Sep): "Automating business. Translating ideas.
  Connecting people." Use it where a motto belongs, under the wordmark or
  as `slogan` in schema, not in titles or meta descriptions, which are
  keyword real estate. FR and ES renderings live in `SiteFooter`'s string
  table and are a first pass awaiting the owner's eye.
- **Sentence case everywhere**, headings, titles and blog post titles
  alike (owner decision, 19 Sep). Capitalise the first word, proper nouns
  and acronyms only: SEO, AI, GEO, AEO, PPC, LLMs, Google Analytics,
  ChatGPT, WordPress, French, Valencia. Lowercase after a colon;
  capitalise after a full stop or question mark. Title Case is not used
  anywhere on the site, so a migration that brings it in from WordPress
  converts rather than keeps it, protecting acronyms as it goes.
- **Headings and titles must be grammatical; eyebrows need not be**
  (HANDOFF.md §4, owner decision 19 Sep). Every `h1` to `h6`, `<title>`,
  meta title and link label reads as correct English: subject and verb
  agreeing, acronyms cased (SEO, AI, GEO, never seo/ai/geo), proper
  adjectives capitalised (French, Dutch), nothing capitalised
  mid-sentence that should not be. An eyebrow is exempt and may carry
  the keyword-shaped form, so "SEO Italy" is right in an eyebrow and
  wrong in an `h2`. An eyebrow still may not repeat the heading below
  it; it inflects it. Never build a heading by case-shifting a label:
  store the mid-sentence form (`Service.inline`, `CLUSTER_INLINE`).
  `copy-lint-code.mjs` fails the build on a case-shifted heading.
- **The heading shape is a hard rule** (owner, 21 Sep 2026, revised the
  same day): the `h1` **contains the page's primary keyword without being
  it**, runs as **one line with no `<br>` and no `<span>` inside it**, and
  sits above a **longer `h2`, set smaller**, that echoes it. The first
  version capped the h1 at five words and that produced bare keywords
  ("International SEO agency", "Global SEO services"), which is a search
  term with a font size rather than a heading. The ceiling is now twelve
  words; the current set runs 4 to 9. Enforced by
  `site/scripts/heading-shape-lint.mjs` (length, h2 present) and
  `scripts/keyword-coverage-lint.mjs` (keyword present, and not the whole
  heading), English commercial routes only.
  `lib/services.ts` carries `h1` and `subhead` per service, both separate
  from `name`, which stays the label the nav, footer and cards use. FR and
  ES are reported and never failed: a word count does not survive
  translation and those locales are deferred.
- **The words in the h1 and h2 come from search data, not instinct.** The
  owner is an **agency** as well as a consultancy (owner, 21 Sep 2026,
  correcting an earlier assumption here), so *agency* is accurate and
  available: "generative engine optimisation agency" draws 1,300 globally
  at difficulty 1, and seven service titles now use the word.
- **The focus keyword is always in the h1** (owner, 21 Sep 2026). Every
  page has one term it is trying to win, and the h1 carries it, whatever
  else the headline is doing. A hero rewritten for punch that drops the
  term is a regression, not a trade: the homepage h1 was rewritten to
  "Your English pages sell. The others only look busy." and had to be
  corrected the same day. Service h1s already satisfy this by being the
  term ("Technical SEO", "Website localisation"); the risk is on the
  hand-written pages. `/results/` and `/contact/` are the two h1s that do
  not carry their title term, and both target navigational words rather
  than commercial ones, so they are flagged rather than forced.
- Design tokens (colour, type) come only from HANDOFF.md §2/§22/§23 (Night
  Swell / Morning Glass palette — aubergine is retired, do not reintroduce
  it). No hex outside that set. No monospace UI fonts.
- Every legacy URL in `docs/sitemap-MB-EN.txt` resolves 200-same or 301s,
  and never through a chain. `npm run lint:redirects` enforces it, and
  fails on a URL that 404s, a redirect whose target is redirected again,
  and a rule pointing at a page that is not built.
  Never 404 on launch.
- IP boundary: no Marvel/superhero imagery tied to "Silver Surfer" — it is a
  prose-only nickname, visual language is original surf/wave motifs.

## Keywords are assigned, researched and enforced

`site/lib/keywords.ts` holds one **primary** and several **secondary**
keywords per commercial page, every figure from Ahrefs Keywords Explorer
(GB) on 21 Sep 2026. `scripts/keyword-coverage-lint.mjs` fails the build
when a page's h1 does not carry its primary term, so the map cannot rot
into decoration. One page owns each primary term; two pages chasing one
term is the cannibalisation the file exists to prevent.

The method behind the map, written so the next page can be done without
re-deriving it: [`docs/KEYWORD-RESEARCH-METHOD.md`](docs/KEYWORD-RESEARCH-METHOD.md).
It carries the exact Ahrefs calls, the rule about putting controls in
every batch, how to judge a term, unassigned research for four more
pages, and the three keyword questions only the owner can answer.

The starting position, worth remembering when reading any of it: Ahrefs
Site Explorer showed mikebastin.com ranking for **exactly one keyword
worldwide**, "michael bastin", position 11, volume 10. There is no
ranking equity to protect, so the assignment is a first one rather than a
compromise. Search Console's tens of thousands of impressions are not a
contradiction: impressions at low positions on long-tail queries are
largely invisible to Ahrefs.

The three findings that changed what the pages say:

- **`local seo services` is 47,000 a month at difficulty 5**, the largest
  winnable term on the site by a wide margin.
- **`international` beats `multilingual` roughly three to one** for the
  same phrase shape (7,500 against 2,500). "Multilingual" is the brand's
  own framing; "international" is what buyers type. The homepage took the
  bigger term and `/services/multilingual-seo/` took the one it vacated.
- **`multilingual lead generation` returns zero searches**, while
  `lead generation services` draws 11,000. Putting "multilingual" in front
  of a service name generally kills its volume, which is also why
  multilingual-sem and multilingual-content have no researched primary.

**Two spelling conflicts are open for the owner**, recorded in that file's
`note` fields rather than decided: `website localization` draws 2,800
against 350 for the UK spelling, and every `generative engine
optimization` variant is US-spelled while the house rule is UK English.
Eight times the demand sits on a spelling the rules forbid. The route slug
is already US-spelled, which makes it a live inconsistency rather than a
hypothetical one.

A `term:` value in that file is exempt from the US-spelling lint. A
keyword is research data quoted verbatim, and correcting it would not fix
a spelling, it would falsify a figure.

## Copy has to sell, not only pass the protocol

The Master Content Protocol and the `copy-editor` agent are all
prohibitions. Copy can pass every one of them and still be unsellable,
and in September 2026 most of it was: 19 service pages measured 12.1
jargon terms per thousand words against 7.3 benefit terms, four of the
five biggest pages opened their hero on mechanism ("Crawlability,
indexation and the hreflang plumbing"), and 18 of 19 carried no proof
element at all while four Google reviews sat unused.

`.claude/skills/mb-copy-voice/SKILL.md` is the positive half: who the
buyer is, the order a page makes its case in, where jargon is allowed,
what counts as proof. Read it before writing any customer-facing string.

`site/scripts/copy-jargon-lint.mjs` enforces the part that can be
mechanised, and it is zoned rather than absolute. Mechanism vocabulary
is banned in the hero and the meta description of a **commercial** page
and welcome below the first section, where a reader who is still going
wants the precise term and the page needs it to rank. Editorial routes
are reported and never failed, because a reader who searched for
hreflang tags arrived wanting that word in the headline. It runs on the
built output inside `npm run verify`.

## The UK and International Europe style guide

`docs/STYLE-GUIDE-UK-EU.md` (owner, 21 Sep 2026). Its language and
heading sections restate rules this project already enforces. The value
is in the rest, which the Master Content Protocol never covered:

- A statistic carries its source in a blockquote directly beneath the
  figure, and the period and the cohort get checked, not only the number.
  49 English posts carry a percentage and 14 carry a `Source:` line.
- **An external link is never removed during a rewrite** unless the target
  is dead, spam or a competitor. There are four external destinations in
  the whole content set, two of them the sources for statistics on a
  cluster pillar, so one careless rewrite can strip the evidence and leave
  the claim.
- Dates in prose are `21 September 2026`; ISO 8601 stays in frontmatter.
  Currency leads with GBP or EUR, never USD. Units metric, times 24-hour.
- Thousands and decimal separators are per market: `1,000.50` for the UK
  and Ireland, `1.000,50` for France, Germany, Spain, Italy and the
  Netherlands. Relevant now, and load-bearing when `content/nl` ships.
- Sworn and certified translation is not one term across Europe. Use the
  local designation rather than a catch-all English gloss.
- Never claim a certification, accreditation or track record the business
  does not hold. Extends the existing ban on inventing a price, a
  guarantee, a turnaround or a client outcome.

Split across `copy-editor` (language, sourcing, claims),
`localization-qa` (per-market formats, legal terminology),
`seo-preservation` (trailing slashes, image parity, link targets),
`seo-offpage` (anchor text, link preservation) and `content-migrator`
(carrying links, sources and formats across a migration).

## Orchestration and memory (house playbook, 21 Sep 2026)

`docs/PLAYBOOK-ADOPTION.md` records what was taken from the owner's house
playbook and, more importantly, what was refused: Supabase, next-intl,
shadcn/ui and per-page message files all reverse closed decisions, and the
playbook's button decision table would break under band alternation. Read
it before acting on that playbook.

**Where work runs:**

| Job | Where |
|---|---|
| Architecture, stack, final merge gate | Main session, never delegated |
| Five or more near-identical instances of a template | Parallel sub-agents |
| Shared config, design tokens, routing, schema | Main session, one hand |
| Deterministic linting | Cheapest model that runs it |
| Fact-checking, stats sourcing | Live search, never a model's recall |

Below five instances, agents cost more context than they save.

**Memory is written in the turn the decision is made**, not batched for
the end of a session, because a session compacts without warning. A new
convention goes into the style guide or the lint when it is established.
An agent that finds something contradicting a memory file corrects the
file in the same pass, not only the code: fixing the symptom and leaving
the stale doc guarantees the next session repeats the mistake. Two
corrections came out of that rule on the day it was adopted, the hosting
line above and a stale Next.js version in `cto.md`.

## Surfaced 21 Sep 2026, and what happened to each

Found while applying the owner's style guide and reviewing the built
output. Most are now fixed; the rest are recorded here rather than left in
chat history.

**Fixed 21 Sep 2026:**

- `lib/schema.ts` emitted no `image` on any type. Person now carries the
  portrait, ProfessionalService the wave mark as `logo` and `image`, and
  56 posts their own photograph. Service takes the parameter and passes
  nothing, because no service page has a photograph and a logo dressed as
  one is the substitution the style guide warns against.
- The static HTML shipped `0 Years in search`. `Counter.tsx` now renders
  the final value and the client introduces the zero, off screen.
- Five service pages printed literal backticks. `components/QueryTerms.tsx`
  renders them as chips, which also keeps the convention `copy-lint-code.mjs`
  depends on (backticks mark a verbatim search term, exempt from the copy
  lints).
- Two commercial pages quoted Ahrefs CPC in dollars. The figure is gone and
  the superlative kept, so nothing had to be converted or invented.
- The sourced-claim gap has an advisory queue: `npm run audit:sources`,
  wired into `verify`, never failing the build. Real figure, measured with
  bare years excluded: **57 posts carry a figure, 11 carry a source line.**
- The hero lede opened on the negative. Now "The enquiries arrive in
  English", which keeps the recognition and drops the negation.
- The `competitor-analysis-traffic-checklist` pillar emitted breadcrumbs
  and nothing else. It now emits `BlogPosting` with dates, author and
  image, via the new `getPostRecord()` in `lib/posts.ts`. `getPost()`
  could not reach it, because `getPosts()` skips `HAND_BUILT_SLUGS` by
  design, and that quiet hole is why the gap existed.
- **Eight meta titles** rewritten against Ahrefs volume, not instinct.

**Two claims in earlier notes were wrong, corrected here:**

- "Eighteen of nineteen meta titles do not use the words buyers search"
  was false. Eight of nineteen already did; the gap was eleven, and is now
  three. Sixteen of nineteen carry a buyer word, all under 60 characters.
- `lib/schema.ts:50` saying "founded" rather than "co-founded" was a **code
  comment**. The emitted schema only names BeTranslated under `worksFor`
  with no founding claim, so nothing ever reached a reader. Comment fixed.

**Still open:**

- **Three service titles deliberately unchanged.** `dutch-seo` and
  `generative-engine-optimization` would need the word *agency* to capture
  their volume ("dutch seo agency" 150, "generative engine optimisation
  agency" 1,300 at KD 1, which is genuinely attractive). The site is a
  consultancy and calls itself a practice, so writing *agency* would
  misdescribe the business. Owner's call, since only he can say whether
  the word is fair. `multilingual-content` was left because
  "multilingual content services" draws 30 searches and the present title
  says something better.
- **One positioning claim per service page.** Not ours to invent: a claim a
  competitor could not also make has to be a real decision about how the
  business runs, like the media-spend one on `multilingual-sem`. Asking
  the owner is the only honest route.
- **The Unsplash key pasted in chat has not been rotated.** Erasing a
  message is not rotation.
- **Three published claims contradict each other** (found 23 Sep 2026,
  while choosing proof for `/services/lead-generation/`). Owner's facts, so
  recorded rather than resolved, and none of the three was repeated on the
  new page:
  - `/services/multilingual-seo/` calls the Houston freight forwarder
    **English and Spanish** on one domain and says **daily quote requests
    doubled over eighteen months**. Its case study, `lib/projects.ts`
    `tx-international-freight`, says **"EN, single market"** and "a single
    market covered properly rather than several covered thinly".
  - The Bemelman Spuiterij case study says **Noordwijkerhout**;
    `/services/local-seo/` and `/services/dutch-seo/` say **Hillegom**.
  - The Valencia law firm is **three languages** (ES, FR, EN) on
    `/services/multilingual-seo/` and **four, including Russian**, on its
    case study.
  The quote-request doubling matters most: it is the one client outcome
  on the site stated as a number, and the page carrying it describes the
  account differently from the account's own case study.

## Agent roster

All agents live in `.claude/agents/`. Six were specified in the original
handoff (§6/§12/§16); the rest were added to cover gaps the handoff didn't
staff — token-usage/orchestration discipline, off-site SEO, accessibility,
and locale integrity.

| Agent | Role |
|---|---|
| `design-guardian` | Enforces design tokens + IP boundary + band-alternation system |
| `seo-preservation` | Redirect coverage, meta parity, hreflang — blocks deploys that regress SEO |
| `content-migrator` | WP → MDX migration per the content-map.json contract (§16) |
| `copy-editor` | Master Content Protocol linting (forbidden words, dashes, "Michael", ampersands) |
| `perf-auditor` | Core Web Vitals budgets, Lighthouse CI, X-embed facade pattern |
| `social-repurposer` | Turns a published URL into X thread/posts + LinkedIn post |
| `social-media-manager` | Owns cadence/scheduling across X and LinkedIn, Dispatches curation |
| `seo-offpage` | Digital PR, backlink reclamation, network-linking policy (§19) |
| `localization-qa` | Locale slug integrity, translation-group completeness, WPML→MDX parity |
| `accessibility-auditor` | WCAG contrast (both themes), focus states, reduced-motion, semantic HTML |
| `cto` | Architecture/stack steward; reviews agent orchestration itself for redundant work and token waste |
| `cfo` | Tracks hosting/API/token spend against the migration, flags scope creep against budget |

Run agents from CI on every PR (copy-editor, design-guardian,
seo-preservation, accessibility-auditor, perf-auditor at minimum) or on
demand. `cto` and `cfo` are advisory — invoke them when making a stack,
scope, or spend decision, not on every diff.

## Open decisions

Tracked in `docs/HANDOFF.md` §21 "Decisions OPEN" and §17 addendum. Resolve
with the owner before P1 work depends on them. Still open: X handle and the
three featured post URLs, Valencia STAY-list sign-off, credibility strip
numbers, the twelve posts rendering "Uncategorised", and the GEO
blog/service term overlap. Closed since that list was written: repo org
(`multilang2025/mikebastin`), Tier C prune (below), the 43 to 19 service
consolidation (built and live in `lib/services.ts`, now 20 after the
owner asked on 22 Sep for a page owning `content marketing services`),
the host and the database (§27).

**Tier C prune is CLOSED** (owner, 20 Sep). `docs/BLOG-PRUNE-AUDIT.md` holds
the record. REMOVE and MERGE shipped the same day, with all 42 legacy URLs
301ing to a live page. The 21 provisional KEEPs were checked against real
GSC and all 21 stay KEEP; the audit lists six the data argues against and
the reasoning for keeping them anyway. Nothing here blocks launch.

**GSC gotcha worth keeping:** mikebastin.com's Search Console data is
reachable, but only once the AISA bridge is pointed at that site
(`switch_site`). Query it while another site is active and
`gsc_list_properties` resolves against that site's Google account and
reports mikebastin.com as inaccessible, which reads like missing access
rather than a wrong default.

**Launch date: 30 October 2026** (owner, 22 Sep 2026, moved from 30
September). 38 days of runway rather than 8. `docs/LAUNCH-CHECKLIST.md`
holds the steps, and `npm run check:launch --live` is what says whether
the site can actually go.

**English only, and FR and ES start when EN is approved and locked**
(owner, 22 Sep 2026). The gate is the approval, not the calendar: the
extra month does not release FR and ES, and a date arriving does not
either. See "FR and ES are gated on EN" below for what locked means in
practice.

**What the site is selling** (owner, 20 Sep): **ongoing multilingual SEO,
for companies already selling abroad whose non-English markets
underperform.** Localisation, paid search and AI consulting are the work
around it rather than four peers competing for the same slot. The
homepage's "what we do" section names that audience directly now, and it
is the tie-breaker whenever a page has to decide what to lead with.

**Billing is a positioning point, not a footnote** (owner, 20 Sep). Where
an engagement includes paid search, the media budget goes straight to
Google, Microsoft or Meta, so there is no markup on spend and no reason
for the recommendation to be a bigger budget; management is charged as its
own fee. Carried from the legacy multilingual-sem page, confirmed by the
owner, and now on three pages: multilingual-sem, lead-generation and
how-i-work.

**It covers media spend and nothing else** (owner, 20 Sep, asked
directly). Translation and localisation through the BeTranslated network
are quoted as a price for the work rather than passed through at cost, so
the no-markup line must never be written in a way that implies otherwise.

`/how-i-work/` says both halves out loud, because the question there is
"how is it billed" and answering it only with the media-spend half invited
exactly the wrong inference. Stating the boundary is also the stronger
position: an agency vague about which costs are passed through and which
are priced usually has a reason to be.

**FR and ES are gated on EN** (owner, 22 Sep 2026, superseding the open
ended deferral of 20 Sep). French and Spanish work **starts when EN is
approved and locked**, and not before. Two consequences worth being
precise about, because they point in opposite directions.

It is a gate, not a date. The launch moving to 30 October released no FR
or ES work, and 30 October arriving will not either. Only the owner's
approval of EN does. So the critical path runs through **getting EN
approved**, and anything that delays that approval delays two more
locales behind it.

And **locked means locked**. EN copy has changed many times a day through
this session, which was right while it was being shaped and becomes
expensive the moment translation starts: every English edit after the lock
is an edit owed in French and Spanish, or a drift left in place. Once the
owner approves EN, treat a change to English copy as needing a reason, not
as routine, and say plainly what it costs the other two locales.

The gaps below are the FR and ES starting position whenever the gate
opens. Flagged rather than forgotten, so they are known and deliberate:

- **No FR or ES index pages.** `/fr/services/`, `/es/services/`, `/fr/blog/`
  and `/es/blog/` do not exist, only the individual `[slug]` routes under
  them. `SiteFooter` handles that by giving those locales no link to an
  index at all, since sending a French reader to an English one is worse
  than offering nothing. Both sitemaps list the individual pages, which is
  correct and not a workaround.
- **No FR or ES topic pages.** `getTopics()` reads the EN clusters, which
  have no FR/ES equivalent, so `/blog/topics/` is English only.
- **The FR and ES motto renderings are unreviewed.** They ship in
  `SiteFooter`'s string table and are a first pass, not signed off.
- **21 FR and ES service pages have unadapted headings.** The heading rule
  of 21 Sep applies to English commercial routes only, and
  `scripts/heading-shape-lint.mjs` reports those 21 on every run without
  failing. A word count does not survive translation, so they need a
  native reader rather than a rule, which is exactly the work the gate is
  holding back.
- **valenciamove.com's services page launches EN only.** The plan first
  recommended EN plus ES; the owner's call on 20 Sep supersedes that.

**Backlog, not yet started** (add here rather than losing track of them):
- Globaprom data-privacy/MT-compliance article (owner decision 6 Sep: add to
  list rather than draft now or skip). Real gap identified: none of
  Globaprom's translation/i18n content covers GDPR or data-retention
  questions for third-party MT APIs, and mikebastin's own treatment of the
  topic is unsourced boilerplate not worth porting as-is. Needs real
  citations if written: DeepL/Google Translate API retention terms, GDPR
  Article 28 processor obligations, ISO 27001 vendor questions.
