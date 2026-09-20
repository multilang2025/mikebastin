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
};

/**
 * Groups qualifying for a live page in `locale`, for a given content-map
 * `type` ("post" or "service"; defaults to "post" for every existing
 * caller). A group's action/destination is set once for the whole group,
 * not per locale (see content-map.json), so a group slated to relocate to
 * valenciamove.com or retire is excluded in every locale even though its
 * .md file may still sit in the repo.
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
    .filter((g) => g.type === type && g.action === "migrate" && g.destination === "mdx" && g[locale])
    .map((g) => ({ group: g.group, slug: g[locale]!.slug, contentPath: g[locale]!.content_path }));
}
