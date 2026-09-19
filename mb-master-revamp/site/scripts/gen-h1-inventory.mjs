/**
 * Writes docs/h1-inventory.json: every H1 the site actually renders, with the
 * context needed to judge it (the eyebrow directly above it, the title, the
 * description, locale and page type).
 *
 * Reads the built `out/` rather than the sources, so the list records what a
 * visitor and a crawler really see, every interpolated heading included.
 * Run `npm run build` first.
 *
 * Two extraction traps, both of which produced wrong data on the first pass
 * and are handled here:
 *   1. The eyebrow closes on </span> inside the service template and on </p>
 *      elsewhere. Matching only </p> silently lost 18 of 20 service eyebrows,
 *      and an audit run against that data reported eyebrows as missing on
 *      pages that have them.
 *   2. The homepage h1 is split by <br>. Stripping tags without substituting
 *      a space concatenated two sentences into "...ranks.Localisation...".
 *
 * Run with: node scripts/gen-h1-inventory.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname } from "node:path";

const SITE = new URL("..", import.meta.url).pathname;
const OUT = join(SITE, "out");
const DEST = join(SITE, "../docs/h1-inventory.json");

const text = (s) =>
  s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === "index.html") files.push(p);
  }
})(OUT);

const rows = [];
for (const f of files.sort()) {
  const dir = relative(OUT, dirname(f));
  const url = dir === "" ? "/" : `/${dir}/`;
  if (url === "/404/" || url === "/_not-found/") continue;
  const html = readFileSync(f, "utf8");
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (!h1) continue;
  const before = html.slice(0, h1.index);
  const brows = [...before.matchAll(/class="eyebrow[^"]*"[^>]*>([\s\S]*?)<\/(?:p|span|div)>/g)];
  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  const desc = html.match(/<meta name="description" content="([\s\S]*?)"/);
  const locale = url.startsWith("/fr/") ? "fr" : url.startsWith("/es/") ? "es" : "en";
  const type =
    url === "/"
      ? "home"
      : url.includes("/services/")
        ? "service"
        : url.startsWith("/projects/")
          ? "project"
          : url.startsWith("/blog/") || locale !== "en"
            ? "blog"
            : "static";
  rows.push({
    url,
    locale,
    type,
    h1: text(h1[1]),
    eyebrow_above_h1: brows.length ? text(brows[brows.length - 1][1]) : null,
    title: title ? text(title[1]) : null,
    description: desc ? text(desc[1]).slice(0, 200) : null,
  });
}

mkdirSync(dirname(DEST), { recursive: true });
writeFileSync(DEST, JSON.stringify(rows, null, 1) + "\n");
const withEyebrow = rows.filter((r) => r.eyebrow_above_h1).length;
console.log(`${rows.length} H1s -> docs/h1-inventory.json (${withEyebrow} with an eyebrow above)`);
