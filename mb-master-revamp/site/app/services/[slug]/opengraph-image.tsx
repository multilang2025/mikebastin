import { SERVICES, getService } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, clusterPicture } from "@/lib/og-card";

// Mirrors page.tsx's own generateStaticParams: lead-generation has its own
// hand-built route and opengraph-image (app/services/lead-generation/),
// so it is excluded here, one route per slug. The card carries the
// cluster's scene illustration (ValenciaMove treatment, lib/og-card.tsx).
export function generateStaticParams() {
  return SERVICES.filter((s) => s.slug !== "lead-generation").map((s) => ({ slug: s.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Service from Mike Bastin, multilingual SEO and localization agency";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgCard({
    title: service ? service.cardTitle ?? service.name : "Mike Bastin",
    subtitle: ogSubtitle(service?.subhead),
    tag: service?.cluster ?? "Service",
    picture: clusterPicture(service?.cluster),
  });
}
