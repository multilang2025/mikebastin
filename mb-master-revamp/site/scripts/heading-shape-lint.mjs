#!/usr/bin/env node
/**
 * The h1 is three to five words and carries the keyword. An h2 follows it.
 *
 * Owner rule, 21 September 2026, given as a hard rule, so it is a build
 * failure rather than an agent's good intention. Measured before the rule
 * landed: 5 of 26 commercial pages had an h1 in range. Six were over, and
 * most service pages were under at two words ("Dutch SEO", "AI
 * consulting"), which is its own kind of miss: a two-word h1 leaves the
 * buyer vocabulary on the table on a page whose whole job is to be found.
 *
 * Why both halves matter. A three-word h1 has room for the term and
 * nothing else, so the qualifying detail and the secondary terms need
 * somewhere to go, and the h2 directly beneath is that place. An h1 alone
 * is a label; an h1 with an h2 under it is a proposition. The h2 echoes
 * the h1 rather than changing the subject.
 *
 * Commercial routes only, for the same reason copy-jargon-lint.mjs is
 * zoned: a blog post's h1 is a headline written for a reader who searched
 * a question, and forcing "How to fix hreflang on a multilingual site"
 * down to five words would cost the query the post exists to answer.
 * Editorial routes are reported, never failed.
 *
 *   node scripts/heading-shape-lint.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const MIN = 3;
const MAX = 5;

/**
 * English commercial routes. FR and ES are reported, never failed, for two
 * reasons rather than convenience.
 *
 * A word count does not survive translation. "Multilingual SEO agency" is
 * three words; its Spanish equivalent "SEO multilingue" is two and its
 * French "referencement multilingue" is two, because Romance languages
 * carry in prepositions and inflection what English carries in extra
 * nouns. Failing a Spanish h1 for being two words would be enforcing an
 * English sentence shape on a language that does not use one.
 *
 * And FR and ES are deferred by owner decision of 20 Sep 2026: no new
 * French or Spanish surfaces for now, launch is English only. Writing 21
 * localised h2s to clear a lint would be building exactly the surfaces
 * that decision paused, and localisation-qa is clear that a localised
 * heading is an adaptation judged by a native reader, not a translation
 * produced to satisfy a build.
 *
 * So the 21 FR and ES service pages are a known, deliberate gap, printed
 * on every run so nobody mistakes it for an oversight.
 */
const COMMERCIAL = [
  /^\/$/,
  /^\/services(\/|$)/,
  /^\/(contact|how-i-work|results)(\/|$)/,
];
const isCommercial = (r) => COMMERCIAL.some((re) => re.test(r));

/**
 * Utility routes carry a status message, not a proposition. /contact/thanks/
 * exists to confirm a form went through, and "Your message is in" is the
 * right h1 for it whatever the word count says.
 */
const EXEMPT = [/^\/contact\/(thanks|problem)$/, /^\/404$/];
const isExempt = (r) => EXEMPT.some((re) => re.test(r));

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

function pages(dir) {
  const found = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (e === "index.html") found.push(p);
  }
  return found;
}

const strip = (s) =>
  s.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;|&#\d+;/gi, " ").replace(/\s+/g, " ").trim();

const fails = [];
const noted = [];
let checked = 0;

for (const file of pages(OUT)) {
  const html = readFileSync(file, "utf8");
  const route = file.replace(OUT, "").replace(/\/index\.html$/, "") || "/";
  if (isExempt(route)) continue;

  const main = html.slice(html.indexOf("<main"));
  const h1m = main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1m) continue;

  const h1 = strip(h1m[1]);
  const words = h1.split(" ").filter(Boolean).length;

  // Is there an h2 anywhere after the h1? The rule wants one directly
  // beneath, but a template may wrap it, so proximity is measured in
  // stripped characters rather than by DOM adjacency.
  const after = main.slice(h1m.index + h1m[0].length);
  const h2m = after.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const gap = h2m ? strip(after.slice(0, h2m.index)).length : Infinity;

  const problems = [];
  if (words < MIN || words > MAX) problems.push(`h1 is ${words} words, wanted ${MIN} to ${MAX}`);
  if (!h2m) problems.push("no h2 follows the h1");
  else if (gap > 120) problems.push(`h2 is ${gap} characters below the h1, not directly beneath it`);

  if (!isCommercial(route)) {
    if (problems.length) noted.push({ route, h1, problems });
    continue;
  }
  checked++;
  if (problems.length) fails.push({ route, h1, problems });
}

console.log(`checked the heading shape of ${checked} commercial pages`);
if (noted.length) {
  console.log(
    `${noted.length} pages differ and are not failed: a post's h1 is a headline ` +
      `answering a searched question, and the FR and ES service pages are a ` +
      `deferred locale whose word counts do not map onto an English rule.`
  );
}

if (!fails.length) {
  console.log(`clean: every commercial h1 is ${MIN} to ${MAX} words with an h2 beneath it`);
  process.exit(0);
}

console.error(`\n${fails.length} commercial pages break the heading rule\n`);
for (const f of fails) {
  console.error(`${f.route}`);
  console.error(`  h1: ${f.h1}`);
  for (const p of f.problems) console.error(`  - ${p}`);
}
console.error(
  "\nThe h1 is three to five words carrying the term the page is trying to\n" +
    "win. The longer, smaller h2 beneath it echoes the h1 and carries the\n" +
    "detail a three-word heading has no room for. Owner rule, 21 Sep 2026.\n" +
    "See .claude/skills/mb-copy-voice/SKILL.md."
);
process.exit(1);
