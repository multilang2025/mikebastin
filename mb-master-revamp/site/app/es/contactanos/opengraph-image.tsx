import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, PORTRAIT } from "@/lib/og-card";

// ValenciaMove card treatment (owner, 3 Oct 2026): see lib/og-card.tsx.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Contacta con Mike Bastin, agencia SEO en Valencia.";

export default async function Image() {
  return renderOgCard({
    title: "Contacta con nuestra agencia SEO en Valencia",
    subtitle: "Cuéntanos tu proyecto y te respondemos en un día laborable",
    tag: "Contacto",
    picture: PORTRAIT,
  });
}
