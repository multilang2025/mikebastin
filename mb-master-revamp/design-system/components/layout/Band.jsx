import React from "react";

/**
 * A page section. The band carries the token values; everything inside reads
 * variable names only. Alternate a and b down the page.
 */
export function Band({ variant = "a", grain = false, glow = false, hero = false, id, style, children }) {
  return (
    <section
      id={id}
      className={"band band-" + variant + (grain ? " grain" : "") + (glow ? " hero-glow" : "")}
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: hero ? "var(--hero-pt)" : "var(--band-py)",
        paddingBottom: hero ? "var(--hero-pb)" : "var(--band-py)",
        ...style,
      }}
    >
      <div className="shell" style={{ position: "relative" }}>{children}</div>
    </section>
  );
}
