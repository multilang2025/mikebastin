# H1 audit

**The list:** [`h1-inventory.json`](./h1-inventory.json), 153 H1s, regenerated
with `node scripts/gen-h1-inventory.mjs` from `site/` after a build. It reads
the built `out/` rather than the sources, so it records what a visitor and a
crawler actually see, interpolated headings included.

**The analysis below** was produced by `openai/gpt-6-astra-pro` via
openrouter.ai on 19 September 2026, against the integrated state of PRs 81 to
86. The model was given the project's binding copy rules, so its rewrites are
meant to be compliant. They are not automatically correct: see "Filtering the
output" before acting on any of them.

## Provenance

| | |
|---|---|
| Model | `openai/gpt-6-astra-pro` |
| Date | 19 September 2026 |
| Input | 153 H1s with eyebrow, title, description, locale, page type, plus measured Ahrefs volume on 17 pages |
| Cost | $1.20 |
| Site state | `origin/main` with PRs 81, 82, 83, 84, 85, 86 merged locally |

## Filtering the output

The first run was fed bad data and had to be discarded. The extraction matched
eyebrows only up to `</p>`, which silently dropped 18 of the 20 service-page
eyebrows, and stripped `<br>` without a space, concatenating the homepage h1.
The model reported "the actual eyebrow field is empty" for a page whose eyebrow
exists, which was accurate about the data and wrong about the site. Both traps
are now handled in `gen-h1-inventory.mjs` and the analysis below is the rerun.

Suggestions still need checking against the rules the model was given. One of
its French rewrites reintroduces a year stamp ("les tendances a surveiller en
2026"), which the year-stamp decision of the same day removes from titles.

## Findings verified independently

Three were checked against the repository rather than taken on trust:

1. **12 blog posts and the blog index publicly display "Uncategorised"** as
   their eyebrow, and the generated cover cards carry the same label. A CMS
   artefact showing unfinished editorial organisation to visitors.
2. **10 French and 1 Spanish Valencia lifestyle posts are still live here**
   while their English siblings were migrated to valenciamove.com. The
   relocation covered English only.
3. **The `/services/italian-seo/` eyebrow term outdraws its own h1 term**:
   "seo italy" 150 UK a month against "italian seo" at 20.

## 1. Verdict

The site has two competing voices: a consultancy selling commercial judgement and a publishing operation explaining almost anything. Too many service H1s name a discipline without giving buyers a reason to choose it, while several blog H1s attract readers with no clear buying intent. Fix the commercial pages first, separate overlapping article briefs, and stop making eyebrows carry the entire sales argument.

Rankings below reflect commercial importance as well as wording. Cannibalisation findings are risks inferred from the supplied headings and context, not verified competition in search results.

## 2. Worst offenders

### 1. `/es/services/optimizacion-seo/`

**Current H1:** “SEO optimización”

**What is wrong:** Unnatural Spanish word order on a service page. It reads like two keywords assembled without editorial review. With no eyebrow, there is nothing else establishing the offer or buyer benefit.

**Replacement:** “Optimización SEO para atraer a clientes que buscan tus servicios”

Retains the subject, fixes the language and gives the service a commercial purpose.

### 2. `/services/local-seo/`

**Current H1:** “Local SEO”

**What is wrong:** The H1 ignores the supplied targeting decision. “Local SEO services” has 3,400 UK searches and KD 5 in your data, compared with KD 84 for the bare term. The eyebrow, “Off-site, one location at a time”, describes a channel boundary rather than a buying reason and makes local SEO sound exclusively off-site.

**Replacement:** “Local SEO services for businesses in multilingual cities”

Uses the intended service query naturally and states the distinction already present in the description. The difficulty figures support prioritisation, not a ranking promise.

### 3. `/services/italian-seo/`

**Current H1:** “Italian SEO”

**What is wrong:** The weaker-volume wording gets the H1 while the eyebrow holds “SEO Italy”, which has 150 UK searches against 20 for “Italian SEO”. Exact-match grammar is not required, but the page should foreground the market naturally. The current H1 also leaves the entire argument about translated copy to the eyebrow.

**Replacement:** “SEO services for businesses targeting Italy”

Keep the editorial-quality argument in a revised eyebrow or supporting sentence. Do not replace the H1 with the ungrammatical “SEO Italy”.

### 4. `/services/multilingual-seo/`

**Current H1:** “International SEO”

**What is wrong:** The correct head term is present, but the page stops at naming it. “The engine underneath the outcome” could introduce almost any marketing service and requires visitors to infer what outcome you mean.

**Replacement:** “International SEO for businesses selling across borders”

Retains ownership of “international SEO” without pulling the homepage away from its separate multilingual SEO and localisation positioning.

### 5. `/blog/technical-seo-for-spanish-search-engines/`

**Current H1:** “Technical SEO for Spanish search engines”

**What is wrong:** It implies a distinct category of Spanish search engines rather than technical SEO for websites targeting Spanish-speaking buyers. The wording confuses the technology with the market.

**Replacement:** “Technical SEO for websites targeting Spain”

The supplied description concerns the Spanish market. If the article also covers Latin America, broaden the heading only after checking the content.

### 6. `/blog/german-seo-content-localisation/`

**Current H1:** “German SEO content localisation: beyond translation for German SEO”

**What is wrong:** “German SEO” appears twice. “Beyond translation” gestures towards a distinction without explaining it. The result sounds assembled for keyword coverage rather than written for a buyer.

**Replacement:** “Why German SEO needs content localisation, not just translation”

Creates a reason to read and distinguishes localisation from a translation-only purchase.

### 7. `/blog/search-everywhere-strategy/`

**Current H1:** “Search everywhere, the strategy that replaced ranking”

**What is wrong:** Ranking has not been replaced. The comma also leaves an awkward connection between an instruction and a description. The claim makes the consultancy sound more interested in declaring a new era than explaining a commercial decision.

**Replacement:** “A search everywhere strategy reaches beyond Google rankings”

Positions broader visibility as an extension, not a fictional replacement.

### 8. `/es/analizar-backlinks-competidores/`

**Current H1:** “Analizar perfiles de backlinks de competidores para ventaja de autoridad”

**What is wrong:** “Para ventaja de autoridad” is an English-shaped construction, not natural Spanish. It also turns a practical research task into an abstract benefit that buyers have to decode.

**Replacement:** “Analiza los backlinks de tu competencia para detectar oportunidades de enlaces”

A direct, grammatical action with a concrete purpose.

### 9. `/blog/360-marketing-agency/`

**Current H1:** “Transform your marketing strategy with a 360 marketing agency”

**What is wrong:** Generic agency promotion on a consultancy’s blog. It recommends a supplier category before establishing whether the reader needs one, and “transform your marketing strategy” says nothing about the decision.

**Replacement:** “Do you need a 360 marketing agency or a specialist consultancy?”

Gives the article a supplier-selection role. Use it only if the body actually compares those choices.

### 10. `/blog/how-to-create-a-targeted-content-strategy/`

**Current H1:** “How to create a targeted content strategy?”

**What is wrong:** The question construction is malformed. A how-to heading does not take a question mark unless rewritten as a direct question. More importantly, “targeted” never identifies the target or the commercial purpose.

**Replacement:** “Build a content strategy around buyers, not just keywords”

Moves from a generic lesson towards a buying problem without promising an outcome.

## 3. Eyebrow/H1 pairs that fail

### The underlying problem

There are no obvious verbatim eyebrow/H1 duplicates in the supplied English pages. The failures are subtler: semantic repetition, category labels posing as persuasion, internal commentary, and tensions that the H1 never resolves.

A shared keyword is not automatically repetition. “Multilingual SEO” above “Website localisation mistakes that cost you the market” establishes a subject, while the H1 introduces a consequence. It is less distinctive than a page-specific eyebrow, but the two lines do different jobs.

### Priority pair repairs

| Page | Actual pairing | Failure | Replacement pair |
|---|---|---|---|
| `/` | “Plenty of sites rank. Far fewer sell.” / “Multilingual SEO that ranks. Localisation that converts.” | Both lines make essentially the same rank-versus-sell argument. The second restates rather than develops it. | **Eyebrow:** “Your buyers do not all search in English” **H1:** “Multilingual SEO that ranks. Localisation that converts.” |
| `/services/` | “One page cannot rank for everything, so there are 19” / “Multilingual SEO, localisation and AI consulting services” | Explains your information architecture to someone choosing a supplier. The page count is not a buying reason. | **Eyebrow:** “Different markets expose different problems” **H1:** “Find the SEO, localisation or AI support your business needs” |
| `/services/multilingual-seo/` | “The engine underneath the outcome” / “International SEO” | An unnamed mechanism underneath an unnamed result. Both lines remain abstract. | **Eyebrow:** “A translated website is not a market entry strategy” **H1:** “International SEO for businesses selling across borders” |
| `/services/ai-consulting/` | “AI consultants who say where AI does not help” / “AI consulting” | The eyebrow makes the useful distinction. The H1 then retreats to the category label. | **Eyebrow:** “Not every multilingual task belongs with AI” **H1:** “We identify where AI fits your multilingual workflow” |
| `/services/french-seo/` | “SEO France, where the francophone volume sits” / “French SEO” | Mostly restates geography and language. The volume claim is not substantiated by the supplied keyword figures, which measure query demand rather than total francophone demand. | **Eyebrow:** “A shared language does not mean shared search behaviour” **H1:** “French SEO services built around each target market” |
| `/services/german-seo/` | “SEO Germany, researched longer, decided slower” / “German SEO” | The eyebrow implies a broad behavioural comparison without evidence. The H1 does not answer the research concern. | **Eyebrow:** “Visibility alone does not answer a buyer’s questions” **H1:** “German SEO that addresses what buyers need to know” |
| `/services/italian-seo/` | “SEO Italy, where translated copy gets found out” / “Italian SEO” | The eyebrow raises the copy problem, but the H1 only names the market. | **Eyebrow:** “Translated keywords can miss how buyers search” **H1:** “SEO services for businesses targeting Italy” |
| `/services/local-seo/` | “Off-site, one location at a time” / “Local SEO” | Process shorthand above a subject label. Neither gives the buyer a meaningful distinction. | **Eyebrow:** “The same street gets searched in more than one language” **H1:** “Local SEO services for businesses in multilingual cities” |
| `/services/website-localisation/` | “Beyond translated strings” / “Website localisation” | “Beyond” creates an information gap that the H1 leaves open. Explain what localisation changes. | **Eyebrow:** “Translation alone leaves buying barriers in place” **H1:** “Website localisation for how each market buys” |
| `/competitor-analysis-traffic-checklist/` | “The biggest asset on the domain, ranking nowhere” / “The competitor analysis and traffic checklist” | Internal SEO commentary displaces the visitor’s problem. Neither the asset claim nor your ranking position explains why someone should use the checklist. | **Eyebrow:** “A traffic estimate does not explain a competitor’s strategy” **H1:** “Assess rival websites with our competitor analysis and traffic checklist” |
| `/blog/` | “Sorted by subject, because a date is not a subject” / “The Journal: multilingual SEO and AI consulting articles” | Defensive commentary about navigation above an editorial label. Neither helps a buyer choose what to read. | **Eyebrow:** “Before you commit budget to another market” **H1:** “Assess your options for multilingual SEO, localisation and AI” |
| `/blog/best-practices-for-multilingual-seo/` | “Multilingual SEO” / “Ranking is no longer where multilingual SEO ends” | The eyebrow simply repeats the topic. The H1 introduces a change but the eyebrow does not prepare the reader for it. | **Eyebrow:** “Search answers do not always send a click” **H1:** “Ranking is no longer where multilingual SEO ends” |

For the AI page, keep “AI consulting” in the title and opening copy. There is no need to force every query variant into the H1.

### Category eyebrows that are doing no persuasive work

- **Every “Uncategorised” eyebrow:** Delete the public label. It advertises unfinished editorial organisation. On the off-topic articles, removing it will not solve the absence of a commercial role.
- **“SEO fundamentals”:** Usually a navigation category, not an argument. Above “Law firm SEO services”, it also encourages an educational reading of what sounds like a commercial offer.
- **“Language markets”:** Gives almost no information above “Spanish on-page SEO”, “Content optimisation for Spanish users” or “German SEO best practices and trends”.
- **“AI and the future of search”:** Semantically circular above “Where SEO goes next: AI, GEO and what actually works” and “How AI is revolutionising SEO strategies”.
- **“AI and the future of search” above the translation and chatbot articles:** The category promises search coverage that those H1s do not establish.
- **“Multilingual SEO” above “Google Analytics alternatives, and when each one fits”:** The H1 does not explain the multilingual relevance. Either introduce that decision explicitly or remove the category from the hero.
- **“Multilingual lead generation” above the email marketing article:** The heading provides no multilingual angle. The eyebrow is asserting a relevance the H1 does not support.

Keep categories as navigation metadata if needed. They do not have to occupy the most prominent line above the H1.

### Every project page stops at the client name

The actual eyebrows add sector or background, so these are not repetition failures. They fail as persuasion pairs because the H1 never states the work, problem or evidence.

| Page | Actual eyebrow | H1 replacement using supplied context |
|---|---|---|
| `/projects/bemelman-spuiterij/` | “Dutch powder coating, 45 years” | “Building a local search presence for Bemelman Spuiterij” |
| `/projects/betranslated/` | “Founded it, still run it” | “Managing SEO across six regional domains for BeTranslated” |
| `/projects/c21perdomo/` | “Dominican real estate” | “Managing property listings in four languages for Century 21 Perdomo” |
| `/projects/delaguia-y-luzon/` | “Valencia law firm” | “Managing legal SEO across four languages for Delaguía y Luzón” |
| `/projects/globaprom/` | “Custom AI software” | “Building a shipment tracking portal for Globaprom” |
| `/projects/matosurf/` | “French board sports” | “Building an editorial method for Matosurf’s board sports guides” |
| `/projects/tx-international-freight/` | “Houston industrial freight” | “Building SEO around buyers’ terminology for TX International Freight” |
| `/projects/valenciamove/` | “Expat relocation, first hand” | “Publishing relocation content in five languages for ValenciaMove” |

These are scope-led headings, not invented success claims. Add quantified outcomes only where the case study proves them.

For BeTranslated, replace the eyebrow with **“We operate the business, not just its SEO”**. The existing “Founded it, still run it” leaves the speaker ambiguous and reads as an individual aside.

### Pages with no eyebrow

Every supplied French and Spanish page has `null`. There is no eyebrow repetition to diagnose there, and no hidden supporting line should be assumed when judging the bare service H1s.

## 4. Cannibalisation

### Highest-risk pairs

| Pages | Likely competing query or intent | Required separation |
|---|---|---|
| `/es/analisis-competitivo-seo/` and `/es/analisis-de-la-competencia-seo/` | SEO competitor analysis | Both promise essentially the same subject. Consolidate unless the bodies support clearly different jobs. |
| `/fr/consultant-referencement-international/` and `/fr/expert-en-seo-international/` | Hiring an international SEO specialist | “Consultant” and “expert” do not establish separate buyer needs. Give one page ownership of specialist selection. |
| `/fr/agence-seo-internationale/` and `/fr/consultant-referencement-international/` | Choosing international SEO support | Agency versus consultant is a possible distinction, but the current “can help” and “can transform” headings do not make it. |
| `/blog/content-optimisation-for-spanish-users/` and `/blog/spanish-on-page-seo/` | Optimising Spanish website content | Reserve the first for intent and editorial adaptation, the second for page-level implementation. |
| `/blog/german-seo-best-practices/` and `/blog/german-seo-content-localisation/` | German SEO guidance | The general article needs a narrower brief or it will absorb the localisation article’s subject. |
| `/blog/future-of-seo/` and `/blog/how-ai-is-revolutionising-seo-strategies/` | AI’s effect on SEO | Both promise broad coverage of the same change. Merge or separate strategic investment decisions from specific workflow changes. |
| `/blog/how-ai-is-transforming-translation-and-localisation/` and `/blog/how-to-use-ai-and-machine-translation-tools/` | AI translation and localisation | Separate adoption decisions from tool evaluation and quality control. The current headings leave substantial overlap. |
| `/blog/competitor-analysis/` and `/competitor-analysis-traffic-checklist/` | SEO competitor analysis | Keep the article explanatory and the checklist explicitly task-based. Avoid turning both into general guides. |

### Service and article overlaps requiring clearer intent

- **`/services/generative-engine-optimization/` and `/blog/generative-engine-optimization/`:** Same core subject. The service page should own the commercial offer; the article should answer a defined research or purchasing question.
- **`/services/technical-seo/` and `/blog/technical-seo-for-multilingual-websites/`:** The service description is already multilingual. Make the article diagnostic rather than a second overview of the service.
- **`/services/website-localisation/` and `/blog/optimising-multilingual-website-content/`:** The article’s “role of localisation” framing is broad enough to compete with the service explanation. Narrow it to content adaptation decisions.
- **`/fr/services/referencement-multilingue/` and `/fr/expert-en-seo-international/`:** The expert article explicitly promises a multilingual SEO specialist. It needs a selection-focused purpose rather than a parallel sales pitch.

### Deliberate distinctions worth preserving

- **Homepage and `/services/multilingual-seo/`:** Keep multilingual SEO and localisation as the homepage proposition and international SEO as the service page’s primary query. Related terms do not automatically mean harmful competition.
- **Homepage and `/services/website-localisation/`:** There is lexical overlap, but an umbrella homepage and a dedicated service page can serve different intents.
- **Language service pages and market-specific articles:** “Spanish SEO” and “Spanish keyword localisation” need not compete if one sells the engagement and the other addresses a defined problem.
- **French, Spanish and English equivalents:** They are not automatically cannibalising one another. Check language targeting, canonicals and hreflang before drawing that conclusion.

The preview’s noindex status means none of these headings establishes live search competition. Validate the proposed ownership map against the production site’s query-to-page data.

## 5. Patterns

### 1. Keyword ownership is being confused with a finished proposition

“Technical SEO”, “Translation services”, “AI consulting” and the language service labels identify categories. They do not explain who should buy, what problem is addressed or why this offer differs.

A natural noun phrase can be grammatical. The issue is not the absence of a verb; it is the absence of a useful distinction.

### 2. The eyebrow often contains the only reason to care

“Written per market, not translated” and “Small volume, decisive buyers” do more commercial work than “Multilingual content” and “Dutch SEO”.

Do not mechanically lengthen every H1. Make the two lines progress from buyer tension to relevant offer, rather than from argument back to label.

### 3. Too much copy comments on the website itself

Examples include:

- “One page cannot rank for everything, so there are 19”
- “The biggest asset on the domain, ranking nowhere”
- “Sorted by subject, because a date is not a subject”

Buyers need help evaluating their problem and your competence. They do not need an account of how you organised the site.

### 4. Editorial confidence is slipping into unsupported absolutes

- “How to create the perfect French PPC campaign”
- “Why Spanish SEO is not optional”
- “The strategy that replaced ranking”
- “Search engine optimisation is dead?”

Replace the claims with decisions, trade-offs and mechanisms. “Perfect” is not a credible campaign criterion.

### 5. “Actually”, “worth” and “not just” are becoming templates

Those devices appear across tool lists, strategy articles, process pages and results copy. Repetition turns an intended voice of scepticism into another content formula.

Keep them where they identify a real distinction. Remove them where they merely add attitude.

### 6. Several articles have no visible route to a consultancy purchase

Vietnam sourcing agencies, networking for young professionals, professional-background advice, beaches and climate coverage create a mixed audience.

An H1 rewrite cannot fix that. Each page needs a defensible acquisition role, a relevant next step or a separate home outside the consultancy’s main commercial journey. Do not remove pages solely because their H1 looks off-topic; check traffic, links and assisted enquiries first.

### 7. Grammar and house style still need an editorial pass

- “Translators are already prompt engineers, they just do not know it” contains a comma splice. Use **“Translators already have skills that prompt engineering requires”**.
- “Affiliate marketing programs” should use **“programmes”** in this UK English context.
- “The Journal” should use a lower-case “journal” unless it is a formal publication name.
- The capital “Un” after the colon in the French community article breaks the requested sentence case.
- `/es/trabajar-en-remoto-desde-valencia/` uses singular-owner voice in “mi experiencia”. Replace the heading with **“Trabajar en remoto desde Valencia: qué conviene saber antes de mudarse”**, provided the article supports that brief.

H1 changes also need a title review because many current titles mirror them.

### 8. Metadata sometimes contradicts the page

The Chrome SEO extensions page describes Google Maps. The internal linking tools page describes budget SEO services. Several localised SEO and SEM service descriptions describe ecommerce integration instead.

Those mismatches will undermine any H1 repair. The supplied German SEO descriptions also contain ranking guarantees that need evidence or removal, not repetition in new copy.

## 6. FR/ES

### Overall assessment

Most localised service H1s read as translated catalogue labels rather than market-specific sales propositions. The Spanish article set contains clearer signs of literal English transfer; the French set contains more generic editorial filler and awkward phrasing.

H1s alone cannot prove machine translation. The examples below are machine-translation-like, not evidence of how they were produced.

### Spanish: clearest warning signs

| Page | Problem | Replacement |
|---|---|---|
| `/es/services/optimizacion-seo/` | “SEO optimización” has unnatural word order. | “Optimización SEO para atraer a clientes que buscan tus servicios” |
| `/es/analisis-competitivo-seo/` | “El crecimiento del SEO y marketing digital” treats SEO as the thing growing and joins the terms awkwardly. | “Análisis de la competencia para orientar tu estrategia SEO” |
| `/es/analizar-backlinks-competidores/` | “Para ventaja de autoridad” is a literal, unnatural construction. | “Analiza los backlinks de tu competencia para detectar oportunidades de enlaces” |
| `/es/analizar-trafico-web-competencia/` | “Para ventaja estratégica” repeats the same translation pattern. | “Analiza el tráfico web de tu competencia para decidir dónde competir” |
| `/es/herramientas-gratuitas-analisis-competitivo/` | “Para análisis competitivo efectivo de SEO” stacks modifiers in an English-shaped order. | “Herramientas gratuitas para analizar a tu competencia en Google” |
| `/es/medir-rendimiento-geo/` | Missing articles and ambiguous “citas de IA”. | “Cómo medir el rendimiento del GEO y las citas en respuestas de IA” |
| `/es/rastrear-posiciones-de-keywords-de-competidores/` | Repeated “de” constructions and unnecessary English terminology make it laboured. | “Cómo seguir las posiciones de tu competencia en Google” |

The proposed heading for `/es/analisis-competitivo-seo/` fixes the Spanish, not its overlap with the other competitor-analysis article. Resolve page ownership before publishing it.

“SEO en alemán”, “SEO en francés” and “SEO en portugués” are natural Spanish labels. Their weakness is commercial, not linguistic.

### French: translation-like or poorly adapted wording

| Page | Problem | Replacement |
|---|---|---|
| `/fr/mode-de-vie-de-valencia/` | “Le mode de vie de Valencia” and “un périple d’expat” sound assembled rather than idiomatic. | “S’installer à Valence : les habitudes à revoir au quotidien” |
| `/fr/vivre-en-appartement-a-valencia/` | “Vue d’ensemble pragmatique” sounds like an internal brief, not a reason to read. | “Vivre en appartement à Valence : les points à vérifier avant de louer” |
| `/fr/seo-au-geo/` | “Optimiser votre visibilité pour les moteurs de recherche alimentés par l’IA” is cumbersome and English-shaped. | “Du SEO au GEO : rendre votre entreprise visible dans les réponses de l’IA” |
| `/fr/nouvelles-tendances-du-secteur-des-affaires/` | “Secteur des affaires” is vague, bureaucratic wording. | “IA et commerce international : les tendances à surveiller en 2026” |
| `/fr/consultant-referencement-international/` | “Peut vous aider” offers no meaningful decision criterion. | “Quand faire appel à un consultant en référencement international” |

For French readers, **“Valence, en Espagne”** is the usual localised form. “Valencia” is not proof of machine translation and may reflect a search-targeting choice, but the repeated use needs an explicit language and query rationale.

The exported `&#x27;` strings also need checking in the rendered page. If users see those characters literally, fix the escaping; if the browser displays apostrophes normally, it is only an export issue.

The French and Spanish headings about moving beyond prompt tracking contain an actual editorial position. Most localised service headings contain only the name of the service.

## 7. Keep

Keep these for the specific jobs they perform, not as templates for every page:

- **`/services/lead-generation/`**  
  “Why is your French, German or Spanish site not producing enquiries?”  
  Names the buyer’s commercial problem. Do not replace it with a zero-volume phrase merely to make it look more SEO-led.

- **`/contact/`**  
  “Tell us which language is losing you money”  
  Gives the visitor a concrete way to start a conversation rather than asking for a generic message.

- **`/blog/digital-marketing-advisor/`**  
  “When businesses need a digital marketing advisor instead of an agency”  
  Addresses supplier selection and creates a route towards a consultancy enquiry.

- **`/blog/15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business/`**  
  “Blog post ideas that attract customers, not just traffic”  
  Connects an informational topic to commercial intent. Remove “Uncategorised” above it.

- **`/blog/google-analytics-international-marketing-limits/`**  
  “Google Analytics and international digital marketing: what you can and cannot trust”  
  Defines an evaluation problem rather than promising another general introduction.

- **`/how-i-work/`**  
  “How a multilingual SEO engagement actually runs”  
  Answers a buying-stage question about delivery. “Actually” is expendable, but the page purpose is not.

- **`/contact/problem/` and `/contact/thanks/`**  
  “The message did not send” and “Your message is in”  
  State the system status clearly. Utility pages do not need sales copy or keyword expansion.

- **`/results/`**  
  “What actually happened, with the numbers attached”  
  Keep if the page supplies the evidence immediately. If SEO case study acquisition becomes a priority, address that explicitly in the title and supporting structure rather than pretending the current H1 targets it.