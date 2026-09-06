import React from "react";
import { Chip } from "../core/Chip.jsx";

function Stars() {
  return (
    <span style={{ display: "flex", gap: 2 }} aria-label="Five out of five">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden style={{ fill: "var(--berry)" }}>
          <path d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.22 6.55L12 17.5l-5.89 3.07 1.22-6.55L2.5 9.42l6.6-.86z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * A review, in the language it was written in. Names display as first name
 * plus last initial: the full name is the record, the initial is the display.
 */
export function TestimonialCard({ quote, name, when, langLabel, lang = "en", english, localGuide = false }) {
  const [showEn, setShowEn] = React.useState(false);
  const display = (() => {
    const parts = String(name || "").trim().split(/\s+/);
    if (parts.length < 2) return name;
    return parts[0] + " " + parts[parts.length - 1][0] + ".";
  })();

  return (
    <figure
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        margin: 0,
        padding: 24,
        borderRadius: "var(--r-card)",
        border: "1px solid var(--rule)",
        background: "var(--shade)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <Stars />
        {langLabel && <Chip caps>{langLabel}</Chip>}
      </div>

      <blockquote lang={lang} style={{ margin: 0, fontSize: ".95rem", lineHeight: 1.6, color: "var(--ink)" }}>
        {quote}
      </blockquote>

      {english && (
        <div>
          <button
            type="button"
            onClick={() => setShowEn((v) => !v)}
            aria-expanded={showEn}
            style={{ padding: 0, border: 0, background: "none", color: "var(--berry)", fontSize: ".78rem", fontFamily: "inherit", cursor: "pointer" }}
          >
            {showEn ? "Hide translation" : "Read in English"}
          </button>
          {showEn && (
            <p style={{ margin: "12px 0 0", fontSize: ".88rem", lineHeight: 1.55, color: "var(--dim)" }}>{english}</p>
          )}
        </div>
      )}

      <figcaption
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: "4px 12px",
          marginTop: "auto",
          paddingTop: 16,
          borderTop: "1px solid var(--rule)",
          fontSize: ".82rem",
        }}
      >
        <cite style={{ fontStyle: "normal", fontWeight: 500, color: "var(--ink)" }}>{display}</cite>
        {localGuide && <span className="caps" style={{ color: "var(--berry)", fontSize: ".7rem" }}>Local Guide</span>}
        <span style={{ marginLeft: "auto", color: "var(--dim)" }}>{when}</span>
      </figcaption>
    </figure>
  );
}
