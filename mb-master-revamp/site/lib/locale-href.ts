import type { Locale, LocaleSlugs } from "@/lib/posts";

/**
 * Where the language row in the footer sends a reader who wants `target`.
 * The sibling of the page they are on when there is one (built from the
 * same manifests the header switcher reads), else the homepage of that
 * language, so every link lands on a real page in the language it names.
 * Pure: no Node imports, so the client footer can use it.
 */
const HOME: Record<Locale, string> = { en: "/", fr: "/fr/", es: "/es/" };

const postPath = (locale: Locale, slug: string) => (locale === "en" ? `/blog/${slug}/` : `/${locale}/${slug}/`);
const servicePath = (locale: Locale, slug: string) => (locale === "en" ? `/services/${slug}/` : `/${locale}/services/${slug}/`);

export const localeOfPath = (pathname: string): Locale =>
  pathname === "/fr" || pathname.startsWith("/fr/") ? "fr" : pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

export function localeHref(pathname: string, index: Map<string, string[]>, target: Locale): string {
  const group = index.get(pathname);
  const i = LOCALE_ORDER.indexOf(target);
  return (group && group[i]) || HOME[target];
}

/**
 * The translation groups the root layout sends to the browser, one line per
 * group, "en|fr|es" full paths with an empty slot where a language has no
 * page (CWV audit, 3 Oct 2026). The earlier per-page manifest repeated every
 * group once per language and cost about 27 KB of HTML on every page.
 */
export const LOCALE_ORDER: Locale[] = ["en", "fr", "es"];

export function encodeLocaleGroups(
  manifest: Record<string, LocaleSlugs>,
  pagePairs: Record<string, Partial<Record<Locale, string>>>,
): string {
  const lines = new Set<string>();
  for (const [path, siblings] of Object.entries(manifest)) {
    const make = path.includes("/services/") ? servicePath : postPath;
    lines.add(LOCALE_ORDER.map((l) => (siblings[l] ? make(l, siblings[l]!) : "")).join("|"));
  }
  // Hand-built page pairs go last so they win over a post or service sibling.
  for (const pair of Object.values(pagePairs)) lines.add(LOCALE_ORDER.map((l) => pair[l] ?? "").join("|"));
  return [...lines].join("\n");
}

export function decodeLocaleGroups(encoded: string): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const line of encoded.split("\n")) {
    const group = line.split("|");
    for (const path of group) if (path) index.set(path, group);
  }
  return index;
}
