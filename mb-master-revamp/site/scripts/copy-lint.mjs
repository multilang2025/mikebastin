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

/**
 * Matched on the stem, not the exact word.
 *
 * The first version of this list matched whole words only, which meant
 * "leverage" was caught and "leveraging" was not. Eight of the nine
 * rejected verbs appear here mostly in an inflected form, so the strict
 * match was hiding roughly a hundred violations and reporting the files
 * that contained them as clean. The owner rejected the word, not one
 * conjugation of it.
 */
const FORBIDDEN = [
  "comprehensive", "tailor(?:ed|ing|s)?", "seamless(?:ly)?",
  "leverag(?:e|es|ed|ing)", "elevat(?:e|es|ed|ing)",
  "craft(?:s|ed|ing)?", "maximis(?:e|es|ed|ing)",
  "facilitat(?:e|es|ed|ing)", "landscape", "utilis(?:e|es|ed|ing)",
  "innovative", "robust", "delv(?:e|es|ed|ing)", "transformative", "vital",
  "dynamic", "ever-evolving", "moreover", "however", "thus", "hence",
  "additionally",
];

/**
 * Words the stems above would otherwise swallow. "Craftsmanship" is not
 * the rejected verb "craft", "elevator" is a lift, and "Core Web Vital"
 * is Google's own metric name, which the site has to be able to say.
 */
const EXEMPT = [
  /\bcraftsm(?:an|en|anship)\b/gi,
  /\barts and craft\b/gi,
  /\belevators?\b/gi,
  /Core Web Vitals?/gi,
  // "dynamic" is rejected as a marketing adjective ("our dynamic team"),
  // not as the technical term. Dynamic content and dynamic URLs are what
  // the industry calls those things, and the noun sense ("the same
  // dynamic applies") is a different word again.
  /\bdynamic (?:content|URLs?)\b/gi,
  /\b(?:same|reverse|opposite) dynamic\b/gi,
];

/**
 * Allowed, but not to be overused (owner decision, 21 Aug). Both are real
 * technical terms in this domain ("Trusted Shops integration") and one sits
 * inside a service name, so a hard fail was wrong: it was inflating the
 * work list by 113 hits that mostly read fine. Flagged only above a
 * per-page density, which is what "do not overuse" actually means.
 */
const SPARING = ["implementation", "integration"];
const SPARING_MAX = 4;

/** Rules apply to English prose. FR and ES have their own vocabulary. */
const LINTED_LOCALES = new Set(["en"]);

/**
 * URLs are exempt. CLAUDE.md already exempts query-string ampersands, and
 * the same logic covers any forbidden word that only appears inside a link
 * target: "/services/localised-e-commerce-integration/" is a slug, not
 * prose. Ten of the 97 "integration" hits were URLs before this stripped
 * them.
 */
const prose = (body) => {
  let s = body.replace(/\]\((?:[^)]+)\)/g, "]()").replace(/https?:\/\/\S+/g, "");
  for (const re of EXEMPT) s = s.replace(re, "");
  return s;
};

function lint(raw) {
  const body = prose(raw);
  const issues = [];

  for (const w of FORBIDDEN) {
    const m = body.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (m) issues.push({ rule: "forbidden-word", detail: m[0].toLowerCase(), count: m.length });
  }

  // Emojis are allowed on social posts, never in site copy. The harvested
  // excerpts are full of them because they were written as social teasers.
  // Same range as copy-fix: U+2600 to U+27BF holds the check mark and
  // the arrow, which the comparison tables use as content.
  const emoji = body.match(
    /[\u{1F000}-\u{1FAFF}]|[\u2705\u2642\u2696\u26A0\u2728\uFE0F]/gu,
  );
  if (emoji) issues.push({ rule: "emoji", detail: "emoji in site copy", count: emoji.length });

  const dashes = body.match(/[—–]/g);
  if (dashes) issues.push({ rule: "dash", detail: "em or en dash", count: dashes.length });

  // Query-string and HTML-entity ampersands are exempt; prose ones are not.
  const amps = body.match(/ & | &amp; /g);
  if (amps) issues.push({ rule: "ampersand", detail: "bare ampersand", count: amps.length });

  const michael = body.match(/\bMichael\b/g);
  if (michael) issues.push({ rule: "brand", detail: "Michael, brand is Mike Bastin", count: michael.length });

  for (const w of SPARING) {
    const m = body.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (m && m.length > SPARING_MAX) {
      issues.push({ rule: "overused", detail: `${w}, ${m.length} times`, count: m.length - SPARING_MAX });
    }
  }

  // Sentence openers. "I" is no longer listed: the voice is "we" now, and
  // a first-person-singular pronoun anywhere is caught by the rule below.
  const openers = body.match(/(?:^|\.\s+)(This|That)\s/gm);
  if (openers) issues.push({ rule: "sentence-opener", detail: "This or That", count: openers.length });

  // Voice. The site speaks as "we", so any singular first person is a miss.
  const singular = body.match(/\b(I|my|me|mine|myself)\b/g);
  if (singular) issues.push({ rule: "voice", detail: "first-person singular", count: singular.length });

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
      const parts = src.split(/^---$/m);
      const body = parts.slice(2).join("---").trim();
      // excerpt and title ship as the meta description and <title>, so
      // they are site copy and the same rules apply. An earlier version
      // linted the body only, which let a run of rejected words sit in
      // the one string Google actually renders under the result.
      const meta = (parts[1] || "")
        .split("\n")
        .filter((l) => /^(excerpt|title):/.test(l))
        .join("\n");
      const issues = lint(body + "\n\n" + meta);
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
