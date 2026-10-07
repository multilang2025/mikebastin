import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PROJECTS, SHOT_VERSION } from "@/lib/projects";
import { PROJECTS_ES, PROJECTS_FR } from "@/lib/projects-locale";
import { CASE_SLUGS } from "@/lib/home-evidence";
import { BT_SITES } from "@/lib/betranslated-sites";
import { LEADS_HIGH, LEADS_LOW, MILLIONS, TOTAL_CLICKS } from "@/lib/results-totals";

const T = {
  en: {
    eyebrow: "Client results",
    heading: "Sites we run, measured in Google Search Console.",
    leads: "enquiries a month, on average",
    clicks: "clicks from Google",
    impressions: "million Google impressions",
    range: "to",
    source: "Totals across the sites we run search for, May to July 2026: enquiries are counted from each site’s form records, or given by the site owner where they also arrive by phone and email; clicks and impressions come from Google Search Console.",
    all: { href: "/results/", label: "See the results across our client sites" },
    sitesEyebrow: "BeTranslated country sites",
    sitesHeading: "BeTranslated, in every market it serves.",
    sitesLede: "Nine country sites, each written for its own market and language.",
    siteAlt: (market: string, domain: string) => `The BeTranslated site for ${market}, ${domain}, on desktop and mobile`,
  },
  fr: {
    eyebrow: "Résultats clients",
    heading: "Des sites que nous gérons, mesurés dans Google Search Console.",
    leads: "demandes par mois, en moyenne",
    clicks: "clics depuis Google",
    impressions: "millions d’impressions Google",
    range: "à",
    source: "Totaux sur les sites dont nous gérons le référencement, de mai à juillet 2026\u00a0: les demandes sont comptées d’après les formulaires de chaque site, ou données par son propriétaire quand elles arrivent aussi par téléphone et par e-mail\u00a0; les clics et les impressions viennent de Google Search Console.",
    all: null,
    sitesEyebrow: "Sites pays de BeTranslated",
    sitesHeading: "BeTranslated, dans chaque marché où l’agence travaille.",
    sitesLede: "Neuf sites pays, chacun écrit pour son marché et sa langue.",
    siteAlt: (market: string, domain: string) => `Le site BeTranslated pour ${market}, ${domain}, sur ordinateur et sur mobile`,
  },
  es: {
    eyebrow: "Resultados de clientes",
    heading: "Webs que gestionamos, medidas en Google Search Console.",
    leads: "consultas al mes, de media",
    clicks: "clics desde Google",
    impressions: "millones de impresiones en Google",
    range: "a",
    source: "Totales de las webs cuyo posicionamiento llevamos, de mayo a julio de 2026: las consultas se cuentan a partir de los formularios de cada web, o las da su propietario cuando también llegan por teléfono y correo; los clics y las impresiones vienen de Google Search Console.",
    all: null,
    sitesEyebrow: "Sitios nacionales de BeTranslated",
    sitesHeading: "BeTranslated, en cada mercado donde trabaja la agencia.",
    sitesLede: "Nueve sitios nacionales, cada uno escrito para su mercado y su idioma.",
    siteAlt: (market: string, domain: string) => `El sitio de BeTranslated para ${market}, ${domain}, en ordenador y en móvil`,
  },
} as const;

/** Thousands and decimal separators per market (style guide): 58,157 · 58 157 · 58.157, 4.2 · 4,2. */
function formatCount(n: number, locale: "en" | "fr" | "es", digits = 0) {
  const o = { minimumFractionDigits: digits, maximumFractionDigits: digits };
  if (locale === "fr") return n.toLocaleString("fr-FR", o).replace(/\s/g, "\u00a0");
  if (locale === "es") return n.toLocaleString("de-DE", o);
  return n.toLocaleString("en-GB", o);
}

/**
 * The evidence block every homepage carries straight after the hero
 * (declaudify brief, owner, 3 Oct 2026): three dated Search Console figures,
 * then three compact case cards, instead of full spreads.
 */
export default function HomeEvidence({ locale = "en", band = "b" }: { locale?: "en" | "fr" | "es"; band?: "a" | "b" }) {
  const t = T[locale];
  const copy = locale === "fr" ? PROJECTS_FR : locale === "es" ? PROJECTS_ES : null;
  const totals = [
    { v: `${formatCount(LEADS_LOW, locale)} ${t.range} ${formatCount(LEADS_HIGH, locale)}`, k: t.leads },
    { v: formatCount(TOTAL_CLICKS, locale), k: t.clicks },
    { v: formatCount(MILLIONS, locale, 1), k: t.impressions },
  ];
  const cases = CASE_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  return (
    <section id="work" className={`band band-${band} py-[clamp(64px,9vw,120px)]`}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h2 className="mb-8 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.7rem)] font-semibold leading-[1.1]">{t.heading}</h2>
        </Reveal>
        <Reveal i={1}>
          <dl className="mb-4 grid gap-6 sm:grid-cols-3">
            {totals.map((e) => (
              <div key={e.k} className="border-t pt-4" style={{ borderColor: "var(--rule)" }}>
                <dd className="display text-[clamp(1.8rem,3.2vw,2.4rem)] font-semibold leading-none" style={{ color: "var(--ink)" }}>
                  {e.v}
                </dd>
                <dt className="mt-2 text-[.85rem]" style={{ color: "var(--dim)" }}>
                  {e.k}
                </dt>
              </div>
            ))}
          </dl>
          <p className="mb-12 text-[.8rem]" style={{ color: "var(--dim)" }}>
            {t.source}
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-6">
          {cases.map((p, i) => {
            const localized = copy?.[p.slug];
            return (
              <Reveal key={p.domain} i={i} className={i < 3 ? "md:col-span-2" : "md:col-span-3"}>
                <article
                  className="flex h-full flex-col overflow-hidden rounded-md border"
                  style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.shot ? (
                      <Image
                        src={p.shot.replace(".webp", "-800.webp")}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        width={800}
                        height={640}
                        alt={localized?.alt ?? `The ${p.name} website on desktop and mobile`}
                        loading="lazy"
                        unoptimized
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="grid h-full place-items-center" style={{ background: "var(--deep)", color: "var(--bg)" }}>
                        {p.domain}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="eyebrow mb-2">{localized?.angle ?? p.angle}</p>
                    <h3 className="mb-3 text-[1.25rem] font-semibold leading-[1.15]" style={{ color: "var(--berry)" }}>
                      {localized ? (
                        p.name
                      ) : (
                        <Link href={`/projects/${p.slug}/`} className="transition-colors hover:opacity-75">
                          {p.name}
                        </Link>
                      )}
                    </h3>
                    <p className="mb-5 text-[.88rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                      {localized?.body ?? p.body}
                    </p>
                    <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t pt-4" style={{ borderColor: "var(--rule)" }}>
                      {(localized?.metrics ?? p.metrics).slice(0, 2).map((metric) => (
                        <div key={metric.k}>
                          <dt className="display text-[1.15rem] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                            {metric.v}
                          </dt>
                          <dd className="mt-1 text-[.65rem] uppercase tracking-[.08em]" style={{ color: "var(--dim)" }}>
                            {metric.k}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {!localized && (
                      <Link href={`/projects/${p.slug}/`} className="ulink mt-4 inline-block text-[.85rem] font-medium" style={{ color: "var(--berry)" }}>
                        Read the case study
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <p className="eyebrow mb-3 mt-16">{t.sitesEyebrow}</p>
          <h3 className="mb-3 max-w-[30ch] text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.15]">{t.sitesHeading}</h3>
          <p className="mb-8 max-w-[56ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
            {t.sitesLede}
          </p>
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {BT_SITES.map((s, i) => {
            const domain = `betranslated.${s.tld}`;
            return (
              <Reveal key={s.tld} i={i}>
                <li className="h-full">
                  <a
                    href={s.href ?? `https://${domain}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col overflow-hidden rounded-md border transition-colors duration-200 hover:border-[var(--berry)]"
                    style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
                  >
                    <Image
                      src={`/work/${s.image}-800.webp?v=${SHOT_VERSION}`}
                      width={800}
                      height={640}
                      alt={t.siteAlt(s.market[locale], domain)}
                      loading="lazy"
                      unoptimized
                      className="aspect-[5/4] w-full object-cover object-top"
                    />
                    <span className="flex items-baseline justify-between gap-2 px-3 py-2.5">
                      <span className="text-[.88rem] font-semibold transition-colors duration-200 group-hover:text-[var(--berry)]">{domain}</span>
                      <span className="text-[.76rem]" style={{ color: "var(--dim)" }}>{s.market[locale]}</span>
                    </span>
                  </a>
                </li>
              </Reveal>
            );
          })}
        </ul>
        {t.all && (
          <Reveal>
            <Link href={t.all.href} className="ulink mt-10 inline-block text-[1rem]">
              {t.all.label}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
