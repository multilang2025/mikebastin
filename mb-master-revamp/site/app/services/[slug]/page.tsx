import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import QueryTerms from "@/components/QueryTerms";
import ServiceProof from "@/components/ServiceProof";
import SiteFooter from "@/components/SiteFooter";
import Expandables from "@/components/Expandables";
import JsonLd from "@/components/JsonLd";
import { absorbedProse } from "@/lib/absorbed";
import { SERVICES, getService, CLUSTER_INLINE } from "@/lib/services";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { serviceGroupForEnSlug, serviceHreflang } from "@/lib/services-locale";

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
  const canonical = `${SITE_URL}/services/${service.slug}/`;
  // FR/ES siblings only exist for the 10 of these 21 EN service slugs that
  // have a qualifying `type: "service"` group in content-map.json (see
  // lib/services-locale.ts's file header); the rest are consolidated
  // pages with nothing to link to, so this stays undefined for them.
  const group = serviceGroupForEnSlug(service.slug);
  const languages = group ? serviceHreflang(group) : undefined;
  return {
    title,
    description,
    alternates: { canonical, ...(languages ? { languages } : {}) },
    // The og:image/twitter:image tags themselves come from the colocated
    // opengraph-image.tsx (Next.js's file-convention metadata, injected
    // automatically per docs/opengraph-image.md), not from an `images`
    // array here, so a per-service card can never drift from the file
    // that actually renders it.
    openGraph: {
      type: "website",
      siteName: "Mike Bastin",
      locale: "en_GB",
      url: canonical,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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

  // Bands alternate strictly A/B/A/B (HANDOFF.md §23): the hero is always
  // band-a, and every section after it flips regardless of which optional
  // sections (demand, body, absorbs, siblings) are actually present, so two
  // same-surface bands never end up touching.
  let band: "a" | "b" = "a";
  const nextBand = () => (band = band === "a" ? "b" : "a");
  const demandBand = service.demand ? nextBand() : undefined;
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
        <div className="shell relative">
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
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              {service.name}
            </h1>
          </Reveal>
          <Reveal i={3}>
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
          <Reveal i={4}>
            <div className="mt-10">
              <ServiceProof slug={service.slug} />
            </div>
          </Reveal>
        </div>
      </section>


      {/* ============ MEASURED DEMAND ============ */}
      {service.demand && (
        <section className={`band band-${demandBand} py-[clamp(48px,7vw,90px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-6">Measured demand, Ahrefs, 20 August 2026</p>
            </Reveal>
            <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
              {[
                { v: service.demand.volume.toLocaleString("en-GB"), k: "Worldwide monthly searches" },
                { v: service.demand.kd, k: "Keyword difficulty" },
              ].map((m, i) => (
                <div key={m.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                  <Reveal i={i}>
                    <div className="display text-[clamp(2rem,4.2vw,2.9rem)] font-semibold leading-none tabular-nums" style={{ color: "var(--berry)" }}>
                      {m.v}
                    </div>
                    <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                      {m.k}
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
            <Reveal i={2}>
              <p className="mt-6 max-w-[62ch] text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                <QueryTerms text={service.demand.note} />
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ BODY (real prose, migrated + adapted from the legacy pages this service absorbs) ============ */}
      {service.body && service.body.length > 0 && (
        <section className={`band band-${bodyBand} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell space-y-14">
            {service.body.map((section, i) => (
              <Reveal key={section.heading} i={i}>
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
              </Reveal>
            ))}
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
                {service.expandablesHeading ?? `What ${service.inline} involves in practice`}
              </h2>
              <p className="mb-8 max-w-[60ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {service.expandablesLede ??
                  `${service.expandables.length} answers to the questions that come up first.`}{" "}
                Open the ones that apply to your job and leave the rest closed.
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
              How the {service.inline} engagement runs
            </h2>
          </Reveal>
          <ol className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {service.sections.map((s, i) => (
              <Reveal key={s} i={i}>
                <li className="band flex h-full items-baseline gap-4 px-7 py-7" style={{ background: "var(--bg)" }}>
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1rem] leading-[1.45]">{s}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className={`band band-${ctaBand} py-[clamp(64px,9vw,120px)]`}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The next step</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Find out what {service.inline} could be worth in your markets
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Thirty minutes on which markets matter, what already ranks, and
              what has been tried before. We ask questions before we recommend
              anything, and what comes back is a written scope naming real
              pages and deliverables, not a quote with plan tiers on it. No
              lock-in either way.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book the discovery call
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
                What we take on under {service.inline}
              </h2>
              <p className="mb-10 max-w-[60ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                Most briefs ask for one part of the work and turn out to
                need two or three. Here is the full ground it covers, so
                you can see at a glance whether your job sits inside it.
              </p>
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
