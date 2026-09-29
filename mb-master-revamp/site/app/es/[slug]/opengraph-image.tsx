import { getPostsForLocale, getPostForLocale } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// Spanish article card. Mirrors page.tsx's generateStaticParams.
export function generateStaticParams() {
  return getPostsForLocale("es").map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Tarjeta de artículo de Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostForLocale("es", slug);
  return renderBlogOgImage({ title: post?.title ?? "Blog", label: "Blog" });
}
