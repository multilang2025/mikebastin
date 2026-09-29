# Negative wording audit (EN)

Owner, 28 Sep 2026, on `/blog/best-practices-for-multilingual-seo/`:
"Negative wording here. Audit similar cases across the website."

**Scope.** The copy a reader or a search result sees first: post titles,
search titles, excerpts, `h2`/`h3`, in-body CTA leads, and on service
pages the `h1`, subhead, angle, lede, meta description and section
headings. 52 published posts and 20 service pages. Body paragraphs are
out of scope except on the flagged post.

**Method.** `scratchpad/neg_audit.py` flags negation and loss words (not,
no longer, never, without, cannot, nobody, mistakes, failure, lose, avoid,
wrong...). 143 strings matched. Each was read and given a verdict.

## Second pass, every sentence and every locale (29 Sep 2026)

Owner, on the French lead generation billing section ("Aucune marge sur
votre budget publicitaire : un budget plus élevé ne nous rapporte rien"):
"This is purely negative writing I abhor and don't want reflected across
locales. Continue audit for rewrites."

That overrules two Keep groups below: **Keep: positioning** (the billing
point is now said forwards, with every fact kept) and **Keep:
problem-first** (situation openings stay, written as where the reader is
and where they want to be). The rule is now `docs/STYLE-GUIDE-UK-EU.md`
section 9, and `npm run lint:negative` enforces it on the built output.

| | Before | After |
|---|---|---|
| Titles, meta descriptions, h1 to h3, CTA leads, heroes (all locales) | 209 | 0 (3 allowlisted: two verbatim reviews, the 404 title) |
| Body sentences with a negation | 2,032 on 153 pages (EN 1,388, FR 298, ES 346) | 47 on 38 pages (EN 35, FR 3, ES 9) |

The 47 remaining body sentences are deliberate keeps, each listed by the
rewriting pass: sourced figures and dated facts (retired Google tools,
the IEEPA ruling), legal distinctions (a notary attests the signature,
the Beckham regime's residence condition), the reader's own question
that the page then answers, and grammatical glue. Blockquotes (sourced
statistics, reviews) are never counted.

Scope: `lib/services.ts` (20 service pages), every hand-built EN route
and shared component, `lib/projects.ts`, `lib/absorbed.ts`, `lib/posts.ts`
topic text, all published EN, FR and ES posts, the live FR and ES service
pages, and the FR and ES hand-built pages. Figure captions had their own
pass (29 rewritten). No h1 lost its primary keyword, every excerpt and
meta description stayed in range, and remarks about other agencies were
removed everywhere. Spanish now addresses the reader as "tú" (owner, same
day).

Side fixes made along the way: "fondateur" corrected to "cofondateur" of
BeTranslated and the Italian and German level made vague on the French
multilingual SEO page, "We read Italian fluently" replaced with the
owner's "enough to manage SEO projects" wording, and French spellings
(localisation, optimiser) restored in eight French posts.

## Applied 29 Sep 2026

The owner said "apply". All 76 rewrites are in, and a re-run of the scan
flags 64 strings: exactly the Keep groups below. Each heading was read
against the opening of its section first, and where the section turned
out to be a list of faults, a heading promising "what to get right" would
have misdescribed it. Those take a neutral "what to watch for" form
instead of the proposal:

| Page | Proposed | Applied |
|---|---|---|
| conversational-ai-chatbots-business | What to get right from the start | What to watch for |
| english-to-french-translation-services | What makes English to French translation work for French readers | Three faults to watch for in English to French translation |
| french-ppc-campaign | What to get right in French PPC campaigns | Three things to watch in French PPC campaigns |
| link-building-in-spain | Three things agencies should do differently | Three agency habits to watch for |
| spanish-keyword-localisation, spanish-on-page-seo, technical-seo-considerations-for-german-websites | Getting the details right / What to get right | What to watch for |
| affiliate-marketing-programs | What new affiliates should budget for in 2026 | Where new affiliates can protect their margin in 2026 |
| building-a-global-brand | A pattern we keep seeing, and the fix | A pattern we keep seeing in global launches |
| digital-marketing-advisor | Where each model is strongest | Where each model fits best |
| global-business-trends | ...settled, and still being refined | ...settled, with obligations to plan for |
| global-business-trends | ...getting it right is worth more every year | ...the stakes keep rising |

## Verdicts

| Verdict | Meaning | Count |
|---|---|---|
| **Fixed** | The flagged post, rewritten 28 Sep 2026 | 3 |
| **Rewrite** | Framing by denial or failure where a statement of what the reader gets does the same job | 76 |
| **Keep: searched term** | The negative word is the query the page answers | 6 |
| **Keep: positioning** | A deliberate claim the owner confirmed (no markup on spend, AI where it does not help) | 4 |
| **Keep: quote** | Verbatim quotation | 1 |
| **Keep: problem-first** | Excerpt, lede or CTA that opens on the reader's situation and its cost, as the voice spec asks (BLOG-STRUCTURE.md "The opening") | 53 |

The problem-first group is listed, not proposed for rewriting: stating the
reader's problem is the spec, and "your pages rank and do not sell" is a
situation, not negative wording. Where one also leads with a denial, it
moved to Rewrite.

## Fixed: `/blog/best-practices-for-multilingual-seo/`

| Before | After |
|---|---|
| Ranking is no longer where multilingual SEO ends | Multilingual SEO best practices that get you ranked and cited |
| Keyword localization, not translation | Keyword localization: start from how each market searches |
| Not sure each market is reaching the right version of your site? | Want every market to land on the right version of your site? |
| Never mix structures across languages. | Use the same structure for every language. |
| A multilingual strategy that ignores GEO leaves revenue on the table. A GEO strategy without multilingual SEO fundamentals has nothing to build on. | Multilingual SEO wins the ranking and GEO wins the citation, so together they reach the buyer at both moments. |

The excerpt, intro, figure caption and five other body sentences were
turned the same way. No link, source or claim removed. The post now
contains no negation at all.

## Rewrite: post titles (3)

| Page | Now | Proposed |
|---|---|---|
| /blog/15-simple-blog-post-ideas-to-help-attract-customers/ | Blog post ideas that attract customers, not just traffic | Blog post ideas that turn readers into customers |
| /blog/google-analytics-international-marketing-limits/ | ...what you can and cannot trust | ...what to trust and what to check |
| /blog/spanish-seo-markets/ | Why Spanish SEO is not optional | Spanish SEO markets: where each one needs its own approach |

## Rewrite: post headings (37)

| Page | Now | Proposed |
|---|---|---|
| 360-marketing-agency | When to hire a 360 partner, and when not to | Deciding whether a 360 partner is the right hire |
| affiliate-marketing-programs | How to pick an affiliate programme without wasting six months | How to pick the right affiliate programme first time |
| affiliate-marketing-programs | Where new affiliates lose money in 2026 | What new affiliates should budget for in 2026 |
| building-a-global-brand | Three things that travel without adjustment | Three things that travel as they are |
| building-a-global-brand | A real failure mode we keep seeing | A pattern we keep seeing, and the fix |
| chrome-extensions-for-translators | Reference helpers we cannot work without | Reference helpers we use every day |
| competitor-analysis | Most competitor analysis is theatre, not strategy | Competitor analysis that drives strategy |
| competitor-analysis | Who shares your SERPs is not who shares your industry conference | Your search competitors are the ones sharing your SERPs |
| competitor-analysis | AI search shifts the question, not the method | AI search changes the question, and the method holds |
| competitor-analysis | Three failure patterns we keep seeing | Three patterns worth correcting early |
| conversational-ai-chatbots-business | Common mistakes | What to get right from the start |
| conversational-ai-chatbots-business | Plan for failure gracefully | Plan for graceful recovery |
| digital-marketing-advisor | Where each model wins and where it loses | Where each model is strongest |
| digital-marketing-advisor | The hidden costs nobody mentions in the pitch | The full costs to ask about before you sign |
| english-to-french-translation-services | Why generic English to French translation keeps failing | What makes English to French translation work for French readers |
| english-to-french-translation-services | Where translation alone is not enough | Where translation needs localization alongside it |
| french-ppc-campaign | Common pitfalls to avoid in French PPC campaigns | What to get right in French PPC campaigns |
| future-of-seo | AI is not replacing SEO, it is replacing bad SEO | AI raises the bar for SEO |
| future-of-seo | Zero-click is the default, not the enemy | Working with zero-click as the default |
| future-of-seo | Multilingual SEO is a growth lever, not a checkbox | Multilingual SEO as a growth lever |
| global-business-trends | Remote and hybrid work: settled, not solved | Remote and hybrid work: settled, and still being refined |
| global-business-trends | Data privacy and cybersecurity: the cost of getting it wrong keeps rising | Data privacy and cybersecurity: getting it right is worth more every year |
| google-analytics-international-marketing-limits | What you cannot trust: structural limits of international data | What to check: structural limits of international data |
| google-analytics-international-marketing-limits | Why data alone is not enough | Why data needs market knowledge beside it |
| google-analytics-international-marketing-limits | Using analytics without being misled | Reading analytics with confidence |
| link-building-in-spain | Link building in Spain works on relationships, not templates | Link building in Spain works on relationships |
| link-building-in-spain | Three mistakes we see agencies repeat | Three things agencies should do differently |
| link-selling-and-link-buying-platforms | Want a link strategy that is not just a shopping list? | Want a link strategy built around your markets? |
| mastering-the-art-of-networking | Long-term networking: relationships, not contacts | Long-term networking: building relationships |
| spanish-keyword-localisation | When your Spanish keywords are translations, not searches | When your Spanish keywords should come from searches |
| spanish-keyword-localisation | Avoiding common mistakes | Getting the details right |
| spanish-on-page-seo | Mistakes to avoid | What to get right |
| best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits | Why machine translation is not enough | Why machine translation needs a human editor |
| technical-seo-considerations-for-german-websites | Keywords in URLs, without stuffing them | Keywords in URLs, used sparingly |
| technical-seo-considerations-for-german-websites | Common mistakes to avoid | What to get right |
| technical-seo-for-multilingual-websites | Common hreflang mistakes that cost you rankings | Hreflang checks that protect your rankings |
| technical-seo-for-multilingual-websites | Avoiding domain structure mistakes | Choosing a domain structure that scales |

Each proposed heading has to be read against its section before it
ships: a heading must say what the section delivers, so any whose section
is genuinely a list of failures gets its opening sentence turned too.

## Rewrite: in-body CTA leads (13)

"Not sure...?" becomes "Want to know...?" or the outcome the reader wants.

| Page | Now | Proposed |
|---|---|---|
| ai-powered-marketing | Not sure which of these to try first in your markets? | Want to know which of these to try first in your markets? |
| eeat-vs-aeat-typo | Publishing in Spanish and English, and not sure both versions pull their weight? | Publishing in Spanish and English, and want both versions pulling their weight? |
| german-seo-best-practices | Not sure your German pages target the words German buyers type? | Want your German pages to target the words German buyers type? |
| google-analytics-international-marketing-limits | Not sure which of your markets GA4 is undercounting? | Want to know which of your markets GA4 is undercounting? |
| how-to-create-a-targeted-content-strategy | Not sure which subjects your buyers actually search for? | Want to know which subjects your buyers actually search for? |
| how-to-promote-your-local-business-on-google-maps | Not sure your details match everywhere they appear? | Want your details to match everywhere they appear? |
| how-to-use-ai-and-machine-translation-tools | Already running machine translation and unsure what it gets wrong? | Already running machine translation and want to know where it needs an editor? |
| localisation-testing-tools | Launching a new language and not sure what your tests would miss? | Launching a new language and want every fault caught before launch? |
| spanish-keyword-localisation | Not sure whether your Spanish pages target Spain or Mexico? | Want to know whether your Spanish pages target Spain or Mexico? |
| spanish-on-page-seo | Want your Spanish pages named in AI answers, not only ranked? | Want your Spanish pages named in AI answers as well as ranked? |
| spanish-seo-markets | Not sure which Spanish your site is actually written for? | Want to know which Spanish your site is actually written for? |
| seo-in-belgium | Reaching Flanders or Wallonia, but not both? | Want to reach Flanders and Wallonia alike? |
| common-mistakes-to-avoid-when-localising-your-website | Worried your localized site has problems nobody has reported yet? | Want the problems on your localized site found before a buyer finds them? |

## Rewrite: service pages (23)

| Page | Field | Now | Proposed |
|---|---|---|---|
| multilingual-sem | heading | Native per market, never translated from one list | Native per market, researched from each market's own searches |
| conversion-tracking | heading | What one merged report cannot tell you | What per-market reporting tells you |
| multilingual-seo | heading | Three failure patterns we see in every audit | Three patterns we check in every audit |
| french-seo | heading | French SEO written in French, not translated into it | French SEO written in French from the start |
| dutch-seo | heading | Buyers search by country, not by language | Dutch buyers search by country: the Netherlands and Flanders apart |
| local-seo | heading | Where local visibility actually gets lost | Where local visibility is won |
| translation-services | heading | Where a mistranslation stops being cosmetic | Where accuracy carries legal weight |
| ai-translation-and-post-editing | heading | Why a fluent translation can still be wrong | Why fluent translation still needs a native check |
| generative-engine-optimization | heading | Why citation, not just ranking, is now the target | Why citation is now the target alongside ranking |
| portuguese-seo | expandables | Portugal or Brazil, and why not both by default | Portugal or Brazil: choosing per market |
| multilingual-content | expandables | What travels between languages and what does not | What travels between languages and what each market rewrites |
| ai-translation-and-post-editing | subhead | ...because text that reads fluently and is wrong is worse than text that warns you. | ...because fluent text has to be right as well as readable. |
| generative-engine-optimization | subhead | ...to cite you, not only for Google to rank you. | ...to cite you, as well as for Google to rank you. |
| technical-seo | subhead | The work that stops your language versions competing with each other for the same buyers. | The work that lets each language version win its own buyers. |
| lead-generation | angle | Enquiries, not visits | Counted in enquiries |
| multilingual-sem | angle | International PPC, buying what search has not earned | International PPC, buying reach while search builds it |
| dutch-seo | angle | SEO Netherlands and Belgium, without a translator in between | SEO Netherlands and Belgium, written in Dutch from the start |
| generative-engine-optimization | angle | Cited inside the answer, not just ranked below it | Cited inside the answer as well as ranked below it |
| multilingual-content | angle | Written per market, not translated | Written per market |
| portuguese-seo | meta description | Portugal and Brazil are two markets, not one keyword set. | Portugal and Brazil are two markets with two keyword sets. |
| portuguese-seo | lede | Portugal and Brazil are not one market with one keyword set, and treating them as one is the mistake... | Portugal and Brazil are two markets with two keyword sets, and treating them separately is what makes Portuguese simpler than it looks. |
| ai-translation-and-post-editing | meta description | ...read fluently are the hard case, not the broken ones. | ...read fluently are the hard case to catch. |
| website-localisation | meta description | ...is the job the words alone do not do. | ...is the job that makes the site feel local. |

Service `h1`s, angles and headings feed cards, share cards and the
keyword-coverage lint; a changed `h1` must keep its primary term.

## Keep

**Searched term (6):** "Website localization mistakes that cost you the
market" (title, the query is "localization mistakes"), its h3s "Failing
to adjust imagery" and "Not adapting payment methods and formats" (a
mistakes list by design), "Do zero-click searches kill SEO?" (the FAQ
question as searched), "Where this stops and the multilingual page
starts" (scope, not negation), and the conversion-tracking lede "one
merged report will never answer it" (the page's own premise).

**Positioning (4):** multilingual-sem subhead "no markup on spend and no
reason to recommend a bigger one" (owner, 20 Sep); ai-consulting angle
"AI consultants who say where AI does not help" and expandables "Where AI
earns its place, and where it does not"; multilingual-sem meta "never
quietly subsidises another".

**Quote (1):** "Humanity should never be optional".

**Problem-first (53):** 19 excerpts, 19 CTA leads that open on the
reader's situation ("Traffic arriving and enquiries not following?"), 12
service ledes and 3 meta descriptions. Each states a real situation the
reader recognises, as BLOG-STRUCTURE.md and the service voice ask. They
can be softened in a later pass if the owner wants the whole site to lean
positive, but that is a voice decision, not a wording fix.
