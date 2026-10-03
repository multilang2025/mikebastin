import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Tarifs et déroulement d’une mission SEO avec Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Tarifs et déroulement d’une mission SEO",
    subtitle: "Consultation gratuite, périmètre écrit, livraison mensuelle",
    tag: "Tarifs",
    picture: PORTRAIT,
  });
}
