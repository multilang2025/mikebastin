#!/usr/bin/env node
/**
 * Every journal post opens on an H2 (owner, 7 Oct 2026, a hard rule: "all Blog
 * posts need to start with an H2").
 *
 * Reads the post URLs from the built sitemaps of all three languages
 * (sitemap-en-posts.xml, sitemap-fr-posts.xml, sitemap-es-posts.xml), opens each
 * built page and looks at the first block inside `.post-body`. A picture the
 * post opens on does not count, because that picture is the page's hero (the
 * layout drops its own hero image for such a post); the first block after it
 * must be an `<h2>`. A paragraph, a list, a quote, a table or an `<h3>` in that
 * place fails the build. Hand-built posts with no `.post-body` are skipped.
 *
 *   node scripts/post-opens-h2-lint.mjs            # fail on any post
 *   node scripts/post-opens-h2-lint.mjs --list     # print every failing URL
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const list = process.argv.includes("--list");

const urls = [];
for (const loc of ["en", "fr", "es"]) {
  const f = join(OUT, `sitemap-${loc}-posts.xml`);
  if (!existsSync(f)) continue;
  for (const [, u] of readFileSync(f, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(new URL(u).pathname);
}
if (!urls.length) {
  console.error("post-opens-h2-lint: no post sitemaps in out/, run the build first");
  process.exit(1);
}

// A picture, however the markdown rendered it, before the first real block.
const MEDIA = /^\s*(?:<p>\s*)?(?:<a[^>]*>\s*)?(?:<img\b[^>]*>|<figure\b[\s\S]*?<\/figure>)\s*(?:<\/a>\s*)?(?:<\/p>)?\s*/i;

const bad = [];
let checked = 0;
for (const path of urls) {
  const file = join(OUT, path, "index.html");
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const at = html.search(/class="post-body[^"]*"[^>]*>/);
  if (at < 0) continue;
  let rest = html.slice(html.indexOf(">", at) + 1);
  // Some posts wrap their content in an invisible `display: contents` div.
  rest = rest.replace(/^\s*(?:<div class="contents">\s*)+/i, "");
  for (let i = 0; i < 3 && MEDIA.test(rest); i++) rest = rest.replace(MEDIA, "");
  checked++;
  const first = rest.match(/^\s*<([a-z0-9]+)/i)?.[1]?.toLowerCase() ?? "?";
  if (first !== "h2") bad.push(`${path}  opens on <${first}>`);
}

if (bad.length) {
  console.error(`post-opens-h2-lint: ${bad.length} of ${checked} posts do not open on an H2 (owner hard rule, 7 Oct 2026):`);
  for (const b of list ? bad : bad.slice(0, 15)) console.error(`  ${b}`);
  if (!list && bad.length > 15) console.error(`  ... and ${bad.length - 15} more, run with --list`);
  process.exit(1);
}
console.log(`post-opens-h2-lint: ${checked} posts, all open on an H2`);
