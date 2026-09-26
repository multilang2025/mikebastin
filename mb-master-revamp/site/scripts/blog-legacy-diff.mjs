#!/usr/bin/env node
/**
 * Cheap, reliable triage for the migrated blog posts not yet covered by
 * a real restoration pass: which ones lost a comparison table.
 *
 * This script went through two broken versions before this one. Both
 * tried to isolate the real article body from the rest of a legacy
 * Divi/WordPress page (nav, breadcrumbs, language switcher, widgets) so
 * that headings/list-items/links could be counted structurally and
 * compared. Both failed for different reasons specific to this theme's
 * markup:
 *   1. Scoping to <header>/<footer> alone left the breadcrumb nav and
 *      the WPML language switcher in scope, which sit outside those
 *      tags on this theme -- confirmed on eeat-vs-aeat-typo, where they
 *      added a constant phantom 8 list items to every single post.
 *   2. Scoping to a `.dipi-post-content` div by string search matched a
 *      *different* occurrence of that class name on at least one post
 *      (ai-powered-marketing): the class also appears as a literal
 *      string inside a jQuery snippet that wraps text nodes in that
 *      class at runtime, client-side -- meaning the div doesn't exist
 *      in the HTML this script ever sees, and the match landed on the
 *      JS string instead, producing near-empty bogus bounds.
 *
 * Real evidence from the fourteen posts a full restoration pass already
 * checked by hand (docs/blog-restore-batch-{a,b,c}.md): eleven of
 * fourteen had every legacy heading, list item and link already intact.
 * The one recurring real defect was a comparison table whose data
 * survived the WP-to-MDX migration but landed as dozens of flattened
 * one-line paragraphs instead of markdown table syntax, on five of
 * fourteen posts. So rather than keep chasing this theme's markup
 * variations to make a general structural diff reliable, this script
 * checks for that one specific, actually-confirmed failure mode, on an
 * unscoped page fetch: a `<table` tag essentially never appears in a
 * WordPress theme's nav, footer or sidebar widgets, so searching the
 * whole page for it (rather than a hand-isolated article body) is safe
 * without the scoping this file's earlier versions got wrong.
 *
 *   node scripts/blog-legacy-diff.mjs
 *   node scripts/blog-legacy-diff.mjs --slug some-slug   # one post only
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../", import.meta.url)));
const REPO_ROOT = join(ROOT, "..");
const OUT_FILE = join(REPO_ROOT, "docs", "blog-legacy-diff.json");

const ALREADY_HANDLED = new Set([
  "affiliate-marketing-programs", "german-seo-best-practices", "chrome-extensions-for-seo",
  "chrome-extensions-for-translators", "internal-linking-tools", "french-ppc-campaign",
  "360-marketing-agency", "conversational-ai-chatbots-business", "link-building-in-spain",
  "multilingual-keyword-research", "spanish-keyword-localisation", "link-selling-and-link-buying-platforms",
  "top-instagram-tools", "building-a-global-brand", "competitor-analysis-traffic-checklist",
]);

function hasLegacyTable(html) {
  const noScript = html.replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "");
  return (noScript.match(/<table[ >]/gi) || []).length;
}

function hasMigratedTable(md) {
  const body = md.replace(/^---[\s\S]*?---/, "");
  return (body.match(/^\|.*\|.*\n\|[-:| ]+\|/gm) || []).length;
}

async function main() {
  const onlySlug = process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null;
  const contentMap = JSON.parse(readFileSync(join(REPO_ROOT, "redirects/content-map.json"), "utf8"));
  let targets = contentMap.groups
    .filter((g) => g.type === "post" && g.action === "migrate" && g.en?.slug)
    .map((g) => g.en.slug)
    .filter((slug) => !ALREADY_HANDLED.has(slug));
  if (onlySlug) targets = targets.filter((s) => s === onlySlug);

  if (targets.length === 0) {
    console.error("No targets to check.");
    process.exit(1);
  }

  const results = {};
  for (const slug of targets) {
    const mdPath = join(ROOT, "content/en/posts", `${slug}.md`);
    if (!existsSync(mdPath)) {
      results[slug] = { error: "no migrated .md file found" };
      console.log(`${slug}: no migrated file, skipped`);
      continue;
    }
    let html;
    try {
      const res = await fetch(`https://mikebastin.com/${slug}/`);
      if (!res.ok) {
        results[slug] = { error: `legacy fetch ${res.status}` };
        console.log(`${slug}: legacy ${res.status}, skipped`);
        continue;
      }
      html = await res.text();
    } catch (err) {
      results[slug] = { error: `legacy fetch failed: ${err.message}` };
      console.log(`${slug}: fetch failed, skipped`);
      continue;
    }

    const legacyTables = hasLegacyTable(html);
    const migratedTables = hasMigratedTable(readFileSync(mdPath, "utf8"));
    const missingTable = legacyTables > 0 && migratedTables < legacyTables;
    results[slug] = { legacy_tables: legacyTables, migrated_tables: migratedTables, missing_table: missingTable };
    console.log(`${slug}: legacy tables=${legacyTables}, migrated tables=${migratedTables}${missingTable ? "  <-- MISSING TABLE" : ""}`);
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2) + "\n");
  const flagged = Object.values(results).filter((r) => r.missing_table);
  console.log(`\n${targets.length} posts checked, ${flagged.length} with a legacy table not reflected in the migrated markdown. Written to ${OUT_FILE}`);
  console.log("This checks one confirmed failure mode only (a dropped comparison table). It is not a general audit -- a post with no table may still have other issues a person or a fuller pass would catch.");
}

main();
