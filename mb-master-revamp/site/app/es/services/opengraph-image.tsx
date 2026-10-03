import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Servicios de marketing digital en Valencia de Mike Bastin.";

export default async function Image() {
  return renderOgCard({
    title: "Servicios de marketing digital en Valencia, medidos en clientes",
    subtitle: "SEO, Google Ads, traducción jurada y consultoría de IA",
    tag: "Servicios",
    picture: PORTRAIT,
  });
}
