import { OG_SIZE, OG_CONTENT_TYPE, renderServiceOgImage } from "@/lib/og-card";

// Sitewide fallback OG card (the DEFAULT_OG_IMAGE valenciamove.com's
// localized-metadata.ts builds for any page without its own image).
// app/layout.tsx's `metadata.openGraph` had no `images` field at all before
// this, so every page shared anywhere rendered with a blank social card.
//
// This root file covers everything: homepage, blog, projects, and any
// other route that has not been given its own opengraph-image.tsx. It does
// NOT leak into /services/, because Next.js's file-convention metadata
// resolves the closest opengraph-image in the segment tree, and every
// service route already has its own (app/services/opengraph-image.tsx,
// app/services/[slug]/opengraph-image.tsx,
// app/services/lead-generation/opengraph-image.tsx). Verified against the
// static export's <meta property="og:image"> for a service page, which
// points at that page's own generated image, not this one.
// Static export (output: "export") needs every route handler without
// generateStaticParams to declare it renders to a fixed file at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderServiceOgImage({
    name: "Mike Bastin",
    angle: "Multilingual search consultant",
  });
}
