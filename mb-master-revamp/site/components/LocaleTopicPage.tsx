import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { imageSlugFor, postPath } from "@/lib/posts";
import PostCard, { POST_GRID } from "@/components/PostCard";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import { topicPath, topicPosts, type LocaleTopic } from "@/lib/locale-topics";

const UI = {
  fr: {
    home: "Accueil",
    journal: "Articles",
    blog: "/fr/blog/",
    count: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
    service: "Le service associé",
    all: "Parcourir tous les articles",
  },
  es: {
    home: "Inicio",
    journal: "Artículos",
    blog: "/es/blog/",
    count: (n: number) => `${n} ${n === 1 ? "artículo" : "artículos"}`,
    service: "El servicio relacionado",
    all: "Explorar todos los artículos",
  },
} as const;

/** One topic landing page for the FR or ES journal. */
export default function LocaleTopicPage({ topic }: { topic: LocaleTopic }) {
  const t = UI[topic.locale];
  const posts = topicPosts(topic);
  const home = `${SITE_URL}/${topic.locale}/`;
  return (
    <main id="main">
      <LocaleHtmlLang lang={topic.locale} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t.home, url: home },
          { name: t.journal, url: `${SITE_URL}${t.blog}` },
          { name: topic.name, url: `${SITE_URL}${topicPath(topic.locale, topic.slug)}` },
        ])}
      />
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">{t.count(posts.length)}</p>
            <h1 className="mb-7 max-w-[24ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">{topic.heading}</h1>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {topic.blurb}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[.92rem]">
              <Link href={topic.service.href} className="ulink" style={{ color: "var(--berry)" }}>
                {t.service}{topic.locale === "fr" ? "\u00a0: " : ": "}{topic.service.label}
              </Link>
              <Link href={t.blog} className="ulink">
                {t.all}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <ul className={POST_GRID}>
            {posts.map((p, i) => (
              <Reveal key={p.slug} i={i % 3}>
                <li className="h-full">
                  <PostCard
                    href={postPath(topic.locale, p.slug)}
                    imageSlug={imageSlugFor(topic.locale, p.slug)}
                    alt=""
                    title={p.title}
                    excerpt={p.excerpt}
                    date={new Date(p.date).toLocaleDateString(topic.locale === "fr" ? "fr-FR" : "es-ES", { day: "numeric", month: "long", year: "numeric" })}
                  />
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter locale={topic.locale} />
    </main>
  );
}
