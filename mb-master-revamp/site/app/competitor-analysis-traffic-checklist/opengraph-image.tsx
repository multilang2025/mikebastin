import { getPostRecord } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, clusterPicture, OG_TAG } from "@/lib/og-card";

// The hand-built cluster pillar gets the same photo card as the posts
// beside it on the journal index (ValenciaMove treatment, lib/og-card.tsx).
const SLUG = "competitor-analysis-traffic-checklist";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The competitor analysis and traffic checklist, from the Mike Bastin journal";

export default async function Image() {
  const post = getPostRecord(SLUG);
  return renderOgCard({
    title: "The competitor analysis and traffic checklist",
    subtitle: ogSubtitle(post?.excerpt),
    tag: OG_TAG.en.post,
    picture: postPicture(SLUG) ?? clusterPicture("search"),
  });
}
