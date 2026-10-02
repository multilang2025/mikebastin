#!/usr/bin/env node
/**
 * No dates in URLs (owner, 2 Oct 2026, stated as a hard rule).
 *
 * A year in a slug ages the page the day the year turns, and fixing it later
 * costs a redirect. Reads every published URL from the built sitemaps (all
 * locales) and fails on any path segment carrying a four-digit year from
 * 1900 to 2099. A page that has to drop a year keeps its legacy address as
 * a 301: change the slug in the post's frontmatter and its content-map
 * entry, keep the legacy `url`, and regenerate the redirects (see
 * gen-es-redirects.mjs for the pattern).
 *
 *   node scripts/url-date-lint.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const YEAR = /(^|[^0-9])(19|20)\d{2}([^0-9]|$)/;

const sitemaps = readdirSync(OUT).filter((f) => /^sitemap-.*\.xml$/.test(f));
if (!sitemaps.length) {
  console.error("url-date-lint: no sitemaps in out/, run the build first");
  process.exit(1);
}

const dated = [];
let count = 0;
for (const f of sitemaps) {
  for (const [, loc] of readFileSync(join(OUT, f), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
    count++;
    const path = new URL(loc).pathname;
    if (path.split("/").some((seg) => YEAR.test(seg))) dated.push(path);
  }
}

if (dated.length) {
  console.error(`url-date-lint: ${dated.length} URL(s) carry a year, which the owner has ruled out:`);
  for (const p of dated) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`url-date-lint: ${count} URLs, none dated`);
