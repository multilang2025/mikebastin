import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Agence SEO internationale, dirigée par Mike Bastin, depuis Valencia.";

export default async function Image() {
  return renderOgCard({
    title: "Agence SEO internationale, dirigée par Mike Bastin",
    subtitle: "SEO international, contenus natifs et localisation de site, depuis Valencia",
    tag: OG_TAG.fr.agency,
    picture: PORTRAIT,
  });
}
