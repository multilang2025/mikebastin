import React from "react";
import { TextLink } from "../actions/TextLink.jsx";
import { Reveal } from "../motion/Reveal.jsx";

const SOCIALS = [
  { href: "https://x.com/mikebastin", label: "X" },
  { href: "https://www.linkedin.com/in/michaelbastin/", label: "LinkedIn" },
  { href: "https://www.google.com/maps?cid=5084624758674071823", label: "Google Business Profile" },
];

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/results/", label: "Results" },
];

/** The one shared footer, and the site's contact block. Always a band-a. */
export function SiteFooter({ address = false, eyebrow = "Clean face, no crowd", heading = "Tell me which language is losing you money.", children }) {
  return (
    <footer id="contact" className="band band-a" style={{ paddingTop: "var(--band-py-sm)", paddingBottom: "var(--band-py-sm)" }}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</p>
          <h2 style={{ maxWidth: "15ch", marginBottom: 32, fontSize: "clamp(1.8rem,4.4vw,3rem)", fontWeight: 600, lineHeight: 1.08 }}>
            {heading}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: "1.05rem", alignItems: "flex-start" }}>
            <TextLink href="mailto:hello@mikebastin.com">hello@mikebastin.com</TextLink>
            <TextLink href="tel:+34671175774">+34 671 17 57 74</TextLink>
            {address && <span style={{ color: "var(--dim)" }}>Calle Rugat 12 to 2, 46021 Valencia, Spain</span>}
          </div>
          {children}
        </Reveal>
        <Reveal i={1}>
          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 32px",
              marginTop: 48,
              paddingTop: 24,
              borderTop: "1px solid var(--rule)",
              fontSize: ".88rem",
              color: "var(--dim)",
            }}
          >
            {LINKS.map((l) => <TextLink key={l.href} href={l.href}>{l.label}</TextLink>)}
            <span style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px", marginLeft: "auto" }}>
              {SOCIALS.map((s) => <TextLink key={s.href} href={s.href} external>{s.label}</TextLink>)}
            </span>
          </nav>
        </Reveal>
      </div>
    </footer>
  );
}
