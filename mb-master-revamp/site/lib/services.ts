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
   * Display title for the services index cards and the social card image.
   * `name` stays the short nav and footer label, but shown as a card
   * heading it read as a bare exact-match keyword ("French SEO"), so the
   * cards carry a longer phrase that still leads with the term (owner,
   * 27 Sep 2026).
   */
  cardTitle?: string;
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
  body?: {
    heading: string;
    paragraphs: string[];
    /**
     * An optional branded illustration for this section, shown beside the
     * text at desktop width and above it on mobile. Files live in
     * `public/images/sections/`. Most body sections carry no `art`; add it
     * only where a real illustration exists, so the layout falls back to
     * the plain single-column read everywhere else.
     */
    art?: { src: string; alt: string };
  }[];
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
  demand?: { volume: number; kd: string; note: string; measured?: string };
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
    cardTitle: "Lead generation services for companies selling abroad",
    inline: "multilingual lead generation",
    h1: "B2B lead generation services for companies selling abroad",
    subhead: "Your other markets already send you visitors. We turn them into enquiries worth a sales call, and show which market each one came from.",
    cluster: "Lead generation",
    pillar: true,
    angle: "Counted in enquiries",
    lede: "Traffic arrives in French, German and Spanish, and the enquiries still arrive in English. One client's Search Console showed forty thousand impressions in ninety days, and six clicks.",
    metaTitle: "B2B lead generation services across every market",
    metaDescription: "Your other markets already send visitors. We turn them into leads worth a sales call, counted per market. Book a free consultation.",
    sections: ["What a report per market shows you", "What we do in each market", "How it is billed", "The evidence", ...ENGAGEMENT.slice(3)],
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
    cardTitle: "International PPC run separately per market",
    inline: "multilingual SEM",
    headingTerm: "international PPC",
    h1: "International PPC agency running paid search per market",
    subhead: "Your whole media budget buys ads, straight from Google, Microsoft or Meta, so the budget we recommend is the one that brings in enquiries.",
    cluster: "Lead generation",
    angle: "International PPC, buying reach while search builds it",
    lede: "Reach buyers in the language they search in while your organic rankings build, with every market on its own budget and judged on its own results.",
    metaTitle: "International PPC agency, paid search per market",
    metaDescription: "International PPC that reaches buyers in the language they search in. Each market runs on its own budget, and your whole media spend buys ads.",
    sections: ["Three things we build into every ad account", ...ENGAGEMENT],
    body: [
      {
        heading: "Where native campaigns earn their budget back",
        paragraphs: [
          "A campaign researched in each market uses the keywords, ad copy structure and bidding approach of the people searching there, and it shows in the results: a higher quality score because the terms match how people actually search in that language.",
          "A planning tool supplies the volume; the intent comes from checking the actual search results in the target market and validating terms with native speakers before any bid goes live.",
          "Each market gets its own conversion tracking, attribution and KPI report, so you can see which language is profitable and where the spend should move next.",
        ],
      },
      {
        heading: "The platforms, the copy and the tracking, per market",
        paragraphs: [
          "Google Ads carries the default budget. Bing Ads earns its place with a US B2B audience still on the Microsoft ecosystem. Meta covers B2C reach, LinkedIn covers B2B targeting in specific verticals. Distinct campaigns or ad groups run per market, with separate budgets and bidding strategies.",
          "Headlines, descriptions and creative are written natively per language. Landing pages are dedicated per market wherever the budget allows, and conversion tracking runs through GA4 and GTM with CRM sync, so every lead is followed past the click to a qualified result.",
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
        q: "Separate accounts per market, so each one earns its own quality score",
        a: [
          "Google scores relevance per account and per campaign, so each market does best on a history of its own. Splitting by language, and by country domain where you run several, keeps each market's score earned by its own performance.",
        ],
      },
      {
        q: "Paid first, organic first, or both",
        a: [
          "Paid first when you need pipeline now, when the offer is new enough that you want a demand signal before committing to content, or when organic will take the better part of a year to mature in that market. Organic first when clicks in your sector cost more than paid can recover, or when your buyers research for months before they get in touch.",
          "Both together is the common answer: paid takes the commercial-intent queries while organic builds, and the paid budget moves to less contested markets or non-brand terms as organic starts carrying them. The two share one keyword universe and, where it makes sense, one set of landing pages, so each one informs the other.",
        ],
      },
      {
        q: "Who runs which language",
        a: [
          "French, English, Spanish and Dutch run directly here, which means the keyword research, the ad copy and the search-term reports are read in the language itself. German, Italian, Portuguese and the rest go to native speakers on the BeTranslated team, briefed and reviewed the same way the organic content is.",
          "A negative keyword list is built by reading what people actually typed, which takes someone fluent in the language to tell a promising query from an irrelevant one.",
        ],
      },
      {
        q: "How the billing is structured",
        a: [
          "Your whole media budget buys ads: it goes straight to Google, Microsoft or Meta, and management is a separate fee. So the budget we recommend is the one that brings in enquiries.",
          "Keeping the two apart ties our incentive to whether the campaigns work. The principle covers media spend; writing and translation are quoted as a price for the work.",
        ],
      },
    ],
  },
  {
    slug: "conversion-tracking",
    name: "Conversion tracking",
    cardTitle: "Conversion tracking measured per market",
    inline: "conversion tracking",
    h1: "Conversion tracking measured per market",
    subhead: "Measurement that shows which language earns the enquiry, with a clear figure for every market on the site.",
    cluster: "Lead generation",
    angle: "The evidence layer, per locale",
    lede: "You can see which markets bring traffic. Tracking per market answers the next question: which of those French visitors turn into customers.",
    metaTitle: "Conversion tracking services per locale",
    metaDescription: "See which language earns your enquiries. Conversion tracking set up for each market, so every language has its own figure and sales and analytics agree.",
    sections: ["What a separate number per market shows", ...ENGAGEMENT],
    body: [
      {
        heading: "What per-market reporting tells you",
        paragraphs: [
          "The report shows at a glance which market converts and which mainly brings traffic.",
          "Per-locale tracking works best with distinct goals, events and conversion definitions set up from the start. A form submission, a call click and a quote request are each tracked the same way in every language, so the numbers stay comparable.",
        ],
      },
      {
        heading: "What actually gets set up, per locale",
        paragraphs: [
          "GA4 and Google Tag Manager configured per locale, with key events (form submissions, downloads, calls, cart actions for stores) defined once and applied consistently across languages. Google Ads conversion tracking is wired to the same event definitions, so the campaign report and the analytics report agree on every enquiry.",
          "Where sales pass through a CRM, offline conversion tracking sends the closed outcome back to GA4 and Google Ads, so a lead is measured through to a qualified result. Bidding then runs on what a market is worth.",
          "Reporting is reviewed on a fixed cadence, typically monthly. A change in any market's conversions shows up in the data months before it reaches the sales pipeline.",
        ],
      },
    ],
    expandablesHeading: "How to make the numbers match what sales sees",
    expandablesLede:
      "The four settings that line up a multilingual site's conversion report with the enquiries sales actually receives.",
    expandables: [
      {
        q: "Consent mode changes what you can measure, and it changes per market",
        a: [
          "In the EU every visitor counts, including those who decline cookies, and what reaches your analytics from them depends on how consent mode is configured. Consent rates differ sharply by country, so two markets with identical real performance can report very differently.",
          "So compare markets alongside each one's consent rate, and you rank your languages on what their visitors do.",
        ],
      },
      {
        q: "A conversion has to be the thing you actually want",
        a: [
          "A raw count of form submissions includes the spam, the test entries and the person who wanted a job. Filter those out and the market's figure matches what the sales team sees arrive.",
          "The definition worth using is the one your own people recognise: an enquiry that became a conversation.",
        ],
      },
      {
        q: "Attribution across languages needs its own rules",
        a: [
          "A visitor who lands on the English page, switches to French and converts belongs to one market, and which one depends on rules somebody chooses. Set those rules deliberately and each switcher is counted once, in the right language.",
        ],
      },
      {
        q: "The CRM is where a lead becomes a customer",
        a: [
          "Syncing conversion data through to the CRM is what lets a market be judged on the quality of what it sent.",
          "It also finds the market where plenty converts and little closes, which points to a positioning question dressed as an analytics one.",
        ],
      },
    ],
  },

  // ---- Cluster 2: multilingual search, the engine ----
  {
    slug: "multilingual-seo",
    name: "International SEO",
    cardTitle: "Multilingual SEO and GEO across every market you sell in",
    inline: "international SEO",
    headingTerm: "multilingual SEO",
    h1: "Multilingual SEO and GEO agency for companies already selling abroad",
    subhead: "Search run across several markets at once, so the languages you already publish in start producing enquiries too.",
    cluster: "Search",
    pillar: true,
    angle: "The engine underneath the outcome",
    lede: "You already sell abroad, and your markets outside English have more to give. We run the strategy and brief native writers per market, so each language earns enquiries as well as traffic.",
    metaTitle: "Multilingual SEO agency for companies selling abroad",
    metaDescription: "Selling abroad and want more from your other languages? Each one gets its own strategy, its own native writing and its own enquiry count.",
    sections: [
      "What makes an international SEO project work",
      "What we include in an international SEO engagement",
      "Our process in five steps, named deliverables",
      "Case studies",
      "What is included, and where our work stops",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "Three patterns we check in every audit",
        paragraphs: [
          "Pages written natively hold up on three fronts: search engines treat them as original content, AI engines tend to cite them ahead of machine translation, and native readers stay to read them.",
          "We check that hreflang tags sit on every page, the homepage included, point back to each other and carry the right language code. Built correctly the first time, they show each visitor the language version for their country, keep conversions where they belong and give Search Console a clean report.",
          "Slugs, internal links, schema and keyword targets are agreed per language before the first page goes live, so French published now and Spanish added six months later share one structure.",
        ],
      },
      {
        heading: "What goes into the engagement",
        paragraphs: [
          "A global SEO programme starts with native research in each target language, covering real commercial intent and long-tail phrasing per market. Subdirectory, subdomain or ccTLD gets a reasoned recommendation for your case, with hreflang, sitemaps and Search Console geo-targeting configured per language from the start.",
          "An international SEO specialist earns the fee on the decisions that are expensive to undo later: the domain structure, the hreflang map and the order the markets go in. Writing runs fluent and direct for French, English, Spanish and Dutch, and through native copywriters from the BeTranslated network for German, Italian, Portuguese and other languages. LocalBusiness, Service, Article and FAQ schema is built per language and validated on Google's Rich Results tool, and the same work extends to how ChatGPT, Claude, Perplexity and AI Overviews answer in each language.",
        ],
      },
      {
        heading: "Three cases where the multilingual scope was the whole challenge",
        paragraphs: [
          "BeTranslated, the translation agency we have run for twenty years, runs twelve country-specific domains with WPML across all of them, cross-domain hreflang, native content per market from the in-house translator team and schema localized per country. The result has been consistent organic ranking across several European markets and AI citations in each target language for translation services queries.",
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
        q: "Four markets done properly outrank nine launched at once",
        a: [
          "The brief that arrives most often asks for English, French, Spanish, German, Italian, Portuguese, Dutch, Japanese and Chinese from day one. Four markets done properly beat nine launched together every time we have compared them: the four get the depth to rank, where nine at once come out thin and often machine-translated.",
          "Expansion runs in waves: a first wave of three or four markets where the evidence is strongest, and a second wave that stays a test until the first shows traction.",
        ],
      },
      {
        q: "How a market earns its place in the first wave",
        a: [
          "Candidate markets, usually eight to twelve at the start, get scored on five things: search volume, competitive difficulty, commercial fit with what you actually sell, the cost of localizing for them, and the regulatory load they bring with them.",
          "The output is a ranked list that settles the order on evidence, and the scoring often puts first a different market from the one someone in the room feels strongly about. A decision point around the half-year mark says which test markets get promoted and which get dropped.",
        ],
      },
      {
        q: "ccTLD, subdomain or subdirectory, at portfolio scale",
        a: [
          "The choice turns on budget, how much authority you can afford to split, and how much a local buyer needs to see a local domain before they trust you. A ccTLD per market is the strongest local signal and the most expensive thing to maintain. A subdirectory keeps the authority in one place and is the right default for most companies adding markets to an existing business.",
          "Decide it once, early: a slightly imperfect choice at the start costs less than a move later.",
        ],
      },
      {
        q: "Localization goes past translation, and the keyword proves it",
        a: [
          "A removalist in Australia is a removals company in the UK, and London searches for the second word. A translation gives the correct term; localization gives the one people type. The same care runs through currency, units, legal references, payment methods, trust badges and the customer names you cite as proof.",
          "Regulatory framing changes with it: GDPR in the EU, CCPA in California, LGPD in Brazil. Quote the one your reader lives under and the page reads as written for them.",
        ],
      },
      {
        q: "The technical floor that lets good content rank",
        a: [
          "Hreflang validated per market, a sitemap split by language, slugs translated into each language, and schema localized per country. Broken or circular hreflang is the single most common finding in the audits we run, and fixing it lifts the ceiling on everything above it.",
          "Use geo-IP for soft suggestions only, and let visitors choose their version. Every version then stays visible to the crawler and within reach of anyone travelling, which is a lot of the business audience.",
        ],
      },
      {
        q: "Links and citations are earned country by country",
        a: [
          "A backlink from local press, a sector association or a regional directory in the target country is worth considerably more than a generic international link, because relevance in international search is geographic as well as topical.",
          "The same now applies to AI answers. Which sources get cited varies by country and by language, and each has its own knowledge graph behind it.",
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
    cardTitle: "French SEO and GEO for buyers in France",
    inline: "French SEO",
    h1: "French SEO and GEO agency for companies selling into France",
    subhead: "Researched and written in French from the first word, so buyers in France, Belgium and Switzerland read a supplier they can trust with the enquiry.",
    cluster: "Search",
    angle: "SEO France, from the outside in",
    lede: "You have French pages and French visitors, and the market has more enquiries to send you. A French buyer compares suppliers before contacting any of them, and the shortlist goes to sites that read as written in French.",
    metaTitle: "French SEO agency for companies selling into France",
    metaDescription: "French buyers know in one sentence whether a page was written in French. We research and write your French pages natively, so French visits become enquiries.",
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
        heading: "What a site written in French wins you",
        paragraphs: [
          "A French buyer shortlists the way yours do: read a few sites, compare them, contact one or two. Within the first sentence they know whether a page was written in France: the word a French writer would choose, the right register, an example that makes sense to them.",
          "Your reports show the French traffic arriving; the enquiry itself is decided on the page, often in favour of a French competitor with a weaker product and better French.",
          
        ],
      },
      {
        heading: "French SEO written in French from the start",
        paragraphs: [
          "We research what French buyers actually type, in French and market by market. Their words are often different from yours: a British buyer searches for SEO, while a French one often types “référencement naturel”, so a site that uses both reaches them.",
          "French runs directly here. The research, the page copy and the reading of what French visitors do are all handled in French by the people setting the strategy.",
          "Then the things that make a French buyer trust a new supplier: a Google Business Profile in French, listings in the French directories your sector uses, reviews from French customers, and mentions in the French trade press.",
        ],
      },
      {
        heading: "Most searches for French SEO come from companies outside France",
        paragraphs: [
          "500 of the 700 monthly searches worldwide for a French SEO agency come from the UK (Ahrefs, September 2026), and Dutch and German companies search for SEO in France in their own languages.",
          "So the typical buyer is a company outside France selling into it. You write the brief in English, Dutch or French, and the work is done in French.",
        ],
      },
      {
        heading: "French sites we run for ourselves and for clients",
        paragraphs: [
          "BeTranslated, the translation agency we have run for twenty years, has its French site on its own .fr domain, with keyword research done specifically for France.",
          "Matosurf is our own French board sports site: a hundred and twenty guides to forty-eight French spots, written in French for French riders.",
          "For Delaguía y Luzón, a Valencia law firm working across Spain and France, the French pages are held to the standard a French lawyer would apply when reading them, because in legal content precise terms matter for liability first and for rankings second.",
        ],
      },
    ],
    expandablesHeading: "What French SEO turns on, market by market",
    expandablesLede:
      "The parts of the job that are specific to French.",
    expandables: [
      {
        q: "Which domain shape to use for France",
        a: [
          "A .fr domain reads as French to a French buyer and to Google. A subdirectory under an existing domain is easier to run and inherits the authority already built, so it usually wins for a company adding French to an existing business.",
          "On a .com or another generic domain, set the geotargeting in Search Console so Google has it stated. Offer visitors the choice of version, and let hreflang carry the relationship: the French speaker abroad and the English speaker in Paris each land where they want, and a crawler sees every version.",
        ],
      },
      {
        q: "Accents, and the queries that drop them",
        a: [
          "French is written with accents and searched both ways. Plenty of people type référencement, plenty type referencement, and on a phone keyboard the unaccented form wins more often than a French brand would like to admit.",
          "Both forms belong in the research, and the page has to be reachable on either. Writing the accented form correctly in the copy and letting the unaccented query find it anyway is the target.",
        ],
      },
      {
        q: "French runs longer than English",
        a: [
          "French usually runs longer than the English it replaces, so a title tag and meta description sized in English and then translated run past the snippet length.",
          "Write them natively to the French limit, and the whole phrase shows in the result that has to win the click. The same expansion shows up in navigation labels and buttons.",
        ],
      },
      {
        q: "One language, four markets",
        a: [
          "France, Belgium, Switzerland and Quebec share the language, and each has its own habits. A Swiss buyer reads prices in CHF, search habits differ, and the register that sounds right in Paris sounds imported in Montreal.",
          "Where more than one is genuinely in scope, fr-FR, fr-BE, fr-CH and fr-CA keep them apart, so each version ranks in its own country. Where only France is in scope, a single French version targeted at France is the setup.",
        ],
      },
      {
        q: "Where the searching actually happens",
        a: [
          "Google carries the French market, so the optimization effort goes there.",
        ],
      },
      {
        q: "Belgium: two languages, one buyer",
        a: [
          "A Belgian company usually needs French and Dutch side by side, and a Belgian buyer notices which of the two was written first. Writing each language natively wins both halves of the country.",
          "French and Dutch both run directly here, so a Belgian site gets one strategy in two languages, from one team working to one brief. The fr-BE and nl-BE versions stay apart from the French and Dutch sites aimed at France and the Netherlands.",
        ],
      },
      {
        q: "French SEO or French translation first",
        a: [
          "Research first, every time. Research puts the French terms buyers search for into the brief the translator works from, so the page is right first time.",
          "Where the translation is already done, the audit shows which pages are worth rewriting around French search and which can stay as they are. Usually it is a handful of pages.",
        ],
      },
    ],
    gsc: { impressions: 3093, position: 43.7, keywords: 40 },
    demand: {
      volume: 2700,
      kd: "3 to 6",
      note: "Most of it comes from outside France: 500 of the 700 monthly searches for `french seo agency` come from the UK, and Dutch and German searches for SEO in France add to it.",
      measured: "23 September 2026",
    },
  },
  {
    slug: "german-seo",
    name: "German SEO",
    cardTitle: "German SEO and GEO for the German market",
    inline: "German SEO",
    h1: "German SEO and GEO agency for companies expanding into Germany",
    subhead: "Strategy agreed with you in English or French, every German page written by native German copywriters, so buyers in Germany, Austria and Switzerland read a supplier that sounds local.",
    cluster: "Search",
    angle: "SEO Germany, planned with you, written by Germans",
    lede: "Your German pages already bring visitors; the next step is turning them into enquiries. A German buyer reads the whole page, checks who is behind it, and gets in touch when the German sounds native and the company details they expect are all there.",
    metaTitle: "German SEO agency for companies expanding into Germany",
    metaDescription: "German buyers read every word and trust German that sounds native. Strategy agreed with you, German by native copywriters, so visits turn into enquiries.",
    // Research, 23 Sep 2026 (Ahrefs GB, NL and worldwide, plus this page's
    // own Search Console for 24 Mar to 20 Sep 2026). The demand is spread
    // across Europe rather than concentrated in the UK: 150 of the 1,000
    // monthly searches for `german seo` are British, the Dutch search
    // `duitse seo` (200) and `seo duitsland` (150), and the page collects
    // impressions in Spanish, Italian, Dutch, French and the Scandinavian
    // languages. So the h1 names the buyer, a company expanding into
    // Germany, the same shape as the French page.
    sections: [
      "An audit of your German pages against three direct German competitors",
      "Keyword research in German, by native speakers, market by market",
      "A strategy and editorial calendar agreed with you in English or French",
      "German pages written by native copywriters and read by a second native before they go live",
      "Impressum, privacy policy and opt-in consent set up the way a German buyer expects",
      "Monthly reporting on German enquiries, in English or French",
    ],
    body: [
      {
        heading: "What a German site that reads as local wins you",
        paragraphs: [
          "German buyers read. They go through the page, compare it with two or three others, and look for the company details before they trust anyone with an enquiry. By the first paragraph they know whether it was written in German: compound words built the way a German builds them, a register that holds steady in Sie or du, examples that make sense in Germany.",
          "Company details count just as much, and sooner. A German site is expected to carry a full Impressum with the register entry and tax number, and a proper opt-in for cookies.",
          
        ],
      },
      {
        heading: "Planned with you, written by native Germans",
        paragraphs: [
          "German SEO needs two skills at once. One is the plan: which pages, which searches, which market first, and how the site is set up. The other is German that a native reads as their own. We do the first with you directly, in English or French, and native German copywriters do the second.",
          "Then the details a German buyer checks before trusting a supplier: the Impressum, the privacy policy, a German phone number where you have one, listings in German trade directories and with the local chamber of commerce, and mentions in the German trade press.",
        ],
      },
      {
        heading: "Companies all over Europe are looking for German SEO",
        paragraphs: [
          "Only 150 of the 1,000 monthly searches worldwide for German SEO come from the UK (Ahrefs, September 2026). Dutch businesses search for it in Dutch, and Spanish, Italian, French and Scandinavian companies look for it in their own languages.",
          "You work with us in English or French, and your German buyers read German.",
        ],
      },
      {
        heading: "Where the German writing comes from",
        paragraphs: [
          "The German is written by the native German translators and copywriters of BeTranslated, the translation agency we have run for twenty years. They have written German for clients selling into Germany, Austria and Switzerland for years, and they work from our briefs, written for the German page.",
          "Every page is read by a second native German before it goes live, and by your own team after that.",
        ],
      },
    ],
    expandablesHeading: "The questions a German buyer asks first",
    expandables: [
      {
        q: "Who actually writes the German",
        a: [
          "Native German copywriters, briefed and reviewed by us. We know enough German to manage SEO projects in it, from search results and competitor pages to briefs and meetings. Your German commercial copy is written by native Germans, because the register decides whether a German buyer trusts the page.",
        ],
      },
      {
        q: "How the German is checked when native writers draft it",
        a: [
          "The brief goes out in English or French with the keyword targets, the intent and the structure decided. A native German writer drafts it. A second native German reads it before it publishes, and your own people are the filter after that.",
        ],
      },
      {
        q: "Whether to split Germany, Austria and Switzerland",
        a: [
          "Germany carries most of the volume and is the default on its own: de-DE across the content, one architecture, and the focus kept on one variant. Adding de-CH on the commercial pages earns its place for premium B2B, where Swiss purchasing power and price expectations differ enough to be worth addressing directly.",
          "Full DACH is an editorial commitment and pays when the offer is relevant in all three. The recommendation comes at scoping, from what you sell.",
        ],
      },
      {
        q: "Swiss German is written as standard German with its own spelling",
        a: [
          "Swiss readers read standard German, so the copy stays as it is. The conventions differ: Swiss German writes Strasse for Straße, using ss throughout, prices in CHF, and its own phone formats.",
        ],
      },
      {
        q: "Where the compliance work hands over to a lawyer",
        a: [
          "We set up the technical side: a compliant Impressum, a privacy policy that holds up under German law, and consent that is a genuine opt-in.",
          "Legal questions, such as sensitive data, employee tracking and marketing profiling, are a German lawyer's work.",
        ],
      },
      {
        q: "German SEO or German translation first",
        a: [
          "Research first. Research puts the German terms buyers actually search for into the brief the translator works from, so the page is right first time.",
          "Where the German translation already exists, the audit shows which pages are worth rewriting around German search and which can stay. Usually it is a handful of pages.",
        ],
      },
    ],
    gsc: { impressions: 1938, position: 57.3, keywords: 38 },
    demand: {
      volume: 2350,
      kd: "0 to 1",
      note: "Only 150 of the 1,000 monthly searches for `german seo` come from the UK, and Dutch searches such as `duitse seo` add 200 more of their own.",
      measured: "23 September 2026",
    },
  },
  {
    slug: "spanish-seo",
    name: "Spanish SEO",
    cardTitle: "Spanish SEO and GEO for Spain and Latin America",
    inline: "Spanish SEO",
    h1: "Spanish SEO and GEO agency for companies selling in Spanish",
    subhead: "Spain run directly from Valencia, Latin America by native copywriters in Santo Domingo, so every Spanish-speaking buyer reads a page written for their own country.",
    cluster: "Search",
    angle: "SEO Spain and Latin America, one market at a time",
    lede: "Your Spanish pages are read in Madrid, Mexico City and Bogotá, and a buyer in each of them is convinced by Spanish written for their own country.",
    metaTitle: "Spanish SEO agency for Spain and Latin America",
    metaDescription: "Buyers in Madrid and Mexico City each trust Spanish written for them. Spanish SEO run from Valencia for Spain and by native writers for Latin America.",
    // Research, 23 Sep 2026 (Ahrefs US, GB and worldwide, plus this page's
    // own Search Console for 24 Mar to 20 Sep 2026). Unlike French and
    // German, the biggest single share of the English-language demand is
    // American: 500 of the 1,100 for `spanish seo` and 400 of the 800 for
    // `seo in spanish`. The page also collects `consultant seo espagnol`,
    // `seo spanien`, `spaanse seo` and `hire seo consultant in latin
    // america`. Two buyers, one question first: which Spanish.
    sections: [
      "A decision on which Spanish comes first: Spain, one Latin American country, or both",
      "Keyword research in each Spanish you target, by native speakers of it",
      "A strategy and editorial calendar per market, agreed with you in English, French or Spanish",
      "Spanish for Spain written directly from Valencia, Latin American variants by native copywriters in Santo Domingo",
      "The legal details each market expects, from the CIF or NIF in Spain to the RFC in Mexico",
      "Monthly reporting per market, so Spain and Mexico each get a number of their own",
    ],
    body: [
      {
        heading: "What a Spanish site per market wins you",
        paragraphs: [
          "Spanish from Spain reads as distant and formal in Mexico City. Latin American Spanish reads as casual in unexpected places in Madrid. A page run through machine translation reads as translated English everywhere. Each buyer trusts the supplier who sounds like one of them, and sends the enquiry there.",
          "The company details count just as much. A buyer in Spain expects to see a CIF or NIF, a buyer in Mexico an RFC, and prices in their own currency.",
        ],
      },
      {
        heading: "Spain from Valencia, Latin America from Santo Domingo",
        paragraphs: [
          "Spain runs directly from Valencia, where we have been based since 2016. The research, the writing, the reading of competitors and the meetings all happen in Spanish, straight from the plan to the page.",
          "Mexico, Colombia, Argentina and the Dominican Republic go to native copywriters on the BeTranslated team in Santo Domingo, briefed and checked here so the markets stay one coherent plan.",
          "We also earn mentions in the press each market reads, which buyers there check before they get in touch.",
        ],
      },
      {
        heading: "Spanish SEO is searched for from two directions",
        paragraphs: [
          "The largest single share of searches comes from the United States: 500 of the 1,100 monthly searches worldwide for Spanish SEO, and 400 of the 800 for SEO in Spanish (Ahrefs, September 2026). From the other direction, companies elsewhere in Europe look for help in Spain in French, German and Dutch.",
          "Whichever one you are, the first decision is the same: which Spanish, for which buyers.",
        ],
      },
      {
        heading: "Spanish sites we run and work on",
        paragraphs: [
          "Delaguía y Luzón is a Valencia law firm whose site leads in Spanish. Between May and July 2026 it drew 38,476 clicks from 2,399,567 Google impressions at an average position of 9.4, across the whole site.",
          "Century 21 Perdomo sells property in the Dominican Republic in four languages, Spanish among them. Over the same three months it drew 9,944 clicks from 461,231 impressions at an average position of 10.1.",
          "ValenciaMove, our own relocation site for Valencia, carries Spanish alongside four other languages and drew 5,685 clicks from 496,316 impressions over the same period.",
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
          "Readable across the divide, yes; convincing takes a version for each side. A reader in Madrid finds unified Latin American copy informal in unexpected places, and a reader in Mexico City or Buenos Aires finds unified Castilian distant, formal and occasionally off on a specific word. Currency, legal markers and trust signals differ on top of that.",
          "Where it pays to split is commercial intent: product pages, service descriptions, pricing, anything with a form at the end. Editorial content usually works unified. A mixed setup, unified blog and separated commercial pages, is the common answer and often the right one.",
        ],
      },
      {
        q: "Which Latin American market to open first",
        a: [
          "Mexico on sheer volume, and it is competitive to match on consumer verticals while staying reachable on regional B2B. Colombia, Argentina and Chile are mid-sized, more accessible, and each behaves differently enough to need their own research. The Dominican Republic, Costa Rica and Guatemala suit niche or local services.",
        ],
      },
      {
        q: "Who writes which variant",
        a: [
          "Castilian runs direct from the Valencia base: research, briefs, competitor reading, writing and meetings in Spanish, first hand. The Latin American variants go to native copywriters on the BeTranslated team in Santo Domingo, briefed and supervised here so the set stays coherent as one plan.",
        ],
      },
      {
        q: "What a Spanish site has to get right beyond the words",
        a: [
          "Every market has its own tax number, its own cookie rules and its own regulator, and Spain, Mexico, Colombia, Argentina and the Dominican Republic each judge a site by their own rules. We set up the technical side of every one of them.",
          "Regulated sectors, finance, healthcare, anything touching gambling, add a local lawyer on top of the technical setup.",
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
      note: "The two biggest terms both sit at difficulty 0, and the largest single share is American: 500 of the 1,100 monthly searches for `spanish seo` and 400 of the 800 for `seo in spanish` come from the US.",
      measured: "23 September 2026",
    },
  },
  {
    slug: "dutch-seo",
    name: "Dutch SEO",
    cardTitle: "Dutch SEO and GEO for the Netherlands and Belgium",
    inline: "Dutch SEO",
    h1: "Dutch SEO and GEO agency for the Netherlands and Belgium",
    subhead: "Dutch and French handled directly, with a native reader on every commercial page, so buyers in Amsterdam, Antwerp and Brussels read a supplier who speaks their language properly.",
    cluster: "Search",
    angle: "SEO Netherlands and Belgium, written in Dutch from the start",
    lede: "Your Dutch pages bring visitors from the Netherlands and Flanders; the next step is getting more of them in touch. Dutch buyers decide quickly, and they respond to short, concrete answers with the company details up front.",
    metaTitle: "Dutch SEO agency for the Netherlands and Belgium",
    metaDescription: "Dutch buyers decide fast and trust pages written in Dutch. Dutch SEO for the Netherlands and Belgium, researched and written directly in Dutch.",
    // Research, 23 Sep 2026 (Ahrefs GB and BE, plus this page's own Search
    // Console for 24 Mar to 20 Sep 2026). Buyers searching in English name
    // the country, not the language: `seo netherlands` 400 and `seo
    // belgium` 350 against `dutch seo` 250, and the page's top queries are
    // `seo the netherlands` (128 impressions), `seo holland` (86) and `seo
    // netherlands` (75), ahead of `dutch seo` (38). So the h1 names the
    // Netherlands and Belgium. Benelux is a key market (owner, 23 Sep), and
    // Belgium needs French as well as Dutch, which this practice writes
    // directly.
    sections: [
      "An audit of your Dutch pages against three direct Dutch or Belgian competitors",
      "Keyword research in Dutch, kept separate for the Netherlands and Flanders where both matter",
      "A strategy and editorial calendar agreed with you in English, French or Dutch",
      "Dutch pages written directly here, with a native reader on every commercial page",
      "KvK or KBO, BTW, cookie consent and the payment methods Dutch and Belgian buyers expect",
      "Monthly reporting on Dutch and Belgian enquiries, kept apart from your other markets",
    ],
    body: [
      {
        heading: "What a site written in Dutch wins you",
        paragraphs: [
          "Dutch buyers read fast and decide fast. They expect short sentences, concrete answers and the terms in plain view, and a page that gives them those sounds like a supplier. The long, enthusiastic pitch that works elsewhere reads as marketing to them, so the Dutch page gets to the point.",
          "They also look for the company details before they trust anyone: a KvK and BTW number in the Netherlands, a KBO number in Belgium, cookie consent done properly, and iDEAL or Bancontact at the checkout.",
          "Belgium adds a second language. Dutch reaches Flanders, French reaches Brussels and Wallonia, and a Belgian site in both reaches the whole country.",
        ],
      },
      {
        heading: "Dutch and French from one team",
        paragraphs: [
          "Dutch runs directly here, from an Erasmus year in Utrecht and years of Dutch and Belgian clients. The research, the reading of competitors, the briefs and the meetings all happen in Dutch, and every commercial page still gets a native Dutch reader before it goes live, because native is a step beyond fluent.",
          "French runs directly too, so a Belgian site gets one plan in both of its languages, from one team. The Dutch for Flanders and the Dutch for the Netherlands stay separate where both are in scope, since the words and the rules differ on each side of the border.",
          "Listings in the directories your trade uses and mentions in the regional press come on top.",
        ],
      },
      {
        heading: "Dutch buyers search by country: the Netherlands and Flanders apart",
        paragraphs: [
          "More people search in English for SEO in the Netherlands (400 a month) and SEO in Belgium (350) than for Dutch SEO (250) (Ahrefs, September 2026). The queries that reach this page name the Netherlands or Holland, and German and French searches for SEO in the Netherlands turn up as well.",
        ],
      },
      {
        heading: "Dutch and Belgian sites we run and work on",
        paragraphs: [
          "Bemelman Spuiterij is a powder-coating specialist in the Bollenstreek with forty-five years of reputation. Its site is written entirely in Dutch, with a page per service and a quote form that asks for the project type and the surface area, so requests arrive ready to price. Between May and July 2026 it drew 1,436 clicks from 108,568 Google impressions.",
          "BeTranslated, the translation agency we have run for twenty years, has its own .be and .nl sites, each researched for its own market.",
        ],
      },
    ],
    expandablesHeading: "What Dutch SEO turns on, north and south of the border",
    expandables: [
      {
        q: "Who writes the Dutch",
        a: [
          "We do. Dutch, like French, English and Spanish, runs directly here, while German, Italian and Portuguese go to native copywriters. The briefs, the SERP reading, the competitor analysis and the meetings happen in Dutch, first hand.",
          "Published commercial copy still gets a native polishing pass.",
        ],
      },
      {
        q: "Netherlands, Flanders, or both",
        a: [
          "The Netherlands alone is the usual answer and the simplest architecture. Flanders on its own is rare, because a Belgian business working in Dutch generally wants the Dutch market too. Both, with nl-NL and nl-BE kept apart, earns its place when you already have customers asking in Dutch on either side of the border.",
          "The recommendation comes from your sales pipeline.",
        ],
      },
      {
        q: "Same language, different commercial vocabulary",
        a: [
          "A rental property is a huurwoning in the Netherlands and often a huurappartement in Belgium. Insurance is verzekering in one and alternates with assurantie in the other. Both are correct, and each reads as local in its own country.",
          "The regulators differ too, the AFM in the Netherlands against the FSMA in Belgium for financial services, along with the VAT rules.",
        ],
      },
      {
        q: "What the footer has to carry",
        a: [
          "The Dutch registration number, the Belgian equivalent, cookie consent done the way local law expects, visible in the footer and on the contact page.",
          "Regulated sectors add a Dutch or Belgian lawyer on top of the technical setup.",
        ],
      },
      {
        q: "Why iDEAL and Bancontact belong in an SEO conversation",
        a: [
          "Indirectly, and measurably. iDEAL in the Netherlands and Bancontact in Belgium are what people expect to see at a checkout, and a consumer store that offers them keeps more buyers at the last step.",
          "Search notices the consequence: a page people complete holds its position better than one they bounce from, so a payment method ends up being a ranking factor by a longer route.",
        ],
      },
    ],
    demand: {
      volume: 800,
      kd: "3",
      note: "The market is larger than the figure: buyers name the country more often than the language, so `seo netherlands` (400) and `seo belgium` (350) each draw more than `dutch seo` (250).",
      measured: "23 September 2026",
    },
  },
  {
    slug: "italian-seo",
    name: "Italian SEO",
    cardTitle: "Italian SEO and GEO for the Italian market",
    inline: "Italian SEO",
    h1: "Italian SEO and GEO agency for an uncontested market",
    subhead: "Italian SEO terms sit at difficulty 0 to 1 in Ahrefs, so entry costs little.",
    cluster: "Search",
    angle: "SEO Italy, where native copy wins",
    lede: "An Italian buyer looks for the Partita IVA and the REA registration before enquiring, and notices whether the page speaks in tu or voi. Pages that carry those details and read as written in Italy win the enquiry.",
    metaTitle: "Italian SEO agency, an uncontested market",
    metaDescription: "Italian SEO written natively, with the Partita IVA and REA details buyers look for and regional pages where they pay off. Terms sit at difficulty 0 to 1.",
    sections: ["Three things Italian SEO has to get right", ...ENGAGEMENT],
    body: [
      {
        heading: "Italy's regional differences decide the plan",
        paragraphs: [
          "Italian users expect a particular register, especially the tu versus voi decision on commercial pages and where the polite form sits, and copy written by someone who lives in the language gets it right.",
          "Italy is the most regionally fragmented major European market. Milan, Rome, Naples and Palermo behave differently on price sensitivity, payment habits and trust signals, so a single national site works for niche B2B, and regional adaptation pays off for anything closer to consumer search.",
          "A visible Partita IVA, codice fiscale and REA or Chamber of Commerce registration, plus consent compliant with the Garante della Privacy, which runs stricter than the EU baseline on some points, are what an Italian buyer checks before trusting a site enough to convert.",
        ],
      },
      {
        heading: "Read fluently here, written natively by the network",
        paragraphs: [
          "Our Italian is enough to manage SEO projects in it, and we handle strategy and competitor reading directly. Native Italian copywriters from the BeTranslated network handle the writing itself, briefed in English or French and checked by a second native reader before anything ships.",
          "Targeting runs per macro-region (Nord, Centro, Sud) when the offer justifies it, with local landing pages for Milan, Rome, Turin and other metropolitan areas where relevant. Outreach targets Corriere della Sera, La Repubblica and Sole 24 Ore for B2B, plus sector associations such as Confindustria and Confartigianato.",
        ],
      },
    ],
    expandablesHeading: "The objection an Italian buyer raises first",
    expandables: [
      {
        q: "You do not speak Italian, so how is this Italian SEO",
        a: [
          "Most of Italian SEO is reading. Reading the SERP, reading what the competitors rank for and why, reading intent in an Italian query, checking that it-IT is configured the way it should be. Our Italian is enough to manage SEO projects in it: enough to audit an Italian page and challenge a draft that drifts from its brief.",
          "Your Italian commercial copy is written by native Italian writers, so the page reads native because it is.",
        ],
      },
      {
        q: "How the Italian is checked when native writers draft it",
        a: [
          "Brief from us in English or French with the targets and the structure set, drafting by a briefed native Italian writer, then a second native Italian reading it before publication. Your own people are the filter after that.",
          "Every draft has to answer its query, and goes back until it does.",
        ],
      },
      {
        q: "How far to take the regional split",
        a: [
          "The north, around Milan, Turin, Bologna and the Veneto, is the industrial B2B core and the most tolerant of English on technical niches. The centre, Rome and Tuscany, runs on services, tourism and a large public-sector tail. The south and the islands hold different price expectations and trust patterns, where local presence and local references count for more.",
          "Regional pages earn their place when local presence is the thing being sold. For B2B selling nationally online, one Italian site does the job on its own.",
        ],
      },
      {
        q: "Where the Garante goes beyond the GDPR baseline",
        a: [
          "Italy's data protection authority reads parts of the GDPR more strictly than the baseline, particularly on how cookie consent is stored and how granular marketing consent has to be. The technical setup is built to that stricter reading.",
          "Sensitive data, automated decisions and anything touching employee monitoring are a specialist Italian lawyer's work, on top of the implementation.",
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
    cardTitle: "Portuguese SEO and GEO for Portugal and Brazil",
    inline: "Portuguese SEO",
    h1: "Portuguese SEO and GEO agency for Portugal and Brazil",
    subhead: "Two markets sharing one language, each with its own search behaviour and its own competition.",
    cluster: "Search",
    angle: "Two markets, one language",
    lede: "A reader in Lisbon finds Brazilian Portuguese distracting, and a reader in São Paulo finds European Portuguese stiff. Each market gets its own pages and keywords, and Brazil, with roughly 215 million speakers, is the far larger of the two.",
    metaTitle: "Portuguese SEO services, Portugal and Brazil",
    metaDescription: "Portuguese SEO with separate pt-PT and pt-BR pages, keywords and native writers for Portugal and Brazil, plus the payment and registration details each market expects.",
    sections: ["Three things Portuguese SEO has to get right", ...ENGAGEMENT],
    body: [
      {
        heading: "Portugal and Brazil, sized correctly",
        paragraphs: [
          "European Portuguese and Brazilian Portuguese diverge in vocabulary, grammar convention, currency and regulatory framework. Each side notices which variant a page was written in, so one Portuguese site reads Brazilian in Lisbon and European in São Paulo. Hreflang pt-PT and pt-BR kept distinct is the baseline.",
          "Brazil has roughly 215 million speakers, its own ecommerce platforms and payment methods such as PIX and boleto bancário. European companies often default to Portugal, and Brazil is the far larger market.",
          "Portugal expects a NIF or NIPC and GDPR-compliant consent. Brazil expects a CNPJ, LGPD-compliant handling and PIX or boleto as payment options for consumer stores.",
        ],
      },
      {
        heading: "Native per variant, coordinated from here",
        paragraphs: [
          "Research and writing run through native PT-PT copywriters for Portugal and native PT-BR copywriters for Brazil from the BeTranslated network, briefed in English or French and checked by a second native reader per variant. Outreach targets Público and Expresso in Portugal, Folha and Estadão in Brazil, with every link earned on its own market's side of the Atlantic.",
        ],
      },
    ],
    expandablesHeading: "Portugal or Brazil: choosing per market",
    expandablesLede:
      "The decision this engagement opens with, and what follows from each answer.",
    expandables: [
      {
        q: "European and Brazilian Portuguese are two markets sharing one language",
        a: [
          "They diverge far enough on vocabulary, grammar, regulation, currency and trust signals that each audience wants its own version. A reader in Lisbon finds unified Brazilian copy distractingly Brazilian, and a reader in São Paulo finds unified European Portuguese stiff.",
          "Where both are genuinely in scope, pt-PT and pt-BR keep them apart.",
        ],
      },
      {
        q: "Which one to open first",
        a: [
          "Portugal is a mature EU market on the euro, under GDPR, and friendly to a foreign business with any European proximity. Brazil is an order of magnitude larger, with its own payment behaviour, its own data protection law and a currency that brings exchange risk with it.",
          "The question is offer fit and where your customers already are. A European SMB selling services often does best in Portugal, the market it can serve well.",
        ],
      },
      {
        q: "Who reads the Portuguese and who writes it",
        a: [
          "We read both variants at a working level, built on native French and daily Spanish, which is enough to audit a SERP, follow a competitor's pages, check the technical configuration for the variant and take notes in a native team meeting.",
          "Writing is done by native copywriters from the target market: a Portuguese writer for pt-PT and a Brazilian writer for pt-BR, each on their own variant.",
        ],
      },
      {
        q: "LGPD is Brazil's own law, with its own authority",
        a: [
          "Brazil's Lei Geral de Proteção de Dados covers similar ground to the GDPR and is enforced by its own authority, the ANPD, with its own expectations. Consent handling, data subject rights and the privacy policy are set up to the Brazilian reading.",
          "Sensitive data, cross-border transfers and automated decisions want a Brazilian privacy lawyer on top of the technical work.",
        ],
      },
      {
        q: "A Brazilian store with PIX keeps its buyers",
        a: [
          "PIX, the instant payment system the central bank launched in 2020, is how a great many Brazilians now pay: faster than a card, settled immediately, and effectively free for an individual. Boleto bancário still matters for some demographics and for business-to-business.",
          "It reaches SEO indirectly and reliably. A checkout that offers what a buyer expects converts better, and a page that converts better holds its position more easily than one that ranks and bounces.",
        ],
      },
    ],
    demand: {
      volume: 1150,
      kd: "33",
      note: "`seo portugal` sits at difficulty 33, ten times the difficulty of the German or Spanish equivalents, so it is built last.",
    },
  },

  // ---- Cluster 3: localization and translation ----
  {
    slug: "local-seo",
    name: "Local SEO",
    cardTitle: "Local SEO for cities that search in several languages",
    inline: "local SEO",
    h1: "Local SEO services for multilingual cities",
    subhead: "Be the business nearby buyers find first on the map, in every language your city searches in, and turn the profile into calls and visits.",
    cluster: "Search",
    angle: "Found first, streets away",
    lede: "Somebody a few streets away searches for exactly what you sell, and the map shows the business most consistent about where it appears. In a city that searches in two languages, the business that shows up in both wins twice.",
    metaTitle: "Local SEO services for businesses in multilingual cities",
    metaDescription: "Somebody nearby searches for what you sell: be the business they find first. Local SEO for cities that search in two languages.",
    sections: [
      "Google Business Profile audit and full optimization",
      "Your name, address and phone number made identical across every directory",
      "Neighbourhood pages and LocalBusiness schema for the districts you serve",
      "A review request routine and a reply to every review",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "What a visible profile wins a local business",
        art: {
          src: "/images/sections/local-seo-visibility.webp",
          alt: "One faded, outlined shopfront beside a solid, visible shopfront marked with a map pin",
        },
        paragraphs: [
          "Somebody searching for a service near them looks at the map and decides there: they call one of the three businesses on it, after reading the reviews of the other two.",
          "In a city where people search in more than one language, the reward doubles. A profile in Spanish and English reaches the English speaker two streets away searching in English as well as the Spanish speaker, and the business that adds the second language takes both.",
        ],
      },
      {
        heading: "Where local visibility is won",
        paragraphs: [
          "Google rewards a profile that is complete and kept active: the right categories, a full service list, current hours, plenty of photos and recent posts. For a small business working from one address, the profile often brings in more enquiries than the website does.",
          "A business name that reads exactly the same across every directory listing, review site and chamber of commerce entry, with the address written one way everywhere, gives Google confidence in all of them.",
          "A homepage that says it serves the whole city is a start. A dedicated page for each neighbourhood you actually serve wins the neighbourhood searches too, because people search for a service plus a neighbourhood.",
        ],
      },
      {
        heading: "Local SEO we run on our own properties and for clients",
        paragraphs: [
          "Bemelman Spuiterij is a powder-coating specialist in the Bollenstreek with forty-five years of reputation and, before we started, a web presence still to build. We built Dutch local SEO around the small number of trade buyers who search for that work, and the site drew 1,436 clicks from 108,568 Google impressions between May and July 2026.",
          "ValenciaMove is our own relocation site for Valencia, built around neighbourhood guides in five languages. Over the same three months it drew 5,685 clicks from 496,316 impressions at an average position of 10.7.",
        ],
      },
    ],
    expandablesHeading: "What the map pack actually rewards",
    expandables: [
      {
        q: "Treat the profile as a product surface",
        a: [
          "Filled in fully and kept current, week after week. A profile that is kept up holds its place against competitors who update theirs, and in a city with more than one working language it carries the second one too.",
        ],
      },
      {
        q: "Name, address and phone number, identical everywhere",
        a: [
          "Google reads your details from dozens of places, and when they all match it trusts all of them. The work is an audit of what is already out there, correction of the inconsistencies, removal of duplicate listings, and additions to the high-value local sources still to list you: the chamber of commerce, the sector association, the directory your trade actually uses.",
        ],
      },
      {
        q: "Neighbourhood pages that each say something of their own",
        a: [
          "A page per district works when each one says something true about that district, well beyond a swapped place name.",
          "Local schema belongs on them, with the right subtype: a law firm is a LegalService, a freight forwarder is a FreightForwarder. Internal links from the main service pages make them findable.",
        ],
      },
      {
        q: "Reviews come from a process",
        a: [
          "A request that goes out after the job is done, by email or from a code on the receipt, is what collects reviews. Every review gets a reply, critical ones included, because the reply is read by everyone who comes after.",
          "A critical review handled well reads better than a wall of five stars, so write the plan for one before it arrives.",
        ],
      },
      {
        q: "Local discovery has moved into the assistants",
        a: [
          "A growing share of best-in-town questions get asked of ChatGPT, Claude or Perplexity before anyone opens a map. What those answers draw on is the same material: structured data, consistent citations, and a reputation visible enough to be summarised.",
        ],
      },
    ],
    absorbs: ["local-seo"],
    demand: {
      volume: 134000,
      kd: "5 to 87",
      note: "Sums `local seo`, `local seo services` and `local seo agency` worldwide. The head term alone draws 63,000 at KD 87, easily the hardest term measured for any service page. `local seo services` (47,000, KD 5) and `local seo agency` (24,000, KD 6) carry nearly as much volume between them at a fraction of the difficulty,",
    },
  },
  {
    slug: "website-localisation",
    name: "Website localization",
    cardTitle: "Website localization that makes each market buy",
    inline: "website localization",
    h1: "Website localization services that make a site sell in its market",
    subhead: "From the copy to the checkout: currency, payment methods, shipping rules and a layout that survives a third more text.",
    cluster: "Localization",
    pillar: true,
    angle: "Beyond translated strings",
    lede: "Your site has been translated; the next step is making it read as local. The prices, the form fields, the trust marks and the way people search all get adapted to the market, well past the words.",
    metaTitle: "Website localization services, Mike Bastin",
    metaDescription: "Your site is translated; now make it feel local, from the prices to the form fields to the way people search. Website localization that makes each market buy.",
    sections: ["What localization adds to translation", ...ENGAGEMENT],
    body: [
      {
        heading: "What makes a page read as local",
        paragraphs: [
          "Localization adapts dates, currency, imagery, payment methods and the calls to action themselves to match what a market actually expects. A word-for-word translation keeps the original formats and trust signals; localization is the bigger job of replacing them.",
          "Right-to-left support for Arabic, the text expansion German routinely needs against an English source, and correct character encoding across every language in scope are technical work, and they show first in the interface. Testing across WordPress, Joomla, Drupal or a custom build settles them before launch.",
        ],
      },
      {
        heading: "What gets configured underneath the words",
        paragraphs: [
          "WPML runs as the default multilingual stack for WordPress, with Polylang for tighter budgets or simpler structures and TranslatePress where a non-technical content team needs in-context, front-end translation. For stores, WooCommerce, Shopify and Magento get local currency, local payment methods and checkout flows adjusted per region, since conversion rates move measurably once a shopper sees a familiar payment option at checkout.",
          "Run before launch, the pass puts every issue in a test report, where it is quickest to fix.",
        ],
      },
      {
        heading: "A build that has to stay correct while stock turns over weekly",
        paragraphs: [
          "Century 21 Perdomo sells Dominican real estate in four languages on a headless WordPress, WPML and WooCommerce stack, where a property selling, a price moving or a status flipping has to update correctly in all four locales at once. Between May and July 2026 the site drew 9,944 clicks from 461,231 Google impressions at an average position of 10.1.",
        ],
      },
    ],
    expandablesHeading: "What localization touches beyond the copy",
    expandables: [
      {
        q: "Which WordPress multilingual plugin, and what each one costs you",
        a: [
          "WPML is the default: the most complete on SEO, the most demanding on hosting and the one with a licence to keep renewing. Polylang fits a tighter budget and a simpler structure, and suits straightforward translation workflows best. TranslatePress earns its place when a non-technical team needs to translate on the front end, seeing the page as they change it. MultilingualPress suits a multisite network. GTranslate is machine translation with a switcher, a different product from a localized site.",
          "The choice is a lasting one, because the content ends up stored the plugin's way.",
        ],
      },
      {
        q: "Layouts designed with room for text expansion",
        a: [
          "German compounds and French expansion need more room in buttons, menu items and headings than an English design allots. Test the layout with that copy at exactly the places that matter: the navigation, the call to action, the price table.",
          "Right-to-left languages mirror the whole layout, and character encoding needs checking on forms, search and anything that touches a database.",
        ],
      },
      {
        q: "A store is localized at the checkout",
        a: [
          "Product descriptions and SKUs are the visible half. The half that moves the conversion rate is the currency shown, whether the price is formatted the way that market writes prices, the payment methods offered, and how the checkout handles an address shaped the local way.",
          "WooCommerce, Shopify and Magento each expose that differently, so we set it up per platform until the last step feels as local as the first.",
        ],
      },
      {
        q: "What localization testing actually covers",
        a: [
          "Every interface element, form, menu, switcher and piece of multimedia, in each language, for display, function and fit. The language switcher landing on the right page, a form accepting every valid local postcode, a date reading as the right month: a localization test checks all of it.",
          "The pass also covers what the market requires legally, from consent handling to accessibility.",
        ],
      },
      {
        q: "The same applies beyond WordPress",
        a: [
          "Joomla and Drupal both do multilingual well and differently, and both reward deciding the content model before translating anything.",
          "Whatever the platform, the question underneath is the same: does each language version have its own URL, its own metadata and its own place in the sitemap? Give it all three and a search engine can rank it per market.",
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
    cardTitle: "Translation services sorted by document type",
    inline: "translation services",
    h1: "Multilingual translation services sorted by document type",
    subhead: "The risk changes completely from a proposal to a court filing, and so does who should be doing the work.",
    cluster: "Localization",
    pillar: true,
    angle: "Where accuracy is a liability question",
    lede: "You have a contract, a patient record or a birth certificate that a court, a regulator or an embassy has to accept, with every term right the first time. Work goes through the BeTranslated network, which we have run for twenty years.",
    metaTitle: "Translation services, Mike Bastin",
    metaDescription: "A contract, a patient record or a certificate a court or an embassy has to accept. Certified and sworn translation services through the BeTranslated network.",
    sections: ["Where translation accuracy carries the most weight", ...ENGAGEMENT],
    body: [
      {
        heading: "Where accuracy carries legal weight",
        paragraphs: [
          "A sworn or certified translation of a birth certificate, power of attorney, court ruling or immigration document has to be accepted by the specific court, embassy or public administration it is submitted to, in Spain, the UK or across the EU.",
          "Medical translation carries clinical and legal weight: patient records, informed consent forms and regulatory submissions handled under GDPR and HIPAA confidentiality protocols, by translators who know the terminology of the specific medical field involved.",
          "Financial and legal translation work, from annual reports and prospectuses to contracts, patent filings and articles of association, needs to hold up to the same scrutiny as the original document, because every clause in a shareholder agreement and every figure in an audited statement is a liability question.",
        ],
      },
      {
        heading: "How the BeTranslated network actually delivers it",
        paragraphs: [
          "Translation runs through the BeTranslated network, run for over twenty years, with certified and sworn translators per language and per specialism (legal, medical, financial, academic, technical). Delivery takes one to seven days, depending on the complexity of the document and your situation, with rush turnaround available for time-critical personal documents such as a visa or birth certificate translation.",
          "Every document gets matched to a translator with the relevant sector background, then a review pass before delivery, with notarisation or an apostille handled where the receiving institution requires it. For US and Canadian citizens, we also provide apostille services.",
        ],
      },
      {
        heading: "Where the accuracy standard actually gets tested",
        paragraphs: [
          "Delaguía y Luzón is a Valencia law firm whose practice runs across Spain and France in four languages, including Russian, so the same document sometimes needs to hold up in two legal systems at once. Its site, which carries that translated legal content, drew 38,476 clicks from 2,399,567 Google impressions between May and July 2026, an average position of 9.4.",
        ],
      },
    ],
    expandablesHeading: "Which kind of translation your document needs",
    expandables: [
      {
        q: "Certified, sworn, notarised and apostilled are four different things",
        a: [
          "People often ask for a different one from the one they need, and the receiving institution decides which is right. A certified translation carries a signed statement of accuracy from the translator or agency. A sworn translation is made by a translator formally registered with a court or ministry, which is how Spain, France and much of the EU handle official documents. Notarisation adds a notary attesting to the signature, not to the translation. An apostille authenticates the document itself for use abroad under the Hague Convention, and is issued by the authorities of the country the document comes from. For US and Canadian citizens, we provide apostille services too.",
          "So the first question is what the body receiving the document asks for: a court, a registry, a university admissions office and an immigration authority each have their own rule.",
        ],
      },
      {
        q: "Legal documents, where each term sets an obligation",
        a: [
          "Contracts, court filings, witness statements, powers of attorney, articles of association, shareholder agreements, patent and trademark filings. Legal language is bound to its jurisdiction as well as technical, so each term is chosen for the weight it carries in the receiving legal system.",
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
          "Annual reports, prospectuses, fund fact sheets, balance sheets, income and cash flow statements, audit reports, tax filings. Financial reporting has settled vocabulary tied to the standards in use, and the translator's job is to keep to it exactly.",
        ],
      },
      {
        q: "Academic, where recognition is the whole point",
        a: [
          "Degree certificates, transcripts and mark sheets, research papers and journal articles, personal statements and recommendation letters, syllabi and course descriptions. A transcript carries a grading system of its own, and setting out how it maps onto the receiving country's keeps an application moving.",
          "Research writing asks the opposite: the argument has to arrive intact, hedging included, so a carefully qualified claim stays exactly as qualified in translation.",
        ],
      },
      {
        q: "Transcreation, which rewrites for the same effect",
        a: [
          "A campaign line, a tagline or a piece of brand copy that works in one language often needs a new form in another, because what it does is cultural. Transcreation rewrites for the same effect, from a brief describing what the original is meant to achieve.",
          "It is the right choice for marketing; anything a regulator, a court or an examiner will compare line by line goes to translation.",
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
    cardTitle: "App and software localization for products sold abroad",
    inline: "app and software localization",
    h1: "App and software localization services for products sold abroad",
    subhead: "Internationalized before launch, which is where the cost of this work is decided and kept low.",
    cluster: "Localization",
    angle: "Strings, and everything around them",
    lede: "You are shipping the product into a market that writes longer sentences than English, sometimes reads right to left, and reviews you in a store in its own language. The work starts with the interface around the translation.",
    metaTitle: "App and software localization services",
    metaDescription: "Shipping into a market that writes longer than English or reads right to left? App and software localization covers the layout, encoding and store listing too.",
    sections: ["What software needs to cross a language", ...ENGAGEMENT],
    body: [
      {
        heading: "The technical checks localization testing runs early",
        paragraphs: [
          "Interface text that fits comfortably in English routinely runs longer in German, so we test the layout against that expansion to keep buttons whole, labels complete and navigation aligned. Right-to-left scripts such as Arabic and Hebrew need the layout itself adjusted, along with the text direction, to stay usable.",
          "Character encoding handled correctly keeps accented characters and non-Latin scripts displaying as they should.",
        ],
      },
      {
        heading: "What app and software localization services cover",
        paragraphs: [
          "Interface text, notifications and app store descriptions translated and adapted for clarity and cultural relevance, dates, currency and units of measurement adjusted per locale, and app store keywords optimized per target market to support discoverability. Testing runs across the operating systems and devices actually used in each market.",
          "For video and audio content, subtitling and voice-over work across standard formats, with accurate transcription supporting both localization and accessibility compliance.",
        ],
      },
    ],
    expandablesHeading: "The order the work has to happen in",
    expandables: [
      {
        q: "Internationalization first keeps localization affordable",
        a: [
          "Preparing the software means strings pulled out of the code, whole sentences kept whole in the string files, dates and numbers and currency formatted by locale, sorting that follows the target language's rules, and layouts with room for text arriving longer than the English.",
          "Done first, adding a language is a content job, and every market after the first leaves the codebase closed.",
        ],
      },
      {
        q: "An app store listing is a search surface of its own",
        a: [
          "The title, the subtitle, the description and the keyword field are indexed per store and per locale, and a listing written for each locale uses all the room they give you. People searching for an app in Spanish type their own words, and the character limits differ by store.",
          "Screenshots count too. A store page showing the interface in Spanish tells a Spanish browser the app is for them before they read a word.",
        ],
      },
      {
        q: "Testing across language, device and operating system",
        a: [
          "Most localization defects sit outside the translation: a label that overflows its button in German, a date that reads as the wrong month, a form that rejects a valid local postcode, a right-to-left layout that mirrors everything except one icon.",
        ],
      },
      {
        q: "Video and audio in every language",
        a: [
          "Subtitling, voice-over and transcription per language, and a decision about which of the three each piece needs. Subtitles are cheap and carry most of the value.",
          "A transcript does double duty: it makes the content accessible and it puts words on a page that search and an answer engine can read.",
        ],
      },
    ],
    absorbs: ["app-localisation", "software-internationalisation", "multimedia-localisation"],
  },

  // ---- Cluster 4: AI, the differentiator ----
  {
    slug: "ai-consulting",
    name: "AI consulting",
    cardTitle: "AI consulting for multilingual search and content",
    inline: "AI consulting",
    h1: "AI consulting services for multilingual search and content",
    subhead: "Where machine output helps across languages, and where a person keeps the trust a page was built to earn.",
    cluster: "AI",
    pillar: true,
    angle: "AI consultants who say where AI helps and where a person does",
    lede: "Somebody has told you AI can handle your German content, and some of it can. The part that decides whether the page earns anything is the part that still needs a person who reads German.",
    metaTitle: "AI consulting for multilingual SEO",
    metaDescription: "Told that AI can handle your German content? Some of it can. AI consulting that says which part still needs a person who reads the language.",
    sections: ["Where AI helps, and where a person does", ...ENGAGEMENT],
    body: [
      {
        heading: "Where AI helps",
        paragraphs: [
          "Neural machine translation combined with terminology-aware post-editing shortens the first draft of a multilingual page, and AI-assisted research speeds up the early stages of keyword and competitor work across languages far faster than doing it by hand.",
          "Sentiment analysis run across several markets at once surfaces patterns in how a brand is discussed that a manual review would take weeks to find.",
        ],
      },
      {
        heading: "Where it still needs a person",
        paragraphs: [
          "Three judgement calls stay with someone who knows the market: writing commercial copy that converts in languages outside a model's native-sounding range, judging which of two culturally different approaches will land better with a specific audience, and catching the subtle, confident error that reads as fluent and is factually off.",
        ],
      },
      {
        heading: "Deciding what to trust before anything gets built",
        paragraphs: [
          "Whether a chatbot handling multilingual customer support can run on its own, or needs a human fallback past the routine questions, gets assessed against the actual cost of a wrong answer.",
          "The output of any AI system in this stack gets reviewed by someone who reads the target language, because the real risk in AI-assisted multilingual work is the fluent, professional-looking sentence that is quietly wrong, and a reader of the language is who catches it.",
        ],
      },
    ],
    expandablesHeading: "Where AI earns its place, and where a person does",
    expandablesLede:
      "The parts of a multilingual operation worth automating, and the part that still needs a person.",
    expandables: [
      {
        q: "Machine translation with somebody reading the output",
        a: [
          "Modern engines are good enough to take the first pass on most material, and published output still wants a reader. The workable setup is an engine chosen and tuned for your subject matter, with a native editor on the material that carries risk and a lighter pass on the rest.",
        ],
      },
      {
        q: "Support that answers in the language the question arrived in",
        a: [
          "A multilingual assistant on the site handles the repetitive questions in each market with one team behind it, and hands over cleanly when a question goes beyond it. Built on your own material, so it answers about your products specifically.",
          "Confidence is the thing to watch: give every language the assistant answers in a reader who checks its answers, so an invented answer is caught early.",
        ],
      },
      {
        q: "Reading what the market is saying, at a volume beyond one person's reach",
        a: [
          "Sentiment and theme analysis across reviews, support tickets and social mentions per language, which is where the gap between what a market says and what you assume it wants tends to show up first.",
          "A complaint pattern that appears in one language alone usually points to a localization defect, and a report split by language shows it.",
        ],
      },
      {
        q: "How to tell whether any of it worked",
        a: [
          "Accuracy on a sample somebody checks, turnaround time, cost per published page, and whether the people using the output would choose to keep it. Market-level numbers alongside those, so each language shows its own result on the dashboard.",
        ],
      },
    ],
    absorbs: ["ai-consulting-services"],
  },
  {
    slug: "ai-translation-and-post-editing",
    name: "AI translation and post-editing",
    cardTitle: "AI translation with human post-editing",
    inline: "AI translation and post-editing",
    headingTerm: "machine translation post-editing",
    h1: "Machine translation post-editing after the AI first pass",
    subhead: "Machine output worked over by a native speaker, because fluent text has to be right as well as readable.",
    cluster: "AI",
    angle: "Machine first, human decisive",
    lede: "Your pages came back from the machine reading fluently, and the next step is making sure they are right. Fluent sentences need an expert reader, because a confident error reads as smoothly as the truth.",
    metaTitle: "Machine translation post-editing and AI translation",
    metaDescription: "Machine-translated pages read fluently; post-editing makes them accurate too. AI translation and post-editing by native speakers who know the subject.",
    sections: ["Why fluent output needs an expert reader", ...ENGAGEMENT],
    body: [
      {
        heading: "Why fluent translation still needs a native check",
        paragraphs: [
          "Machine translation and plugin-driven translation, whether through WPML, Weglot or Polylang's auto-translate, have become fluent enough that the output reads as professionally written whether or not it is accurate. Anyone catches a broken sentence; a fluent one that has shifted the meaning, dropped a qualifier or mistranslated a technical term takes someone who knows the subject reading it closely, and that is the reading we give it.",
          "The review scales with the stakes of the content: a product description needs a light touch, while a clause in ecommerce terms or an instruction in medical or legal content carries liability.",
        ],
      },
      {
        heading: "What machine translation post-editing actually corrects",
        paragraphs: [
          "Terminology errors and unnatural phrasing corrected against a defined glossary per sector, formatting and tone standardised across languages so the brand voice holds, and consistency checked against the SEO targets the content was meant to hit in the first place, so the post-edit keeps the grammar right and the target keyword in place.",
          "The trade calls it MTPE. Work runs across sectors that lean on AI output to scale quickly, particularly SaaS, ecommerce and travel, where the volume of content calls for machine first drafts and the accuracy bar stays commercial.",
        ],
      },
    ],
    expandablesHeading: "What a post-editing pass actually changes",
    expandablesLede:
      "What the pass fixes in machine output, in the order a reader meets it.",
    expandables: [
      {
        q: "Grammar is the easy half",
        a: [
          "Engines now produce sentences that are grammatically correct. The pass works on the ones that are correct and slightly off: a register too formal for the market, an idiom translated where it wanted replacing, a rhythm that reads as translated even when the cause is spread across a whole sentence.",
        ],
      },
      {
        q: "Plugin auto-translation and what the pass adds",
        a: [
          "Weglot, WPML and Polylang fill a site with translated strings quickly, and the result is usable and ready for finishing.",
          "So the pass covers what the plugin touched out of the reader's sight: title tags, meta descriptions, alt text, button labels, form validation messages and confirmation emails, so a page that reads beautifully in French also shows its form messages in French.",
        ],
      },
      {
        q: "Terminology has to be decided once",
        a: [
          "An engine can translate the same term three different ways across a site because it sees each sentence alone. For a product name, a legal term or anything a customer will search for, one agreed term is what ranks.",
          "The pass settles the term per language and applies it everywhere, which matters most on the pages where a sale happens and least on the blog.",
        ],
      },
      {
        q: "Where machine output always gets a specialist reader",
        a: [
          "Anything a regulator, a court or a clinician reads. Medical documentation, legal text, financial reporting and safety instructions all have the property that a plausible-sounding error costs more than a delay does.",
        ],
      },
    ],
    absorbs: ["post-ai-editing"],
  },

  {
    slug: "generative-engine-optimization",
    name: "Generative engine optimization",
    cardTitle: "Generative engine optimization for AI answers",
    inline: "generative engine optimization",
    h1: "Generative engine optimization services for AI search",
    subhead: "Structured for ChatGPT, Perplexity and Google's AI Overviews to cite you, as well as for Google to rank you.",
    cluster: "AI",
    pillar: true,
    angle: "Cited inside the answer as well as ranked below it",
    lede: "ChatGPT, Perplexity and Google's AI Overviews answer a buyer's question directly, and name two or three sources while doing it. Being one of them puts you in the buyer's consideration at the moment they ask.",
    metaTitle: "Generative engine optimization agency and AEO",
    metaDescription: "ChatGPT, Perplexity and Google AI Overviews name a small number of sources when they answer a question. See what it takes for the answer to name you.",
    expandablesHeading: "What changes when the answer is written for you",
    expandablesLede:
      "Nine shifts in how buyers reach an answer, and what each one asks of your pages.",
    expandables: [
      {
        q: "Optimize for search everywhere, Google included",
        a: [
          "Buyers now ask ChatGPT, Perplexity, Bing and a voice assistant before they ask Google, and each one assembles its answer differently.",
          "Presence across the platforms your market actually uses, with one voice and one claim everywhere, because answer engines cite the sources that agree with themselves.",
        ],
      },
      {
        q: "Write for the whole question",
        a: [
          "An answer engine reads a conversational question and returns a direct response, so the page matches the question as asked.",
          "Longer, spoken-shaped phrases, and the related terms around them, so the page answers the whole question.",
        ],
      },
      {
        q: "Make the experience and expertise visible",
        a: [
          "Experience, expertise, authoritativeness and trust still decide what gets quoted, and an answer engine reads them from what the page shows.",
          "Named authors with a real record, claims a model can check, and dates that show the page is maintained.",
        ],
      },
      {
        q: "Structure the data so a machine can read it",
        a: [
          "Schema is how a retrieval system works out what a page is about before deciding whether to cite it.",
          "Types that match what the page really is, validated, and marked up only with claims the page makes.",
        ],
      },
      {
        q: "Earn citations from sources a model already trusts",
        a: [
          "Coverage from publications in your market, and material worth referencing on its own, earned one citation at a time.",
        ],
      },
      {
        q: "Keep the page fast and readable",
        a: [
          "Quick loads, a structure someone can scan, and enough reason to stay past the first screen.",
        ],
      },
      {
        q: "Re-test as the models change",
        a: [
          "The answer engines rewrite their retrieval behaviour on their own schedule, so a tactic that worked last quarter needs checking this one.",
          "Regular checks on which platforms name you and for which questions, then adjusting the approach to match.",
        ],
      },
      {
        q: "Watch who the answers cite",
        a: [
          "Tracking the sources your market's answers cite, and closing the specific gap that puts them there.",
        ],
      },
      {
        q: "Measure the enquiries that citations bring",
        a: [
          "Reporting that ties visibility in AI answers back to enquiries per market, so the work is judged on what it brought in.",
        ],
      },
    ],
    sections: [
      "Answer-shaped content: claims a model can quote and cite",
      "Schema and structured data built for AI retrieval as well as crawlers",
      "Presence across ChatGPT, Perplexity, Claude and Google AI Overviews",
      "Citation tracking: which platforms name you, for which queries",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "Why citation is now the target alongside ranking",
        paragraphs: [
          "A user who asks ChatGPT or Perplexity a question gets a direct answer with a small number of sources named inside it. A mention inside that answer is earned separately from a page-one ranking, because the model selects a handful of sources it judges citation-worthy from all the pages that match the query.",
          "The pages that get named tend to share a shape: a clear, quotable claim near the top, structured data that tells a crawler exactly what the page is, and a consistent way of naming the same entity, the same business name and the same service name, across every place that entity appears online.",
        ],
      },
      {
        heading: "What being cited actually takes",
        paragraphs: [
          "Content restructured around answer-shaped claims a model can quote directly and accurately. Schema and structured data built specifically for AI retrieval as well as for a search engine crawler, alongside a consistent presence across the platforms people actually ask: ChatGPT, Perplexity, Claude, Google AI Overviews.",
          "Citation tracking monitors which platforms name the site for which queries over time, and the tracking data feeds directly back into which pages get the answer-shaped treatment next.",
        ],
      },
    ],
    demand: {
      volume: 55000,
      kd: "39 to 70",
      note: "Sums `generative engine optimization` (26,000 worldwide, KD 70), `answer engine optimization` (13,000, KD 39) and `geo seo` (16,000, KD 63).",
    },
  },
  // ---- Cluster 5: supporting capability ----
  {
    slug: "technical-seo",
    name: "Technical SEO",
    cardTitle: "Technical SEO for multilingual websites",
    inline: "technical SEO",
    h1: "Technical SEO services for multilingual websites",
    subhead: "The work that lets each language version win its own buyers.",
    cluster: "Supporting",
    angle: "Crawlability and hreflang, the foundations every language ranks on",
    lede: "Your French pages and your German pages should add up, each winning its own buyers. We check how they work together on your site, and set them up so each one adds to the total.",
    metaTitle: "Technical SEO services for multilingual websites",
    metaDescription: "Make every language version of your site add up, each winning its own buyers. See how we check the setup on your site, and what it takes to get it right.",
    sections: ["What lets a multilingual site rank in every language", ...ENGAGEMENT],
    body: [
      {
        heading: "What lifts a multilingual site's visibility",
        paragraphs: [
          "Hreflang tags present on every page, pointing back to each other and carrying the right language code, send a French visitor to the French version and a Spanish visitor to the Spanish one, and give Search Console a clean report.",
          "A sitemap split by language, thin near-duplicate pages consolidated, and crawl budget spent on the pages actually worth ranking let Google index far more of a multilingual site.",
        ],
      },
      {
        heading: "The unglamorous work underneath the rankings",
        paragraphs: [
          "On-page work aligns headers, internal linking and semantic HTML with real search intent.",
          "Domain rating and the diversity of referring domains matter more over a longer period than any single placement.",
        ],
      },
    ],
    expandablesHeading: "The five jobs technical SEO holds together",
    expandablesLede:
      "Keyword research, on-page work, analytics, English-language search and link building.",
    expandables: [
      {
        q: "Keyword research measures demand",
        a: [
          "A list of terms sorted by volume tells you what is typed; the useful version tells you who is buying. It reads how people phrase the problem, how they compare options and what they type once they have decided, and sorts the work by decision stage.",
          "It also has to account for where the answer appears now. A query that resolves in an AI summary or a zero-click result needs content shaped to be quoted.",
        ],
      },
      {
        q: "On-page work is structure before it is wording",
        a: [
          "Keyword mapping tied to real intent, a header hierarchy that reflects the argument, semantic HTML, internal links that point at the page that should actually rank, and a page fast enough for all of the rest to count.",
          "Most on-page fixes on a multilingual site settle which of two pages competing for the same query in the same language should rank, a structural decision that goes further than rewriting either page.",
        ],
      },
      {
        q: "Analytics is the part that makes the rest arguable",
        a: [
          "GA4 and Google Tag Manager configured so events mean something, conversions defined as the thing you actually want, and traffic split by market so each language shows its own numbers.",
          "Set up after the fact, it answers questions about last month. Set up first, it decides what to do next month.",
        ],
      },
      {
        q: "Link building, and how we keep it clean",
        a: [
          "Editorial links, resource page placements and guest posts on sites with real traffic and real editorial standards. Every link is earned on its merits: private blog networks, link farms and bought links from unrelated markets come cheap because they are a liability with a delay on it.",
          "What moves the needle is the topical relevance of the linking domain, a steady spread of referring domains, and anchor text that reads like something a person wrote.",
        ],
      },
      {
        q: "English is a market too, and often the biggest one",
        a: [
          "A company running French, German and Spanish properly often has English pages due a revisit, and English is frequently the highest-volume market of the set.",
          "It also has to pick a variant. British and American English differ in spelling, vocabulary and the terms people actually search with.",
        ],
      },
    ],
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building"],
  },
  {
    slug: "content-marketing",
    name: "Content marketing",
    cardTitle: "Content marketing built from search demand",
    inline: "content marketing",
    h1: "Content marketing services built from search demand",
    subhead:
      "Research first, so every page you publish answers a question buyers are already asking.",
    cluster: "Supporting",
    angle: "Demand first, calendar second",
    lede: "You are publishing steadily, and the next step is turning that work into enquiries. The answer is building the calendar from what buyers search for.",
    metaTitle: "Content marketing services built from search demand",
    metaDescription:
      "Publishing steadily and want the enquiries to follow? Build the calendar from what your buyers search for. See what changes when research comes first.",
    sections: ["Where a publishing calendar finds its thread", ...ENGAGEMENT],
    body: [
      {
        heading: "What a content programme is actually made of",
        paragraphs: [
          "Content strategy services are the half that decides whether the rest pays: which questions the business can credibly answer, which of those carry commercial intent, what already exists and can be rewritten, and the order it all gets published in.",
          "Content creation services are the other half, and they are a writing job before they are a volume job. A page earns its place by answering one question better than the pages already ranking for it, which takes a writer who understands the subject and an editor who sends back any draft that merely covers the topic.",
          "Measurement sits underneath both. A programme reports on what it produced, an engagement reports on what the production earned.",
        ],
      },
      {
        heading: "What search-led content changes",
        paragraphs: [
          "SEO content services and content marketing are often sold as separate things, and they work best as one: the research says which subjects have demand, and the writing decides whether the page deserves the position.",
          "Demand research also tells you what to hold back. A subject with little measurable search behind it can still be worth publishing, for a sales conversation or a newsletter, and it gets commissioned knowingly, for that purpose.",
        ],
      },
      {
        heading: "Where the multilingual page takes over",
        paragraphs: [
          "Run the same programme in three and a second set of decisions appears: each language needs its own keyword set, the cluster shape differs by language, and trust signals have to exist in each one.",
          "Most of the companies we do it for are B2B, which changes the brief more than the language does. A B2B content marketing agency is writing for a committee and a long cycle, so the page that earns the enquiry is usually the one answering the objection.",
        ],
      },
    ],
    expandablesHeading: "The questions that come up before the first brief",
    expandablesLede:
      "What the research decides, what the writing decides, and how to keep the two clear.",
    expandables: [
      {
        q: "Volume is a starting point",
        a: [
          "A term with a large number beside it is worth two checks: whether the people searching it are buyers, and whether a newcomer can displace the pages already ranking within two years. Both answers are visible before anything is commissioned, the cheapest time to find them.",
          "The terms worth taking first are usually the ones where the demand is real and the pages currently answering it are thin. Difficulty scores are an approximation of that, and reading the results themselves is the step that settles it.",
        ],
      },
      {
        q: "Rewriting usually beats publishing",
        a: [
          "Most sites arrive with pages that already rank somewhere in the second or third page of results for a term worth having. Lifting one of those is faster and more certain than starting a new page, and it costs a fraction of the words.",
        ],
      },
      {
        q: "Cadence matters less than most calendars assume",
        a: [
          "Publishing weekly is a production decision dressed as a strategy. What moves is whether each page is the best answer to its question, and a business that ships one strong page a month will overtake one shipping four that merely exist.",
        ],
      },
      {
        q: "What our part covers",
        a: [
          "Our part is writing, research, structure and the reporting around them. Social accounts, campaign creative and media buying sit with other specialists, and links come from editorial placement only.",
          "For languages beyond French, English, Spanish and Dutch, the writing goes to a native copywriter from the BeTranslated network and we brief and review it, which is the same arrangement the language pages describe.",
        ],
      },
    ],
  },
  {
    slug: "multilingual-content",
    name: "Multilingual content",
    cardTitle: "Multilingual content written per market",
    inline: "multilingual content",
    headingTerm: "multilingual content marketing",
    h1: "Multilingual content marketing written per market",
    subhead: "Written in the target language against that market's own research, for the buyers who read it.",
    cluster: "Supporting",
    angle: "Written per market",
    lede: "Your Spanish page is a translation of your English one, so it answers the question an English buyer asks. Spanish buyers phrase the problem differently, and they are out looking for the other version.",
    metaTitle: "Multilingual content marketing, written per market",
    metaDescription: "A Spanish page translated from English answers the question an English buyer asks. Multilingual content is researched and written for the market reading it.",
    sections: ["Why copy written per market outperforms translation", ...ENGAGEMENT],
    body: [
      {
        heading: "Why each market needs its own keyword set",
        paragraphs: [
          "The keyword set that gets searched in Spanish or French comes from research in that language, because the way people phrase a problem shifts with the language as well as the words.",
          "E-E-A-T signals, expert authorship, verifiable sources, testimonials, need to exist in every language, because a reader and a search engine both judge trustworthiness locally, from what they can actually verify in front of them.",
        ],
      },
      {
        heading: "What international content marketing covers, cluster by cluster",
        paragraphs: [
          "Content researched and written per market with native keyword localization, hreflang and canonical setup handled at the structural level, and schema (Article, FAQPage, LocalBusiness as relevant) implemented per language to support rich results. Cultural consulting sits underneath the copy itself, checking messaging and tone against local values before publication.",
          "Social platform choice follows the audience: Facebook and Instagram cover many markets, WeChat matters more in China and VK more in Russia, and a content plan built per market reaches the audience it was meant for.",
        ],
      },
    ],
    expandablesHeading: "What travels between languages and what each market rewrites",
    expandablesLede:
      "The copywriting, the cultural fit and the social side, and how far each one travels.",
    expandables: [
      {
        q: "Topic clusters are built per language",
        a: [
          "A cluster that works in English is a map of how English speakers break a subject down. Another language often breaks it down differently, splitting one of your topics into two or merging two into one.",
          "Building the cluster from that language's own queries takes longer, and it gives you the pages that market is looking for, linked in the shape local search follows.",
        ],
      },
      {
        q: "Experience and expertise have to be visible in each language",
        a: [
          "Google's quality signals are built per language, alongside the copy. An author with a real name and real credentials, dates, citations to sources that market recognises, and a business identity a local reader can verify all have to exist in the language being read.",
        ],
      },
      {
        q: "The parts of a page to check in the second language",
        a: [
          "Meta titles and descriptions written natively to the local character budget, internal links that point at the same-language version, schema carrying the localized values, and hreflang that resolves both ways.",
          "A crawler reads each one closely while a reader skims past them, so getting all four right is what lets a site that reads perfectly in four languages rank in all four.",
        ],
      },
      {
        q: "Cultural fit is a risk register before it is a style choice",
        a: [
          "Most of the value is in what gets caught: a colour, a gesture, a comparison or a claim that reads as ordinary in one market and as careless in another. Before publication is the cheap time to check it.",
          "The rest is tone. How direct a market expects a commercial page to be varies more than most companies assume, and a voice that reads as confident in one place reads as pushy in the next.",
        ],
      },
      {
        q: "Social is a different platform mix in every market",
        a: [
          "The network that carries your audience in one country may be a minor one in another, so a calendar per market puts you on the network each audience actually uses. Timing, format and what counts as an acceptable tone all shift with it.",
          "Platform rules and local advertising law shift too, so a campaign cleared in one jurisdiction gets checked for the next before it runs.",
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
