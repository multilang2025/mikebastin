"use client";

import { useState } from "react";
import { TESTIMONIALS, GBP_URL, type Testimonial } from "@/lib/testimonials";

/**
 * Deliberately renders no Review or AggregateRating schema. See the header
 * comment in lib/testimonials.ts for why. Quotes render verbatim.
 */

// Privacy convention for a reviewer's real name on a third-party page:
// full first name, surname reduced to an initial. lib/testimonials.ts
// keeps the full name as the record; only the display is truncated here.
function displayName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return full;
  const first = parts[0];
  const lastInitial = parts[parts.length - 1][0];
  return `${first} ${lastInitial}.`;
}

const FILTERS = [{ id: "all" }, { id: "delivery" }, { id: "training" }] as const;

type Ui = {
  filters: Record<(typeof FILTERS)[number]["id"], string>;
  count: (shown: number, total: number) => string;
  source: [string, string, string];
  secondaryLabel: (langLabel: string) => string;
  hideSecondary: string;
  showMore: string;
  showLess: string;
  /** Review ages as lib/testimonials.ts stores them, in English. */
  when: (en: string) => string;
};

const AGE_FR: Record<string, string> = {
  "One month ago": "Il y a un mois",
  "Six months ago": "Il y a six mois",
  "Ten months ago": "Il y a dix mois",
  "One year ago": "Il y a un an",
};
const AGE_ES: Record<string, string> = {
  "One month ago": "Hace un mes",
  "Six months ago": "Hace seis meses",
  "Ten months ago": "Hace diez meses",
  "One year ago": "Hace un año",
};
const LANG_ES: Record<string, string> = {
  English: "inglés",
  Nederlands: "neerlandés",
  Français: "francés",
  Español: "español",
};

// The block's own labels follow the page's language, like the reviews
// themselves. A locale missing here falls back to English.
const UI: Partial<Record<Testimonial["lang"], Ui>> = {
  en: {
    filters: { all: "All", delivery: "Client work", training: "Training" },
    count: (n, t) => `${n} of ${t} reviews, written in this language`,
    source: ["Every one of these is public on ", "the Google Business Profile", ", where you can check them against the source."],
    secondaryLabel: () => "Read in English",
    hideSecondary: "Hide translation",
    showMore: "Show more reviews",
    showLess: "Show fewer reviews",
    when: (en) => en,
  },
  fr: {
    filters: { all: "Tous", delivery: "Missions clients", training: "Formation" },
    count: (n, t) => `${n} avis sur ${t}, rédigés en français`,
    source: ["Chacun de ces avis est public sur ", "notre fiche Google", ", où vous pouvez les vérifier à la source."],
    secondaryLabel: () => "",
    hideSecondary: "",
    showMore: "Voir plus d’avis",
    showLess: "Voir moins d’avis",
    when: (en) => AGE_FR[en] ?? "",
  },
  es: {
    filters: { all: "Todas", delivery: "Proyectos", training: "Formación" },
    count: (n, t) => `${n} de ${t} reseñas, traducidas al español cuando procede`,
    source: ["Las reseñas originales son públicas en ", "nuestro perfil de Google", ", donde puedes consultarlas en su idioma."],
    secondaryLabel: (langLabel) => `Ver original en ${langLabel}`,
    hideSecondary: "Ocultar original",
    showMore: "Ver más reseñas",
    showLess: "Ver menos reseñas",
    when: (en) => AGE_ES[en] ?? "",
  },
};

function Stars({ locale }: { locale: Testimonial["lang"] }) {
  return (
    <span className="flex gap-[2px]" aria-label={locale === "es" ? "Cinco estrellas de cinco" : "Five out of five"}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden
          style={{ fill: "var(--berry)" }}>
          <path d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.22 6.55L12 17.5l-5.89 3.07 1.22-6.55L2.5 9.42l6.6-.86z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ t, i, ui, locale }: { t: Testimonial; i: number; ui: Ui; locale: Testimonial["lang"] }) {
  const [showSecondary, setShowSecondary] = useState(false);
  const translatedQuote = locale === "es" ? t.spanish : locale === "en" ? t.english : null;
  const hasOriginalToggle =
    locale === "es" ? t.lang !== "es" && translatedQuote !== null : locale === "en" && t.lang !== "en" && translatedQuote !== null;
  const langLabel = locale === "es" ? LANG_ES[t.langLabel] ?? t.langLabel : t.langLabel;

  // Plain markup, no motion library (CWV audit, 3 Oct 2026): the cards
  // render visible in the exported HTML, and a filter change re-renders
  // them in place. `i` is kept for the caller's stable ordering.
  void i;
  return (
    <figure
      className="mb-5 flex break-inside-avoid flex-col gap-4 rounded-[4px] border p-6"
      style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars locale={locale} />
        <span
          className="rounded-[3px] px-2 py-[2px] text-[.66rem] uppercase tracking-[.1em]"
          style={{ background: "var(--chip)", color: "var(--dim)" }}
        >
          {langLabel}
        </span>
      </div>

      <blockquote
        lang={translatedQuote ? locale : t.lang}
        className="text-[.95rem] leading-[1.6]"
        style={{ color: "var(--ink)" }}
      >
        {translatedQuote ?? t.quote}
      </blockquote>

      {hasOriginalToggle && (
        <div>
          <button
            onClick={() => setShowSecondary((v) => !v)}
            aria-expanded={showSecondary}
            className="text-[.78rem] transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--berry)" }}
          >
            {showSecondary ? ui.hideSecondary : ui.secondaryLabel(langLabel)}
          </button>
          {/* Height eases open with a 0fr to 1fr grid row: CSS only, and it
              snaps under reduced motion (globals.css .t-expand). */}
          <div className="t-expand" data-open={showSecondary ? "true" : "false"} aria-hidden={!showSecondary}>
            <blockquote className="overflow-hidden text-[.88rem] leading-[1.55]" style={{ color: "var(--dim)" }} lang={t.lang}>
              <span className="mt-3 block">{t.quote}</span>
            </blockquote>
          </div>
        </div>
      )}

      <figcaption
        className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-4 text-[.82rem]"
        style={{ borderColor: "var(--rule)" }}
      >
        <cite className="not-italic font-medium" style={{ color: "var(--ink)" }}>
          {displayName(t.name)}
        </cite>
        {t.localGuide && (
          <span style={{ color: "var(--berry)" }} className="text-[.7rem] uppercase tracking-[.09em]">
            Local Guide
          </span>
        )}
        <span className="ml-auto" style={{ color: "var(--dim)" }}>{ui.when(t.when)}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Reviews are shown in the language of the page they sit on. A Dutch review
 * on the English site is unreadable to the visitor it is meant to convince,
 * so each locale carries its own. The full set stays in lib/testimonials.ts
 * and every locale draws from it.
 */
export default function Testimonials({
  locale = "en",
  initialCount,
}: {
  locale?: Testimonial["lang"];
  initialCount?: number;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [showAll, setShowAll] = useState(false);
  const ui = UI[locale] ?? UI.en!;

  const inLocale = TESTIMONIALS.filter((t) => locale === "es" || t.lang === locale);
  const shown =
    filter === "all" ? inLocale : inLocale.filter((t) => t.theme === filter);
  const visible = showAll || initialCount === undefined ? shown : shown.slice(0, initialCount);

  // Only offer a theme filter that would actually return something.
  const available = FILTERS.filter(
    (f) => f.id === "all" || inLocale.some((t) => t.theme === f.id)
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-3">
        {available.length > 1 &&
          available.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id);
                  setShowAll(false);
                }}
                aria-pressed={on}
                className="rounded-full border px-4 py-[6px] text-[.82rem] transition-all duration-300"
                style={{
                  borderColor: on ? "var(--berry)" : "var(--rule)",
                  color: on ? "var(--berry)" : "var(--dim)",
                  background: on ? "var(--berry-soft)" : "transparent",
                }}
              >
                {ui.filters[f.id]}
              </button>
            );
          })}
        <span className="ml-auto text-[.8rem]" style={{ color: "var(--dim)" }}>
          {ui.count(inLocale.length, TESTIMONIALS.length)}
        </span>
      </div>

      <div className="columns-1 gap-5 md:columns-2">
        {visible.map((t, i) => (
          <Card key={t.name} t={t} i={i} ui={ui} locale={locale} />
        ))}
      </div>

      {initialCount !== undefined && shown.length > initialCount && (
        <button
          onClick={() => setShowAll((value) => !value)}
          aria-expanded={showAll}
          className="ulink mt-3 text-[.88rem]"
          style={{ color: "var(--berry)" }}
        >
          {showAll ? ui.showLess : ui.showMore}
        </button>
      )}

      <p className="mt-6 text-[.85rem]" style={{ color: "var(--dim)" }}>
        {ui.source[0]}
        <a href={GBP_URL} className="ulink" target="_blank" rel="noopener noreferrer">
          {ui.source[1]}
        </a>
        {ui.source[2]}
      </p>
    </div>
  );
}
