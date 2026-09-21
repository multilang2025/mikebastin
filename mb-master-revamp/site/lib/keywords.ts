/**
 * The primary and secondary keyword for every commercial page.
 *
 * Owner instruction, 21 September 2026: define these from Ahrefs rather
 * than from instinct. Every figure below is `global_volume` and
 * `difficulty` from Ahrefs Keywords Explorer, country GB, pulled on that
 * date. Volumes move, so treat them as a snapshot with a date on it, not
 * a constant.
 *
 * The starting position matters for reading any of this. Ahrefs Site
 * Explorer on 21 Sep 2026 showed mikebastin.com ranking for exactly one
 * keyword worldwide: "michael bastin", position 11, volume 10. There is no
 * existing ranking footing to protect, so nothing here is a compromise
 * with legacy positions. It is a first assignment.
 *
 * (Search Console tells a different and compatible story, tens of
 * thousands of impressions on the biggest pages. Impressions at low
 * positions on long-tail queries are largely invisible to Ahrefs' index.
 * Both are true; neither is a ranking.)
 *
 * **Primary** is the one term the page is trying to win, and it appears in
 * the h1 (`scripts/keyword-coverage-lint.mjs` checks that). **Secondary**
 * are the terms the h2, the meta description and the body should cover.
 * One page owns each primary term: two pages competing for one term is
 * the cannibalisation this file exists to prevent.
 *
 * `note` records a judgement that the numbers alone do not explain.
 */

export type Keyword = {
  term: string;
  /** Ahrefs global_volume, GB, 21 Sep 2026. */
  volume: number;
  /** Ahrefs difficulty. null where Ahrefs reports none for the term. */
  kd: number | null;
};

export type PageKeywords = {
  primary: Keyword;
  secondary: Keyword[];
  note?: string;
};

export const KEYWORDS: Record<string, PageKeywords> = {
  "/": {
    primary: { term: "international seo agency", volume: 7500, kd: 3 },
    secondary: [
      { term: "international seo services", volume: 7200, kd: 0 },
      { term: "global seo", volume: 6400, kd: 0 },
      { term: "international seo consultant", volume: 5000, kd: 0 },
      { term: "international seo expert", volume: 2600, kd: 6 },
    ],
    note:
      "The homepage takes the biggest winnable commercial term on the site, " +
      "which is 'international' rather than 'multilingual': 7,500 against " +
      "2,500 for the same shape. 'Multilingual' is the brand's own framing " +
      "and the word the owner uses; 'international' is the word buyers type. " +
      "The head term 'international seo' is bigger again at 10,000 but sits " +
      "at KD 34 against KD 3, so the agency variant is the one to take first. " +
      "'international seo consultant' carries a $19.00 CPC, the highest " +
      "measured anywhere on this site, which says what the intent is worth.",
  },

  "/services": {
    primary: { term: "global seo services", volume: 4000, kd: 4 },
    secondary: [{ term: "global seo company", volume: 2900, kd: 6 }],
    note:
      "Deliberately not 'multilingual seo services', which belongs to the " +
      "pillar below. An index page and its pillar competing for one term is " +
      "the classic self-inflicted wound; 'global' keeps them apart while " +
      "staying accurate about what the list covers.",
  },

  "/services/multilingual-seo": {
    primary: { term: "multilingual seo agency", volume: 2500, kd: 0 },
    secondary: [
      { term: "multilingual seo", volume: 4600, kd: 30 },
      { term: "multilingual seo services", volume: 2700, kd: 1 },
      { term: "international seo specialist", volume: 1800, kd: 0 },
    ],
    note:
      "The head term 'multilingual seo' is the bigger prize at 4,600 but sits " +
      "at KD 30, so the agency variant at KD 0 is the way in and the head " +
      "term follows from the same page.",
  },

  "/services/technical-seo": {
    primary: { term: "technical seo services", volume: 15000, kd: 6 },
    secondary: [
      { term: "technical seo consultant", volume: 4300, kd: 43 },
      { term: "hreflang", volume: 12000, kd: 46 },
      { term: "hreflang tags", volume: 5800, kd: 51 },
    ],
    note:
      "15,000 at KD 6 is the second-best ratio on the site. The hreflang " +
      "family is 12,000 plus 5,800 plus 4,300 for 'hreflang seo', and it is " +
      "the subject this practice actually has authority in. It stays " +
      "secondary because copy-jargon-lint.mjs keeps mechanism vocabulary out " +
      "of a commercial hero, which is the right call: hreflang belongs in " +
      "the body here and in the h1 of a blog post.",
  },

  "/services/local-seo": {
    primary: { term: "local seo services", volume: 47000, kd: 5 },
    secondary: [
      { term: "local seo services for small business", volume: 4300, kd: 3 },
      { term: "local business seo services", volume: 2700, kd: 3 },
      { term: "local seo marketing services", volume: 3200, kd: 2 },
    ],
    note:
      "47,000 at KD 5 is the largest winnable term anywhere on this site by " +
      "a wide margin. The bare head term 'local seo' is bigger still and sits " +
      "at KD 87, so it is not a target.",
  },

  "/services/lead-generation": {
    primary: { term: "lead generation services", volume: 11000, kd: 10 },
    secondary: [
      { term: "lead generation agency", volume: 8600, kd: 0 },
      { term: "b2b lead generation agency", volume: 4400, kd: 0 },
    ],
    note:
      "'multilingual lead generation', which this page led with until today, " +
      "returns ZERO searches. The qualifier was doing nothing except keeping " +
      "the page out of an 11,000-search term.",
  },

  "/services/generative-engine-optimization": {
    primary: { term: "generative engine optimization services", volume: 4700, kd: 30 },
    secondary: [
      { term: "generative engine optimization", volume: 26000, kd: 59 },
      { term: "generative engine optimization agency", volume: 3400, kd: null },
      { term: "geo generative engine optimization", volume: 4300, kd: null },
    ],
    note:
      "SPELLING CONFLICT, owner decision needed. Every one of these terms is " +
      "the US spelling, and the site is UK English by non-negotiable rule, so " +
      "the page says `optimization` while the searches say `optimization`. " +
      "The route slug is already US-spelled. Not resolved here, because the " +
      "spelling rule is the owner's and so is the trade.",
  },

  "/services/translation-services": {
    primary: { term: "translation services", volume: 14000, kd: 63 },
    secondary: [
      { term: "certified translation services", volume: 7800, kd: 26 },
      { term: "document translation services", volume: 5100, kd: 10 },
      { term: "legal translation services", volume: 3900, kd: 60 },
      { term: "medical translation services", volume: 2400, kd: 4 },
    ],
    note:
      "The only page here whose primary is deliberately a hard term. KD 63 " +
      "is not winnable soon, but the page genuinely is about translation " +
      "services and the secondary terms are where the traffic comes from " +
      "first: 'document' at KD 10 and 'medical' at KD 4 are the near-term " +
      "wins, both of which the page already covers by document type.",
  },

  "/services/website-localisation": {
    primary: { term: "website localization", volume: 2800, kd: 5 },
    secondary: [{ term: "website localization services", volume: 350, kd: null }],
    note:
      "Same spelling conflict as the GEO page, and sharper: the US " +
      "`localization` draws 2,800 against 350 for the UK `localization`. " +
      "Eight times the demand sits on a spelling the house rules forbid. " +
      "Owner's call, flagged rather than taken.",
  },

  "/services/ai-consulting": {
    primary: { term: "ai consulting services", volume: 12000, kd: 56 },
    secondary: [
      { term: "ai strategy consulting", volume: 5600, kd: 0 },
      { term: "generative ai consulting", volume: 3100, kd: 27 },
    ],
    note:
      "'ai strategy consulting' at 5,600 and KD 0 is the realistic entry " +
      "point; the primary is a 56 and will take real authority.",
  },

  "/services/french-seo": {
    primary: { term: "french seo", volume: 800, kd: null },
    secondary: [
      { term: "french seo agency", volume: 700, kd: null },
      { term: "french seo services", volume: 350, kd: null },
      { term: "french seo consultant", volume: 300, kd: null },
    ],
  },
  "/services/german-seo": {
    primary: { term: "german seo", volume: 1000, kd: 1 },
    secondary: [
      { term: "german seo services", volume: 450, kd: null },
      { term: "german seo agency", volume: 350, kd: null },
      { term: "german seo expert", volume: 300, kd: null },
    ],
  },
  "/services/spanish-seo": {
    primary: { term: "spanish seo", volume: 1100, kd: 0 },
    secondary: [
      { term: "seo in spanish", volume: 800, kd: 0 },
      { term: "spanish seo services", volume: 500, kd: null },
      { term: "seo for spanish website", volume: 350, kd: null },
    ],
  },
  "/services/italian-seo": {
    primary: { term: "italian seo agency", volume: 300, kd: null },
    secondary: [
      { term: "italian seo services", volume: 250, kd: null },
      { term: "italian seo company", volume: 250, kd: null },
    ],
  },
  "/services/portuguese-seo": {
    primary: { term: "portuguese seo", volume: 350, kd: null },
    secondary: [{ term: "portuguese seo services", volume: 90, kd: null }],
  },
  "/services/dutch-seo": {
    primary: { term: "dutch seo agency", volume: 150, kd: null },
    secondary: [],
    note: "The thinnest of the six language pages. Kept because the Dutch trade market is a real one for this practice, not because the volume argues for it.",
  },

  "/services/conversion-tracking": {
    primary: { term: "conversion tracking", volume: 3300, kd: 13 },
    secondary: [
      { term: "google ads conversion tracking", volume: 2200, kd: 18 },
      { term: "offline conversion tracking", volume: 2000, kd: 6 },
    ],
  },
};

/**
 * Pages with no researched keyword yet.
 *
 * Named rather than quietly omitted. Each was searched on 21 Sep 2026 and
 * the seed terms returned nothing with meaningful volume, which is a
 * finding: `multilingual sem`, `multilingual content` and
 * `multilingual lead generation` are all close to zero, because buyers do
 * not put "multilingual" in front of a service name. That does not make
 * the pages worthless, it makes them pages that earn their traffic from
 * internal links and long-tail body copy rather than a head term.
 */
export const UNRESEARCHED = [
  "/services/multilingual-sem",
  "/services/multilingual-content",
  "/services/app-and-software-localisation",
  "/services/ai-translation-and-post-editing",
  "/contact",
  "/how-i-work",
  "/results",
];

export function keywordsFor(route: string): PageKeywords | undefined {
  return KEYWORDS[route.replace(/\/$/, "") || "/"];
}
