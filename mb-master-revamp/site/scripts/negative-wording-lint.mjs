#!/usr/bin/env node
/**
 * Positive framing, in every locale (docs/STYLE-GUIDE-UK-EU.md section 9).
 *
 * Owner, 29 Sep 2026, on a French billing section that sold by denial
 * ("Aucune marge sur votre budget publicitaire : un budget plus élevé ne
 * nous rapporte rien"): "This is purely negative writing I abhor and don't
 * want reflected across locales." The 28 Sep audit had fixed English
 * headings; this makes the rule mechanical for every locale.
 *
 * Reads the built output, like copy-jargon-lint.mjs, so hand-built routes
 * and markdown pages are checked alike. It fails on a negation in the
 * strings a reader or a search result meets first: the <title>, the meta
 * description, every h1 to h3, every in-body CTA lead, and the hero (the
 * h1 to the end of its section). Body sentences are counted per page and
 * printed with --report, never failed: the copy-editor and
 * localization-qa agents own those, because a negation in a paragraph is
 * sometimes a fact that is false when turned around.
 *
 * Exceptions live in negative-wording-allow.json as exact strings, each
 * with its reason: a verbatim quote, a searched query, a legal distinction.
 *
 *   node scripts/negative-wording-lint.mjs            fail on any hit
 *   node scripts/negative-wording-lint.mjs --report   also list body sentences
 *   ... --report --json <file>                        write both lists as JSON
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(SITE, "out");
const REPORT = process.argv.includes("--report");

const NEG = {
  en: /\b(not|never|no|none|nothing|nobody|without|cannot|can't|don't|doesn't|isn't|aren't|won't|didn't|avoid\w*|mistakes?|fail\w*|lose|loses|losing|lost|wrong|worse|worst|wast\w*|rather than|instead of)\b/i,
  fr: /(?<![\p{L}’'])(?:(ne|pas|jamais|rien|aucun\p{L}*|sans|plutôt que|au lieu de|évit\p{L}*|erreurs?|perd\p{L}*|échecs?)(?![\p{L}])|n[’'](?=\p{L}))/iu,
  es: /(?<![\p{L}])(no|nunca|nada|ning[uú]n\p{L}*|sin|nadie|en lugar de|en vez de|evit\p{L}*|error(es)?|perd\p{L}*|pierd\p{L}*|fracas\p{L}*)(?![\p{L}])/iu,
};
/** Negation as grammar rather than framing. Removed before matching. */
const GLUE = {
  en: /\b(not only|whether or not|no later than|no\.\s*\d)\b/gi,
  fr: /\bnon seulement\b|\bpas à pas\b/gi,
  es: /\bno solo\b|\bno sólo\b/gi,
};

const allowPath = join(SITE, "scripts/negative-wording-allow.json");
const ALLOW = new Set(
  existsSync(allowPath) ? JSON.parse(readFileSync(allowPath, "utf8")).map((a) => a.text) : []
);

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
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
    .replace(/&amp;/g, "and")
    .replace(/&nbsp;|&#160;| /g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ");
const strip = (s) =>
  decode(
    s
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<svg[\s\S]*?<\/svg>/gi, "")
      .replace(/<blockquote[\s\S]*?<\/blockquote>/gi, "")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
const sentences = (t) => t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

function negated(locale, text) {
  if (ALLOW.has(text)) return null;
  const m = text.replace(GLUE[locale], " ").match(NEG[locale]);
  return m ? m[0] : null;
}

const localeOf = (route) => (route.startsWith("/fr/") ? "fr" : route.startsWith("/es/") ? "es" : "en");

const hits = [];
const body = [];
const seen = new Set();

for (const file of pages(OUT)) {
  const route = file.replace(OUT, "").replace(/\/index\.html$/, "") + "/";
  if (route.startsWith("/keystatic")) continue;
  const html = readFileSync(file, "utf8");
  // Post-submit status pages carry a status message, not a proposition.
  // (Not detected by noindex: the whole preview is noindex.)
  if (/\/(thanks|problem|merci|probleme)\/$/.test(route)) continue;
  const locale = localeOf(route);
  const main = html.slice(Math.max(0, html.indexOf("<main")));

  const top = [];
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (title) top.push(["title", decode(title[1]).trim()]);
  const meta = html.match(/<meta name="description" content="([^"]*)"/i);
  if (meta) top.push(["meta description", decode(meta[1]).trim()]);
  for (const h of main.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)) top.push([`h${h[1]}`, strip(h[2])]);
  for (const c of main.matchAll(/<aside class="post-cta">[\s\S]*?<strong>([\s\S]*?)<\/strong>/gi)) top.push(["cta lead", strip(c[1])]);
  const h1 = main.search(/<h1[\s>]/);
  if (h1 !== -1) {
    const rest = main.slice(h1);
    const end = rest.search(/<\/section>/);
    for (const s of sentences(strip(end === -1 ? rest.slice(0, 2500) : rest.slice(0, end)))) top.push(["hero", s]);
  }

  for (const [label, text] of top) {
    const word = negated(locale, text);
    if (!word) continue;
    // Shared strings (footer, nav) would repeat on every page: report once.
    const key = `${label}|${text}`;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push({ route, locale, label, word, text });
  }

  if (REPORT) {
    for (const s of sentences(strip(main))) {
      const word = negated(locale, s);
      if (word && !seen.has(`body|${s}`)) {
        seen.add(`body|${s}`);
        body.push({ route, locale, word, text: s });
      }
    }
  }
}

if (REPORT) {
  const per = new Map();
  for (const b of body) per.set(b.route, (per.get(b.route) || 0) + 1);
  console.log(`body sentences with a negation: ${body.length} on ${per.size} pages`);
  for (const l of ["en", "fr", "es"]) console.log(`  ${l}: ${body.filter((b) => b.locale === l).length}`);
  for (const [r, n] of [...per].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  ${String(n).padStart(4)}  ${r}`);
}

const jsonAt = process.argv.indexOf("--json");
if (jsonAt !== -1) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(process.argv[jsonAt + 1], JSON.stringify({ hits, body }, null, 1));
}

if (hits.length === 0) {
  console.log("clean: no negation in titles, meta descriptions, headings, CTA leads or heroes, in any locale");
  process.exit(0);
}

const byRoute = new Map();
for (const h of hits) {
  if (!byRoute.has(h.route)) byRoute.set(h.route, []);
  byRoute.get(h.route).push(h);
}
console.error(`\n${hits.length} negative strings on ${byRoute.size} pages\n`);
for (const [route, list] of byRoute) {
  console.error(route);
  for (const h of list) console.error(`  [${h.label}] "${h.word}": ${h.text.slice(0, 160)}`);
}
console.error(
  "\nSay what the reader gets, what we do or what works, with every fact kept.\n" +
    "See docs/STYLE-GUIDE-UK-EU.md section 9. A verbatim quote, a searched query\n" +
    "or a legal distinction goes in scripts/negative-wording-allow.json with its reason."
);
process.exit(1);
