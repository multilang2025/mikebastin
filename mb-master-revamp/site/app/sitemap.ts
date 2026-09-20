import type { MetadataRoute } from "next";
import { absolute, getSiteUrls } from "@/lib/site-urls";

/**
 * sitemap.xml, built from lib/site-urls.ts, the same list the HTML sitemap
 * at /sitemap/ renders. The site had no sitemap at all until now.
 *
 * `output: "export"` writes this to out/sitemap.xml at build, so it is a
 * static file like everything else here: no route handler runs in
 * production.
 *
 * `alternates.languages` carries the hreflang siblings a translation group
 * actually published, from the same helpers the pages use for their own
 * `<head>`. A group with a single locale gets no entry rather than a
 * self-referential one.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSiteUrls().map((e) => ({
    url: absolute(e.path),
    ...(e.lastModified ? { lastModified: new Date(e.lastModified) } : {}),
    ...(e.languages ? { alternates: { languages: e.languages } } : {}),
  }));
}
