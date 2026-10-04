import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import FounderPortrait from "@/components/FounderPortrait";
import HomeEvidence from "@/components/HomeEvidence";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";

// The Spanish homepage (docs/ES-REBUILD-PLAN.md). Its reader is a company
// in Valencia, serving the city or selling from it (owner, 3 Oct 2026:
// "focus on Valencia + keyword"), so the page owns "agencia SEO internacional
// Valencia" (owner, 4 Oct 2026: retarget away from the generic "agencia SEO
// Valencia", which okisam.com holds with a dedicated page and nothing
// multilingual; the English homepage owns "international SEO agency" the
// same way, and posicionamiento-multilingue keeps "SEO multilingüe Valencia").
// Every claim is one the English site already makes (over two decades, the
// BeTranslated network, media budget paid straight to the platform, month
// to month, a reply within a working day). Copy is a draft for the owner's
// review.
const PATH = "/es/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Agencia SEO internacional en Valencia, Mike Bastin",
    description:
      "Agencia SEO internacional en Valencia: te encuentran en castellano e inglés, en tu ciudad y en cada mercado donde vendes. Consulta gratuita.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

/** The markets a Valencia company most often sells into, each linked to its page. */
const MARKETS: { slug: string; market: string; line: string }[] = [
  { slug: "seo-frances", market: "Francia", line: "Un francés escrito para el comprador francés y para lo que busca en Google." },
  { slug: "seo-aleman", market: "Alemania", line: "Páginas pensadas para los compradores de habla alemana y para su forma de buscar." },
  { slug: "seo-neerlandes", market: "Países Bajos y Flandes", line: "Dos públicos de habla neerlandesa, dos maneras de buscar." },
  { slug: "seo-ingles", market: "Reino Unido", line: "El mercado anglófono más cercano, con sus propias palabras clave." },
];

const SERVICES_FOR: { slug: string; name: string; line: string }[] = [
  { slug: "optimizacion-seo", name: "Posicionamiento SEO", line: "Las búsquedas de tus clientes, investigadas una a una, y páginas que responden a cada una." },
  { slug: "seo-local", name: "SEO local", line: "Tu ficha de Google, tus reseñas y tus páginas por barrio, para salir entre los primeros del mapa." },
  { slug: "publicidad-multilingue", name: "Google Ads", line: "Tu presupuesto de medios va íntegro a tus anuncios, pagado directamente a Google, Microsoft o Meta; la gestión tiene una tarifa aparte." },
  { slug: "posicionamiento-multilingue", name: "SEO multilingüe", line: "Castellano, inglés y tus idiomas de exportación, cada uno con sus propias palabras clave." },
  { slug: "traduccion-profesional", name: "Traducción jurada", line: "Documentos para tribunales, embajadas y extranjería, en uno a siete días según el documento." },
  { slug: "consultoria-de-inteligencia-artificial", name: "Consultoría de IA", line: "Procesos que se automatizan y una empresa que aparece en las respuestas de ChatGPT, Claude y Gemini." },
];

const STEPS = [
  "Una consulta gratuita de treinta minutos, en nuestra oficina de Valencia o por videollamada, sobre tus clientes, tus idiomas y lo que ya has probado.",
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

      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,110px)] pt-[clamp(96px,14vw,170px)]">
        <div className="shell relative grid items-center gap-x-10 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">SEO, Google Ads y traducción en Valencia</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.4rem)] font-semibold leading-[1.05]">
              Agencia SEO internacional en Valencia que convierte búsquedas en clientes
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[40ch] text-[clamp(1.25rem,2.2vw,1.8rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Te encuentran en castellano y en inglés, en tu ciudad y en cada mercado donde vendes.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.65vw,1.24rem)]" style={{ color: "var(--dim)" }}>
              Somos una agencia de Valencia con más de dos décadas en posicionamiento web. Investigamos lo que escriben tus clientes, escribimos tus páginas con redactores nativos y contamos los resultados en consultas recibidas. Nos vemos en nuestra oficina de la calle Rugat o por videollamada.
            </p>
          </Reveal>
          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-6">
              <ButtonLink href="/es/contactanos/" size="lg">
                Hablemos de tu proyecto
              </ButtonLink>
              <Link href="/es/services/" className="ulink text-[.98rem]">
                Ver nuestros servicios
              </Link>
            </div>
          </Reveal>
        </div>
        <FounderPortrait
          alt="Mike Bastin, director de nuestra agencia de SEO multilingüe y localización."
          caption="Mike Bastin, director de la agencia · Valencia."
        />
        </div>
      </section>

      {/* ============ CLIENT EVIDENCE ============ */}
      {/* Declaudify brief (owner, 3 Oct 2026): dated figures and three cases
          straight after the hero, in place of all eight spreads. */}
      <HomeEvidence locale="es" />

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Lo que hacemos por las empresas de Valencia</h2>
            <p className="mb-10 max-w-[58ch]" style={{ color: "var(--dim)" }}>
              Seis servicios, coordinados por el mismo equipo y medidos por las consultas que te llegan.
            </p>
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
              Para ver cómo te encuentran hoy tus clientes de barrio, empieza por nuestra{" "}
              <Link href="/es/posicionamiento-web-valencia/" className="ulink">
                guía de posicionamiento web en Valencia
              </Link>
              , o{" "}
              <Link href={leadGenPath("es")} className="ulink">
                descubre nuestra generación de leads B2B
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ MARKETS ============ */}
      {markets.length > 0 && (
        <section className="band band-a py-[clamp(56px,8vw,104px)]">
          <div className="shell">
            <Reveal>
              <h2 className="mb-3 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Desde Valencia, tu próximo mercado</h2>
              <p className="mb-10 max-w-[58ch]" style={{ color: "var(--dim)" }}>
                Muchas empresas valencianas ya venden fuera. Cada país busca con sus propias palabras, y escribimos tus páginas a partir de ellas.
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
