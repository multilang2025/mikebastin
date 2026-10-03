import { marked } from "marked";
import LEGACY_SIZES from "@/lib/legacy-image-sizes.json";

/**
 * Markdown to page HTML, for posts and for FR and ES service pages. Tables
 * get a scrolling wrapper so a wide one scrolls inside the column on a phone
 * instead of pushing the page sideways (body is overflow-x: hidden, so it
 * would otherwise be cut off). The wrapper's label is in the page language.
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

export function renderMarkdown(content: string, locale: string = "en"): string {
  return tuneImages(marked.parse(content, { async: false }) as string)
    .replace(/<table>/g, `<div class="table-wrap" tabindex="0" role="region" aria-label="${TABLE_LABEL[locale] ?? "Table"}"><table>`)
    .replace(/<\/table>/g, "</table></div>");
}
