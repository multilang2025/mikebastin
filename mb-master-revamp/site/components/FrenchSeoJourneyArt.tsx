import type { CSSProperties } from "react";

const STOPS = [72, 408, 752, 1088];
const BRANCHES = [
  { d: "M62 236H116", x: 62, y: 236 },
  { d: "M184 570H238", x: 238, y: 570 },
  { d: "M62 924H116", x: 62, y: 924 },
];

export default function FrenchSeoJourneyArt() {
  return (
    <div className="fseo-journey-art" aria-hidden="true">
      <svg viewBox="0 0 300 1160" width="100%" height="100%" fill="none">
        <path
          d="M150 24 C92 118 210 184 150 282 S210 348 150 408 C90 500 210 584 150 674 S210 720 150 752 C88 852 208 934 150 1020 S126 1080 150 1136"
          pathLength={1}
          className="fseo-route-base"
        />
        <path
          d="M150 24 C92 118 210 184 150 282 S210 348 150 408 C90 500 210 584 150 674 S210 720 150 752 C88 852 208 934 150 1020 S126 1080 150 1136"
          pathLength={1}
          className="fseo-route-signal"
        />
        {STOPS.map((y, i) => (
          <g key={y} transform={`translate(150 ${y})`} style={{ "--stop": i } as CSSProperties}>
            <path d="M-48 0H-88M48 0H88" className="fseo-branch" />
            <circle r="38" className="fseo-orbit" />
            <circle r="27" className="fseo-stop" />
            <circle r="18" className="fseo-stop-pulse" />
            {i === 0 && (
              <g className="fseo-glyph">
                <circle cx="-2" cy="-3" r="7" />
                <path d="m3 2 6 6" />
              </g>
            )}
            {i === 1 && (
              <g className="fseo-glyph">
                <path d="M-7-9h10l5 5v13H-7zM3-9v5h5M-3 1h8M-3 5h6" />
              </g>
            )}
            {i === 2 && (
              <g className="fseo-glyph">
                <path d="M0 10s8-7 8-12a8 8 0 1 0-16 0c0 5 8 12 8 12Z" />
                <circle cy="-2" r="2.5" />
              </g>
            )}
            {i === 3 && (
              <g className="fseo-glyph">
                <path d="M-9-7h18v13H0l-6 5V6h-3zM-5-2h10M-5 2h7" />
              </g>
            )}
            <circle r="3" className="fseo-core" />
          </g>
        ))}
        {BRANCHES.map(({ d, x, y }) => (
          <g key={y}>
            <path d={d} className="fseo-branch fseo-branch-dotted" />
            <circle cx={x} cy={y} r="4" className="fseo-satellite" />
          </g>
        ))}
      </svg>
    </div>
  );
}
