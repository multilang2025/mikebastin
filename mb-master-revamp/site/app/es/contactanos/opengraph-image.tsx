import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

// Share card for this hand-built page, in its own language. Static export
// needs a route handler without generateStaticParams to be force-static.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Tarjeta Mike Bastin: Contáctanos";

export default async function Image() {
  return renderServiceOgImage({ name: "Contáctanos", angle: "Mike Bastin, desde Valencia" });
}
