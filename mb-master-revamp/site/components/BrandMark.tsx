/**
 * The Mike Bastin mark (the MB wave with its small globe), shared by the
 * header and the footer so the two can never drift apart. Inline rather
 * than a file, so it reads the theme's --mark and --bg (see the note in
 * SiteNav where it was first drawn). Replaced the footer's plain wave on
 * 3 Oct 2026 (owner: "replace the wave").
 */
export default function BrandMark({ width = 49, className = "shrink-0" }: { width?: number; className?: string }) {
  return (
    <svg
      width={width}
      height={Math.round((width * 60) / 122)}
      viewBox="0 0 122 60"
      aria-hidden
      className={className}
    >
      <g fill="none" stroke="var(--mark)" strokeWidth="0.7" opacity=".9">
        <circle cx="87" cy="20" r="10" />
        <path d="M77 20 H97 M79.2 13.6 H94.8 M79.2 26.4 H94.8" />
        <path d="M87 10 C 80.6 14, 80.6 26, 87 30 M87 10 C 93.4 14, 93.4 26, 87 30" />
        <path d="M87 10 C 83.6 14, 83.6 26, 87 30 M87 10 C 90.4 14, 90.4 26, 87 30" />
      </g>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9">
        <path
          stroke="var(--mark)"
          d="M38 12 C 42 6, 48 6, 52 13 C 57 23, 63 35, 71 42 C 81 49, 92 52, 100 50 C 110 47, 115 40, 112 33 C 110 29, 105 28, 99 28"
        />
        <path
          stroke="var(--bg)"
          strokeWidth="13"
          d="M53 49 C 58 45, 64 37, 71 27"
        />
        <path
          stroke="var(--mark)"
          d="M4 53 C 9 39, 17 17, 27 9 C 33 4, 41 22, 53 49 C 58 45, 64 37, 71 27 C 79 16, 90 9, 100 9 C 110 9, 116 16, 113 23 C 110 27, 105 28, 99 28"
        />
      </g>
    </svg>
  );
}
