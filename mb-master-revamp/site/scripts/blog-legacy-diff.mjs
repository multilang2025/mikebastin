#!/usr/bin/env node
/**
 * Cheap-model bulk triage across the migrated blog posts not yet covered
 * by a real restoration pass, ahead of spending full-price agent work on
 * them. Two spot checks (affiliate-marketing-programs,
 * german-seo-best-practices) found the WP-to-MDX migration had silently
 * dropped most list items, tables and links on some posts. A follow-up
 * restoration pass on fourteen top-traffic posts then found the opposite
 * on most of them: eleven of fourteen were already intact, and the real
 * remaining faults were narrower (a markdown table that lost its syntax,
 * a stale internal link) rather than wholesale content loss. So this
 * script exists to find out, cheaply, which of this project's remaining
 * migrated posts actually need work, rather than assuming every post
 * needs the same expensive full restoration.
 *
 * For every target slug:
 *   1. Fetch the live legacy page (free) and the migrated .md (free).
 *   2. Compute structural counts locally, no model call: headings, list
 *      items, table rows, links, for both versions.
 *   3. Only if the migrated counts are meaningfully lower does it spend
 *      a cheap OpenRouter call (openai/gpt-oss-20b -- see
 *      svg-animation-ideas.mjs for why this model) asking the model to
 *      read both texts and describe, in plain language, what looks
 *      missing. That is extraction from text actually given to it, not
 *      the model's own recall, so it is not the "fact-checking" this
 *      project reserves for live search (CLAUDE.md) -- it is closer to
 *      cheap reading comprehension over supplied source material.
 *
 * Output: docs/blog-legacy-diff.json, one entry per post, a plain
 * "needs_review" boolean and (when true) the model's description of
 * what is missing. This is triage, not a spec: read it before spending
 * a full restoration pass on anything it flags.
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
const MODEL = "openai/gpt-oss-20b";

const ALREADY_HANDLED = new Set([
  "affiliate-marketing-programs", "german-seo-best-practices", "chrome-extensions-for-seo",
  "chrome-extensions-for-translators", "internal-linking-tools", "french-ppc-campaign",
  "360-marketing-agency", "conversational-ai-chatbots-business", "link-building-in-spain",
  "multilingual-keyword-research", "spanish-keyword-localisation", "link-selling-and-link-buying-platforms",
  "top-instagram-tools", "building-a-global-brand", "competitor-analysis-traffic-checklist",
]);

function stripHtml(html) {
  return html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/i, "")
    .replace(/<footer[\s\S]*?<\/footer>/i, "");
}

function countLegacy(html) {
  const s = stripHtml(html);
  return {
    headings: (s.match(/<h[234][ >]/gi) || []).length,
    list_items: (s.match(/<li[ >]/gi) || []).length,
    tables: (s.match(/<table[ >]/gi) || []).length,
    links: (s.match(/<a [^>]*href/gi) || []).length,
  };
}

function countMigrated(md) {
  const body = md.replace(/^---[\s\S]*?---/, "");
  return {
    headings: (body.match(/^#{2,4} /gm) || []).length,
    list_items: (body.match(/^-\s/gm) || []).length,
    tables: (body.match(/^\|.*\|.*\n\|[-:| ]+\|/gm) || []).length,
    links: (body.match(/\[[^\]]*\]\(https?:\/\//g) || []).length,
  };
}

function needsReview(legacy, migrated) {
  // Flag when the migrated version is meaningfully thinner in any
  // dimension, allowing headings some slack (legacy h4s sometimes
  // fold into a paragraph honestly, without losing content).
  if (legacy.list_items >= 6 && migrated.list_items < legacy.list_items * 0.6) return true;
  if (legacy.tables > 0 && migrated.tables < legacy.tables) return true;
  if (legacy.links >= 4 && migrated.links < legacy.links * 0.5) return true;
  if (legacy.headings >= 6 && migrated.headings < legacy.headings * 0.4) return true;
  return false;
}

async function describeGap(slug, legacyText, migratedText) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You compare a legacy article to a migrated, rewritten version of the
same article and describe what looks missing from the migrated one:
specific list entries, table rows, links, or subsections present in the
legacy text but not represented in the migrated text, even in different
words. Do not invent anything not in the legacy text. Do not comment on
style or voice. Reply with 2-5 short bullet points, plain text, no
markdown headers, or reply exactly "Nothing significant missing." if the
migrated version genuinely covers the same ground.`,
        },
        {
          role: "user",
          content: `LEGACY (may include boilerplate, ignore nav/footer noise):\n${legacyText.slice(0, 6000)}\n\n---\n\nMIGRATED:\n${migratedText.slice(0, 4000)}`,
        },
      ],
      temperature: 0.3,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status} for ${slug}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "(no content returned)";
}

function htmlToText(html) {
  return stripHtml(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY not set. Structural counts will still run; gap descriptions will not.");
  }

  const results = {};
  for (const slug of targets) {
    const mdPath = join(ROOT, "content/en/posts", `${slug}.md`);
    if (!existsSync(mdPath)) {
      results[slug] = { error: "no migrated .md file found" };
      console.log(`${slug}: no migrated file, skipped`);
      continue;
    }
    const migratedRaw = readFileSync(mdPath, "utf8");
    let legacyHtml;
    try {
      const res = await fetch(`https://mikebastin.com/${slug}/`);
      if (!res.ok) {
        results[slug] = { error: `legacy fetch ${res.status}` };
        console.log(`${slug}: legacy ${res.status}, skipped`);
        continue;
      }
      legacyHtml = await res.text();
    } catch (err) {
      results[slug] = { error: `legacy fetch failed: ${err.message}` };
      console.log(`${slug}: fetch failed, skipped`);
      continue;
    }

    const legacyCounts = countLegacy(legacyHtml);
    const migratedCounts = countMigrated(migratedRaw);
    const flagged = needsReview(legacyCounts, migratedCounts);

    let gap = null;
    if (flagged && process.env.OPENROUTER_API_KEY) {
      try {
        gap = await describeGap(slug, htmlToText(legacyHtml), migratedRaw);
      } catch (err) {
        gap = `(gap description failed: ${err.message})`;
      }
    }

    results[slug] = { legacy: legacyCounts, migrated: migratedCounts, needs_review: flagged, gap };
    console.log(`${slug}: ${flagged ? "FLAGGED" : "ok"} (legacy ${JSON.stringify(legacyCounts)} vs migrated ${JSON.stringify(migratedCounts)})`);
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2) + "\n");
  const flaggedCount = Object.values(results).filter((r) => r.needs_review).length;
  console.log(`\n${targets.length} posts checked, ${flaggedCount} flagged for review. Written to ${OUT_FILE}`);
}

main();
