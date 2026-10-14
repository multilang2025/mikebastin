/**
 * The French and Spanish case study pages (owner, 12 Oct 2026: "translate
 * the case studies"). The hero lines, services, metrics and image alt text
 * come from lib/projects-locale.ts, already written for the homepage cards;
 * this file holds the rest of each page. Facts are the English ones in
 * lib/projects.ts, figures included, written with each market's separators.
 * The evidence figures are the screenshot figures the owner supplied for the
 * case study (CLAUDE.md, the one exception to the per-client figures rule);
 * the May to July Search Console figures stay out, as in English.
 * Draft for the owner's review, like every FR and ES page.
 */
export type EvidenceCopy = { alt: string; caption: string; heading: string; text: string };

export type CaseStudyCopy = {
  metaTitle: string;
  metaDescription: string;
  problem: string;
  work: string;
  outcome: string;
  /** Country names, in the order of `countries` in lib/projects.ts. */
  countries?: string[];
  /** In the order of `evidence` in lib/projects.ts. */
  evidence?: EvidenceCopy[];
};

/** French typography: no-break space before : ; ? ! and as the thousands separator. */
const N = " ";

export const CASES_FR: Record<string, CaseStudyCopy> = {
  betranslated: {
    metaTitle: "BeTranslated, étude de cas multi-domaines",
    metaDescription: "Vingt ans à diriger une agence de traduction sur dix domaines nationaux, chacun positionné sur son propre marché. Voyez ce que cette rigueur demande.",
    problem: `Une agence de traduction qui vend sur dix marchés a besoin de dix campagnes SEO, chacune construite pour son marché. Chaque domaine national (.com, .us, .ca, .co.uk, .be, .fr, .es, .de, .nl, .it) a ses propres concurrents, ses propres habitudes de recherche et ses propres signaux de confiance${N}: chacun est donc géré comme un site à part entière, construit pour tenir sa place face aux concurrents locaux.`,
    work: `Mike a fondé l’agence et la dirige depuis plus de deux décennies. Chaque domaine régional bénéficie d’un travail de SEO technique qui lui est propre${N}: des sitemaps et des groupes hreflang distincts, et une recherche de mots-clés propre à chaque marché, construite à partir des recherches de ce marché.`,
    outcome: "Dix sites nationaux, chacun positionné sur les termes de son marché, pour une agence toujours en activité depuis plus de deux décennies.",
    countries: ["International", "États-Unis", "Canada", "Royaume-Uni", "Belgique", "France", "Espagne", "Allemagne", "Pays-Bas", "Italie"],
  },
  globaprom: {
    metaTitle: "Globaprom, étude de cas logiciel avec l’IA",
    metaDescription: "Périmètre fixe, prix fixe, livraison en quelques semaines. Découvrez le portail de suivi qui a supprimé les relances de statut du quotidien d’un transitaire.",
    problem: "Les petites entreprises qui ont besoin d’un logiciel propre à leur activité veulent un périmètre fixe, un prix sur lequel elles peuvent compter et un outil qui colle exactement à leur façon de travailler. Une entreprise qui travaille en plusieurs langues dès le premier jour a aussi besoin d’un outil multilingue d’emblée.",
    work: "Un développement assisté par l’IA, à périmètre et prix fixes, livré en quelques semaines et multilingue dès la première ligne de code. La base technique est Next.js avec Payload CMS.",
    outcome: "Un portail de suivi des expéditions pour TX International Freight, qui a supprimé les relances manuelles hebdomadaires, une plateforme interne pour le rapprochement hebdomadaire de l’équipe, et le site multilingue, avec son outil de suivi, qui publie les annonces immobilières de Century 21 Perdomo.",
  },
  "tx-international-freight": {
    metaTitle: "TX International Freight, étude de cas",
    metaDescription: "SEO technique et contenu pour un transitaire de Houston, fondés sur le vocabulaire que ses acheteurs utilisent, appris directement auprès des professionnels du métier.",
    problem: `Les acheteurs de fret industriel cherchent à leur manière, différente de celle des particuliers. Les termes qui traduisent une intention commerciale relèvent du jargon du secteur${N}: la recherche de mots-clés part du vocabulaire du métier pour correspondre aux recherches réelles.`,
    work: "Un SEO technique et un contenu fondés sur le vocabulaire qu’emploient vraiment les acheteurs de fret industriel de Houston, appris directement auprès du secteur.",
    outcome: "Une présence dans le pack local de Houston sur les recherches de fret industriel, pour un client avec qui nous travaillons depuis près de quinze ans.",
  },
  c21perdomo: {
    metaTitle: "Century 21 Perdomo, étude de cas",
    metaDescription: "Quatre langues tenues à jour sur un WordPress headless avec WPML et WooCommerce, pour des annonces immobilières qui changent chaque semaine. Voyez comment.",
    problem: `Les annonces immobilières changent chaque semaine${N}: un bien se vend, un prix bouge, un statut change. Avec quatre langues, chaque changement doit être répercuté dans les quatre versions à la fois, et une architecture WordPress et WooCommerce headless fait de cette cohérence un enjeu technique autant qu’éditorial.`,
    work: "Une couverture en anglais, français, espagnol et allemand sur une pile WordPress headless, WPML et WooCommerce, avec le site multilingue et son outil de suivi développés par Globaprom. Un SEO mené langue par langue, construit à partir des recherches de chaque marché.",
    outcome: "Quatre langues tenues justes face à un stock qui tourne chaque semaine, sur un site immobilier en production.",
  },
  valenciamove: {
    metaTitle: "ValenciaMove, étude de cas",
    metaDescription: "Plus de mille pages en cinq langues, écrites après un déménagement à Valencia vécu en personne, avec des détails concrets sur chaque page.",
    problem: "Mikebastin.com publiait autrefois des contenus sur l’installation à Valencia à côté de ses pages de conseil SEO, sous un seul domaine, et chaque sujet méritait son propre site.",
    work: "Plus de mille pages en cinq langues (anglais, français, espagnol, néerlandais, italien), écrites à partir d’une installation vécue en personne.",
    outcome: `1${N}132 URL en ligne dans cinq langues. En six mois, le site est passé d’un trafic de recherche quasi nul à environ 200 clics par jour${N}: 17${N}400 clics et 1,63 million d’impressions d’avril à octobre 2026, et plus de cinquante demandes par mois.`,
    evidence: [
      {
        alt: `Google Search Console pour valenciamove.com sur six mois${N}: 17,4${N}k clics et 1,63${N}M d’impressions, des clics quotidiens passés de presque zéro en avril 2026 à environ 200 en septembre`,
        caption: "Google Search Console, valenciamove.com, d’avril à octobre 2026.",
        heading: "ValenciaMove est passé de son lancement à environ 200 clics par jour",
        text: `17${N}400 clics et 1,63 million d’impressions en six mois, en partant de presque rien en avril. ValenciaMove est notre propre site, géré comme nous gérons celui d’un client.`,
      },
    ],
  },
  "bemelman-spuiterij": {
    metaTitle: "Bemelman Spuiterij, étude de cas",
    metaDescription: "Un spécialiste néerlandais du thermolaquage, quarante-cinq ans de réputation et une présence en ligne à construire. Voyez le SEO local conçu pour son marché.",
    problem: "Une entreprise forte de quarante-cinq ans de réputation avait besoin d’une présence en ligne à la hauteur, pour que les quelques acheteurs qui la cherchent la trouvent. En B2B, sur un métier de niche, le volume de recherche est faible, et chacune de ces recherches vient d’un vrai acheteur.",
    work: "Un site sous Divi associé à un SEO local néerlandais, pensé pour le petit volume de recherche, décisif, que reçoit un métier spécialisé de la part des entreprises qui achètent.",
    outcome: "Un site sous Divi et un SEO local néerlandais pour une entreprise qui avait vécu de sa seule réputation pendant quarante-cinq ans.",
    evidence: [
      {
        alt: `Google Search Console pour bemelmanspuiterij.nl sur seize mois${N}: 5,32${N}k clics et 448${N}k impressions, des clics quotidiens passés d’environ 5 mi-2025 à environ 15 à l’automne 2026`,
        caption: "Google Search Console, bemelmanspuiterij.nl, de juin 2025 à octobre 2026.",
        heading: "Bemelman Spuiterij a environ triplé son trafic de recherche en un an",
        text: `5${N}320 clics et 448${N}000 impressions sur seize mois. Les clics quotidiens tournaient autour de cinq en 2025 et sont montés à environ quinze à partir du début de 2026, sur une niche où chaque recherche vient d’un acheteur professionnel.`,
      },
    ],
  },
  "delaguia-y-luzon": {
    metaTitle: "Delaguía y Luzón, étude de cas",
    metaDescription: "Du SEO juridique en quatre langues et sur deux juridictions, où chaque terme doit tenir face à la lecture d’un avocat. Voyez comment nous le traitons.",
    problem: `Un contenu juridique en quatre langues et sur deux juridictions élève les exigences du SEO multilingue${N}: en droit, le choix d’un terme engage la responsabilité avant d’influer sur le positionnement. Le cahier des charges place l’exactitude en premier et le volume en second, pour la traduction comme pour le SEO.`,
    work: "Du SEO juridique et du contenu multilingue en espagnol, français, anglais et russe, sur le droit civil, le droit du travail, l’immigration et la fiscalité en Espagne et en France, avec le niveau d’exactitude qu’exige le contenu d’un cabinet d’avocats.",
    outcome: "Quatre langues, deux juridictions et plusieurs domaines de pratique, tenus au niveau d’exactitude du droit.",
    evidence: [
      {
        alt: `Réponses IA dans Ahrefs pour delaguialuzon.com${N}: 309 sur toutes les plateformes à partir de 87 pages, 182 dans les AI Overviews, 92 dans AI Mode, 14 dans Perplexity, 6 dans Gemini et 2 dans ChatGPT`,
        caption: "Ahrefs Site Explorer, réponses IA pour delaguialuzon.com, 7 octobre 2026.",
        heading: "Delaguía y Luzón cité dans 309 réponses d’IA, à partir de 87 de ses pages",
        text: `Ahrefs compte 309 réponses d’IA qui citent le site du cabinet, 269 de plus que sur la période précédente${N}: 182 dans les AI Overviews de Google, 92 dans AI Mode, 14 dans Perplexity, 6 dans Gemini et 2 dans ChatGPT. Un contenu juridique à la hauteur d’un avocat, c’est le contenu que citent les moteurs de réponse.`,
      },
      {
        alt: `Vue d’ensemble Ahrefs pour delaguialuzon.com${N}: Domain Rating 33, 1,4${N}k backlinks depuis 368 domaines référents, 928 mots-clés organiques dont 200 dans le top 3, 5,1${N}k visites organiques`,
        caption: "Ahrefs Site Explorer, vue d’ensemble pour delaguialuzon.com, 7 octobre 2026.",
        heading: "928 mots-clés dans Google, dont 200 dans les trois premiers résultats",
        text: `Ahrefs relève 928 mots-clés organiques, en hausse de 727, dont 200 dans les trois premières positions, et environ 5${N}100 visites par mois depuis la recherche, 4${N}400 de plus. Derrière ces chiffres, un Domain Rating de 33 et 368 domaines référents.`,
      },
    ],
  },
  matosurf: {
    metaTitle: "Matosurf, étude de cas",
    metaDescription: "Sept sports de glisse, quarante-huit spots français, plus de cent guides. Découvrez la page de méthode éditoriale dont s’inspire la crédibilité de notre site.",
    problem: "Les pratiquants de sports de glisse cherchent la preuve que quelqu’un a vraiment surfé le spot, au-delà d’un nom de spot et d’un lien vers un produit. Les acheteurs accordent de la valeur à cette preuve vécue, et les moteurs de recherche la reconnaissent de mieux en mieux.",
    work: `Sept sports de glisse couverts sur quatre zones géographiques, quarante-huit spots français et cent vingt guides, appuyés sur une page de méthode éditoriale visible qui explique comment le contenu est construit${N}: l’autorité vient avec le travail montré.`,
    outcome: "Quarante-huit spots français et cent vingt guides sur sept sports de glisse, adossés à une page publique de méthode éditoriale.",
    evidence: [
      {
        alt: `Google Search Console pour matosurf.com de juillet à début octobre 2026${N}: 1${N}008 clics en recherche web, des clics quotidiens passés de zéro à environ 20`,
        caption: "Google Search Console, matosurf.com, de juillet à octobre 2026.",
        heading: "Matosurf est passé de zéro à environ 20 clics par jour",
        text: `Un site de six mois, avec 1${N}008 clics issus de Google sur ses trois derniers mois, parti de zéro début juillet. Matosurf est notre propre site, géré comme nous gérons celui d’un client.`,
      },
    ],
  },
};

export const CASES_ES: Record<string, CaseStudyCopy> = {
  betranslated: {
    metaTitle: "BeTranslated, un caso de éxito multidominio",
    metaDescription: "Veinte años al frente de una agencia de traducción con diez dominios nacionales, cada uno posicionado en su mercado. Descubre lo que exige ese método.",
    problem: "Una agencia de traducción que vende en diez mercados necesita diez campañas SEO, cada una construida para su mercado. Cada dominio nacional (.com, .us, .ca, .co.uk, .be, .fr, .es, .de, .nl, .it) tiene sus propios competidores, sus propios hábitos de búsqueda y sus propias señales de confianza, así que cada uno se gestiona como una web independiente, preparada para competir con los rivales locales.",
    work: "Mike fundó la agencia y la dirige desde hace veinte años. Cada dominio regional recibe su propio trabajo de SEO técnico: sitemaps separados, grupos hreflang separados e investigación de palabras clave propia de cada mercado, a partir de lo que busca ese mercado.",
    outcome: "Diez webs nacionales, cada una posicionada con los términos de su mercado, para una agencia que sigue en activo después de dos décadas.",
    countries: ["Internacional", "Estados Unidos", "Canadá", "Reino Unido", "Bélgica", "Francia", "España", "Alemania", "Países Bajos", "Italia"],
  },
  globaprom: {
    metaTitle: "Globaprom, un caso de éxito de software propio con IA",
    metaDescription: "Alcance cerrado, precio cerrado, entrega en semanas. Descubre el portal de seguimiento que quitó las llamadas de estado del día a día de un transitario.",
    problem: "Las pequeñas empresas que necesitan un software propio quieren un alcance cerrado, un precio con el que puedan planificar y una herramienta que encaje exactamente con su operativa. Si la empresa trabaja en varios idiomas desde el primer día, esa herramienta también tiene que ser multilingüe desde el principio.",
    work: "Desarrollo asistido por IA, con alcance y precio cerrados, entregado en semanas y multilingüe desde la primera línea de código. La base técnica es Next.js con Payload CMS.",
    outcome: "Un portal de seguimiento de envíos para TX International Freight que quitó de la semana el seguimiento manual de estados, una plataforma interna para la conciliación semanal del equipo y la web multilingüe, con su sistema de seguimiento, que mueve las fichas inmobiliarias de Century 21 Perdomo.",
  },
  "tx-international-freight": {
    metaTitle: "TX International Freight, caso de éxito",
    metaDescription: "SEO técnico y contenido para un transitario de Houston, construidos con el vocabulario que usan sus compradores, aprendido del propio sector.",
    problem: "Los compradores de carga industrial buscan a su manera, distinta de la del consumidor. Los términos con intención comercial son jerga del sector, así que la investigación de palabras clave parte del vocabulario del oficio para coincidir con lo que se busca de verdad.",
    work: "SEO técnico y contenido construidos con el vocabulario que usan de verdad los compradores de carga industrial de Houston, aprendido del propio sector.",
    outcome: "Presencia en el pack local de Houston en las búsquedas de carga industrial, para un cliente con el que trabajamos desde hace casi quince años.",
  },
  c21perdomo: {
    metaTitle: "Century 21 Perdomo, caso de éxito",
    metaDescription: "Cuatro idiomas al día sobre un WordPress headless con WPML y WooCommerce, con fichas inmobiliarias que cambian cada semana. Descubre cómo.",
    problem: "Las fichas inmobiliarias cambian cada semana: un inmueble se vende, un precio se mueve, un estado cambia. Con cuatro idiomas, cada cambio tiene que llegar a las cuatro versiones a la vez, y una arquitectura headless con WordPress y WooCommerce convierte esa coherencia en un trabajo técnico además de editorial.",
    work: "Cobertura en inglés, francés, español y alemán sobre WordPress headless, WPML y WooCommerce, con la web multilingüe y su sistema de seguimiento desarrollados por Globaprom. SEO trabajado idioma por idioma, a partir de lo que busca cada mercado.",
    outcome: "Cuatro idiomas correctos frente a un stock que rota cada semana, en una web inmobiliaria en producción.",
  },
  valenciamove: {
    metaTitle: "ValenciaMove, caso de éxito",
    metaDescription: "Más de mil páginas en cinco idiomas, escritas tras hacer la mudanza a Valencia en primera persona, con detalles vividos en cada página.",
    problem: "Mikebastin.com publicaba antes contenido sobre mudarse a Valencia junto a sus páginas de consultoría SEO, en un solo dominio, y cada tema merecía su propia web.",
    work: "Más de mil páginas en cinco idiomas (inglés, francés, español, neerlandés e italiano), escritas a partir de haber hecho la mudanza en primera persona.",
    outcome: "1.132 URL publicadas en cinco idiomas. En seis meses, la web pasó de casi no tener tráfico de búsqueda a unos 200 clics al día: 17.400 clics y 1,63 millones de impresiones de abril a octubre de 2026, y más de cincuenta consultas al mes.",
    evidence: [
      {
        alt: "Google Search Console de valenciamove.com en seis meses: 17,4 mil clics y 1,63 millones de impresiones, con los clics diarios pasando de casi cero en abril de 2026 a unos 200 en septiembre",
        caption: "Google Search Console, valenciamove.com, de abril a octubre de 2026.",
        heading: "ValenciaMove pasó de su lanzamiento a unos 200 clics al día",
        text: "17.400 clics y 1,63 millones de impresiones en seis meses, partiendo de casi nada en abril. ValenciaMove es nuestra propia web, gestionada como gestionamos la de un cliente.",
      },
    ],
  },
  "bemelman-spuiterij": {
    metaTitle: "Bemelman Spuiterij, caso de éxito",
    metaDescription: "Un especialista neerlandés en pintura en polvo, con cuarenta y cinco años de reputación y una presencia online por construir. Descubre su SEO local.",
    problem: "Una empresa con cuarenta y cinco años de reputación necesitaba una presencia online a su altura, para que los pocos compradores que la buscan la encuentren. En B2B, en un oficio de nicho, el volumen de búsqueda es bajo, y cada una de esas búsquedas es un comprador real.",
    work: "Una web en Divi junto con SEO local neerlandés, pensado para el volumen de búsqueda pequeño pero decisivo que un oficio especializado recibe de las empresas que compran.",
    outcome: "Una web en Divi y SEO local neerlandés para una empresa que había vivido solo de su reputación durante cuarenta y cinco años.",
    evidence: [
      {
        alt: "Google Search Console de bemelmanspuiterij.nl en dieciséis meses: 5,32 mil clics y 448 mil impresiones, con los clics diarios pasando de unos 5 a mediados de 2025 a unos 15 en otoño de 2026",
        caption: "Google Search Console, bemelmanspuiterij.nl, de junio de 2025 a octubre de 2026.",
        heading: "Bemelman Spuiterij multiplicó por tres su tráfico de búsqueda en un año",
        text: "5.320 clics y 448.000 impresiones en dieciséis meses. Los clics diarios rondaban los cinco durante 2025 y subieron a unos quince desde principios de 2026, en un nicho donde cada búsqueda es un comprador profesional.",
      },
    ],
  },
  "delaguia-y-luzon": {
    metaTitle: "Delaguía y Luzón, caso de éxito",
    metaDescription: "SEO jurídico en cuatro idiomas y dos jurisdicciones, donde cada término tiene que resistir la lectura de un abogado. Descubre cómo lo trabajamos.",
    problem: "El contenido jurídico en cuatro idiomas y dos jurisdicciones eleva la exigencia del SEO multilingüe: en derecho, la elección de un término es una cuestión de responsabilidad antes que de posicionamiento. El encargo pone la precisión primero y el volumen después, en la traducción y en el SEO por igual.",
    work: "SEO jurídico y contenido multilingüe en español, francés, inglés y ruso, sobre derecho civil, laboral, extranjería y fiscal en España y Francia, con el nivel de precisión que de verdad exige el contenido de un despacho de abogados.",
    outcome: "Cuatro idiomas, dos jurisdicciones y varias áreas de práctica, con el nivel de precisión que exige el derecho.",
    evidence: [
      {
        alt: "Respuestas de IA en Ahrefs para delaguialuzon.com: 309 en todas las plataformas desde 87 páginas, 182 en AI Overviews, 92 en AI Mode, 14 en Perplexity, 6 en Gemini y 2 en ChatGPT",
        caption: "Ahrefs Site Explorer, respuestas de IA de delaguialuzon.com, 7 de octubre de 2026.",
        heading: "Delaguía y Luzón, citado en 309 respuestas de IA desde 87 de sus páginas",
        text: "Ahrefs cuenta 309 respuestas de IA que citan la web del despacho, 269 más que en el periodo anterior: 182 en los AI Overviews de Google, 92 en AI Mode, 14 en Perplexity, 6 en Gemini y 2 en ChatGPT. El contenido jurídico con la exigencia de un abogado es el que citan los motores de respuesta.",
      },
      {
        alt: "Resumen de Ahrefs para delaguialuzon.com: Domain Rating 33, 1,4 mil backlinks desde 368 dominios de referencia, 928 palabras clave orgánicas con 200 en el top 3 y 5,1 mil visitas orgánicas",
        caption: "Ahrefs Site Explorer, resumen de delaguialuzon.com, 7 de octubre de 2026.",
        heading: "928 palabras clave en Google, 200 de ellas entre las tres primeras",
        text: "Ahrefs muestra 928 palabras clave orgánicas, 727 más, con 200 en las tres primeras posiciones, y unas 5.100 visitas al mes desde el buscador, 4.400 más. Detrás hay un Domain Rating de 33 y 368 dominios de referencia.",
      },
    ],
  },
  matosurf: {
    metaTitle: "Matosurf, caso de éxito",
    metaDescription: "Siete deportes de tabla, cuarenta y ocho spots franceses, más de cien guías. Descubre la página de método editorial en la que se inspira nuestra web.",
    problem: "Quien practica deportes de tabla busca pruebas de que alguien ha surfeado de verdad ese spot, más allá de su nombre y un enlace a un producto. Los compradores valoran esa prueba de primera mano, y los buscadores la reconocen cada vez mejor.",
    work: "Siete deportes de tabla en cuatro zonas geográficas, cuarenta y ocho spots franceses y ciento veinte guías, sobre una página de método editorial visible que explica con claridad cómo se investiga el contenido, para que la autoridad llegue con el trabajo a la vista.",
    outcome: "Cuarenta y ocho spots franceses y ciento veinte guías sobre siete deportes de tabla, respaldados por una página pública de método editorial.",
    evidence: [
      {
        alt: "Google Search Console de matosurf.com de julio a principios de octubre de 2026: 1.008 clics en búsqueda web, con los clics diarios pasando de cero a unos 20",
        caption: "Google Search Console, matosurf.com, de julio a octubre de 2026.",
        heading: "Matosurf pasó de cero a unos 20 clics al día",
        text: "Una web de seis meses con 1.008 clics desde Google en sus últimos tres meses, partiendo de nada a principios de julio. Matosurf es nuestra propia web, gestionada como gestionamos la de un cliente.",
      },
    ],
  },
};
