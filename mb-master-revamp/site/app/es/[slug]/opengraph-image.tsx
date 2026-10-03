import { getPostsForLocale, getPostForLocale, imageSlugFor } from "@/lib/posts";
import { topicForPost } from "@/lib/locale-topics";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, PORTRAIT, OG_TAG } from "@/lib/og-card";

// Article card: the English sibling's photograph (imageSlugFor), in the
// ValenciaMove treatment (lib/og-card.tsx). Mirrors page.tsx's params.
export function generateStaticParams() {
  return getPostsForLocale("es").map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Artículo de Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostForLocale("es", slug);
  return renderOgCard({
    title: post?.title ?? OG_TAG.es.post,
    subtitle: ogSubtitle(post?.excerpt),
    tag: topicForPost("es", slug)?.name ?? OG_TAG.es.post,
    picture: postPicture(imageSlugFor("es", slug)) ?? PORTRAIT,
  });
}
