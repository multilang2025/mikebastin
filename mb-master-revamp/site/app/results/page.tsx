import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import ImpressionsChart from "@/components/ImpressionsChart";
import ConsolidationDiagram from "@/components/ConsolidationDiagram";
import LocaleTable from "@/components/LocaleTable";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Results, not impressions, Mike Bastin",
  description:
    "A case study is a narrative written afterwards. A report is primary evidence, so see the numbers from real multilingual SEO and localisation work first.",
};

const ROUTES = [
  {
    name: "Named, with permission",
    body: "The strongest proof available, needs a signed yes from the client.",
  },
  {
    name: "Anonymised by sector",
    body: "“A Houston freight forwarder,” figures intact, identifying detail removed.",
  },
  {
    name: "Rebuilt chart",
    body: "Only the shape of the result, redrawn from the underlying numbers, no client artefact published.",
  },
];

export default function ResultsPage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Results, not impressions</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              What actually happened, with the numbers attached
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              A case study is a narrative written afterwards. A report is
              primary evidence. Very few competing consultants can show
              multilingual lead figures at all, and this page is where
              that advantage becomes visible rather than implied.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ THE DIAGNOSIS: charts ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What the data actually said</p>
            <h2 className="mb-5 max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty thousand impressions produced six clicks.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Before rebuilding anything, we pulled ninety days of Search Console
              for the whole domain. The problem was never visibility.
            </p>
          </Reveal>

          <Reveal i={1}>
            <ImpressionsChart />
          </Reveal>
        </div>
      </section>

      {/* ============ THE FIX: schema diagram + locales ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The fix, in structure</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty-three service pages became nineteen.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              One page, one subject, covered properly. Open a cluster to
              see which pages were combined.
            </p>
          </Reveal>

          <ConsolidationDiagram />

          <Reveal>
            <p className="mb-3 mt-16 eyebrow">Three locales, one set of groups</p>
            <h3 className="mb-8 max-w-[24ch] display text-[1.4rem] font-semibold leading-[1.2]">
              Every merge happens in all three languages, or not at all.
            </h3>
          </Reveal>
          <Reveal i={1}>
            <LocaleTable />
          </Reveal>
          <Reveal i={2}>
            <p className="mt-8 max-w-[60ch] text-[.95rem]" style={{ color: "var(--dim)" }}>
              French carries one service more than English and Spanish, which is
              the kind of detail that quietly breaks hreflang if nobody counts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ OPEN BLOCKER ============ */}
      <section className="band band-b py-[clamp(40px,6vw,72px)]">
        <div className="shell">
          <Reveal>
            <div
              className="rounded-[4px] px-7 py-6"
              style={{
                border: "1px dashed color-mix(in oklab, var(--deep) 55%, transparent)",
                background: "color-mix(in oklab, var(--deep) 8%, transparent)",
              }}
            >
              <p className="mb-1 text-[.72rem] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--deep)" }}>
                Blocked
              </p>
              <p className="max-w-[62ch] text-[.95rem] leading-[1.55]">
                No client report has been supplied yet, so every number on
                this page is currently undecided rather than approximate.
                Send one representative report so its actual shape, not a
                guess at it, is what gets designed against. Confidentiality
                level is decided per client once that report exists.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ THREE ROUTES ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Three ways a report can appear here</p>
            <h2 className="mb-10 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              We decide how to publish each client with them
            </h2>
          </Reveal>

          <div className="grid gap-px sm:grid-cols-3" style={{ background: "var(--rule)" }}>
            {ROUTES.map((r, i) => (
              <Reveal key={r.name} i={i}>
                <div className="band h-full px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-2 text-[1.05rem] font-semibold">{r.name}</p>
                  <p className="text-[.9rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {r.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS (live today) ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Four languages, each one the client's choice.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              No Review or AggregateRating schema on any of this, by
              design. Every one is public on the linked Google Business
              Profile, where it can be checked against the source.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter />
    </main>
  );
}
