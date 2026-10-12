import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/projects";
import { caseStudyPath } from "@/lib/case-studies";
import { esLanguages } from "@/lib/fr-pages";
import CaseStudyView, { localizedProject } from "@/components/CaseStudyView";

// Spanish case study, paired with /projects/<slug>/ (owner, 12 Oct 2026).
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = getProject(slug);
  if (!source) return {};
  const project = localizedProject(source, "es");
  const path = caseStudyPath("es", project.slug);
  return pageMeta({
    title: project.metaTitle ?? project.name,
    description: project.metaDescription ?? project.body,
    path,
    languages: esLanguages(path),
    ogLocale: "es_ES",
    cardAlt: `${project.name}, caso de éxito. ${ogSubtitle(project.angle)}`,
  });
}

export default async function CasoDeExitoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyView project={project} locale="es" />;
}
