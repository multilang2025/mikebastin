import type { Metadata } from "next";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import { getTopics, type Topic } from "@/lib/posts";
import { getService } from "@/lib/services";
import { SITE_URL } from "@/lib/schema";

/**
 * Topic landing pages, one per cluster.
 *
 * The journal index already groups posts by cluster, but a section of a
 * long page cannot be linked to, ranked, or described in its own title.
 * A topic gets all three here: its own URL, its own metadata, and a page
 * that says what the subject is before listing what we have written on
 * it.
 *
 * Each one also points at the service it supports, which is the whole
 * reason the clusters exist: the writing is there to feed a service
 * page, not to be a feed.
 */

function topicOr404(slug: string): Topic | undefined {
  return getTopics().find((t) => t.slug === slug);
}

export function generateStaticParams() {
  return getTopics().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = topicOr404(slug);
  if (!topic) return {};

  const title = `${topic.name}, from the Mike Bastin journal`;
  const url = `${SITE_URL}/blog/topics/${topic.slug}/`;
  return {
    title,
    description: topic.blurb,
    alternates: { canonical: url },
    openGraph: { title, description: topic.blurb, url, type: "website" },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = topicOr404(slug);
  if (!topic) return null;

  const service = topic.service ? getService(topic.service) : undefined;
  const all = topic.pillar ? [topic.pillar, ...topic.posts] : topic.posts;
  const count = all.length;

  return (
    <main id="main">
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(48px,7vw,90px)] pt-[clamp(88px,13vw,150px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">
              {count} {count === 1 ? "piece" : "pieces"} in the journal
            </p>
            <h1 className="mb-7 max-w-[18ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
              {topic.name}
            </h1>
            <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
              {topic.blurb}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[.92rem]">
              {service && (
                <Link href={`/services/${service.slug}/`} className="ulink" style={{ color: "var(--berry)" }}>
                  The service behind it: {service.name}
                </Link>
              )}
              <Link href="/blog/" className="ulink">
                Every topic
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ POSTS ============ */}
      <section className="band band-b py-[clamp(48px,7vw,96px)]">
        <div className="shell">
          <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--rule)" }}>
            {all.map((post, i) => (
              <Reveal key={post.slug} i={i}>
                <li className="band h-full" style={{ background: "var(--bg)" }}>
                  <Link href={`/blog/${post.slug}/`} className="flex h-full flex-col">
                    <PostImage slug={post.slug} cluster={topic.name} className="aspect-[1200/630] w-full" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" />
                    <div className="flex flex-1 flex-col px-7 py-6">
                      <span className="ulink mb-2 text-[1.02rem] font-semibold leading-[1.3]">
                        {post.title}
                      </span>
                      <p className="line-clamp-3 text-[.88rem] leading-[1.5]" style={{ color: "var(--dim)" }}>
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
