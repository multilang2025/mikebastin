import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { esLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema, pageSchema } from "@/lib/schema";
import DlArt from "@/components/DlArt";
import HeroArtSlot from "@/components/HeroArtSlot";

// Spanish-only page at the legacy /es/conocenos-agencia-experta-en-seo/ URL
// (content-map, plan phase 3). No English sibling: the English site folds
// this into /how-i-work/, which /es/precios/ already pairs with. Every fact is one the
// English site states (over two decades, Valencia since 2016, the
// BeTranslated network run for twenty years, a reply within a working
// day). Copy is a draft for the owner's review.
const PATH = "/es/conocenos-agencia-experta-en-seo/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Conócenos, tu equipo SEO en Valencia, Mike Bastin",
    description:
      "Tu equipo SEO en Valencia: Mike Bastin dirige la estrategia desde la calle Rugat, y redactores nativos de la red BeTranslated escriben cada idioma.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

const POINTS = [
  {
    name: "La estrategia, dirigida directamente",
    detail:
      "Definimos y seguimos nosotros mismos la estrategia de cada mercado: investigación, prioridades e informes mensuales. Sabes con quién hablas, desde la consulta gratuita hasta el último informe.",
  },
  {
    name: "Especialistas nativos, con nombre y apellidos",
    detail:
      "La redacción y la traducción en cada idioma pasan por especialistas que te presentamos, casi todos de la red BeTranslated, que dirigimos desde hace veinte años. Cada uno escribe en su lengua materna y conoce el sector del que trata.",
  },
  {
    name: "Cuatro idiomas de trabajo",
    detail:
      "Trabajamos contigo en español, inglés, francés o neerlandés, y escribimos directamente en esos cuatro idiomas, desde Valencia, donde estamos desde 2016.",
  },
];

export default function SpanishTeamPage() {
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd data={pageSchema("AboutPage", `${SITE_URL}/es/conocenos-agencia-experta-en-seo/`, "Conócenos, tu equipo SEO en Valencia", "es")} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/es/` },
          { name: "Conócenos", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">Quién trabaja en tu web, desde Valencia</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[24ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Conócenos, tu equipo SEO en Valencia
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Más de dos décadas de posicionamiento web, una oficina en Valencia y un redactor nativo para cada idioma en el que vendes.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <div className="mt-10 flex items-center gap-4">
              <img
                src="/images/mike-bastin.webp"
                alt="Mike Bastin"
                width={72}
                height={72}
                decoding="async"
                className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
                style={{ border: "1px solid var(--rule)" }}
              />
              <span className="flex flex-col gap-[2px]">
                <span className="display text-[1.02rem] font-semibold">Mike Bastin</span>
                <span className="text-[.88rem]" style={{ color: "var(--dim)" }}>
                  Valencia, más de dos décadas de SEO multilingüe
                </span>
              </span>
            </div>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name="skyline" />
        </HeroArtSlot>
        </div>
      </section>

      <section className="band band-b py-[clamp(56px,8vw,104px)]">
        <div className="shell">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.15]">Cómo trabajamos</h2>
          </Reveal>
          <ul className="grid gap-8 md:grid-cols-3">
            {POINTS.map((p, i) => (
              <Reveal key={p.name} i={i}>
                <li>
                  <h3 className="mb-2 text-[1.08rem] font-semibold leading-[1.3]">{p.name}</h3>
                  <p className="text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                    {p.detail}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <p className="mt-12 max-w-[60ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              Leemos cada mensaje y respondemos nosotros mismos, normalmente en un día laborable.
            </p>
          </Reveal>
          <Reveal>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/es/contactanos/" size="lg">
                Reserva una consulta gratuita
              </ButtonLink>
              <ButtonLink href="/es/precios/" size="lg" variant="ghost">
                Ver cómo se desarrolla un proyecto
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="es" />
    </main>
  );
}
