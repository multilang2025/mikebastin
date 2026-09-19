"use client";

import type { CSSProperties } from "react";

const ROWS = [
  { type: "Services", en: 43, fr: 44, es: 43, note: "Complete in all three" },
  { type: "Posts", en: 91, fr: 23, es: 20, note: "Fewer clusters, fully covered" },
  { type: "Pages", en: 7, fr: 7, es: 7, note: "Complete in all three" },
];

export default function LocaleTable() {

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
            <tr
              key={r.type}
              className="reveal group"
              style={{ "--rd": `${(i * 0.1).toFixed(2)}s`, "--ry": "0px", "--rx": "-14px" } as CSSProperties}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
