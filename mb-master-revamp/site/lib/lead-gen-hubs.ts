import { SITE_URL } from "@/lib/schema";
import type { Locale } from "@/lib/content-locale";

/**
 * The lead generation hub in each locale. The EN pillar is a hand-built
 * route (app/services/lead-generation/), and so are its FR and ES
 * siblings, so none of the three has a content-map group for
 * lib/services-locale.ts to pair. This is the pairing instead, read by
 * all three pages (hreflang), the sitemap and the language switcher.
 *
 * Slugs follow search data (29 Sep 2026, Ahrefs): "génération de leads"
 * 800 a month in France and "agence génération de leads" 600; "generación
 * de leads" 200 in Spain, plus 200 for the unaccented spelling.
 */
export const LEAD_GEN_SLUGS: Record<Locale, string> = {
  en: "lead-generation",
  fr: "generation-de-leads",
  es: "generacion-de-leads",
};

export function leadGenPath(locale: Locale): string {
  const slug = LEAD_GEN_SLUGS[locale];
  return locale === "en" ? `/services/${slug}/` : `/${locale}/services/${slug}/`;
}

/** Reciprocal hreflang, identical on all three pages. */
export function leadGenLanguages(): Record<string, string> {
  return {
    en: `${SITE_URL}${leadGenPath("en")}`,
    fr: `${SITE_URL}${leadGenPath("fr")}`,
    es: `${SITE_URL}${leadGenPath("es")}`,
    "x-default": `${SITE_URL}${leadGenPath("en")}`,
  };
}
