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

/**
 * US spellings, in a site written in UK English.
 *
 * copy-lint.mjs has checked content/ for these since September; this file
 * never did, and "Every locale gets the same rigor" sat in the homepage's
 * "Why it works" cards the whole time. A rule about spelling that runs on
 * half the copy catches half the mistakes.
 *
 * `color` and `center` are deliberately absent. Both are CSS, and Tailwind
 * class strings reach copyStrings() because they contain spaces, so
 * including either would fail the build on `items-center`.
 */
const US_SPELLINGS = [
  "rigor", "rigors", "behavior(?:s|al)?", "favor(?:s|ed|ite|ites)?",
  "honor(?:s|ed)?", "labor(?:s|ed)?", "catalog(?:s|ed)?",
  "organiz(?:e|es|ed|ing|ation|ations)", "recogniz(?:e|es|ed|ing|able)",
  // optimiz* and localiz* are deliberately absent. Owner decision,
  // 21 Sep 2026: "It's international and volume based SEO. Adjust
  // spelling." The two word families are the site's own product
  // vocabulary and the demand is on the US form, measured rather than
  // assumed: seo optimization 29,000 against optimisation 5,500,
  // generative engine optimization 26,000 against 3,800, localization
  // services 2,800 against 600. Everything else in this list stays,
  // because "behavior" and "catalog" are not products this practice
  // sells and carry no such argument.
  "specializ(?:e|es|ed|ing|ation)", "analyz(?:e|es|ed|ing)",
  "prioritiz(?:e|es|ed|ing)", "customiz(?:e|es|ed|ing|ation)",
  "traveled", "traveling", "modeling", "canceled", "defense", "offense",
];

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
  // Comments are not copy. The JSX-text pass matches anything between a
  // `>` and a `<`, which happily spans a closing tag, a doc comment and
  // the next line of code, so a US-spelling rule read the slug key in
  // components/ServiceIcon.tsx as prose. Stripping comments first fixes
  // that for every rule, not only the new one. Only whole-line `//` goes,
  // since a trailing one cannot be told from the `//` in a URL.
  src = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

  // An `author:` value names somebody else: a photographer credited in
  // lib/blog-images.ts, not anything a visitor reads. Without this, a
  // public domain photograph by a Michael fails the house rule about the
  // brand being Mike Bastin, which the rule was never about. A `legacy:`
  // value is the same kind of thing, a filename on Commons or a
  // WordPress upload path. Neither goes near a page, so neither is copy.
  src = src.replace(/\b(?:author|legacy):\s*(["'`])(?:[^\\]|\\.)*?\1/g, "x: \"\"");

  // A `term:` value in lib/keywords.ts is a search query quoted verbatim
  // from Ahrefs, and the whole point of it is to record what people
  // actually type. Some of that demand sits on US spellings: "website
  // localization" draws 2,800 a month against 350 for the UK form, and
  // every "generative engine optimization" variant is US-spelled. British
  // English is the rule for copy a visitor reads; a keyword is research
  // data, and correcting it would not fix a spelling, it would falsify a
  // figure. The conflict itself is recorded in that file's `note` fields
  // for the owner to decide, which is a decision, not a typo.
  src = src.replace(/\bterm:\s*(["'`])(?:[^\\]|\\.)*?\1/g, "x: \"\"");
  // Double- and single-quoted string literals, and template literals.
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)) {
    out.push(m[1] ?? m[2] ?? m[3] ?? "");
  }
  // JSX text nodes: between > and <, with no braces (those are expressions).
  //
  // A `>` and the next `<` can sit on different lines with code between
  // them, as they do after a `</>` in components/ServiceIcon.tsx, so the
  // span picked up an object key and read it as prose. Anything carrying
  // the punctuation of code rather than of a sentence is dropped.
  const LOOKS_LIKE_CODE = /\)\s*,|["'`]\s*:|=>|;\s*$/m;
  for (const m of src.matchAll(/>([^<>{}]+)</g)) {
    if (!LOOKS_LIKE_CODE.test(m[1])) out.push(m[1]);
  }
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

  // HANDOFF.md section 4: a heading must be grammatical, so it can never be
  // built by case-shifting a label. `name.toLowerCase()` turns SEO into seo
  // and French into french; a label dropped in unchanged capitalises
  // mid-sentence. Both shipped in an h2 on all nineteen service pages.
  // Store the mid-sentence form instead (Service.inline, CLUSTER_INLINE).
  // Eyebrows are exempt: they may carry the keyword-shaped approximation.
  for (const m of src.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
    if (/\{[^}]*\.to(Lower|Upper)Case\(\)[^}]*\}/.test(m[1])) {
      issues.push(["case-shifted heading", m[1].replace(/\s+/g, " ").trim()]);
    }
  }

  for (const raw of copyStrings(src)) {
    // Backticks mark a term quoted verbatim, which in lib/services.ts is
    // always a real search query: `generative engine optimization` is how
    // buyers spell it, whatever the service is called. Quoting a keyword
    // is reporting, so no prose rule applies inside the ticks.
    const line = raw.replace(/`[^`]*`/g, " ");
    for (const w of FORBIDDEN) {
      if (new RegExp(`\\b${w}\\b`, "i").test(line)) issues.push([`forbidden: ${w}`, line]);
    }
    if (/[—–]/.test(line)) issues.push(["em or en dash", line]);
    if (/\s&\s/.test(line)) issues.push(["bare ampersand", line]);
    if (/\bMichael\b/.test(line)) issues.push(["Michael, brand is Mike Bastin", line]);
    for (const w of US_SPELLINGS) {
      if (new RegExp(`\\b${w}\\b`, "i").test(line)) issues.push([`US spelling: ${w.split("(")[0]}`, line]);
    }
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
