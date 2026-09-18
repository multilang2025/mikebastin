/**
 * Shared OG card renderer for the service pages (docs/HANDOFF.md section 2,
 * "DESIGN DIRECTION (LOCKED)" and the two palette amendments, sections 22
 * and 23). Every /services/[slug]/, /services/lead-generation/ and
 * /services/ card is built from this one function so the three
 * opengraph-image.tsx routes cannot drift from each other in colour,
 * layout or font handling.
 *
 * Colours are the exact Night Swell tokens from HANDOFF.md section 23 and
 * app/globals.css (`--bg`, `--berry`, `--ink` under [data-theme="dark"]),
 * hardcoded here rather than imported, because ImageResponse's Satori
 * renderer only understands literal style values, not CSS custom
 * properties.
 *
 * next/font/local cannot run inside an opengraph-image route (it is a
 * Route Handler, not a component next/font wraps), and next/og's
 * ImageResponse only parses ttf, otf and woff font data, not the site's
 * woff2 files. See scripts/convert-og-font.mjs for the one-time conversion
 * that produced app/fonts/fraunces-og.ttf and app/fonts/inter-og.ttf, read
 * here with fs.readFile like any other predictable, request-independent
 * asset.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Service } from "@/lib/services";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Night Swell, the site's default/production theme (HANDOFF.md section 23).
const NIGHT_SWELL = {
  bg: "#0A1B28",
  ink: "#F5EFE2",
  berry: "#F2556A",
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

/**
 * Renders one blog post's cover card: a small uppercase label (cluster name
 * or "Journal", berry) above the post title (large, serif), and the same
 * understated "Mike Bastin" wordmark bottom left as the service cards, for
 * brand consistency between the two content types. Reuses the exact same
 * Night Swell palette, font pairing and layout rhythm as
 * `renderServiceOgImage` below rather than inventing a second visual
 * language for blog covers (docs/HANDOFF.md section 23).
 */
export async function renderBlogOgImage(post: { title: string; label: string }) {
  const { fraunces, inter } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NIGHT_SWELL.bg,
          padding: "80px 88px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: NIGHT_SWELL.berry,
              marginBottom: 28,
            }}
          >
            {post.label}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 64,
              fontWeight: 600,
              lineHeight: 1.14,
              color: NIGHT_SWELL.ink,
              maxWidth: "980px",
            }}
          >
            {post.title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 1,
            color: NIGHT_SWELL.ink,
            opacity: 0.72,
          }}
        >
          Mike Bastin
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Inter", data: inter, style: "normal", weight: 600 },
      ],
    }
  );
}

/**
 * Renders one service's OG card: angle (berry, small, uppercase) above the
 * service name (large, serif), and an understated "Mike Bastin" wordmark
 * bottom left. Both text fields are reused verbatim from lib/services.ts,
 * already copy-lint clean, so nothing here introduces new marketing copy.
 */
export async function renderServiceOgImage(service: Pick<Service, "name" | "angle">) {
  const { fraunces, inter } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NIGHT_SWELL.bg,
          padding: "80px 88px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: NIGHT_SWELL.berry,
              marginBottom: 28,
            }}
          >
            {service.angle}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Fraunces",
              fontSize: 78,
              fontWeight: 600,
              lineHeight: 1.08,
              color: NIGHT_SWELL.ink,
              maxWidth: "980px",
            }}
          >
            {service.name}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 1,
            color: NIGHT_SWELL.ink,
            opacity: 0.72,
          }}
        >
          Mike Bastin
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Inter", data: inter, style: "normal", weight: 600 },
      ],
    }
  );
}
