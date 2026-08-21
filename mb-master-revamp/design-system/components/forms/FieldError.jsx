import React from "react";

/** Error line. Berry text, no icon, no exclamation, states the fix. */
export function FieldError({ children }) {
  return (
    <p role="alert" style={{ margin: 0, fontSize: ".85rem", lineHeight: 1.5, color: "var(--berry)" }}>
      {children}
    </p>
  );
}
