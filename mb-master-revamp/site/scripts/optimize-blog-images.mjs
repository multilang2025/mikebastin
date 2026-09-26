#!/usr/bin/env node
/**
 * Cuts every journal image to the slot it is drawn in, and adds a
 * smaller copy for cards and phones.
 *
 * The post head and every card show the image at 1200:630, but the
 * files came in at whatever shape the source had (1.33 to 2.49), so the
 * browser cropped them with a blind centre crop and downloaded the
 * pixels it then threw away. Here the crop happens once, with sharp's
 * "attention" strategy picking the busiest region rather than the
 * middle, and the file is exactly the box it fills.
 *
 *   <slug>.webp      1200x630, the post head
 *   <slug>-640.webp  640x336, cards and narrow screens (srcset)
 *
 * Works on the committed files, so it covers every source the set is
 * built from (legacy uploads, Commons, Unsplash, owner-made) without
 * refetching any of them. `npm run images:blog` runs both fetch scripts
 * and then this one, so a newly fetched image lands already cut.
 * A source smaller than 1200x630 is cut to the same shape at its own
 * size rather than enlarged. `cropFocus` in lib/blog-images.ts overrides
 * the attention crop where it guesses wrong (archival photos of people).
 *
 * Idempotent: a file already at 1200x630 with its 640 sibling is left
 * alone, so running it twice never re-encodes a lossy file twice.
 *
 *   node scripts/optimize-blog-images.mjs
 *   node scripts/optimize-blog-images.mjs --force   # re-cut everything
 */
import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { BLOG_IMAGES } from "../lib/blog-images.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public/images/blog");
const FORCE = process.argv.includes("--force");
const W = 1200;
const H = 630;

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
  let done = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;

  for (const slug of Object.keys(BLOG_IMAGES)) {
    const full = path.join(DIR, `${slug}.webp`);
    const small = path.join(DIR, `${slug}-640.webp`);
    if (!(await exists(full))) continue;

    const src = await readFile(full);
    const { width, height } = await sharp(src).metadata();
    // Never enlarge: a source too small for 1200x630 is cut to the same
    // shape at its own size, and lib/blog-images.ts records the real size.
    const tw = Math.min(W, width, Math.round((height * W) / H));
    const th = Math.round((tw * H) / W);
    const rightShape = width === tw && height === th;
    if (!FORCE && rightShape && (await exists(small))) {
      skipped++;
      continue;
    }

    const focus = BLOG_IMAGES[slug].cropFocus;
    const position = focus === "top" ? "top" : focus === "centre" ? "centre" : "attention";
    let out = await sharp(src).resize(tw, th, { fit: "cover", position }).webp({ quality: 76, effort: 6 }).toBuffer();
    // A file that was already the right shape keeps its bytes when
    // re-encoding would not make it smaller.
    if (rightShape && out.length >= src.length) out = src;
    const sw = Math.min(640, tw);
    const smallOut = await sharp(out).resize(sw, Math.round((sw * H) / W)).webp({ quality: 74, effort: 6 }).toBuffer();
    if (tw !== W) console.log(`  ${slug}: source is ${width}x${height}, kept at ${tw}x${th} rather than enlarged`);

    await writeFile(full, out);
    await writeFile(small, smallOut);
    before += src.length;
    after += out.length;
    done++;
  }

  const kb = (n) => `${Math.round(n / 1024)}KB`;
  console.log(`cut ${done}, already right ${skipped}; full-size ${kb(before)} -> ${kb(after)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
