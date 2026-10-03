import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contacter Mike Bastin, agence SEO internationale.";

export default async function Image() {
  return renderOgCard({
    title: "Contacter une agence SEO internationale",
    subtitle: "Dites-nous dans quelle langue vous voulez vendre ensuite",
    tag: "Contact",
    picture: PORTRAIT,
  });
}
