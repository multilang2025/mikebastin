import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "@/lib/schema";

/**
 * The hand-built French and Spanish pages (docs/FR-REBUILD-PLAN.md,
 * docs/ES-REBUILD-PLAN.md), each with the English page it pairs with for
 * hreflang.
 *
 * One list per locale, read by the pages themselves (their `alternates`),
 * their English siblings (the reciprocal entries), lib/site-urls.ts (the
 * sitemaps) and SiteNav (the menus), so a page added to a list is added
 * everywhere at once and a pair can never be declared on one side only.
 *
 * `built` is read from the route file rather than assumed, so a page
 * listed before its route exists never gets a sitemap entry or an
 * hreflang link pointing at a 404. The gen-*-redirects.mjs scripts read
 * the same route files to decide when a legacy URL's 302 becomes a 301.
 *
 * The file keeps its name from when it held French only; the Spanish list
 * lives in lib/es-pages-data.ts.
 */
import { FR_PAGES, type LocalePage, type FrPage } from "@/lib/fr-pages-data";
import { ES_PAGES } from "@/lib/es-pages-data";

export { FR_PAGES, ES_PAGES, type LocalePage, type FrPage };

const SITE_ROOT = join(process.cwd());
const isBuilt = (p: LocalePage) => existsSync(join(SITE_ROOT, p.route));

/** French pages whose route exists. */
export function builtFrPages(): LocalePage[] {
  return FR_PAGES.filter(isBuilt);
}

/** Spanish pages whose route exists. */
export function builtEsPages(): LocalePage[] {
  return ES_PAGES.filter(isBuilt);
}

/**
 * hreflang for the set of pages that pair with one English page: the
 * English page itself, each built sibling, and x-default to English. Each
 * locale is named only when its sibling is built.
 */
function languagesForEn(enPath: string): Record<string, string> {
  const fr = builtFrPages().find((p) => p.en === enPath);
  const es = builtEsPages().find((p) => p.en === enPath);
  return {
    en: `${SITE_URL}${enPath}`,
    ...(fr ? { fr: `${SITE_URL}${fr.path}` } : {}),
    ...(es ? { es: `${SITE_URL}${es.path}` } : {}),
    "x-default": `${SITE_URL}${enPath}`,
  };
}

function languagesOf(path: string, list: LocalePage[]): Record<string, string> | undefined {
  const page = list.find((p) => p.path === path);
  return page?.en ? languagesForEn(page.en) : undefined;
}

/** hreflang for a French page: itself, its siblings, x-default to English. */
export function frLanguages(path: string): Record<string, string> | undefined {
  return languagesOf(path, FR_PAGES);
}

/** hreflang for a Spanish page: itself, its siblings, x-default to English. */
export function esLanguages(path: string): Record<string, string> | undefined {
  return languagesOf(path, ES_PAGES);
}

/** hreflang for an English page that has a built French or Spanish sibling. */
export function enLanguages(enPath: string): Record<string, string> | undefined {
  const paired = builtFrPages().some((p) => p.en === enPath) || builtEsPages().some((p) => p.en === enPath);
  return paired ? languagesForEn(enPath) : undefined;
}

/**
 * Language switcher data for the hand-built pages: every built page that
 * pairs with an English page, keyed by each locale's own path, valued with
 * the full path in every built locale. The slug-based manifest in
 * lib/posts.ts covers posts and services; this covers homepages, indexes,
 * contact and pricing.
 */
export function getPageLocaleManifest(): Record<string, Partial<Record<"en" | "fr" | "es", string>>> {
  const out: Record<string, Partial<Record<"en" | "fr" | "es", string>>> = {};
  const fr = builtFrPages();
  const es = builtEsPages();
  const enPaths = new Set([...fr, ...es].map((p) => p.en).filter((e): e is string => Boolean(e)));
  for (const en of enPaths) {
    const pair: Partial<Record<"en" | "fr" | "es", string>> = { en };
    const f = fr.find((p) => p.en === en);
    const e = es.find((p) => p.en === en);
    if (f) pair.fr = f.path;
    if (e) pair.es = e.path;
    for (const path of Object.values(pair)) if (path) out[path] = pair;
  }
  return out;
}
