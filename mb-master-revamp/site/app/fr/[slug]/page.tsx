import { postPicture } from "@/lib/og-card";
import { imageSlugFor } from "@/lib/posts";
import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LocalePostView from "@/components/LocalePostView";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getPostsForLocale, getPostForLocale, postHreflang } from "@/lib/posts";
import { postMetaTitle } from "@/lib/seo";
import { pageMeta } from "@/lib/meta";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";

const LOCALE = "fr" as const;

// The 18 FR posts qualifying for a live page per redirects/content-map.json
// (`type: "post"`, `action: "migrate"`, `destination: "mdx"`, an `fr` entry).
// Flat at /fr/<slug>/, matching each post's own sourceUrl frontmatter and
// the pre-existing WordPress URL structure -- no /fr/blog/ segment.
export function generateStaticParams() {
  return getPostsForLocale(LOCALE).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostForLocale(LOCALE, slug);
  if (!post) return {};
  // Through pageMeta like every English route: canonical, og:url and the
  // fr_FR og:locale, and the frontmatter metaTitle when the h1 runs long.
  // The card comes from the colocated opengraph-image.tsx.
  return pageMeta({
    title: post.metaTitle ?? postMetaTitle(post.title),
    description: post.excerpt,
    path: `/fr/${post.slug}/`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.modified,
    languages: postHreflang(post.group),
    ogLocale: "fr_FR",
    cardAlt: `${post.title}. ${ogSubtitle(post.excerpt)}`,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function FrenchBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostForLocale(LOCALE, slug);
  if (!post) notFound();

  const url = `${SITE_URL}/fr/${post.slug}/`;

  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={[
          blogPostingSchema({
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.modified,
            url,
            inLanguage: "fr",
            // The English sibling's photograph the page shows, else the card.
            image: postPicture(imageSlugFor("fr", post.slug))
              ? `${SITE_URL}/images/blog/${imageSlugFor("fr", post.slug)}.webp`
              : `${url}opengraph-image`,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: `${SITE_URL}/fr/` },
            { name: "Articles", url: `${SITE_URL}/fr/blog/` },
            { name: post.title, url },
          ]),
        ]}
      />
      <LocalePostView locale="fr" post={post} />

      <SiteFooter locale="fr" />
    </main>
  );
}
