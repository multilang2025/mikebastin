---
words: 2623
title: "Lista de auditoría de SEO técnico para sitios web"
slug: "lista-de-auditoria-seo-tecnica"
locale: "es"
type: "posts"
group: "g164"
wpId: null
date: "2026-09-30T10:50:00"
modified: "2026-09-30T10:50:00"
sourceUrl: null
excerpt: "Lista de auditoría de SEO técnico: qué revisar, cómo detectar cada problema y cómo resolverlo, de la estructura a la velocidad, para vender mejor."
---

Tu contenido es bueno, las páginas se ven bien y las próximas mejoras de posición están debajo: páginas a las que los buscadores llegan, una versión clara de cada página y un sitio lo bastante rápido en el móvil para retener al visitante. Con esas tres piezas en orden, cada euro invertido en contenido y enlaces rinde todo lo que puede, también en los mercados a los que vendes fuera, como Francia, Benelux, Alemania o el Reino Unido.

La lista de abajo sirve para auditar tu propio sitio o el de la [agencia](/es/services/optimizacion-seo/) que lo mantiene. Cada sección recoge qué revisar, cómo encontrar el problema y cómo resolverlo, con las herramientas que usamos nosotros y ejemplos cortos de código.

Si prefieres delegar el trabajo, nuestro [servicio de SEO técnico](/es/services/seo-tecnico/) hace la misma auditoría y aplica las correcciones.

<figure class="post-fig">
<svg viewBox="0 0 400 130" role="img" aria-label="La auditoría avanza en cuatro fases, cada una apoyada en la anterior: rastreo, indexación, renderizado y posicionamiento.">
<line x1="50" y1="32" x2="350" y2="32" class="fg-rule"/>
<circle cx="50" cy="32" r="26" class="fg-box"/>
<circle cx="150" cy="32" r="26" class="fg-box"/>
<circle cx="250" cy="32" r="26" class="fg-box"/>
<circle cx="350" cy="32" r="26" class="fg-hot"/>
<text x="50" y="38" text-anchor="middle" class="fg-strong">1</text>
<text x="150" y="38" text-anchor="middle" class="fg-strong">2</text>
<text x="250" y="38" text-anchor="middle" class="fg-strong">3</text>
<text x="350" y="38" text-anchor="middle" class="fg-strong">4</text>
<text x="50" y="90" text-anchor="middle" class="fg-text">Rastreo</text>
<text x="150" y="90" text-anchor="middle" class="fg-text">Indexación</text>
<text x="250" y="90" text-anchor="middle" class="fg-text">Renderizado</text>
<text x="350" y="90" text-anchor="middle" class="fg-text">Posición</text>
<text x="50" y="114" text-anchor="middle" class="fg-label">robots.txt</text>
<text x="150" y="114" text-anchor="middle" class="fg-label">canonicals</text>
<text x="250" y="114" text-anchor="middle" class="fg-label">velocidad, móvil</text>
<text x="350" y="114" text-anchor="middle" class="fg-label">metadatos</text>
</svg>
<figcaption>Cada fase se apoya en la anterior. Google valora una etiqueta de título cuando ya puede rastrear la página, así que la auditoría recorre las fases en este orden.</figcaption>
</figure>

## Rastreo e indexación

Todo lo demás de la lista empieza cuando los buscadores llegan a la página.

### Robots.txt

El archivo robots.txt, en `tudominio.com/robots.txt`, define qué rutas pueden pedir los rastreadores. Comprueba que existe, que bloquea solo lo que debe y que todas las secciones importantes quedan abiertas.

Google retiró su antiguo probador de robots.txt en diciembre de 2023. Usa en su lugar el informe de robots.txt de Search Console (Configuración): muestra los archivos que Google encontró, las fechas de rastreo y los errores, y permite solicitar un nuevo rastreo. La herramienta de inspección de URL confirma si una URL concreta está bloqueada.

> Google añadió un informe de robots.txt a Search Console en noviembre de 2023 y retiró el probador de robots.txt anterior al mismo tiempo.
> Fuente: [Search Engine Land, «Google Search Console adds robots.txt report»](https://searchengineland.com/google-search-console-adds-robots-txt-report-434708)

Empieza buscando una regla de preproducción que siga activa, porque bloquea el sitio entero:

```
User-agent: *
Disallow: /
```

Una línea `Disallow:` vacía lo permite todo. Bloquea las secciones privadas por ruta, por ejemplo `Disallow: /seccion-privada/`.

### Sitemap XML: qué incluir y dónde enviarlo

Un sitemap XML lista las URL que quieres indexadas. Comprueba que `tudominio.com/sitemap.xml` existe, que contiene solo URL activas, canónicas e indexables (cada una con estado 200 en su dirección final) y que se actualiza cuando cambia el contenido.

La mayoría de los CMS lo generan solos (Yoast SEO o Rank Math en WordPress); XML-Sitemaps.com cubre los sitios estáticos. Envía el sitemap en Google Search Console y en Bing Webmaster Tools, y referéncialo en robots.txt.

### Noindex y nofollow

Revisa cada `noindex`, porque retira una página de los resultados igual que un bloqueo en robots.txt. Rastrea el sitio con Screaming Frog o con Ahrefs Site Audit, lista todas las páginas con `noindex` o `nofollow` y confirma que cada una es intencionada. En las páginas que quieres indexadas, omite la etiqueta meta robots o usa `<meta name="robots" content="index, follow">`.

Mantén abierta en robots.txt cualquier URL con `noindex`, para que Google pueda leer la página y encontrar el `noindex` en ella.

### Redirecciones

| Código | Significado | Transmite señales | Úsalo cuando |
| --- | --- | --- | --- |
| 301 | Movida permanentemente | Sí | Una URL tiene un nuevo hogar permanente |
| 302 | Encontrada, temporal | Google acaba tratándola como 301 si se mantiene | Una prueba corta o una página de temporada |
| 410 | Eliminada | No | El contenido se retira de forma definitiva |

Encuentra cadenas y bucles con Screaming Frog, Ahrefs o la extensión Redirect Path, y haz que cada redirección apunte directamente a la URL final. Cambia por 301 las 302 que se han vuelto permanentes. En `.htaccess`:

```
Redirect 301 /pagina-antigua /pagina-nueva
```

## Arquitectura del sitio y navegación

Las páginas cercanas a la portada reciben más visitas, tanto de buscadores como de compradores.

### Enlaces internos y profundidad de clics

Los enlaces internos reparten autoridad y enseñan a los rastreadores qué importa. Usa una herramienta de auditoría para encontrar páginas huérfanas (sin ningún enlace interno que apunte a ellas) y enlázalas desde páginas relevantes y bien enlazadas. En los artículos, enlaza a entradas relacionadas y a páginas de producto o servicio con un texto ancla que describa el destino.

Mantén las páginas importantes a un máximo de tres clics de la portada: simplifica los menús y fusiona las categorías de una sola página con otras relacionadas.

<figure class="post-fig">
<svg viewBox="0 0 400 200" role="img" aria-label="Una jerarquía de sitio poco profunda: la portada enlaza a categorías, las categorías enlazan a páginas y cada página queda a tres clics como máximo.">
<rect x="150" y="10" width="100" height="36" rx="6" class="fg-hot"/>
<text x="200" y="34" text-anchor="middle" class="fg-text">Inicio</text>
<line x1="200" y1="46" x2="110" y2="80" class="fg-line"/>
<line x1="200" y1="46" x2="290" y2="80" class="fg-line"/>
<rect x="50" y="80" width="120" height="36" rx="6" class="fg-box"/>
<rect x="230" y="80" width="120" height="36" rx="6" class="fg-box"/>
<text x="110" y="104" text-anchor="middle" class="fg-text">Categoría</text>
<text x="290" y="104" text-anchor="middle" class="fg-text">Categoría</text>
<line x1="110" y1="116" x2="55" y2="150" class="fg-line"/>
<line x1="110" y1="116" x2="150" y2="150" class="fg-line"/>
<line x1="290" y1="116" x2="250" y2="150" class="fg-line"/>
<line x1="290" y1="116" x2="345" y2="150" class="fg-line"/>
<rect x="15" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="110" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="210" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<rect x="305" y="150" width="80" height="36" rx="6" class="fg-fill"/>
<text x="55" y="173" text-anchor="middle" class="fg-label">Página</text>
<text x="150" y="173" text-anchor="middle" class="fg-label">Página</text>
<text x="250" y="173" text-anchor="middle" class="fg-label">Página</text>
<text x="345" y="173" text-anchor="middle" class="fg-label">Página</text>
</svg>
<figcaption>Una estructura plana deja cada página a dos o tres clics de la portada. Las páginas tan cercanas se rastrean con más frecuencia y reciben más autoridad interna.</figcaption>
</figure>

### Estructura de URL

Las URL deben ser cortas, legibles y con guiones: `tudominio.com/zapatos-azules` se lee mejor que `tudominio.com/pagina?id=123`. Busca cadenas largas de parámetros e identificadores de sesión. En Apache, `mod_rewrite` asigna URL limpias a las basadas en parámetros:

```
RewriteEngine On
RewriteRule ^producto/([0-9]+)$ /producto.php?id=$1
```

### Migas de pan y paginación

Las migas de pan muestran a usuarios y buscadores dónde está una página. Añádelas y márcalas con datos estructurados `BreadcrumbList`:

```
<nav aria-label="Migas de pan">
  <ol>
    <li><a href="https://tudominio.com">Inicio</a></li>
    <li><a href="https://tudominio.com/categoria">Categoría</a></li>
    <li>Página actual</li>
  </ol>
</nav>
```

Google dejó de usar `rel="next"` y `rel="prev"` como señal de indexación en 2019, así que una serie paginada se posiciona por sus URL y sus enlaces. Da a cada página de la serie su propia URL y un canonical autorreferenciado (la página 2 se nombra a sí misma, y así sucesivamente), enlaza las páginas con enlaces `<a href>` normales y rastreables, y ofrece una página «ver todo» solo donde cargue rápido.

## Velocidad y Core Web Vitals

Una página rápida retiene primero al visitante y gana la posición después. Core Web Vitals mide la carga, la capacidad de respuesta y la estabilidad visual a partir de usuarios reales de Chrome. Interaction to Next Paint (INP) sustituyó a First Input Delay (FID) el 12 de marzo de 2024, así que actualiza cualquier plantilla de auditoría que aún pregunte por FID. Consulta el informe de Core Web Vitals en Search Console y diagnostica después cada URL en PageSpeed Insights o Lighthouse.

| Métrica | Mide | Puntuación buena | Soluciones habituales |
| --- | --- | --- | --- |
| LCP | Carga del contenido principal | 2,5 segundos o menos | Servidor más rápido, imagen principal comprimida, precarga de recursos clave |
| INP | Respuesta a clics y toques | 200 milisegundos o menos | Menos JavaScript, dividir tareas largas, menos scripts de terceros |
| CLS | Estabilidad visual | 0,1 o menos | Ancho y alto en imágenes y anuncios, espacio reservado para incrustaciones |

> Google recomienda cumplir los tres umbrales en el percentil 75 de las cargas de página, en móvil y en escritorio.
> Fuente: [web.dev, «Web Vitals»](https://web.dev/articles/vitals); [web.dev, «Interaction to Next Paint becomes a Core Web Vital on March 12»](https://web.dev/blog/inp-cwv-march-12)

**Imágenes.** Comprímelas con TinyPNG, ImageOptim o Kraken.io, sirve WebP o AVIF, ajústalas al espacio que ocupan y carga en diferido (lazy loading) las que quedan bajo el pliegue. Carga la imagen principal de inmediato, porque aplazarla retrasa el LCP.

**Caché y minificación.** Define cabeceras `Cache-Control` para que los visitantes que vuelven reutilicen los archivos estáticos, activa la compresión GZIP o Brotli y minifica el CSS, el JavaScript y el HTML en tu proceso de compilación (Webpack, Vite o Gulp). WebPageTest muestra qué archivos aún necesitan cabeceras de caché. En Apache:

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

**Respuesta del servidor.** Un buen Time to First Byte (TTFB) mejora todas las demás métricas. Mídelo en WebPageTest, coloca el sitio detrás de una CDN como Cloudflare, guarda en caché las consultas a la base de datos (Redis es lo habitual) y mejora el alojamiento si se queda corto. Vigila la disponibilidad con UptimeRobot o Pingdom para que las caídas aparezcan antes que en las posiciones.

**Móvil.** Google indexa la versión móvil de tu sitio. La prueba de optimización para móviles y el informe de usabilidad móvil se retiraron el 1 de diciembre de 2023, así que prueba con Lighthouse en las herramientas para desarrolladores de Chrome y su barra de dispositivos: busca contenido más ancho que la pantalla, texto demasiado pequeño para leerlo y elementos táctiles demasiado juntos.

> Google retiró el informe de usabilidad móvil, la herramienta de prueba de optimización para móviles y su API desde el 1 de diciembre de 2023, y remitió a los propietarios de sitios a Lighthouse.
> Fuente: [Search Engine Land, «Google officially drops Mobile Usability report, Mobile-Friendly Test tool and Mobile-Friendly Test API»](https://searchengineland.com/google-officially-drops-mobile-usability-report-mobile-friendly-test-tool-and-mobile-friendly-test-api-435377)

## Seguridad

Un candado limpio deja que la visita empiece con confianza. Todas las páginas deben cargar por HTTPS, con todos los recursos también en HTTPS, para que el navegador las muestre libres de avisos de contenido mixto. Compruébalo con Why No Padlock o con la consola del navegador, redirige todo el tráfico HTTP a HTTPS con una 301 y actualiza los enlaces y recursos internos a `https://`:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://tudominio.com/$1 [R=301,L]
```

Mantén el certificado al día, porque uno caducado provoca un aviso en el navegador. Comprueba su validez con el [SSL Server Test](https://www.ssllabs.com/ssltest//index.html) de Qualys SSL Labs y automatiza la renovación (Certbot para los certificados de Let's Encrypt).

## Datos estructurados que pueden lograr resultados enriquecidos

Los datos estructurados ayudan a los buscadores a entender la página y pueden conseguir resultados enriquecidos. Añade los tipos que correspondan al contenido (`Article`, `Product`, `BreadcrumbList`, `Organization`), preferiblemente en JSON-LD, y valida con la prueba de resultados enriquecidos de Google y el Schema Markup Validator. Microdata también funciona, pero elige un formato y úsalo en todo el sitio.

```
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es el SEO técnico?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El SEO técnico reúne las optimizaciones del sitio y del servidor que ayudan a los buscadores a rastrear e indexar una web."
      }
    }
  ]
}
```

Las etiquetas Open Graph controlan el aspecto de una página cuando se comparte en redes sociales. Cada página necesita como mínimo `og:title`, `og:description` y `og:image`:

```
<meta property="og:image" content="https://tudominio.com/images/vista-previa.jpg" />
```

Revisa las vistas previas con el Sharing Debugger de Facebook y el Post Inspector de LinkedIn.

## Contenido duplicado y páginas con poco contenido

Una página por búsqueda le da a esa página toda su fuerza. Cuando el mismo contenido vive en varias URL (con y sin `www`, con barra final o con un parámetro de seguimiento), una etiqueta canonical indica la versión que hay que indexar. Comprueba que cada plantilla emite un canonical, que apunta a una URL activa e indexable y que los enlaces internos usan el mismo formato:

```
<link rel="canonical" href="https://www.tudominio.com/pagina" />
```

Si `tudominio.com/pagina` y `tudominio.com/pagina?ref=twitter` muestran el mismo contenido, ambas deben declarar `tudominio.com/pagina` como canonical.

Google eliminó la herramienta de parámetros de URL de Search Console en abril de 2022, así que el tratamiento de parámetros ocurre ahora en el propio sitio: canonicals en las URL con parámetros, enlaces internos coherentes y reglas de robots.txt para los parámetros que deben quedar fuera del rastreo, como los identificadores de sesión:

```
Disallow: /*?sessionID=
```

> Google cerró la herramienta de parámetros de URL el 26 de abril de 2022 y explicó que solo alrededor del 1 % de las configuraciones creadas en ella resultaban útiles para el rastreo.
> Fuente: [Google Search Central Blog, «Spring cleaning: the URL Parameters tool»](https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated)

Siteliner y Copyscape encuentran texto duplicado dentro de un sitio. Fusiona las páginas casi idénticas en una más fuerte y redirige las demás a ella con una 301. Aplica la misma solución a las páginas con poco contenido útil y a la canibalización de palabras clave, cuando dos páginas compiten por la misma consulta: dos artículos que apuntan a «buenas prácticas de SEO» pasan a ser una guía completa.

Actualiza el contenido antiguo con un calendario fijo.

<aside class="post-cta">
<p><strong>¿Quieres una página fuerte para cada búsqueda?</strong> Nuestro <a href="/es/services/seo-tecnico/">trabajo de SEO técnico</a> identifica qué página debe posicionarse y dirige tus enlaces internos hacia ella. <a href="/es/contactanos/">Reserva la llamada de descubrimiento</a>.</p>
</aside>

## Enlaces y códigos de estado

Cada enlace que funciona retiene a un visitante que ya estaba interesado.

| Hallazgo | Qué indica | Solución |
| --- | --- | --- |
| 404 en una página con enlaces o tráfico | El contenido se movió o se eliminó sin redirección | 301 a la página relevante más cercana |
| 404 en una página sin valor | Desaparecida de verdad | Déjala o devuelve 410; quita los enlaces internos hacia ella |
| Enlace externo roto | El recurso externo cambió de sitio o desapareció | Actualiza a una fuente vigente o elimínalo |
| Error de servidor 5xx | Mala configuración o sobrecarga del servidor | Revisa los registros, corrige el error y mejora el alojamiento si se repite |

Rastrea con Screaming Frog, consulta el informe de indexación de páginas en Search Console y usa un verificador de enlaces como Dead Link Checker para los enlaces externos. Una página 404 personalizada, con buscador y enlaces populares, mantiene a los visitantes en movimiento cuando una URL ha desaparecido.

## Metadatos y SEO de imágenes

El título es lo primero que lee quien busca y, a menudo, lo que decide el clic. Cada página indexable necesita un título único que empiece por su palabra clave principal y se mantenga en unos 60 caracteres para mostrarse completo, por ejemplo «Zapatos azules: calidad artesanal y envío rápido». Las meta descripciones deben ser únicas, describir la página con precisión y dar a quien busca una razón para hacer clic.

Usa un solo `h1` por página con la palabra clave principal y después `h2` y `h3` en orden, un nivel cada vez:

```
<h1>Lista de auditoría de SEO técnico</h1>
<h2>Rastreo e indexación</h2>
<h3>Robots.txt</h3>
```

Toda imagen con significado necesita un texto alternativo que la describa con palabras naturales: `alt="Zapato azul con hebilla plateada"`. Cambia `IMG_1234.jpg` por algo como `zapato-azul-hebilla-plateada.jpg`. En los sitios con muchas imágenes, añade entradas de imagen al sitemap:

```
<url>
  <loc>https://tudominio.com/pagina</loc>
  <image:image>
    <image:loc>https://tudominio.com/images/zapato-azul.jpg</image:loc>
  </image:image>
</url>
```

## Comprobaciones de SEO internacional con hreflang y versiones regionales

Con las etiquetas correctas, un visitante francés aterriza en tu página en francés. Los sitios multilingües y multirregionales necesitan anotaciones hreflang para que Google muestre a cada usuario la versión adecuada. Comprueba que los códigos de idioma y región son válidos (el Reino Unido usa `en-gb`, donde mucha gente escribe `en-uk`), que cada versión lleva sus etiquetas de retorno y que cada una se referencia a sí misma:

```
<link rel="alternate" href="https://tudominio.com/es-es/" hreflang="es-es" />
<link rel="alternate" href="https://tudominio.com/fr-fr/" hreflang="fr-fr" />
<link rel="alternate" href="https://tudominio.com/nl-be/" hreflang="nl-be" />
<link rel="alternate" href="https://tudominio.com/" hreflang="x-default" />
```

El informe de segmentación internacional de Search Console y su ajuste de país se eliminaron en 2022. La segmentación por país procede ahora de hreflang, de un dominio de código de país como `.fr` o `.nl` cuando encaja con el negocio, y de las señales locales del propio contenido.

<aside class="post-cta">
<p><strong>¿Quieres que los visitantes franceses aterricen en tus páginas en francés?</strong> Nuestro <a href="/es/services/seo-tecnico/">SEO técnico para sitios multilingües</a> comprueba si tus versiones de idioma encajan entre sí y corrige lo que las mantiene separadas. <a href="/es/contactanos/">Reserva la llamada de descubrimiento</a>.</p>
</aside>

## Seguimiento y monitorización

Universal Analytics dejó de procesar datos en julio de 2023, así que comprueba que cada sitio ha pasado de su etiqueta `UA-` a Google Analytics 4. Confirma que Google Analytics 4 (o la alternativa que elijas) se activa en todas las páginas, idealmente mediante Google Tag Manager, y verifícalo con Tag Assistant. Configura después la [analítica y el seguimiento de conversiones](/es/services/monitorizacion-y-analitica/) para las acciones que importan: envíos de formularios, descargas, llamadas y clics en los botones clave.

Después, incluye estos informes en cada auditoría y en cada revisión mensual:

- **Sitemaps**: errores de procesamiento y número de URL descubiertas.
- **Indexación de páginas**: qué páginas están indexadas, el motivo de cada una que queda fuera y si es intencionado.
- **Estadísticas de rastreo**: caídas o picos repentinos, que suelen apuntar a errores del servidor o a un cambio en robots.txt.
- **Acciones manuales**: cualquier penalización por infringir las directrices. Corrige la causa (en el caso de enlaces artificiales, elimínalos o desautorízalos) y envía después una solicitud de reconsideración.

## Por dónde empezar

Corrige en el orden del diagrama del principio: primero rastreo e indexación, después velocidad y renderizado, y por último metadatos y contenido. Dentro de cada fase, ordena los problemas por impacto y esfuerzo, pon las correcciones en un calendario con fechas y repite la auditoría cada trimestre para detectar los problemas nuevos cuando aún son pequeños.
