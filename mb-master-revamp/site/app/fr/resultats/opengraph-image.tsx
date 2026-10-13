import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Résultats et chiffres clients : les chiffres Search Console réels de cinq sites dont Mike Bastin gère le référencement.";

export default async function Image() {
  return renderOgCard({
    title: "Résultats et chiffres clients",
    subtitle: "Les chiffres Search Console réels de cinq sites que nous référençons",
    tag: "Résultats",
    picture: PORTRAIT,
  });
}
