/**
 * Move the English copy from first-person singular to first-person plural.
 *
 * Owner decision: the site speaks as "we". It also settles the older open
 * question about voice, since four of the ten Google reviews already say
 * "Mike and his team" rather than "Mike".
 *
 * Only two verbs are irregular between "I" and "we", so the rest of the
 * conversion is pronoun substitution:
 *
 *   I am   -> we are        I was  -> we were
 *   I'm    -> we're         I'd    -> we'd
 *   my     -> our           me     -> us
 *   mine   -> ours          myself -> ourselves
 *
 * Everything else after "I" is already the base verb form that "we" takes
 * ("I read" / "we read", "I do not write" / "we do not write").
 *
 * Two things are protected. Code, URLs and link targets, as in copy-fix.
 * And the standalone Roman numeral "I", because lib/projects.ts numbers the
 * portfolio spreads I to VIII and the first one is not a pronoun. The
 * content directory was checked for "Phase I" style numerals first and has
 * none, so within Markdown a bare "I" is always the pronoun.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/", import.meta.url).pathname;
const DRY = process.argv.includes("--dry");
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

/** Order matters: the irregular verbs have to run before the bare pronoun. */
const RULES = [
  [/\bI am\b/g, "we are"],
  [/\bI was\b/g, "we were"],
  [/\bI'm\b/g, "we're"],
  [/\bI've\b/g, "we've"],
  [/\bI'll\b/g, "we'll"],
  [/\bI'd\b/g, "we'd"],
  [/\bmyself\b/g, "ourselves"],
  [/\bMyself\b/g, "Ourselves"],
  [/\bmine\b/g, "ours"],
  [/\bmy\b/g, "our"],
  [/\bMy\b/g, "Our"],
  [/\bI\b/g, "we"],
];

/**
 * "me" is the risky one: it collides with nothing grammatically, but a
 * blanket swap also hits "me" inside quoted client speech. The content was
 * checked and its only block quotes are the owner's own pull quotes, so the
 * swap is safe here. Kept separate so the reason travels with the rule.
 */
const ME = [
  [/\bme\b/g, "us"],
  [/\bMe\b/g, "Us"],
];

/** Sentence-start capitalisation, applied after substitution. */
function recapitalise(s) {
  return s
    .replace(/(^|[.!?]\s+|\n)we\b/g, (m, p) => p + "We")
    .replace(/(^|[.!?]\s+|\n)our\b/g, (m, p) => p + "Our")
    .replace(/(^|[.!?]\s+|\n)us\b/g, (m, p) => p + "Us")
    // Headings and list items start a line too.
    .replace(/(^#{1,6} |^[-*] |^\d+\. )we\b/gm, "$1We")
    .replace(/(^#{1,6} |^[-*] |^\d+\. )our\b/gm, "$1Our");
}

const files = [];
for (const type of readdirSync(join(CONTENT, "en"))) {
  const tp = join(CONTENT, "en", type);
  if (!statSync(tp).isDirectory()) continue;
  for (const f of readdirSync(tp)) {
    if (f.endsWith(".md")) files.push(join(tp, f));
  }
}

let touched = 0;
let subs = 0;

for (const path of files) {
  const src = readFileSync(path, "utf8");
  const parts = src.split(/^---$/m);
  if (parts.length < 3) continue;
  // The excerpt and title become the page's meta description and <title>,
  // so they carry the voice too. Every other frontmatter key is an
  // identifier (slug, group, sourceUrl) and must not be touched.
  const fmBefore = parts.slice(0, 2).join("---") + "---";
  let fm = fmBefore;
  fm = fm.replace(/^(excerpt|title): "(.*)"$/gm, (m, key, val) => {
    let v = val;
    for (const [re, to] of [...RULES, ...ME]) v = v.replace(re, to);
    v = v.replace(/(^|[.!?]\s+)we\b/g, (x, pre) => pre + "We")
         .replace(/(^|[.!?]\s+)our\b/g, (x, pre) => pre + "Our");
    return `${key}: "${v}"`;
  });
  const before = parts.slice(2).join("---");

  const after = onProse(before, (s) => {
    for (const [re, to] of [...RULES, ...ME]) {
      const hits = s.match(re);
      if (hits) subs += hits.length;
      s = s.replace(re, to);
    }
    return recapitalise(s);
  });

  if (after !== before || fm !== fmBefore) {
    touched++;
    if (!DRY) writeFileSync(path, fm + after);
  }
}

console.log(DRY ? "dry run, nothing written" : "applied");
console.log(`  files changed:  ${touched}`);
console.log(`  substitutions:  ${subs}`);
