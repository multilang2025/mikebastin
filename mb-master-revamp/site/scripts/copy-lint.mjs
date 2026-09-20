/**
 * Lint harvested content against the Master Content Protocol (CLAUDE.md).
 *
 * Written because the harvested prose is not publishable as-is. The live
 * site's own copy breaks the owner's rules in 41 places across the service
 * pages alone, mostly words he has explicitly rejected. Rendering it
 * straight onto the rebuild would ship the exact copy the rebuild exists
 * to replace.
 *
 * So the migration gates on this: a page renders its harvested body only
 * once that body passes. Anything failing keeps the summary treatment and
 * shows up here as a work item, rather than being quietly published or
 * quietly dropped.
 *
 * Run with `--json` for machine output, otherwise a readable report.
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/", import.meta.url).pathname;

/**
 * The content files that actually render.
 *
 * The prose rules below apply to everything, because a file can be revived.
 * The content checks added on 20 Sep (heading case, legacy links,
 * harvester artifacts) apply only to what builds: a Title Case heading in
 * a post that was retired this morning is not a defect, and a lint that
 * fails on dead files is a lint people learn to ignore.
 *
 * Same qualification the site itself uses: a post or service group whose
 * action is "migrate" to "mdx", with the per-locale override applied.
 */
const LIVE = (() => {
  const cm = JSON.parse(
    readFileSync(new URL("../../redirects/content-map.json", import.meta.url).pathname, "utf8")
  );
  const live = new Set();
  for (const g of cm.groups) {
    if (g.type !== "post" && g.type !== "service") continue;
    for (const loc of ["en", "fr", "es"]) {
      const e = g[loc];
      if (!e || !e.content_path) continue;
      const action = g.locale_actions?.[loc] ?? g.action;
      if (action !== "migrate" || g.destination !== "mdx") continue;
      // competitor-analysis-traffic-checklist has a hand-built route and
      // its file-backed body is deliberately never rendered
      // (lib/posts.ts, HAND_BUILT_SLUGS), so its file is not live copy.
      if (e.slug === "competitor-analysis-traffic-checklist") continue;
      live.add(e.content_path);
    }
  }
  return live;
})();

/**
 * Matched on the stem, not the exact word.
 *
 * The first version of this list matched whole words only, which meant
 * "leverage" was caught and "leveraging" was not. Eight of the nine
 * rejected verbs appear here mostly in an inflected form, so the strict
 * match was hiding roughly a hundred violations and reporting the files
 * that contained them as clean. The owner rejected the word, not one
 * conjugation of it.
 */
const FORBIDDEN = [
  "comprehensive", "tailor(?:ed|ing|s)?", "seamless(?:ly)?",
  "leverag(?:e|es|ed|ing)", "elevat(?:e|es|ed|ing)",
  "craft(?:s|ed|ing)?", "maximis(?:e|es|ed|ing)",
  "facilitat(?:e|es|ed|ing)", "landscape", "utilis(?:e|es|ed|ing)",
  "innovative", "robust", "delv(?:e|es|ed|ing)", "transformative", "vital",
  "dynamic", "ever-evolving", "moreover", "however", "thus", "hence",
  "additionally",
];

/**
 * Words the stems above would otherwise swallow. "Craftsmanship" is not
 * the rejected verb "craft", "elevator" is a lift, and "Core Web Vital"
 * is Google's own metric name, which the site has to be able to say.
 */
const EXEMPT = [
  /\bcraftsm(?:an|en|anship)\b/gi,
  /\barts and craft\b/gi,
  /\belevators?\b/gi,
  /Core Web Vitals?/gi,
  // "dynamic" is rejected as a marketing adjective ("our dynamic team"),
  // not as the technical term. Dynamic content and dynamic URLs are what
  // the industry calls those things, and the noun sense ("the same
  // dynamic applies") is a different word again.
  /\bdynamic (?:content|URLs?)\b/gi,
  /\b(?:same|reverse|opposite) dynamic\b/gi,
];

/**
 * Allowed, but not to be overused (owner decision, 21 Aug). Both are real
 * technical terms in this domain ("Trusted Shops integration") and one sits
 * inside a service name, so a hard fail was wrong: it was inflating the
 * work list by 113 hits that mostly read fine. Flagged only above a
 * per-page density, which is what "do not overuse" actually means.
 */
const SPARING = ["implementation", "integration"];
const SPARING_MAX = 4;

/** Rules apply to English prose. FR and ES have their own vocabulary. */
const LINTED_LOCALES = new Set(["en"]);

/**
 * URLs are exempt. CLAUDE.md already exempts query-string ampersands, and
 * the same logic covers any forbidden word that only appears inside a link
 * target: "/services/localised-e-commerce-integration/" is a slug, not
 * prose. Ten of the 97 "integration" hits were URLs before this stripped
 * them.
 */
const prose = (body) => {
  let s = body.replace(/\]\((?:[^)]+)\)/g, "]()").replace(/https?:\/\/\S+/g, "");
  for (const re of EXEMPT) s = s.replace(re, "");
  return s;
};

function lint(raw) {
  const body = prose(raw);
  const issues = [];

  for (const w of FORBIDDEN) {
    const m = body.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (m) issues.push({ rule: "forbidden-word", detail: m[0].toLowerCase(), count: m.length });
  }

  // Emojis are allowed on social posts, never in site copy. The harvested
  // excerpts are full of them because they were written as social teasers.
  // Same range as copy-fix: U+2600 to U+27BF holds the check mark and
  // the arrow, which the comparison tables use as content.
  const emoji = body.match(
    /[\u{1F000}-\u{1FAFF}]|[\u2705\u2642\u2696\u26A0\u2728\uFE0F]/gu,
  );
  if (emoji) issues.push({ rule: "emoji", detail: "emoji in site copy", count: emoji.length });

  const dashes = body.match(/[—–]/g);
  if (dashes) issues.push({ rule: "dash", detail: "em or en dash", count: dashes.length });

  // Query-string and HTML-entity ampersands are exempt; prose ones are not.
  const amps = body.match(/ & | &amp; /g);
  if (amps) issues.push({ rule: "ampersand", detail: "bare ampersand", count: amps.length });

  const michael = body.match(/\bMichael\b/g);
  if (michael) issues.push({ rule: "brand", detail: "Michael, brand is Mike Bastin", count: michael.length });

  for (const w of SPARING) {
    // The service's own name does not count against its density. Two
    // pages are called "Multilingual CMS Integration" and "Localised
    // E-commerce Integration", and 15 of that first page's 17 hits are
    // the page saying its own name. Penalising that would be asking the
    // page not to name the thing it sells, which is not what "do not
    // overuse" meant.
    const named = body.replace(
      new RegExp(`\\b(?:CMS|e-?commerce|multilingual|localised) ${w}\\b`, "gi"),
      "",
    );
    const m = named.match(new RegExp(`\\b${w}\\b`, "gi"));
    if (m && m.length > SPARING_MAX) {
      issues.push({ rule: "overused", detail: `${w}, ${m.length} times`, count: m.length - SPARING_MAX });
    }
  }

  // Sentence openers. "I" is no longer listed: the voice is "we" now, and
  // a first-person-singular pronoun anywhere is caught by the rule below.
  const openers = body.match(/(?:^|\.\s+)(This|That)\s/gm);
  if (openers) issues.push({ rule: "sentence-opener", detail: "This or That", count: openers.length });

  // Voice. The site speaks as "we", so any singular first person is a miss.
  const singular = body.match(/\b(I|my|me|mine|myself)\b/g);
  if (singular) issues.push({ rule: "voice", detail: "first-person singular", count: singular.length });

  return issues;
}

/**
 * Checks that only make sense against a content file's body, added after a
 * 20 Sep audit found the lint reporting 141 of 141 files clean while the
 * live English corpus carried 688 Title Case headings, 574 links to the
 * legacy WordPress URL structure and a block of JSON-escaped HTML. The
 * prose rules above were real; nothing was watching the rest.
 */
/**
 * Proper nouns, learned from the corpus rather than listed.
 *
 * A hand-written list is permanently incomplete: the first version of this
 * check flagged "Jean Marie Cordaro", "Link Whisper", "LinkBoss" and
 * "Bonzai" as Title Case, because a person and three products are not
 * things a list of countries and acronyms knows about. A word that appears
 * capitalised mid-sentence in body prose, more often than it appears
 * lowercase, is a name.
 */
const LEARNED_NAMES = (() => {
  const mid = new Map();
  const low = new Map();
  const bump = (m, k) => m.set(k, (m.get(k) || 0) + 1);
  for (const locale of ["en"]) {
    const lp = join(CONTENT, locale);
    for (const type of readdirSync(lp)) {
      const tp = join(lp, type);
      if (!statSync(tp).isDirectory()) continue;
      for (const f of readdirSync(tp)) {
        if (!f.endsWith(".md")) continue;
        const b = readFileSync(join(tp, f), "utf8").replace(/^#.*$/gm, "");
        for (const sent of b.split(/(?<=[.!?])\s+/)) {
          const ws = sent.match(/[^\W\d_][\w'\u2019-]*/gu) || [];
          for (const w of ws.slice(1)) bump(/^[A-Z]/.test(w) ? mid : low, w.toLowerCase());
        }
      }
    }
  }
  const out = new Set();
  for (const [w, n] of mid) if (n >= 3 && n > (low.get(w) || 0) * 2) out.add(w);
  return out;
})();

/**
 * American spelling, against CLAUDE.md's "UK English" rule.
 *
 * Nothing was watching this, so 81 of them shipped across the live posts
 * while the lint reported every file clean, which is the same hole the
 * heading-case check was added to close.
 *
 * Three things are stripped before the text is judged, because each is
 * correct with the z and would otherwise be a permanent false positive:
 * any URL or site path (the GEO service really is at
 * /services/generative-engine-optimization/), fenced or inline code, and
 * the schema.org type names, where Organization and LocalBusiness are
 * literals defined by the vocabulary rather than words we spell.
 */
const US_SPELLINGS =
  /\b(optimiz(?:e|es|ed|ing|ation|ations)|localiz(?:e|es|ed|ing|ation)|organiz(?:e|es|ed|ing|ation)|recogniz(?:e|es|ed|ing)|analyz(?:e|es|ed|ing)|customiz(?:e|es|ed|ing|ation)|personaliz(?:e|es|ed|ing|ation)|prioritiz(?:e|es|ed|ing)|standardiz(?:e|es|ed|ing|ation)|behaviors?|colors?|centers?|catalogs?|licenses(?= to)|fulfill(?:s|ed|ing|ment)?|traveling|canceled|modeling)\b/gi;

const SCHEMA_TYPES =
  /\b(Organization|LocalBusiness|ProfessionalService|FAQPage|WebPage|BreadcrumbList|Product|Article|BlogPosting|LegalService|FreightForwarder|RealEstateAgent|HowTo|ItemList)\b/g;

function stripNonProse(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\]\([^)]*\)/g, "]( )")
    .replace(/\/[a-z0-9-]+(?:\/[a-z0-9-]+)+\/?/g, " ")
    .replace(SCHEMA_TYPES, " ");
}

/**
 * The excerpt is the meta description and the card text, so it is the copy
 * a searcher reads before anything else on the site.
 *
 * Two defects shipped on it and neither was checked. Thirteen descriptions
 * ended mid-clause, because lib/seo.ts cut the excerpt at a word boundary
 * and called it a sentence: "enhancing efficiency, accuracy, and." was
 * live. And two posts carried another page's excerpt entirely, so
 * chrome-extensions-for-seo described Google Maps to 9,726 impressions
 * and internal-linking-tools sold affordable SEO services.
 *
 * The truncator is fixed; these two rules stop either coming back.
 *
 * Deliberately not a rule: excerpt length. Forty-nine of them run past
 * what fits alongside the call to action, and every one of those now cuts
 * at a sentence boundary and reads as written. Failing them would fire
 * forty-nine times on something already handled, which is how a lint
 * teaches people to ignore it.
 */
const seenExcerpts = new Map();

function excerptIssues(meta, slug) {
  const out = [];
  const m = /^excerpt:\s*"(.*)"\s*$/m.exec(meta);
  if (!m) return out;
  const text = m[1].trim();

  const first = seenExcerpts.get(text);
  if (first) {
    out.push({ rule: "excerpt", detail: `excerpt duplicates ${first}`, count: 1 });
  } else {
    seenExcerpts.set(text, slug);
  }

  const last = text.replace(/[.!?]+$/, "").split(/\s+/).pop() ?? "";
  if (DANGLING_WORD.test(last)) {
    out.push({ rule: "excerpt", detail: `excerpt ends mid-clause on "${last}"`, count: 1 });
  }
  return out;
}

const DANGLING_WORD =
  /^(?:and|or|but|so|to|for|of|in|on|at|by|with|from|into|onto|as|than|that|which|the|a|an|its|their|your|our|is|are|was|were|be|can|will|would|not|more|such|when|while|where|how|why|if|because|about|across|through|between|per|via|plus|like)$/i;

function contentOnlyIssues(body) {
  const out = [];

  // Residue from an image the harvester stripped. WordPress images came
  // across as `![alt](url)` and something removed the brackets and the
  // URL, leaving either a bare `!` or `!` plus the old alt text, both of
  // which render as a paragraph. Forty-three of them shipped across
  // twelve posts, including ten standalone exclamation marks down one
  // page and "!Article header image" at the top of another.
  const stripped = [...body.matchAll(/^!(?!\[).*$/gm)].map((m) => m[0]);
  if (stripped.length > 0) {
    out.push({
      rule: "artifact",
      detail: "stripped image residue, a line starting with ! that is not an image",
      count: stripped.length,
    });
  }

  const usHits = [...stripNonProse(body).matchAll(US_SPELLINGS)].map((m) => m[0]);
  if (usHits.length > 0) {
    out.push({
      rule: "UK English",
      detail: `American spelling: ${[...new Set(usHits.map((w) => w.toLowerCase()))].join(", ")}`,
      count: usHits.length,
    });
  }

  // A heading is sentence case (CLAUDE.md, owner decision 19 Sep). Two or
  // more capitalised words after the first, none of them an acronym or a
  // name, is Title Case. The threshold is deliberately two rather than
  // one, so "Search Console" or "Core Web Vitals" in an otherwise correct
  // heading does not trip it.
  const NAMEY = /^(SEO|AI|GEO|AEO|PPC|LLMs?|UX|UI|CMS|APIs?|ROI|CTAs?|CTR|B2B|B2C|EU|EUDR|GDPR|URLs?|FAQs?|EEAT|AEAT|HTML|CSS|JSON|XML|SERPs?|ISO|VAT|NIE|SL|I|Google|WordPress|ChatGPT|Ahrefs|Moz|Semrush|Analytics|Search|Console|Web|Vitals|Business|Profile|Maps|Ads|Planner|Shopify|WooCommerce|DeepL|Spain|Spanish|France|French|Germany|German|Dutch|Netherlands|Italy|Italian|Portugal|Portuguese|Brazil|Belgium|Switzerland|Europe|European|America|American|China|Chinese|Japan|Japanese|Valencia|Madrid|Barcelona|Michael|Mike|Bastin|Latin|English|Nano|Banana|Pro|Gemini|Claude|Vietnam|Vietnamese|Sagrada|Familia|Gaud\u00ed)$/;
  // Multi-word product names the learned set cannot reach, because their
  // parts ("Manager", "Whisper") are ordinary words that appear lowercase
  // far more often than not. Removed from the heading before it is judged,
  // rather than whitelisted as words, so "Project Manager" elsewhere is
  // still caught.
  const PRODUCTS = /\b(Interlinks Manager|Autolinks Manager|Link Whisper|Internal Link Juicer|Yoast SEO|Rank Math|Screaming Frog|Core Web Vitals|Google Business Profile|Search Console|Google Analytics|Keyword Planner|Nano Banana Pro)\b/g;

  for (const m of body.matchAll(/^#{2,4} (.+)$/gm)) {
    const h = m[1].trim();
    if (/^\*\*.*\*\*$/.test(h)) {
      out.push({ rule: "heading", detail: "bolded heading", count: 1 });
      continue;
    }
    // A heading can contain a full stop ("EEAT. The Google judge"), and the
    // word after it is correctly capitalised. Judge each sentence in the
    // heading on its own rather than treating the whole line as one.
    const words = h
      .replace(PRODUCTS, "")
      .split(/(?<=[.!?])\s+/)
      .flatMap((sent) => (sent.match(/[^\W\d_][\w'\u2019-]*/gu) || []).slice(1));
    const shouty = words
      .filter(
        (w) =>
          /^[A-Z]/.test(w) &&
          w !== w.toUpperCase() &&
          !NAMEY.test(w) &&
          !LEARNED_NAMES.has(w.toLowerCase()) &&
          // an accented capitalised word in English prose is a name
          !(/[^\x00-\x7F]/.test(w) && /^[A-Z]/.test(w))
      );
    if (words.length >= 3 && shouty.length >= 2) {
      out.push({ rule: "heading", detail: "Title Case heading, use sentence case", count: 1 });
    }
  }

  // Links to the legacy WordPress URL structure. Every one of these is
  // either a redirect hop or a 404 on the new site, and they arrived by
  // the hundred with the harvested content.
  const legacy = body.match(/\]\(https:\/\/mikebastin\.com/g);
  if (legacy) {
    out.push({ rule: "link", detail: "link to the legacy mikebastin.com URL", count: legacy.length });
  }

  // JSON-escaped HTML that lost its backslashes on the way out of
  // WordPress, and raw HTML generally: neither belongs in a content file.
  const escaped = body.match(/u003[cCeE]|u0022|u0026/g);
  if (escaped) {
    out.push({ rule: "artifact", detail: "JSON-escaped HTML from the harvester", count: escaped.length });
  }
  const wp = body.match(/wp-content\/uploads/g);
  if (wp) {
    out.push({ rule: "artifact", detail: "WordPress media path", count: wp.length });
  }

  return out;
}

const rows = [];
for (const locale of readdirSync(CONTENT)) {
  const lp = join(CONTENT, locale);
  if (!statSync(lp).isDirectory() || !LINTED_LOCALES.has(locale)) continue;
  for (const type of readdirSync(lp)) {
    const tp = join(lp, type);
    if (!statSync(tp).isDirectory()) continue;
    for (const f of readdirSync(tp)) {
      if (!f.endsWith(".md")) continue;
      const src = readFileSync(join(tp, f), "utf8");
      const parts = src.split(/^---$/m);
      const body = parts.slice(2).join("---").trim();
      // excerpt and title ship as the meta description and <title>, so
      // they are site copy and the same rules apply. An earlier version
      // linted the body only, which let a run of rejected words sit in
      // the one string Google actually renders under the result.
      const meta = (parts[1] || "")
        .split("\n")
        .filter((l) => /^(excerpt|title):/.test(l))
        .join("\n");
      const issues = lint(body + "\n\n" + meta);
      const rel = `site/content/${locale}/${type}/${f}`;
      if (LIVE.has(rel)) {
        issues.push(...contentOnlyIssues(body));
        issues.push(...excerptIssues(meta, f.slice(0, -3)));
      }
      rows.push({
        locale, type, slug: f.slice(0, -3),
        clean: issues.length === 0,
        total: issues.reduce((a, i) => a + i.count, 0),
        issues,
      });
    }
  }
}

if (process.argv.includes("--json")) {
  writeFileSync(
    new URL("../content/copy-lint.json", import.meta.url).pathname,
    JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 1)
  );
  console.log(`wrote content/copy-lint.json (${rows.length} files)`);
} else {
  const clean = rows.filter((r) => r.clean);
  console.log(`linted ${rows.length} English files`);
  console.log(`  clean, publishable as-is:      ${clean.length}`);
  console.log(`  needs a copy pass before use:  ${rows.length - clean.length}`);
  console.log("\nby type:");
  for (const t of [...new Set(rows.map((r) => r.type))]) {
    const sel = rows.filter((r) => r.type === t);
    console.log(`  ${t.padEnd(9)} ${sel.filter((r) => r.clean).length}/${sel.length} clean`);
  }
  const tally = {};
  for (const r of rows) for (const i of r.issues) tally[i.detail] = (tally[i.detail] || 0) + i.count;
  console.log("\nmost common violations:");
  for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${String(v).padStart(4)}  ${k}`);
  }

  // Exit non-zero so CI can gate on it. This script has always printed its
  // findings and then exited 0, which made it a report rather than a check:
  // every violation it ever found still shipped unless somebody happened to
  // read the output. Everything is clean as of 20 Sep, which is the right
  // moment to install the gate, since a gate that starts red gets disabled.
  // `--json` stays a pure reporting mode and never fails.
  const dirty = rows.filter((r) => !r.clean);
  if (dirty.length > 0) {
    console.error(`\n${dirty.length} file(s) need a copy pass:`);
    for (const r of dirty) {
      console.error(`  ${r.type}/${r.slug}: ${r.issues.map((i) => i.detail).join("; ")}`);
    }
    process.exit(1);
  }
}
