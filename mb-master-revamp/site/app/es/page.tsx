import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import FounderPortrait from "@/components/FounderPortrait";
import HomeEvidence from "@/components/HomeEvidence";
import Testimonials from "@/components/Testimonials";
import HomeWhy from "@/components/HomeWhy";
import { HomeBastin, HomeCredibility } from "@/components/HomeBastin";
import ValenciaMarketGraphic from "@/components/ValenciaMarketGraphic";
import SiteFooter from "@/components/SiteFooter";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";

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
  { slug: "seo-frances", market: "Francia", line: "Un francés escrito para el comprador francés y adaptado a lo que busca en Google." },
  { slug: "seo-aleman", market: "Alemania", line: "Páginas pensadas para los compradores de habla alemana y para su forma de buscar." },
  { slug: "seo-neerlandes", market: "Países Bajos y Flandes", line: "Dos públicos de habla neerlandesa, dos maneras de buscar." },
  { slug: "seo-ingles", market: "Reino Unido", line: "El mercado anglófono más cercano, con sus propias palabras clave." },
];

const SERVICES_FOR: { slug: string; name: string; line: string }[] = [
  { slug: "optimizacion-seo", name: "Optimización SEO", line: "Las búsquedas de tus clientes, investigadas una a una, y páginas que responden a cada una." },
  { slug: "seo-local", name: "SEO local", line: "Tu ficha de Google, tus reseñas y tus páginas por barrio, para aparecer entre los primeros resultados del mapa." },
  { slug: "publicidad-multilingue", name: "Publicidad online", line: "Tu presupuesto de medios va íntegro a tus anuncios, pagado directamente a Google, Microsoft o Meta; la gestión tiene una tarifa aparte." },
  { slug: "posicionamiento-multilingue", name: "SEO multilingüe", line: "Castellano, inglés y tus idiomas de exportación, cada uno con sus propias palabras clave." },
  { slug: "traduccion-profesional", name: "Traducción jurada", line: "Documentos para tribunales, embajadas y extranjería, entre uno y siete días según el documento." },
  { slug: "consultoria-de-inteligencia-artificial", name: "Consultoría de IA", line: "Procesos automatizados y una empresa que aparece en las respuestas de ChatGPT, Claude y Gemini." },
];

const STEPS = [
  "Una consulta gratuita de treinta minutos, en nuestra oficina de Valencia o por videollamada, sobre tus clientes, tus idiomas y lo que ya has probado.",
  "Un alcance por escrito para el primer trimestre: las páginas, las palabras clave y quién hace qué.",
  "Una entrega mensual, mercado por mercado, a cargo de redactores nativos de la red BeTranslated, con la que trabajamos desde hace veinte años.",
  "Consultas contadas idioma por idioma, para saber qué mercado da resultados.",
  "Un compromiso mes a mes, que cualquiera de las dos partes puede terminar con un aviso previo.",
];

const HOW_IT_WORKS = [
  {
    title: "Auditamos tu situación",
    body: "Revisamos tu web, tu visibilidad en buscadores y las versiones que ya tienes en otros idiomas para identificar el trabajo técnico y de contenido que puede generar más contactos.",
  },
  {
    title: "Planificamos cada mercado",
    body: "Recibes un plan de trabajo por escrito para los mercados que quieres desarrollar, con las prioridades, las entregas y las responsabilidades acordadas antes de empezar.",
  },
  {
    title: "Informamos cada mes, idioma por idioma",
    body: "Avanzamos mercado por mercado y cada mes informamos del tráfico y los contactos de cada idioma para que veas qué está dando resultados.",
  },
];

export default function SpanishHome() {
  const live = new Set(getServicesForLocale("es").map((s) => s.slug));
  const markets = MARKETS.filter((m) => live.has(m.slug));
  const services = SERVICES_FOR.filter((s) => live.has(s.slug));

  return (
    <main>
      <LocaleHtmlLang lang="es" />

      {/* ============ HERO ============ */}
      {/* Igual que en la homepage en inglés: mensaje claro, persona que lidera la
          estrategia y un único CTA principal. */}
      <section className="band band-b grain relative overflow-hidden pb-[clamp(48px,6vw,88px)] pt-[clamp(52px,7vw,104px)]">
        <div className="shell relative grid items-center gap-x-14 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-5">Agencia de SEO y localización multilingüe</p>
          </Reveal>

          <Reveal i={1}>
            <h1 className="mb-5 max-w-[22ch] text-[clamp(2.1rem,5.2vw,4rem)] font-semibold leading-[1.08]">
              Agencia SEO internacional, dirigida por Mike Bastin
            </h1>
          </Reveal>

          <Reveal i={2}>
            <h2 className="mb-5 max-w-[34ch] text-[clamp(1.15rem,2.1vw,1.6rem)] font-medium leading-[1.3]">
              Ayudamos a empresas a captar clientes en varios idiomas con SEO internacional, contenido nativo y localización web.
            </h2>
          </Reveal>

          <Reveal i={3}>
            <p
              className="mb-8 max-w-[56ch] text-[clamp(1.02rem,1.4vw,1.14rem)] leading-[1.6]"
              style={{ color: "color-mix(in srgb, var(--dim) 65%, var(--ink))" }}
            >
              Mike dirige la estrategia y un equipo de especialistas nativos cuida
              los detalles de cada mercado y cada idioma. Nuestros informes separan
              el rendimiento por país e idioma.
            </p>
          </Reveal>

          <Reveal i={4}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink href="/es/contactanos/" size="lg">
                Reserva una consulta gratuita
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
      <HomeEvidence locale="es" band="a" />

      {/* ============ WHAT WE DO ============ */}
      <section className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Lo que hacemos</p>
            <h2 className="mb-5 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Desde la auditoría de mercado hasta el informe mensual.
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
              Auditamos tu presencia actual, acordamos un plan para cada mercado y
              luego informamos del progreso por idioma cada mes. Según
              tus objetivos, elige los servicios que encajan con tus planes de crecimiento.
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
            <p className="eyebrow mb-3 mt-12">Cómo lo hacemos</p>
          </Reveal>

          <ol className="grid gap-px md:grid-cols-3" style={{ background: "var(--rule)" }}>
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} i={i}>
                <li className="band h-full px-7 py-7" style={{ background: "var(--bg)" }}>
                  <p className="display mb-5 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="display mb-3 text-[1.15rem] font-semibold leading-[1.25]">
                    {step.title}
                  </h3>
                  <p className="text-[.92rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {step.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal i={3}>
            <p className="mt-8 text-[.95rem]" style={{ color: "var(--dim)" }}>
              <Link href="/es/precios/" className="ulink" style={{ color: "var(--berry)" }}>
                Descubre cómo definimos el plan de trabajo y los honorarios
              </Link>
              {", y qué ocurre desde la primera llamada hasta los informes mensuales."}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ MARKETS ============ */}
      {markets.length > 0 && (
        <section className="band band-a py-[clamp(56px,8vw,104px)]">
          <div className="shell grid items-center gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
            <div>
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
            <Reveal i={1}>
              <ValenciaMarketGraphic />
            </Reveal>
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

      <HomeWhy locale="es" band="a" />

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="band band-b py-[clamp(64px,9vw,128px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">En sus propias palabras</p>
            <h2 className="mb-5 max-w-[20ch] text-[clamp(1.8rem,3.6vw,2.9rem)] font-semibold leading-[1.1]">
              Nuestros clientes nos recomiendan en su idioma.
            </h2>
            <p className="mb-10 max-w-[56ch] text-[1.05rem]" style={{ color: "var(--dim)" }}>
              Reseñas en neerlandés, español, francés e inglés. Aquí puedes leerlas en español o consultar
              cada reseña en su idioma original.
            </p>
          </Reveal>
          <Reveal i={1}>
            <Testimonials locale="es" initialCount={4} />
          </Reveal>
        </div>
      </section>

      <HomeBastin locale="es" band="a" />

      <HomeCredibility locale="es" band="b" />

      <SiteFooter locale="es" band="a" />
    </main>
  );
}
