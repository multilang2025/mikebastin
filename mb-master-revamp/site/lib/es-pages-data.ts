/**
 * The hand-built Spanish pages, as plain data (no Node imports), so the
 * client-side SiteNav reads the menu from the same list the server helpers
 * in lib/fr-pages.ts use. The Spanish twin of lib/fr-pages-data.ts
 * (docs/ES-REBUILD-PLAN.md).
 *
 * Legacy URLs are kept where a page is built at the same address:
 * /es/contactanos/, /es/precios/, /es/blog/ and
 * /es/conocenos-agencia-experta-en-seo/ are the old WordPress paths, and
 * /es/services/ takes the old servicios-consultoria-web index.
 */
import type { LocalePage } from "@/lib/fr-pages-data";

export const ES_PAGES: LocalePage[] = [
  { path: "/es/", en: "/", label: "Inicio", route: "app/es/page.tsx", nav: true },
  { path: "/es/services/", en: "/services/", label: "Servicios", route: "app/es/services/page.tsx", nav: true },
  { path: "/es/blog/", en: "/blog/", label: "Artículos", route: "app/es/blog/page.tsx", nav: true },
  { path: "/es/contactanos/", en: "/contact/", label: "Contacto", route: "app/es/contactanos/page.tsx", nav: true },
  { path: "/es/conocenos-agencia-experta-en-seo/", en: null, label: "Quiénes somos", route: "app/es/conocenos-agencia-experta-en-seo/page.tsx" },
  { path: "/es/precios/", en: "/how-i-work/", label: "Precios", route: "app/es/precios/page.tsx" },
];
