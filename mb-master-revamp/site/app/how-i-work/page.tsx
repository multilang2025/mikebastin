import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { enLanguages } from "@/lib/fr-pages";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// Legacy /pricing/ (content-map.json group g048) is reframed here rather than
// rebuilt as a pricing page. Owner decision: no public rates for a
// consultancy-portfolio site, published rates invite the wrong kind of
// enquiry before we know a market, its budget and its language mix. What the
// harvested pricing.md actually offered underneath the euro figures, tiers
// and "Buy Now" buttons, was a rough shape for how an engagement runs
// (discovery, a plan, monthly delivery, reporting, flexible contracts). That
// shape survives here as the real content; the figures do not.
export const metadata: Metadata = {
  ...pageMeta({
    title: "How we work, Mike Bastin",
    description: "How a multilingual SEO, localization or AI consulting engagement runs: the free consultation, the written scope, monthly delivery and reporting per market.",
    path: "/how-i-work/",
    languages: enLanguages("/how-i-work/"),
  }),
};

const STAGES = [
  {
    name: "Free consultation",
    detail:
   "Thirty minutes on which markets and languages matter, what is already ranking, what has already been tried, and what a good outcome looks like, measured in enquiries.",
  },
  {
    name: "A written scope for your markets",
    detail:
   "A short brief naming the pages, keywords and deliverables for the first quarter, and who does what.",
  },
  {
    name: "Research before writing",
    detail:
      "Keyword and competitor research per market before a single page gets built or a post gets written. Each market gets terms researched in its own language, because the weight a term carries in English changes once it is translated.",
  },
  {
    name: "Delivery on a fixed cadence",
    detail:
      "Work ships on a monthly rhythm, market by market, so a French page ships on its own schedule, whatever stage the German one is at. Native writers per language, reviewed against the brief before anything goes live.",
  },
  {
    name: "Reporting that separates markets",
    detail:
   "Monthly numbers per locale, so you can see which market is converting and which one is getting traffic so far.",
  },
  {
    name: "A straight answer on every market",
    detail:
   "When a market needs a new approach after a fair run, we say so and change the plan.",
  },
];

const QUESTIONS = [
  {
    q: "How long before we see movement?",
    a: "Most clients see the first measurable change, a keyword entering the top twenty, a form fill from a new market, inside the first three months. A full ranking shift across several languages usually takes two to three quarters, because native content and hreflang plumbing both need time to be crawled and trusted.",
  },
  {
    q: "Do we need a contract?",
  a: "Engagements run month to month, and either side can end one with notice.",
  },
  {
    q: "What if we only need one market fixed?",
  a: "A single-language SEO fix, a localization review, an AI consulting session on where machine translation quality needs lifting, each run as a scoped piece of work with a start and an end.",
  },
  {
    q: "Who does the work?",
    a: "We scope and run the strategy directly. Native-language writing and translation go through named specialists, most through the BeTranslated network run for twenty years.",
  },
  {
    q: "How is it billed?",
    a: "Management is a fee of its own. Where an engagement includes paid search, your whole media budget buys ads: it goes straight to Google, Microsoft or Meta, and management stays that separate fee. So the budget we recommend is the one that brings in enquiries. The arrangement covers media spend; writing and translation, including localization through the BeTranslated network, are quoted as a price for the work.",
  },
  {
    q: "How do we start?",
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
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">The process, stage by stage</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              How a multilingual SEO engagement runs
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              What happens from the first call to the monthly report, how it is billed, and where your media budget goes.
            </h2>
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
                  Valencia, over two decades in multilingual search
                </span>
              </span>
            </div>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="roundtable" />
        </HeroArtSlot>
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
          <ol className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
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
            <p className="eyebrow mb-3">Why each scope is priced on its own</p>
            <h2 className="mb-6 max-w-[22ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
              A two-language site and a five-language one are different jobs
            </h2>
            <p className="max-w-[56ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              The scope call sets it: we quote against the markets, the current state of the
              site, and what needs to be built first.
            </p>
          </Reveal>
          <Reveal i={2}>
            <ul className="flex flex-col gap-4">
              {[
                "Which languages the site needs to compete in, and which are optional",
                "How much of the current content can be kept, and how much needs writing fresh",
                "Where the work lies: search visibility, on-site localization, translation accuracy, or AI content quality",
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
              We reply to every brief within a working day.
            </p>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Book a free consultation
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
