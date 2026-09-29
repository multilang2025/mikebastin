import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL } from "@/lib/schema";

/**
 * The hand-built French pages (docs/FR-REBUILD-PLAN.md, "Target French
 * site"), each with the English page it pairs with for hreflang.
 *
 * One list, read by the pages themselves (their `alternates`), their
 * English siblings (the reciprocal `fr` entry), lib/site-urls.ts (the FR
 * sitemap) and SiteNav (the French menu), so a page added here is added
 * everywhere at once and a pair can never be declared on one side only.
 *
 * `built` is read from the route file rather than assumed, so a page
 * listed here before its route exists never gets a sitemap entry or an
 * hreflang link pointing at a 404. scripts/gen-fr-redirects.mjs reads the
 * same route files to decide when a legacy URL's 302 becomes a 301.
 */
import { FR_PAGES, type FrPage } from "@/lib/fr-pages-data";

export { FR_PAGES, type FrPage };

const SITE_ROOT = join(process.cwd());
const isBuilt = (p: FrPage) => existsSync(join(SITE_ROOT, p.route));

/** French pages whose route exists. */
export function builtFrPages(): FrPage[] {
  return FR_PAGES.filter(isBuilt);
}

/** hreflang for a French page: itself, its English sibling, x-default to English. */
export function frLanguages(path: string): Record<string, string> | undefined {
  const page = FR_PAGES.find((p) => p.path === path);
  if (!page?.en) return undefined;
  return {
    en: `${SITE_URL}${page.en}`,
    fr: `${SITE_URL}${page.path}`,
    "x-default": `${SITE_URL}${page.en}`,
  };
}

/** hreflang for an English page that has a built French sibling. */
export function enLanguages(enPath: string): Record<string, string> | undefined {
  const page = builtFrPages().find((p) => p.en === enPath);
  if (!page) return undefined;
  return {
    en: `${SITE_URL}${enPath}`,
    fr: `${SITE_URL}${page.path}`,
    "x-default": `${SITE_URL}${enPath}`,
  };
}
