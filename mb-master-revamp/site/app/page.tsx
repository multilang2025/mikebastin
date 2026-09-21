import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import Spread from "@/components/Spread";
import { PROJECTS } from "@/lib/projects";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/schema";

// The homepage previously inherited the root layout's metadata, which is the
// whole-site fallback rather than anything aimed at a query. It now carries
// its own. Targets are the entity-level terms, since the head term
// "international SEO" (2,100 UK, 10,000 global, KD 34 per Ahrefs, 19 Aug 2026)
// already belongs to /services/multilingual-seo/ and duplicating it here would
// put two of our own pages in the same result.
const TITLE = "Multilingual SEO and localisation consultancy, Mike Bastin";
const DESCRIPTION =
  "Your English pages sell. Multilingual SEO makes your other languages sell too. Localisation consultancy from Valencia, enquiries counted per market.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
  // og:image comes from the colocated app/opengraph-image.tsx, not an
  // `images` array here, so the card can never drift from the file that
  // renders it. `robots` is deliberately absent: the preview-only noindex
  // in app/layout.tsx is inherited and must stay inherited.
  openGraph: {
    type: "website",
    siteName: "Mike Bastin",
    locale: "en_GB",
    url: `${SITE_URL}/`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};


const STATS = [
  { n: 25, s: "", k: "Years in search" },
  { n: 4, s: "+1", k: "Languages spoken" },
  { n: 8, s: "", k: "Projects in the line-up" },
  { n: 12, s: "", k: "Domains run" },
];

const BASTIN = [
  {
    letter: "B",
    word: "Business",
    desc: "The case for search sits inside a business case first, or it does not get built at all.",
    href: "/services/lead-generation/",
  },
  {
    letter: "A",
    word: "Automation",
    desc: "AI drafts, tests and reports, so nothing waits on a person asleep in the wrong timezone.",
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
    desc: "Copy adapted for the market reading it, not translated for the market that wrote it.",
    href: "/services/translation-services/",
  },
  {
    letter: "I",
    word: "Interpretation",
    desc: "The discipline behind BeTranslated, the agency this site's own projects keep pointing back to.",
    href: "/projects/betranslated/",
  },
  {
    letter: "N",
    word: "Networking",
    desc: "Twenty-five years of referrals, in four languages, still the channel that works.",
    href: null,
  },
];

const WHAT_WE_DO = [
  {
    cluster: "Lead generation",
    desc: "Enquiries are the product. Multilingual SEO, localisation and AI consulting are the mechanisms underneath.",
    href: "/services/lead-generation/",
  },
  {
    cluster: "Search",
    desc: "Native writing per language, researched against what that market actually searches for.",
    href: "/services/multilingual-seo/",
  },
  {
    cluster: "Localisation",
    desc: "Making a site work in a market, not merely readable in a language.",
    href: "/services/website-localisation/",
  },
  {
    cluster: "AI",
    desc: "Structured for ChatGPT, Perplexity and Google's AI Overviews to cite, not just for Google to rank.",
    href: "/services/generative-engine-optimization/",
  },
  {
    cluster: "Technical",
    desc: "The work that stops your language versions competing with each other for the same buyers.",
    href: "/services/technical-seo/",
  },
];

const WHY_IT_WORKS = [
  {
    title: "In-market copy, not translated copy",
    body: "A site that works in a market is a currency, trust signal and search behaviour question, as much as a language one.",
  },
  {
    title: "AI accelerates the work, not the excuses",
    body: "Machine drafting first, human decision after, so speed does not cost accuracy.",
  },
  {
    title: "Every locale gets the same rigour",
    body: "French, Spanish and English are built to the same standard, not one full version and two lighter ones.",
  },
];

export default function Home() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain hero-glow relative overflow-hidden pb-[clamp(60px,9vw,120px)] pt-[clamp(96px,14vw,190px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-10">
              Plenty of sites rank. Far fewer sell.
            </p>
          </Reveal>

          <Reveal i={1}>
            {/* leading needs headroom: the italic descenders on "Converting"
                collide with the lede at anything tighter than ~1.08 */}
            <h1 className="mb-9 max-w-[19ch] pb-[.06em] text-[clamp(2.7rem,7.4vw,5.6rem)] font-semibold leading-[1.08]">
              Your English pages sell.
              <br />
              <span className="shimmer">Multilingual SEO makes your other languages sell too.</span>
            </h1>
          </Reveal>

          <Reveal i={2}>
            <p
              className="mb-10 max-w-[54ch] text-[clamp(1.05rem,1.65vw,1.24rem)] leading-[1.58]"
              style={{ color: "var(--dim)" }}
            >
              Traffic arrives in French and German. The enquiries still come
              from the English pages. We work out how much of that gap is
              search and how much is the writing, then close it market by
              market.
            </p>
          </Reveal>

          <Reveal i={3}>
            <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book a discovery call
              </Link>
              <Link href="/results/" className="ulink text-[.98rem]">
                See what the numbers did
              </Link>
            </div>
          </Reveal>

          <Reveal i={4}>
            {/* Three things the service pages already commit to, rather than
                the old "Ranking in EN, converting in FR" strip. That one read
                as wordplay and did not survive reading: it handed each
                language a single outcome, as though English only ranked and
                French only converted, and it named four markets when six
                language SEO services exist, quietly dropping DE, IT and PT. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[.94rem]" style={{ color: "var(--dim)" }}>
              {["Written natively, market by market", "Languages that add up, not compete", "Enquiries counted per language"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <i className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />}
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What we do</p>
            <h2 className="mb-5 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Enquiries from every market you sell in.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              You already sell abroad, so the product is proven. Ongoing
              multilingual SEO is the main engagement, with localisation,
              paid search and AI consulting around it, and enquiries are the
              product either way, counted market by market so you can see
              which language earns them.
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

      {/* ============ PULL QUOTE ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <blockquote
              className="display max-w-[22ch] text-[clamp(1.9rem,4.6vw,3.4rem)] font-medium leading-[1.14]"
            >
              A ranking gets you found.{" "}
              <em style={{ color: "var(--berry)" }}>The writing in their language</em>{" "}
              gets you the enquiry.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ============ BASTIN, THE ACRONYM ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Nobody planned this, but it fits</p>
            <h2 className="mb-4 max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              BASTIN was there the whole time.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Six letters, six things this practice has actually been doing,
              long before anyone spelled it out.
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

      {/* ============ WHY IT WORKS ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Why it works</p>
            <h2 className="mb-12 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              The same person reads every language you sell in.
            </h2>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-3">
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

      {/* ============ WORK ============ */}
      <section id="work" className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Picked from the line-up</p>
            <h2 className="mb-4 max-w-[16ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Eight projects, all of them still live.
            </h2>
          </Reveal>

          <div className="mt-10">
            {PROJECTS.map((s, i) => (
              <Spread key={s.domain} d={s} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Four languages, each one the client's choice.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Clients reviewed the work in Dutch, Spanish, French and English,
              unprompted, which is the multilingual claim proving itself better
              than any copy on this page could. Shown here are the English
              reviews; each language version of the site carries its own.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CREDIBILITY ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
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
      <SiteFooter address />

    </main>
  );
}
