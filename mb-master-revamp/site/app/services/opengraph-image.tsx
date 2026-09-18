import { SERVICES } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

// Static export (output: "export") needs every route handler without
// generateStaticParams to declare it renders to a fixed file at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The index card reuses the same per-service renderer, called with a
// framing line rather than one service's own angle. The count is read
// from SERVICES.length so it can never drift stale against the real list.
export default async function Image() {
  return renderServiceOgImage({
    name: "Services",
    angle: `${SERVICES.length} services, five clusters`,
  });
}
