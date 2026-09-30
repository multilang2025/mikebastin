import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Tarjeta Mike Bastin: Privacidad y cookies";

export default async function Image() {
  return renderServiceOgImage({ name: "Privacidad y cookies", angle: "Privacidad y cookies, Mike Bastin" });
}
