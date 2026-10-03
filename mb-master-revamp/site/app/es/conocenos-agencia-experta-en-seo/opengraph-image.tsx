import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Conócenos: el equipo SEO de Mike Bastin en Valencia.";

export default async function Image() {
  return renderOgCard({
    title: "Conócenos, tu equipo SEO en Valencia",
    subtitle: "Mike Bastin dirige la estrategia y redactores nativos escriben cada idioma",
    tag: "Equipo",
    picture: PORTRAIT,
  });
}
