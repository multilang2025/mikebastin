import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/meta";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getPostsForLocale, postPath } from "@/lib/posts";
import { localeTopics, topicPath } from "@/lib/locale-topics";
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

      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <ul className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            {posts.map((p, i) => (
              <Reveal key={p.slug} i={i}>
                <li className="band h-full" style={{ background: "var(--bg)" }}>
                  <Link href={postPath("fr", p.slug)} className="flex h-full flex-col px-7 py-8">
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

      <SiteFooter locale="fr" />
    </main>
  );
}
