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
  name: string;
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
    cluster: "Lead generation",
    pillar: true,
    angle: "The outcome, not the mechanism",
    lede: "Multilingual SEO, localisation and AI consulting are the mechanisms. Enquiries are the product, and enquiries are what gets counted.",
    metaTitle: "Multilingual lead generation, Mike Bastin",
    metaDescription: "Multilingual SEO, localisation and AI consulting are the mechanisms behind one outcome, enquiries. See how the engagement measures and delivers them.",
    sections: ["What gets measured", "How it is delivered", "The evidence", ...ENGAGEMENT.slice(2)],
  },
  {
    slug: "multilingual-sem",
    name: "Multilingual SEM",
    cluster: "Lead generation",
    angle: "Paid demand capture across languages",
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
    absorbs: ["analytics-and-tracking"],
  },

  // ---- Cluster 2: multilingual search, the engine ----
  {
    slug: "multilingual-seo",
    name: "International SEO",
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
    cluster: "Search",
    angle: "The primary market",
    lede: "France carries 1,850 of the 2,390 monthly searches measured across the whole francophone core, at a difficulty score of 0 to 2. Belgium and Switzerland are where the network is, not where the search volume is.",
    metaTitle: "French SEO services, Mike Bastin",
    metaDescription: "France carries most of the francophone search volume in this market, at low difficulty. See what a proper French SEO engagement covers.",
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
    gsc: { impressions: 3093, position: 43.7, keywords: 40 },
    needsRefresh:
      "Source copy still runs the 2024 structure while all five sibling language pages were refreshed. The highest-impression service page on the domain is the one running the oldest copy.",
    demand: {
      volume: 2700,
      kd: "3 to 6",
      note: "Largest of the six. `seo france` alone pays $40.00 a click, the highest CPC of any language-market term measured.",
    },
  },
  {
    slug: "german-seo",
    name: "German SEO",
    cluster: "Search",
    angle: "Precision market",
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
    cluster: "Search",
    angle: "Proximity market",
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
    demand: {
      volume: 2100,
      kd: "0 to 7",
      note: "Third-largest, and the two biggest terms both sit at difficulty 0.",
    },
  },
  {
    slug: "dutch-seo",
    name: "Dutch SEO",
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
    cluster: "Search",
    angle: "Completing the grid",
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
    cluster: "Search",
    angle: "Off-site, one location at a time",
    lede: "Google Business Profile, citations, NAP consistency and the map pack, for multilingual cities where the same street gets searched in more than one language. Discipline and consistency, not tricks.",
    metaTitle: "Local SEO and Google Business Profile",
    metaDescription: "Local SEO measures the highest search volume of any service here, though the head term is the hardest to rank. See the Google Business Profile work behind it.",
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
    absorbs: [
      "content-localisation", "localisation-testing", "multilingual-cms-integration",
      "wordpress-translation-plugin", "localised-e-commerce-integration", "multilingual-ux-ui-design",
    ],
  },
  {
    slug: "translation-services",
    name: "Translation services",
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
    absorbs: [
      "business-translation", "medical-translation", "academic-translation", "financial-translation",
      "legal-translation", "certified-and-sworn-translation-services", "expert-translation-services",
      "transcreation",
    ],
  },
  {
    slug: "app-and-software-localisation",
    name: "App and software localisation",
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
    cluster: "AI",
    pillar: true,
    angle: "The differentiator",
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
    name: "GEO and AEO",
    cluster: "AI",
    pillar: true,
    angle: "Cited inside the answer, not just ranked below it",
    lede: "ChatGPT, Perplexity and Google's AI Overviews answer a question directly and name a small number of sources while doing it. Structured data, citation-worthy claims and a presence across the platforms people actually ask, so the answer names you.",
    metaTitle: "GEO and AEO: cited by AI answers",
    metaDescription: "ChatGPT and Google AI Overviews name a small number of sources, and GEO and AEO terms already draw real search volume of their own. See what it takes to be named.",
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
    cluster: "Supporting",
    angle: "Outer section, bridges back",
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
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building"],
  },
  {
    slug: "multilingual-content",
    name: "Multilingual content",
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

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
