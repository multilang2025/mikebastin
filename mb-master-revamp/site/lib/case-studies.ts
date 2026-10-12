/**
 * The case study pages in each language (owner, 12 Oct 2026: "translate the
 * case studies"). Plain data with no Node imports, because lib/fr-pages-data.ts
 * and lib/es-pages-data.ts read it and SiteNav ships those to the browser.
 *
 * The slugs are the client names and stay the same in every language; the
 * folder is localised. Keep this list in step with PROJECTS in
 * lib/projects.ts: `npm run lint:sitemap` fails the build if a case study is
 * built without a sitemap entry, or listed here without a page.
 */
export const CASE_STUDIES = [
  { slug: "betranslated", name: "BeTranslated" },
  { slug: "globaprom", name: "Globaprom" },
  { slug: "tx-international-freight", name: "TX International Freight" },
  { slug: "c21perdomo", name: "Century 21 Perdomo" },
  { slug: "valenciamove", name: "ValenciaMove" },
  { slug: "bemelman-spuiterij", name: "Bemelman Spuiterij" },
  { slug: "delaguia-y-luzon", name: "Delaguía y Luzón" },
  { slug: "matosurf", name: "Matosurf" },
] as const;

const FOLDER = { en: "/projects/", fr: "/fr/etudes-de-cas/", es: "/es/casos-de-exito/" } as const;

export const caseStudyPath = (locale: "en" | "fr" | "es", slug: string) => `${FOLDER[locale]}${slug}/`;
