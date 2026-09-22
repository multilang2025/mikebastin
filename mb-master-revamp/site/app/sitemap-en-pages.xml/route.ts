import { entriesFor, urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

/** English pages. One of the six children listed by /sitemap.xml. */
export const dynamic = "force-static";

export function GET() {
  return xmlResponse(urlsetXml(entriesFor("en-pages")));
}
