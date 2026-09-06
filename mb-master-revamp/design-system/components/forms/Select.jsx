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

/**
 * Native select, restyled. The caret is drawn with a border triangle so no
 * icon asset or background-image hex is needed.
 */
export function Select({ invalid = false, options = [], placeholder, style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "block" }}>
      <select
        aria-invalid={invalid || undefined}
        onMouseEnter={() => setHot(true)}
        onMouseLeave={() => setHot(false)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          ...shellStyle(invalid, hot, focus),
          appearance: "none",
          paddingRight: 38,
          cursor: "pointer",
          ...style,
        }}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
      <span
        aria-hidden
        style={{
          position: "absolute",
          right: 15,
          top: "50%",
          marginTop: -2,
          width: 7,
          height: 7,
          borderRight: "1.5px solid var(--dim)",
          borderBottom: "1.5px solid var(--dim)",
          transform: "rotate(45deg)",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
