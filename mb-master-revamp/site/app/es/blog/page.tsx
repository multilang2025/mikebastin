import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getPostsForLocale, postPath } from "@/lib/posts";
import { esLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// Spanish articles index at the legacy /es/blog/ URL (docs/ES-REBUILD-PLAN.md).
// Lists every live Spanish post, newest first. Copy is a draft for the
// owner's review.
const PATH = "/es/blog/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Artículos sobre SEO internacional y GEO, Mike Bastin",
    description:
      "Nuestros artículos sobre SEO internacional, visibilidad en las respuestas de la IA y conquista de nuevos mercados, para empresas que venden en el extranjero.",
    path: PATH,
    languages: esLanguages(PATH),
    ogLocale: "es_ES",
  }),
};

const DATE = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

export default function SpanishBlogIndex() {
  // Sorted and dated by first publication: `modified` on migrated posts is
  // the migration date, which reads as no date at all.
  const posts = [...getPostsForLocale("es")].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <main>
      <LocaleHtmlLang lang="es" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: `${SITE_URL}/es/` },
          { name: "Artículos", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">SEO internacional y GEO</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Artículos sobre SEO internacional
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Lo que hace vender a una web exportadora en cada idioma, y cómo lograr que las respuestas de la IA te citen.
            </h2>
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <ul className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {posts.map((p, i) => (
              <Reveal key={p.slug} i={i}>
                <li className="band h-full" style={{ background: "var(--bg)" }}>
                  <Link href={postPath("es", p.slug)} className="flex h-full flex-col px-7 py-8">
                    <span className="mb-3 text-[.82rem] uppercase tracking-[.08em]" style={{ color: "var(--dim)" }}>
                      {DATE.format(new Date(p.date))}
                    </span>
                    <span className="ulink mb-2 text-[1.12rem] font-semibold leading-[1.3]">{p.title}</span>
                    <p className="line-clamp-4 text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                      {p.excerpt}
                    </p>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter locale="es" />
    </main>
  );
}
