import React from "react";

/** The one pill-radius element on the site: a toggled filter. */
export function FilterPill({ on = false, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: ".82rem",
        fontWeight: 400,
        padding: "6px 16px",
        borderRadius: "var(--r-pill)",
        border: "1px solid " + (on ? "var(--berry)" : "var(--rule)"),
        background: on ? "var(--berry-soft)" : "transparent",
        color: on ? "var(--berry)" : "var(--dim)",
        cursor: "pointer",
        transition: "all var(--dur-state) var(--ease)",
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
