---
words: 2562
title: "Extensions Chrome pour traducteurs : ce que chacune vous fait gagner"
metaTitle: "Extensions Chrome pour traducteurs : le temps gagné"
slug: "extensions-chrome-traducteurs"
locale: "fr"
type: "posts"
group: "g021"
wpId: null
date: "2026-10-03"
modified: "2026-10-03"
sourceUrl: null
excerpt: "Les extensions Chrome pour traducteurs qui méritent leur place en 2026 : premiers jets plus rapides, terminologie plus sûre, documents clients plus nets."
---

## Des extensions Chrome qui accélèrent le premier jet

Si votre équipe traduit dans le navigateur, vos extensions décident de deux choses : la vitesse à laquelle avance un premier jet, et sa netteté quand il arrive dans un document client ou sur une page en ligne. Une boîte à outils rapide fait gagner du temps sur chaque dossier ; une boîte à outils soignée garde la confiance du client. Une liste mise en favori en 2022 mérite une mise à jour : voici celle que nous gardons installée après plus de deux décennies de travail entre l’anglais, le français, l’espagnol et le néerlandais, et l’ordre dans lequel nous l’utilisons.

## Manifest V3 et LLM : ce qui a changé dans le navigateur

Deux évolutions ont redessiné l’ancienne boîte à outils. D’abord, Chrome a retiré Manifest V2 au cours de 2024 et 2025. Les extensions ont dû migrer vers Manifest V3 pour continuer à fonctionner : plusieurs extensions de traduction se sont reconstruites autour de service workers, d’autres ont quitté le Chrome Web Store.

La seconde évolution pèse davantage. Les grands modèles de langage sont entrés dans le navigateur par des extensions dédiées et des panneaux latéraux. Pour la recherche courante, la reformulation rapide et la post-édition d’une traduction automatique, une seule extension de LLM fait désormais le travail de trois ou quatre extensions de traduction.

<figure class="post-fig">
<svg viewBox="0 0 400 160" role="img" aria-label="La recherche courante, la reformulation rapide et la post-édition d’une traduction automatique, autrefois réparties entre trois ou quatre extensions, réunies dans une seule extension de LLM.">
<path d="M160 29 L240 70" class="fg-accent"/>
<path d="M160 80 L240 80" class="fg-accent"/>
<path d="M160 131 L240 90" class="fg-accent"/>
<rect x="10" y="12" width="150" height="34" rx="6" class="fg-box"/>
<rect x="10" y="63" width="150" height="34" rx="6" class="fg-box"/>
<rect x="10" y="114" width="150" height="34" rx="6" class="fg-box"/>
<rect x="240" y="50" width="150" height="60" rx="6" class="fg-hot"/>
<text x="85" y="35" text-anchor="middle" class="fg-text">Recherche</text>
<text x="85" y="86" text-anchor="middle" class="fg-text">Reformulation</text>
<text x="85" y="137" text-anchor="middle" class="fg-text">Post-édition</text>
<text x="315" y="77" text-anchor="middle" class="fg-strong">Extension LLM</text>
<text x="315" y="97" text-anchor="middle" class="fg-label">un seul outil</text>
</svg>
<figcaption>Une seule extension de LLM couvre désormais, dans le navigateur, la recherche, la reformulation et la post-édition qui demandaient trois ou quatre outils.</figcaption>
</figure>

> Le secteur mondial des services et technologies linguistiques a généré 49,68 milliards de dollars en 2023, soit une baisse de 4,5 % par rapport aux 52,01 milliards de dollars de 2022, sous l’effet de l’adoption par les entreprises de la traduction automatique neuronale et des grands modèles de langage.
>
> Source : [CSA Research, 2024 Market Sizing Update](https://csa-research.com/Blogs-Events/CSA-in-the-Media/Press-Releases/Language-Services-and-Technology-Industry-Faces-Revenue-Decline-but-Remains-Poised-for-Transformation)

Si le prix au mot continue de baisser alors que les volumes se maintiennent, c’est la vitesse qui garde un traducteur rentable, et cette vitesse vient de la boîte à outils du navigateur.

## Les moteurs de traduction que nous gardons dans la barre d’outils

### DeepL pour Chrome

La meilleure qualité brute pour les langues européennes, d’après notre expérience. Nous ouvrons [DeepL](https://www.deepl.com/en/chrome-extension) en premier quand il nous faut un premier jet en français ou en allemand qui sonne naturel. Sélectionnez un texte sur n’importe quelle page, appuyez sur un raccourci, et lisez la traduction dans une fenêtre contextuelle, à l’endroit même où vous êtes.

La version gratuite couvre la plupart des recherches rapides ; la version Pro ouvre le mode document et les glossaires dans l’application principale. DeepL possède aussi Linguee, et un abonnement payant réunit ainsi exemples en contexte et traduction automatique dans un même flux de travail.

### ImTranslator

Nous gardons [ImTranslator](https://chromewebstore.google.com/detail/imtranslator-translator-d/noaijdpnepcgjemiklgfkcfbkokogabh) installé pour une seule tâche : comparer côte à côte, dans la même fenêtre, les traductions de Google, de Microsoft Bing et d’autres moteurs. Quand un client interroge un choix de formulation, une comparaison à trois est la preuve la plus rapide à poser sur la table. L’extension est passée à Manifest V3, compte environ 900 000 utilisateurs et a été mise à jour en mars 2026.

### Mate Translate

Le traducteur en bulle que nous utilisons par défaut pour la lecture courante. Sélectionnez un mot, obtenez sa définition et sa traduction, puis enregistrez-le dans un recueil d’expressions synchronisé entre vos appareils. La version Pro ajoute la traduction des sous-titres Netflix, utile pour vérifier comment une plateforme de streaming a rendu une expression familière.

Depuis début 2025, les avis des utilisateurs notent moins bien sa traduction de pages entières. Nous utilisons donc [Mate](https://chromewebstore.google.com/detail/mate-translate-%E2%80%93-translat/ihmgiclibbndffejedjimfjmfoabpcke) comme aide pour les mots et les expressions, et confions les documents entiers à d’autres outils.

### Google Traduction

Tous les clients le connaissent, et c’est sa principale force. Quand un client nous envoie un site à lire vite, l’extension officielle Google Traduction donne l’essentiel d’une page en quelques secondes.

## Les assistants d’IA qui ont repris la moitié de l’ancienne boîte à outils

Les écarts qui comptent le plus se logent dans le ton, le registre et l’ambiguïté, et ils demandent du contexte, qu’une extension de LLM sait recevoir. Pour les phrases complexes, idiomatiques, juridiques ou techniques, une extension de LLM généraliste dépasse aujourd’hui la plupart des outils de traduction dédiés.

### Claude in Chrome et ChatGPT

Nous pouvons coller un paragraphe, trois lignes de contexte et une consigne d’une ligne comme « Traduire en français soutenu pour la clientèle d’un cabinet d’avocats belge, en gardant le vouvoiement ». Une extension de LLM applique la consigne telle qu’elle est écrite ; un moteur seul travaille à partir du texte uniquement.

<figure class="post-fig">
<svg viewBox="0 0 400 150" role="img" aria-label="Le même texte source, deux traitements : un moteur seul travaille à partir du texte uniquement, une extension de LLM suit aussi une consigne d’une ligne sur le ton et le public.">
<path d="M150 75 L230 35" class="fg-dim" stroke-dasharray="4 4"/>
<path d="M150 75 L230 115" class="fg-accent"/>
<rect x="15" y="55" width="135" height="40" rx="6" class="fg-box"/>
<rect x="230" y="12" width="155" height="46" rx="6" class="fg-box"/>
<rect x="230" y="92" width="155" height="46" rx="6" class="fg-hot"/>
<text x="82" y="81" text-anchor="middle" class="fg-strong">Texte source</text>
<text x="307" y="32" text-anchor="middle" class="fg-text">Moteur</text>
<text x="307" y="50" text-anchor="middle" class="fg-label">le texte seul</text>
<text x="307" y="112" text-anchor="middle" class="fg-strong">Extension LLM</text>
<text x="307" y="130" text-anchor="middle" class="fg-label">suit la consigne</text>
</svg>
<figcaption>Le ton, le registre et le public passent par la consigne, et une extension de LLM lit cette consigne avec le texte.</figcaption>
</figure>

Nous utilisons Claude in Chrome, disponible pour tous depuis le 26 août 2026 sur les offres payantes de Claude, pour les dossiers clients où le ton et le registre comptent, et ChatGPT pour les reformulations rapides et la recherche d’idées. Nous relisons à la main chaque résultat des deux. Notre article sur les [outils d’IA et de traduction automatique](/fr/outils-ia-traduction-automatique/) décrit le flux de travail qui encadre ces relectures.

### DeepL Write

À mi-chemin entre un traducteur et un correcteur, il reformule votre texte en langue cible pour le ton, le registre et la fluidité. Nous y passons nos propres textes français et espagnols, puis acceptons ou refusons chaque suggestion, phrase par phrase. Il repère la raideur d’une traduction mot à mot.

<aside class="post-cta">
<p><strong>Des premiers jets d’IA destinés à des documents que liront vos clients ou vos autorités de contrôle ?</strong> Avec notre service de <a href="/fr/services/traduction-professionnelle/">traduction professionnelle</a>, chaque document est confié à un traducteur qui connaît votre secteur, puis relu avant la livraison. <a href="/fr/nous-contacter/">Réservez un premier échange</a>.</p>
</aside>

## Les outils de référence que nous utilisons chaque jour

La plupart des choix de traduction se jouent entre deux sens plausibles. Ces outils de recherche tranchent vite, et ce sont eux qui vous permettent de vérifier un premier jet d’IA avant de vous y fier.

### Linguee

Un concordancier bilingue, avec des phrases d’exemple tirées de documents de l’Union européenne, de brevets et de corpus parallèles. Quand nous voulons contrôler une traduction de DeepL, Linguee montre l’emploi du terme dans vingt documents réels. Il appartient désormais à DeepL et fonctionne toujours comme référence autonome.

### Reverso Context

Le même principe que Linguee, avec d’autres sources : plus solide sur la langue parlée, les sous-titres de films et le registre de la conversation.

### LanguageTool

Un correcteur de grammaire et de style multilingue pour le français, l’espagnol, l’allemand, le néerlandais et d’autres langues. Grammarly couvre l’anglais seul à la profondeur qu’il nous faut ; pour tout travail dans une autre langue, [LanguageTool](https://languagetool.org/chrome) est le meilleur choix.

## Deux extensions pour chiffrer et vérifier un site avant de le traduire

Si vos traductions touchent des sites web, deux extensions vous donnent une vue complète du site avant le devis et confirment que la source est saine avant de la localiser. Nous les présentons avec d’autres dans notre sélection d’[extensions Chrome pour le SEO](/fr/extensions-chrome-seo/).

**Wappalyzer** indique le CMS, les extensions et la configuration de traduction d’un site avant même que vous ouvriez le code source. Quand un prospect nous interroge sur la traduction de son site WordPress, nous voulons savoir en deux secondes s’il tourne sous WPML, Polylang, TranslatePress ou un système maison. Notre page de [localisation de site web](/fr/services/localisation-de-site-web/) explique ce que chacun implique en pratique.

<figure class="post-fig">
<svg viewBox="0 0 400 160" role="img" aria-label="Wappalyzer indique en quelques secondes si un site WordPress tourne sous WPML, Polylang, TranslatePress ou un système maison.">
<path d="M140 80 L240 23" class="fg-line"/>
<path d="M140 80 L240 61" class="fg-line"/>
<path d="M140 80 L240 99" class="fg-line"/>
<path d="M140 80 L240 137" class="fg-line"/>
<rect x="10" y="58" width="130" height="44" rx="6" class="fg-hot"/>
<rect x="240" y="8" width="150" height="30" rx="6" class="fg-box"/>
<rect x="240" y="46" width="150" height="30" rx="6" class="fg-box"/>
<rect x="240" y="84" width="150" height="30" rx="6" class="fg-box"/>
<rect x="240" y="122" width="150" height="30" rx="6" class="fg-box"/>
<text x="75" y="86" text-anchor="middle" class="fg-strong">Wappalyzer</text>
<text x="315" y="28" text-anchor="middle" class="fg-text">WPML</text>
<text x="315" y="66" text-anchor="middle" class="fg-text">Polylang</text>
<text x="315" y="104" text-anchor="middle" class="fg-text">TranslatePress</text>
<text x="315" y="142" text-anchor="middle" class="fg-text">Système maison</text>
</svg>
<figcaption>Connaître la configuration de traduction avant d’ouvrir le code source permet un devis qui reflète le travail réel du site.</figcaption>
</figure>

**Detailed SEO Extension** donne un audit on-page rapide des titres, des métadonnées, du hreflang, des balises canoniques et du balisage schema. Avant de localiser un site dans trois nouvelles langues, nous vérifions que le SEO de la langue source tient la route. Notre guide des [réglages techniques d’un site multilingue](/fr/seo-technique-site-multilingue/) détaille ce que nous regardons ensuite.

## Une liste courte : les cinq extensions remplacées

Chaque extension conservée ajoute une fenêtre, un raccourci et une autorisation. Cinq ont donc laissé leur place. Readlang Web Reader sert surtout les apprenants en langues. TransOver a un moteur passé derrière DeepL et une fenêtre contextuelle qui entre en conflit avec plusieurs sites modernes. Les fiches de Rememberry trouvent leur meilleure place dans Anki. Grammarly reste excellent pour l’anglais seul, et LanguageTool couvre davantage de langues en profondeur. Lingvanex fonctionne toujours, et DeepL associé à une extension de LLM couvre le même terrain avec un meilleur résultat.

## Le comparatif côte à côte

| Extension | Idéale pour | Version gratuite | Langues | Notre usage |
| --- | --- | --- | --- | --- |
| DeepL pour Chrome | Traduction automatique naturelle des langues européennes | Oui (plafond de caractères) | Plus de 100 | Tous les jours |
| ImTranslator | Comparer les moteurs côte à côte | Oui | Plus de 100 | Chaque semaine |
| Mate Translate | Bulle pour mots et expressions | Oui (avec option payante) | Plus de 200 | Tous les jours |
| Google Traduction | L’essentiel d’une page en un instant | Oui | Plus de 130 | Tous les jours |
| Claude in Chrome | Traduction et réécriture en contexte | Offre Claude payante | Toutes les grandes langues | Tous les jours |
| DeepL Write | Peaufiner la langue cible | Oui | 9 | Par projet |
| Linguee | Phrases d’exemple bilingues | Oui | Plus de 25 | Toutes les heures |
| Reverso Context | Registre familier et expressions | Oui | Plus de 15 | Tous les jours |
| LanguageTool | Contrôle grammatical multilingue | Oui | Plus de 30 | Tous les jours |

> DeepL Translator propose plus de 100 langues ; l’amélioration de texte de DeepL Write en couvre neuf : chinois, anglais, français, allemand, italien, japonais, coréen, portugais et espagnol (vérifié le 26 septembre 2026).
>
> Source : [DeepL API documentation, Languages supported](https://developers.deepl.com/docs/getting-started/supported-languages)

> Le plus grand changement en plus de deux décennies de travail multilingue : le navigateur est devenu l’établi. Tout ce que nous faisions entre Trados, un dictionnaire papier et trois écrans se passe aujourd’hui dans une seule fenêtre Chrome, avec sept extensions.
>
> Mike Bastin, consultant en SEO multilingue et en traduction

## L’ordre qui fait gagner le plus sur un vrai dossier

Les outils rapportent le plus dans le bon ordre : les machines d’abord pour la vitesse, un humain en dernier pour la justesse. Un exemple réel : un cabinet d’avocats belge nous a envoyé un extrait de contrat de 1 200 mots en français, à traduire en anglais pour une réunion avec un client international.

<figure class="post-fig">
<svg viewBox="0 0 400 222" role="img" aria-label="Cinq passages dans l’ordre : premier jet DeepL, vérification des termes dans Linguee, réécriture avec Claude, contrôle grammatical LanguageTool, puis relecture finale à voix haute, à la main.">
<line x1="40" y1="22" x2="40" y2="198" class="fg-rule"/>
<circle cx="40" cy="22" r="16" class="fg-box"/>
<circle cx="40" cy="66" r="16" class="fg-box"/>
<circle cx="40" cy="110" r="16" class="fg-box"/>
<circle cx="40" cy="154" r="16" class="fg-box"/>
<circle cx="40" cy="198" r="16" class="fg-hot"/>
<text x="40" y="28" text-anchor="middle" class="fg-strong">1</text>
<text x="40" y="72" text-anchor="middle" class="fg-strong">2</text>
<text x="40" y="116" text-anchor="middle" class="fg-strong">3</text>
<text x="40" y="160" text-anchor="middle" class="fg-strong">4</text>
<text x="40" y="204" text-anchor="middle" class="fg-strong">5</text>
<text x="72" y="28" class="fg-text">DeepL</text>
<text x="72" y="72" class="fg-text">Linguee</text>
<text x="72" y="116" class="fg-text">Claude</text>
<text x="72" y="160" class="fg-text">LanguageTool</text>
<text x="72" y="204" class="fg-text">Voix haute</text>
<text x="388" y="28" text-anchor="end" class="fg-label">premier jet</text>
<text x="388" y="72" text-anchor="end" class="fg-label">vérifier les termes</text>
<text x="388" y="116" text-anchor="end" class="fg-label">lever l’ambiguïté</text>
<text x="388" y="160" text-anchor="end" class="fg-label">grammaire</text>
<text x="388" y="204" text-anchor="end" class="fg-label">à la main</text>
</svg>
<figcaption>Les machines font vite les quatre premiers passages ; le cinquième, un humain qui lit chaque phrase, est celui que paie le client.</figcaption>
</figure>

1. Coller le français dans DeepL par l’extension, pour obtenir un premier jet propre.
2. Relire le premier jet en entier, repérer la terminologie juridique et vérifier chaque terme technique dans Linguee.
3. Réécrire les phrases ambiguës avec Claude in Chrome, avec une consigne d’une ligne sur les usages de l’anglais juridique en Belgique.
4. Passer l’anglais dans LanguageTool pour rattraper les glissements grammaticaux.
5. Lire une fois à voix haute, phrase par phrase.

Deux heures entre le français brut et l’anglais livré.

<aside class="post-cta">
<p><strong>Un contrat ou un acte de procédure où chaque terme engage ?</strong> Notre <a href="/fr/services/traduction-professionnelle/">traduction juridique</a> est confiée à des traducteurs formés au droit du pays concerné, avec une traduction assermentée ou certifiée quand l’organisme destinataire l’exige. <a href="/fr/nous-contacter/">Dites-nous à quoi sert le document</a>.</p>
</aside>

## Les outils sur lesquels miser ensuite

Deux prévisions pour les douze à dix-huit prochains mois. Les LLM en panneau latéral absorberont probablement la plupart des extensions de traduction dédiées pour la recherche au niveau du mot, tandis que les corpus bilingues comme Linguee et Reverso Context prendront plus d’importance, car des exemples réels sont la façon de vérifier ce que produit un LLM.

Les compagnons d’outils de TAO spécialisés vont aussi se multiplier. Smartcat, Lokalise et Phrase s’emploient tous à intégrer le travail du traducteur dans Chrome : si vous vivez dans un environnement de TAO, attendez-vous à ajouter l’un d’eux bientôt. Pour une vue plus large, lisez notre article sur [ce que l’IA change dans la traduction et la localisation](/fr/ia-traduction-et-localisation/).

La boîte à outils du navigateur est la surface. Dessous se trouve un flux de travail construit pour vérifier la traduction automatique et les LLM plus vite que le prix au mot ne baisse. Si vous gérez des contenus multilingues sur plusieurs marchés, notre service de [post-édition de traduction automatique](/fr/services/postedition-ia/) applique ce flux de travail à vos volumes.

## Questions fréquentes

### Ces extensions sont-elles toutes gratuites ?

Toutes ont une version gratuite qui couvre un usage occasionnel, à l’exception de Claude in Chrome, qui demande une offre Claude payante. Pour un volume professionnel, DeepL Pro, Mate Pro et un abonnement Claude ou ChatGPT ouvrent les fonctions dont la plupart des traducteurs en activité finissent par avoir besoin.

### Faut-il encore un outil de TAO avec une boîte à outils aussi solide ?

Oui, pour tout projet avec mémoire de traduction, remises sur les répétitions ou glossaires fournis par le client. La boîte à outils du navigateur accélère la recherche, la vérification et la relecture ; l’outil de TAO garde la segmentation, la mémoire et la cohérence que les clients professionnels attendent sur un projet à plusieurs fichiers.
