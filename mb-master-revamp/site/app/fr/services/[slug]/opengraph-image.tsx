import { getServicesForLocale, getServiceForLocale } from "@/lib/services-locale";
import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

// French service card: the page's own short name, or its h1, under a
// French angle line. Mirrors page.tsx's generateStaticParams.
export function generateStaticParams() {
  return getServicesForLocale("fr").map((s) => ({ slug: s.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Carte de service Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceForLocale("fr", slug);
  return renderServiceOgImage({
    name: service ? service.name ?? service.title : "Mike Bastin",
    angle: "SEO international, Mike Bastin",
  });
}
