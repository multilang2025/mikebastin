import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Global SEO services for companies selling across markets, from Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Global SEO services for companies selling across markets",
    subtitle: "Multilingual SEO, localization, paid search and AI consulting, run by one team",
    tag: "Services",
    picture: PORTRAIT,
  });
}
