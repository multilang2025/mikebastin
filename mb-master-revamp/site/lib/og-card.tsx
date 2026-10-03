/**
 * Every social card on the site, in the ValenciaMove treatment (owner,
 * 3 Oct 2026: "apply the same OG treatment as on valenciamove.com"):
 * the page's own picture behind a navy gradient that runs from solid on
 * the left to clear on the right, the brand set small, letter-spaced and
 * underlined top left, a large title with a one-line subtitle under it,
 * and a raspberry pill naming the section beside the domain at the foot.
 *
 * Three kinds of picture, chosen per route:
 * - "photo": a post's or a client site's photograph, full bleed.
 * - "art": a transparent scene illustration, drawn whole on the right.
 * - "portrait": Mike's cut-out, standing on the right (home, about,
 *   contact, pricing, indexes), the agency recognised through its lead.
 * With no picture the card is the gradient alone, never a broken image.
 *
 * Satori (next/og) reads PNG and JPEG but not WebP, so pictures are read
 * from public/ through sharp and passed as data URLs. ImageResponse can
 * only write PNG; scripts/og-to-jpeg.mjs re-encodes every exported card
 * as JPEG after the build (the photographs made PNG cards heavy), which
 * is why each route declares image/jpeg.
 *
 * Colours are literal (Satori cannot read CSS variables): Night Swell navy
 * and cream, the dark-theme raspberry for the brand line and the
 * light-theme raspberry under white pill text, for contrast.
 *
 * Fonts: next/og parses ttf/otf/woff only, so app/fonts/*-og.ttf are the
 * converted faces (scripts/convert-og-font.mjs).
 */
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const OG_SIZE = { width: 1200, height: 630 };
/** Declared type of the exported file, after scripts/og-to-jpeg.mjs. */
export const OG_CONTENT_TYPE = "image/jpeg";

const C = {
  navy: "#0A1B28",
  cream: "#F5EFE2",
  brand: "#F2556A",
  pill: "#C42640",
};

let fontsPromise: Promise<{ fraunces: ArrayBuffer; inter: ArrayBuffer }> | null = null;
function loadFonts() {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      readFile(join(process.cwd(), "app/fonts/fraunces-og.ttf")),
      readFile(join(process.cwd(), "app/fonts/inter-og.ttf")),
    ]).then(([fraunces, inter]) => ({
      fraunces: Uint8Array.from(fraunces).buffer,
      inter: Uint8Array.from(inter).buffer,
    }));
  }
  return fontsPromise;
}

export type OgPicture = { kind: "photo" | "art" | "portrait"; src: string };

/** A public/ path (query string ignored) as a data URL Satori can draw. */
async function pictureData(p: OgPicture): Promise<string | null> {
  const file = join(process.cwd(), "public", p.src.split("?")[0]);
  if (!existsSync(file)) return null;
  const img = sharp(file);
  const buf =
    p.kind === "photo"
      ? await img.resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 88 }).toBuffer()
      : await img.resize({ width: p.kind === "portrait" ? 540 : 470, withoutEnlargement: false }).png().toBuffer();
  return `data:image/${p.kind === "photo" ? "jpeg" : "png"};base64,${buf.toString("base64")}`;
}

/**
 * First sentence, cut at a word under `max` characters. A description that
 * opens on its keyword and a colon ("SEO local en Valencia: tu ficha...")
 * drops that lead-in, since the title above already says it.
 */
export function ogSubtitle(text: string | undefined, max = 92): string {
  if (!text) return "";
  let first = text.split(/(?<=[.!?])\s/)[0].replace(/[.!]$/, "");
  const lead = /^[^:]{3,48}\s?:\s/.exec(first);
  if (lead && first.length - lead[0].length > 30) {
    first = first.slice(lead[0].length);
    first = first.charAt(0).toUpperCase() + first.slice(1);
  }
  if (first.length <= max) return first;
  const cut = first.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

export async function renderOgCard({
  title,
  subtitle,
  tag,
  picture,
}: {
  title: string;
  subtitle?: string;
  tag: string;
  picture?: OgPicture;
}) {
  const { fraunces, inter } = await loadFonts();
  const data = picture ? await pictureData(picture) : null;
  const kind = data ? picture!.kind : null;
  const size = title.length <= 34 ? 70 : title.length <= 60 ? 60 : title.length <= 85 ? 52 : 46;
  const textWidth = kind === "photo" || !kind ? 780 : 640;
  const titleSize = kind === "photo" || !kind ? size : Math.min(size, 56);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.navy, fontFamily: "Inter" }}>
        {kind === "photo" && (
          <img src={data!} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        {kind === "art" && (
          <img src={data!} width={470} style={{ position: "absolute", right: 40, top: 110, width: 470 }} />
        )}
        {kind === "portrait" && (
          <img src={data!} width={540} style={{ position: "absolute", right: 0, bottom: 0, width: 540 }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              kind === "photo"
                ? "linear-gradient(90deg, rgba(10,27,40,0.96) 0%, rgba(10,27,40,0.86) 45%, rgba(10,27,40,0.45) 100%)"
                : "linear-gradient(90deg, rgba(10,27,40,1) 0%, rgba(10,27,40,0.9) 44%, rgba(10,27,40,0) 60%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "76px 80px 56px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, letterSpacing: 7, color: C.brand }}>MIKE BASTIN</div>
            <div style={{ display: "flex", width: 120, height: 5, borderRadius: 3, background: C.brand, marginTop: 18 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: textWidth }}>
            <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: titleSize, fontWeight: 600, lineHeight: 1.1, color: C.cream }}>
              {title}
            </div>
            {subtitle ? (
              <div style={{ display: "flex", fontSize: 27, lineHeight: 1.4, color: C.cream, opacity: 0.86, marginTop: 20 }}>
                {subtitle}
              </div>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                padding: "13px 30px",
                borderRadius: 999,
                background: C.pill,
                color: "#FFFFFF",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
            <div style={{ display: "flex", marginLeft: 26, fontSize: 24, color: C.cream, opacity: 0.9 }}>mikebastin.com</div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Inter", data: inter, style: "normal", weight: 600 },
      ],
    },
  );
}

/** The portrait used by every page card that has no picture of its own. */
export const PORTRAIT: OgPicture = { kind: "portrait", src: "/images/mike-bastin-portrait-760.webp" };

/** A post's (or a French or Spanish post's English sibling's) photograph. */
export function postPicture(imageSlug: string): OgPicture | undefined {
  const src = `/images/blog/${imageSlug}.webp`;
  return existsSync(join(process.cwd(), "public", src)) ? { kind: "photo", src } : undefined;
}

/** Cluster scene for a service card, by the cluster name in lib/services.ts. */
export function clusterPicture(cluster: string | undefined): OgPicture | undefined {
  const key = (cluster ?? "").toLowerCase();
  const scene = key.includes("lead")
    ? "svc-lead-generation"
    : key.includes("local")
      ? "svc-localization"
      : key.includes("ai")
        ? "svc-ai"
        : key.includes("tech")
          ? "svc-technical"
          : "svc-search";
  return { kind: "art", src: `/images/scenes/${scene}.webp` };
}

/** Section tags, per locale. */
export const OG_TAG = {
  en: { post: "Journal", service: "Service", work: "Case study", agency: "Multilingual SEO", page: "Mike Bastin" },
  fr: { post: "Article", service: "Service", work: "Étude de cas", agency: "SEO international", page: "Mike Bastin" },
  es: { post: "Artículo", service: "Servicio", work: "Caso de cliente", agency: "SEO en Valencia", page: "Mike Bastin" },
} as const;
