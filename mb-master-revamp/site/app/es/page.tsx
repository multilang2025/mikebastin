import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import MarketReach from "@/components/MarketReach";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// The Spanish homepage (docs/ES-REBUILD-PLAN.md). Its reader is a
// Spanish-speaking company selling abroad: the reverse of the English
// "Spanish SEO" page. Every claim is one the English site already makes
// (over two decades, the BeTranslated network, media budget paid straight
// to the platform, month to month, a reply within a working day). Copy is
// a draft for the owner's review.
const PATH = "/es/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Agencia SEO internacional, Mike Bastin",
    description:
      "Tus páginas en español ya venden. Hacemos que vendan también tus otros idiomas, con textos de nativos y consultas contadas por país. Consulta gratuita.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

/** The markets a Spanish exporter most often enters, each linked to its page. */
const MARKETS: { slug: string; market: string; line: string }[] = [
  { slug: "seo-frances", market: "Francia", line: "Un francés escrito para el comprador francés y para lo que busca en Google." },
  { slug: "seo-aleman", market: "Alemania", line: "Páginas pensadas para los compradores de habla alemana y para su forma de buscar." },
  { slug: "seo-neerlandes", market: "Países Bajos y Flandes", line: "Dos públicos de habla neerlandesa, dos maneras de buscar." },
  { slug: "seo-ingles", market: "Reino Unido", line: "El mercado anglófono más cercano, con sus propias palabras clave." },
];

const SERVICES_FOR: { slug: string; name: string; line: string }[] = [
  { slug: "posicionamiento-multilingue", name: "Posicionamiento multilingüe", line: "La estrategia por mercado y redactores nativos para cada idioma." },
  { slug: "traduccion-de-paginas-web", name: "Traducción de páginas web", line: "Precios, formularios y páginas que suenan locales en cada país." },
  { slug: "publicidad-multilingue", name: "Publicidad multilingüe", line: "Tu presupuesto de medios va íntegro a tus anuncios, pagado directamente a Google, Microsoft o Meta; la gestión tiene una tarifa aparte." },
];

const STEPS = [
  "Una consulta gratuita de treinta minutos sobre tus mercados, tus idiomas y lo que ya has probado.",
  "Un alcance por escrito para el primer trimestre: las páginas, las palabras clave y quién hace qué.",
  "Una entrega mensual, mercado por mercado, a cargo de redactores nativos de la red BeTranslated, con la que trabajamos desde hace veinte años.",
  "Consultas contadas idioma por idioma, para saber qué mercado da resultados.",
  "Un compromiso mes a mes, que cualquiera de las dos partes puede terminar con un aviso previo.",
];

export default function SpanishHome() {
  const live = new Set(getServicesForLocale("es").map((s) => s.slug));
  const markets = MARKETS.filter((m) => live.has(m.slug));
  const services = SERVICES_FOR.filter((s) => live.has(s.slug));

  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd data={breadcrumbSchema([{ name: "Inicio", url: `${SITE_URL}${PATH}` }])} />

      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,110px)] pt-[clamp(96px,14vw,170px)]">
        <div className="shell relative grid items-center gap-x-10 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Desde Valencia, para empresas que exportan</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.05]">
              Agencia SEO internacional para empresas que exportan
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[40ch] text-[clamp(1.25rem,2.2vw,1.8rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Tus páginas en español ya venden. Hacemos que vendan también tus otros idiomas.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Las visitas en tus otros idiomas ya existen. Convertirlas en consultas, mercado por mercado, es nuestro oficio desde hace más de dos décadas: palabras clave investigadas en cada país, páginas escritas por nativos y resultados contados en consultas.
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-6">
              <ButtonLink href="/es/contactanos/" size="lg">
                Reserva una consulta gratuita
              </ButtonLink>
              <Link href="/es/services/" className="ulink text-[.98rem]">
                Ver nuestros servicios
              </Link>
            </div>
          </Reveal>
        </div>
        <MarketReach />
        </div>
      </section>

      {/* ============ MARKETS ============ */}
      {markets.length > 0 && (
        <section className="band band-b py-[clamp(56px,8vw,104px)]">
          <div className="shell">
            <Reveal>
              <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">El próximo mercado en el que quieres vender</h2>
              <p className="mb-10 max-w-[58ch]" style={{ color: "var(--dim)" }}>
                Cada país busca con sus propias palabras, y escribimos tus páginas a partir de ellas.
              </p>
            </Reveal>
            <ul className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
              {markets.map((m, i) => (
                <Reveal key={m.slug} i={i}>
                  <li className="band h-full" style={{ background: "var(--bg)" }}>
                    <Link href={servicePath("es", m.slug)} className="flex h-full flex-col px-7 py-8">
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
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Lo que hacemos para cada mercado</h2>
          </Reveal>
          <ul className="grid gap-8 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} i={i}>
                <li>
                  <Link href={servicePath("es", s.slug)} className="ulink mb-2 inline-block text-[1.12rem] font-semibold">
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
              Los tres servicios se coordinan entre sí y se miden por las consultas que cada mercado te envía.{" "}
              <Link href={leadGenPath("es")} className="ulink">
                Ver nuestra generación de leads B2B
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
            <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Cómo trabajamos</h2>
            <p className="mt-4 max-w-[40ch]" style={{ color: "var(--dim)" }}>
              Dirigimos la estrategia nosotros mismos y respondemos a cada mensaje, por lo general en un día laborable.
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

      <SiteFooter locale="es" />
    </main>
  );
}
