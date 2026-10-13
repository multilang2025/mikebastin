/**
 * The case study pages in each language (owner, 12 Oct 2026: "translate the
 * case studies"). Plain data with no Node imports, because lib/fr-pages-data.ts
 * and lib/es-pages-data.ts read it and SiteNav ships those to the browser.
 *
 * The URLs name the sector, never the client (owner, 13 Oct 2026: "I don't
 * want to name them in the slug"), in each language. `id` is the internal
 * key, the `slug` in lib/projects.ts; it stays out of every URL. Keep this
 * list in step with PROJECTS: `npm run lint:sitemap` fails the build if a
 * case study is built without a sitemap entry, or listed here without a page.
 */
type Locale = "en" | "fr" | "es";

export const CASE_STUDIES: { id: string; name: string; url: Record<Locale, string> }[] = [
  { id: "betranslated", name: "BeTranslated", url: { en: "translation-agency", fr: "agence-de-traduction", es: "agencia-de-traduccion" } },
  { id: "globaprom", name: "Globaprom", url: { en: "custom-ai-software", fr: "logiciel-ia", es: "software-con-ia" } },
  { id: "tx-international-freight", name: "TX International Freight", url: { en: "freight-forwarder-houston", fr: "transitaire-houston", es: "transitario-houston" } },
  { id: "c21perdomo", name: "Century 21 Perdomo", url: { en: "real-estate-dominican-republic", fr: "immobilier-republique-dominicaine", es: "inmobiliaria-republica-dominicana" } },
  { id: "valenciamove", name: "ValenciaMove", url: { en: "expat-relocation-valencia", fr: "installation-valencia", es: "mudanza-valencia" } },
  { id: "bemelman-spuiterij", name: "Bemelman Spuiterij", url: { en: "powder-coating-netherlands", fr: "thermolaquage-pays-bas", es: "pintura-en-polvo-paises-bajos" } },
  { id: "delaguia-y-luzon", name: "Delaguía y Luzón", url: { en: "law-firm-valencia", fr: "cabinet-avocats-valencia", es: "despacho-abogados-valencia" } },
  { id: "matosurf", name: "Matosurf", url: { en: "board-sports-france", fr: "sports-de-glisse-france", es: "deportes-de-tabla-francia" } },
];

const FOLDER = { en: "/projects/", fr: "/fr/etudes-de-cas/", es: "/es/casos-de-exito/" } as const;

/** The URL slugs for one language, for generateStaticParams. */
export const caseStudySlugs = (locale: Locale) => CASE_STUDIES.map((c) => c.url[locale]);

/** The project id behind a URL slug in that language, or undefined. */
export const caseStudyId = (locale: Locale, urlSlug: string) => CASE_STUDIES.find((c) => c.url[locale] === urlSlug)?.id;

/** A case study's path in a language, from its project id. */
export function caseStudyPath(locale: Locale, id: string) {
  const c = CASE_STUDIES.find((s) => s.id === id);
  if (!c) throw new Error(`No case study for "${id}" in lib/case-studies.ts`);
  return `${FOLDER[locale]}${c.url[locale]}/`;
}
