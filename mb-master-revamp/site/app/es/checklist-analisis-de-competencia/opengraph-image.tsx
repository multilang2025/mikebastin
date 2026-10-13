import { CHECKLIST_COPY } from "@/lib/checklist-copy";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, postPicture, clusterPicture, OG_TAG } from "@/lib/og-card";

// The hand-built cluster pillar gets the same photo card as the posts
// beside it on the journal index (ValenciaMove treatment, lib/og-card.tsx).
const SLUG = "competitor-analysis-traffic-checklist";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "La checklist de análisis de competencia y tráfico, un artículo de Mike Bastin";

export default async function Image() {
  return renderOgCard({
    title: CHECKLIST_COPY.es.heading,
    subtitle: ogSubtitle(CHECKLIST_COPY.es.description),
    tag: OG_TAG.es.post,
    picture: postPicture(SLUG) ?? clusterPicture("search"),
  });
}
