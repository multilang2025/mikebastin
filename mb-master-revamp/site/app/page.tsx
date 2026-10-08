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
  "International SEO agency helping companies win customers abroad with global SEO, native content and localization. Discuss your project with Mike.";

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
  { n: 9, s: "", k: "BeTranslated country sites" },
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
    linkLabel: "Generate more leads",
    desc: "More enquiries from your non-English markets, each one traced back to its language.",
    href: "/services/lead-generation/",
  },
  {
    cluster: "Search",
    linkLabel: "Grow with global SEO",
    desc: "Reach more buyers in every market with native content shaped around what they search for.",
    href: "/services/multilingual-seo/",
  },
  {
    cluster: "Localization",
    linkLabel: "Localize your website",
    desc: "Your site ready for each market: the language, the prices and the trust signals buyers there expect.",
    href: "/services/website-localisation/",
  },
  {
    cluster: "AI",
    linkLabel: "Improve AI visibility",
    desc: "Pages that ChatGPT, Perplexity and Google's AI Overviews can cite, as well as pages Google ranks.",
    href: "/services/generative-engine-optimization/",
  },
  {
    cluster: "Technical",
    linkLabel: "Strengthen technical SEO",
    desc: "Each language version reaches its own buyers, with the hreflang, crawl and index work done right.",
    href: "/services/technical-seo/",
  },
];

const HOW_IT_WORKS = [
  {
    theme: "Market insight",
    icon: "search",
    title: "A clear view of each market",
    body: "We uncover where your site is already reaching buyers and where technical or content improvements can create more enquiries.",
  },
  {
    theme: "Focused strategy",
    icon: "target",
    title: "A focused plan you can approve",
    body: "Get a written scope for the markets you want to grow, with priorities, deliverables and responsibilities agreed before work begins.",
  },
  {
    theme: "Measured progress",
    icon: "chart",
    title: "Progress you can act on",
    body: "See traffic and enquiries by language in a monthly report, so you know which markets are paying back and where to focus next.",
  },
];

const WHY_IT_WORKS = [
  {
    title: "Your international SEO expert, across languages",
    body: "Mike leads one joined-up strategy across your French, Spanish and Dutch pages, so each market builds on the same plan and you can compare results clearly.",
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
        <div className="shell home-hero-shell">
        <div className="home-hero-copy">
          <Reveal>
            <p className="eyebrow mb-5">Multilingual SEO and localization agency</p>
          </Reveal>

          <Reveal i={1}>
            <h1 className="mb-5 max-w-[22ch] text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.08]">
              International SEO agency, led by Mike Bastin
            </h1>
          </Reveal>

          <FounderPortrait
            alt="Mike Bastin, leader of our multilingual SEO and localization agency."
            caption="Mike Bastin, agency lead · Valencia."
            className="home-hero-portrait"
            mobileOptimized
          />

          <Reveal i={2}>
            <h2 className="mb-5 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.6rem)] font-medium leading-[1.3]">
              Win customers in new markets with international SEO services, native content and website localization.
            </h2>
          </Reveal>

          <Reveal i={3}>
            <p
              className="mb-8 max-w-[56ch] text-[clamp(1.02rem,1.4vw,1.14rem)] leading-[1.6]"
              style={{ color: "color-mix(in srgb, var(--dim) 65%, var(--ink))" }}
            >
              Work directly with Mike, your international SEO consultant. He
              leads the strategy while native specialists adapt each market.
              Reporting shows which languages bring enquiries.
            </p>
          </Reveal>

          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Discuss your project
              </Link>
              <Link href="/results/" className="ulink text-[.98rem]">
                Explore client results
              </Link>
            </div>
          </Reveal>

        </div>
        </div>
      </section>

      {/* ============ CLIENT EVIDENCE ============ */}
      {/* Straight after the hero (brief, P1): dated Search Console figures,
          then three cases chosen for the multilingual positioning, and a
          link to the rest rather than all eight spreads. */}
      <HomeEvidence band="b" />

      {/* ============ WHAT WE DO AND HOW IT WORKS ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What we do</p>
            <h2 className="mb-5 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              A clear plan for each market, with progress you can measure.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              We turn your market opportunities into focused work and measurable
              growth. Explore the services that best fit your goals.
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
                  {row.linkLabel}
                </Link>
                <p className="text-[.92rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                  {row.desc}
                </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="eyebrow mb-3">A partnership built around your growth</p>
          </Reveal>

          <ol className="grid gap-4 lg:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} i={i}>
                <li
                  className="relative h-full overflow-hidden rounded-lg border p-6 sm:p-7"
                  style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
                >
                  <div
                    className="mb-8 grid h-14 w-14 place-items-center rounded-full"
                    style={{ color: "var(--berry)", background: "var(--berry-soft)" }}
                  >
                    <svg
                      viewBox="0 0 32 32"
                      className="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {step.icon === "search" && (
                        <>
                          <circle cx="14" cy="14" r="8" />
                          <path d="m20 20 6 6M10 14h8M14 10v8" />
                        </>
                      )}
                      {step.icon === "target" && (
                        <>
                          <circle cx="16" cy="16" r="11" />
                          <circle cx="16" cy="16" r="6" />
                          <circle cx="16" cy="16" r="1.5" />
                          <path d="m21 11 6-6M22 5h5v5" />
                        </>
                      )}
                      {step.icon === "chart" && (
                        <>
                          <path d="M5 26V7M5 26h23" />
                          <path d="m9 20 6-6 4 3 8-9" />
                          <path d="M22 8h5v5" />
                        </>
                      )}
                    </svg>
                  </div>
                  <p className="eyebrow mb-2 text-[.72rem]">{step.theme}</p>
                  <h3 className="display mb-3 text-[1.25rem] font-semibold leading-[1.25]">
                    {step.title}
                  </h3>
                  <p className="text-[.92rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal i={3}>
            <p className="mt-8 text-[.95rem]" style={{ color: "var(--dim)" }}>
              <Link href="/how-i-work/" className="ulink" style={{ color: "var(--berry)" }}>
                Explore how we scope and bill each engagement
              </Link>
              {" "}and what happens from the first call to monthly reporting.
            </p>
          </Reveal>
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
      <section id="testimonials" className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Clients review us in their own language.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Reviews in Dutch, Spanish, French and English. Here are the English ones.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials mobileInitialCount={2} />
          </Reveal>
        </div>
      </section>

      {/* ============ BASTIN, THE ACRONYM ============ */}
      <section className="band band-b py-[clamp(48px,6vw,80px)]">
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
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
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
