import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ImpressionsChart from "@/components/ImpressionsChart";
import ConsolidationDiagram from "@/components/ConsolidationDiagram";
import LocaleTable from "@/components/LocaleTable";
import Spread, { type SpreadData } from "@/components/Spread";
import Testimonials from "@/components/Testimonials";

const SPREADS: SpreadData[] = [
  {
    numeral: "I", name: "BeTranslated", domain: "betranslated.com",
    angle: "Founded it, still run it",
    body: "A translation agency with six regional identities and a multi-TLD setup that has to rank separately in every one of them. Twenty years of learning what breaks when a brand tries to speak six languages at once.",
    metrics: [{ v: "6", k: "Regional TLDs" }, { v: "20 yr", k: "Running it" }],
  },
  {
    numeral: "II", name: "Globaprom", domain: "globaprom.com",
    angle: "Custom AI software",
    body: "Fixed scope, fixed price, delivered in weeks, multilingual from the first commit. Built the shipment tracking portal that took roughly three hours a day of status chasing out of a freight forwarder's week.",
    metrics: [{ v: "3 h/day", k: "Saved on tracking" }, { v: "10 h/wk", k: "On reconciliation" }],
  },
  {
    numeral: "III", name: "TX International Freight", domain: "txintlfreight.com",
    angle: "Houston industrial freight",
    body: "Technical SEO and content for a freight forwarder whose customers search in terms no marketer would guess. Learning the vocabulary was most of the work.",
    metrics: [{ v: "Houston", k: "Local pack" }, { v: "EN", k: "Single market" }],
  },
  {
    numeral: "IV", name: "Century 21 Perdomo", domain: "c21perdomo.com",
    angle: "Dominican real estate",
    body: "Four languages over a headless WordPress build with WPML and WooCommerce. Property listings that have to stay correct in every locale while stock turns over weekly.",
    metrics: [{ v: "4", k: "Languages" }, { v: "Headless", k: "Architecture" }],
  },
  {
    numeral: "V", name: "ValenciaMove", domain: "valenciamove.com",
    angle: "Expat relocation, first hand",
    body: "Over a thousand pages across five languages, written from actually having done the move rather than from a keyword tool. The Valencia content leaving mikebastin.com is heading here.",
    metrics: [{ v: "1,132", k: "URLs" }, { v: "5", k: "Locales" }],
  },
  {
    numeral: "VI", name: "Bemelman Spuiterij", domain: "bemelmanspuiterij.nl",
    angle: "Dutch powder coating, 45 years",
    body: "A specialist in Noordwijkerhout who had no web presence worth the name. Dutch local SEO for a trade where the buyers are other businesses and the search volume is small but decisive.",
    metrics: [{ v: "45 yr", k: "Trading" }, { v: "NL", k: "Local search" }],
  },
  {
    numeral: "VII", name: "Delaguía y Luzón", domain: "delaguialuzon.com",
    angle: "Valencia law firm",
    body: "Legal, labour, immigration and tax across Spain and France, in four languages including Russian. Legal SEO where a mistranslated term is a liability, not a ranking problem.",
    metrics: [{ v: "4", k: "Languages" }, { v: "2", k: "Jurisdictions" }],
  },
  {
    numeral: "VIII", name: "Matosurf", domain: "matosurf.com",
    angle: "French board sports",
    body: "Seven board sports, forty-eight French spots, a hundred and twenty guides. Friends in the line-up still call me the Silver Surfer, and the editorial method page there is the pattern this site borrows for its own credibility layer.",
    metrics: [{ v: "120+", k: "Guides" }, { v: "48", k: "Spots" }],
  },
];

const STATS = [
  { n: 25, s: "", k: "Years in search" },
  { n: 4, s: "+1", k: "Languages spoken" },
  { n: 8, s: "", k: "Projects in the line-up" },
  { n: 12, s: "", k: "Domains run" },
];

export default function Home() {
  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain hero-glow relative overflow-hidden pb-[clamp(60px,9vw,120px)] pt-[clamp(96px,14vw,190px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">
              Reading the swell for twenty-five years, in four languages
            </p>
          </Reveal>

          <svg
            className="swell mb-10 block h-auto w-[min(420px,62%)] overflow-visible"
            viewBox="0 0 420 74"
            role="img"
            aria-label="Two drawn swell lines, gold over silver"
          >
            <path className="s1" d="M3 40 C 66 8, 122 8, 182 34 S 302 68, 360 30 L 417 22" />
            <path className="s2" d="M3 58 C 74 32, 130 32, 190 52 S 308 80, 370 50 L 417 44" />
          </svg>

          <Reveal i={1}>
            {/* leading needs headroom: the italic descenders on "Converting"
                collide with the lede at anything tighter than ~1.08 */}
            <h1 className="mb-9 max-w-[16ch] pb-[.06em] text-[clamp(2.7rem,7.4vw,5.6rem)] font-semibold leading-[1.08]">
              Ranking is one language.
              <br />
              <span className="shimmer">Converting is another.</span>
            </h1>
          </Reveal>

          <Reveal i={2}>
            <p
              className="mb-10 max-w-[54ch] text-[clamp(1.05rem,1.65vw,1.24rem)] leading-[1.58]"
              style={{ color: "var(--dim)" }}
            >
              Multilingual SEO, localisation and AI consulting from Valencia.
              Twenty-five years of watching what actually works when a business
              tries to sell in a language it does not think in.
            </p>
          </Reveal>

          <Reveal i={3}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[.94rem]" style={{ color: "var(--dim)" }}>
              {["Ranking in EN", "Converting in FR", "Localised in ES", "Indexed in NL"].map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <i className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />}
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ PULL QUOTE ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <blockquote
              className="display max-w-[22ch] text-[clamp(1.9rem,4.6vw,3.4rem)] font-medium leading-[1.14]"
            >
              A site that ranks everywhere and{" "}
              <em style={{ color: "var(--berry)" }}>converts nowhere</em> has a
              language problem, not a traffic problem.
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ============ THE DIAGNOSIS: charts ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What the data actually said</p>
            <h2 className="mb-5 max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty thousand impressions. Six clicks.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Before rebuilding anything, I pulled ninety days of Search Console
              for the whole domain. The problem was never visibility.
            </p>
          </Reveal>

          <Reveal i={1}>
            <ImpressionsChart />
          </Reveal>
        </div>
      </section>

      {/* ============ THE FIX: schema diagram ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The fix, in structure</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty-three service pages became thirteen.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              One page, one query network, covered properly. Open a cluster to
              see what folded into what.
            </p>
          </Reveal>

          <ConsolidationDiagram />
        </div>
      </section>

      {/* ============ LOCALES ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Three locales, one set of groups</p>
            <h2 className="mb-10 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Every merge happens in all three languages, or not at all.
            </h2>
          </Reveal>
          <Reveal i={1}>
            <LocaleTable />
          </Reveal>
          <Reveal i={2}>
            <p className="mt-8 max-w-[60ch] text-[.95rem]" style={{ color: "var(--dim)" }}>
              French carries one service more than English and Spanish, which is
              the kind of detail that quietly breaks hreflang if nobody counts.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ WORK ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Picked from the line-up</p>
            <h2 className="mb-4 max-w-[16ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Eight projects, all of them still live.
            </h2>
          </Reveal>

          <div className="mt-10">
            {SPREADS.map((s, i) => (
              <Spread key={s.domain} d={s} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their words, in their languages</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Ten reviews. Four languages. Nobody asked them to write in mine.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Clients reviewed the work in Dutch, Spanish, French and English,
              which is the multilingual claim proving itself better than any
              copy on this page could.
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
      <footer className="band band-a py-[clamp(72px,10vw,140px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Clean face, no crowd</p>
            <h2 className="mb-8 max-w-[15ch] text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.06]">
              Tell me which language is losing you money.
            </h2>
            <div className="flex flex-col gap-2 text-[1.05rem]">
              <a href="mailto:mike@betranslated.com" className="ulink w-fit">
                mike@betranslated.com
              </a>
              <a href="tel:+34671175774" className="ulink w-fit">
                +34 671 17 57 74
              </a>
              <span style={{ color: "var(--dim)" }}>
                Calle Rugat 12 to 2, 46021 Valencia, Spain
              </span>
            </div>
          </Reveal>

          <Reveal i={2}>
            <p
              className="mt-14 border-t pt-6 text-[.82rem]"
              style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
            >
              Mike Bastin. Built with Next.js, Motion and Lenis. Night Swell and
              Morning Glass, set in Fraunces, Cormorant Garamond and Inter.
            </p>
          </Reveal>
        </div>
      </footer>
    </main>
  );
}
