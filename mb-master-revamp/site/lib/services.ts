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
   * The engagement band as real steps, each with what happens in it. Where
   * set, it replaces the bare `sections` list, which printed six titles with
   * nothing under them (owner, 4 Oct 2026, on technical SEO: "reads like a
   * how to, and not services we provide").
   */
  process?: { title: string; text: string }[];
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
    subhead: "Your other markets already send you visitors. We turn them into enquiries your sales team wants, in each buyer's language, and show you which market sent every one.",
    cluster: "Lead generation",
    pillar: true,
    angle: "Counted in enquiries",
    lede: "Mike Bastin and his team run it from Valencia, with over two decades in multilingual search and a translation agency of our own behind every market. One market at a time, each one judged on the enquiries it sends.",
    metaTitle: "B2B lead generation services across every market",
    metaDescription: "Your other markets already send visitors. We turn them into leads worth a sales call, counted per market. Book a free consultation.",
    sections: ["What it brings in", "What you get in each market", "Who does the work", "How it is billed", "The evidence", "How an engagement runs"],
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
        heading: "What an account run per language delivered",
        paragraphs: [
          "On a Valencia law firm's account, tightly targeted search campaigns on commercial-intent queries, run through separate accounts per language to keep quality score clean, produced a steady flow of qualified leads across its languages at a cost per lead the firm's average case value could absorb.",
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
    process: [
      {
        title: "A free 20-minute audit",
        text: "We review your ad accounts, or your plans if you are starting out, market by market, and show where your budget would bring in enquiries soonest.",
      },
      {
        title: "A written scope",
        text: "The markets, platforms, campaigns and landing pages we will run, named in writing, with a recommended media budget for each market.",
      },
      {
        title: "Accounts built per market",
        text: "We research keywords in each language, write the ads natively, and build separate accounts or campaigns per market, each with its own budget and bidding strategy.",
      },
      {
        title: "Tracking through to a qualified lead",
        text: "Conversion tracking runs through GA4 and Google Tag Manager with CRM sync, so every lead is followed past the click to a qualified result in its own market.",
      },
      {
        title: "Monthly optimization and reporting",
        text: "We read the search-term reports in each language, refine keywords, negatives and bids, and report each market's cost per lead every month.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month. Your whole media budget goes straight to Google, Microsoft or Meta, and management is a separate fee.",
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
        heading: "What you get from conversion tracking per market",
        paragraphs: [
          "GA4 and Google Tag Manager configured for each locale. We define your key events once (form submissions, downloads, calls, and cart actions for stores) and apply them the same way in every language, so a French enquiry and a German one count alike and can be compared.",
          "Google Ads reporting that agrees with your analytics. We wire Google Ads conversion tracking to the same event definitions, so the campaign report and the analytics report agree on every enquiry.",
          "Your CRM closing the loop. Where sales pass through a CRM, we set up offline conversion tracking that sends the closed outcome back to GA4 and Google Ads, so a lead is measured through to a qualified result and bidding runs on what a market is worth.",
          "A report per market, reviewed on a fixed cadence, typically monthly, showing at a glance which market converts and which mainly brings traffic.",
        ],
      },
      {
        heading: "Where a figure per market pays off",
        paragraphs: [
          "Budget moved to the markets that convert. A separate figure per language shows which market earns enquiries and which mainly brings visits, so you can fund each one on what it returns.",
          "Early warning in every market. A change in any market's conversions shows up in the data months before it reaches the sales pipeline, which gives you time to act on it.",
          "Figures your sales team recognises. With spam, test entries and job applications counted apart, and the outcome synced from the CRM, the number in the report matches the enquiries your team receives.",
        ],
      },
    ],
    expandablesHeading: "Conversion tracking work that matches what sales sees",
    expandablesLede: "Four settings we configure so a multilingual site's conversion report lines up with the enquiries sales actually receives.",
    expandables: [
      {
        q: "Consent mode configured market by market",
        a: [
          "In the EU every visitor counts, including those who decline cookies, and what reaches your analytics from them depends on how consent mode is configured. Consent rates differ sharply by country, so two markets with identical real performance can report very differently.",
          "We configure consent mode per market and report each market's consent rate alongside its figures, so you rank your languages on what their visitors do.",
        ],
      },
      {
        q: "A conversion defined as the enquiry you want",
        a: [
          "We filter the spam, the test entries and the job applications out of the raw count of form submissions, so each market's figure matches what the sales team sees arrive.",
          "The definition we use is the one your own people recognise, agreed with you before anything is measured: usually an enquiry that became a conversation.",
        ],
      },
      {
        q: "Attribution rules across languages",
        a: [
          "A visitor who lands on the English page, switches to French and converts belongs to one market, and which one depends on the rules chosen. We set those rules with you deliberately, so each switcher is counted once, in the right language.",
        ],
      },
      {
        q: "CRM sync from lead to customer",
        a: [
          "We sync conversion data through to your CRM, which is what lets each market be judged on the quality of what it sent.",
          "It also shows the market where plenty converts and little closes, which points to a positioning question dressed as an analytics one, and gives you the figures to act on it.",
        ],
      },
    ],
    process: [
      {
        title: "A free 20-minute stack walkthrough",
        text: "We walk through your analytics, tag manager, ad accounts and CRM with you, and show what it takes for each market's figures to match what sales sees.",
      },
      {
        title: "A written scope",
        text: "The events, markets, accounts and reports we will set up, named in writing, with the definition of a conversion agreed with your sales team.",
      },
      {
        title: "Tracking set up per locale",
        text: "We configure GA4, Google Tag Manager and Google Ads conversions with one set of event definitions in every language, and test each one before it reports.",
      },
      {
        title: "Your CRM connected to the results",
        text: "Where sales pass through a CRM, we send each lead's outcome back to GA4 and Google Ads, so every market is measured through to a qualified result.",
      },
      {
        title: "A monthly report per market",
        text: "Each market's conversions reviewed every month, with its consent rate alongside, and a short note on what changed and where the budget should move next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
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
        heading: "What you get from a multilingual SEO engagement",
        paragraphs: [
          "A ranked list of your markets, scored on evidence, so the first one we open is the one most likely to send enquiries soon.",
          "Pages written natively in each language. Search engines treat them as original content, AI engines tend to cite them ahead of machine translation, and native readers stay to read them.",
          "One structure for every language. We agree slugs, internal links, schema and keyword targets per language before the first page goes live, so French published now and Spanish added six months later fit together.",
          "A monthly report per market: rankings, AI answers and enquiries, with what moved and what comes next.",
        ],
      },
      {
        heading: "The research, writing and setup we run per language",
        paragraphs: [
          "Every global SEO programme we run starts with native research in each target language, covering real commercial intent and long-tail phrasing per market. Subdirectory, subdomain or ccTLD gets a reasoned recommendation for your case, with hreflang and per-language sitemaps configured from the start.",
          "We settle early the decisions that are expensive to undo later: the domain structure, the hreflang map and the order the markets go in. We check that hreflang sits on every page, the homepage included, so each visitor lands on the version for their country. Writing runs fluent and direct for French, English, Spanish and Dutch, and through native copywriters from the BeTranslated network for German, Italian, Portuguese and other languages. LocalBusiness, Service, Article and FAQ schema is built per language and validated on Google's Rich Results tool, and the same work extends to how ChatGPT, Claude, Perplexity and AI Overviews answer in each language.",
        ],
      },
      {
        heading: "Three cases where the multilingual scope was the whole challenge",
        paragraphs: [
          "BeTranslated, the translation agency we have run for over two decades, runs ten country-specific domains with WPML across all of them, cross-domain hreflang, native content per market from the in-house translator team and schema localized per country. The result has been consistent organic ranking across several European markets and AI citations in each target language for translation services queries.",
          "Century 21 Perdomo sells Dominican real estate in English, French, Spanish and German on a headless WordPress, WPML and WooCommerce build, with every locale researched from its own market's searches.",
          "A Valencia law firm working in Spanish, French, English and Russian runs WPML across all four, with LegalService schema localized per language and attorney bios adapted to each audience. It now gets recurring leads on commercial-intent queries such as business law and franchise contracts, in its clients' own languages.",
        ],
      },
    ],
    expandablesHeading: "Multilingual SEO work we run across several markets",
    expandablesLede:
      "Six pieces of work in a programme that opens market after market, and what each one gives you.",
    expandables: [
      {
        q: "Market launches in waves",
        a: [
          "The brief that arrives most often asks for English, French, Spanish, German, Italian, Portuguese, Dutch, Japanese and Chinese from day one. We open three or four markets first, where the evidence is strongest, because four markets done properly beat nine launched together every time we have compared them: the four get the depth to rank.",
          "A second wave stays a test until the first shows traction, so your budget follows the markets that return it.",
        ],
      },
      {
        q: "Market scoring on evidence",
        a: [
          "We score your candidate markets, usually eight to twelve at the start, on five things: search volume, competitive difficulty, commercial fit with what you actually sell, the cost of localizing for them, and the regulatory load they bring with them.",
          "You get a ranked list that settles the order on evidence, and the scoring often puts first a different market from the one someone in the room feels strongly about. Around the half-year mark we review which test markets to promote and which to pause.",
        ],
      },
      {
        q: "A domain structure recommendation",
        a: [
          "We recommend a ccTLD, a subdomain or a subdirectory for your case, and the choice turns on budget, how much authority you can afford to split, and how much a local buyer needs to see a local domain before they trust you. A ccTLD per market is the strongest local signal and the most expensive thing to maintain. A subdirectory keeps the authority in one place and is the right default for most companies adding markets to an existing business.",
          "We settle it once, early, because a slightly imperfect choice at the start costs less than a move later.",
        ],
      },
      {
        q: "Keywords and references localized per market",
        a: [
          "A removalist in Australia is a removals company in the UK, and London searches for the second word. We research the term people type in each market, and carry the same care through currency, units, legal references, payment methods, trust badges and the customer names you cite as proof.",
          "Regulatory framing changes with it: GDPR in the EU, CCPA in California, LGPD in Brazil. We cite the one your reader lives under, so the page reads as written for them.",
        ],
      },
      {
        q: "Hreflang, sitemaps and schema per market",
        a: [
          "We validate hreflang per market, split the sitemap by language, translate slugs into each language and localize schema per country. Broken or circular hreflang is the single most common finding in the audits we run, and fixing it lifts the ceiling on everything above it.",
          "We set geo-IP to suggest a version and let visitors choose theirs, so every version stays visible to the crawler and within reach of anyone travelling, which is a lot of the business audience.",
        ],
      },
      {
        q: "Local links and AI citations per country",
        a: [
          "We earn links country by country, because a backlink from local press, a sector association or a regional directory in the target country is worth considerably more than a generic international link, because relevance in international search is geographic as well as topical.",
          "We track AI answers the same way. Which sources get cited varies by country and by language, so we report citations per market alongside rankings.",
        ],
      },
    ],
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your site in each language you sell in and show you which markets have the most to give, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the first call you get a written scope naming the markets, the pages and the deliverables, with the order the markets go in.",
      },
      {
        title: "Native research per market",
        text: "We research each target market in its own language, score the candidate markets on evidence and settle the domain structure before the first page goes live.",
      },
      {
        title: "Native pages for every language",
        text: "We write French, English, Spanish and Dutch pages directly and brief native copywriters from the BeTranslated network for German, Italian and Portuguese, with the technical setup checked per language.",
      },
      {
        title: "Monthly reporting per market",
        text: "We report rankings, AI answers and enquiries market by market each month, with what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as each market pays.",
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
        heading: "What you get from our French SEO",
        paragraphs: [
          "French pages a buyer in France trusts at first read, researched and written in French, with a monthly count of the enquiries they bring, kept apart from your other markets.",
          "A French buyer shortlists the way yours do: read a few sites, compare them, contact one or two. Within the first sentence they know whether a page was written in France: the word a French writer would choose, the right register, an example that makes sense to them.",
          "Your reports show the French traffic arriving; the enquiry itself is decided on the page, often in favour of a French competitor with a weaker product and better French.",
          
        ],
      },
      {
        heading: "French SEO written in French from the start",
        paragraphs: [
          "We research what French buyers actually type, in French and market by market. Their words are often different from yours: a British buyer searches for SEO, while a French one often types “référencement naturel”, so a site that uses both reaches them.",
          "French is Mike Bastin's native language, so French runs directly here. The research, the page copy and the reading of what French visitors do are all handled in French by the people setting the strategy.",
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
          "BeTranslated, the translation agency we have run for over two decades, has its French site on its own .fr domain, with keyword research done specifically for France.",
          "Matosurf is our own French board sports site: a hundred and twenty guides to forty-eight French spots, written in French for French riders.",
          "For Delaguía y Luzón, a Valencia law firm working across Spain and France, the French pages are held to the standard a French lawyer would apply when reading them, because in legal content precise terms matter for liability first and for rankings second.",
        ],
      },
    ],
    expandablesHeading: "French SEO work we run, market by market",
    expandablesLede:
      "Seven pieces of the job that are specific to French, and what each one gives you.",
    expandables: [
      {
        q: "A domain recommendation for France",
        a: [
          "We recommend a .fr domain or a French subdirectory for your case. A .fr reads as French to a French buyer and to Google; a subdirectory under an existing domain is easier to run and inherits the authority already built, so it usually wins for a company adding French to an existing business.",
          "On a .com or another generic domain, we point a French subdirectory at France with hreflang and offer visitors the choice of version, so the French speaker abroad and the English speaker in Paris each land where they want, and a crawler sees every version.",
        ],
      },
      {
        q: "Research on accented and unaccented queries",
        a: [
          "French is written with accents and searched both ways. Plenty of people type référencement, plenty type referencement, and on a phone keyboard the unaccented form wins more often than a French brand would like to admit.",
          "We research both forms and write the accented one correctly in the copy, so your page reads as French and the unaccented query still finds it.",
        ],
      },
      {
        q: "Titles and descriptions written to French length",
        a: [
          "French usually runs longer than the English it replaces, so a title tag and meta description sized in English and then translated run past the snippet length.",
          "We write them natively to the French limit, so the whole phrase shows in the result that has to win the click, and we check navigation labels and buttons for the same expansion.",
        ],
      },
      {
        q: "Versions for France, Belgium, Switzerland and Quebec",
        a: [
          "France, Belgium, Switzerland and Quebec share the language, and each has its own habits. A Swiss buyer reads prices in CHF, search habits differ, and the register that sounds right in Paris sounds imported in Montreal.",
          "Where more than one is in scope, we set up fr-FR, fr-BE, fr-CH and fr-CA versions, so each one ranks in its own country. Where only France is in scope, we build one French version targeted at France.",
        ],
      },
      {
        q: "Optimization focused on Google France",
        a: [
          "Google carries the French market, so we put the optimization effort there.",
        ],
      },
      {
        q: "Belgian sites in French and Dutch",
        a: [
          "A Belgian company usually needs French and Dutch side by side, and a Belgian buyer notices which of the two was written first. Writing each language natively wins both halves of the country.",
          "French and Dutch both run directly here, so a Belgian site gets one strategy in two languages, from one team working to one brief. The fr-BE and nl-BE versions stay apart from the French and Dutch sites aimed at France and the Netherlands.",
        ],
      },
      {
        q: "Research before translation",
        a: [
          "We research first, every time, so the French terms buyers search for go into the brief the translator works from and the page is right first time.",
          "Where the translation is already done, our audit shows which pages are worth rewriting around French search and which can stay as they are. Usually it is a handful of pages.",
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
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your French pages the way a buyer in France reads them and show you where the biggest gains sit, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the call you get a written scope naming the French pages, the research and the deliverables, in order of what each one is worth to you.",
      },
      {
        title: "Research and writing in French",
        text: "We research French searches market by market and write or rewrite the pages that matter directly in French, so they read as written in France from the first sentence.",
      },
      {
        title: "Setup and trust signals for France",
        text: "We set up language targeting, mobile speed, a French Google Business Profile and the French directory listings your sector uses, so French buyers find you and trust what they find.",
      },
      {
        title: "Monthly reporting on French enquiries",
        text: "Each month you get a short report on French rankings and enquiries, kept apart from your other markets, with what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
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
          "The German is written by the native German translators and copywriters of BeTranslated, the translation agency we have run for over two decades. They have written German for clients selling into Germany, Austria and Switzerland for years, and they work from our briefs, written for the German page.",
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
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your German pages next to your German competitors and show you where the biggest gains sit, before you commit to anything.",
      },
      {
        title: "Strategy agreed in English or French",
        text: "We agree the strategy and editorial calendar with you in English or French, then send a written scope naming the German pages and the deliverables.",
      },
      {
        title: "Written by native German copywriters",
        text: "Native German copywriters from BeTranslated write each page from our brief, and a second native German reads it before it goes live, so it sounds local to German buyers.",
      },
      {
        title: "Company details a German buyer checks",
        text: "We set up the Impressum, the privacy policy and opt-in consent the way a German buyer expects, so the page earns their trust as well as their visit.",
      },
      {
        title: "Monthly reporting on German enquiries",
        text: "Each month you get a short report in English or French on German rankings and enquiries, with what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
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
          "Delaguía y Luzón is a Valencia law firm whose site leads in Spanish.",
          "Century 21 Perdomo sells property in the Dominican Republic in four languages, Spanish among them.",
          "ValenciaMove, our own relocation site for Valencia, carries Spanish alongside four other languages.",
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
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your Spanish pages market by market and show you which Spanish to start with and where the biggest gains sit, before you commit.",
      },
      {
        title: "A plan per market",
        text: "We agree a strategy and editorial calendar per market with you in English, French or Spanish, and send a written scope naming the pages and deliverables.",
      },
      {
        title: "Spain written directly from Valencia",
        text: "We research and write the Spanish for Spain ourselves from Valencia, straight from the plan to the page, so buyers in Madrid read a supplier who sounds local.",
      },
      {
        title: "Latin America from Santo Domingo",
        text: "Native copywriters on the BeTranslated team in Santo Domingo write each Latin American variant from our briefs, and we check every page so the markets stay one plan.",
      },
      {
        title: "Monthly reporting per market",
        text: "Each month Spain and each Latin American market get their own numbers, with a short report on what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
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
          "Bemelman Spuiterij is a powder-coating specialist in Noordwijkerhout, in the Bollenstreek, with forty-five years of reputation. Its site is written entirely in Dutch, with a page per service and a quote form that asks for the project type and the surface area, so requests arrive ready to price.",
          "BeTranslated, the translation agency we have run for over two decades, has its own .be and .nl sites, each researched for its own market.",
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
          "It belongs here because search is judged on sales as well as visits, and the visitor who finds their usual payment method at checkout is the one who completes.",
        ],
      },
    ],
    demand: {
      volume: 800,
      kd: "3",
      note: "The market is larger than the figure: buyers name the country more often than the language, so `seo netherlands` (400) and `seo belgium` (350) each draw more than `dutch seo` (250).",
      measured: "23 September 2026",
    },
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your Dutch pages next to your Dutch and Belgian competitors and show you where the biggest gains sit, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the call you get a written scope naming the Dutch pages and deliverables, and whether the Netherlands, Flanders or both come first.",
      },
      {
        title: "Research and writing directly in Dutch",
        text: "We research and write the Dutch ourselves, and every commercial page gets a native Dutch reader before it goes live, so it reads as local in Amsterdam and Antwerp.",
      },
      {
        title: "Company details Dutch buyers check",
        text: "We set out the KvK or KBO and BTW details, cookie consent and the iDEAL or Bancontact payments that Dutch and Belgian buyers look for.",
      },
      {
        title: "Monthly reporting per country",
        text: "Each month you get a short report on Dutch and Belgian enquiries, kept apart from your other markets, with what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
  },
  {
    slug: "italian-seo",
    name: "Italian SEO",
    cardTitle: "Italian SEO and GEO for the Italian market",
    inline: "Italian SEO",
    h1: "Italian SEO and GEO agency for companies selling into Italy",
    subhead: "Few competitors write native Italian pages for the terms your buyers search, so well-written Italian pages get seen early and turn visits into enquiries.",
    cluster: "Search",
    angle: "SEO Italy, where native copy wins",
    lede: "An Italian buyer looks for the Partita IVA and the REA registration before enquiring, and notices whether the page speaks in tu or voi. Pages that carry those details and read as written in Italy win the enquiry.",
    metaTitle: "Italian SEO agency for companies selling into Italy",
    metaDescription: "Italian SEO written natively, with the Partita IVA and REA details Italian buyers check, in a market with little competition for your terms.",
    sections: ["Three things Italian SEO has to get right", ...ENGAGEMENT],
    body: [
      {
        heading: "What we set up for an Italian site",
        paragraphs: [
          "Italian pages in the right register. We settle with you where a page speaks in tu and where it takes the polite form, and native Italian writers hold that register across every commercial page.",
          "Regional targeting where it pays. Milan, Rome, Naples and Palermo behave differently on price sensitivity, payment habits and trust signals, so we run one national site for niche B2B and adapt by region for anything closer to consumer search.",
          "The registration details an Italian buyer checks. We set out a visible Partita IVA, codice fiscale and REA or Chamber of Commerce registration, and build consent to the standard of the Garante della Privacy, which runs stricter than the EU baseline on some points.",
        ],
      },
      {
        heading: "Strategy from us, Italian from native writers",
        paragraphs: [
          "Choosing an Italian SEO company usually comes down to who writes the Italian. We handle the strategy and the competitor reading directly: our Italian is enough to manage SEO projects in it. Native Italian copywriters from the BeTranslated network write the pages, briefed by us in English or French, and a second native reader checks each one before anything ships.",
          "Where the offer justifies it, we target per macro-region (Nord, Centro, Sud) and build local landing pages for Milan, Rome, Turin and other metropolitan areas. Our outreach targets Corriere della Sera, La Repubblica and Sole 24 Ore for B2B, plus sector associations such as Confindustria and Confartigianato.",
        ],
      },
    ],
    expandablesHeading: "The objection an Italian buyer raises first",
    expandables: [
      {
        q: "How much Italian do you speak?",
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
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your Italian pages the way a buyer in Italy reads them and show you where the biggest gains sit, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the call you get a written scope naming the Italian pages, the regions worth targeting and the deliverables, in order of what each one is worth.",
      },
      {
        title: "Written by native Italian copywriters",
        text: "Native Italian copywriters from BeTranslated write each page from our brief, and a second native Italian reads it before it ships, so it reads as written in Italy.",
      },
      {
        title: "Registration details and consent set up",
        text: "We put the Partita IVA, codice fiscale and REA details where Italian buyers look for them, and set up consent to the stricter reading of the Garante della Privacy.",
      },
      {
        title: "Monthly reporting on Italian enquiries",
        text: "Each month you get a short report on Italian rankings and enquiries, kept apart from your other markets, with what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
  },
  {
    slug: "portuguese-seo",
    name: "Portuguese SEO",
    cardTitle: "Portuguese SEO and GEO for Portugal and Brazil",
    inline: "Portuguese SEO",
    h1: "Portuguese SEO and GEO agency for Portugal and Brazil",
    subhead: "Portugal and Brazil each get their own pages, keywords and native writers, so buyers on both sides of the Atlantic read Portuguese written for them.",
    cluster: "Search",
    angle: "Two markets, one language",
    lede: "A reader in Lisbon finds Brazilian Portuguese distracting, and a reader in São Paulo finds European Portuguese stiff. Each market gets its own pages and keywords, and Brazil is by far the larger of the two.",
    metaTitle: "Portuguese SEO services, Portugal and Brazil",
    metaDescription: "Portuguese SEO with separate pages, keywords and native writers for Portugal and Brazil, plus the payment and registration details each market expects.",
    sections: ["Three things Portuguese SEO has to get right", ...ENGAGEMENT],
    body: [
      {
        heading: "What we build for Portugal and for Brazil",
        paragraphs: [
          "Pages written for each variant. We produce European Portuguese for Portugal and Brazilian Portuguese for Brazil, each with its own vocabulary, grammar conventions, currency and keywords, so a reader in Lisbon and a reader in São Paulo each find a page written for them.",
          "A plan sized to Brazil. Brazil has over 213 million people (IBGE estimate, 2025), its own ecommerce platforms and payment methods such as PIX and boleto bancário. Many European companies start with Portugal, and we plan for the far larger market alongside it.",
          "The details each market checks. For Portugal we set out a NIF or NIPC and GDPR-compliant consent. For Brazil we set out a CNPJ, LGPD-compliant data handling and PIX or boleto as payment options for consumer stores.",
        ],
      },
      {
        heading: "Native writers per variant, coordinated by us",
        paragraphs: [
          "Native PT-PT copywriters for Portugal and native PT-BR copywriters for Brazil from the BeTranslated network handle the research and writing, briefed by us in English or French and checked by a second native reader per variant. Our Portuguese is enough to manage SEO projects in it.",
          "We keep pt-PT and pt-BR as distinct hreflang versions, so each ranks in its own country, and we earn every link on its own market's side of the Atlantic: Público and Expresso in Portugal, Folha and Estadão in Brazil.",
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
          "Our Portuguese is enough to manage SEO projects in it, built on French, Spanish and Italian, and a native Portuguese speaker on our in-house IT team checks the setup and the details with us. That covers auditing a SERP, following a competitor's pages, checking the technical configuration for each variant and taking notes in a native team meeting.",
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
          "It belongs in an SEO plan because search traffic is worth what it converts, and a checkout that offers what a Brazilian buyer expects converts more of it.",
        ],
      },
    ],
    demand: {
      volume: 1150,
      kd: "33",
      note: "`seo portugal` sits at difficulty 33, ten times the difficulty of the German or Spanish equivalents, so it is built last.",
    },
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your Portuguese pages for Portugal and for Brazil and show you which market to open first and where the biggest gains sit.",
      },
      {
        title: "A written scope per market",
        text: "After the call you get a written scope naming the pages and deliverables for each variant, in order of what each one is worth to you.",
      },
      {
        title: "Native writers for each variant",
        text: "Native copywriters from BeTranslated write European Portuguese for Portugal and Brazilian Portuguese for Brazil from our briefs, and a second native reader checks every page per variant.",
      },
      {
        title: "Registration, consent and payments set up",
        text: "We set out the NIF or NIPC and GDPR consent for Portugal, and the CNPJ, LGPD handling and PIX or boleto payments for Brazil, so each market finds what it checks.",
      },
      {
        title: "Monthly reporting per market",
        text: "Each month Portugal and Brazil get their own numbers, with a short report on rankings, enquiries, what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
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
        heading: "What you get from a local SEO engagement",
        paragraphs: [
          "Your Google Business Profile, set up and kept current in each language your city searches in. We choose the categories, write the full service list, keep the hours current, add photos and publish regular posts, week after week, so the profile holds its place on the map.",
          "Your name, address and phone number made identical everywhere. We audit every directory, review site and chamber of commerce entry already listing you, correct the inconsistencies, remove the duplicates and add you to the local sources your trade actually uses.",
          "A page for each neighbourhood you actually serve. We write each one to say something true about that district and link it from your main service pages, so people searching for a service plus a neighbourhood find you.",
          "A review request routine that runs after every job, by email or from a code on the receipt, and a reply we write to every review, critical ones included.",
        ],
      },
      {
        heading: "Where a local presence brings in calls and visits",
        art: {
          src: "/images/sections/local-seo-visibility.webp",
          alt: "One faded, outlined shopfront beside a solid, visible shopfront marked with a map pin",
        },
        paragraphs: [
          "On the map, at the moment of decision. Somebody searching for a service near them looks at the map and decides there: they call one of the three businesses on it, after reading the reviews of the other two. For a small business working from one address, the profile often brings in more enquiries than the website does.",
          "In both languages of a bilingual city. A profile in Spanish and English reaches the English speaker two streets away searching in English as well as the Spanish speaker, and the business that adds the second language takes both.",
          "In the answers of AI assistants. A growing share of best-in-town questions go to ChatGPT, Claude or Perplexity before anyone opens a map, and those answers draw on the same material we build for you: structured data, consistent citations, and a reputation visible enough to be summarised.",
        ],
      },
      {
        heading: "Local SEO we run on our own properties and for clients",
        paragraphs: [
          "Bemelman Spuiterij is a powder-coating specialist in Noordwijkerhout, in the Bollenstreek, with forty-five years of reputation and, before we started, a web presence still to build. We built Dutch local SEO around the small number of trade buyers who search for that work.",
          "ValenciaMove is our own relocation site for Valencia, built around neighbourhood guides in five languages.",
        ],
      },
    ],
    expandablesHeading: "Local SEO work that keeps you on the map",
    expandables: [
      {
        q: "Google Business Profile setup and upkeep, per language",
        a: [
          "We fill the profile in fully, with categories, services, hours, photos and posts, and keep it current week after week. A profile that is kept up holds its place against competitors who update theirs.",
          "In a city with more than one working language, we run the profile in each one, so it reaches every buyer nearby in the language they search in.",
        ],
      },
      {
        q: "Name, address and phone number audit and cleanup",
        a: [
          "Google reads your details from dozens of places, and when they all match it trusts all of them. We audit what is already out there, correct the inconsistencies, remove duplicate listings, and add you to the high-value local sources still to list you: the chamber of commerce, the sector association, the directory your trade actually uses.",
        ],
      },
      {
        q: "Neighbourhood pages for the districts you serve",
        a: [
          "We write a page per district that says something true about that district, well beyond a swapped place name, and link each one from your main service pages so buyers and Google find it.",
          "Each page carries local schema with the right subtype: a law firm is a LegalService, a freight forwarder is a FreightForwarder.",
        ],
      },
      {
        q: "A review request process, with a reply to every review",
        a: [
          "We set up a request that goes out after each job is done, by email or from a code on the receipt, which is what collects reviews steadily. Every review gets a reply, critical ones included, because the reply is read by everyone who comes after.",
          "We also write your plan for a critical review before one arrives, since a critical review handled well reads better than a wall of five stars.",
        ],
      },
      {
        q: "Local presence in AI assistants",
        a: [
          "A growing share of best-in-town questions get asked of ChatGPT, Claude or Perplexity before anyone opens a map. We build the material those answers draw on: structured data, consistent citations, and a reputation visible enough to be summarised, so the assistant has what it needs to name you.",
        ],
      },
    ],
    expandablesLede: "Five pieces of work we run for you, in every language your city searches in.",
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your Google Business Profile, your directory listings and your local pages in each language your city searches in, and show you where the quickest gains sit.",
      },
      {
        title: "A written scope",
        text: "The profiles, listings and neighbourhood pages we will work on, in each language, named in writing with who does what, so you know exactly what lands and when.",
      },
      {
        title: "Profile and listings put right",
        text: "We complete your Google Business Profile, make your name, address and phone number identical across every directory, and remove the duplicate listings, so Google trusts every listing it finds.",
      },
      {
        title: "Neighbourhood pages and reviews",
        text: "We write a page for each district you serve and set up the review request routine, with a reply to every review, so each neighbourhood search has a page to find.",
      },
      {
        title: "Monthly upkeep and reporting",
        text: "Posts, photos, hours and review replies kept current every month in each language, with a short report on what moved on the map and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
    absorbs: ["local-seo"],
    demand: {
      volume: 134000,
      kd: "5 to 87",
      note: "Sums `local seo`, `local seo services` and `local seo agency` worldwide. The head term alone draws 63,000 at KD 87, easily the hardest term measured for any service page. `local seo services` (47,000, KD 5) and `local seo agency` (24,000, KD 6) carry nearly as much volume between them at a fraction of the difficulty.",
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
        heading: "What you get from a website localization project",
        paragraphs: [
          "Copy that reads as local. We localize the page text, the calls to action, dates, imagery and trust marks for each market, so every language version reads as written for the people buying in it.",
          "A checkout each market recognises. On WooCommerce, Shopify and Magento we set local currency, prices formatted the way each market writes them, local payment methods and checkout flows per region, since shoppers are more likely to complete when they see a payment option they know.",
          "Layouts with room for every language. We adjust buttons, menus, headings and price tables for the text expansion German routinely needs against an English source, mirror the layout for right-to-left languages such as Arabic, and set correct character encoding across every language in scope.",
          "A localization test pass before launch. We check every page, form, menu and language switcher in each language for display, function and fit, and put every issue in one report, where it is quickest to fix.",
        ],
      },
      {
        heading: "The multilingual setup we build underneath the words",
        paragraphs: [
          "We choose and set up the multilingual plugin that fits your site and your team. WPML is our default for WordPress, Polylang suits tighter budgets or simpler structures, and TranslatePress fits a non-technical content team that translates in context on the front end. We also work with Weglot, Shopify and Webflow.",
          "We test across WordPress, Joomla, Drupal or a custom build, so each language version launches with its own URL, its own metadata and its own place in the sitemap, ready to rank in its market.",
        ],
      },
      {
        heading: "A four-language property site that stays correct as listings turn over weekly",
        paragraphs: [
          "Century 21 Perdomo sells Dominican real estate in four languages on a headless WordPress, WPML and WooCommerce stack, where a property selling, a price moving or a status flipping has to update correctly in all four locales at once.",
        ],
      },
    ],
    expandablesHeading: "What we localize and set up beyond the copy",
    expandables: [
      {
        q: "Multilingual plugin choice and setup",
        a: [
          "We pick the plugin from how your site is built and who will run it, then set it up. WPML is the most complete on SEO, asks the most of your hosting and carries a licence to renew. Polylang fits a tighter budget and a simpler structure, and suits straightforward translation workflows. TranslatePress suits a non-technical team that translates on the front end, seeing the page as they change it. MultilingualPress suits a multisite network. GTranslate offers machine translation with a switcher, which is a different product from a localized site.",
          "We settle the choice at the start, because the content ends up stored the plugin's way, and the right plugin keeps every language easy to maintain for years.",
        ],
      },
      {
        q: "Layouts built for text expansion",
        a: [
          "We size buttons, menu items and headings for German compounds and French expansion, and test the layout with real localized copy at the places that matter most: the navigation, the call to action and the price table.",
          "For right-to-left languages we mirror the whole layout, and we check character encoding on forms, search and anything that touches a database, so every script displays as it should.",
        ],
      },
      {
        q: "Checkout localization for online stores",
        a: [
          "Product descriptions and SKUs are the visible half. We also localize the half that moves the conversion rate: the currency shown, prices formatted the way each market writes them, the payment methods offered and an address form shaped the local way.",
          "WooCommerce, Shopify and Magento each expose these settings differently, so we set them up per platform until the last step of the checkout feels as local as the first.",
        ],
      },
      {
        q: "Localization testing before launch",
        a: [
          "We test every interface element, form, menu, switcher and piece of multimedia in each language for display, function and fit: the language switcher landing on the right page, a form accepting every valid local postcode, a date reading as the right month.",
          "The pass also covers what the market requires legally, from consent handling to accessibility, and you get every issue in one report before launch.",
        ],
      },
      {
        q: "Localization on Joomla, Drupal and custom builds",
        a: [
          "Joomla and Drupal both handle multilingual content well, each in its own way, and we agree the content model with you before anything gets translated.",
          "On every platform we give each language version its own URL, its own metadata and its own place in the sitemap, so a search engine can rank it per market.",
        ],
      },
    ],
    expandablesLede: "Plugin choice, layout, checkout, testing and platforms beyond WordPress, each handled inside the same project.",
    process: [
      {
        title: "A free localization assessment",
        text: "We review your site in each language you sell in and show you where the copy, prices, checkout and layout most need adapting for each market.",
      },
      {
        title: "A written scope",
        text: "After the first call you get a written scope naming the pages, the markets and the deliverables, so you know exactly what we localize and set up.",
      },
      {
        title: "Plugin choice and setup",
        text: "We choose the multilingual plugin that fits your site and your team, from WPML, Polylang, TranslatePress or Weglot, or work in Shopify or Webflow, and set it up per language.",
      },
      {
        title: "Copy, prices and checkout localized",
        text: "We adapt the copy, currency, payment methods and checkout for each market, and adjust the layout so longer text sits cleanly in buttons, menus and headings.",
      },
      {
        title: "A localization test pass before launch",
        text: "We test every language for display, function and fit, put every issue in one report and fix each one before your localized site goes live.",
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
    cardTitle: "Certified and specialist translation services",
    inline: "translation services",
    h1: "Translation services for documents a court or embassy must accept",
    subhead: "Each document goes to a sworn or specialist translator in its field, from a business proposal to a court filing, delivered in one to seven days.",
    cluster: "Localization",
    pillar: true,
    angle: "Where accuracy is a liability question",
    lede: "You have a contract, a patient record or a birth certificate that a court, a regulator or an embassy has to accept, with every term right the first time. Work goes through the BeTranslated network, which we have run for over two decades.",
    metaTitle: "Certified and sworn translation services, Mike Bastin",
    metaDescription: "A contract, a patient record or a certificate a court or an embassy has to accept. Certified and sworn translation services through the BeTranslated network.",
    sections: ["Where translation accuracy carries the most weight", ...ENGAGEMENT],
    body: [
      {
        heading: "What you get from our translation services",
        paragraphs: [
          "Sworn and certified translations of birth certificates, powers of attorney, court rulings and immigration documents, prepared for the specific court, embassy or public administration you submit them to, in Spain, the UK or across the EU.",
          "Medical translation by translators who know the terminology of your medical field: patient records, informed consent forms and regulatory submissions handled under GDPR and HIPAA confidentiality protocols.",
          "Financial and legal translation, from annual reports and prospectuses to contracts, patent filings and articles of association, that holds up to the same scrutiny as the original, because every clause in a shareholder agreement and every figure in an audited statement is a liability question.",
        ],
      },
      {
        heading: "How the BeTranslated network delivers it",
        paragraphs: [
          "Translation runs through BeTranslated, the translation agency Mike Bastin founded and has run for twenty years, with certified and sworn translators per language and per specialism (legal, medical, financial, academic, technical). Delivery takes one to seven days, depending on the complexity of the document and your situation, with rush turnaround available for time-critical personal documents such as a visa or birth certificate translation.",
          "Every document gets matched to a translator with the relevant sector background, then a review pass before delivery, with notarisation or an apostille handled where the receiving institution requires it. For US and Canadian citizens, we also provide apostille services.",
        ],
      },
      {
        heading: "Where the accuracy standard gets tested",
        paragraphs: [
          "Delaguía y Luzón is a Valencia law firm whose practice runs across Spain and France in four languages, including Russian, so the same document sometimes needs to hold up in two legal systems at once. Its site carries that translated legal content.",
        ],
      },
    ],
    expandablesHeading: "Translation work we take on, by document type",
    expandables: [
      {
        q: "The right certification for the body receiving your document",
        a: [
          "We confirm with you which of the four the receiving institution asks for, because people often ask for a different one from the one they need. A certified translation carries a signed statement of accuracy from the translator or agency. A sworn translation is made by a translator formally registered with a court or ministry, which is how Spain, France and much of the EU handle official documents. Notarisation adds a notary attesting to the signature, not to the translation. An apostille authenticates the document itself for use abroad under the Hague Convention, and is issued by the authorities of the country the document comes from. For US and Canadian citizens, we provide apostille services too.",
          "A court, a registry, a university admissions office and an immigration authority each have their own rule, so we start from theirs.",
        ],
      },
      {
        q: "Legal translation for the receiving jurisdiction",
        a: [
          "We translate contracts, court filings, witness statements, powers of attorney, articles of association, shareholder agreements, patent and trademark filings. Legal language is bound to its jurisdiction as well as technical, so our translators choose each term for the weight it carries in the receiving legal system.",
        ],
      },
      {
        q: "Medical and regulated translation",
        a: [
          "We translate patient records, clinical trial documentation, regulatory submissions, informed consent forms, patient information and discharge instructions, device manuals and research papers. Much of it is read first by an ethics committee or a regulator, so we match the terminology that body already uses.",
          "We apply the same care to the marketing material around a medical device, which is regulated copy wearing a commercial jacket.",
        ],
      },
      {
        q: "Financial translation in the vocabulary of your reporting standard",
        a: [
          "We translate annual reports, prospectuses, fund fact sheets, balance sheets, income and cash flow statements, audit reports and tax filings. Financial reporting has settled vocabulary tied to the standards in use, and our translators keep to it exactly.",
        ],
      },
      {
        q: "Academic translation for recognition abroad",
        a: [
          "We translate degree certificates, transcripts and mark sheets, research papers and journal articles, personal statements and recommendation letters, syllabi and course descriptions. A transcript carries a grading system of its own, and we set out how it maps onto the receiving country's, which keeps an application moving.",
          "For research writing we keep the argument intact, hedging included, so a carefully qualified claim stays exactly as qualified in translation.",
        ],
      },
      {
        q: "Transcreation for campaigns and brand copy",
        a: [
          "A campaign line, a tagline or a piece of brand copy that works in one language often needs a new form in another, because what it does is cultural. We rewrite it for the same effect, from a brief describing what the original is meant to achieve.",
          "We use transcreation for marketing, and send anything a regulator, a court or an examiner will compare line by line to translation.",
        ],
      },
    ],
    process: [
      {
        title: "A free consultation",
        text: "Tell us what the document is and who will receive it, and we confirm which kind of translation that body asks for: certified, sworn, notarised or apostilled.",
      },
      {
        title: "A quote for your document",
        text: "We send a quote for your document and your deadline, so you know the cost and the delivery date before the translation begins.",
      },
      {
        title: "A translator matched by specialism",
        text: "Your document goes to a certified or sworn translator from the BeTranslated network with background in its field: legal, medical, financial, academic or technical.",
      },
      {
        title: "A review pass before delivery",
        text: "Every translation goes through a review pass before delivery, so it holds up to the same scrutiny as the original document.",
      },
      {
        title: "Delivery in one to seven days",
        text: "Delivery takes one to seven days depending on the complexity of the document and your situation, with rush turnaround for time-critical personal documents such as a visa or birth certificate.",
      },
      {
        title: "Notarisation or apostille where needed",
        text: "Where the receiving institution requires it, we handle notarisation or an apostille, and we provide apostille services for US and Canadian citizens.",
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
    subhead: "Prepared for new languages before launch, so adding each market after that is a content job and the code stays as it is.",
    cluster: "Localization",
    angle: "Strings, and everything around them",
    lede: "You are shipping the product into a market that writes longer sentences than English, sometimes reads right to left, and reviews you in a store in its own language. The work starts with the interface around the translation.",
    metaTitle: "App and software localization services",
    metaDescription: "Shipping into a market that writes longer than English or reads right to left? App and software localization covers layout, formats and store listings.",
    sections: ["What software needs to cross a language", ...ENGAGEMENT],
    body: [
      {
        heading: "What you get from app and software localization",
        paragraphs: [
          "Interface text that reads as native. We translate and adapt your interface text, notifications and app store descriptions for clarity and cultural relevance, and adjust dates, currency and units of measurement per locale.",
          "Store listings found in each market. We optimize app store keywords per target market, so each listing supports discoverability in the language people search in.",
          "Layouts that hold in every script. Interface text that fits comfortably in English routinely runs longer in German, so we test the layout against that expansion to keep buttons whole, labels complete and navigation aligned. For right-to-left scripts such as Arabic and Hebrew we adjust the layout itself, along with the text direction, and we set character encoding so accented characters and non-Latin scripts display as they should.",
          "Testing on the devices your users have. We test across the operating systems and devices actually used in each market.",
          "Video and audio in every language. We provide subtitling and voice-over across standard formats, with accurate transcription supporting both localization and accessibility compliance.",
        ],
      },
      {
        heading: "Where localization pays off for a product sold abroad",
        paragraphs: [
          "A product ready for every next language. Once the groundwork is in place, adding a market becomes a content job and the codebase stays closed.",
          "A store page that speaks to each market. People searching in Spanish find a listing written in their own words, with screenshots showing the interface in Spanish.",
          "A clean launch in every language, with the overflowing label, the misread date and the rejected postcode found in testing and fixed before your users meet them.",
        ],
      },
    ],
    expandablesHeading: "The work, in the order we run it",
    expandables: [
      {
        q: "Internationalization groundwork, done first",
        a: [
          "We prepare the software with your developers: strings pulled out of the code, whole sentences kept whole in the string files, dates, numbers and currency formatted by locale, sorting that follows each target language's rules, and layouts with room for text arriving longer than the English.",
          "With the groundwork done first, adding a language is a content job, and every market after the first leaves the codebase closed.",
        ],
      },
      {
        q: "App store listings written per locale",
        a: [
          "We write the title, the subtitle, the description and the keyword field for each store and each locale, using all the room the character limits give, in the words people in that market type when they search.",
          "We plan the screenshots per locale too, so a store page showing the interface in Spanish tells a Spanish browser the app is for them before they read a word.",
        ],
      },
      {
        q: "Testing across language, device and operating system",
        a: [
          "We test each language on the devices and operating systems your users have, and look for the defects that sit outside the translation: a label that overflows its button in German, a date that reads as the wrong month, a form that rejects a valid local postcode, a right-to-left layout that mirrors everything except one icon.",
          "Each one goes into a single report, ready to fix before release.",
        ],
      },
      {
        q: "Subtitling, voice-over and transcription per language",
        a: [
          "We work out with you which of the three each piece of video or audio needs, then produce it per language. Subtitles carry most of the value at the lowest cost.",
          "A transcript does double duty: it makes the content accessible and it puts words on a page that search and an answer engine can read.",
        ],
      },
    ],
    expandablesLede: "Internationalization, store listings, testing and media, run in the order that keeps each new market affordable.",
    process: [
      {
        title: "A free localization assessment",
        text: "We look at your app or software and its store listings, and show you what each new market needs, from interface text to layout, formats and store keywords.",
      },
      {
        title: "A written scope",
        text: "After the first call you get a written scope naming the languages, the screens, the store listings and the deliverables, so the project is clear from the start.",
      },
      {
        title: "Internationalization groundwork",
        text: "We prepare the product for new languages with your developers, from strings and locale formats to layouts with room for longer text, so each later market is a content job.",
      },
      {
        title: "Translation, store listings and media",
        text: "We translate and adapt the interface, notifications and store listings per market, and add subtitles, voice-over or transcripts where your video and audio need them.",
      },
      {
        title: "Testing per language and device",
        text: "We test each language across the operating systems and devices used in each market, and you get every layout, format and text issue in one report before launch.",
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
    metaTitle: "AI consulting services for multilingual SEO",
    metaDescription: "Told that AI can handle your German content? Some of it can. AI consulting that says which part still needs a person who reads the language.",
    sections: ["Where AI helps, and where a person does", ...ENGAGEMENT],
    body: [
      {
        heading: "What you get from an AI consulting engagement",
        paragraphs: [
          "An assessment of where AI fits in your multilingual workflow. We look at each step, from keyword research to the published page, and tell you which ones machine output can take on and which stay with a person who reads the language.",
          "Machine translation set up with a reader. We set up neural machine translation with terminology-aware post-editing, so the first draft of a multilingual page arrives faster and a native editor makes it right.",
          "A review of your multilingual support assistant. We assess whether it can answer on its own, or needs a human fallback past the routine questions, against the actual cost of a wrong answer.",
          "Sentiment analysis across your markets, surfacing patterns in how your brand is discussed that a manual review would take weeks to find.",
          "Measurement, so you see in figures whether each piece of the setup paid for itself.",
        ],
      },
      {
        heading: "Where AI gains you the most, with a person on the judgement calls",
        paragraphs: [
          "Speed on the early work. AI-assisted research gets through the first keyword and competitor work across languages far faster than doing it by hand, and we put it to work there.",
          "Accuracy where it counts. We keep three judgement calls with someone who knows the market: commercial copy that converts in languages outside a model's native-sounding range, choosing which of two culturally different approaches will land better with a specific audience, and catching the subtle, confident error that reads as fluent and is factually off.",
          "A reader on every output. Someone who reads the target language reviews the output of every AI system in the stack, so the fluent, professional-looking sentence that is quietly wrong gets caught before a customer sees it.",
        ],
      },
    ],
    expandablesHeading: "What we set up and review for you",
    expandablesLede: "The four pieces of work an AI consulting engagement usually covers, each checked by a reader of the language.",
    expandables: [
      {
        q: "Machine translation with a reader on the output",
        a: [
          "We choose and tune an engine for your subject matter to take the first pass, then put a native editor on the material that carries risk and a lighter pass on the rest, so everything you publish has had a reader.",
        ],
      },
      {
        q: "Multilingual support assistant review",
        a: [
          "We review the assistant that answers your customers on the site, built on your own material so it answers about your products specifically. We check that it handles the repetitive questions in each market with one team behind it, and hands over cleanly when a question goes beyond it.",
          "We give every language the assistant answers in a reader who checks its answers, so an invented answer is caught early.",
        ],
      },
      {
        q: "Sentiment analysis across markets",
        a: [
          "We run sentiment and theme analysis across reviews, support tickets and social mentions per language, which is where the gap between what a market says and what you assume it wants tends to show up first.",
          "We split the report by language, so a complaint pattern that appears in one language alone, usually a sign of a localization defect, stands out.",
        ],
      },
      {
        q: "Measuring whether it worked",
        a: [
          "We measure accuracy on a sample somebody checks, turnaround time, cost per published page, and whether the people using the output would choose to keep it. Market-level numbers sit alongside those, so each language shows its own result on the dashboard.",
        ],
      },
    ],
    process: [
      {
        title: "A free 20-minute stack walkthrough",
        text: "We walk through your current tools and multilingual workflow with you and point out where AI could save time, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the call we send a written scope naming the workflows we will work on, the deliverables and how we will measure each one.",
      },
      {
        title: "An assessment of where AI fits",
        text: "We map your multilingual workflow step by step and report where machine output can take the first pass and where a native reader keeps it right.",
      },
      {
        title: "Setup with a reader on every language",
        text: "We set up the machine translation, support assistant review or sentiment analysis agreed in the scope, with a reader of each target language checking the output.",
      },
      {
        title: "Measuring whether it worked",
        text: "We measure accuracy on a checked sample, turnaround, cost per published page and results per market, and give you a written report on what to keep.",
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
        heading: "What you get from a post-editing pass",
        paragraphs: [
          "A close read by a native speaker who knows the subject, catching the fluent sentence that has shifted the meaning, dropped a qualifier or mistranslated a technical term.",
          "A glossary per sector and per language. We settle terminology once, correct every page against it, and standardise formatting and tone across languages so the brand voice holds.",
          "Review depth set by the stakes. A product description gets a light touch, and a clause in ecommerce terms or an instruction in medical or legal content gets a specialist reader, because it carries liability.",
          "Your search targets kept in place. We check each page against the SEO targets it was meant to hit, so the post-edit keeps the grammar right and the target keyword in place.",
        ],
      },
      {
        heading: "Where post-editing pays most",
        paragraphs: [
          "Sites translated by a plugin. Machine translation through WPML, Weglot or Polylang's auto-translate reads as professionally written, and our pass makes it accurate as well, down to the strings a reader rarely looks at.",
          "Sectors that scale on machine first drafts. The trade calls the service MTPE, and we run it across sectors that lean on AI output to scale quickly, particularly SaaS, ecommerce and travel, where the volume of content calls for machine first drafts and the accuracy bar stays commercial.",
        ],
      },
    ],
    expandablesHeading: "What the post-editing pass covers",
    expandablesLede: "The four things we work on in machine output, in the order a reader meets them.",
    expandables: [
      {
        q: "Register, idiom and rhythm",
        a: [
          "Engines now produce grammatically correct sentences, so we work on the ones that are correct and slightly off: a register too formal for the market, an idiom translated where it wanted replacing, a rhythm that reads as translated even when the cause is spread across a whole sentence.",
        ],
      },
      {
        q: "Finishing plugin auto-translation",
        a: [
          "Weglot, WPML and Polylang fill a site with translated strings quickly, and the result is usable and ready for finishing.",
          "We cover what the plugin touched out of the reader's sight: title tags, meta descriptions, alt text, button labels, form validation messages and confirmation emails, so a page that reads beautifully in French also shows its form messages in French.",
        ],
      },
      {
        q: "One agreed term per language",
        a: [
          "An engine can translate the same term three different ways across a site because it sees each sentence alone. For a product name, a legal term or anything a customer will search for, we settle one term per language and apply it everywhere, so the agreed term is the one that ranks.",
          "We give it most attention on the pages where a sale happens.",
        ],
      },
      {
        q: "Specialist readers for regulated content",
        a: [
          "We put a specialist reader on anything a regulator, a court or a clinician reads: medical documentation, legal text, financial reporting and safety instructions, where a plausible-sounding error costs more than a delay does.",
        ],
      },
    ],
    process: [
      {
        title: "A free localization assessment",
        text: "We read a sample of your machine-translated pages and show you what a post-editing pass would change, and which content calls for the deepest review.",
      },
      {
        title: "A glossary and a written scope",
        text: "We agree the pages, the review depth for each and a glossary of terms per language, so every key term is decided once before the pass starts.",
      },
      {
        title: "The post-editing pass",
        text: "A native speaker who knows the subject works through the machine output, correcting meaning, terminology, tone and formatting against the glossary and your brand voice.",
      },
      {
        title: "SEO targets and page details checked",
        text: "We check each page against its SEO targets and go through the titles, descriptions, image text, buttons and form messages the plugin translated.",
      },
      {
        title: "Delivery, glossary included",
        text: "You receive the edited pages ready to publish, with the agreed glossary to keep for the next batch of content in each language.",
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
    subhead: "A generative engine optimization agency that structures your pages for ChatGPT, Perplexity and Google's AI Overviews to cite, as well as for Google to rank.",
    cluster: "AI",
    pillar: true,
    angle: "Cited inside the answer as well as ranked below it",
    lede: "ChatGPT, Perplexity and Google's AI Overviews answer a buyer's question directly, and name two or three sources while doing it. Being one of them puts you in the buyer's consideration at the moment they ask.",
    metaTitle: "Generative engine optimization agency and AEO",
    metaDescription: "ChatGPT, Perplexity and Google AI Overviews name a small number of sources when they answer a question. See what it takes for the answer to name you.",
    expandablesHeading: "Generative engine optimization work that gets your pages cited",
    expandablesLede: "Six pieces of work, run together, each aimed at the answers your buyers read.",
    expandables: [
      {
        q: "Presence across the answer engines your market uses",
        a: [
          "Buyers now ask ChatGPT, Perplexity, Bing and a voice assistant before they ask Google, and each one assembles its answer differently.",
          "We build your presence across the platforms your market actually uses, with one voice and one claim everywhere, because answer engines favour sources that say the same thing wherever they appear.",
        ],
      },
      {
        q: "Content written for the whole question",
        a: [
          "An answer engine reads a conversational question and returns a direct response. We shape each page to match the question as asked, with the longer, spoken-shaped phrases and the related terms around them, so the page answers the whole question.",
          "We keep each page quick to load, with a structure a reader can scan and enough reason to stay past the first screen.",
        ],
      },
      {
        q: "Expertise made visible on the page",
        a: [
          "Experience, expertise, authoritativeness and trust still decide what gets quoted, and an answer engine reads them from what the page shows. We add named authors with a real record, claims a model can check, and dates that show the page is maintained.",
        ],
      },
      {
        q: "Structured data a machine can read",
        a: [
          "Schema is how a retrieval system works out what a page is about before deciding whether to cite it. We mark up each page with types that match what it really is, validated, and carrying only claims the page makes.",
        ],
      },
      {
        q: "Citations earned from sources a model already trusts",
        a: [
          "We earn coverage from publications in your market and create material worth referencing on its own, one citation at a time.",
        ],
      },
      {
        q: "Citation tracking and reporting per market",
        a: [
          "The answer engines rewrite their retrieval behaviour on their own schedule, so we re-test regularly: which platforms name you, for which questions, and which sources the answers in your market cite. We close the gap between their pages and yours, and adjust the approach as the models change.",
          "Our reporting ties visibility in AI answers back to enquiries per market, so the work is judged on what it brought in.",
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
        heading: "What you get from generative engine optimization",
        paragraphs: [
          "A GEO audit of where you stand: which buyer questions in your market get answered by ChatGPT, Perplexity, Claude and Google's AI Overviews, which sources those answers name, and where your pages can join them.",
          "Pages rewritten around answer-shaped claims. We put a clear, quotable claim near the top of each page that matters, so a model can quote it directly and accurately, and we make the expertise behind it visible with named authors and current dates.",
          "One consistent identity everywhere you appear. We align your business name, service names and claims across your site, your profiles and the platforms your market uses, because answer engines favour sources that say the same thing wherever they appear.",
          "Monthly citation tracking that reports which platforms name you for which questions, tied back to the enquiries each market sends.",
        ],
      },
      {
        heading: "Why a citation wins buyers alongside a ranking",
        paragraphs: [
          "A user who asks ChatGPT or Perplexity a question gets a direct answer with a small number of sources named inside it. A mention inside that answer is earned separately from a page-one ranking, because the model selects a handful of sources it judges citation-worthy from all the pages that match the query. We shape your pages to be among the sources it picks for the questions your buyers ask.",
          "The pages that get named tend to share a shape: a clear, quotable claim near the top, structured data that tells a crawler exactly what the page is, and a consistent way of naming the same entity, the same business name and the same service name, across every place that entity appears online. We build that shape into your pages, then track the result.",
        ],
      },
    ],
    demand: {
      volume: 55000,
      kd: "39 to 70",
      note: "Sums `generative engine optimization` (26,000 worldwide, KD 70), `answer engine optimization` (13,000, KD 39) and `geo seo` (16,000, KD 63).",
    },
    process: [
      {
        title: "A GEO audit",
        text: "We check which AI answers in your market name you, which name your competitors, and what your pages need for ChatGPT, Perplexity and Google's AI Overviews to cite them.",
      },
      {
        title: "A written scope",
        text: "The pages, platforms and buyer questions we will work on, named in writing and ordered by what each is worth to your enquiries.",
      },
      {
        title: "Pages reshaped for citation",
        text: "We rewrite your key pages around clear, quotable claims and add structured data that tells AI systems what each page is, starting with the questions buyers ask most.",
      },
      {
        title: "Citation tracking every month",
        text: "We check which platforms name you for which questions, report what moved, and choose the next pages for the same treatment from that data.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
  },
  // ---- Cluster 5: supporting capability ----
  {
    slug: "technical-seo",
    name: "Technical SEO",
    cardTitle: "Technical SEO for multilingual websites",
    inline: "technical SEO",
    h1: "Technical SEO services for multilingual websites",
    subhead: "We audit, fix and monitor the setup behind every language version of your site, so each one reaches the buyers searching in it.",
    cluster: "Supporting",
    angle: "The foundations every language ranks on",
    lede: "We work out what each language version of your site needs to reach its buyers, put the fixes in ourselves or brief your developers, and check every month that they hold.",
    metaTitle: "Technical SEO services for multilingual websites",
    metaDescription: "Technical SEO for multilingual websites: we audit every language version, make the fixes with your team and report per market every month.",
    sections: ["What lets a multilingual site rank in every language", ...ENGAGEMENT],
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at your site in each of its languages and show you where the biggest gains sit, before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "The pages, the fixes and who makes each one, you or us, in order of what each is worth.",
      },
      {
        title: "The fixes, highest value first",
        text: "We make the changes on your site or write the tickets your developers work from, and check each one once it is live.",
      },
      {
        title: "Monthly monitoring per language",
        text: "Crawl, indexation and rankings checked market by market, with a short report on what moved and what comes next.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work carries on for as long as it pays.",
      },
    ],
    body: [
      {
        heading: "What you get from a technical SEO engagement",
        paragraphs: [
          "A written audit of every language version, ranked by what each fix is worth: hreflang, canonicals, redirects, sitemaps, indexation, page speed and structured data, checked market by market in Search Console and in a full crawl of the site.",
          "The fixes themselves. We make them directly on WordPress with WPML, Polylang, TranslatePress or Weglot, and on Shopify or Webflow, or we brief your developers and check each change once it ships.",
          "Monitoring every month, per language, so new pages and site changes keep the setup intact, with a report that shows each market on its own.",
        ],
      },
      {
        heading: "Where multilingual sites gain the most",
        paragraphs: [
          "Language versions that reach their own audience. We set hreflang tags so every page names its siblings with the right language and country codes, which sends a French buyer to the French page and gives Search Console a clean report.",
          "Index space spent on the pages that sell. We split sitemaps by language, merge thin near-duplicates and point crawlers at the pages worth ranking, so Google indexes more of what each market should see.",
          "Site moves that keep their rankings. When a site changes platform, domain or URL structure, we map every old address to its new one and check the redirects before and after launch.",
          "We run the same setup across four languages on a headless WordPress, WPML and WooCommerce build for Century 21 Perdomo, and across the regional domains of BeTranslated, each with its own sitemaps and hreflang groups.",
        ],
      },
    ],
    expandablesHeading: "Five more jobs inside the same engagement",
    expandablesLede:
      "Keyword research, on-page work, analytics, link building and English-language search, run alongside the technical work.",
    expandables: [
      {
        q: "Keyword research, market by market",
        a: [
          "We research each market in its own language and sort the terms by the stage a buyer is at, from first question to ready to compare suppliers. Each term then gets one page working for it.",
          "The research also covers where answers now appear, AI summaries included, so the pages we shape can be quoted there.",
        ],
      },
      {
        q: "On-page work on the pages that matter",
        a: [
          "We set titles, headings, internal links and page structure so each page tells Google, and a buyer, what it is for, and we speed up the pages that need it.",
          "On a multilingual site most of the gain comes from settling which page owns a query in each language, so two of your own pages stop splitting the same searches.",
        ],
      },
      {
        q: "Analytics that reports each market",
        a: [
          "We set up GA4 and Google Tag Manager so each language reports its own traffic and enquiries, with conversions defined as the enquiries you actually want.",
          "You see which market converts and which is still building, and the next month's work is chosen from that.",
        ],
      },
      {
        q: "Link building per market",
        a: [
          "We earn editorial links, resource page placements and guest posts on sites a buyer in your market reads, per language, since a Spanish page gains most from Spanish links.",
          "Anchor text reads like a person wrote it and the referring sites are relevant to your trade, so every link keeps its value.",
        ],
      },
      {
        q: "English SEO for each English market",
        a: [
          "English is often your largest market, and the UK, the United States and Ireland search as three. We choose the variant each page targets and match its spelling and terms to the searches.",
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
        heading: "What you get from a content marketing engagement",
        paragraphs: [
          "Demand research. We find the questions your buyers search for, check which of them carry commercial intent and how strong the pages already answering them are, and hand you the list in priority order.",
          "A publishing calendar built from that research, naming each page, the question it answers and the order it goes out, with the pages you already have mapped against it so every subject is written once.",
          "The writing. We write each page to answer one question better than the pages ranking for it now, and our editor sends a draft back until it does.",
          "Rewrites of pages already ranking. Most sites have pages on the second or third page of results for a term worth having, and we lift those first because they are the quickest gain on the calendar.",
          "Measurement. We report what each page earned in rankings, traffic and enquiries, so the calendar keeps moving towards the subjects that pay.",
        ],
      },
      {
        heading: "Where search-led content pays most",
        paragraphs: [
          "Search and sales served by one programme. We run the research and the writing as one job, so every subject has demand behind it and every page is written to hold the position it wins.",
          "Pages with a purpose beyond search. A subject with little measurable search behind it can still earn its place, for a sales conversation or a newsletter, and we commission it knowingly, for that purpose.",
        ],
      },
      {
        heading: "Written for B2B buyers and the committees behind them",
        paragraphs: [
          "Most of the companies we write for are B2B, so we brief every page for a committee and a long buying cycle. The page that earns the enquiry is usually the one answering the objection, and we make sure the calendar carries it.",
          "When the programme runs in several languages, each language gets its own keyword research, its own page plan and its own trust signals.",
        ],
      },
    ],
    expandablesHeading: "What runs inside a content engagement",
    expandablesLede: "Choosing the subjects, lifting the pages you have, setting the pace and writing in each language.",
    expandables: [
      {
        q: "Keyword selection checked against the results",
        a: [
          "We check every term with a large number beside it twice: whether the people searching it are buyers, and whether a new page can displace the ones already ranking within two years. Both answers come before anything is commissioned, when finding them costs least.",
          "We take first the terms where the demand is real and the pages answering it are thin. Difficulty scores approximate that, and we read the results themselves to settle it.",
        ],
      },
      {
        q: "Rewrites of pages close to the first page",
        a: [
          "We start with the pages you already have ranking on the second or third page of results for a term worth having. Lifting one of those is faster and more certain than starting a new page, and it costs a fraction of the words.",
        ],
      },
      {
        q: "A publishing cadence set by quality",
        a: [
          "We set the cadence by how many pages we can make the best answer to their question. One strong page a month will overtake four thin ones, so the calendar carries as many pages as we can write to that standard.",
        ],
      },
      {
        q: "Writing, research and reporting in every language we cover",
        a: [
          "Our part is the writing, research and structure, and the reporting around them. Social accounts, campaign creative and media buying sit with other specialists, and links come from editorial placement only.",
          "For languages beyond French, English, Spanish and Dutch, a native copywriter from the BeTranslated network writes the pages, and we brief and review the work, the same arrangement the language pages describe.",
        ],
      },
    ],
    process: [
      {
        title: "A free 20-minute audit",
        text: "We look at what you already publish against what your buyers search for, and show you where the quickest gains sit before you commit to anything.",
      },
      {
        title: "A written scope",
        text: "After the first call we send a written scope naming the pages, the research and the deliverables, in order of what each is worth to you.",
      },
      {
        title: "Research and a publishing calendar",
        text: "We research the questions your buyers ask, check who already ranks for each one, and turn the results into a calendar you approve page by page.",
      },
      {
        title: "Writing and rewrites",
        text: "We write the new pages and rewrite the ones already ranking close to the first page, each briefed against one question and edited before it reaches you.",
      },
      {
        title: "Monthly reporting on what each page earned",
        text: "Every month we report the rankings, traffic and enquiries each page brought in, and choose the next month's calendar from those results.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the programme carries on for as long as it pays for itself.",
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
        heading: "What you get in each market",
        paragraphs: [
          "Keyword research in the market's own language. We research how buyers in Spain or France phrase the problem, because the phrasing shifts with the language as well as the words, and we build that market's page plan from it.",
          "Pages written natively. We write French, English, Spanish and Dutch directly, and German, Italian and Portuguese go to native copywriters from the BeTranslated network, briefed and reviewed by us.",
          "A cultural review before publication, checking messaging, tone and every claim against local values, so each page reads as written for its market.",
          "Social content per market where it is in scope, on the platforms each audience uses: Facebook and Instagram cover many markets, WeChat matters more in China and VK more in Russia.",
        ],
      },
      {
        heading: "Trust and search signals set up in every language",
        paragraphs: [
          "Trust signals in each language. We give every market the E-E-A-T signals it looks for, such as expert authorship, verifiable sources and testimonials, because a reader and a search engine both judge trustworthiness locally, from what they can verify in front of them.",
          "The structure behind each version. We handle native keyword localization, hreflang and canonical setup, and schema (Article, FAQPage, LocalBusiness as relevant) per language to support rich results.",
        ],
      },
    ],
    expandablesHeading: "What we write and check in every market",
    expandablesLede: "The research, the writing, the checks and the social side, run separately for each language.",
    expandables: [
      {
        q: "Topic clusters built from each language's own queries",
        a: [
          "We build each cluster from the queries searched in that language. A cluster that works in English maps how English speakers break a subject down, and another language often splits one of your topics into two or merges two into one.",
          "You get the pages that market is looking for, linked in the shape local search follows.",
        ],
      },
      {
        q: "Experience and expertise shown in each language",
        a: [
          "We put Google's quality signals in place per language: an author with a real name and real credentials, dates, citations to sources that market recognises, and a business identity a local reader can verify.",
        ],
      },
      {
        q: "Page details checked in every language",
        a: [
          "We write meta titles and descriptions natively to the local character budget, point internal links at the same-language version, carry the localized values in the schema and check that hreflang resolves both ways.",
          "A crawler reads each of these closely, so with all four right a site that reads well in four languages can rank in all four.",
        ],
      },
      {
        q: "Cultural review before publication",
        a: [
          "We check every page for the colour, gesture, comparison or claim that reads as ordinary in one market and as careless in another, before publication, when a fix costs least.",
          "We also set the tone per market. How direct a market expects a commercial page to be varies widely, and we tune the voice so it reads as confident wherever it lands.",
        ],
      },
      {
        q: "Social calendars per market, where in scope",
        a: [
          "Where social is part of the work, we plan a calendar per market on the network each audience uses, with timing, format and tone set for that market.",
          "We check platform rules and local advertising law per jurisdiction, so a campaign cleared in one country is cleared for the next before it runs.",
        ],
      },
    ],
    process: [
      {
        title: "A free 20-minute audit",
        text: "We read your pages in each language against what that market searches for, and show you which markets have the most to gain from their own content.",
      },
      {
        title: "A written scope per market",
        text: "After the first call we send a written scope naming the markets, the pages and the deliverables for each, social included where it is part of the work.",
      },
      {
        title: "Research in each language",
        text: "We research every market in its own language, build its topic clusters from its own queries, and give you a page plan per market to approve.",
      },
      {
        title: "Native writing and cultural review",
        text: "Native writers produce each page in the target language, and a cultural review checks messaging, tone and claims against that market before anything goes live.",
      },
      {
        title: "Publishing and monthly reporting",
        text: "We check each page's titles, links and language signals once it is live, then report every month on rankings and enquiries market by market.",
      },
      {
        title: "Month to month",
        text: "Engagements run month to month, so the work in each market carries on for as long as it pays.",
      },
    ],
    absorbs: ["multilingual-seo-copywriting", "cultural-consulting", "multilingual-social-media-management"],
  },
];

export const CLUSTERS = ["Search", "Lead generation", "Localization", "AI", "Supporting"] as const;

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
