#!/usr/bin/env node
/**
 * The primary keyword is in the h1. The secondary keywords are on the page.
 *
 * lib/keywords.ts assigns one researched primary term per commercial page,
 * from Ahrefs on 21 September 2026. A keyword map nobody checks is
 * decoration, so this reads the built output and fails when a page's h1
 * does not carry the term that page exists to win.
 *
 * Matching is deliberately loose in one direction and strict in the other.
 * Loose: word order is ignored and UK/US spelling variants are treated as
 * the same term, because the site is UK English by house rule while some
 * of the demand sits on US spellings, and failing a page for writing
 * "optimisation" would be enforcing the wrong rule. Strict: every word of
 * the primary term has to be present. "Technical SEO" does not cover
 * "technical seo services".
 *
 * Secondary terms are reported, never failed. They belong in the h2, the
 * meta description and the body, and where they land is a writer's call.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { KEYWORDS } from "../lib/keywords.ts";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

/** UK and US spellings of the same word are the same keyword. */
const normalise = (s) =>
  s
    .toLowerCase()
    .replace(/[‘’']/g, "")
    .replace(/(optimi|locali|organi|analy)[sz]/g, "$1z")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/gi, " ");

const fails = [];
const thin = [];

for (const [route, kw] of Object.entries(KEYWORDS)) {
  const file = join(OUT, route === "/" ? "" : route, "index.html");
  if (!existsSync(file)) {
    fails.push({ route, why: "no built page at this route" });
    continue;
  }
  const html = readFileSync(file, "utf8");
  const main = html.slice(html.indexOf("<main"));

  const h1m = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1m) {
    fails.push({ route, why: "no h1" });
    continue;
  }
  const h1 = normalise(strip(h1m[1]));
  const body = normalise(strip(main));
  const title = normalise((html.match(/<title>(.*?)<\/title>/i) || [, ""])[1]);

  const words = normalise(kw.primary.term).split(" ");
  const inH1 = words.every((w) => h1.includes(w));

  if (!inH1) {
    const inTitle = words.every((w) => title.includes(w));
    fails.push({
      route,
      why:
        `h1 does not carry the primary term "${kw.primary.term}" ` +
        `(${kw.primary.volume.toLocaleString("en-GB")}/mo)` +
        (inTitle ? ", though the meta title does" : ""),
      h1: strip(h1m[1]).replace(/\s+/g, " ").trim(),
    });
  }

  const missing = kw.secondary.filter(
    (s) => !normalise(s.term).split(" ").every((w) => body.includes(w))
  );
  if (missing.length) thin.push({ route, missing });
}

console.log(`checked the primary keyword of ${Object.keys(KEYWORDS).length} researched pages`);

if (thin.length) {
  const total = thin.reduce((n, t) => n + t.missing.length, 0);
  console.log(`${total} secondary terms absent from the page body across ${thin.length} pages, advisory:`);
  for (const t of thin.slice(0, 8)) {
    console.log(`  ${t.route.padEnd(44)} ${t.missing.map((m) => m.term).join("; ")}`);
  }
  if (thin.length > 8) console.log(`  ... and ${thin.length - 8} more pages`);
}

if (!fails.length) {
  console.log("clean: every researched page carries its primary keyword in the h1");
  process.exit(0);
}

console.error(`\n${fails.length} pages do not carry their primary keyword\n`);
for (const f of fails) {
  console.error(`${f.route}`);
  if (f.h1) console.error(`  h1: ${f.h1}`);
  console.error(`  - ${f.why}`);
}
console.error(
  "\nEither put the term in the h1 or change the assignment in lib/keywords.ts.\n" +
    "One page owns each primary term; two pages chasing one term is the\n" +
    "cannibalisation that file exists to prevent."
);
process.exit(1);
