/**
 * The marker that sits beside a step, a stage or a checklist item, in place of
 * a number (owner, 14 Oct 2026: "replace any numbering listings with relevant
 * icons"). Same drawing rules as ServiceIcon: inline SVG, 24-unit box, round
 * caps, no fill, `currentColor`, so it needs no request and follows the theme.
 *
 * The icon is chosen from the step's own words, in English, French and
 * Spanish, so "Free consultation" gets a speech bubble and "Monthly report" a
 * chart without a hand-kept icon field on every list. A step that matches
 * nothing gets the tick, which reads as "done" on any list. A list that already
 * carries an explicit `icon` (the French and Spanish SEO process) passes it as
 * `name` and skips the match.
 *
 * Decorative: the step's title next to it is the accessible name.
 */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: Record<string, React.ReactNode> = {
  consultation: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4.2a2.5 2.5 0 0 1-2-2.3z" />
      <path d="M8 8h8m-8 4h5" />
    </>
  ),
  scope: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4.5h6M8.5 10h7m-7 4h7m-7 4h4" />
    </>
  ),
  research: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18m0-18a15 15 0 0 0 0 18" />
    </>
  ),
  report: (
    <>
      <path d="M4 20V5m0 15h17" />
      <path d="m7 15 4-4 3 2 5-6" />
    </>
  ),
  map: (
    <>
      <path d="m3.5 5 5-2 7 2 5-2v16l-5 2-7-2-5 2z" />
      <path d="M8.5 3v16m7-14v16" />
    </>
  ),
  write: (
    <>
      <path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5z" />
      <path d="m13.8 6.7 3.5 3.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 5.8M18 14.9c1.9.7 3 2.4 3 5.1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4m8-4v4" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.5m0 13V21m9-9h-2.5M5.5 12H3m15.4-6.4-1.8 1.8M7.4 16.6l-1.8 1.8m12.8 0-1.8-1.8M7.4 7.4 5.6 5.6" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1" />
    </>
  ),
  translate: (
    <>
      <path d="M3 6h10M8 4v2m-3.5 0c.5 3.5 3 6 6 7M11.5 6c-.5 3.5-3 6.5-7 8" />
      <path d="m13 20 4-9 4 9m-6.5-3h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.5 3 7.7 7.5 9.5 4.5-1.8 7.5-5 7.5-9.5V6z" />
      <path d="m8.8 12 2.4 2.4 4-4.6" />
    </>
  ),
  money: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.5 9.5v.01M17.5 14.5v.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.6 2.6L16 9.4" />
    </>
  ),
};

/**
 * First match wins, so the order runs from the most specific word to the
 * loosest. Patterns carry the English, French and Spanish stems.
 */
const RULES: [string, RegExp][] = [
  ["consultation", /consult|call\b|appel|llamada|conversation|talk|meet|reuni|réunion|chat|brief(?:ing)?\b|kick-?off|question|discuss|listen/i],
  ["money", /pric|cost|budget|billing|invoice|\bfee\b|quote|devis|prix|tarif|precio|presupuesto|facturaci|factur|payment|pago|paiement|spend|media spend/i],
  ["report", /report|rapport|informe|measur|mesur|medi[ro]|track|analy|dashboard|result|résultat|resultado|kpi|metric|monitor|performance|rank|traffic|trafic|tráfico|conversion/i],
  ["translate", /translat|traduc|locali[sz]|language|langue|idioma|lengua|native|natif|nativo|post-?edit|postéd|posed/i],
  ["calendar", /month|mois|\bmes\b|monthly|mensuel|mensual|weekly|week|semana|semaine|cadence|cadencia|rhythm|rythme|ritmo|schedule|calendrier|calendario|quarter|trimestre|ongoing|continu|cancel|annul|notice|préavis|preaviso|engagement/i],
  ["scope", /scope|périmètre|alcance|proposal|propuesta|proposition|contract|contrat|contrato|agreement|written|écrit|escrit|\bplan\b|\bplano?\b|roadmap|checklist|\blist\b|audit|inventory|inventaire|inventario|document|\bspec\b|brief\b|define|défin|defin|establish|établi|determin/i],
  ["research", /research|recherche|investigaci|keyword|mot-clé|palabra|competitor|concurren|competenci|rival|discover|découv|descubr|find|trouv|encontr|identif|examin|explor|\bgap\b|benchmark|search|búsqueda/i],
  ["map", /map|carte|mapa|market|marché|mercado|structure|estructura|architecture|arquitectura|sitemap|hreflang|geograph|geográf|country|pays|país|region|région|regi[oó]n/i],
  ["write", /writ|rédac|redact|escrib|copy|content|contenu|contenido|draft|brouillon|borrador|\bedit|publish|publi|page|article|artículo|blog|create|créer|crear|produc/i],
  ["gear", /technical|technique|técnic|setup|set up|install|config|implement|implant|integr|intégr|build|constru|construi|launch|lance|lanza|deploy|desplieg|go live|goes live|\blive\b|fixes\b|crawl|speed|schema|code|develop|automat|tool|outil|herramienta|sistema|system|campaign|campagne|campaña|\bads?\b|anunc/i],
  ["link", /link|lien|enlace|backlink|outreach|prensa|press|\bpr\b|authority|autorité|autoridad|citation|\bcita\b/i],
  ["people", /team|équipe|equipo|mike|\bwe\b|nous|nosotros|specialist|spécialiste|especialista|writer|rédacteur|redactor|client|account|dedicated|interlocut|contact|support|soutien|apoyo|respond|répond|respond/i],
  ["target", /goal|objectif|objetivo|outcome|enquir|lead|prospect|demande|solicitud|\bwin|gagn|gana|rank\b|position|posición|growth|croissance|crecimiento|grow|improve|améliorer|mejora/i],
  ["shield", /quality|review|revis|revue|qualité|calidad|accura|précis|precis|check|vérif|verif|\btest|\bsafe|secur|sécur|segur|compliance|conform|privacy|confiden|guarantee|garant/i],
  ["globe", /global|international|world|monde|mundo|everywhere|multi/i],
];

export function stepIconName(text: string | undefined): string {
  if (!text) return "check";
  for (const [name, re] of RULES) if (re.test(text)) return name;
  return "check";
}

export function StepGlyph({ name, text, className = "h-5 w-5" }: { name?: string; text?: string; className?: string }) {
  const key = name && ICONS[name] ? name : stepIconName(text);
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" {...S}>
      {ICONS[key]}
    </svg>
  );
}

/** The round marker used on every step list. */
export default function StepBadge({
  name,
  text,
  size = "md",
  className = "",
}: {
  name?: string;
  text?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <span
      className={`grid ${box} shrink-0 place-items-center rounded-full ${className}`}
      style={{ color: "var(--berry)", background: "var(--berry-soft)" }}
    >
      <StepGlyph name={name} text={text} className={size === "sm" ? "h-[18px] w-[18px]" : "h-5 w-5"} />
    </span>
  );
}

/** One mark per portfolio case, replacing the roman numeral before its name. */
const CASE_ICONS: Record<string, React.ReactNode> = {
  betranslated: ICONS.translate,
  globaprom: ICONS.gear,
  "tx-international-freight": (
    <>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5h4.2l3.3 3.3v2.7h-7.5" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
  c21perdomo: (
    <>
      <path d="m3.5 11 8.5-7 8.5 7" />
      <path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" />
    </>
  ),
  valenciamove: (
    <>
      <path d="M12 21.5s6.5-6.1 6.5-10.6a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21.5 12 21.5z" />
      <circle cx="12" cy="10.7" r="2.4" />
    </>
  ),
  "bemelman-spuiterij": (
    <>
      <rect x="4" y="3.5" width="13" height="5.5" rx="1.5" />
      <path d="M17 6h3v5.5h-8V14m0 0v6.5" />
    </>
  ),
  "delaguia-y-luzon": (
    <>
      <path d="M12 3.5v17M7 20.5h10M5 7h14" />
      <path d="m5 7-2.5 6a2.8 2.8 0 0 0 5 0zM19 7l-2.5 6a2.8 2.8 0 0 0 5 0z" />
    </>
  ),
  matosurf: (
    <>
      <path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M17.5 3.5c-4 1-9 6-11 11l3 1.5c4-2 8-7 8-12.5z" />
    </>
  ),
};

export function CaseMark({ slug }: { slug: string }) {
  return (
    <span
      className="grid h-11 w-11 shrink-0 place-items-center self-center rounded-full"
      style={{ color: "var(--berry)", background: "var(--berry-soft)" }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" focusable="false" {...S}>
        {CASE_ICONS[slug] ?? ICONS.check}
      </svg>
    </span>
  );
}
