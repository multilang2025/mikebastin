/**
 * The sixteen consolidated services, per CONTENT-ARCHITECTURE.md section 3.
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
 * that would read as measured.
 */

export type Service = {
  slug: string;
  name: string;
  cluster: string;
  /** Pillars own a query network; the rest support one. */
  pillar?: boolean;
  angle: string;
  lede: string;
  /** Section headings, from the refreshed source pages where they exist. */
  sections: string[];
  /** Legacy slugs this page absorbs, each 301ing in the same locale. */
  absorbs?: string[];
  gsc?: { impressions: number; position: number; keywords: number };
  /** Flags a page whose source copy has not had the refresh its siblings got. */
  needsRefresh?: string;
};

const ENGAGEMENT = [
  "What I include in the engagement",
  "My process in five steps, named deliverables",
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
    sections: ["What gets measured", "How it is delivered", "The evidence", ...ENGAGEMENT.slice(2)],
  },
  {
    slug: "multilingual-sem",
    name: "Multilingual SEM",
    cluster: "Lead generation",
    angle: "Paid demand capture across languages",
    lede: "Reaching the buyer who has not found you organically yet, in the language they searched in, without letting a single blended campaign quietly subsidise one market from another.",
    sections: ["Three patterns that drain ad budgets", ...ENGAGEMENT],
  },
  {
    slug: "conversion-tracking",
    name: "Conversion tracking",
    cluster: "Lead generation",
    angle: "The evidence layer, per locale",
    lede: "Measuring enquiries per locale rather than per domain. Without it, a market that converts and a market that only gets traffic look identical in the reporting.",
    sections: ["Why a single blended number hides the problem", ...ENGAGEMENT],
    absorbs: ["analytics-and-tracking"],
  },

  // ---- Cluster 2: multilingual search, the engine ----
  {
    slug: "multilingual-seo",
    name: "International SEO",
    cluster: "Search",
    pillar: true,
    angle: "The engine underneath the outcome",
    lede: "Strategic piloting on my side, native writing per language, with hreflang and schema configured from the brief rather than patched in later.",
    sections: [
      "Where most international SEO projects fail",
      "What I include in an international SEO engagement",
      "My process in five steps, named deliverables",
      "Case studies",
      "What is included, what is not",
      "Frequently asked questions",
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
    sections: ["Three ways to fail at French SEO", ...ENGAGEMENT],
    gsc: { impressions: 3093, position: 43.7, keywords: 40 },
    needsRefresh:
      "Source copy still runs the 2024 structure while all five sibling language pages were refreshed. The highest-impression service page on the domain is the one running the oldest copy.",
  },
  {
    slug: "german-seo",
    name: "German SEO",
    cluster: "Search",
    angle: "Precision market",
    lede: "German buyers research further before enquiring than most markets, so the page that wins is the one that answers the question rather than the one that ranks loudest.",
    sections: ["Three ways to fail at German SEO", ...ENGAGEMENT],
    gsc: { impressions: 1938, position: 57.3, keywords: 38 },
  },
  {
    slug: "spanish-seo",
    name: "Spanish SEO",
    cluster: "Search",
    angle: "Proximity market",
    lede: "Spain from Spain. The Valencia base is not a line in a bio, it is why the local search behaviour is familiar rather than researched.",
    sections: ["Three ways to fail at Spanish SEO", ...ENGAGEMENT],
  },
  {
    slug: "dutch-seo",
    name: "Dutch SEO",
    cluster: "Search",
    angle: "Small volume, decisive buyers",
    lede: "Dutch trade search is low in volume and high in intent, which rewards covering a narrow thing properly over covering a broad thing thinly. Bemelman Spuiterij is the worked example.",
    sections: ["Three ways to fail at Dutch SEO", ...ENGAGEMENT],
  },
  {
    slug: "italian-seo",
    name: "Italian SEO",
    cluster: "Search",
    angle: "Completing the grid",
    lede: "Italian search rewards editorial quality more than most markets, and punishes translated-from-English copy faster.",
    sections: ["Three ways to fail at Italian SEO", ...ENGAGEMENT],
    gsc: { impressions: 1304, position: 45.3, keywords: 33 },
  },
  {
    slug: "portuguese-seo",
    name: "Portuguese SEO",
    cluster: "Search",
    angle: "Two markets, one language",
    lede: "Portugal and Brazil are not one market with one keyword set, and treating them as one is the mistake that makes Portuguese look harder than it is.",
    sections: ["Three ways to fail at Portuguese SEO", ...ENGAGEMENT],
  },

  // ---- Cluster 3: localisation and translation ----
  {
    slug: "website-localisation",
    name: "Website localisation",
    cluster: "Localisation",
    pillar: true,
    angle: "Beyond translated strings",
    lede: "Making a site work in a market rather than merely readable in a language, which is a question of currency, form fields, trust signals and search behaviour as much as words.",
    sections: ["Why localisation is not translation", ...ENGAGEMENT],
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
    sections: ["Where a translation error actually costs", ...ENGAGEMENT],
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
    sections: ["What breaks when software crosses a language", ...ENGAGEMENT],
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
    sections: ["Where AI helps, and where it does not", ...ENGAGEMENT],
    absorbs: ["ai-consulting-services"],
  },
  {
    slug: "ai-translation-and-post-editing",
    name: "AI translation and post-editing",
    cluster: "AI",
    angle: "Machine first, human decisive",
    lede: "Machine translation has become good enough to be dangerous: fluent output that is confidently wrong is harder to catch than obviously broken output.",
    sections: ["Why fluent output is the harder problem", ...ENGAGEMENT],
    absorbs: ["post-ai-editing"],
  },

  // ---- Cluster 5: supporting capability ----
  {
    slug: "technical-seo",
    name: "Technical SEO",
    cluster: "Supporting",
    angle: "Outer section, bridges back",
    lede: "Crawlability, indexation and the hreflang plumbing that decides whether a multilingual site is read as one entity in several languages or several sites competing with each other.",
    sections: ["What actually blocks a multilingual site", ...ENGAGEMENT],
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building", "local-seo"],
  },
  {
    slug: "multilingual-content",
    name: "Multilingual content",
    cluster: "Supporting",
    angle: "Written per market, not translated",
    lede: "Copy researched against the market it is for, because the keyword set that works in English rarely survives translation into the one that works in Spanish.",
    sections: ["Why translated copy underperforms written copy", ...ENGAGEMENT],
    absorbs: ["multilingual-seo-copywriting", "cultural-consulting", "multilingual-social-media-management"],
  },
];

export const CLUSTERS = ["Lead generation", "Search", "Localisation", "AI", "Supporting"] as const;

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
