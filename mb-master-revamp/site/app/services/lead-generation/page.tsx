import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Expandables from "@/components/Expandables";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getService } from "@/lib/services";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";

// The Service entry for this slug lives in lib/services.ts, and this route
// reads its h1, subhead, lede and meta fields from there rather than
// hardcoding them. Until 23 Sep 2026 it did hardcode the h1, and the site
// carried two different h1s for one page: the one here and the one the
// services index read.
const service = getService("lead-generation")!;
const url = `${SITE_URL}/services/lead-generation/`;

export const metadata: Metadata = {
  title: service.metaTitle,
  description: service.metaDescription,
  alternates: { canonical: url },
  // og:image/twitter:image come from the colocated opengraph-image.tsx
  // (Next.js file-convention metadata), not an `images` array here.
  openGraph: {
    type: "website",
    siteName: "Mike Bastin",
    locale: "en_GB",
    url,
    title: service.metaTitle,
    description: service.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: service.metaTitle,
    description: service.metaDescription,
  },
};

/**
 * The three parts of the work, each linking to the page that covers it in
 * depth. These replaced two cards whose notes described the site's own
 * reorganisation ("reclaimed from an earlier draft that filed it under
 * content"), which told a buyer about our filing rather than their market.
 */
const PARTS = [
  {
    title: "Found in their language",
    body: "Search built per market from what buyers there actually type, so the right visitor arrives on a page written for them rather than translated at them.",
    href: "/services/multilingual-seo/",
    link: "International SEO",
  },
  {
    title: "Reached before they find you",
    body: "Paid search in each language for the buyer who has not found you organically yet, with the budget kept separate per market so one never quietly funds another.",
    href: "/services/multilingual-sem/",
    link: "International PPC",
  },
  {
    title: "Counted where it happened",
    body: "Every enquiry traced to the market and the language that earned it, then followed into your CRM so a market is judged on the conversations it starts.",
    href: "/services/conversion-tracking/",
    link: "Conversion tracking",
  },
];

/**
 * Objections a buyer raises before booking, answered only with what the
 * rest of the site already commits to. Nothing here is new: the sequencing
 * is the multilingual SEO page's, the writing arrangement is the language
 * pages', and "no lock-in" is on every service page's closing section.
 */
const QUESTIONS = [
  {
    q: "Do we have to launch every language at once?",
    a: [
      "No, and it usually costs less not to. We start with the market where the evidence is strongest, get it producing enquiries, and add the next one once it does.",
      "Spreading the first budget across every language you sell in is how a company ends up with several markets that each look almost busy and none that clearly pays.",
    ],
  },
  {
    q: "What counts as a lead?",
    a: [
      "The definition your own sales team recognises, agreed before anything is measured. Usually that is an enquiry that became a conversation.",
      "Spam, job applications and test submissions are counted separately from real enquiries, so a market is judged on what actually reached your team rather than on how many forms were filled in.",
    ],
  },
  {
    q: "Who writes in the languages you do not write yourselves?",
    a: [
      "We write French, English, Spanish and Dutch directly. German, Italian, Portuguese and other languages go to native copywriters from the BeTranslated network, briefed and reviewed by us.",
      "Either way the page is written for the market reading it, from that market's own research, rather than translated from an English page built for somebody else.",
    ],
  },
  {
    q: "Is there a minimum contract?",
    a: [
      "No lock-in. The first call produces a written scope naming the pages and the deliverables, and you decide from there.",
    ],
  },
];

export default function LeadGenerationPage() {
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

      {/* ============ HERO: their situation ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">{service.angle}</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[22ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              {service.h1}
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              {service.subhead}
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {service.lede}
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book a discovery call
              </Link>
              <Link href="#how-it-is-billed" className="ulink text-[.98rem]">
                See how it is billed
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ THE COST OF LEAVING IT ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What a blended report costs you</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              One enquiry total hides the market paying for the others
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A single number for the whole site is the most comfortable
              report to read and the least useful one to act on. Inside an
              average, the market carrying your results and the market
              spending its budget on visits that never convert look exactly
              the same.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              So the money keeps going where the traffic looks healthiest,
              and the language quietly doing the selling gets less of it
              every quarter. Nobody decided that. The report decided it,
              by never showing the difference. Every month it runs that way,
              the market that should be growing is the one being starved.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What we do in each market</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              How a B2B lead generation agency should work across languages
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Three pieces, run together and judged on one thing: whether each
              market sends your sales team enquiries worth having. Any one of
              them alone produces a report. The three together produce a
              pipeline you can read market by market.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="grid gap-px lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {PARTS.map((p) => (
                <div key={p.title} className="band flex flex-col px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-3 text-[1.2rem] font-semibold">{p.title}</p>
                  <p className="mb-6 text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {p.body}
                  </p>
                  <Link href={p.href} className="ulink mt-auto text-[.9rem]">
                    {p.link}
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ THE DECISION WORTH STATING ============ */}
      <section id="how-it-is-billed" className="band band-b scroll-mt-20 py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">How it is billed</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              No markup on your ad spend, so a bigger budget earns us nothing
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Where an engagement includes paid search, your media budget
              goes straight to Google, Microsoft or Meta, never through us.
              Management is charged as its own fee. So there is no reason for
              our recommendation to be a larger budget, and every reason for
              it to be the one that brings enquiries in.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              To be exact about where the line sits: it covers media spend.
              Writing and translation are quoted as a price for the work. An
              agency that stays vague about which costs pass through and which
              are priced usually has a reason to, and we would rather you knew
              before the first call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The evidence</p>
            <h2 className="mb-5 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clients in four languages, in their own words
            </h2>
            <p className="mb-10 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Reviews written in English, Dutch, French and Spanish, each in
              the language the client chose. The case studies of{" "}
              <Link href="/projects/delaguia-y-luzon/" className="ulink">
                a law firm working in four languages
              </Link>
              ,{" "}
              <Link href="/projects/tx-international-freight/" className="ulink">
                a Houston freight forwarder
              </Link>{" "}
              and{" "}
              <Link href="/projects/bemelman-spuiterij/" className="ulink">
                a Dutch trade specialist
              </Link>{" "}
              show the search side in full.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ MECHANISM, FOR THE READER STILL GOING ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">How the enquiries get counted</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              A form submission is not a lead until your team says it is
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Tracking runs through GA4 and Google Tag Manager, set up per
              locale with the same event definitions in every language, so a
              French enquiry and a German one are counted the same way and can
              be compared. Consent mode is configured market by market,
              because decline rates differ by country and an uncorrected
              comparison ranks your languages by cookie acceptance rather than
              by sales.
            </p>
            <p className="mb-12 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              The CRM closes the loop. Offline conversion tracking sends the
              outcome of each enquiry back to GA4 and Google Ads, so a market
              sending fewer but better enquiries shows up as winning, and paid
              search bids on what a market is worth rather than on how many
              forms it filled in.
            </p>
          </Reveal>
          <Reveal i={1}>
            <h3 className="display mb-6 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold">
              Questions we get asked before the first call
            </h3>
          </Reveal>
          <Reveal i={2}>
            <Expandables items={QUESTIONS} />
          </Reveal>
        </div>
      </section>

      {/* ============ ONE NEXT STEP ============ */}
      <section className="band band-a py-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The next step</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Find out what your other markets could be sending you
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

      <SiteFooter />
    </main>
  );
}
