"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { TESTIMONIALS, GBP_URL, type Testimonial } from "@/lib/testimonials";

/**
 * Deliberately renders no Review or AggregateRating schema. See the header
 * comment in lib/testimonials.ts for why. Quotes render verbatim.
 */

const FILTERS = [
  { id: "all", label: "All ten" },
  { id: "delivery", label: "Client work" },
  { id: "training", label: "Training" },
] as const;

function Stars() {
  return (
    <span className="flex gap-[2px]" aria-label="Five out of five">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden
          style={{ fill: "var(--berry)" }}>
          <path d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.22 6.55L12 17.5l-5.89 3.07 1.22-6.55L2.5 9.42l6.6-.86z" />
        </svg>
      ))}
    </span>
  );
}

function Card({ t, i }: { t: Testimonial; i: number }) {
  const still = useReducedMotion();
  const [showEn, setShowEn] = useState(false);

  return (
    <motion.figure
      layout
      initial={still ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, delay: still ? 0 : (i % 3) * 0.07, ease: [0.22, 0.7, 0.28, 1] }}
      className="mb-5 flex break-inside-avoid flex-col gap-4 rounded-[4px] border p-6"
      style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <Stars />
        <span
          className="rounded-[3px] px-2 py-[2px] text-[.66rem] uppercase tracking-[.1em]"
          style={{ background: "var(--chip)", color: "var(--dim)" }}
        >
          {t.langLabel}
        </span>
      </div>

      <blockquote
        lang={t.lang}
        className="text-[.95rem] leading-[1.6]"
        style={{ color: "var(--ink)" }}
      >
        {t.quote}
      </blockquote>

      {t.english && (
        <div>
          <button
            onClick={() => setShowEn((v) => !v)}
            aria-expanded={showEn}
            className="text-[.78rem] transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--berry)" }}
          >
            {showEn ? "Hide translation" : "Read in English"}
          </button>
          <motion.p
            initial={false}
            animate={{ height: showEn ? "auto" : 0, opacity: showEn ? 1 : 0 }}
            transition={{ duration: still ? 0 : 0.4, ease: [0.22, 0.7, 0.28, 1] }}
            className="overflow-hidden text-[.88rem] leading-[1.55]"
            style={{ color: "var(--dim)" }}
          >
            <span className="mt-3 block">{t.english}</span>
          </motion.p>
        </div>
      )}

      <figcaption
        className="mt-auto flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t pt-4 text-[.82rem]"
        style={{ borderColor: "var(--rule)" }}
      >
        <cite className="not-italic font-medium" style={{ color: "var(--ink)" }}>
          {t.name}
        </cite>
        {t.localGuide && (
          <span style={{ color: "var(--berry)" }} className="text-[.7rem] uppercase tracking-[.09em]">
            Local Guide
          </span>
        )}
        <span className="ml-auto" style={{ color: "var(--dim)" }}>{t.when}</span>
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const shown =
    filter === "all" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.theme === filter);

  const langs = [...new Set(TESTIMONIALS.map((t) => t.langLabel))];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-3">
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              className="rounded-full border px-4 py-[6px] text-[.82rem] transition-all duration-300"
              style={{
                borderColor: on ? "var(--berry)" : "var(--rule)",
                color: on ? "var(--berry)" : "var(--dim)",
                background: on ? "var(--berry-soft)" : "transparent",
              }}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto text-[.8rem]" style={{ color: "var(--dim)" }}>
          Written in {langs.length} languages, unprompted
        </span>
      </div>

      <div className="columns-1 gap-5 md:columns-2 lg:columns-3">
        {shown.map((t, i) => (
          <Card key={t.name} t={t} i={i} />
        ))}
      </div>

      <p className="mt-6 text-[.85rem]" style={{ color: "var(--dim)" }}>
        Every one of these is public on{" "}
        <a href={GBP_URL} className="ulink" target="_blank" rel="noopener noreferrer">
          the Google Business Profile
        </a>
        , where you can check them against the source.
      </p>
    </div>
  );
}
