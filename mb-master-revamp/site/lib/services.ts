/**
 * The "Market" template: one shared shape for the six language-market
 * service pages (French, German, Spanish, Dutch, Italian, Portuguese).
 *
 * Only French carries real content so far, because only France and Spain
 * have been measured against actual demand data (CONTENT-ARCHITECTURE.md
 * §4c/4d/4e). The other five stay unbuilt rather than filled with
 * translated-from-English placeholder copy: each one needs its own market
 * researched before it ships, the same way French and Spanish were.
 */

export type Service = {
  slug: string;
  name: string;
  angle: string;
  lede: string;
  demandNote: string;
  demandMetrics: { v: string; k: string }[];
  relationshipNote?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "french-seo",
    name: "French SEO",
    angle: "International SEO consultant, in French",
    lede: "The two best-performing pages on the whole domain are French originals: agence-seo-internationale at 1,969 impressions and consultant-referencement-international at 1,316. Neither says multilingual. Both say international, and the demand data agrees with them by roughly five to one.",
    demandNote:
      "France carries 1,850 of the 2,390 monthly searches measured across the whole francophone core, at a difficulty score of 0 to 2. An unguarded position: a thousand searches a month for seo international with nobody meaningfully competing for it.",
    demandMetrics: [
      { v: "1,850", k: "Monthly FR core searches" },
      { v: "0 to 2", k: "Difficulty score" },
    ],
    relationshipNote:
      "Belgian demand for the entire international and multilingual core is 300 searches a month, against 800 for plain agence seo. The network and the referrals live in Belgium and Switzerland; the proof layer converts there, not a keyword. Both stay relationship markets, not acquisition ones.",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
