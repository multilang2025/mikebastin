import React from "react";

const ROWS = [
  { type: "Services", en: 43, fr: 44, es: 43, note: "Complete in all three" },
  { type: "Posts", en: 91, fr: 23, es: 20, note: "Fewer clusters, fully covered" },
  { type: "Pages", en: 7, fr: 7, es: 7, note: "Complete in all three" },
];

/** Counts per locale. The odd count is flagged in berry, not in a footnote. */
export function LocaleTable({ rows = ROWS, headers = ["Type", "EN", "FR", "ES", "Cluster depth"], odd = { type: "Services", locale: "fr" } }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontVariantNumeric: "tabular-nums" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={h}
                className="caps"
                style={{
                  borderBottom: "1px solid var(--rule)",
                  padding: "12px 16px 12px 0",
                  fontWeight: 500,
                  textAlign: i > 0 && i < 4 ? "right" : "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.type}>
              <td style={{ borderBottom: "1px solid var(--rule)", padding: "14px 16px 14px 0", fontWeight: 500 }}>{r.type}</td>
              {["en", "fr", "es"].map((l) => {
                const flag = odd && r.type === odd.type && l === odd.locale;
                return (
                  <td
                    key={l}
                    style={{
                      borderBottom: "1px solid var(--rule)",
                      padding: "14px 16px 14px 0",
                      textAlign: "right",
                      color: flag ? "var(--berry)" : "var(--ink)",
                      fontWeight: flag ? 600 : 350,
                    }}
                  >
                    {r[l]}
                  </td>
                );
              })}
              <td style={{ borderBottom: "1px solid var(--rule)", padding: "14px 0", fontSize: ".88rem", color: "var(--dim)" }}>{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
