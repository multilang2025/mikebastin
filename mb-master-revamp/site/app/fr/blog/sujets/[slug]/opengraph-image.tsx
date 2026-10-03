import { localeTopic, localeTopics } from "@/lib/locale-topics";
import { imageSlugFor } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, PORTRAIT } from "@/lib/og-card";

// Topic card: the photograph of the topic's first article (ValenciaMove
// treatment, lib/og-card.tsx).
export function generateStaticParams() {
  return localeTopics("fr").map((t) => ({ slug: t.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Article de Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = localeTopic("fr", slug);
  const first = topic?.posts[0];
  return renderOgCard({
    title: topic?.heading ?? "Sujet",
    subtitle: ogSubtitle(topic?.blurb),
    tag: "Sujet",
    picture: (first && postPicture(imageSlugFor("fr", first))) || PORTRAIT,
  });
}
