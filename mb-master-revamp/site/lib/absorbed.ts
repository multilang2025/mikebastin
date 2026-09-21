/**
 * The full range each service page covers, written as prose.
 *
 * `absorbs` in services.ts is a list of slugs, and the service page was
 * printing those slugs as chips: "certified-and-sworn-translation-services"
 * in a grey box, hyphens and all. Internal routing detail shown to a
 * reader, who learns nothing from it. A tidier list of names and
 * one-liners was no better: a reader skims a list and takes nothing from
 * it, and the point of the section is that the subject matter stays
 * readable for a buyer working out whether we can handle their job.
 *
 * So it is prose, per service, written from the harvested copy in
 * site/content/en/ and stripped of the legacy marketing voice
 * ("Revolutionise Your Global Reach", "We Dream Big"). The specialisms
 * are named inside the sentences, which keeps the search coverage
 * without reading like a directory.
 *
 * Write it for the buyer. Nothing here describes the site, the merge or
 * the redirect map: an opener such as "Eight pages used to divide this
 * by document type" tells a prospect about our CMS, and the owner
 * rejected exactly that framing. Start from the work instead.
 *
 * Keyed by service slug. A service with `absorbs` and no prose here fails
 * the build rather than falling back to its slugs, because a silent
 * fallback is how the chips lasted this long.
 */
export const ABSORBED_PROSE: Record<string, string[]> = {
  "multilingual-seo": [
    "Most of the work happens before a word gets written. Which markets to enter, in what order, and where the budget goes, decided against what a market is worth rather than which language is easiest to buy.",
    "Then the plumbing: a site that can carry more than one market at all, from URL structure to hreflang to the parts that have to be rewritten per language rather than translated. Get it wrong and the second language competes with the first.",
    "And the brand has to survive the trip. A tagline translated literally often says something else entirely in the new market, which is how a company ends up recognisable at home and forgettable everywhere else.",
  ],

  "local-seo": [
    "Local search is its own discipline, and the map pack is where it is won or lost. Google Business Profile, citations that agree with each other, contact details that match everywhere they appear, and landing pages written for a neighbourhood rather than a country.",
    "In a multilingual city the work doubles. Valencia, Brussels and Geneva each search in more than one language, and a profile optimized in one of them is close to invisible in the other.",
  ],

  "website-localisation": [
    "Localization is one job with six places to get it wrong, and the copy is only the first of them. Content first: pages that read as though written for the market, not translated into it.",
    "Then the machinery. A CMS wired so editors can publish in every language without a developer in the loop, WordPress plugins such as WPML, Weglot and Polylang set up properly, since they decide a site's URLs and hreflang whether or not anyone configured them, and a store where currency, payment methods, shipping rules and product data all change per market.",
    "And the interface has to hold. German runs about a third longer than the English a layout was designed around, so we test the built thing before launch: text overflowing its box, dates and currencies in the wrong format, untranslated strings still sitting in the menu.",
  ],

  "translation-services": [
    "Translation is best sorted by document type, because the risk changes completely from one kind to the next, and so does who should be doing the work.",
    "Business translation covers contracts, proposals, internal documents and the correspondence that keeps a deal moving in a language your own team does not work in. Financial work means audits, annual reports and prospectuses, where the regulated wording is the part that matters. Legal means contracts, filings and court documents, sworn or certified when the receiving body asks for it, which it often does without saying so in advance.",
    "Medical is where an error is a safety problem before it is a regulatory one, so it goes to translators who work in the field rather than to whoever is free. Academic work has to carry method and citation across intact. Certified and sworn translations are signed by a translator authorised to certify them, for the authorities, courts and registries that will not accept anything else.",
    "Transcreation is the odd one out, and the one most often asked for by the wrong name. Rewriting a campaign so it lands in the new market is a different job from translating it accurately, and it is priced differently, because the brief is the effect rather than the words.",
  ],

  "app-and-software-localisation": [
    "Order decides the cost here: internationalisation is what you do before launch, localization is what you do after.",
    "Software built to take another language costs far less than software retrofitted to it, which is the whole argument for doing the dull part early. Apps then go to market with their store listings translated too, since the listing is what gets found before the app does.",
    "Video, audio and podcasts come with the same expectation. An audience that finds you in its own language expects the media in it as well, with subtitling or voice work depending on what the format can carry.",
  ],

  "ai-consulting": [
    "Where AI helps across languages, and where it quietly costs quality, is a question worth answering on your own content rather than in the abstract. We look at what you already publish, what of it is machine-made, and what that is doing to the pages that have to be trusted.",
    "The answer is rarely all or nothing. Some of it is worth automating, and some of it is the reason a reader believed you in the first place.",
  ],

  "ai-translation-and-post-editing": [
    "Machine translation has become good enough to be dangerous. It produces text that reads fluently and is wrong in ways a non-speaker cannot see, which is worse than text that reads badly and warns you.",
    "Post-editing is the fix: a native speaker working over machine output and plugin translations from WPML, Weglot or Polylang until nothing left in it would make a reader in that market stop.",
  ],

  "technical-seo": [
    "Technical SEO is the part of search that sits inside your own control, which is not true of much else in it.",
    "Keyword research comes first, and it means reading what a market actually searches for rather than collecting phrases by volume. On-page work follows from it: titles, headings, internal links and the structure that tells a crawler what a page is for.",
    "Links still decide a great deal, and they have to be earned per market, since an English link does little for a Spanish page. English is not one market either: the UK, the United States and Ireland behave as three.",
    "Then measurement, which is where most multilingual sites go blind. One blended figure hides which language converts and which only collects traffic, so we separate them from the start.",
  ],

  "multilingual-content": [
    "Writing in the target language against that market's own research is a different job from translating a page optimized for a different one, and it is the difference between ranking in a market and merely existing in it.",
    "Culture decides the rest. What reads as confident in one market reads as blunt in the next, and it is cheaper to settle that before a campaign runs than after it lands badly. Social accounts follow the same rule: run per language by native speakers, not one feed pushed through translation.",
  ],
};

/**
 * The prose for a service that absorbed other pages. Throws rather than
 * falling back, so a new `absorbs` list without copy here stops the build
 * instead of shipping raw slugs to a reader.
 */
export function absorbedProse(serviceSlug: string): string[] {
  const found = ABSORBED_PROSE[serviceSlug];
  if (!found) {
    throw new Error(
      `lib/absorbed.ts has no prose for "${serviceSlug}", which lists pages in ` +
        `absorbs. Write it from those pages' harvested copy in site/content/en/.`
    );
  }
  return found;
}
