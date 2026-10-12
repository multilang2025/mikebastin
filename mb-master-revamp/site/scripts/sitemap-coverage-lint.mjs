#!/usr/bin/env node
/**
 * Every indexable page is in both sitemaps, and both sitemaps list only
 * pages that exist (owner, 12 Oct 2026: "make it a hard rule to update html
 * sitemaps as we add new content").
 *
 * The XML sitemaps and the HTML sitemap at /sitemap/ both read
 * lib/site-urls.ts, so a post, a service or a locale page reaches them by
 * existing. What does not is a hand-built route: its path has to be added
 * to that file by hand, and /about-us/ shipped on 8 Oct 2026 without it.
 * So this reads the built output rather than the list, because the list is
 * exactly what can be out of date.
 *
 * A page is exempt only when it carries its own noindex (the 404 and the
 * post-submit contact pages). The preview's site-wide "noindex, nofollow,
 * nocache" is not an exemption, so the check means the same before and
 * after launch.
 *
 *   node scripts/sitemap-coverage-lint.mjs    after `npm run build`
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const PREVIEW_ROBOTS = "noindex, nofollow, nocache";

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

function pages(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (entry === "index.html") found.push(p);
  }
  return found;
}

const toPath = (file) => {
  const rel = relative(OUT, file).split(sep).slice(0, -1).join("/");
  return rel ? `/${rel}/` : "/";
};

const indexable = new Set();
for (const file of pages(OUT)) {
  const html = readFileSync(file, "utf8");
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i)?.[1] ?? "";
  if (/\bnoindex\b/i.test(robots) && robots !== PREVIEW_ROBOTS) continue;
  indexable.add(toPath(file));
}

const xml = new Set();
for (const entry of readdirSync(OUT)) {
  if (!/^sitemap-.+\.xml$/.test(entry)) continue;
  for (const m of readFileSync(join(OUT, entry), "utf8").matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)) {
    xml.add(m[1]);
  }
}

// The HTML sitemap's own list items, not the nav and footer links around them.
const sitemapHtml = readFileSync(join(OUT, "sitemap", "index.html"), "utf8");
const listed = new Set(
  [...sitemapHtml.matchAll(/<li class="leading-\[1\.45\]"><a[^>]*href="([^"]+)"/g)].map((m) => m[1])
);

const problems = [];
for (const p of indexable) {
  if (!xml.has(p)) problems.push(`${p}  built and indexable, missing from the XML sitemaps`);
  if (!listed.has(p)) problems.push(`${p}  built and indexable, missing from the HTML sitemap (/sitemap/)`);
}
for (const p of xml) if (!indexable.has(p)) problems.push(`${p}  in the XML sitemaps, but not an indexable built page`);
for (const p of listed) if (!indexable.has(p)) problems.push(`${p}  on the HTML sitemap, but not an indexable built page`);

if (problems.length) {
  console.error(`sitemap-coverage-lint: ${problems.length} problem(s)\n`);
  for (const p of problems.sort()) console.error(`  ${p}`);
  console.error(
    "\nAdd a hand-built route to lib/site-urls.ts (STATIC for English, lib/fr-pages-data.ts or lib/es-pages-data.ts for French and Spanish), or give a page that should stay out of search its own noindex."
  );
  process.exit(1);
}

console.log(`sitemap-coverage-lint: ${indexable.size} indexable pages, all in the XML and HTML sitemaps`);
