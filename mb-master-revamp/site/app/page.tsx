import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FounderPortrait from "@/components/FounderPortrait";
import Counter from "@/components/Counter";
import HomeEvidence from "@/components/HomeEvidence";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import MarketFlowGraphic from "@/components/MarketFlowGraphic";
import BastinIdeasGraphic from "@/components/BastinIdeasGraphic";
import { HOME_GRAPHICS } from "@/lib/home-graphics";
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

const HOW_IT_WORKS = [
  {
    title: "Audit where you are",
    body: "We review your site, search visibility and existing language versions to find the technical and content work with the clearest path to more enquiries.",
  },
  {
    title: "Plan each market",
    body: "You get a written scope for the markets you want to grow, with priorities, deliverables and responsibilities agreed before work begins.",
  },
  {
    title: "Report monthly by language",
    body: "Work moves forward market by market, with a monthly report showing traffic and enquiries for each language so you can see what is paying back.",
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
      <section className="band band-b grain relative overflow-hidden pb-[clamp(48px,6vw,88px)] pt-[clamp(52px,7vw,104px)]">
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
                Book a free consultation
              </Link>
              <Link href="/results/" className="ulink text-[.98rem]">
                See client results
              </Link>
            </div>
          </Reveal>

          <Reveal i={5}>
            <Link
              href="#testimonials"
              aria-label="Read client testimonials"
              className="mt-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-[.88rem]"
              style={{ color: "var(--dim)" }}
            >
              <span className="flex gap-1" aria-hidden="true" style={{ color: "var(--berry)" }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.22 6.55L12 17.5l-5.89 3.07 1.22-6.55L2.5 9.42l6.6-.86z" />
                  </svg>
                ))}
              </span>
              <span className="ulink">Google Business Profile reviews</span>
            </Link>
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
      <HomeEvidence band="a" />

      {/* ============ WHAT WE DO AND HOW IT WORKS ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What we do</p>
            <h2 className="mb-5 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              From market audit to monthly reporting.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              We audit your current reach, agree a plan for each market, then
              report progress by language every month. Depending on your goals,
              choose the services that fit your growth plans.
            </p>
          </Reveal>

          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map((row, i) => (
              <Reveal key={row.cluster} i={i}>
                <article
                  className="h-full rounded-md border p-5 sm:p-6"
                  style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
                >
                <Link
                  href={row.href}
                  className="mb-3 inline-flex rounded-full px-3 py-1 text-[.78rem] font-semibold uppercase tracking-[.07em] transition-colors hover:bg-[var(--berry)] hover:text-[var(--bg)]"
                  style={{ color: "var(--berry)", background: "var(--berry-soft)" }}
                >
                  {row.cluster}
                </Link>
                <p className="text-[.92rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                  {row.desc}
                </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow mb-3">How it works</p>
          </Reveal>

          <ol className="grid gap-px md:grid-cols-3" style={{ background: "var(--rule)" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} i={i}>
                <li className="band h-full px-7 py-7" style={{ background: "var(--bg)" }}>
                  <p className="display mb-5 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mb-3 text-[1.15rem] font-semibold leading-[1.25]">
                    {step.title}
                  </h3>
                  <p className="text-[.92rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal i={3}>
            <p className="mt-8 text-[.95rem]" style={{ color: "var(--dim)" }}>
              <Link href="/how-i-work/" className="ulink" style={{ color: "var(--berry)" }}>
                See how the engagement is scoped and billed
              </Link>
              {" "}and what happens from the first call to monthly reporting.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY IT WORKS ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Why it works</p>
            <h2 className="mb-12 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              The same person reads every language your buyers use.
            </h2>
          </Reveal>

          <div className={`grid items-center gap-12${HOME_GRAPHICS.marketFlow ? " lg:grid-cols-[1fr_1fr]" : ""}`}>
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
            {HOME_GRAPHICS.marketFlow && (
              <Reveal i={1}>
                <MarketFlowGraphic />
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="band band-b py-[clamp(64px,9vw,128px)]">
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

      {/* ============ BASTIN, THE ACRONYM ============ */}
      <section className="band band-a py-[clamp(48px,6vw,80px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-2">What the name stands for</p>
            <h2 className="mb-8 max-w-[24ch] text-[clamp(1.45rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
              BASTIN, in six ideas.
            </h2>
          </Reveal>

          <div className="relative">
            {HOME_GRAPHICS.bastinTrail && <BastinIdeasGraphic />}
            <div className={`flex flex-col${HOME_GRAPHICS.bastinTrail ? " pr-14 sm:pl-14 sm:pr-20" : ""}`} style={{ borderTop: "1px solid var(--rule)" }}>
              {BASTIN.map((row, i) => {
                // The initial is the word's own first letter, set in cherry
                // (owner, 5 Oct 2026: "merge the initials with the rest of
                // the expression but leave the first letter in cherry").
                // It keeps data-bastin-letter, which is what the trail
                // graphic measures to place its arrow. One fluid size for
                // every word, picked so Internationalization fits a phone.
                const body = (
                  <span className="flex min-w-0 flex-col gap-2">
                    <span
                      className={`display text-[clamp(1.15rem,5.8vw,2.1rem)] font-semibold leading-none${
                        row.href ? " transition-colors duration-300 group-hover:text-[var(--berry)]" : ""
                      }`}
                    >
                      <span data-bastin-letter style={{ color: "var(--berry)" }}>
                        {row.word.charAt(0)}
                      </span>
                      {row.word.slice(1)}
                    </span>
                    <span data-bastin-copy className="max-w-[56ch] text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                      {row.desc}
                    </span>
                  </span>
                );
                const rowClass = "block py-6";
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
        </div>
      </section>

      {/* ============ CREDIBILITY ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          {/* Two by two, then four across: auto-fit made a row of three
              and a lone fourth with grey empty cells at tablet width. */}
          <div className="grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: "var(--rule)" }}>
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
      <SiteFooter address band="a" />

    </main>
  );
}
