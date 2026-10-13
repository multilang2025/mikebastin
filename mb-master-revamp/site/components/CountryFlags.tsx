import type { CSSProperties, ReactNode } from "react";

/**
 * BeTranslated's ten country domains (owner, 7 Oct 2026: "an svg animation
 * with the flags of all my ccTLDs"), drawn as a hub (.com) with the nine
 * country sites around it. Owner-requested exception to the svg-animation
 * skill's abstract-only rule: real flags, each drawn here from plain shapes,
 * nothing copied from an icon set. Flag colours are the flags' own, which is
 * why this one component carries literal colours instead of theme tokens.
 *
 * Motion plays once (declaudify brief, no loops): lines draw out from the
 * hub, then each flag settles in, paused until the Reveal wrapper scrolls
 * into view. Reduced motion is handled globally in globals.css.
 */

const W = 64;
const H = 42;

const C = {
  white: "#FFFFFF",
  black: "#1A1A1A",
  usRed: "#B22234",
  usBlue: "#3C3B6E",
  caRed: "#D52B1E",
  ukBlue: "#012169",
  ukRed: "#C8102E",
  beYellow: "#FDDA24",
  beRed: "#EF3340",
  frBlue: "#0055A4",
  frRed: "#EF4135",
  esRed: "#AA151B",
  esYellow: "#F1BF00",
  deRed: "#DD0000",
  deGold: "#FFCE00",
  nlRed: "#AE1C28",
  nlBlue: "#21468B",
  itGreen: "#009246",
  itRed: "#CE2B37",
};

const vertical = (a: string, b: string, c: string) => (
  <>
    <rect width={W / 3} height={H} fill={a} />
    <rect x={W / 3} width={W / 3} height={H} fill={b} />
    <rect x={(2 * W) / 3} width={W / 3} height={H} fill={c} />
  </>
);

const horizontal = (a: string, b: string, c: string, middle = 1 / 3) => {
  const edge = (1 - middle) / 2;
  return (
    <>
      <rect width={W} height={H * edge} fill={a} />
      <rect y={H * edge} width={W} height={H * middle} fill={b} />
      <rect y={H * (edge + middle)} width={W} height={H * edge} fill={c} />
    </>
  );
};

const STRIPE = H / 13;

const FLAGS: Record<string, ReactNode> = {
  us: (
    <>
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} y={i * STRIPE} width={W} height={STRIPE} fill={i % 2 ? C.white : C.usRed} />
      ))}
      <rect width={26} height={STRIPE * 7} fill={C.usBlue} />
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={3 + (i % 5) * 5} cy={3 + Math.floor(i / 5) * 5.4} r={0.9} fill={C.white} />
      ))}
    </>
  ),
  ca: (
    <>
      <rect width={W} height={H} fill={C.white} />
      <rect width={16} height={H} fill={C.caRed} />
      <rect x={48} width={16} height={H} fill={C.caRed} />
      <path
        transform="translate(22 11)"
        fill={C.caRed}
        d="M10 1 L11.6 4.6 L13.4 3.8 L12.6 8 L15.4 5.6 L16.2 7.4 L18.6 6.8 L17.6 10 L19 10.8 L14.2 14.4 L14.8 16 L10.6 15.4 L10.6 19 L9.4 19 L9.4 15.4 L5.2 16 L5.8 14.4 L1 10.8 L2.4 10 L1.4 6.8 L3.8 7.4 L4.6 5.6 L7.4 8 L6.6 3.8 L8.4 4.6 Z"
      />
    </>
  ),
  uk: (
    <>
      <rect width={W} height={H} fill={C.ukBlue} />
      <path d={`M0 0 L${W} ${H} M0 ${H} L${W} 0`} stroke={C.white} strokeWidth={8} />
      <path d={`M0 0 L${W} ${H} M0 ${H} L${W} 0`} stroke={C.ukRed} strokeWidth={2.6} />
      <rect y={15} width={W} height={12} fill={C.white} />
      <rect x={26} width={12} height={H} fill={C.white} />
      <rect y={17.5} width={W} height={7} fill={C.ukRed} />
      <rect x={28.5} width={7} height={H} fill={C.ukRed} />
    </>
  ),
  be: vertical(C.black, C.beYellow, C.beRed),
  fr: vertical(C.frBlue, C.white, C.frRed),
  es: horizontal(C.esRed, C.esYellow, C.esRed, 1 / 2),
  de: horizontal(C.black, C.deRed, C.deGold),
  nl: horizontal(C.nlRed, C.white, C.nlBlue),
  it: vertical(C.itGreen, C.white, C.itRed),
};

/** Clockwise from the top: the English-speaking markets, then Europe. */
const ORDER = ["uk", "nl", "de", "it", "es", "fr", "be", "us", "ca"];

const CX = 360;
const CY = 200;
const RX = 288;
const RY = 148;
const HUB = 36;

export default function CountryFlags() {
  const points = ORDER.map((code, i) => {
    const a = ((-90 + i * 40) * Math.PI) / 180;
    return { code, i, x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a), a };
  });

  return (
    <svg
      viewBox="0 0 720 400"
      className="cf-art block h-auto w-full"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="cf-clip">
          <rect width={W} height={H} rx={4} />
        </clipPath>
      </defs>

      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="var(--rule)" strokeDasharray="2 6" />

      {points.map((p) => (
        <path
          key={`l-${p.code}`}
          className="cf-line cf-a"
          style={{ "--i": p.i } as CSSProperties}
          pathLength={1}
          d={`M${(CX + (HUB + 6) * Math.cos(p.a)).toFixed(1)} ${(CY + (HUB + 6) * Math.sin(p.a)).toFixed(1)} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`}
          fill="none"
          stroke="var(--dim)"
          strokeWidth={1}
          strokeOpacity={0.55}
        />
      ))}

      <g className="cf-pop cf-a" style={{ "--i": -3 } as CSSProperties}>
        <circle cx={CX} cy={CY} r={HUB} fill="var(--chip)" stroke="var(--berry)" strokeWidth={2} />
        <ellipse cx={CX} cy={CY} rx={HUB * 0.45} ry={HUB} fill="none" stroke="var(--berry)" strokeWidth={1.2} />
        <ellipse cx={CX} cy={CY} rx={HUB} ry={HUB * 0.38} fill="none" stroke="var(--berry)" strokeWidth={1.2} />
        <line x1={CX} y1={CY - HUB} x2={CX} y2={CY + HUB} stroke="var(--berry)" strokeWidth={1.2} />
      </g>

      {points.map((p) => (
        <g key={p.code} transform={`translate(${(p.x - W / 2).toFixed(1)} ${(p.y - H / 2).toFixed(1)})`}>
          <g className="cf-pop cf-a" style={{ "--i": p.i } as CSSProperties}>
            <g clipPath="url(#cf-clip)">{FLAGS[p.code]}</g>
            <rect width={W} height={H} rx={4} fill="none" stroke="var(--rule)" strokeWidth={1} />
          </g>
        </g>
      ))}
    </svg>
  );
}
