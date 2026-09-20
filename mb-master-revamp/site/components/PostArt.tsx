/**
 * The illustration on a post card and at the head of a post.
 *
 * What it replaces: `scripts/gen-blog-covers.mjs` rendered 59 PNGs that
 * were the post's own title set on a dark rectangle. On the index that
 * printed every title twice, once in the image and once under it, and on
 * a post page it repeated the h1 immediately above it. It was a caption,
 * not an illustration, which is why the journal read as a wall of text
 * with grey blocks in it.
 *
 * This draws instead, in the site's own surf language (HANDOFF.md's IP
 * boundary: original wave motifs, never borrowed iconography).
 *
 * Two rules make 59 posts look like 59 things rather than one thing:
 *
 *   1. The composition comes from the cluster, so Language markets and
 *      AI and the future of search are recognisably different families.
 *   2. Everything else -- wave phase, amplitude, line count, the accent's
 *      position and the colour mix -- comes from a hash of the slug, so
 *      two posts in one cluster never draw the same picture, and any
 *      given post draws the same picture on every build.
 *
 * Inline SVG on design tokens: no image requests, no generator to keep in
 * sync with lib/posts.ts, correct in both themes, and sharp at any size.
 */

/** xfnv1a. Small, stable across builds, and good enough to decorrelate slugs. */
function seedFrom(slug: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

const W = 1200;
const H = 630;

/** A wave across the full width, at the given vertical centre and shape. */
function wave(y: number, amp: number, phase: number, periods: number): string {
  const step = W / (periods * 2);
  let d = `M0 ${(y + Math.sin(phase) * amp).toFixed(1)}`;
  for (let i = 0; i < periods * 2; i++) {
    const x1 = step * (i + 0.5);
    const x2 = step * (i + 1);
    const y2 = y + Math.sin(phase + (i + 1) * Math.PI) * amp;
    d += ` Q${x1.toFixed(1)} ${(y + Math.sin(phase + (i + 0.5) * Math.PI) * amp * 2.1).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

type Family =
  | "meridians"
  | "bands"
  | "constellation"
  | "strata"
  | "rings"
  | "converge"
  | "ascent";

/**
 * Cluster to composition. An unknown cluster falls through to plain
 * bands rather than throwing, so adding a cluster to lib/posts.ts can
 * never break a build here; it just draws the default until it is given
 * a family of its own.
 */
const FAMILY: Record<string, Family> = {
  "Multilingual SEO": "meridians",
  "Language markets": "bands",
  "AI and the future of search": "constellation",
  "SEO fundamentals": "strata",
  "Language industry": "rings",
  "Multilingual lead generation": "converge",
  "Business and marketing": "ascent",
};

export default function PostArt({
  slug,
  cluster,
  className,
  rounded = false,
}: {
  slug: string;
  cluster?: string;
  className?: string;
  rounded?: boolean;
}) {
  const rnd = seedFrom(slug);
  const family: Family = (cluster && FAMILY[cluster]) || "bands";

  // Drawn once per render, in a fixed order, so the picture is a pure
  // function of the slug.
  const phase = rnd() * Math.PI * 2;
  const amp = 14 + rnd() * 30;
  const periods = 1 + Math.floor(rnd() * 3);
  const lines = 5 + Math.floor(rnd() * 4);
  const drift = rnd();
  const accentX = 0.18 + rnd() * 0.64;
  const tilt = -8 + rnd() * 16;

  const id = `pa-${slug.replace(/[^a-z0-9]/gi, "")}`;

  const body: React.ReactNode[] = [];

  if (family === "meridians" || family === "bands" || family === "strata") {
    const spread = family === "strata" ? 34 : 58;
    // One line in the stack carries the accent colour. Without it a
    // wave-only composition reads as grey texture rather than artwork,
    // which was the whole complaint about the covers this replaces.
    const accentLine = Math.floor(drift * lines);
    for (let i = 0; i < lines; i++) {
      const y = H / 2 + (i - (lines - 1) / 2) * spread;
      const isAccent = i === accentLine;
      body.push(
        <path
          key={`w${i}`}
          d={wave(y, family === "strata" ? amp * 0.4 : amp * (1 - i / (lines * 2)), phase + i * (0.5 + drift), periods)}
          fill="none"
          stroke={isAccent ? "var(--berry)" : "currentColor"}
          strokeWidth={isAccent ? 3.2 : family === "strata" ? 1.6 : 2.4}
          strokeLinecap="round"
          opacity={isAccent ? 0.95 : 0.18 + (i / lines) * 0.5}
        />
      );
    }
  }

  if (family === "meridians") {
    const cx = W * accentX;
    for (let i = 0; i < 4; i++) {
      body.push(
        <ellipse
          key={`m${i}`}
          cx={cx}
          cy={H / 2}
          rx={40 + i * 52}
          ry={190}
          fill="none"
          stroke="var(--berry)"
          strokeWidth="2"
          opacity={0.5 - i * 0.09}
        />
      );
    }
  }

  if (family === "constellation") {
    const pts = Array.from({ length: 7 }, (_, i) => ({
      x: W * (0.1 + (i / 6) * 0.8) + (rnd() - 0.5) * 90,
      y: H * (0.25 + rnd() * 0.5),
    }));
    pts.forEach((p, i) => {
      if (i > 0) {
        body.push(
          <line
            key={`l${i}`}
            x1={pts[i - 1].x}
            y1={pts[i - 1].y}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            strokeWidth="1.6"
            opacity="0.4"
          />
        );
      }
      body.push(
        <circle
          key={`c${i}`}
          cx={p.x}
          cy={p.y}
          r={i % 3 === 0 ? 13 : 7}
          fill="none"
          stroke={i % 3 === 0 ? "var(--berry)" : "currentColor"}
          strokeWidth="2.4"
          opacity={i % 3 === 0 ? 0.9 : 0.55}
        />
      );
    });
    body.push(
      <path
        key="cw"
        d={wave(H * 0.8, amp * 0.5, phase, periods)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
    );
  }

  if (family === "rings") {
    for (let i = 0; i < 5; i++) {
      body.push(
        <circle
          key={`r${i}`}
          cx={W * (0.24 + i * 0.13)}
          cy={H / 2 + Math.sin(phase + i) * 46}
          r={78 + (i % 2) * 26}
          fill="none"
          stroke={i % 2 === 0 ? "var(--berry)" : "currentColor"}
          strokeWidth="2.2"
          opacity={i % 2 === 0 ? 0.6 : 0.35}
        />
      );
    }
  }

  if (family === "converge") {
    const tx = W * accentX;
    const ty = H * 0.5;
    for (let i = 0; i < 11; i++) {
      const y0 = (H / 10) * i;
      body.push(
        <line
          key={`v${i}`}
          x1="0"
          y1={y0}
          x2={tx}
          y2={ty}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity={0.13 + (1 - Math.abs(i - 5) / 5) * 0.4}
        />
      );
    }
    body.push(
      <circle key="vt" cx={tx} cy={ty} r="17" fill="none" stroke="var(--berry)" strokeWidth="3" />
    );
    body.push(
      <circle key="vt2" cx={tx} cy={ty} r="44" fill="none" stroke="var(--berry)" strokeWidth="1.6" opacity="0.45" />
    );
  }

  if (family === "ascent") {
    for (let i = 0; i < 7; i++) {
      const h = 60 + i * (34 + drift * 22);
      body.push(
        <rect
          key={`b${i}`}
          x={W * 0.14 + i * 112}
          y={H - 110 - h}
          width="58"
          height={h}
          rx="4"
          fill="none"
          stroke={i > 4 ? "var(--berry)" : "currentColor"}
          strokeWidth="2.2"
          opacity={i > 4 ? 0.85 : 0.3 + i * 0.07}
        />
      );
    }
    body.push(
      <path
        key="aw"
        d={wave(H * 0.86, amp * 0.45, phase, periods)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.3"
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      style={{ color: "var(--dim)" }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chip)" />
          <stop offset="100%" stopColor="var(--bg)" />
        </linearGradient>
        <clipPath id={`${id}-c`}>
          <rect x="0" y="0" width={W} height={H} rx={rounded ? 10 : 0} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-c)`}>
        <rect x="0" y="0" width={W} height={H} fill="var(--bg)" />
        <rect x="0" y="0" width={W} height={H} fill={`url(#${id})`} />
        <g transform={`rotate(${tilt.toFixed(2)} ${W / 2} ${H / 2})`}>{body}</g>
      </g>
    </svg>
  );
}
