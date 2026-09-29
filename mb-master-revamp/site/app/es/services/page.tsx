import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";
import { esLanguages } from "@/lib/fr-pages";
import { leadGenPath } from "@/lib/lead-gen-hubs";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// Spanish services index (docs/ES-REBUILD-PLAN.md). Lists every live
// Spanish service page, grouped for a Spanish-speaking company selling
// abroad. Copy is a draft for the owner's review.
const PATH = "/es/services/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Servicios de SEO internacional, Mike Bastin",
    description:
      "SEO por mercado, traducción de páginas web y publicidad multilingüe para empresas que ya venden fuera y quieren que cada idioma les traiga consultas.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

/**
 * Groups, in the order a Spanish exporter reads them: the market they are
 * entering, then the search work, then the localization around it. A
 * service missing from every group lands in the last one rather than
 * disappearing, so a newly built page is never unlisted.
 */
const GROUPS: { heading: string; slugs: string[] }[] = [
  {
    heading: "El SEO para cada mercado donde vendes",
    slugs: ["seo-frances", "seo-aleman", "seo-neerlandes", "seo-ingles", "seo-italiano", "seo-portugues"],
  },
  {
    heading: "Posicionamiento y captación",
    slugs: ["optimizacion-seo", "posicionamiento-multilingue", "seo-tecnico", "seo-local", "publicidad-multilingue"],
  },
  {
    heading: "Contenido, traducción e IA",
    slugs: ["redaccion-seo-multilingue", "traduccion-profesional", "posedicion-de-ia", "consultoria-de-inteligencia-artificial"],
  },
  { heading: "Localización", slugs: [] },
];

export default function SpanishServicesIndex() {
  const services = getServicesForLocale("es");
  const listed = new Set(GROUPS.flatMap((g) => g.slugs));
  const groups = GROUPS.map((g, i) => ({
    heading: g.heading,
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
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">Posicionamiento, traducción y publicidad multilingüe</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Servicios de SEO para empresas que venden en el extranjero
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              El posicionamiento medido en cada mercado es el centro de nuestro trabajo, con la traducción y la publicidad en línea alrededor.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              Vendes en Francia, en Alemania, en el Benelux o en el Reino Unido, y quieres que cada uno de esos mercados te traiga consultas. Empieza por el mercado que más te importa{" "}: te diremos qué pide de verdad.
            </p>
          </Reveal>
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
                Posicionamiento, publicidad y seguimiento de conversiones llevados juntos y medidos con un único criterio{" "}: las consultas que cada mercado envía a tu equipo comercial.
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.heading} className={`band ${gi % 2 === 0 ? "band-a" : "band-b"} py-[clamp(48px,7vw,96px)]`}>
          <div className="shell">
            <Reveal>
              <div className="mb-8 border-b pb-4" style={{ borderColor: "var(--rule)" }}>
                <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.15]">{g.heading}</h2>
              </div>
            </Reveal>
            {/* Three across only when the row fills: two or four cards in a
                three-column grid leave an empty grey cell. An odd count in
                two columns widens its last card for the same reason. */}
            <ul
              className={`grid gap-px sm:grid-cols-2 ${g.items.length % 3 === 0 ? "lg:grid-cols-3" : ""}`}
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
