import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { esLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// Spanish sibling of /how-i-work/, at the legacy /es/precios/ URL (content-map
// g048, action "reposition"). Same owner decision as the English page: no
// public rates, the engagement shape instead. Every answer is the English
// page's own, adapted. The billing answer keeps both halves (CLAUDE.md:
// the media budget goes straight to Google, Microsoft or Meta with
// management as a separate fee; translation is priced as work). Copy is a draft for the owner's review.
const PATH = "/es/precios/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Precios y desarrollo de un proyecto de SEO, Mike Bastin",
    description:
      "Cómo se desarrolla un proyecto de SEO internacional, localización o consultoría de IA: primera conversación, alcance escrito, entregas mensuales y facturación.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

const STAGES = [
  {
    name: "Una primera conversación",
    detail:
      "Treinta minutos sobre los mercados y los idiomas que cuentan, lo que ya posiciona, lo que ya se ha probado y lo que supone un buen resultado en consultas de clientes. Primero hacemos nuestras preguntas y después recomendamos.",
  },
  {
    name: "Un alcance por escrito para tus mercados",
    detail:
      "Un documento breve que nombra las páginas, las palabras clave y los entregables del primer trimestre, y quién hace cada cosa. Un sitio en cinco idiomas y uno en dos son proyectos distintos, por eso construimos el alcance para tu caso.",
  },
  {
    name: "Primero la investigación, después la redacción",
    detail:
      "Investigamos palabras clave y competidores en cada mercado antes de construir una página o escribir un artículo. La investigación encuentra los términos que pesan en cada idioma, porque un término fuerte en español cambia a menudo de peso una vez traducido.",
  },
  {
    name: "Entregas a ritmo fijo",
    detail:
      "El trabajo avanza cada mes, mercado por mercado, de modo que una página alemana avanza en paralelo a una francesa. Redactores nativos para cada idioma, cuyo trabajo revisamos con el briefing antes de publicar.",
  },
  {
    name: "Informes mercado por mercado",
    detail:
      "Cifras mensuales para cada idioma, que muestran qué mercado convierte y cuál aporta sobre todo tráfico.",
  },
  {
    name: "Una opinión sincera sobre cada mercado",
    detail:
      "Cuando un mercado se estanca tras un intento serio, te lo decimos y cambiamos de plan. Por eso los proyectos funcionan mes a mes.",
  },
];

const QUESTIONS = [
  {
    q: "¿Cuándo veremos los primeros resultados?",
    a: "La mayoría de los clientes ve un primer cambio medible en los tres primeros meses: una palabra clave que entra entre las veinte primeras, una consulta llegada de un mercado nuevo. Un cambio real de posiciones en varios idiomas suele tardar de dos a tres trimestres, el tiempo que necesitan las páginas nuevas para ser rastreadas y ganarse la confianza de los buscadores.",
  },
  {
    q: "¿Hay que firmar un contrato?",
    a: "Los proyectos funcionan mes a mes y cualquiera de las dos partes puede terminarlos con un preaviso. La mayoría de los clientes se queda porque los informes muestran, mercado por mercado, lo que funciona.",
  },
  {
    q: "¿Y si solo tenemos un mercado que corregir?",
    a: "Una corrección de SEO en un idioma, una revisión de localización, una sesión de consultoría de IA sobre la calidad de la traducción automática: cada una se hace como un proyecto acotado, con principio y fin. Es el caso de la mayoría de las consultas.",
  },
  {
    q: "¿Quién hace el trabajo?",
    a: "Definimos y dirigimos la estrategia nosotros mismos. La redacción y la traducción en cada idioma pasan por especialistas que te presentamos, casi todos de la red BeTranslated, con la que trabajamos desde hace veinte años.",
  },
  {
    q: "¿Cómo se factura?",
    a: "La gestión lleva unos honorarios aparte. Cuando un proyecto incluye publicidad online, toda tu inversión en medios compra anuncios: se abona directamente a Google, Microsoft o Meta. El presupuesto que recomendamos es, por tanto, el que trae consultas. Esto se aplica al presupuesto de medios; la redacción y la traducción que hacemos con la red BeTranslated se presupuestan como trabajo.",
  },
  {
    q: "¿Cómo empezar?",
    a: "Un breve resumen en la página de contacto: qué mercados, qué idiomas y qué se ha probado ya. Leemos cada mensaje y respondemos nosotros mismos, normalmente en un día laborable.",
  },
];

export default function SpanishPricingPage() {
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/es/` },
          { name: "Precios", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,80px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Un método pensado para tus mercados</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[22ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Precios y desarrollo de un proyecto de SEO internacional
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Cada proyecto se presupuesta a partir de tus mercados, tus idiomas y lo que ya existe. Así se desarrolla y así se factura.
            </h2>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="roundtable" />
        </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Las etapas de un proyecto</h2>
          </Reveal>
          <ol className="grid gap-8 md:grid-cols-2">
            {STAGES.map((s, i) => (
              <Reveal key={s.name} i={i}>
                <li className="flex items-start gap-4">
                  <span className="display shrink-0 text-[.9rem] font-semibold tabular-nums" style={{ color: "var(--berry)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{s.name}</h3>
                    <p className="text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                      {s.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Tus preguntas</h2>
          </Reveal>
          <dl className="grid max-w-[72ch] gap-8">
            {QUESTIONS.map((x, i) => (
              <Reveal key={x.q} i={i}>
                <div>
                  <dt className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{x.q}</dt>
                  <dd className="text-[.98rem] leading-[1.65]" style={{ color: "var(--dim)" }}>
                    {x.a}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <Reveal>
            <div className="mt-12">
              <ButtonLink href="/es/contactanos/" size="lg">
                Enviar un breve resumen
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="es" />
    </main>
  );
}
