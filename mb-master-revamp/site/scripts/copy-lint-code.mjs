/**
 * Lint the copy that lives in code, not in content/.
 *
 * copy-lint.mjs covers content/, which was the whole corpus when it was
 * written. It is not any more: the nav labels, the footer, the service
 * names in lib/services.ts and every headline on a hand-built page are
 * copy too, and none of it was being checked. Three first-person strings
 * had been sitting in components/ and lib/ since the voice decision,
 * including the footer heading on every page of the site.
 *
 * Only string and text content is linted. Identifiers, class names, imports
 * and props are code, and a rule about "however" has no business firing on
 * a variable.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";

const ROOT = new URL("../", import.meta.url).pathname;
const DIRS = ["app", "components", "lib"];

/**
 * lib/testimonials.ts holds reviewers' own words, which are quoted
 * verbatim and never edited to fit our rules. CLAUDE.md exempts them
 * explicitly.
 */
const EXEMPT_FILES = [/lib\/testimonials\.ts$/];

const FORBIDDEN = [
  "comprehensive", "tailor(?:ed|ing|s)?", "seamless(?:ly)?",
  "leverag(?:e|es|ed|ing)", "elevat(?:e|es|ed|ing)", "craft(?:s|ed|ing)?",
  "maximis(?:e|es|ed|ing)", "facilitat(?:e|es|ed|ing)", "landscape",
  "utilis(?:e|es|ed|ing)", "innovative", "robust", "delv(?:e|es|ed|ing)",
  "transformative", "vital", "dynamic", "ever-evolving",
  "moreover", "however", "thus", "hence", "additionally",
];

/**
 * Two exemptions the content lint does not need.
 *
 * The portfolio spreads are numbered I to VIII, so a bare "I" in
 * lib/projects.ts and ConsolidationDiagram.tsx is a Roman numeral, not a
 * pronoun. And rel="me" is the microformat that links a profile back to
 * its owner, which is markup rather than prose.
 */
const EXEMPT = [
  /\brel="[^"]*\bme\b[^"]*"/g,
  /\bnumeral:\s*"[IVX]+"/g,
];

/** Strings, JSX text, and nothing else. */
function copyStrings(src) {
  const out = [];
  // Double- and single-quoted string literals, and template literals.
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)) {
    out.push(m[1] ?? m[2] ?? m[3] ?? "");
  }
  // JSX text nodes: between > and <, with no braces (those are expressions).
  for (const m of src.matchAll(/>([^<>{}]+)</g)) out.push(m[1]);
  return out
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    // A className, a path, an import specifier or a token reference is not copy.
    .filter((s) => !/^[a-z0-9/@._-]+$/i.test(s))
    .filter((s) => !/^var\(--/.test(s))
    .filter((s) => !/^(?:https?:|mailto:|tel:|data:)/.test(s));
}

const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(p)) files.push(p);
  }
})(join(ROOT, DIRS[0]));
for (const d of DIRS.slice(1)) {
  (function walk(dir) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(tsx?|jsx?)$/.test(p)) files.push(p);
    }
  })(join(ROOT, d));
}

let fails = 0;
for (const path of files) {
  const rel = relative(ROOT, path);
  if (EXEMPT_FILES.some((re) => re.test(rel))) continue;
  let src = readFileSync(path, "utf8");
  for (const re of EXEMPT) src = src.replace(re, "");

  const issues = [];
  for (const line of copyStrings(src)) {
    for (const w of FORBIDDEN) {
      if (new RegExp(`\\b${w}\\b`, "i").test(line)) issues.push([`forbidden: ${w}`, line]);
    }
    if (/[—–]/.test(line)) issues.push(["em or en dash", line]);
    if (/\s&\s/.test(line)) issues.push(["bare ampersand", line]);
    if (/\bMichael\b/.test(line)) issues.push(["Michael, brand is Mike Bastin", line]);
    if (/\b(I|my|me|mine|myself)\b/.test(line)) issues.push(["first-person singular", line]);
    if (/^(This|That)\s/.test(line)) issues.push(["This or That opener", line]);
  }
  if (issues.length) {
    fails += issues.length;
    console.log(`\n${rel}`);
    for (const [rule, line] of issues) console.log(`  ${rule.padEnd(34)} ${line.slice(0, 90)}`);
  }
}

console.log(`\nlinted ${files.length} source files in ${DIRS.join(", ")}`);
console.log(fails ? `${fails} violations` : "clean");
process.exit(fails ? 1 : 0);
