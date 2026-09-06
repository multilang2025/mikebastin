import React from "react";

/** Berry text with the underline that draws in on hover. The shipped .ulink. */
export function TextLink({ href = "#", children, size, weight, external = false, ...rest }) {
  const [hot, setHot] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        position: "relative",
        display: "inline-block",
        color: "var(--berry)",
        textDecoration: "none",
        fontSize: size,
        fontWeight: weight,
      }}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          bottom: -2,
          width: "100%",
          height: 1,
          background: "currentColor",
          transform: hot ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: hot ? "left" : "right",
          transition: "transform .45s var(--ease)",
        }}
      />
    </a>
  );
}
