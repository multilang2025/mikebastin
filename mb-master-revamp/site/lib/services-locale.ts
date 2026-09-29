/**
 * FR/ES service pages, read per locale by `group`, mirroring lib/posts.ts's
 * getPostsForLocale/getPostForLocale/postHreflang/getLocaleManifest pattern
 * for the same content-map.json contract (CONTENT-ARCHITECTURE.md section
 * 2), generalised via lib/content-locale.ts.
 *
 * Of the 44 `type: "service"` groups in redirects/content-map.json, only
 * the 11 with `action: "migrate"` and `destination: "mdx"` qualify for a
 * live page: g069, g072, g074, g076, g077, g079, g080, g081, g083, g089,
 * g115. The other 33 either `absorb` into a consolidated EN
 * /services/<slug>/ page (lib/services.ts) or `relocate` to
 * valenciamove.com, and both already have their redirects, so this file
 * must never grow to include them even though their .md files still sit in
 * the repo.
 *
 * EN gets no file-backed reader here. lib/services.ts holds rewritten
 * consolidated copy for the same 10 EN-published groups among the 11
 * above (spanish-seo, multilingual-seo, multilingual-sem, german-seo,
 * french-seo, italian-seo, local-seo, dutch-seo, portuguese-seo,
 * website-localisation -- each verified to match its qualifying group's
 * `en.slug` in content-map.json; g115 has no `en` entry at all), already
 * routed through app/services/[slug]/page.tsx. So EN "publication" for
 * hreflang and the locale switcher is read straight off content-map.json
 * (via qualifyingGroupsForLocale, no file parse needed) rather than from a
 * second reader that could drift from lib/services.ts's own list.
 */
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { SITE_URL } from "@/lib/schema";
import { REPO_ROOT, LOCALES, qualifyingGroupsForLocale, type Locale, type LocaleSlugs } from "@/lib/content-locale";
import { LEAD_GEN_SLUGS } from "@/lib/lead-gen-hubs";

export type ServiceFrontmatter = {
  words: number;
  title: string;
  slug: string;
  locale: string;
  type: string;
  group: string;
  wpId: number;
  date: string;
  modified: string;
  sourceUrl: string;
  excerpt: string;
  /** Search title when the h1 runs over 60 characters. */
  metaTitle?: string;
  /** Short label for the footer and menus; the h1 is too long there. */
  name?: string;
};

export type LocaleService = ServiceFrontmatter & {
  /** Rendered HTML body. Build time only -- never sent to the client as markdown. */
  html: string;
};

/** The locales with a file-backed service reader. EN is served by lib/services.ts instead. */
const FILE_BACKED_LOCALES = ["fr", "es"] as const;
type FileBackedLocale = (typeof FILE_BACKED_LOCALES)[number];

const localeServiceCache: Partial<Record<FileBackedLocale, LocaleService[]>> = {};

/** Every live service page for `locale` (FR or ES only), read from disk once per build. */
export function getServicesForLocale(locale: FileBackedLocale): LocaleService[] {
  const cached = localeServiceCache[locale];
  if (cached) return cached;

  const services: LocaleService[] = [];
  for (const { contentPath } of qualifyingGroupsForLocale(locale, "service")) {
    const raw = readFileSync(join(REPO_ROOT, contentPath), "utf8");
    const { data, content } = matter(raw);
    const fm = data as ServiceFrontmatter;
    services.push({ ...fm, html: marked.parse(content, { async: false }) as string });
  }

  services.sort((a, b) => a.title.localeCompare(b.title));
  localeServiceCache[locale] = services;
  return services;
}

export function getServiceForLocale(locale: FileBackedLocale, slug: string): LocaleService | undefined {
  return getServicesForLocale(locale).find((s) => s.slug === slug);
}

let serviceSiblingIndex: Map<string, LocaleSlugs> | null = null;

/**
 * Maps a translation group to the slug each locale published its service
 * page under. EN comes from content-map.json directly (see file header);
 * FR and ES come from the actual file-backed readers, same as
 * lib/posts.ts's buildSiblingIndex.
 */
let standaloneIndex: Map<string, string[]> | null = null;

/**
 * Locales a group's page stands alone in: published, but paired with none
 * of its group siblings for hreflang. Set per group in content-map.json as
 * `hreflang_standalone`. First use: g077, where /fr/services/seo/ is the
 * main French SEO page for French companies selling abroad and the EN
 * sibling french-seo sells to foreign companies entering France, so the
 * two are different pages for different readers (docs/FR-REBUILD-PLAN.md).
 */
function standaloneLocales(group: string): string[] {
  if (!standaloneIndex) {
    const cm = JSON.parse(readFileSync(join(REPO_ROOT, "redirects/content-map.json"), "utf8")) as {
      groups: { group: string; hreflang_standalone?: string[] }[];
    };
    standaloneIndex = new Map(cm.groups.filter((g) => g.hreflang_standalone).map((g) => [g.group, g.hreflang_standalone!]));
  }
  return standaloneIndex.get(group) ?? [];
}

function buildServiceSiblingIndex(): Map<string, LocaleSlugs> {
  if (serviceSiblingIndex) return serviceSiblingIndex;
  const map = new Map<string, LocaleSlugs>();

  for (const { group, slug } of qualifyingGroupsForLocale("en", "service")) {
    map.set(group, { en: slug });
  }

  for (const locale of FILE_BACKED_LOCALES) {
    for (const service of getServicesForLocale(locale)) {
      if (standaloneLocales(service.group).includes(locale)) continue;
      const entry = map.get(service.group) ?? {};
      entry[locale] = service.slug;
      map.set(service.group, entry);
    }
  }

  serviceSiblingIndex = map;
  return map;
}

/** The published slug per locale for a service page's translation group. */
export function getServiceSiblings(group: string): LocaleSlugs {
  return buildServiceSiblingIndex().get(group) ?? {};
}

/**
 * The qualifying group id for an EN service slug (lib/services.ts), or
 * undefined when that slug has no qualifying content-map group (most of
 * lib/services.ts's 21 slugs are consolidated pages with no group of
 * their own -- see the `absorb` groups this file deliberately excludes).
 * Used by app/services/[slug]/page.tsx to look up hreflang for the 10
 * EN slugs that do have one.
 */
export function serviceGroupForEnSlug(slug: string): string | undefined {
  return qualifyingGroupsForLocale("en", "service").find((g) => g.slug === slug)?.group;
}

/** Site-relative path for a published service page in `locale`. EN stays at
 *  /services/<slug>/ (lib/services.ts, unchanged); FR and ES are at
 *  /fr/services/<slug>/ and /es/services/<slug>/, matching each file's own
 *  localized sourceUrl frontmatter. */
export function servicePath(locale: Locale, slug: string): string {
  return locale === "en" ? `/services/${slug}/` : `/${locale}/services/${slug}/`;
}

/**
 * `alternates.languages` for a service page's `<head>`, built from the
 * locales its translation group actually published. Same rule as
 * lib/posts.ts's postHreflang: undefined when there is no sibling at all,
 * and `x-default` only when EN published this group.
 */
export function serviceHreflang(group: string, fromLocale?: Locale): Record<string, string> | undefined {
  if (fromLocale && standaloneLocales(group).includes(fromLocale)) return undefined;
  const siblings = getServiceSiblings(group);
  const published = LOCALES.filter((l) => siblings[l]);
  if (published.length < 2) return undefined;

  const languages: Record<string, string> = {};
  for (const locale of published) {
    languages[locale] = `${SITE_URL}${servicePath(locale, siblings[locale]!)}`;
  }
  if (siblings.en) {
    languages["x-default"] = `${SITE_URL}${servicePath("en", siblings.en)}`;
  }
  return languages;
}

/**
 * path -> the slug each locale published that translation group's service
 * page under, in the same shape as lib/posts.ts's getLocaleManifest, for
 * merging into it (see that function's own doc comment for why the merge
 * happens there instead of in app/layout.tsx).
 */
export function getServiceLocaleManifest(): Record<string, LocaleSlugs> {
  const manifest: Record<string, LocaleSlugs> = {};
  for (const siblings of buildServiceSiblingIndex().values()) {
    const published = LOCALES.filter((l) => siblings[l]);
    if (published.length < 2) continue;
    for (const locale of published) {
      manifest[servicePath(locale, siblings[locale]!)] = siblings;
    }
  }
  // The lead generation hubs are hand-built routes with no content-map
  // group (lib/lead-gen-hubs.ts), so they are paired here by hand.
  for (const locale of LOCALES) {
    manifest[servicePath(locale, LEAD_GEN_SLUGS[locale])] = { ...LEAD_GEN_SLUGS };
  }
  return manifest;
}
