import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import SiteFooter from "@/components/SiteFooter";
import Expandables from "@/components/Expandables";
import { SERVICES, CLUSTERS, CLUSTER_HEADING } from "@/lib/services";
import { GBP_URL, TESTIMONIALS } from "@/lib/testimonials";
import ReviewText from "@/components/ReviewText";
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

const MARKET_LINKS = [
  { name: "France", slug: "french-seo" },
  { name: "Germany", slug: "german-seo" },
  { name: "Spain", slug: "spanish-seo" },
  { name: "the Netherlands", slug: "dutch-seo" },
  { name: "Italy", slug: "italian-seo" },
  { name: "Portugal", slug: "portuguese-seo" },
];

const FEATURED_SEARCH_SERVICES = [
  "multilingual-seo",
  "french-seo",
  "spanish-seo",
  "dutch-seo",
  "local-seo",
];

const QUESTIONS = [
  {
    q: "How much does multilingual SEO cost?",
    a: [
      "It depends on the markets, languages, pages and writing or localization involved. After a free consultation, you get a written scope and a fee for the work. If paid search is included, its media budget is separate.",
    ],
  },
  {
    q: "How long does it take to see results?",
    a: [
      "In our experience, the first measurable change arrives within about three months. Broader ranking shifts across several languages take two to three quarters, as new content and technical changes need time to be crawled and trusted. Every market moves at its own pace.",
    ],
  },
  {
    q: "Which languages do you work in?",
    a: [
      "Our SEO services cover French, German, Spanish, Dutch, Italian and Portuguese. Tell us which markets and languages matter to your business, and we’ll recommend where to start.",
    ],
  },
];

// Scene illustrations (design/scenes, skill: scene-illustration): one per
// cluster, so the index reads as five pictures of the work rather than five
// walls of cards. Transparent WebP, so each sits on either band in either
// theme. The sentence under each heading says what the group gets you.
const CLUSTER_SCENE: Record<string, { src: string; alt: string; intro: string }> = {
  "Lead generation": {
    src: "/images/scenes/svc-lead-generation.webp",
    alt: "A dashboard of enquiries by market, with new quote requests arriving from Germany and France",
    intro: "One enquiry count per market, so you see which language pays back. We set up the tracking, run paid search where it helps, and hand your sales team enquiries worth a call, each one labelled with the market it came from.",
  },
  Search: {
    src: "/images/scenes/svc-search.webp",
    alt: "The same service page ranking in French, German and Spanish search results, and cited in an AI answer",
    intro: "One strategy across your markets, then pages for each language, researched from that market's own searches and written by a native speaker. French, German, Spanish, Dutch, Italian and Portuguese each have their own service below, so buyers find a supplier that sounds local on Google and in AI answers.",
  },
  Localization: {
    src: "/images/scenes/svc-localization.webp",
    alt: "One product page in Germany and Switzerland with local prices and payment methods, beside a stamped sworn translation",
    intro: "Websites, apps and documents adapted for each market: prices, form fields, trust marks and certified translation, done by native specialists through the BeTranslated network we have run for over two decades, so everything reads as local.",
  },
  AI: {
    src: "/images/scenes/svc-ai.webp",
    alt: "An AI answer citing German and Dutch pages, and a machine translation corrected by a native editor",
    intro: "AI used where it saves time, and a native specialist reading wherever trust is decided. We sort your multilingual content into what a machine can draft and what needs a person, and build pages that ChatGPT, Perplexity and Google's AI Overviews can cite.",
  },
  Supporting: {
    src: "/images/scenes/svc-technical.webp",
    alt: "A site structure with linked language versions, page speed results and a publishing plan per language",
    intro: "The foundations under every language version: a site structure each market can find, fast pages, and a content plan built from what buyers search for. We put the fixes in ourselves or brief your developers, and check every month that they hold.",
  },
};

function ConsultationCta({
  band,
  showHeading = true,
}: {
  band: "band-a" | "band-b";
  showHeading?: boolean;
}) {
  return (
    <section className={`band ${band} py-[clamp(48px,7vw,80px)]`}>
      <div className="shell">
        <div className="mx-auto max-w-[58ch] text-center">
          {showHeading && (
            <Reveal>
              <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.12]">
                Find the right service to start with
              </h2>
            </Reveal>
          )}
          <Reveal i={showHeading ? 1 : 0}>
            <p className="mb-8 text-[1.08rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
              Tell us the markets you sell in and we&apos;ll recommend where to start.
            </p>
          </Reveal>
          <Reveal i={showHeading ? 2 : 1}>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

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
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">For businesses ready to grow beyond their home market</p>
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book a free consultation
              </Link>
              <Link href="/how-i-work/" className="btn btn-secondary btn-lg">
                How it works
              </Link>
            </div>
          </Reveal>
        </div>
        {/* Heroes carry animated SVG art (owner, 2 Oct 2026); the static scenes
            sit in the cluster bands below. */}
        <div className="services-hero-art">
          <HeroArtSlot visibleOnMobile={true}>
            <DlArt name={DL_PAGE_ART.services} />
          </HeroArtSlot>
        </div>
        </div>
        <nav aria-label="Find SEO services by market" className="shell mt-10">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[.98rem] leading-[1.5]">
            <span style={{ color: "var(--dim)" }}>More enquiries from</span>
            {MARKET_LINKS.map((market, index) => (
              <Fragment key={market.slug}>
                {index > 0 && <span aria-hidden="true" style={{ color: "var(--dim)" }}>/</span>}
                <Link href={`/services/${market.slug}/`} className="ulink font-medium">
                  {market.name}
                </Link>
              </Fragment>
            ))}
          </p>
        </nav>
      </section>

      {/* ============ CLUSTERS ============ */}
      {CLUSTERS.map((cluster, ci) => {
        const inCluster = SERVICES.filter((s) => s.cluster === cluster);
        const featured =
          cluster === "Search"
            ? FEATURED_SEARCH_SERVICES.map((slug) => inCluster.find((s) => s.slug === slug)).filter(
                (service) => service !== undefined,
              )
            : inCluster;
        const moreOptions =
          cluster === "Search"
            ? inCluster.filter((service) => !FEATURED_SEARCH_SERVICES.includes(service.slug))
            : [];
        const renderCards = (services: typeof inCluster) =>
          services.map((s, i) => (
            <Reveal key={s.slug} i={i}>
              <li className="band group h-full" style={{ background: "var(--bg)" }}>
                <Link href={`/services/${s.slug}/`} className="flex h-full flex-col px-7 py-8">
                  <span
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300"
                    style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                  >
                    <ServiceIcon slug={s.slug} />
                  </span>
                  {s.slug === "multilingual-seo" && (
                    <span
                      className="mb-3 w-fit rounded-full px-3 py-1 text-[.78rem] font-semibold"
                      style={{ background: "var(--berry-soft)", color: "var(--berry)" }}
                    >
                      Our core service
                    </span>
                  )}
                  <span className="ulink mb-2 text-[1.08rem] font-semibold">{s.cardTitle ?? s.name}</span>
                  <p className="text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                    {s.lede}
                  </p>
                </Link>
              </li>
            </Reveal>
          ));
        return (
          <Fragment key={cluster}>
          <section
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
                      <p className="max-w-[54ch] text-[1.08rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
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
                {renderCards(featured)}
              </ul>
              {moreOptions.length > 0 && (
                <details className="group mt-6">
                  <summary className="btn btn-secondary inline-flex cursor-pointer list-none items-center gap-3">
                    Find more options
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m4 7 6 6 6-6" />
                    </svg>
                  </summary>
                  <ul className="mt-6 grid gap-px cells-3 sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
                    {renderCards(moreOptions)}
                  </ul>
                </details>
              )}
            </div>
          </section>
          {cluster === "Search" && <ConsultationCta band="band-b" />}
          </Fragment>
        );
      })}

      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.12]">
              Common questions about our services
            </h2>
          </Reveal>
          <p className="review-q mb-8 max-w-[72ch] text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
            “<ReviewText text={TESTIMONIALS.find((r) => r.name === "Sammy Cooil")!.quote} />”
            {" · Sammy C. · "}
            <a href={GBP_URL} className="ulink" target="_blank" rel="noopener noreferrer">
              Google review
            </a>
          </p>
          <Expandables items={QUESTIONS} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
