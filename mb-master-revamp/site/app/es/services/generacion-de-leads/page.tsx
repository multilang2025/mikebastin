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
import HeroArtSlot from "@/components/HeroArtSlot";

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
  "Tus mercados exteriores ya te envían visitas. Las convertimos en leads cualificados, contados por mercado, y toda tu inversión publicitaria va a tus anuncios.";

export const metadata: Metadata = {
  ...pageMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    languages: leadGenLanguages(),
    ogLocale: "es_ES",
  }),
};

const PARTS: { title: string; body: string; href?: string; link?: string }[] = [
  {
    title: "Encontrado en su idioma",
    body: "Posicionamiento construido mercado a mercado a partir de lo que los compradores escriben de verdad, para que el visitante adecuado llegue a una página escrita para él.",
    href: "/es/services/posicionamiento-multilingue/",
    link: "Posicionamiento multilingüe",
  },
  {
    title: "Alcanzado antes de que te encuentre",
    body: "Campañas de pago en cada idioma que llegan al comprador antes que la búsqueda orgánica, con un presupuesto separado por mercado para que cada uno responda de su propio gasto.",
    href: "/es/services/publicidad-multilingue/",
    link: "Publicidad multilingüe",
  },
  {
    title: "Contado donde nació",
    body: "Cada consulta atribuida al mercado y al idioma que la trajeron, y seguida hasta tu CRM, para juzgar cada mercado por las conversaciones que abre.",
  },
];

const QUESTIONS = [
  {
    q: "¿Hay que lanzar todos los idiomas a la vez?",
    a: [
      "Normalmente sale más barato ir mercado a mercado. Empezamos por el mercado donde las señales son más claras, hacemos que genere consultas y añadimos el siguiente cuando lo consigue.",
      "Concentrar el primer presupuesto en un solo idioma es la forma más segura de tener un mercado que claramente rinde antes de abrir el siguiente.",
    ],
  },
  {
    q: "¿Qué cuenta como un lead?",
    a: [
      "La definición que reconoce tu propio equipo comercial, acordada antes de empezar a medir. Normalmente, una consulta que se convirtió en conversación.",
      "El spam, las candidaturas y los envíos de prueba se cuentan aparte, para que cada mercado se juzgue por lo que de verdad llega a tu equipo.",
    ],
  },
  {
    q: "¿Quién escribe en los demás idiomas?",
    a: [
      "Escribimos directamente en español, inglés, francés y neerlandés. El alemán, el italiano, el portugués y los demás idiomas pasan por redactores nativos de la red BeTranslated, a quienes damos el briefing y cuyo trabajo revisamos.",
      "En todos los casos la página se escribe para el mercado que la lee, a partir de su propia investigación.",
    ],
  },
  {
    q: "¿Hay una permanencia mínima?",
    a: [
      "Trabajamos mes a mes. La primera llamada da lugar a un alcance por escrito que nombra las páginas y los entregables, y tú decides a partir de ahí.",
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
              <p className="eyebrow mb-8">Medido en consultas</p>
            </Reveal>
            <Reveal i={1}>
              <h1 className="mb-6 max-w-[22ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
                Generación de leads B2B para empresas que exportan
              </h1>
            </Reveal>
            <Reveal i={2}>
              <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
                Tus mercados exteriores ya te envían visitantes. Los convertimos en consultas que merecen una llamada comercial, y te mostramos de qué mercado viene cada una.
              </h2>
            </Reveal>
            <Reveal i={3}>
              <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
                El tráfico llega en francés, alemán y neerlandés, y las consultas siguen llegando en español. La Search Console de un cliente mostraba cuarenta mil impresiones en noventa días, y seis clics. Los compradores ya buscaban: el siguiente paso era convertir esa búsqueda en una conversación.
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
          <HeroArtSlot visibleOnMobile={true}>
            <ServiceHeroArt slug="lead-generation" />
          </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Lo que muestra un informe por mercado</p>
            <h2 className="mb-6 max-w-[24ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
              Un informe por mercado muestra cuál sostiene a los demás
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Una sola cifra para todo el sitio es el informe más cómodo de leer; el informe por mercado es el que sirve para decidir. Dentro de una media, el mercado que sostiene tus resultados y el que gasta tu presupuesto solo en visitas parecen exactamente iguales. Separados, se distinguen a simple vista.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Con una sola cifra, el dinero va adonde el tráfico parece más sano, y el idioma que de verdad vende recibe un poco menos cada trimestre: la decisión la toma el informe. Cuando cada mercado se ve por separado, el presupuesto va al mercado que debe crecer.
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
              Tres piezas, trabajadas juntas y juzgadas por una sola cosa: si cada mercado envía a tu equipo comercial consultas que valen la pena. Por separado, cada una produce un informe. Juntas, producen un pipeline que lees mercado a mercado.
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
              Toda tu inversión publicitaria va a tus anuncios
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Cuando un proyecto incluye publicidad de pago, toda tu inversión en medios compra anuncios: va directamente a Google, Microsoft o Meta, y la gestión se factura como honorarios propios. Así que el presupuesto que te recomendamos es el que trae consultas.
            </p>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Esto vale para la inversión en medios; la redacción y la traducción se presupuestan como un precio por el trabajo.
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
              Nuestros clientes nos valoran en inglés, neerlandés, francés y español, cada uno en el idioma que eligió. Aquí tienes la reseña escrita en español.
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
              Un formulario enviado se convierte en lead cuando tu equipo lo reconoce como tal
            </h2>
            <p className="mb-5 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              La medición pasa por GA4 y Google Tag Manager, configurados por idioma con las mismas definiciones de eventos en todos, para que una consulta francesa y una alemana se cuenten igual y puedan compararse. El modo de consentimiento se ajusta mercado a mercado, porque la aceptación de cookies varía entre países, y así la comparación ordena tus idiomas por ventas.
            </p>
            <p className="mb-12 max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              El CRM cierra el círculo. El seguimiento de conversiones offline devuelve el resultado de cada consulta a GA4 y Google Ads, de modo que un mercado que envía menos consultas pero mejores aparece como ganador, y las pujas de pago siguen lo que vale cada mercado.
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
              Descubre lo que tus otros mercados podrían enviarte
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-9 max-w-[58ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Treinta minutos sobre los mercados que importan, lo que ya posiciona y lo que ya se ha probado. Primero preguntamos y después recomendamos, y lo que recibes es un alcance por escrito que nombra páginas y entregables reales. Trabajamos mes a mes. El formulario de contacto está en inglés, y puedes rellenarlo en español: te responderemos en español.
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
