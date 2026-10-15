/**
 * A line-drawn search results page for the figures band of /projects/: a search
 * bar, then a short list of results with the top one lifted and a small climb
 * beside it. It says "Google" without borrowing the logo or its colours, and
 * uses only the site's own tokens (berry, ink, rule), so it follows both
 * themes. Static, so nothing loops (Declaudify brief). Decorative.
 */
export default function SearchResultsArt({ className }: { className?: string }) {
  const line = { fill: "none", stroke: "var(--rule)", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  const ink = { ...line, stroke: "var(--ink)", opacity: 0.55 } as const;
  const berry = { ...line, stroke: "var(--berry)", strokeWidth: 2 } as const;
  return (
    <svg viewBox="0 0 280 230" className={className} aria-hidden="true" focusable="false">
      {/* window */}
      <rect x="6" y="6" width="268" height="218" rx="16" {...line} fill="var(--shade)" />
      {/* search bar */}
      <rect x="24" y="24" width="232" height="34" rx="17" {...line} fill="var(--bg)" />
      <circle cx="46" cy="41" r="6.5" {...berry} />
      <path d="m51 46 5 5" {...berry} />
      <path d="M66 41h92" {...ink} />
      {/* top result, lifted */}
      <rect x="24" y="74" width="232" height="62" rx="12" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="1.6" />
      <path d="M40 92h70" {...berry} />
      <path d="M40 108h128M40 122h96" {...ink} />
      {/* the climb */}
      <path d="M190 124l14-12 11 7 21-22" {...berry} />
      <path d="M236 97h-9m9 0v9" {...berry} />
      {/* the rest of the page */}
      <path d="M40 156h62M40 170h150M40 184h120" {...line} />
      <path d="M40 202h54M40 216h0" {...line} />
    </svg>
  );
}
