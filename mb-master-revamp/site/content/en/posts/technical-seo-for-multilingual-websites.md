---
words: 1185
title: "Technical SEO for multilingual websites"
slug: "technical-seo-for-multilingual-websites"
locale: "en"
type: "posts"
group: "g166"
wpId: 24845457
date: "2024-12-16T16:08:46"
modified: "2026-09-26T21:30:00"
sourceUrl: "https://mikebastin.com/technical-seo-for-multilingual-websites/"
excerpt: "Want every language version adding to your rankings? Technical SEO for multilingual websites: the fixes that get each market ranking with its own pages."
---

## The technical layer behind multilingual SEO

Your French and German pages can add up, each ranking in its own market. Set up well, the right version ranks, buyers land in the language they asked for, and every market you paid to translate is in plain sight.

On [multilingual websites](/blog/optimising-multilingual-website-content/) what makes them add up is technical, and it comes down to four things: how each language version is labelled, where the site is served from, near-identical pages, and domain structure. Below: what each one does, the fixes we make most often, and how to set them up so they carry your [multilingual SEO](/services/multilingual-seo/).

## Point each visitor to their language with hreflang

Get these right and your language versions add up, and visitors land on a page in their language. Hreflang tags tell search engines which language and regional version of a page to show each user. Our [best practices for multilingual SEO](/blog/best-practices-for-multilingual-seo/) cover the wider strategy.

### Implement hreflang tags correctly

Each page carries annotations pointing to itself and to every other language or regional version. You can declare them in three places, and one is enough:

| Method | Where it lives | Best for |
|---|---|---|
| HTML link tags | The `<head>` of each page | Most websites |
| HTTP headers | The server response | PDFs and other non-HTML files |
| XML sitemap | The sitemap file | Large sites with many languages |

Every annotation must be returned: if page A points to page B, page B points back to page A, and Google then uses the pair.

> "If two pages don't both point to each other, the tags will be ignored."
> Source: [Google Search Central, "Tell Google about localized versions of your page"](https://developers.google.com/search/docs/specialty/international/localized-versions)

<figure class="post-fig">
<svg viewBox="0 0 400 184" role="img" aria-label="Three language versions of a page reference one another with hreflang, and all three point to the same x-default fallback.">
<path d="M70 34 Q200 0 330 34" fill="none" class="fg-line"/>
<line x1="120" y1="58" x2="150" y2="58" class="fg-line"/>
<line x1="250" y1="58" x2="280" y2="58" class="fg-line"/>
<rect x="20" y="34" width="100" height="48" rx="6" class="fg-box"/>
<rect x="150" y="34" width="100" height="48" rx="6" class="fg-box"/>
<rect x="280" y="34" width="100" height="48" rx="6" class="fg-box"/>
<text x="70" y="64" text-anchor="middle" class="fg-text">en-GB</text>
<text x="200" y="64" text-anchor="middle" class="fg-text">fr-FR</text>
<text x="330" y="64" text-anchor="middle" class="fg-text">de-DE</text>
<line x1="70" y1="82" x2="160" y2="128" class="fg-accent"/>
<line x1="200" y1="82" x2="200" y2="128" class="fg-accent"/>
<line x1="330" y1="82" x2="240" y2="128" class="fg-accent"/>
<rect x="140" y="128" width="120" height="44" rx="6" class="fg-hot"/>
<text x="200" y="156" text-anchor="middle" class="fg-strong">x-default</text>
</svg>
<figcaption>An hreflang cluster works only as a whole: every version lists every other version and itself, and all of them name the same fallback page.</figcaption>
</figure>

### Hreflang checks that protect your rankings

- Point each annotation at the final, live URL, one that returns a 200 status.
- Use valid codes: `en-GB` for the UK (where people often write `en-UK`), and a language code in the language slot.
- Include `x-default`, the version shown to users outside every listed language and region.
- Add the return links, as above.

Each of these protects your ranking opportunities and the [website localization](/services/website-localisation/) work behind the pages.

<aside class="post-cta">
<p><strong>Want to know how well your language versions work together?</strong> Our <a href="/services/technical-seo/">technical SEO for multilingual sites</a> checks every language cluster on your site, and fixes whatever keeps them apart. <a href="/contact/">Book the discovery call</a>.</p>
</aside>

## Server location and geotargeting

Hosting decides how fast your pages load in each market; where you rank comes from other signals. Google treats server location as at most a hint about the intended audience, so lead your geotargeting with hreflang and domain structure. Our [guide to SEO in Belgium](/blog/seo-in-belgium/) shows how the stronger signals work in a multilingual country.

If your site targets several countries, a content delivery network (CDN) serves pages from locations close to each user, which keeps load times low everywhere. Pair it with hreflang and a clear domain structure.

## Keep each language version distinct

Distinct pages let search engines show the version you sell from in each market. Multilingual sites often have near-identical pages, for example English versions for the UK and Ireland, or pages still partly in the source language. Google treats localized versions as duplicates only when the main content stays untranslated, so the work is mostly making each version distinct and clearly labelled.

- Use hreflang to tie language and regional variants together.
- Give each version its own URL, [meta tags and headings](/services/technical-seo/).
- Give each version a self-referencing canonical. Point each canonical at its own page, because a canonical from the French page to the English one tells Google to drop the French page.

## Edit machine translation before it goes live

[Post-editing by a professional linguist](/services/ai-translation-and-post-editing/) turns raw machine translation into text that reads naturally, keeps the context and carries the intent of the original. Search engines may treat thin, machine-generated text as low quality, so edited text protects organic rankings and keeps users reading.

Proper localization adapts content to the language, culture and expectations of each market. Translate and localize:

- meta titles and meta descriptions
- URL slugs
- image alt text
- structured data, where it contains text

Work with professional [translation services](/services/translation-services/) or native-speaking SEO specialists, who also research the keywords people use in each market. Clear, localized content is more relevant to local searchers and builds the trust an international brand needs.

## Pick a domain structure once, early

Your domain structure is the foundation content is built on, so decide it once, early. There are three common ways to organise a multilingual site, and the right choice depends on your markets, budget and team.

| Structure | Example | Geotargeting signal | Effort to run |
|---|---|---|---|
| ccTLD | example.fr | Strongest | High, separate domains to build up |
| Subdirectory | example.com/fr/ | Clear with hreflang | Low, one domain shares its authority |
| Subdomain | fr.example.com | Clear with hreflang | Medium, often treated more like a separate site |

Google recommends a distinct URL for each language version, in place of URL parameters such as `?lang=fr`.

### Plan a structure that scales

Keep one structure across the whole site: one pattern for every language keeps the site easy to manage and sends strong, consistent signals. Make sure users can switch language from any page, and that the switcher links to the equivalent page in the other language.

<aside class="post-cta">
<p><strong>Adding markets and choosing a structure to commit to?</strong> In our <a href="/services/multilingual-seo/">multilingual SEO programmes</a>, subdirectory, subdomain or ccTLD gets a reasoned recommendation for your markets. <a href="/contact/">Talk to us about your markets</a>.</p>
</aside>

## Write titles and descriptions for each market

Your title and description are the first thing a searcher in each market reads. Translated and optimized titles, descriptions and alt text help each version rank in its own market.

Write fresh metadata for each language version, for the local audience, with the keywords people there search for; our [multilingual SEO copywriting services](/services/multilingual-content/) handle exactly that. Translated alt text also improves accessibility and image search visibility.

## Check the setup after every update

Multilingual setups need regular checks, because a plugin update or a migration can change a language cluster. Follow [emerging trends and tools](/blog/future-of-seo/), and schedule [regular technical audits](/services/technical-seo/) that check:

- hreflang validity and complete return links
- crawl status in each language folder or domain
- indexation of every language version
- redirects that keep users in their language

Document your international architecture so anyone on the team can see which URL serves which market. When search engines change their requirements, a documented setup is quicker to adjust. Our [technical SEO audit checklist](/blog/technical-seo-audit-checklist/) covers the wider audit.

## The four foundations of multilingual rankings

Strong rankings across several markets rest on a sound technical base: complete hreflang clusters, fast delivery in every region, distinct and self-canonical language versions, and one consistent domain structure. When these work together, search engines understand which page to show to whom, and more of the right visitors reach your multilingual site.
