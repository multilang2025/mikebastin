import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// Legacy /pricing/ (content-map.json group g048) is reframed here rather than
// rebuilt as a pricing page. Owner decision: no public rates for a
// consultancy-portfolio site, published rates invite the wrong kind of
// enquiry before we know a market, its budget and its language mix. What the
// harvested pricing.md actually offered underneath the euro figures, tiers
// and "Buy Now" buttons, was a rough shape for how an engagement runs
// (discovery, a plan, monthly delivery, reporting, flexible contracts). That
// shape survives here as the real content; the figures do not.
export const metadata: Metadata = {
  title: "How we work, Mike Bastin",
  description:
    "How a multilingual SEO, localization or AI consulting engagement actually runs: the discovery call, the written scope, delivery cadence and reporting.",
};

const STAGES = [
  {
    name: "Discovery call",
    detail:
      "Thirty minutes on which markets and languages matter, what is already ranking, what has already been tried, and what a good outcome looks like in enquiries rather than traffic. We ask questions before we recommend anything.",
  },
  {
    name: "A written scope, not a quote",
    detail:
      "A short brief naming the pages, keywords and deliverables for the first quarter, and who does what. No plan tier to pick from, because a five-language site and a two-language one are not the same job.",
  },
  {
    name: "Research before writing",
    detail:
      "Keyword and competitor research per market before a single page gets built or a post gets written. A term that ranks in English rarely carries the same weight once it is translated.",
  },
  {
    name: "Delivery on a fixed cadence",
    detail:
      "Work ships on a monthly rhythm, market by market, so a French page is not waiting on a German one to be finished first. Native writers per language, reviewed against the brief before anything goes live.",
  },
  {
    name: "Reporting that separates markets",
    detail:
      "Monthly numbers per locale, not one blended figure that hides which market is converting and which one is only getting traffic. See a real example on the results page.",
  },
  {
    name: "A straight answer if it is not working",
    detail:
      "If a market is not moving after a fair run, we say so and change the plan rather than keep billing the same approach. No long lock-in contracts. Most engagements are open-ended for that reason.",
  },
];

const QUESTIONS = [
  {
    q: "How long before we see movement",
    a: "Most clients see the first measurable change, a keyword entering the top twenty, a form fill from a new market, inside the first three months. A full ranking shift across several languages usually takes two to three quarters, because native content and hreflang plumbing both need time to be crawled and trusted.",
  },
  {
    q: "Do we need a contract",
    a: "No fixed term. Engagements run month to month, and either side can end one with notice. Most clients stay because the reporting keeps showing what is working market by market, not because a contract holds them in.",
  },
  {
    q: "What if we only need one market fixed",
    a: "A single-language SEO fix, a localization review, an AI consulting session on where machine translation is quietly costing you quality, all run as a scoped piece of work with a start and an end, not a subscription. Most enquiries are exactly this.",
  },
  {
    q: "Who actually does the work",
    a: "We scope and run the strategy directly. Native-language writing and translation go through named specialists, most through the BeTranslated network run for twenty years, never an anonymous freelancer pool.",
  },
  {
    q: "How is it billed",
    a: "Management is a fee of its own. Where an engagement includes paid search, the media budget goes straight to Google, Microsoft or Meta rather than through us, so there is no markup on spend and no reason for our recommendation to be a bigger budget. That arrangement is specific to media spend: translation and localization running through the BeTranslated network are quoted as a price for the work itself, not passed through at cost. Worth saying which is which, because an agency that is vague about it usually has a reason.",
  },
  {
    q: "How do we start",
    a: "A short brief on the contact page: which markets, which languages, and what has already been tried. We read every one and reply ourselves, usually within a working day.",
  },
];

export default function HowIWorkPage() {
  const url = `${SITE_URL}/how-i-work/`;
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "How we work", url },
          ]),
        ]}
      />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Process, not a price list</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              How a multilingual SEO engagement runs
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              What a multilingual SEO engagement covers month to month, how it is billed, and which costs are passed through at cost.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p
              className="max-w-[60ch] text-[clamp(1.05rem,1.65vw,1.24rem)]"
              style={{ color: "var(--dim)" }}
            >
              Every market is scoped on its own terms, so there is no tier to
              pick from and no rate card here. What follows is the shape the
              work takes instead, from the first call to the monthly report.
            </p>
          </Reveal>

          <Reveal i={4}>
            <div className="mt-10 flex items-center gap-4">
              <img
                src="/images/mike-bastin.webp"
                alt="Mike Bastin"
                width={72}
                height={72}
                decoding="async"
                className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                style={{ border: "1px solid var(--rule)" }}
              />
              <span className="flex flex-col gap-[2px]">
                <span className="display text-[1.02rem] font-semibold">Mike Bastin</span>
                <span className="text-[.88rem]" style={{ color: "var(--dim)" }}>
                  Valencia, twenty-five years in multilingual search
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ STAGES ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Six stages</p>
            <h2 className="mb-10 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              From the first call to the monthly report
            </h2>
          </Reveal>
          <ol className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {STAGES.map((s, i) => (
              <Reveal key={s.name} i={i}>
                <li className="band flex h-full flex-col gap-3 px-7 py-7" style={{ background: "var(--bg)" }}>
                  <div className="flex items-baseline gap-4">
                    <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[1.05rem] font-semibold leading-[1.3]">{s.name}</span>
                  </div>
                  <p className="text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {s.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ WHAT DECIDES THE SCOPE ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <Reveal>
            <p className="eyebrow mb-3">Why there is no rate card</p>
            <h2 className="mb-6 max-w-[22ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
              A two-language site and a five-language one are not the same job
            </h2>
            <p className="max-w-[56ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A published tier list either overcharges a small site or
              undercharges a large one, and we have run this business long
              enough to know both outcomes annoy a client eventually. The
              scope call fixes that: we quote against the markets, the
              current state of the site, and what needs to be built first,
              not against a fixed menu.
            </p>
          </Reveal>
          <Reveal i={2}>
            <ul className="flex flex-col gap-4">
              {[
                "Which languages the site needs to compete in, and which are optional",
                "How much of the current content is salvageable against how much needs writing from scratch",
                "Whether the gap is search visibility, on-site localization, translation accuracy, or AI content quality",
                "What a realistic monthly cadence looks like given the team on both sides",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[.98rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                  <span aria-hidden="true" className="mt-[.5em] h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: "var(--berry)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Answered before you have to ask</p>
            <h2 className="mb-10 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Questions we get before a first call
            </h2>
          </Reveal>
          <div className="grid gap-px" style={{ background: "var(--rule)" }}>
            {QUESTIONS.map((item, i) => (
              <Reveal key={item.q} i={i}>
                <div className="band px-7 py-7" style={{ background: "var(--bg)" }}>
                  <h3 className="mb-2 text-[1.02rem] font-semibold leading-[1.3]">{item.q}</h3>
                  <p className="max-w-[62ch] text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {item.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="band band-a py-[clamp(56px,8vw,100px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Ready when you are</p>
            <h2 className="mb-6 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.4rem)] font-semibold leading-[1.12]">
              Tell us which market you want to start with
            </h2>
            <p className="mb-8 max-w-[56ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A short brief is all the first call needs. We read every one
              ourselves and reply within a working day.
            </p>
            <Link href="/contact/" className="ulink text-[1.02rem]">
              Start with a brief
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
