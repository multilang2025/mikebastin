#!/usr/bin/env node
/**
 * Derivatives for the blog images sourced from Wikimedia Commons.
 *
 * Six posts carried AI-generated images with visible defects: a dashboard
 * headed "Btechnilo Novergs", a whiteboard comparison whose row labels did
 * not line up with its rows (and read "Specialized", on a site written in
 * UK English), a desk scene labelled "STRATEGY 2024", a robot hand over a
 * keyboard of invented letters. None of it survives a second look, which
 * is exactly how long a reader gives an article image.
 *
 * Their replacements are public domain photographs. Commons holds plenty
 * under CC BY and CC BY-SA too, and those are deliberately not used: they
 * require crediting the photographer wherever the photo appears, and the
 * owner's decision is that no picture on this site carries a credit line.
 * Public domain and CC0 owe nothing, so scripts/commons-search.py filters
 * to those and this script only ever fetches what it picked.
 *
 * Every entry names a real file on Commons, so a derivative deleted or
 * corrupted here can be rebuilt from the source rather than being a
 * hand-cut file nobody can regenerate. Same two outputs and the same
 * quality settings as fetch-legacy-images.mjs, so the two sets of images
 * are indistinguishable in the page:
 *
 *   <slug>.webp        1200x630, the card and the post head
 *   <slug>-thumb.webp  160x84, the footer's recent-post thumbnails
 *
 * Unlike the legacy images these are cropped to 1200x630 rather than
 * scaled to 1200 wide, because an archival photograph is whatever shape
 * the negative was (one of these is square) and the card and hero both
 * render at 1200/630 regardless. Cropping once here beats letting CSS
 * crop a needlessly tall file on every view.
 *
 *   node scripts/fetch-commons-images.mjs          skip what exists
 *   node scripts/fetch-commons-images.mjs --force  rebuild all
 */

import { mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { BLOG_IMAGES } from "../lib/blog-images.ts";

const OUT = path.join(fileURLToPath(new URL("../", import.meta.url)), "public/images/blog");
const FORCE = process.argv.includes("--force");
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "mikebastin-site-build/1.0 (static site image pipeline)";

const exists = (p) =>
  access(p).then(
    () => true,
    () => false
  );

/**
 * A rendering of the file wide enough to crop from. Commons serves these
 * for every format it holds, including the TIFFs in the US National
 * Archives sets, which sharp would otherwise have to decode itself.
 */
async function sourceUrl(title) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "2400",
  });
  const res = await fetch(`${API}?${params}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status} for ${title}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`no imageinfo for ${title}`);

  // Re-check the licence at fetch time rather than trusting the search
  // that found it. A file's licensing can be corrected on Commons after
  // the fact, and a photo that turned out to need attribution must not
  // reach the site silently.
  const licence = (
    (info.extmetadata?.LicenseShortName?.value ?? "") +
    " " +
    (info.extmetadata?.UsageTerms?.value ?? "")
  ).toLowerCase();
  const free = ["public domain", "cc0", "no restrictions"].some((f) => licence.includes(f));
  const shared = ["by-sa", "cc by", "gfdl"].some((f) => licence.includes(f));
  if (!free || shared) {
    throw new Error(
      `${title} is licensed "${info.extmetadata?.LicenseShortName?.value}", which is not ` +
        `public domain or CC0. It would need a credit line, so it cannot be used here.`
    );
  }

  return info.thumburl ?? info.url;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let fetched = 0;
  let present = 0;
  const failed = [];

  for (const [slug, image] of Object.entries(BLOG_IMAGES)) {
    if (!image.legacy?.startsWith("commons:")) continue;

    const full = path.join(OUT, `${slug}.webp`);
    const thumb = path.join(OUT, `${slug}-thumb.webp`);
    if (!FORCE && (await exists(full)) && (await exists(thumb))) {
      present++;
      continue;
    }

    const title = image.legacy.slice("commons:".length);
    try {
      const url = await sourceUrl(title);
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());

      // `attention` keeps whatever sharp scores as most interesting,
      // which on two of these was the machinery rather than the person
      // working it, cropping their heads off. cropFocus says so per
      // image; see lib/blog-images.ts.
      const position =
        image.cropFocus === "top"
          ? "top"
          : image.cropFocus === "centre"
            ? "centre"
            : sharp.strategy.attention;

      const cropped = sharp(buf).resize(image.width, image.height, {
        fit: "cover",
        position,
      });
      await cropped.clone().webp({ quality: 74 }).toFile(full);
      await sharp(buf)
        .resize(160, 84, { fit: "cover", position })
        .webp({ quality: 72 })
        .toFile(thumb);

      fetched++;
      console.log(`  ${slug}  <-  ${title}`);
    } catch (err) {
      failed.push(`${slug}: ${err.message}`);
    }
  }

  console.log(`\nfetched ${fetched}, already present ${present}, failed ${failed.length}`);
  for (const f of failed) console.error(`  ${f}`);
  if (failed.length > 0) process.exit(1);
}

await main();
