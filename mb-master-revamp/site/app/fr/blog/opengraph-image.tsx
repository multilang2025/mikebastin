import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Articles de Mike Bastin sur le SEO international.";

export default async function Image() {
  return renderOgCard({
    title: "Articles sur le SEO international",
    subtitle: "SEO international, visibilité dans les réponses des IA et nouveaux marchés",
    tag: OG_TAG.fr.post,
    picture: PORTRAIT,
  });
}
