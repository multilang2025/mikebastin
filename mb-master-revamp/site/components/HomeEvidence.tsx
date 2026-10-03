import Link from "next/link";
import Reveal from "@/components/Reveal";
import Spread from "@/components/Spread";
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
    source: "Source : la Google Search Console de chaque site, de mai à juillet 2026.",
    all: null,
  },
  es: {
    eyebrow: "Resultados de clientes",
    heading: "Webs que llevamos, medidas en Google Search Console.",
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
 * then three full cases, instead of all eight spreads further down.
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
        <div>
          {cases.map((p, i) => (
            <Spread key={p.domain} d={p} flip={i % 2 === 1} copy={copy ? copy[p.slug] : undefined} />
          ))}
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
