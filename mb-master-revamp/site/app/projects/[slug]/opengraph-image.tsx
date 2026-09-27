import { PROJECTS, getProject } from "@/lib/projects";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// A case study shared on LinkedIn should show which client it is about,
// not the homepage card it inherited before (EN meta audit, 27 Sep 2026).
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study card from Mike Bastin";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderBlogOgImage({ title: project?.name ?? "Work", label: "Case study" });
}
