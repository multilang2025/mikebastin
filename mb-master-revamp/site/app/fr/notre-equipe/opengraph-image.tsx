import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Notre équipe\u00a0: Mike Bastin à Valencia et des spécialistes natifs.";

export default async function Image() {
  return renderOgCard({
    title: "Notre équipe",
    subtitle: "Mike Bastin à Valencia, et des spécialistes natifs du réseau BeTranslated",
    tag: "Équipe",
    picture: PORTRAIT,
  });
}
