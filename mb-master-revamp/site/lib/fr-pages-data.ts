/**
 * The hand-built French pages, as plain data (no Node imports), so the
 * client-side SiteNav can read the menu from the same list the server
 * helpers in lib/fr-pages.ts use. See that file for the why.
 *
 * `/fr/notre-equipe/` pairs with /about-us/, rebuilt as the English about
 * page on 8 Oct 2026 (it had redirected to /how-i-work/, which pairs with
 * `/fr/tarifs/`).
 */
import { CASE_STUDIES, caseStudyPath } from "@/lib/case-studies";

export type LocalePage = {
  /** This locale's URL path, leading and trailing slash. */
  path: string;
  /** The English page it pairs with, or null for a page with no English sibling. */
  en: string | null;
  /** Menu and sitemap label. */
  label: string;
  /** Route file, relative to the site root, whose presence means "built". */
  route: string;
  /** In the French top menu, in this order. */
  nav?: boolean;
};

/** Kept for the existing imports: the French list is the original. */
export type FrPage = LocalePage;

export const FR_PAGES: LocalePage[] = [
  { path: "/fr/", en: "/", label: "Accueil", route: "app/fr/page.tsx", nav: true },
  { path: "/fr/etudes-de-cas/", en: "/projects/", label: "Études de cas", route: "app/fr/etudes-de-cas/page.tsx", nav: true },
  { path: "/fr/services/", en: "/services/", label: "Services", route: "app/fr/services/page.tsx", nav: true },
  { path: "/fr/blog/", en: "/blog/", label: "Articles", route: "app/fr/blog/page.tsx", nav: true },
  { path: "/fr/notre-equipe/", en: "/about-us/", label: "À propos", route: "app/fr/notre-equipe/page.tsx", nav: true },
  { path: "/fr/nous-contacter/", en: "/contact/", label: "Contact", route: "app/fr/nous-contacter/page.tsx", nav: true },
  { path: "/fr/checklist-analyse-concurrentielle/", en: "/competitor-analysis-traffic-checklist/", label: "Checklist d’analyse concurrentielle", route: "app/fr/checklist-analyse-concurrentielle/page.tsx" },
  { path: "/fr/tarifs/", en: "/how-i-work/", label: "Tarifs", route: "app/fr/tarifs/page.tsx" },
  { path: "/fr/confidentialite/", en: "/privacy/", label: "Confidentialité et cookies", route: "app/fr/confidentialite/page.tsx" },
  // Case studies, one per client, paired with the English one; URLs name the sector (13 Oct 2026).
  ...CASE_STUDIES.map((c) => ({ path: caseStudyPath("fr", c.id), en: caseStudyPath("en", c.id), label: `${c.name}, étude de cas`, route: "app/fr/etudes-de-cas/[slug]/page.tsx" })),
];
