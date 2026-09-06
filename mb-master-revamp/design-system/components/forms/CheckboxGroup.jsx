import React from "react";
import { Checkbox } from "./Checkbox.jsx";

/**
 * Pick-any-that-apply. On /contact/ the pain-point question is this rather
 * than a freeform box, because a list of named symptoms answers faster than
 * a blank field.
 */
export function CheckboxGroup({ legend, hint, options = [], value = [], onChange, columns = 1, error }) {
  const toggle = (v) => {
    if (!onChange) return;
    onChange(value.includes(v) ? value.filter((x) => x !== v) : value.concat(v));
  };
  return (
    <fieldset style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
      {legend && (
        <legend
          style={{
            padding: 0,
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: "var(--track-caps)",
            color: "var(--dim)",
          }}
        >
          {legend}
        </legend>
      )}
      {hint && !error && <p style={{ margin: 0, fontSize: ".82rem", color: "var(--dim)" }}>{hint}</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(" + columns + ", minmax(0, 1fr))",
          gap: "12px 28px",
        }}
      >
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          const detail = typeof o === "string" ? undefined : o.hint;
          return (
            <Checkbox
              key={v}
              id={"cb-" + v}
              checked={value.includes(v)}
              onChange={() => toggle(v)}
              label={label}
              hint={detail}
              invalid={!!error}
            />
          );
        })}
      </div>
      {error && (
        <p style={{ margin: 0, fontSize: ".85rem", color: "var(--berry)" }}>{error}</p>
      )}
    </fieldset>
  );
}
