import { getService } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, clusterPicture } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "B2B lead generation services for companies selling abroad, from Mike Bastin";

export default async function Image() {
  const service = getService("lead-generation")!;
  return renderOgCard({
    title: service.cardTitle ?? service.name,
    subtitle: ogSubtitle(service.subhead),
    tag: service.cluster,
    picture: clusterPicture(service.cluster),
  });
}
