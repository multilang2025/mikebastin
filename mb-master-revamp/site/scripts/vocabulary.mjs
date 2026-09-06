/**
 * Replace the rejected vocabulary with plain words.
 *
 * The rejected list is not a list of wrong words, it is a list of words
 * that signal marketing register: they are the vocabulary the rebuild
 * exists to get away from. Almost all of them have one ordinary English
 * word underneath, and swapping in that word is what the owner is asking
 * for. "Leveraging SEO" was always "using SEO".
 *
 * Two of them do not reduce cleanly and are handled here anyway, with the
 * reasoning attached to the rule:
 *
 *   - "craft" splits on its object. Writing copy is "write", building a
 *     strategy is "build", and the split is decided by the noun that
 *     follows rather than by a default, because "write an SEO strategy"
 *     and "build a narrative" are both wrong.
 *   - "comprehensive" and "seamless" have no replacement because they
 *     carry no meaning in the sentences they appear in. They are deleted,
 *     and the sentence says the same thing with one fewer adjective.
 *
 * "dynamic", "landscape", "transformative" and "ever-evolving" are
 * deliberately absent. Each appears a handful of times in a sentence
 * where the fix is a rewrite, not a substitution, so they stay in the
 * lint as work items.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/en/", import.meta.url).pathname;
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
  return fn(s).replace(RESTORE, (_, i) => stash[+i]);
}

/** Keep the source's capitalisation, since many hits open a sentence. */
const like = (src, word) =>
  src[0] === src[0].toUpperCase() ? word[0].toUpperCase() + word.slice(1) : word;

/** Nouns that make "craft" mean "write" rather than "build". */
const WRITTEN = /^(?:a |an |the |compelling |clear |your |our )*(?:narrative|story|stories|copy|content|message|messages|messaging|subject|headline|headlines|title|titles|description|descriptions|email|emails|post|posts|article|articles|text|line|lines)\b/i;

const PAIRS = [
  [/\b(leverag)(e|es|ed|ing)\b/gi, { e: "use", es: "uses", ed: "used", ing: "using" }],
  [/\b(utilis)(e|es|ed|ing)\b/gi, { e: "use", es: "uses", ed: "used", ing: "using" }],
  [/\b(maximis)(e|es|ed|ing)\b/gi, { e: "increase", es: "increases", ed: "increased", ing: "increasing" }],
  [/\b(elevat)(e|es|ed|ing)\b/gi, { e: "improve", es: "improves", ed: "improved", ing: "improving" }],
  [/\b(facilitat)(e|es|ed|ing)\b/gi, { e: "enable", es: "enables", ed: "enabled", ing: "enabling" }],
  [/\b(delv)(e|es|ed|ing)\b/gi, { e: "look", es: "looks", ed: "looked", ing: "looking" }],
  [/\b(tailor)(|s|ed|ing)\b/gi, { "": "adapt", s: "adapts", ed: "adapted", ing: "adapting" }],
];

const RULES = [
  // Inflected verbs, keyed off the suffix the source used.
  ...PAIRS.map(([re, map]) => (s) =>
    s.replace(re, (m, stem, suffix) => like(m, map[suffix.toLowerCase()]))),

  // "craft", decided by what follows it. The noun senses are excluded up
  // front: "arts and craft spaces" in a school listing is not the verb,
  // and a blanket swap turned it into "arts and build spaces".
  (s) =>
    s.replace(/\b(Craft|craft|Crafts|crafts|Crafted|crafted|Crafting|crafting)\b(?! *(?:spaces?|fairs?|beers?|shops?|markets?)\b)(?<!arts and craft)( +)([^\n.,;:]*)/g,
      (m, verb, gap, rest) => {
        const written = WRITTEN.test(rest);
        const form = verb.toLowerCase();
        const word =
          form === "crafting" ? (written ? "writing" : "building")
          : form === "crafted" ? (written ? "written" : "built")
          : form === "crafts" ? (written ? "writes" : "builds")
          : written ? "write" : "build";
        return like(verb, word) + gap + rest;
      }),

  // Adjectives that carry no meaning in these sentences: delete.
  (s) =>
    s
      .replace(/\b(a|an|A|An) comprehensive (?=[aeiou])/g, (m, art) => like(art, "an") + " ")
      .replace(/\bcomprehensive +/gi, "")
      .replace(/\bseamless +/gi, "")
      .replace(/,? *seamlessly\b/gi, ""),

  // The rest have one plain word underneath.
  (s) =>
    s
      .replace(/\brobust\b/gi, (m) => like(m, "solid"))
      .replace(/\bvital\b/gi, (m) => like(m, "essential"))
      .replace(/\binnovative +/gi, ""),
];

const files = [];
for (const type of readdirSync(CONTENT)) {
  const tp = join(CONTENT, type);
  if (!statSync(tp).isDirectory()) continue;
  for (const f of readdirSync(tp)) if (f.endsWith(".md")) files.push(join(tp, f));
}

let touched = 0;
for (const path of files) {
  const src = readFileSync(path, "utf8");
  const parts = src.split(/^---$/m);
  if (parts.length < 3) continue;
  const fmBefore = parts.slice(0, 2).join("---") + "---";
  const fm = fmBefore.replace(/^(excerpt|title): "(.*)"$/gm, (m, key, val) =>
    `${key}: "${onProse(val, (s) => RULES.reduce((acc, r) => r(acc), s))}"`);
  const before = parts.slice(2).join("---");
  const after = onProse(before, (s) => RULES.reduce((acc, r) => r(acc), s));
  if (after !== before || fm !== fmBefore) {
    touched++;
    if (!DRY) writeFileSync(path, fm + after);
  }
}
console.log(DRY ? "dry run" : "applied");
console.log(`  files changed: ${touched}`);
