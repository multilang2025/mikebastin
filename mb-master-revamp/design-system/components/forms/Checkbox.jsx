import React from "react";

/** Checkbox with a drawn tick, sized to sit on a 1.62 line without shifting it. */
export function Checkbox({ checked = false, onChange, label, hint, invalid = false, id, ...rest }) {
  const [hot, setHot] = React.useState(false);
  return (
    <label
      htmlFor={id}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{ display: "flex", gap: 11, alignItems: "flex-start", cursor: "pointer" }}
    >
      <span style={{ position: "relative", flex: "0 0 auto", width: 18, height: 18, marginTop: 3 }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={invalid || undefined}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer" }}
          {...rest}
        />
        <span
          aria-hidden
          style={{
            display: "block",
            width: 18,
            height: 18,
            borderRadius: "var(--r-chip)",
            border: "1px solid " + (invalid ? "var(--berry)" : checked ? "var(--berry)" : hot ? "color-mix(in oklab, var(--ink) 30%, transparent)" : "var(--rule)"),
            background: checked ? "var(--berry)" : "var(--shade)",
            transition: "all var(--dur-state) var(--ease)",
          }}
        />
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 5,
            top: 5,
            width: 7,
            height: 4,
            borderLeft: "1.6px solid #FFF",
            borderBottom: "1.6px solid #FFF",
            transform: "rotate(-45deg)",
            opacity: checked ? 1 : 0,
            transition: "opacity var(--dur-micro) var(--ease)",
          }}
        />
      </span>
      <span>
        <span style={{ fontSize: ".95rem", color: "var(--ink)" }}>{label}</span>
        {hint && (
          <span style={{ display: "block", fontSize: ".82rem", color: "var(--dim)" }}>{hint}</span>
        )}
      </span>
    </label>
  );
}
