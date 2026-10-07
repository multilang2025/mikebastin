import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Expandables from "@/components/Expandables";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { getService } from "@/lib/services";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";
import ServiceHeroArt from "@/components/ServiceHeroArt";
import { leadGenLanguages } from "@/lib/lead-gen-hubs";
import { pageMeta } from "@/lib/meta";
import HeroArtSlot from "@/components/HeroArtSlot";
import { hasDlArt } from "@/lib/dl-art";
import { LEADS_HIGH, LEADS_LOW } from "@/lib/results-totals";
import { LEADS_PERIOD, PROJECTS } from "@/lib/projects";

const PROJECTS_WITH_LEADS = PROJECTS.filter((p) => p.leads).length;
const VM_GROWTH = PROJECTS.find((p) => p.slug === "valenciamove")!.evidence![0];

// The Service entry for this slug lives in lib/services.ts, and this route
// reads its h1, subhead, lede and meta fields from there rather than
// hardcoding them. Until 23 Sep 2026 it did hardcode the h1, and the site
// carried two different h1s for one page: the one here and the one the
// services index read.
const service = getService("lead-generation")!;
const url = `${SITE_URL}/services/lead-generation/`;
const SITE_COUNT = ["zero", "one", "two", "three", "four", "five", "six", "seven"][PROJECTS_WITH_LEADS] ?? String(PROJECTS_WITH_LEADS);

export const metadata: Metadata = pageMeta({
  title: service.metaTitle ?? service.name,
  description: service.metaDescription ?? service.subhead,
  path: "/services/lead-generation/",
  languages: leadGenLanguages(),
  cardAlt: `${service.cardTitle ?? service.name}. ${service.metaDescription ?? service.subhead}`,
});

/**
 * What a client gets, written as deliverables (owner, 6 Oct 2026: the page
 * "reads like a boring tutorial"). Every claim here is one the rest of the
 * site already makes: the writing arrangement is the language pages', the
 * report is conversion tracking's, the first-market rule is multilingual SEO's.
 */
const DELIVERABLES = [
  {
    title: "A first market chosen on evidence",
    body: "We start where demand for what you sell is strongest and your site is closest to winning it, and add the next market once the first one sends enquiries.",
    href: "/services/multilingual-seo/",
    link: "International SEO",
  },
  {
    title: "Pages that sell in each language",
    body: "French, English, Spanish and Dutch written by us. German, Italian, Portuguese and the rest by native copywriters from the BeTranslated network, briefed and reviewed by us.",
    href: "/services/multilingual-content/",
    link: "Multilingual content",
  },
  {
    title: "Found on Google and in AI answers",
    body: "Search built per market from what buyers there type and ask, so your pages show up in Google and in the answers ChatGPT and its peers give.",
    href: "/services/generative-engine-optimization/",
    link: "Generative engine optimization",
  },
  {
    title: "Paid search while rankings build",
    body: "Campaigns in each language with their own budget, reaching buyers this quarter while the organic work compounds.",
    href: "/services/multilingual-sem/",
    link: "International PPC",
  },
  {
    title: "Every enquiry traced to its market",
    body: "Each enquiry counted once, in the language that earned it, and followed into your CRM so a market is judged on the conversations it starts.",
    href: "/services/conversion-tracking/",
    link: "Conversion tracking",
  },
  {
    title: "A monthly report and a next move",
    body: "Enquiries per market every month, what changed, and where the next euro of budget earns the most.",
    href: "/results/",
    link: "See our results",
  },
];

/** The real steps of an engagement, starting with the free offer. */
const STEPS = [
  {
    title: "A free 30-minute consultation",
    text: "Which markets matter to you, what already ranks, what has been tried, and where the quickest enquiries are likely to come from.",
  },
  {
    title: "A written scope",
    text: "The first market, the pages, the campaigns and the definition of a lead your sales team agrees with, named in writing with a price.",
  },
  {
    title: "The first market goes live",
    text: "Pages written in the language, search and paid campaigns running, and tracking tested before it reports a single enquiry.",
  },
  {
    title: "A report every month",
    text: "Enquiries per market, what changed, and our recommendation for the month ahead.",
  },
  {
    title: "The next market, when the first one pays",
    text: "Each new language opens on the evidence of the last, so the budget follows the markets that return it.",
  },
  {
    title: "Month to month",
    text: "Engagements run month to month, so the work carries on for as long as it pays.",
  },
];

/**
 * Objections a buyer raises before booking, answered only with what the
 * rest of the site already commits to. The mechanism (GA4, Tag Manager,
 * consent mode, offline conversions) lives here, deep in the page, where a
 * reader still going wants it.
 */
const QUESTIONS = [
  {
    q: "Do we have to launch every language at once?",
    a: [
      "One at a time works better, and usually costs less. We start with the market where the evidence is strongest, get it producing enquiries, and add the next one once it does.",
    ],
  },
  {
    q: "What counts as a lead?",
    a: [
      "The definition your own sales team recognises, agreed before anything is measured. Usually that is an enquiry that became a conversation.",
      "Spam, job applications and test submissions are counted separately from real enquiries, so a market is judged on what actually reached your team.",
    ],
  },
  {
    q: "How do you count enquiries per market?",
    a: [
      "Tracking runs through GA4 and Google Tag Manager, set up per locale with the same event definitions in every language, so a French enquiry and a German one are counted the same way and can be compared. Consent mode is configured market by market, because decline rates differ by country.",
      "Your CRM closes the loop. Offline conversion tracking sends the outcome of each enquiry back to GA4 and Google Ads, so a market sending fewer but better enquiries shows up as winning, and paid search bids on what a market is worth.",
    ],
  },
  {
    q: "Which CMS do you work with?",
    a: [
      "WordPress with WPML, Polylang, TranslatePress or Weglot, plus Shopify, Webflow and headless builds. Where a market needs a tool your stack lacks, Globaprom, our custom software brand, builds it.",
    ],
  },
  {
    q: "How long do we commit for?",
    a: [
      "Month to month. The first call produces a written scope naming the pages and the deliverables, and you decide from there.",
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
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
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
                Book a free consultation
              </Link>
              <Link href="#how-it-is-billed" className="ulink text-[.98rem]">
                See how it is billed
              </Link>
            </div>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={hasDlArt("en", "lead-generation")}>
          <ServiceHeroArt slug="lead-generation" />
        </HeroArtSlot>
        </div>
      </section>

      {/* ============ WHAT IT BRINGS IN ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What it brings in</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              {LEADS_LOW} to {LEADS_HIGH} enquiries a month across the sites we run search for
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              A Valencia law firm answering clients in four languages, a
              Houston freight forwarder taking quote requests, a real estate
              agency selling in four languages, a Dutch powder
              coating specialist. Each one gets its enquiries counted per
              market, so you always know which language paid for itself.
            </p>
            <blockquote className="max-w-[62ch] text-[.85rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
              Source: monthly average for {LEADS_PERIOD} across {SITE_COUNT}
              sites, counted from their contact and quote form records. Where
              enquiries also arrive by phone and email, the figure is the site
              owner&apos;s own.{" "}
              <Link href="/results/" className="ulink">
                Full breakdown on the results page
              </Link>
              .
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT YOU GET ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What you get in each market</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              A lead generation agency that writes, ranks and counts in your buyers&apos; language
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              One team for the whole chain, from the page a buyer reads to
              the enquiry your sales team answers, judged on one thing:
              whether each market sends you conversations worth having.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="grid gap-px md:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {DELIVERABLES.map((p) => (
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

      {/* ============ WHO DOES THE WORK ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell grid items-start gap-10 lg:grid-cols-[auto_1fr]">
          <Reveal>
            <img
              src="/images/mike-bastin-portrait-400.webp"
              width={400}
              height={281}
              alt="Mike Bastin, founder, in Valencia"
              loading="lazy"
              decoding="async"
              className="block h-auto w-full max-w-[300px]"
            />
          </Reveal>
          <Reveal i={1}>
            <p className="eyebrow mb-3">Who does the work</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Mike Bastin and his team, working from Valencia in your buyers&apos; languages
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Mike has worked in multilingual search for over two decades and
              founded BeTranslated, the translation agency he has run for
              twenty years, whose ten country sites each compete in their own
              market, from the United States to Italy.
              He works natively in French, fluently in English, Spanish and
              Dutch, and well enough in German, Italian and Portuguese to run
              SEO projects in them.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              We run our own sites the way we run yours.{" "}
              <Link href="/projects/valenciamove/" className="ulink">
                ValenciaMove
              </Link>{" "}
              carries over a thousand pages in five languages. In six months it
              went from almost no search traffic to around 200 clicks a day,
              and it now brings in over fifty enquiries a month. The chart below is its own
              Search Console data, and the case study sets out what we did.
            </p>
            <figure className="mt-8 max-w-[420px]">
              <img
                src={VM_GROWTH.src}
                width={VM_GROWTH.width}
                height={VM_GROWTH.height}
                alt={VM_GROWTH.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-[4px] border"
                style={{ borderColor: "var(--rule)" }}
              />
              <figcaption className="mt-3 text-[.82rem]" style={{ color: "var(--dim)" }}>
                {VM_GROWTH.caption}
              </figcaption>
            </figure>
            <p className="mt-8 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Mike leads the team on every engagement, so you deal with him
              from the first call to the monthly report.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW IT IS BILLED ============ */}
      <section id="how-it-is-billed" className="band band-a scroll-mt-20 py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">How it is billed</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Your whole media budget buys ads, and management is a separate fee
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Where an engagement includes paid search, your media budget goes
              straight to Google, Microsoft or Meta, and our management fee is
              separate. So the budget we recommend is simply the one that
              brings in enquiries.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Writing and translation are quoted as a price for the work, named
              in the scope before anything starts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The evidence</p>
            <h2 className="mb-5 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clients in four languages, in their own words
            </h2>
            <p className="mb-10 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Read how it ran for{" "}
              <Link href="/projects/delaguia-y-luzon/" className="ulink">
                a law firm working in four languages
              </Link>
              ,{" "}
              <Link href="/projects/tx-international-freight/" className="ulink">
                a Houston freight forwarder
              </Link>
              ,{" "}
              <Link href="/projects/c21perdomo/" className="ulink">
                a Dominican real estate agency
              </Link>{" "}
              and{" "}
              <Link href="/projects/bemelman-spuiterij/" className="ulink">
                a Dutch trade specialist
              </Link>
              .
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ HOW AN ENGAGEMENT RUNS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">How an engagement runs</p>
            <h2 className="mb-10 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              From a free consultation to a market that pays its way
            </h2>
          </Reveal>
          <Reveal i={1}>
            <ol className="mb-14 grid gap-px md:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {STEPS.map((step, i) => (
                <li key={step.title} className="band flex flex-col px-7 py-8" style={{ background: "var(--bg)" }}>
                  <span className="display mb-3 text-[1.6rem] font-semibold" style={{ color: "var(--berry)" }}>
                    {i + 1}
                  </span>
                  <p className="display mb-3 text-[1.15rem] font-semibold">{step.title}</p>
                  <p className="text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal i={2}>
            <h3 className="display mb-6 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold">
              Questions we get asked before the first call
            </h3>
          </Reveal>
          <Reveal i={3}>
            <Expandables items={QUESTIONS} />
          </Reveal>
        </div>
      </section>

      {/* ============ ONE NEXT STEP ============ */}
      <section className="band band-b py-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The next step</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Find out what your other markets could be sending you
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Thirty minutes with Mike on which markets matter, what already
              ranks and where the first enquiries are likely to come from. A
              written scope follows, and engagements run month to month.
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

      <SiteFooter />
    </main>
  );
}
