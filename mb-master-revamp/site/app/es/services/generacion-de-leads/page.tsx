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

// Spanish sibling of /services/lead-generation/, the first page of the
// Spanish rebuild. Same case in the same order as the English page,
// written for a Spanish company selling abroad rather than translated.
// Every fact is one the English page states. There is no Spanish contact
// page or services index yet, so the calls to action go to /contact/ and
// say the form can be filled in in Spanish. Copy is a draft for the
// owner's review.
const PATH = leadGenPath("es");
const NAME = "Generación de leads B2B";
const TITLE = "Generación de leads B2B para empresas que exportan";
const DESCRIPTION =
  "Sus mercados exteriores le envían visitas y pocas consultas. Las convertimos en leads cualificados, contados mercado a mercado, sin margen sobre su inversión publicitaria.";

export const metadata: Metadata = {
  ...pageMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    languages: leadGenLanguages(),
    fallbackImage: true,
    ogLocale: "es_ES",
  }),
};

const PARTS: { title: string; body: string; href?: string; link?: string }[] = [
  {
    title: "Encontrado en su idioma",
    body: "Posicionamiento construido mercado a mercado a partir de lo que los compradores escriben de verdad, para que el visitante adecuado llegue a una página escrita para él y no traducida para él.",
    href: "/es/services/posicionamiento-multilingue/",
    link: "Posicionamiento multilingüe",
  },
  {
    title: "Alcanzado antes de que le encuentre",
    body: "Campañas de pago en cada idioma para el comprador que aún no le ha encontrado en orgánico, con un presupuesto separado por mercado para que ninguno financie en silencio a otro.",
    href: "/es/services/publicidad-multilingue/",
    link: "Publicidad multilingüe",
  },
  {
    title: "Contado donde nació",
    body: "Cada consulta atribuida al mercado y al idioma que la trajeron, y seguida hasta su CRM, para juzgar cada mercado por las conversaciones que abre.",
  },
];

const QUESTIONS = [
  {
    q: "¿Hay que lanzar todos los idiomas a la vez?",
    a: [
      "No, y normalmente sale más barato no hacerlo. Empezamos por el mercado donde las señales son más claras, hacemos que genere consultas y añadimos el siguiente cuando lo consigue.",
      "Repartir el primer presupuesto entre todos los idiomas en los que vende es la forma más segura de acabar con varios mercados casi activos y ninguno que claramente rinda.",
    ],
  },
  {
    q: "¿Qué cuenta como un lead?",
    a: [
      "La definición que reconoce su propio equipo comercial, acordada antes de medir nada. Normalmente, una consulta que se convirtió en conversación.",
      "El spam, las candidaturas y los envíos de prueba se cuentan aparte, para que cada mercado se juzgue por lo que de verdad llega a su equipo y no por cuántos formularios se rellenaron.",
    ],
  },
  {
    q: "¿Quién escribe en los idiomas que ustedes no redactan?",
    a: [
      "Escribimos directamente en español, inglés, francés y neerlandés. El alemán, el italiano, el portugués y los demás idiomas pasan por redactores nativos de la red BeTranslated, a quienes damos el briefing y cuyo trabajo revisamos.",
      "En todos los casos la página se escribe para el mercado que la lee, a partir de su propia investigación, y no se traduce de una página española pensada para otro lector.",
    ],
  },
  {
    q: "¿Hay una permanencia mínima?",
    a: [
      "Sin permanencia. La primera llamada da lugar a un alcance por escrito que nombra las páginas y los entregables, y usted decide a partir de ahí.",
    ],
  },
];

export default function SpanishLeadGenerationPage() {
  const url = `${SITE_URL}${PATH}`;
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd
        data={[
          serviceSchema({ name: NAME, description: DESCRIPTION, url }),
          breadcrumbSchema([
            { name: "Inicio", url: `${SITE_URL}/` },
            { name: NAME, url },
          ]),
        ]}
      />

      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
          <div>
            <Reveal>
              <p className="eyebrow mb-8">Medido en consultas, no en visitas</p>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mb-6 max-w-[22ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
                Generación de leads B2B para empresas que exportan
              </h1>
            </Reveal>
            <Reveal i={2}>
              <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
                Sus mercados exteriores ya le envían visitantes. Los convertimos en consultas que merecen una llamada comercial, y le mostramos de qué mercado viene cada una.
              </h2>
            </Reveal>
            <Reveal i={3}>
              <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
                El tráfico llega en francés, alemán y neerlandés, y las consultas siguen llegando en español. La Search Console de un cliente mostraba cuarenta mil impresiones en noventa días, y seis clics. Los compradores buscaban, y nada convertía esa búsqueda en una conversación.
              </p>
            </Reveal>
            <Reveal i={4}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/contact/" className="btn btn-primary btn-lg">
                  Reservar una primera llamada
                </Link>
                <Link href="#facturacion" className="ulink text-[.98rem]">
                  Ver cómo se factura
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
            <p className="eyebrow mb-3">Lo que cuesta un informe global</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Un único total esconde el mercado que paga por los demás
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Una sola cifra para todo el sitio es el informe más cómodo de leer y el menos útil para decidir. Dentro de una media, el mercado que sostiene sus resultados y el que gasta su presupuesto en visitas que nunca convierten parecen exactamente iguales.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Así que el dinero sigue yendo adonde el tráfico parece más sano, y el idioma que de verdad vende recibe un poco menos cada trimestre. Nadie lo decidió. Lo decidió el informe, al no mostrar nunca la diferencia. Cada mes que funciona así, el mercado que debería crecer es el que se queda sin recursos.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Lo que hacemos en cada mercado</p>
            <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              La generación de leads B2B, idioma a idioma
            </h2>
            <p className="mb-10 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Tres piezas, trabajadas juntas y juzgadas por una sola cosa: si cada mercado envía a su equipo comercial consultas que valen la pena. Por separado, cada una produce un informe. Juntas, producen un pipeline que usted lee mercado a mercado.
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
                  {p.href && (
                    <Link href={p.href} className="ulink mt-auto text-[.9rem]">
                      {p.link}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="facturacion" className="band band-b scroll-mt-20 py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Cómo se factura</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Sin margen sobre su inversión publicitaria, así que un presupuesto mayor no nos aporta nada
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Cuando un proyecto incluye publicidad de pago, su presupuesto de medios va directamente a Google, Microsoft o Meta, sin pasar por nosotros. La gestión se factura como honorarios propios. Así que no tenemos ningún motivo para recomendar un presupuesto mayor, y todos los motivos para recomendar el que trae consultas.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Para ser exactos sobre dónde está el límite: el principio vale para la inversión en medios. La redacción y la traducción se presupuestan como un precio por el trabajo. Una agencia que se mantiene imprecisa sobre qué costes repercute y cuáles factura suele tener un motivo, y preferimos que lo sepa antes de la primera llamada.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Lo que dicen nuestros clientes</p>
            <h2 className="mb-5 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Reseñas públicas, en el idioma de quien las escribe
            </h2>
            <p className="mb-10 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Nuestros clientes nos valoran en inglés, neerlandés, francés y español, cada uno en el idioma que eligió. Esta es la reseña escrita en español.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Testimonials locale="es" />
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Cómo se cuentan las consultas</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Un formulario enviado se convierte en lead cuando su equipo lo reconoce como tal
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              La medición pasa por GA4 y Google Tag Manager, configurados por idioma con las mismas definiciones de eventos en todos, para que una consulta francesa y una alemana se cuenten igual y puedan compararse. El modo de consentimiento se ajusta mercado a mercado, porque las tasas de rechazo varían entre países, y una comparación sin corregir ordenaría sus idiomas por aceptación de cookies y no por ventas.
            </p>
            <p className="mb-12 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              El CRM cierra el círculo. El seguimiento de conversiones offline devuelve el resultado de cada consulta a GA4 y Google Ads, de modo que un mercado que envía menos consultas pero mejores aparece como ganador, y las pujas de pago siguen lo que vale un mercado y no cuántos formularios rellena.
            </p>
          </Reveal>
          <Reveal i={1}>
            <h3 className="display mb-6 text-[clamp(1.3rem,2.2vw,1.7rem)] font-semibold">
              Lo que nos preguntan antes de la primera llamada
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
            <p className="eyebrow mb-3">El siguiente paso</p>
            <h2 className="mb-5 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Descubra lo que sus otros mercados podrían enviarle
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Treinta minutos sobre los mercados que importan, lo que ya posiciona y lo que ya se ha probado. Preguntamos antes de recomendar nada, y lo que recibe después es un alcance por escrito que nombra páginas y entregables reales, no un presupuesto con planes cerrados. Sin permanencia. El formulario de contacto está en inglés, y puede rellenarlo en español: le responderemos en español.
            </p>
          </Reveal>
          <Reveal i={2}>
            <Link href="/contact/" className="btn btn-primary btn-lg">
              Reservar una primera llamada
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="es" />
    </main>
  );
}
