import { pageMeta } from "@/lib/meta";
import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ServiceProof from "@/components/ServiceProof";
import SiteFooter from "@/components/SiteFooter";
import Expandables from "@/components/Expandables";
import JsonLd from "@/components/JsonLd";
import ServiceHeroArt from "@/components/ServiceHeroArt";
import { absorbedProse } from "@/lib/absorbed";
import { SERVICES, getService, CLUSTER_INLINE } from "@/lib/services";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { serviceGroupForEnSlug, serviceHreflang } from "@/lib/services-locale";
import HeroArtSlot from "@/components/HeroArtSlot";
import SpanishMarketFlow from "@/components/SpanishMarketFlow";
import { hasDlArt } from "@/lib/dl-art";

function ProcessStepIcon({
  name,
}: {
  name: "search" | "map" | "plan" | "write" | "globe" | "report" | undefined;
}) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4.3 4.3" /></>,
    map: <><path d="m3.5 5 5-2 7 2 5-2v16l-5 2-7-2-5 2z" /><path d="M8.5 3v16m7-14v16" /></>,
    plan: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4.5h6M8.5 10h7m-7 4h7m-7 4h4" /></>,
    write: <><path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5z" /><path d="m13.8 6.7 3.5 3.5" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18" /></>,
    report: <><path d="M4 20V5m0 15h17" /><path d="m7 15 4-4 3 2 5-6" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...shared}>
      {paths[name ?? "search"]}
    </svg>
  );
}

// lead-generation has its own hand-built route at app/services/lead-generation/,
// with the testimonial wall this template does not carry. Excluded here so the
// two do not both try to emit the same static path.
export function generateStaticParams() {
  return SERVICES.filter((s) => s.slug !== "lead-generation").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const title = service.metaTitle ?? `${service.name}, Mike Bastin`;
  const description = service.metaDescription ?? service.lede;
  // FR/ES siblings only exist for the 10 of these 21 EN service slugs that
  // have a qualifying `type: "service"` group in content-map.json (see
  // lib/services-locale.ts's file header); the rest are consolidated
  // pages with nothing to link to, so this stays undefined for them.
  const group = serviceGroupForEnSlug(service.slug);
  const languages = group ? serviceHreflang(group) : undefined;
  return pageMeta({
    title,
    description,
    path: `/services/${service.slug}/`,
    languages,
    cardAlt: `${service.cardTitle ?? service.name}. ${ogSubtitle(service.subhead)}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const siblings = SERVICES.filter(
    (s) => s.cluster === service.cluster && s.slug !== service.slug
  );
  const url = `${SITE_URL}/services/${service.slug}/`;

  // The term the section headings use. See `headingTerm` in lib/services.ts.
  const headingTerm = service.headingTerm ?? service.inline;

  // Bands alternate strictly A/B/A/B (HANDOFF.md §23): the hero is always
  // band-a, and every section after it flips regardless of which optional
  // sections (demand, body, absorbs, siblings) are actually present, so two
  // same-surface bands never end up touching.
  let band: "a" | "b" = "a";
  const nextBand = () => (band = band === "a" ? "b" : "a");
  const bodyBand = service.body && service.body.length > 0 ? nextBand() : undefined;
  const expandablesBand =
    service.expandables && service.expandables.length > 0 ? nextBand() : undefined;
  const engagementBand = nextBand();
  const ctaBand = nextBand();
  const absorbsBand = service.absorbs && service.absorbs.length > 0 ? nextBand() : undefined;
  const siblingsBand = siblings.length > 0 ? nextBand() : undefined;
  const footerBand = nextBand();

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema({
            name: service.name,
            description: service.metaDescription ?? service.lede,
            url,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Services", url: `${SITE_URL}/services/` },
            { name: service.name, url },
          ]),
        ]}
      />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <Link href="/services/" className="ulink mb-8 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              All services
            </Link>
          </Reveal>
          <Reveal i={1}>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="eyebrow">{service.angle}</span>
              {/* The "Pillar" badge that used to sit here was the last one on
                  the site. It is our word for how lib/services.ts organises
                  the cluster, not a reason anyone hires us, and the owner
                  asked for the internal shorthand to come off the sales
                  pages. The flag still drives the footer's services column. */}
            </div>
          </Reveal>
          <Reveal i={2}>
            {/* Owner rule, 21 Sep 2026: the h1 is three to five words and
                carries the term the page is trying to win, with a longer
                h2 under it, set smaller, echoing rather than changing the
                subject. `service.name` stays the label the nav, footer and
                cards use; `service.h1` is the heading. */}
            <h1 className="mb-4 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              {service.h1}
            </h1>
          </Reveal>
          <Reveal i={3}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              {service.subhead}
            </h2>
          </Reveal>
          <Reveal i={4}>
            <p className="max-w-[60ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {service.lede}
            </p>
          </Reveal>
          {/* Proof in the hero, not at the foot of the page. A visitor who
              has never heard of us is deciding whether to keep reading on
              the strength of one paragraph; a named client saying we did
              the work is the cheapest help that decision can get. See
              components/ServiceProof.tsx for why training reviews are
              excluded. */}
          <Reveal i={5}>
            <div className="mt-10">
              <ServiceProof slug={service.slug} />
            </div>
          </Reveal>
          {service.slug === "spanish-seo" && (
            <Reveal i={6}>
              <div className="mt-7">
                <Link href="/contact/" className="btn btn-primary btn-lg">
                  Book a free consultation
                </Link>
              </div>
            </Reveal>
          )}
        </div>
        {/* Desktop only: below lg the hero is already a long column of
            text and proof, and the art would push the lede off screen. */}
        <HeroArtSlot
          visibleOnMobile={hasDlArt("en", service.slug)}
          compactOnMobile={service.slug === "spanish-seo"}
        >
          <ServiceHeroArt slug={service.slug} />
        </HeroArtSlot>
        </div>
      </section>


      {/* ============ BODY (real prose, migrated + adapted from the legacy pages this service absorbs) ============ */}
      {service.body && service.body.length > 0 && (
        <section className={`band band-${bodyBand} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell space-y-14">
            {service.body.map((section, i) => {
              const hasSpanishMarketFlow = service.slug === "spanish-seo" && i === 0;
              const hasArt = Boolean(section.art || hasSpanishMarketFlow);
              return (
              <Reveal key={section.heading} i={i}>
                {/* A section with `art` runs two columns from md up: the
                    illustration takes a fixed-width column and the text
                    keeps its own max-width rather than stretching to fill
                    the row. Below md the art sits above the text, full
                    width. A section with no `art` is unchanged: full width,
                    max-w-[68ch], the plain single-column read every other
                    body section already uses. */}
                <div className={hasArt ? "flex flex-col gap-8 md:flex-row md:items-start" : undefined}>
                  {section.art && (
                    <img
                      src={section.art.src}
                      alt={section.art.alt}
                      width={700}
                      height={516}
                      loading="lazy"
                      className="w-full shrink-0 rounded-[4px] border md:w-[340px]"
                      style={{ borderColor: "var(--rule)" }}
                    />
                  )}
                  <div className={hasArt ? "flex-1" : undefined}>
                    <h2 className="mb-5 max-w-[28ch] text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.18]">
                      {section.heading}
                    </h2>
                    <div className="max-w-[68ch] space-y-4">
                      {section.paragraphs.map((p, j) => (
                        <p key={j} className="text-[1.02rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
                          {p}
                        </p>
                      ))}
                    </div>
                    {section.examples && (
                      <div className="mt-8" aria-label="Spanish wording by market">
                        <p className="mb-3 text-[.82rem] font-semibold uppercase tracking-[.12em]" style={{ color: "var(--berry)" }}>
                          Same offer, local wording
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {section.examples.map((example) => (
                            <div
                              key={example.label}
                              className="rounded border p-4 sm:p-5"
                              style={{ borderColor: "var(--rule)", background: "var(--chip)" }}
                            >
                              <p className="mb-2 text-[.82rem] font-semibold uppercase tracking-[.1em]">
                                {example.label}
                              </p>
                              <p className="text-[.98rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                                {example.sentence}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {section.stats && (
                      <div className="mt-8 grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
                        {section.stats.map((stat) => (
                          <div key={stat.label} className="band flex h-full flex-col px-6 py-6" style={{ background: "var(--bg)" }}>
                            <p className="display mb-3 text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tabular-nums">
                              {stat.value}
                            </p>
                            <p className="mb-4 text-[.98rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                              {stat.label}
                            </p>
                            <p className="mt-auto text-[.82rem] font-medium" style={{ color: "var(--dim)" }}>
                              {stat.source}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {hasSpanishMarketFlow && (
                    <div className="mx-auto w-full max-w-[280px] shrink-0 md:mx-0 md:w-[280px]">
                      <SpanishMarketFlow />
                    </div>
                  )}
                </div>
              </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ ABSORBED DETAIL, COLLAPSED ============ */}
      {service.expandables && service.expandables.length > 0 && (
        <section className={`band band-${expandablesBand} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">Open what you need</p>
              <h2 className="mb-4 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
                {service.expandablesHeading ?? `What ${headingTerm} involves in practice`}
              </h2>
              <p className="mb-8 max-w-[60ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {service.expandablesLede ??
                  `${service.expandables.length} answers to the questions that come up first.`}
              </p>
            </Reveal>
            <Reveal i={1}>
              <Expandables items={service.expandables} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ WHAT THE PAGE COVERS ============ */}
      <section className={`band band-${engagementBand} py-[clamp(56px,8vw,110px)]`}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">From the brief to the reporting</p>
            <h2 className="mb-10 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              How the {headingTerm} engagement runs
            </h2>
          </Reveal>
          {service.process && service.slug === "spanish-seo" ? (
            <>
              <ol className="relative grid gap-7 before:absolute before:bottom-5 before:left-5 before:top-5 before:w-px before:bg-[var(--rule)] lg:grid-cols-6 lg:gap-4 lg:before:left-5 lg:before:right-5 lg:before:top-5 lg:before:h-px lg:before:w-auto">
                {service.process.map((step, i) => (
                  <Reveal key={step.title} i={i}>
                    <li className="relative flex gap-4 lg:flex-col lg:gap-4">
                      <span
                        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
                        style={{ background: "var(--bg)", borderColor: "var(--berry)", color: "var(--berry)" }}
                      >
                        <ProcessStepIcon name={step.icon} />
                      </span>
                      <span className="flex flex-col gap-2 pb-2 lg:pt-1">
                        <span className="text-[1rem] font-semibold leading-[1.35]">{step.title}</span>
                        <span className="text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                          {step.text}
                        </span>
                        <span className="mt-1 text-[.82rem] font-medium leading-[1.4]" style={{ color: "var(--berry)" }}>
                          {step.deliverable}
                        </span>
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ol>
              {service.engagementNote && (
                <p
                  className="mt-8 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border px-4 py-2 text-[.9rem]"
                  style={{ borderColor: "var(--berry)", background: "var(--berry-soft)" }}
                >
                  <span className="font-semibold">{service.engagementNote.title}</span>
                  <span style={{ color: "var(--dim)" }}>{service.engagementNote.text}</span>
                </p>
              )}
            </>
          ) : service.process ? (
            <ol className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
              {service.process.map((step, i, all) => (
                <Reveal key={step.title} i={i}>
                  <li
                    className={`band flex h-full items-baseline gap-4 px-7 py-7${
                      i === all.length - 1 && all.length % 2 === 1 ? " sm:col-span-2" : ""
                    }`}
                    style={{ background: "var(--bg)" }}
                  >
                    <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-2">
                      <span className="text-[1.05rem] font-semibold leading-[1.35]">{step.title}</span>
                      <span className="text-[.98rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                        {step.text}
                      </span>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
          ) : (
          <ol className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {service.sections.map((s, i) => (
              <Reveal key={s} i={i}>
                {/* The grid paints its own rule colour through a 1px gap,
                    so an odd count left the last cell empty and showing
                    that colour as a grey box. The final item spans both
                    columns when the count is odd, which fills the row
                    rather than relying on every list staying even. */}
                <li
                  className={`band flex h-full items-baseline gap-4 px-7 py-7${
                    i === service.sections.length - 1 && service.sections.length % 2 === 1
                      ? " sm:col-span-2"
                      : ""
                  }`}
                  style={{ background: "var(--bg)" }}
                >
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1rem] leading-[1.45]">{s}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          )}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className={`band band-${ctaBand} py-[clamp(64px,9vw,120px)]`}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The next step</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Find out what {headingTerm} could be worth in your markets
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Thirty minutes on which markets matter, what already ranks, and
              what has been tried before. A written scope naming pages and
              deliverables follows. Engagements run month to month.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book your free consultation
              </Link>
              <Link href="/how-i-work/" className="ulink text-[.98rem]">
                See how an engagement runs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ ABSORBS ============ */}
      {service.absorbs && service.absorbs.length > 0 && (
        <section className={`band band-${absorbsBand} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">The whole scope</p>
              <h2 className="mb-5 max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
                What we take on under {headingTerm}
              </h2>
            </Reveal>
            <Reveal i={1}>
              <div className="flex max-w-[64ch] flex-col gap-5 text-[1.02rem] leading-[1.7]">
                {absorbedProse(service.slug).map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ SIBLINGS ============ */}
      {siblings.length > 0 && (
        <section className={`band band-${siblingsBand} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-6">Also in {CLUSTER_INLINE[service.cluster] ?? service.cluster}</p>
            </Reveal>
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}/`} className="ulink text-[1.02rem]">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <SiteFooter band={footerBand} />
    </main>
  );
}
