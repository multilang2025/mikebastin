#!/usr/bin/env node
/**
 * Every legacy URL resolves, and never through a chain.
 *
 * `docs/sitemap-MB-EN.txt` is the URL inventory of record: 138 addresses
 * the old WordPress site published and that other people's links, and
 * Google's index, still point at. CLAUDE.md states the rule ("every
 * legacy URL resolves 200-same or 301s") and LAUNCH-CHECKLIST.md repeats
 * it, and until now nothing checked it. A rule written down in two places
 * and enforced in none is a rule that holds until the day somebody
 * renames a slug.
 *
 * Three ways it can be broken, and this fails on all three:
 *
 *   MISSING   No rule matches and no page is built at that path, so the
 *             URL 404s. The link equity and the traffic both stop here.
 *   CHAIN     A rule's target is itself redirected. The checklist calls
 *             this out because the project has shipped a two-hop chain
 *             once already: a 301 to a 301 costs the equity the redirect
 *             existed to preserve, and it compounds quietly, because
 *             each hop is individually correct.
 *   DEAD      A rule points at an internal path with no page built at
 *             it, which is a 301 into a 404: worse than no redirect,
 *             because it looks handled.
 *
 * External targets (valenciamove.com, the exodus) are resolved as far as
 * the rule and no further. Whether that host serves a 200 is its own
 * site's problem and not something a build here can know.
 *
 *   node scripts/redirect-coverage-lint.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(SITE, "out");
const HTACCESS = join(SITE, "public/.htaccess");
const INVENTORY = join(SITE, "../docs/sitemap-MB-EN.txt");

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

/** "https://mikebastin.com/foo/" and "/foo" both normalise to "foo". */
const norm = (s) =>
  s
    .trim()
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

/**
 * The rules, source path -> target.
 *
 * Every pattern in the generated file is a literal slug wrapped in
 * `^...\/?$`, checked by the parser below rather than assumed: a rule
 * carrying real regex would silently match more than this map says, and
 * a lint that quietly under-reports is worse than none.
 */
const rules = new Map();
const unparsed = [];
for (const line of readFileSync(HTACCESS, "utf8").split("\n")) {
  if (!line.startsWith("RewriteRule")) continue;
  const m = line.match(/^RewriteRule\s+\^([^\s]+?)\\?\/\?\$\s+(\S+)/);
  if (!m) {
    unparsed.push(line.trim());
    continue;
  }
  const [, from, to] = m;
  if (/[().*+|[\]?]/.test(from)) {
    unparsed.push(line.trim());
    continue;
  }
  rules.set(norm(from), to);
}

const isExternal = (t) => /^https?:\/\//.test(t);
const built = (p) => existsSync(join(OUT, p, "index.html")) || existsSync(join(OUT, `${p}.html`)) || p === "";

/** Follow a path through the rules, returning every hop taken. */
function resolve(path) {
  const hops = [];
  let cur = path;
  for (let i = 0; i < 10; i++) {
    const target = rules.get(cur);
    if (!target) break;
    hops.push(target);
    if (isExternal(target)) return { hops, end: target, external: true };
    cur = norm(target);
  }
  return { hops, end: cur, external: false };
}

const inventory = readFileSync(INVENTORY, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.startsWith("http"));

const missing = [];
const chains = [];
const dead = [];
let direct = 0;
let redirected = 0;
let external = 0;

for (const url of inventory) {
  const path = norm(url);
  const { hops, end, external: ext } = resolve(path);

  if (hops.length === 0) {
    if (built(path)) direct++;
    else missing.push(path);
    continue;
  }
  if (hops.length > 1) chains.push({ path, hops });
  if (ext) {
    external++;
    continue;
  }
  if (!built(end)) dead.push({ path, end });
  else redirected++;
}

console.log(`legacy URLs checked:    ${inventory.length}`);
console.log(`  still served here:    ${direct}`);
console.log(`  301 to a live page:   ${redirected}`);
console.log(`  301 off-site:         ${external}`);
console.log(`redirect rules parsed:  ${rules.size}`);

const problems = [];
if (unparsed.length) {
  problems.push(
    `${unparsed.length} RewriteRule lines could not be read as a literal slug, so their coverage is unknown:\n` +
      unparsed.map((l) => `      ${l}`).join("\n")
  );
}
if (missing.length) {
  problems.push(
    `${missing.length} legacy URLs 404: no rule matches and no page is built.\n` +
      missing.map((p) => `      /${p}/`).join("\n")
  );
}
if (chains.length) {
  problems.push(
    `${chains.length} legacy URLs redirect through a chain. Point the first rule at the final target.\n` +
      chains.map((c) => `      /${c.path}/ -> ${c.hops.join(" -> ")}`).join("\n")
  );
}
if (dead.length) {
  problems.push(
    `${dead.length} rules 301 into a 404, which reads as handled and is not.\n` +
      dead.map((d) => `      /${d.path}/ -> /${d.end}/ (not built)`).join("\n")
  );
}

if (!problems.length) {
  console.log("\nclean: every legacy URL resolves, none through a chain");
  process.exit(0);
}
console.error("\n" + problems.map((p) => `  ${p}`).join("\n\n"));
console.error(
  "\ndocs/sitemap-MB-EN.txt is the inventory of record. Regenerate the\n" +
    "redirects with the scripts/gen-*-redirects.mjs family rather than\n" +
    "editing public/.htaccess, which is generated."
);
process.exit(1);
