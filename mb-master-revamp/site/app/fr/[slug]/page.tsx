import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LocaleHtmlLang from "@/components/LocaleHtmlLang";
import { getPostsForLocale, getPostForLocale, postHreflang } from "@/lib/posts";
import { postMetaTitle } from "@/lib/seo";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";

const LOCALE = "fr" as const;

// The 18 FR posts qualifying for a live page per redirects/content-map.json
// (`type: "post"`, `action: "migrate"`, `destination: "mdx"`, an `fr` entry).
// Flat at /fr/<slug>/, matching each post's own sourceUrl frontmatter and
// the pre-existing WordPress URL structure -- no /fr/blog/ segment.
export function generateStaticParams() {
  return getPostsForLocale(LOCALE).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostForLocale(LOCALE, slug);
  if (!post) return {};
  const languages = postHreflang(post.group);
  return {
    title: postMetaTitle(post.title),
    description: post.excerpt,
    ...(languages ? { alternates: { languages } } : {}),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function FrenchBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostForLocale(LOCALE, slug);
  if (!post) notFound();

  const url = `${SITE_URL}/fr/${post.slug}/`;

  return (
    <main>
      <LocaleHtmlLang lang="fr" />
      <JsonLd
        data={[
          blogPostingSchema({
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.modified,
            url,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: `${SITE_URL}/` },
            { name: post.title, url },
          ]),
        ]}
      />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,84px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <h1 className="mb-6 max-w-[26ch] text-[clamp(2rem,4.8vw,3.4rem)] font-semibold leading-[1.1]">
              {post.title}
            </h1>
          </Reveal>
          <Reveal i={1}>
            <p className="max-w-[62ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {post.excerpt}
            </p>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[.78rem] uppercase tracking-[.11em]" style={{ color: "var(--dim)" }}>
              <span>
                <Link href="/" className="ulink" style={{ color: "var(--dim)" }}>
                  Mike Bastin
                </Link>
              </span>
              <i className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />
              <span>{formatDate(post.date)}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        <div className="shell">
          <Reveal>
            <div
              className="post-body max-w-[68ch] text-[1.05rem] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
          </Reveal>
        </div>
      </section>

      <SiteFooter locale="fr" />
    </main>
  );
}
