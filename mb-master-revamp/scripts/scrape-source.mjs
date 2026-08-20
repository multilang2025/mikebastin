/**
 * Harvest mikebastin.com's current content as the migration source of truth.
 *
 * Uses the WordPress REST API rather than scraping HTML: it returns clean
 * post objects with slugs, dates, taxonomy and Rank Math meta already
 * separated, and it exposes WPML's per-locale views through ?lang=.
 *
 * Writes one JSON file per locale per type into content-source/, plus an
 * index.json summarising what was taken. Nothing is transformed here; the
 * point is a faithful snapshot that content-migrator can work from, and that
 * can be diffed later if the live site changes mid-migration.
 *
 * Counts verified against docs/CONTENT-ARCHITECTURE.md before writing:
 * EN 91 posts / 7 pages / 43 services, FR 23 / 7 / 44, ES 20 / 7 / 43.
 */
import { execFile } from "child_process";
import { promisify } from "util";
import { mkdirSync, writeFileSync } from "fs";

const run = promisify(execFile);
const BASE = "https://mikebastin.com/wp-json/wp/v2";
const OUT = new URL("../content-source/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const LOCALES = ["en", "fr", "es"];
const TYPES = [
  { rest: "posts", label: "posts" },
  { rest: "pages", label: "pages" },
  { rest: "project", label: "services" },
];

// Keep the fields a migration actually needs. Dropping the rest keeps the
// snapshot readable and roughly a third of the size.
const FIELDS = [
  "id", "date", "modified", "slug", "status", "type", "link",
  "title", "content", "excerpt", "categories", "tags", "featured_media",
  "meta", "rank_math_seo", "wpml_current_locale", "wpml_translations",
].join(",");

async function getJSON(url) {
  const { stdout } = await run(
    "curl",
    ["-sSL", "--max-time", "60", "--compressed", "-H", "Accept: application/json", url],
    { maxBuffer: 200 * 1024 * 1024 }
  );
  return JSON.parse(stdout);
}

async function fetchAll(rest, locale) {
  const out = [];
  for (let page = 1; ; page++) {
    const url =
      `${BASE}/${rest}?per_page=100&page=${page}&lang=${locale}` +
      `&_fields=${FIELDS}&orderby=date&order=asc`;
    let batch;
    try {
      batch = await getJSON(url);
    } catch (e) {
      console.log(`  ! ${rest}/${locale} page ${page}: ${e.message.split("\n")[0]}`);
      break;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

const index = { scrapedAt: new Date().toISOString(), source: "https://mikebastin.com", locales: {} };

for (const locale of LOCALES) {
  index.locales[locale] = {};
  for (const { rest, label } of TYPES) {
    const items = await fetchAll(rest, locale);
    const file = `${label}.${locale}.json`;
    writeFileSync(`${OUT}${file}`, JSON.stringify(items, null, 1));
    index.locales[locale][label] = { count: items.length, file };
    console.log(`${locale}/${label.padEnd(9)} ${String(items.length).padStart(3)}  -> ${file}`);
  }
}

writeFileSync(`${OUT}index.json`, JSON.stringify(index, null, 2));
console.log("\nwritten to content-source/");
