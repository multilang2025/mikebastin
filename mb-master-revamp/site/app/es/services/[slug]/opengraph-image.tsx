import { getServicesForLocale, getServiceForLocale, getServiceSiblings } from "@/lib/services-locale";
import { getService } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, clusterPicture, OG_TAG } from "@/lib/og-card";

// Service card: the page's h1 and excerpt, with the scene of its English
// sibling's cluster (ValenciaMove treatment, lib/og-card.tsx). Mirrors
// page.tsx's generateStaticParams.
export function generateStaticParams() {
  return getServicesForLocale("es").map((s) => ({ slug: s.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Servicio de Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceForLocale("es", slug);
  const en = service ? getServiceSiblings(service.group).en : undefined;
  const cluster = en ? getService(en)?.cluster : undefined;
  return renderOgCard({
    title: service?.title ?? "Mike Bastin",
    subtitle: ogSubtitle(service?.excerpt),
    tag: OG_TAG.es.service,
    picture: clusterPicture(cluster),
  });
}
