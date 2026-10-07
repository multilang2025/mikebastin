import PostBody from "@/components/PostBody";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PostImage from "@/components/PostImage";
import PostCard, { POST_GRID } from "@/components/PostCard";
import TableOfContents from "@/components/TableOfContents";
import ShareLinks from "@/components/ShareLinks";
import { addHeadingIds } from "@/lib/toc";
import { getPostsForLocale, imageSlugFor, postPath, type LocalePost } from "@/lib/posts";
import { topicForPost, topicPath, topicPosts } from "@/lib/locale-topics";

const UI = {
  fr: {
    journal: "Articles",
    blog: "/fr/blog/",
    team: "/fr/notre-equipe/",
    by: "Par",
    more: "À lire ensuite",
    moreHeading: "Plus d’articles sur ce sujet",
    all: (name: string) => `Tous les articles du sujet ${name}`,
    date: "fr-FR",
  },
  es: {
    journal: "Artículos",
    blog: "/es/blog/",
    team: "/es/conocenos-agencia-experta-en-seo/",
    by: "Por",
    more: "Sigue leyendo",
    moreHeading: "Más artículos sobre el mismo tema",
    all: (name: string) => `Todos los artículos del tema ${name}`,
    date: "es-ES",
  },
} as const;

/**
 * The French and Spanish article page, laid out like the English one
 * (app/blog/[slug]/page.tsx): breadcrumb and topic above the title, the
 * cover photograph, the body with an outline beside it on desktop, then
 * related articles from the same topic.
 */
export default function LocalePostView({ locale, post }: { locale: "fr" | "es"; post: LocalePost }) {
  const t = UI[locale];
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(t.date, { day: "numeric", month: "long", year: "numeric" });
  const topic = topicForPost(locale, post.slug);
  const { html: bodyHtml, items: tocItems } = addHeadingIds(post.html);
  const showToc = tocItems.length >= 3;
  // A migrated post that opens on its own picture keeps it, and the cover
  // above would put two photographs back to back.
  const opensOnImage = /^\s*(<p>\s*)?(<a[^>]*>\s*)?<(img|figure)\b/i.test(post.html);

  const sameTopic = topic ? topicPosts(topic).filter((p) => p.slug !== post.slug) : [];
  const newest = [...getPostsForLocale(locale)]
    .filter((p) => p.slug !== post.slug && !sameTopic.some((s) => s.slug === p.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
  const related = [...sameTopic, ...newest].slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className={`shell relative${opensOnImage ? "" : " lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center lg:gap-x-14"}`}>
          <div>
          <Reveal>
            <Link href={t.blog} className="ulink mb-5 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              {t.journal}
            </Link>
          </Reveal>
          {topic && (
            <Reveal i={1}>
              <Link href={topicPath(locale, topic.slug)} className="eyebrow mb-5 inline-block">
                {topic.name}
              </Link>
            </Reveal>
          )}
          <Reveal i={2}>
            <h1 className="mb-6 max-w-[26ch] text-[clamp(2rem,4.8vw,3.4rem)] font-semibold leading-[1.1]">
              {post.title}
            </h1>
          </Reveal>
          <Reveal i={3}>
            <p className="max-w-[62ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {post.excerpt}
            </p>
          </Reveal>
          <Reveal i={4}>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[.78rem] uppercase tracking-[.11em]" style={{ color: "var(--dim)" }}>
              <span>
                {t.by}{" "}
                <Link href={t.team} className="ulink" style={{ color: "var(--dim)" }}>
                  Mike Bastin
                </Link>
              </span>
              <i className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />
              <span>{fmt(post.date)}</span>
            </p>
          </Reveal>
          </div>
          {!opensOnImage && (
            <Reveal i={5}>
              <div
                className="mt-[clamp(32px,5vw,56px)] overflow-hidden rounded-[6px] border lg:mt-0"
                style={{ borderColor: "var(--rule)" }}
              >
                <PostImage slug={imageSlugFor(locale, post.slug)} alt="" priority className="aspect-[1200/630] w-full" />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        {/* The rail is not inside a Reveal, whose transform would break the
            sticky positioning (same as the English page). */}
        <div className={showToc ? "shell lg:grid lg:grid-cols-[minmax(0,68ch)_minmax(0,1fr)] lg:gap-x-16" : "shell"}>
          <div className="min-w-0">
            {showToc && (
              <div className="lg:hidden">
                <Reveal>
                  <TableOfContents items={tocItems} locale={locale} />
                </Reveal>
              </div>
            )}
            <Reveal i={showToc ? 1 : 0}>
              <PostBody
                className="post-body max-w-[68ch] text-[1.05rem] leading-[1.7]"
                html={bodyHtml}
                locale={locale}
              />
            </Reveal>
            <div className="mt-12 max-w-[68ch] border-t pt-8" style={{ borderColor: "var(--rule)" }}>
              <ShareLinks url={`https://mikebastin.com${postPath(locale, post.slug)}`} title={post.title} locale={locale} />
            </div>
          </div>
          {showToc && (
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} variant="rail" locale={locale} />
            </aside>
          )}
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="band band-a pb-4 pt-[clamp(48px,7vw,90px)]">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">{t.more}</p>
              <h2 className="mb-10 max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
                {t.moreHeading}
              </h2>
            </Reveal>
            <ul className={POST_GRID}>
              {related.map((r, i) => (
                <Reveal key={r.slug} i={i}>
                  <li className="h-full">
                    <PostCard
                      href={postPath(locale, r.slug)}
                      imageSlug={imageSlugFor(locale, r.slug)}
                      alt=""
                      title={r.title}
                      excerpt={r.excerpt}
                      date={fmt(r.date)}
                    />
                  </li>
                </Reveal>
              ))}
            </ul>
            {topic && (
              <Reveal>
                <Link href={topicPath(locale, topic.slug)} className="ulink mt-10 inline-block text-[.98rem]">
                  {t.all(topic.name)}
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}
    </>
  );
}
