import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { SERVICES, CLUSTERS } from "@/lib/services";
import { SITE_URL } from "@/lib/schema";

const DESCRIPTION =
  "Multilingual SEO, localisation and AI consulting in nineteen services across five groups, each one focused on a single subject rather than spread thin.";
const CANONICAL = `${SITE_URL}/services/`;

const HERO_TITLE = "Multilingual SEO, localisation and AI consulting services, Mike Bastin";

export const metadata: Metadata = {
  title: HERO_TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  // og:image/twitter:image come from the colocated opengraph-image.tsx
  // (Next.js file-convention metadata), not an `images` array here.
  openGraph: {
    type: "website",
    siteName: "Mike Bastin",
    locale: "en_GB",
    url: CANONICAL,
    title: HERO_TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: HERO_TITLE,
    description: DESCRIPTION,
  },
};

export default function ServicesIndex() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{SERVICES.length} services, five focus areas</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Multilingual SEO, localisation and AI consulting services
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Lead generation, search, localisation, AI and the technical
              work underneath all of it, each with its own page built to
              cover one subject properly rather than several thinly.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ CLUSTERS ============ */}
      {CLUSTERS.map((cluster, ci) => {
        const inCluster = SERVICES.filter((s) => s.cluster === cluster);
        return (
          <section
            key={cluster}
            className={`band ${ci % 2 === 0 ? "band-b" : "band-a"} py-[clamp(48px,7vw,96px)]`}
          >
            <div className="shell">
              <Reveal>
                <div className="mb-8 flex items-baseline justify-between gap-6 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
                  <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.15]">
                    {cluster}
                  </h2>
                  <span className="shrink-0 text-[.78rem] uppercase tracking-[.11em]" style={{ color: "var(--dim)" }}>
                    {inCluster.length} {inCluster.length === 1 ? "service" : "services"}
                  </span>
                </div>
              </Reveal>

              <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
                {inCluster.map((s, i) => (
                  <Reveal key={s.slug} i={i}>
                    <li className="band h-full" style={{ background: "var(--bg)" }}>
                      <Link href={`/services/${s.slug}/`} className="flex h-full flex-col px-7 py-8">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="ulink text-[1.08rem] font-semibold">{s.name}</span>
                          {s.pillar && (
                            <span
                              className="rounded-[3px] px-[7px] py-[2px] text-[.6rem] uppercase tracking-[.1em]"
                              style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                            >
                              Pillar
                            </span>
                          )}
                        </div>
                        <p className="mb-4 text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                          {s.lede}
                        </p>
                        <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 text-[.72rem] uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
                          {s.gsc && (
                            <span style={{ color: "var(--berry)" }}>
                              {s.gsc.impressions.toLocaleString("en-GB")} impressions in 90 days
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <SiteFooter />
    </main>
  );
}
