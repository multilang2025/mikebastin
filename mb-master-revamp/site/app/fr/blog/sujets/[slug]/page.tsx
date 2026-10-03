import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import LocaleTopicPage from "@/components/LocaleTopicPage";
import { localeTopic, localeTopics, topicPath } from "@/lib/locale-topics";

// Topic pages of the FR journal (lib/locale-topics.ts). No sibling in
// another locale, so no hreflang: each locale groups its own posts.
export function generateStaticParams() {
  return localeTopics("fr").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = localeTopic("fr", slug);
  if (!topic) return {};
  return pageMeta({
    title: topic.metaTitle ?? (topic.heading.length <= 60 ? topic.heading : topic.name),
    description: topic.blurb,
    path: topicPath("fr", topic.slug),
    ogLocale: "fr_FR",
    cardAlt: `${topic.heading}. ${ogSubtitle(topic.blurb)}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = localeTopic("fr", slug);
  return topic ? <LocaleTopicPage topic={topic} /> : null;
}
