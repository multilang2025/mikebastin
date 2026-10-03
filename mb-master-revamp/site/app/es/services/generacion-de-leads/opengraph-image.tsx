import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Generación de leads B2B en Valencia, de Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Generación de leads B2B en Valencia para empresas que venden fuera",
    subtitle: "Tus visitas de cada mercado, convertidas en consultas cualificadas",
    tag: OG_TAG.es.service,
    picture: PORTRAIT,
  });
}
