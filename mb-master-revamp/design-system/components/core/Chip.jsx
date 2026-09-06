import React from "react";

/**
 * Small metadata token. Three tones: quiet (the default, --chip), accent
 * (berry on --berry-soft) and struck (a slug that folded into another page).
 */
export function Chip({ tone = "quiet", caps = false, children }) {
  const tones = {
    quiet:  { background: "var(--chip)", color: "var(--dim)", border: "1px solid transparent" },
    accent: { background: "var(--berry-soft)", color: "var(--berry)", border: "1px solid transparent" },
    outline:{ background: "transparent", color: "var(--berry)", border: "1px solid var(--berry)" },
    struck: { background: "var(--chip)", color: "var(--dim)", border: "1px solid transparent", textDecoration: "line-through" },
  };
  return (
    <span
      style={{
        display: "inline-block",
        borderRadius: "var(--r-chip)",
        padding: caps ? "2px 8px" : "3px 9px",
        fontSize: caps ? ".66rem" : ".74rem",
        letterSpacing: caps ? "var(--track-caps)" : "normal",
        textTransform: caps ? "uppercase" : "none",
        lineHeight: 1.5,
        ...tones[tone],
      }}
    >
      {children}
    </span>
  );
}
