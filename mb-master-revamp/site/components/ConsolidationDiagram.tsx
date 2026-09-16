"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { SERVICES } from "@/lib/services";

/**
 * Clusters are derived from lib/services.ts, the single source of truth for
 * the live service pages, rather than hand-copied here a second time. The
 * previous version of this component hard-coded its own cluster list and
 * quietly went stale twice: once when local-seo got its own page instead of
 * sitting inside technical-seo's absorbs, and again when the AI cluster
 * gained generative-engine-optimization. Reading SERVICES directly means
 * the diagram can only be as stale as the site's own service pages.
 */
const NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const clusterOrder: string[] = [];
for (const s of SERVICES) {
  if (!clusterOrder.includes(s.cluster)) clusterOrder.push(s.cluster);
}

const CLUSTERS = clusterOrder.map((title, i) => {
  const members = SERVICES.filter((s) => s.cluster === title);
  return {
    id: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    numeral: NUMERALS[i] ?? String(i + 1),
    title,
    pillars: members.map((s) => s.slug),
    absorbs: members.flatMap((s) => s.absorbs ?? []),
  };
});

export default function ConsolidationDiagram() {
  const still = useReducedMotion();
  const [open, setOpen] = useState<string | null>(CLUSTERS[1]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {CLUSTERS.map((c, ci) => {
        const isOpen = open === c.id;
        return (
          <motion.div
            key={c.id}
            initial={still ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: ci * 0.09, ease: [0.22, 0.7, 0.28, 1] }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : c.id)}
              aria-expanded={isOpen}
              className="group w-full border-l-2 py-4 pl-5 pr-3 text-left transition-all duration-500"
              style={{
                borderColor: isOpen ? "var(--berry)" : "var(--rule)",
                background: isOpen ? "var(--shade)" : "transparent",
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span
                  className="display text-[1.15rem] font-semibold tabular-nums"
                  style={{ color: "var(--berry)" }}
                >
                  {c.numeral}.
                </span>
                <span className="display text-[1.06rem] font-semibold">{c.title}</span>
                <span className="ml-auto text-[.8rem] tabular-nums" style={{ color: "var(--dim)" }}>
                  {c.absorbs.length + c.pillars.length} → {c.pillars.length}
                </span>
              </div>

              {/* the flow: absorbed slugs collapsing into pillars */}
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: still ? 0 : 0.5, ease: [0.22, 0.7, 0.28, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {c.absorbs.map((a, i) => (
                      <motion.span
                        key={a}
                        initial={still ? false : { opacity: 0, scale: 0.9 }}
                        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.35, delay: isOpen ? i * 0.018 : 0 }}
                        className="rounded-[3px] px-2 py-[3px] text-[.74rem] line-through"
                        style={{ background: "var(--chip)", color: "var(--dim)" }}
                      >
                        {a}
                      </motion.span>
                    ))}
                  </div>

                  <svg height="18" width="100%" aria-hidden className="mb-2 block">
                    <motion.path
                      d="M 14 0 C 14 12, 30 6, 44 17"
                      fill="none"
                      stroke="var(--berry)"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isOpen ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
                      transition={{ duration: still ? 0 : 0.7, delay: 0.25 }}
                    />
                  </svg>

                  <div className="flex flex-wrap gap-1.5">
                    {c.pillars.map((p, i) => (
                      <motion.span
                        key={p}
                        initial={still ? false : { opacity: 0, y: 6 }}
                        animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: isOpen ? 0.35 + i * 0.05 : 0 }}
                        className="rounded-[3px] border px-2.5 py-[4px] text-[.78rem] font-medium"
                        style={{ borderColor: "var(--berry)", color: "var(--berry)" }}
                      >
                        /services/{p}/
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
