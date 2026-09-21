# GLM 5.2 heading review, 21 September 2026

Owner instruction: "Provide current H1 and H2, send to GLM 5.2 via
openrouter.ai for optimization following best practices."

Record of what was sent, what came back, what shipped and why the two
differ. Kept because the run cost real money and produced a reusable
finding about what an external model does and does not get right on
this kind of task.

## The run

| | |
|---|---|
| Model | `z-ai/glm-5.2` via OpenRouter |
| Prompt tokens | 3,132 |
| Completion tokens | 19,489 |
| of which reasoning | 19,427 |
| Cost | $0.0495 |
| Pages sent | 26, every English commercial route |

The system prompt carried the house rules (UK English, sentence case, no
dashes, no ampersands, the banned vocabulary, the "we" voice, the
no-invention rule) plus the Ahrefs primary and secondary keywords per
page from `site/lib/keywords.ts`.

## Outcome

- **10 adopted as written**
- **10 rewritten by us**, shape kept
- **6 left alone**, GLM proposed no change
- 25 of 26 passed the mechanical validation

## Why 25 of 26 passing was not enough

Two faults survive any rule expressible as a regex, and both were in the
system prompt as explicit constraints.

**Keyword stuffing.** The technical SEO h2 came back as "Our technical
SEO consultant covers hreflang and hreflang tags". The homepage h2
crammed three variants into one sentence: "your international SEO
consultant and global SEO partner, with international SEO services that
cover localisation, paid search and content per market". The brief asked
for secondary terms to appear "naturally" and that did not prevent it.

**Negative endings.** Three h1s closed on "whose other languages do not"
or "not just exist in a language". Negative framing had been banned by
the owner hours earlier and was in the prompt. A model optimising for
keyword coverage trades that constraint away.

So the h1 **shape** was adopted, keyword plus a qualifying phrase, which
is a real improvement on the bare keywords the previous rule produced,
and the h2s are ours. The language pages took GLM's market lists close to
verbatim, which were good.

**One rejection was our bug, not GLM's.** The validator flagged
`/services/multilingual-content` for an ampersand, which was a `&#x27;`
entity picked up from scraping built HTML. Its copy was fine.

## The comparison

Shipped headings are read from the built output in `out/`, so these are
what the pages actually serve.

### `/` : rewritten

- **Before:** International SEO agency
  - h2: Your English pages sell. Multilingual SEO makes your other languages sell too.
- **GLM 5.2:** International SEO agency for sites whose English pages sell but whose other languages do not
  - h2: We work as your international SEO consultant and global SEO partner, with international SEO services that cover localisation, paid search and content per market.
  - its reasoning: *Turns the bare keyword into a buyer proposition and works three secondary terms into the H2.*
- **Shipped:** International SEO agency for every market you sell in
  - h2: Your English pages sell. Multilingual SEO makes your other languages sell too.

### `/contact` : unchanged

- **Before:** Contact a multilingual SEO agency
  - h2: Tell us which language you want selling next, and a short brief gets a straight answer within a working day.
- **GLM 5.2:** Contact a multilingual SEO agency
  - h2: Tell us which language you want selling next, and a short brief gets a straight answer within a working day.
  - its reasoning: *unchanged*
- **Shipped:** Contact a multilingual SEO agency in Valencia
  - h2: Tell us which language you want selling next, and a short brief gets a straight answer within a working day.

### `/contact/problem` : adopted

- **Before:** The message did not send
  - h2: Tell us which language you want selling next.
- **GLM 5.2:** The message did not send
  - h2: Tell us which language you want selling next.
  - its reasoning: *unchanged*
- **Shipped:** The message did not send
  - h2: Tell us which language you want selling next.

### `/contact/thanks` : adopted

- **Before:** Your message is in
  - h2: Tell us which language you want selling next.
- **GLM 5.2:** Your message is in
  - h2: Tell us which language you want selling next.
  - its reasoning: *unchanged*
- **Shipped:** Your message is in
  - h2: Tell us which language you want selling next.

### `/how-i-work` : unchanged

- **Before:** How the engagement runs
  - h2: What a multilingual SEO engagement covers month to month, how it is billed, and which costs are passed through at cost.
- **GLM 5.2:** How the engagement runs
  - h2: What a multilingual SEO engagement covers month to month, how it is billed, and which costs are passed through at cost.
  - its reasoning: *unchanged*
- **Shipped:** How a multilingual SEO engagement runs
  - h2: What a multilingual SEO engagement covers month to month, how it is billed, and which costs are passed through at cost.

### `/results` : adopted

- **Before:** Client results and numbers
  - h2: What changed on real engagements, with the figures attached and the markets they came from named.
- **GLM 5.2:** Client results and numbers
  - h2: What changed on real engagements, with the figures attached and the markets they came from named.
  - its reasoning: *unchanged*
- **Shipped:** Client results and numbers
  - h2: What changed on real engagements, with the figures attached and the markets they came from named.

### `/services` : rewritten

- **Before:** Global SEO services
  - h2: Ongoing search across several markets is the main engagement, with localisation, paid search and AI consulting around it.
- **GLM 5.2:** Global SEO services for companies selling across several markets
  - h2: As a global SEO company, we run ongoing search across several markets, with localisation, paid search and AI consulting around it.
  - its reasoning: *H1 is no longer a bare keyword and the H2 carries the global SEO company secondary keyword.*
- **Shipped:** Global SEO services for companies selling across markets
  - h2: Ongoing search across several markets is the main engagement, with localization, paid search and AI consulting around it.

### `/services/ai-consulting` : adopted

- **Before:** AI consulting services
  - h2: Where machine output helps across languages, and where it quietly costs the trust a page was built to earn.
- **GLM 5.2:** AI consulting services for multilingual search and content
  - h2: Our AI strategy consulting and generative AI consulting show where machine output helps across languages, and where it quietly costs the trust a page was built to earn.
  - its reasoning: *H1 is no longer a bare keyword and both secondary terms sit naturally in the H2.*
- **Shipped:** AI consulting services for multilingual search and content
  - h2: Where machine output helps across languages, and where it quietly costs the trust a page was built to earn.

### `/services/ai-translation-and-post-editing` : unchanged

- **Before:** AI translation and post-editing
  - h2: Machine output worked over by a native speaker, because text that reads fluently and is wrong is worse than text that warns you.
- **GLM 5.2:** AI translation and post-editing
  - h2: Machine output worked over by a native speaker, because text that reads fluently and is wrong is worse than text that warns you.
  - its reasoning: *unchanged*
- **Shipped:** AI translation services and post-editing
  - h2: Machine output worked over by a native speaker, because text that reads fluently and is wrong is worse than text that warns you.

### `/services/app-and-software-localisation` : unchanged

- **Before:** App and software localisation services
  - h2: Internationalised before launch rather than retrofitted after it, which is where the cost of this work is decided.
- **GLM 5.2:** App and software localisation services
  - h2: Internationalised before launch rather than retrofitted after it, which is where the cost of this work is decided.
  - its reasoning: *unchanged*
- **Shipped:** App and software localization services
  - h2: Internationalised before launch rather than retrofitted after it, which is where the cost of this work is decided.

### `/services/conversion-tracking` : rewritten

- **Before:** Conversion tracking per market
  - h2: Measurement that shows which language earns the enquiry, rather than one blended figure for the whole site.
- **GLM 5.2:** Conversion tracking per market, so each language is measured separately
  - h2: We set up Google Ads conversion tracking and offline conversion tracking per market, so you see which language earns the enquiry rather than one blended figure for the whole site.
  - its reasoning: *H1 becomes a benefit-led proposition and both secondary keywords appear contiguously in the H2.*
- **Shipped:** Conversion tracking measured per market
  - h2: Measurement that shows which language earns the enquiry, rather than one blended figure for the whole site.

### `/services/dutch-seo` : adopted

- **Before:** Dutch SEO agency
  - h2: Search in Dutch for the Netherlands and Flanders, two markets that read the same language differently.
- **GLM 5.2:** Dutch SEO agency for the Netherlands and Flanders
  - h2: Search in Dutch for the Netherlands and Flanders, two markets that read the same language differently.
  - its reasoning: *H1 is no longer a bare keyword; the H2 was already optimal with no secondary keywords to carry.*
- **Shipped:** Dutch SEO agency for the Netherlands and Flanders
  - h2: Two markets that read the same language differently, and a trade buyer in each who wants specifics early.

### `/services/french-seo` : adopted

- **Before:** French SEO agency
  - h2: Search in French for France, Belgium and Switzerland, written natively rather than translated from the English.
- **GLM 5.2:** French SEO agency for France, Belgium and Switzerland
  - h2: Our French SEO services cover France, Belgium and Switzerland, written natively rather than translated from the English.
  - its reasoning: *H1 becomes a geographic proposition and the H2 carries the French SEO services secondary keyword.*
- **Shipped:** French SEO agency for France, Belgium and Switzerland
  - h2: Written natively per market rather than translated from the English, because a French buyer researches before enquiring.

### `/services/generative-engine-optimization` : rewritten

- **Before:** Generative engine optimisation services
  - h2: Structured for ChatGPT, Perplexity and Google&#x27;s AI Overviews to cite you, not only for Google to rank you.
- **GLM 5.2:** Generative engine optimization services for AI search and answer engines
  - h2: As a generative engine optimization agency, we structure content for ChatGPT, Perplexity and Google's AI Overviews to cite you, not only for Google to rank you.
  - its reasoning: *Keeps the US-spelled keyword intact, adds a proposition frame, and works the agency secondary keyword into the H2.*
- **Shipped:** Generative engine optimization services for AI search
  - h2: Structured for ChatGPT, Perplexity and Google's AI Overviews to cite you, not only for Google to rank you.

### `/services/german-seo` : adopted

- **Before:** German SEO agency
  - h2: Search in German for Germany, Austria and Switzerland, written natively for buyers who research before they enquire.
- **GLM 5.2:** German SEO agency for Germany, Austria and Switzerland
  - h2: Our German SEO services cover Germany, Austria and Switzerland, written natively for buyers who research before they enquire.
  - its reasoning: *H1 becomes a geographic proposition and the H2 carries the German SEO services secondary keyword.*
- **Shipped:** German SEO agency for Germany, Austria and Switzerland
  - h2: Written natively for a market that reads the detail, compares carefully and enquires once it is satisfied.

### `/services/italian-seo` : rewritten

- **Before:** Italian SEO agency
  - h2: Search in Italian for a market where the commercial terms are far less contested than the English equivalents.
- **GLM 5.2:** Italian SEO agency for a market less contested than the English one
  - h2: As an Italian SEO company, we provide Italian SEO services for a market where the commercial terms are far less contested than the English equivalents.
  - its reasoning: *H1 becomes a competitive-position proposition and both secondary keywords sit in the H2.*
- **Shipped:** Italian SEO agency for an uncontested market
  - h2: Commercial terms in Italian are far less fought over than the English equivalents, which makes entry cheap.

### `/services/lead-generation` : rewritten

- **Before:** Multilingual lead generation services
  - h2: Traffic in several languages and enquiries in one is the pattern we are called about most, and it is rarely a traffic problem.
- **GLM 5.2:** Multilingual lead generation services for B2B sites selling across language borders
  - h2: As a B2B lead generation agency, we see traffic in several languages and enquiries in one as the pattern we are called about most, and it is rarely a traffic problem.
  - its reasoning: *H1 becomes a proposition aimed at the B2B cross-border buyer and both secondary keywords appear in the H2.*
- **Shipped:** Multilingual lead generation services for B2B sites
  - h2: Traffic in several languages and enquiries in one is the pattern we are called about most, and it is rarely a traffic problem.

### `/services/local-seo` : rewritten

- **Before:** Local SEO services
  - h2: Google Business Profile, citations and neighbourhood pages, in cities that search in more than one language.
- **GLM 5.2:** Local SEO services for cities that search in more than one language
  - h2: Our local SEO marketing services and local business SEO services cover Google Business Profile, citations and neighbourhood pages in cities that search in more than one language.
  - its reasoning: *H1 is no longer a bare keyword and two of three secondary keywords appear contiguously in the H2.*
- **Shipped:** Local SEO services for multilingual cities
  - h2: Google Business Profile, citations and neighbourhood pages, in places where the search happens in more than one language.

### `/services/multilingual-content` : unchanged

- **Before:** Multilingual content services
  - h2: Written in the target language against that market&#x27;s own research, rather than translated from a page optimised for a different one.
- **GLM 5.2:** Multilingual content services
  - h2: Written in the target language against that market&#x27;s own research, rather than translated from a page optimised for a different one.
  - its reasoning: *unchanged*
- **Shipped:** Multilingual content services written per market
  - h2: Written in the target language against that market's own research, rather than translated from a page optimized for a different one.

### `/services/multilingual-sem` : unchanged

- **Before:** Multilingual SEM services
  - h2: Paid search per market, with media budget going straight to Google, Microsoft or Meta and no markup on spend.
- **GLM 5.2:** Multilingual SEM services
  - h2: Paid search per market, with media budget going straight to Google, Microsoft or Meta and no markup on spend.
  - its reasoning: *unchanged*
- **Shipped:** Multilingual SEM services per market
  - h2: Media budget goes straight to Google, Microsoft or Meta, so there is no markup on spend and no reason to recommend a bigger one.

### `/services/multilingual-seo` : rewritten

- **Before:** Multilingual SEO agency
  - h2: Search across several markets at once, for companies whose English pages already sell and whose other languages do not.
- **GLM 5.2:** Multilingual SEO agency for companies whose other languages do not sell
  - h2: We provide multilingual SEO services and act as your international SEO specialist, running search across several markets at once for companies whose English pages already sell and whose other languages do not.
  - its reasoning: *H1 is no longer a bare keyword and both secondary keywords appear in the H2 while echoing the H1 proposition.*
- **Shipped:** Multilingual SEO agency for companies already selling abroad
  - h2: Search run across several markets at once, so the languages you already publish in start producing enquiries too.

### `/services/portuguese-seo` : adopted

- **Before:** Portuguese SEO agency
  - h2: Search in Portuguese for Portugal and Brazil, which are two markets rather than one language.
- **GLM 5.2:** Portuguese SEO agency for Portugal and Brazil
  - h2: Our Portuguese SEO services cover Portugal and Brazil, which are two markets rather than one language.
  - its reasoning: *H1 becomes a geographic proposition and the H2 carries the Portuguese SEO services secondary keyword.*
- **Shipped:** Portuguese SEO agency for Portugal and Brazil
  - h2: Two markets rather than one language, with different search behaviour and different competition in each.

### `/services/spanish-seo` : adopted

- **Before:** Spanish SEO agency
  - h2: Search in Spanish for Spain and Latin America, written from Valencia and adapted per country rather than once.
- **GLM 5.2:** Spanish SEO agency for Spain and Latin America
  - h2: Our Spanish SEO services cover SEO in Spanish for Spain and Latin America, written from Valencia and adapted per country rather than once.
  - its reasoning: *H1 becomes a geographic proposition and the H2 carries two secondary keywords naturally.*
- **Shipped:** Spanish SEO agency for Spain and Latin America
  - h2: Run from Valencia and adapted per country, because what convinces a buyer in Madrid reads as foreign in Bogota.

### `/services/technical-seo` : adopted

- **Before:** Technical SEO services
  - h2: The work that stops your language versions competing with each other for the same buyers.
- **GLM 5.2:** Technical SEO services for multilingual websites
  - h2: Our technical SEO consultant covers hreflang and hreflang tags, stopping your language versions from competing with each other for the same buyers.
  - its reasoning: *H1 is no longer a bare keyword and all three secondary keywords appear contiguously in the H2.*
- **Shipped:** Technical SEO services for multilingual websites
  - h2: The work that stops your language versions competing with each other for the same buyers.

### `/services/translation-services` : rewritten

- **Before:** Multilingual translation services
  - h2: Sorted by document type, because the risk changes completely from a proposal to a court filing, and so does who should do the work.
- **GLM 5.2:** Multilingual translation services by document type and risk level
  - h2: We offer certified translation services, document translation services, legal translation services and medical translation services, sorted by type because the risk changes from a proposal to a court filing.
  - its reasoning: *H1 becomes a proposition framed around risk and all four secondary keywords appear contiguously in the H2.*
- **Shipped:** Multilingual translation services sorted by document type
  - h2: The risk changes completely from a proposal to a court filing, and so does who should be doing the work.

### `/services/website-localisation` : rewritten

- **Before:** Website localisation services
  - h2: Making a site work in a market rather than merely readable in a language, from the copy to the checkout.
- **GLM 5.2:** Website localization services for sites that need to perform in a market, not just exist in a language
  - h2: Our website localisation services make a site work in a market rather than merely readable in a language, from the copy to the checkout.
  - its reasoning: *Keeps the US-spelled primary keyword intact in the H1, frames a proposition, and carries the UK-spelled secondary keyword in the H2.*
- **Shipped:** Website localization services that make a site sell in its market
  - h2: From the copy to the checkout: currency, payment methods, shipping rules and a layout that survives a third more text.

---

A rendered comparison of the same data is published as an artifact.
