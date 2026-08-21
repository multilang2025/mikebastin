import React from "react";

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

/**
 * Horizontal bars, berry for pages that stay and silver for pages that move.
 * Bars grow from zero when the list comes into view; hovering one dims the rest.
 */
export function ImpressionsChart({
  data = DATA,
  legend = [{ tone: "berry", label: "Stays on mikebastin.com" }, { tone: "silver", label: "Moves to valenciamove.com" }],
  note = "Ninety days of impressions against roughly six clicks. Visibility was never the problem, and the two silver bars are leaving for valenciamove.com, which is the point.",
}) {
  const max = Math.max.apply(null, data.map((d) => d.imp));
  const ref = React.useRef(null);
  const still = typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [drawn, setDrawn] = React.useState(!!still);
  const [hot, setHot] = React.useState(null);

  React.useEffect(() => {
    if (still || drawn || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setDrawn(true); io.disconnect(); }
    }, { rootMargin: "-8% 0px -8% 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [still, drawn]);

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginBottom: 28, fontSize: ".78rem" }}>
        {legend.map((l) => (
          <span key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--dim)" }}>
            <i style={{ display: "block", width: 10, height: 10, borderRadius: 2, background: l.tone === "silver" ? "var(--silver)" : "var(--berry)" }} />
            {l.label}
          </span>
        ))}
      </div>

      <ul ref={ref} style={{ display: "flex", flexDirection: "column", gap: 20, margin: 0, padding: 0, listStyle: "none" }}>
        {data.map((d, i) => {
          const live = hot === i;
          const dimmed = hot !== null && !live;
          return (
            <li
              key={d.label}
              onMouseEnter={() => setHot(i)}
              onMouseLeave={() => setHot(null)}
              style={{ opacity: dimmed ? 0.55 : 1, transition: "opacity var(--dur-state) var(--ease)" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
                <span
                  title={"/" + d.label + "/"}
                  style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: ".88rem", color: live ? "var(--berry)" : "var(--ink)", transition: "color var(--dur-state) var(--ease)" }}
                >
                  /{d.label}/
                </span>
                <span style={{ flex: "0 0 auto", fontSize: ".95rem", fontWeight: 500, fontVariantNumeric: "tabular-nums", color: live ? "var(--berry)" : "var(--ink)", transition: "color var(--dur-state) var(--ease)" }}>
                  {d.imp.toLocaleString("en-GB")}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative", height: 8, flex: 1, overflow: "hidden", borderRadius: "var(--r-pill)", background: "var(--shade)" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: "0 auto 0 0",
                      height: "100%",
                      width: drawn ? (d.imp / max) * 100 + "%" : 0,
                      borderRadius: "var(--r-pill)",
                      background: d.moves ? "var(--silver)" : "var(--berry)",
                      transition: still ? "none" : "width 1.2s var(--ease) " + (i * 70) + "ms",
                    }}
                  />
                </div>
                <span style={{ width: "4.2rem", flex: "0 0 auto", textAlign: "right", fontSize: ".8rem", fontVariantNumeric: "tabular-nums", color: "var(--dim)" }}>
                  pos {d.pos.toFixed(1)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {note && <p style={{ maxWidth: "58ch", marginTop: 36, fontSize: ".92rem", color: "var(--dim)" }}>{note}</p>}
    </div>
  );
}
