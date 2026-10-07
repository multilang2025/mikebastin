export default function ValenciaMarketGraphic() {
  return (
    <svg
      viewBox="0 0 400 320"
      role="img"
      aria-labelledby="valencia-market-title valencia-market-description"
      className="market-flow-art mx-auto w-full max-w-[440px]"
    >
      <title id="valencia-market-title">Desde Valencia, SEO para cada mercado</title>
      <desc id="valencia-market-description">
        Valencia conecta con Francia, Alemania, Países Bajos y el Reino Unido
        mediante páginas adaptadas a cada mercado.
      </desc>

      <path className="market-flow-path" d="M168 132 C140 112 116 94 100 82" />
      <path className="market-flow-path" d="M232 132 C260 112 284 94 300 82" />
      <path className="market-flow-path" d="M168 188 C140 208 116 226 100 238" />
      <path className="market-flow-path" d="M232 188 C260 208 284 226 300 238" />

      <g className="market-node">
        <circle cx="70" cy="65" r="43" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="70" y="63" textAnchor="middle" className="market-flow-code">FR</text>
        <text x="70" y="77" textAnchor="middle" className="market-flow-label">Francia</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".2s" }}>
        <circle cx="330" cy="65" r="43" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="330" y="63" textAnchor="middle" className="market-flow-code">DE</text>
        <text x="330" y="77" textAnchor="middle" className="market-flow-label">Alemania</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".4s" }}>
        <circle cx="70" cy="255" r="43" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="70" y="253" textAnchor="middle" className="market-flow-code">NL</text>
        <text x="70" y="267" textAnchor="middle" className="market-flow-label">Países Bajos</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".6s" }}>
        <circle cx="330" cy="255" r="43" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="330" y="253" textAnchor="middle" className="market-flow-code">UK</text>
        <text x="330" y="267" textAnchor="middle" className="market-flow-label">Reino Unido</text>
      </g>

      <rect x="145" y="120" width="110" height="80" rx="12" fill="var(--bg)" stroke="var(--rule)" strokeWidth="2" />
      <circle cx="200" cy="143" r="5" fill="var(--berry)" />
      <text x="200" y="164" textAnchor="middle" className="market-flow-code">VALENCIA</text>
      <text x="200" y="181" textAnchor="middle" className="market-flow-label">SEO por mercado</text>
    </svg>
  );
}
