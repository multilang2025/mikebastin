import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import LocaleTopicPage from "@/components/LocaleTopicPage";
import { localeTopic, localeTopics, topicPath } from "@/lib/locale-topics";

// Topic pages of the ES journal (lib/locale-topics.ts). No sibling in
// another locale, so no hreflang: each locale groups its own posts.
export function generateStaticParams() {
  return localeTopics("es").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = localeTopic("es", slug);
  if (!topic) return {};
  return pageMeta({
    title: topic.metaTitle ?? (topic.heading.length <= 60 ? topic.heading : topic.name),
    description: topic.blurb,
    path: topicPath("es", topic.slug),
    ogLocale: "es_ES",
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = localeTopic("es", slug);
  return topic ? <LocaleTopicPage topic={topic} /> : null;
}
