import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/projects";
import { caseStudyPath } from "@/lib/case-studies";
import { enLanguages } from "@/lib/fr-pages";
import CaseStudyView, { localizedProject } from "@/components/CaseStudyView";

// The English case study; the French and Spanish ones render the same view (components/CaseStudyView.tsx).
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = getProject(slug);
  if (!source) return {};
  const project = localizedProject(source, "en");
  const path = caseStudyPath("en", project.slug);
  return pageMeta({
    title: project.metaTitle ?? `${project.name}, a case study, Mike Bastin`,
    description: project.metaDescription ?? project.body,
    path,
    languages: enLanguages(path),
    cardAlt: `${project.name}, a case study. ${ogSubtitle(project.angle)}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyView project={project} locale="en" />;
}
