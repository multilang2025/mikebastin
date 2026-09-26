/**
 * The homepage hero's decorative art: a dotted "home base" plate with
 * slow-rotating rings, and curved lines running out to four market points,
 * each carrying a travelling highlight on a loop. Purely decorative and
 * `aria-hidden`, so it carries no text and needs none.
 *
 * Modelled on a technique seen on a client site (delaguialuzon.com):
 * a country silhouette traced once on load, radar-style rings turning
 * slowly behind it, and animated "signal" arcs reaching out from the
 * centre. That page traces Spain's coastline because the firm is
 * Spanish and its clients are diaspora reaching back into Spain. Mike
 * Bastin has no single country to trace: the practice runs from Valencia
 * but sells into several language markets, so the shape here is
 * abstract (a plain dotted disc, no borrowed coastline) and the arcs run
 * outward, market by market, rather than converging inward.
 *
 * The animation vocabulary is the same family: a one-time "draw" on the
 * static arc lines, a three-layer travelling spark (long tail, short
 * tail, bright head) looping on each arc, a breathing pulse at the
 * centre, and a blinking pin plus double pulse wave at each destination.
 * All of it is skipped by the site's existing blanket
 * `prefers-reduced-motion` rule in globals.css, which forces every
 * animation-duration to near zero, so nothing extra was needed here for
 * that.
 */
type Point = { x: number; y: number };

const HUB: Point = { x: 278, y: 302 };

/** Four points, radius market spread from the hub, roughly matching the
 * key markets in CLAUDE.md (Benelux, France, Germany) plus the UK for
 * the primary English-language market the hero copy opens on. No labels:
 * the whole piece is aria-hidden, so text here would help nobody. */
const MARKETS: { p: Point; control: Point }[] = [
  { p: { x: 142, y: 134 }, control: { x: 168, y: 243 } }, // UK
  { p: { x: 241, y: 107 }, control: { x: 225, y: 211 } }, // France
  { p: { x: 340, y: 128 }, control: { x: 350, y: 220 } }, // Benelux
  { p: { x: 379, y: 214 }, control: { x: 355, y: 262 } }, // Germany
];

function arcPath(m: { p: Point; control: Point }) {
  return `M${m.p.x} ${m.p.y} Q${m.control.x} ${m.control.y} ${HUB.x} ${HUB.y}`;
}

export default function MarketReach() {
  return (
    <div className="mr-art" aria-hidden="true">
      <svg viewBox="0 0 480 480" width="100%" height="100%">
        <defs>
          <pattern id="mr-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1.2" className="mr-dot" />
          </pattern>
          <radialGradient id="mr-fade" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="mr-mask">
            <circle cx="240" cy="240" r="228" fill="url(#mr-fade)" />
          </mask>
        </defs>

        <circle cx="240" cy="240" r="228" className="mr-plate" />
        <g mask="url(#mr-mask)">
          <circle cx="240" cy="240" r="228" fill="url(#mr-dots)" />
          <g transform={`translate(${HUB.x} ${HUB.y})`} fill="none">
            <circle r="64" strokeDasharray="2 6" className="mr-ring mr-ring0" />
            <circle r="128" strokeDasharray="8 7" className="mr-ring mr-ring1" />
            <circle r="188" strokeDasharray="3 10" className="mr-ring mr-ring2" />
          </g>
        </g>

        <g fill="none" strokeLinecap="round">
          {MARKETS.map((m, i) => (
            <g key={i} style={{ "--i": i } as React.CSSProperties}>
              <path d={arcPath(m)} pathLength={1} className="mr-arc" />
              <path d={arcPath(m)} pathLength={1} className="mr-spark mr-tail-long" />
              <path d={arcPath(m)} pathLength={1} className="mr-spark mr-tail-short" />
              <path d={arcPath(m)} pathLength={1} className="mr-spark mr-head" />
            </g>
          ))}
        </g>

        {MARKETS.map((m, i) => (
          <g
            key={i}
            transform={`translate(${m.p.x} ${m.p.y})`}
            className="mr-origin"
            style={{ "--i": i } as React.CSSProperties}
          >
            <circle r="9" className="mr-target" />
            <circle r="13" className="mr-target-outer" />
            <circle r="9" className="mr-halo-pulse" style={{ "--i": i } as React.CSSProperties} />
            <circle r="2.6" className="mr-pin" />
          </g>
        ))}

        <g transform={`translate(${HUB.x} ${HUB.y})`}>
          <circle r="10" className="mr-halo" />
          <circle r="10" className="mr-halo-pulse" style={{ "--i": 4 } as React.CSSProperties} />
          <circle r="4.5" className="mr-core" />
        </g>
      </svg>
    </div>
  );
}
