import React from "react";
import { FieldError } from "./FieldError.jsx";

/**
 * Label, optional hint, control, error. Every form control on the site sits
 * in one of these so the vertical rhythm and the error position are decided
 * once rather than per page.
 */
export function Field({ label, htmlFor, hint, error, required = false, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: ".72rem",
            textTransform: "uppercase",
            letterSpacing: "var(--track-caps)",
            color: "var(--dim)",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--berry)" }}> *</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p style={{ margin: 0, fontSize: ".82rem", color: "var(--dim)" }}>{hint}</p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
