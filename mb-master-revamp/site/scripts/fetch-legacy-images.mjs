#!/usr/bin/env node
/**
 * Rebuilds public/images/blog/ from the legacy WordPress uploads.
 *
 * The featured image each post carried on mikebastin.com is the image it
 * carries here. lib/blog-images.ts is the record of which file belongs to
 * which post, written once from the legacy database:
 *
 *   SELECT p.post_name, a.guid
 *   FROM wp_posts p
 *   JOIN wp_postmeta m ON m.post_id = p.ID AND m.meta_key = '_thumbnail_id'
 *   JOIN wp_posts a ON a.ID = m.meta_value
 *   WHERE p.post_type = 'post';
 *
 * Run this when a post is added to that map, or to re-check the set
 * against the source. It is not part of `next build`: the derivatives are
 * committed, so a build never depends on the legacy site being up.
 *
 *   node scripts/fetch-legacy-images.mjs          # only what is missing
 *   node scripts/fetch-legacy-images.mjs --force  # re-fetch everything
 *
 * Two derivatives per post, both webp:
 *   <slug>.webp        1200px wide, the card and the post head
 *   <slug>-thumb.webp  160x84, the footer's recent-post thumbnails
 *
 * The thumbnail is a real file rather than the full image scaled in the
 * browser because SiteFooter draws four of them on every page of the
 * site, at 56px wide.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { BLOG_IMAGES } from "../lib/blog-images.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/images/blog");
const BASE = "https://mikebastin.com/wp-content/uploads/";
const FORCE = process.argv.includes("--force");

const exists = (p) => access(p).then(() => true, () => false);

async function main() {
  await mkdir(OUT, { recursive: true });

  let fetched = 0;
  let skipped = 0;
  const failures = [];

  for (const [slug, image] of Object.entries(BLOG_IMAGES)) {
    const full = path.join(OUT, `${slug}.webp`);
    const thumb = path.join(OUT, `${slug}-thumb.webp`);

    if (!FORCE && (await exists(full)) && (await exists(thumb))) {
      skipped++;
      continue;
    }

    // An entry sourced outside the legacy library records its origin
    // rather than an upload path, and cannot be refetched from here.
    if (image.legacy.startsWith("unsplash:")) {
      skipped++;
      continue;
    }

    const url = BASE + image.legacy;
    const res = await fetch(url);
    if (!res.ok) {
      failures.push(`${slug}: ${res.status} ${url}`);
      continue;
    }

    const bytes = Buffer.from(await res.arrayBuffer());

    // A few of the January 2026 uploads were generated with the prompt
    // still burned across the top. cropTop removes that band before
    // anything else, so the derivative is clean and rebuildable.
    let source = sharp(bytes);
    if (image.cropTop) {
      const meta = await sharp(bytes).metadata();
      source = sharp(
        await sharp(bytes)
          .extract({ left: 0, top: image.cropTop, width: meta.width, height: meta.height - image.cropTop })
          .toBuffer()
      );
    }
    const cropped = await source.toBuffer();

    await sharp(cropped).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 74 }).toFile(full);
    await sharp(cropped).resize(160, 84, { fit: "cover", position: "attention" }).webp({ quality: 72 }).toFile(thumb);
    fetched++;
  }

  console.log(`fetched ${fetched}, already present ${skipped}, failed ${failures.length}`);
  if (failures.length > 0) {
    // A 404 here means the legacy upload moved or was deleted, which the
    // map cannot know about on its own. Loud, because the fallback is a
    // drawn composition that looks deliberate rather than broken.
    for (const f of failures) console.error("  " + f);
    process.exitCode = 1;
  }
}

main();
