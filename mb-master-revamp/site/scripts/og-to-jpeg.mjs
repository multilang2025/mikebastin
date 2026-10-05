#!/usr/bin/env node
/**
 * Re-encodes every exported social card (every opengraph-image and
 * twitter-image, written by next/og as PNG) as a JPEG in place. The cards
 * carry a full-bleed photograph since the ValenciaMove treatment (owner,
 * 3 Oct 2026; lib/og-card.tsx), which made them several hundred KB each as
 * PNG; JPEG keeps them near 100 KB, which matters for the FTP deploy and
 * for the crawlers that fetch them. The routes declare image/jpeg and
 * public/.htaccess serves the extensionless files as image/jpeg.
 * Runs as part of `postbuild`; a file that is already JPEG is left alone.
 */
import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const OUT = fileURLToPath(new URL("../out", import.meta.url));
const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

let n = 0;
let before = 0;
let after = 0;
for (const f of walk(OUT).filter((p) => /[\\/](opengraph|twitter)-image$/.test(p))) {
  const buf = readFileSync(f);
  if (buf[0] === 0xff && buf[1] === 0xd8) continue;
  const jpg = await sharp(buf).flatten({ background: "#0A1B28" }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  before += buf.length;
  after += jpg.length;
  writeFileSync(f, jpg);
  n += 1;
}
console.log(`og cards to JPEG: ${n} files, ${Math.round(before / 1024)} KB to ${Math.round(after / 1024)} KB`);
