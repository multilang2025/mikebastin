"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type Cluster = {
  id: string;
  numeral: string;
  title: string;
  pillars: string[];
  absorbs: string[];
};

const CLUSTERS: Cluster[] = [
  {
    id: "search",
    numeral: "I",
    title: "Multilingual search",
    pillars: ["multilingual-seo", "french-seo", "german-seo", "spanish-seo", "dutch-seo", "italian-seo", "portuguese-seo"],
    absorbs: ["global-seo-solutions", "internationalisation", "language-solutions", "multilingual-branding"],
  },
  {
    id: "local",
    numeral: "II",
    title: "Localisation and translation",
    pillars: ["website-localisation", "translation-services", "app-and-software-localisation"],
    absorbs: ["content-localisation", "localisation-testing", "multilingual-cms-integration", "wordpress-translation-plugin", "localised-e-commerce-integration", "multilingual-ux-ui-design", "business-translation", "medical-translation", "academic-translation", "financial-translation", "legal-translation", "certified-and-sworn", "expert-translation", "transcreation", "app-localisation", "software-internationalisation", "multimedia-localisation"],
  },
  {
    id: "ai",
    numeral: "III",
    title: "Artificial intelligence",
    pillars: ["ai-consulting", "ai-translation-and-post-editing"],
    absorbs: ["post-ai-editing"],
  },
  {
    id: "support",
    numeral: "IV",
    title: "Supporting capability",
    pillars: ["technical-seo", "multilingual-content"],
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building", "local-seo", "multilingual-seo-copywriting", "cultural-consulting", "multilingual-sem", "multilingual-social-media-management"],
  },
];

export default function ConsolidationDiagram() {
  const still = useReducedMotion();
  const [open, setOpen] = useState<string | null>("local");

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
                borderColor: isOpen ? "var(--gold)" : "var(--rule)",
                background: isOpen ? "var(--shade)" : "transparent",
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span
                  className="display text-[1.15rem] font-semibold tabular-nums"
                  style={{ color: "var(--gold)" }}
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
                      stroke="var(--gold)"
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
                        style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
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
