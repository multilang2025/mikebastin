import React from "react";
import { Chip } from "../core/Chip.jsx";

const CLUSTERS = [
  { id: "search", numeral: "I", title: "Multilingual search",
    pillars: ["multilingual-seo", "french-seo", "german-seo", "spanish-seo", "dutch-seo", "italian-seo", "portuguese-seo"],
    absorbs: ["global-seo-solutions", "internationalisation", "language-solutions", "multilingual-branding"] },
  { id: "local", numeral: "II", title: "Localisation and translation",
    pillars: ["website-localisation", "translation-services", "app-and-software-localisation"],
    absorbs: ["content-localisation", "localisation-testing", "multilingual-cms-integration", "wordpress-translation-plugin", "localised-e-commerce-integration", "multilingual-ux-ui-design", "business-translation", "medical-translation", "academic-translation", "financial-translation", "legal-translation", "certified-and-sworn", "expert-translation", "transcreation", "app-localisation", "software-internationalisation", "multimedia-localisation"] },
  { id: "ai", numeral: "III", title: "Artificial intelligence",
    pillars: ["ai-consulting", "ai-translation-and-post-editing"], absorbs: ["post-ai-editing"] },
  { id: "support", numeral: "IV", title: "Supporting capability",
    pillars: ["technical-seo", "multilingual-content"],
    absorbs: ["on-page-seo", "keyword-research", "analytics-and-tracking", "english-seo", "link-building", "local-seo", "multilingual-seo-copywriting", "cultural-consulting", "multilingual-sem", "multilingual-social-media-management"] },
];

/** Accordion of clusters: struck slugs above, surviving pillar pages below. */
export function ConsolidationDiagram({ clusters = CLUSTERS, initialOpen = "local" }) {
  const [open, setOpen] = React.useState(initialOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {clusters.map((c) => {
        const isOpen = open === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => setOpen(isOpen ? null : c.id)}
            aria-expanded={isOpen}
            style={{
              width: "100%",
              textAlign: "left",
              font: "inherit",
              color: "var(--ink)",
              cursor: "pointer",
              borderWidth: "0 0 0 2px",
              borderStyle: "solid",
              borderColor: isOpen ? "var(--berry)" : "var(--rule)",
              background: isOpen ? "var(--shade)" : "transparent",
              padding: "16px 12px 16px 20px",
              transition: "all var(--dur-band) var(--ease)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 16px" }}>
              <span className="display" style={{ color: "var(--berry)", fontSize: "1.15rem", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c.numeral}.</span>
              <span className="display" style={{ fontSize: "1.06rem", fontWeight: 600 }}>{c.title}</span>
              <span style={{ marginLeft: "auto", fontSize: ".8rem", color: "var(--dim)", fontVariantNumeric: "tabular-nums" }}>
                {c.absorbs.length + c.pillars.length} to {c.pillars.length}
              </span>
            </div>

            {isOpen && (
              <div style={{ paddingTop: 16 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {c.absorbs.map((a) => <Chip key={a} tone="struck">{a}</Chip>)}
                </div>
                <svg height="18" width="100%" aria-hidden style={{ display: "block", marginBottom: 8 }}>
                  <path d="M 14 0 C 14 12, 30 6, 44 17" fill="none" stroke="var(--berry)" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
                </svg>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.pillars.map((p) => <Chip key={p} tone="outline">/services/{p}/</Chip>)}
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
