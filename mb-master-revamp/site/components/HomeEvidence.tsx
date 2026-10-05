import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PROJECTS } from "@/lib/projects";
import { PROJECTS_ES, PROJECTS_FR } from "@/lib/projects-locale";
import { CASE_SLUGS, PROJECTS_EVIDENCE } from "@/lib/home-evidence";

const T = {
  en: {
    eyebrow: "Client results",
    heading: "Sites we run, measured in Google Search Console.",
    clicks: "clicks from Google",
    period: "May to July 2026",
    source: "Source: each site’s Google Search Console, May to July 2026.",
    all: { href: "/results/", label: "See all eight projects and their numbers" },
  },
  fr: {
    eyebrow: "Résultats clients",
    heading: "Des sites que nous gérons, mesurés dans Google Search Console.",
    clicks: "clics depuis Google",
    period: "de mai à juillet 2026",
    source: "Source\u00a0: la Google Search Console de chaque site, de mai à juillet 2026.",
    all: null,
  },
  es: {
    eyebrow: "Resultados de clientes",
    heading: "Webs que gestionamos, medidas en Google Search Console.",
    clicks: "clics desde Google",
    period: "de mayo a julio de 2026",
    source: "Fuente: la Google Search Console de cada web, de mayo a julio de 2026.",
    all: null,
  },
} as const;

/** Thousands separator per market (style guide): 38,476 · 38 476 · 38.476. */
function formatCount(raw: string, locale: "en" | "fr" | "es") {
  const n = Number(raw.replace(/[^\d]/g, ""));
  if (locale === "fr") return n.toLocaleString("fr-FR").replace(/\s/g, "\u00a0");
  if (locale === "es") return n.toLocaleString("de-DE");
  return raw;
}

/**
 * The evidence block every homepage carries straight after the hero
 * (declaudify brief, owner, 3 Oct 2026): three dated Search Console figures,
 * then three compact case cards, instead of full spreads.
 */
export default function HomeEvidence({ locale = "en", band = "b" }: { locale?: "en" | "fr" | "es"; band?: "a" | "b" }) {
  const t = T[locale];
  const copy = locale === "fr" ? PROJECTS_FR : locale === "es" ? PROJECTS_ES : null;
  const cases = CASE_SLUGS.map((slug) => PROJECTS.find((p) => p.slug === slug)).filter((p) => p !== undefined);
  return (
    <section id="work" className={`band band-${band} py-[clamp(64px,9vw,120px)]`}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-3">{t.eyebrow}</p>
          <h2 className="mb-8 max-w-[26ch] text-[clamp(1.8rem,3.6vw,2.7rem)] font-semibold leading-[1.1]">{t.heading}</h2>
        </Reveal>
        <Reveal i={1}>
          <dl className="mb-4 grid gap-6 sm:grid-cols-3">
            {PROJECTS_EVIDENCE.map((e) => (
              <div key={e.slug} className="border-t pt-4" style={{ borderColor: "var(--rule)" }}>
                <dt className="text-[.9rem]" style={{ color: "var(--dim)" }}>
                  {e.name}
                </dt>
                <dd className="display mt-1 text-[clamp(1.8rem,3.2vw,2.4rem)] font-semibold leading-none" style={{ color: "var(--ink)" }}>
                  {formatCount(e.clicks, locale)}
                </dd>
                <dd className="mt-2 text-[.85rem]" style={{ color: "var(--dim)" }}>
                  {t.clicks}, {t.period}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mb-12 text-[.8rem]" style={{ color: "var(--dim)" }}>
            {t.source}
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {cases.map((p, i) => {
            const localized = copy?.[p.slug];
            return (
              <Reveal key={p.domain} i={i}>
                <article
                  className="flex h-full flex-col overflow-hidden rounded-md border"
                  style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.shot ? (
                      <Image
                        src={p.shot.replace(".webp", "-800.webp")}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        width={800}
                        height={640}
                        alt={localized?.alt ?? `The ${p.name} website on desktop and mobile`}
                        loading="lazy"
                        unoptimized
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="grid h-full place-items-center" style={{ background: "var(--deep)", color: "var(--bg)" }}>
                        {p.domain}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <p className="eyebrow mb-2">{localized?.angle ?? p.angle}</p>
                    <h3 className="mb-3 text-[1.25rem] font-semibold leading-[1.15]" style={{ color: "var(--berry)" }}>
                      {localized ? (
                        p.name
                      ) : (
                        <Link href={`/projects/${p.slug}/`} className="transition-colors hover:opacity-75">
                          {p.name}
                        </Link>
                      )}
                    </h3>
                    <p className="mb-5 text-[.88rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
                      {localized?.body ?? p.body}
                    </p>
                    <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t pt-4" style={{ borderColor: "var(--rule)" }}>
                      {(localized?.metrics ?? p.metrics).slice(0, 2).map((metric) => (
                        <div key={metric.k}>
                          <dt className="display text-[1.15rem] font-semibold leading-none" style={{ color: "var(--berry)" }}>
                            {metric.v}
                          </dt>
                          <dd className="mt-1 text-[.65rem] uppercase tracking-[.08em]" style={{ color: "var(--dim)" }}>
                            {metric.k}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {!localized && (
                      <Link href={`/projects/${p.slug}/`} className="ulink mt-4 inline-block text-[.85rem] font-medium" style={{ color: "var(--berry)" }}>
                        Read the case study
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        {t.all && (
          <Reveal>
            <Link href={t.all.href} className="ulink mt-10 inline-block text-[1rem]">
              {t.all.label}
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
