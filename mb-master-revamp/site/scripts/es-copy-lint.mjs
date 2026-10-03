#!/usr/bin/env node
/**
 * The Spanish copy lint (docs/ES-REBUILD-PLAN.md, phase 5): the twin of
 * fr-copy-lint.mjs. The English lints skip Spanish on purpose (their rules
 * are English), so until now nothing checked the Spanish pages at all.
 *
 * Like the French lint it reads the built output, so hand-built routes and
 * markdown pages are checked alike, and only pages that ship under /es/.
 * Visible text only; blockquotes and code are excluded (reviews and quoted
 * sources stay verbatim).
 *
 *   voice        "nosotros", never "yo/mi/mis/soy": the site speaks as "we"
 *                in every locale (CLAUDE.md, owner 21 Aug 2026)
 *   register     "tú", never "usted/ustedes" (owner, 29 Sep 2026)
 *   punctuation  ¿ ¡ paired with ? !; « » or “ ”, never straight " "
 *   experience   "más de dos décadas", never 25 años or a start year
 *   vocabulary   the Spanish rendering of the forbidden list
 *   english      untranslated English left in a Spanish page
 *   headings     sentence case: no Title Case Across Every Word
 *
 *   node scripts/es-copy-lint.mjs            fail on any hit
 *   node scripts/es-copy-lint.mjs --report   count per rule and page, never fails
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out", "es");
const REPORT = process.argv.includes("--report");

if (!existsSync(OUT)) {
  console.error("no out/es/ directory: run `npm run build` first");
  process.exit(1);
}

const L = "\\p{L}";
const word = (w) => new RegExp(`(?<![${L}])(?:${w})(?![${L}])`, "iu");

const RULES = [
  { id: "voice", re: new RegExp(`(?<![${L}])(yo|mi|mis|mío|mía|míos|mías|conmigo|soy|estoy)(?![${L}])`, "u"),
    fix: "nosotros, nuestro, nos: the site speaks as \"we\"" },
  { id: "register", re: word("usted|ustedes"), fix: "tú: tu, tus, te, contigo (never usted)" },
  { id: "punctuation", test: (t) => /[^¿]*\?/.test(t) && sentencesOf(t).some((s) => /\?\s*$/.test(s) && !s.includes("¿")),
    fix: "open with ¿ (and ¡ before !)" },
  { id: "punctuation", re: /"[^"]{2,}"/u, fix: "« » or “ ”, not straight quotes" },
  { id: "experience", re: /\b25 años\b|veinticinco años|desde 1999/iu, fix: "más de dos décadas" },
  { id: "vocabulary",
    re: word("exhaustiv[oa]s?|a medida(?! que)|sin fisuras|sin costuras|innovador[ae]?s?|robust[oa]s?|transformador[ae]?s?|en constante evolución|en conclusión|es importante señalar|es importante destacar|sin embargo|no obstante|asimismo"),
    fix: "the Spanish forbidden list (mirrors the English one in CLAUDE.md)" },
  { id: "vocabulary", re: /(^|[.!?]\s+)Además,/u, fix: "\"Además,\" opener (forbidden: additionally)" },
  { id: "english",
    test: (t) => (t.match(/(?<![\p{L}])(the|and|with|your|for|is|are|of|to|that|this|you|we|our|will|can|by)(?![\p{L}])/giu) || []).length >= 3,
    fix: "translate: English text on a Spanish page" },
];

function sentencesOf(t) {
  return t.split(/(?<=[.!?])\s+/).filter(Boolean);
}

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

function texts(html) {
  const main = html.slice(Math.max(0, html.indexOf("<main")));
  const clean = main
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, "")
    .replace(/<code[\s\S]*?<\/code>/gi, "")
    .replace(/<pre[\s\S]*?<\/pre>/gi, "");
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

// Product and platform names keep their capitals in Spanish.
const NAMES = /Perfil de Empresa de Google|Google Analytics|Search Console|Tag Manager|Generative Engine Optimization|Google Ads|Microsoft Advertising|Core Web Vitals|Link Manager|Interlinks Manager|Autolinks Manager|Screaming Frog|Link Whisper/g;

function titleCase(h0) {
  const h = h0.replace(NAMES, "");
  const words = h.split(/\s+/).filter((w) => /^\p{L}/u.test(w)).slice(1);
  if (words.length < 3) return false;
  const lower = words.filter((w) => w.length > 3 && /^\p{Ll}/u.test(w)).length;
  const upper = words.filter((w) => w.length > 3 && /^\p{Lu}\p{Ll}/u.test(w)).length;
  return upper >= 3 && upper > lower;
}

const hits = [];
for (const file of pages(OUT)) {
  const route = "/es" + file.replace(OUT, "").replace(/\/index\.html$/, "") + "/";
  const html = readFileSync(file, "utf8");
  const seen = new Set();
  for (const t of texts(html)) {
    // A query the reader types, quoted in « » or “ ”, keeps its own wording.
    const own = t.replace(/«[^»]*»|“[^”]*”/gu, "« »");
    for (const r of RULES) {
      const subject = r.id === "voice" || r.id === "register" ? own : t;
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
  console.log(`Spanish copy: ${unique.length} findings`);
  for (const [r, n] of byRule) console.log(`  ${r.padEnd(12)} ${n}`);
  const byRoute = new Map();
  for (const h of unique) byRoute.set(h.route, (byRoute.get(h.route) || 0) + 1);
  for (const [r, n] of [...byRoute].sort((a, b) => b[1] - a[1]).slice(0, 30)) console.log(`  ${String(n).padStart(4)}  ${r}`);
  process.exit(0);
}

if (unique.length === 0) {
  console.log(`clean: ${pages(OUT).length} Spanish pages pass voice, register, punctuation, experience, vocabulary, English leftovers and headings`);
  process.exit(0);
}

const byRoute = new Map();
for (const h of unique) {
  if (!byRoute.has(h.route)) byRoute.set(h.route, []);
  byRoute.get(h.route).push(h);
}
console.error(`\n${unique.length} Spanish copy findings on ${byRoute.size} pages\n`);
for (const [route, list] of byRoute) {
  console.error(route);
  for (const h of list) console.error(`  [${h.rule}] ...${h.context}...  (${h.fix})`);
}
process.exit(1);
