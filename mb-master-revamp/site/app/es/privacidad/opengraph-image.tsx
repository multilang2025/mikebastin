import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Privacidad y cookies en Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Privacidad y cookies",
    subtitle: "Qué recoge este sitio, por qué y qué puedes decidir",
    tag: OG_TAG.es.page,
    picture: PORTRAIT,
  });
}
