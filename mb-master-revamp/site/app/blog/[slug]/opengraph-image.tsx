import { getPosts, getPost, HAND_BUILT_SLUGS } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, clusterPicture, OG_TAG } from "@/lib/og-card";

// Mirrors page.tsx's own generateStaticParams: the hand-built pillar page
// has its own route at app/competitor-analysis-traffic-checklist/, so it is
// excluded here for the same reason, one route per slug. The card is the
// post's own photograph in the ValenciaMove treatment (lib/og-card.tsx).
export function generateStaticParams() {
  return getPosts()
    .filter((p) => !HAND_BUILT_SLUGS.includes(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Article from the Mike Bastin journal on multilingual SEO, localization and AI";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const tag = post?.cluster && post.cluster !== "uncategorised" ? post.cluster : OG_TAG.en.post;
  return renderOgCard({
    title: post?.title ?? "Journal",
    subtitle: ogSubtitle(post?.excerpt),
    tag,
    picture: postPicture(slug) ?? clusterPicture(post?.cluster),
  });
}
