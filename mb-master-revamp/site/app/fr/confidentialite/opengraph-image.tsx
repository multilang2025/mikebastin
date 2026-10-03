import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Confidentialité et cookies chez Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Confidentialité et cookies",
    subtitle: "Ce que ce site collecte, pourquoi, et vos choix",
    tag: OG_TAG.fr.page,
    picture: PORTRAIT,
  });
}
