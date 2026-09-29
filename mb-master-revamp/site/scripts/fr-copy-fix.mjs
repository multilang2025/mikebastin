#!/usr/bin/env node
/**
 * Mechanical fixes for French markdown (content/fr/**), the half of
 * fr-copy-lint.mjs that needs no judgement:
 *
 *   - a non-breaking space (U+00A0) before : ; ? ! in running text,
 *     replacing a plain space or adding one where none was typed
 *   - optimiz- and localiz- forms back to French spelling (the US forms are an
 *     English search-volume exception, CLAUDE.md)
 *
 * Skipped: fenced and inline code, link targets, HTML tags and their
 * attributes, frontmatter keys other than title, metaTitle and excerpt,
 * and English proper names ("Generative Engine Optimization").
 * Voice, register, vocabulary and experience need a writer, not a regex.
 *
 *   node scripts/fr-copy-fix.mjs [--dry]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL("../", import.meta.url)), "content", "fr");
const DRY = process.argv.includes("--dry");
const NB = " ";

function files(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if (e.endsWith(".md")) out.push(p);
  }
  return out;
}

const NAMED = /(Generative Engine|Search Everywhere|Answer Engine) Optimization/g;

function fixText(t) {
  // Protect what must not change, then restore it.
  const kept = [];
  const hold = (m) => `\u0000${kept.push(m) - 1}\u0000`;
  let s = t
    .replace(/`[^`]*`/g, hold)
    .replace(/<[^>]+>/g, hold)
    .replace(/\]\([^)]*\)/g, hold)
    .replace(/https?:\/\/\S+/g, hold)
    .replace(NAMED, hold);

  s = s
    .replace(/\b([Oo])ptimiz(ation|ations|er|e|es|ez|ons|ent|é|ée|és|ées|ant)\b/g, "$1ptimis$2")
    .replace(/\b([Ll])ocaliz(ation|ations|er|e|es|ez|é|ée|és|ées)\b/g, "$1ocalis$2");

  // Plain space before : ; ? ! becomes non-breaking.
  s = s.replace(/ ([:;?!])(?=\s|$|[»"*_)\u0000])/g, `${NB}$1`);
  // No space at all before ; ? ! (and : followed by a space) gets one.
  s = s.replace(/([\p{L}\p{N}»)*_])([;?!])(?=\s|$|[*_\u0000])/gu, `$1${NB}$2`);
  s = s.replace(/([\p{L}»)*_])(:)(?= )/gu, `$1${NB}$2`);

  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[+i]);
}

let changed = 0;
for (const f of files(ROOT)) {
  const raw = readFileSync(f, "utf8");
  if (!raw.startsWith("---")) continue;
  const end = raw.indexOf("\n---", 3);
  const fm = raw.slice(0, end);
  const body = raw.slice(end);

  const fm2 = fm.replace(/^(title|metaTitle|excerpt): "(.*)"$/gm, (_, k, v) => `${k}: "${fixText(v)}"`);
  let fence = false;
  const body2 = body
    .split("\n")
    .map((line, i) => {
      if (i === 0) return line; // the closing --- of the frontmatter
      if (/^\s*```/.test(line)) { fence = !fence; return line; }
      if (fence) return line;
      return fixText(line);
    })
    .join("\n");

  const next = fm2 + body2;
  if (next !== raw) {
    changed++;
    if (!DRY) writeFileSync(f, next);
  }
}
console.log(`${DRY ? "would change" : "changed"} ${changed} French files`);
