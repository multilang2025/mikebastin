import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Services SEO de Mike Bastin pour les entreprises qui vendent à l’international.";

export default async function Image() {
  return renderOgCard({
    title: "Services SEO pour les entreprises qui vendent à l’international",
    subtitle: "Référencement par marché, localisation et publicité multilingue",
    tag: "Services",
    picture: PORTRAIT,
  });
}
