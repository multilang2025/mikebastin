/**
 * The hand-built French pages, as plain data (no Node imports), so the
 * client-side SiteNav can read the menu from the same list the server
 * helpers in lib/fr-pages.ts use. See that file for the why.
 *
 * `/fr/notre-equipe/` is French-only: its legacy English sibling
 * (/about-us/) now redirects to /how-i-work/, which already pairs with
 * `/fr/tarifs/`, and one English page cannot name two French alternates.
 */
export type FrPage = {
  /** French URL path, leading and trailing slash. */
  path: string;
  /** The English page it pairs with, or null for a French-only page. */
  en: string | null;
  /** Menu and sitemap label. */
  label: string;
  /** Route file, relative to the site root, whose presence means "built". */
  route: string;
  /** In the French top menu, in this order. */
  nav?: boolean;
};

export const FR_PAGES: FrPage[] = [
  { path: "/fr/", en: "/", label: "Accueil", route: "app/fr/page.tsx", nav: true },
  { path: "/fr/services/", en: "/services/", label: "Services", route: "app/fr/services/page.tsx", nav: true },
  { path: "/fr/blog/", en: "/blog/", label: "Articles", route: "app/fr/blog/page.tsx", nav: true },
  { path: "/fr/nous-contacter/", en: "/contact/", label: "Contact", route: "app/fr/nous-contacter/page.tsx", nav: true },
  { path: "/fr/notre-equipe/", en: null, label: "Notre équipe", route: "app/fr/notre-equipe/page.tsx" },
  { path: "/fr/tarifs/", en: "/how-i-work/", label: "Tarifs", route: "app/fr/tarifs/page.tsx" },
];
