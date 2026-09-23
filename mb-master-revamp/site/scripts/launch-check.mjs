#!/usr/bin/env node
/**
 * The two switches that decide whether this site is visible at all.
 *
 *   app/layout.tsx        robots: { index: false, follow: false }
 *   public/robots.txt     Disallow: /
 *
 * Both are correct for a preview and fatal for a launch, and each is a
 * single line in a different file with nothing tying them together. Either
 * one left on makes a launched site invisible; either one taken off early
 * makes a preview indexable. The comments in both files say so, which is
 * the weakest kind of guard there is.
 *
 * So this reads the built output rather than the sources, because what
 * ships is what matters, and reports the state of both.
 *
 *   node scripts/launch-check.mjs          report, exit 0
 *   node scripts/launch-check.mjs --live   fail unless the site is launchable
 *
 * Run it against out/ after a build. CI runs the plain form so a
 * half-flipped state (one switch changed, the other forgotten) fails the
 * build the moment it appears, rather than at launch.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const LIVE = process.argv.includes("--live");

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

/** Every built page, so the count is measured rather than assumed. */
function pages(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (entry === "index.html") found.push(p);
  }
  return found;
}

const html = pages(OUT);
const noindexed = html.filter((f) =>
  /<meta name="robots"[^>]*\bnoindex\b/i.test(readFileSync(f, "utf8"))
);

const robotsPath = join(OUT, "robots.txt");
const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
const disallowAll = /^\s*Disallow:\s*\/\s*$/m.test(robots);
const hasSitemap = /^\s*Sitemap:\s*\S+/m.test(robots);

// The 404 and the two post-submit contact pages carry their own noindex
// and should keep it at launch, so they are not evidence of preview mode.
const DELIBERATE = ["/404/", "/_not-found/", "/contact/thanks/", "/contact/problem/"];
const isDeliberate = (f) => DELIBERATE.some((d) => f.includes(d.replaceAll("/", "/")));
const blanket = noindexed.filter((f) => !isDeliberate(f));

const previewNoindex = blanket.length > 0;

console.log(`built pages:            ${html.length}`);
console.log(`noindex, site-wide:     ${previewNoindex ? `YES (${blanket.length} pages)` : "no"}`);
console.log(`noindex, deliberate:    ${noindexed.length - blanket.length} pages`);
console.log(`robots.txt Disallow: /  ${disallowAll ? "YES" : "no"}`);
console.log(`robots.txt Sitemap:     ${hasSitemap ? "present" : "MISSING"}`);

/**
 * The sitemap index and its six children.
 *
 * Checked because the split is easy to break quietly. A child that stops
 * being generated leaves an index row pointing at a 404, and a locale
 * whose entries lose their `kind` lands in no child at all: both produce
 * a smaller, still-valid set of files that nothing else complains about.
 * Summing the children against the index is the cheapest way to notice.
 */
const CHILDREN = [
  "sitemap-en-pages.xml",
  "sitemap-en-posts.xml",
  "sitemap-fr-pages.xml",
  "sitemap-fr-posts.xml",
  "sitemap-es-pages.xml",
  "sitemap-es-posts.xml",
];
const indexPath = join(OUT, "sitemap.xml");
const indexXml = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";
const listed = [...indexXml.matchAll(/<loc>[^<]*\/([^/<]+\.xml)<\/loc>/g)].map((m) => m[1]);
const missing = CHILDREN.filter((c) => !existsSync(join(OUT, c)));
const unlisted = CHILDREN.filter((c) => !listed.includes(c));
const counts = CHILDREN.filter((c) => existsSync(join(OUT, c))).map((c) => ({
  name: c,
  urls: (readFileSync(join(OUT, c), "utf8").match(/<loc>/g) || []).length,
}));
const totalUrls = counts.reduce((n, c) => n + c.urls, 0);

console.log(
  `sitemap index:          ${indexXml.includes("<sitemapindex") ? `${listed.length} children` : "MISSING"}` +
    `, ${totalUrls} URLs total`
);
for (const c of counts) console.log(`  ${c.name.padEnd(24)} ${String(c.urls).padStart(4)}`);

const problems = [];

if (!indexXml.includes("<sitemapindex")) {
  problems.push("out/sitemap.xml is not a sitemap index. app/sitemap.xml/route.ts should emit <sitemapindex>.");
}
if (missing.length) {
  problems.push(`sitemap children missing from the build: ${missing.join(", ")}`);
}
if (unlisted.length) {
  problems.push(`sitemap children not listed in the index: ${unlisted.join(", ")}`);
}
for (const c of counts) {
  if (c.urls === 0) problems.push(`${c.name} contains no URLs, so that locale would be submitted empty.`);
}

// A half-flipped state is worse than either consistent one, because it
// looks launched and is not, or looks private and is not.
if (previewNoindex !== disallowAll) {
  problems.push(
    `inconsistent: meta noindex is ${previewNoindex ? "on" : "off"} but robots.txt Disallow is ${disallowAll ? "on" : "off"}. Flip both or neither.`
  );
}
if (!hasSitemap) {
  problems.push("robots.txt names no Sitemap, so a crawler has to find it by luck.");
}
if (LIVE && previewNoindex) {
  problems.push(`--live: ${blanket.length} pages still carry noindex. Remove the robots block in app/layout.tsx.`);
}
if (LIVE && disallowAll) {
  problems.push("--live: robots.txt still disallows everything. Remove the Disallow line.");
}

if (problems.length > 0) {
  console.error("\n" + problems.map((p) => `  ${p}`).join("\n"));
  process.exit(1);
}

console.log(
  previewNoindex
    ? "\nconsistent preview state: private on both switches."
    : "\nconsistent live state: indexable on both switches."
);
