import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "The competitor analysis and traffic checklist, Mike Bastin",
  description:
    "18,522 impressions in ninety days, ranking at position 56. The single highest-value content job on the domain.",
};

const SECTIONS = [
  {
    name: "Traffic sourcing",
    body: "Where a competitor's visitors are actually coming from, by market and by locale, not a single blended number.",
  },
  {
    name: "Keyword overlap",
    body: "The query networks a competitor already owns, mapped against the reader's own topical border.",
  },
  {
    name: "Content gaps",
    body: "What a competitor covers that the reader does not, read as opportunity rather than as a threat list.",
  },
  {
    name: "Technical tells",
    body: "The crawlability and hreflang signals that separate a site actually built for multiple markets from one that only translated its homepage.",
  },
  {
    name: "The checklist itself",
    body: "A genuinely usable, save-and-reuse artefact, not a listicle wearing a checklist's clothes.",
  },
];

export default function CompetitorChecklistPage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">The biggest asset on the domain, ranking nowhere</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              The competitor analysis and traffic checklist
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              18,522 impressions in ninety days. Position 56. The single
              highest-value content job in the whole project is not
              writing something new, it is finally giving this page
              content that matches the attention it already earns for
              free.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ METRICS ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        <div className="shell">
          <div
            className="grid gap-px"
            style={{
              background: "var(--rule)",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {[
              { v: "18,522", k: "90-day impressions" },
              { v: "56", k: "Current position" },
            ].map((m, i) => (
              <div key={m.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                <Reveal i={i}>
                  <div className="display text-[clamp(2.1rem,4.4vw,3.1rem)] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                    {m.v}
                  </div>
                  <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                    {m.k}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT THE CHECKLIST COVERS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What the checklist actually has to cover</p>
            <h2 className="mb-10 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Five sections, one usable artefact
            </h2>
          </Reveal>

          <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {SECTIONS.map((s, i) => (
              <Reveal key={s.name} i={i}>
                <div className="band h-full px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-2 text-[1.1rem] font-semibold">{s.name}</p>
                  <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter />
    </main>
  );
}
