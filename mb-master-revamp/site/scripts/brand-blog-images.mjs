#!/usr/bin/env node
/**
 * Turns the Higgsfield featured images into the journal's files, with the
 * MB mark stamped in the corner.
 *
 * The owner asked for article images that are "relevant, with some
 * branding effect on them so they are in harmony with the website, and
 * between each other" (8 Oct 2026). The harmony comes from the prompt:
 * every image was generated as a paper still life on the site's cream,
 * in its navy, with one berry accent. The branding is this script: the
 * favicon's berry disc and MB monogram, bottom left, where every prompt
 * left empty space.
 *
 * Takes a folder of PNGs named <slug>.png (downloaded from the
 * `higgsfield:<job id>` recorded in lib/blog-images.ts) and writes
 *
 *   <slug>.webp        1200x630, marked, the post head
 *   <slug>-640.webp    640x336, marked, cards and srcset
 *   <slug>-thumb.webp  160x84, unmarked: at footer size the mark is a dot
 *
 *   node --experimental-strip-types scripts/brand-blog-images.mjs <dir>
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/images/blog");
const W = 1200;
const H = 630;
const MARK = 52;
const INSET = 30;

// public/icon.svg in its berry (dark-scheme) colouring, fixed rather than
// media-query driven since a raster has no colour scheme.
const mark = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${MARK}" height="${MARK}">
  <circle cx="32" cy="32" r="31" fill="#C42640"/>
  <g stroke="#F5EFE2" stroke-width="1.1" fill="none" opacity=".28">
    <circle cx="32" cy="32" r="23"/><path d="M9 32 H55"/><path d="M13.5 21 H50.5"/><path d="M13.5 43 H50.5"/>
    <path d="M32 9 C 20 20, 20 44, 32 55"/><path d="M32 9 C 44 20, 44 44, 32 55"/>
  </g>
  <path fill="#F5EFE2" d="M12 44 V20 h5.6 l5.4 11.4 L28.4 20 H34 v24 h-5 V29.6 l-4 8.2 h-3.9 l-4.1 -8.2 V44 Z"/>
  <path fill="#F5EFE2" fill-rule="evenodd" d="M37 20 h10.6 c4.3 0 7.2 2.4 7.2 5.9 c0 2.3 -1.2 4 -3.1 4.9 c2.5 0.9 4.1 2.9 4.1 5.7 c0 4.2 -3.2 7.5 -8.3 7.5 H37 Z M42 24.4 v4.4 h5.1 c1.8 0 2.8 -0.8 2.8 -2.2 c0 -1.4 -1 -2.2 -2.8 -2.2 Z M42 33 v6.6 h5.9 c2.2 0 3.5 -1.2 3.5 -3.3 c0 -2.1 -1.3 -3.3 -3.5 -3.3 Z"/>
</svg>`);

async function main() {
  const dir = process.argv[2];
  if (!dir) throw new Error("usage: brand-blog-images.mjs <dir of <slug>.png>");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));
  for (const file of files) {
    const slug = file.slice(0, -4);
    const cut = await sharp(path.join(dir, file)).resize(W, H, { fit: "cover", position: "centre" }).toBuffer();
    const marked = await sharp(cut)
      .composite([{ input: mark, left: INSET, top: H - INSET - MARK }])
      .toBuffer();
    await writeFile(path.join(OUT, `${slug}.webp`), await sharp(marked).webp({ quality: 78, effort: 6 }).toBuffer());
    await writeFile(path.join(OUT, `${slug}-640.webp`), await sharp(marked).resize(640, 336).webp({ quality: 76, effort: 6 }).toBuffer());
    await writeFile(path.join(OUT, `${slug}-thumb.webp`), await sharp(cut).resize(160, 84).webp({ quality: 72 }).toBuffer());
  }
  console.log(`wrote ${files.length} images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
