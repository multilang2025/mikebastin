import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Carte Mike Bastin : Confidentialité et cookies";

export default async function Image() {
  return renderServiceOgImage({ name: "Confidentialité et cookies", angle: "Confidentialité et cookies, Mike Bastin" });
}
