import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import FounderPortrait from "@/components/FounderPortrait";
import HomeEvidence from "@/components/HomeEvidence";
import Testimonials from "@/components/Testimonials";
import HomeWhy from "@/components/HomeWhy";
import { HomeBastin, HomeCredibility } from "@/components/HomeBastin";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { frLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";

// The French homepage (docs/FR-REBUILD-PLAN.md). Its reader is a
// French-speaking company, in France, Belgium (Wallonia, Brussels),
// Switzerland or Luxembourg, selling abroad (owner, 30 Sep 2026: Belgium is
// his natural market, more international by nature, so Belgian, Swiss and
// Luxembourg companies are named)
// (plan decision 2): the reverse of the English "French SEO" page. Every
// claim here is one the English site already makes (over two decades, the
// BeTranslated network, no markup on media spend, month-to-month, a reply
// within a working day). Copy is a draft for the owner's review.
const PATH = "/fr/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Agence SEO internationale, Mike Bastin",
    description:
      "Vos pages en français vous apportent des clients. Vos autres langues peuvent en faire autant, avec des pages écrites par des natifs. Consultation gratuite.",
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

/** The markets a French exporter most often enters, each linked to its page. */
const MARKETS: { slug: string; market: string; line: string }[] = [
  { slug: "seo-espagnol", market: "Espagne et Amérique latine", line: "Un espagnol écrit pour chaque pays où vous vendez, de Madrid à Mexico." },
  { slug: "seo-allemand", market: "Allemagne, Autriche, Suisse", line: "Des pages pensées pour les acheteurs germanophones et la manière dont ils cherchent." },
  { slug: "seo-neerlandais", market: "Pays-Bas et Flandre", line: "Deux publics néerlandophones, deux façons de chercher." },
  { slug: "seo-anglais", market: "Royaume-Uni et Irlande", line: "Le marché anglophone le plus proche, avec ses propres mots-clés." },
];

const SERVICES_FOR: { slug: string; name: string; line: string }[] = [
  { slug: "referencement-multilingue", name: "Référencement multilingue", line: "La stratégie par marché, et des rédacteurs natifs pour chaque langue." },
  { slug: "localisation-de-site-web", name: "Localisation de site web", line: "Des prix, des formulaires et des pages qui paraissent locaux dans chaque pays." },
  { slug: "sem-multilingue", name: "Publicité multilingue", line: "Votre budget média va entièrement à vos annonces, versé directement à Google, Microsoft ou Meta ; le pilotage fait l’objet d’honoraires à part." },
];

const HOW_IT_WORKS = [
  {
    title: "Un audit de votre situation",
    body: "Nous passons en revue votre site, votre visibilité dans les moteurs de recherche et vos versions linguistiques existantes pour repérer le travail technique et éditorial qui mène le plus sûrement à davantage de demandes.",
  },
  {
    title: "Un plan par marché",
    body: "Vous recevez un périmètre écrit pour les marchés que vous voulez développer, avec les priorités, les livrables et les responsabilités convenus avant le début du travail.",
  },
  {
    title: "Un rapport mensuel par langue",
    body: "Le travail avance marché par marché, avec un rapport mensuel du trafic et des demandes de chaque langue pour que vous voyiez ce qui rapporte.",
  },
];

const STEPS = [
  "Une consultation gratuite de trente minutes sur vos marchés, vos langues et ce que vous avez déjà essayé.",
  "Un périmètre écrit pour le premier trimestre : les pages, les mots-clés et qui fait quoi.",
  "Une livraison mensuelle, marché par marché, par des rédacteurs natifs du réseau BeTranslated, l’agence de traduction que nous dirigeons depuis plus de deux décennies.",
  "Des demandes comptées langue par langue, pour savoir quel marché rapporte.",
  "Un engagement au mois, que chacun peut arrêter avec un préavis.",
];

export default function FrenchHome() {
  const live = new Set(getServicesForLocale("fr").map((s) => s.slug));
  const markets = MARKETS.filter((m) => live.has(m.slug));
  const services = SERVICES_FOR.filter((s) => live.has(s.slug));

  return (
    <main>
      <LocaleHtmlLang lang="fr" />

      {/* ============ HERO ============ */}
      {/* Same design as the English homepage (owner, 7 Oct 2026): the agency
          offer, the person who leads it, one call to action. The wording is
          ours for a French-speaking exporter. */}
      <section className="band band-b grain relative overflow-hidden pb-[clamp(48px,6vw,88px)] pt-[clamp(52px,7vw,104px)]">
        <div className="shell relative grid items-center gap-x-14 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Depuis Valencia, pour les entreprises qui exportent</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-5 max-w-[22ch] text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.08]">
              Agence SEO internationale, dirigée par Mike Bastin
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-5 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.6rem)] font-medium leading-[1.3]">
              Vos pages en français vous apportent des clients. Vos autres langues peuvent en faire autant.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Vous dirigez une entreprise française, belge, suisse ou luxembourgeoise : vos autres langues attirent déjà des visiteurs. Nous les transformons en demandes, marché par marché, depuis plus de deux décennies{" "}: les mots que vos acheteurs tapent dans chaque pays, des pages écrites par des natifs et des résultats comptés en demandes reçues.
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href="/fr/nous-contacter/" size="lg">
                Réserver une consultation gratuite
              </ButtonLink>
              <Link href="/fr/services/" className="ulink text-[.98rem]">
                Voir nos services
              </Link>
            </div>
          </Reveal>

        </div>
        <FounderPortrait
          alt="Mike Bastin, à la tête de notre agence de SEO multilingue et de localisation."
          caption="Mike Bastin, directeur de l’agence · Valencia."
        />
        </div>
      </section>

      {/* ============ CLIENT EVIDENCE ============ */}
      {/* Declaudify brief (owner, 3 Oct 2026): dated figures and three cases
          straight after the hero, in place of all eight spreads. */}
      <HomeEvidence locale="fr" band="a" />

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Ce que nous faisons pour chaque marché</h2>
          </Reveal>
          <ul className="grid gap-8 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} i={i}>
                <li>
                  <Link href={servicePath("fr", s.slug)} className="ulink mb-2 inline-block text-[1.12rem] font-semibold">
                    {s.name}
                  </Link>
                  <p className="text-[.96rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {s.line}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="mt-10 max-w-[62ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Les trois sont menés ensemble et jugés sur les demandes que chaque marché vous envoie.{" "}
              <Link href={leadGenPath("fr")} className="ulink">
                Découvrir notre offre de génération de leads B2B
              </Link>
              .
            </p>
          </Reveal>
          <Reveal>
            <p className="eyebrow mb-3 mt-12">Comment nous procédons</p>
          </Reveal>

          <ol className="grid gap-px md:grid-cols-3" style={{ background: "var(--rule)" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} i={i}>
                <li className="band h-full px-7 py-7" style={{ background: "var(--bg)" }}>
                  <p className="display mb-5 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mb-3 text-[1.15rem] font-semibold leading-[1.25]">{step.title}</h3>
                  <p className="text-[.92rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal i={3}>
            <p className="mt-8 text-[.95rem]" style={{ color: "var(--dim)" }}>
              <Link href="/fr/tarifs/" className="ulink" style={{ color: "var(--berry)" }}>
                Découvrir comment nous cadrons la mission et les honoraires
              </Link>
              {", et ce qui se passe du premier appel aux rapports mensuels."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ MARKETS ============ */}
      {markets.length > 0 && (
        <section className="band band-a py-[clamp(56px,8vw,104px)]">
          <div className="shell">
            <Reveal>
              <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Le marché où vous voulez vendre ensuite</h2>
              <p className="mb-10 max-w-[58ch]" style={{ color: "var(--dim)" }}>
                Chaque pays cherche avec ses propres mots, et vos pages sont écrites à partir de ces mots-là.
              </p>
            </Reveal>
            <ul className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
              {markets.map((m, i) => (
                <Reveal key={m.slug} i={i}>
                  <li className="band h-full" style={{ background: "var(--bg)" }}>
                    <Link href={servicePath("fr", m.slug)} className="flex h-full flex-col px-7 py-8">
                      <span className="ulink mb-2 text-[1.12rem] font-semibold">{m.market}</span>
                      <p className="text-[.94rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                        {m.line}
                      </p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============ HOW WE WORK ============ */}
      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell grid gap-[clamp(32px,5vw,64px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <Reveal>
            <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Comment nous travaillons</h2>
            <p className="mt-4 max-w-[40ch]" style={{ color: "var(--dim)" }}>
              Nous pilotons la stratégie nous-mêmes et répondons à chaque message, en général sous un jour ouvré.
            </p>
          </Reveal>
          <ol className="grid gap-5">
            {STEPS.map((s, i) => (
              <Reveal key={i} i={i}>
                <li className="flex items-start gap-4 text-[1rem] leading-[1.6]">
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{s}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <HomeWhy locale="fr" band="a" />

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Dans leurs propres mots</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Nos clients nous recommandent dans leur langue.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Des avis en néerlandais, en espagnol, en français et en anglais. Voici ceux rédigés en français.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials locale="fr" initialCount={4} />
          </Reveal>
        </div>
      </section>

      <HomeBastin locale="fr" band="a" />

      <HomeCredibility locale="fr" band="b" />

      <SiteFooter locale="fr" band="a" />
    </main>
  );
}
