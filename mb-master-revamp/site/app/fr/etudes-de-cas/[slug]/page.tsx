import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/projects";
import { caseStudyId, caseStudyPath, caseStudySlugs } from "@/lib/case-studies";
import { frLanguages } from "@/lib/fr-pages";
import CaseStudyView, { localizedProject } from "@/components/CaseStudyView";

// French case study, paired with the English case study (owner, 12 Oct 2026).
export function generateStaticParams() {
  return caseStudySlugs("fr").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const source = getProject(caseStudyId("fr", slug) ?? "");
  if (!source) return {};
  const project = localizedProject(source, "fr");
  const path = caseStudyPath("fr", project.slug);
  return pageMeta({
    title: project.metaTitle ?? project.name,
    description: project.metaDescription ?? project.body,
    path,
    languages: frLanguages(path),
    ogLocale: "fr_FR",
    cardAlt: `${project.name}, étude de cas. ${ogSubtitle(project.angle)}`,
  });
}

export default async function EtudeDeCasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(caseStudyId("fr", slug) ?? "");
  if (!project) notFound();
  return <CaseStudyView project={project} locale="fr" />;
}
