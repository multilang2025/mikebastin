/**
 * What each absorbed legacy page actually covered.
 *
 * `absorbs` in services.ts is a list of slugs, and the service page was
 * printing those slugs as chips: "certified-and-sworn-translation-services"
 * in a grey box, hyphens and all. Internal routing detail shown to a
 * reader, who learns nothing from it and reasonably reads the section as
 * unfinished.
 *
 * Each line here is written from that page's own harvested copy in
 * site/content/en/, kept to what it factually covered and stripped of the
 * legacy marketing voice ("Revolutionise Your Global Reach", "We Dream
 * Big"). Naming the specialism in words is also the only way the section
 * earns its place: the reason for keeping it is that eight merged pages'
 * worth of subject matter should still be readable on the page that
 * absorbed them, and a slug does not do that.
 *
 * A slug in `absorbs` with no entry here fails the build rather than
 * falling back to a prettified slug, because a silent fallback is how the
 * chips survived this long.
 */
export type AbsorbedPage = { name: string; line: string };

export const ABSORBED: Record<string, AbsorbedPage> = {
  // multilingual-seo
  "global-seo-solutions": {
    name: "Global SEO strategy",
    line: "Which markets to enter first, in what order, and where the budget goes, decided before any page is built.",
  },
  internationalisation: {
    name: "Internationalisation",
    line: "Getting a site ready to carry more than one market at all, from URL structure to what has to be rewritten per language.",
  },
  "language-solutions": {
    name: "Language solutions",
    line: "Translation, localisation and multilingual writing quoted as one piece of work when a market needs all three.",
  },
  "multilingual-branding": {
    name: "Multilingual branding",
    line: "Keeping a brand recognisable in a second language, where a literal translation of a tagline often says something else entirely.",
  },

  // local-seo
  "local-seo": {
    name: "Local SEO",
    line: "Ranking in the map pack: Google Business Profile, citations, consistent contact details and neighbourhood pages, handled language by language in cities like Valencia, Brussels and Geneva.",
  },

  // website-localisation
  "content-localisation": {
    name: "Content localisation",
    line: "Adapting pages so they read as though written for the market, rather than translated into it.",
  },
  "localisation-testing": {
    name: "Localisation testing",
    line: "Checking a localised build before launch: text overflowing its container, dates and currencies in the wrong format, untranslated strings left in the interface.",
  },
  "multilingual-cms-integration": {
    name: "Multilingual CMS integration",
    line: "Wiring a CMS so editors can publish in every language without a developer in the loop each time.",
  },
  "wordpress-translation-plugin": {
    name: "WordPress translation plugins",
    line: "Setting up and correcting WPML, Weglot and Polylang, which decide a multilingual WordPress site's URLs and hreflang whether or not anyone configured them.",
  },
  "localised-e-commerce-integration": {
    name: "Localised e-commerce",
    line: "WooCommerce and Shopify stores adapted per market, including currency, payment methods, shipping rules and product data.",
  },
  "multilingual-ux-ui-design": {
    name: "Multilingual UX and UI",
    line: "Interfaces that still work once the German runs a third longer than the English it was designed around.",
  },

  // translation-services
  "business-translation": {
    name: "Business translation",
    line: "Contracts, proposals, internal documents and correspondence, for trading in a language your own team does not work in.",
  },
  "medical-translation": {
    name: "Medical translation",
    line: "Clinical documents, where an error is a safety problem before it is a regulatory one, handled by translators who work in the field.",
  },
  "academic-translation": {
    name: "Academic translation",
    line: "Papers, theses and research, where method and citation have to survive the move into another language intact.",
  },
  "financial-translation": {
    name: "Financial translation",
    line: "Audits, annual reports and prospectuses, where the regulated wording is the part that matters.",
  },
  "legal-translation": {
    name: "Legal translation",
    line: "Contracts, filings and court documents, sworn or certified where the receiving body asks for it.",
  },
  "certified-and-sworn-translation-services": {
    name: "Certified and sworn translation",
    line: "Officially recognised translations for authorities, courts and registries, signed by a translator authorised to certify them.",
  },
  "expert-translation-services": {
    name: "Expert translation",
    line: "Translation by native linguists in the target language, briefed on the subject rather than assigned at random.",
  },
  transcreation: {
    name: "Transcreation",
    line: "Rewriting a campaign so it lands in the new market, which is a different job from translating it accurately.",
  },

  // app-and-software-localisation
  "app-localisation": {
    name: "App localisation",
    line: "Mobile apps taken into new markets, store listing included, since the listing is what gets found before the app does.",
  },
  "software-internationalisation": {
    name: "Software internationalisation",
    line: "Building software that takes another language without a rebuild, which costs far less before launch than after it.",
  },
  "multimedia-localisation": {
    name: "Multimedia localisation",
    line: "Video, audio and podcasts adapted for audiences who expect them in their own language, with subtitling and voice work where needed.",
  },

  // ai-consulting
  "ai-consulting-services": {
    name: "Multilingual AI consulting",
    line: "Where AI helps across languages and where it quietly costs quality, judged on your own content rather than in the abstract.",
  },

  // ai-translation-and-post-editing
  "post-ai-editing": {
    name: "Post-AI editing",
    line: "Editing machine output and plugin translations from WPML, Weglot or Polylang into something a native reader would not flag.",
  },

  // technical-seo
  "on-page-seo": {
    name: "On-page SEO",
    line: "Titles, headings, internal links and page structure, the part of ranking entirely within your own control.",
  },
  "keyword-research": {
    name: "Keyword research",
    line: "Reading what a market actually searches for, rather than collecting phrases by volume.",
  },
  "analytics-and-tracking": {
    name: "Analytics and tracking",
    line: "Measurement that separates markets, so one blended figure cannot hide which language converts and which only gets traffic.",
  },
  "english-seo": {
    name: "English SEO",
    line: "Ranking in English-speaking markets, where the UK, the United States and Ireland behave as three markets rather than one language.",
  },
  "link-building": {
    name: "Link building",
    line: "Earning links that survive an algorithm update, market by market, since an English link does little for a Spanish page.",
  },

  // multilingual-content
  "multilingual-seo-copywriting": {
    name: "Multilingual SEO copywriting",
    line: "Writing in the target language against that market's own keyword research, not translating a page optimised for a different one.",
  },
  "cultural-consulting": {
    name: "Cultural consulting",
    line: "What reads as confident in one market and blunt in the next, settled before a campaign runs rather than after it lands badly.",
  },
  "multilingual-social-media-management": {
    name: "Multilingual social media",
    line: "Accounts run per language by native speakers, rather than one feed translated into several.",
  },
};

/**
 * The absorbed page behind a slug. Throws rather than inventing a label,
 * so a new entry in `absorbs` without copy here stops the build instead of
 * shipping a raw slug to a reader.
 */
export function absorbedPage(slug: string): AbsorbedPage {
  const found = ABSORBED[slug];
  if (!found) {
    throw new Error(
      `lib/absorbed.ts has no entry for "${slug}". Add its name and line, ` +
        `taken from that page's harvested copy, rather than letting the slug render.`
    );
  }
  return found;
}
