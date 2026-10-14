import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CaseMark } from "@/components/StepIcon";
import CountryFlags from "@/components/CountryFlags";
import { PROJECTS, type Project } from "@/lib/projects";
import { PROJECTS_ES, PROJECTS_FR } from "@/lib/projects-locale";
import { CASES_ES, CASES_FR } from "@/lib/case-studies-locale";
import { caseStudyPath } from "@/lib/case-studies";
import SiteFooter from "@/components/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema } from "@/lib/schema";

/**
 * One case study page, in English, French or Spanish (owner, 12 Oct 2026:
 * "translate the case studies"). The routes under /projects/,
 * /fr/etudes-de-cas/ and /es/casos-de-exito/ all render this, so the three
 * stay one design. English text comes from lib/projects.ts, French and
 * Spanish from lib/projects-locale.ts and lib/case-studies-locale.ts.
 */
type Locale = "en" | "fr" | "es";

const L = {
  en: {
    home: { name: "Home", href: "/" },
    more: "See more client work",
    visit: (d: string) => `Visit ${d}`,
    needed: (n: string) => `What ${n} needed`,
    started: "Where it started",
    how: "How we went about it",
    did: "What we did",
    changed: (n: string) => `What changed for ${n}`,
    landed: "Where it landed",
    data: "In the data",
    agency: (c: number) => `One agency, ${c} domains`,
    across: (n: string, c: number) => `${n} across ${c} domains, each site ranking in its own market`,
    prev: "Previous",
    next: "Next",
    shotAlt: (n: string) => `The ${n} website on desktop and mobile`,
  },
  fr: {
    home: { name: "Accueil", href: "/fr/" },
    more: "Voir d’autres réalisations",
    visit: (d: string) => `Visiter ${d}`,
    needed: (n: string) => `Ce dont ${n} avait besoin`,
    started: "Le point de départ",
    how: "Notre façon de procéder",
    did: "Ce que nous avons fait",
    changed: (n: string) => `Ce qui a changé pour ${n}`,
    landed: "Le résultat",
    data: "Dans les données",
    agency: (c: number) => `Une agence, ${c} domaines`,
    across: (n: string, c: number) => `${n} sur ${c} domaines, chaque site positionné sur son marché`,
    prev: "Précédent",
    next: "Suivant",
    shotAlt: (n: string) => `Le site ${n} sur ordinateur et sur mobile`,
  },
  es: {
    home: { name: "Inicio", href: "/es/" },
    more: "Ver más proyectos de clientes",
    visit: (d: string) => `Visitar ${d}`,
    needed: (n: string) => `Lo que ${n} necesitaba`,
    started: "El punto de partida",
    how: "Cómo lo abordamos",
    did: "Lo que hicimos",
    changed: (n: string) => `Lo que cambió para ${n}`,
    landed: "El resultado",
    data: "En los datos",
    agency: (c: number) => `Una agencia, ${c} dominios`,
    across: (n: string, c: number) => `${n} en ${c} dominios, cada web posicionada en su mercado`,
    prev: "Anterior",
    next: "Siguiente",
    shotAlt: (n: string) => `La web de ${n} en ordenador y en móvil`,
  },
} as const;

/** The project as one locale shows it: English fields overlaid with that locale's copy. */
export function localizedProject(project: Project, locale: Locale) {
  if (locale === "en") return { ...project, shotAlt: L.en.shotAlt(project.name) };
  const card = (locale === "fr" ? PROJECTS_FR : PROJECTS_ES)[project.slug];
  const page = (locale === "fr" ? CASES_FR : CASES_ES)[project.slug];
  return {
    ...project,
    angle: card.angle,
    body: card.body,
    services: card.services,
    metrics: card.metrics,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    problem: page.problem,
    work: page.work,
    outcome: page.outcome,
    countries: project.countries?.map((c, i) => ({ ...c, country: page.countries?.[i] ?? c.country })),
    evidence: project.evidence?.map((e, i) => ({ ...e, ...page.evidence?.[i] })),
    shotAlt: card.alt,
  };
}

export default function CaseStudyView({ project: source, locale }: { project: Project; locale: Locale }) {
  const t = L[locale];
  const project = localizedProject(source, locale);
  const href = (slug: string) => caseStudyPath(locale, slug);

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  // Bands added after the outcome sections, so the next one keeps alternating.
  const extraBands = (project.evidence?.length ?? 0) + (project.countries ? 1 : 0);
  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: t.home.name, url: `${SITE_URL}${t.home.href}` }, { name: project.name, url: `${SITE_URL}${href(project.slug)}` }])} />
      {/* ============ HERO ============ */}
      <section className="band band-a grain relative overflow-hidden pb-[clamp(32px,4vw,56px)] pt-[clamp(88px,9vw,112px)]">
        <div className="shell relative">
          <Reveal>
            <Link href={`${t.home.href}#work`} className="ulink mb-8 inline-block text-[.9rem]" style={{ color: "var(--dim)" }}>
              {t.more}
            </Link>
          </Reveal>

          <Reveal i={1}>
            <div className="mb-5 flex items-center gap-4">
              <CaseMark slug={project.slug} />
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
              {t.visit(project.domain)}
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
                  <div className="display whitespace-nowrap text-[clamp(1.7rem,4.4vw,3.1rem)] font-semibold leading-none" style={{ color: "var(--berry)" }}>
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
                alt={project.shotAlt}
                loading="lazy"
                decoding="async"
                className="w-full rounded-[4px] border"
                style={{ borderColor: "var(--rule)" }}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ PROBLEM / WORK / OUTCOME ============ */}
      {[
        { label: t.needed(project.name), eyebrow: t.started, text: project.problem },
        { label: t.how, eyebrow: t.did, text: project.work },
        { label: t.changed(project.name), eyebrow: t.landed, text: project.outcome },
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

      {project.evidence?.map((e, n) => {
        const wide = e.width > e.height * 1.4;
        return (
          <section key={e.src} className={`band ${n % 2 === 0 ? "band-b" : "band-a"} py-[clamp(56px,8vw,110px)]`}>
            <div className={`shell grid items-start gap-10${wide ? "" : " lg:grid-cols-[1fr_auto]"}`}>
              <Reveal>
                <p className="eyebrow mb-3">{t.data}</p>
                <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
                  {e.heading}
                </h2>
                <p className="mb-4 max-w-[60ch] text-[1.05rem] leading-[1.6]" style={{ color: "var(--dim)" }}>
                  {e.text}
                </p>
                <p className="max-w-[60ch] text-[.85rem]" style={{ color: "var(--dim)" }}>
                  {e.caption}
                </p>
              </Reveal>
              <Reveal i={1}>
                <img
                  src={e.src}
                  width={e.width}
                  height={e.height}
                  alt={e.alt}
                  loading="lazy"
                  decoding="async"
                  className={`block h-auto w-full rounded-[4px] border ${wide ? "max-w-[900px]" : "max-w-[420px]"}`}
                  style={{ borderColor: "var(--rule)" }}
                />
              </Reveal>
            </div>
          </section>
        );
      })}

      {project.countries && (
        <section className={`band ${(project.evidence?.length ?? 0) % 2 === 0 ? "band-b" : "band-a"} py-[clamp(56px,8vw,110px)]`}>
          <div className="shell">
            <Reveal>
              <p className="eyebrow mb-3">{t.agency(project.countries.length)}</p>
              <h2 className="mb-6 max-w-[26ch] text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.12]">
                {t.across(project.name, project.countries.length)}
              </h2>
            </Reveal>
            <Reveal i={1} className="mx-auto max-w-[760px]">
              <CountryFlags />
            </Reveal>
            <Reveal i={2}>
              <ul className="mt-10 grid gap-x-6 gap-y-3 text-[.95rem] sm:grid-cols-2 lg:grid-cols-5">
                {project.countries.map((c) => (
                  <li key={c.domain}>
                    <a href={`https://www.${c.domain}/`} className="ulink" target="_blank" rel="noopener">
                      www.{c.domain}
                    </a>
                    <span className="block text-[.82rem]" style={{ color: "var(--dim)" }}>
                      {c.country}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============ NEXT / PREV ============ */}
      <section className={`band ${extraBands > 0 && extraBands % 2 === 0 ? "band-b" : "band-a"} py-[clamp(56px,8vw,110px)]`}>
        <div className="shell">
          <div className="grid gap-px cells-2 sm:grid-cols-2" style={{ background: "var(--rule)" }}>
            <Link
              href={href(prev.slug)}
              className="band px-8 py-10"
              style={{ background: "var(--bg)" }}
            >
              <span className="eyebrow mb-2 block">{t.prev}</span>
              <span className="ulink text-[1.3rem] font-semibold">{prev.name}</span>
            </Link>
            <Link
              href={href(next.slug)}
              className="band px-8 py-10 sm:text-right"
              style={{ background: "var(--bg)" }}
            >
              <span className="eyebrow mb-2 block">{t.next}</span>
              <span className="ulink text-[1.3rem] font-semibold">{next.name}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <SiteFooter locale={locale} band={extraBands > 0 && extraBands % 2 === 0 ? "a" : "b"} />
    </main>
  );
}
