/**
 * French and Spanish copy for the portfolio spreads on the FR and ES
 * homepages. Facts are the English ones in lib/projects.ts, said for a
 * French- or Spanish-speaking reader; the case study pages stay English, so
 * these spreads do not link to them. Draft for the owner's review.
 */
export type ProjectCopy = {
  angle: string;
  body: string;
  services: string[];
  metrics: { v: string; k: string }[];
  alt: string;
};

const N = " ";

export const PROJECTS_FR: Record<string, ProjectCopy> = {
  betranslated: {
    angle: "Notre agence, depuis le premier jour",
    body: "Une agence de traduction avec neuf sites nationaux, des États-Unis aux Pays-Bas, chacun positionné séparément sur son marché.",
    services: ["SEO multi-domaines", "Contenu multilingue", "Neuf marchés nationaux"],
    metrics: [
      { v: "9", k: "Domaines nationaux" },
      { v: `20${N}ans`, k: "D’activité" },
    ],
    alt: "Le site BeTranslated sur ordinateur et sur mobile",
  },
  globaprom: {
    angle: "Logiciels conçus avec l’IA",
    body: "Périmètre fixe, prix fixe, livraison en quelques semaines, multilingue dès la première ligne de code. Le portail de suivi des expéditions a retiré les relances de statut du quotidien d’un transitaire.",
    services: ["Logiciel IA", "Multilingue dès la conception", "Périmètre et prix fixes"],
    metrics: [
      { v: "Fixe", k: "Périmètre et prix" },
      { v: "Semaines", k: "De livraison" },
    ],
    alt: "Le site Globaprom sur ordinateur et sur mobile",
  },
  "tx-international-freight": {
    angle: "Fret industriel à Houston",
    body: "SEO technique et contenu pour un transitaire dont les clients cherchent avec le vocabulaire de leur propre secteur. Apprendre ce vocabulaire a été l’essentiel du travail.",
    services: ["SEO technique", "Contenu sectoriel", "Recherche locale à Houston", "Portail de suivi"],
    metrics: [
      { v: "Houston", k: "Pack local" },
      { v: "EN", k: "Un seul marché" },
    ],
    alt: "Le site TX International Freight sur ordinateur et sur mobile",
  },
  c21perdomo: {
    angle: "Immobilier en République dominicaine",
    body: "Quatre langues sur un WordPress headless avec WPML et WooCommerce. Des annonces qui restent justes dans chaque langue, alors que le stock change chaque semaine.",
    services: ["SEO multilingue", "WordPress headless", "WPML et WooCommerce", "Quatre langues"],
    metrics: [
      { v: "4", k: "Langues" },
      { v: "Headless", k: "Architecture" },
    ],
    alt: "Le site Century 21 Perdomo sur ordinateur et sur mobile",
  },
  valenciamove: {
    angle: "S’installer à Valencia, vécu de l’intérieur",
    body: "Plus de mille pages en cinq langues, écrites à partir de l’expérience vécue de l’installation.",
    services: ["Stratégie de contenu", "Cinq langues", "SEO technique", "Site en propre"],
    metrics: [
      { v: `1${N}132`, k: "URL" },
      { v: "5", k: "Langues" },
      { v: "50+", k: "Demandes par mois" },
    ],
    alt: "Le site ValenciaMove sur ordinateur et sur mobile",
  },
  "bemelman-spuiterij": {
    angle: `Thermolaquage aux Pays-Bas, 45${N}ans`,
    body: "Un spécialiste de Noordwijkerhout dont la réputation dépassait sa présence en ligne. Du SEO local néerlandais pour un métier où les acheteurs sont des entreprises et où peu de recherches suffisent à décider.",
    services: ["SEO local néerlandais", "Site sous Divi", "Recherche B2B"],
    metrics: [
      { v: `45${N}ans`, k: "D’activité" },
      { v: "NL", k: "Recherche locale" },
    ],
    alt: "Le site Bemelman Spuiterij sur ordinateur et sur mobile",
  },
  "delaguia-y-luzon": {
    angle: "Cabinet d’avocats à Valencia",
    body: "Droit civil, droit du travail, immigration et fiscalité en Espagne et en France, en quatre langues dont le russe. Du SEO juridique où chaque terme doit tenir face à la lecture d’un avocat.",
    services: ["SEO juridique", "Contenu multilingue", "Quatre langues", "Deux juridictions"],
    metrics: [
      { v: "4", k: "Langues" },
      { v: "2", k: "Juridictions" },
    ],
    alt: "Le site Delaguía y Luzón sur ordinateur et sur mobile",
  },
  matosurf: {
    angle: "Sports de glisse en France",
    body: "Sept sports de glisse, quarante-huit spots français, cent vingt guides.",
    services: ["Stratégie éditoriale", "Architecture de contenu", "Page de méthode EEAT", "Site en propre"],
    metrics: [
      { v: "120+", k: "Guides" },
      { v: "48", k: "Spots" },
    ],
    alt: "Le site Matosurf sur ordinateur et sur mobile",
  },
};

export const PROJECTS_ES: Record<string, ProjectCopy> = {
  betranslated: {
    angle: "Nuestra agencia, desde el primer día",
    body: "Una agencia de traducción con nueve webs nacionales, de Estados Unidos a los Países Bajos, cada una posicionada por separado en su mercado.",
    services: ["SEO multidominio", "Contenido multilingüe", "Nueve mercados nacionales"],
    metrics: [
      { v: "9", k: "Dominios nacionales" },
      { v: "20 años", k: "De actividad" },
    ],
    alt: "La web de BeTranslated en ordenador y en móvil",
  },
  globaprom: {
    angle: "Software propio con IA",
    body: "Alcance cerrado, precio cerrado, entrega en semanas, multilingüe desde la primera línea de código. El portal de seguimiento de envíos quitó las llamadas de estado del día a día de un transitario.",
    services: ["Software con IA", "Multilingüe desde el diseño", "Alcance y precio cerrados"],
    metrics: [
      { v: "Cerrado", k: "Alcance y precio" },
      { v: "Semanas", k: "De entrega" },
    ],
    alt: "La web de Globaprom en ordenador y en móvil",
  },
  "tx-international-freight": {
    angle: "Carga industrial en Houston",
    body: "SEO técnico y contenido para un transitario cuyos clientes buscan con el vocabulario de su propio sector. Aprender ese vocabulario fue la mayor parte del trabajo.",
    services: ["SEO técnico", "Contenido sectorial", "Búsqueda local en Houston", "Portal de seguimiento"],
    metrics: [
      { v: "Houston", k: "Pack local" },
      { v: "EN", k: "Un solo mercado" },
    ],
    alt: "La web de TX International Freight en ordenador y en móvil",
  },
  c21perdomo: {
    angle: "Inmobiliaria en República Dominicana",
    body: "Cuatro idiomas sobre un WordPress headless con WPML y WooCommerce. Fichas de inmuebles que siguen siendo correctas en cada idioma mientras el stock cambia cada semana.",
    services: ["SEO multilingüe", "WordPress headless", "WPML y WooCommerce", "Cuatro idiomas"],
    metrics: [
      { v: "4", k: "Idiomas" },
      { v: "Headless", k: "Arquitectura" },
    ],
    alt: "La web de Century 21 Perdomo en ordenador y en móvil",
  },
  valenciamove: {
    angle: "Mudarse a Valencia, contado desde dentro",
    body: "Más de mil páginas en cinco idiomas, escritas desde la experiencia propia de la mudanza.",
    services: ["Estrategia de contenido", "Cinco idiomas", "SEO técnico", "Web propia"],
    metrics: [
      { v: "1.132", k: "URL" },
      { v: "5", k: "Idiomas" },
      { v: "50+", k: "Consultas al mes" },
    ],
    alt: "La web de ValenciaMove en ordenador y en móvil",
  },
  "bemelman-spuiterij": {
    angle: "Pintura en polvo en los Países Bajos, 45 años",
    body: "Un especialista de Noordwijkerhout cuya reputación iba por delante de su presencia en internet. SEO local neerlandés para un oficio en el que los compradores son empresas y pocas búsquedas bastan para decidir.",
    services: ["SEO local neerlandés", "Web en Divi", "Búsqueda B2B"],
    metrics: [
      { v: "45 años", k: "De actividad" },
      { v: "NL", k: "Búsqueda local" },
    ],
    alt: "La web de Bemelman Spuiterij en ordenador y en móvil",
  },
  "delaguia-y-luzon": {
    angle: "Despacho de abogados en Valencia",
    body: "Derecho civil, laboral, extranjería y fiscal en España y Francia, en cuatro idiomas, incluido el ruso. SEO jurídico en el que cada término tiene que resistir la lectura de un abogado.",
    services: ["SEO jurídico", "Contenido multilingüe", "Cuatro idiomas", "Dos jurisdicciones"],
    metrics: [
      { v: "4", k: "Idiomas" },
      { v: "2", k: "Jurisdicciones" },
    ],
    alt: "La web de Delaguía y Luzón en ordenador y en móvil",
  },
  matosurf: {
    angle: "Deportes de tabla en Francia",
    body: "Siete deportes de tabla, cuarenta y ocho spots franceses, ciento veinte guías.",
    services: ["Estrategia editorial", "Arquitectura de contenido", "Página de método EEAT", "Web propia"],
    metrics: [
      { v: "120+", k: "Guías" },
      { v: "48", k: "Spots" },
    ],
    alt: "La web de Matosurf en ordenador y en móvil",
  },
};
