/**
 * Lint harvested content against the Master Content Protocol (CLAUDE.md).
 *
 * Written because the harvested prose is not publishable as-is. The live
 * site's own copy breaks the owner's rules in 41 places across the service
 * pages alone, mostly words he has explicitly rejected. Rendering it
 * straight onto the rebuild would ship the exact copy the rebuild exists
 * to replace.
 *
 * So the migration gates on this: a page renders its harvested body only
 * once that body passes. Anything failing keeps the summary treatment and
 * shows up here as a work item, rather than being quietly published or
 * quietly dropped.
 *
 * Run with `--json` for machine output, otherwise a readable report.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/", import.meta.url).pathname;

const FORBIDDEN = [
  "comprehensive", "tailored", "seamless", "leverage", "elevate", "crafted",
  "maximise", "facilitate", "landscape", "utilise", "innovative", "robust",
  "delve", "transformative", "implementation", "integration", "vital",
  "dynamic", "ever-evolving", "moreover", "however", "thus", "hence",
  "additionally",
];

/** Rules apply to English prose. FR and ES have their own vocabulary. */
const LINTED_LOCALES = new Set(["en"]);

/**
 * URLs are exempt. CLAUDE.md already exempts query-string ampersands, and
 * the same logic covers any forbidden word that only appears inside a link
 * target: "/services/localised-e-commerce-integration/" is a slug, not
 * prose. Ten of the 97 "integration" hits were URLs before this stripped
 * them.
 */
const prose = (body) =>
  body.replace(/\]\((?:[^)]+)\)/g, "]()").replace(/https?:\/\/\S+/g, "");

function lint(raw) {
  const body = prose(raw);
  const issues = [];

  for (const w of FORBIDDEN) {
    const m = body.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (m) issues.push({ rule: "forbidden-word", detail: w, count: m.length });
  }

  const dashes = body.match(/[—–]/g);
  if (dashes) issues.push({ rule: "dash", detail: "em or en dash", count: dashes.length });

  // Query-string and HTML-entity ampersands are exempt; prose ones are not.
  const amps = body.match(/ & | &amp; /g);
  if (amps) issues.push({ rule: "ampersand", detail: "bare ampersand", count: amps.length });

  const michael = body.match(/\bMichael\b/g);
  if (michael) issues.push({ rule: "brand", detail: "Michael, brand is Mike Bastin", count: michael.length });

  // Sentence openers, checked at a full stop or start of a line.
  const openers = body.match(/(?:^|\.\s+)(This|That|I)\s/gm);
  if (openers) issues.push({ rule: "sentence-opener", detail: "This, That or I", count: openers.length });

  return issues;
}

const rows = [];
for (const locale of readdirSync(CONTENT)) {
  const lp = join(CONTENT, locale);
  if (!statSync(lp).isDirectory() || !LINTED_LOCALES.has(locale)) continue;
  for (const type of readdirSync(lp)) {
    const tp = join(lp, type);
    if (!statSync(tp).isDirectory()) continue;
    for (const f of readdirSync(tp)) {
      if (!f.endsWith(".md")) continue;
      const src = readFileSync(join(tp, f), "utf8");
      const body = src.split(/^---$/m).slice(2).join("---").trim();
      const issues = lint(body);
      rows.push({
        locale, type, slug: f.slice(0, -3),
        clean: issues.length === 0,
        total: issues.reduce((a, i) => a + i.count, 0),
        issues,
      });
    }
  }
}

if (process.argv.includes("--json")) {
  writeFileSync(
    new URL("../content/copy-lint.json", import.meta.url).pathname,
    JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 1)
  );
  console.log(`wrote content/copy-lint.json (${rows.length} files)`);
} else {
  const clean = rows.filter((r) => r.clean);
  console.log(`linted ${rows.length} English files`);
  console.log(`  clean, publishable as-is:      ${clean.length}`);
  console.log(`  needs a copy pass before use:  ${rows.length - clean.length}`);
  console.log("\nby type:");
  for (const t of [...new Set(rows.map((r) => r.type))]) {
    const sel = rows.filter((r) => r.type === t);
    console.log(`  ${t.padEnd(9)} ${sel.filter((r) => r.clean).length}/${sel.length} clean`);
  }
  const tally = {};
  for (const r of rows) for (const i of r.issues) tally[i.detail] = (tally[i.detail] || 0) + i.count;
  console.log("\nmost common violations:");
  for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${String(v).padStart(4)}  ${k}`);
  }
}
