/**
 * Convert the harvested WordPress content into Markdown files, one per
 * object, under content/<locale>/<type>/<slug>.md.
 *
 * CLAUDE.md closes the stack as "content as MDX files in the repo", edited
 * either by Claude committing or by the owner through Keystatic. Neither
 * works against a wall of WordPress HTML, so the body is converted to
 * Markdown rather than pasted across: Markdown is what a git-backed editor
 * can actually edit, and it drops Divi's wrapper divs, inline styles and
 * shortcode residue on the way through.
 *
 * Frontmatter carries the `group` field CLAUDE.md requires for binding
 * translation siblings, taken from content-source/translation-groups.json
 * rather than guessed from slugs, which section 2 of the architecture is
 * explicit can never work.
 *
 * Re-runnable: rewrites every file from the snapshot each time, so the
 * snapshot stays the single source and nothing drifts silently.
 */
import TurndownService from "turndown";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { dirname } from "path";

const ROOT = new URL("../../", import.meta.url).pathname;
const SRC = `${ROOT}content-source/`;
const OUT = new URL("../content/", import.meta.url).pathname;

const index = JSON.parse(readFileSync(`${SRC}index.json`, "utf8"));
const groupsFile = JSON.parse(readFileSync(`${SRC}translation-groups.json`, "utf8"));

/** url -> stable group key, so every locale of one thing shares an id. */
const urlToGroup = new Map();
for (const g of groupsFile.groups) {
  for (const url of Object.values(g.locales)) urlToGroup.set(url, g.key);
}
/** Give each group key a short, readable, stable id. */
const groupId = new Map();
for (const [i, g] of groupsFile.groups.entries()) {
  groupId.set(g.key, `g${String(i + 1).padStart(3, "0")}`);
}

const td = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Divi and page-builder residue carries no meaning once the layout is gone.
td.remove(["script", "style", "noscript", "iframe"]);
td.addRule("stripEmptyDivs", {
  filter: (node) =>
    node.nodeName === "DIV" && !node.textContent.trim() && !node.querySelector("img"),
  replacement: () => "",
});

/**
 * Divi stores its layout as [et_pb_*] shortcodes inside post_content. They
 * are layout instructions for a builder this site is leaving, so they carry
 * nothing once the page is Markdown, and 276 of 285 files were full of them.
 * Stripped before conversion, along with any other bare WP shortcode, while
 * keeping the text that sits between an opening and closing pair.
 */
function stripShortcodes(html) {
  let out = String(html || "");
  let prev;
  do {
    prev = out;
    // Self-closing and paired Divi/WP shortcodes, including smart-quoted
    // attribute values, which is how they were saved here.
    out = out.replace(/\[\/?[a-z][a-z0-9_]*(?:\s[^\]]*?)?\]/gi, "");
  } while (out !== prev);
  return out;
}

const strip = (h) =>
  String(h || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const yaml = (v) => `"${String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

rmSync(OUT, { recursive: true, force: true });

let written = 0;
const manifest = [];

for (const [locale, types] of Object.entries(index.locales)) {
  for (const [type, meta] of Object.entries(types)) {
    for (const it of JSON.parse(readFileSync(`${SRC}${meta.file}`, "utf8"))) {
      const key = urlToGroup.get(it.link);
      const gid = key ? groupId.get(key) : null;
      const body = td
        .turndown(stripShortcodes(it.content?.rendered))
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      const title = strip(stripShortcodes(it.title?.rendered));
      const excerpt = strip(stripShortcodes(it.excerpt?.rendered));

      const fm = [
        "---",
        `title: ${yaml(title)}`,
        `slug: ${yaml(it.slug)}`,
        `locale: ${yaml(locale)}`,
        `type: ${yaml(type)}`,
        gid ? `group: ${yaml(gid)}` : `group: null`,
        `wpId: ${it.id}`,
        `date: ${yaml(it.date)}`,
        `modified: ${yaml(it.modified)}`,
        `sourceUrl: ${yaml(it.link)}`,
        excerpt ? `excerpt: ${yaml(excerpt)}` : null,
        "---",
      ]
        .filter(Boolean)
        .join("\n");

      const path = `${OUT}${locale}/${type}/${it.slug}.md`;
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, `${fm}\n\n${body}\n`);
      written++;
      manifest.push({
        locale, type, slug: it.slug, group: gid,
        words: body.split(/\s+/).filter(Boolean).length,
        path: path.slice(OUT.length),
      });
    }
  }
}

writeFileSync(
  `${OUT}manifest.json`,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: written, files: manifest }, null, 1)
);

const thin = manifest.filter((m) => m.words < 150).length;
const totalWords = manifest.reduce((a, m) => a + m.words, 0);
console.log(`${written} files written to site/content/`);
console.log(`words: ${totalWords.toLocaleString()}   under 150 words: ${thin}`);
