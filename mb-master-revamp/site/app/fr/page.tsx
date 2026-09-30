import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { frLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// The French homepage (docs/FR-REBUILD-PLAN.md). Its reader is a
// French-speaking company, in France, Belgium (Wallonia, Brussels) or
// Switzerland, selling abroad (owner, 30 Sep 2026: Belgium is his natural
// market, more international by nature, so Belgian and Swiss companies are named)
// (plan decision 2): the reverse of the English "French SEO" page. Every
// claim here is one the English site already makes (over two decades, the
// BeTranslated network, no markup on media spend, month-to-month, a reply
// within a working day). Copy is a draft for the owner's review.
const PATH = "/fr/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Agence SEO internationale, Mike Bastin",
    description:
      "Vos pages en français vendent. Nous faisons vendre vos autres langues aussi : référencement par marché, pages écrites par des natifs, demandes comptées pays par pays.",
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

const STEPS = [
  "Un premier échange de trente minutes sur vos marchés, vos langues et ce que vous avez déjà essayé.",
  "Un périmètre écrit pour le premier trimestre : les pages, les mots-clés et qui fait quoi.",
  "Une livraison mensuelle, marché par marché, par des rédacteurs natifs du réseau BeTranslated, que nous faisons travailler depuis vingt ans.",
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
      <JsonLd data={breadcrumbSchema([{ name: "Accueil", url: `${SITE_URL}${PATH}` }])} />

      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,110px)] pt-[clamp(96px,14vw,170px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Depuis Valencia, pour les entreprises qui exportent</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[16ch] text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.05]">
              Agence SEO internationale
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[40ch] text-[clamp(1.25rem,2.2vw,1.8rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Vos pages en français vendent. Nous faisons vendre vos autres langues aussi.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Entreprise française, belge ou suisse, vous avez déjà du trafic dans vos autres langues. Le transformer en demandes, marché par marché, c&apos;est notre métier depuis plus de vingt ans{" "}: des mots-clés trouvés dans chaque pays, des pages écrites par des natifs, et des résultats comptés en demandes.
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-6">
              <ButtonLink href="/fr/nous-contacter/" size="lg">
                Réserver un premier échange
              </ButtonLink>
              <Link href="/fr/services/" className="ulink text-[.98rem]">
                Voir nos services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ MARKETS ============ */}
      {markets.length > 0 && (
        <section className="band band-b py-[clamp(56px,8vw,104px)]">
          <div className="shell">
            <Reveal>
              <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Le marché où vous voulez vendre ensuite</h2>
              <p className="mb-10 max-w-[58ch]" style={{ color: "var(--dim)" }}>
                Chaque pays cherche avec ses propres mots, et nous écrivons vos pages à partir de ceux-là.
              </p>
            </Reveal>
            <ul className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
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

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-a py-[clamp(56px,8vw,104px)]">
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
                Voir notre génération de leads B2B
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

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

      <SiteFooter locale="fr" />
    </main>
  );
}
