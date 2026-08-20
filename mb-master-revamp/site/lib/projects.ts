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
 */

export type Project = {
  slug: string;
  numeral: string;
  name: string;
  domain: string;
  angle: string;
  /** One or two sentences, used in the homepage spread and as the case study lede. */
  body: string;
  metrics: { v: string; k: string }[];
  problem: string;
  work: string;
  outcome: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "betranslated",
    numeral: "I",
    name: "BeTranslated",
    domain: "betranslated.com",
    angle: "Founded it, still run it",
    body: "A translation agency with six regional identities and a multi-TLD setup that has to rank separately in every one of them. Twenty years of learning what breaks when a brand tries to speak six languages at once.",
    metrics: [
      { v: "6", k: "Regional TLDs" },
      { v: "20 yr", k: "Running it" },
    ],
    problem:
      "A translation agency selling into six markets needs six SEO campaigns, not one campaign copied six times. The regional TLDs (.com, .be, .fr, .es, .co.uk, .nl) each carry their own competitors, their own search habits and their own trust signals, and treating them as a single site with translated pages loses to a local competitor every time.",
    work:
      "Founded the agency and has run it for twenty years, which means every lesson here came from the business itself rather than from a client engagement. Each regional TLD gets its own technical SEO treatment: separate sitemaps, separate hreflang groups, separate keyword research per market rather than a translated version of the English keyword list.",
    outcome:
      "Six regional identities still trading after two decades, each ranking on its own market's terms. The multi-TLD discipline learned here is the same discipline applied to every multilingual client since, including the other seven projects on this page.",
  },
  {
    slug: "globaprom",
    numeral: "II",
    name: "Globaprom",
    domain: "globaprom.com",
    angle: "Custom AI software",
    body: "Fixed scope, fixed price, delivered in weeks, multilingual from the first commit. Built the shipment tracking portal that took roughly three hours a day of status chasing out of a freight forwarder's week.",
    metrics: [
      { v: "3 h/day", k: "Saved on tracking" },
      { v: "10 h/wk", k: "On reconciliation" },
    ],
    problem:
      "Small businesses that need custom software usually get a choice between an expensive agency with a moving scope, or an off-the-shelf tool that almost fits. Neither works for a business whose operations run in more than one language from day one.",
    work:
      "AI-assisted development with a fixed scope and a fixed price, delivered in weeks rather than quarters, multilingual from the first commit rather than bolted on later. Built on Next.js with Payload CMS, the same stack this very site started from before the owner decided a self-edited portfolio did not need a database.",
    outcome:
      "A shipment tracking portal for TX International Freight that cut roughly three hours a day of manual status chasing, an internal reconciliation platform that saved about ten hours a week, and the multilingual site and tracking system running Century 21 Perdomo's real estate listings.",
  },
  {
    slug: "tx-international-freight",
    numeral: "III",
    name: "TX International Freight",
    domain: "txintlfreight.com",
    angle: "Houston industrial freight",
    body: "Technical SEO and content for a freight forwarder whose customers search in terms no marketer would guess. Learning the vocabulary was most of the work.",
    metrics: [
      { v: "Houston", k: "Local pack" },
      { v: "EN", k: "Single market" },
    ],
    problem:
      "Industrial freight buyers do not search the way consumer buyers do. The terms that carry commercial intent are industry jargon, and generic SEO built around textbook keyword research misses the actual search behaviour entirely.",
    work:
      "Technical SEO and content built around the vocabulary Houston's industrial freight buyers actually use, learned from the industry rather than assumed from a keyword tool. A single market covered properly rather than several covered thinly.",
    outcome:
      "Local pack presence in Houston's industrial freight search, and the shipment tracking portal Globaprom built for this account is itself one of the proof points on the Globaprom case study above.",
  },
  {
    slug: "c21perdomo",
    numeral: "IV",
    name: "Century 21 Perdomo",
    domain: "c21perdomo.com",
    angle: "Dominican real estate",
    body: "Four languages over a headless WordPress build with WPML and WooCommerce. Property listings that have to stay correct in every locale while stock turns over weekly.",
    metrics: [
      { v: "4", k: "Languages" },
      { v: "Headless", k: "Architecture" },
    ],
    problem:
      "Real estate listings change weekly: a property sells, a price moves, a status flips. Four languages means four chances for a listing to go stale in one locale while it is correct in the others, and a headless WordPress and WooCommerce build makes that consistency a technical problem, not just an editorial one.",
    work:
      "EN/FR/ES/DE coverage across a headless WordPress, WPML and WooCommerce stack, with the multilingual site and tracking system itself built by Globaprom. SEO discipline applied per locale rather than translated from an English baseline.",
    outcome:
      "Four languages held correct against weekly-turnover inventory on a live real estate site, the kind of ongoing operational SEO that does not show up as a single launch metric but has to keep working every week.",
  },
  {
    slug: "valenciamove",
    numeral: "V",
    name: "ValenciaMove",
    domain: "valenciamove.com",
    angle: "Expat relocation, first hand",
    body: "Over a thousand pages across five languages, written from actually having done the move rather than from a keyword tool. The Valencia content leaving mikebastin.com is heading here.",
    metrics: [
      { v: "1,132", k: "URLs" },
      { v: "5", k: "Locales" },
    ],
    problem:
      "Mikebastin.com used to carry Valencia relocation content alongside its SEO consultancy content, and the two competed for the same search real estate under the same domain. The French page for a digital nomad visa existed at an identical slug on both sites at once, an unforced case of a domain competing with itself.",
    work:
      "Over a thousand pages across five locales (EN, FR, ES, NL, IT), built from having made the move personally rather than from generic destination-guide research. The Valencia content leaving mikebastin.com as part of this rebuild is migrating here rather than being deleted, with 301s carrying the existing search equity across.",
    outcome:
      "1,132 URLs live across five languages, and the exodus this case study describes is the same one this rebuild is executing: the reader is looking at the fix while it happens.",
  },
  {
    slug: "bemelman-spuiterij",
    numeral: "VI",
    name: "Bemelman Spuiterij",
    domain: "bemelmanspuiterij.nl",
    angle: "Dutch powder coating, 45 years",
    body: "A specialist in Noordwijkerhout who had no web presence worth the name. Dutch local SEO for a trade where the buyers are other businesses and the search volume is small but decisive.",
    metrics: [
      { v: "45 yr", k: "Trading" },
      { v: "NL", k: "Local search" },
    ],
    problem:
      "A trade business with forty-five years of reputation and almost no web presence is invisible to the small number of buyers actually searching for it. B2B search volume in a niche trade is low, but every one of those searches is a real buyer, not a browser.",
    work:
      "A Divi build paired with Dutch local SEO aimed at the small, decisive search volume a specialist trade actually gets, rather than chasing the larger but irrelevant traffic of adjacent consumer terms.",
    outcome:
      "A genuine web presence for a business that had been trading on reputation alone for forty-five years, positioned for the low-volume, high-intent local searches that actually convert in this trade.",
  },
  {
    slug: "delaguia-y-luzon",
    numeral: "VII",
    name: "Delaguía y Luzón",
    domain: "delaguialuzon.com",
    angle: "Valencia law firm",
    body: "Legal, labour, immigration and tax across Spain and France, in four languages including Russian. Legal SEO where a mistranslated term is a liability, not a ranking problem.",
    metrics: [
      { v: "4", k: "Languages" },
      { v: "2", k: "Jurisdictions" },
    ],
    problem:
      "Legal content in four languages across two jurisdictions carries a different risk than most multilingual SEO: a mistranslated term is not a missed ranking, it is a liability. Generic translation and generic SEO both fail this brief in the same way, by treating accuracy as secondary to volume.",
    work:
      "Legal SEO and multilingual content across ES/FR/EN/RU, covering legal, labour, immigration and tax practice areas across Spain and France, built with the accuracy standard a law firm's content actually requires rather than the standard general SEO content gets away with.",
    outcome:
      "Four languages, two jurisdictions, multiple practice areas held to a legal accuracy bar, proof that multilingual SEO and professional liability can be handled by the same process rather than needing separate ones.",
  },
  {
    slug: "matosurf",
    numeral: "VIII",
    name: "Matosurf",
    domain: "matosurf.com",
    angle: "French board sports",
    body: "Seven board sports, forty-eight French spots, a hundred and twenty guides. Friends in the line-up still call me the Silver Surfer, and the editorial method page there is the pattern this site borrows for its own credibility layer.",
    metrics: [
      { v: "120+", k: "Guides" },
      { v: "48", k: "Spots" },
    ],
    problem:
      "Board sports content online is mostly thin affiliate copy: a spot name, a product link, no evidence anyone has actually surfed the break. Buyers can tell the difference, and search engines are getting better at telling it too.",
    work:
      "Seven board sports covered across four geographic zones, forty-eight French spots, a hundred and twenty guides, built on a visible editorial method page that states plainly how the content is researched rather than asserting authority without showing the work.",
    outcome:
      "A real, checkable scale of coverage across the French board sports market, and an editorial-method pattern proven here first and then reused for this very site's own credibility layer.",
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
