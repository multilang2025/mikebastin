import type { Metadata } from "next";
import { SITE_URL } from "@/lib/schema";

/**
 * One place that turns a page's title, description and path into the
 * full set of tags a search engine and a social platform read: canonical,
 * Open Graph and Twitter.
 *
 * Why it exists (EN audit, 27 Sep 2026): pages that set only `title` and
 * `description` inherited the root layout's `openGraph`, so 68 of them,
 * every blog post among them, shared as "Mike Bastin, multilingual search
 * consultant" with the site-wide description, no og:url, no og:site_name
 * and no canonical. And a page that did set `openGraph` without an image
 * lost the inherited card entirely, which is how the topic pages ended up
 * with no og:image at all.
 *
 * `fallbackImage` adds the default card, and only for routes with no
 * `opengraph-image.tsx` of their own. It must stay off elsewhere: tested
 * on this Next version, a config `images` array overrides the route's own
 * generated card rather than yielding to it, which put the homepage card
 * on every post.
 */
export const SITE_NAME = "Mike Bastin";

const DEFAULT_CARD = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Mike Bastin, multilingual SEO and localization from Valencia",
};

export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  languages,
  fallbackImage = false,
  ogLocale = "en_GB",
}: {
  title: string;
  description: string;
  /** Route path with leading and trailing slash, e.g. "/results/". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  languages?: Record<string, string>;
  /** Only for routes without their own opengraph-image.tsx. */
  fallbackImage?: boolean;
  /** og:locale; "fr_FR" on the French pages. */
  ogLocale?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: ogLocale,
      url,
      title,
      description,
      ...(fallbackImage ? { images: [DEFAULT_CARD] } : {}),
      ...(type === "article"
        ? { publishedTime, modifiedTime, authors: [`${SITE_URL}/`] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // No images here: Next fills twitter:image from the page's own
      // opengraph image, which is what keeps a post's card on X.
    },
  };
}
