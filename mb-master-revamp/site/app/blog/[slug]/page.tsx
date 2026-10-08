import { ogSubtitle } from "@/lib/og-card";
import PostBody from "@/components/PostBody";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import PostCard, { POST_GRID } from "@/components/PostCard";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import TableOfContents from "@/components/TableOfContents";
import ShareLinks from "@/components/ShareLinks";
import { addHeadingIds } from "@/lib/toc";
import {
  getPosts,
  getPost,
  getRelatedPosts,
  topicSlug,
  postHreflang,
  HAND_BUILT_SLUGS,
  UNCATEGORISED,
} from "@/lib/posts";
import { getService } from "@/lib/services";
import { getPostMetaDescription, postMetaTitle } from "@/lib/seo";
import { pageMeta } from "@/lib/meta";
import { SITE_URL, blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { getBlogImage } from "@/lib/blog-images";

// competitor-analysis-traffic-checklist has its own hand-built route at
// app/competitor-analysis-traffic-checklist/ (see lib/posts.ts). Excluded
// here so the static export does not try to emit the same path twice.
export function generateStaticParams() {
  return getPosts()
    .filter((p) => !HAND_BUILT_SLUGS.includes(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMeta({
    title: postMetaTitle(post.metaTitle ?? post.title),
    description: getPostMetaDescription(post),
    path: `/blog/${post.slug}/`,
    type: "article",
    publishedTime: new Date(post.date).toISOString(),
    modifiedTime: new Date(post.modified ?? post.date).toISOString(),
    languages: postHreflang(post.group),
    cardAlt: `${post.title}. ${ogSubtitle(post.excerpt)}`,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = post.relatedService ? getService(post.relatedService) : undefined;
  const related = getRelatedPosts(post.slug);
  const url = `${SITE_URL}/blog/${post.slug}/`;
  // Below three headings, an outline just repeats the page back at the
  // reader rather than helping them jump around it.
  const { html: bodyHtml, items: tocItems } = addHeadingIds(post.html);
  const showToc = tocItems.length >= 3;

  // Bands alternate strictly A/B/A/B (HANDOFF.md §23): the hero is always
  // band-a, and every section after it flips, so no two same-surface bands
  // ever end up touching.
  let band: "a" | "b" = "a";
  const nextBand = () => (band = band === "a" ? "b" : "a");
  const bodyBand = nextBand();
  // Skipped sections still have to leave the A/B run intact, so the band
  // is only taken when the section is actually rendered.
  const relatedBand = related.length > 0 ? nextBand() : band;
  const ctaBand = nextBand();
  const footerBand = nextBand();

  return (
    <main>
      <JsonLd
        data={[
          blogPostingSchema({
            headline: post.title,
            description: getPostMetaDescription(post),
            datePublished: post.date,
            dateModified: post.modified,
            url,
            // The same photograph PostImage renders above the article, so
            // the structured data and the visible page agree. A post with
            // no entry falls back to PostArt, which is drawn from the slug
            // and has no file to point at, so nothing is passed.
            image: getBlogImage(post.slug)
              ? `${SITE_URL}/images/blog/${post.slug}.webp`
              : undefined,
          }),
          breadcrumbSchema([
            { name: "Home", url: `${SITE_URL}/` },
            { name: "Journal", url: `${SITE_URL}/blog/` },
            { name: post.title, url },
          ]),
        ]}
      />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-center lg:gap-x-14">
          <div>
          <Reveal>
            <Link href="/blog/" className="ulink mb-5 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              Journal
            </Link>
          </Reveal>
          <Reveal i={1}>
            {post.cluster !== UNCATEGORISED && (
              <p className="eyebrow mb-5">{post.cluster}</p>
            )}
          </Reveal>
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
                Written by{" "}
                <Link href="/" className="ulink" style={{ color: "var(--dim)" }}>
                  Mike Bastin
                </Link>
              </span>
              <i className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />
              <span>{formatDate(post.date)}</span>
            </p>
          </Reveal>
          </div>
          {/* The cover sits inside the hero, on the hero's own surface. As
              a band of its own it was flush to the band's top edge with a
              strip of the other surface left empty beneath it, which read
              as an image that did not fit its space. */}
          <Reveal i={5}>
            <div
              className="mt-[clamp(32px,5vw,56px)] overflow-hidden rounded-[4px] border lg:mt-0"
              style={{ borderColor: "var(--rule)" }}
            >
              <PostImage
                slug={post.slug}
                cluster={post.cluster}
                rounded
                priority
                className="aspect-[1200/630] w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className={`band band-${bodyBand} py-[clamp(48px,7vw,90px)]`}>
        {/* On desktop the outline moves into the empty column beside the
            text and stays in view; below lg it sits above the body. The
            rail is not inside a Reveal, whose transform would break the
            sticky positioning. */}
        <div className={showToc ? "shell lg:grid lg:grid-cols-[minmax(0,68ch)_minmax(0,1fr)] lg:gap-x-16" : "shell"}>
          <div className="min-w-0">
            {showToc && (
              <div className="lg:hidden">
                <Reveal>
                  <TableOfContents items={tocItems} />
                </Reveal>
              </div>
            )}
            <Reveal i={showToc ? 1 : 0}>
              <PostBody
                className="post-body max-w-[68ch] text-[1.05rem] leading-[1.7]"
                html={bodyHtml}
                locale="en"
              />
            </Reveal>
            <div className="mt-12 max-w-[68ch] border-t pt-8" style={{ borderColor: "var(--rule)" }}>
              <ShareLinks url={url} title={post.title} />
            </div>
          </div>
          {showToc && (
            <aside className="hidden lg:block">
              <TableOfContents items={tocItems} variant="rail" />
            </aside>
          )}
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className={`band band-${relatedBand} py-[clamp(48px,7vw,90px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">Keep reading</p>
              <h2 className="mb-10 max-w-[26ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
                More from the journal
              </h2>
            </Reveal>
            <ul className={POST_GRID}>
              {related.map((r, i) => (
                <Reveal key={r.slug} i={i}>
                  <li className="h-full">
                    <PostCard
                      href={`/blog/${r.slug}/`}
                      imageSlug={r.slug}
                      cluster={r.cluster}
                      title={r.title}
                      excerpt={r.excerpt}
                      date={formatDate(r.date)}
                    />
                  </li>
                </Reveal>
              ))}
            </ul>
            {post.cluster !== UNCATEGORISED && (
              <Reveal>
                <Link
                  href={`/blog/topics/${topicSlug(post.cluster)}/`}
                  className="ulink mt-8 inline-block text-[.98rem]"
                >
                  See everything in {post.cluster}
                </Link>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className={`band band-${ctaBand} py-[clamp(56px,8vw,110px)]`}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-3">Where this leads</p>
            <h2 className="mb-5 max-w-[28ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-[1.15]">
              {service
                ? `See what ${service.inline} looks like on your site`
                : "Talk through what this means for your site"}
            </h2>
          </Reveal>
          <Reveal i={1}>
            <p className="mb-8 max-w-[58ch] text-[1.02rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              We start with a thirty minute call on your markets, what
              already ranks and what has already been tried. Questions come
              before recommendations, and what comes back afterwards is a
              written scope naming real pages and deliverables.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book a free consultation
              </Link>
              {service ? (
                <Link href={`/services/${service.slug}/`} className="ulink text-[.98rem]">
                  View {service.name}
                </Link>
              ) : (
                <Link href="/services/" className="ulink text-[.98rem]">
                  Browse all services
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter band={footerBand} />
    </main>
  );
}
