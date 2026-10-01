import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import ImpressionsChart from "@/components/ImpressionsChart";
import ConsolidationDiagram from "@/components/ConsolidationDiagram";
import LocaleTable from "@/components/LocaleTable";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Client results you can count, Mike Bastin",
    description: "Results from multilingual SEO and localization work: real Search Console figures, the markets they came from, and reviews from clients in four languages.",
    path: "/results/",
    fallbackImage: true,
  }),
};

export default function ResultsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Results", url: `${SITE_URL}/results/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Results you can count</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Client results and numbers
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              What changed on real engagements, with the figures attached and the markets they came from named.
            </h2>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="clock" />
        </HeroArtSlot>
        </div>
      </section>

      {/* ============ THE DIAGNOSIS: charts ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">What the data said</p>
            <h2 className="mb-5 max-w-[18ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty thousand impressions produced six clicks.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Before rebuilding anything, we pulled ninety days of Search Console
              for the whole domain. Visibility was already there; the work was
              turning it into clicks.
            </p>
          </Reveal>

          <Reveal i={2}>
            <ImpressionsChart />
          </Reveal>
        </div>
      </section>

      {/* ============ THE FIX: schema diagram + locales ============ */}
      <section className="band band-a py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">The fix, in structure</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Forty-three service pages became nineteen.
            </h2>
            <p className="mb-12 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Open a cluster to see which pages were combined.
            </p>
          </Reveal>

          <ConsolidationDiagram />

          <Reveal>
            <p className="mb-3 mt-16 eyebrow">Three locales, one set of groups</p>
            <h3 className="mb-8 max-w-[24ch] display text-[1.4rem] font-semibold leading-[1.2]">
              Every merge happens in all three languages at once.
            </h3>
          </Reveal>
          <Reveal i={2}>
            <LocaleTable />
          </Reveal>
          <Reveal i={3}>
            <p className="mt-8 max-w-[60ch] text-[.95rem]" style={{ color: "var(--dim)" }}>
              French carries one service more than English and Spanish, and
              counting details like that one is what keeps hreflang intact.
            </p>
          </Reveal>
        </div>
      </section>


      {/* ============ TESTIMONIALS (live today) ============ */}
      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">In their own words</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Clients review us in their own language.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Every one is public on the linked Google Business Profile,
              where it can be checked against the source.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter />
    </main>
  );
}
