import { getTopics } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// Topic pages set their own openGraph, which drops the inherited card, so
// each gets one of its own (EN meta audit, 27 Sep 2026: all seven shipped
// with no og:image).
export function generateStaticParams() {
  return getTopics().map((t) => ({ slug: t.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Journal topic card from Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopics().find((t) => t.slug === slug);
  return renderBlogOgImage({ title: topic?.name ?? "Journal", label: "Journal topic" });
}
