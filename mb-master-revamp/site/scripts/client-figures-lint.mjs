#!/usr/bin/env node
/**
 * No per-client results figures (owner, 5 Oct 2026: "remove per-client
 * numbers everywhere").
 *
 * lib/projects.ts keeps each client's Search Console clicks and impressions
 * as source data for the totals the site publishes (lib/results-totals.ts).
 * This reads those values and fails the build if any built page, in any
 * locale, prints one of them (with an English, French or Spanish thousands
 * separator), or an average position quoted for a named site, or a result
 * stated as hours saved. Totals across all the sites are fine: they match no
 * single client.
 *
 *   node scripts/client-figures-lint.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(SITE, "out");

const src = readFileSync(join(SITE, "lib/projects.ts"), "utf8");
const figures = [...src.matchAll(/(?:clicks|impressions):\s*"([\d,]+)"/g)].map((m) => m[1]);
if (!figures.length) {
  console.error("client-figures-lint: found no figures in lib/projects.ts, the pattern needs updating");
  process.exit(1);
}

// 2,616 also written 2 616 (space, nbsp, narrow nbsp) and 2.616.
const SEP = String.raw`[,.\s  ]?`;
const rules = figures.map((f) => ({
  what: `client figure ${f}`,
  rx: new RegExp(String.raw`(?<![\d.,])` + f.split(",").join(SEP) + String.raw`(?![\d])`),
}));
rules.push(
  { what: "average position quoted for a site", rx: /(average position of|position moyenne de|posición media de)\s*\d/i },
  { what: "hours saved as a client result", rx: /(three hours a day|ten hours a week|trois heures par jour|tres horas (al día|diarias))/i },
);

const walk = (d) =>
  readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });

const hits = [];
for (const f of walk(OUT)) {
  const html = readFileSync(f, "utf8");
  for (const r of rules) if (r.rx.test(html)) hits.push(`${f.slice(OUT.length).replaceAll("\\", "/")}  ${r.what}`);
}

if (hits.length) {
  console.error(`client-figures-lint: ${hits.length} per-client figure(s) in the built pages:`);
  for (const h of hits.slice(0, 40)) console.error(`  ${h}`);
  process.exit(1);
}
console.log(`client-figures-lint: ${figures.length} client figures checked across ${walk(OUT).length} pages, none printed`);
