/**
 * Featured images for the journal, taken from the legacy WordPress site.
 *
 * Every one of these already had a featured image on mikebastin.com, so
 * the rebuild had no reason to draw an abstract substitute for it
 * (owner, 20 Sep). `components/PostArt.tsx` stays as the fallback for a
 * post with no entry here, which is what a newly written post gets until
 * a picture is chosen for it.
 *
 * 57 entries: the 56 posts plus competitor-analysis-traffic-checklist,
 * which is a hand-built page rather than a post (HAND_BUILT_SLUGS in
 * lib/posts.ts) and is here because it is a cluster pillar the journal
 * index renders beside the others.
 *
 * All but one came from the legacy library. See the note on
 * conversational-ai-chatbots-business for the exception and why.
 *
 * `legacy` records where each file came from, relative to
 * https://mikebastin.com/wp-content/uploads/, so the set can be rebuilt
 * or re-checked against the source. The files in public/images/blog/
 * are webp derivatives: <slug>.webp at 1200px wide and
 * <slug>-thumb.webp at 160x84 for the footer, where a full-width image
 * would otherwise be shipped on every page of the site to be drawn at
 * 56px wide.
 *
 * `alt` describes the picture rather than repeating the post title,
 * which the heading beside it already carries. Roughly half the legacy
 * images had an empty alt attribute and the rest were thin, so these
 * were written from the images themselves.
 */

export type BlogImage = {
  width: number;
  height: number;
  alt: string;
  /** Path under the legacy site's wp-content/uploads/. Provenance only. */
  legacy: string;
  /**
   * Pixels to remove from the top of the source before resizing.
   *
   * Several of the January 2026 uploads were generated with the prompt
   * still burned into the image, so searcheverywherestrategy2026.jpg
   * carries "CREATE: Unified Digital Strategy" across its top corner.
   * The label sits on a plain wall above the subject, so cropping it off
   * is a better fix than reaching for a different picture.
   *
   * scripts/fetch-legacy-images.mjs applies this, so the derivative can
   * be rebuilt from the source and still come out clean.
   */
  cropTop?: number;
  /**
   * Attribution, for a photo that is not from the legacy library.
   *
   * Unsplash's terms ask for the photographer and Unsplash to be credited
   * with links, so a photo sourced there carries this and the post page
   * renders it under the image. `legacy` still records where the file came
   * from, which for these is the Unsplash photo id rather than an upload
   * path.
   */
  credit?: { name: string; profile: string; source: string; sourceUrl: string };
};

export const BLOG_IMAGES: Record<string, BlogImage> = {
  "15-simple-blog-post-ideas-to-help-attract-more-customers-to-your-business": { width: 1200, height: 494, alt: "Hands typing on a laptop beside an open notebook and a second keyboard", legacy: "2024/10/Simple-Blog-Post-Ideas.jpg" },
  "360-marketing-agency": { width: 1200, height: 529, alt: "A man facing a tunnel of screens showing many different images at once", legacy: "2024/12/360-Marketing-Agency.jpg" },
  "affiliate-marketing-programs": { width: 1200, height: 425, alt: "A laptop screen reading affiliate marketing, surrounded by icons for targets and reports", legacy: "2024/10/Affiliate-Marketing-Programs.jpg" },
  "ai-powered-marketing": { width: 1200, height: 503, alt: "A laptop on a desk showing the letters AI over a network of connected points", legacy: "2024/10/AI-Powered-Marketing.jpg" },
  "alternatives-to-google-analytics": { width: 1200, height: 425, alt: "Hands at a laptop showing a dashboard of bar charts and pie charts, with printed reports alongside", legacy: "2024/10/Top-Alternatives-to-Google-Analytics.jpg" },
  "best-practices-for-multilingual-seo": { width: 1200, height: 428, alt: "Two people seated with phones, with SEO and web icons drawn over the photograph", legacy: "2024/10/best-practices-for-multilingual-seo.jpg" },
  "best-vietnam-sourcing-agencies-for-eudr-supplier-scouting-and-audits": { width: 1200, height: 764, alt: "Weathered timber planks in several colours, laid side by side", legacy: "2025/12/vietnam-sourcing-agencies.jpg" },
  "building-a-global-brand": { width: 1200, height: 800, alt: "A globe resting on a dark surface lit by circuit lines", legacy: "2024/09/Building-a-Global-Brand-1.jpg" },
  "chrome-extensions-for-seo": { width: 1200, height: 726, alt: "Hands typing on a laptop with SEO, mail and shopping icons floating above the screen", legacy: "2024/09/chrome-extensions.jpg" },
  "chrome-extensions-for-translators": { width: 1200, height: 848, alt: "A pile of Google Chrome logos", legacy: "2024/09/browser-web-www-computer-773216.jpg" },
  "common-mistakes-to-avoid-when-localising-your-website": { width: 1200, height: 705, alt: "A hand writing the words common mistakes on a notepad", legacy: "2024/09/common-mistakes-to-avoid-when-cocalizing-your-website.jpg" },
  "competitor-analysis": { width: 1200, height: 686, alt: "A desk with two open laptops, each showing an analytics dashboard", legacy: "2026/01/competitoranalysis.jpg" },
  "competitor-analysis-traffic-checklist": { width: 1200, height: 686, alt: "A fountain pen resting on a printed checklist, with reading glasses and a monitor showing a traffic dashboard behind", legacy: "2026/01/competitoranalysistrafficcheck.jpg" },
  "content-optimisation-for-spanish-users": { width: 1200, height: 482, alt: "A woman smiling at an outdoor cafe table on a Spanish street", legacy: "2024/10/spanish-users.jpg" },
  // The only entry here not from the legacy library. Its WordPress image
  // was an AI mockup reading "Hello! How can bo help?" beside "Hola!
  // /Como pudo ayodrarte", and every other candidate in that batch was
  // no better, so this is a real photograph from Unsplash instead.
  "conversational-ai-chatbots-business": { width: 1200, height: 800, alt: "A woman holding a phone in both hands, part-way through typing a message", legacy: "unsplash:HbyYFFokvm0", credit: { name: "Paul Hanaoka", profile: "https://unsplash.com/@plhnk", source: "Unsplash", sourceUrl: "https://unsplash.com/photos/HbyYFFokvm0" } },
  "digital-marketing-advisor": { width: 1200, height: 686, alt: "A man studying a flip chart that compares an advisor model with an agency model", legacy: "2026/01/digitalmarketingadvisoragencyd.jpg" },
  "eeat-vs-aeat-typo": { width: 1200, height: 666, alt: "A cover graphic reading EEAT versus AEAT, the typo that turns an SEO audit into a tax audit", legacy: "2026/01/EEAT-AEAT-1.jpg" },
  "email-marketing-hacks-boosting-open-rates-and-conversions": { width: 1200, height: 489, alt: "A laptop showing one unread email in an inbox, next to a cup of coffee", legacy: "2024/11/Email-Marketing-Hacks.jpg" },
  "english-to-french-translation-services": { width: 1200, height: 672, alt: "A ball painted in the French flag resting on a laptop keyboard", legacy: "2024/09/english-to-french-translation-services.jpg" },
  "french-ppc-campaign": { width: 1200, height: 563, alt: "A hand reaching towards a laptop screen showing a bar chart", legacy: "2024/09/French-PPC-Campaign.jpg" },
  "future-of-seo": { width: 1200, height: 509, alt: "The letters SEO lit up above a tablet under a person's hand", legacy: "2024/12/future-of-seo.jpg" },
  "german-seo-best-practices": { width: 1200, height: 426, alt: "Cogwheels and web icons connected across a blue background", legacy: "2024/10/german-seo-strategies.jpg" },
  "german-seo-content-localisation": { width: 1200, height: 426, alt: "A man at a whiteboard diagram with SEO at the centre, branching to keywords, pages, links, content and media", legacy: "2024/09/german-seo-content-localization.jpg" },
  "global-business-trends": { width: 1200, height: 644, alt: "Five colleagues around a meeting table, each working on a laptop or tablet", legacy: "2020/04/agency-post-02.jpg" },
  "google-analytics-international-marketing-limits": { width: 1200, height: 686, alt: "Two monitors on a desk showing analytics dashboards and a world map", legacy: "2026/01/googleanalyticsinternationalma.jpg" },
  "how-ai-is-revolutionising-seo-strategies": { width: 1200, height: 450, alt: "A human hand and a robotic hand typing on the same laptop", legacy: "2024/11/Revolutionising-SEO-Strategies.jpg" },
  "how-ai-is-transforming-translation-and-localisation": { width: 1200, height: 799, alt: "Keyboard keys printed with the flags of many countries", legacy: "2024/09/translation-keyboard-computer-7774314.jpg" },
  "how-to-create-a-targeted-content-strategy": { width: 1200, height: 426, alt: "Hands at a keyboard with floating counters for likes, comments and shares", legacy: "2024/10/targeted-content-strategy.jpg" },
  "how-to-promote-your-local-business-on-google-maps": { width: 1200, height: 673, alt: "A hand holding a phone that shows a map with a red location pin", legacy: "2020/11/google-maps-marketing.jpg" },
  "how-to-use-ai-and-machine-translation-tools": { width: 1200, height: 430, alt: "A person at a screen with a content workflow diagram drawn around them", legacy: "2024/10/Multilingual-Content-Optimisation.jpg" },
  "how-to-write-about-your-professional-background": { width: 1200, height: 644, alt: "Colleagues talking around a desktop monitor in a studio", legacy: "2020/04/agency-post-04.jpg" },
  "human-creator-economy": { width: 1200, height: 800, alt: "A creator speaking into a microphone in front of a camera", legacy: "2025/11/Human-Creator-Economy.jpg" },
  "internal-linking-tools": { width: 1200, height: 489, alt: "The letters SEO glowing above a hand resting on a keyboard", legacy: "2024/10/Affordable-SEO-Services.jpg" },
  "law-firm-seo-services": { width: 1200, height: 512, alt: "Two people in business suits walking outside a glass office building", legacy: "2024/12/law-firm-SEO.jpg" },
  "link-building-in-spain": { width: 1200, height: 431, alt: "A wooden bobbin resting on a pillow of handmade Spanish lace", legacy: "2024/10/spanish-link-building.jpg" },
  "link-selling-and-link-buying-platforms": { width: 1200, height: 483, alt: "Chain links in several bright colours, joined in a row", legacy: "2024/12/Link-Selling-and-Link-Buying-Platforms.jpg" },
  "llms-beyond-giants-hidden-ai-models": { width: 1200, height: 686, alt: "Devices and a glowing sphere on a podium, with a robotic hand reaching in", legacy: "2025/12/LLMs.jpg" },
  "localisation-testing-tools": { width: 1200, height: 426, alt: "Hands at a laptop with settings, search and file icons floating above the keys", legacy: "2024/10/testing-tools.jpg" },
  "mastering-the-art-of-networking": { width: 1200, height: 900, alt: "A city skyline with portrait photographs joined by a network of lines", legacy: "2024/09/ai-generated-internet-technology-8259052.jpg" },
  "most-popular-marketing-strategies": { width: 1200, height: 644, alt: "Four colleagues at a white table, looking at phones and a tablet", legacy: "2020/04/agency-post-01.jpg" },
  "multilingual-keyword-research": { width: 1200, height: 800, alt: "A laptop with a search box graphic reading keywords drawn over the screen", legacy: "2024/09/Multilingual-Keyword-Research.jpg" },
  "optimising-multilingual-website-content": { width: 1200, height: 430, alt: "Hands typing on a laptop with a faint data overlay across the desk", legacy: "2024/10/optimising-multilingual-website-content.jpg" },
  "optimising-your-website-for-valencia-based-searches": { width: 1200, height: 504, alt: "Two women at a market stall, with a search box drawn across the photograph", legacy: "2025/01/local-seo-valencia.jpg" },
  "optimising-your-website-for-voice-search": { width: 1200, height: 542, alt: "A woman speaking into the microphone of her phone", legacy: "2024/12/voice-search.jpg" },
  "prompt-engineers": { width: 1000, height: 519, alt: "Hands typing on a laptop set on top of printed plans", legacy: "2025/08/prompt-engineers.jpg" },
  "search-everywhere-strategy": { width: 1200, height: 596, alt: "A phone, a tablet and a laptop on a table, showing one interface across all three", legacy: "2026/01/searcheverywherestrategy2026.jpg", cropTop: 100 },
  "seo-in-belgium": { width: 600, height: 338, alt: "A computer keyboard with one key carrying the Belgian flag and another a tick", legacy: "2024/10/Belgium-SEO-1.jpg" },
  "spanish-keyword-localisation": { width: 1200, height: 475, alt: "A search box graphic on a yellow background, filled with keyword tags", legacy: "2024/10/spanish-keyword-research.jpg" },
  "spanish-on-page-seo": { width: 1200, height: 509, alt: "A red Spanish hair comb and fan set against roses", legacy: "2024/10/Spanish-On-Page-SEO.jpg" },
  "spanish-seo-markets": { width: 1200, height: 800, alt: "Hands typing on a laptop with a search field open on screen", legacy: "2024/10/spanish-seo.jpg" },
  "technical-seo-audit-checklist": { width: 1200, height: 482, alt: "The letters SEO glowing in orange above a laptop keyboard", legacy: "2024/10/technical-SEO.jpg" },
  "technical-seo-considerations-for-german-websites": { width: 1200, height: 425, alt: "A magnifying glass over the letters SEO, surrounded by cogwheel and web icons", legacy: "2024/10/technical-seo-considerations-for-german-websites.jpg" },
  "technical-seo-for-multilingual-websites": { width: 1200, height: 535, alt: "Four people holding a blank banner beside globe icons on a brick wall", legacy: "2024/12/Technical-SEO-for-Multilingual-Websites.jpg" },
  "technical-seo-for-spanish-search-engines": { width: 1200, height: 800, alt: "A view across the rooftops of Barcelona towards the Sagrada Familia", legacy: "2024/10/cathedral-sagrada-familia-barcelona-427997.jpg" },
  "top-instagram-tools": { width: 1200, height: 425, alt: "The Instagram logo in pink and orange", legacy: "2024/10/Top-Instagram-Tools.jpg" },
  "user-interface-localisation-can-transform-your-global-reach": { width: 1200, height: 577, alt: "A phone on a desk showing a wireframe layout of a mobile interface", legacy: "2024/10/User-Interface-Localisation.jpg" },
  "what-is-search-intent-mapping": { width: 1200, height: 428, alt: "A man pointing at an empty search box outlined in red", legacy: "2024/10/search-intent-mapping.jpg" },
};

export function getBlogImage(slug: string): BlogImage | undefined {
  return BLOG_IMAGES[slug];
}
