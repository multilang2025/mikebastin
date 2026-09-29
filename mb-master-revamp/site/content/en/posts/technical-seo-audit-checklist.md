---
words: 2199
title: "Technical SEO audit checklist for websites"
slug: "technical-seo-audit-checklist"
locale: "en"
type: "posts"
group: "g164"
wpId: 24845784
date: "2024-10-22T13:13:00"
modified: "2026-09-26T21:30:00"
sourceUrl: "https://mikebastin.com/technical-seo-audit-checklist/"
excerpt: "Good content, ready to rank higher? A technical SEO audit checklist: what to check, how to spot each issue and how to fix it, from structure to speed."
---

Your content is good, the pages look fine, and the next ranking gains sit underneath: pages search engines can reach, one clear version of each page, a site fast enough on a phone to keep the visitor. Get those right and every euro spent on content and links earns its full value.

The checklist below is written for [web agencies](/services/) auditing client sites, and works just as well for your own. Each section covers what to check, how to find the issue and how to fix it, with the tools we use and short code examples.

If you would rather hand the job over, our [technical SEO services](/services/technical-seo/) run the same audit and ship the fixes.

<figure class="post-fig">
<svg viewBox="0 0 400 130" role="img" aria-label="The audit runs in four stages, each depending on the one before: crawl, index, render, rank.">
<line x1="50" y1="32" x2="350" y2="32" class="fg-rule"/>
<circle cx="50" cy="32" r="26" class="fg-box"/>
<circle cx="150" cy="32" r="26" class="fg-box"/>
<circle cx="250" cy="32" r="26" class="fg-box"/>
<circle cx="350" cy="32" r="26" class="fg-hot"/>
<text x="50" y="38" text-anchor="middle" class="fg-strong">1</text>
<text x="150" y="38" text-anchor="middle" class="fg-strong">2</text>
<text x="250" y="38" text-anchor="middle" class="fg-strong">3</text>
<text x="350" y="38" text-anchor="middle" class="fg-strong">4</text>
<text x="50" y="90" text-anchor="middle" class="fg-text">Crawl</text>
<text x="150" y="90" text-anchor="middle" class="fg-text">Index</text>
<text x="250" y="90" text-anchor="middle" class="fg-text">Render</text>
<text x="350" y="90" text-anchor="middle" class="fg-text">Rank</text>
<text x="50" y="114" text-anchor="middle" class="fg-label">robots.txt</text>
<text x="150" y="114" text-anchor="middle" class="fg-label">canonicals</text>
<text x="250" y="114" text-anchor="middle" class="fg-label">speed, mobile</text>
<text x="350" y="114" text-anchor="middle" class="fg-label">metadata</text>
</svg>
<figcaption>Each stage depends on the one before it. Google judges a title tag once it can crawl the page, so an audit works through the stages in this order.</figcaption>
</figure>

## Crawlability and indexability

Everything else on this list starts with search engines reaching the page.

### Robots.txt

The robots.txt file at `yourdomain.com/robots.txt` sets which paths crawlers may fetch. Check that it exists, that it blocks only what it should, and that every important section stays open to crawlers.

Google retired its old robots.txt Tester in December 2023. Use the robots.txt report in Search Console (Settings) instead: it shows the files Google found, crawl dates and errors, and lets you request a recrawl. The URL Inspection tool confirms whether a single URL is blocked.

> Google added a robots.txt report to Search Console in November 2023 and sunset the legacy robots.txt tester at the same time.
> Source: [Search Engine Land, "Google Search Console adds robots.txt report"](https://searchengineland.com/google-search-console-adds-robots-txt-report-434708)

Check first for a staging rule left live, which blocks the entire site:

```
User-agent: *
Disallow: /
```

An empty `Disallow:` line allows everything. Block private sections by path instead, for example `Disallow: /private-section/`.

### XML sitemap: what to include and where to submit it

An XML sitemap lists the URLs you want indexed. Check that `yourdomain.com/sitemap.xml` exists, contains only live, canonical, indexable URLs (each one returning a 200 status at its final address) and updates when content changes.

Most CMSs generate one automatically (Yoast SEO or Rank Math on WordPress); XML-Sitemaps.com covers static sites. Submit the sitemap in Google Search Console and Bing Webmaster Tools, reference it in robots.txt.

### Noindex and nofollow

Check every `noindex`, because it removes a page from search as surely as a robots.txt block. Crawl the site with Screaming Frog or Ahrefs Site Audit and list every page carrying `noindex` or `nofollow`, then confirm each one is intended. For pages you want indexed, leave the robots meta tag out entirely or use `<meta name="robots" content="index, follow">`.

Keep a `noindex` URL open in robots.txt, so Google can fetch the page and read the `noindex` on it.

### Redirects

| Code | Meaning | Passes signals | Use it when |
| --- | --- | --- | --- |
| 301 | Moved permanently | Yes | A URL has a new permanent home |
| 302 | Found, temporary | Eventually treated as 301 if left | A short test or a seasonal page |
| 410 | Gone | No | The content is removed for good |

Find chains and loops with Screaming Frog, Ahrefs or the Redirect Path extension, and point every redirect straight at the final URL. Replace 302s that have become permanent with 301s. In `.htaccess`:

```
Redirect 301 /old-page /new-page
```

## Site architecture and navigation

Pages close to the homepage get visited more, by search engines and buyers alike.

### Internal links and click depth

Internal links spread authority and show crawlers what matters. Use a site audit tool to find orphan pages (zero internal links pointing in) and link to them from relevant, well-linked pages. In articles, link to related posts and product or service pages with anchor text that describes the target.

Keep important pages within three clicks of the homepage: simplify menus and merge single-page categories into related ones.

<figure class="post-fig">
<svg viewBox="0 0 400 200" role="img" aria-label="A shallow site hierarchy: the homepage links to categories, categories link to pages, and every page sits within three clicks.">
<rect x="150" y="10" width="100" height="36" rx="6" class="fg-hot"/>
<text x="200" y="34" text-anchor="middle" class="fg-text">Home</text>
<line x1="200" y1="46" x2="110" y2="80" class="fg-line"/>
<line x1="200" y1="46" x2="290" y2="80" class="fg-line"/>
<rect x="50" y="80" width="120" height="36" rx="6" class="fg-box"/>
<rect x="230" y="80" width="120" height="36" rx="6" class="fg-box"/>
<text x="110" y="104" text-anchor="middle" class="fg-text">Category</text>
<text x="290" y="104" text-anchor="middle" class="fg-text">Category</text>
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
<figcaption>A flat structure keeps every page two or three clicks from the homepage. Pages that close get crawled more often and receive more internal authority.</figcaption>
</figure>

### URL structure

URLs should be short, readable and hyphenated: `yourdomain.com/blue-widgets` reads better than `yourdomain.com/page?id=123`. Look for long parameter strings and session IDs. On Apache, `mod_rewrite` maps clean URLs onto parameter-based ones:

```
RewriteEngine On
RewriteRule ^product/([0-9]+)$ /product.php?id=$1
```

### Breadcrumbs and pagination

Breadcrumbs show users and search engines where a page sits. Add them and mark them up with `BreadcrumbList` structured data:

```
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="https://yourdomain.com">Home</a></li>
    <li><a href="https://yourdomain.com/category">Category</a></li>
    <li>Current page</li>
  </ol>
</nav>
```

Google stopped using `rel="next"` and `rel="prev"` as an indexing signal in 2019, so a paginated series ranks on its URLs and links. Give each page in the series its own URL and a self-referencing canonical (page 2 names page 2, and so on), link the pages with ordinary crawlable `<a href>` links, and offer a "view all" page only where it loads fast.

## Speed and Core Web Vitals

A fast page keeps the visitor first and earns the ranking later. Core Web Vitals measure loading, responsiveness and visual stability from real Chrome users. Interaction to Next Paint (INP) replaced First Input Delay (FID) on 12 March 2024, so update any audit template that still asks for FID. Check the Core Web Vitals report in Search Console, then diagnose individual URLs in PageSpeed Insights or Lighthouse.

| Metric | Measures | Good score | Usual fixes |
| --- | --- | --- | --- |
| LCP | Loading of the main content | 2.5 seconds or less | Faster server, compressed hero image, preload key assets |
| INP | Response to clicks and taps | 200 milliseconds or less | Less JavaScript, break up long tasks, fewer third-party scripts |
| CLS | Visual stability | 0.1 or less | Width and height on images and ads, reserved space for embeds |

> Google recommends meeting all three thresholds at the 75th percentile of page loads, on mobile and desktop.
> Source: [web.dev, "Web Vitals"](https://web.dev/articles/vitals); [web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12"](https://web.dev/blog/inp-cwv-march-12)

**Images.** Compress them with TinyPNG, ImageOptim or Kraken.io, serve WebP or AVIF, size them to the space they fill, and lazy-load images below the fold. Load the main hero image straight away, since lazy-loading it delays LCP.

**Caching and minification.** Set `Cache-Control` headers so returning visitors reuse static files, enable GZIP or Brotli compression, and minify CSS, JavaScript and HTML in your build (Webpack, Vite or Gulp). WebPageTest shows which files still need caching headers. On Apache:

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

**Server response.** A fast Time to First Byte (TTFB) lifts every other metric. Measure it in WebPageTest, then put the site behind a CDN such as Cloudflare, cache database queries (Redis is common), and upgrade underpowered hosting. Monitor uptime with UptimeRobot or Pingdom so outages show up before rankings do.

**Mobile.** Google indexes the mobile version of your site. The Mobile-Friendly Test and the Mobile Usability report were retired on 1 December 2023, so test with Lighthouse in Chrome DevTools and the device toolbar: look for content wider than the screen, text too small to read and tap targets too close together.

> Google retired the Mobile Usability report, the Mobile-Friendly Test tool and its API from 1 December 2023, pointing site owners to Lighthouse.
> Source: [Search Engine Land, "Google officially drops Mobile Usability report, Mobile-Friendly Test tool and Mobile-Friendly Test API"](https://searchengineland.com/google-officially-drops-mobile-usability-report-mobile-friendly-test-tool-and-mobile-friendly-test-api-435377)

## Security

A clean padlock lets the visit start with trust. Every page should load over HTTPS, with every resource on HTTPS too, so the browser shows it free of mixed-content warnings. Check with Why No Padlock or the browser console, redirect all HTTP traffic to HTTPS with a 301, and update internal links and resources to `https://`:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://yourdomain.com/$1 [R=301,L]
```

Keep the certificate current, since an expired one triggers a browser warning. Check validity with the [SSL Server Test](https://www.ssllabs.com/ssltest//index.html) by Qualys SSL Labs, and automate renewal (Certbot for Let's Encrypt certificates).

## Structured data that can earn rich results

Structured data helps search engines understand the page and can earn rich results. Add the types that match the content (`Article`, `Product`, `BreadcrumbList`, `Organization`), preferably as JSON-LD, and validate with Google's Rich Results Test and the Schema Markup Validator. Microdata works too, but pick one format and use it everywhere.

```
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is technical SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Technical SEO covers the website and server optimizations that help search engines crawl and index a site."
      }
    }
  ]
}
```

Open Graph tags control how a page looks when shared on social platforms. Every page needs at least `og:title`, `og:description` and `og:image`:

```
<meta property="og:image" content="https://yourdomain.com/images/preview.jpg" />
```

Check previews with Facebook's Sharing Debugger and LinkedIn's Post Inspector.

## Duplicate and thin content

One page per search gives that page the full strength. When the same content lives at several URLs (with and without `www`, with a trailing slash or a tracking parameter), a canonical tag names the version to index. Check every template outputs a canonical, that it points at a live, indexable URL, and that internal links use the same format:

```
<link rel="canonical" href="https://www.yourdomain.com/page" />
```

If `yourdomain.com/page` and `yourdomain.com/page?ref=twitter` show the same content, both should declare `yourdomain.com/page` as canonical.

Google removed the URL Parameters tool from Search Console in April 2022, so parameter handling now happens on the site itself: canonical tags on parameter URLs, consistent internal links, and robots.txt rules for parameters to keep out of the crawl, such as session IDs:

```
Disallow: /*?sessionID=
```

> Google shut down the URL Parameters tool on 26 April 2022, saying only about 1% of configurations in it were useful for crawling.
> Source: [Google Search Central Blog, "Spring cleaning: the URL Parameters tool"](https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated)

Siteliner and Copyscape find duplicated text within a site. Merge near-identical pages into one stronger page and 301 the others to it. Apply the same fix to thin pages with little useful content and to keyword cannibalisation, where two pages compete for the same query: two articles both targeting "SEO best practices" become one complete guide.

Refresh outdated content on a schedule.

<aside class="post-cta">
<p><strong>Want one strong page for each search?</strong> Our <a href="/services/technical-seo/">technical SEO work</a> finds which page should rank and points your internal links at it. <a href="/contact/">Book the discovery call</a>.</p>
</aside>

## Link and status code checks

Every working link keeps a visitor who is already interested.

| Finding | What it tells you | Fix |
| --- | --- | --- |
| 404 on a page with links or traffic | Content moved or deleted without a redirect | 301 to the closest relevant page |
| 404 on a page with no value | Genuinely gone | Leave it or return 410; remove internal links to it |
| Broken outbound link | The external resource moved or died | Update to a current source or remove |
| 5xx server error | Server misconfiguration or overload | Check server logs, fix the error, upgrade hosting if it recurs |

Crawl with Screaming Frog, check the Page indexing report in Search Console, and use a link checker such as Dead Link Checker for outbound links. A custom 404 page with search and popular links keeps visitors moving when a URL has gone.

## Metadata and image SEO

The title is the first thing a searcher reads, and often what decides the click. Every indexable page needs a unique title that leads with its main keyword and stays under about 60 characters so it shows in full, for example "Blue widgets: quality widgets with fast delivery". Meta descriptions should be unique, describe the page accurately and give the searcher a reason to click.

Use one `h1` per page containing the main keyword, then `h2` and `h3` in order, one level at a time:

```
<h1>Technical SEO audit checklist</h1>
<h2>Crawlability and indexability</h2>
<h3>Robots.txt</h3>
```

Every meaningful image needs alt text that describes it in natural words: `alt="Blue widget with chrome handle"`. Rename `IMG_1234.jpg` to something like `blue-widget-chrome-handle.jpg`. For image-heavy sites, add image entries to the sitemap:

```
<url>
  <loc>https://yourdomain.com/page</loc>
  <image:image>
    <image:loc>https://yourdomain.com/images/blue-widget.jpg</image:loc>
  </image:image>
</url>
```

## International SEO checks for hreflang and regional versions

With the right tags, a French visitor lands on your French page. Multilingual and multi-regional sites need hreflang annotations so Google serves each user the right version. Check that the language and region codes are valid (the UK takes `en-gb`, where people often type `en-uk`), that every version carries its return tags and that each version references itself:

```
<link rel="alternate" href="https://yourdomain.com/en-gb/" hreflang="en-gb" />
<link rel="alternate" href="https://yourdomain.com/en-us/" hreflang="en-us" />
<link rel="alternate" href="https://yourdomain.com/" hreflang="x-default" />
```

Search Console's International Targeting report and its country setting were removed in 2022. Country targeting now comes from hreflang, a country-code domain such as `.co.uk` where that suits the business, and local signals in the content itself. Our guide to [technical SEO for multilingual websites](/blog/technical-seo-for-multilingual-websites/) covers the setup in detail.

<aside class="post-cta">
<p><strong>Want French visitors landing on your French pages?</strong> Our <a href="/services/technical-seo/">technical SEO for multilingual websites</a> finds out whether your language versions add up, and fixes whatever keeps them apart. <a href="/contact/">Book the discovery call</a>.</p>
</aside>

## Tracking and monitoring

Universal Analytics stopped processing data in July 2023, so check that every site has moved from its `UA-` tag to Google Analytics 4. Confirm Google Analytics 4 (or your chosen alternative) fires on every page, ideally through Google Tag Manager, and verify it with Tag Assistant. Then set up [analytics and conversion tracking](/services/conversion-tracking/) for the actions that matter: form submissions, downloads, calls and key button clicks.

Then make these reports part of every audit and every month afterwards:

- **Sitemaps**: processing errors and the count of discovered URLs.
- **Page indexing**: which pages are indexed, the reason for each one left out, and whether that is intended.
- **Crawl stats**: sudden drops or spikes, which usually point to server errors or a robots.txt change.
- **Manual actions**: any penalty for guideline violations. Fix the cause (for unnatural links, remove or disavow them), then submit a reconsideration request.

## Where to start

Fix in the order of the diagram at the top: crawling and indexing first, then speed and rendering, then metadata and content. Within each stage, rank issues by impact and effort, put the fixes on a dated timeline, and re-run the audit quarterly so new issues are caught while they are small.
