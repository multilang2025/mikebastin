---
words: 3900
title: "Technical SEO Audit Checklist for Websites"
slug: "technical-seo-audit-checklist"
locale: "en"
type: "posts"
group: "g164"
wpId: 24845784
date: "2024-10-22T13:13:00"
modified: "2026-07-02T15:11:16"
sourceUrl: "https://mikebastin.com/technical-seo-audit-checklist/"
excerpt: "Dive into the world of Technical SEO and supercharge your website’s performance. This guide offers an essential audit checklist for web agencies."
---

## Website Technical SEO Assessment Checklist

Imagine your website as a sleek, high-performance sports car.

Now, Technical SEO? That’s the finely-tuned engine under the hood, propelling your site to the front of the search engine race.

It’s the secret sauce that makes your website irresistible to [Google’s crawlers](https://mikebastin.com/boosting-local-seo/), turning them from casual visitors into devoted fans who can’t wait to showcase your site to the world.

But here’s the million-dollar question: Is your website’s engine purring like a kitten or sputtering like an old jalopy?

Buckle up, digital mechanics! We’re about to pop the hood and dig into the nitty-gritty world of technical SEO.

In this turbo-charged guide, we’ll hand you the ultimate toolbox, a complete [Technical SEO audit checklist](https://mikebastin.com/technical-seo-audit-checklist/).

It’s specially built for [web agencies](https://mikebastin.com/our-services/) looking to supercharge their clients’ websites and leave the competition in the dust.

Get ready to diagnose those pesky technical hiccups, apply some digital elbow grease, and transform your clients’ websites from rusty jalopies into sleek, [search engine-conquering machines](https://mikebastin.com/services/on-page-seo/).

We’ll walk you through real-world examples, dish out practical solutions, and have you speaking fluent ‘Tech SEO’ faster than you can say “[robots.txt](https://mikebastin.com/optimising-your-website-for-voice-search/)“!

So, are you ready to become the master mechanic of the digital highway? Let’s rev up those engines and start our [Technical SEO tune-up](https://mikebastin.com/technical-seo-audit-checklist/)!

### 1\. Crawlability and Indexability

#### 1.1 Robots.txt File

The **robots.txt file** is a simple text file located at the root of your website. It instructs search engine crawlers which pages or sections of your site should not be crawled.

**Check**: Ensure that the `robots.txt` file exists at `yourdomain.com/robots.txt` and is correctly configured.

**Example**:

Visit `example.com/robots.txt` to view the site’s directives. A typical `robots.txt` file might look like:

```
User-agent: *
Disallow: /private-section/
```

**Identify Issues**:

-   Use **Google Search Console’s Robots Testing Tool** to test your `robots.txt` file for errors.
-   Look for any **disallowed pages** that should be accessible to search engines.

**Address**:

-   Edit the `robots.txt` file to allow or disallow specific URLs.
-   Use `User-agent` and `Disallow` directives appropriately.
-   Ensure that important pages are not blocked.

**Example**:

If you accidentally disallowed all crawlers from your entire site:

```
User-agent: *
Disallow: /
```

It would prevent your site from being indexed. To fix this, you should update it to allow all content:

```
User-agent: *
Disallow:
```

#### 1.2 XML Sitemap

An **XML sitemap** is a file that lists all the important pages of your website, helping search engines find and crawl them.

**Check**: Verify the presence of an up-to-date XML sitemap at `yourdomain.com/sitemap.xml`.

**Identify Issues**:

-   Check for **broken links** or URLs leading to **404 errors** within the sitemap.
-   Ensure that all important pages, including new and updated ones, are included.

**Address**:

-   Generate a new sitemap using tools like **Yoast SEO** for WordPress or **XML-Sitemaps.com**.
-   Submit the sitemap to **Google Search Console** and **Bing Webmaster Tools**.

**Example**:

After adding new content, update your sitemap to include the new URLs, then resubmit it to search engines.

#### 1.3 URL Structure

A clean and descriptive **URL structure** improves both user experience and search engine crawling.

**Check**: Ensure that URLs are clean, descriptive, and use hyphens to separate words.

**Example**:

Use `yourdomain.com/blue-widgets` instead of `yourdomain.com/page?id=123`.

**Identify Issues**:

-   Look for URLs with excessive parameters or session IDs.
-   Avoid dynamic URLs with long strings of numbers and symbols.

**Address**:

-   Implement URL rewriting using **mod\_rewrite** for Apache or similar modules for other servers.
-   Use consistent and readable URL naming conventions.

**Example**:

In Apache’s `.htaccess` file, you can add:

```
RewriteEngine On
RewriteRule ^product/([0-9]+)$ /product.php?id=$1 
```

#### 1.4 Canonical Tags

**Canonical tags** help prevent duplicate content issues by specifying the preferred version of a page.

**Check**: Ensure that canonical tags are correctly implemented on all pages.

**Identify Issues**:

-   Use tools like **Screaming Frog SEO Spider** to detect missing or incorrect canonical tags.
-   Identify duplicate content that appears under multiple URLs.

**Address**:

-   Add `<link rel="canonical" href="https://yourdomain.com/preferred-page" />` in the `<head>` section of HTML pages.
-   Ensure that the canonical URL points to the main version of the content.

**Example**:

If `yourdomain.com/page` and `yourdomain.com/page?ref=twitter` show the same content, set the canonical tag to `yourdomain.com/page`.

#### 1.5 Noindex and Nofollow Tags

**Noindex** and **nofollow** tags control whether a page should be indexed or whether its links should be followed by crawlers.

**Check**: Verify that pages meant to be indexed do not have `noindex` tags.

**Identify Issues**:

-   Crawl the site to find pages with `noindex` or `nofollow` directives that shouldn’t have them.
-   Use tools like **Screaming Frog** or **Ahrefs Site Audit**.

**Address**:

-   Remove unnecessary `noindex` tags from pages that need to be indexed.
-   Update **meta robots** tags appropriately.

**Example**:

To allow indexing and following of a page:

```
<meta name="robots" content="index, follow">
```

#### 1.6 Redirects (301, 302)

Redirects inform browsers and search engines that a page has moved to a new location.

**Check**: Use **301 redirects** for permanent URL changes.

**Identify Issues**:

-   Identify redirect chains and loops using tools like **Ahrefs** or **Redirect Path**.
-   Check for **302 redirects** that should be **301 redirects**.

**Address**:

-   Update server configurations or `.htaccess` files to correct redirects.
-   Ensure redirects point directly to the final URL without intermediate steps.

**Example**:

In `.htaccess`:

```
Redirect 301 /old-page /new-page
```

* * *

#### 2\. Site Architecture and Navigation

### 2.1 Internal Linking

Effective **internal linking** helps distribute link equity and improves crawlability.

**Check**: Ensure that internal links are logical and support easy navigation.

**Identify Issues**:

-   Use site audit tools to find **orphan pages** (pages not linked from any other page).
-   Analyse **link depth** to ensure important pages are accessible within a few clicks from the homepage.

**Address**:

-   Add internal links from high-authority pages to orphan pages.
-   Create a logical linking structure that guides users through your content.

**Example**:

In blog posts, include links to related articles or relevant product pages.

### 2.2 Breadcrumbs

**Breadcrumb navigation** enhances user experience and provides additional context to search engines.

**Check**: Implement breadcrumbs that reflect the site’s hierarchy.

**Identify Issues**:

-   Ensure breadcrumbs are present and accurately represent the page’s position in the site structure.

**Address**:

-   Add breadcrumb markup using **Schema.org** vocabulary.
-   Implement breadcrumbs via your CMS or through custom coding.

**Example**:

```
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="https://yourdomain.com">Home</a></li>
    <li><a href="https://yourdomain.com/category">Category</a></li>
    <li>Current Page</li>
  </ol>
</nav>
```

### 2.3 Site Hierarchy

A clear and logical **site hierarchy** improves user navigation and helps search engines understand your site’s structure.

**Check**: Verify that the website’s structure is logical and not overly deep.

**Identify Issues**:

-   Identify pages that are more than three clicks away from the homepage.
-   Check for an imbalance in the distribution of pages within categories.

**Address**:

-   Simplify navigation menus to make important pages more accessible.
-   Reorganise categories and subcategories if necessary.

**Example**:

If you have a category with only one page, consider merging it with a related category.

### 2.4 Pagination

Proper handling of **paginated content** ensures that search engines can crawl and index all pages in a series.

**Check**: Implement pagination correctly using appropriate tags.

**Identify Issues**:

-   Missing `rel="next"` and `rel="prev"` tags in paginated series.
-   Duplicate content issues arising from pagination.

**Address**:

-   Add pagination tags in the `<head>` section of your HTML.
-   Consider creating “View All” pages if it doesn’t impact load times significantly.

**Example**:

On page 1 of a paginated series:

```
<link rel="next" href="https://yourdomain.com/page2" />
```

* * *

### 3\. Website Performance

#### 3.1 Page Speed (Load Time)

Website **load time** is a crucial factor affecting user experience and search rankings.

**Check**: Ensure pages load quickly on all devices.

**Identify Issues**:

-   Use **Google PageSpeed Insights** or **GTmetrix** to analyse page load times.
-   Identify render-blocking resources and unoptimised images.

**Address**:

-   Optimise images by compressing them without significant quality loss.
-   Use browser caching and enable compression (e.g., GZIP).
-   Minimise CSS and JavaScript files by minifying and combining them.

**Example**:

Compress images using **TinyPNG** or **ImageOptim** to reduce file sizes.

#### 3.2 Mobile Friendliness

With the majority of searches occurring on mobile devices, **mobile friendliness** is essential.

**Check**: Verify that the site is responsive and mobile-friendly.

**Identify Issues**:

-   Use **Google’s Mobile-Friendly Test** to check for mobile usability issues.
-   Look for content wider than the screen or text too small to read.

**Address**:

-   Implement a responsive design using CSS media queries or frameworks like **Bootstrap**.
-   Optimise touch elements and ensure adequate spacing.

**Example**:

Ensure that navigation menus collapse into a mobile-friendly format on smaller screens.

#### 3.3 Core Web Vitals

**Core Web Vitals** are a set of metrics related to speed, responsiveness, and visual stability.

**Check**: Assess **Largest Contentful Paint (LCP)**, **First Input Delay (FID)**, and **Cumulative Layout Shift (CLS)** scores.

**Identify Issues**:

-   Review reports in **Google Search Console** under **Core Web Vitals**.
-   Identify pages with poor scores that need improvement.

**Address**:

-   Optimise server response times to improve LCP.
-   Reduce JavaScript execution time to enhance FID.
-   Allocate size attributes for images and ads to fix CLS issues.

**Example**:

Implement lazy loading for images to improve LCP.

#### 3.4 Image Optimisation

Optimising images can significantly improve page load times.

**Check**: Ensure images are properly sized and compressed.

**Identify Issues**:

-   Identify images with large file sizes or incorrect formats.

**Address**:

-   Use image compression tools like **ImageOptim** or **Kraken.io**.
-   Serve images in next-gen formats like **WebP** or **AVIF**.

**Example**:

Convert PNG images to compressed JPEGs when transparency is not required.

#### 3.5 Browser Caching

Leveraging **browser caching** can reduce load times for returning visitors.

**Check**: Verify that caching headers are set correctly.

**Identify Issues**:

-   Use tools like **webpagetest.org** to check for caching headers.

**Address**:

-   Add caching rules in `.htaccess` or server configuration files.
-   Set appropriate `Cache-Control` and `Expires` headers.

**Example**:

In `.htaccess`:

```
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
</IfModule>
```

#### 3.6 Minification of CSS, JavaScript, HTML

**Minification** removes unnecessary characters from code to reduce file sizes.

**Check**: Ensure that CSS, JavaScript, and HTML files are minified.

**Identify Issues**:

-   Use **PageSpeed Insights** to identify unminified files.

**Address**:

-   Minify files using tools like **UglifyJS** for JavaScript or **CSSNano** for CSS.
-   Implement minification in your build process using tools like **Webpack** or **Gulp**.

**Example**:

Configure **Gulp** to automate the minification of CSS and JavaScript files before deployment.

* * *

### 4\. Security

#### 4.1 HTTPS Implementation

Using **HTTPS** is essential for website security and is a ranking factor.

**Check**: Ensure the site uses the HTTPS protocol.

**Identify Issues**:

-   Look for **mixed content** warnings indicating insecure elements on pages.
-   Use **Why No Padlock** to identify non-secure content.

**Address**:

-   Install an **SSL certificate** from a trusted authority like **Let’s Encrypt** or **Comodo**.
-   Redirect all HTTP traffic to HTTPS using 301 redirects.
-   Update all internal links and resources to use HTTPS.

**Example**:

In `.htaccess`, force HTTPS:

```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://yourdomain.com/$1 [R=301,L]
```

#### 4.2 SSL Certificate Validity

An expired or invalid SSL certificate can cause security warnings.

**Check**: Ensure the SSL certificate is valid and not expired.

**Identify Issues**:

-   Use **[SSL Server Test](https://www.ssllabs.com/ssltest//index.html)** by **Qualys SSL Labs** to check the certificate’s status.

**Address**:

-   Renew SSL certificates before they expire.
-   Set up automatic renewals if possible.

**Example**:

Use **Certbot** to automatically renew Let’s Encrypt certificates.

### 5\. Structured Data and Markup

#### 5.1 Schema.org Implementation

**Structured data** helps search engines understand your content and can enhance search listings.

**Check**: Implement structured data using **Schema.org** vocabulary.

**Identify Issues**:

-   Use **Google’s Rich Results Test** to detect errors in markup.

**Address**:

-   Add appropriate schema types like `Article`, `Product`, `BreadcrumbList`.
-   Ensure the markup is correctly formatted and valid.

**Example**:

Implement FAQ schema:

```
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Technical SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Technical SEO refers to website and server optimisations that help search engine spiders crawl and index your site more effectively."
      }
    }
  ]
}
```

#### 5.2 Open Graph Tags

**Open Graph (OG) tags** improve how your content appears when shared on social media platforms.

**Check**: Ensure OG tags are correctly implemented.

**Identify Issues**:

-   Missing or incorrect OG tags can lead to poor social media previews.

**Address**:

-   Add OG meta tags like `<meta property="og:title" content="Your Page Title" />`.
-   Test with **Facebook Sharing Debugger** and **Twitter Card Validator**.

**Example**:

Include an OG image:

```
<meta property="og:image" content="https://yourdomain.com/images/preview.jpg" />
```

#### 5.3 Microdata

**Microdata** provides additional context to search engines about your content.

**Check**: Implement microdata according to the HTML5 specification.

**Identify Issues**:

-   Inconsistent or missing microdata across pages.

**Address**:

-   Use appropriate microdata items and properties.
-   Ensure consistency in implementation.

**Example**:

Mark up a product:

```
<div itemscope itemtype="https://schema.org/Product">
  <span itemprop="name">Blue Widget</span>
  <img itemprop="image" src="blue-widget.jpg" alt="Blue Widget">
  <span itemprop="description">A high-quality blue widget.</span>
  <span itemprop="price">£19.99</span>
</div>
```

### 6\. Duplicate Content Issues

#### 6.1 Canonical URLs

Prevent duplicate content issues by specifying the preferred version of a page with **canonical URLs**.

**Check**: Ensure canonical tags are correctly implemented on all pages.

**Identify Issues**:

-   Duplicate content appearing under multiple URLs, such as with and without `www` or trailing slashes.

**Address**:

-   Set canonical URLs to the preferred version of each page.
-   Consistently use the same URL formats in internal links.

**Example**:

In the `<head>` section:

```
<link rel="canonical" href="https://www.yourdomain.com/page" />
```

#### 6.2 Content Duplication within Site

Duplicate content within your site can confuse search engines and dilute ranking signals.

**Check**: Identify and eliminate duplicate content.

**Identify Issues**:

-   Use tools like **Copyscape** or **Siteliner** to find duplicate content.

**Address**:

-   Merge similar pages into one complete page.
-   Use 301 redirects for the outdated pages.

**Example**:

Combine “Blue Widget Info” and “Blue Widget Details” into a single, detailed page.

#### 6.3 URL Parameters

Unmanaged **URL parameters** can create multiple URLs with identical content.

**Check**: Manage URL parameters to prevent duplication.

**Identify Issues**:

-   URLs differing only by parameters indexing the same content.

**Address**:

-   Use `rel="canonical"` tags to point to the main version.
-   Set parameter handling in **Google Search Console**.

**Example**:

In `robots.txt`, exclude session IDs:

```
Disallow: /*?sessionID=
```

### 7\. Broken Links and Errors

#### 7.1 404 Errors

Broken pages result in a poor user experience and wasted crawl budget.

**Check**: Identify all pages returning **404 errors**.

**Identify Issues**:

-   Crawl the site with tools like **Screaming Frog** to find broken pages.

**Address**:

-   Fix or redirect broken links to relevant content.
-   Implement custom 404 pages with helpful navigation options.

**Example**:

A custom 404 page might include:

-   A search bar.
-   Links to popular pages.
-   A friendly message like “Sorry, we couldn’t find that page.”

#### 7.2 Broken Internal and External Links

Broken links affect user experience and can harm SEO.

**Check**: Ensure all links lead to valid pages.

**Identify Issues**:

-   Use link checkers like **Dead Link Checker** or **Broken Link Checker**.

**Address**:

-   Update or remove broken links.
-   Replace outdated external links with up-to-date resources.

**Example**:

Replace a broken link to an old resource with a link to a current, relevant article.

#### 7.3 Server Errors (5xx)

Server errors indicate issues with your website’s server configuration or resources.

**Check**: Identify any pages returning **server errors** like 500 Internal Server Error.

**Identify Issues**:

-   Monitor server logs.
-   Use crawl tools to detect errors.

**Address**:

-   Resolve server configuration issues.
-   Optimise server resources to handle traffic efficiently.

**Example**:

If experiencing **503 Service Unavailable** errors, consider upgrading your hosting plan.

### 8\. Metadata

#### 8.1 Title Tags

**Title tags** are crucial for SEO and user click-through rates.

**Check**: Ensure unique, descriptive title tags on all pages.

**Identify Issues**:

-   Use SEO auditing tools to find duplicate or missing title tags.

**Address**:

-   Craft unique titles that include target keywords.
-   Keep titles under 60 characters to prevent truncation in search results.

**Example**:

“Buy Blue Widgets | High-Quality Widgets at Great Prices”

#### 8.2 Meta Descriptions

**Meta descriptions** summarise the page content in search results.

**Check**: Ensure unique meta descriptions for each page.

**Identify Issues**:

-   Missing or duplicate meta descriptions.

**Address**:

-   Write compelling descriptions that encourage clicks.
-   Include target keywords naturally.

**Example**:

“Discover our range of blue widgets. Shop now for quality products and fast delivery!”

#### 8.3 Header Tags (H1, H2, etc.)

Proper use of **header tags** helps structure content and signals importance to search engines.

**Check**: Verify the proper use of header hierarchy.

**Identify Issues**:

-   Multiple H1 tags on a single page.
-   Skipped heading levels (e.g., H1 followed by H3 without an H2).

**Address**:

-   Use one H1 tag per page that includes the main keyword.
-   Structure content with H2-H6 tags logically.

**Example**:

```
<h1>Technical SEO Audit Checklist</h1>
<h2>Crawlability and Indexability</h2>
<h3>Robots.txt File</h3>
```

### 9\. International SEO (if applicable)

#### 9.1 Hreflang Tags

**Hreflang tags** help search engines serve the correct language or regional URL to users.

**Check**: Implement hreflang tags for multilingual sites.

**Identify Issues**:

-   Incorrect language or region codes.
-   Missing return tags.

**Address**:

-   Use `hreflang="en-gb"` for British English or `hreflang="en-us"` for American English.
-   Ensure that each hreflang tag references all language versions, including itself.

**Example**:

```
<link rel="alternate" href="https://yourdomain.com/en-gb/" hreflang="en-gb" />
<link rel="alternate" href="https://yourdomain.com/en-us/" hreflang="en-us" />
```

#### 9.2 Regional and Language Settings

Geotargeting helps focus your site on a specific country or region.

**Check**: Set the preferred country in **Google Search Console**.

**Identify Issues**:

-   Incorrect geographic targeting settings.
-   Use of generic TLDs when a country-specific TLD might be more appropriate.

**Address**:

-   In **Google Search Console**, navigate to **Settings > International Targeting**.
-   Use local domain extensions like `.co.uk` for the UK when appropriate.

**Example**:

For a UK-focused site, set the target country to the United Kingdom in GSC.

### 10\. Image SEO

#### 10.1 Alt Text

**Alt text** provides descriptions of images for search engines and improves accessibility.

**Check**: Ensure all images have descriptive alt attributes.

**Identify Issues**:

-   Missing or non-descriptive alt text.

**Address**:

-   Add meaningful alt text that describes the image content.
-   Avoid keyword stuffing.

**Example**:

```
<img src="blue-widget.jpg" alt="Blue Widget available for purchase">
```

#### 10.2 Image Sitemaps

An **image sitemap** helps search engines find and index your images.

**Check**: Create and submit an image sitemap.

**Identify Issues**:

-   Important images not appearing in image search results.

**Address**:

-   Include images in your existing sitemap or create a separate image sitemap.
-   Submit it to search engines via their webmaster tools.

**Example**:

```
<url>
  <loc>https://yourdomain.com/page</loc>
  <image:image>
    <image:loc>https://yourdomain.com/images/blue-widget.jpg</image:loc>
    <image:caption>Blue Widget</image:caption>
  </image:image>
</url>
```

#### 10.3 Image File Names

Descriptive **image file names** improve image SEO.

**Check**: Ensure images have SEO-friendly file names.

**Identify Issues**:

-   Generic file names like `IMG_1234.jpg`.

**Address**:

-   Rename images using descriptive keywords separated by hyphens.

**Example**:

Rename `IMG_1234.jpg` to `blue-widget-high-quality.jpg`.

### 11\. Analytics and Tracking

#### 11.1 Proper Implementation of Analytics Tools

Accurate data is essential for informed decision-making.

**Check**: Ensure [analytics tracking](https://mikebastin.com/services/analytics-and-tracking/) code is present on all pages.

**Identify Issues**:

-   Missing tracking code on some pages.

**Address**:

-   Add analytics scripts before the closing `</head>` tag.
-   Verify installation using tools like **Google Tag Assistant**.

**Example**:

Insert the Google Analytics code snippet provided in your GA account into your site’s header.

#### 11.2 Event Tracking

**Event tracking** allows you to measure specific user interactions.

**Check**: Implement event tracking for key user actions.

**Identify Issues**:

-   Important interactions not being tracked, such as form submissions or downloads.

**Address**:

-   Use **Google Tag Manager** to set up event tracking without altering site code.
-   Define events for actions like clicks, scrolls, and form submissions.

**Example**:

Set up an event to track when users click the “Subscribe” button.

### 12\. Hosting and Server Issues

#### 12.1 Uptime and Downtime Monitoring

Website availability is critical for user experience and SEO.

**Check**: Monitor site uptime using services like **UptimeRobot** or **Pingdom**.

**Identify Issues**:

-   Frequent or prolonged downtimes.

**Address**:

-   Upgrade hosting plans or switch to a more reliable provider.
-   Optimise server configurations and ensure adequate resources.

**Example**:

If your site experiences downtime during peak hours, consider upgrading to a dedicated server.

#### 12.2 Server Response Times

Fast server response times improve user experience and SEO.

**Check**: Measure **Time To First Byte (TTFB)** using tools like **WebPageTest**.

**Identify Issues**:

-   High TTFB indicating slow server responses.

**Address**:

-   Use a **Content Delivery Network (CDN)** like **Cloudflare**.
-   Optimise server-side scripts and database queries.

**Example**:

Implement caching mechanisms like **Redis** to reduce database load.

### 13\. Content Issues

#### 13.1 Thin Content

Thin content provides little value to users and can negatively impact SEO.

**Check**: Identify pages with low word counts or little useful information.

**Identify Issues**:

-   Pages that are short and lack depth.

**Address**:

-   Enrich content with detailed, valuable information.
-   Combine thin pages into complete resources.

**Example**:

Expand a brief product description into a detailed page with specifications, reviews, and FAQs.

#### 13.2 Content Relevance

Content should align with user intent and target keywords.

**Check**: Ensure content is relevant and up-to-date.

**Identify Issues**:

-   Outdated information or content that doesn’t meet user needs.

**Address**:

-   Update content regularly.
-   Align topics with current user search queries and trends.

**Example**:

Update an article about “SEO Trends 2021” to “SEO Trends 2024” with the latest insights.

#### 13.3 Keyword Cannibalisation

Avoid having multiple pages competing for the same keyword.

**Check**: Identify instances of keyword cannibalisation.

**Identify Issues**:

-   Overlapping keyword targets causing internal competition.

**Address**:

-   Consolidate similar content into a single, authoritative page.
-   Differentiate keyword strategies for different pages.

**Example**:

Merge two articles both targeting “Best SEO Practices” into one complete guide.

### 14\. Miscellaneous

#### 14.1 Sitemap Submission to Google Search Console

Ensure search engines are aware of your sitemap.

**Check**: Submit your sitemap to **Google Search Console**.

**Identify Issues**:

-   Errors in sitemap processing or unindexed pages.

**Address**:

-   Fix errors such as incorrect URLs or syntax issues.
-   Resubmit the sitemap after corrections.

**Example**:

After correcting errors, resubmit `sitemap.xml` in GSC under **Sitemaps**.

#### 14.2 Monitoring Crawl Stats in Google Search Console

Regularly review crawl statistics for insights.

**Check**: Monitor **crawl stats** in GSC.

**Identify Issues**:

-   Unusual spikes or drops in crawl rates.

**Address**:

-   Investigate server logs for errors.
-   Optimise the crawl budget by fixing issues like duplicate content.

**Example**:

If crawl rate drops, check for increased server errors or robots.txt blocking.

#### 14.3 Checking for Manual Actions or Penalties

Manual actions can significantly impact your site’s visibility.

**Check**: Review **Manual Actions** in GSC.

**Identify Issues**:

-   Notifications of penalties due to guideline violations.

**Address**:

-   Resolve issues as per Google’s guidelines.
-   Submit a reconsideration request after fixing problems.

**Example**:

If penalised for unnatural links, remove or disavow the links, then request reconsideration.

## Conclusion

Conducting regular **[technical SEO audits](https://mikebastin.com/technical-seo-for-multilingual-websites/)** is essential for maintaining and improving a website’s performance in search engines.

By systematically addressing each element in this checklist, web agencies can ensure their clients’ websites are optimised for both search engines and users. Implementing these **best practices** leads to better visibility, higher rankings, and an improved user experience.

**Next Steps**:

-   **Prioritise issues** based on their impact and the effort required to fix them.
-   Develop a **timeline** for addressing the identified issues.
-   Schedule **regular audits** to maintain optimal technical health and stay ahead of potential problems.
