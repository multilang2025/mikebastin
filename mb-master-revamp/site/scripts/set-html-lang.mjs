#!/usr/bin/env node
/**
 * Writes the right `<html lang>` into every built page (postbuild).
 *
 * The static export has one root layout, so Next renders the same
 * `<html lang>` on every route. Until 30 Sep 2026 that was "en-GB"
 * everywhere, French and Spanish pages included, and only an inline script
 * (LocaleHtmlLang) corrected it in the browser: a crawler or screen reader
 * reading the HTML saw English on /fr/ and /es/. Owner, same day: "My
 * audience is international, is this the best we can do?"
 *
 * Per-locale root layouts would need every route moved into a route group
 * and the experimental `globalNotFound` flag for the 404; rewriting the
 * exported HTML gives the same result with no route changes. English is
 * plain "en": the site writes British spelling for an international
 * reader, and hreflang already says "en". `components/HtmlLang.tsx` keeps
 * the attribute right on client-side navigation between locales.
 *
 *   node scripts/set-html-lang.mjs          rewrite out/ (runs as postbuild)
 *   node scripts/set-html-lang.mjs --check  fail if any page carries the wrong lang
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(fileURLToPath(new URL("../", import.meta.url)), "out");
const CHECK = process.argv.includes("--check");

if (!existsSync(OUT)) {
  console.error("no out/ directory: run `npm run build` first");
  process.exit(1);
}

function pages(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) found.push(...pages(p));
    else if (entry.endsWith(".html")) found.push(p);
  }
  return found;
}

const langFor = (file) => {
  const top = relative(OUT, file).split(sep)[0];
  return top === "fr" ? "fr" : top === "es" ? "es" : "en";
};

let changed = 0;
const wrong = [];
for (const file of pages(OUT)) {
  const html = readFileSync(file, "utf8");
  const want = langFor(file);
  const m = html.match(/<html([^>]*?)\slang="([^"]*)"/);
  if (!m) continue;
  if (m[2] === want) continue;
  if (CHECK) {
    wrong.push(`${relative(OUT, file)}: lang="${m[2]}", expected "${want}"`);
    continue;
  }
  writeFileSync(file, html.replace(/<html([^>]*?)\slang="[^"]*"/, `<html$1 lang="${want}"`));
  changed++;
}

if (CHECK) {
  if (wrong.length) {
    console.error(`${wrong.length} pages carry the wrong <html lang>:\n  ${wrong.slice(0, 20).join("\n  ")}`);
    process.exit(1);
  }
  console.log("clean: every page's <html lang> matches its locale (en, fr, es)");
} else {
  console.log(`set <html lang> on ${changed} pages`);
}
