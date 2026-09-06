import React from "react";

const PAD = { sm: "8px 16px", md: "11px 22px", lg: "14px 28px" };
const FS = { sm: ".82rem", md: ".9rem", lg: "1rem" };

/**
 * Primary, secondary and ghost, resolved on either band. No hardcoded
 * colour: the band decides what --berry and --ink are.
 */
export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  full = false,
  children,
  ...rest
}) {
  const [hot, setHot] = React.useState(false);
  const [down, setDown] = React.useState(false);

  const base = {
    font: "inherit",
    fontFamily: "var(--font-sans)",
    fontSize: FS[size],
    fontWeight: 500,
    lineHeight: 1.2,
    padding: PAD[size],
    borderRadius: "var(--r-card)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.42 : 1,
    transform: down && !disabled ? "translateY(1px)" : "none",
    transition: "background-color var(--dur-state) var(--ease), border-color var(--dur-state) var(--ease), color var(--dur-state) var(--ease), transform 120ms var(--ease)",
  };

  const skins = {
    primary: {
      background: hot && !disabled ? "var(--berry-deep)" : "var(--berry)",
      borderColor: hot && !disabled ? "var(--berry-deep)" : "var(--berry)",
      color: "#FFF",
    },
    secondary: {
      background: hot && !disabled ? "var(--berry-soft)" : "transparent",
      borderColor: hot && !disabled ? "var(--berry)" : "var(--rule)",
      color: hot && !disabled ? "var(--berry)" : "var(--ink)",
    },
    ghost: {
      background: hot && !disabled ? "var(--shade)" : "transparent",
      borderColor: "transparent",
      color: hot && !disabled ? "var(--berry)" : "var(--dim)",
      padding: PAD[size],
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => { setHot(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{ ...base, ...skins[variant] }}
      {...rest}
    >
      {children}
    </button>
  );
}
