import { Fragment } from "react";
import MarketReach from "@/components/MarketReach";

/**
 * A post's rendered markdown, with room for the site's own React art.
 *
 * The homepage market map (components/MarketReach.tsx) left the hero on
 * 3 Oct 2026 under the declaudify brief, and the owner asked to recycle it
 * inside the journal. A post places it with the comment
 * `<!-- figure:market-reach -->` on a line of its own; the body is split
 * there and the map drawn as a captioned figure. It joins the scroll reveal
 * and its one-time draw waits until it is in view; nothing in it loops.
 */
const MARKER = /<!--\s*figure:market-reach\s*-->/;

const CAPTION: Record<string, string> = {
  en: "One strategy at the centre and a route out to each market: every language is planned on its own terms and reported on its own numbers.",
  fr: "Une stratégie au centre et une route vers chaque marché\u00a0: chaque langue est planifiée selon ses propres règles et suivie avec ses propres chiffres.",
  es: "Una estrategia en el centro y una ruta hacia cada mercado: cada idioma se planifica con sus propias reglas y se mide con sus propias cifras.",
};

export default function PostBody({ html, locale = "en", className }: { html: string; locale?: string; className: string }) {
  const parts = html.split(MARKER);
  if (parts.length === 1) return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <div className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          <div className="contents" dangerouslySetInnerHTML={{ __html: part }} />
          {i < parts.length - 1 && (
            <figure className="post-fig post-fig-art reveal">
              <MarketReach />
              <figcaption>{CAPTION[locale] ?? CAPTION.en}</figcaption>
            </figure>
          )}
        </Fragment>
      ))}
    </div>
  );
}
