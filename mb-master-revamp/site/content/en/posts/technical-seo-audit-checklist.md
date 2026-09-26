---
words: 2120
title: "Technical SEO audit checklist for websites"
slug: "technical-seo-audit-checklist"
locale: "en"
type: "posts"
group: "g164"
wpId: 24845784
date: "2024-10-22T13:13:00"
modified: "2026-09-26T12:00:00"
sourceUrl: "https://mikebastin.com/technical-seo-audit-checklist/"
excerpt: "A technical SEO audit checklist for web agencies: what to check, how to spot the problem and how to fix it, from robots.txt to Core Web Vitals."
---

A technical SEO audit answers one question: can search engines reach, understand and trust every page that matters on the site? Content and links only pay off once the answer is yes.

The checklist below is written for [web agencies](/services/) auditing client sites. Each section covers what to check, how to find the problem and how to fix it, with the tools we use and short code examples. Where Google has retired a tool since this list was first published, we name the replacement.

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
<figcaption>Each stage depends on the one before it. A page Google cannot crawl never gets as far as its title tag being judged, so an audit fixes problems in this order.</figcaption>
</figure>

## Crawlability and indexability

### Robots.txt

The robots.txt file at `yourdomain.com/robots.txt` tells crawlers which paths not to fetch. Check that it exists, that it blocks only what it should, and that no important section sits behind a `Disallow` rule.

Google retired its old robots.txt Tester in December 2023. Use the robots.txt report in Search Console (Settings) instead: it shows which robots.txt files Google found, when it last crawled them and any errors, and lets you request a recrawl after a fix. The URL Inspection tool confirms whether a single URL is blocked.

> Google added a robots.txt report to Search Console in November 2023 and sunset the legacy robots.txt tester at the same time.
> Source: [Search Engine Land, "Google Search Console adds robots.txt report"](https://searchengineland.com/google-search-console-adds-robots-txt-report-434708)

The classic mistake is a staging rule left live, which blocks the entire site:

```
User-agent: *
Disallow: /
```

An empty `Disallow:` line allows everything. Block private sections by path instead, for example `Disallow: /private-section/`.

### XML sitemap

An XML sitemap lists the URLs you want indexed. Check that `yourdomain.com/sitemap.xml` exists, contains only live, canonical, indexable URLs (no 404s, redirects or noindexed pages) and updates when content changes.

Most CMSs generate one automatically (Yoast SEO or Rank Math on WordPress); XML-Sitemaps.com covers static sites. Submit the sitemap in Google Search Console and Bing Webmaster Tools, reference it in robots.txt, and check the Sitemaps report for processing errors after each resubmission.

### Noindex and nofollow

A stray `noindex` removes a page from search as surely as a robots.txt block. Crawl the site with Screaming Frog or Ahrefs Site Audit and list every page carrying `noindex` or `nofollow`, then confirm each one is intended. Pages you want indexed need no robots meta tag at all, or `<meta name="robots" content="index, follow">`.

Do not combine `noindex` with a robots.txt block on the same URL: Google cannot see the `noindex` on a page it is not allowed to fetch.

### Redirects

| Code | Meaning | Passes signals | Use it when |
| --- | --- | --- | --- |
| 301 | Moved permanently | Yes | A URL has a new permanent home |
| 302 | Found, temporary | Eventually treated as 301 if left | A short test or a seasonal page |
| 410 | Gone | No | The content is removed for good |

Find redirect chains and loops with Screaming Frog, Ahrefs or the Redirect Path browser extension, and point every redirect straight at the final URL. Replace 302s that have become permanent with 301s. In `.htaccess`:

```
Redirect 301 /old-page /new-page
```

## Site architecture and navigation

### Internal links and click depth

Internal links spread authority and show crawlers what matters. Use a site audit tool to find orphan pages (no internal links pointing in) and link to them from relevant, well-linked pages. In articles, link to related posts and product or service pages with anchor text that describes the target.

Keep important pages within three clicks of the homepage. List pages deeper than that, simplify menus, and merge categories that hold a single page into a related one.

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
<figcaption>A flat structure keeps every page two or three clicks from the homepage. Anything buried deeper gets crawled less often and receives less internal authority.</figcaption>
</figure>

### URL structure

URLs should be short, readable and hyphenated: `yourdomain.com/blue-widgets`, not `yourdomain.com/page?id=123`. Look for long parameter strings and session IDs. On Apache, `mod_rewrite` maps clean URLs onto parameter-based ones:

```
RewriteEngine On
RewriteRule ^product/([0-9]+)$ /product.php?id=$1
```

### Breadcrumbs and pagination

Breadcrumbs show users and search engines where a page sits. Add them through your CMS or theme and mark them up with `BreadcrumbList` structured data:

```
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="https://yourdomain.com">Home</a></li>
    <li><a href="https://yourdomain.com/category">Category</a></li>
    <li>Current page</li>
  </ol>
</nav>
```

Google has not used `rel="next"` and `rel="prev"` as an indexing signal since 2019, so adding them will not fix a paginated series. Give each page in the series its own URL and a self-referencing canonical (not a canonical to page 1), link the pages with ordinary crawlable `<a href>` links, and offer a "view all" page only where it loads fast.

## Speed and Core Web Vitals

Core Web Vitals measure loading, responsiveness and visual stability from real Chrome users. Interaction to Next Paint (INP) replaced First Input Delay (FID) on 12 March 2024, so older audit templates that still ask for FID are out of date. Check the Core Web Vitals report in Search Console, then diagnose individual URLs in PageSpeed Insights or Lighthouse.

| Metric | Measures | Good score | Usual fixes |
| --- | --- | --- | --- |
| LCP | Loading of the main content | 2.5 seconds or less | Faster server, compressed hero image, preload key assets |
| INP | Response to clicks and taps | 200 milliseconds or less | Less JavaScript, break up long tasks, fewer third-party scripts |
| CLS | Visual stability | 0.1 or less | Width and height on images and ads, reserved space for embeds |

> Google recommends meeting all three thresholds at the 75th percentile of page loads, on mobile and desktop.
> Source: [web.dev, "Web Vitals"](https://web.dev/articles/vitals); [web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12"](https://web.dev/blog/inp-cwv-march-12)

**Images.** Images are usually the heaviest part of a page. Compress them with TinyPNG, ImageOptim or Kraken.io, serve WebP or AVIF, size them to the space they fill, and lazy-load images below the fold. Do not lazy-load the main hero image: it delays LCP.

**Caching and minification.** Set `Cache-Control` headers so returning visitors reuse static files, enable GZIP or Brotli compression, and minify CSS, JavaScript and HTML in your build (Webpack, Vite or Gulp with CSSNano and a JavaScript minifier). WebPageTest shows which files lack caching headers. On Apache:

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

**Server response.** A slow Time to First Byte (TTFB) holds back every other metric. Measure it in WebPageTest, then put the site behind a CDN such as Cloudflare, cache database queries (Redis is common), and move to better hosting if the server is simply underpowered. Monitor uptime with UptimeRobot or Pingdom so outages show up before rankings do.

**Mobile.** Google indexes the mobile version of your site. The Mobile-Friendly Test and the Mobile Usability report were retired on 1 December 2023, so test with Lighthouse in Chrome DevTools and the device toolbar: look for content wider than the screen, text too small to read and tap targets too close together.

> Google retired the Mobile Usability report, the Mobile-Friendly Test tool and its API from 1 December 2023, pointing site owners to Lighthouse.
> Source: [Search Engine Land, "Google officially drops Mobile Usability report, Mobile-Friendly Test tool and Mobile-Friendly Test API"](https://searchengineland.com/google-officially-drops-mobile-usability-report-mobile-friendly-test-tool-and-mobile-friendly-test-api-435377)

## Security

Every page should load over HTTPS with no mixed-content warnings. Check with Why No Padlock or the browser console, redirect all HTTP traffic to HTTPS with a 301, and update internal links and resources to `https://`:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://yourdomain.com/$1 [R=301,L]
```

An expired certificate triggers browser warnings that stop visitors cold. Check validity with the [SSL Server Test](https://www.ssllabs.com/ssltest//index.html) by Qualys SSL Labs, and automate renewal (Certbot for Let's Encrypt certificates).

## Structured data

Structured data helps search engines understand the page and can earn rich results. Add the types that match the content (`Article`, `Product`, `BreadcrumbList`, `Organization`), preferably as JSON-LD, and validate with Google's Rich Results Test and the Schema Markup Validator. Microdata works too, but mixing formats across templates makes errors harder to trace, so pick one and apply it consistently.

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

When the same content lives at several URLs (with and without `www`, with a trailing slash or a tracking parameter), a canonical tag names the version to index. Check every template outputs a canonical, that it points at a live, indexable URL, and that internal links use the same format:

```
<link rel="canonical" href="https://www.yourdomain.com/page" />
```

If `yourdomain.com/page` and `yourdomain.com/page?ref=twitter` show the same content, both should declare `yourdomain.com/page` as canonical.

Google removed the URL Parameters tool from Search Console in April 2022, so parameter handling now happens on the site itself: canonical tags on parameter URLs, consistent internal links, and robots.txt rules for parameters that should never be crawled, such as session IDs:

```
Disallow: /*?sessionID=
```

> Google shut down the URL Parameters tool on 26 April 2022, saying only about 1% of configurations in it were useful for crawling.
> Source: [Google Search Central Blog, "Spring cleaning: the URL Parameters tool"](https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated)

Siteliner and Copyscape find duplicated text within a site. Merge near-identical pages into one stronger page and 301 the others to it. Apply the same fix to thin pages with little useful content and to keyword cannibalisation, where two pages compete for the same query: two articles both targeting "SEO best practices" become one complete guide.

Review older content on a schedule and refresh anything outdated, such as a trends article still naming a year that has passed.

## Errors and broken links

| Problem | What it tells you | Fix |
| --- | --- | --- |
| 404 on a page with links or traffic | Content moved or deleted without a redirect | 301 to the closest relevant page |
| 404 on a page with no value | Genuinely gone | Leave it or return 410; remove internal links to it |
| Broken outbound link | The external resource moved or died | Update to a current source or remove |
| 5xx server error | Server misconfiguration or overload | Check server logs, fix the error, upgrade hosting if it recurs |

Crawl with Screaming Frog, check the Page indexing report in Search Console, and use a link checker such as Dead Link Checker for outbound links. A custom 404 page with a search bar and links to popular pages keeps visitors who hit a dead end.

## Metadata and image SEO

Every indexable page needs a unique title that leads with its main keyword and stays under about 60 characters so it does not truncate, for example "Blue widgets: quality widgets with fast delivery". Meta descriptions should be unique, describe the page accurately and give the searcher a reason to click. Audit tools list missing and duplicate titles and descriptions in one report.

Use one `h1` per page containing the main keyword, then `h2` and `h3` in order without skipping levels:

```
<h1>Technical SEO audit checklist</h1>
<h2>Crawlability and indexability</h2>
<h3>Robots.txt</h3>
```

Every meaningful image needs alt text that describes it, without stuffing keywords: `alt="Blue widget with chrome handle"`. Rename generic files such as `IMG_1234.jpg` to descriptive, hyphenated names like `blue-widget-chrome-handle.jpg`. For image-heavy sites, add image entries to the sitemap:

```
<url>
  <loc>https://yourdomain.com/page</loc>
  <image:image>
    <image:loc>https://yourdomain.com/images/blue-widget.jpg</image:loc>
  </image:image>
</url>
```

## International SEO

Multilingual and multi-regional sites need hreflang annotations so Google serves each user the right version. Check for wrong language or region codes (`en-gb`, not `en-uk`), missing return tags and versions that do not reference themselves:

```
<link rel="alternate" href="https://yourdomain.com/en-gb/" hreflang="en-gb" />
<link rel="alternate" href="https://yourdomain.com/en-us/" hreflang="en-us" />
<link rel="alternate" href="https://yourdomain.com/" hreflang="x-default" />
```

Search Console's International Targeting report and its country setting were removed in 2022. Country targeting now comes from hreflang, a country-code domain such as `.co.uk` where that suits the business, and local signals in the content itself. Our guide to [technical SEO for multilingual websites](/blog/technical-seo-for-multilingual-websites/) covers the setup in detail.

## Tracking and monitoring

Universal Analytics stopped processing data in July 2023, so any site still carrying only a `UA-` tag is collecting nothing. Confirm Google Analytics 4 (or your chosen alternative) fires on every page, ideally through Google Tag Manager, and verify it with Tag Assistant. Then set up [analytics and conversion tracking](/services/conversion-tracking/) for the actions that matter: form submissions, downloads, calls and key button clicks.

Then make these reports part of every audit and every month afterwards:

- **Sitemaps**: processing errors and the count of discovered URLs.
- **Page indexing**: why pages are not indexed, and whether that is intended.
- **Crawl stats**: sudden drops or spikes, which usually point to server errors or a robots.txt change.
- **Manual actions**: any penalty for guideline violations. Fix the cause (for unnatural links, remove or disavow them), then submit a reconsideration request.

## Where to start

Fix in the order of the diagram at the top: anything that stops crawling or indexing first, then speed and rendering, then metadata and content. Within each stage, rank issues by impact and effort, put the fixes on a dated timeline, and re-run the audit quarterly so new problems are caught while they are still small.
