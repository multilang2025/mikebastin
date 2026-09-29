import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { frLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// French-only page at the legacy /fr/notre-equipe/ URL (content-map, plan
// phase 3). No English sibling: the English site folds this into
// /how-i-work/, which /fr/tarifs/ already pairs with. Every fact is one the
// English site states (over two decades, Valencia since 2016, the
// BeTranslated network run for twenty years, a reply within a working
// day). Copy is a draft for the owner's review.
const PATH = "/fr/notre-equipe/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Notre équipe, Mike Bastin",
    description:
      "Qui pilote votre référencement international et qui écrit dans chaque langue : Mike Bastin à Valence, et des spécialistes natifs du réseau BeTranslated.",
    path: PATH,
    languages: frLanguages(PATH),
    fallbackImage: true,
    ogLocale: "fr_FR",
  }),
};

const POINTS = [
  {
    name: "La stratégie, pilotée directement",
    detail:
      "Nous définissons et suivons nous-mêmes la stratégie de chaque marché : recherche, priorités, rapports mensuels. Vous savez à qui vous parlez, du premier échange au dernier rapport.",
  },
  {
    name: "Des spécialistes natifs, nommés",
    detail:
      "La rédaction et la traduction dans chaque langue passent par des spécialistes que nous vous présentons, la plupart issus du réseau BeTranslated, que nous animons depuis vingt ans. Chacun écrit dans sa langue maternelle et connaît le secteur qu’il traite.",
  },
  {
    name: "Trois langues de travail",
    detail:
      "Nous échangeons avec vous en français, en anglais ou en espagnol, depuis Valence où nous sommes installés depuis 2016.",
  },
];

export default function FrenchTeamPage() {
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: `${SITE_URL}/fr/` },
          { name: "Notre équipe", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Qui travaille sur votre site</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Notre équipe
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Plus de vingt ans de référencement multilingue, avec un rédacteur natif pour chaque langue où vous vendez.
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
                  Valence, plus de vingt ans de référencement multilingue
                </span>
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Comment nous travaillons</h2>
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
              Nous lisons chaque message et répondons nous-mêmes, en général sous un jour ouvré.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/fr/nous-contacter/" size="lg">
                Nous contacter
              </ButtonLink>
              <ButtonLink href="/fr/tarifs/" size="lg" variant="ghost">
                Le déroulement d&apos;une mission
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="fr" />
    </main>
  );
}
