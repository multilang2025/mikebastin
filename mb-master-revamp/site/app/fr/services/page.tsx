import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { frLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// French services index (docs/FR-REBUILD-PLAN.md). The legacy /fr/nos-services/
// 301s here. Lists every live French service page, grouped for a French
// company selling abroad (plan decision 2). Copy is a draft for the
// owner's review.
const PATH = "/fr/services/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Services SEO international, Mike Bastin",
    description:
      "Référencement par marché, localisation et publicité multilingue pour les entreprises qui vendent déjà à l’étranger et veulent que chaque langue rapporte des demandes.",
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

/**
 * Groups, in the order a French exporter reads them: the market they are
 * entering, then the search work, then the localization around it. A
 * service missing from every group lands in the last one rather than
 * disappearing, so a newly built page is never unlisted.
 */
const GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: "Le SEO pour chaque marché où vous vendez",
    slugs: ["seo-espagnol", "seo-allemand", "seo-neerlandais", "seo-anglais", "seo-italien", "seo-portugais"],
  },
  {
    heading: "Référencement et acquisition",
    slugs: ["seo", "referencement-multilingue", "seo-technique", "referencement-local", "sem-multilingue"],
  },
  {
    heading: "Contenu, traduction et IA",
    slugs: ["creation-de-contenu-multilingue", "traduction-professionnelle", "postedition-ia", "conseil-ia"],
  },
  { heading: "Localisation", slugs: [] },
];

export default function FrenchServicesIndex() {
  const services = getServicesForLocale("fr");
  const listed = new Set(GROUPS.flatMap((g) => g.slugs));
  const groups = GROUPS.map((g, i) => ({
    heading: g.heading,
    items:
      i === GROUPS.length - 1
        ? services.filter((s) => !listed.has(s.slug))
        : g.slugs.map((slug) => services.find((s) => s.slug === slug)).filter((s) => s !== undefined),
  })).filter((g) => g.items.length > 0);

  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: `${SITE_URL}/fr/` },
          { name: "Services", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Référencement, localisation et publicité multilingue</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Services SEO pour les entreprises qui vendent à l&apos;international
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Le référencement suivi dans chaque marché est le cœur de notre travail, avec la localisation et la publicité en ligne autour.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Vous vendez en Espagne, en Allemagne, au Benelux ou au Royaume-Uni, et vous voulez que chacun de ces marchés rapporte des demandes. Partez du marché qui compte le plus pour vous{" "}: nous vous dirons ce qu&apos;il demande réellement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The hub every service below feeds, as on the English index. */}
      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <Reveal>
            <Link
              href={leadGenPath("fr")}
              className="group flex flex-col gap-3 border px-7 py-8 sm:px-10"
              style={{ borderColor: "var(--rule)" }}
            >
              <span className="eyebrow">Le service qui réunit tous les autres</span>
              <span className="ulink text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold leading-[1.2]">
                Génération de leads B2B à l’international
              </span>
              <span className="max-w-[60ch] text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                Référencement, publicité et suivi des conversions menés ensemble, et jugés sur un seul critère{"\u00a0"}: les demandes que chaque marché envoie à votre équipe commerciale.
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.heading} className={`band ${gi % 2 === 0 ? "band-a" : "band-b"} py-[clamp(48px,7vw,96px)]`}>
          <div className="shell">
            <Reveal>
              <div className="mb-8 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
                <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.15]">{g.heading}</h2>
              </div>
            </Reveal>
            {/* Three across only when the row fills: two or four cards in a
                three-column grid leave an empty grey cell. An odd count in
                two columns widens its last card for the same reason. */}
            <ul
              className={`grid gap-px sm:grid-cols-2 ${g.items.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}
              style={{ background: "var(--rule)" }}
            >
              {g.items.map((s, i) => (
                <Reveal
                  key={s.slug}
                  i={i}
                  className={
                    g.items.length % 3 !== 0 && g.items.length % 2 === 1 && i === g.items.length - 1
                      ? "sm:col-span-2"
                      : undefined
                  }
                >
                  <li className="band group h-full" style={{ background: "var(--bg)" }}>
                    <Link href={servicePath("fr", s.slug)} className="flex h-full flex-col px-7 py-8">
                      <span className="ulink mb-2 text-[1.08rem] font-semibold">{s.title}</span>
                      <p className="line-clamp-4 text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                        {s.excerpt}
                      </p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <SiteFooter locale="fr" />
    </main>
  );
}
