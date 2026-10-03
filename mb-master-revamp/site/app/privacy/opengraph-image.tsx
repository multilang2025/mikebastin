import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Privacy and cookies at Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Privacy and cookies",
    subtitle: "What this site collects, why, and the choices you have",
    tag: OG_TAG.en.page,
    picture: PORTRAIT,
  });
}
