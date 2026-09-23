import { entriesFor, urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

/** French pages. One of the six children listed by /sitemap.xml. */
export const dynamic = "force-static";

export function GET() {
  return xmlResponse(urlsetXml(entriesFor("fr-pages")));
}
