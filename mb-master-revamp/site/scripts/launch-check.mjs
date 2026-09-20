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

const problems = [];

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
