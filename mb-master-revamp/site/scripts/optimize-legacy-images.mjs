#!/usr/bin/env node
/**
 * Converts the images carried over from WordPress inside post bodies
 * (public/images/legacy/, referenced from content/) to WebP, at most 1200px
 * wide and never enlarged, rewrites the references in content/ to the new
 * file, removes the original, and records every legacy image's size in
 * lib/legacy-image-sizes.json so renderMarkdown can give each <img> its
 * width and height (no layout shift) at build time.
 *
 * Idempotent: a WebP already in place is only measured.
 * Run with `npm run images:legacy`.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";

const SITE = new URL("..", import.meta.url).pathname;
const PUBLIC = join(SITE, "public");
const LEGACY = join(PUBLIC, "images/legacy");
const CONTENT = join(SITE, "content");

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const contentFiles = walk(CONTENT).filter((f) => /\.mdx?$/.test(f));
const sizes = {};
let converted = 0;
let before = 0;
let after = 0;

for (const file of walk(LEGACY)) {
  const url = "/" + relative(PUBLIC, file).split("\\").join("/");
  if (/\.webp$/i.test(file)) {
    const m = await sharp(file).metadata();
    sizes[url] = [m.width, m.height];
    continue;
  }
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const out = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const outUrl = url.replace(/\.(jpe?g|png)$/i, ".webp");
  const info = await sharp(file)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(out);
  before += statSync(file).size;
  after += info.size;
  sizes[outUrl] = [info.width, info.height];
  for (const c of contentFiles) {
    const text = readFileSync(c, "utf8");
    if (text.includes(url)) writeFileSync(c, text.split(url).join(outUrl));
  }
  unlinkSync(file);
  converted += 1;
}

const sorted = Object.fromEntries(Object.entries(sizes).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(SITE, "lib/legacy-image-sizes.json"), JSON.stringify(sorted, null, 1) + "\n");
console.log(
  `converted ${converted} legacy images to WebP` +
    (converted ? `: ${Math.round(before / 1024)} KB to ${Math.round(after / 1024)} KB` : "") +
    `; ${Object.keys(sizes).length} sizes recorded`,
);
if (!existsSync(join(SITE, "lib/legacy-image-sizes.json"))) process.exit(1);
