import { SERVICES } from "@/lib/services";
import { PROJECTS } from "@/lib/projects";
import {
  getPosts,
  getPostsForLocale,
  getTopics,
  postHreflang,
  postPath,
} from "@/lib/posts";
import {
  getServicesForLocale,
  serviceGroupForEnSlug,
  serviceHreflang,
  servicePath,
} from "@/lib/services-locale";
import { SITE_URL } from "@/lib/schema";

/**
 * Every indexable URL on the site, in one place.
 *
 * Both sitemaps read this: `app/sitemap.ts` turns it into sitemap.xml for
 * crawlers, and `app/sitemap/page.tsx` renders it for people. Two lists
 * that are meant to say the same thing will not stay the same for long if
 * they are written twice, which this project has now proved twice in a
 * day: `gen-blog-covers.mjs` mirroring `lib/posts.ts`'s clusters by hand,
 * and the legacy Rank Math rows derived from `content-map.json` instead of
 * from the generated `.htaccess`.
 *
 * Derived from the same modules the routes themselves use, never typed
 * out, so a new service or post appears in both sitemaps by existing.
 *
 * Deliberately excluded:
 *   - /404/ and the not-found route, which carry `noindex`
 *   - /contact/thanks/ and /contact/problem/, post-submit pages that also
 *     carry `noindex`. A sitemap is a list of pages worth indexing, and
 *     asking a crawler to fetch one we have told it to ignore is noise.
 */

export type UrlEntry = {
  /** Site-relative, always with a trailing slash. */
  path: string;
  /** ISO date, when the content carries one. */
  lastModified?: string;
  /** Section heading on the HTML sitemap. */
  section: string;
  /** Link label on the HTML sitemap. */
  label: string;
  /** hreflang siblings, when the translation group has any. */
  languages?: Record<string, string>;
};

const STATIC: { path: string; section: string; label: string }[] = [
  { path: "/", section: "Main pages", label: "Home" },
  { path: "/services/", section: "Main pages", label: "Services" },
  { path: "/blog/", section: "Main pages", label: "Journal" },
  { path: "/results/", section: "Main pages", label: "Results" },
  { path: "/how-i-work/", section: "Main pages", label: "How we work" },
  { path: "/contact/", section: "Main pages", label: "Contact" },
  { path: "/sitemap/", section: "Main pages", label: "Sitemap" },
  {
    path: "/competitor-analysis-traffic-checklist/",
    section: "Main pages",
    label: "The competitor analysis and traffic checklist",
  },
];

export function getSiteUrls(): UrlEntry[] {
  const out: UrlEntry[] = [...STATIC];

  // Services. lead-generation has its own hand-built route rather than
  // going through /services/[slug]/, but its URL is the same shape, so it
  // needs no special case here.
  for (const s of SERVICES) {
    // Only 10 of the 21 EN service slugs have a qualifying translation
    // group; the rest are consolidated pages with no group of their own,
    // and serviceGroupForEnSlug returns undefined for those rather than
    // inventing one (lib/services-locale.ts says so in its own comment).
    const group = serviceGroupForEnSlug(s.slug);
    out.push({
      path: `/services/${s.slug}/`,
      section: "Services",
      label: s.name,
      languages: group ? serviceHreflang(group) : undefined,
    });
  }

  for (const t of getTopics()) {
    out.push({
      path: `/blog/topics/${t.slug}/`,
      section: "Journal topics",
      label: t.name,
    });
  }

  // The hand-built checklist is already in STATIC and is excluded from
  // the /blog/[slug]/ route, so getPosts() does not double it.
  for (const p of getPosts()) {
    out.push({
      path: postPath("en", p.slug),
      lastModified: p.modified || p.date,
      section: "Journal",
      label: p.title,
      languages: postHreflang(p.group),
    });
  }

  for (const pr of PROJECTS) {
    out.push({
      path: `/projects/${pr.slug}/`,
      section: "Work",
      label: pr.name,
    });
  }

  for (const locale of ["fr", "es"] as const) {
    const heading = locale === "fr" ? "French" : "Spanish";
    for (const p of getPostsForLocale(locale)) {
      out.push({
        path: postPath(locale, p.slug),
        lastModified: p.modified || p.date,
        section: heading,
        label: p.title,
        languages: postHreflang(p.group),
      });
    }
    for (const sv of getServicesForLocale(locale)) {
      out.push({
        path: servicePath(locale, sv.slug),
        lastModified: sv.modified || sv.date,
        section: `${heading} services`,
        label: sv.title,
        languages: serviceHreflang(sv.group),
      });
    }
  }

  return out;
}

/** Absolute URL for an entry, for sitemap.xml and canonicals. */
export function absolute(path: string): string {
  return `${SITE_URL}${path}`;
}

/** Section order on the HTML sitemap, so it reads as a site rather than a dump. */
export const SECTION_ORDER = [
  "Main pages",
  "Services",
  "Journal topics",
  "Journal",
  "Work",
  "French",
  "French services",
  "Spanish",
  "Spanish services",
];
