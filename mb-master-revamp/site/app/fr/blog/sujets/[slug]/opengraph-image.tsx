import { localeTopic, localeTopics } from "@/lib/locale-topics";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

export function generateStaticParams() {
  return localeTopics("fr").map((t) => ({ slug: t.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Carte Mike Bastin : sujet du blog";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = localeTopic("fr", slug);
  return renderBlogOgImage({ title: topic?.heading ?? "Articles", label: "Articles" });
}
