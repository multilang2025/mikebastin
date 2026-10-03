import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contact Mike Bastin, a multilingual SEO agency in Valencia.";

export default async function Image() {
  return renderOgCard({
    title: "Contact a multilingual SEO agency in Valencia",
    subtitle: "Tell us which language you want selling next",
    tag: "Contact",
    picture: PORTRAIT,
  });
}
