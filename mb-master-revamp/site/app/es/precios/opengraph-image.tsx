import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Precios SEO en Valencia de Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Precios SEO en Valencia y cómo se desarrolla tu proyecto",
    subtitle: "De la consulta gratuita a la entrega mensual",
    tag: "Precios",
    picture: PORTRAIT,
  });
}
