/**
 * Which recycled illustration (components/DlArt.tsx) sits on which page.
 * Keyed by service slug per locale; an unmapped slug keeps whatever art its
 * page had before. Chosen by what the drawing shows: a map of Spain with
 * routes converging on Valencia for the Spanish market, a hub with its
 * markets for multilingual SEO, a magnified audit for technical SEO, and so on.
 */
export const DL_SERVICE_ART: Record<"en" | "fr" | "es", Record<string, string>> = {
  en: {
    "spanish-seo": "convergence",
    "multilingual-seo": "convergence-world",
    "technical-seo": "audit",
    "local-seo": "gbp",
    "ai-consulting": "gears",
    "generative-engine-optimization": "orbits",
    "website-localisation": "puzzle",
    "translation-services": "venn",
    "lead-generation": "amphora",
  },
  fr: {
    seo: "convergence-europe",
    "seo-espagnol": "convergence",
    "referencement-multilingue": "constellation",
    "seo-technique": "audit",
    "referencement-local": "gbp",
    "conseil-ia": "gears",
    "localisation-de-site-web": "puzzle",
    "traduction-professionnelle": "venn",
    "generation-de-leads": "amphora",
  },
  es: {
    "optimizacion-seo": "constellation",
    "posicionamiento-multilingue": "constellation",
    "seo-tecnico": "audit",
    "seo-local": "gbp",
    "consultoria-de-inteligencia-artificial": "gears",
    "traduccion-de-paginas-web": "puzzle",
    "traduccion-profesional": "venn",
    "generacion-de-leads": "amphora",
  },
};

/** Page-level art: contact, how we work, results, the team page, the services index. */
export const DL_PAGE_ART = {
  contact: "globe",
  services: "constellation",
  howWeWork: "roundtable",
  results: "clock",
  team: "skyline",
} as const;

/**
 * Whether a service hero has a recycled illustration. Those show on mobile
 * too (owner, 30 Sep 2026); the generic hero motifs stay desktop only.
 */
export const hasDlArt = (locale: "en" | "fr" | "es", slug: string) => Boolean(DL_SERVICE_ART[locale][slug]);
