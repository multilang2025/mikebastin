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

export function localeHref(
  pathname: string,
  manifest: Record<string, LocaleSlugs>,
  pagePairs: Record<string, Partial<Record<Locale, string>>>,
  target: Locale,
): string {
  const pair = pagePairs[pathname];
  if (pair?.[target]) return pair[target]!;
  const siblings = manifest[pathname];
  if (siblings?.[target]) {
    return (pathname.includes("/services/") ? servicePath : postPath)(target, siblings[target]!);
  }
  return HOME[target];
}
