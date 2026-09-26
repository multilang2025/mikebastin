import type { CSSProperties, ReactNode } from "react";

/**
 * Decorative animated art for the service page heroes. Same family as the
 * homepage's MarketReach (dotted plate, draw-in lines, travelling spark,
 * slow rotation, breathing pulse) and the same rules: original motifs
 * only, no text, `aria-hidden`, site tokens only, and nothing extra for
 * reduced motion because globals.css already stills every animation.
 *
 * Five motifs rather than twenty one-offs, each chosen from the concepts
 * in docs/svg-animation-ideas.json and parameterised per page, so a new
 * service is one line in ART below rather than a new component.
 *   bridge   streams crossing from one side to the other: markets entered
 *            from outside, one team serving several, several converging
 *   radar    a sweep over a dotted block that keeps finding one pin
 *   rings    counter-rotating orbits with sources travelling to a core
 *   lattice  pages linked in a tree, a crawler walking to the one that ranks
 *   layers   lines of copy on the left rewritten on the right, then checked
 */

type Motif =
  | { kind: "bridge"; from: number; to: number }
  | { kind: "radar" }
  | { kind: "rings"; sources: number }
  | { kind: "lattice" }
  | { kind: "layers"; check?: boolean };

const ART: Record<string, Motif> = {
  "lead-generation": { kind: "bridge", from: 3, to: 1 },
  "multilingual-seo": { kind: "bridge", from: 1, to: 4 },
  "french-seo": { kind: "bridge", from: 3, to: 1 },
  "german-seo": { kind: "bridge", from: 2, to: 1 },
  "spanish-seo": { kind: "bridge", from: 1, to: 3 },
  "dutch-seo": { kind: "bridge", from: 1, to: 2 },
  "italian-seo": { kind: "bridge", from: 2, to: 1 },
  "portuguese-seo": { kind: "bridge", from: 1, to: 2 },
  "local-seo": { kind: "radar" },
  "multilingual-sem": { kind: "rings", sources: 3 },
  "generative-engine-optimization": { kind: "rings", sources: 5 },
  "ai-consulting": { kind: "rings", sources: 4 },
  "website-localisation": { kind: "rings", sources: 2 },
  "technical-seo": { kind: "lattice" },
  "conversion-tracking": { kind: "lattice" },
  "content-marketing": { kind: "lattice" },
  "translation-services": { kind: "layers" },
  "ai-translation-and-post-editing": { kind: "layers", check: true },
  "multilingual-content": { kind: "layers" },
  "app-and-software-localisation": { kind: "layers", check: true },
};

const C = 200;
const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** Points spread evenly around `mid`, `gap` apart. */
const spread = (n: number, mid: number, gap: number) =>
  Array.from({ length: n }, (_, i) => mid + (i - (n - 1) / 2) * gap);

function Plate({ id, shape }: { id: string; shape: "disc" | "card" }) {
  const body =
    shape === "disc" ? <circle cx={C} cy={C} r={186} /> : <rect x={22} y={22} width={356} height={356} rx={18} />;
  return (
    <>
      <defs>
        <pattern id={`${id}-dots`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1.1" className="mr-dot" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="400" height="400" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g className="mr-plate">{body}</g>
      <g mask={`url(#${id}-mask)`} fill={`url(#${id}-dots)`}>
        {body}
      </g>
    </>
  );
}

/** Line that draws itself in once, then carries a looping three-part spark. */
function Wire({ d, i, spark = true }: { d: string; i: number; spark?: boolean }) {
  return (
    <g style={vars({ "--i": i })} fill="none" strokeLinecap="round">
      <path d={d} pathLength={1} className="mr-arc" />
      {spark && (
        <>
          <path d={d} pathLength={1} className="mr-spark mr-tail-long" />
          <path d={d} pathLength={1} className="mr-spark mr-tail-short" />
          <path d={d} pathLength={1} className="mr-spark mr-head" />
        </>
      )}
    </g>
  );
}

function Target({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="mr-origin" style={vars({ "--i": i })}>
        <circle r="10" className="mr-target" />
        <circle r="15" strokeDasharray="3 4" className="mr-target-outer" />
        <circle r="10" className="mr-halo-pulse" style={vars({ "--i": i })} />
        <circle r="3" className="mr-pin" />
      </g>
    </g>
  );
}

function Node({ x, y, i }: { x: number; y: number; i: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="mr-origin" style={vars({ "--i": i })}>
        <circle r="7" className="mr-halo" />
        <circle r="2.6" className="sh-node" />
      </g>
    </g>
  );
}

function Bridge({ from, to }: { from: number; to: number }) {
  const left = spread(from, C, 78).map((y) => ({ x: 88, y }));
  const right = spread(to, C, 78).map((y) => ({ x: 312, y }));
  const pairs = left.flatMap((a) => right.map((b) => [a, b] as const));
  return (
    <>
      <Plate id="sh-br" shape="disc" />
      <line x1={C} y1={40} x2={C} y2={360} className="sh-divide" />
      {pairs.map(([a, b], i) => {
        const lift = Math.min(a.y, b.y) - 70 + i * 6;
        return <Wire key={i} i={i} d={`M${a.x} ${a.y} Q${C} ${lift} ${b.x} ${b.y}`} />;
      })}
      {left.map((p, i) => <Node key={`l${i}`} {...p} i={i} />)}
      {right.map((p, i) => <Target key={`r${i}`} {...p} i={i + left.length} />)}
    </>
  );
}

const RADAR_DOTS: [number, number][] = [
  [118, 132], [150, 262], [246, 292], [300, 226], [96, 214], [214, 108], [320, 154], [176, 318],
];

function Radar() {
  return (
    <>
      <Plate id="sh-rd" shape="disc" />
      <g fill="none">
        {[56, 108, 160].map((r, i) => (
          <circle key={r} cx={C} cy={C} r={r} className="sh-grid" strokeDasharray={i === 2 ? "2 6" : undefined} />
        ))}
        <line x1={C} y1={40} x2={C} y2={360} className="sh-grid" />
        <line x1={40} y1={C} x2={360} y2={C} className="sh-grid" />
      </g>
      <g className="sh-sweep">
        <path d={`M${C} ${C} L${C} ${C - 164} A164 164 0 0 1 ${C + 116} ${C - 116} Z`} className="sh-sweep-fill" />
        <line x1={C} y1={C} x2={C + 116} y2={C - 116} className="sh-sweep-edge" />
      </g>
      {RADAR_DOTS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" className="sh-blip" style={vars({ "--i": i })} />
      ))}
      <Target x={272} y={138} i={2} />
      <circle cx={C} cy={C} r="4" className="mr-core" />
    </>
  );
}

function Rings({ sources }: { sources: number }) {
  const outer = Array.from({ length: sources }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / sources + 0.35;
    return { x: C + Math.cos(a) * 172, y: C + Math.sin(a) * 172 };
  });
  return (
    <>
      <Plate id="sh-rg" shape="disc" />
      {[
        { r: 58, dash: "2 6", sat: 0, cls: "sh-orbit0" },
        { r: 108, dash: "8 7", sat: 2.1, cls: "sh-orbit1" },
        { r: 150, dash: "3 10", sat: 4.2, cls: "sh-orbit2" },
      ].map((o) => (
        <g key={o.r} className={`sh-orbit ${o.cls}`}>
          <circle cx={C} cy={C} r={o.r} fill="none" strokeDasharray={o.dash} className="sh-grid" />
          <circle cx={C + Math.cos(o.sat) * o.r} cy={C + Math.sin(o.sat) * o.r} r="4" className="sh-node" />
        </g>
      ))}
      {outer.map((p, i) => (
        <Wire key={i} i={i} d={`M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${C} ${C}`} />
      ))}
      {outer.map((p, i) => <Node key={`n${i}`} x={p.x} y={p.y} i={i} />)}
      <g transform={`translate(${C} ${C})`}>
        <circle r="12" className="mr-halo" />
        <circle r="12" className="mr-halo-pulse" style={vars({ "--i": 2 })} />
        <circle r="5" className="mr-core" />
      </g>
    </>
  );
}

const PAGES = {
  root: [200, 76],
  a: [112, 170],
  b: [288, 170],
  a1: [66, 272],
  a2: [158, 272],
  b1: [242, 272],
  b2: [334, 272],
  deep: [242, 346],
} as const;

function Lattice() {
  const P = PAGES;
  const links: [keyof typeof P, keyof typeof P][] = [
    ["root", "a"], ["root", "b"], ["a", "a1"], ["a", "a2"], ["b", "b1"], ["b", "b2"],
  ];
  const at = (k: keyof typeof P) => `${P[k][0]} ${P[k][1]}`;
  return (
    <>
      <Plate id="sh-lt" shape="card" />
      {links.map(([s, t], i) => (
        <Wire key={i} i={i} spark={false} d={`M${at(s)} L${at(t)}`} />
      ))}
      <path d={`M${at("a2")} L${at("b1")}`} className="sh-crosslink" />
      <Wire i={2} d={`M${at("root")} L${at("b")} L${at("b1")} L${at("deep")}`} />
      {(Object.keys(P) as (keyof typeof P)[])
        .filter((k) => k !== "deep")
        .map((k, i) => (
          <g key={k} transform={`translate(${P[k][0]} ${P[k][1]})`}>
            <g className="mr-origin" style={vars({ "--i": i })}>
              <rect x={-13} y={-10} width={26} height={20} rx={3} className="sh-page" />
              <line x1={-7} y1={-3} x2={7} y2={-3} className="sh-page-line" />
              <line x1={-7} y1={3} x2={3} y2={3} className="sh-page-line" />
            </g>
          </g>
        ))}
      <Target x={P.deep[0]} y={P.deep[1]} i={4} />
    </>
  );
}

const LINES = [0.92, 0.7, 0.84, 0.58, 0.8, 0.66];

function Layers({ check }: { check?: boolean }) {
  const y0 = 108;
  const gap = 36;
  return (
    <>
      <Plate id="sh-ly" shape="card" />
      {LINES.map((w, i) => (
        <rect key={`s${i}`} x={52} y={y0 + i * gap} width={118 * w} height={9} rx={4.5} className="sh-line-src" />
      ))}
      {LINES.map((w, i) => (
        <rect
          key={`t${i}`}
          x={230}
          y={y0 + i * gap}
          width={118 * (1.08 - w * 0.25)}
          height={9}
          rx={4.5}
          className={`sh-line-out${i === 0 ? " sh-line-lead" : ""}`}
          style={vars({ "--i": i })}
        />
      ))}
      {[0, 2, 4].map((row, i) => {
        const y = y0 + row * gap + 4.5;
        return <Wire key={row} i={i} d={`M${52 + 118 * LINES[row] + 8} ${y} C200 ${y - 26} 200 ${y - 26} 222 ${y}`} />;
      })}
      {check && <rect x={222} y={y0 - 8} width={140} height={25} rx={6} className="sh-scan" />}
    </>
  );
}

export default function ServiceHeroArt({ slug }: { slug: string }) {
  const m = ART[slug];
  if (!m) return null;
  let body: ReactNode;
  switch (m.kind) {
    case "bridge": body = <Bridge from={m.from} to={m.to} />; break;
    case "radar": body = <Radar />; break;
    case "rings": body = <Rings sources={m.sources} />; break;
    case "lattice": body = <Lattice />; break;
    case "layers": body = <Layers check={m.check} />; break;
  }
  return (
    <div className="sh-art" aria-hidden="true">
      <svg viewBox="0 0 400 400" width="100%" height="100%">
        {body}
      </svg>
    </div>
  );
}
