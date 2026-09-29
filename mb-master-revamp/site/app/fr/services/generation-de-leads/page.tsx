import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import Expandables from "@/components/Expandables";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import ServiceHeroArt from "@/components/ServiceHeroArt";
import { pageMeta } from "@/lib/meta";
import { leadGenLanguages, leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema, serviceSchema } from "@/lib/schema";

// French sibling of /services/lead-generation/, the hub the rest of the
// French services feed. Same case in the same order as the English page,
// written for a French company selling abroad rather than translated.
// Every fact is one the English page states. Copy is a draft for the
// owner's review (docs/FR-REBUILD-PLAN.md, decision 5).
const PATH = leadGenPath("fr");
const NAME = "Génération de leads B2B";
const TITLE = "Agence de génération de leads B2B à l’international";
const DESCRIPTION =
  "Vos marchés étrangers vous envoient des visites et peu de demandes. Nous en faisons des leads qualifiés, comptés marché par marché, sans marge sur vos budgets publicitaires.";

export const metadata: Metadata = {
  ...pageMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    languages: leadGenLanguages(),
    fallbackImage: true,
    ogLocale: "fr_FR",
  }),
};

const PARTS = [
  {
    title: "Trouvé dans leur langue",
    body: "Un référencement construit marché par marché à partir de ce que les acheteurs y tapent vraiment, pour que le bon visiteur arrive sur une page écrite pour lui plutôt que traduite pour lui.",
    href: "/fr/services/referencement-multilingue/",
    link: "Référencement multilingue",
  },
  {
    title: "Atteint avant qu’il vous trouve",
    body: "Des campagnes payantes dans chaque langue pour l’acheteur qui ne vous a pas encore trouvé en naturel, avec un budget séparé par marché pour qu’aucun n’en finance discrètement un autre.",
    href: "/fr/services/sem-multilingue/",
    link: "SEM multilingue",
  },
  {
    title: "Compté là où il est né",
    body: "Chaque demande rattachée au marché et à la langue qui l’ont apportée, puis suivie jusque dans votre CRM, pour juger un marché sur les conversations qu’il ouvre.",
    href: "/fr/services/seo-technique/",
    link: "SEO technique et analytics",
  },
];

const QUESTIONS = [
  {
    q: "Faut-il lancer toutes les langues en même temps ?",
    a: [
      "Non, et c’est en général moins cher de ne pas le faire. Nous commençons par le marché où les signaux sont les plus nets, nous le faisons produire des demandes, puis nous ajoutons le suivant.",
      "Répartir le premier budget sur toutes vos langues, c’est la façon la plus sûre d’obtenir plusieurs marchés presque actifs et aucun qui rapporte clairement.",
    ],
  },
  {
    q: "Qu’est-ce qui compte comme un lead ?",
    a: [
      "La définition que votre équipe commerciale reconnaît, fixée avant toute mesure. En général, une demande qui est devenue une conversation.",
      "Le spam, les candidatures et les envois de test sont comptés à part, pour qu’un marché soit jugé sur ce qui atteint réellement votre équipe plutôt que sur le nombre de formulaires remplis.",
    ],
  },
  {
    q: "Qui écrit dans les langues que vous ne rédigez pas vous-mêmes ?",
    a: [
      "Nous écrivons directement en français, en anglais, en espagnol et en néerlandais. L’allemand, l’italien, le portugais et les autres langues passent par des rédacteurs natifs du réseau BeTranslated, que nous briefons et relisons.",
      "Dans tous les cas, la page est écrite pour le marché qui la lit, à partir de ses propres recherches, plutôt que traduite d’une page française pensée pour un autre lecteur.",
    ],
  },
  {
    q: "Y a-t-il une durée d’engagement minimale ?",
    a: [
      "Aucun engagement de durée. Le premier échange aboutit à un périmètre écrit qui nomme les pages et les livrables, et vous décidez ensuite.",
    ],
  },
];

export default function FrenchLeadGenerationPage() {
  const url = `${SITE_URL}${PATH}`;
  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={[
          serviceSchema({ name: NAME, description: DESCRIPTION, url }),
          breadcrumbSchema([
            { name: "Accueil", url: `${SITE_URL}/fr/` },
            { name: "Services", url: `${SITE_URL}/fr/services/` },
            { name: NAME, url },
          ]),
        ]}
      />

      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="eyebrow mb-8">Mesuré en demandes, pas en visites</p>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mb-6 max-w-[22ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
                Agence de génération de leads pour les entreprises qui exportent
              </h1>
            </Reveal>
            <Reveal i={2}>
              <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
                Vos marchés étrangers vous envoient déjà des visiteurs. Nous en faisons des demandes qui méritent un appel commercial, et nous vous montrons de quel marché vient chacune.
              </h2>
            </Reveal>
            <Reveal i={3}>
              <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
                Le trafic arrive en espagnol, en allemand et en néerlandais, et les demandes arrivent toujours en français. La Search Console d’un client affichait quarante mille impressions en quatre-vingt-dix jours, pour six clics. Les acheteurs cherchaient, et rien ne transformait cette recherche en conversation.
              </p>
            </Reveal>
            <Reveal i={4}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/fr/nous-contacter/" className="btn btn-primary btn-lg">
                  Réserver un premier échange
                </Link>
                <Link href="#facturation" className="ulink text-[.98rem]">
                  Voir comment c’est facturé
                </Link>
              </div>
            </Reveal>
          </div>
          <div className="hidden w-[min(360px,30vw)] lg:mt-24 lg:block">
            <ServiceHeroArt slug="lead-generation" />
          </div>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Ce que coûte un rapport global</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Un total unique cache le marché qui paie pour les autres
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Un seul chiffre pour tout le site est le rapport le plus confortable à lire et le moins utile pour décider. Dans une moyenne, le marché qui porte vos résultats et celui qui dépense son budget en visites sans suite se ressemblent parfaitement.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Le budget continue donc d’aller là où le trafic a l’air le plus sain, et la langue qui vend vraiment en reçoit un peu moins chaque trimestre. Personne ne l’a décidé. Le rapport l’a décidé, en ne montrant jamais la différence. Chaque mois où il fonctionne ainsi, le marché qui devrait grandir est celui qu’on prive.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Ce que nous faisons dans chaque marché</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              La génération de leads B2B, menée langue par langue
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Trois volets, menés ensemble et jugés sur une seule chose : chaque marché envoie-t-il à votre équipe commerciale des demandes qui valent la peine ? Pris isolément, chacun produit un rapport. Ensemble, ils produisent un pipeline que vous lisez marché par marché.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="grid gap-px lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {PARTS.map((p) => (
                <div key={p.title} className="band flex flex-col px-7 py-8" style={{ background: "var(--bg)" }}>
                  <p className="display mb-3 text-[1.2rem] font-semibold">{p.title}</p>
                  <p className="mb-6 text-[.95rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {p.body}
                  </p>
                  <Link href={p.href} className="ulink mt-auto text-[.9rem]">
                    {p.link}
                  </Link>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="facturation" className="band band-b scroll-mt-20 py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">La facturation</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Aucune marge sur votre budget publicitaire : un budget plus élevé ne nous rapporte rien
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Quand une mission comprend de la publicité en ligne, votre budget média va directement à Google, Microsoft ou Meta, sans passer par nous. Le pilotage fait l’objet d’honoraires à part. Nous n’avons donc aucune raison de recommander un budget plus élevé, et toutes les raisons de recommander celui qui apporte des demandes.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Pour être précis sur la limite : ce principe vaut pour le budget média. La rédaction et la traduction font l’objet d’un devis pour le travail lui-même. Une agence qui reste floue sur ce qui est refacturé et ce qui est facturé a souvent une raison de l’être, et nous préférons que vous le sachiez avant le premier échange.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Ce qu’en disent nos clients</p>
            <h2 className="mb-5 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Des avis publics, dans la langue de leurs auteurs
            </h2>
            <p className="mb-10 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Nos clients nous notent en anglais, en néerlandais, en français et en espagnol, chacun dans la langue qu’il a choisie. Voici ceux qui l’ont fait en français.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials locale="fr" />
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Comment les demandes sont comptées</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Un formulaire envoyé devient un lead quand votre équipe le reconnaît comme tel
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Le suivi passe par GA4 et Google Tag Manager, configurés par langue avec les mêmes définitions d’événements partout, pour qu’une demande espagnole et une demande allemande soient comptées de la même façon et puissent être comparées. Le mode de consentement est réglé marché par marché, car les taux de refus varient d’un pays à l’autre, et une comparaison non corrigée classerait vos langues selon l’acceptation des cookies plutôt que selon les ventes.
            </p>
            <p className="mb-12 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Le CRM boucle la boucle. Le suivi des conversions hors ligne renvoie l’issue de chaque demande vers GA4 et Google Ads : un marché qui envoie moins de demandes, mais de meilleures, apparaît comme gagnant, et les enchères publicitaires suivent ce que vaut un marché plutôt que le nombre de formulaires qu’il remplit.
            </p>
          </Reveal>
          <Reveal i={1}>
            <h3 className="display mb-6 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold">
              Les questions qu’on nous pose avant le premier échange
            </h3>
          </Reveal>
          <Reveal i={2}>
            <Expandables items={QUESTIONS} />
          </Reveal>
        </div>
      </section>

      <section className="band band-a py-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">La prochaine étape</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Découvrez ce que vos autres marchés pourraient vous envoyer
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Trente minutes sur les marchés qui comptent, ce qui se positionne déjà et ce qui a déjà été essayé. Nous posons nos questions avant de recommander quoi que ce soit, et vous recevez ensuite un périmètre écrit qui nomme de vraies pages et de vrais livrables, plutôt qu’un devis à formules. Sans engagement de durée.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/fr/nous-contacter/" className="btn btn-primary btn-lg">
                Réserver un premier échange
              </Link>
              <Link href="/fr/tarifs/" className="ulink text-[.98rem]">
                Voir le déroulement d’une mission
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="fr" />
    </main>
  );
}
