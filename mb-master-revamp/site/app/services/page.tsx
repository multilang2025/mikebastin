import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import SiteFooter from "@/components/SiteFooter";
import { SERVICES, CLUSTERS, CLUSTER_HEADING } from "@/lib/services";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import HeroArtSlot from "@/components/HeroArtSlot";
import DlArt from "@/components/DlArt";
import { DL_PAGE_ART } from "@/lib/dl-art";
import { enLanguages } from "@/lib/fr-pages";
import { pageMeta } from "@/lib/meta";

const DESCRIPTION =
  "Global SEO services for companies selling abroad: multilingual SEO, localization, paid search and AI consulting, with every enquiry counted per market.";
const CANONICAL = `${SITE_URL}/services/`;

const HERO_TITLE = "Global SEO services and localization, Mike Bastin";

// Scene illustrations (design/scenes, skill: scene-illustration): one per
// cluster, so the index reads as five pictures of the work rather than five
// walls of cards. Transparent WebP, so each sits on either band in either
// theme. The sentence under each heading says what the group gets you.
const CLUSTER_SCENE: Record<string, { src: string; alt: string; intro: string }> = {
  "Lead generation": {
    src: "/images/scenes/svc-lead-generation.webp",
    alt: "A dashboard of enquiries by market, with new quote requests arriving from Germany and France",
    intro: "Enquiries from each market, counted where they happen and handed to your sales team.",
  },
  Search: {
    src: "/images/scenes/svc-search.webp",
    alt: "The same service page ranking in French, German and Spanish search results, and cited in an AI answer",
    intro: "Found in the language each buyer searches in, on Google and in AI answers.",
  },
  Localization: {
    src: "/images/scenes/svc-localization.webp",
    alt: "One product page in Germany and Switzerland with local prices and payment methods, beside a stamped sworn translation",
    intro: "Sites, prices and documents that read as local in every market you sell to.",
  },
  AI: {
    src: "/images/scenes/svc-ai.webp",
    alt: "An AI answer citing German and Dutch pages, and a machine translation corrected by a native editor",
    intro: "AI where it saves time, and a native reader wherever trust is on the line.",
  },
  Supporting: {
    src: "/images/scenes/svc-technical.webp",
    alt: "A site structure with linked language versions, page speed results and a publishing plan per language",
    intro: "The structure, speed and content plan that every language version ranks on.",
  },
};

export const metadata: Metadata = pageMeta({
  title: HERO_TITLE,
  description: DESCRIPTION,
  path: "/services/",
  languages: enLanguages("/services/"),
  cardAlt: `${HERO_TITLE}. ${DESCRIPTION}`,
});

export default function ServicesIndex() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Services", url: `${SITE_URL}/services/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Multilingual SEO, localization, paid search and AI</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Global SEO services for companies selling across markets
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              More enquiries from every market you sell in, with multilingual SEO at the core and localization, paid search and AI consulting around it.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-8 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Pick the market you want selling next and the service that gets
              it there. Every engagement starts with a free consultation.
            </p>
          </Reveal>
          <Reveal i={4}>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
        {/* Heroes carry animated SVG art (owner, 2 Oct 2026); the static scenes
            sit in the cluster bands below. */}
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name={DL_PAGE_ART.services} />
        </HeroArtSlot>
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
                {/* The per-cluster count that sat here ("3 services") was
                    telling a reader how our own list is arranged, which is
                    the same fault the eyebrows had: information about the
                    site rather than about the work. The services are listed
                    directly underneath and can be counted by anyone who
                    cares. Owner, 22 Sep 2026. */}
                <div
                  className="mb-10 grid items-center gap-x-12 gap-y-6 border-b pb-8 lg:grid-cols-2"
                  style={{ borderColor: "var(--rule)" }}
                >
                  <div className={ci % 2 === 1 ? "lg:order-2" : ""}>
                    <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.12]">
                      {CLUSTER_HEADING[cluster] ?? cluster}
                    </h2>
                    {CLUSTER_SCENE[cluster] && (
                      <p className="max-w-[44ch] text-[1.08rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                        {CLUSTER_SCENE[cluster].intro}
                      </p>
                    )}
                  </div>
                  {CLUSTER_SCENE[cluster] && (
                    <img
                      src={CLUSTER_SCENE[cluster].src}
                      alt={CLUSTER_SCENE[cluster].alt}
                      width={872}
                      height={672}
                      loading="lazy"
                      decoding="async"
                      className="mx-auto w-full max-w-[560px]"
                    />
                  )}
                </div>
              </Reveal>

              <ul className="grid gap-px cells-3 sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
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
                        <span className="ulink mb-2 text-[1.08rem] font-semibold">{s.cardTitle ?? s.name}</span>
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
