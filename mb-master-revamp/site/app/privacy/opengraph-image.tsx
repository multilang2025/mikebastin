import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Card Mike Bastin: Privacy and cookies";

export default async function Image() {
  return renderServiceOgImage({ name: "Privacy and cookies", angle: "Privacy and cookies, Mike Bastin" });
}
