/**
 * BeTranslated's ten country domains (owner, 7 Oct 2026, checked on the
 * betranslated.com footer), for the tiles in the homepage work section
 * (components/HomeEvidence.tsx). Each image is a recreation of that site's
 * hero in the client's own branding, from design/work-shots/gen.py, like the
 * other client images in public/work/. The .com is the original
 * betranslated.webp; the nine country sites have their own files.
 *
 * Market names are shown per locale. No language is claimed here: a site
 * such as .be or .ca serves more than one.
 */
export type BtSite = {
  tld: string;
  /** File stem under /work/ (the 800px copy is `<stem>-800.webp`). */
  image: string;
  /** Where the tile links, when the domain itself is not live. */
  href?: string;
  market: { en: string; fr: string; es: string };
};

export const BT_SITES: BtSite[] = [
  { tld: "com", image: "betranslated", market: { en: "Global", fr: "International", es: "Internacional" } },
  { tld: "us", image: "betranslated-us", market: { en: "United States", fr: "États-Unis", es: "Estados Unidos" } },
  { tld: "ca", image: "betranslated-ca", market: { en: "Canada", fr: "Canada", es: "Canadá" } },
  { tld: "co.uk", image: "betranslated-co-uk", market: { en: "United Kingdom", fr: "Royaume-Uni", es: "Reino Unido" } },
  { tld: "be", image: "betranslated-be", market: { en: "Belgium", fr: "Belgique", es: "Bélgica" } },
  { tld: "fr", image: "betranslated-fr", market: { en: "France", fr: "France", es: "Francia" } },
  { tld: "es", image: "betranslated-es", market: { en: "Spain", fr: "Espagne", es: "España" } },
  { tld: "de", image: "betranslated-de", market: { en: "Germany", fr: "Allemagne", es: "Alemania" } },
  { tld: "nl", image: "betranslated-nl", market: { en: "Netherlands", fr: "Pays-Bas", es: "Países Bajos" } },
  { tld: "it", image: "betranslated-it", href: "https://betranslated.com/it/", market: { en: "Italy", fr: "Italie", es: "Italia" } },
];
