import Link from "next/link";
import Reveal from "@/components/Reveal";
import Testimonials from "@/components/Testimonials";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";
import SearchResultsArt from "@/components/SearchResultsArt";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import { LEADS_PERIOD, PROJECTS } from "@/lib/projects";
import { PROJECTS_ES, PROJECTS_FR } from "@/lib/projects-locale";
import { caseStudyPath } from "@/lib/case-studies";
import { LEADS_HIGH, LEADS_LOW, MILLIONS, SITE_COUNT, TOTAL_CLICKS } from "@/lib/results-totals";

/**
 * The results page in English, French and Spanish (owner, 12 Oct 2026:
 * "translate the results page"). /results/, /fr/resultats/ and
 * /es/resultados/ all render this.
 *
 * Owner, 2 Oct 2026: the page carries the sites we run search for, as totals
 * from the live Search Console figures (lib/results-totals.ts, May to July
 * 2026), with a plain-language result per client and no client's own
 * numbers (owner, 5 Oct 2026). Rows follow the portfolio order rather than a
 * ranking by clicks, which would leak the same thing. Owned properties are
 * labelled as ours rather than passed off as clients.
 */
type Locale = "en" | "fr" | "es";

const OWNED = new Set(["valenciamove", "betranslated", "matosurf"]);
const WITH_SEARCH = PROJECTS.filter((p) => p.search);

/** Thousands and decimal separators per market (style guide): 58,157 · 58 157 · 58.157, 4.2 · 4,2. */
function fmt(n: number, locale: Locale, digits = 0) {
  const o = { minimumFractionDigits: digits, maximumFractionDigits: digits };
  if (locale === "fr") return n.toLocaleString("fr-FR", o).replace(/\s/g, " ");
  if (locale === "es") return n.toLocaleString("de-DE", o);
  return n.toLocaleString("en-GB", o);
}

const N = " ";

const T = {
  en: {
    home: { name: "Home", href: "/" },
    crumb: "Results",
    contact: "/contact/",
    eyebrow: "Results you can count",
    h1: "Client results you can check against the source",
    h2: "Live search figures from the sites we run, each one linked to the case study that explains the work behind it.",
    cta: "Book a free consultation",
    figuresEyebrow: "Monthly enquiries and three months of search",
    figuresHeading: (leads: string, clicks: string) => `${leads} enquiries a month and ${clicks} clicks from Google.`,
    lede: (sites: string, millions: string) =>
      `Across ${sites} sites we run search for, from a Valencia law firm working in four languages to a Dutch powder coating specialist, with ${millions} million impressions behind the clicks. Open any row for the brief, the work and the outcome.`,
    sources:
      `Sources: enquiries are a monthly average for ${LEADS_PERIOD}, counted from each site’s contact and quote form records, forms only. Where requests also arrive by phone or email, the site owner’s own figure or range applies. Clicks and impressions cover the same months, from Google Search Console.`,
    range: "to",
    words: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
    owned: ", our own site",
    reviewsEyebrow: "In their own words",
    reviewsHeading: "Clients review us in their own language.",
    reviewsLede: "Every one is public on the linked Google Business Profile, where it can be checked against the source.",
    result: {
      "delaguia-y-luzon": "Four languages and two jurisdictions held to a legal accuracy bar, with enquiries arriving through the site's own forms.",
      c21perdomo: "Four languages kept accurate against inventory that changes every week, with enquiries arriving through the listings site.",
      valenciamove: "Five languages live, every page written from first-hand experience of the move, and enquiries counted from the first month.",
      "tx-international-freight": "Present in the local pack for industrial freight search in Houston, with quote requests counted from the site's forms.",
      "bemelman-spuiterij": "Dutch local search built for a business that had traded on reputation alone for forty-five years, with requests now arriving by form, phone and email.",
    } as Record<string, string>,
  },
  fr: {
    home: { name: "Accueil", href: "/fr/" },
    crumb: "Résultats",
    contact: "/fr/nous-contacter/",
    eyebrow: "Des résultats qui se comptent",
    h1: "Des résultats clients vérifiables à la source",
    h2: "Les chiffres de recherche réels des sites que nous gérons, chacun relié à l’étude de cas qui explique le travail réalisé.",
    cta: "Réserver une consultation gratuite",
    figuresEyebrow: "Demandes mensuelles et trois mois de recherche",
    figuresHeading: (leads: string, clicks: string) => `${leads} demandes par mois et ${clicks} clics depuis Google.`,
    lede: (sites: string, millions: string) =>
      `Sur les ${sites} sites dont nous gérons le référencement, d’un cabinet d’avocats de Valencia qui travaille en quatre langues à un spécialiste néerlandais du thermolaquage, avec ${millions}${N}millions d’impressions qui mènent aux clics. Cliquez sur une ligne pour lire la demande, le travail et le résultat.`,
    sources: `Sources${N}: les demandes sont une moyenne mensuelle de mai à juillet 2026, comptée d’après les formulaires de contact et de devis de chaque site, formulaires seulement. Quand des demandes arrivent aussi par téléphone ou par e-mail, c’est le chiffre ou la fourchette du propriétaire du site qui s’applique. Les clics et les impressions couvrent les mêmes mois, d’après Google Search Console.`,
    range: "à",
    words: ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"],
    owned: ", notre propre site",
    reviewsEyebrow: "Dans leurs mots",
    reviewsHeading: "Nos clients nous évaluent dans leur propre langue.",
    reviewsLede: "Chaque avis est public sur notre fiche Google, où vous pouvez le vérifier directement.",
    result: {
      "delaguia-y-luzon": "Quatre langues et deux juridictions traitées avec l’exactitude juridique requise, avec des demandes qui arrivent par les formulaires du site.",
      c21perdomo: "Quatre langues tenues à jour face à un stock qui change chaque semaine, avec des demandes qui arrivent par le site d’annonces.",
      valenciamove: "Cinq langues en ligne, chaque page écrite à partir d’une installation réelle, et des demandes comptées dès le premier mois.",
      "tx-international-freight": "Une présence dans le pack local de Houston sur les recherches de fret industriel, avec des demandes de devis comptées à partir des formulaires du site.",
      "bemelman-spuiterij": "Une recherche locale néerlandaise construite pour une entreprise qui avait vécu de sa seule réputation pendant quarante-cinq ans, avec des demandes qui arrivent désormais par formulaire, téléphone et e-mail.",
    } as Record<string, string>,
  },
  es: {
    home: { name: "Inicio", href: "/es/" },
    crumb: "Resultados",
    contact: "/es/contactanos/",
    eyebrow: "Resultados que se pueden contar",
    h1: "Resultados de clientes que puedes comprobar en la fuente",
    h2: "Cifras de búsqueda reales de las webs que gestionamos, cada una enlazada al caso de éxito que explica el trabajo que hay detrás.",
    cta: "Reserva una consulta gratuita",
    figuresEyebrow: "Consultas mensuales y tres meses de búsqueda",
    figuresHeading: (leads: string, clicks: string) => `${leads} consultas al mes y ${clicks} clics desde Google.`,
    lede: (sites: string, millions: string) =>
      `En las ${sites} webs cuyo posicionamiento llevamos, desde un despacho de abogados de Valencia que trabaja en cuatro idiomas hasta un especialista neerlandés en pintura en polvo, con ${millions} millones de impresiones detrás de los clics. Abre cualquier fila para ver el encargo, el trabajo y el resultado.`,
    sources:
      "Fuentes: las consultas son una media mensual de mayo a julio de 2026, calculada a partir de los registros de formularios de contacto y presupuesto de cada web, solo formularios. Cuando también llegan solicitudes por teléfono o correo, se usa la cifra o el rango que indica el propietario de la web. Los clics y las impresiones cubren los mismos meses, según Google Search Console.",
    range: "a",
    words: ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"],
    owned: ", nuestra propia web",
    reviewsEyebrow: "En sus propias palabras",
    reviewsHeading: "Nuestros clientes nos valoran en su propio idioma.",
    reviewsLede: "Todas las reseñas son públicas en nuestro perfil de Google, donde puedes comprobarlas en la fuente.",
    result: {
      "delaguia-y-luzon": "Cuatro idiomas y dos jurisdicciones con el nivel de precisión que exige el derecho, y consultas que llegan por los formularios de la propia web.",
      c21perdomo: "Cuatro idiomas sin errores frente a una cartera que cambia cada semana, y consultas que llegan por la web inmobiliaria.",
      valenciamove: "Cinco idiomas publicados, cada página escrita desde la experiencia propia de la mudanza, y consultas contadas desde el primer mes.",
      "tx-international-freight": "Presencia en el pack local de Houston en las búsquedas de carga industrial, con solicitudes de presupuesto contabilizadas a partir de los formularios de la web.",
      "bemelman-spuiterij": "Búsqueda local neerlandesa diseñada para una empresa que había vivido solo de su reputación durante cuarenta y cinco años, y solicitudes que ahora llegan por formulario, teléfono y correo.",
    } as Record<string, string>,
  },
} as const;

export function resultsFigures(locale: Locale) {
  const t = T[locale];
  const leads = LEADS_LOW === LEADS_HIGH ? fmt(LEADS_LOW, locale) : `${fmt(LEADS_LOW, locale)} ${t.range} ${fmt(LEADS_HIGH, locale)}`;
  return { leads, clicks: fmt(TOTAL_CLICKS, locale) };
}

export default function ResultsView({ locale, path }: { locale: Locale; path: string }) {
  const t = T[locale];
  const { leads, clicks } = resultsFigures(locale);
  const millions = fmt(MILLIONS, locale, 1);
  const sites = t.words[SITE_COUNT] ?? String(SITE_COUNT);
  const card = locale === "fr" ? PROJECTS_FR : locale === "es" ? PROJECTS_ES : null;

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: t.home.name, url: `${SITE_URL}${t.home.href}` }, { name: t.crumb, url: `${SITE_URL}${path}` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="eyebrow mb-8">{t.eyebrow}</p>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mb-6 max-w-[18ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">{t.h1}</h1>
            </Reveal>
            <div className="mx-auto mb-6 w-[150px] lg:hidden">
              <DlArt name="clock" />
            </div>
            <Reveal i={2}>
              <h2 className="mb-8 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
                {t.h2}
              </h2>
            </Reveal>
            <Reveal i={3}>
              <Link href={t.contact} className="btn btn-primary btn-lg">
                {t.cta}
              </Link>
            </Reveal>
          </div>
          <HeroArtSlot visibleOnMobile={false}>
            <DlArt name="clock" />
          </HeroArtSlot>
        </div>
      </section>

      {/* ============ THE FIGURES ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <div className="mb-12 grid items-center gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal>
            <p className="eyebrow mb-3">{t.figuresEyebrow}</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">{t.figuresHeading(leads, clicks)}</h2>
            <p className="max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              {t.lede(sites, millions)}
            </p>
          </Reveal>
          <Reveal i={1}>
            <SearchResultsArt className="mx-auto w-[min(220px,60vw)] lg:w-[min(300px,24vw)]" />
          </Reveal>
          </div>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--rule)" }}>
            {WITH_SEARCH.map((p, i) => (
              <Reveal key={p.slug} i={i}>
                <Link
                  href={caseStudyPath(locale, p.slug)}
                  className="result-row group -mx-4 grid gap-x-8 gap-y-2 px-4 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-baseline"
                  style={{ borderBottom: "1px solid var(--rule)" }}
                >
                  <span className="flex flex-col gap-1">
                    <span className="display text-[1.15rem] font-semibold transition-colors duration-300 group-hover:text-[var(--berry)]">
                      {p.name}
                    </span>
                    <span className="text-[.88rem]" style={{ color: "var(--dim)" }}>
                      {card?.[p.slug]?.angle ?? p.angle}
                      {OWNED.has(p.slug) ? t.owned : ""}
                    </span>
                  </span>
                  <span className="text-[1rem] leading-[1.5]">{t.result[p.slug] ?? p.outcome}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <blockquote className="mt-8 max-w-[56ch] text-[.85rem]" style={{ color: "var(--dim)" }}>
            {t.sources}
          </blockquote>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">{t.reviewsEyebrow}</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">{t.reviewsHeading}</h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              {t.reviewsLede}
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials locale={locale} mobileHideCount={2} />
          </Reveal>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter locale={locale} band="b" />
    </main>
  );
}
