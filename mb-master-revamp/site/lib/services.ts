/**
 * The consolidated services, per CONTENT-ARCHITECTURE.md section 3.
 *
 * Structure is taken from the harvested source in content/en/services/, not
 * invented: the five clusters, what each pillar absorbs, and the section
 * shape of the pages that have already been refreshed. Ledes are rewritten
 * rather than imported, because the live excerpts carry vocabulary the
 * project's own copy rules forbid ("tailored", "comprehensive").
 *
 * `gsc` figures are real, from the Search Console project 6973217 over the
 * 90 days to 17 August 2026. Only pages that actually earn impressions
 * carry one; the rest are honestly blank rather than padded with a zero
 * that would read as measured. Same rule for `demand`: a page with no
 * verified Ahrefs pull simply has no `demand` field, rather than a
 * guessed number standing in for one.
 *
 * Read the 90-day window as a floor rather than as the size of a page.
 * Pulled again over 450 days to 17 September 2026, the same pages rank in
 * a different order and at roughly seven times the volume: spanish-seo
 * 23,321, french-seo 21,421, german-seo 11,993, italian-seo 5,865,
 * multilingual-seo 4,084, portuguese-seo 3,083, dutch-seo 2,681. The
 * legacy /services/global-seo-solutions/ took 51,064 on its own, more
 * than any page that replaced it, which is the strongest argument in this
 * file for the redirect being right. Prioritising off the 90-day numbers
 * put spanish-seo behind three smaller pages.
 *
 * Owner correction, 6 Sep: local-seo was originally folded into
 * technical-seo's "Supporting" catch-all, which was a category error --
 * local/off-site visibility (Google Business Profile, citations, the map
 * pack) has nothing to do with technical-seo's actual subject (crawlability,
 * indexation, hreflang plumbing). Pulled back out into its own page, in the
 * Search cluster alongside the language pages, since it is the same kind of
 * page: one distinct, ownable query network. GEO/AEO added the same day as
 * a new AI-cluster pillar, at the owner's explicit request for it as a core
 * service rather than a blog topic with no page of its own.
 */

export type Service = {
  slug: string;
  /** Heading and label form: "International SEO", "Website localization". */
  name: string;
  /**
   * Mid-sentence form of `name`, for headings that drop it inside a
   * sentence ("How the international SEO engagement runs"). Written out
   * per service rather than derived, because `name.toLowerCase()` turns
   * SEO into seo, AI into ai and French into french, which shipped a
   * grammatical error into an h2 on all nineteen service pages. Only
   * headings need to be grammatical; an eyebrow may carry a keyword-shaped
   * approximation instead.
   */
  inline: string;
  /**
   * What the three templated section headings say, when `inline` would
   * say something the keyword map does not back.
   *
   * `inline` is the label's mid-sentence form, and on most pages that is
   * also the term the page is trying to win. On four it is not, because
   * the label and the demand diverged: the SEM page targets PPC, the
   * AI translation page targets machine translation post-editing. Leaving
   * `inline` in those headings meant three h2s per page quietly arguing
   * with the h1 above them.
   *
   * Defaults to `inline`, and is deliberately not set on the pages whose
   * primary differs only by a trailing "services" or "agency". "How the
   * local SEO services engagement runs" is worse English than the
   * sentence it replaces, and the h1 already carries the word.
   */
  headingTerm?: string;
  /**
   * The page's `h1`: three to five words, carrying the term the page is
   * trying to win (owner rule, 21 Sep 2026, stated as a hard rule).
   * Separate from `name`, which stays the label the nav, footer and cards
   * use: a label wants to be short and a heading wants the keyword, and
   * making one serve both is how "AI consulting" ended up as a two-word
   * h1 on a page targeting "AI consulting services".
   */
  h1: string;
  /**
   * The `h2` sitting directly under the `h1`, set smaller. Longer, and it
   * echoes the h1 rather than changing the subject, so the short keyword
   * heading gets the qualifying detail and the secondary terms a
   * three-word h1 has no room for. Same owner rule.
   */
  subhead: string;
  cluster: string;
  /** Pillars own a query network; the rest support one. */
  pillar?: boolean;
  angle: string;
  lede: string;
  /**
   * SERP-facing title and description, written for the search snippet
   * rather than reused from `lede` (which is on-page display copy, sized
   * and worded for the hero, not a 140-160 character SERP hook). Optional
   * fallbacks (name + generic phrasing) exist in generateMetadata for any
   * service without one, but every service below carries its own.
   */
  metaTitle?: string;
  metaDescription?: string;
  /** Section headings, from the refreshed source pages where they exist. */
  sections: string[];
  /**
   * Real on-page prose: 2 to 4 sections, each a heading plus one to three
   * paragraphs, adapted from the harvested legacy pages this service
   * absorbs (see `absorbs`) rather than copied verbatim, for the same
   * vocabulary reason as `lede`. Distinct from `sections`, which stays a
   * bare numbered list of engagement steps. Not every service has legacy
   * coverage: local-seo and generative-engine-optimization were added as
   * new pillars with no matching harvested page, so their `body` is
   * written fresh rather than adapted.
   */
  body?: { heading: string; paragraphs: string[] }[];
  /**
   * Collapsible detail, for an absorbed article's substance. Keeps the depth
   * a consolidated page needs without the scroll, and keeps the absorbed
   * material indexable, since a closed <details> is still in the HTML.
   */
  expandables?: { q: string; a: string[] }[];
  /**
   * Heading and opening line above `expandables`. Both were hardcoded for
   * generative-engine-optimization, the first page to use the block, which
   * meant any second page inherited "Nine shifts, folded in from the article
   * this page absorbed" whether or not it had nine of anything. Per service
   * now, with a count-driven fallback, since what the block holds differs by
   * page: the GEO one is a set of shifts, the language ones are the
   * market-specific questions a buyer asks before they enquire.
   */
  expandablesHeading?: string;
  expandablesLede?: string;
  /** Legacy slugs this page absorbs, each 301ing in the same locale. */
  absorbs?: string[];
  gsc?: { impressions: number; position: number; keywords: number };
  /**
   * Worldwide demand for the market's core terms, measured in Ahrefs on
   * 20 August 2026. Sums the "<language> seo", "seo <country>" and
   * "<language> seo agency" variants, which is how the demand actually
   * splits: no single head term carries the market.
   */
  demand?: { volume: number; kd: string; note: string };
  /** Flags a page whose source copy has not had the refresh its siblings got. */
  needsRefresh?: string;
};

/**
 * What every service page covers, after its own opening item.
 *
 * Five rather than four, which is the owner's ask on 22 Sep 2026 and also
 * fixes a layout fault: the list renders as a two-column grid, so one
 * service-specific item plus four shared ones came to five and left an
 * empty cell showing the grid's own rule colour as a grey box. Six fills
 * the rows.
 *
 * The old four asked the same question twice. "What we include in the
 * engagement" and "What is included, what is not" are one item, and
 * "Our process in five steps, named deliverables" counted its own steps
 * in a heading, which tells a reader about our document rather than about
 * the work. Each line now answers a question a buyer actually has before
 * signing, in the order they ask them.
 *
 * Every line has to be true on all nineteen pages, which is why billing
 * is not among them: the no-markup position is real but lives on three
 * pages, not nineteen.
 */
const ENGAGEMENT = [
  "What the engagement covers",
  "How the work runs, month to month",
  "What lands, and when",
  "Where our work stops",
  "Questions we get asked first",
];

export const SERVICES: Service[] = [
  // ---- Cluster 1: multilingual lead generation, the product ----
  {
    slug: "lead-generation",
    name: "Multilingual lead generation",
    inline: "multilingual lead generation",
    h1: "B2B lead generation services for companies selling abroad",
    subhead: "Your other markets already send you visitors. We turn them into enquiries worth a sales call, and show which market each one came from.",
    cluster: "Lead generation",
    pillar: true,
    angle: "Enquiries, not visits",
    lede: "Traffic arrives in French, German and Spanish, and the enquiries still arrive in English. One client's Search Console showed forty thousand impressions in ninety days, and six clicks. The buyers were looking, and nothing was turning the looking into a conversation.",
    metaTitle: "B2B lead generation services across every market",
    metaDescription: "Your other markets send visitors and few enquiries. We turn them into leads worth a sales call, counted per market, with no markup on your ad spend.",
    sections: ["What a blended report costs you", "What we do in each market", "How it is billed", "The evidence", ...ENGAGEMENT.slice(3)],
    // No `body` or `expandables` here on purpose: lead-generation has its own
    // hand-built route at app/services/lead-generation/page.tsx rather than
    // rendering through services/[slug]. Its prose and its questions live in
    // that route. The route does read h1, subhead, lede and the meta fields
    // from here, so the page and the services index cannot drift apart: until
    // 23 Sep 2026 the route hardcoded its own h1, and the site carried two
    // different h1s for one page.
  },
  {
    slug: "multilingual-sem",
    name: "Multilingual SEM",
    inline: "multilingual SEM",
    headingTerm: "international PPC",
    h1: "International PPC agency running paid search per market",
    subhead: "Media budget goes straight to Google, Microsoft or Meta, so there is no markup on spend and no reason to recommend a bigger one.",
    cluster: "Lead generation",
    angle: "International PPC, buying what search has not earned",
    lede: "Reaching the buyer who has not found you organically yet, in the language they searched in, without letting a single blended campaign quietly subsidise one market from another.",
    metaTitle: "International PPC agency, paid search per market",
    metaDescription: "Paid search that reaches buyers in the language they searched in, market by market, so one blended campaign never quietly subsidises another.",
    sections: ["Three patterns that drain ad budgets", ...ENGAGEMENT],
    body: [
      {
        heading: "Where translated campaigns quietly cost more",
        paragraphs: [
          "A campaign translated from one master list keeps the original keywords, ad copy structure and bidding approach, and it shows in the results: a lower quality score because the terms are not how people actually search in that language, ad copy that reads stilted, landing pages that feel imported. Native research per market beats a translated campaign in effectively every comparison we have run.",
          "Keywords picked straight from a planning tool without checking real intent produce high impressions, low click-through and clicks that never convert. Real keyword research means checking the actual search results in the target market and validating terms with native speakers before any bid goes live.",
          "Blended conversion tracking that mixes every market into one number hides which language is profitable and which is bleeding spend. Each market needs its own tracking, attribution and KPI report, or optimization is guesswork with extra steps.",
        ],
      },
      {
        heading: "Native per market, never translated from one list",
        paragraphs: [
          "Google Ads carries the default budget. Bing Ads earns its place with a US B2B audience still on the Microsoft ecosystem. Meta covers B2C reach, LinkedIn covers B2B targeting in specific verticals. Distinct campaigns or ad groups run per market, with separate budgets and bidding strategies, never one translated master campaign split by geography.",
          "Headlines, descriptions and creative are written natively per language rather than translated from a source campaign. Landing pages are dedicated per market wherever the budget allows, and conversion tracking runs through GA4 and GTM with CRM sync so a lead is qualified past the click, not just counted at it.",
        ],
      },
      {
        heading: "What changed once native research replaced a translated set",
        paragraphs: [
          "On a Houston freight forwarder's account, separate campaigns by language and transport mode with native LatAm keyword research replacing an initial translated list brought the Spanish campaign's cost per lead in 30 to 40 percent below the English one. Combined with organic search, the daily quote pipeline doubled across eighteen months.",
          "On a Valencia law firm's account, tightly targeted search campaigns on commercial-intent queries, run through separate accounts per language to keep quality score clean, produced a steady flow of qualified leads in three languages at a cost per lead the firm's average case value could absorb.",
        ],
      },
    ],
    expandablesHeading: "How the paid side is structured and paid for",
    expandablesLede:
      "Account architecture, sequencing against organic, and who runs which language.",
    expandables: [
      {
        q: "Separate accounts per market, because quality score does not travel",
        a: [
          "Google scores relevance per account and per campaign, and a market with a weak history drags on one that would otherwise be fine. Splitting by language, and by country domain where you run several, keeps each market's score earned by its own performance.",
          "It also makes the reporting honest. One blended account can look profitable while a single language inside it quietly burns the budget the others earned.",
        ],
      },
      {
        q: "Paid first, organic first, or both",
        a: [
          "Paid first when you need pipeline now, when the offer is new enough that you want a demand signal before committing to content, or when organic will take the better part of a year to mature in that market. Organic first when clicks in your sector are expensive enough that paid cannot sustain itself, or when your buyers research for months before they contact anyone.",
          "Both together is the common answer: paid takes the commercial-intent queries while organic builds, and the paid budget moves to less contested markets or non-brand terms as organic starts carrying them. The two share one keyword universe and, where it makes sense, one set of landing pages, so they inform each other instead of bidding against each other.",
        ],
      },
      {
        q: "Who runs which language",
        a: [
          "French, English, Spanish and Dutch run directly here, which means the keyword research, the ad copy and the search-term reports are read in the language rather than through a translation. German, Italian, Portuguese and the rest go to native speakers on the BeTranslated team, briefed and reviewed the same way the organic content is.",
          "Search terms are where it matters most. A negative keyword list is built by reading what people actually typed, and that only works if somebody can tell an irrelevant query from a promising one in that language.",
        ],
      },
      {
        q: "How the billing is structured",
        a: [
          "The media budget goes directly to Google, Microsoft or Meta rather than through us, so there is no markup on spend and no reason for the recommendation to be a larger budget.",
          "Management is charged separately from it. The point of separating them is that the incentive tracks whether the campaigns work rather than how much they cost to run.",
        ],
      },
    ],
  },
  {
    slug: "conversion-tracking",
    name: "Conversion tracking",
    inline: "conversion tracking",
    h1: "Conversion tracking measured per market",
    subhead: "Measurement that shows which language earns the enquiry, rather than one blended figure for the whole site.",
    cluster: "Lead generation",
    angle: "The evidence layer, per locale",
    lede: "You can see which markets bring traffic. Whether the French visitors ever turn into customers is a different question, and one merged report will never answer it.",
    metaTitle: "Conversion tracking services per locale",
    metaDescription: "Traffic per market is easy to see. Which language earns the enquiries is not, until conversion tracking is set up per locale, with consent mode and CRM data accounted for.",
    sections: ["Why a single blended number hides the problem", ...ENGAGEMENT],
    body: [
      {
        heading: "What one merged report cannot tell you",
        paragraphs: [
          "A single analytics view covering every locale answers the wrong question. It reports how the whole site performed, not which language earned the enquiry, so a market that converts well and one that only pulls traffic look identical until someone splits them apart by hand.",
          "Per-locale tracking needs distinct goals, events and conversion definitions set up from the start, not bolted on once someone asks why the French pages are not converting. A form submission, a call click and a quote request each need to be tracked the same way in every language, or the numbers stop being comparable.",
        ],
      },
      {
        heading: "What actually gets set up, per locale",
        paragraphs: [
          "GA4 and Google Tag Manager configured per locale, with key events (form submissions, downloads, calls, cart actions for stores) defined once and applied consistently across languages. Google Ads conversion tracking is wired to the same event definitions, so the campaign report and the analytics report stop disagreeing about the same enquiry.",
          "Where sales pass through a CRM, offline conversion tracking sends the closed outcome back to GA4 and Google Ads, so a lead is measured through to a qualified result rather than counted at the click. Bidding then runs on what a market is worth instead of on how many forms it filled in.",
          "Reporting is reviewed on a fixed cadence, typically monthly, with a clear owner for the numbers rather than a dashboard nobody opens. A market that stops converting shows up in the data before it shows up in the sales pipeline three months later.",
        ],
      },
    ],
    expandablesHeading: "Why the numbers disagree with the sales team",
    expandablesLede:
      "The four reasons a multilingual site reports conversions it did not get, or misses ones it did.",
    expandables: [
      {
        q: "Consent mode changes what you can measure, and it changes per market",
        a: [
          "In the EU a visitor who declines cookies is still a visitor, and what reaches your analytics from them depends on how consent mode is configured rather than on whether they converted. Decline rates differ sharply by country, so two markets with identical real performance can report very differently.",
          "Which means a comparison between markets is only honest once you know each one's consent rate. Otherwise you are ranking your languages by how willing their visitors are to accept cookies.",
        ],
      },
      {
        q: "A conversion has to be the thing you actually want",
        a: [
          "Counting form submissions counts the spam, the test entries and the person who wanted a job. Counting them all as wins makes a market look healthy while the sales team sees nothing arrive.",
          "The definition worth using is the one your own people recognise: an enquiry that became a conversation. Everything above it is a step to watch, not a result to report.",
        ],
      },
      {
        q: "Attribution across languages is where the double counting starts",
        a: [
          "A visitor who lands on the English page, switches to French and converts belongs to one market, and which one depends on rules somebody has to choose rather than on a default. Left alone, a switcher is often counted twice or credited to the wrong language entirely.",
          "Getting it wrong quietly inflates whichever language sits at the top of the funnel and starves the one doing the work.",
        ],
      },
      {
        q: "The CRM is where a lead stops being a number",
        a: [
          "Syncing conversion data through to the CRM is what lets a market be judged on the quality of what it sent rather than the quantity. A language producing fewer and better enquiries is winning, and on a click-level report it looks like it is losing.",
          "It is also the only way to find the market where everything converts and nothing closes, which is a positioning problem wearing an analytics costume.",
        ],
      },
    ],
  },

  // ---- Cluster 2: multilingual search, the engine ----
  {
    slug: "multilingual-seo",
    name: "International SEO",
    inline: "international SEO",
    headingTerm: "multilingual SEO",
    h1: "Multilingual SEO agency for companies already selling abroad",
    subhead: "Search run across several markets at once, so the languages you already publish in start producing enquiries too.",
    cluster: "Search",
    pillar: true,
    angle: "The engine underneath the outcome",
    lede: "You already sell abroad, and the markets outside English are not pulling their weight. We run the strategy and brief native writers per market, so each language earns enquiries rather than only traffic.",
    metaTitle: "International SEO agency and consulting",
    metaDescription: "Already selling abroad while the non-English markets underperform? See how each language gets its own strategy, its own native writing, and a number of its own.",
    sections: [
      "Where most international SEO projects fail",
      "What we include in an international SEO engagement",
      "Our process in five steps, named deliverables",
      "Case studies",
      "What is included, what is not",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "Three failure patterns we see in every audit",
        paragraphs: [
          "A DeepL pass with a light human review is not localization, it is patched-up machine translation. Search engines detect it, AI engines tend to avoid citing it, and native readers leave within seconds. The economics are tempting, the outcome is consistently flat. Native writing per language is the only foundation that holds.",
          "Hreflang tags go missing, point in circles, carry the wrong language code, or are simply absent from the homepage. The visitor in the wrong country sees the wrong language version, conversions drop, and Search Console reports a maze that takes longer to untangle than to have built correctly the first time.",
          "One writer publishes in French, another adds Spanish six months later without agreeing on slugs, internal links, schema or keyword targets. By month twelve the multilingual structure is a tangle nobody can audit properly. Governance per language, decided before the first page goes live, is what keeps the site growing clean instead of patched.",
        ],
      },
      {
        heading: "What actually goes into the engagement",
        paragraphs: [
          "A global SEO programme starts with native research in each target language, covering real commercial intent and long-tail phrasing per market, never a set translated from English. Subdirectory, subdomain or ccTLD gets a reasoned recommendation rather than a default, with hreflang, sitemaps and Search Console geo-targeting configured per language from the start.",
          "An international SEO specialist earns the fee on the decisions that are expensive to undo later: the domain structure, the hreflang map and the order the markets go in. Writing runs fluent and direct for French, English, Spanish and Dutch, and through native copywriters from the BeTranslated network for German, Italian, Portuguese and other languages. LocalBusiness, Service, Article and FAQ schema is built per language and validated on Google's Rich Results tool, and the same work extends to how ChatGPT, Claude, Perplexity and AI Overviews answer in each language.",
        ],
      },
      {
        heading: "Three cases where the multilingual scope was the whole challenge",
        paragraphs: [
          "BeTranslated, the translation agency we co-founded, runs twelve country-specific domains with WPML across all of them, cross-domain hreflang, native content per market from the in-house translator team and schema localized per country. The result has been consistent organic ranking across several European markets and AI citations in each target language for translation services queries.",
          "A Houston freight forwarder targeting English-speaking US shippers and Spanish-speaking Latin American clients runs WordPress and WPML on a single domain with a Spanish subdirectory, distinct keyword research per language and FreightForwarder schema in both. Daily quote requests doubled over eighteen months across both languages.",
          "A Valencia law firm targeting Spanish, French and English-speaking clients runs WPML across all three, with LegalService schema localized per language and attorney bios adapted to each audience. It now gets recurring leads from three markets on commercial-intent queries such as business law and franchise contracts, in their own languages.",
        ],
      },
    ],
    expandablesHeading: "How a multi-market programme gets sequenced",
    expandablesLede:
      "How a programme across several markets gets ordered, from the first market in to the last.",
    expandables: [
      {
        q: "Nine languages at launch is how you get nine pages that rank nowhere",
        a: [
          "The brief that arrives most often asks for English, French, Spanish, German, Italian, Portuguese, Dutch, Japanese and Chinese from day one. What it produces is nine thin versions, several of them machine-translated, none with the depth to rank anywhere. Four markets done properly beats nine done badly, every time we have compared them.",
          "Expansion runs in waves instead: a first wave of three or four markets where the evidence is strongest, and a second wave that stays a test until the first shows traction. No second wave before then, which is the part that gets argued about and the part that saves the budget.",
        ],
      },
      {
        q: "How a market earns its place in the first wave",
        a: [
          "Candidate markets, usually eight to twelve at the start, get scored on five things: search volume, competitive difficulty, commercial fit with what you actually sell, the cost of localizing for them, and the regulatory load they bring with them.",
          "The output is a ranked list rather than an opinion, which matters because the market someone in the room feels strongly about is rarely the one the scoring puts first. A decision point around the half-year mark says which test markets get promoted and which get dropped.",
        ],
      },
      {
        q: "ccTLD, subdomain or subdirectory, at portfolio scale",
        a: [
          "The choice turns on budget, how much authority you can afford to split, and how much a local buyer needs to see a local domain before they trust you. A ccTLD per market is the strongest local signal and the most expensive thing to maintain. A subdirectory keeps the authority in one place and is the right default for most companies adding markets rather than founding local businesses.",
          "It is decided once, early, because moving later costs more than getting it slightly wrong at the start costs you.",
        ],
      },
      {
        q: "Localization is not translation, and the keyword proves it",
        a: [
          "A removalist in Australia is a removals company in the UK, and nobody in London searches for the first word. Translate the page and the term is correct and unsearched. The same trap runs through currency, units, legal references, payment methods, trust badges and the customer names you cite as proof.",
          "Regulatory framing changes with it: GDPR in the EU, CCPA in California, LGPD in Brazil. A page that quotes the wrong one is telling a local reader it was written for somebody else.",
        ],
      },
      {
        q: "The technical floor, below which good content cannot rank",
        a: [
          "Hreflang validated per market rather than assumed, a sitemap split by language, slugs translated rather than left in the source language, and schema localized per country. Broken or circular hreflang is the single most common finding in the audits we run, and it caps everything above it.",
          "Geo-IP belongs to soft suggestions only. Hard-redirecting a visitor by IP on an hreflang site hides the other versions from the crawler and strands anyone travelling, which is a lot of the business audience.",
        ],
      },
      {
        q: "Links and citations are earned country by country",
        a: [
          "A backlink from local press, a sector association or a regional directory in the target country is worth considerably more than a generic international link, because relevance in international search is geographic as well as topical.",
          "The same now applies to AI answers. Which sources get cited varies by country and by language, and the knowledge graphs behind them are not unified, so being the answer in one market says nothing about being the answer in the next.",
        ],
      },
    ],
    absorbs: ["global-seo-solutions", "internationalisation", "language-solutions", "multilingual-branding"],
    // 90-day window. Over 450 days to 17 Sep 2026 this page took 4,084, but
    // the number that matters is the one arriving through it: the legacy
    // /services/global-seo-solutions/ it replaces took 51,064 on its own,
    // more than any live page on the domain, and 301s here.
    gsc: { impressions: 1405, position: 55.2, keywords: 34 },
  },
  {
    slug: "french-seo",
    name: "French SEO",
    inline: "French SEO",
    h1: "French SEO agency for companies selling into France",
    subhead: "Researched and written in French rather than translated into it, so buyers in France, Belgium and Switzerland read a supplier they can trust with the enquiry.",
    cluster: "Search",
    angle: "SEO France, from the outside in",
    lede: "You have French pages, French visitors, and fewer French enquiries than the market should send you. A French buyer compares suppliers before contacting any of them, and a site that reads as translated rarely makes the shortlist.",
    metaTitle: "French SEO agency for companies selling into France",
    metaDescription: "French buyers spot a translated page within a sentence. We research and write your French site in French, so French traffic turns into enquiries.",
    // Research, 23 Sep 2026 (Ahrefs GB and worldwide, plus this page's own
    // Search Console for 24 Mar to 20 Sep 2026): the people searching for
    // French SEO in English are mostly outside France. 500 of the 700
    // monthly searches for `french seo agency` come from the UK, and the
    // page's single biggest query is the Dutch `seo frankrijk` (1,193
    // impressions), ahead of `french seo` itself (1,030). German queries
    // for an SEO agency in France show up too. So the h1 names the buyer,
    // a company selling into France, rather than listing three countries.
    sections: [
      "French keyword research, done in French, market by market",
      "An audit of the French pages you already have against what French buyers search",
      "The pages that matter most rewritten or written natively in French",
      "Setup for France: domain choice, language targeting and mobile speed",
      "A French Google Business Profile, French directory listings and French reviews",
      "Monthly reporting on French enquiries, kept apart from your other markets",
    ],
    body: [
      {
        heading: "What a translated French site costs you",
        paragraphs: [
          "A French buyer shortlists the way yours do: read a few sites, compare them, contact one or two. A page translated from English gives itself away in the first sentence, through a word nobody in France would choose, a register that is slightly off or an example that only makes sense in Britain, and the buyer moves on to a supplier who sounds local.",
          "Nothing in your reports records the moment. The French traffic keeps arriving, so the numbers look healthy, and the enquiry that went to a French competitor with a weaker product and better French never appears anywhere.",
          "France is the largest French-speaking market in Europe, so a French site that reads as foreign loses the biggest share of the audience it was built to win.",
        ],
      },
      {
        heading: "French SEO written in French, not translated into it",
        paragraphs: [
          "We research what French buyers actually type, in French and market by market. Their words are rarely a translation of yours: a British buyer searches for SEO, while a French one often types “référencement naturel” instead, and a site that only ever says SEO misses them. Research that starts from the English keyword list never finds the gap.",
          "French runs directly here, with no translator in between. The research, the page copy and the reading of what French visitors do are all handled in French by the people setting the strategy, so nothing gets lost between the plan and the page.",
          "Then the things that make a French buyer trust a supplier they have never met: a Google Business Profile in French, listings in the French directories your sector uses, reviews from French customers, and mentions in the French trade press.",
        ],
      },
      {
        heading: "Most people searching for French SEO are outside France",
        paragraphs: [
          "When we measured the demand in September 2026, 500 of the 700 monthly searches worldwide for a French SEO agency came from the UK. Search Console for this page tells the same story from other directions: its biggest query is “seo frankrijk”, in Dutch, ahead of “french seo” itself, and German-language searches for an SEO agency in France turn up too.",
          "So the typical buyer is a company outside France selling into it, and that is who this service is built for. You write the brief in English, Dutch or French, and the work is done in French.",
        ],
      },
      {
        heading: "French sites we run for ourselves and for clients",
        paragraphs: [
          "BeTranslated, the translation agency we co-founded twenty years ago, runs its French site on its own .fr domain, with keyword research done for France rather than carried over from the .com.",
          "Matosurf is our own French board sports site: a hundred and twenty guides to forty-eight French spots, written in French for French riders rather than translated for them.",
          "For Delaguía y Luzón, a Valencia law firm working across Spain and France, the French pages are held to the standard a French lawyer would apply when reading them, because in legal content a wrong term is a liability before it is a lost ranking.",
        ],
      },
    ],
    expandablesHeading: "What French SEO turns on, market by market",
    expandablesLede:
      "The parts of the job that are specific to French rather than true of any language.",
    expandables: [
      {
        q: "Which domain shape to use for France",
        a: [
          "A .fr domain reads as French to a French buyer and to Google, which is worth something on a market where local trust is most of the sale. A subdirectory under an existing domain is easier to run and inherits the authority already built, so it usually wins for a company that is adding French rather than founding a French business.",
          "On a .com or another generic domain, set the geotargeting in Search Console rather than assuming Google will infer it. And never redirect a visitor to the French version on the strength of their IP address: it strands the French speaker abroad and the English speaker in Paris, and it stops a crawler seeing the other versions at all. Offer the choice instead, and let hreflang carry the relationship.",
        ],
      },
      {
        q: "Accents, and the queries that drop them",
        a: [
          "French is written with accents and searched both ways. Plenty of people type référencement, plenty type referencement, and on a phone keyboard the unaccented form wins more often than a French brand would like to admit.",
          "Both forms belong in the research, and the page has to be reachable on either. Writing the accented form correctly in the copy and letting the unaccented query find it anyway is the target, not choosing one and losing the other half.",
        ],
      },
      {
        q: "French runs longer than English",
        a: [
          "French usually runs longer than the English it replaces. A title tag and meta description written to length in English and then translated overflow the snippet, and get cut mid-phrase in the result that was supposed to win the click.",
          "Write them natively to the French limit rather than translating to it. The same expansion shows up in navigation labels and buttons, which is a layout problem before it is a search one.",
        ],
      },
      {
        q: "One language, four markets",
        a: [
          "France, Belgium, Switzerland and Quebec share the language and not much else. Prices quoted in EUR do not read to a Swiss buyer, search habits differ, and the register that sounds right in Paris sounds imported in Montreal.",
          "Where more than one is genuinely in scope, fr-FR, fr-BE, fr-CH and fr-CA keep them apart and stop the wrong version ranking in the wrong country. Where only France is in scope, a single French version targeted at France is the honest setup, and the other markets find it anyway.",
        ],
      },
      {
        q: "Where the searching actually happens",
        a: [
          "A large share of French search happens on a phone, so a site that is fast and comfortable on desktop and merely tolerable on mobile is failing much of its own audience before a word of the copy is read.",
          "Google carries the market. Qwant exists and is French, and it is worth knowing about rather than optimizing separately for.",
        ],
      },
      {
        q: "Belgium: two languages, one buyer",
        a: [
          "A Belgian company usually needs French and Dutch side by side, and a Belgian buyer notices which of the two was written first. Treating the Dutch as a translation of the French, or the other way round, loses half the country.",
          "French and Dutch both run directly here, so a Belgian site gets one strategy in two languages rather than two agencies working from two briefs. The fr-BE and nl-BE versions stay apart from the French and Dutch sites aimed at France and the Netherlands.",
        ],
      },
      {
        q: "French SEO or French translation first",
        a: [
          "Research first, every time. A page translated well and then optimized afterwards ends up rewritten, because the French terms buyers search for were never in the brief the translator worked from.",
          "Where the translation is already done, the audit shows which pages are worth rewriting around French search and which can stay as they are. Usually it is a handful, not the whole site.",
        ],
      },
    ],
    gsc: { impressions: 3093, position: 43.7, keywords: 40 },
    demand: {
      volume: 2700,
      kd: "3 to 6",
      note: "Largest of the six language markets. Most of it is not in France: re-measured on 23 September 2026, 500 of the 700 monthly searches for `french seo agency` come from the UK, and Dutch and German searches for SEO in France add to it.",
    },
  },
  {
    slug: "german-seo",
    name: "German SEO",
    inline: "German SEO",
    h1: "German SEO agency for Germany, Austria and Switzerland",
    subhead: "Written natively for a market that reads the detail, compares carefully and enquires once it is satisfied.",
    cluster: "Search",
    angle: "SEO Germany, researched longer, decided slower",
    lede: "German buyers research further before enquiring than most markets, so the page that wins is the one that answers the question rather than the one that ranks loudest.",
    metaTitle: "German SEO agency, DACH markets",
    metaDescription: "German buyers research longer before enquiring than most markets. See the SEO approach built to answer the question, not just rank for it.",
    sections: ["Three ways to fail at German SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "The DACH region is three markets, not one",
        paragraphs: [
          "Germany, Austria and Switzerland share a language with real variation. A word used everyday in one shifts slightly in another, prices run in CHF for the Swiss market and EUR for the other two, and tax law differs by country even where the vocabulary overlaps. Hreflang de-DE, de-AT and de-CH kept distinct is what serious DACH targeting actually looks like.",
          "German carries long compound words, a formal register and dense sector jargon. A site translated from English by a service that does not know the sector reads as awkward to a native, and the trust drops immediately even when the traffic numbers look fine.",
          "A full Impressum with tax ID and register entry, GDPR-strict cookie consent with no soft opt-in, and a visible German phone number are legal requirements in Germany, not nice-to-haves. Missing any of them reads as a foreign site to a German buyer and costs conversions that never show up as a ranking problem.",
        ],
      },
      {
        heading: "Piloted here, written natively",
        paragraphs: [
          "German SEO needs two distinct skills at once: strategic piloting (architecture, keyword targets, technical setup, editorial calendar) and native execution (writing, tone, regulatory compliance). We handle the first directly and hand the second to native German copywriters from the BeTranslated network, briefed and reviewed in English or French. One German SEO expert rarely covers both halves, which is why the work is split rather than handed to a single pair of hands.",
          "Impressum compliant with the Telemediengesetz, a strict GDPR-aligned privacy policy, an opt-in cookie banner and, for stores, Trusted Shops integration where it fits. Outreach targets German regional press and trade directories such as IHK listings rather than links bought from an unrelated market.",
        ],
      },
    ],
    expandablesHeading: "The questions a German buyer asks first",
    expandablesLede:
      "What the split between piloted strategy and native writing means in practice.",
    expandables: [
      {
        q: "Who actually writes the German",
        a: [
          "Native German copywriters, briefed and reviewed by us. We read German SERPs, competitor pages and briefs, and we follow a meeting in German with effort. We do not write your German commercial copy, because the register is the sale and a near-miss register loses it.",
          "Most agencies that offer German work the same way and let you discover it later. Saying it here is the difference: you pay for strategy where the strategy is done, and for writing where the writing is done well.",
        ],
      },
      {
        q: "How the German is checked when we do not write it",
        a: [
          "The brief goes out in English or French with the keyword targets, the intent and the structure decided. A native German writer drafts it. A second native German reads it before it publishes, and your own people are the filter after that.",
          "Strategic review stays with us throughout, so a draft that reads well and answers the wrong query still gets sent back.",
        ],
      },
      {
        q: "Whether to split Germany, Austria and Switzerland",
        a: [
          "Germany carries most of the volume and is the default on its own: de-DE across the content, one architecture, no scattered variants diluting the focus. Adding de-CH on the commercial pages earns its place for premium B2B, where Swiss purchasing power and price expectations differ enough to be worth addressing directly.",
          "Full DACH is a real editorial commitment and only pays when the offer is genuinely relevant in all three. The recommendation comes at scoping from what you sell, not from a preference for the bigger setup.",
        ],
      },
      {
        q: "Swiss German is written as standard German with its own spelling",
        a: [
          "Swiss readers read standard German, so the copy does not need rewriting. The conventions do differ: Strasse rather than Straße, since Swiss German drops the ß entirely, prices in CHF, and different phone formats.",
          "Small details, and precisely the ones a Swiss buyer reads as the page having been written for somebody else.",
        ],
      },
      {
        q: "Where the compliance work stops",
        a: [
          "We set up the technical side: an Impressum carrying what the Telemediengesetz requires, a privacy policy aligned to GDPR and the Bundesdatenschutzgesetz, and consent that is an actual opt-in.",
          "Where the question is legal rather than technical, sensitive data, employee tracking, marketing profiling, that is a German lawyer's work and we say so rather than improvising it.",
        ],
      },
    ],
    gsc: { impressions: 1938, position: 57.3, keywords: 38 },
    demand: {
      volume: 2350,
      kd: "0 to 1",
      note: "Second-largest and the easiest of the six. Nearly the size of French at a fraction of the difficulty, which makes it the next page to build.",
    },
  },
  {
    slug: "spanish-seo",
    name: "Spanish SEO",
    inline: "Spanish SEO",
    h1: "Spanish SEO agency for Spain and Latin America",
    subhead: "Run from Valencia and adapted per country, because what convinces a buyer in Madrid reads as foreign in Bogota.",
    cluster: "Search",
    angle: "SEO Spain, researched here rather than abroad",
    lede: "Your Spanish pages are read in Madrid, Mexico City and Bogotá, and what convinces a buyer in one of them reads as foreign in the next. We work Spain from Valencia, and the Latin American variants through native copywriters based in the region.",
    metaTitle: "Spanish SEO agency, from Valencia",
    metaDescription: "Spanish SEO for buyers in Madrid, Mexico City and Bogotá, who do not read the same page the same way. Spain run from Valencia, Latin America by native writers.",
    sections: ["Three ways to fail at Spanish SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "Spain and Latin America are not one market",
        paragraphs: [
          "Castilian Spanish and the various Latin American variants diverge in vocabulary, address forms, currency and regulatory framework. A single Spanish site reads too formal to a Latin American visitor or too informal to a Spanish one in ways that erode trust either direction. Hreflang es-ES, es-MX, es-CO, es-AR and es-DO disambiguate per target market.",
          "A page passed through machine translation and presented as the Spanish version sounds like translated English, not native Spanish. Idioms land wrong, register feels off, and sector terminology is sometimes simply invented. Spanish readers notice immediately.",
          "Spain requires a CIF or NIF visible, EUR pricing and AEPD-approved cookie consent. Mexico expects an RFC and INAI compliance, Colombia a NIT, Argentina a CUIT, the Dominican Republic an RNC. Each market carries its own legal markers, and a site missing them looks foreign no matter how good the copy is.",
        ],
      },
      {
        heading: "Direct in Spain, native across Latin America",
        paragraphs: [
          "Research and writing for ES-ES run direct from the Valencia base. LatAm variants (es-MX, es-CO, es-AR, es-DO) are handled by native copywriters from the BeTranslated team in Santo Domingo, briefed and supervised on strategy so the variants stay coherent rather than diverging into five unrelated sites.",
          "Outreach targets El País, El Mundo and Expansión in Spain, and the regional press per country in Latin America (El Universal in Mexico, El Tiempo in Colombia, La Nación in Argentina, Listín Diario in the Dominican Republic), which counts for far more than a generic Spanish-language link from an unrelated market.",
        ],
      },
    ],
    expandablesHeading: "Which Spanish, and for which market",
    expandablesLede:
      "The decision every Spanish engagement starts with, and the compliance that follows from it.",
    expandables: [
      {
        q: "Why Castilian and Latin American Spanish stay separate",
        a: [
          "Readable across the divide, yes. Convincing across it, no. A reader in Madrid finds unified Latin American copy informal in ways they did not expect, and a reader in Mexico City or Buenos Aires finds unified Castilian distant, formal and occasionally just wrong on a specific word. Currency, legal markers and trust signals differ on top of that.",
          "Where it pays to split is commercial intent: product pages, service descriptions, pricing, anything with a form at the end. Editorial content usually survives being unified. A mixed setup, unified blog and separated commercial pages, is the common answer and often the right one.",
        ],
      },
      {
        q: "Which Latin American market to open first",
        a: [
          "Mexico on sheer volume, and it is competitive to match on consumer verticals while staying reachable on regional B2B. Colombia, Argentina and Chile are mid-sized, more accessible, and each behave differently enough to need their own research. The Dominican Republic, Costa Rica and Guatemala make sense for niche or local services rather than for scale.",
          "The question that actually decides it is where your customers already are and whether the offer fits, not which country has the most speakers.",
        ],
      },
      {
        q: "Who writes which variant",
        a: [
          "Castilian runs direct from the Valencia base: research, briefs, competitor reading, writing and meetings in Spanish without an intermediary. The Latin American variants go to native copywriters on the BeTranslated team in Santo Domingo, briefed and supervised here so the set stays coherent rather than drifting into several unrelated sites.",
          "The distinction is worth stating plainly, because covering Spanish by quietly subcontracting all of it is common and is not the same service.",
        ],
      },
      {
        q: "What LSSI-CE and the AEPD require on a Spanish site",
        a: [
          "Spain's LSSI-CE asks a transactional site to show specific commercial information: the CIF or NIF, a real address, contact details and terms. The AEPD reads cookie consent more granularly than the baseline interpretation some other countries settle for, so a banner that passes elsewhere can still be wrong here.",
          "The technical setup is included. Regulated sectors, finance, healthcare, anything touching gambling, want a Spanish lawyer on top of it rather than instead of it.",
        ],
      },
      {
        q: "Each market carries its own identifier",
        a: [
          "Spain expects a CIF or NIF, Mexico an RFC, Colombia a NIT, Argentina a CUIT, the Dominican Republic an RNC. Alongside them sit the local data protection regimes: the AEPD in Spain, INAI in Mexico, the SIC in Colombia, the AAIP in Argentina, Indotel in the Dominican Republic.",
          "Missing them does not read as an oversight to a local buyer, it reads as a foreign site, and no amount of well-written Spanish compensates for that.",
        ],
      },
    ],
    // No `gsc` field on purpose, per the rule at the top of this file: the
    // 90-day window every other figure here uses showed nothing for this
    // page, and a zero would read as measured rather than as absent. Worth
    // knowing that the 90-day window understates it badly. Over 450 days to
    // 17 Sep 2026 this page took 23,321 impressions, the most of any service
    // page on the domain, ahead of french-seo's 21,421.
    demand: {
      volume: 2100,
      kd: "0 to 7",
      note: "Third-largest, and the two biggest terms both sit at difficulty 0.",
    },
  },
  {
    slug: "dutch-seo",
    name: "Dutch SEO",
    inline: "Dutch SEO",
    h1: "Dutch SEO agency for the Netherlands and Flanders",
    subhead: "Two markets that read the same language differently, and a trade buyer in each who wants specifics early.",
    cluster: "Search",
    angle: "Small volume, decisive buyers",
    lede: "Dutch trade search is low in volume and high in intent, which rewards covering a narrow thing properly over covering a broad thing thinly. Bemelman Spuiterij is the worked example.",
    metaTitle: "Dutch SEO agency for trade buyers",
    metaDescription: "Dutch trade search is low volume and high intent. See how covering one narrow set of searches properly beats a broad one covered thinly.",
    sections: ["Three ways to fail at Dutch SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "The Netherlands and Flanders are not one market either",
        paragraphs: [
          "The Netherlands and Flanders share Dutch as a language but the markets differ: everyday terms shift between the two, tax regimes and regulations diverge, and a single site aimed at both ends up half-relevant everywhere. Hreflang nl-NL and nl-BE separate the two when both are genuinely in scope.",
          "Dutch readers decide fast and expect direct copy. A site translated from English keeps the verbose, enthusiastic tone that works in the US and reads as marketing fluff to a Dutch visitor, who expects short sentences, concrete prices and visible terms rather than a pitch.",
          "A KvK number and BTW number on the footer, a Thuiswinkel Waarborg badge for stores, AVG-compliant cookie consent and iDEAL as a payment option are the trust signals a Dutch buyer looks for before converting. Belgian sites carry the parallel version, a KBO number and BTW/TVA. Missing them reads as a foreign site regardless of how good the content is.",
        ],
      },
      {
        heading: "The Bemelman Spuiterij pattern",
        paragraphs: [
          "Bemelman Spuiterij, a paint and powder-coating specialist based in Hillegom, is the case that shaped this page. Dutch trade search runs low in volume and high in intent, which rewards covering one narrow set of searches properly rather than a broad one thinly. KvK and BTW compliance, AVG cookie consent and dedicated pages per surrounding town turned into steady map pack visibility across the whole Bollenstreek region.",
        ],
      },
    ],
    expandablesHeading: "The one language here we run without a translator",
    expandablesLede:
      "Dutch works differently from the other language pages, and the Netherlands and Flanders differ again.",
    expandables: [
      {
        q: "Who writes the Dutch",
        a: [
          "We do, and that is not true of every language on this site. Dutch is fluent here, from an Erasmus year in Utrecht and years of daily work through the BeTranslated network, so the briefs, the SERP reading, the competitor analysis and the meetings all happen directly in Dutch with nobody in the middle.",
          "Published commercial copy still gets a native polishing pass, because fluent and native are not the same thing and the last five percent of tone is where a Dutch reader decides whether a site was written for them.",
        ],
      },
      {
        q: "Netherlands, Flanders, or both",
        a: [
          "The Netherlands alone is the usual answer and the simplest architecture. Flanders on its own is rare, because a Belgian business working in Dutch generally wants the Dutch market too. Both, with nl-NL and nl-BE kept apart, earns its place when you already have customers asking in Dutch on either side of the border.",
          "The recommendation comes from your sales pipeline rather than from the map.",
        ],
      },
      {
        q: "Same language, different commercial vocabulary",
        a: [
          "A rental property is a huurwoning in the Netherlands and often a huurappartement in Belgium. Insurance is verzekering in one and alternates with assurantie in the other. Neither is wrong, and each reads as slightly foreign in the wrong country.",
          "The regulators differ too, the AFM in the Netherlands against the FSMA in Belgium for financial services, along with the VAT rules. Treating both as one market produces a site that is half relevant in each.",
        ],
      },
      {
        q: "What the footer has to carry",
        a: [
          "A KvK number and a BTW number in the Netherlands, a KBO number and BTW or TVA in Belgium, visible in the footer and on the contact page rather than buried. Cookie consent aligned to the AVG, which is the GDPR as the Dutch read it, and terms appropriate to what you actually sell.",
          "Regulated sectors want a Dutch or Belgian lawyer on top of the technical setup, not instead of it.",
        ],
      },
      {
        q: "Why iDEAL and Bancontact belong in an SEO conversation",
        a: [
          "Indirectly, and measurably. iDEAL in the Netherlands and Bancontact in Belgium are what people expect to see at a checkout, and a consumer store missing them loses a real share of buyers at the last step.",
          "Search notices the consequence rather than the cause. A page people complete rather than abandon holds its position better than one they bounce from, so a payment method ends up being a ranking factor by a longer route.",
        ],
      },
    ],
    demand: {
      volume: 800,
      kd: "3",
      note: "Smallest of the six by volume, which matches the low-volume high-intent pattern the Bemelman work already showed.",
    },
  },
  {
    slug: "italian-seo",
    name: "Italian SEO",
    inline: "Italian SEO",
    h1: "Italian SEO agency for an uncontested market",
    subhead: "Commercial terms in Italian are far less fought over than the English equivalents, which makes entry cheap.",
    cluster: "Search",
    angle: "SEO Italy, where translated copy gets found out",
    lede: "Italian search rewards editorial quality more than most markets, and punishes translated-from-English copy faster.",
    metaTitle: "Italian SEO agency, an uncontested market",
    metaDescription: "Italian search rewards editorial quality and punishes translated-from-English copy fast. See the SEO approach built for that market.",
    sections: ["Three ways to fail at Italian SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "Italy's regional fragmentation is the real difficulty",
        paragraphs: [
          "Italian copy translated from English by a non-Italian agency reads adequately but misses the register Italian users expect, particularly the tu versus voi decision on commercial pages and where the polite form sits. Italian readers notice quickly when the copy was not written by someone who lives in the language, and conversion suffers even when traffic looks healthy.",
          "Italy is the most regionally fragmented major European market. Milan, Rome, Naples and Palermo behave differently on price sensitivity, payment habits and trust signals, so a single national site works for niche B2B but underperforms for anything closer to consumer search, where regional adaptation makes a real difference.",
          "A visible Partita IVA, codice fiscale and REA or Chamber of Commerce registration, plus consent compliant with the Garante della Privacy, which runs stricter than the EU baseline on some points, are what an Italian buyer checks before trusting a site enough to convert.",
        ],
      },
      {
        heading: "Read fluently here, written natively by the network",
        paragraphs: [
          "We read Italian fluently, built on French, Spanish and a Latin background, and use that to handle strategy and competitor reading directly. Native Italian copywriters from the BeTranslated network handle the writing itself, briefed in English or French and checked by a second native reader before anything ships. No pretence about who writes the commercial copy. An Italian SEO company writing from inside the market and a foreign agency translating into Italian are not the same purchase, and the page shows which one produced it.",
          "Targeting runs per macro-region (Nord, Centro, Sud) when the offer justifies it, with local landing pages for Milan, Rome, Turin and other metropolitan areas where relevant. Outreach targets Corriere della Sera, La Repubblica and Sole 24 Ore for B2B, plus sector associations such as Confindustria and Confartigianato.",
        ],
      },
    ],
    expandablesHeading: "The objection an Italian buyer raises first",
    expandablesLede:
      "Who reads the language, who writes it, and how far to go on regions.",
    expandables: [
      {
        q: "You do not speak Italian, so how is this Italian SEO",
        a: [
          "Fair question, and the honest answer is that most of Italian SEO is reading rather than writing. Reading the SERP, reading what the competitors rank for and why, reading intent in an Italian query, checking that it-IT is configured the way it should be. We read Italian fluently, on French as a first language, Spanish every day in Valencia and Latin from school, which is enough to audit an Italian page and challenge a draft that drifts from its brief.",
          "What we do not do is write your Italian commercial copy. Native Italian writers do that, so the page reads native because it is, rather than because somebody nearly pulled it off.",
        ],
      },
      {
        q: "How the Italian is checked when we do not write it",
        a: [
          "Brief from us in English or French with the targets and the structure set, drafting by a briefed native Italian writer, then a second native Italian reading it before publication. Your own people are the filter after that.",
          "Because we read the language, the review is a real one: a draft that reads beautifully and answers a different query still comes back.",
        ],
      },
      {
        q: "How far to take the regional split",
        a: [
          "The north, around Milan, Turin, Bologna and the Veneto, is the industrial B2B core and the most tolerant of English on technical niches. The centre, Rome and Tuscany, runs on services, tourism and a large public-sector tail. The south and the islands hold genuinely different price expectations and trust patterns, where local presence and local references count for more.",
          "Regional pages earn their place when local presence is the thing being sold. For B2B selling nationally online, one Italian site does the job and the regional split is overhead.",
        ],
      },
      {
        q: "Where the Garante goes beyond the GDPR baseline",
        a: [
          "Italy's data protection authority reads parts of the GDPR more strictly than the baseline, particularly on how cookie consent is stored and how granular marketing consent has to be. The technical setup is built to that reading rather than to the looser one.",
          "Sensitive data, automated decisions and anything touching employee monitoring are a specialist Italian lawyer's work, on top of the implementation rather than instead of it.",
        ],
      },
    ],
    gsc: { impressions: 1304, position: 45.3, keywords: 33 },
    demand: {
      volume: 900,
      kd: "0 to 1",
      note: "Small but almost unguarded, with `italian seo agency` at difficulty 0.",
    },
  },
  {
    slug: "portuguese-seo",
    name: "Portuguese SEO",
    inline: "Portuguese SEO",
    h1: "Portuguese SEO agency for Portugal and Brazil",
    subhead: "Two markets rather than one language, with different search behaviour and different competition in each.",
    cluster: "Search",
    angle: "Two markets, one language",
    lede: "Portugal and Brazil are not one market with one keyword set, and treating them as one is the mistake that makes Portuguese look harder than it is.",
    metaTitle: "Portuguese SEO services, Portugal and Brazil",
    metaDescription: "Portugal and Brazil are two markets, not one keyword set. See why treating them separately is what makes Portuguese SEO actually work.",
    sections: ["Three ways to fail at Portuguese SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "Portugal and Brazil, sized correctly",
        paragraphs: [
          "European Portuguese and Brazilian Portuguese diverge in vocabulary, grammar convention, currency and regulatory framework. A single Portuguese site reads Brazilian to a Portuguese visitor and European to a Brazilian one, and both sides notice. Hreflang pt-PT and pt-BR kept distinct is the baseline fix.",
          "Brazil alone counts roughly 215 million speakers, one of the world's largest digital economies, with its own ecommerce platforms and payment methods such as PIX and boleto bancário. European companies often default to Portugal and miss the far larger market by assumption rather than by decision. The strategic question is which market actually fits the offer, not which one sits geographically closer.",
          "Portugal expects a NIF or NIPC and GDPR-compliant consent. Brazil expects a CNPJ, LGPD-compliant handling and PIX or boleto as payment options for consumer stores. The same page cannot satisfy both markets at once.",
        ],
      },
      {
        heading: "Native per variant, coordinated from here",
        paragraphs: [
          "Research and writing run through native PT-PT copywriters for Portugal and native PT-BR copywriters for Brazil from the BeTranslated network, briefed in English or French and checked by a second native reader per variant. Outreach targets Público and Expresso in Portugal, Folha and Estadão in Brazil, never a link bought from the wrong side of the Atlantic.",
        ],
      },
    ],
    expandablesHeading: "Portugal or Brazil, and why not both by default",
    expandablesLede:
      "The decision this engagement opens with, and what follows from each answer.",
    expandables: [
      {
        q: "European and Brazilian Portuguese are two markets, not one language setting",
        a: [
          "They diverge far enough on vocabulary, grammar, regulation, currency and trust signals that one unified Portuguese site reads wrong to both audiences. A reader in Lisbon finds unified Brazilian copy distractingly Brazilian. A reader in São Paulo finds unified European Portuguese stiff and unnatural. Both lose a little trust, and both convert worse for it.",
          "Where both are genuinely in scope, pt-PT and pt-BR keep them apart. Where only one is, targeting it properly beats hedging between the two.",
        ],
      },
      {
        q: "Which one to open first",
        a: [
          "Portugal is a mature EU market on the euro, under GDPR, and friendly to a foreign business with any European proximity. Brazil is an order of magnitude larger, with its own payment behaviour, its own data protection law and a currency that brings exchange risk with it.",
          "The question is offer fit and where your customers already are, not which is nearer or which is bigger. A European SMB selling services often does better in Portugal than in a Brazilian market it cannot serve.",
        ],
      },
      {
        q: "Who reads the Portuguese and who writes it",
        a: [
          "We read both variants at a working level, built on native French and daily Spanish, which is enough to audit a SERP, follow a competitor's pages, check the technical configuration for the variant and take notes in a native team meeting.",
          "Writing is done by native copywriters from the target market: a Portuguese writer for pt-PT, a Brazilian writer for pt-BR, not one Portuguese speaker covering both. Most agencies that offer Portuguese do neither of those things and do not say so.",
        ],
      },
      {
        q: "LGPD is not just GDPR with a different name",
        a: [
          "Brazil's Lei Geral de Proteção de Dados covers similar ground to the GDPR and is enforced by its own authority, the ANPD, with its own expectations. Consent handling, data subject rights and the privacy policy are set up to that reading rather than to a European one relabelled.",
          "Sensitive data, cross-border transfers and automated decisions want a Brazilian privacy lawyer on top of the technical work.",
        ],
      },
      {
        q: "A Brazilian store without PIX leaks buyers",
        a: [
          "PIX, the instant payment system the central bank launched in 2020, is how a great many Brazilians now pay: faster than a card, settled immediately, and effectively free for an individual. Boleto bancário still matters for some demographics and for business-to-business.",
          "It reaches SEO indirectly and reliably. A checkout that offers what a buyer expects converts better, and a page that converts better holds its position more easily than one that ranks and bounces.",
        ],
      },
    ],
    demand: {
      volume: 1150,
      kd: "33",
      note: "Mid-sized but by far the hardest of the six. `seo portugal` at difficulty 33 is ten times the difficulty of the German or Spanish equivalents, so it should be built last.",
    },
  },

  // ---- Cluster 3: localization and translation ----
  {
    slug: "local-seo",
    name: "Local SEO",
    inline: "local SEO",
    h1: "Local SEO services for multilingual cities",
    subhead: "Be the business nearby buyers find first on the map, in every language your city searches in, and turn the profile into calls and visits.",
    cluster: "Search",
    angle: "Found first, streets away",
    lede: "Somebody a few streets away searches for exactly what you sell and gets a competitor who is no better, only more consistent about where they appear. In a city that searches in two languages, the gap is twice as wide.",
    metaTitle: "Local SEO services for businesses in multilingual cities",
    metaDescription: "Somebody nearby searches for what you sell and finds a competitor who is no better, only easier to find. Local SEO for cities that search in two languages.",
    sections: [
      "Google Business Profile audit and full optimization",
      "Your name, address and phone number made identical across every directory",
      "Neighbourhood pages and LocalBusiness schema for the districts you serve",
      "A review request routine and a reply to every review",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "What an invisible profile costs a local business",
        paragraphs: [
          "Somebody searching for a service near them rarely scrolls. They call one of the three businesses on the map, read the reviews of the other two, and are gone. A business outside those three does not lose the enquiry to a better competitor, it never gets the chance to compete for it.",
          "In a city where people search in more than one language, the loss doubles quietly. A profile written only in Spanish is invisible to the English speaker two streets away searching in English, and the competitor who bothered to add the second language takes both.",
          "Nothing about it shows up as a problem. No complaint arrives and no report turns red. The phone rings a little less than it could, every week, which is exactly why it goes unfixed.",
        ],
      },
      {
        heading: "Where local visibility actually gets lost",
        paragraphs: [
          "A Google Business Profile with the wrong categories, an incomplete service list, outdated hours, few photos and no recent posts gets buried below competitors with no better product, just better profile hygiene. Google rewards a profile that is complete and kept active. For a small business working from one address, the profile often brings in more enquiries than the website does.",
          "A business name that reads slightly differently across a directory listing, a review site and a chamber of commerce entry, or an address abbreviated one way in one place and spelled out in another, weakens the confidence Google places in any of them. Cleaning it up everywhere is unglamorous work with a direct effect on where you appear.",
          "A homepage that says it serves the whole city is a start. A dedicated page for each neighbourhood you actually serve wins the searches a city page misses, because people search for a service plus a neighbourhood, not a service plus a city.",
        ],
      },
      {
        heading: "Local SEO we run on our own properties and for clients",
        paragraphs: [
          "Bemelman Spuiterij is a powder-coating specialist in the Bollenstreek with forty-five years of reputation and, before we started, almost no web presence. We built Dutch local SEO around the small number of trade buyers who search for that work, and the site drew 1,436 clicks from 108,568 Google impressions between May and July 2026.",
          "ValenciaMove is our own relocation site for Valencia, built around neighbourhood guides in five languages. Over the same three months it drew 5,685 clicks from 496,316 impressions at an average position of 10.7, which is what a city searched in several languages looks like when every one of them gets its own page.",
          "As a local SEO agency, we treat those numbers as the starting point for a conversation about your city, not a promise about it. Every market has its own competitors and its own pace.",
        ],
      },
    ],
    expandablesHeading: "What the map pack actually rewards",
    expandablesLede:
      "Local search is mostly discipline rather than tricks, and the discipline is specific.",
    expandables: [
      {
        q: "The profile is a product surface, not a listing",
        a: [
          "Categories, services, attributes, opening hours, photos, posts and the questions people ask, all filled in and all kept current. A profile finished once and left alone decays against competitors who update theirs, and in a city with more than one working language the profile needs the second one too.",
          "It compounds rather than spikes. Done consistently for a few months it moves you up the map pack quietly, which is unsatisfying to watch and the reason most businesses stop.",
        ],
      },
      {
        q: "Name, address and phone number, identical everywhere",
        a: [
          "Google reads your details from dozens of places and a mismatch between them is a reason to trust none of them. The work is an audit of what is already out there, correction of the inconsistencies, removal of duplicate listings, and additions where a high-value local source is missing you entirely: the chamber of commerce, the sector association, the directory your trade actually uses.",
          "Unglamorous, and the single most common reason a business with good pages does not appear on the map.",
        ],
      },
      {
        q: "Neighbourhood pages that are not the same page nine times",
        a: [
          "A page per district works when each one says something true about that district and fails when it is the same paragraph with the place name swapped. Search has been able to tell the difference for years, and so can a reader.",
          "Local schema belongs on them, with the right subtype rather than the generic one: a law firm is a LegalService, a freight forwarder is a FreightForwarder. Internal links from the main service pages are what make them findable at all.",
        ],
      },
      {
        q: "Reviews are a process or they are luck",
        a: [
          "A request that goes out after the job is done, by email or from a code on the receipt, collects reviews. Hoping collects nothing. Every review gets a reply, including the bad ones, because the reply is read by everyone who comes after.",
          "A negative review handled well reads better than a wall of five stars, and there should be a written plan for it before one arrives rather than a scramble afterwards.",
        ],
      },
      {
        q: "Local discovery has moved into the assistants",
        a: [
          "A growing share of best-in-town questions get asked of ChatGPT, Claude or Perplexity before anyone opens a map. What those answers draw on is the same material: structured data, consistent citations, and a reputation visible enough to be summarised.",
          "Which means the work above pays twice, and a business that skipped it is now missing from two places rather than one.",
        ],
      },
    ],
    absorbs: ["local-seo"],
    demand: {
      volume: 134000,
      kd: "5 to 87",
      note: "Sums `local seo`, `local seo services` and `local seo agency` worldwide. The head term alone draws 63,000 at KD 87, easily the hardest term measured for any service page. `local seo services` (47,000, KD 5) and `local seo agency` (24,000, KD 6) carry nearly as much volume between them at a fraction of the difficulty, so those are the terms to build toward first.",
    },
  },
  {
    slug: "website-localisation",
    name: "Website localization",
    inline: "website localization",
    h1: "Website localization services that make a site sell in its market",
    subhead: "From the copy to the checkout: currency, payment methods, shipping rules and a layout that survives a third more text.",
    cluster: "Localization",
    pillar: true,
    angle: "Beyond translated strings",
    lede: "Your site has been translated and it still reads as foreign. The prices, the form fields, the trust marks and the way people search all still belong to somewhere else, and none of it is fixed by the words.",
    metaTitle: "Website localization services, Mike Bastin",
    metaDescription: "Translated and still reading as foreign, from the prices to the form fields to the way people search? Website localization is the job the words alone do not do.",
    sections: ["Why localization is not translation", ...ENGAGEMENT],
    body: [
      {
        heading: "Why a translated page still reads as imported",
        paragraphs: [
          "A page translated word for word keeps the original currency format, date format, trust signals and calls to action, and reads as imported even when every sentence is grammatically correct. Localization adapts dates, currency, imagery, payment methods and the calls to action themselves to match what a market actually expects, which is a bigger job than swapping the words.",
          "Right-to-left support for Arabic, the text expansion German routinely needs against an English source, and correct character encoding across every language in scope are technical problems, not linguistic ones, and they surface first in the interface rather than the copy. Testing across WordPress, Joomla, Drupal or a custom build catches them before launch instead of after a support ticket.",
        ],
      },
      {
        heading: "What gets configured underneath the words",
        paragraphs: [
          "WPML runs as the default multilingual stack for WordPress, with Polylang for tighter budgets or simpler structures and TranslatePress where a non-technical content team needs in-context, front-end translation. For stores, WooCommerce, Shopify and Magento get local currency, local payment methods and checkout flows adjusted per region, since conversion rates move measurably once a shopper sees a familiar payment option at checkout.",
          "Full QA runs across languages before launch: every interface element, form, menu and piece of multimedia checked for display, function and cultural fit, not just spot-checked on the homepage. A localization project that skips this step tends to surface its problems in a support inbox rather than in a test report.",
        ],
      },
    ],
    expandablesHeading: "What localization touches beyond the copy",
    expandablesLede:
      "The parts of a translated site that still go wrong once the copy itself is done.",
    expandables: [
      {
        q: "Which WordPress multilingual plugin, and what each one costs you",
        a: [
          "WPML is the default: the most complete on SEO, the most demanding on hosting and the one with a licence to keep renewing. Polylang fits a tighter budget and a simpler structure, and starts to hurt once translation workflows get complicated. TranslatePress earns its place when a non-technical team needs to translate on the front end, seeing the page as they change it. MultilingualPress suits a genuine multisite. GTranslate is machine translation with a switcher, which is a different product from a localized site and should be chosen knowing that.",
          "The choice is hard to undo cheaply, because the content ends up stored the plugin's way. Deciding it against the editorial workflow rather than the feature list is most of the work.",
        ],
      },
      {
        q: "Text expansion breaks layouts that were designed in English",
        a: [
          "German compounds and French expansion push buttons, menu items and headings past the space an English design allotted them. A layout that only ever saw English copy tends to break at exactly the places that matter: the navigation, the call to action, the price table.",
          "Right-to-left languages mirror the layout rather than the text alone, and character encoding still bites on forms, search and anything that touches a database. All of it is cheaper to design for than to retrofit.",
        ],
      },
      {
        q: "A store is localized at the checkout or not at all",
        a: [
          "Product descriptions and SKUs are the visible half. The half that moves the conversion rate is the currency shown, whether the price is formatted the way that market writes prices, the payment methods offered, and how the checkout handles an address that is not shaped like a British one.",
          "WooCommerce, Shopify and Magento each expose that differently, and each will happily launch a shop that looks translated and feels foreign at the last step.",
        ],
      },
      {
        q: "What localization testing actually covers",
        a: [
          "Every interface element, form, menu, switcher and piece of multimedia, in each language, for display, function and fit. The language switcher going to the wrong page, a form rejecting a valid local postcode, a date reading as the wrong month: none of it shows up in a translation review, because none of it is a translation problem.",
          "The pass also covers what the market requires legally, from consent handling to accessibility. Skipping it does not remove the defects, it just moves their discovery into your support inbox.",
        ],
      },
      {
        q: "WordPress is not the only CMS this applies to",
        a: [
          "Joomla and Drupal both do multilingual well and differently, and both reward deciding the content model before translating anything rather than after.",
          "Whatever the platform, the question underneath is the same: does each language version have its own URL, its own metadata and its own place in the sitemap, or is it a display layer over one canonical page. Only the first is a site a search engine can rank per market.",
        ],
      },
    ],
    absorbs: [
      "content-localisation", "localisation-testing", "multilingual-cms-integration",
      "wordpress-translation-plugin", "localised-e-commerce-integration", "multilingual-ux-ui-design",
    ],
  },
  {
    slug: "translation-services",
    name: "Translation services",
    inline: "translation services",
    h1: "Multilingual translation services sorted by document type",
    subhead: "The risk changes completely from a proposal to a court filing, and so does who should be doing the work.",
    cluster: "Localization",
    pillar: true,
    angle: "Where accuracy is a liability question",
    lede: "You have a contract, a patient record or a birth certificate that a court, a regulator or an embassy has to accept, and a wrong term in it costs you a deadline or worse. Work goes through the BeTranslated network, co-founded and run for twenty years.",
    metaTitle: "Translation services, Mike Bastin",
    metaDescription: "A contract, a patient record or a certificate a court or an embassy has to accept. Certified and sworn translation services through the BeTranslated network.",
    sections: ["Where a translation error actually costs", ...ENGAGEMENT],
    body: [
      {
        heading: "Where a mistranslation stops being cosmetic",
        paragraphs: [
          "A sworn or certified translation of a birth certificate, power of attorney, court ruling or immigration document has to be accepted by the specific court, embassy or public administration it is submitted to, in Spain, the UK or across the EU. Getting the format wrong means resubmission and a missed deadline, not a stylistic quibble.",
          "Medical translation carries clinical and legal weight: patient records, informed consent forms and regulatory submissions handled under GDPR and HIPAA confidentiality protocols, by translators who know the terminology of the specific medical field involved, not a generalist working from a dictionary.",
          "Financial and legal translation work, from annual reports and prospectuses to contracts, patent filings and articles of association, needs to hold up to the same scrutiny as the original document, because a mistranslated clause in a shareholder agreement or a mistranslated figure in an audited statement is a liability question, not a proofreading one.",
        ],
      },
      {
        heading: "How the BeTranslated network actually delivers it",
        paragraphs: [
          "Translation runs through the BeTranslated network, co-founded and run for over twenty years, with certified and sworn translators per language and per specialism (legal, medical, financial, academic, technical). Standard delivery runs two to five business days, with rush turnaround available for time-critical personal documents such as a visa or birth certificate translation.",
          "Every document gets matched to a translator with the relevant sector background, then a rigorous review pass before delivery, with notarisation or an apostille handled where the receiving institution requires it. Confidentiality protocols apply throughout, since much of what moves through this service is precisely the kind of document a business cannot afford to have mishandled.",
        ],
      },
    ],
    expandablesHeading: "Which kind of translation your document needs",
    expandablesLede:
      "Each kind of document carries its own risk, and its own answer to the same question.",
    expandables: [
      {
        q: "Certified, sworn, notarised and apostilled are four different things",
        a: [
          "People ask for the wrong one constantly, and the receiving institution is the only authority on which is right. A certified translation carries a signed statement of accuracy from the translator or agency. A sworn translation is made by a translator formally registered with a court or ministry, which is how Spain, France and much of the EU handle official documents. Notarisation adds a notary attesting to the signature, not to the translation. An apostille authenticates the document itself for use abroad under the Hague Convention, and is a matter for the issuing authority rather than the translator.",
          "So the first question is never which service you want, it is what the body receiving the document asks for: a court, a registry, a university admissions office and an immigration authority each have their own rule. Establish that first and the rest is straightforward.",
        ],
      },
      {
        q: "Legal documents, where a wrong term changes an obligation",
        a: [
          "Contracts, court filings, witness statements, powers of attorney, articles of association, shareholder agreements, patent and trademark filings. Legal language is jurisdiction-bound rather than merely technical, so a term that translates cleanly can still carry the wrong weight in the receiving legal system.",
          "Work goes to translators with the legal background for the jurisdiction concerned, not to a generalist with a glossary.",
        ],
      },
      {
        q: "Medical and regulated, where a reviewer reads it before a patient does",
        a: [
          "Patient records, clinical trial documentation, regulatory submissions, informed consent forms, patient information and discharge instructions, device manuals and research papers. Much of it is read first by an ethics committee or a regulator, and the terminology has to match the one that body already uses.",
          "The same applies to the marketing material around a medical device, which is regulated copy wearing a commercial jacket.",
        ],
      },
      {
        q: "Financial, where consistency matters more than elegance",
        a: [
          "Annual reports, prospectuses, fund fact sheets, balance sheets, income and cash flow statements, audit reports, tax filings. Financial reporting has settled vocabulary tied to the standards in use, and a translator improving on it introduces a discrepancy rather than a style.",
          "The right target term is the one the accounting standard already uses in that language, whether or not it is the most natural way to say it.",
        ],
      },
      {
        q: "Academic, where recognition is the whole point",
        a: [
          "Degree certificates, transcripts and mark sheets, research papers and journal articles, personal statements and recommendation letters, syllabi and course descriptions. A transcript carries a grading system that does not map cleanly onto another country's, and glossing over that is how an application stalls.",
          "Research writing has the opposite problem: the argument has to survive intact, including the hedging, because a confident-sounding translation of a carefully qualified claim is a misrepresentation.",
        ],
      },
      {
        q: "Transcreation, which is not translation at all",
        a: [
          "A campaign line, a tagline or a piece of brand copy that works in one language often has no equivalent in another, because what it is doing is cultural rather than semantic. Transcreation rewrites for the same effect instead of the same words, from a brief describing what the original is meant to achieve.",
          "It is the right choice for marketing and the wrong one for anything where a regulator, a court or an examiner will compare the two versions line by line.",
        ],
      },
    ],
    absorbs: [
      "business-translation", "medical-translation", "academic-translation", "financial-translation",
      "legal-translation", "certified-and-sworn-translation-services", "expert-translation-services",
      "transcreation",
    ],
  },
  {
    slug: "app-and-software-localisation",
    name: "App and software localization",
    inline: "app and software localization",
    h1: "App and software localization services",
    subhead: "Internationalized before launch rather than retrofitted after it, which is where the cost of this work is decided.",
    cluster: "Localization",
    angle: "Strings, and everything around them",
    lede: "You are shipping the product into a market that writes longer sentences than English, sometimes reads right to left, and reviews you in a store nobody on the team can read. What breaks first is rarely the translation.",
    metaTitle: "App and software localization services",
    metaDescription: "Shipping into a market that writes longer than English and sometimes reads right to left? App and software localization covers what breaks before the words do.",
    sections: ["What breaks when software crosses a language", ...ENGAGEMENT],
    body: [
      {
        heading: "The technical problems localization testing catches early",
        paragraphs: [
          "Interface text that fits comfortably in English routinely runs longer in German, and a layout that was never tested against that expansion breaks buttons, truncates labels and pushes navigation out of alignment. Right-to-left scripts such as Arabic and Hebrew need the layout itself, not just the text direction, adjusted to stay usable.",
          "Character encoding that is not handled correctly turns accented characters and non-Latin scripts into visible errors on screen, the kind of bug that is invisible in English testing and immediately obvious to every user in the affected language. Preparing the software's architecture for this before adding new languages avoids a rebuild every time a market gets added.",
        ],
      },
      {
        heading: "What app and software localization services cover",
        paragraphs: [
          "Interface text, notifications and app store descriptions translated and adapted for clarity and cultural relevance, dates, currency and units of measurement adjusted per locale, and app store keywords optimized per target market to support discoverability. Testing runs across the operating systems and devices actually used in each market, not just the primary one.",
          "For video and audio content, subtitling and voice-over work across standard formats, with accurate transcription supporting both localization and accessibility compliance. Software internationalization work prepares the underlying architecture, so adding a new language later is a translation task rather than a rebuild.",
        ],
      },
    ],
    expandablesHeading: "The order the work has to happen in",
    expandablesLede:
      "The sequence that decides how expensive the rest of the work becomes.",
    expandables: [
      {
        q: "Internationalization comes first, or localization costs several times more",
        a: [
          "Preparing the software is the part nobody demos: strings pulled out of the code, no sentences assembled from fragments, dates and numbers and currency formatted by locale rather than hardcoded, sorting that follows the target language's rules, and layouts that survive text arriving longer than the English.",
          "Done first, adding a language is a content job. Skipped, every new market reopens the codebase, and the second language costs more than the first did.",
        ],
      },
      {
        q: "An app store listing is a search surface of its own",
        a: [
          "The title, the subtitle, the description and the keyword field are indexed per store and per locale, and translating the English listing wastes most of the room they give you. What people type to find an app in Spanish is not what they type in English, and the character limits differ by store.",
          "Screenshots count too. A store page showing an English interface to a Spanish browser tells the reader the app is not really for them before they read a word.",
        ],
      },
      {
        q: "Testing across language, device and operating system",
        a: [
          "Most localization defects are not translation defects. A label that overflows its button in German, a date that reads as the wrong month, a form that rejects a valid local postcode, a right-to-left layout that mirrors everything except one icon.",
          "None of that appears in a translation review, because none of it is visible in a spreadsheet of strings. It appears on a device, in that language, which is where the pass has to happen.",
        ],
      },
      {
        q: "Video and audio are the part that gets left in English",
        a: [
          "Subtitling, voice-over and transcription per language, and a decision about which of the three each piece needs. Subtitles are cheap and carry most of the value, including for the people who watch with the sound off, which is most of them.",
          "A transcript does double duty: it makes the content accessible and it puts words on a page that search and an answer engine can actually read, which a video alone never does.",
        ],
      },
    ],
    absorbs: ["app-localisation", "software-internationalisation", "multimedia-localisation"],
  },

  // ---- Cluster 4: AI, the differentiator ----
  {
    slug: "ai-consulting",
    name: "AI consulting",
    inline: "AI consulting",
    h1: "AI consulting services for multilingual search and content",
    subhead: "Where machine output helps across languages, and where it quietly costs the trust a page was built to earn.",
    cluster: "AI",
    pillar: true,
    angle: "AI consultants who say where AI does not help",
    lede: "Somebody has told you AI can handle your German content, and some of it can. The part that decides whether the page earns anything is the part that still needs a person who reads German.",
    metaTitle: "AI consulting for multilingual SEO",
    metaDescription: "Told that AI can handle your German content? Some of it can. AI consulting that says which part still needs a person who reads the language.",
    sections: ["Where AI helps, and where it does not", ...ENGAGEMENT],
    body: [
      {
        heading: "Where AI genuinely helps",
        paragraphs: [
          "Neural machine translation combined with terminology-aware post-editing genuinely shortens the first draft of a multilingual page, and AI-assisted research speeds up the early stages of keyword and competitor work across languages far faster than doing it by hand.",
          "Sentiment analysis run across several markets at once surfaces patterns in how a brand is discussed that a manual review would take weeks to find, and it is one of the few places where AI adds a capability rather than just adding speed to a capability we already had.",
        ],
      },
      {
        heading: "Where it still needs a person",
        paragraphs: [
          "What AI does not do reliably yet is write commercial copy that converts in a language it was not trained to sound native in, judge which of two culturally different approaches will land better with a specific audience, or catch the kind of subtle, confidently wrong error that reads as fluent and is factually off. Those judgement calls stay with someone who knows the market.",
        ],
      },
      {
        heading: "Deciding what to trust before anything gets built",
        paragraphs: [
          "An AI strategy worth the name says where the tool is not used, which is the half of the answer a vendor demo leaves out. Whether a chatbot handling multilingual customer support is safe to deploy on its own, or needs a human fallback for anything past the routine questions, gets assessed against the actual cost of a wrong answer, not against how impressive the demo looked.",
          "The output of any AI system in this stack gets reviewed by someone who reads the target language, because the real risk in AI-assisted multilingual work is never an obviously broken sentence. It is a fluent, professional-looking sentence that is quietly wrong.",
        ],
      },
    ],
    expandablesHeading: "Where AI earns its place, and where it does not",
    expandablesLede:
      "The parts of a multilingual operation worth automating, and the part that still needs a person.",
    expandables: [
      {
        q: "Machine translation with somebody reading the output",
        a: [
          "Modern engines are good enough that translating everything by hand is hard to justify, and not good enough that publishing the output unread is safe. The workable setup is an engine chosen and tuned for your subject matter, with a native editor on the material that carries risk and a lighter pass on the material that does not.",
          "The saving is real and it comes from deciding which content is which, rather than from trusting the engine further than it deserves.",
        ],
      },
      {
        q: "Support that answers in the language the question arrived in",
        a: [
          "A multilingual assistant on the site handles the repetitive questions in each market without a support team per language, and hands over cleanly when it does not know. Built on your own material rather than on a general model's guesswork, so it answers about your products instead of about the category.",
          "Where it goes wrong is confidence: an assistant that invents an answer in a language nobody on your team reads will do it for months before anyone notices.",
        ],
      },
      {
        q: "Reading what the market is saying, at a volume a person cannot",
        a: [
          "Sentiment and theme analysis across reviews, support tickets and social mentions per language, which is where the gap between what a market says and what you assume it wants tends to show up first.",
          "A complaint pattern that appears in one language and not the others is usually a localization defect rather than a product one, and it is invisible in a blended report.",
        ],
      },
      {
        q: "How to tell whether any of it worked",
        a: [
          "Accuracy on a sample somebody checks, turnaround time, cost per published page, and whether the people using the output would go back to working without it. Market-level numbers alongside those, because a saving in one language and a mess in another nets out to nothing on a dashboard.",
          "An automation that saves time and costs trust has not saved anything, and that shows up in the enquiry count rather than in the tooling report.",
        ],
      },
    ],
    absorbs: ["ai-consulting-services"],
  },
  {
    slug: "ai-translation-and-post-editing",
    name: "AI translation and post-editing",
    inline: "AI translation and post-editing",
    headingTerm: "machine translation post-editing",
    h1: "Machine translation post-editing after the AI first pass",
    subhead: "Machine output worked over by a native speaker, because text that reads fluently and is wrong is worse than text that warns you.",
    cluster: "AI",
    angle: "Machine first, human decisive",
    lede: "Your pages came back from the machine reading fluently, which is the problem. A sentence that is confidently wrong is far harder to catch than one that is obviously broken.",
    metaTitle: "Machine translation post-editing and AI translation",
    metaDescription: "Machine-translated pages that read fluently are the hard case, not the broken ones. AI translation and post-editing catches what reads right and is wrong.",
    sections: ["Why fluent output is the harder problem", ...ENGAGEMENT],
    body: [
      {
        heading: "Why a fluent translation can still be wrong",
        paragraphs: [
          "Machine translation and plugin-driven translation, whether through WPML, Weglot or Polylang's auto-translate, have become fluent enough that the output reads as professionally written even when it is not accurate. A broken sentence gets caught by anyone reading it. A fluent sentence that has quietly shifted the meaning, dropped a qualifier or mistranslated a technical term gets published and stays wrong until someone who knows the subject reads it closely.",
          "The risk scales with the stakes of the content: a mistranslated product description is a minor embarrassment, a mistranslated clause in ecommerce terms or a mistranslated instruction in medical or legal content is a liability. Post-editing effort should scale the same way, heavier review on what actually carries risk, lighter on what does not.",
        ],
      },
      {
        heading: "What machine translation post-editing actually corrects",
        paragraphs: [
          "Terminology errors and unnatural phrasing corrected against a defined glossary per sector, formatting and tone standardised across languages so the brand voice holds, and consistency checked against the SEO targets the content was meant to hit in the first place, since a post-edit that fixes the grammar but drifts off the target keyword defeats its own purpose.",
          "The trade calls it MTPE, and buying MTPE services by the word misses what the work is: the effort belongs where the risk is, not spread evenly across a file. Work runs across sectors that lean on AI output to scale quickly, particularly SaaS, ecommerce and travel, where the volume of content makes full native writing impractical but the accuracy bar is still commercial, not casual.",
        ],
      },
    ],
    expandablesHeading: "What a post-editing pass actually changes",
    expandablesLede:
      "The defects machine output leaves behind, in the order a reader meets them.",
    expandables: [
      {
        q: "Grammar is the easy half",
        a: [
          "Engines rarely produce a sentence that is wrong any more. They produce sentences that are correct and slightly off: a register too formal for the market, an idiom translated rather than replaced, a rhythm that reads as translated even when nobody can point at the word responsible.",
          "Fixing that is an editorial job, not a proofreading one, and it is the difference between content a reader trusts and content they finish without knowing why they did not.",
        ],
      },
      {
        q: "Plugin auto-translation and where it stops",
        a: [
          "Weglot, WPML and Polylang will fill a site with translated strings quickly, and the result is usable and unfinished. The prose gets attention because it is visible; the parts that are not visible rarely do.",
          "So the pass covers what the plugin touched and the reader does not see: title tags, meta descriptions, alt text, button labels, form validation messages and confirmation emails. A page can read beautifully in French and still apologise in English when a form fails.",
        ],
      },
      {
        q: "Terminology has to be decided once",
        a: [
          "An engine translates the same term three different ways across a site because it sees each sentence alone. For a product name, a legal term or anything a customer will search for, that is three chances to be wrong and no chance to rank.",
          "The pass settles the term per language and applies it everywhere, which matters most on the pages where a sale happens and least on the blog.",
        ],
      },
      {
        q: "Where machine output should not go unread at all",
        a: [
          "Anything a regulator, a court or a clinician reads. Medical documentation, legal text, financial reporting and safety instructions all have the property that a plausible-sounding error costs more than a delay does.",
          "Machine output is a good first draft there and a bad final one, and the honest answer is a specialist reading it rather than a faster engine.",
        ],
      },
    ],
    absorbs: ["post-ai-editing"],
  },

  {
    slug: "generative-engine-optimization",
    name: "Generative engine optimization",
    inline: "generative engine optimization",
    h1: "Generative engine optimization services for AI search",
    subhead: "Structured for ChatGPT, Perplexity and Google's AI Overviews to cite you, not only for Google to rank you.",
    cluster: "AI",
    pillar: true,
    angle: "Cited inside the answer, not just ranked below it",
    lede: "ChatGPT, Perplexity and Google's AI Overviews answer a buyer's question directly, and name two or three sources while doing it. Being one of them is the difference between being considered and never being seen.",
    metaTitle: "Generative engine optimization agency and AEO",
    metaDescription: "ChatGPT, Perplexity and Google AI Overviews name a small number of sources when they answer a question. See what it takes for the answer to name you.",
    expandablesHeading: "What changes when the answer is written for you",
    expandablesLede:
      "Nine shifts in how buyers reach an answer, and what each one asks of your pages.",
    expandables: [
      {
        q: "Optimize for search everywhere, not only for Google",
        a: [
          "Buyers now ask ChatGPT, Perplexity, Bing and a voice assistant before they ask Google, and each one assembles its answer differently. A page written only to rank on one of them is invisible on the rest.",
          "Presence across the platforms your market actually uses, with one voice rather than a different claim in each place, because an answer engine that finds you contradicting yourself cites somebody else.",
        ],
      },
      {
        q: "Write for the question, not for the keyword",
        a: [
          "An answer engine reads a conversational question and returns a direct response. Matching a two-word keyword does nothing for it.",
          "Longer, spoken-shaped phrases, and the related terms around them, so the page answers the whole question rather than repeating its title.",
        ],
      },
      {
        q: "Make the experience and expertise visible",
        a: [
          "Experience, expertise, authoritativeness and trust still decide what gets quoted, and an answer engine has no way to infer any of it from an anonymous page.",
          "Named authors with a real record, claims a model can check, and dates that show the page is maintained rather than abandoned.",
        ],
      },
      {
        q: "Structure the data so a machine can read it",
        a: [
          "Schema is how a retrieval system works out what a page is about before deciding whether to cite it. Without it, the page is prose to be guessed at.",
          "Types that match what the page really is, validated rather than assumed, and never marked up with claims the page does not make.",
        ],
      },
      {
        q: "Earn citations from sources a model already trusts",
        a: [
          "Answer engines lean on the same authority signals search does, so a page nobody references is a page nobody quotes.",
          "Coverage from publications in your market, and material worth referencing on its own, rather than links bought by the thousand.",
        ],
      },
      {
        q: "Keep the page fast and readable",
        a: [
          "A page people leave immediately teaches every ranking and retrieval system the same thing about it.",
          "Quick loads, a structure someone can scan, and enough reason to stay past the first screen.",
        ],
      },
      {
        q: "Re-test as the models change",
        a: [
          "The answer engines rewrite their retrieval behaviour on no schedule you control, and a tactic that worked last quarter can stop without warning.",
          "Regular checks on which platforms name you and for which questions, then changing the approach rather than repeating it.",
        ],
      },
      {
        q: "Watch who is being cited instead of you",
        a: [
          "In an AI answer there is no second page, so the only useful question is who is named and why.",
          "Tracking the sources your market's answers cite, and closing the specific gap that puts them there.",
        ],
      },
      {
        q: "Measure enquiries, not mentions",
        a: [
          "Being cited is not the point. Being cited by the people who then get in touch is.",
          "Reporting that ties visibility in AI answers back to enquiries per market, so the work is judged on what it brought in.",
        ],
      },
    ],
    sections: [
      "Answer-shaped content: claims a model can quote and cite",
      "Schema and structured data built for AI retrieval, not just crawlers",
      "Presence across ChatGPT, Perplexity, Claude and Google AI Overviews",
      "Citation tracking: which platforms name you, for which queries",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "Why citation, not just ranking, is now the target",
        paragraphs: [
          "A user who asks ChatGPT or Perplexity a question gets a direct answer with a small number of sources named inside it. Ranking on page one of Google no longer guarantees a mention inside that answer, because the model is selecting a handful of sources it judges citation-worthy, not listing every page that matches the query.",
          "The pages that get named tend to share a shape: a clear, quotable claim near the top, structured data that tells a crawler exactly what the page is, and a consistent way of naming the same entity, the same business name and the same service name, across every place that entity appears online.",
        ],
      },
      {
        heading: "What being cited actually takes",
        paragraphs: [
          "Content restructured around answer-shaped claims a model can quote directly, rather than long paragraphs a model has to summarise and risks summarising wrong. Schema and structured data built specifically for AI retrieval, not just for a search engine crawler, alongside a consistent presence across the platforms people actually ask: ChatGPT, Perplexity, Claude, Google AI Overviews.",
          "Citation tracking monitors which platforms name the site for which queries over time, since this is measurable now in a way it was not two years ago, and the tracking data feeds directly back into which pages get the answer-shaped treatment next.",
        ],
      },
    ],
    demand: {
      volume: 55000,
      kd: "39 to 70",
      note: "Sums `generative engine optimization` (26,000 worldwide, KD 70), `answer engine optimization` (13,000, KD 39) and `geo seo` (16,000, KD 63). Unlike the language markets, all three sit at real difficulty, and `generative engine optimization` carries the highest cost per click measured for any service page.",
    },
  },
  // ---- Cluster 5: supporting capability ----
  {
    slug: "technical-seo",
    name: "Technical SEO",
    inline: "technical SEO",
    h1: "Technical SEO services for multilingual websites",
    subhead: "The work that stops your language versions competing with each other for the same buyers.",
    cluster: "Supporting",
    angle: "Crawlability and hreflang, noticed only when broken",
    lede: "Your French pages and your German pages can end up competing with each other instead of adding up. We find out whether it is happening on your site, and fix what is causing it.",
    metaTitle: "Technical SEO services for multilingual websites",
    metaDescription: "Your language versions can compete with each other instead of adding up. See how we find out whether it is happening on your site, and what it takes to fix.",
    sections: ["What actually blocks a multilingual site", ...ENGAGEMENT],
    body: [
      {
        heading: "What quietly caps a multilingual site's visibility",
        paragraphs: [
          "Hreflang tags that are missing, point in circles, or carry the wrong language code send a French visitor to the Spanish version and a Spanish visitor to the French one, and Search Console reports a mess that takes longer to untangle after the fact than to configure correctly from the brief.",
          "A sitemap that is not split by language, or crawl budget spent on thin, near-duplicate pages instead of the pages actually worth ranking, quietly caps how much of a multilingual site Google bothers to index at all. The fix is unglamorous, structural, and easy to skip until traffic plateaus for no visible reason.",
        ],
      },
      {
        heading: "The unglamorous work underneath the rankings",
        paragraphs: [
          "On-page work aligns headers, internal linking and semantic HTML with real search intent rather than with a keyword stuffed into a title tag. Keyword research measures actual demand and decision-stage language across search engines and AI-driven platforms, not just search volume in isolation, since a high-volume term with the wrong intent produces traffic that never converts.",
          "Link building stays white hat throughout: editorial links, resource page placements and guest posts on sites with real traffic and real editorial standards, never a private blog network or a bought link from an unrelated market. Domain rating and the diversity of referring domains matter more over a longer period than any single placement.",
        ],
      },
    ],
    expandablesHeading: "The five jobs technical SEO holds together",
    expandablesLede:
      "Keyword research, on-page work, analytics, English-language search and link building.",
    expandables: [
      {
        q: "Keyword research measures demand, it does not collect keywords",
        a: [
          "A list of terms sorted by volume tells you what is typed, not who is buying. The useful version reads how people phrase the problem, how they compare options and what they type once they have decided, and sorts the work by decision stage rather than by search volume.",
          "It also has to account for where the answer appears now. A query that resolves in an AI summary or a zero-click result needs content shaped to be quoted, not a page built to win a click that is no longer on offer. A high-volume term with the wrong intent is the most expensive thing on a content calendar.",
        ],
      },
      {
        q: "On-page work is structure before it is wording",
        a: [
          "Keyword mapping tied to real intent, a header hierarchy that reflects the argument rather than decorating it, semantic HTML, internal links that point at the page that should actually rank, and a page fast enough that none of the rest is wasted.",
          "Most on-page problems on a multilingual site are one page competing with another for the same query in the same language, which no amount of rewriting either page will fix.",
        ],
      },
      {
        q: "Analytics is the part that makes the rest arguable",
        a: [
          "GA4 and Google Tag Manager configured so events mean something, conversions defined as the thing you actually want rather than any form submission, and traffic split by market so one language cannot hide inside another's numbers.",
          "Set up after the fact, it answers questions about last month. Set up first, it decides what to do next month.",
        ],
      },
      {
        q: "Link building, and what we will not do",
        a: [
          "Editorial links, resource page placements and guest posts on sites with real traffic and real editorial standards. No private blog networks, no link farms, no bought links from an unrelated market: they are cheap because they are a liability with a delay on it.",
          "What moves the needle is the topical relevance of the linking domain, a spread of referring domains rather than a spike, and anchor text that reads like something a person wrote. One good placement outlasts fifty that were bought together.",
        ],
      },
      {
        q: "English is a market too, and usually the neglected one",
        a: [
          "A company running French, German and Spanish properly will often leave its English pages as the originals nobody revisited, which is odd given English is frequently the highest-volume market of the set.",
          "It also has to pick a variant. British and American English differ in spelling, vocabulary and the terms people actually search with, and hedging between them produces copy that reads slightly wrong on both sides.",
        ],
      },
    ],
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building"],
  },
  {
    slug: "content-marketing",
    name: "Content marketing",
    inline: "content marketing",
    h1: "Content marketing services built from search demand",
    subhead:
      "Research first, so the pages you publish answer a question buyers are already asking rather than filling a slot in a calendar.",
    cluster: "Supporting",
    angle: "Demand first, calendar second",
    lede: "You are publishing steadily and the enquiries have not moved. Nine times out of ten the calendar was built from what the business wanted to say, rather than from what its buyers are out looking for.",
    metaTitle: "Content marketing services built from search demand",
    metaDescription:
      "Publishing steadily while enquiries stay flat usually means the calendar came from the business rather than from its buyers. See what changes when research comes first.",
    sections: ["Where a publishing calendar loses the thread", ...ENGAGEMENT],
    body: [
      {
        heading: "What a content programme is actually made of",
        paragraphs: [
          "Content strategy services are the half that decides whether the rest pays: which questions the business can credibly answer, which of those carry commercial intent, what already exists and can be rewritten rather than replaced, and the order it all gets published in. Deciding that first is what stops a programme becoming a list of articles nobody commissioned for a reason.",
          "Content creation services are the other half, and they are a writing problem before they are a volume problem. A page earns its place by answering one question better than the pages already ranking for it, which takes a writer who understands the subject and an editor willing to reject a draft that merely covers the topic.",
          "Measurement sits underneath both. A programme reports on what it produced, an engagement reports on what the production earned, and the gap between those two numbers is the whole argument for doing the research first.",
        ],
      },
      {
        heading: "What search-led content changes",
        paragraphs: [
          "SEO content services and content marketing are often sold as separate things, and treating them separately is how a business ends up with pages that rank for nothing and pages nobody wanted to read. The research says which subjects have demand, the writing decides whether the page deserves the position, and neither half works alone.",
          "Demand research also tells you what not to write. A subject with no measurable search behind it can still be worth publishing, for a sales conversation or a newsletter, but it should be commissioned knowingly rather than because it filled a Tuesday.",
        ],
      },
      {
        heading: "Where this stops and the multilingual page starts",
        paragraphs: [
          "Everything above holds in one language. Run the same programme in three and a second set of decisions appears: the keyword set does not survive translation, the cluster shape differs by language, and trust signals have to exist in each one rather than once on the English site. Multilingual content marketing covers that ground, and the two pages are deliberately not the same page.",
          "Most of the companies we do it for are B2B, which changes the brief more than the language does. A B2B content marketing agency is writing for a committee and a long cycle, so the page that earns the enquiry is usually the one answering the objection rather than the one introducing the subject.",
        ],
      },
    ],
    expandablesHeading: "The questions that come up before the first brief",
    expandablesLede:
      "What the research decides, what the writing decides, and where the two get confused.",
    expandables: [
      {
        q: "Volume is a starting point, not an instruction",
        a: [
          "A term with a large number beside it can still be the wrong subject for a business, either because the people searching it are not buyers or because the pages already ranking are ones no newcomer displaces for two years. Both are visible before anything is commissioned, and both are cheaper to find then.",
          "The terms worth taking first are usually the ones where the demand is real and the pages currently answering it are thin. Difficulty scores are an approximation of that, and reading the results themselves is the part that cannot be skipped.",
        ],
      },
      {
        q: "Rewriting usually beats publishing",
        a: [
          "Most sites arrive with pages that already rank somewhere in the second or third page of results for a term worth having. Lifting one of those is faster and more certain than starting a new page from nothing, and it costs a fraction of the words.",
          "The instinct to publish something new is strong because new work is visible. An audit that returns fewer new pages than expected is usually the one doing its job.",
        ],
      },
      {
        q: "Cadence matters less than most calendars assume",
        a: [
          "Publishing weekly is a production decision dressed as a strategy. What moves is whether each page is the best answer to its question, and a business that ships one strong page a month will overtake one shipping four that merely exist.",
          "A cadence is still worth setting, because work without one drifts. It just should not be the number the programme is judged on.",
        ],
      },
      {
        q: "Where we stop",
        a: [
          "We do not run social accounts, design campaign creative or buy media, and we do not place links on sites that sell them. Writing, research, structure and the reporting around them is the whole of it.",
          "Where a language we do not write in is involved, the writing goes to a native copywriter from the BeTranslated network and we brief and review it, which is the same arrangement the language pages describe.",
        ],
      },
    ],
  },
  {
    slug: "multilingual-content",
    name: "Multilingual content",
    inline: "multilingual content",
    headingTerm: "multilingual content marketing",
    h1: "Multilingual content marketing written per market",
    subhead: "Written in the target language against that market's own research, rather than translated from a page optimized for a different one.",
    cluster: "Supporting",
    angle: "Written per market, not translated",
    lede: "Your Spanish page is a translation of your English one, so it answers the question an English buyer asks. Spanish buyers phrase the problem differently, and they are out looking for the other version.",
    metaTitle: "Multilingual content marketing, written per market",
    metaDescription: "A Spanish page translated from English answers the question an English buyer asks. Multilingual content is researched and written for the market reading it.",
    sections: ["Why translated copy underperforms written copy", ...ENGAGEMENT],
    body: [
      {
        heading: "Why a translated keyword set misses the market",
        paragraphs: [
          "The keyword set that works in English rarely survives translation into the one that actually gets searched in Spanish or French, because the way people phrase a problem shifts with the language, not just the words. Copy translated from an English draft ends up optimized for a search pattern nobody in the target market actually uses.",
          "E-E-A-T signals, expert authorship, verifiable sources, genuine testimonials, need to exist per language, not just once on the English homepage, because a reader and a search engine both judge trustworthiness locally, from what they can actually verify in front of them.",
        ],
      },
      {
        heading: "What international content marketing covers, cluster by cluster",
        paragraphs: [
          "Content researched and written per market with native keyword localization, hreflang and canonical setup handled at the structural level, and schema (Article, FAQPage, LocalBusiness as relevant) implemented per language to support rich results. Cultural consulting sits underneath the copy itself, checking messaging and tone against local values before publication rather than after a complaint.",
          "Social platform choice follows the audience rather than habit: Facebook and Instagram cover many markets, but WeChat matters more in China and VK more in Russia, and a content plan that assumes one platform set fits every market misses the audience it was meant to reach.",
        ],
      },
    ],
    expandablesHeading: "What travels between languages and what does not",
    expandablesLede:
      "The copywriting, the cultural fit and the social side, and where each one stops travelling.",
    expandables: [
      {
        q: "Topic clusters have to be built per language, not mirrored",
        a: [
          "A cluster that works in English is a map of how English speakers break a subject down. Another language often breaks it down differently, splits one of your topics into two, or merges two into one because the distinction does not exist there.",
          "Mirroring the English structure gives you pages nobody in that market is looking for, linked to each other in a shape that matches no local search behaviour. Building the cluster from that language's own queries takes longer and is the only version that ranks.",
        ],
      },
      {
        q: "Experience and expertise have to be visible in each language",
        a: [
          "Google's quality signals are not translated along with the copy. An author with a real name and real credentials, dates, citations to sources that market recognises, and a business identity a local reader can verify all have to exist in the language being read.",
          "A page that cites only English-language authorities to a German reader is asking them to take your word for it twice.",
        ],
      },
      {
        q: "The parts of a page that get forgotten in the second language",
        a: [
          "Meta titles and descriptions written natively rather than translated to an English character budget, internal links that point at the same-language version, schema carrying the localized values, and hreflang that actually resolves both ways.",
          "Each one is invisible to a reader skimming the translated page and obvious to a crawler, which is why a site can read perfectly in four languages and rank in one.",
        ],
      },
      {
        q: "Cultural fit is a risk register before it is a style choice",
        a: [
          "Most of the value is in what gets caught rather than what gets added: a colour, a gesture, a comparison or a claim that reads as ordinary in one market and as careless in another. Checking that before publication is cheap and after publication is not.",
          "The rest is tone. How direct a market expects a commercial page to be varies more than most companies assume, and a voice that reads as confident in one place reads as pushy in the next.",
        ],
      },
      {
        q: "Social is a different platform mix in every market",
        a: [
          "The network that carries your audience in one country may be a minor one in another, and posting the same calendar everywhere means being early in one market and invisible in the rest. Timing, format and what counts as an acceptable tone all shift with it.",
          "Platform rules and local advertising law shift too, so a campaign that is fine in one jurisdiction can need changing in another before it runs rather than after somebody complains.",
        ],
      },
    ],
    absorbs: ["multilingual-seo-copywriting", "cultural-consulting", "multilingual-social-media-management"],
  },
];

export const CLUSTERS = ["Lead generation", "Search", "Localization", "AI", "Supporting"] as const;

/**
 * Heading form of each cluster, for the `h2` on /services/.
 *
 * The array above stays as it is because `Service.cluster` matches those
 * strings, so it is a key rather than a label. Same split as
 * `Service.name` and `Service.h1`: a key wants to be short and a heading
 * wants to say something.
 *
 * Two faults in the bare keys, beyond their being one word each. "Search"
 * headed eight pages covering six languages plus local and multilingual,
 * which is the largest group on the page and was the least described. And
 * "Supporting" is our own taxonomy, from `pillar` in the Service type,
 * meaning a page that supports a query network rather than owning one.
 * A reader does not have query networks. It is the fault the H1 audit
 * called copy that comments on the website rather than the work.
 *
 * "Services" is worked in where the phrase is one people search and where
 * it reads, not stamped on all five: `lead generation services` draws
 * 11,000 a month and `localization services` 2,800. Nothing here repeats
 * a service page's own primary keyword exactly, so the index frames the
 * pages rather than competing with them.
 */
export const CLUSTER_HEADING: Record<string, string> = {
  "Lead generation": "Lead generation services",
  Search: "SEO services per language and market",
  Localization: "Localization and translation services",
  AI: "AI services for search and language",
  Supporting: "Technical and content services",
};

/** Mid-sentence form of each cluster, for the same reason as Service.inline. */
export const CLUSTER_INLINE: Record<string, string> = {
  "Lead generation": "lead generation",
  Search: "search",
  Localization: "localization",
  AI: "AI",
  Supporting: "supporting",
};

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
