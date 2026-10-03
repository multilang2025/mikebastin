import { getPostsForLocale, type LocalePost } from "@/lib/posts";

/**
 * Topic pages for the French and Spanish journals: the same job as
 * /blog/topics/<slug>/ in English, with editorial groupings of their own.
 * The English clusters (CLUSTERS in lib/posts.ts) name English posts, and
 * the FR and ES journals are a different set, so each locale lists its own.
 *
 * Copy is a draft for the owner's review. A post missing from every topic
 * still shows on the locale's blog index.
 */
export type LocaleTopic = {
  locale: "fr" | "es";
  slug: string;
  name: string;
  heading: string;
  /** Search title when `heading` runs over 60 characters (<= 60). */
  metaTitle?: string;
  blurb: string;
  /** The service page the topic feeds, and its link label. */
  service: { href: string; label: string };
  posts: string[];
};

const TOPICS: LocaleTopic[] = [
  {
    locale: "fr",
    slug: "seo-international",
    name: "SEO international",
    metaTitle: "SEO international : choisir son partenaire par marché",
    heading: "SEO international : choisir le partenaire qui fait vendre chaque langue",
    blurb:
      "Ce qu’un consultant, un expert ou une agence apporte à un site qui vend dans plusieurs langues, et comment choisir le partenaire qui convient à votre marché.",
    service: { href: "/fr/services/seo/", label: "SEO international" },
    posts: [
      "agence-seo-internationale",
      "consultant-referencement-international",
      "expert-en-seo-international",
      "seo-en-belgique",
      "seo-allemand-bonnes-pratiques",
      "localiser-contenu-en-allemand",
      "netlinking-en-espagne",
      "strategie-marketing-international",
      "marque-internationale",
      "seo-technique-allemagne",
    ],
  },
  {
    locale: "fr",
    slug: "seo-multilingue",
    name: "SEO multilingue",
    heading: "SEO multilingue\u00a0: les réglages qui additionnent vos langues",
    blurb:
      "Les réglages qui font positionner chaque version de votre site sur son marché : hreflang, structure de domaine, métadonnées et données structurées.",
    service: { href: "/fr/services/referencement-multilingue/", label: "Référencement multilingue" },
    posts: [
      "bonnes-pratiques-seo-multilingue",
      "seo-technique-site-multilingue",
      "optimiser-contenu-site-multilingue",
      "localiser-son-site-points-a-soigner",
      "localisation-interface-utilisateur",
      "checklist-audit-seo-technique",
      "cartographie-intention-de-recherche",
      "outils-maillage-interne",
      "extensions-chrome-seo",
      "outils-test-localisation",
      "analyse-concurrentielle-seo",
      "plateformes-achat-vente-liens",
    ],
  },
  {
    locale: "fr",
    slug: "ia-et-recherche",
    name: "IA et recherche",
    heading: "GEO et recherche vocale : être cité dans les réponses des IA",
    blurb:
      "Comment les moteurs alimentés par l’IA choisissent leurs sources, et ce que cela change pour rédiger vos pages, du SEO au GEO jusqu’à la recherche vocale.",
    service: { href: "/fr/services/conseil-ia/", label: "Conseil en IA" },
    posts: [
      "seo-au-geo",
      "optimisation-pour-les-systemes-ia",
      "recherche-vocale",
      "nouvelles-tendances-du-secteur-des-affaires",
      "strategie-search-everywhere",
      "avenir-du-seo",
      "ia-et-strategies-seo",
      "marketing-ia",
      "chatbots-ia-entreprise",
      "llm-alternatifs",
      "eeat-ou-aeat",
    ],
  },
  {
    locale: "fr",
    slug: "marche-espagnol",
    name: "Marché espagnol",
    metaTitle: "SEO en Espagne : mots-clés, pages et technique",
    heading: "SEO en Espagne : mots-clés, pages et technique pour vendre en espagnol",
    blurb:
      "Ce qui change pour une entreprise qui vend en Espagne : la recherche de mots-clés en espagnol, les pages, les réglages techniques et les marchés à aborder.",
    service: { href: "/fr/services/seo-espagnol/", label: "SEO en Espagne" },
    posts: [
      "marches-espagnols-seo",
      "localisation-mots-cles-espagnol",
      "seo-on-page-espagnol",
      "seo-technique-marche-espagnol",
    ],
  },
  {
    locale: "fr",
    slug: "ia-et-traduction",
    name: "IA et traduction",
    metaTitle: "IA et traduction : de la machine à la localisation",
    heading: "IA et traduction : de la traduction automatique à la localisation",
    blurb:
      "Comment l’IA change le travail de traduction et de localisation, et comment l’employer pour des contenus multilingues de qualité.",
    service: { href: "/fr/services/postedition-ia/", label: "Post-édition par IA" },
    posts: ["ia-traduction-et-localisation", "outils-ia-traduction-automatique", "traduction-anglais-francais", "extensions-chrome-traducteurs"],
  },
  {
    locale: "fr",
    slug: "local-et-mesure",
    name: "Local et mesure",
    metaTitle: "Référencement local et mesure des demandes",
    heading: "Référencement local et mesure : être trouvé, puis compter les demandes",
    blurb:
      "Comment une entreprise locale se fait trouver sur Google Maps, et comment mesurer les résultats avec des outils d’analyse adaptés à son marché.",
    service: { href: "/fr/services/referencement-local/", label: "Référencement local" },
    posts: ["promouvoir-entreprise-locale-google-maps", "alternatives-a-google-analytics", "google-analytics-international", "referencement-local-valencia", "seo-cabinets-avocats"],
  },
  {
    locale: "fr",
    slug: "contenu-et-marketing",
    name: "Contenu et marketing",
    heading: "Contenu et marketing : les canaux qui font revenir vos acheteurs",
    metaTitle: "Contenu et marketing : articles, e-mailing, réseau",
    blurb:
      "Articles de blog, e-mailing, affiliation, publicité et réseau : les leviers qui amènent des demandes à une entreprise qui vend dans plusieurs langues.",
    service: { href: "/fr/services/creation-de-contenu-multilingue/", label: "Création de contenu multilingue" },
    posts: [
      "strategie-de-contenu-ciblee",
      "idees-articles-de-blog",
      "emailing-taux-ouverture-conversions",
      "campagne-google-ads-france",
      "programmes-affiliation",
      "agence-marketing-360",
      "conseiller-marketing-digital",
      "art-du-networking",
      "rediger-parcours-professionnel",
      "economie-des-createurs",
    ],
  },
  {
    locale: "es",
    slug: "seo-multilingue",
    name: "SEO multilingüe",
    heading: "SEO multilingüe: cómo hacer que cada idioma de tu web venda",
    blurb:
      "El SEO técnico, la localización y las diferencias culturales que hacen que cada versión de tu web trabaje para tu negocio en su mercado.",
    service: { href: "/es/services/posicionamiento-multilingue/", label: "Posicionamiento multilingüe" },
    posts: [
      "buenas-practicas-seo-multilingue",
      "seo-tecnico-para-sitios-multilingues",
      "diferencias-culturales-sitios-web-multilingues",
      "herramientas-pruebas-de-localizacion",
      "optimizar-contenido-web-multilingue",
      "localizar-tu-web-puntos-a-cuidar",
      "localizacion-de-interfaz-de-usuario",
      "lista-de-auditoria-seo-tecnica",
      "seo-en-belgica",
      "seo-en-alemania",
      "localizar-contenido-en-aleman",
      "crear-una-marca-global",
      "estrategias-de-marketing-internacional",
      "herramientas-enlazado-interno",
      "extensiones-chrome-seo",
      "seo-tecnico-alemania",
      "plataformas-compraventa-enlaces",
    ],
  },
  {
    locale: "es",
    slug: "ia-y-geo",
    name: "IA y GEO",
    heading: "GEO y respuestas de IA: cómo lograr que te citen",
    blurb:
      "Cómo eligen sus fuentes ChatGPT, Gemini o Perplexity, y qué cambiar en tus contenidos, tus datos estructurados y tu medición para aparecer en sus respuestas.",
    service: { href: "/es/services/consultoria-de-inteligencia-artificial/", label: "Consultoría de inteligencia artificial" },
    posts: [
      "optimizar-para-seo-y-geo",
      "optimizacion-para-sistemas-de-ia",
      "datos-estructurados-schema-optimizacion-geo",
      "medir-rendimiento-geo",
      "sistemas-cualificacion-leads-ia",
      "estrategia-search-everywhere",
      "futuro-del-seo",
      "mapa-de-intencion-de-busqueda",
      "ia-y-estrategias-seo",
      "marketing-con-ia",
      "chatbots-ia-empresas",
      "llm-alternativos",
      "eeat-o-aeat",
      "tendencias-globales-negocio",
    ],
  },
  {
    locale: "es",
    slug: "ia-y-traduccion",
    name: "IA y traducción",
    metaTitle: "IA y traducción: de la máquina a la localización",
    heading: "IA y traducción: de la traducción automática a la localización",
    blurb:
      "Cómo cambia la IA el trabajo de traducción y localización, y cómo usarla en tus contenidos multilingües con buena calidad.",
    service: { href: "/es/services/posedicion-de-ia/", label: "Posedición de IA" },
    posts: ["ia-traduccion-y-localizacion", "herramientas-ia-traduccion-automatica", "traduccion-ingles-frances", "extensiones-chrome-traductores"],
  },
  {
    locale: "es",
    slug: "analisis-de-la-competencia",
    name: "Análisis de la competencia",
    heading: "Análisis de la competencia SEO: qué mirar y con qué herramientas",
    blurb:
      "Cómo identificar a tus competidores reales en Google, revisar su tráfico, sus backlinks y sus posiciones, y convertir lo que ves en un plan.",
    service: { href: "/es/services/optimizacion-seo/", label: "Optimización SEO" },
    posts: [
      "analisis-competitivo-seo",
      "competidores-seo",
      "herramientas-gratuitas-analisis-competitivo",
      "analizar-trafico-web-competencia",
      "analizar-backlinks-competidores",
      "rastrear-posiciones-de-keywords-de-competidores",
      "alternativas-a-google-analytics",
      "google-analytics-marketing-internacional",
    ],
  },
  {
    locale: "es",
    slug: "seo-local",
    name: "SEO local",
    heading: "SEO local en España: enlaces y Perfil de Empresa de Google",
    blurb:
      "Cómo ganar visibilidad en las búsquedas de tu zona: enlaces de editores españoles y un Perfil de Empresa de Google bien cuidado.",
    service: { href: "/es/services/seo-local/", label: "SEO local" },
    posts: ["link-building-local-en-espana", "optimizar-perfil-de-empresa-de-google", "promocionar-negocio-local-google-maps-valencia", "posicionamiento-web-valencia", "seo-despachos-de-abogados"],
  },
  {
    locale: "es",
    slug: "contenido-y-marketing",
    name: "Contenido y marketing",
    heading: "Contenido y marketing: los canales que traen a tus compradores",
    metaTitle: "Contenido y marketing: artículos, email y networking",
    blurb:
      "Artículos de blog, email marketing, afiliación, publicidad y networking: las palancas que traen consultas a una empresa que vende en varios idiomas.",
    service: { href: "/es/services/redaccion-seo-multilingue/", label: "Redacción SEO multilingüe" },
    posts: [
      "estrategia-de-contenido-segmentada",
      "ideas-para-articulos-de-blog",
      "email-marketing-tasa-apertura-conversiones",
      "campanas-google-ads-francia",
      "programas-de-afiliados",
      "agencia-marketing-360",
      "asesor-marketing-digital",
      "arte-del-networking",
      "redactar-trayectoria-profesional",
      "economia-de-los-creadores",
    ],
  },
];

export const topicPath = (locale: "fr" | "es", slug: string) =>
  `/${locale}/blog/${locale === "fr" ? "sujets" : "temas"}/${slug}/`;

export const localeTopics = (locale: "fr" | "es") => TOPICS.filter((t) => t.locale === locale);

export const localeTopic = (locale: "fr" | "es", slug: string) =>
  TOPICS.find((t) => t.locale === locale && t.slug === slug);

/** The topic's posts that are live, in the order the topic lists them. */
export function topicPosts(topic: LocaleTopic): LocalePost[] {
  const live = new Map(getPostsForLocale(topic.locale).map((p) => [p.slug, p]));
  return topic.posts.map((s) => live.get(s)).filter((p): p is LocalePost => Boolean(p));
}

/** The topic a post is filed under in its own locale, if any. */
export function topicForPost(locale: "fr" | "es", slug: string): LocaleTopic | undefined {
  return TOPICS.find((t) => t.locale === locale && t.posts.includes(slug));
}
