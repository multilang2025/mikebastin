import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import TableOfContents from "@/components/TableOfContents";
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
  const languages = postHreflang(post.group);
  return {
    title: postMetaTitle(post.title),
    description: getPostMetaDescription(post),
    ...(languages ? { alternates: { languages } } : {}),
  };
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
  const coverBand = nextBand();
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
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,84px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <Link href="/blog/" className="ulink mb-8 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
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
      </section>

      {/* ============ COVER ============ */}
      <section className={`band band-${coverBand} pb-[clamp(48px,7vw,90px)]`}>
        <div className="shell">
          <Reveal>
            <div
              className="overflow-hidden rounded-[4px] border"
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
        <div className="shell">
          {showToc && (
            <Reveal>
              <TableOfContents items={tocItems} />
            </Reveal>
          )}
          <Reveal i={showToc ? 1 : 0}>
            <div
              className="post-body max-w-[68ch] text-[1.05rem] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </Reveal>
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
            <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
              {related.map((r, i) => (
                <Reveal key={r.slug} i={i}>
                  <li className="band h-full" style={{ background: "var(--bg)" }}>
                    <Link href={`/blog/${r.slug}/`} className="flex h-full flex-col">
                      <PostImage
                        slug={r.slug}
                        cluster={r.cluster}
                        className="aspect-[1200/630] w-full"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="flex flex-1 flex-col px-7 py-6">
                        <span className="ulink mb-2 text-[1.02rem] font-semibold leading-[1.3]">
                          {r.title}
                        </span>
                        <p className="mb-4 line-clamp-3 text-[.88rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                          {r.excerpt}
                        </p>
                        <span className="mt-auto text-[.72rem] uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
                          {formatDate(r.date)}
                        </span>
                      </div>
                    </Link>
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
              written scope naming real pages and deliverables, never a
              quote with plan tiers.
            </p>
          </Reveal>
          <Reveal i={2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/contact/" className="btn btn-primary btn-lg">
                Book the discovery call
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
