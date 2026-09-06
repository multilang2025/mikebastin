import React from "react";
import { Chip } from "../core/Chip.jsx";
import { TextLink } from "../actions/TextLink.jsx";

/**
 * The homepage unit. Roman numeral, angle, client shot, body, delivered
 * services, metrics, link into the case study. Alternates side by side.
 */
export function Spread({ project, flip = false }) {
  const p = project || {};
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        alignItems: "center",
        columnGap: 56,
        rowGap: 32,
        borderTop: "1px solid var(--rule)",
        paddingTop: "clamp(48px,7vw,96px)",
        paddingBottom: "clamp(48px,7vw,96px)",
      }}
    >
      <div
        style={{
          position: "relative",
          order: flip ? 2 : 1,
          aspectRatio: "5 / 4",
          overflow: "hidden",
          borderRadius: "3px",
        }}
      >
        {p.shot ? (
          <img
            src={p.shot}
            alt={"The " + p.name + " homepage"}
            loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(135deg, color-mix(in oklab, var(--deep) 88%, black) 0%, var(--deep) 42%, color-mix(in oklab, var(--berry) 40%, var(--deep)) 100%)",
            }}
          >
            <span className="display" style={{ color: "#F5EFE2", fontSize: "clamp(1.15rem,2.2vw,1.75rem)", fontWeight: 600, textShadow: "0 2px 24px rgb(0 0 0 / .4)" }}>
              {p.domain}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 90px rgb(0 0 0 / .35)" }} />
      </div>

      <div style={{ order: flip ? 1 : 2 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 12 }}>
          <span className="display" style={{ color: "var(--berry)", fontSize: "1.3rem", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
            {p.numeral}.
          </span>
          <span className="eyebrow">{p.angle}</span>
        </div>

        <h3 style={{ marginBottom: 16, fontSize: "var(--fs-h3)", fontWeight: 600, lineHeight: 1.1 }}>
          <TextLink href={"/projects/" + p.slug + "/"}>{p.name}</TextLink>
        </h3>

        <p style={{ maxWidth: "46ch", marginTop: 0, marginBottom: 24, fontSize: "1.02rem", color: "var(--dim)" }}>{p.body}</p>

        <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "0 0 28px", padding: 0, listStyle: "none" }}>
          {(p.services || []).map((s) => <li key={s}><Chip>{s}</Chip></li>)}
        </ul>

        <dl style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", margin: 0 }}>
          {(p.metrics || []).map((m) => (
            <div key={m.k}>
              <dt className="display" style={{ color: "var(--berry)", fontSize: "1.5rem", fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{m.v}</dt>
              <dd className="caps" style={{ margin: "6px 0 0" }}>{m.k}</dd>
            </div>
          ))}
        </dl>

        <div style={{ marginTop: 28 }}>
          <TextLink href={"/projects/" + p.slug + "/"} size=".9rem" weight={500}>Read the case study</TextLink>
        </div>
      </div>
    </article>
  );
}
