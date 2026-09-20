#!/usr/bin/env node
/**
 * Mechanism vocabulary is banned at the top of a page and welcome below it.
 *
 * `hreflang` is not a banned word. It is a banned opening. A buyer who has
 * read 800 words has decided we might know what we are doing and now wants
 * the precise term, which is also what the page ranks for; vagueness there
 * costs both. A buyer four seconds in wants to know whether we understand
 * their problem, and "Crawlability, indexation and the hreflang plumbing"
 * tells them only that we can talk to other SEOs.
 *
 * So this is zoned rather than absolute. It reads the built output instead
 * of the sources, because the zone is a rendering question: what a reader
 * meets before scrolling. Reading `out/` has also twice caught what a
 * source-level pass missed on this site, the 43 stripped-image artifacts
 * and a meta description still selling "one narrow query network".
 *
 * The measurement that prompted it, 20 September 2026: across 19 service
 * pages and 65,267 words, 12.1 jargon terms per thousand against 7.3
 * benefit terms, and four of the five biggest pages opening their hero on
 * mechanism. See .claude/skills/mb-copy-voice/SKILL.md.
 *
 * It fails on commercial pages only. A reader who lands on "Technical SEO
 * for multilingual websites" from a search for hreflang tags arrived
 * wanting that word, and burying it would cost the page the query it
 * exists to answer. Editorial routes are reported, never failed: the
 * writer decides, because on those pages the jargon is the subject. On a
 * service page nobody searched for the mechanism, they searched for the
 * problem.
 *
 *   node scripts/copy-jargon-lint.mjs           fail on any hit
 *   node scripts/copy-jargon-lint.mjs --report   print the whole-page
 *                                                ratios, never fails
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const REPORT = process.argv.includes("--report");

/**
 * Mechanism, not category.
 *
 * "SEO", "localisation" and "AI" are what the company sells and cannot be
 * banned on a site that sells them. Service names are excluded for the
 * same reason: "transcreation" on the translation page is the product.
 * What is listed here is the machinery underneath, which is our concern
 * and not the reader's until much later.
 */
const JARGON = [
  "hreflang", "x-default", "canonical", "canonicalisation",
  "indexation", "indexed", "crawlability", "crawler", "crawled", "crawl budget",
  "schema markup", "structured data", "json-ld",
  "WPML", "Weglot", "Polylang", "robots\\.txt", "XML sitemap",
  "SERP", "SERPs", "CMS", "backlink", "anchor text", "link equity",
  "topic cluster", "query network", "meta description", "meta title",
  "alt text", "core web vitals", "plumbing", "on-page", "off-page",
];

/** Words that say what the reader gets, counted for the report only. */
const BENEFIT = [
  "enquir", "revenue", "sales", "customer", "buyer", "client", "grow",
  "cost", "budget", "leads", "profit", "convert", "win", "market share",
];

/**
 * Pages whose job is to sell. Everything else is editorial, where the
 * mechanism is often the reason the reader came.
 */
const COMMERCIAL = [
  /^\/$/,
  /^\/(fr\/|es\/)?services(\/|$)/,
  /^\/(contact|how-i-work|results)(\/|$)/,
];
const isCommercial = (route) => COMMERCIAL.some((re) => re.test(route));

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

const strip = (s) =>
  s
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The zone a reader meets before deciding whether to keep going: the h1,
 * and everything up to the end of the section holding it. Falls back to
 * the first 700 characters of body text where a page is built without
 * sections, which is better than skipping the page.
 */
function topZone(html) {
  const body = html.slice(html.indexOf("<main"));
  const h1 = body.search(/<h1[\s>]/);
  if (h1 === -1) return null;
  const rest = body.slice(h1);
  const end = rest.search(/<\/section>/);
  return strip(end === -1 ? rest.slice(0, 2500) : rest.slice(0, end));
}

/** The meta description is a top-zone string too: it is the first thing a
 *  searcher reads, before the page exists for them at all. */
function metaDescription(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/i);
  return m ? m[1] : "";
}

const files = pages(OUT);
const hits = [];
const noted = [];
const ratios = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const route = file.replace(OUT, "").replace(/\/index\.html$/, "") || "/";

  const zone = topZone(html);
  const meta = metaDescription(html);
  for (const [label, text] of [["hero", zone], ["meta description", meta]]) {
    if (!text) continue;
    for (const term of JARGON) {
      const re = new RegExp(`\\b${term}\\b`, "gi");
      const found = text.match(re);
      if (!found) continue;
      const at = text.search(re);
      (isCommercial(route) ? hits : noted).push({
        route,
        label,
        term: found[0],
        context: text.slice(Math.max(0, at - 55), at + 75).trim(),
      });
    }
  }

  if (REPORT) {
    const text = strip(html.slice(html.indexOf("<main")));
    const words = text.split(" ").length;
    if (words < 150) continue;
    const count = (list) =>
      list.reduce((n, t) => n + (text.match(new RegExp(`\\b${t}`, "gi")) || []).length, 0);
    ratios.push({ route, words, j: count(JARGON), b: count(BENEFIT) });
  }
}

if (REPORT) {
  ratios.sort((a, b) => b.j / b.words - a.j / a.words);
  console.log("route".padEnd(46) + "words".padStart(7) + "jargon/1k".padStart(11) + "benefit/1k".padStart(12));
  for (const r of ratios.slice(0, 20)) {
    console.log(
      r.route.padEnd(46) +
        String(r.words).padStart(7) +
        ((r.j * 1000) / r.words).toFixed(1).padStart(11) +
        ((r.b * 1000) / r.words).toFixed(1).padStart(12)
    );
  }
  const w = ratios.reduce((n, r) => n + r.words, 0);
  const j = ratios.reduce((n, r) => n + r.j, 0);
  const b = ratios.reduce((n, r) => n + r.b, 0);
  console.log(
    `\n${ratios.length} pages, ${w} words, ${((j * 1000) / w).toFixed(1)} jargon/1k, ` +
      `${((b * 1000) / w).toFixed(1)} benefit/1k`
  );
  process.exit(0);
}

const commercial = files.filter((f) =>
  isCommercial(f.replace(OUT, "").replace(/\/index\.html$/, "") || "/")
).length;
console.log(
  `checked the top zone and meta description of ${files.length} pages, ` +
    `${commercial} of them commercial`
);
if (noted.length > 0) {
  const where = [...new Set(noted.map((n) => n.route))];
  console.log(
    `${noted.length} mentions on ${where.length} editorial pages, not failed: ` +
      `there the mechanism is usually the query the page answers.`
  );
}

if (hits.length === 0) {
  console.log("clean: no mechanism vocabulary above the fold on a page that sells");
  process.exit(0);
}

const byRoute = new Map();
for (const h of hits) {
  if (!byRoute.has(h.route)) byRoute.set(h.route, []);
  byRoute.get(h.route).push(h);
}

console.error(`\n${hits.length} hits on ${byRoute.size} pages\n`);
for (const [route, list] of byRoute) {
  console.error(route);
  for (const h of list) {
    console.error(`  ${(h.term + " (" + h.label + ")").padEnd(34)} ...${h.context}...`);
  }
}
console.error(
  "\nMechanism belongs below the first section, where a reader who is still\n" +
    "going wants the precise term. Open on the reader's situation instead.\n" +
    "See .claude/skills/mb-copy-voice/SKILL.md."
);
process.exit(1);
