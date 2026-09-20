import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/schema";
import { getSiteUrls, SECTION_ORDER, type UrlEntry } from "@/lib/site-urls";

/**
 * The HTML sitemap, for people rather than crawlers.
 *
 * Reads lib/site-urls.ts, the same list app/sitemap.ts turns into
 * sitemap.xml, so the two cannot drift. A hand-kept HTML sitemap is
 * guaranteed to fall behind the XML one, and the version a visitor sees is
 * the one that would be wrong.
 *
 * Grouped by section and counted, because a flat list of 150 links tells a
 * reader nothing about the shape of the site, which is the only reason to
 * offer an HTML sitemap at all.
 */

const DESCRIPTION =
  "Every page on mikebastin.com in one list: services, the journal and its topics, client work, and the French and Spanish pages.";

export const metadata: Metadata = {
  title: "Sitemap, Mike Bastin",
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/sitemap/` },
  openGraph: {
    title: "Sitemap, Mike Bastin",
    description: DESCRIPTION,
    url: `${SITE_URL}/sitemap/`,
    type: "website",
  },
};

export default function SitemapPage() {
  const urls = getSiteUrls();

  const sections = SECTION_ORDER.map((name) => ({
    name,
    items: urls.filter((u) => u.section === name),
  })).filter((s) => s.items.length > 0);

  // A section the ordering does not name would otherwise vanish silently.
  const named = new Set(SECTION_ORDER);
  const unlisted = urls.filter((u) => !named.has(u.section));
  if (unlisted.length > 0) {
    sections.push({ name: "Other", items: unlisted });
  }

  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,90px)] pt-[clamp(88px,13vw,150px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">{urls.length} pages, nothing hidden</p>
            <h1 className="mb-7 max-w-[16ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
              Everything on this site
            </h1>
            <p className="max-w-[60ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {DESCRIPTION} Crawlers get the same list as{" "}
              <a href="/sitemap.xml" className="ulink">
                sitemap.xml
              </a>
              , built from the same source so the two cannot disagree.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTIONS ============ */}
      {sections.map((section, si) => (
        <section
          key={section.name}
          className={`band ${si % 2 === 0 ? "band-b" : "band-a"} py-[clamp(40px,6vw,80px)]`}
        >
          <div className="shell">
            <Reveal>
              <div
                className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b pb-4"
                style={{ borderColor: "var(--rule)" }}
              >
                <h2 className="text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold leading-[1.15]">
                  {section.name}
                </h2>
                <span
                  className="shrink-0 text-[.76rem] uppercase tracking-[.11em]"
                  style={{ color: "var(--dim)" }}
                >
                  {section.items.length} {section.items.length === 1 ? "page" : "pages"}
                </span>
              </div>
            </Reveal>

            <Reveal i={1}>
              <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item: UrlEntry) => (
                  <li key={item.path} className="leading-[1.45]">
                    <Link href={item.path} className="ulink text-[.95rem]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}

      <SiteFooter band={sections.length % 2 === 0 ? "b" : "a"} />
    </main>
  );
}
