import { getService } from "@/lib/services";
import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

const service = getService("lead-generation")!;

// Static export (output: "export") needs every route handler without
// generateStaticParams to declare it renders to a fixed file at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderServiceOgImage(service);
}
