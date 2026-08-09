"use client";

import { motion, useReducedMotion } from "motion/react";

const ROWS = [
  { type: "Services", en: 43, fr: 44, es: 43, note: "Complete in all three" },
  { type: "Posts", en: 91, fr: 23, es: 20, note: "Fewer clusters, fully covered" },
  { type: "Pages", en: 7, fr: 7, es: 7, note: "Complete in all three" },
];

export default function LocaleTable() {
  const still = useReducedMotion();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left tabular-nums">
        <thead>
          <tr>
            {["Type", "EN", "FR", "ES", "Cluster depth"].map((h, i) => (
              <th
                key={h}
                className={`border-b py-3 pr-4 text-[.72rem] font-medium uppercase tracking-[.11em] ${
                  i > 0 && i < 4 ? "text-right" : ""
                }`}
                style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r, i) => (
            <motion.tr
              key={r.type}
              initial={still ? false : { opacity: 0, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group"
            >
              <td
                className="border-b py-3.5 pr-4 font-medium transition-colors duration-300 group-hover:text-[var(--berry)]"
                style={{ borderColor: "var(--rule)" }}
              >
                {r.type}
              </td>
              {(["en", "fr", "es"] as const).map((l) => {
                const odd = r.type === "Services" && l === "fr";
                return (
                  <td
                    key={l}
                    className="border-b py-3.5 pr-4 text-right"
                    style={{
                      borderColor: "var(--rule)",
                      color: odd ? "var(--berry)" : "var(--ink)",
                      fontWeight: odd ? 600 : 350,
                    }}
                  >
                    {r[l]}
                  </td>
                );
              })}
              <td
                className="border-b py-3.5 text-[.88rem]"
                style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
              >
                {r.note}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
