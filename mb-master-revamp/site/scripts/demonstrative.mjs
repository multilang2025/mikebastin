/**
 * Retire the sentence-opening "This" / "That" where a determiner swap is
 * enough, and leave the rest for a human pass.
 *
 * The rule in CLAUDE.md is about openers that make the reader look
 * backwards to work out what the sentence is about. Two shapes exist in
 * this content and only one of them is mechanical:
 *
 *   "This approach works."  -> "The approach works."   noun phrase, safe
 *   "This means the site."  -> needs a real subject,   pronoun, not safe
 *
 * In the first shape the demonstrative is already doing nothing the
 * definite article does not do, because the noun itself carries the
 * reference. In the second the demonstrative *is* the subject, so
 * swapping the determiner would produce nonsense and naming the referent
 * is an editorial decision, not a substitution.
 *
 * The head words were enumerated from the actual content rather than
 * guessed, so this is an allowlist: a new noun in future copy is left
 * alone and shows up in the lint instead of being silently rewritten.
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

/**
 * Nouns and adjectives that head a real noun phrase after the opener.
 *
 * The self-referential heads are deliberately absent: "guide", "article",
 * "post", "section" and "list" point at the page the reader is already on,
 * and "The guide walks you through" reads as though it were describing
 * some other document. Those are rewritten by hand instead.
 */
const HEADS = [
  "Mediterranean", "approach", "architecture", "article", "belief",
  "bureaucratic", "central", "community", "competition", "connectivity",
  "consistent", "cultural", "data", "deliberate", "editing", "extension",
  "feature", "forward", "growing", "holistic", "hybrid",
  "information", "linguistic", "method", "mindset", "new",
  "nuance", "philosophy", "proactive", "process", "same", "scale",
  "selection", "sense", "specialization", "speed", "systematic",
  "technological", "thorough", "trendy", "trust", "vision",
];

const OPENER = new RegExp(
  "(^|\\n|(?:[.!?] )|(?:^|\\n)#{1,6} |(?:^|\\n)[-*]\\s+|(?:^|\\n)\\d+\\.\\s+)" +
    "(?:This|That) (" + HEADS.join("|") + ")\\b",
  "g",
);

const files = [];
for (const type of readdirSync(CONTENT)) {
  const tp = join(CONTENT, type);
  if (!statSync(tp).isDirectory()) continue;
  for (const f of readdirSync(tp)) if (f.endsWith(".md")) files.push(join(tp, f));
}

let touched = 0;
let subs = 0;
for (const path of files) {
  const src = readFileSync(path, "utf8");
  const parts = src.split(/^---$/m);
  if (parts.length < 3) continue;
  const fm = parts.slice(0, 2).join("---") + "---";
  const before = parts.slice(2).join("---");
  const after = onProse(before, (s) =>
    s.replace(OPENER, (m, pre, head) => {
      subs++;
      return pre + "The " + head;
    }),
  );
  if (after !== before) {
    touched++;
    if (!DRY) writeFileSync(path, fm + after);
  }
}
console.log(DRY ? "dry run" : "applied");
console.log(`  files changed: ${touched}`);
console.log(`  openers fixed: ${subs}`);
