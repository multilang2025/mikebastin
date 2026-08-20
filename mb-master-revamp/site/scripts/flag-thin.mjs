/**
 * Flag thin pages for later editing, and write the verdict into each file's
 * frontmatter so it travels with the content instead of living in a report
 * nobody re-reads.
 *
 * A bare word count is the wrong test on its own, and would have produced a
 * misleading list here: the three shortest files in the corpus are the 404
 * pages, where short is not a defect. Two further checks run first.
 *
 *   1. Structural pages are exempt. A 404, a contact page and a services
 *      index are meant to be brief.
 *   2. Pages already slated for absorption or retirement by the section 3
 *      consolidation are marked `superseded`, not `thin`. Rewriting a page
 *      that is about to 301 into a pillar is wasted work.
 *
 * What survives both checks is the real editing queue: pages that are thin
 * AND still expected to exist after consolidation.
 *
 * The absorbed-slug list below is checked against the actual filenames in
 * content/en/services/, not written from the prose in section 3. A first
 * pass guessed a "-services" suffix on five translation slugs that do not
 * carry one, and they silently fell through to a softer verdict.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const CONTENT = new URL("../content/", import.meta.url).pathname;

/** Short by design. Word count says nothing useful about these. */
const STRUCTURAL = new Set([
  "404-2", "our-services", "nos-services", "servicios-consultoria-web",
  "nuestros-servicios", "contact-us", "nous-contacter", "contactenos",
  "blog", "homepage", "home", "accueil", "inicio", "privacy-policy",
  "politique-de-confidentialite", "politica-de-privacidad",
]);

/**
 * Slugs the consolidation absorbs into a pillar or retires outright, per
 * CONTENT-ARCHITECTURE.md section 3. Listed by their EN slug; the resolver
 * below maps each locale sibling through its translation group.
 */
const SUPERSEDED_EN = new Set([
  // absorbed into /services/multilingual-seo/
  "global-seo-solutions", "internationalisation", "language-solutions", "multilingual-branding",
  // absorbed into /services/website-localisation/
  "content-localisation", "localisation-testing", "multilingual-cms-integration",
  "wordpress-translation-plugin", "localised-e-commerce-integration", "multilingual-ux-ui-design",
  // absorbed into /services/translation-services/
  "business-translation", "medical-translation", "academic-translation",
  "financial-translation", "legal-translation", "certified-and-sworn-translation-services",
  "expert-translation-services", "transcreation",
  // absorbed into /services/app-and-software-localisation/
  "app-localisation", "software-internationalisation", "multimedia-localisation",
  // absorbed into /services/ai-consulting/ and its sibling
  "ai-consulting-services", "post-ai-editing",
  // absorbed into /services/technical-seo/
  "on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo",
  "link-building", "local-seo",
  // absorbed into /services/multilingual-content/
  "multilingual-seo-copywriting", "cultural-consulting", "multilingual-social-media-management",
  // retired to Globaprom
  "web-design", "digital-marketing",
]);

const THRESHOLDS = { critical: 150, thin: 300, light: 600 };

const files = [];
for (const locale of readdirSync(CONTENT)) {
  const lp = join(CONTENT, locale);
  if (!statSync(lp).isDirectory()) continue;
  for (const type of readdirSync(lp)) {
    const tp = join(lp, type);
    if (!statSync(tp).isDirectory()) continue;
    for (const f of readdirSync(tp)) {
      if (f.endsWith(".md")) files.push({ path: join(tp, f), locale, type, slug: f.slice(0, -3) });
    }
  }
}

const read = (p) => readFileSync(p, "utf8");
const fmValue = (src, key) => (src.match(new RegExp(`^${key}: "(.*)"$`, "m")) || [])[1] || null;

// group -> the EN slug in that group, so a locale sibling inherits the verdict.
const groupEnSlug = new Map();
for (const f of files) {
  const src = read(f.path);
  f.group = fmValue(src, "group");
  f.body = src.split(/^---$/m).slice(2).join("---").trim();
  f.words = f.body.split(/\s+/).filter(Boolean).length;
  if (f.locale === "en" && f.group) groupEnSlug.set(f.group, f.slug);
}

const report = { critical: [], thin: [], light: [], superseded: [], structural: [] };

for (const f of files) {
  const enSlug = f.group ? groupEnSlug.get(f.group) : null;
  let status = null;

  if (STRUCTURAL.has(f.slug) || (enSlug && STRUCTURAL.has(enSlug))) {
    status = "structural";
  } else if (enSlug && SUPERSEDED_EN.has(enSlug)) {
    status = "superseded";
  } else if (f.words < THRESHOLDS.critical) {
    status = "critical";
  } else if (f.words < THRESHOLDS.thin) {
    status = "thin";
  } else if (f.words < THRESHOLDS.light) {
    status = "light";
  }

  // Write the verdict into frontmatter, replacing any previous run's.
  let src = read(f.path).replace(/^editorial: .*\n/m, "").replace(/^words: .*\n/m, "");
  const line = `words: ${f.words}\n${status ? `editorial: "${status}"\n` : ""}`;
  src = src.replace(/^(---\n)/, `$1${line}`);
  writeFileSync(f.path, src);

  if (status && report[status]) report[status].push({ ...f, body: undefined, enSlug });
}

const needsWork = [...report.critical, ...report.thin];
console.log("editorial triage");
console.log(`  critical   ${report.critical.length}`);
console.log(`  thin       ${report.thin.length}`);
console.log(`  light      ${report.light.length}`);
console.log(`  superseded ${report.superseded.length}  (absorbed or retired, no edit needed)`);
console.log(`  structural ${report.structural.length}  (short by design, exempt)`);
console.log(`\nreal editing queue: ${needsWork.length}`);
for (const f of needsWork.sort((a, b) => a.words - b.words)) {
  console.log(`  ${String(f.words).padStart(4)}  ${f.locale}/${f.type}/${f.slug}`);
}
