"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

/** Real GSC data, 90 days to 2026-07-27. Impressions against ~6 total clicks. */
const DATA = [
  { label: "competitor-analysis-traffic-checklist", imp: 18522, pos: 56.0, moves: false },
  { label: "valencia-cost-of-living", imp: 10601, pos: 12.9, moves: true },
  { label: "services/global-seo-solutions", imp: 2825, pos: 31.4, moves: false },
  { label: "conversational-ai-chatbots-business", imp: 2336, pos: 27.8, moves: false },
  { label: "affiliate-marketing-programs", imp: 2278, pos: 24.1, moves: false },
  { label: "fr/agence-seo-internationale", imp: 1969, pos: 19.3, moves: false },
  { label: "best-practices-for-multilingual-seo", imp: 1398, pos: 22.7, moves: false },
  { label: "internal-linking-tools", imp: 1372, pos: 33.5, moves: false },
  { label: "fr/consultant-referencement-international", imp: 1316, pos: 18.2, moves: false },
  { label: "valencia-living-expenses", imp: 1340, pos: 29.6, moves: true },
];

const MAX = Math.max(...DATA.map((d) => d.imp));

export default function ImpressionsChart() {
  const still = useReducedMotion();
  const [hot, setHot] = useState<number | null>(null);

  // Observe the list, never the bars: a zero-width bar has zero
  // intersection area and would never trigger an observer of its own.
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px -8% 0px" });

  return (
    <div>
      <div className="mb-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[.78rem]">
        <span className="flex items-center gap-2" style={{ color: "var(--dim)" }}>
          <i className="block h-2.5 w-2.5 rounded-[2px]" style={{ background: "var(--gold)" }} />
          Stays on mikebastin.com
        </span>
        <span className="flex items-center gap-2" style={{ color: "var(--dim)" }}>
          <i className="block h-2.5 w-2.5 rounded-[2px]" style={{ background: "var(--silver)" }} />
          Moves to valenciamove.com
        </span>
      </div>

      <ul ref={ref} className="flex flex-col gap-5">
        {DATA.map((d, i) => {
          const pct = (d.imp / MAX) * 100;
          const live = hot === i;
          const dimmed = hot !== null && !live;
          return (
            <li
              key={d.label}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              className="transition-opacity duration-300"
              style={{ opacity: dimmed ? 0.55 : 1 }}
            >
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span
                  className="min-w-0 truncate text-[.88rem] transition-colors duration-300"
                  style={{ color: live ? "var(--gold)" : "var(--ink)" }}
                  title={`/${d.label}/`}
                >
                  /{d.label}/
                </span>
                <span
                  className="shrink-0 text-[.95rem] font-medium tabular-nums transition-colors duration-300"
                  style={{ color: live ? "var(--gold)" : "var(--ink)" }}
                >
                  {d.imp.toLocaleString("en-GB")}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="relative h-[8px] flex-1 overflow-hidden rounded-full"
                  style={{ background: "var(--shade)" }}
                >
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ background: d.moves ? "var(--silver)" : "var(--gold)" }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${pct}%` } : { width: 0 }}
                    transition={{
                      duration: still ? 0 : 1.2,
                      delay: still ? 0 : 0.07 * i,
                      ease: [0.22, 0.7, 0.28, 1],
                    }}
                  />
                </div>
                <span
                  className="w-[4.2rem] shrink-0 text-right text-[.8rem] tabular-nums"
                  style={{ color: "var(--dim)" }}
                >
                  pos {d.pos.toFixed(1)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-9 max-w-[58ch] text-[.92rem]" style={{ color: "var(--dim)" }}>
        Ninety days of impressions against roughly six clicks. Visibility was
        never the problem, and the two silver bars are leaving for
        valenciamove.com, which is the point.
      </p>
    </div>
  );
}
