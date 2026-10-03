import { marked } from "marked";
import LEGACY_SIZES from "@/lib/legacy-image-sizes.json";

/**
 * Markdown to page HTML, for posts and for FR and ES service pages. Tables
 * get a wrapper (labelled in the page language) that scrolls a wide
 * two-column table inside the column and stacks a wider one into cards on
 * a phone; see tuneTables below.
 */
const TABLE_LABEL: Record<string, string> = { en: "Table", fr: "Tableau", es: "Tabla" };

const SIZES = LEGACY_SIZES as unknown as Record<string, [number, number]>;

/**
 * Images inside a post body load lazily and decode off the main thread, and
 * the ones carried over from WordPress get their recorded width and height
 * (lib/legacy-image-sizes.json, written by `npm run images:legacy`), so the
 * text below them never jumps when they arrive.
 */
function tuneImages(html: string): string {
  return html.replace(/<img\b([^>]*)>/g, (tag, attrs: string) => {
    let a = attrs.replace(/\s*\/$/, "");
    const src = /\bsrc="([^"]+)"/.exec(a)?.[1];
    const size = src ? SIZES[src] : undefined;
    if (size && !/\bwidth=/.test(a)) a += ` width="${size[0]}" height="${size[1]}"`;
    if (!/\bloading=/.test(a)) a += ' loading="lazy"';
    if (!/\bdecoding=/.test(a)) a += ' decoding="async"';
    return `<img${a}>`;
  });
}

const stripTags = (h: string) =>
  h.replace(/<[^>]+>/g, "").replace(/"/g, "&quot;").replace(/\s+/g, " ").trim();

/**
 * Tables on phones (owner, 3 Oct 2026: "make tables in blog posts
 * responsive"). Every body cell gets its column heading as `data-label`,
 * and a table of three or more columns is marked `table-stack`, which
 * globals.css turns into one card per row below 640px, each value under
 * its heading. Two-column tables already fit a phone and keep the grid.
 */
function tuneTables(html: string, locale: string): string {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (_t, inner: string) => {
    const head = /<thead>([\s\S]*?)<\/thead>/.exec(inner)?.[1] ?? "";
    const labels = [...head.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/g)].map((m) => stripTags(m[1]));
    const body = inner.replace(/<tbody>([\s\S]*?)<\/tbody>/, (_b, rows: string) =>
      "<tbody>" +
      rows.replace(/<tr>([\s\S]*?)<\/tr>/g, (_r, cells: string) => {
        let i = 0;
        return (
          "<tr>" +
          cells.replace(/<td\b([^>]*)>/g, (_c, attrs: string) => {
            const label = labels[i++];
            return label ? `<td${attrs} data-label="${label}">` : `<td${attrs}>`;
          }) +
          "</tr>"
        );
      }) +
      "</tbody>",
    );
    const stack = labels.length >= 3 ? " table-stack" : "";
    return `<div class="table-wrap${stack}" tabindex="0" role="region" aria-label="${TABLE_LABEL[locale] ?? "Table"}"><table>${body}</table></div>`;
  });
}

/**
 * Diagrams draw themselves in once, when they scroll into view (owner,
 * 3 Oct 2026: "add svg diagrams and animations in the blog posts"). The
 * figure joins the site's scroll reveal (`reveal`, driven by the pre-paint
 * script in app/layout.tsx), each stroke gets `pathLength="1"` so CSS can
 * draw it from 0 to 1, and each shape and label gets an order index for a
 * short stagger. Nothing loops (declaudify brief); with reduced motion or
 * no JavaScript the figure is simply there. Dashed strokes keep their
 * dashes and are only faded in.
 */
function tuneFigures(html: string): string {
  return html.replace(/<figure class="post-fig">([\s\S]*?)<\/figure>/g, (_f, inner: string) => {
    let n = 0;
    const svg = inner.replace(/<(line|path|polyline|polygon|rect|circle|ellipse|text)\b([^>]*?)(\/?)>/g, (tag, el: string, attrs: string, close: string) => {
      const i = n++;
      let a = attrs;
      if (/^(line|path|polyline)$/.test(el) && !/stroke-dasharray|fg-dash/.test(a) && !/\bpathLength=/.test(a)) a += ' pathLength="1"';
      a += ` style="--fi:${Math.min(i, 24)}"`;
      return `<${el}${a}${close}>`;
    });
    return `<figure class="post-fig reveal">${svg}</figure>`;
  });
}

export function renderMarkdown(content: string, locale: string = "en"): string {
  return tuneFigures(tuneTables(tuneImages(marked.parse(content, { async: false }) as string), locale));
}
