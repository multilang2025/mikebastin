#!/usr/bin/env node
/**
 * Structure check for English journal posts, per docs/BLOG-STRUCTURE.md.
 *
 * Errors (exit 1) are things that break the page: an inline SVG figure
 * with a blank line inside it (marked ends the HTML block there and the
 * rest prints as text), a hard-coded colour in a figure (breaks dark
 * mode and the palette rule), a figure without role/aria-label, or a
 * script/foreignObject inside one.
 *
 * Warnings are editorial: length over the target, headings the TOC will
 * render badly (escaped numbering, a "Conclusion" heading, too many
 * entries, sections all at h3 under one h2), and no table or figure in a
 * long post. Warnings never fail.
 *
 *   node scripts/post-structure-lint.mjs            # all EN posts
 *   node scripts/post-structure-lint.mjs slug slug  # only these
 *   node scripts/post-structure-lint.mjs --errors   # errors only
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "../content/en/posts");
const args = process.argv.slice(2);
const errorsOnly = args.includes("--errors");
const only = args.filter((a) => !a.startsWith("--"));
// Only posts that are actually built: content-map.json marks a published
// post as action "migrate", destination "mdx". The rest of the files are
// kept as source but 301 to valenciamove.com or a service page, so their
// structure affects no page on this site.
const MAP = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../redirects/content-map.json"), "utf8"));
const HTACCESS = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../public/.htaccess"), "utf8");
const PUBLISHED = new Set(
  MAP.groups
    .filter((g) => g.type === "post" && g.action === "migrate" && g.destination === "mdx" && g.en?.slug)
    .map((g) => g.en.slug)
    // A post the prune later redirected elsewhere keeps its migrate record
    // but is not built: skip anything .htaccess sends somewhere other than
    // its own /blog/ URL.
    .filter((slug) => {
      const rule = HTACCESS.match(new RegExp(`^RewriteRule \\^${slug}/\\?\\$ (\\S+)`, "m"));
      return !rule || rule[1] === `blog/${slug}/`;
    })
    // Hand-built routes (lib/posts.ts HAND_BUILT_SLUGS) render their own
    // JSX, so the markdown file is not what the reader sees.
    .filter((slug) => !existsSync(join(dirname(fileURLToPath(import.meta.url)), `../app/${slug}/page.tsx`))),
);
const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => PUBLISHED.has(f.replace(/\.md$/, "")))
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.md$/, "")));

let errorCount = 0;
for (const f of files) {
  const raw = readFileSync(join(DIR, f), "utf8");
  const body = raw.replace(/^---[\s\S]*?\n---\n/, "");
  const errors = [];
  const warns = [];

  for (const m of body.matchAll(/<figure[\s\S]*?<\/figure>/g)) {
    const fig = m[0];
    const line = body.slice(0, m.index).split("\n").length;
    if (/\n\s*\n/.test(fig)) errors.push(`figure at line ${line}: blank line inside the block`);
    if (/#[0-9a-f]{3,8}\b/i.test(fig)) errors.push(`figure at line ${line}: hard-coded hex colour`);
    if (/(fill|stroke)="(?!none")[^"]*"/.test(fig)) errors.push(`figure at line ${line}: fill/stroke colour attribute, use fg-* classes`);
    if (/style="[^"]*(color|fill|stroke)/.test(fig)) errors.push(`figure at line ${line}: colour in style attribute`);
    if (!/<svg[^>]*role="img"/.test(fig) || !/<svg[^>]*aria-label="[^"]+"/.test(fig)) errors.push(`figure at line ${line}: svg needs role="img" and aria-label`);
    if (/<script|<foreignObject|href="http/i.test(fig)) errors.push(`figure at line ${line}: script, foreignObject or external href`);
    if (!/class="post-fig"/.test(fig)) errors.push(`figure at line ${line}: missing class="post-fig"`);
    const vb = fig.match(/viewBox="0 0 (\d+) (\d+)"/);
    if (!vb || vb[1] !== "400") warns.push(`figure at line ${line}: viewBox should be 400 wide`);
    if (!/<figcaption>/.test(fig)) warns.push(`figure at line ${line}: no figcaption`);
  }

  const prose = body.replace(/<figure[\s\S]*?<\/figure>/g, "").replace(/```[\s\S]*?```/g, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  const heads = [...prose.matchAll(/^(#{2,6}) (.+)$/gm)].map((h) => ({ level: h[1].length, text: h[2] }));
  const h2 = heads.filter((h) => h.level === 2).length;
  const toc = heads.filter((h) => h.level <= 3).length;
  const tables = (prose.match(/^\|\s*:?-{3,}/gm) || []).length;
  const figures = (body.match(/<figure/g) || []).length;

  if (words > 2200) warns.push(`${words} words, target 1,200 to 2,200`);
  if (heads.some((h) => /^\d+(\\?\.\d*)?\\?\.?\s/.test(h.text))) warns.push("numbered headings (1\\. 2.1): the TOC repeats the numbers");
  if (heads.some((h) => /^conclusion\b/i.test(h.text))) warns.push('a heading reading "Conclusion"');
  if (heads.some((h) => /:$/.test(h.text.trim()))) warns.push("heading ending in a colon");
  if (heads.filter((h) => h.level >= 4).length > 3) warns.push(`${heads.filter((h) => h.level >= 4).length} h4+ headings, invisible to the TOC`);
  if (toc > 25) warns.push(`${toc} TOC entries, over 25`);
  if (words > 1000 && h2 <= 1 && toc >= 4) warns.push(`only ${h2} h2 for ${toc} sections: promote sections to h2`);
  if (words > 1200 && tables === 0) warns.push("long post with no table");
  if (words > 1200 && figures === 0) warns.push("long post with no figure");

  errorCount += errors.length;
  if (errors.length || (!errorsOnly && warns.length)) {
    console.log(`${f.replace(/\.md$/, "")}  (${words} words, ${h2} h2, ${toc} toc, ${tables} tables, ${figures} figures)`);
    for (const e of errors) console.log(`  ERROR ${e}`);
    if (!errorsOnly) for (const w of warns) console.log(`  warn  ${w}`);
  }
}
if (errorCount) {
  console.log(`\n${errorCount} error(s). See docs/BLOG-STRUCTURE.md.`);
  process.exit(1);
}
