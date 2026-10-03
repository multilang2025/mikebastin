import { getTopics } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, PORTRAIT } from "@/lib/og-card";

// Topic pages set their own openGraph, which drops the inherited card, so
// each gets one of its own (EN meta audit, 27 Sep 2026), showing the
// photograph of the topic's first post (ValenciaMove treatment).
export function generateStaticParams() {
  return getTopics().map((t) => ({ slug: t.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Journal topic from Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopics().find((t) => t.slug === slug);
  const first = topic?.pillar?.slug ?? topic?.posts[0]?.slug;
  return renderOgCard({
    title: topic?.heading ?? "Journal",
    subtitle: ogSubtitle(topic?.blurb),
    tag: "Journal topic",
    picture: (first && postPicture(first)) || PORTRAIT,
  });
}
