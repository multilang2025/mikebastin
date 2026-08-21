import React from "react";

const shellStyle = (invalid, hot, focus) => ({
  width: "100%",
  fontFamily: "var(--font-sans)",
  fontSize: ".95rem",
  fontWeight: "var(--fw-body)",
  lineHeight: 1.5,
  color: "var(--ink)",
  background: "var(--shade)",
  border: "1px solid " + (invalid ? "var(--berry)" : focus ? "var(--berry)" : hot ? "color-mix(in oklab, var(--ink) 30%, transparent)" : "var(--rule)"),
  borderRadius: "var(--r-card)",
  padding: "11px 14px",
  outline: "none",
  transition: "border-color var(--dur-state) var(--ease), background-color var(--dur-state) var(--ease)",
});

/** Multi-line control. Six rows by default, which fits the brief box. */
export function Textarea({ invalid = false, rows = 6, style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{ ...shellStyle(invalid, hot, focus), resize: "vertical", lineHeight: "var(--lh-body)", ...style }}
      {...rest}
    />
  );
}
