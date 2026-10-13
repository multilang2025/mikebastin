import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { frLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// French sibling of /how-i-work/, at the legacy /fr/tarifs/ URL (content-map
// g048, action "reposition"). Same owner decision as the English page: no
// public rates, the engagement shape instead. Every answer is the English
// page's own, adapted. The billing answer keeps both halves (CLAUDE.md:
// media spend passes through with no markup; translation is priced as
// work). Copy is a draft for the owner's review.
const PATH = "/fr/tarifs/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Tarifs et déroulement d’une mission, Mike Bastin",
    description:
      "Comment se déroule une mission de SEO multilingue, de localisation ou de conseil en IA : consultation gratuite, périmètre écrit, livraison mensuelle.",
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

const STAGES = [
  {
    name: "Une consultation gratuite",
    detail:
      "Trente minutes sur les marchés et les langues qui comptent, ce qui se positionne déjà, ce qui a déjà été essayé, et ce qu’un bon résultat représente en demandes. Nous posons d’abord nos questions, puis nous recommandons.",
  },
  {
    name: "Un périmètre écrit pour vos marchés",
    detail:
      "Un bref document qui nomme les pages, les mots-clés et les livrables du premier trimestre, et qui fait quoi. Un site en cinq langues et un site en deux langues sont deux missions différentes, d’où un périmètre construit pour la vôtre.",
  },
  {
    name: "La recherche avant la rédaction",
    detail:
      "Recherche de mots-clés et de concurrents dans chaque marché avant de construire une page ou d’écrire un article. La recherche trouve les termes qui pèsent dans chaque langue, car un terme fort en français change souvent de poids une fois traduit.",
  },
  {
    name: "Une livraison à rythme fixe",
    detail:
      "Le travail avance chaque mois, marché par marché, et chaque langue suit son propre calendrier. Les textes sont écrits par des natifs et relus au regard du brief avant leur mise en ligne.",
  },
  {
    name: "Des rapports marché par marché",
    detail:
      "Des chiffres mensuels pour chaque langue, qui montrent le marché qui convertit et celui qui apporte surtout du trafic.",
  },
  {
    name: "Un avis franc sur chaque marché",
    detail:
      "Quand un marché demande une autre approche après un essai sérieux, nous vous le disons et nous adaptons le plan. C’est aussi pour cela que les missions fonctionnent au mois.",
  },
];

const QUESTIONS = [
  {
    q: "Quand verrons-nous les premiers résultats ?",
    a: "La plupart des clients voient un premier changement mesurable dans les trois premiers mois : un mot-clé qui entre dans le top vingt, une demande venue d’un nouveau marché. Un vrai changement de positions sur plusieurs langues prend en général deux à trois trimestres, le temps que les nouvelles pages soient explorées et gagnent la confiance des moteurs.",
  },
  {
    q: "Faut-il signer un contrat ?",
    a: "Les missions fonctionnent au mois, et chacun peut y mettre fin avec un préavis. Les rapports mensuels vous montrent, marché par marché, ce que chaque mois a apporté.",
  },
  {
    q: "Et si nous avons un seul marché à corriger ?",
    a: "Une correction SEO sur une langue, une revue de localisation, une séance de conseil en IA sur la qualité de la traduction automatique : chacune se traite comme une mission cadrée, avec un début et une fin.",
  },
  {
    q: "Qui fait le travail ?",
    a: "Nous définissons et pilotons la stratégie nous-mêmes. La rédaction et la traduction dans chaque langue passent par des spécialistes que nous vous présentons, la plupart issus du réseau BeTranslated, l’agence de traduction que nous dirigeons depuis vingt ans.",
  },
  {
    q: "Comment est-ce facturé ?",
    a: "Le pilotage fait l’objet d’honoraires à part. Quand une mission comprend de la publicité en ligne, votre budget média va entièrement à vos annonces : il est versé directement à Google, Microsoft ou Meta. Le budget que nous recommandons est donc celui qui apporte des demandes. Ce principe concerne le budget média ; la traduction et la localisation réalisées avec le réseau BeTranslated font l’objet d’un devis pour le travail lui-même.",
  },
  {
    q: "Comment commencer ?",
    a: "Un bref descriptif sur la page de contact : quels marchés, quelles langues, et ce qui a déjà été essayé. Nous lisons chaque message et répondons nous-mêmes, en général sous un jour ouvré.",
  },
];

export default function FrenchTarifsPage() {
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: `${SITE_URL}/fr/` },
          { name: "Tarifs", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Une méthode chiffrée pour vos marchés</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Tarifs et déroulement d&apos;une mission SEO
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Chaque mission est chiffrée à partir de vos marchés, de vos langues et de ce qui existe déjà. Voici comment elle se déroule, et comment elle est facturée.
            </h2>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="roundtable" />
        </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Du premier appel au rapport mensuel</h2>
          </Reveal>
          <ol className="grid gap-8 md:grid-cols-2">
            {STAGES.map((s, i) => (
              <Reveal key={s.name} i={i}>
                <li className="flex items-start gap-4">
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{s.name}</h3>
                    <p className="text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                      {s.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Les questions que l&apos;on nous pose avant un premier appel</h2>
          </Reveal>
          <dl className="grid max-w-[72ch] gap-8">
            {QUESTIONS.map((x, i) => (
              <Reveal key={x.q} i={i}>
                <div>
                  <dt className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{x.q}</dt>
                  <dd className="text-[.98rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
                    {x.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <Reveal>
            <div className="mt-12">
              <ButtonLink href="/fr/nous-contacter/" size="lg">
                Réserver une consultation gratuite
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="fr" />
    </main>
  );
}
