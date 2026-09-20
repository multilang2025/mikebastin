/**
 * The content-map reader shared by every locale-aware content type.
 *
 * Factored out of lib/posts.ts when lib/services-locale.ts needed the same
 * qualification logic (`action: "migrate"`, `destination: "mdx"`, a real
 * `g[locale]` entry) for a different content-map `type` ("service" instead
 * of "post"). lib/posts.ts re-exports Locale/LOCALES/LocaleSlugs from here
 * so every existing import of them from "@/lib/posts" keeps working
 * unchanged -- this is a relocation of the reader, not a behaviour change.
 */
import { readFileSync } from "fs";
import { join } from "path";

// process.cwd() is the site/ directory (where `next build` runs), so the
// repo root is one level up. Not `import.meta.url` -- Turbopack tries to
// statically resolve a `new URL(..., import.meta.url)` argument as a
// module import, and a plain relative path is not a module.
export const REPO_ROOT = join(process.cwd(), "..");
const CONTENT_MAP_PATH = join(REPO_ROOT, "redirects/content-map.json");

/** The two locales alongside EN that carry real, already-written content. */
export type Locale = "en" | "fr" | "es";
export const LOCALES: Locale[] = ["en", "fr", "es"];

/** group id -> the slug each locale actually published it under. */
export type LocaleSlugs = Partial<Record<Locale, string>>;

type ContentMapLocaleEntry = { id: number; slug: string; url: string; content_path: string } | null;

type ContentMapGroup = {
  group: string;
  type: string;
  action: string;
  destination: string;
  en: ContentMapLocaleEntry;
  fr: ContentMapLocaleEntry;
  es: ContentMapLocaleEntry;
  /**
   * Overrides `action` for one locale only. Added when the EN article in
   * g046 was absorbed into /services/generative-engine-optimization/ while
   * its FR and ES siblings had to stay published, because no FR or ES GEO
   * service page exists to absorb them into. Without this, absorbing the
   * group took all three locales down at once.
   */
  locale_actions?: Partial<Record<Locale, string>>;
};

/** The action in force for one locale: its override, else the group's. */
export function actionForLocale(g: ContentMapGroup, locale: Locale): string {
  return g.locale_actions?.[locale] ?? g.action;
}

/**
 * Groups qualifying for a live page in `locale`, for a given content-map
 * `type` ("post" or "service"; defaults to "post" for every existing
 * caller). A group's action/destination is normally set once for the whole
 * group, so a group slated to relocate to valenciamove.com or retire is
 * excluded in every locale even though its .md file may still sit in the
 * repo. `locale_actions` narrows that to a single locale where the
 * consolidation only applies to one of them.
 */
export function qualifyingGroupsForLocale(
  locale: Locale,
  type: string = "post"
): { group: string; slug: string; contentPath: string }[] {
  const contentMap = JSON.parse(readFileSync(CONTENT_MAP_PATH, "utf8")) as {
    groups: ContentMapGroup[];
  };
  const groups = contentMap.groups;
  return groups
    .filter(
      (g) =>
        g.type === type &&
        actionForLocale(g, locale) === "migrate" &&
        g.destination === "mdx" &&
        g[locale]
    )
    .map((g) => ({ group: g.group, slug: g[locale]!.slug, contentPath: g[locale]!.content_path }));
}
