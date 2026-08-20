import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "Multilingual lead generation, Mike Bastin",
  description:
    "Multilingual SEO, localisation and AI consulting are the mechanisms. Enquiries are the product.",
};

const ABSORBS = [
  {
    name: "Multilingual SEM",
    note: "Paid demand capture across languages, reclaimed from an earlier draft that filed it under content",
  },
  {
    name: "Conversion tracking",
    note: "Reclaimed from technical SEO, since measuring enquiries per locale is the proof, not a footnote",
  },
];

export default function LeadGenerationPage() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">The outcome, not the mechanism</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[17ch] text-[clamp(2.4rem,6vw,4.2rem)] font-semibold leading-[1.08]">
              Why is your French, German or Spanish site not producing enquiries?
            </h1>
          </Reveal>
          <Reveal i={2}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Multilingual SEO, localisation and AI consulting are the
              mechanisms. Enquiries are the product. Ninety days of Search
              Console for one client domain read forty thousand impressions
              and six clicks, the exact shape of a visibility problem that
              was never actually a visibility problem.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT GETS MEASURED ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What gets measured</p>
            <h2 className="mb-6 max-w-[18ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clicks and leads, not impressions
            </h2>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A ranking screenshot proves an input worked. A client report
              with real enquiry numbers proves the outcome did, and very
              few competing consultants can show that at all.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW IT IS DELIVERED ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">How it is delivered</p>
            <h2 className="mb-6 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Three mechanisms, one measure
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Multilingual search finds the right visitor in their own
              language. Paid demand capture across languages reaches the
              buyer who has not found you organically yet. Conversion
              tracking per locale is the evidence layer underneath both,
              not a technical footnote bolted on afterwards.
            </p>
          </Reveal>

          <Reveal i={1}>
            <div
              className="grid gap-px sm:grid-cols-2"
              style={{ background: "var(--rule)" }}
            >
              {ABSORBS.map((a) => (
                <div key={a.name} className="band px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-2 text-[1.15rem] font-semibold">{a.name}</p>
                  <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {a.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ EVIDENCE ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The evidence</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Ten reviews. Four languages. Nobody asked them to write in mine.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Report extracts join this section once a representative
              report is ready to publish. Reviews stand on their own in
              the meantime.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <footer className="band band-a py-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Clean face, no crowd</p>
            <h2 className="mb-8 max-w-[15ch] text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.08]">
              Tell me which language is losing you money.
            </h2>
            <div className="flex flex-col gap-2 text-[1.05rem]">
              <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                hello@mikebastin.com
              </a>
              <a href="tel:+34671175774" className="ulink w-fit">
                +34 671 17 57 74
              </a>
            </div>
          </Reveal>
        </div>
      </footer>
    </main>
  );
}
