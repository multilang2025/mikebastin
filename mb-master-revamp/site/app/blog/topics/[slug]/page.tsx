import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PostCard, { POST_GRID } from "@/components/PostCard";
import SiteFooter from "@/components/SiteFooter";
import { getTopics, type Topic, topicMetaDescription } from "@/lib/posts";
import { getService } from "@/lib/services";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";

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

  return pageMeta({
    title: `${topic.name}, from the Mike Bastin journal`,
    description: topicMetaDescription(topic),
    path: `/blog/topics/${topic.slug}/`,
    cardAlt: `${topic.heading}. ${ogSubtitle(topic.blurb)}`,
  });
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
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: "Journal", url: `${SITE_URL}/blog/` }, { name: topic.name, url: `${SITE_URL}/blog/topics/${topic.slug}/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">
              {count} {count === 1 ? "piece" : "pieces"} in the journal
            </p>
            <h1 className="mb-7 max-w-[22ch] text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.05]">
              {topic.heading}
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
          <ul className={POST_GRID}>
            {all.map((post, i) => (
              <Reveal key={post.slug} i={i}>
                <li className="h-full">
                  <PostCard
                    href={`/blog/${post.slug}/`}
                    imageSlug={post.slug}
                    cluster={topic.name}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  />
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
