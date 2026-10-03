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
import { frLanguages } from "@/lib/fr-pages";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

// French articles index at the legacy /fr/blog/ URL (docs/FR-REBUILD-PLAN.md).
// Lists every live French post, newest first. Copy is a draft for the
// owner's review.
const PATH = "/fr/blog/";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Articles sur le SEO international, Mike Bastin",
    description:
      "Nos articles en français sur le SEO international, la visibilité dans les réponses des IA et la conquête de nouveaux marchés pour les entreprises qui exportent.",
    path: PATH,
    languages: frLanguages(PATH),
    ogLocale: "fr_FR",
  }),
};

const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function FrenchBlogIndex() {
  // Sorted and dated by first publication: `modified` on these posts is the
  // migration date, the same day for all eight, which reads as no date at all.
  const posts = [...getPostsForLocale("fr")].sort((a, b) => b.date.localeCompare(a.date));
  // Grouped by topic, as the English journal is, newest first inside each;
  // anything filed under no topic closes the page.
  const filed = new Set<string>();
  const groups = localeTopics("fr").map((tp) => {
    const list = topicPosts(tp).sort((a, b) => b.date.localeCompare(a.date));
    list.forEach((p) => filed.add(p.slug));
    return { key: tp.slug, name: tp.name, blurb: tp.blurb, href: topicPath("fr", tp.slug), posts: list };
  });
  const rest = posts.filter((p) => !filed.has(p.slug));
  if (rest.length) groups.push({ key: "other", name: "Autres articles", blurb: "Tous nos articles qui ne relèvent pas des sujets ci-dessus.", href: "", posts: rest });

  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", url: `${SITE_URL}/fr/` },
          { name: "Articles", url: `${SITE_URL}${PATH}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow mb-8">SEO international et IA</p>
          </Reveal>
          <Reveal i={1}>
            <h1 className="mb-6 max-w-[19ch] text-[clamp(2.3rem,5.6vw,4rem)] font-semibold leading-[1.08]">
              Articles sur le SEO international
            </h1>
          </Reveal>
          <Reveal i={2}>
            <h2 className="mb-6 max-w-[46ch] text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.3]" style={{ color: "var(--ink)" }}>
              Ce qui fait vendre un site dans chaque langue, et comment être cité dans les réponses des IA.
            </h2>
          </Reveal>
          <Reveal i={3}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[.95rem]" aria-label="Sujets">
              {localeTopics("fr").map((t) => (
                <li key={t.slug}>
                  <Link href={topicPath("fr", t.slug)} className="ulink">
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
                    Voir tout le sujet
                  </Link>
                )}
              </div>
            </Reveal>
            <ul className={POST_GRID}>
              {g.posts.map((p, i) => (
                <Reveal key={p.slug} i={i % 3}>
                  <li className="h-full">
                    <PostCard
                      href={postPath("fr", p.slug)}
                      imageSlug={imageSlugFor("fr", p.slug)}
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

      <SiteFooter locale="fr" />
    </main>
  );
}
