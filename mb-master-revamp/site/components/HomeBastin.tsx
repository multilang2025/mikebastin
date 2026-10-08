import Reveal from "@/components/Reveal";
import Link from "next/link";
import BastinIdeasGraphic from "@/components/BastinIdeasGraphic";
import Counter from "@/components/Counter";
import { HOME_GRAPHICS } from "@/lib/home-graphics";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { leadGenPath } from "@/lib/lead-gen-hubs";

/**
 * The BASTIN section and the credibility strip for the French and Spanish
 * homepages (owner, 7 Oct 2026: replicate the English design and wording on
 * FR and ES). Same six letters and the same stats as app/page.tsx, adapted
 * rather than translated word for word. A letter links to the service page
 * in this language when one is live, and stands as plain text when not.
 */
type Row = { letter: string; word: string; desc: string; slug: string | "lead" | null };

const T = {
  fr: {
    eyebrow: "Ce que le nom veut dire",
    heading: "BASTIN, en six idées.",
    rows: [
      { letter: "B", word: "Business", desc: "Chaque projet de recherche part de vos objectifs commerciaux, pour obtenir le budget qu’il lui faut.", slug: "lead" },
      { letter: "A", word: "Automatisation", desc: "L’IA rédige, teste et rend compte, pour que le travail avance sans cesse.", slug: "conseil-ia" },
      { letter: "S", word: "SEO", desc: "Un référencement multilingue, conçu pour se positionner dans la langue que l’acheteur emploie vraiment pour chercher.", slug: "referencement-multilingue" },
      { letter: "T", word: "Traduction", desc: "Des textes adaptés au marché qui les lit.", slug: "traduction-professionnelle" },
      { letter: "I", word: "Internationalisation", desc: "Le travail de fond fait avant le lancement, pour qu’un produit accueille une seconde langue sur la base qu’il a déjà.", slug: "localisation-applications" },
      { letter: "N", word: "Networking", desc: "Plus de deux décennies de recommandations, en quatre langues, toujours le canal qui fonctionne.", slug: null },
    ] as Row[],
    stats: [
      { n: 20, s: "+", k: "Ans dans la recherche" },
      { n: 5, s: "+3", k: "Langues parlées" },
      { n: 8, s: "", k: "Projets au portefeuille" },
      { n: 9, s: "", k: "Sites nationaux de BeTranslated" },
    ],
  },
  es: {
    eyebrow: "Lo que significa el nombre",
    heading: "BASTIN, en seis ideas.",
    rows: [
      { letter: "B", word: "Business", desc: "Cada proyecto de búsqueda parte de tus objetivos de negocio, para conseguir el presupuesto que necesita.", slug: "lead" },
      { letter: "A", word: "Automatización", desc: "La IA redacta, prueba e informa, y el trabajo no se detiene.", slug: "consultoria-de-inteligencia-artificial" },
      { letter: "S", word: "SEO", desc: "SEO multilingüe, pensado para posicionar tus páginas en el idioma en el que el comprador realmente busca.", slug: "posicionamiento-multilingue" },
      { letter: "T", word: "Traducción", desc: "Textos adaptados al mercado que los lee.", slug: "traduccion-profesional" },
      { letter: "I", word: "Internacionalización", desc: "El trabajo de base hecho antes del lanzamiento, para que un producto admita un segundo idioma sobre la estructura que ya tiene.", slug: "localizacion-de-aplicaciones" },
      { letter: "N", word: "Networking", desc: "Más de dos décadas de recomendaciones, en cuatro idiomas, todavía el canal que funciona.", slug: null },
    ] as Row[],
    stats: [
      { n: 20, s: "+", k: "Años en buscadores" },
      { n: 5, s: "+3", k: "Idiomas hablados" },
      { n: 8, s: "", k: "Proyectos en cartera" },
      { n: 9, s: "", k: "Sitios nacionales de BeTranslated" },
    ],
  },
} as const;

export function HomeBastin({ locale, band }: { locale: "fr" | "es"; band: "a" | "b" }) {
  const t = T[locale];
  const live = new Set(getServicesForLocale(locale).map((s) => s.slug));
  const hrefFor = (slug: Row["slug"]) =>
    slug === "lead" ? leadGenPath(locale) : slug && live.has(slug) ? servicePath(locale, slug) : null;
  const trail = HOME_GRAPHICS.bastinTrail;
  return (
    <section className={`band band-${band} py-[clamp(48px,6vw,80px)]`}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-2">{t.eyebrow}</p>
          <h2 className="mb-8 max-w-[24ch] text-[clamp(1.45rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
            {t.heading}
          </h2>
        </Reveal>
        <div className="relative">
          {trail && <BastinIdeasGraphic />}
          <div className={`flex flex-col${trail ? " pr-14 sm:pl-14 sm:pr-20" : ""}`} style={{ borderTop: "1px solid var(--rule)" }}>
            {t.rows.map((row, i) => {
              const href = hrefFor(row.slug);
              // Same row as the English homepage (owner, 8 Oct 2026:
              // "Reproduis le design du site EN"): the initial is the word's
              // own first letter in cherry, one fluid size for every word, so
              // the six words line up instead of shifting with each letter's
              // width. data-bastin-letter is what the trail graphic measures.
              const body = (
                <span className="flex min-w-0 flex-col gap-2">
                  <span
                    className={`display text-[clamp(1.15rem,5.8vw,2.1rem)] font-semibold leading-none${
                      href ? " transition-colors duration-300 group-hover:text-[var(--berry)]" : ""
                    }`}
                  >
                    <span data-bastin-letter style={{ color: "var(--berry)" }}>
                      {row.word.charAt(0)}
                    </span>
                    {row.word.slice(1)}
                  </span>
                  <span data-bastin-copy className="max-w-[56ch] text-[.95rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {row.desc}
                  </span>
                </span>
              );
              const rowClass = "block py-6";
              const rowStyle = { borderBottom: "1px solid var(--rule)" };
              return (
                <Reveal key={row.letter} i={i}>
                  {href ? (
                    <Link href={href} className={`${rowClass} group`} style={rowStyle}>
                      {body}
                    </Link>
                  ) : (
                    <div className={rowClass} style={rowStyle}>
                      {body}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeCredibility({ locale, band }: { locale: "fr" | "es"; band: "a" | "b" }) {
  const t = T[locale];
  return (
    <section className={`band band-${band} py-[clamp(56px,8vw,110px)]`}>
      <div className="shell">
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4" style={{ background: "var(--rule)" }}>
          {t.stats.map((s, i) => (
            <div key={s.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
              <Reveal i={i}>
                <div className="display text-[clamp(2.1rem,4.4vw,3.1rem)] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                  <Counter to={s.n} suffix={s.s} />
                </div>
                <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                  {s.k}
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
