import { getPostsForLocale, getPostForLocale } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// French article card. Mirrors page.tsx's generateStaticParams.
export function generateStaticParams() {
  return getPostsForLocale("fr").map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Carte d’article Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostForLocale("fr", slug);
  return renderBlogOgImage({ title: post?.title ?? "Articles", label: "Articles" });
}
