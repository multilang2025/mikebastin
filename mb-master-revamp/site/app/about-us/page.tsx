import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { enLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema, pageSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";
import { HomeBastin } from "@/components/HomeBastin";

// The English about page (owner, 8 Oct 2026: "I don't see [it] in the
// menu", and move the BASTIN section here from the homepage). It sits at
// the legacy /about-us/ URL, which until now redirected to /how-i-work/,
// and pairs with /fr/notre-equipe/ and /es/conocenos-agencia-experta-en-seo/.
// Every fact is one those pages and CLAUDE.md already state: over two
// decades, Valencia since 2016, BeTranslated run for twenty years, four
// working languages, Mike leads every engagement, a reply within a working
// day.
const PATH = "/about-us/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "About us, Mike Bastin",
    description:
      "Who runs your international SEO and who writes in each language: Mike Bastin in Valencia, with native specialists from the BeTranslated network.",
    path: PATH,
    languages: enLanguages(PATH),
  }),
};

const POINTS = [
  {
    name: "Strategy led by Mike, from start to finish",
    detail:
      "Mike sets and runs the strategy for every market: research, priorities and the monthly report. You deal with him from the first call to the last report.",
  },
  {
    name: "Native specialists you get to know",
    detail:
      "Writing and translation in each language go to specialists we introduce to you, most of them from BeTranslated, the translation agency we have run for twenty years. Each writes in their mother tongue and knows the sector they cover.",
  },
  {
    name: "Four working languages",
    detail:
      "We work directly in French, English, Spanish and Dutch, from Valencia, where we have been based since 2016.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={pageSchema("AboutPage", `${SITE_URL}${PATH}`, "About us", "en")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${SITE_URL}/` },
          { name: "About us", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="eyebrow mb-8">Who works on your site</p>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
                Our international SEO team, from Valencia to every market you sell in
              </h1>
            </Reveal>
            <Reveal i={2}>
              <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
                Over two decades of multilingual SEO, and a native writer for every language you sell in.
              </h2>
            </Reveal>
            <Reveal i={3}>
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
                    Valencia, over two decades of multilingual SEO
                  </span>
                </span>
              </div>
            </Reveal>
          </div>
          <HeroArtSlot visibleOnMobile={true}>
            <DlArt name="skyline" />
          </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">How we work with you</h2>
          </Reveal>
          <ul className="grid gap-8 md:grid-cols-3">
            {POINTS.map((p, i) => (
              <Reveal key={p.name} i={i}>
                <li>
                  <h3 className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{p.name}</h3>
                  <p className="text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {p.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="mt-12 max-w-[60ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              We read every message and reply ourselves, usually within one working day.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/contact/" size="lg">
                Book a free consultation
              </ButtonLink>
              <ButtonLink href="/how-i-work/" size="lg" variant="ghost">
                See how an engagement runs
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <HomeBastin locale="en" band="a" />

      <SiteFooter band="b" />
    </main>
  );
}
