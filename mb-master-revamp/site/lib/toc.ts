/**
 * Table of contents for a rendered blog post: walks the h2/h3 tags in
 * `marked`'s HTML output, gives each one a stable slug id (marked itself
 * emits none), and returns the outline alongside the id-carrying HTML so
 * the two never drift apart. h1 is the post title already rendered in the
 * hero, so it is not eligible, and h4+ stays out of the outline to keep it
 * a map of the post's real sections rather than every sub-point.
 */
export type TocItem = { id: string; text: string; level: 2 | 3 };

function slugify(text: string, taken: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "section";
  const seen = taken.get(base);
  taken.set(base, (seen ?? 0) + 1);
  return seen ? `${base}-${seen + 1}` : base;
}

export function addHeadingIds(html: string): { html: string; items: TocItem[] } {
  const items: TocItem[] = [];
  const taken = new Map<string, number>();

  const out = html.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (match, levelStr: string, inner: string) => {
      const level = Number(levelStr) as 2 | 3;
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return match;
      const id = slugify(text, taken);
      items.push({ id, text, level });
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );

  return { html: out, items };
}
