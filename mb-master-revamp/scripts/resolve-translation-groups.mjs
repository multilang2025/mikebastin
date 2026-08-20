/**
 * Resolve WPML translation groups for every harvested object.
 *
 * CONTENT-ARCHITECTURE.md §2 is explicit that consolidation operates on
 * translation groups, never per locale, and that FR/ES slugs can never be
 * derived from their EN counterpart because slugs are fully localised
 * (ai-consulting-services / conseil-ia / consultoria-de-inteligencia-artificial).
 * So the groups have to be read, not guessed.
 *
 * The `trid` column in icl_translations is the canonical source, but the
 * WordPress REST API does not expose it. WPML does publish the same
 * relationship on every rendered page, as the language-switcher links: a
 * page lists exactly the locales it has a translation in, with their real
 * URLs. That is the translation group, stated publicly.
 *
 * Reads content-source/*.json, fetches each object's link, and writes
 * translation-groups.json: one record per group with its per-locale URL.
 */
import { execFile } from "child_process";
import { promisify } from "util";
import { readFileSync, writeFileSync } from "fs";

const run = promisify(execFile);
const DIR = new URL("../content-source/", import.meta.url).pathname;
const CONCURRENCY = 6;

const index = JSON.parse(readFileSync(`${DIR}index.json`, "utf8"));

/** Every harvested object, tagged with the locale and type it came from. */
const objects = [];
for (const [locale, types] of Object.entries(index.locales)) {
  for (const [type, meta] of Object.entries(types)) {
    for (const it of JSON.parse(readFileSync(`${DIR}${meta.file}`, "utf8"))) {
      objects.push({ locale, type, id: it.id, slug: it.slug, link: it.link });
    }
  }
}
console.log(`${objects.length} objects to resolve`);

async function switcherFor(url) {
  const { stdout } = await run(
    "curl",
    ["-sSL", "--max-time", "45", url],
    { maxBuffer: 40 * 1024 * 1024 }
  );
  const out = {};
  for (const m of stdout.matchAll(/<a[^>]*wpml-ls-link[^>]*>/g)) {
    const tag = m[0];
    const href = /href="([^"]+)"/.exec(tag);
    const lang = /hreflang="([a-z-]+)"/.exec(tag);
    if (href && lang) out[lang[1]] = href[1];
  }
  return out;
}

const results = new Array(objects.length);
let cursor = 0;
let done = 0;

async function worker() {
  for (;;) {
    const i = cursor++;
    if (i >= objects.length) return;
    const o = objects[i];
    try {
      results[i] = { ...o, siblings: await switcherFor(o.link) };
    } catch {
      results[i] = { ...o, siblings: null, error: true };
    }
    if (++done % 25 === 0) console.log(`  ${done}/${objects.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Collapse to groups: every object whose sibling set contains the same URLs
// belongs to one group, keyed by its lowest-sorted member URL so the key is
// stable regardless of which locale was crawled first.
const groups = new Map();
for (const r of results) {
  if (!r || !r.siblings) continue;
  const urls = Object.values(r.siblings).sort();
  const key = urls[0] || r.link;
  if (!groups.has(key)) {
    groups.set(key, { key, type: r.type, locales: {}, members: [] });
  }
  const g = groups.get(key);
  for (const [lang, url] of Object.entries(r.siblings)) g.locales[lang] = url;
  g.members.push({ locale: r.locale, id: r.id, slug: r.slug });
}

const list = [...groups.values()].sort((a, b) => a.key.localeCompare(b.key));
const failed = results.filter((r) => r && r.error).length;

const byCoverage = {};
for (const g of list) {
  const k = Object.keys(g.locales).sort().join("+") || "none";
  byCoverage[k] = (byCoverage[k] || 0) + 1;
}

writeFileSync(
  `${DIR}translation-groups.json`,
  JSON.stringify(
    { resolvedAt: new Date().toISOString(), total: list.length, failed, byCoverage, groups: list },
    null,
    1
  )
);

console.log(`\ngroups: ${list.length}   failed fetches: ${failed}`);
console.log("coverage:");
for (const [k, v] of Object.entries(byCoverage).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k.padEnd(12)} ${v}`);
}
