#!/usr/bin/env node
/**
 * The French copy lint (docs/FR-REBUILD-PLAN.md, phase 3: "a French copy
 * lint: vouvoiement, a non-breaking space before : ; ! ?, French quotation
 * marks, sentence-case headings, and the French forbidden words, alongside
 * the existing EN lints").
 *
 * The English lints skip French on purpose (copy-lint-code.mjs misread
 * "même" as the first-person "me"), so until now nothing checked the French
 * pages at all. Like copy-jargon-lint.mjs and negative-wording-lint.mjs it
 * reads the built output, so hand-built routes and markdown pages are
 * checked alike, and only pages that actually ship under /fr/.
 *
 * What it checks, per page, on visible text (blockquotes excluded: reviews
 * and quoted sources stay verbatim):
 *
 *   voice        "nous", never "je": the site speaks as "we" in every locale
 *                (CLAUDE.md, owner 21 Aug 2026)
 *   register     "vous", never "tu": French is vouvoiement (STYLE-GUIDE
 *                section 9, owner 29 Sep 2026)
 *   formal       no "ça", no "on" for "nous", no exclamation marks (owner,
 *                30 Sep 2026: "French should be formal")
 *   spacing      a non-breaking space before : ; ? ! (and none missing)
 *   quotes       « » rather than straight double quotes
 *   spelling     localisation, optimiser: the US spellings are an English
 *                search-volume exception that does not travel
 *   experience   "plus de deux décennies", never 25 ans or a start year
 *                (owner, 27 Sep 2026)
 *   headings     sentence case: no Title Case Across Every Word
 *   vocabulary   the French rendering of the forbidden list
 *   english      untranslated English left in a French page
 *
 *   node scripts/fr-copy-lint.mjs            fail on any hit
 *   node scripts/fr-copy-lint.mjs --report   count per rule and page, never fails
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out", "fr");
const REPORT = process.argv.includes("--report");

if (!existsSync(OUT)) {
  console.error("no out/fr/ directory: run `npm run build` first");
  process.exit(1);
}

// Letters, including accented ones, for word boundaries JavaScript's \b
// does not understand ("icône" is not "ic" + "ne").
const L = "\\p{L}";
const word = (w) => new RegExp(`(?<![${L}’'])(?:${w})(?![${L}])`, "iu");

const RULES = [
  { id: "voice", re: new RegExp(`(?<![${L}])(je|j[’'](?=${L})|moi-même|mon|ma|mes)(?![${L}])`, "u"),
    fix: "nous, notre, nos: the site speaks as \"we\"" },
  // "ton" is left out: "le ton" (the tone) is far more common on this site
  // than the pronoun, and a "ton" addressing the reader brings a "tu" with it.
  { id: "register", re: new RegExp(`(?<![${L}-])(tu|toi|tes)(?![${L}])`, "u"),
    fix: "vouvoiement: vous, votre, vos" },
  { id: "spacing", re: /(\S) ([:;?!])(?=\s|$|[»")])/u, fix: "non-breaking space (U+00A0) before : ; ? !" },
  { id: "spacing", re: new RegExp(`[${L}»)][;?!](?=\\s|$)`, "u"), fix: "missing non-breaking space before ; ? !" },
  { id: "quotes", re: /"[^"]{2,}"/u, fix: "« » with non-breaking spaces inside" },
  { id: "spelling", re: /optimiz|localiz|Localiz|Optimiz/u, fix: "optimiser, localisation" },
  { id: "experience", re: /\b25 (ans|années)\b|vingt-cinq ans|depuis 1999/iu, fix: "plus de deux décennies" },
  // Formal register (owner, 30 Sep 2026: "French should be formal"): written
  // French for a buyer, so no "ça", no "on" standing in for "nous", no
  // exclamation marks in running text.
  { id: "formal", re: new RegExp(`(?<![${L}’'])(ça|Ça)(?![${L}])|(?<![${L}’'])[Oo]n (?=[a-zéèêàâîôû])|[${L}]\u00a0?!`, "u"),
    fix: "formal register: cela, nous or a passive, no exclamation mark" },
  // Untranslated English: three or more English function words in one run
  // of text. Product and tool names ("Google Business Profile") carry none.
  { id: "english", test: (t) => (t.match(/(?<![\p{L}])(the|and|with|your|for|is|are|of|to|that|this|you|we|our|will|can|by)(?![\p{L}])/giu) || []).length >= 3,
    fix: "translate: English text on a French page" },
  { id: "vocabulary",
    re: word("exhaustif|exhaustive|exhaustifs|sur mesure|sur-mesure|sans couture|tirer parti|innovant|innovante|innovants|robuste|robustes|transformateur|transformatrice|en constante évolution|en conclusion|il est important de noter|cependant|de plus,|en outre|incontournable|incontournables"),
    fix: "the French forbidden list (mirrors the English one in CLAUDE.md)" },
];

function pages(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (entry === "index.html") found.push(p);
  }
  return found;
}

const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");

/** Visible text nodes of <main>, one string per node. */
function texts(html) {
  const main = html.slice(Math.max(0, html.indexOf("<main")));
  const clean = main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, "")
    .replace(/<code[\s\S]*?<\/code>/gi, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "");
  // Inline tags (<a>, <strong>, <em>) split a sentence into nodes; join them
  // so "chose<strong> :</strong>" is read as one run of text.
  const flat = clean.replace(/<\/?(a|strong|em|b|i|span|abbr)(\s[^>]*)?>/gi, "");
  return flat
    .split(/<[^>]+>/)
    .map((t) => decode(t).replace(/[ \t\r\n]+/g, " ").trim())
    .filter((t) => /\p{L}/u.test(t));
}

const headingsOf = (html) =>
  [...html.slice(Math.max(0, html.indexOf("<main"))).matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) =>
    decode(m[2].replace(/<[^>]+>/g, "")).trim()
  );

/**
 * Title Case: three or more words after the first capitalised, excluding
 * proper nouns and acronyms we cannot tell apart from a capitalised common
 * noun, so the rule only fires on a heading where most words are capped.
 */
function titleCase(h) {
  const words = h.split(/\s+/).filter((w) => /^\p{L}/u.test(w)).slice(1);
  if (words.length < 3) return false;
  const lower = words.filter((w) => w.length > 3 && /^\p{Ll}/u.test(w)).length;
  const upper = words.filter((w) => w.length > 3 && /^\p{Lu}\p{Ll}/u.test(w)).length;
  return upper >= 3 && upper > lower;
}

const hits = [];
for (const file of pages(OUT)) {
  const route = "/fr" + file.replace(OUT, "").replace(/\/index\.html$/, "") + "/";
  const html = readFileSync(file, "utf8");
  const seen = new Set();
  for (const t of texts(html)) {
    // A query or prompt the reader types, quoted in « », keeps its own
    // wording: "Comment améliorer le référencement de mon site ?" is the
    // searcher speaking, not the site.
    const own = t.replace(/«[^»]*»/gu, "« »");
    // English proper names of a discipline keep their English spelling.
    const named = t.replace(/(Generative Engine|Search Everywhere|Answer Engine) Optimi[sz]ation/gu, "");
    for (const r of RULES) {
      const subject = r.id === "voice" || r.id === "register" || r.id === "formal" ? own : r.id === "spelling" ? named : t;
      const m = r.test ? (r.test(subject) ? { index: 0 } : null) : subject.match(r.re);
      if (!m) continue;
      const key = `${r.id}|${t}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const at = m.index ?? 0;
      hits.push({ route, rule: r.id, fix: r.fix, context: subject.slice(Math.max(0, at - 50), at + 60) });
    }
  }
  for (const h of headingsOf(html)) {
    if (titleCase(h)) hits.push({ route, rule: "headings", fix: "sentence case", context: h });
  }
}

// Shared strings (footer, menu) repeat on every page: count them once.
const unique = [];
const once = new Set();
for (const h of hits) {
  const k = `${h.rule}|${h.context}`;
  if (once.has(k)) continue;
  once.add(k);
  unique.push(h);
}

if (REPORT) {
  const byRule = new Map();
  for (const h of unique) byRule.set(h.rule, (byRule.get(h.rule) || 0) + 1);
  console.log(`French copy: ${unique.length} findings`);
  for (const [r, n] of byRule) console.log(`  ${r.padEnd(11)} ${n}`);
  const byRoute = new Map();
  for (const h of unique) byRoute.set(h.route, (byRoute.get(h.route) || 0) + 1);
  for (const [r, n] of [...byRoute].sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`  ${String(n).padStart(4)}  ${r}`);
  process.exit(0);
}

if (unique.length === 0) {
  console.log(`clean: ${pages(OUT).length} French pages pass voice, register, formal register, spacing, quotes, spelling, experience, headings and vocabulary`);
  process.exit(0);
}

const byRoute = new Map();
for (const h of unique) {
  if (!byRoute.has(h.route)) byRoute.set(h.route, []);
  byRoute.get(h.route).push(h);
}
console.error(`\n${unique.length} French copy findings on ${byRoute.size} pages\n`);
for (const [route, list] of byRoute) {
  console.error(route);
  for (const h of list) console.error(`  [${h.rule}] ...${h.context}...  (${h.fix})`);
}
process.exit(1);
