import { getPosts, getPost, HAND_BUILT_SLUGS } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// Mirrors page.tsx's own generateStaticParams: the hand-built pillar page
// has its own route at app/competitor-analysis-traffic-checklist/, so it is
// excluded here for the same reason, one route per slug.
export function generateStaticParams() {
  return getPosts()
    .filter((p) => !HAND_BUILT_SLUGS.includes(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderBlogOgImage({
    title: post?.title ?? "Journal",
    label: post?.cluster ?? "Journal",
  });
}
