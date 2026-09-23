import { indexXml, xmlResponse } from "@/lib/sitemap-xml";

/**
 * The sitemap index. Lists the six children and nothing else, which is
 * what robots.txt points at and what gets submitted to Search Console.
 *
 * Replaces the `app/sitemap.ts` metadata convention, which can only
 * produce a single <urlset>. An index is a different root element, so the
 * convention cannot express it.
 */
export const dynamic = "force-static";

export function GET() {
  return xmlResponse(indexXml());
}
