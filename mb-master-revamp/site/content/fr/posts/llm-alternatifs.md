---
words: 2255
title: "LLM alternatifs à ChatGPT : dix modèles à connaître"
slug: "llm-alternatifs"
locale: "fr"
type: "posts"
group: "g144"
wpId: null
date: "2026-10-03"
modified: "2026-10-03"
sourceUrl: null
excerpt: "Dix LLM alternatifs à ChatGPT, l’usage où chacun excelle et la licence à vérifier, pour payer le juste prix vos tâches d’IA courantes."
---

## Un LLM adapté à chaque tâche et à chaque langue

Votre équipe paie peut-être le tarif d’un modèle de pointe pour des tâches qu’un modèle plus petit accomplirait très bien. Dans certaines de vos langues, un modèle moins connu traduit parfois mieux que celui que vous utilisez aujourd’hui. Pour une entreprise qui vend en Espagne, au Benelux, en Allemagne ou au Royaume-Uni, regarder au-delà de ChatGPT, Claude, Gemini et Llama réduit la facture des tâches courantes et peut relever la qualité sur les marchés que les modèles pensés pour l’anglais servent le moins bien.

Voici dix modèles regroupés selon leur intérêt, avec les conditions de licence à vérifier avant de construire dessus.

## Trois raisons de regarder au-delà de ChatGPT

Certains de ces modèles comptent pour le SEO multilingue et la traduction : une large couverture des langues autres que l’anglais leur permet de dépasser, sur des paires de langues précises, des modèles plus gros conçus d’abord pour l’anglais. D’autres comptent parce qu’ils sont réellement open source et utilisables commercialement, une exigence plus stricte que celle que remplissent bien des modèles dits « ouverts ». Quelques-uns, enfin, ont lancé des idées que tout le secteur a reprises depuis.

Chaque fiche renvoie à sa source officielle. Licences et gammes de modèles évoluent vite : les informations ci-dessous ont été vérifiées sur les pages de chaque projet le 26 septembre 2026.

Le haut du classement appartient aux modèles fermés d’OpenAI, d’Anthropic et de Google. Pour les tâches qui demandent moins qu’un raisonnement de pointe, un modèle ouvert plus petit convient souvent mieux, pour une fraction du coût.

## Modèles de science ouverte et de recherche

Ces modèles servent surtout de référence : ils expliquent le comportement des modèles ouverts que vous pourriez déployer.

### BLOOM

Atelier de recherche BigScience, une collaboration internationale de science ouverte

**Ce que c’est :** un LLM multilingue en accès ouvert de 176 milliards de paramètres, entraîné sur 46 langues naturelles et 13 langages de programmation.

> BLOOM : 176 247 271 424 paramètres, 46 langues naturelles et 13 langages de programmation, publié sous la licence BigScience RAIL v1.0.
>
> Source : [Hugging Face, fiche du modèle bigscience/bloom, 2022](https://huggingface.co/bigscience/bloom)

**Pourquoi il compte :** ses points de contrôle, la documentation de ses données et les détails de son entraînement sont publics, ce qui en fait une référence pour les chercheurs qui étudient le comportement des LLM et leur couverture multilingue. Sa licence RAIL comporte des restrictions d’usage : BLOOM relève donc de l’accès ouvert, et de l’open source au sens large seulement.

[BLOOM sur Hugging Face](https://huggingface.co/bigscience/bloom)

### OpenAssistant

LAION

**Ce que c’est :** un projet d’IA conversationnelle communautaire et entièrement open source, associé aux jeux de données d’instructions OASST recueillis auprès de milliers de bénévoles.

**Pourquoi il compte :** LAION a déclaré le projet terminé le 25 octobre 2023, mais le jeu de données final oasst2 reste disponible sur Hugging Face et sert encore à affiner et à évaluer des modèles de conversation ouverts.

[OpenAssistant sur Hugging Face](https://huggingface.co/OpenAssistant)

### Orca 2

Microsoft Research

**Ce que c’est :** un petit modèle (variantes de 7 et 13 milliards de paramètres) entraîné à des stratégies de raisonnement à partir des explications pas à pas de modèles enseignants plus grands.

> Orca 2 dépasse nettement les modèles de taille comparable (y compris le modèle Orca d’origine) et atteint des niveaux de performance égaux ou supérieurs à ceux de modèles 5 à 10 fois plus grands, sur des tâches complexes qui testent des capacités de raisonnement avancées sans exemple préalable.
>
> Source : [Microsoft Research blog, « Orca 2: teaching small language models how to reason », 20 novembre 2023](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

**Pourquoi il compte :** Orca a popularisé l’« explanation tuning », où un modèle apprend à raisonner étape par étape à partir des démonstrations d’un enseignant. La même idée de distillation traverse une grande partie des petits modèles ouverts qui ont suivi.

[Orca 2 chez Microsoft Research](https://www.microsoft.com/en-us/research/blog/orca-2-teaching-small-language-models-how-to-reason/)

## Premiers modèles ouverts utilisables commercialement

Les conditions de licence décident si un pilote prometteur peut passer en production. Ces quatre familles ont ouvert la voie à l’usage commercial des modèles ouverts, et leurs licences variées montrent pourquoi il faut vérifier la variante exacte autant que la famille.

### Falcon

Technology Innovation Institute (TII), Abou Dhabi

**Ce que c’est :** une famille de LLM lancée avec Falcon-7B, Falcon-40B et Falcon-180B, entraînés sur le jeu de données RefinedWeb, puis enrichie de Falcon 2, Falcon 3, Falcon Mamba et de la série hybride Falcon-H1.

**Pourquoi il compte :** Falcon-7B et Falcon-40B ont été parmi les premiers modèles ouverts performants publiés sous Apache 2.0, usage commercial compris. Les licences ont divergé depuis : Falcon-180B est distribué sous la Falcon-180B TII License et sa politique d’usage acceptable, et les versions récentes utilisent la licence Falcon propre à TII. Lisez donc les conditions du modèle exact que vous comptez déployer.

[Site officiel de Falcon LLM](https://falconllm.tii.ae/)

### Modèles MPT

MosaicML, aujourd’hui intégré à Databricks

**Ce que c’est :** une série de LLM ouverts (MPT-7B, MPT-30B) conçus pour un entraînement efficace et de longues fenêtres de contexte. Databricks a racheté MosaicML en 2023.

**Pourquoi il compte :** MPT a montré très tôt comment l’encodage positionnel ALiBi permet à un modèle d’être affiné et d’extrapoler vers de longs contextes ; sa variante StoryWriter a été présentée avec 84 000 jetons. Les licences varient selon la variante :

> MPT-7B Base : Apache-2.0. MPT-7B-StoryWriter-65k+ : Apache-2.0. MPT-7B-Instruct : CC-By-SA-3.0. MPT-7B-Chat : CC-By-NC-SA-4.0 (usage non commercial uniquement).
>
> Source : [Databricks, « Introducing MPT-7B », mai 2023](https://www.databricks.com/blog/mpt-7b)

[Annonce de MPT-7B par Databricks](https://www.databricks.com/blog/mpt-7b)

### Dolly 2.0

Databricks

**Ce que c’est :** un modèle de 12 milliards de paramètres qui suit des instructions, présenté à son lancement comme le premier LLM open source affiné sur instructions et autorisé pour l’usage commercial. Il a été affiné sur databricks-dolly-15k, un ensemble de 15 000 paires d’instructions et de réponses rédigées par des employés de Databricks.

**Pourquoi il compte :** jusque-là, affiner un modèle sur instructions exigeait des jeux de données propriétaires. Celui de Dolly a été publié sous une licence Creative Commons Attribution-ShareAlike qui autorise l’usage commercial, et il a nourri toute une vague de modèles ouverts.

[Annonce de Dolly 2.0 par Databricks](https://www.databricks.com/blog/2023/04/12/dolly-first-open-commercially-viable-instruction-tuned-llm)

### XGen-7B

Salesforce AI Research

**Ce que c’est :** un LLM de 7 milliards de paramètres conçu pour les tâches à longues séquences, comme le résumé de longs documents et de dialogues.

**Pourquoi il compte :** XGen a montré qu’un petit modèle entraîné sur davantage de données, avec une montée progressive vers des contextes plus longs, pouvait égaler ou dépasser les modèles ouverts de son époque comme MPT, Falcon et LLaMA sur les bancs d’essai courants.

> XGen-7B : 7 milliards de paramètres, 1 500 milliards de jetons d’entraînement, contexte de 8 192 jetons ; modèles de base publiés en open source sous Apache-2.0.
>
> Source : [Salesforce, « Long sequence modeling with XGen », 2023](https://www.salesforce.com/blog/xgen/)

[XGen chez Salesforce AI Research](https://www.salesforce.com/blog/xgen/)

## Les familles à poids ouverts d’aujourd’hui

Voici les modèles les plus susceptibles de reprendre une partie du travail pour lequel vous payez aujourd’hui une API, et deux d’entre eux sont solides bien au-delà de l’anglais.

### Qwen

Alibaba Cloud, équipe Qwen

**Ce que c’est :** la famille de LLM à poids ouverts d’Alibaba. La génération actuelle, Qwen3.5, compte huit modèles vision-langage, de moins d’un milliard de paramètres jusqu’à un modèle phare à mélange d’experts de 397 milliards.

> Qwen3.5-397B-A17B compte 397 milliards de paramètres, dont 17 milliards actifs par jeton. Les modèles à poids ouverts sont disponibles sous licence Apache 2.0 et prennent en charge 201 langues.
>
> Source : [DeepLearning.AI, The Batch, sur la sortie de Qwen3.5 par Alibaba, 2026](https://www.deeplearning.ai/the-batch/alibabas-latest-flagship-models-are-open-weights-moe-performers-in-sizes-from-less-than-1b-parameters)

**Pourquoi il compte :** Qwen est devenu l’une des familles de modèles ouverts les plus utilisées sur Hugging Face, avec un très grand nombre de dérivés affinés. Sa large couverture linguistique en fait un candidat sérieux pour le travail multilingue, et le premier test évident pour toute application destinée aux marchés sinophones.

[Site officiel de Qwen](https://qwenlm.github.io/)

### Mistral 7B, Mixtral et leurs successeurs

Mistral AI (Paris)

**Ce que c’est :** Mistral 7B était un modèle dense de 7 milliards de paramètres qui dépassait Llama 2 13B à sa sortie. Mixtral 8x7B a suivi, un modèle clairsemé à mélange d’experts (MoE) d’environ 47 milliards de paramètres au total, dont 13 milliards seulement actifs par jeton.

**Pourquoi il compte :** Mixtral a contribué à faire entrer l’architecture MoE dans le courant principal des modèles à poids ouverts. Pour une entreprise française, belge, suisse ou luxembourgeoise qui met des systèmes en production, Mistral offre un fournisseur établi dans l’Union européenne, à Paris. Sa gamme actuelle associe des modèles à poids ouverts (Mistral Large 3, Mistral Small 4 et la série Ministral 3 sous Apache 2.0) à Mistral Medium 3.5, sous une licence MIT modifiée.

[Site officiel de Mistral AI](https://mistral.ai/)

### Phi-3 et Phi-4

Microsoft

**Ce que c’est :** une série de petits modèles de langage conçus pour une faible latence et un usage sur appareil. Phi-4 (14 milliards de paramètres, sorti en décembre 2024) rivalise avec des modèles bien plus grands en raisonnement et en mathématiques grâce à des données d’entraînement sélectionnées et synthétiques. La famille comprend désormais Phi-4-mini et Phi-4-multimodal.

**Pourquoi il compte :** Phi démontre que la qualité des données peut l’emporter sur leur quantité. Les plus petites variantes tournent sur un ordinateur portable ou un appareil en périphérie, ce qui en fait de bons candidats pour l’IA locale, les données sensibles et l’usage hors ligne.

[La famille Phi chez Microsoft](https://azure.microsoft.com/en-us/products/phi)

<aside class="post-cta">
<p><strong>Le bon partage entre modèle ouvert et API payante pour vos contenus multilingues.</strong> Notre conseil en IA indique quelles parties de votre flux de travail un modèle peut prendre en charge dans chaque langue, et lesquelles demandent encore un relecteur qui lit la langue. <a href="/fr/services/conseil-ia/">Découvrir notre conseil en IA</a> ou <a href="/fr/nous-contacter/">réserver un premier échange</a>.</p>
</aside>

## Les licences en un coup d’œil

Consultez la ligne du tableau avant de lancer le banc d’essai : un modèle dont la licence couvre votre usage vous évite de tout reconstruire plus tard.

| Modèle | Éditeur | Licence, telle que vérifiée | Convient à |
|---|---|---|---|
| BLOOM | BigScience | BigScience RAIL v1.0, avec restrictions d’usage | Recherche, langues peu dotées |
| OpenAssistant | LAION | Jeu de données oasst2 : Apache 2.0 | Entraîner et évaluer des modèles de conversation |
| Orca 2 | Microsoft Research | Licence Microsoft spécifique | Recherche sur le raisonnement des petits modèles |
| Falcon | TII | Apache 2.0 pour 7B et 40B ; licences TII pour 180B et les versions récentes | À vérifier modèle par modèle |
| MPT | Databricks | Apache 2.0 pour le modèle de base ; certaines variantes non commerciales | Expériences sur contexte long |
| Dolly 2.0 | Databricks | Publié pour un usage commercial | Référence pour l’affinage sur instructions |
| XGen-7B | Salesforce | Apache 2.0 pour les modèles de base | Résumé de longs documents |
| Qwen3.5 | Alibaba Cloud | Apache 2.0 | Multilingue, marchés chinois |
| Modèles ouverts Mistral | Mistral AI | Apache 2.0 (Large 3, Small 4, Ministral 3) | Déploiement en Europe |
| Phi-4 | Microsoft | MIT | IA sur appareil et en local |

> Étiquettes de licence sur Hugging Face, vérifiées le 26 septembre 2026 : microsoft/phi-4, MIT ; microsoft/Orca-2-13b, other (une licence spécifique) ; jeu de données OpenAssistant/oasst2, Apache 2.0.
>
> Source : [Hugging Face, microsoft/phi-4](https://huggingface.co/microsoft/phi-4), [microsoft/Orca-2-13b](https://huggingface.co/microsoft/Orca-2-13b) et [OpenAssistant/oasst2](https://huggingface.co/datasets/OpenAssistant/oasst2), 2026

Les autres licences proviennent des pages de chaque projet, liées dans la section correspondante plus haut.

## Le bon modèle pour chaque tâche

Attribuer à chaque tâche le modèle qui lui convient coûte souvent moins cher qu’un envoi systématique vers le dernier modèle de pointe.

Vous travaillez sur le SEO multilingue et la traduction ? Testez Qwen et les modèles ouverts de Mistral sur vos paires de langues, par exemple du français vers l’espagnol, le néerlandais ou l’allemand, et consultez la documentation de BLOOM pour les langues peu dotées. Notre comparatif des [outils d’IA et de traduction automatique](/fr/outils-ia-traduction-automatique/) montre où placer la relecture humaine, et notre service de [post-édition de traduction automatique](/fr/services/postedition-ia/) la prend en charge par des relecteurs natifs. Vous construisez une fonction sur appareil ? Phi-4-mini et les modèles Ministral 3 tournent sur du matériel grand public. Vous avez besoin d’une licence compatible avec l’usage commercial ? Vérifiez la licence propre à chaque modèle : Falcon-40B, MPT-7B Base, XGen-7B et les modèles à poids ouverts actuels de Qwen et de Mistral utilisent Apache 2.0, tandis que d’autres variantes des mêmes familles relèvent de conditions différentes.

<figure class="post-fig">
<svg viewBox="0 0 400 140" role="img" aria-label="Trois questions qui resserrent le choix d’un modèle de langage : la licence permet-elle notre usage, gère-t-il notre langue, peut-il tourner là où nous en avons besoin.">
<rect x="10" y="10" width="380" height="34" rx="6" class="fg-box"/>
<rect x="50" y="54" width="300" height="34" rx="6" class="fg-box"/>
<rect x="100" y="98" width="200" height="34" rx="6" class="fg-hot"/>
<text x="200" y="32" text-anchor="middle" class="fg-text">La licence couvre notre usage ?</text>
<text x="200" y="76" text-anchor="middle" class="fg-text">Gère notre langue ?</text>
<text x="200" y="120" text-anchor="middle" class="fg-text">Tourne où il faut ?</text>
</svg>
<figcaption>Chaque question resserre nettement le choix et laisse une courte liste à tester sur vos propres contenus.</figcaption>
</figure>

Pour choisir un LLM, posez trois questions. La licence permet-elle ce que nous voulons réellement faire ? Le modèle gère-t-il bien notre langue cible ? Pouvons-nous le faire tourner là où nous en avons besoin, y compris sur appareil ?

Le choix du modèle pèse aussi sur votre visibilité : nos articles sur [le passage du SEO au GEO](/fr/seo-au-geo/) et sur [l’IA en traduction et localisation](/fr/ia-traduction-et-localisation/) montrent comment l’IA change la recherche et la production de contenus.

<aside class="post-cta">
<p><strong>Un modèle adapté à vos langues, une licence qui couvre votre usage et une facture proportionnée.</strong> Nous aidons les entreprises à choisir le LLM adapté à leurs contenus multilingues et à l’intégrer dans leurs flux de SEO et de traduction existants. <a href="/fr/nous-contacter/">Parlez-nous de votre projet</a>.</p>
</aside>
