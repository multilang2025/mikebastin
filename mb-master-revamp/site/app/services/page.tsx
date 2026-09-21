import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import SiteFooter from "@/components/SiteFooter";
import { SERVICES, CLUSTERS } from "@/lib/services";
import { SITE_URL } from "@/lib/schema";

const DESCRIPTION =
  "Multilingual SEO, localisation and AI consulting in nineteen services across five groups, from market strategy to translation, paid search and the technical work underneath.";
const CANONICAL = `${SITE_URL}/services/`;

const HERO_TITLE = "Multilingual SEO services, Mike Bastin";

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
            <p className="eyebrow mb-8">{SERVICES.length} services, {CLUSTERS.length} groups</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Multilingual SEO services
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Ongoing search across several markets is the main engagement, with localisation, paid search and AI consulting around it.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Lead generation, search, localisation, AI and the technical
              work underneath all of it. Start with the job in front of
              you, and we will tell you what it really needs.
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
                    <li className="band group h-full" style={{ background: "var(--bg)" }}>
                      <Link href={`/services/${s.slug}/`} className="flex h-full flex-col px-7 py-8">
                        <span
                          className="mb-5 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300"
                          style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                        >
                          <ServiceIcon slug={s.slug} />
                        </span>
                        <span className="ulink mb-2 text-[1.08rem] font-semibold">{s.name}</span>
                        <p className="text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                          {s.lede}
                        </p>
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
