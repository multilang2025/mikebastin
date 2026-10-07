const T = {
  en: {
    title: "One multilingual SEO plan across language markets",
    desc: "A central search strategy connects English, French, Spanish and Dutch markets, representing one coordinated plan with native market work.",
    market: "Market",
    caption: "One coordinated SEO plan",
  },
  fr: {
    title: "Un plan de SEO multilingue pour tous les marchés linguistiques",
    desc: "Une stratégie de recherche centrale relie les marchés anglais, français, espagnol et néerlandais : un plan coordonné, avec un travail natif sur chaque marché.",
    market: "Marché",
    caption: "Un plan SEO coordonné",
  },
  es: {
    title: "Un plan de SEO multilingüe para todos los mercados lingüísticos",
    desc: "Una estrategia de búsqueda central conecta los mercados inglés, francés, español y neerlandés: un plan coordinado, con trabajo nativo en cada mercado.",
    market: "Mercado",
    caption: "Un plan SEO coordinado",
  },
} as const;

export default function MarketFlowGraphic({ locale = "en" }: { locale?: "en" | "fr" | "es" }) {
  const t = T[locale];
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-labelledby="market-flow-title market-flow-description"
      className="market-flow-art mx-auto w-full max-w-[440px]"
    >
      <title id="market-flow-title">{t.title}</title>
      <desc id="market-flow-description">{t.desc}</desc>

      <path className="market-flow-path" d="M200 150 C155 128 122 103 88 74" />
      <path className="market-flow-path" d="M200 150 C245 128 278 103 312 74" />
      <path className="market-flow-path" d="M200 150 C155 172 122 197 88 226" />
      <path className="market-flow-path" d="M200 150 C245 172 278 197 312 226" />

      <g className="market-node">
        <circle cx="76" cy="64" r="36" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="76" y="61" textAnchor="middle" className="market-flow-code">EN</text>
        <text x="76" y="76" textAnchor="middle" className="market-flow-label">{t.market}</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".2s" }}>
        <circle cx="324" cy="64" r="36" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="324" y="61" textAnchor="middle" className="market-flow-code">FR</text>
        <text x="324" y="76" textAnchor="middle" className="market-flow-label">{t.market}</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".4s" }}>
        <circle cx="76" cy="236" r="36" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="76" y="233" textAnchor="middle" className="market-flow-code">ES</text>
        <text x="76" y="248" textAnchor="middle" className="market-flow-label">{t.market}</text>
      </g>
      <g className="market-node" style={{ animationDelay: ".6s" }}>
        <circle cx="324" cy="236" r="36" fill="var(--berry-soft)" stroke="var(--berry)" strokeWidth="2" />
        <text x="324" y="233" textAnchor="middle" className="market-flow-code">NL</text>
        <text x="324" y="248" textAnchor="middle" className="market-flow-label">{t.market}</text>
      </g>

      <rect x="128" y="112" width="144" height="76" rx="12" fill="var(--bg)" stroke="var(--rule)" strokeWidth="2" />
      <path d="M153 137h94M153 151h68M153 165h78" stroke="var(--dim)" strokeWidth="4" strokeLinecap="round" opacity=".65" />
      <circle cx="246" cy="151" r="11" fill="var(--berry)" />
      <path d="m241 151 4 4 7-8" fill="none" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="200" y="207" textAnchor="middle" className="market-flow-caption">{t.caption}</text>
    </svg>
  );
}
