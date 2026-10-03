import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Artículos sobre SEO de Mike Bastin, desde Valencia.";

export default async function Image() {
  return renderOgCard({
    title: "Artículos sobre SEO desde Valencia",
    subtitle: "SEO, visibilidad en las respuestas de la IA y nuevos mercados",
    tag: OG_TAG.es.post,
    picture: PORTRAIT,
  });
}
