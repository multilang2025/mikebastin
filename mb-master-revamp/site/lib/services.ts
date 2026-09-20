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
  /** Heading and label form: "International SEO", "Website localisation". */
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

const ENGAGEMENT = [
  "What we include in the engagement",
  "Our process in five steps, named deliverables",
  "What is included, what is not",
  "Frequently asked questions",
];

export const SERVICES: Service[] = [
  // ---- Cluster 1: multilingual lead generation, the product ----
  {
    slug: "lead-generation",
    name: "Multilingual lead generation",
    inline: "multilingual lead generation",
    cluster: "Lead generation",
    pillar: true,
    angle: "The outcome, not the mechanism",
    lede: "Multilingual SEO, localisation and AI consulting are the mechanisms. Enquiries are the product, and enquiries are what gets counted.",
    metaTitle: "Multilingual lead generation, Mike Bastin",
    metaDescription: "Multilingual SEO, localisation and AI consulting are the mechanisms behind one outcome, enquiries. See how the engagement measures and delivers them.",
    sections: ["What gets measured", "How it is delivered", "The evidence", ...ENGAGEMENT.slice(2)],
    // No `body` here on purpose: lead-generation has its own hand-built route
    // at app/services/lead-generation/page.tsx rather than rendering through
    // services/[slug], and that route does not read `body`. Adding one would
    // be data nothing renders.
  },
  {
    slug: "multilingual-sem",
    name: "Multilingual SEM",
    inline: "multilingual SEM",
    cluster: "Lead generation",
    angle: "International PPC, buying what search has not earned",
    lede: "Reaching the buyer who has not found you organically yet, in the language they searched in, without letting a single blended campaign quietly subsidise one market from another.",
    metaTitle: "Multilingual SEM services, Mike Bastin",
    metaDescription: "Paid search that reaches buyers in the language they searched in, market by market, so one blended campaign never quietly subsidises another.",
    sections: ["Three patterns that drain ad budgets", ...ENGAGEMENT],
    body: [
      {
        heading: "Where translated campaigns quietly cost more",
        paragraphs: [
          "A campaign translated from one master list keeps the original keywords, ad copy structure and bidding approach, and it shows in the results: a lower quality score because the terms are not how people actually search in that language, ad copy that reads stilted, landing pages that feel imported. Native research per market beats a translated campaign in effectively every comparison we have run.",
          "Keywords picked straight from a planning tool without checking real intent produce high impressions, low click-through and clicks that never convert. Real keyword research means checking the actual search results in the target market and validating terms with native speakers before any bid goes live.",
          "Blended conversion tracking that mixes every market into one number hides which language is profitable and which is bleeding spend. Each market needs its own tracking, attribution and KPI report, or optimisation is guesswork with extra steps.",
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
  },
  {
    slug: "conversion-tracking",
    name: "Conversion tracking",
    inline: "conversion tracking",
    cluster: "Lead generation",
    angle: "The evidence layer, per locale",
    lede: "Measuring enquiries per locale rather than per domain. Without it, a market that converts and a market that only gets traffic look identical in the reporting.",
    metaTitle: "Conversion tracking per locale, Mike Bastin",
    metaDescription: "Enquiries measured per locale, not per domain, so a market that converts and one that only gets traffic finally look different in the reporting.",
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
          "GA4 and Google Tag Manager configured per locale, with key events (form submissions, downloads, calls, cart actions for stores) defined once and applied consistently across languages. Where sales pass through a CRM, conversion data is synced so a lead is measured through to a qualified outcome, not just counted at the click.",
          "Reporting is reviewed on a fixed cadence, typically monthly, with a clear owner for the numbers rather than a dashboard nobody opens. A market that stops converting shows up in the data before it shows up in the sales pipeline three months later.",
        ],
      },
    ],
  },

  // ---- Cluster 2: multilingual search, the engine ----
  {
    slug: "multilingual-seo",
    name: "International SEO",
    inline: "international SEO",
    cluster: "Search",
    pillar: true,
    angle: "The engine underneath the outcome",
    lede: "Strategic piloting on our side, native writing per language, with hreflang and schema configured from the brief rather than patched in later.",
    metaTitle: "International SEO consulting, Mike Bastin",
    metaDescription: "International SEO with hreflang and schema built into the brief, native writing per language, and strategic piloting that catches mistakes early.",
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
          "A DeepL pass with a light human review is not localisation, it is patched-up machine translation. Search engines detect it, AI engines tend to avoid citing it, and native readers leave within seconds. The economics are tempting, the outcome is consistently flat. Native writing per language is the only foundation that holds.",
          "Hreflang tags go missing, point in circles, carry the wrong language code, or are simply absent from the homepage. The visitor in the wrong country sees the wrong language version, conversions drop, and Search Console reports a maze that takes longer to untangle than to have built correctly the first time.",
          "One writer publishes in French, another adds Spanish six months later without agreeing on slugs, internal links, schema or keyword targets. By month twelve the multilingual structure is a tangle nobody can audit properly. Governance per language, decided before the first page goes live, is what keeps the site growing clean instead of patched.",
        ],
      },
      {
        heading: "What actually goes into the engagement",
        paragraphs: [
          "Native research in each target language covers real commercial intent and long-tail phrasing per market, never a set translated from English. Subdirectory, subdomain or ccTLD gets a reasoned recommendation rather than a default, with hreflang, sitemaps and Search Console geo-targeting configured per language from the start.",
          "Writing runs fluent and direct for French, English, Spanish and Dutch, and through native copywriters from the BeTranslated network for German, Italian, Portuguese and other languages. LocalBusiness, Service, Article and FAQ schema is built per language and validated on Google's Rich Results tool, and the same work extends to how ChatGPT, Claude, Perplexity and AI Overviews answer in each language.",
        ],
      },
      {
        heading: "Three cases where the multilingual scope was the whole challenge",
        paragraphs: [
          "BeTranslated, the translation agency we co-founded, runs twelve country-specific domains with WPML across all of them, cross-domain hreflang, native content per market from the in-house translator team and schema localised per country. The result has been consistent organic ranking across several European markets and AI citations in each target language for translation services queries.",
          "A Houston freight forwarder targeting English-speaking US shippers and Spanish-speaking Latin American clients runs WordPress and WPML on a single domain with a Spanish subdirectory, distinct keyword research per language and FreightForwarder schema in both. Daily quote requests doubled over eighteen months across both languages.",
          "A Valencia law firm targeting Spanish, French and English-speaking clients runs WPML across all three, with LegalService schema localised per language and attorney bios adapted to each audience. It now gets recurring leads from three markets on commercial-intent queries such as business law and franchise contracts, in their own languages.",
        ],
      },
    ],
    absorbs: ["global-seo-solutions", "internationalisation", "language-solutions", "multilingual-branding"],
    gsc: { impressions: 1405, position: 55.2, keywords: 34 },
  },
  {
    slug: "french-seo",
    name: "French SEO",
    inline: "French SEO",
    cluster: "Search",
    angle: "SEO France, where the francophone volume sits",
    lede: "France is where the francophone search volume actually sits, while Belgium and Switzerland are where the network is. Winning French means writing for France first and selling through the other two.",
    metaTitle: "French SEO services, Mike Bastin",
    metaDescription: "France carries most of the francophone search volume in this market. See what a proper French SEO engagement covers, market by market.",
    sections: ["Three ways to fail at French SEO", ...ENGAGEMENT],
    body: [
      {
        heading: "Where French SEO goes wrong across four markets",
        paragraphs: [
          "France, Belgium, Switzerland and Quebec share a language but not a market. Pricing in EUR does not automatically work for CHF, local search habits do not transfer between them, and treating the four as one audience produces copy that reads as slightly foreign everywhere at once. Hreflang fr-FR, fr-BE, fr-CH and fr-CA disambiguate when more than one is genuinely in scope.",
          "A page translated from English by an agency that does not master the sector produces French that is grammatically fine and commercially flat. French readers notice the register is off before they notice anything else, and the trust never quite forms.",
          "Most French search happens on mobile, so a site that is technically sound on desktop but slow or awkward on a phone loses the majority of its own audience before the content gets read. Page speed and mobile usability carry most of the traffic on this market, not an optional extra.",
        ],
      },
      {
        heading: "What a proper French SEO engagement covers",
        paragraphs: [
          "Native keyword research targeted at France first, since it carries the largest share of francophone search volume, with Belgium and Switzerland picked up through the existing network rather than treated as the primary target. Local citations, French-language backlinks and Google Business Profile optimisation for city-level queries from Paris and Lyon to Brussels and Geneva.",
          "Content localisation that adapts tone and cultural reference rather than translating word for word, technical optimisation for mobile-first search behaviour, and authority building through French press, sector directories and customer reviews that feed E-E-A-T signals directly.",
        ],
      },
    ],
    expandablesHeading: "What French SEO turns on, market by market",
    expandablesLede:
      "The parts of the job that are specific to French rather than true of any language, carried over from the page this one absorbed.",
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
          "The same sentence typically runs 15 to 20 percent longer in French. A title tag and meta description written to length in English and then translated overflow the snippet, and get cut mid-phrase in the result that was supposed to win the click.",
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
          "Most French search is on a phone, so a site that is fast and comfortable on desktop and merely tolerable on mobile is failing the larger half of its own audience before a word of the copy is read.",
          "Google carries the market. Qwant exists and is French, and it is worth knowing about rather than optimising separately for.",
        ],
      },
    ],
    gsc: { impressions: 3093, position: 43.7, keywords: 40 },
    demand: {
      volume: 2700,
      kd: "3 to 6",
      note: "Largest of the six. `seo france` alone pays $40.00 a click, the highest CPC of any language-market term measured.",
    },
  },
  {
    slug: "german-seo",
    name: "German SEO",
    inline: "German SEO",
    cluster: "Search",
    angle: "SEO Germany, researched longer, decided slower",
    lede: "German buyers research further before enquiring than most markets, so the page that wins is the one that answers the question rather than the one that ranks loudest.",
    metaTitle: "German SEO services, Mike Bastin",
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
          "German SEO needs two distinct skills at once: strategic piloting (architecture, keyword targets, technical setup, editorial calendar) and native execution (writing, tone, regulatory compliance). We handle the first directly and hand the second to native German copywriters from the BeTranslated network, briefed and reviewed in English or French.",
          "Impressum compliant with the Telemediengesetz, a strict GDPR-aligned privacy policy, an opt-in cookie banner and, for stores, Trusted Shops integration where it fits. Outreach targets German regional press and trade directories such as IHK listings rather than links bought from an unrelated market.",
        ],
      },
    ],
    expandablesHeading: "The questions a German buyer asks first",
    expandablesLede:
      "What the split between piloted strategy and native writing means in practice, carried over from the page this one absorbed.",
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
    cluster: "Search",
    angle: "SEO Spain, researched here rather than abroad",
    lede: "Spain from Spain. The Valencia base is not a line in a bio, it is why the local search behaviour is familiar rather than researched.",
    metaTitle: "Spanish SEO from Valencia, Mike Bastin",
    metaDescription: "Spanish SEO run from Valencia, Spain, not researched from abroad. See why the local search behaviour here is familiar rather than guessed at.",
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
    cluster: "Search",
    angle: "Small volume, decisive buyers",
    lede: "Dutch trade search is low in volume and high in intent, which rewards covering a narrow thing properly over covering a broad thing thinly. Bemelman Spuiterij is the worked example.",
    metaTitle: "Dutch SEO for trade buyers, Mike Bastin",
    metaDescription: "Dutch trade search is low volume and high intent. See how covering one narrow query network properly beats a broad one covered thinly.",
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
          "Bemelman Spuiterij, a paint and powder-coating specialist based in Hillegom, is the case that shaped this page. Dutch trade search runs low in volume and high in intent, which rewards covering one narrow query network properly rather than a broad one thinly. KvK and BTW compliance, AVG cookie consent and dedicated pages per surrounding town turned into steady map pack visibility across the whole Bollenstreek region.",
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
    cluster: "Search",
    angle: "SEO Italy, where translated copy gets found out",
    lede: "Italian search rewards editorial quality more than most markets, and punishes translated-from-English copy faster.",
    metaTitle: "Italian SEO services, Mike Bastin",
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
          "We read Italian fluently, built on French, Spanish and a Latin background, and use that to handle strategy and competitor reading directly. Native Italian copywriters from the BeTranslated network handle the writing itself, briefed in English or French and checked by a second native reader before anything ships. No pretence about who writes the commercial copy.",
          "Targeting runs per macro-region (Nord, Centro, Sud) when the offer justifies it, with local landing pages for Milan, Rome, Turin and other metropolitan areas where relevant. Outreach targets Corriere della Sera, La Repubblica and Sole 24 Ore for B2B, plus sector associations such as Confindustria and Confartigianato.",
        ],
      },
    ],
    expandablesHeading: "The objection an Italian buyer raises first",
    expandablesLede:
      "Who reads the language, who writes it, and how far to go on regions, carried over from the page this one absorbed.",
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
    cluster: "Search",
    angle: "Two markets, one language",
    lede: "Portugal and Brazil are not one market with one keyword set, and treating them as one is the mistake that makes Portuguese look harder than it is.",
    metaTitle: "Portuguese SEO, Portugal and Brazil",
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
    demand: {
      volume: 1150,
      kd: "33",
      note: "Mid-sized but by far the hardest of the six. `seo portugal` at difficulty 33 is ten times the difficulty of the German or Spanish equivalents, so it should be built last.",
    },
  },

  // ---- Cluster 3: localisation and translation ----
  {
    slug: "local-seo",
    name: "Local SEO",
    inline: "local SEO",
    cluster: "Search",
    angle: "Off-site, one location at a time",
    lede: "Google Business Profile, citations, NAP consistency and the map pack, for multilingual cities where the same street gets searched in more than one language. Discipline and consistency, not tricks.",
    metaTitle: "Local SEO services and Google Business Profile",
    metaDescription: "Google Business Profile, citations and NAP consistency for multilingual cities, where the same street gets searched in more than one language.",
    sections: [
      "Google Business Profile audit and full optimisation",
      "Citation cleanup and NAP consistency across directories",
      "LocalBusiness schema and neighbourhood-level landing pages",
      "Review generation and response strategy",
      "Frequently asked questions",
    ],
    body: [
      {
        heading: "Where local visibility actually gets lost",
        paragraphs: [
          "A Google Business Profile with the wrong categories, an incomplete service list, outdated hours, few photos and no recent posts gets buried below competitors with no better product, just better profile hygiene. Google's own algorithm rewards a profile that is complete and kept active.",
          "A business name that reads slightly differently across a directory listing, a review site and a Chamber of Commerce entry, an address abbreviated one way in one place and spelled out in another, erodes the confidence signal Google reads from name, address and phone consistency. Cleaning it up everywhere is unglamorous work with a direct effect on ranking.",
          "A homepage that says it serves the whole city is a start. A dedicated page per neighbourhood actually served captures the long tail a city-level page misses entirely, because people search for a service plus a neighbourhood, not a service plus a city.",
        ],
      },
      {
        heading: "Two engagements built on profile hygiene and patience",
        paragraphs: [
          "On a paint and powder-coating specialist in Hillegom, full Google Business Profile optimisation, consistent name, address and phone details across Dutch directories and dedicated landing pages for each surrounding town produced map pack presence across the whole Bollenstreek region, with qualified enquiries arriving daily through the profile and the site.",
          "On a Valencia-focused expat content site, dedicated neighbourhood guides with geo schema produced rankings on district-specific queries in both Spanish and English, and AI citations for questions about the best neighbourhoods in the city.",
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
    name: "Website localisation",
    inline: "website localisation",
    cluster: "Localisation",
    pillar: true,
    angle: "Beyond translated strings",
    lede: "Making a site work in a market rather than merely readable in a language, which is a question of currency, form fields, trust signals and search behaviour as much as words.",
    metaTitle: "Website localisation, Mike Bastin",
    metaDescription: "Making a site work in a market, not just readable in a language, covering currency, form fields, trust signals and local search behaviour.",
    sections: ["Why localisation is not translation", ...ENGAGEMENT],
    body: [
      {
        heading: "Why a translated page still reads as imported",
        paragraphs: [
          "A page translated word for word keeps the original currency format, date format, trust signals and calls to action, and reads as imported even when every sentence is grammatically correct. Localisation adapts dates, currency, imagery, payment methods and the calls to action themselves to match what a market actually expects, which is a bigger job than swapping the words.",
          "Right-to-left support for Arabic, the text expansion German routinely needs against an English source, and correct character encoding across every language in scope are technical problems, not linguistic ones, and they surface first in the interface rather than the copy. Testing across WordPress, Joomla, Drupal or a custom build catches them before launch instead of after a support ticket.",
        ],
      },
      {
        heading: "What gets configured underneath the words",
        paragraphs: [
          "WPML runs as the default multilingual stack for WordPress, with Polylang for tighter budgets or simpler structures and TranslatePress where a non-technical content team needs in-context, front-end translation. For stores, WooCommerce, Shopify and Magento get local currency, local payment methods and checkout flows adjusted per region, since conversion rates move measurably once a shopper sees a familiar payment option at checkout.",
          "Full QA runs across languages before launch: every interface element, form, menu and piece of multimedia checked for display, function and cultural fit, not just spot-checked on the homepage. A localisation project that skips this step tends to surface its problems in a support inbox rather than in a test report.",
        ],
      },
    ],
    expandablesHeading: "What localisation touches beyond the copy",
    expandablesLede:
      "Six pages folded into this one, and the parts of each that a translated site still gets wrong.",
    expandables: [
      {
        q: "Which WordPress multilingual plugin, and what each one costs you",
        a: [
          "WPML is the default: the most complete on SEO, the most demanding on hosting and the one with a licence to keep renewing. Polylang fits a tighter budget and a simpler structure, and starts to hurt once translation workflows get complicated. TranslatePress earns its place when a non-technical team needs to translate on the front end, seeing the page as they change it. MultilingualPress suits a genuine multisite. GTranslate is machine translation with a switcher, which is a different product from a localised site and should be chosen knowing that.",
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
        q: "A store is localised at the checkout or not at all",
        a: [
          "Product descriptions and SKUs are the visible half. The half that moves the conversion rate is the currency shown, whether the price is formatted the way that market writes prices, the payment methods offered, and how the checkout handles an address that is not shaped like a British one.",
          "WooCommerce, Shopify and Magento each expose that differently, and each will happily launch a shop that looks translated and feels foreign at the last step.",
        ],
      },
      {
        q: "What localisation testing actually covers",
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
    cluster: "Localisation",
    pillar: true,
    angle: "Where accuracy is a liability question",
    lede: "Legal, medical, financial, academic and certified work, where a mistranslated term is not a ranking problem but an exposure. Delivered through the BeTranslated network, run for twenty years.",
    metaTitle: "Translation services, Mike Bastin",
    metaDescription: "Legal, medical, financial and certified translation, delivered through the BeTranslated network run for twenty years. Accuracy as a liability question.",
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
      "Eight pages folded into this one, each of which was really a different answer to the same question.",
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
    name: "App and software localisation",
    inline: "app and software localisation",
    cluster: "Localisation",
    angle: "Strings, and everything around them",
    lede: "Interface text that has to survive being twice as long in German, right to left in Arabic, and reviewed by an app store in a language nobody on the team reads.",
    metaTitle: "App and software localisation",
    metaDescription: "Software and app localisation for interface text that survives being longer in German, right to left in Arabic, and reviewed by an app store.",
    sections: ["What breaks when software crosses a language", ...ENGAGEMENT],
    body: [
      {
        heading: "The technical problems localisation testing catches early",
        paragraphs: [
          "Interface text that fits comfortably in English routinely runs longer in German, and a layout that was never tested against that expansion breaks buttons, truncates labels and pushes navigation out of alignment. Right-to-left scripts such as Arabic and Hebrew need the layout itself, not just the text direction, adjusted to stay usable.",
          "Character encoding that is not handled correctly turns accented characters and non-Latin scripts into visible errors on screen, the kind of bug that is invisible in English testing and immediately obvious to every user in the affected language. Preparing the software's architecture for this before adding new languages avoids a rebuild every time a market gets added.",
        ],
      },
      {
        heading: "What the localisation pass actually covers",
        paragraphs: [
          "Interface text, notifications and app store descriptions translated and adapted for clarity and cultural relevance, dates, currency and units of measurement adjusted per locale, and app store keywords optimised per target market to support discoverability. Testing runs across the operating systems and devices actually used in each market, not just the primary one.",
          "For video and audio content, subtitling and voice-over work across standard formats, with accurate transcription supporting both localisation and accessibility compliance. Software internationalisation work prepares the underlying architecture, so adding a new language later is a translation task rather than a rebuild.",
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
    cluster: "AI",
    pillar: true,
    angle: "AI consultants who say where AI does not help",
    lede: "Where AI genuinely shortens multilingual work, and where it quietly produces text that reads fine and ranks for nothing. Knowing the difference is the service.",
    metaTitle: "AI consulting for multilingual SEO",
    metaDescription: "Where AI genuinely shortens multilingual work, and where it quietly produces text that reads fine and ranks for nothing. Knowing the difference.",
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
          "Whether a chatbot handling multilingual customer support is safe to deploy on its own, or needs a human fallback for anything past the routine questions, gets assessed against the actual cost of a wrong answer, not against how impressive the demo looked.",
          "The output of any AI system in this stack gets reviewed by someone who reads the target language, because the real risk in AI-assisted multilingual work is never an obviously broken sentence. It is a fluent, professional-looking sentence that is quietly wrong.",
        ],
      },
    ],
    absorbs: ["ai-consulting-services"],
  },
  {
    slug: "ai-translation-and-post-editing",
    name: "AI translation and post-editing",
    inline: "AI translation and post-editing",
    cluster: "AI",
    angle: "Machine first, human decisive",
    lede: "Machine translation has become good enough to be dangerous: fluent output that is confidently wrong is harder to catch than obviously broken output.",
    metaTitle: "AI translation and post-editing",
    metaDescription: "Machine translation is now good enough to be dangerous, fluent and confidently wrong. See the post-editing process built to catch it.",
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
        heading: "What actually gets corrected",
        paragraphs: [
          "Terminology errors and unnatural phrasing corrected against a defined glossary per sector, formatting and tone standardised across languages so the brand voice holds, and consistency checked against the SEO targets the content was meant to hit in the first place, since a post-edit that fixes the grammar but drifts off the target keyword defeats its own purpose.",
          "Work runs across sectors that lean on AI output to scale quickly, particularly SaaS, ecommerce and travel, where the volume of content makes full native writing impractical but the accuracy bar is still commercial, not casual.",
        ],
      },
    ],
    absorbs: ["post-ai-editing"],
  },

  {
    slug: "generative-engine-optimization",
    name: "Generative engine optimisation",
    inline: "generative engine optimisation",
    cluster: "AI",
    pillar: true,
    angle: "Cited inside the answer, not just ranked below it",
    lede: "ChatGPT, Perplexity and Google's AI Overviews answer a question directly and name a small number of sources while doing it. Structured data, citation-worthy claims and a presence across the platforms people actually ask, so the answer names you.",
    metaTitle: "Generative engine optimisation and AEO, Mike Bastin",
    metaDescription: "ChatGPT, Perplexity and Google AI Overviews name a small number of sources when they answer a question. See what it takes for the answer to name you.",
    expandablesHeading: "What changes when the answer is written for you",
    expandablesLede: "Nine shifts, folded in from the article this page absorbed.",
    expandables: [
      {
        q: "Optimise for search everywhere, not only for Google",
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
      note: "Sums `generative engine optimization` (26,000 worldwide, KD 70), `answer engine optimization` (13,000, KD 39) and `geo seo` (16,000, KD 63). Unlike the language markets, all three sit at real difficulty. `generative engine optimization` also carries the highest CPC measured for any service page, at $11.00 a click.",
    },
  },
  // ---- Cluster 5: supporting capability ----
  {
    slug: "technical-seo",
    name: "Technical SEO",
    inline: "technical SEO",
    cluster: "Supporting",
    angle: "Crawlability and hreflang, noticed only when broken",
    lede: "Crawlability, indexation and the hreflang plumbing that decides whether a multilingual site is read as one entity in several languages or several sites competing with each other.",
    metaTitle: "Technical SEO, Mike Bastin",
    metaDescription: "The crawlability, indexation and hreflang plumbing that decides whether a multilingual site reads as one entity or several competing ones.",
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
    expandablesHeading: "The five jobs this page folded together",
    expandablesLede:
      "Keyword research, on-page, analytics, English-language search and link building, each of which had its own page.",
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
    slug: "multilingual-content",
    name: "Multilingual content",
    inline: "multilingual content",
    cluster: "Supporting",
    angle: "Written per market, not translated",
    lede: "Copy researched against the market it is for, because the keyword set that works in English rarely survives translation into the one that works in Spanish.",
    metaTitle: "Multilingual content, written per market",
    metaDescription: "Copy researched for the market it is written for, because the keyword set that works in English rarely survives translation into Spanish.",
    sections: ["Why translated copy underperforms written copy", ...ENGAGEMENT],
    body: [
      {
        heading: "Why a translated keyword set misses the market",
        paragraphs: [
          "The keyword set that works in English rarely survives translation into the one that actually gets searched in Spanish or French, because the way people phrase a problem shifts with the language, not just the words. Copy translated from an English draft ends up optimised for a search pattern nobody in the target market actually uses.",
          "E-E-A-T signals, expert authorship, verifiable sources, genuine testimonials, need to exist per language, not just once on the English homepage, because a reader and a search engine both judge trustworthiness locally, from what they can actually verify in front of them.",
        ],
      },
      {
        heading: "What the engagement covers, cluster by cluster",
        paragraphs: [
          "Content researched and written per market with native keyword localisation, hreflang and canonical setup handled at the structural level, and schema (Article, FAQPage, LocalBusiness as relevant) implemented per language to support rich results. Cultural consulting sits underneath the copy itself, checking messaging and tone against local values before publication rather than after a complaint.",
          "Social platform choice follows the audience rather than habit: Facebook and Instagram cover many markets, but WeChat matters more in China and VK more in Russia, and a content plan that assumes one platform set fits every market misses the audience it was meant to reach.",
        ],
      },
    ],
    absorbs: ["multilingual-seo-copywriting", "cultural-consulting", "multilingual-social-media-management"],
  },
];

export const CLUSTERS = ["Lead generation", "Search", "Localisation", "AI", "Supporting"] as const;

/** Mid-sentence form of each cluster, for the same reason as Service.inline. */
export const CLUSTER_INLINE: Record<string, string> = {
  "Lead generation": "lead generation",
  Search: "search",
  Localisation: "localisation",
  AI: "AI",
  Supporting: "supporting",
};

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
