import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getPostsForLocale, imageSlugFor, postPath } from "@/lib/posts";
import PostCard, { POST_GRID } from "@/components/PostCard";
import { localeTopics, topicPath, topicPosts } from "@/lib/locale-topics";
import { esLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// Spanish articles index at the legacy /es/blog/ URL (docs/ES-REBUILD-PLAN.md).
// Lists every live Spanish post, newest first. Copy is a draft for the
// owner's review.
const PATH = "/es/blog/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Artículos de SEO y GEO desde Valencia, Mike Bastin",
    description:
      "Artículos de nuestra agencia en Valencia sobre SEO, visibilidad en las respuestas de la IA y nuevos mercados, para empresas que quieren más clientes.",
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
  // Grouped by topic, as the English journal is, newest first inside each;
  // anything filed under no topic closes the page.
  const filed = new Set<string>();
  const groups = localeTopics("es").map((tp) => {
    const list = topicPosts(tp).sort((a, b) => b.date.localeCompare(a.date));
    list.forEach((p) => filed.add(p.slug));
    return { key: tp.slug, name: tp.name, blurb: tp.blurb, href: topicPath("es", tp.slug), posts: list };
  });
  const rest = posts.filter((p) => !filed.has(p.slug));
  if (rest.length) groups.push({ key: "other", name: "Otros artículos", blurb: "Nuestros artículos que no entran en los temas de arriba.", href: "", posts: rest });

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
              Artículos sobre SEO desde Valencia
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Lo que hace vender a una web en cada idioma, en tu ciudad y fuera, y cómo lograr que las respuestas de la IA te citen.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[.95rem]" aria-label="Temas">
              {localeTopics("es").map((t) => (
                <li key={t.slug}>
                  <Link href={topicPath("es", t.slug)} className="ulink">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.key} className={`band ${gi % 2 === 0 ? "band-b" : "band-a"} py-[clamp(56px,8vw,104px)]`}>
          <div className="shell">
            <Reveal>
              <div
                className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-b pb-5"
                style={{ borderColor: "var(--rule)" }}
              >
                <div>
                  <h2 className="text-[clamp(1.5rem,2.8vw,2.2rem)] font-semibold leading-[1.15]">{g.name}</h2>
                  {g.blurb && (
                    <p className="mt-3 max-w-[62ch] text-[.98rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                      {g.blurb}
                    </p>
                  )}
                </div>
                {g.href && (
                  <Link href={g.href} className="ulink shrink-0 text-[.92rem]" style={{ color: "var(--berry)" }}>
                    Ver todo el tema
                  </Link>
                )}
              </div>
            </Reveal>
            <ul className={POST_GRID}>
              {g.posts.map((p, i) => (
                <Reveal key={p.slug} i={i % 3}>
                  <li className="h-full">
                    <PostCard
                      href={postPath("es", p.slug)}
                      imageSlug={imageSlugFor("es", p.slug)}
                      alt=""
                      title={p.title}
                      excerpt={p.excerpt}
                      date={DATE.format(new Date(p.date))}
                    />
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
