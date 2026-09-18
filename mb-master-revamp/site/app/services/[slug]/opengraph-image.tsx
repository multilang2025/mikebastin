import { SERVICES, getService } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

// Mirrors page.tsx's own generateStaticParams: lead-generation has its own
// hand-built route and opengraph-image (app/services/lead-generation/),
// so it is excluded here for the same reason page.tsx excludes it, one
// route per slug.
export function generateStaticParams() {
  return SERVICES.filter((s) => s.slug !== "lead-generation").map((s) => ({ slug: s.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderServiceOgImage(
    service ?? { name: "Mike Bastin", angle: "Multilingual search consultant" }
  );
}
