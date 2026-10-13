import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Resultados y cifras de clientes: datos reales de Search Console de cinco webs que posiciona Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Resultados y cifras de clientes",
    subtitle: "Datos reales de Search Console de cinco webs que posicionamos",
    tag: "Resultados",
    picture: PORTRAIT,
  });
}
