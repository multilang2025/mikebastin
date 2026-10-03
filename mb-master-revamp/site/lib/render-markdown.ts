import { marked } from "marked";

/**
 * Markdown to page HTML, for posts and for FR and ES service pages. Tables
 * get a scrolling wrapper so a wide one scrolls inside the column on a phone
 * instead of pushing the page sideways (body is overflow-x: hidden, so it
 * would otherwise be cut off). The wrapper's label is in the page language.
 */
const TABLE_LABEL: Record<string, string> = { en: "Table", fr: "Tableau", es: "Tabla" };

export function renderMarkdown(content: string, locale: string = "en"): string {
  return (marked.parse(content, { async: false }) as string)
    .replace(/<table>/g, `<div class="table-wrap" tabindex="0" role="region" aria-label="${TABLE_LABEL[locale] ?? "Table"}"><table>`)
    .replace(/<\/table>/g, "</table></div>");
}
