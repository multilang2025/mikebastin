export default function SpanishMarketFlow() {
  return (
    <div className="smf-art" aria-hidden="true">
      <svg viewBox="0 0 320 520" width="100%" height="100%">
        <defs>
          <pattern id="smf-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="6" cy="6" r="1" className="smf-dot" />
          </pattern>
        </defs>

        <rect x="12" y="12" width="296" height="496" rx="148" fill="url(#smf-dots)" className="smf-plate" />
        <path d="M76 56V464" pathLength="1" className="smf-route" />
        <path d="M76 56V464" pathLength="1" className="smf-signal" />

        {[100, 206, 312, 418].map((y, i) => {
          const endX = 100;
          const textX = 118;
          const market = [
            ["SPAIN", "Madrid"],
            ["MEXICO", "Mexico City"],
            ["COLOMBIA", "Bogotá"],
            ["ARGENTINA", "Buenos Aires"],
          ][i];
          return (
            <g key={market[0]}>
              <path d={`M76 ${y}H${endX}`} className="smf-branch" />
              <circle cx={endX} cy={y} r="5" className="smf-node" />
              <circle cx={endX} cy={y} r="11" className="smf-pulse" style={{ "--i": i } as React.CSSProperties} />
              <text x={textX} y={y - 5} className="smf-country">{market[0]}</text>
              <text x={textX} y={y + 13} className="smf-city">{market[1]}</text>
            </g>
          );
        })}
        <circle cx="76" cy="56" r="9" className="smf-origin" />
        <circle cx="76" cy="464" r="9" className="smf-origin" />
      </svg>
    </div>
  );
}
