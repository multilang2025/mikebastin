import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PROJECTS, getProject } from "@/lib/projects";

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
  return {
    title: `${project.name}, a case study, Mike Bastin`,
    description: project.body,
  };
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

      {/* ============ PROBLEM / WORK / OUTCOME ============ */}
      {[
        { label: "The problem", eyebrow: "Where it started", text: project.problem },
        { label: "The work", eyebrow: "What actually happened", text: project.work },
        { label: "The outcome", eyebrow: "Where it landed", text: project.outcome },
      ].map((section, i) => (
        <section key={section.label} className={`band ${i % 2 === 0 ? "band-a" : "band-b"} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">{section.eyebrow}</p>
              <h2 className="mb-6 max-w-[20ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
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
          <div className="grid gap-px sm:grid-cols-2" style={{ background: "var(--rule)" }}>
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
      <footer className="band band-b py-[clamp(64px,9vw,120px)]">
        <div className="shell">
          <Reveal>
            <p className="eyebrow mb-4">Clean face, no crowd</p>
            <h2 className="mb-8 max-w-[15ch] text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.08]">
              Tell me which language is losing you money.
            </h2>
            <div className="flex flex-col gap-2 text-[1.05rem]">
              <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                hello@mikebastin.com
              </a>
              <a href="tel:+34671175774" className="ulink w-fit">
                +34 671 17 57 74
              </a>
            </div>
          </Reveal>
        </div>
      </footer>
    </main>
  );
}
