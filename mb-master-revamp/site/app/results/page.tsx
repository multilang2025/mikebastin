import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import { PROJECTS } from "@/lib/projects";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// Owner, 2 Oct 2026: the page used to show this site's own rebuild (its own
// Search Console and its own 43-to-19 service merge) under a heading that
// promised client engagements. It now carries the sites we run search for,
// from the same live Search Console figures the case studies already publish
// (lib/projects.ts, May to July 2026, owner-approved to name). Owned
// properties are labelled as ours rather than passed off as clients.
const OWNED = new Set(["valenciamove", "betranslated", "matosurf"]);

function toNumber(s: string) {
  return Number(s.replace(/,/g, ""));
}

const WITH_SEARCH = PROJECTS.filter((p) => p.search).sort(
  (a, b) => toNumber(b.search!.clicks) - toNumber(a.search!.clicks),
);

const TOTAL_CLICKS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.clicks), 0);
const TOTAL_IMPRESSIONS = WITH_SEARCH.reduce((n, p) => n + toNumber(p.search!.impressions), 0);
const CLICKS = TOTAL_CLICKS.toLocaleString("en-GB");
const MILLIONS = (TOTAL_IMPRESSIONS / 1_000_000).toFixed(1);
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
const SITE_COUNT = WORDS[WITH_SEARCH.length] ?? String(WITH_SEARCH.length);

export const metadata: Metadata = {
  ...pageMeta({
    title: "Client results you can count, Mike Bastin",
    description: `Live Search Console figures from ${SITE_COUNT} sites we run search for: ${CLICKS} clicks from ${MILLIONS} million impressions in three months, each with its case study.`,
    path: "/results/",
  }),
};

export default function ResultsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Results", url: `${SITE_URL}/results/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Results you can count</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Client results and numbers
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-8 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Live search figures from the sites we run, each one linked to the case study that explains the work behind it.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="clock" />
        </HeroArtSlot>
        </div>
      </section>

      {/* ============ THE FIGURES ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Three months of Google search</p>
            <h2 className="mb-5 max-w-[22ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              {CLICKS} clicks from {MILLIONS} million impressions.
            </h2>
            <p className="mb-4 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Across {SITE_COUNT} sites we run search for, from a Valencia law
              firm working in four languages to a Dutch powder coating
              specialist. Open any row for the brief, the work and the outcome.
            </p>
            <blockquote className="mb-12 max-w-[56ch] text-[.85rem]" style={{ color: "var(--dim)" }}>
              Source: Google Search Console, May to July 2026.
            </blockquote>
          </Reveal>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
            {WITH_SEARCH.map((p, i) => (
              <Reveal key={p.slug} i={i}>
                <Link
                  href={`/projects/${p.slug}/`}
                  className="group grid grid-cols-3 gap-x-3 gap-y-4 py-6 sm:gap-x-6 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] md:items-baseline"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <span className="col-span-3 flex flex-col gap-1 md:col-span-1">
                    <span className="display text-[1.15rem] font-semibold transition-colors duration-300 group-hover:text-[var(--berry)]">
                      {p.name}
                    </span>
                    <span className="text-[.88rem]" style={{ color: "var(--dim)" }}>
                      {p.angle}
                      {OWNED.has(p.slug) ? ", our own site" : ""}
                    </span>
                  </span>
                  {[
                    { v: p.search!.clicks, k: "Clicks" },
                    { v: p.search!.impressions, k: "Impressions" },
                    { v: p.search!.position, k: "Avg. position" },
                  ].map((m) => (
                    // Sized so a seven-digit figure and its label each hold
                    // one line in a third of a 360px phone (owner, 3 Oct
                    // 2026: "2,399,56 / 7" broke across lines).
                    <span key={m.k} className="flex min-w-0 flex-col gap-1">
                      <span className="display whitespace-nowrap text-[clamp(.98rem,4.4vw,1.2rem)] font-semibold leading-none tabular-nums" style={{ color: "var(--berry)" }}>
                        {m.v}
                      </span>
                      <span className="whitespace-nowrap text-[.62rem] uppercase tracking-[.06em] sm:text-[.7rem] sm:tracking-[.12em]" style={{ color: "var(--dim)" }}>
                        {m.k}
                      </span>
                    </span>
                  ))}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clients review us in their own language.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Every one is public on the linked Google Business Profile,
              where it can be checked against the source.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter band="b" />
    </main>
  );
}
