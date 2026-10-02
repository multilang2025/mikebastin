---
words: 2674
title: "Checklist d’audit SEO technique pour votre site web"
slug: "checklist-audit-seo-technique"
locale: "fr"
type: "posts"
group: "g164"
wpId: null
date: "2026-09-30T10:50:00"
modified: "2026-09-30T10:50:00"
sourceUrl: null
excerpt: "Checklist d’audit SEO technique : ce qu’il faut vérifier, comment repérer chaque problème et comment le corriger, de l’exploration à la vitesse."
---

Votre contenu est solide, vos pages sont soignées, et les prochains gains de positions se trouvent en dessous : des pages que les moteurs atteignent, une seule version claire de chaque page, un site assez rapide sur mobile pour retenir le visiteur. Une fois ces points réglés, chaque euro investi dans le contenu et les liens rapporte toute sa valeur, sur votre marché d’origine comme sur ceux où vous vendez à l’étranger.

La checklist ci-dessous sert aux équipes marketing qui auditent leur site. Chaque section indique quoi vérifier, comment repérer le problème et comment le corriger, avec les outils que nous utilisons et de courts exemples de code.

Si vous préférez confier le travail, notre [service de SEO technique](/fr/services/seo-technique/) réalise le même audit et livre les corrections.

<figure class="post-fig">
<svg viewBox="0 0 400 130" role="img" aria-label="L’audit se déroule en quatre étapes, chacune dépendant de la précédente : exploration, indexation, affichage, positionnement.">
<line x1="50" y1="32" x2="350" y2="32" class="fg-rule"/>
<circle cx="50" cy="32" r="26" class="fg-box"/>
<circle cx="150" cy="32" r="26" class="fg-box"/>
<circle cx="250" cy="32" r="26" class="fg-box"/>
<circle cx="350" cy="32" r="26" class="fg-hot"/>
<text x="50" y="38" text-anchor="middle" class="fg-strong">1</text>
<text x="150" y="38" text-anchor="middle" class="fg-strong">2</text>
<text x="250" y="38" text-anchor="middle" class="fg-strong">3</text>
<text x="350" y="38" text-anchor="middle" class="fg-strong">4</text>
<text x="50" y="90" text-anchor="middle" class="fg-text">Exploration</text>
<text x="150" y="90" text-anchor="middle" class="fg-text">Indexation</text>
<text x="250" y="90" text-anchor="middle" class="fg-text">Affichage</text>
<text x="350" y="90" text-anchor="middle" class="fg-text">Position</text>
<text x="50" y="114" text-anchor="middle" class="fg-label">robots.txt</text>
<text x="150" y="114" text-anchor="middle" class="fg-label">canoniques</text>
<text x="250" y="114" text-anchor="middle" class="fg-label">vitesse, mobile</text>
<text x="350" y="114" text-anchor="middle" class="fg-label">métadonnées</text>
</svg>
<figcaption>Chaque étape dépend de la précédente. Google juge une balise title une fois la page explorée : l’audit suit donc les étapes dans cet ordre.</figcaption>
</figure>

## Exploration et indexabilité

Une page que les moteurs atteignent peut se positionner : tout le reste de cette liste commence là.

### Robots.txt

Le fichier `votredomaine.com/robots.txt` définit les chemins que les robots peuvent récupérer. Vérifiez qu’il bloque uniquement ce qu’il doit bloquer, avec le rapport robots.txt de la Search Console (Paramètres), qui affiche les fichiers trouvés, les dates d’exploration et les erreurs. L’outil d’inspection d’URL confirme si une URL précise est bloquée.

> Google a ajouté un rapport robots.txt à la Search Console en novembre 2023 et annoncé en même temps la fin de l’ancien testeur robots.txt, retiré le 12 décembre 2023.
> Source : [Search Engine Land, « Google Search Console adds robots.txt report »](https://searchengineland.com/google-search-console-adds-robots-txt-report-434708)

Cherchez d’abord une règle de préproduction restée en ligne, qui bloque le site entier :

```
User-agent: *
Disallow: /
```

Une ligne `Disallow:` vide autorise tout. Bloquez les sections privées par leur chemin, par exemple `Disallow: /section-privee/`.

### Sitemap XML

Un sitemap XML liste les URL que vous voulez voir indexées. Vérifiez que `votredomaine.com/sitemap.xml` existe, qu’il contient uniquement des URL actives, canoniques et indexables (chacune renvoyant un statut 200 à son adresse finale) et qu’il se met à jour quand le contenu change.

Yoast SEO ou Rank Math le génèrent sur WordPress, XML-Sitemaps.com sur un site statique. Soumettez-le dans Google Search Console et Bing Webmaster Tools, puis référencez-le dans robots.txt.

### Noindex et nofollow

Contrôlez chaque `noindex`, car il retire une page de la recherche aussi sûrement qu’un blocage. Explorez le site avec Screaming Frog ou Ahrefs Site Audit, listez chaque page portant `noindex` ou `nofollow`, puis confirmez que chacune est voulue. Pour les pages à indexer, omettez la balise meta robots ou utilisez `<meta name="robots" content="index, follow">`.

Laissez une URL en `noindex` ouverte dans robots.txt : Google peut alors récupérer la page et lire la consigne qu’elle porte.

### Redirections

| Code | Signification | Transmet les signaux | À utiliser quand |
| --- | --- | --- | --- |
| 301 | Déplacée définitivement | Oui | Une URL a une nouvelle adresse permanente |
| 302 | Trouvée, temporaire | Traitée à terme comme une 301 si elle reste | Un test court ou une page saisonnière |
| 410 | Disparue | Non | Le contenu est supprimé pour de bon |

Repérez les chaînes et les boucles avec Screaming Frog, Ahrefs ou l’extension Redirect Path, et faites pointer chaque redirection directement vers l’URL finale. Remplacez par des 301 les 302 devenues permanentes. Dans `.htaccess` :

```
Redirect 301 /ancienne-page /nouvelle-page
```

## Architecture du site et navigation

Les pages proches de la page d’accueil reçoivent plus de visites, des moteurs comme des acheteurs.

### Liens internes et profondeur de clic

Les liens internes répartissent l’autorité et montrent aux robots ce qui compte. Reliez chaque page orpheline repérée par l’outil d’audit depuis des pages pertinentes, avec un texte d’ancre qui décrit la cible, et gardez les pages importantes à trois clics au plus de l’accueil.

<figure class="post-fig">
<svg viewBox="0 0 400 200" role="img" aria-label="Une hiérarchie de site peu profonde : la page d’accueil renvoie vers les catégories, les catégories vers les pages, et chaque page se trouve à trois clics au plus.">
<rect x="150" y="10" width="100" height="36" rx="6" class="fg-hot"/>
<text x="200" y="34" text-anchor="middle" class="fg-text">Accueil</text>
<line x1="200" y1="46" x2="110" y2="80" class="fg-line"/>
<line x1="200" y1="46" x2="290" y2="80" class="fg-line"/>
<rect x="50" y="80" width="120" height="36" rx="6" class="fg-box"/>
<rect x="230" y="80" width="120" height="36" rx="6" class="fg-box"/>
<text x="110" y="104" text-anchor="middle" class="fg-text">Catégorie</text>
<text x="290" y="104" text-anchor="middle" class="fg-text">Catégorie</text>
<line x1="110" y1="116" x2="55" y2="150" class="fg-line"/>
<line x1="110" y1="116" x2="150" y2="150" class="fg-line"/>
<line x1="290" y1="116" x2="250" y2="150" class="fg-line"/>
<line x1="290" y1="116" x2="345" y2="150" class="fg-line"/>
<rect x="15" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="110" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="210" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="305" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<text x="55" y="173" text-anchor="middle" class="fg-label">Page</text>
<text x="150" y="173" text-anchor="middle" class="fg-label">Page</text>
<text x="250" y="173" text-anchor="middle" class="fg-label">Page</text>
<text x="345" y="173" text-anchor="middle" class="fg-label">Page</text>
</svg>
<figcaption>Une structure à plat garde chaque page à deux ou trois clics de l’accueil. Ces pages proches sont explorées plus souvent et reçoivent plus d’autorité interne.</figcaption>
</figure>

### Structure des URL

Des URL courtes, lisibles et séparées par des traits d’union se lisent mieux : `votredomaine.com/chaussures-bleues` parle davantage que `votredomaine.com/page?id=123`. Cherchez les longues chaînes de paramètres et les identifiants de session. Sur Apache, `mod_rewrite` associe des URL propres à des URL à paramètres :

```
RewriteEngine On
RewriteRule ^produit/([0-9]+)$ /produit.php?id=$1
```

### Fil d’Ariane et pagination

Le fil d’Ariane montre aux utilisateurs et aux moteurs où se situe une page. Ajoutez-le et balisez-le avec les données structurées `BreadcrumbList` :

```
<nav aria-label="Fil d’Ariane">
  <ol>
    <li><a href="https://votredomaine.com">Accueil</a></li>
    <li><a href="https://votredomaine.com/categorie">Catégorie</a></li>
    <li>Page actuelle</li>
  </ol>
</nav>
```

Google a cessé d’utiliser `rel="next"` et `rel="prev"` comme signal d’indexation en 2019 : une série paginée se positionne grâce à ses URL et à ses liens. Donnez à chaque page de la série sa propre URL et une canonique autoréférente, reliez les pages par de simples liens `<a href>` explorables, et proposez une page « tout afficher » uniquement là où elle se charge vite.

## Vitesse et Core Web Vitals

Une page rapide retient d’abord le visiteur et gagne ensuite son classement. Les Core Web Vitals mesurent le chargement, la réactivité et la stabilité visuelle à partir de vrais utilisateurs de Chrome. Interaction to Next Paint (INP) a remplacé First Input Delay (FID) le 12 mars 2024 : mettez à jour tout modèle d’audit qui réclame encore le FID. Consultez le rapport Core Web Vitals de la Search Console, puis diagnostiquez chaque URL dans PageSpeed Insights ou Lighthouse.

| Métrique | Mesure | Bon score | Corrections habituelles |
| --- | --- | --- | --- |
| LCP | Chargement du contenu principal | 2,5 secondes ou moins | Serveur plus rapide, image principale compressée, préchargement des ressources clés |
| INP | Réponse aux clics et aux appuis | 200 millisecondes ou moins | Moins de JavaScript, tâches longues découpées, moins de scripts tiers |
| CLS | Stabilité visuelle | 0,1 ou moins | Largeur et hauteur sur les images et les publicités, espace réservé aux contenus intégrés |

> Google recommande d’atteindre les trois seuils au 75e centile des chargements de page, sur mobile et sur ordinateur.
> Source : [web.dev, « Web Vitals »](https://web.dev/articles/vitals) ; [web.dev, « Interaction to Next Paint becomes a Core Web Vital on March 12 »](https://web.dev/blog/inp-cwv-march-12)

**Images.** Compressez-les avec TinyPNG, ImageOptim ou Kraken.io, servez du WebP ou de l’AVIF, dimensionnez-les à l’espace qu’elles occupent et chargez en différé (lazy-loading) celles qui se trouvent sous la ligne de flottaison. Chargez l’image principale tout de suite, pour un LCP rapide.

**Cache et minification.** Définissez des en-têtes `Cache-Control` pour les fichiers statiques, activez la compression GZIP ou Brotli et minifiez le CSS, le JavaScript et le HTML à la compilation (Webpack, Vite ou Gulp). Sur Apache :

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

**Réponse du serveur.** Un bon Time to First Byte (TTFB) améliore toutes les autres métriques. Mesurez-le dans WebPageTest, puis ajoutez un CDN comme Cloudflare, un cache de base de données (Redis) ou un hébergement plus puissant. UptimeRobot ou Pingdom signalent les pannes avant qu’elles pèsent sur vos positions.

**Mobile.** Google indexe la version mobile de votre site. Testez-la avec Lighthouse dans les outils de développement de Chrome et la barre d’appareils, en repérant le contenu plus large que l’écran, le texte trop petit et les zones tactiles trop rapprochées.

> Google a retiré le rapport d’ergonomie mobile, l’outil de test d’optimisation mobile et son API à partir du 1er décembre 2023, en orientant les propriétaires de sites vers Lighthouse.
> Source : [Search Engine Land, « Google officially drops Mobile Usability report, Mobile-Friendly Test tool and Mobile-Friendly Test API »](https://searchengineland.com/google-officially-drops-mobile-usability-report-mobile-friendly-test-tool-and-mobile-friendly-test-api-435377)

## Sécurité

Un cadenas propre installe la confiance dès le début de la visite. Chargez chaque page et chaque ressource en HTTPS (Why No Padlock repère le contenu mixte), redirigez le trafic HTTP vers HTTPS par une 301 et passez les liens internes en `https://` :

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://votredomaine.com/$1 [R=301,L]
```

Contrôlez la validité du certificat avec le [SSL Server Test](https://www.ssllabs.com/ssltest//index.html) de Qualys SSL Labs et automatisez son renouvellement (Certbot pour les certificats Let’s Encrypt).

## Données structurées qui peuvent donner des résultats enrichis

Les données structurées aident les moteurs à comprendre la page et peuvent lui valoir des résultats enrichis. Ajoutez les types qui correspondent au contenu (`Article`, `Product`, `BreadcrumbList`, `Organization`), de préférence en JSON-LD, et validez avec le test des résultats enrichis de Google et le Schema Markup Validator. Choisissez un seul format et utilisez-le partout.

```
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Votre entreprise",
  "url": "https://votredomaine.com",
  "logo": "https://votredomaine.com/images/logo.png"
}
```

Les balises Open Graph (`og:title`, `og:description`, `og:image` au minimum) commandent l’aspect d’une page partagée sur les réseaux sociaux :

```
<meta property="og:image" content="https://votredomaine.com/images/apercu.jpg" />
```

Vérifiez les aperçus avec le Sharing Debugger de Facebook et le Post Inspector de LinkedIn.

## Contenu dupliqué et contenu léger

Une page par recherche donne à cette page toute sa force. Quand le même contenu existe à plusieurs URL (avec ou sans `www`, avec une barre oblique finale ou un paramètre de suivi), une balise canonique désigne la version à indexer. Vérifiez que chaque modèle de page produit une canonique, qu’elle pointe vers une URL active et indexable, et que les liens internes utilisent le même format :

```
<link rel="canonical" href="https://www.votredomaine.com/page" />
```

Si `votredomaine.com/page` et `votredomaine.com/page?ref=twitter` affichent le même contenu, les deux déclarent `votredomaine.com/page` comme canonique.

Google a supprimé l’outil Paramètres d’URL de la Search Console en avril 2022 : la gestion des paramètres se fait sur le site lui-même, avec des balises canoniques, des liens internes cohérents et des règles robots.txt pour les paramètres à tenir hors de l’exploration, comme les identifiants de session :

```
Disallow: /*?sessionID=
```

> Le 28 mars 2022, Google a annoncé le retrait de l’outil Paramètres d’URL sous un mois, en indiquant qu’environ 1 % seulement des configurations qu’il contenait servaient à l’exploration.
> Source : [Google Search Central Blog, « Spring cleaning : the URL Parameters tool »](https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated)

Siteliner et Copyscape trouvent les textes dupliqués. Fusionnez les pages quasi identiques, les pages légères et les pages qui se disputent la même requête en une page plus forte, et redirigez les autres vers elle par une 301 : deux articles visant « bonnes pratiques SEO » deviennent un seul guide complet.

<aside class="post-cta">
<p><strong>Une page solide pour chaque recherche ?</strong> Notre <a href="/fr/services/seo-technique/">travail de SEO technique</a> détermine quelle page doit se positionner et dirige vos liens internes vers elle. <a href="/fr/nous-contacter/">Réservez un premier échange</a>.</p>
</aside>

## Contrôle des liens et des codes de statut

Chaque lien qui fonctionne garde un visiteur déjà intéressé.

| Constat | Ce qu’il indique | Correction |
| --- | --- | --- |
| 404 sur une page qui a des liens ou du trafic | Contenu déplacé ou supprimé, redirection oubliée | 301 vers la page pertinente la plus proche |
| 404 sur une page de faible valeur | Page réellement disparue | La laisser ou renvoyer une 410 ; retirer les liens internes qui y mènent |
| Lien sortant cassé | La ressource externe a déménagé ou disparu | Remplacer par une source actuelle ou retirer |
| Erreur serveur 5xx | Mauvaise configuration ou surcharge du serveur | Consulter les journaux, corriger l’erreur, changer d’hébergement si elle revient |

Screaming Frog, le rapport d’indexation des pages de la Search Console et Dead Link Checker couvrent ces contrôles. Une page 404 personnalisée, avec une recherche et des liens populaires, garde le visiteur sur le site.

## Métadonnées et SEO des images

Le title est la première chose que lit l’internaute, et souvent ce qui décide du clic. Donnez à chaque page indexable un title unique, ouvert par son mot-clé principal et tenant en 60 caractères environ (« Chaussures bleues : qualité et livraison rapide »), et une méta description unique qui donne une raison de cliquer.

Utilisez un seul `h1` par page, contenant le mot-clé principal, puis des `h2` et des `h3` dans l’ordre, un niveau à la fois :

```
<h1>Checklist d’audit SEO technique</h1>
<h2>Exploration et indexabilité</h2>
<h3>Robots.txt</h3>
```

Chaque image significative reçoit un texte alternatif qui la décrit avec des mots naturels : `alt="Chaussure bleue à semelle chromée"`. Renommez `IMG_1234.jpg` en `chaussure-bleue-semelle-chromee.jpg`. Pour les sites riches en images, ajoutez des entrées d’image au sitemap :

```
<url>
  <loc>https://votredomaine.com/page</loc>
  <image:image>
    <image:loc>https://votredomaine.com/images/chaussure-bleue.jpg</image:loc>
  </image:image>
</url>
```

## Contrôles SEO international : hreflang et versions régionales

Avec les bonnes balises, un acheteur allemand arrive sur votre page allemande, un acheteur espagnol sur votre page espagnole. Les sites multilingues et multirégionaux ont besoin d’annotations hreflang pour que Google serve à chaque utilisateur la bonne version. Vérifiez que les codes de langue et de région sont valides (le Royaume-Uni prend `en-gb`, là où beaucoup saisissent `en-uk`), que chaque version porte ses balises de retour et que chacune se désigne elle-même :

```
<link rel="alternate" href="https://votredomaine.com/en-gb/" hreflang="en-gb" />
<link rel="alternate" href="https://votredomaine.com/en-us/" hreflang="en-us" />
<link rel="alternate" href="https://votredomaine.com/" hreflang="x-default" />
```

Le rapport Ciblage international de la Search Console et son réglage de pays ont été retirés en 2022. Le ciblage par pays repose désormais sur hreflang, sur un domaine de code pays comme `.co.uk` quand il convient à l’activité, et sur les signaux locaux présents dans le contenu. Notre guide du [SEO technique d’un site multilingue](/fr/seo-technique-site-multilingue/) détaille la mise en place.

<aside class="post-cta">
<p><strong>Des acheteurs qui arrivent sur la page écrite dans leur langue ?</strong> Notre <a href="/fr/services/seo-technique/">SEO technique pour sites multilingues</a> vérifie si vos versions linguistiques se font concurrence et corrige ce qui le provoque, pour que chacune gagne ses propres acheteurs. <a href="/fr/nous-contacter/">Réservez un premier échange</a>.</p>
</aside>

## Suivi et surveillance

Une mesure fiable vous dit quelles corrections ont rapporté. Universal Analytics a cessé de traiter les données en juillet 2023 : vérifiez que GA4 (ou l’alternative de votre choix) a remplacé toute balise `UA-` et se déclenche sur chaque page, idéalement via Google Tag Manager, avec Tag Assistant pour contrôler. Mettez ensuite en place l’[analyse et le suivi des conversions](/fr/services/seo-technique/) pour les actions qui comptent : envois de formulaires, téléchargements, appels et clics sur les boutons clés.

Consultez ensuite ces rapports de la Search Console à chaque audit, puis chaque mois :

- **Sitemaps** : erreurs de traitement et nombre d’URL découvertes.
- **Indexation des pages** : quelles pages sont indexées, la raison pour chaque page laissée de côté, et si ce choix est voulu.
- **Statistiques d’exploration** : chutes ou pics soudains, qui signalent en général des erreurs serveur ou un changement de robots.txt.
- **Actions manuelles** : toute pénalité pour infraction aux consignes. Corrigez la cause (pour des liens artificiels, supprimez-les ou désavouez-les), puis envoyez une demande de réexamen.

## Par où commencer

Corrigez dans l’ordre du schéma du début : exploration et indexation d’abord, vitesse et affichage ensuite, métadonnées et contenu en dernier. Dans chaque étape, classez les problèmes par impact et par effort, placez les corrections sur un calendrier daté et relancez l’audit chaque trimestre pour traiter les nouveaux problèmes tant qu’ils sont petits.
