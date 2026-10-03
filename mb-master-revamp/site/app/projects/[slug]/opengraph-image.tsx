import { PROJECTS, getProject } from "@/lib/projects";
import { OG_SIZE, OG_CONTENT_TYPE, renderOgCard, ogSubtitle, PORTRAIT, OG_TAG } from "@/lib/og-card";

// A case study shared on LinkedIn shows the client's own site (ValenciaMove
// treatment, lib/og-card.tsx), not the homepage card it inherited before.
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Case study from Mike Bastin, with the client's website";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  return renderOgCard({
    title: project?.name ?? "Work",
    subtitle: ogSubtitle(project?.angle),
    tag: OG_TAG.en.work,
    picture: project?.shot ? { kind: "art", src: project.shot.replace(".webp", "-800.webp") } : PORTRAIT,
  });
}
