import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Results, not impressions, Mike Bastin",
  description:
    "A case study is a narrative written afterwards. A report is primary evidence.",
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

      {/* ============ OPEN BLOCKER ============ */}
      <section className="band band-b py-[clamp(40px,6vw,72px)]">
        <div className="shell">
          <Reveal>
            <div
              className="rounded-[4px] px-7 py-6"
              style={{
                border: "1px dashed color-mix(in oklab, var(--gold) 55%, transparent)",
                background: "color-mix(in oklab, var(--gold) 8%, transparent)",
              }}
            >
              <p className="mb-1 text-[.72rem] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--gold)" }}>
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
              Decided per client, once the report exists
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
            <p className="eyebrow mb-3">In their words, in their languages</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Ten reviews. Four languages. Nobody asked them to write in mine.
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
