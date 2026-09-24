#!/usr/bin/env node
/**
 * Cheap-model ideation for the site's animated SVG art, never the final
 * copy or code. Reads scripts/svg-animation-prompts.json (one entry per
 * page: slug, page path, angle, context), asks a cheap OpenRouter model
 * for two or three animation concepts per page, and writes the raw
 * ideas to docs/svg-animation-ideas.json for a person to read before
 * anything gets built from them.
 *
 * Model: openai/gpt-oss-20b, chosen 24 Sep 2026 by querying OpenRouter's
 * own /api/v1/models pricing directly ($0.018 / $0.09 per million
 * tokens, real OpenAI open-weight family, not the rock-bottom cheapest
 * listed that day). Re-check pricing before assuming this is still the
 * best fit: https://openrouter.ai/api/v1/models
 *
 * Requires OPENROUTER_API_KEY in the environment. Fails loudly rather
 * than silently skipping if it is missing, per this project's secrets
 * rule (CLAUDE.md): never printed, never committed, read from the
 * environment only.
 *
 *   node scripts/svg-animation-ideas.mjs
 *   node scripts/svg-animation-ideas.mjs --slug local-seo   # one page only
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../", import.meta.url)));
const MODEL = "openai/gpt-oss-20b";
const PROMPTS_FILE = join(ROOT, "scripts/svg-animation-prompts.json");
const OUT_FILE = join(ROOT, "..", "docs", "svg-animation-ideas.json");

const SYSTEM_PROMPT = `You propose concepts for a small decorative animated SVG on one page of
a B2B multilingual SEO consultancy's website (mikebastin.com). You do
not write code or copy: you describe a visual concept in plain English,
for a human designer to build.

Hard rules, all non-negotiable:
- Original motifs only. Never suggest a recognisable trademarked
  character, logo, borrowed brand iconography, or a literal copy of a
  specific real place, flag, or country silhouette used as decoration.
  An abstract shape standing in for a market or a market's general
  position is fine; a traced, labelled national flag or a specific
  landmark is not.
- The piece is purely decorative and carries no readable text, numbers,
  or labels in the final build, so never propose a concept that depends
  on words being legible inside the SVG.
- Colours are restricted to a five-token palette (a warm cream, a deep
  navy, a teal, a berry red, a darker berry), so describe the concept in
  terms of shape and motion, not colour choices.
- Prefer restrained motion: a slow ambient detail (something drawing in
  once, something pulsing or travelling slowly on a loop) beats anything
  busy, since this sits beside real sales copy the reader is trying to
  read.

For the page you are given, reply with exactly this JSON shape and
nothing else, no prose outside the JSON:
{
  "concepts": [
    { "name": "short label", "description": "2-3 sentences: what shape or shapes, what moves, why it fits this page's selling point" },
    { "name": "...", "description": "..." }
  ]
}
Propose exactly 3 concepts, each a genuinely different idea, not three
variations of the same shape.`;

async function ideateFor(entry) {
  const userPrompt = `Page: ${entry.page}
Angle: ${entry.angle}
What the page argues: ${entry.context}`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status} for ${entry.slug}: ${body.slice(0, 500)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error(`No content in response for ${entry.slug}: ${JSON.stringify(data).slice(0, 500)}`);

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Model did not return valid JSON for ${entry.slug}: ${raw.slice(0, 500)}`);
  }
  return parsed;
}

async function main() {
  if (!process.env.OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set. Refusing to run rather than skip silently.");
    process.exit(1);
  }

  const onlySlug = process.argv.includes("--slug") ? process.argv[process.argv.indexOf("--slug") + 1] : null;
  const prompts = JSON.parse(readFileSync(PROMPTS_FILE, "utf8"));
  const targets = onlySlug ? prompts.filter((p) => p.slug === onlySlug) : prompts;

  if (targets.length === 0) {
    console.error(onlySlug ? `No prompt entry for slug "${onlySlug}".` : "No prompts to run.");
    process.exit(1);
  }

  const results = {};
  for (const entry of targets) {
    process.stdout.write(`${entry.slug} ... `);
    try {
      const ideas = await ideateFor(entry);
      results[entry.slug] = { page: entry.page, angle: entry.angle, ...ideas };
      console.log(`${ideas.concepts?.length ?? 0} concepts`);
    } catch (err) {
      console.log("FAILED");
      console.error(`  ${err.message}`);
      results[entry.slug] = { page: entry.page, angle: entry.angle, error: err.message };
    }
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2) + "\n");
  console.log(`\nWrote ${Object.keys(results).length} pages' ideas to ${OUT_FILE}`);
  console.log("Read before building anything. This is ideation, not a spec.");
}

main();
