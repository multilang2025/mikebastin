/**
 * French service pages laid out like their English sibling.
 *
 * Owner, 8 Oct 2026: "Apply the same design and illustrations (albeit
 * localized) from /services/multilingual-seo/ to
 * /fr/services/referencement-multilingue/". A French slug listed here is
 * rendered by components/ServicePageView.tsx, the layout the English service
 * template uses, from an entry with the English `Service` shape: hero with
 * eyebrow, h1, h2, lede and a review, body sections with their scene
 * illustrations, expandables, the engagement steps, the call to action and
 * the scope prose. Any other French service keeps its markdown body.
 *
 * The page's metadata, group and hreflang still come from the markdown
 * frontmatter in content/fr/services/<slug>.md, so the h1 here repeats its
 * `title`. French copy reuses the reviewed text of the earlier markdown
 * page wherever it fits the English structure; the rest is translated from
 * the English entry in lib/services.ts. Scenes with words in them use the
 * French renders (`-fr` suffix, design/scenes/scenes/).
 */
import type { Service } from "@/lib/services";

export type FrServiceLayout = Service & {
  /** The "whole scope" prose, in place of lib/absorbed.ts for English. */
  absorbed: string[];
  /** French service slugs for the band at the foot of the page. */
  siblings: string[];
  siblingsEyebrow: string;
};

export const FR_SERVICE_LAYOUTS: Record<string, FrServiceLayout> = {
  "referencement-multilingue": {
    slug: "referencement-multilingue",
    name: "Référencement multilingue",
    inline: "référencement multilingue",
    headingTerm: "SEO multilingue",
    h1: "Référencement multilingue pour mener plusieurs marchés étrangers de front",
    subhead:
      "Un référencement mené sur plusieurs marchés à la fois, pour que les langues dans lesquelles vous publiez déjà vous apportent aussi des demandes.",
    cluster: "Search",
    pillar: true,
    angle: "Le moteur derrière le résultat",
    lede: "Mike Bastin pilote un seul plan de SEO multilingue pour tous les marchés où vous vendez. Chaque langue est étudiée à partir de ses propres recherches et rédigée par un natif : vos pages anglaises, allemandes et espagnoles vous apportent des demandes autant que des visites.",
    sections: [],
    body: [
      {
        heading: "Ce que vous apporte une mission de SEO multilingue",
        art: {
          src: "/images/scenes/multilingual-seo-1-engagement-fr.webp",
          alt: "Une liste de marchés classés sur des données, une page rédigée par un natif en français à côté de l’anglais, de l’espagnol, de l’allemand et du néerlandais, une structure d’adresses par langue et un rapport mensuel par marché.",
        },
        paragraphs: [
          "Une liste classée de vos marchés, notés sur des données : le premier que nous ouvrons est celui qui a le plus de chances de vous envoyer des demandes rapidement.",
          "Des pages écrites par des natifs dans chaque langue. Les moteurs de recherche les traitent comme du contenu original, les moteurs d’IA reprennent volontiers les pages natives, et les lecteurs natifs restent pour les lire.",
          "Une structure commune à toutes les langues. Les adresses de pages, les liens internes, le balisage et les mots-clés cibles sont fixés par langue avant la mise en ligne de la première page : le français publié aujourd’hui et l’espagnol ajouté dans six mois partagent une structure commune.",
          "Un rapport mensuel par marché : positions, réponses des IA et demandes reçues, avec ce qui a progressé et la suite.",
        ],
      },
      {
        heading: "La recherche, la rédaction et le socle technique que nous menons pour chaque langue",
        art: {
          src: "/images/scenes/multilingual-seo-2-per-language-fr.webp",
          alt: "Une recherche de mots-clés par marché, un rédacteur natif pour chaque langue, et une structure et un sitemap pour chaque version linguistique.",
        },
        paragraphs: [
          "Chaque marché commence par sa propre recherche, menée dans sa langue : les intentions commerciales réelles, les expressions de longue traîne, la façon dont les acheteurs comparent avant de choisir. Sous-répertoire, sous-domaine ou domaine national, nous vous recommandons la structure qui convient à votre cas, avec les balises hreflang et un sitemap par langue configurés dès le départ.",
          "Les décisions qui coûtent cher à défaire plus tard sont prises au début : la structure du domaine, la carte des versions linguistiques et l’ordre d’entrée des marchés. Nous vérifions que les balises hreflang figurent sur chaque page, page d’accueil comprise, pour que chaque visiteur arrive sur la version de son pays. Le français, l’anglais, l’espagnol et le néerlandais sont travaillés directement par l’équipe qui pense la stratégie ; l’allemand, l’italien, le portugais et les autres langues passent par des rédacteurs natifs du réseau BeTranslated, relus par un second natif avant livraison. Le balisage schema (LocalBusiness, Service, Article, FAQ) est construit par langue et validé avec l’outil de test des résultats enrichis de Google, et le travail s’étend à la façon dont ChatGPT, Claude, Perplexity et les AI Overviews répondent dans chaque langue.",
        ],
      },
      {
        heading: "Trois cas où le périmètre multilingue était tout l’enjeu",
        art: {
          src: "/images/scenes/multilingual-seo-3-cases-fr.webp",
          alt: "Trois sites multilingues côte à côte : neuf domaines nationaux, quatre langues sur un site immobilier, et quatre langues réparties sur deux systèmes juridiques.",
        },
        paragraphs: [
          "BeTranslated, l’agence de traduction que nous dirigeons depuis plus de deux décennies, gère neuf domaines nationaux avec WPML sur chacun, des balises hreflang entre les domaines, des contenus natifs par marché rédigés par l’équipe de traducteurs interne et un balisage schema localisé par pays. Le résultat : un positionnement organique régulier sur plusieurs marchés européens et des citations par les IA dans chaque langue cible sur les requêtes de services de traduction.",
          "Century 21 Perdomo, une agence immobilière en République dominicaine, publie ses biens en anglais, en français, en espagnol et en allemand, sur un WordPress headless avec WPML et WooCommerce. Nous menons le SEO langue par langue, à partir des recherches propres à chaque marché.",
          "Un cabinet d’avocats de Valencia qui travaille en espagnol, en français, en anglais et en russe s’appuie sur WPML pour ses quatre langues, avec un balisage LegalService localisé par langue et des biographies d’avocats adaptées à chaque public. Il reçoit désormais des demandes régulières sur des requêtes à intention commerciale, comme le droit des affaires et les contrats de franchise, dans la langue de ses clients.",
        ],
      },
    ],
    expandablesHeading: "Le SEO multilingue que nous menons sur plusieurs marchés",
    expandablesLede:
      "Six chantiers d’un programme qui ouvre les marchés l’un après l’autre, et ce que chacun vous apporte.",
    expandables: [
      {
        q: "Des lancements par vagues",
        a: [
          "La demande qui nous arrive le plus souvent porte sur l’anglais, le français, l’espagnol, l’allemand, l’italien, le portugais, le néerlandais, le japonais et le chinois dès le premier jour. Nous ouvrons d’abord trois ou quatre marchés, là où les données sont les plus solides : quatre marchés menés à fond reçoivent chacun la profondeur qu’il faut pour se positionner.",
          "Une seconde vague, menée comme un test, prend de l’ampleur quand la première a fait ses preuves : votre budget suit les marchés qui rapportent.",
        ],
      },
      {
        q: "Des marchés classés sur des données",
        a: [
          "Nous notons vos marchés candidats, en général huit à douze au départ, sur cinq critères : le volume de recherche, la difficulté concurrentielle, l’adéquation commerciale avec ce que vous vendez, le coût de la localisation et les contraintes réglementaires propres au pays.",
          "Vous recevez un classement qui fixe l’ordre sur des éléments mesurés, et qui place parfois en tête un autre marché que celui que vous attendiez. Au bout de six mois environ, un point d’étape désigne les marchés tests qui passent en programme complet et ceux qui marquent une pause.",
        ],
      },
      {
        q: "Une recommandation de structure de domaine",
        a: [
          "Nous vous recommandons un domaine national, un sous-domaine ou un sous-répertoire selon votre cas. Le choix dépend du budget, de l’autorité que vous pouvez répartir et du besoin de l’acheteur local de voir un domaine de son pays pour vous faire confiance. Le domaine national est le signal local le plus fort et le plus coûteux à entretenir ; le sous-répertoire concentre l’autorité sur un seul domaine et convient à la plupart des entreprises qui ajoutent des marchés à une activité existante.",
          "Nous tranchons avec vous, une fois, au début : un choix un peu imparfait au départ coûte moins cher qu’une migration plus tard.",
          "Nous travaillons le plus souvent sur WordPress avec WPML, et aussi avec Polylang, TranslatePress ou Weglot. Sur Shopify, Webflow ou un développement propre, nous appliquons la stratégie avec votre équipe technique.",
        ],
      },
      {
        q: "Des mots-clés et des références localisés par marché",
        a: [
          "Un ordinateur se dit « ordenador » en Espagne et « computadora » au Mexique, et Madrid cherche le premier mot. Nous recherchons le terme que les gens tapent dans chaque marché, et nous portons le soin jusqu’à la devise, aux unités, aux références juridiques, aux moyens de paiement, aux labels de confiance et aux clients que vous citez en référence.",
          "Le cadre réglementaire change avec eux : le RGPD dans l’Union européenne, le CCPA en Californie, la LGPD au Brésil. Nous citons celui sous lequel vit votre lecteur, pour que la page se lise comme écrite pour lui.",
        ],
      },
      {
        q: "Hreflang, sitemaps et balisage par marché",
        a: [
          "Nous validons les balises hreflang marché par marché, nous découpons le sitemap par langue, nous traduisons les adresses de pages dans chaque langue et nous localisons le balisage schema par pays. Les balises hreflang cassées ou circulaires sont ce que nos audits relèvent le plus souvent, et leur correction profite à tout le reste du travail.",
          "Nous utilisons la géolocalisation par adresse IP pour suggérer une version, et le visiteur choisit la sienne. Toutes les versions restent visibles pour Google et accessibles à celui qui voyage, ce qui concerne une bonne part d’une clientèle professionnelle.",
        ],
      },
      {
        q: "Des liens locaux et des citations par les IA, pays par pays",
        a: [
          "Nous faisons gagner à chaque version linguistique ses propres liens dans son propre pays : la presse locale, une association professionnelle ou un annuaire régional du pays cible pèsent bien davantage qu’un lien international générique, car en recherche internationale la pertinence est géographique autant que thématique.",
          "Nous suivons aussi, pays par pays, les réponses de ChatGPT, Claude, Perplexity et des AI Overviews. Les sources citées changent selon le pays et la langue, et nous rendons compte des citations marché par marché, à côté des positions.",
        ],
      },
    ],
    process: [
      {
        title: "Un audit gratuit de 20 minutes",
        text: "Nous examinons votre site dans chaque langue où vous vendez et nous vous montrons les marchés qui ont le plus à vous apporter, avant tout engagement.",
      },
      {
        title: "Un périmètre écrit",
        text: "Après le premier échange, vous recevez un périmètre écrit qui nomme les marchés, les pages et les livrables, dans l’ordre où les marchés seront ouverts.",
      },
      {
        title: "Une recherche native par marché",
        text: "Nous menons la recherche de chaque marché dans sa langue, nous classons les marchés candidats sur des données et nous fixons la structure du domaine avant la première page.",
      },
      {
        title: "Des pages natives dans chaque langue",
        text: "Nous rédigeons directement le français, l’anglais, l’espagnol et le néerlandais, et nous briefons des rédacteurs natifs du réseau BeTranslated pour l’allemand, l’italien et le portugais, avec le socle technique vérifié langue par langue.",
      },
      {
        title: "Un rapport mensuel par marché",
        text: "Chaque mois, nous rendons compte des positions, des réponses des IA et des demandes reçues, marché par marché, avec ce qui a progressé et la suite.",
      },
      {
        title: "Au mois le mois",
        text: "L’engagement court au mois, et le travail se poursuit aussi longtemps que chaque marché rapporte.",
      },
    ],
    absorbed: [
      "L’essentiel du travail se fait avant d’écrire le premier mot : les marchés à ouvrir, dans quel ordre, et où va le budget, décidés selon ce que vaut chaque marché.",
      "Vient ensuite la structure : un site capable de porter plusieurs marchés, des adresses de pages aux balises hreflang, en passant par les éléments à réécrire pour chaque langue. Bien construite, chaque nouvelle langue s’ajoute à celles qui existent.",
      "La marque, enfin, doit faire le voyage intacte. Un slogan est réécrit pour le nouveau marché, car une traduction littérale dit souvent tout autre chose : l’entreprise reste aussi reconnaissable à l’étranger que chez elle.",
    ],
    siblings: ["seo", "seo-anglais", "seo-espagnol", "seo-allemand", "seo-neerlandais", "seo-italien", "seo-portugais", "referencement-local"],
    siblingsEyebrow: "Nos autres services de référencement",
  },
};
