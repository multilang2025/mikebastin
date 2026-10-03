import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Génération de leads B2B par Mike Bastin, pour les entreprises qui exportent.";

export default async function Image() {
  return renderOgCard({
    title: "Agence de génération de leads pour les entreprises qui exportent",
    subtitle: "Des visiteurs de vos marchés étrangers aux leads qualifiés, comptés marché par marché",
    tag: OG_TAG.fr.service,
    picture: PORTRAIT,
  });
}
