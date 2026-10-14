/**
 * The competitor analysis and traffic checklist, in English, French and
 * Spanish (owner, 12 Oct 2026: "translate the checklist too").
 * components/ChecklistView.tsx renders it at
 * /competitor-analysis-traffic-checklist/, /fr/checklist-analyse-concurrentielle/
 * and /es/checklist-analisis-de-competencia/.
 *
 * The English is the page's own text, moved here unchanged. French and
 * Spanish carry the same facts, the same sources and the same accuracy
 * bands, with each market's separators; the internal links point at the
 * matching post in that language. Drafts for the owner's review.
 *
 * A paragraph is a list of pieces: plain text, or a link.
 */
export type Seg = string | { text: string; href: string; external?: boolean };
export type Para = Seg[];

export type ChecklistCopy = {
  metaTitle: string;
  description: string;
  heading: string;
  journal: { name: string; href: string };
  home: { name: string; href: string };
  heroEyebrow: string;
  lede: string;
  checklist: { eyebrow: string; heading: string; lede: string; items: string[] };
  tools: { eyebrow: string; heading: string; paras: Para[]; sources: Para };
  rivals: { eyebrow: string; heading: string; lede: string; items: { name: string; body: string }[]; after: Para };
  channels: { eyebrow: string; heading: string; lede: string; rows: [string, string][] };
  editor: { eyebrow: string; heading: string; paras: string[] };
  ai: { eyebrow: string; heading: string; lede: string; items: [string, string][]; after: Para };
  roadmap: { eyebrow: string; heading: string; lede: string; rows: [string, string, string][] };
  free: { eyebrow: string; heading: string; paras: string[] };
  related: { eyebrow: string; heading: string; topicLabel: string; topicHref: string; slugs?: string[] };
};

const N = " ";

const SOURCES = {
  traffic: "https://www.traffic-masters.net/blog/website-traffic-checker/",
  bright: "https://brightseotools.com/post/SEMrush-vs-Similarweb-Traffic-Data-Accuracy-Compared",
};

export const CHECKLIST_COPY: Record<"en" | "fr" | "es", ChecklistCopy> = {
  en: {
    metaTitle: "The competitor analysis and traffic checklist, Mike Bastin",
    description:
      "Run a competitor traffic audit the way we do: the real rival list, what traffic tools tell you and how far to trust them, AI citations and six actions.",
    heading: "The competitor analysis and traffic checklist",
    journal: { name: "Journal", href: "/blog/" },
    home: { name: "Home", href: "/" },
    heroEyebrow: "Competitor analysis, the working version",
    lede: "A competitor audit goes well beyond a Semrush export: it is a structured way to read another company’s playbook and decide what is worth copying, what is worth ignoring, and what they have yet to work out. The question underneath every one we run is the same: where is their traffic actually coming from, and is that source repeatable in your language, your market and your budget?",
    checklist: {
      eyebrow: "Save this part",
      heading: "The checklist itself",
      lede: "Nine steps, in the order the audit runs. The sections below cover why each one is there and how to get it right.",
      items: [
        "Build the real rival list: direct, indirect, content and AI-citation competitors, beyond the names on the sales whiteboard.",
        "Establish the margin of error before quoting a single traffic number to anyone.",
        "Map traffic sources and their shares: organic, paid, direct, referral and geographic mix.",
        "Read what each channel discloses about how their marketing function is actually built.",
        "Read their top pages like an editor: audience, intent and next action on every money page.",
        "Find the terms they rank for that you have still to win, and the gaps they have left open.",
        "Audit AI citations as well as SERP position.",
        "Check the multilingual setup: hreflang, localized schema, language-specific content.",
        "Cut the findings to six lines: three quick fixes, two content gaps, one structural play.",
      ],
    },
    tools: {
      eyebrow: "Before you quote a number",
      heading: "What the traffic tools tell you, and how far to trust them",
      paras: [
        ["Treat Semrush traffic estimates as estimates, kept separate from Analytics data when they go to a client. Published testing puts Semrush within roughly 10 to 15 percent of real traffic on mid to high traffic sites, and at 20 to 40 percent variance once a site is small. Similarweb is strongest on large international domains, and its variance widens faster on smaller ones: 15 to 30 percent reported for mid-sized sites and above 50 percent at the low end."],
        ["A 50 percent margin of error still leaves the data useful, as long as the numbers are read as direction. You can see which rival is growing, which is flat, and which mix is tilting towards paid. Quote a range: a rival estimated at 47,000 visits a month could really sit anywhere between 22,000 and 70,000, and the range is what goes to the client."],
        ["For an international audit the two tools are better together than either alone. Similarweb’s panel is stronger outside North America, so a rival earning most of its traffic in Germany or Spain is read more accurately by layering Similarweb estimates over Semrush keyword exports."],
      ],
      sources: [
        "Accuracy figures from ",
        { text: "Traffic Masters’ traffic checker comparison", href: SOURCES.traffic, external: true },
        " and ",
        { text: "Bright SEO Tools on Semrush against Similarweb", href: SOURCES.bright, external: true },
        ".",
      ],
    },
    rivals: {
      eyebrow: "Phase one",
      heading: "Four kinds of competitor, beyond the one on the whiteboard",
      lede: "Every client hands over three or four main competitors at kickoff, and in our experience at least one of them competes offline only.",
      items: [
        { name: "Direct rivals", body: "Selling the same service to the same audience in the same language. The list the client already has, and usually the shortest of the four." },
        { name: "Indirect rivals", body: "Solving the same problem with a different model, such as an AI tool taking on work that once went to a translation agency." },
        { name: "Content competitors", body: "Publishers and blogs outranking you on your own money terms while selling something else entirely. They win the click and leave the deal for a seller." },
        { name: "AI citation rivals", body: "The domains an LLM reaches for when someone asks an industry question. Newest of the four, and the one most worth adding to the list." },
      ],
      after: [
        "Build the real list from an organic competitors report in Ahrefs or Semrush, cross-checked against the places your buyers actually compare vendors. A pass with a handful of ",
        { text: "SEO browser extensions", href: "/blog/chrome-extensions-for-seo/" },
        " is usually enough to see how each one is built.",
      ],
    },
    channels: {
      eyebrow: "Phase two",
      heading: "What a channel mix discloses",
      lede: "The mix feeding total visits is where the insight sits: it describes what their marketing function is, and where it is thinnest.",
      rows: [
        ["High direct share", "Real brand equity and a repeat audience, usually with offline or PR spend behind it."],
        ["High organic, low paid", "A mature content programme, often with dedicated search people on staff."],
        ["High paid, low organic", "An acquisition shop, whose position moves with every change in ad costs."],
        ["High referral, low search", "Partnerships, affiliates, or a single viral page holding the number up."],
        ["Concentrated geography", "A local focus, often with hreflang and localized content still to build."],
      ],
    },
    editor: {
      eyebrow: "Phase three",
      heading: "Read their content like an editor",
      paras: [
        "Open their best pages and ask three questions. Who is it written for? What does it ask the reader to do next? Does it answer the query in full?",
        "The pattern we meet most often is the everything hub: a few hundred articles, a good share of them short and machine-written, and traffic on a long plateau. It looks like a content engine from the outside, and every quality update opens ground for a rival with deeper pages.",
        "Look at where their intent coverage stops. A rival that owns the how-to queries and stops short of pricing, comparisons or alternatives has left the bottom of the funnel open for you. Three sharp comparison pages, linked properly from the pages that already rank, quietly win those enquiries.",
      ],
    },
    ai: {
      eyebrow: "Phase four",
      heading: "Audit the citations as well as the position",
      lede: "A growing share of research now happens inside an assistant before anyone clicks anything, so a rival can sit outside the ten blue links and still be quoted in every answer. Tools track this now, Ahrefs Brand Radar among them, and their counts are worth treating as direction. Run the same prompts yourself once a month and see who gets named. Four structural patterns make a page easy to lift:",
      items: [
        ["Clean data tables", "Tabular content gets lifted intact, which is why a table often outranks the paragraph that says the same thing."],
        ["FAQ schema", "Direct answers to specific questions, marked up so a machine can lift the answer directly."],
        ["Entity linking", "Their brand tied to recognised industry concepts, with outbound references to sources worth citing."],
        ["Visible expertise", "Named authors, real dates, actual citations. The signals Google's own guidelines reward, and the ones LLMs reuse."],
      ],
      after: [
        "On international queries, check how they handle ",
        { text: "technical SEO across languages", href: "/blog/technical-seo-for-multilingual-websites/" },
        ". A clean multilingual setup is a moat, and an untidy one is an opening for whoever takes it seriously first.",
      ],
    },
    roadmap: {
      eyebrow: "Phase five",
      heading: "Cut eighty findings down to six",
      lede: "Where an audit turns into action. Eighty issues make a list; six make a plan. Pick six: three quick technical fixes, two content gaps where a rival ranks on a weak page, and one structural play worth a quarter or two.",
      rows: [
        ["High", "Fix technical errors and schema gaps on the money pages.", "Cleaner crawling and indexing, with impressions landing on pages that can convert."],
        ["Medium", "Build or rewrite content where a rival ranks on a weak page.", "Organic capture on competitive queries, built over months."],
        ["Low", "Tidy referral sources and link properly from the journal to the service pages.", "Stronger topical authority and broader brand signals."],
      ],
    },
    free: {
      eyebrow: "Before you buy anything",
      heading: "A first pass runs on free tools",
      paras: [
        "Most of the checklist can be worked through on free tiers before anyone signs up to a paid stack. Ahrefs Webmaster Tools and the free tiers of Semrush and Ubersuggest will surface organic competitors. The Similarweb browser extension gives a quick directional read on any domain’s channel mix. Keyword Planner and your own Search Console show the queries you already touch, which is how you spot the queries a rival owns that are still open to you.",
        "Upgrade once the exercise has proved it is worth paying for. The discipline in the checklist matters more than the subscription behind it.",
      ],
    },
    related: { eyebrow: "Keep reading", heading: "More from the journal", topicLabel: "See everything in SEO fundamentals", topicHref: "/blog/topics/seo-fundamentals/" },
  },

  fr: {
    metaTitle: "Checklist d’analyse concurrentielle et de trafic, Mike Bastin",
    description:
      `Menez un audit du trafic de vos concurrents comme nous le faisons${N}: les vrais rivaux, la fiabilité des outils de trafic, les citations IA et six actions.`,
    heading: "La checklist d’analyse concurrentielle et de trafic",
    journal: { name: "Articles", href: "/fr/blog/" },
    home: { name: "Accueil", href: "/fr/" },
    heroEyebrow: "Analyse concurrentielle, la version de terrain",
    lede: `Un audit concurrentiel va bien au-delà d’un export Semrush${N}: c’est une manière structurée de lire la stratégie d’une autre entreprise et de décider ce qui mérite d’être repris, ce qui peut être laissé de côté et ce qu’elle doit encore résoudre. La question qui sous-tend chacun de nos audits reste la même${N}: d’où vient vraiment leur trafic, et cette source est-elle reproductible dans votre langue, sur votre marché et avec votre budget${N}?`,
    checklist: {
      eyebrow: "La partie à garder",
      heading: "La checklist elle-même",
      lede: "Neuf étapes, dans l’ordre où l’audit se déroule. Les sections suivantes expliquent pourquoi chacune est là et comment la mener correctement.",
      items: [
        `Dressez la vraie liste des rivaux${N}: concurrents directs, indirects, de contenu et cités par l’IA, au-delà des noms listés par l’équipe commerciale.`,
        "Établissez la marge d’erreur avant de citer le moindre chiffre de trafic à qui que ce soit.",
        `Cartographiez les sources de trafic et leur part${N}: organique, payant, direct, référent et répartition géographique.`,
        "Lisez ce que chaque canal révèle de la façon dont leur marketing est réellement organisé.",
        `Lisez leurs meilleures pages comme un rédacteur en chef${N}: public, intention et action suivante sur chaque page qui rapporte.`,
        "Repérez les termes sur lesquels ils se positionnent et sur lesquels vous pouvez encore gagner des positions, ainsi que les créneaux qu’ils ont laissés ouverts.",
        "Auditez les citations dans les réponses d’IA autant que la position dans les résultats.",
        `Vérifiez la configuration multilingue${N}: hreflang, données structurées localisées, contenus propres à chaque langue.`,
        `Ramenez les constats à six lignes${N}: trois corrections rapides, deux manques de contenu, un chantier structurel.`,
      ],
    },
    tools: {
      eyebrow: "Avant de citer un chiffre",
      heading: "Ce que disent les outils de trafic, et jusqu’où leur faire confiance",
      paras: [
        [`Traitez les estimations de trafic de Semrush comme des estimations, à tenir séparées des données d’Analytics quand vous les communiquez à un client. Les tests publiés situent Semrush à environ 10 à 15${N}% du trafic réel sur les sites à trafic moyen ou élevé, et à 20 à 40${N}% d’écart dès qu’un site est petit. Similarweb est le plus fiable sur les grands domaines internationaux, et son écart grandit plus vite sur les plus petits${N}: 15 à 30${N}% relevés pour les sites de taille moyenne et plus de 50${N}% en bas de l’échelle.`],
        [`Une marge d’erreur de 50${N}% rend les données utiles, à condition de lire les chiffres comme une tendance. Vous voyez quel rival progresse, lequel stagne et quelle répartition bascule vers le payant. Donnez une fourchette${N}: un rival estimé à 47${N}000 visites par mois peut se situer en réalité entre 22${N}000 et 70${N}000, et c’est cette fourchette qui est communiquée au client.`],
        ["Pour un audit international, les deux outils valent mieux ensemble que séparément. La base de données de Similarweb est plus solide hors d’Amérique du Nord, si bien qu’un rival qui tire l’essentiel de son trafic d’Allemagne ou d’Espagne se lit plus justement en superposant les estimations de Similarweb aux exports de mots-clés de Semrush."],
      ],
      sources: [
        "Chiffres de fiabilité tirés de ",
        { text: "la comparaison d’outils de trafic de Traffic Masters", href: SOURCES.traffic, external: true },
        " et de ",
        { text: "Bright SEO Tools sur Semrush face à Similarweb", href: SOURCES.bright, external: true },
        ".",
      ],
    },
    rivals: {
      eyebrow: "Première phase",
      heading: "Quatre types de concurrents, au-delà de celui qui figure au tableau",
      lede: "Chaque client nous donne trois ou quatre concurrents principaux au lancement, et d’après notre expérience, au moins l’un d’eux ne concurrence le client que hors ligne.",
      items: [
        { name: "Concurrents directs", body: "Ils vendent le même service au même public, dans la même langue. C’est la liste que le client a déjà, et généralement la plus courte des quatre." },
        { name: "Concurrents indirects", body: "Ils résolvent le même problème avec un autre modèle, comme un outil d’IA qui reprend un travail autrefois confié à une agence de traduction." },
        { name: "Concurrents de contenu", body: "Des éditeurs et des blogs qui se positionnent devant vous sur vos propres termes commerciaux tout en vendant tout autre chose. Ils attirent le clic et laissent la vente à un autre." },
        { name: "Rivaux cités par l’IA", body: "Les domaines vers lesquels se tourne un LLM quand quelqu’un pose une question sur votre secteur. Les plus récents des quatre, et ceux qui méritent le plus d’entrer dans la liste." },
      ],
      after: [
        "Construisez la vraie liste à partir d’un rapport de concurrents organiques dans Ahrefs ou Semrush, recoupé avec les endroits où vos acheteurs comparent réellement les fournisseurs. Un passage avec quelques ",
        { text: "extensions de navigateur pour le SEO", href: "/fr/extensions-chrome-seo/" },
        " suffit généralement pour voir comment chacun est construit.",
      ],
    },
    channels: {
      eyebrow: "Deuxième phase",
      heading: "Ce que révèle la répartition des canaux",
      lede: `C’est dans la répartition des visites que se trouve l’enseignement${N}: elle décrit ce qu’est leur marketing, et où il est le plus faible.`,
      rows: [
        ["Forte part de trafic direct", "Une vraie notoriété et un public qui revient, généralement soutenus par des dépenses hors ligne ou de relations presse."],
        ["Organique fort, payant faible", "Un programme de contenu mature, souvent avec des spécialistes de la recherche en interne."],
        ["Payant fort, organique faible", "Une machine d’acquisition, dont la position bouge à chaque variation du coût des annonces."],
        ["Référents forts, recherche faible", "Des partenariats, des affiliés, ou une seule page virale qui tire le trafic."],
        ["Géographie concentrée", "Un ancrage local, souvent avec un hreflang et des contenus localisés encore à construire."],
      ],
    },
    editor: {
      eyebrow: "Troisième phase",
      heading: "Lisez leurs contenus comme un rédacteur en chef",
      paras: [
        `Ouvrez leurs meilleures pages et posez trois questions. Pour qui la page est-elle écrite${N}? Que demande-t-elle au lecteur de faire ensuite${N}? Répond-elle entièrement à la recherche${N}?`,
        `Le schéma que nous rencontrons le plus souvent est le site fourre-tout${N}: quelques centaines d’articles, dont une bonne part courts et rédigés par une machine, et un trafic sur un long plateau. Vu de l’extérieur, cela ressemble à une machine à contenus, et chaque mise à jour de qualité fait gagner du terrain à un rival aux pages plus approfondies.`,
        "Regardez où s’arrête leur couverture des intentions. Un rival qui tient les requêtes pratiques et s’arrête avant les tarifs, les comparatifs ou les alternatives vous a laissé le bas de l’entonnoir. Trois pages comparatives précises, bien reliées depuis les pages qui se positionnent déjà, captent discrètement ces demandes.",
      ],
    },
    ai: {
      eyebrow: "Quatrième phase",
      heading: "Auditez les citations autant que la position",
      lede: `Une part croissante des recherches se fait désormais dans un assistant, avant tout clic, si bien qu’un rival peut se trouver hors des dix liens bleus et être cité dans chaque réponse. Des outils suivent cela aujourd’hui, dont Ahrefs Brand Radar, et leurs chiffres valent comme tendance. Lancez-vous les mêmes requêtes une fois par mois et regardez qui est cité. Quatre schémas de structure rendent une page facile à reprendre${N}:`,
      items: [
        ["Des tableaux de données propres", "Un contenu en tableau est repris tel quel, et c’est pourquoi un tableau passe souvent devant le paragraphe qui dit la même chose."],
        ["Le balisage FAQ", "Des réponses directes à des questions précises, balisées pour qu’une machine puisse reprendre la réponse telle quelle."],
        ["Les liens entre entités", "Leur marque reliée à des notions reconnues du secteur, avec des renvois vers des sources qui méritent d’être citées."],
        ["Une expertise visible", "Des auteurs nommés, des dates réelles, de vraies sources. Les signaux que récompensent les consignes de Google, et ceux que reprennent les LLM."],
      ],
      after: [
        "Sur les requêtes internationales, regardez comment ils gèrent ",
        { text: "le SEO technique d’un site multilingue", href: "/fr/seo-technique-site-multilingue/" },
        ". Une configuration multilingue propre est un rempart, et une configuration négligée est une ouverture pour le premier qui la prend au sérieux.",
      ],
    },
    roadmap: {
      eyebrow: "Cinquième phase",
      heading: "Ramenez quatre-vingts constats à six",
      lede: `C’est là qu’un audit passe à l’action. Quatre-vingts problèmes font une liste${N}; six font un plan. Retenez-en six${N}: trois corrections techniques rapides, deux manques de contenu là où un rival se positionne avec une page faible, et un chantier structurel qui vaut un trimestre ou deux.`,
      rows: [
        ["Haute", "Corriger les erreurs techniques et les manques de données structurées sur les pages qui rapportent.", "Une exploration et une indexation plus propres, avec des impressions sur des pages qui convertissent."],
        ["Moyenne", "Créer ou réécrire les contenus là où un rival se positionne avec une page faible.", "Des positions organiques sur des requêtes concurrentielles, gagnées sur plusieurs mois."],
        ["Basse", "Mettre de l’ordre dans les sources référentes et relier correctement les articles aux pages de services.", "Une autorité thématique plus forte et des signaux de marque plus larges."],
      ],
    },
    free: {
      eyebrow: "Avant d’acheter quoi que ce soit",
      heading: "Un premier passage se fait avec des outils gratuits",
      paras: [
        "L’essentiel de la checklist peut se faire avec des offres gratuites, avant de souscrire à des outils payants. Ahrefs Webmaster Tools et les versions gratuites de Semrush et d’Ubersuggest mettent en évidence les concurrents organiques. L’extension de navigateur Similarweb donne un premier aperçu de la répartition des canaux de n’importe quel domaine. Keyword Planner et votre propre Search Console montrent les requêtes que vous couvrez déjà, et c’est ainsi que vous repérez celles qu’un concurrent occupe et qui vous sont encore accessibles.",
        "Passez à une offre payante une fois que l’essai a prouvé qu’il en vaut la peine. La rigueur de la checklist compte davantage que l’abonnement qui permet de la mener.",
      ],
    },
    related: {
      eyebrow: "À lire ensuite",
      heading: "D’autres articles sur le sujet",
      topicLabel: "Lire tous les articles SEO multilingue",
      topicHref: "/fr/blog/sujets/seo-multilingue/",
      slugs: ["analyse-concurrentielle-seo", "extensions-chrome-seo", "seo-technique-site-multilingue"],
    },
  },

  es: {
    metaTitle: "Checklist de análisis de competencia y tráfico, Mike Bastin",
    description:
      "Audita el tráfico de tu competencia como lo hacemos nosotros: los rivales reales, cuánto fiarte de las herramientas, las citas en IA y seis acciones.",
    heading: "La checklist de análisis de competencia y tráfico",
    journal: { name: "Artículos", href: "/es/blog/" },
    home: { name: "Inicio", href: "/es/" },
    heroEyebrow: "Análisis de la competencia, la versión de trabajo",
    lede: "Una auditoría de la competencia va mucho más allá de una exportación de Semrush: es una forma estructurada de leer la estrategia de otra empresa y decidir qué merece la pena copiar, qué puedes dejar de lado y qué les queda por resolver. La pregunta que hay debajo de cada auditoría que hacemos es siempre la misma: ¿de dónde viene de verdad su tráfico, y se puede repetir esa fuente en tu idioma, tu mercado y tu presupuesto?",
    checklist: {
      eyebrow: "La parte que conviene guardar",
      heading: "La checklist en sí",
      lede: "Nueve pasos, en el orden en que se hace la auditoría. Las secciones de abajo explican por qué está cada uno y cómo hacerlo bien.",
      items: [
        "Haz la lista real de rivales: competidores directos, indirectos, de contenido y citados por la IA, más allá de los nombres que apunta el equipo comercial.",
        "Fija el margen de error antes de dar una sola cifra de tráfico a nadie.",
        "Mapea las fuentes de tráfico y su peso: orgánico, de pago, directo, de referencia y reparto geográfico.",
        "Lee lo que cada canal revela sobre cómo está montado de verdad su marketing.",
        "Lee sus mejores páginas como un editor: público, intención y siguiente paso en cada página que vende.",
        "Encuentra los términos en los que posicionan y que tú todavía puedes ganar, y los huecos que han dejado abiertos.",
        "Audita las citas en respuestas de IA además de la posición en los resultados.",
        "Revisa la configuración multilingüe: hreflang, datos estructurados localizados y contenido propio de cada idioma.",
        "Reduce las conclusiones a seis líneas: tres arreglos rápidos, dos huecos de contenido y una apuesta estructural.",
      ],
    },
    tools: {
      eyebrow: "Antes de dar una cifra",
      heading: "Lo que te dicen las herramientas de tráfico, y cuánto puedes fiarte",
      paras: [
        ["Trata las estimaciones de tráfico de Semrush como estimaciones, separadas de los datos de Analytics cuando llegan a un cliente. Las pruebas publicadas sitúan a Semrush a un 10 a 15 % del tráfico real en webs de tráfico medio o alto, y con una desviación del 20 al 40 % cuando la web es pequeña. Similarweb funciona mejor en grandes dominios internacionales, y su desviación crece más rápido en los pequeños: entre un 15 y un 30 % en webs medianas y más del 50 % en las más pequeñas."],
        ["Un margen de error del 50 % sigue dejando datos útiles, siempre que leas las cifras como tendencia. Ves qué rival crece, cuál está estancado y qué mix se inclina hacia el pago. Da un rango: un rival estimado en 47.000 visitas al mes puede estar en realidad entre 22.000 y 70.000, y lo que llega al cliente es el rango."],
        ["En una auditoría internacional, las dos herramientas funcionan mejor juntas que por separado. El panel de Similarweb es más sólido fuera de Norteamérica, así que un rival que saca la mayor parte de su tráfico de Alemania o de España se lee con más precisión combinando las estimaciones de Similarweb con las exportaciones de palabras clave de Semrush."],
      ],
      sources: [
        "Cifras de precisión de ",
        { text: "la comparativa de herramientas de tráfico de Traffic Masters", href: SOURCES.traffic, external: true },
        " y de ",
        { text: "Bright SEO Tools sobre Semrush frente a Similarweb", href: SOURCES.bright, external: true },
        ".",
      ],
    },
    rivals: {
      eyebrow: "Primera fase",
      heading: "Cuatro tipos de competidor, más allá del que ya tienes apuntado",
      lede: "Cada cliente nos da tres o cuatro competidores principales al empezar, y en nuestra experiencia al menos uno de ellos solo compite fuera de internet.",
      items: [
        { name: "Competidores directos", body: "Venden el mismo servicio al mismo público y en el mismo idioma. Es la lista que el cliente ya tiene, y casi siempre la más corta de las cuatro." },
        { name: "Competidores indirectos", body: "Resuelven el mismo problema con otro modelo, como una herramienta de IA que asume un trabajo que antes iba a una agencia de traducción." },
        { name: "Competidores de contenido", body: "Medios y blogs que te superan en tus propios términos comerciales mientras venden algo totalmente distinto. Se llevan el clic y dejan la venta a otro." },
        { name: "Rivales citados por la IA", body: "Los dominios a los que recurre un LLM cuando alguien hace una pregunta sobre tu sector. Los más nuevos de los cuatro, y los que más vale la pena añadir a la lista." },
      ],
      after: [
        "Haz la lista real a partir de un informe de competidores orgánicos en Ahrefs o Semrush, contrastado con los sitios donde tus compradores comparan proveedores de verdad. Una pasada con unas cuantas ",
        { text: "extensiones de navegador para SEO", href: "/es/extensiones-chrome-seo/" },
        " suele bastar para ver cómo está montado cada uno.",
      ],
    },
    channels: {
      eyebrow: "Segunda fase",
      heading: "Lo que revela el reparto de canales",
      lede: "La clave está en el reparto que alimenta el total de visitas: describe cómo es su marketing y dónde está más flojo.",
      rows: [
        ["Mucho tráfico directo", "Una marca con peso real y un público que vuelve, casi siempre con inversión fuera de internet o en prensa detrás."],
        ["Mucho orgánico, poco pago", "Un programa de contenido maduro, a menudo con especialistas en búsqueda en plantilla."],
        ["Mucho pago, poco orgánico", "Una máquina de captación, cuya posición cambia con cada variación del coste de los anuncios."],
        ["Mucha referencia, poca búsqueda", "Acuerdos, afiliados o una sola página viral que sostiene la cifra."],
        ["Geografía concentrada", "Un enfoque local, a menudo con el hreflang y el contenido localizado todavía por construir."],
      ],
    },
    editor: {
      eyebrow: "Tercera fase",
      heading: "Lee su contenido como un editor",
      paras: [
        "Abre sus mejores páginas y hazte tres preguntas. ¿Para quién está escrita? ¿Qué le pide al lector que haga después? ¿Responde por completo a la búsqueda?",
        "El patrón que más encontramos es la web cajón de sastre: unos cientos de artículos, buena parte cortos y escritos por una máquina, y un tráfico estancado durante mucho tiempo. Desde fuera parece una fábrica de contenido, y cada actualización de calidad abre terreno a un rival con páginas más completas.",
        "Fíjate en dónde termina su cobertura de intenciones. Un rival que domina las búsquedas de cómo hacer algo y se queda antes de los precios, las comparativas o las alternativas te ha dejado libre la parte baja del embudo. Tres páginas comparativas bien hechas, bien enlazadas desde las páginas que ya posicionan, se llevan esas consultas sin hacer ruido.",
      ],
    },
    ai: {
      eyebrow: "Cuarta fase",
      heading: "Audita las citas además de la posición",
      lede: "Una parte creciente de la investigación ya ocurre dentro de un asistente, antes de cualquier clic, así que un rival puede estar fuera de los diez enlaces azules y aparecer citado en todas las respuestas. Hoy hay herramientas que lo miden, entre ellas Ahrefs Brand Radar, y sus cifras valen como tendencia. Lanza tú mismo las mismas preguntas una vez al mes y mira a quién se nombra. Cuatro patrones de estructura hacen que una página sea fácil de citar:",
      items: [
        ["Tablas de datos limpias", "El contenido en tabla se cita entero, por eso una tabla suele superar al párrafo que dice lo mismo."],
        ["Marcado de preguntas frecuentes", "Respuestas directas a preguntas concretas, marcadas para que una máquina pueda tomar la respuesta tal cual."],
        ["Enlaces entre entidades", "Su marca vinculada a conceptos reconocidos del sector, con referencias a fuentes que merece la pena citar."],
        ["Experiencia visible", "Autores con nombre, fechas reales, fuentes de verdad. Las señales que premian las directrices de Google y las que reutilizan los LLM."],
      ],
      after: [
        "En las búsquedas internacionales, mira cómo gestionan ",
        { text: "el SEO técnico para webs multilingües", href: "/es/seo-tecnico-para-sitios-multilingues/" },
        ". Una configuración multilingüe limpia es una barrera de entrada, y una descuidada es una oportunidad para el primero que se la tome en serio.",
      ],
    },
    roadmap: {
      eyebrow: "Quinta fase",
      heading: "Reduce ochenta hallazgos a seis",
      lede: "Aquí es donde una auditoría se convierte en acción. Ochenta problemas son una lista; seis son un plan. Elige seis: tres arreglos técnicos rápidos, dos huecos de contenido donde un rival posiciona con una página floja y una apuesta estructural que valga uno o dos trimestres.",
      rows: [
        ["Alta", "Corregir errores técnicos y huecos de datos estructurados en las páginas que venden.", "Un rastreo y una indexación más limpios, con impresiones en páginas que pueden convertir."],
        ["Media", "Crear o reescribir contenido donde un rival posiciona con una página floja.", "Posiciones orgánicas en búsquedas competidas, ganadas a lo largo de meses."],
        ["Baja", "Ordenar las fuentes de referencia y enlazar bien desde los artículos a las páginas de servicios.", "Más autoridad temática y señales de marca más amplias."],
      ],
    },
    free: {
      eyebrow: "Antes de comprar nada",
      heading: "La primera pasada se hace con herramientas gratuitas",
      paras: [
        "Casi toda la checklist se puede trabajar con versiones gratuitas antes de contratar herramientas de pago. Ahrefs Webmaster Tools y las versiones gratuitas de Semrush y Ubersuggest sacan a la luz a los competidores orgánicos. La extensión de navegador de Similarweb da una primera lectura del reparto de canales de cualquier dominio. Keyword Planner y tu propio Search Console muestran las búsquedas que ya tocas, y así detectas las que domina un rival y que todavía tienes a tu alcance.",
        "Pasa a una herramienta de pago cuando el ejercicio haya demostrado que vale la pena. Lo que hace funcionar la checklist es el método, más que la suscripción que hay detrás.",
      ],
    },
    related: {
      eyebrow: "Sigue leyendo",
      heading: "Más artículos sobre el tema",
      topicLabel: "Ver todos los artículos de análisis de la competencia",
      topicHref: "/es/blog/temas/analisis-de-la-competencia/",
      slugs: ["analisis-competitivo-seo", "analizar-trafico-web-competencia", "herramientas-gratuitas-analisis-competitivo"],
    },
  },
};
