/**
 * Converts app/fonts/fraunces.woff2 and app/fonts/inter.woff2 into the flat,
 * static TTFs the OG card routes actually read
 * (app/fonts/fraunces-og.ttf, app/fonts/inter-og.ttf).
 *
 * Two problems, not one:
 *
 * 1. Format. next/og's ImageResponse (Satori + resvg) only parses ttf, otf
 *    and woff font data, not woff2 (see node_modules/next/dist/docs'
 *    image-response.md, "Only ttf, otf, and woff font formats are
 *    supported"). next/font/local also cannot be used inside an
 *    opengraph-image route, since that file is a Route Handler, not a
 *    component next/font wraps. This step is handled here, in Node, with
 *    the `wawoff2` package (no native brotli dependency needed).
 *
 * 2. Variable fonts. Both source files are variable fonts (fvar/gvar/avar/
 *    HVAR tables). A naive woff2-to-ttf decompression keeps those tables
 *    intact, and Satori's renderer does not fully support variable-font
 *    interpolation: it threw `TypeError: Cannot read properties of
 *    undefined (reading '256')` on several service names/angles (glyph-
 *    dependent, not consistent across all text) when the OG build first
 *    ran against the untouched variable TTF. Flattening to one static
 *    instance at build time is the fix Satori's own issue tracker
 *    recommends for this. That step needs a variable-font instancer,
 *    which the Node ecosystem does not have a maintained equivalent of;
 *    `fonttools` (Python's `varLib.instancer`) does, and is what this
 *    script shells out to.
 *
 * Run once (`node scripts/convert-og-font.mjs`) whenever the source woff2
 * files change. Requires `pip install fonttools` locally; the ordinary
 * `npm run build` does NOT depend on Python, only on the two committed
 * *-og.ttf outputs this script produces, which are static assets like any
 * other font file in app/fonts/.
 */
import { readFile, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { decompress } from "wawoff2";

const ROOT = new URL("../", import.meta.url).pathname;

// fraunces carries the service name (display serif); inter carries the
// small "Mike Bastin" wordmark (the site's UI sans). Both are variable
// woff2 fonts on disk, so both go through decompress + instance.
// wght/opsz pins: Fraunces is pinned at its display optical size (144, its
// max) since OG text renders large, and weight 600 to match the site's
// own `font-semibold` display headings. Inter has no opsz axis.
const FONTS = [
  {
    src: "app/fonts/fraunces.woff2",
    out: "app/fonts/fraunces-og.ttf",
    axes: "wght=600 opsz=144",
  },
  {
    src: "app/fonts/inter.woff2",
    out: "app/fonts/inter-og.ttf",
    axes: "wght=600",
  },
];

for (const { src: srcRel, out: outRel, axes } of FONTS) {
  const src = join(ROOT, srcRel);
  const out = join(ROOT, outRel);
  const tmp = `${out}.variable.tmp`;

  const woff2 = await readFile(src);
  const ttf = await decompress(woff2);
  await writeFile(tmp, ttf);

  execFileSync(
    "python3",
    ["-m", "fontTools.varLib.instancer", tmp, ...axes.split(" "), "-o", out],
    { stdio: "inherit" }
  );
  await rm(tmp);

  console.log(`wrote ${out} from ${src} (static instance, ${axes})`);
}
