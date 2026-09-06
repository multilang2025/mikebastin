import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getPosts, getPost, HAND_BUILT_SLUGS } from "@/lib/posts";
import { getService } from "@/lib/services";

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
  return { title: `${post.title}, Mike Bastin`, description: post.excerpt };
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

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,84px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <Link href="/blog/" className="ulink mb-8 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              Journal
            </Link>
          </Reveal>
          <Reveal i={1}>
            <p className="eyebrow mb-5">{post.cluster}</p>
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
            <p className="mt-6 text-[.78rem] uppercase tracking-[.11em]" style={{ color: "var(--dim)" }}>
              {formatDate(post.date)}
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

      {/* ============ RELATED SERVICE ============ */}
      {service && (
        <section className="band band-a py-[clamp(48px,7vw,90px)]">
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">The service this feeds</p>
              <Link href={`/services/${service.slug}/`} className="ulink display block max-w-[30ch] text-[clamp(1.3rem,2.6vw,1.9rem)] font-semibold leading-[1.15]">
                {service.name}
              </Link>
              <p className="mt-3 max-w-[60ch] text-[1rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {service.lede}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
