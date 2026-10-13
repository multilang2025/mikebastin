import { POST_FIGURES, POST_FIGURE_VERSION } from "@/lib/post-figures";

/**
 * Puts a post's illustrations into its rendered body (owner, 8 Oct 2026:
 * "Add 2-3 similar illustrations on each post").
 *
 * The pictures are keyed by translation group, so the English, French and
 * Spanish versions of one article show the same ones, each with an alt in
 * its own language. A figure sits at the end of a section: `after: 3`
 * places it just before the fourth h2. Translations do not always keep
 * the English section count, which is why the index is per locale.
 *
 * Inserted here rather than written into 150 markdown files, so the copy
 * stays copy and the pictures can be moved or replaced in one place.
 */
export function insertPostFigures(html: string, group: string | undefined, locale: string): string {
  const figures = group ? POST_FIGURES[group] : undefined;
  if (!figures) return html;

  const starts = [...html.matchAll(/<h2\b/g)].map((m) => m.index);
  const inserts: { at: number; html: string }[] = [];
  for (const f of figures) {
    const after = f.after[locale as keyof typeof f.after];
    const alt = f.alt[locale as keyof typeof f.alt];
    if (after === undefined || alt === undefined || after >= starts.length) continue;
    const base = `/images/posts/${f.file}`;
    const v = `?v=${POST_FIGURE_VERSION}`;
    inserts.push({
      at: starts[after],
      html:
        `<figure class="post-photo"><img src="${base}.webp${v}" ` +
        `srcset="${base}-640.webp${v} 640w, ${base}.webp${v} 1200w" ` +
        `sizes="(min-width: 768px) 680px, 100vw" width="1200" height="630" ` +
        `alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async"></figure>\n`,
    });
  }

  let out = html;
  for (const { at, html: fig } of inserts.sort((a, b) => b.at - a.at)) {
    out = out.slice(0, at) + fig + out.slice(at);
  }
  return out;
}
