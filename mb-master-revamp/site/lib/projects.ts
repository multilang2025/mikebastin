/**
 * Single source of truth for the eight portfolio projects. The homepage
 * spreads and the /projects/[slug]/ case study pages both read from here,
 * so a project only ever gets written once.
 *
 * Every problem/work/outcome line traces back to docs/HANDOFF.md (the
 * verified portfolio inventory in §3, the SEO orchestration notes in §13,
 * and the Matosurf/Globaprom scrape findings in §24). Nothing here is
 * invented: where a hard number is not on record, the prose stays
 * qualitative rather than guessing at one.
 *
 * `search` figures come from live Google Search Console via the Ahrefs API,
 * pulled 2026-08-20 for the last three complete months (May to July 2026).
 * August is deliberately excluded: it was a partial month at pull time and
 * would read as a collapse rather than an incomplete count. Owner confirmed
 * these may be published named.
 *
 * `shot` is a screenshot of the client's live homepage, captured the same
 * day. ValenciaMove is the exception and uses its own hero image from
 * assets/ASSETS-MANIFEST.md, because the live site sits behind a browser
 * check this environment could not pass at the time. TX International
 * Freight had the same problem originally (18 Sep 2026 fix: a Code session
 * routing Playwright through the outbound proxy reaches it fine, so it now
 * has a real screenshot too).
 */

/**
 * The portfolio images are served with a one-week browser cache and keep
 * their file names when design/work-shots/gen.py redraws them, so a visitor
 * who saw the earlier set kept seeing it. Bump this whenever the images are
 * regenerated: the query string is ignored by the server and makes the
 * browser fetch the new file.
 */
export const SHOT_VERSION = "20261007";

/** The window `leads` averages over. */
export const LEADS_PERIOD = "May to July 2026";

/**
 * A screenshot the owner supplied (Search Console, Ahrefs) shown on a case
 * study, with the figures it shows said in the text.
 */
export type Evidence = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  heading: string;
  text: string;
};

export type Project = {
  slug: string;
  numeral: string;
  name: string;
  domain: string;
  angle: string;
  /** One or two sentences, used in the homepage spread and as the case study lede. */
  body: string;
  /**
   * SERP title and description for the case study page. `body` above runs
   * long on several projects (built for the on-page spread, not a 140-160
   * character snippet), so these are trimmed and written for the search
   * result rather than reused verbatim.
   */
  metaTitle?: string;
  metaDescription?: string;
  metrics: { v: string; k: string }[];
  problem: string;
  work: string;
  outcome: string;
  /** What was actually delivered for this client. */
  services: string[];
  /**
   * Live GSC, May to July 2026. Absent where the property has no meaningful history yet.
   * Source data for the totals in lib/results-totals.ts only: no page renders it per
   * client (owner, 5 Oct 2026), and scripts/client-figures-lint.mjs enforces that.
   */
  search?: { clicks: string; impressions: string; position: string; note?: string };
  /**
   * Average enquiries a month received through the client site's own forms,
   * May to July 2026, the same three months as the Search Console figures
   * (owner, 4 Oct 2026, choosing to align the windows). Counted from the
   * form records (Formidable entries read 3 Oct 2026), drafts and obvious
   * spam (links, SEO, backlink and crypto pitches) left out, total divided by
   * three and rounded: TX 341 (114 a month), Delaguía 168 (56). Bemelman's
   * forms caught 6 (2 a month), but most of its requests arrive by phone and
   * email, so the owner's own figure is shown: 20 to 50 a month (owner,
   * 4 Oct 2026, "between 20 and 50 leads"). ValenciaMove's is the owner's own figure (owner, 7 Oct 2026: "over 50
   * leads for Valenciamove each month"), counted as 50; its dashboard alone
   * caught 25 form enquiries in July. C21
   * Perdomo's headless front end posts its forms outside WordPress, so it has
   * no record to count here; its count is a range the owner gave on 3 Oct
   * 2026 ("between TX and DL"), shown as such. A range is written "low to
   * high", which the results page sums as a range (Bemelman's is the second). A figure that is a count, not a range,
   * is form submissions only (owner, 4 Oct 2026: "mention they are forms
   * only"); phone and email enquiries are not in it, and both pages say so.
   */
  leads?: { count: string; what: string; period?: string };
  /**
   * Search Console or Ahrefs evidence shown on the case study, from screenshots
   * the owner supplied (owner, 7 Oct 2026: ValenciaMove, "use the screenshot to
   * show the traffic increase in 6 months", then "Bemelmanspuiterij.nl
   * traffic evolution", "Delaguía y Luzón Ai Citations + overview"). An exception to the no-per-client-figures rule, for
   * the sites the owner names and on their own case study only.
   */
  evidence?: Evidence[];
  /** Country sites shown with the flags animation (components/CountryFlags.tsx). */
  countries?: { domain: string; country: string }[];
  /** Path under /work/, omitted where no usable capture exists. */
  shot?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "betranslated",
    numeral: "I",
    name: "BeTranslated",
    domain: "betranslated.com",
    angle: "Founded it, still run it",
  body: "A translation agency with nine country sites, from the United States to the Netherlands, each one ranking separately in its own market.",
    metaTitle: "BeTranslated, a multi-TLD case study",
    metaDescription: "Twenty years running a translation agency across nine country domains, each ranking separately in its own market. See what that discipline required.",
    metrics: [
      { v: "9", k: "Country domains" },
      { v: "20 yr", k: "Running it" },
    ],
    problem:
      "A translation agency selling into nine markets needs nine SEO campaigns, each one built for its own market. The country domains (.com, .us, .ca, .co.uk, .be, .fr, .es, .de, .nl) each carry their own competitors, their own search habits and their own trust signals, so each one is run as a site of its own, built to hold its ground against local competitors.",
    work:
   "Founded the agency and has run it for twenty years, Each regional TLD gets its own technical SEO treatment: separate sitemaps, separate hreflang groups, and separate keyword research per market, built from that market's own searches.",
    outcome:
   "Nine country sites, each ranking on its own market's terms, under an agency still trading after two decades.",
    services: ["Multi-TLD SEO", "Multilingual content", "Nine country markets", "Founder"],
    countries: [
      { domain: "betranslated.com", country: "International" },
      { domain: "betranslated.us", country: "United States" },
      { domain: "betranslated.ca", country: "Canada" },
      { domain: "betranslated.co.uk", country: "United Kingdom" },
      { domain: "betranslated.be", country: "Belgium" },
      { domain: "betranslated.fr", country: "France" },
      { domain: "betranslated.es", country: "Spain" },
      { domain: "betranslated.de", country: "Germany" },
      { domain: "betranslated.nl", country: "Netherlands" },
    ],
    shot: `/work/betranslated.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "globaprom",
    numeral: "II",
    name: "Globaprom",
    domain: "globaprom.com",
    angle: "Custom AI software",
    body: "Fixed scope, fixed price, delivered in weeks, multilingual from the first commit. Built the shipment tracking portal that took the status chasing out of a freight forwarder's week.",
    metaTitle: "Globaprom, a custom AI software case study",
    metaDescription: "Fixed scope, fixed price, delivered in weeks. See the shipment tracking portal that took the status chasing out of a freight forwarder's week.",
    metrics: [
      { v: "Fixed", k: "Scope and price" },
      { v: "Weeks", k: "To deliver" },
    ],
    problem:
      "Small businesses that need custom software want a fixed scope, a price they can plan around and a tool that fits their operations exactly. A business running in more than one language from day one needs that tool to be multilingual from the start as well.",
    work:
   "AI-assisted development with a fixed scope and a fixed price, delivered in weeks, multilingual from the first commit. Built on Next.js with Payload CMS, the stack is Next.js with Payload CMS.",
    outcome:
      "A shipment tracking portal for TX International Freight that took manual status chasing out of the week, an internal reconciliation platform for the team's weekly reconciliation, and the multilingual site and tracking system running Century 21 Perdomo's real estate listings.",
    services: ["Custom AI software", "Multilingual from build", "Fixed scope, fixed price"],
    shot: `/work/globaprom.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "tx-international-freight",
    numeral: "III",
    name: "TX International Freight",
    domain: "txintlfreight.com",
    angle: "Houston industrial freight",
    body: "Technical SEO and content for a freight forwarder whose customers search in their own industry vocabulary. Learning the vocabulary was most of the work.",
    metaTitle: "TX International Freight, a case study",
    metaDescription: "Technical SEO and content for a Houston freight forwarder, built around the industry vocabulary its buyers search in, learned from the trade itself.",
    metrics: [
      { v: "Houston", k: "Local pack" },
      { v: "EN", k: "Single market" },
    ],
    problem:
      "Industrial freight buyers search in their own way, distinct from consumer buyers. The terms that carry commercial intent are industry jargon, so the keyword research has to start from the trade's own vocabulary to meet the actual search behaviour.",
    work:
   "Technical SEO and content built around the vocabulary Houston's industrial freight buyers actually use, learned from the industry itself. ",
    outcome:
   "Local pack presence in Houston's industrial freight search, for a client we have worked with for nearly fifteen years.",
    services: ["Technical SEO", "Industry content", "Houston local search", "Tracking portal"],
    search: { clicks: "2,616", impressions: "764,222", position: "21.7", note: "May to July 2026" },
    leads: { count: "114", what: "quote requests" },
    shot: `/work/tx-international-freight.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "c21perdomo",
    numeral: "IV",
    name: "Century 21 Perdomo",
    domain: "c21perdomo.com",
    angle: "Dominican real estate",
    body: "Four languages over a headless WordPress build with WPML and WooCommerce. Property listings that have to stay correct in every locale while stock turns over weekly.",
    metaTitle: "Century 21 Perdomo, a case study",
    metaDescription: "Four languages held correct across a headless WordPress, WPML and WooCommerce build, with property listings that turn over weekly. See how.",
    metrics: [
      { v: "4", k: "Languages" },
      { v: "Headless", k: "Architecture" },
    ],
    problem:
      "Real estate listings change weekly: a property sells, a price moves, a status flips. Four languages means every change has to land in all four locales at once, and a headless WordPress and WooCommerce build makes that consistency a technical job as well as an editorial one.",
    work:
      "EN/FR/ES/DE coverage across a headless WordPress, WPML and WooCommerce stack, with the multilingual site and tracking system itself built by Globaprom. SEO discipline applied per locale, built from each market's own searches.",
    outcome:
   "Four languages held correct against weekly-turnover inventory on a live real estate site.",
    services: ["Multilingual SEO", "Headless WordPress", "WPML and WooCommerce", "Four languages"],
    search: { clicks: "9,944", impressions: "461,231", position: "10.1", note: "May to July 2026" },
    leads: { count: "70 to 150", what: "enquiries" },
    shot: `/work/c21perdomo.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "valenciamove",
    numeral: "V",
    name: "ValenciaMove",
    domain: "valenciamove.com",
    angle: "Expat relocation, first hand",
  body: "Over a thousand pages across five languages, written from first-hand experience of the move. ",
    metaTitle: "ValenciaMove, a case study",
    metaDescription: "Over a thousand pages across five languages, written from having made the move to Valencia personally, with first-hand detail on every page.",
    metrics: [
      { v: "1,132", k: "URLs" },
      { v: "5", k: "Locales" },
      { v: "50+", k: "Enquiries a month" },
    ],
    problem:
   "Mikebastin.com used to carry Valencia relocation content alongside its SEO consultancy content under one domain, and each subject deserved a site of its own. ",
    work:
   "Over a thousand pages across five locales (EN, FR, ES, NL, IT), built from having made the move personally. ",
    outcome:
   "1,132 URLs live across five languages. In six months the site went from almost no search traffic to around 200 clicks a day: 17,400 clicks and 1.63 million impressions from April to October 2026, and over fifty enquiries a month.",
    services: ["Content strategy", "Five locales", "Technical SEO", "Owned property"],
    search: { clicks: "5,685", impressions: "496,316", position: "10.7", note: "May to July 2026" },
    leads: { count: "50", what: "enquiries" },
    shot: `/work/valenciamove.webp?v=${SHOT_VERSION}`,
    evidence: [
      {
        src: "/images/evidence/valenciamove-search-console-6-months.webp",
        width: 656,
        height: 800,
        alt: "Google Search Console for valenciamove.com over six months: 17.4K clicks and 1.63M impressions, daily clicks rising from near zero in April 2026 to around 200 by September",
        caption: "Google Search Console, valenciamove.com, April to October 2026.",
        heading: "The ValenciaMove search traffic, from launch to around 200 clicks a day",
        text: "17,400 clicks and 1.63 million impressions in six months, from almost nothing in April. ValenciaMove is our own site, run the way we run a client's.",
      },
    ],
  },
  {
    slug: "bemelman-spuiterij",
    numeral: "VI",
    name: "Bemelman Spuiterij",
    domain: "bemelmanspuiterij.nl",
    angle: "Dutch powder coating, 45 years",
    body: "A specialist in Noordwijkerhout whose reputation had outgrown its web presence. Dutch local SEO for a trade where the buyers are other businesses and the search volume is small but decisive.",
    metaTitle: "Bemelman Spuiterij, a case study",
    metaDescription: "A Dutch powder coating specialist with forty five years of reputation and a web presence to build. See the local SEO made for its decisive market.",
    metrics: [
      { v: "45 yr", k: "Trading" },
      { v: "NL", k: "Local search" },
    ],
    problem:
      "A trade business with forty-five years of reputation needed a web presence to match, so the small number of buyers actually searching for it could find it. B2B search volume in a niche trade is low, and every one of those searches is a real buyer.",
    work:
      "A Divi build paired with Dutch local SEO aimed at the small, decisive search volume a specialist trade actually gets, from the businesses that buy.",
    outcome:
   "A Divi build and Dutch local SEO for a business that had traded on reputation alone for forty-five years.",
    services: ["Dutch local SEO", "Divi build", "B2B trade search"],
    search: { clicks: "1,436", impressions: "108,568", position: "28.1", note: "May to July 2026" },
    leads: { count: "20 to 50", what: "enquiries" },
    evidence: [
      {
        src: "/images/evidence/bemelman-spuiterij-search-console-16-months.webp",
        width: 656,
        height: 800,
        alt: "Google Search Console for bemelmanspuiterij.nl over sixteen months: 5.32K clicks and 448K impressions, daily clicks rising from around 5 in mid 2025 to around 15 by autumn 2026",
        caption: "Google Search Console, bemelmanspuiterij.nl, June 2025 to October 2026.",
        heading: "The Bemelman Spuiterij search traffic, roughly tripled in a year",
        text: "5,320 clicks and 448,000 impressions over sixteen months. Daily clicks sat around five through 2025 and climbed to around fifteen from early 2026, in a niche where every search is a business buyer.",
      },
    ],
    shot: `/work/bemelman-spuiterij.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "delaguia-y-luzon",
    numeral: "VII",
    name: "Delaguía y Luzón",
    domain: "delaguialuzon.com",
    angle: "Valencia law firm",
    body: "Legal, labour, immigration and tax across Spain and France, in four languages including Russian. Legal SEO where every term has to hold up to a lawyer reading it.",
    metaTitle: "Delaguía y Luzón, a case study",
    metaDescription: "Legal SEO across four languages and two jurisdictions, where every term has to hold up to a lawyer reading it. See how that gets handled.",
    metrics: [
      { v: "4", k: "Languages" },
      { v: "2", k: "Jurisdictions" },
    ],
    problem:
      "Legal content in four languages across two jurisdictions raises the stakes of multilingual SEO: in law, the wording of a term is a question of liability before it is a question of ranking. The brief puts accuracy first and volume second, in the translation and the SEO alike.",
    work:
      "Legal SEO and multilingual content across ES/FR/EN/RU, covering legal, labour, immigration and tax practice areas across Spain and France, built with the accuracy standard a law firm's content actually requires.",
    outcome:
   "Four languages, two jurisdictions, multiple practice areas held to a legal accuracy bar.",
    services: ["Legal SEO", "Multilingual content", "Four languages", "Two jurisdictions"],
    search: { clicks: "38,476", impressions: "2,399,567", position: "9.4", note: "May to July 2026" },
    leads: { count: "56", what: "enquiries" },
    evidence: [
      {
        src: "/images/evidence/delaguia-y-luzon-ahrefs-ai-responses.webp",
        width: 1320,
        height: 425,
        alt: "Ahrefs AI responses for delaguialuzon.com: 309 across all platforms from 87 pages, 182 in AI Overviews, 92 in AI Mode, 14 in Perplexity, 6 in Gemini and 2 in ChatGPT",
        caption: "Ahrefs Site Explorer, AI responses for delaguialuzon.com, 7 October 2026.",
        heading: "Delaguía y Luzón cited in 309 AI answers, from 87 of its pages",
        text: "Ahrefs counts 309 AI responses citing the firm's site, up 269 on the previous period: 182 in Google's AI Overviews, 92 in AI Mode, 14 in Perplexity, 6 in Gemini and 2 in ChatGPT. Legal content held to a lawyer's standard is the content answer engines quote.",
      },
      {
        src: "/images/evidence/delaguia-y-luzon-ahrefs-overview.webp",
        width: 688,
        height: 775,
        alt: "Ahrefs overview for delaguialuzon.com: Domain Rating 33, 1.4K backlinks from 368 referring domains, 928 organic keywords with 200 in the top three, 5.1K organic traffic",
        caption: "Ahrefs Site Explorer, overview for delaguialuzon.com, 7 October 2026.",
        heading: "928 keywords in Google, 200 of them in the top three",
        text: "Ahrefs shows 928 organic keywords, up 727, with 200 in the top three, and an estimated 5,100 visits a month from search, up 4,400. Behind them sit a Domain Rating of 33 and 368 referring domains.",
      },
    ],
    shot: `/work/delaguia-y-luzon.webp?v=${SHOT_VERSION}`,
  },
  {
    slug: "matosurf",
    numeral: "VIII",
    name: "Matosurf",
    domain: "matosurf.com",
    angle: "French board sports",
  body: "Seven board sports, forty-eight French spots, a hundred and twenty guides. ",
    metaTitle: "Matosurf, a case study",
    metaDescription: "Seven board sports, forty eight French spots, over a hundred guides. See the editorial method page this site's own credibility layer borrows from.",
    metrics: [
      { v: "120+", k: "Guides" },
      { v: "48", k: "Spots" },
    ],
    problem:
      "Board sports readers look for evidence that someone has actually surfed the break, beyond a spot name and a product link. Buyers value that first-hand proof, and search engines are getting better at recognising it too.",
    work:
      "Seven board sports covered across four geographic zones, forty-eight French spots, a hundred and twenty guides, built on a visible editorial method page that states plainly how the content is researched, so the authority comes with the work shown.",
    outcome:
   "Forty-eight French spots and a hundred and twenty guides covering seven board sports, backed by a public editorial method page.",
    services: ["Editorial strategy", "Content architecture", "EEAT method page", "Owned property"],
    evidence: [
      {
        src: "/images/evidence/matosurf-search-console-3-months.webp",
        width: 656,
        height: 520,
        alt: "Google Search Console for matosurf.com from July to early October 2026: 1,008 web search clicks, daily clicks rising from zero to around 20",
        caption: "Google Search Console, matosurf.com, July to October 2026.",
        heading: "The Matosurf search traffic, from zero to around 20 clicks a day",
        text: "A six-month-old site with 1,008 clicks from Google in its last three months, climbing from nothing in early July. Matosurf is our own site, run the way we run a client's.",
      },
    ],
    shot: `/work/matosurf.webp?v=${SHOT_VERSION}`,
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
