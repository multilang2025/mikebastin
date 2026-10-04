import { ogSubtitle } from "@/lib/og-card";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { LEADS_PERIOD, PROJECTS, getProject } from "@/lib/projects";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return pageMeta({
    title: project.metaTitle ?? `${project.name}, a case study, Mike Bastin`,
    description: project.metaDescription ?? project.body,
    path: `/projects/${project.slug}/`,
    cardAlt: `${project.name}, a case study. ${ogSubtitle(project.angle)}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `${SITE_URL}/` }, { name: project.name, url: `${SITE_URL}/projects/${project.slug}/` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(56px,8vw,100px)] pt-[clamp(96px,14vw,160px)]">
        <div className="shell relative">
          <Reveal>
            <Link href="/" className="ulink mb-8 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              Back to the line-up
            </Link>
          </Reveal>

          <Reveal i={1}>
            <div className="mb-5 flex items-baseline gap-4">
              <span className="display text-[1.3rem] font-medium tabular-nums" style={{ color: "var(--berry)" }}>
                {project.numeral}.
              </span>
              <span className="eyebrow">{project.angle}</span>
            </div>
          </Reveal>

          <Reveal i={2}>
            <h1 className="mb-6 max-w-[18ch] text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.06]">
              {project.name}
            </h1>
          </Reveal>

          <Reveal i={3}>
            <p className="mb-8 max-w-[54ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.58]" style={{ color: "var(--dim)" }}>
              {project.body}
            </p>
          </Reveal>

          <Reveal i={4}>
            <ul className="mb-8 flex flex-wrap gap-2">
              {project.services.map((sv) => (
                <li
                  key={sv}
                  className="rounded-full px-3 py-[6px] text-[.78rem]"
                  style={{ background: "var(--chip)", color: "var(--dim)" }}
                >
                  {sv}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal i={5}>
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ulink text-[.95rem] font-medium"
              style={{ color: "var(--berry)" }}
            >
              Visit {project.domain}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ============ METRICS ============ */}
      <section className="band band-b py-[clamp(48px,7vw,90px)]">
        <div className="shell">
          <div
            className="grid gap-px"
            style={{
              background: "var(--rule)",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            }}
          >
            {project.metrics.map((m, i) => (
              <div key={m.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                <Reveal i={i}>
                  <div className="display text-[clamp(2.1rem,4.4vw,3.1rem)] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                    {m.v}
                  </div>
                  <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                    {m.k}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {project.shot && (
        <section className="band band-a pb-[clamp(8px,2vw,20px)] pt-[clamp(48px,7vw,90px)]">
          <div className="shell">
            <Reveal>
              <img
                src={project.shot}
                srcSet={`${project.shot.replace(".webp", "-800.webp")} 800w, ${project.shot} 1600w`}
                sizes="(min-width: 1280px) 1200px, 100vw"
                width={1600}
                height={1280}
                alt={`The ${project.name} website on desktop and mobile`}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[4px] border"
                style={{ borderColor: "var(--rule)" }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {project.search && (
        <section className={`band ${project.shot ? "band-a" : "band-a"} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">Measured results</p>
              <h2 className="mb-8 max-w-[22ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
                What {project.name}&apos;s enquiries and search data say
              </h2>
            </Reveal>
            {/* Enquiries first where the site keeps a form record (owner,
                3 Oct 2026); average position left out for now. One column
                on phones, then as many columns as figures, so no grey empty
                cell is ever left in the grid. */}
            <div
              className={`grid grid-cols-1 gap-px ${project.leads ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
              style={{ background: "var(--rule)" }}
            >
              {[
                ...(project.leads ? [{ v: project.leads.count, k: `${project.leads.what.charAt(0).toUpperCase() + project.leads.what.slice(1)} a month, ${LEADS_PERIOD}` }] : []),
                { v: project.search.clicks, k: project.search.note ? `Clicks from Google, ${project.search.note}` : "Clicks from Google" },
                { v: project.search.impressions, k: project.search.note ? `Impressions, ${project.search.note}` : "Impressions" },
              ].map((m, i) => (
                <div key={m.k} className="band px-6 py-9" style={{ background: "var(--bg)" }}>
                  <Reveal i={i}>
                    <div
                      className="display text-[clamp(1.8rem,3.8vw,2.7rem)] font-semibold leading-none tabular-nums"
                      style={{ color: "var(--berry)" }}
                    >
                      {m.v}
                    </div>
                    <div className="mt-3 text-[.72rem] uppercase tracking-[.12em]" style={{ color: "var(--dim)" }}>
                      {m.k}
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ PROBLEM / WORK / OUTCOME ============ */}
      {[
        { label: `The ${project.name} brief`, eyebrow: "Where it started", text: project.problem },
        { label: `The ${project.name} work, ${project.services[0] ?? "the engagement"}`, eyebrow: "What we did", text: project.work },
        { label: `The ${project.name} outcome`, eyebrow: "Where it landed", text: project.outcome },
      ].map((section, i) => (
        <section key={section.label} className={`band ${i % 2 === 0 ? "band-a" : "band-b"} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">{section.eyebrow}</p>
              <h2 className="mb-6 max-w-[30ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
                {section.label}
              </h2>
              <p className="max-w-[62ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {section.text}
              </p>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ============ NEXT / PREV ============ */}
      <section className="band band-a py-[clamp(56px,8vw,110px)]">
        <div className="shell">
          <div className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            <Link
              href={`/projects/${prev.slug}/`}
              className="band px-8 py-10"
              style={{ background: "var(--bg)" }}
            >
              <span className="eyebrow mb-2 block">Previous</span>
              <span className="ulink text-[1.3rem] font-semibold">{prev.name}</span>
            </Link>
            <Link
              href={`/projects/${next.slug}/`}
              className="band px-8 py-10 sm:text-right"
              style={{ background: "var(--bg)" }}
            >
              <span className="eyebrow mb-2 block">Next</span>
              <span className="ulink text-[1.3rem] font-semibold">{next.name}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter />
    </main>
  );
}
