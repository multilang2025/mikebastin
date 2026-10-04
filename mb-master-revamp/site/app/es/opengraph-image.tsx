import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Agencia SEO internacional en Valencia que convierte búsquedas en clientes: Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Agencia SEO internacional en Valencia que convierte búsquedas en clientes",
    subtitle: "Te encuentran en castellano e inglés, en tu ciudad y en cada mercado donde vendes",
    tag: OG_TAG.es.agency,
    picture: PORTRAIT,
  });
}
