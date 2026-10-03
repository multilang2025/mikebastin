import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Client results and numbers: live Search Console figures from five sites Mike Bastin runs search for.";

export default async function Image() {
  return renderOgCard({
    title: "Client results and numbers",
    subtitle: "Live Search Console figures from five sites we run search for",
    tag: "Results",
    picture: PORTRAIT,
  });
}
