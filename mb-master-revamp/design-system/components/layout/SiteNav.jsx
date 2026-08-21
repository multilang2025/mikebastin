import React from "react";
import { TextLink } from "../actions/TextLink.jsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/results/", label: "Results" },
  { href: "/#contact", label: "Contact" },
];

/** Sticky header, 62px, translucent over whichever band scrolls under it. */
export function SiteNav({ links = LINKS, active }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid var(--rule)",
        backdropFilter: "blur(12px)",
        background: "color-mix(in oklab, var(--bg) 82%, transparent)",
      }}
    >
      <nav
        className="shell"
        style={{
          display: "flex",
          height: "var(--nav-h)",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          paddingRight: 70,
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--ink)" }}>
          <span aria-hidden style={{ display: "inline-flex", flexDirection: "column", gap: 3, width: 20, flex: "0 0 auto" }}>
            {[[100, "var(--berry)"], [72, "var(--dim)"], [86, "var(--dim)"], [54, "var(--dim)"]].map(([w, c]) => (
              <i key={w} style={{ display: "block", width: w + "%", height: 2, borderRadius: 1, background: c }} />
            ))}
          </span>
          <span className="display" style={{ fontSize: "1.05rem", fontWeight: 600 }}>Mike Bastin</span>
        </a>
        <ul style={{ display: "flex", alignItems: "center", gap: 24, margin: 0, padding: 0, listStyle: "none", fontSize: ".86rem" }}>
          {links.map((l) => (
            <li key={l.href} style={{ flex: "0 0 auto" }}>
              <TextLink href={l.href} style={active === l.href ? { color: "var(--berry)" } : undefined}>
                {l.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
