/**
 * Apply only the copy fixes that are safe to make mechanically.
 *
 * Three of the rule violations have exactly one correct answer, so a script
 * can make them without judgement:
 *
 *   - "Michael" -> "Mike Bastin". The brand rule in CLAUDE.md is absolute,
 *     and every hit is the same author byline on the service pages.
 *   - " & " -> " and ". URLs and code are left alone.
 *   - Em and en dashes. Spaced dashes become a comma, a dash between two
 *     numbers becomes "to", per the ranges rule.
 *
 * Everything else is deliberately left for a human or a careful editing
 * pass. Rewriting a sentence that opens with "This" changes meaning, and
 * choosing a replacement for "comprehensive" depends on what the sentence
 * is actually claiming. A script that guessed at those would produce copy
 * that passes the lint and reads worse, which is the opposite of the point.
 *
 * Code fences and inline code are protected throughout.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");

/**
 * Run `fn` over prose only, leaving fenced blocks, inline code and URLs.
 *
 * The placeholder is delimited by a character the source cannot contain.
 * An earlier version wrapped the index in spaces and corrupted real text:
 * "25 years of work" round-tripped to "undefined years of work", because
 * the restore pattern matched an ordinary spaced number in the prose.
 * Caught on a test case before it touched 124 content files.
 */
const SENTINEL = String.fromCharCode(0);
const RESTORE = new RegExp(SENTINEL + "(\\d+)" + SENTINEL, "g");

function onProse(text, fn) {
  const stash = [];
  const keep = (m) => SENTINEL + (stash.push(m) - 1) + SENTINEL;
  let s = text
    .replace(/```[\s\S]*?```/g, keep)
    .replace(/`[^`\n]*`/g, keep)
    .replace(/\]\([^)]*\)/g, keep)
    .replace(/https?:\/\/\S+/g, keep);
  s = fn(s);
  return s.replace(RESTORE, (_, i) => stash[+i]);
}

const FIXES = [
  {
    name: "brand",
    apply: (s) =>
      s
        .replace(/\bMichael\s+Bastin\b/g, "Mike Bastin")
        .replace(/\bMichael\b(?!\s+Bastin)/g, "Mike Bastin"),
  },
  {
    name: "ampersand",
    apply: (s) => s.replace(/ +&(?:amp;)? +/g, " and "),
  },
  {
    name: "dash",
    apply: (s) =>
      s
        // A dash between two numbers is a range.
        .replace(/(\d)\s*[—–]\s*(\d)/g, "$1 to $2")
        // A spaced dash is parenthetical punctuation.
        .replace(/ +[—–] +/g, ", ")
        // An unspaced dash joining words.
        .replace(/(\w)[—–](\w)/g, "$1, $2")
        // Anything left over.
        .replace(/[—–]/g, ", "),
  },
];

const files = [];
for (const locale of readdirSync(CONTENT)) {
  const lp = join(CONTENT, locale);
  if (!statSync(lp).isDirectory()) continue;
  for (const type of readdirSync(lp)) {
    const tp = join(lp, type);
    if (!statSync(tp).isDirectory()) continue;
    for (const f of readdirSync(tp)) {
      if (f.endsWith(".md")) files.push({ path: join(tp, f), locale, type, slug: f.slice(0, -3) });
    }
  }
}

const tally = {};
let touched = 0;

for (const f of files) {
  const src = readFileSync(f.path, "utf8");
  const parts = src.split(/^---$/m);
  if (parts.length < 3) continue;
  const fm = parts.slice(0, 2).join("---") + "---";
  let body = parts.slice(2).join("---");
  const before = body;

  for (const fix of FIXES) {
    const prev = body;
    body = onProse(body, fix.apply);
    if (body !== prev) tally[fix.name] = (tally[fix.name] || 0) + 1;
  }

  if (body !== before) {
    touched++;
    if (!DRY) writeFileSync(f.path, fm + body);
  }
}

console.log(DRY ? "dry run, nothing written" : "applied");
console.log(`  files changed: ${touched}`);
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(10)} ${v} files`);
}
