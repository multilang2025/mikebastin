import { absolute, getSiteUrls, type UrlEntry } from "@/lib/site-urls";

/**
 * The XML behind the sitemap index and its six children.
 *
 * One flat sitemap.xml carried all 147 URLs until 22 September 2026. It
 * was valid and it was hard to read: a drop in indexed French posts and a
 * drop in indexed English service pages looked identical in Search
 * Console, because Search Console reports coverage per submitted sitemap
 * and there was only one. Splitting by locale and by kind means the
 * report answers "which language stopped being indexed" and "is it the
 * pages or the articles" without anyone running a crawl.
 *
 * Six children rather than three, or twelve: locale alone would still mix
 * a service page with an article, and going finer (topics apart from
 * services, say) makes six files into ten that nobody reads separately.
 *
 * Google caps a sitemap at 50,000 URLs and 50MB uncompressed. The largest
 * file here holds 56. The split is for reading, not for capacity, and
 * saying so keeps the next person from assuming it will need revisiting
 * at scale.
 */

const HEAD = '<?xml version="1.0" encoding="UTF-8"?>';
const XHTML = 'xmlns:xhtml="http://www.w3.org/1999/xhtml"';
const NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

/** XML text escaping. A slug or title reaching here with an & or a < is
 *  rare and would produce a file Search Console rejects outright. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * W3C datetime, which is what <lastmod> has to be.
 *
 * The dates in the content front matter are written without a timezone
 * ("2026-07-02T17:34:32"), and a bare datetime is not valid W3C: it is
 * ambiguous, and validators flag it. Bare values are read as UTC rather
 * than as the build machine's local time, so the output does not shift
 * depending on where the build ran.
 */
const w3c = (d: string): string => {
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/.test(d);
  const parsed = new Date(hasZone ? d : `${d}Z`);
  return Number.isNaN(parsed.getTime()) ? d : parsed.toISOString();
};

export type SitemapKey = `${UrlEntry["locale"]}-${UrlEntry["kind"]}s`;

/** The six children, in the order the index lists them. */
export const SITEMAPS: SitemapKey[] = [
  "en-pages",
  "en-posts",
  "fr-pages",
  "fr-posts",
  "es-pages",
  "es-posts",
];

export function entriesFor(key: SitemapKey): UrlEntry[] {
  const [locale, kinds] = key.split("-") as [UrlEntry["locale"], string];
  const kind = kinds.slice(0, -1) as UrlEntry["kind"];
  return getSiteUrls().filter((e) => e.locale === locale && e.kind === kind);
}

/** Newest lastModified in a child, which is what its row in the index carries. */
export function newestLastModified(entries: UrlEntry[]): string | undefined {
  const dates = entries.map((e) => e.lastModified).filter((d): d is string => Boolean(d));
  return dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : undefined;
}

export function urlsetXml(entries: UrlEntry[]): string {
  const body = entries
    .map((e) => {
      const alts = e.languages
        ? Object.entries(e.languages)
            .map(
              (pair) =>
                `\n    <xhtml:link rel="alternate" hreflang="${esc(pair[0])}" href="${esc(pair[1])}"/>`
            )
            .join("")
        : "";
      const mod = e.lastModified ? `\n    <lastmod>${esc(w3c(e.lastModified))}</lastmod>` : "";
      return `  <url>\n    <loc>${esc(absolute(e.path))}</loc>${mod}${alts}\n  </url>`;
    })
    .join("\n");
  return `${HEAD}\n<urlset ${NS} ${XHTML}>\n${body}\n</urlset>\n`;
}

export function indexXml(): string {
  const body = SITEMAPS.map((key) => {
    const mod = newestLastModified(entriesFor(key));
    return (
      `  <sitemap>\n    <loc>${esc(absolute(`/sitemap-${key}.xml`))}</loc>` +
      (mod ? `\n    <lastmod>${esc(w3c(mod))}</lastmod>` : "") +
      `\n  </sitemap>`
    );
  }).join("\n");
  return `${HEAD}\n<sitemapindex ${NS}>\n${body}\n</sitemapindex>\n`;
}

/** Shared by every route below.
 *
 * `output: "export"` writes the body to a file and discards these
 * headers, so what the browser is told the type is comes from the host
 * and the .xml extension, not from here. The content-type is set anyway
 * because `next dev` does serve it, and a route that behaves one way in
 * development and another in the build is its own small trap. */
export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });
}
