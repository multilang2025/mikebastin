import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FounderPortrait from "@/components/FounderPortrait";
import Counter from "@/components/Counter";
import HomeEvidence from "@/components/HomeEvidence";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/schema";
import { enLanguages } from "@/lib/fr-pages";

// The homepage previously inherited the root layout's metadata, which is the
// whole-site fallback rather than anything aimed at a query. It now carries
// its own, led by the primary term lib/keywords.ts assigns to "/":
// "international SEO agency" (7,500 global, KD 3), the agency variant of the
// head term, which sits at KD 34.
const TITLE = "International SEO agency and localization, Mike Bastin";
const DESCRIPTION =
  "International SEO agency for companies selling abroad: native multilingual SEO and localization, with enquiries counted per market. Free consultation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/`, languages: enLanguages("/") },
  // og:image comes from the colocated app/opengraph-image.tsx, not an
  // `images` array here, so the card can never drift from the file that
  // renders it. `robots` is deliberately absent: the preview-only noindex
  // in app/layout.tsx is inherited and must stay inherited.
  openGraph: {
    type: "website",
    siteName: "Mike Bastin",
    locale: "en_GB",
    alternateLocale: ["fr_FR", "es_ES"],
    url: `${SITE_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: "@mikebastin",
    creator: "@mikebastin",
    title: TITLE,
    description: DESCRIPTION,
  },
};


const STATS = [
  { n: 20, s: "+", k: "Years in search" },
  { n: 5, s: "+3", k: "Languages spoken" },
  { n: 8, s: "", k: "Projects in the line-up" },
  { n: 12, s: "", k: "Domains run" },
];

const BASTIN = [
  {
    letter: "B",
    word: "Business",
    desc: "Every search project starts from your business case, so it gets the budget it needs.",
    href: "/services/lead-generation/",
  },
  {
    letter: "A",
    word: "Automation",
    desc: "AI drafts, tests and reports, so the work keeps moving.",
    href: "/services/ai-consulting/",
  },
  {
    letter: "S",
    word: "SEO",
    desc: "Multilingual search, built to rank in the language a buyer actually searches in.",
    href: "/services/multilingual-seo/",
  },
  {
    letter: "T",
    word: "Translation",
    desc: "Copy adapted for the market reading it.",
    href: "/services/translation-services/",
  },
  {
    letter: "I",
    word: "Internationalization",
    desc: "The groundwork done before launch, so a product can take a second language on the build it already has.",
    href: "/services/app-and-software-localisation/",
  },
  {
    letter: "N",
    word: "Networking",
    desc: "Over two decades of referrals, in four languages, still the channel that works.",
    href: null,
  },
];

const WHAT_WE_DO = [
  {
    cluster: "Lead generation",
    desc: "More enquiries from your non-English markets, each one traced back to its language.",
    href: "/services/lead-generation/",
  },
  {
    cluster: "Search",
    desc: "Native writing for each language, researched against what buyers in that market search for.",
    href: "/services/multilingual-seo/",
  },
  {
    cluster: "Localization",
    desc: "Your site ready for each market: the language, the prices and the trust signals buyers there expect.",
    href: "/services/website-localisation/",
  },
  {
    cluster: "AI",
    desc: "Pages that ChatGPT, Perplexity and Google's AI Overviews can cite, as well as pages Google ranks.",
    href: "/services/generative-engine-optimization/",
  },
  {
    cluster: "Technical",
    desc: "Each language version reaches its own buyers, with the hreflang, crawl and index work done right.",
    href: "/services/technical-seo/",
  },
];

const WHY_IT_WORKS = [
  {
    title: "One strategist across your languages",
    body: "The person planning your French SEO also reads your Spanish and Dutch pages, so every market runs on one plan and the results compare like for like.",
  },
  {
    title: "Copy written by natives of the market",
    body: "Commercial pages in each language are written by a native speaker, with the prices, trust signals and search habits of that market built in.",
  },
  {
    title: "Enquiries counted per language",
    body: "You see which market pays back, so the budget follows the evidence.",
  },
];

export default function Home() {
  return (
    <main>
      {/* ============ HERO ============ */}
      {/* Declaudify brief (owner, 3 Oct 2026): the agency offer, the person
          who leads it, one primary call to action. The h1 still carries the
          primary term from lib/keywords.ts, "international SEO agency", and
          the longer h2 under it says what the agency does. No shimmer, no
          glow, no radar: the portrait is the hero art. */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,6vw,88px)] pt-[clamp(52px,7vw,104px)]">
        <div className="shell relative grid items-center gap-x-14 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Multilingual SEO and localization agency</p>
          </Reveal>

          <Reveal i={1}>
            <h1 className="mb-5 max-w-[22ch] text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.08]">
              International SEO agency, led by Mike Bastin
            </h1>
          </Reveal>

          <Reveal i={2}>
            <h2 className="mb-5 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.6rem)] font-medium leading-[1.3]">
              We help companies attract customers across languages through international SEO, native content and website localization.
            </h2>
          </Reveal>

          <Reveal i={3}>
            <p
              className="mb-8 max-w-[56ch] text-[clamp(1.02rem,1.4vw,1.14rem)] leading-[1.6]"
              style={{ color: "color-mix(in srgb, var(--dim) 65%, var(--ink))" }}
            >
              Mike leads the strategy, with native specialists handling the
              language and market details. Our reporting separates
              performance by country and language.
            </p>
          </Reveal>

          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Discuss your project
              </Link>
              <Link href="/results/" className="ulink text-[.98rem]">
                See client results
              </Link>
            </div>
          </Reveal>
        </div>

        <FounderPortrait
          alt="Mike Bastin, leader of our multilingual SEO and localization agency."
          caption="Mike Bastin, agency lead · Valencia."
        />
        </div>
      </section>

      {/* ============ CLIENT EVIDENCE ============ */}
      {/* Straight after the hero (brief, P1): dated Search Console figures,
          then three cases chosen for the multilingual positioning, and a
          link to the rest rather than all eight spreads. */}
      <HomeEvidence />

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What we do</p>
            <h2 className="mb-5 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Enquiries from every market where you already sell.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              You already sell abroad, so the product is proven. Ongoing
              multilingual SEO is the core of a global SEO programme, with
              localization, paid search and AI consulting around it. Every
              enquiry is counted by market, so you see which language earns
              its keep.
            </p>
          </Reveal>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
            {WHAT_WE_DO.map((row, i) => (
              <Reveal key={row.cluster} i={i}>
                <Link
                  href={row.href}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-6"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <span className="display text-[1.15rem] font-semibold transition-colors duration-300 group-hover:text-[var(--berry)]">
                    {row.cluster}
                  </span>
                  <span className="max-w-[48ch] text-[.92rem]" style={{ color: "var(--dim)" }}>
                    {row.desc}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY IT WORKS ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Why it works</p>
            <h2 className="mb-12 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              The same person reads every language your buyers use.
            </h2>
          </Reveal>

          <div className="grid max-w-[56ch] gap-8">
            {WHY_IT_WORKS.map((w, i) => (
              <Reveal key={w.title} i={i}>
                <p className="display mb-2 text-[1.08rem] font-semibold leading-[1.25]">
                  {w.title}
                </p>
                <p className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                  {w.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BASTIN, THE ACRONYM ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What the name stands for</p>
            <h2 className="mb-4 max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              BASTIN was there the whole time.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Six letters, six things we do for you.
            </p>
          </Reveal>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
            {BASTIN.map((row, i) => {
              const body = (
                <>
                  <span
                    className="display shrink-0 text-[clamp(2.4rem,5vw,3.4rem)] font-semibold leading-none"
                    style={{ color: "var(--berry)" }}
                  >
                    {row.letter}
                  </span>
                  <span className="flex flex-col gap-1 pt-1">
                    <span
                      className={`display text-[1.3rem] font-semibold leading-none${
                        row.href ? " transition-colors duration-300 group-hover:text-[var(--berry)]" : ""
                      }`}
                    >
                      {row.word}
                    </span>
                    <span className="text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                      {row.desc}
                    </span>
                  </span>
                </>
              );
              const rowClass =
                "flex items-start gap-5 py-6 sm:gap-7";
              const rowStyle = { borderBottom: "1px solid var(--rule)" };
              return (
                <Reveal key={row.letter} i={i}>
                  {row.href ? (
                    <Link href={row.href} className={`${rowClass} group`} style={rowStyle}>
                      {body}
                    </Link>
                  ) : (
                    <div className={rowClass} style={rowStyle}>
                      {body}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Clients review us in their own language.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Reviews arrived in Dutch, Spanish, French and English,
              unprompted. Here are the English ones.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CREDIBILITY ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <div
            className="grid gap-px"
            style={{
              background: "var(--rule)",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {STATS.map((s, i) => (
              <div key={s.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                <Reveal i={i}>
                  <div
                    className="display text-[clamp(2.1rem,4.4vw,3.1rem)] font-semibold leading-none"
                    style={{ color: "var(--berry)" }}
                  >
                    <Counter to={s.n} suffix={s.s} />
                  </div>
                  <div
                    className="mt-3 text-[.72rem] uppercase tracking-[.12em]"
                    style={{ color: "var(--dim)" }}
                  >
                    {s.k}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter address band="b" />

    </main>
  );
}
