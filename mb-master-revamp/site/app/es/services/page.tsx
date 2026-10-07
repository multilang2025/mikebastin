import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import HeroArtSlot from "@/components/HeroArtSlot";
import DlArt from "@/components/DlArt";
import { DL_PAGE_ART } from "@/lib/dl-art";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { ButtonLink } from "@/components/ui/Button";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// Spanish services index (docs/ES-REBUILD-PLAN.md). Lists every live
// Spanish service page, grouped for a company in Valencia: the work for
// its own city first, then the markets it sells into (owner, 3 Oct 2026:
// "focus on Valencia + keyword"). Copy is a draft for the owner's review.
const PATH = "/es/services/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Servicios de marketing digital en Valencia, Mike Bastin",
    description:
      "Servicios de marketing digital en Valencia: SEO, Google Ads, traducción jurada y consultoría de IA, para clientes de tu ciudad y de cada mercado donde vendes.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

/**
 * Groups, in the order a Valencia company reads them: being found at home,
 * then content, translation and AI, then the markets it sells into. A
 * service missing from every group lands in the last one rather than
 * disappearing, so a newly built page is never unlisted.
 */
const GROUPS: { heading: string; slugs: string[]; scene: { src: string; alt: string; intro: string } }[] = [
  {
    heading: "Clientes en Valencia y en Google", scene: { src: "/images/scenes/svc-lead-generation.webp", alt: "Un panel de consultas por mercado, con nuevas solicitudes de presupuesto llegadas de Alemania y Francia", intro: "Consultas de tu ciudad y de cada mercado, contadas donde llegan y entregadas a tu equipo comercial." },
    slugs: ["optimizacion-seo", "seo-local", "publicidad-multilingue", "posicionamiento-multilingue", "seo-tecnico", "seguimiento-de-conversiones"],
  },
  {
    heading: "Contenido, traducción e IA", scene: { src: "/images/scenes/svc-ai.webp", alt: "Una respuesta de IA que cita páginas alemanas y neerlandesas, y una traducción automática corregida por un editor nativo", intro: "La IA donde ahorra tiempo, y un revisor nativo allí donde está en juego la confianza." },
    slugs: ["redaccion-seo-multilingue", "traduccion-profesional", "posedicion-de-ia", "consultoria-de-inteligencia-artificial", "seo-para-ia-geo"],
  },
  {
    heading: "Desde Valencia, el SEO para cada mercado donde vendes", scene: { src: "/images/scenes/svc-search.webp", alt: "La misma página de servicios posicionada en los resultados en francés, alemán y español, y citada en una respuesta de IA", intro: "Presente en el idioma en el que busca cada comprador, en Google y en las respuestas de la IA." },
    slugs: ["seo-frances", "seo-aleman", "seo-neerlandes", "seo-ingles", "seo-italiano", "seo-portugues"],
  },
  { heading: "Localización", scene: { src: "/images/scenes/svc-localization.webp", alt: "Una misma página de producto en Alemania y Suiza con precios y medios de pago locales, junto a una traducción jurada sellada", intro: "Webs, precios y documentos que suenan locales en cada mercado donde vendes." }, slugs: [] },
];

export default function SpanishServicesIndex() {
  const services = getServicesForLocale("es");
  const listed = new Set(GROUPS.flatMap((g) => g.slugs));
  const groups = GROUPS.map((g, i) => ({
    heading: g.heading,
    scene: g.scene,
    items:
      i === GROUPS.length - 1
        ? services.filter((s) => !listed.has(s.slug))
        : g.slugs.map((slug) => services.find((s) => s.slug === slug)).filter((s) => s !== undefined),
  })).filter((g) => g.items.length > 0);

  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/es/` },
          { name: "Servicios", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative grid items-start gap-x-12 lg:grid-cols-[1fr_auto]">
        <div>
          <Reveal>
            <p className="eyebrow mb-8">SEO, Google Ads, traducción e IA en Valencia</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Servicios de marketing digital en Valencia, medidos en clientes
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Te encontramos clientes en Valencia y en cada mercado donde vendes: posicionamiento, publicidad, traducción e IA, coordinados por un mismo equipo.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="mb-10 max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Tus clientes de Valencia buscan en castellano y en inglés, y los de fuera en su propio idioma. Empieza por lo que más te importa, tu ciudad o tu próximo mercado: te diremos qué pide de verdad.
            </p>
          </Reveal>
          <Reveal i={4}>
            <ButtonLink href="/es/contactanos/" size="lg">
              Reserva una consulta gratuita
            </ButtonLink>
          </Reveal>
        </div>
        <HeroArtSlot visibleOnMobile={true}>
          <DlArt name={DL_PAGE_ART.services} />
        </HeroArtSlot>
        </div>
      </section>

      {/* The hub every service below feeds, as on the English index. */}
      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <Reveal>
            <Link
              href={leadGenPath("es")}
              className="group flex flex-col gap-3 border px-7 py-8 sm:px-10"
              style={{ borderColor: "var(--rule)" }}
            >
              <span className="eyebrow">El servicio que reúne a todos los demás</span>
              <span className="ulink text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold leading-[1.2]">
                Generación de leads B2B internacional
              </span>
              <span className="max-w-[60ch] text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                Posicionamiento, publicidad y seguimiento de conversiones llevados juntos y medidos con un único criterio: las consultas que cada mercado envía a tu equipo comercial.
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.heading} className={`band ${gi % 2 === 0 ? "band-a" : "band-b"} py-[clamp(48px,7vw,96px)]`}>
          <div className="shell">
            <Reveal>
              <div
                className="mb-10 grid items-center gap-x-12 gap-y-6 border-b pb-8 lg:grid-cols-2"
                style={{ borderColor: "var(--rule)" }}
              >
                <div className={gi % 2 === 1 ? "lg:order-2" : ""}>
                  <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.3rem)] font-semibold leading-[1.12]">{g.heading}</h2>
                  <p className="max-w-[44ch] text-[1.08rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                    {g.scene.intro}
                  </p>
                </div>
                <img
                  src={g.scene.src}
                  alt={g.scene.alt}
                  width={872}
                  height={672}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto w-full max-w-[560px]"
                />
              </div>
            </Reveal>
            {/* Three across only when the row fills: two or four cards in a
                three-column grid leave an empty grey cell. An odd count in
                two columns widens its last card for the same reason. */}
            <ul
              className={`grid gap-px ${g.items.length % 3 === 0 ? "cells-3 lg:grid-cols-3" : "cells-2"} sm:grid-cols-2`}
              style={{ background: "var(--rule)" }}
            >
              {g.items.map((s, i) => (
                <Reveal
                  key={s.slug}
                  i={i}
                  className={
                    g.items.length % 3 !== 0 && g.items.length % 2 === 1 && i === g.items.length - 1
                      ? "sm:col-span-2"
                      : undefined
                  }
                >
                  <li className="band group h-full" style={{ background: "var(--bg)" }}>
                    <Link href={servicePath("es", s.slug)} className="flex h-full flex-col px-7 py-8">
                      <span className="ulink mb-2 text-[1.08rem] font-semibold">{s.name ?? s.title}</span>
                      <p className="line-clamp-4 text-[.9rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                        {s.excerpt}
                      </p>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <SiteFooter locale="es" />
    </main>
  );
}
