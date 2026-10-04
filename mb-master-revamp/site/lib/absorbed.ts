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
    "Most of the work happens before a word gets written. Which markets to enter, in what order, and where the budget goes, decided against what a market is worth.",
    "Then the plumbing: a site that can carry more than one market at all, from URL structure to hreflang to the parts that have to be rewritten per language. Built right, the second language adds to the first.",
    "And the brand has to make the trip intact. A tagline is rewritten for the new market, since a literal translation often says something else entirely, so the company is as recognisable abroad as it is at home.",
  ],

  "local-seo": [
    "Local search is its own discipline, and the map pack is where it is won. Google Business Profile, citations that agree with each other, contact details that match everywhere they appear, and landing pages written for a neighbourhood.",
    "In a multilingual city the work doubles. Valencia, Brussels and Geneva each search in more than one language, so the profile is optimized in each language the city searches in.",
  ],

  "website-localisation": [
    "Localization is one job with six places to get right, and the copy is only the first of them. Content first: pages that read as though written for the market.",
    "Then the machinery. A CMS wired so editors can publish in every language on their own, WordPress plugins such as WPML, Weglot and Polylang set up properly, since they decide a site's URLs and hreflang whether or not anyone configured them, and a store where currency, payment methods, shipping rules and product data all change per market.",
    "And the interface has to hold. German runs about a third longer than the English a layout was designed around, so we test the built thing before launch: text that fits its box, dates and currencies in the local format, and every string in the menu translated.",
  ],

  "translation-services": [
    "Translation is best sorted by document type, because the risk changes completely from one kind to the next, and so does who should be doing the work.",
    "Business translation covers contracts, proposals, internal documents and the correspondence that keeps a deal moving in a language outside your own team's. Financial work means audits, annual reports and prospectuses, where the regulated wording is the part that matters. Legal means contracts, filings and court documents, sworn or certified when the receiving body asks for it, which many do as a matter of course.",
    "Medical is where accuracy is a safety matter before it is a regulatory one, so it goes to translators who work in the field. Academic work has to carry method and citation across intact. Certified and sworn translations are signed by a translator authorised to certify them, for the authorities, courts and registries that require exactly that.",
    "Transcreation is its own job, and often asked for under another name. Rewriting a campaign so it lands in the new market is a different job from translating it accurately, and it is priced differently, because the brief is the effect on the reader.",
  ],

  "app-and-software-localisation": [
    "Order decides the cost here: internationalization is what you do before launch, localization is what you do after.",
    "Software built to take another language costs far less than software retrofitted to it, which is the whole argument for doing the groundwork early. Apps then go to market with their store listings translated too, since the listing is what gets found before the app does.",
    "Video, audio and podcasts come with the same expectation. An audience that finds you in its own language expects the media in it as well, with subtitling or voice work depending on what the format can carry.",
  ],

  "ai-consulting": [
    "Where AI helps across languages, and where a human keeps the quality, is a question best answered on your own content. We look at what you already publish, what of it is machine-made, and what that is doing to the pages that have to be trusted.",
    "The answer is usually a mix: some of it is worth automating, and some of it is the reason a reader believed you in the first place.",
  ],

  "ai-translation-and-post-editing": [
    "Machine translation now reads fluently, which is exactly why it needs a native reader: the errors it makes are the kind only a speaker of the language can spot.",
    "Post-editing is the fix: a native speaker working over machine output and plugin translations from WPML, Weglot or Polylang until every line reads naturally to a reader in that market.",
  ],

  "technical-seo": [
    "One engagement covers the technical setup of every language version of your site, plus the keyword research, on-page work, link building, analytics and English-language search that each had a page of their own here.",
    "Each month you get the fixes made, a report per market and the next fixes in order of what they are worth.",
  ],

  "multilingual-content": [
    "Writing in the target language against that market's own research is its own job, and it is what makes a page rank in that market.",
    "Culture decides the rest. What reads as confident in one market reads as blunt in the next, and settling that before a campaign runs is the cheaper route. Social accounts follow the same rule: run per language by native speakers.",
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
