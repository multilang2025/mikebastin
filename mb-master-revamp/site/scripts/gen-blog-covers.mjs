/**
 * Pre-renders a static cover image for every live blog post into
 * public/images/blog/<slug>.png, at authoring time (run by hand, not part
 * of `next build`).
 *
 * Why a script instead of just the opengraph-image.tsx routes: Next's
 * file-convention opengraph-image routes emit an extension-less file
 * (out/blog/<slug>/opengraph-image, no `.png`) under `output: "export"`.
 * A plain static file server has no extension to infer a MIME type from,
 * so it serves that file as `application/octet-stream`
 * (verified locally with `python3 -m http.server` against `out/`, which
 * reported `Content-type: application/octet-stream` for both this
 * project's and the existing service-page opengraph-image output).
 * Browsers do not reliably render an `<img>` whose response header claims
 * a generic binary type, so that path is fine for the `og:image` meta tag
 * (crawlers fetch the URL directly and inspect the bytes) but not safe to
 * point a visible `<img src>` at. This script instead renders the exact
 * same design to a real `.png` file with a real extension, committed under
 * `public/images/blog/`, which Next serves byte-for-byte like any other
 * static asset with the correct `Content-Type: image/png`.
 *
 * The opengraph-image.tsx routes (app/blog/opengraph-image.tsx,
 * app/blog/[slug]/opengraph-image.tsx) still exist and still run at build
 * time -- they own the `og:image`/`twitter:image` meta tags, which is a
 * separate concern from the visible cards this script feeds.
 *
 * Reuses `renderBlogOgImage` from lib/og-card.tsx (the same function the
 * opengraph-image.tsx routes call) so the two can never visually drift.
 * `lib/og-card.tsx` is a .tsx module using JSX, and Node cannot run this
 * script through a JSX transform without a bundler, so this script imports
 * it via `next/dist/compiled` is not an option either -- instead it
 * duplicates the tiny amount of JSX as `h()` calls building the same plain
 * element-object shape JSX compiles down to. If the visual design in
 * lib/og-card.tsx changes, mirror the change here.
 *
 * Run with: node scripts/gen-blog-covers.mjs
 * Requires `next` to be installed (imports next/og.js) and must be run
 * from the site/ directory so that resolves.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { ImageResponse } from "next/og.js";

const SITE_ROOT = process.cwd();
const REPO_ROOT = join(SITE_ROOT, "..");
const CONTENT_MAP_PATH = join(REPO_ROOT, "redirects/content-map.json");
const OUT_DIR = join(SITE_ROOT, "public/images/blog");

const HAND_BUILT_SLUGS = ["competitor-analysis-traffic-checklist"];

const NIGHT_SWELL = { bg: "#0A1B28", ink: "#F5EFE2", berry: "#F2556A" };
const SIZE = { width: 1200, height: 630 };

// Mirrors CLUSTERS in lib/posts.ts closely enough for cover labels: only
// the post-slug -> cluster-name mapping is needed here, not the pillar or
// related-service wiring the site itself uses. Kept in sync by hand; if
// lib/posts.ts's CLUSTERS list changes, update this one too.
const CLUSTERS = [
  {
    name: "Multilingual SEO",
    posts: [
      "best-practices-for-multilingual-seo",
      "technical-seo-for-multilingual-websites",
      "multilingual-keyword-research",
      "optimising-multilingual-website-content",
      "common-mistakes-to-avoid-when-localising-your-website",
      "building-a-global-brand",
      "user-interface-localisation-can-transform-your-global-reach",
      "localisation-testing-tools",
      "google-analytics-international-marketing-limits",
      "alternatives-to-google-analytics",
    ],
  },
  {
    name: "Language markets",
    posts: [
      "english-to-french-translation-services",
      "german-seo-best-practices",
      "german-seo-content-localisation",
      "technical-seo-considerations-for-german-websites",
      "spanish-on-page-seo",
      "spanish-keyword-localisation",
      "technical-seo-for-spanish-search-engines",
      "content-optimisation-for-spanish-users",
      "spanish-seo-markets",
      "link-building-in-spain",
      "seo-in-belgium",
    ],
  },
  {
    name: "AI and the future of search",
    posts: [
      "generative-engine-optimization",
      "search-everywhere-strategy",
      "future-of-seo",
      "how-ai-is-revolutionising-seo-strategies",
      "how-ai-is-transforming-translation-and-localisation",
      "how-to-use-ai-and-machine-translation-tools",
      "ai-powered-marketing",
      "conversational-ai-chatbots-business",
      "llms-beyond-giants-hidden-ai-models",
      "prompt-engineers",
      "optimising-your-website-for-voice-search",
    ],
  },
  {
    name: "SEO fundamentals",
    posts: [
      "competitor-analysis-traffic-checklist",
      "competitor-analysis",
      "technical-seo-audit-checklist",
      "internal-linking-tools",
      "what-is-search-intent-mapping",
      "chrome-extensions-for-seo",
      "link-selling-and-link-buying-platforms",
      "how-to-create-a-targeted-content-strategy",
      "how-to-promote-your-local-business-on-google-maps",
      "law-firm-seo-services",
    ],
  },
  {
    name: "Language industry",
    posts: ["chrome-extensions-for-translators"],
  },
  {
    name: "Multilingual lead generation",
    posts: [
      "email-marketing-hacks-boosting-open-rates-and-conversions",
      "most-popular-marketing-strategies",
      "digital-marketing-advisor",
      "french-ppc-campaign",
    ],
  },
];

// Matches lib/posts.ts's UNCATEGORISED constant: the twelve posts
// CONTENT-ARCHITECTURE.md's cluster map does not place anywhere.
const UNCATEGORISED = "Uncategorised";

function clusterFor(slug) {
  return CLUSTERS.find((c) => c.posts.includes(slug))?.name ?? UNCATEGORISED;
}

function qualifyingEnGroups() {
  const contentMap = JSON.parse(readFileSync(CONTENT_MAP_PATH, "utf8"));
  return contentMap.groups
    .filter((g) => g.type === "post" && g.action === "migrate" && g.destination === "mdx" && g.en)
    .map((g) => ({ slug: g.en.slug, contentPath: g.en.content_path }))
    .filter((g) => !HAND_BUILT_SLUGS.includes(g.slug));
}

/** Builds the same plain element-object shape JSX compiles to. */
function h(type, props, ...children) {
  const flat = children.flat(Infinity).filter((c) => c !== null && c !== undefined && c !== false);
  return { type, key: null, props: { ...props, children: flat.length === 1 ? flat[0] : flat } };
}

async function loadFonts() {
  const [fraunces, inter] = await Promise.all([
    readFile(join(SITE_ROOT, "app/fonts/fraunces-og.ttf")),
    readFile(join(SITE_ROOT, "app/fonts/inter-og.ttf")),
  ]);
  return {
    fraunces: Uint8Array.from(fraunces).buffer,
    inter: Uint8Array.from(inter).buffer,
  };
}

/** Mirrors renderBlogOgImage in lib/og-card.tsx. Keep the two in sync. */
function buildElement({ title, label }) {
  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: NIGHT_SWELL.bg,
        padding: "80px 88px",
        fontFamily: "Inter",
      },
    },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: NIGHT_SWELL.berry,
            marginBottom: 28,
          },
        },
        label
      ),
      h(
        "div",
        {
          style: {
            display: "flex",
            fontFamily: "Fraunces",
            fontSize: 64,
            fontWeight: 600,
            lineHeight: 1.14,
            color: NIGHT_SWELL.ink,
            maxWidth: "980px",
          },
        },
        title
      )
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: 1,
          color: NIGHT_SWELL.ink,
          opacity: 0.72,
        },
      },
      "Mike Bastin"
    )
  );
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const { fraunces, inter } = await loadFonts();
  const groups = qualifyingEnGroups();

  let written = 0;
  for (const { slug, contentPath } of groups) {
    const raw = readFileSync(join(REPO_ROOT, contentPath), "utf8");
    const { data } = matter(raw);
    const title = data.title;
    if (!title) {
      console.warn(`skip ${slug}: no title in frontmatter`);
      continue;
    }

    const element = buildElement({ title, label: clusterFor(slug) });
    const res = new ImageResponse(element, {
      ...SIZE,
      fonts: [
        { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
        { name: "Inter", data: inter, style: "normal", weight: 600 },
      ],
    });
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(join(OUT_DIR, `${slug}.png`), buf);
    written += 1;
  }

  // Also cover the Journal index card itself, same treatment as
  // app/blog/opengraph-image.tsx.
  const indexElement = buildElement({
    title: "Journal",
    label: `${groups.length} posts, six clusters`,
  });
  const indexRes = new ImageResponse(indexElement, {
    ...SIZE,
    fonts: [
      { name: "Fraunces", data: fraunces, style: "normal", weight: 600 },
      { name: "Inter", data: inter, style: "normal", weight: 600 },
    ],
  });
  writeFileSync(join(OUT_DIR, "index.png"), Buffer.from(await indexRes.arrayBuffer()));

  const files = readdirSync(OUT_DIR).length;
  console.log(`Wrote ${written} post covers + 1 index cover (${files} files total in ${OUT_DIR}).`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
