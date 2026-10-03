import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "How a multilingual SEO engagement with Mike Bastin runs.";

export default async function Image() {
  return renderOgCard({
    title: "How a multilingual SEO engagement runs",
    subtitle: "The free consultation, the written scope, monthly delivery and reporting per market",
    tag: "How we work",
    picture: PORTRAIT,
  });
}
