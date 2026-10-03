import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT, OG_TAG } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Mike Bastin Journal: multilingual SEO and AI consulting articles.";

export default async function Image() {
  return renderOgCard({
    title: "The Journal: multilingual SEO and AI consulting articles",
    subtitle: "Guides on multilingual SEO, localization and AI, grouped by subject",
    tag: OG_TAG.en.post,
    picture: PORTRAIT,
  });
}
