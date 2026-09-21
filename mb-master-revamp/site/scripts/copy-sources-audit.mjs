#!/usr/bin/env node
/**
 * Which published figures carry a source, and which do not.
 *
 * Advisory. It never fails the build, and that is deliberate rather than
 * lenient. The house playbook calls this shape a "non-blocking advisory
 * queue that tracks technical debt", and the debt here is real: measured
 * 21 September 2026, 49 English posts carry a percentage and 14 carry a
 * `Source:` line.
 *
 * A gate would be worse than useless on that gap. Thirty-five posts
 * cannot be fixed in one pass, and the only way to go green quickly is to
 * attach a plausible-looking citation to a number whose real source
 * nobody has found, which is the exact failure the sourcing rule exists
 * to prevent. A figure whose source cannot be found gets cut, not
 * decorated. See docs/STYLE-GUIDE-UK-EU.md section 3.
 *
 * The house pattern, from competitor-analysis-traffic-checklist.md:
 *
 *   > 76% of online shoppers prefer to buy in their native language.
 *   > Source: [CSA Research, "Can't Read, Won't Buy", 2020](https://...)
 *
 *   node scripts/copy-sources-audit.mjs          the count and worst offenders
 *   node scripts/copy-sources-audit.mjs --full   every unsourced figure
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../", import.meta.url)), "content/en/posts");
const FULL = process.argv.includes("--full");

/**
 * A figure a reader would expect backed: a percentage, or a number big
 * enough to be a claim rather than a count. "3 languages" needs no
 * citation; "63,000 searches" does.
 */
const FIGURE = /\b\d[\d,.]*%|\b\d{1,3},\d{3}\b|\b\d{4,}\b/g;

/**
 * A bare year is a date, not a claim. Without this the audit ranked posts
 * by how often they said "2026" and buried the posts actually asserting
 * percentages, which is the opposite of useful.
 */
const isYear = (f) => /^(19|20)\d{2}$/.test(f);

/** A source attached the house way, or at least attached. */
const SOURCED = /^\s*>\s*Source:|\bSource:\s*\[/im;

const files = readdirSync(ROOT).filter((f) => f.endsWith(".md"));
const rows = [];

for (const file of files) {
  const raw = readFileSync(join(ROOT, file), "utf8");
  const body = raw.replace(/^---[\s\S]*?\n---\n/, "");

  // Frontmatter carries a word count and a wpId; neither is a claim.
  // Figures inside a link target are not reader-facing either.
  const prose = body.replace(/\]\([^)]*\)/g, "]()").replace(/`[^`]*`/g, "``");

  const figures = [...new Set(prose.match(FIGURE) || [])].filter((f) => !isYear(f));
  if (figures.length === 0) continue;

  rows.push({
    slug: file.replace(/\.md$/, ""),
    figures: figures.length,
    sourced: SOURCED.test(body),
    sample: figures.slice(0, 4),
  });
}

const unsourced = rows.filter((r) => !r.sourced);
unsourced.sort((a, b) => b.figures - a.figures);

console.log(
  `sourcing advisory: ${rows.length} posts carry a figure, ` +
    `${rows.length - unsourced.length} carry a source line, ${unsourced.length} do not`
);

if (unsourced.length > 0) {
  const show = FULL ? unsourced : unsourced.slice(0, 10);
  for (const r of show) {
    console.log(`  ${String(r.figures).padStart(3)} figures  ${r.slug.padEnd(52)} ${r.sample.join(", ")}`);
  }
  if (!FULL && unsourced.length > show.length) {
    console.log(`  ... and ${unsourced.length - show.length} more, --full for all`);
  }
  console.log(
    "\nAdvisory only, never a build failure. A figure whose source cannot be\n" +
      "found gets cut, never given a plausible-looking citation to clear this\n" +
      "list. See docs/STYLE-GUIDE-UK-EU.md section 3."
  );
}

// Always succeeds. The queue is the deliverable, not a gate.
process.exit(0);
