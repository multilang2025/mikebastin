/**
 * The primary and secondary keyword for every commercial page.
 *
 * Owner instruction, 21 September 2026: define these from Ahrefs rather
 * than from instinct. Every figure below is `global_volume` and
 * `difficulty` from Ahrefs Keywords Explorer, country GB, pulled on that
 * date, except for the five pages researched on 22 September, whose
 * notes say so. Volumes move, so treat them as a snapshot with a date on
 * it, not a constant.
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
      { term: "local seo agency", volume: 24000, kd: 6 },
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
      "Every one of these terms is the US spelling. The owner resolved the " +
      "conflict on 21 Sep 2026 (\"it's international and volume based SEO\"), " +
      "so the page copy now matches the searches and the route slug, which " +
      "was US-spelled all along. 26,000 for the head term against 3,800 for " +
      "the UK form is what settled it.",
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
      "Same spelling question as the GEO page and sharper, 2,800 against " +
      "350 for the UK form, resolved the same way on 21 Sep 2026. The page " +
      "copy is US-spelled; the route slug stays UK because eighteen legacy " +
      "URLs in docs/sitemap-MB-EN.txt depend on it, so this page is " +
      "deliberately served at a UK-spelled URL under a US-spelled heading.",
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
      { term: "seo france", volume: 1100, kd: null },
      { term: "seo agency france", volume: 600, kd: null },
      { term: "french seo services", volume: 350, kd: null },
      { term: "french seo consultant", volume: 300, kd: null },
    ],
    note:
      "Re-measured 23 Sep 2026, worldwide volumes with the GB share checked. " +
      "The English-language demand sits outside France: 'french seo agency' " +
      "is 500 of its 700 in the UK. The page's own Search Console (24 Mar to " +
      "20 Sep 2026) has 'seo frankrijk' as its biggest query at 1,193 " +
      "impressions, ahead of 'french seo' at 1,030, plus German queries for " +
      "an SEO agency in France. The h1 names that buyer. Ahrefs returns no " +
      "difficulty score for any French term measured.",
  },
  "/services/german-seo": {
    primary: { term: "german seo", volume: 1000, kd: 1 },
    secondary: [
      { term: "seo germany", volume: 1000, kd: null },
      { term: "seo agency germany", volume: 600, kd: null },
      { term: "german seo services", volume: 450, kd: null },
      { term: "german seo agency", volume: 350, kd: null },
      { term: "german seo expert", volume: 300, kd: null },
    ],
    note:
      "Re-measured 23 Sep 2026, worldwide volumes with the GB and NL shares " +
      "checked. Only 150 of the 1,000 for 'german seo' are British; Dutch " +
      "adds 'duitse seo' (200) and 'seo duitsland' (150). The page's Search " +
      "Console (24 Mar to 20 Sep 2026) shows the same search in Spanish, " +
      "Italian, French, Dutch and Scandinavian languages. 'german serp " +
      "tracking' (1,061 impressions) is tool intent and not a target.",
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

  "/services/multilingual-sem": {
    primary: { term: "international ppc agency", volume: 1300, kd: 2 },
    secondary: [
      { term: "international ppc", volume: 1000, kd: 0 },
      { term: "multilingual ppc", volume: 600, kd: 0 },
      { term: "multilingual ppc agency", volume: 450, kd: null },
    ],
    note:
      "Researched 22 Sep 2026. 'international' beats 'multilingual' again, " +
      "1,300 against 450 for the same shape, which is the third page where " +
      "the qualifier the brand prefers is not the one buyers type. The h1 " +
      "now says PPC where the page said SEM, because SEM returns the " +
      "vocabulary of the trade and PPC returns the vocabulary of the buyer. " +
      "The route slug stays multilingual-sem. 'international ppc' carries a " +
      "$7.00 CPC, second only to the homepage term.",
  },

  "/services/app-and-software-localisation": {
    primary: { term: "software localization", volume: 1900, kd: 4 },
    secondary: [
      { term: "app localization services", volume: 1200, kd: null },
      { term: "software localization services", volume: 900, kd: 0 },
      { term: "app localization", volume: 1400, kd: 44 },
    ],
    note:
      "Researched 22 Sep 2026, and the h1 needed no change: 'App and " +
      "software localization services' already carried the term. " +
      "'app localization' at KD 44 is the outlier on this list and stays " +
      "secondary. $9.00 CPC on 'software localization services' is the " +
      "highest measured on the site. US spelling per the 21 Sep decision; " +
      "the route slug stays UK because legacy URLs depend on it.",
  },

  "/services/content-marketing": {
    primary: { term: "content marketing services", volume: 26000, kd: 0 },
    secondary: [
      { term: "content marketing agency", volume: 30000, kd: 28 },
      { term: "content creation services", volume: 5600, kd: 0 },
      { term: "b2b content marketing agency", volume: 4300, kd: 3 },
      { term: "seo content services", volume: 3100, kd: 1 },
      { term: "content strategy services", volume: 2500, kd: 0 },
    ],
    note:
      "26,000 at KD 0 is the second-largest winnable term on the site after " +
      "'local seo services'. It was found on 22 Sep 2026 while researching " +
      "/services/multilingual-content and deliberately not taken there, " +
      "because a page cannot be about multilingual content and about " +
      "content marketing generally at the same time. The owner resolved it " +
      "on 22 Sep by asking for a page of its own, which keeps both terms " +
      "and cannibalises neither. 'b2b content marketing agency' carries a " +
      "$25.00 CPC, the highest measured anywhere on this site. " +
      "'content marketing agency' at 30,000 is bigger than the primary and " +
      "sits at KD 28, so it is the term this page grows into rather than " +
      "the one it opens with.",
  },

  "/services/multilingual-content": {
    primary: { term: "multilingual content marketing", volume: 900, kd: 2 },
    secondary: [
      { term: "international content marketing", volume: 200, kd: null },
      { term: "multilingual content agency", volume: 40, kd: null },
    ],
    note:
      "Researched 22 Sep 2026. 'content marketing services' measured 26,000 " +
      "at KD 0 in the same batch and is not this page's primary, because a " +
      "page cannot be about multilingual content and about content " +
      "marketing generally at the same time. The owner settled it the same " +
      "day by asking for a separate page, so the term now belongs to " +
      "/services/content-marketing and this page keeps the qualifier that " +
      "makes it distinct.",
  },

  "/services/ai-translation-and-post-editing": {
    primary: { term: "machine translation post editing", volume: 500, kd: null },
    secondary: [
      { term: "ai translation services", volume: 350, kd: null },
      { term: "mtpe services", volume: 300, kd: null },
      { term: "post editing services", volume: 70, kd: null },
    ],
    note:
      "Researched 22 Sep 2026 and thin, in the way the Portuguese page is " +
      "thin. The whole cluster is under 1,000 combined. Recorded anyway " +
      "because 500 searches with no competition is still the page's best " +
      "available term, and because naming it stops the next pass " +
      "re-researching ground already covered.",
  },

  "/services/conversion-tracking": {
    primary: { term: "conversion tracking", volume: 3300, kd: 13 },
    secondary: [
      { term: "google ads conversion tracking", volume: 2200, kd: 18 },
      { term: "offline conversion tracking", volume: 2000, kd: 6 },
      { term: "consent mode", volume: 3100, kd: 0 },
    ],
    note:
      "`consent mode` at 3,100 and KD 0 is close to the primary in size and " +
      "far easier, and the page already earns it: the body explains that a " +
      "visitor who declines cookies is still a visitor, and that comparing " +
      "markets is only honest once each one's consent rate is known. The " +
      "term was surfaced by an external research document (22 Sep 2026) " +
      "whose own twelve proposed keywords all returned zero volume; this " +
      "was the one real find in it, and it was not on its list.",
  },
};

/**
 * Pages with no researched keyword yet.
 *
 * Named rather than quietly omitted.
 *
 * Four pages left this list on 22 Sep 2026. The 21 Sep pass had searched
 * them on seeds carrying "multilingual", which returns close to zero
 * because buyers do not put the word in front of a service name. Dropping
 * the qualifier found a usable term for every one of them, which says the
 * earlier finding was about the seed rather than about the page.
 *
 * `/contact` and `/how-i-work` have no commercial head term and are not
 * meant to. `/results` does: `seo case studies`, 3,000 at KD 9, measured
 * 22 Sep. It stays here because whether a proof page should be optimized
 * as a landing page is an owner decision, open in
 * docs/KEYWORD-RESEARCH-METHOD.md section 8.
 */
export const UNRESEARCHED = [
  "/contact",
  "/how-i-work",
  "/results",
];

export function keywordsFor(route: string): PageKeywords | undefined {
  return KEYWORDS[route.replace(/\/$/, "") || "/"];
}
