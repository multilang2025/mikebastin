/**
 * Shared entity data for JSON-LD, per docs/HANDOFF.md section 13 ("Person
 * schema sitewide... worksFor/founder BeTranslated") and
 * docs/CONTENT-ARCHITECTURE.md section 1 ("Entity identity and sameAs").
 *
 * One Person and one ProfessionalService, each with a stable `@id` so every
 * other schema on the site (Service, BlogPosting, BreadcrumbList) references
 * the same two entities instead of repeating their fields. This is the
 * entity resolution CONTENT-ARCHITECTURE.md section 1 asks for: one
 * consistent story, not a slightly different Person on every page.
 *
 * Every type that can carry an `image` carries a real one, per
 * docs/STYLE-GUIDE-UK-EU.md section 8: the visible image, the social card
 * and the structured data should point at the same real, on-topic asset,
 * never a logo standing in for a missing photograph. Until 21 Sep 2026 no
 * type here emitted `image` at all, so every page shipped a social card
 * with a picture and structured data claiming none.
 *
 * Deliberately absent: Review, AggregateRating, LocalBusiness. See
 * docs/CONTENT-ARCHITECTURE.md section 4b -- self-hosted/scraped reviews are
 * ineligible for review rich results under Google's own guidelines, and the
 * project has already decided ProfessionalService is the entity type
 * (HANDOFF.md section 13), not LocalBusiness alongside it.
 */

export const SITE_URL = "https://mikebastin.com";

/** Schema.org wants absolute URLs; every image path on this site is rooted. */
const abs = (path: string) => `${SITE_URL}${path}`;

export const PERSON_ID = `${SITE_URL}/#person`;
export const BUSINESS_ID = `${SITE_URL}/#business`;

const SAME_AS = [
  "https://x.com/mikebastin",
  "https://www.linkedin.com/in/michaelbastin/",
  "https://www.google.com/maps?cid=5084624758674071823",
];

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Calle Rugat 12",
  postalCode: "46021",
  addressLocality: "Valencia",
  addressCountry: "ES",
};

/** Person schema per HANDOFF.md section 13. Referenced by @id elsewhere. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Mike Bastin",
  jobTitle: "International search consultant",
  email: "hello@mikebastin.com",
  telephone: "+34671175774",
  url: SITE_URL,
  address: ADDRESS,
  knowsLanguage: ["en", "fr", "es", "nl"],
  // The same photograph the reader meets on /how-i-work/, not the wave
  // mark: a logo is not a picture of a person, and Google reads `image` on
  // Person as exactly that.
  image: abs("/images/mike-bastin.webp"),
  // BeTranslated is the agency Mike Bastin co-founded and still runs (see
  // lib/projects.ts, the "betranslated" case study). worksFor is the Person
  // property that names it; a full Organization schema for BeTranslated
  // itself is out of scope here (not the entity this site is about).
  worksFor: {
    "@type": "Organization",
    name: "BeTranslated",
    url: "https://www.betranslated.com",
  },
  sameAs: SAME_AS,
};

/**
 * ProfessionalService per HANDOFF.md section 13 ("JSON-LD: Person +
 * ProfessionalService schema"). Not LocalBusiness: the handoff already named
 * the type, and CONTENT-ARCHITECTURE.md section 1 treats Person + this as
 * the resolved entity pair, not a third competing type.
 */
export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: "Mike Bastin",
  /** Owner's motto, 20 Sep. `slogan` is the property schema.org has for
   *  exactly this, so it goes here rather than being wedged into
   *  `description`, which answers a different question. */
  slogan: "Automating business. Translating ideas. Connecting people.",
  description:
    "Multilingual SEO, localization and AI consulting from Valencia, Spain.",
  url: SITE_URL,
  telephone: "+34671175774",
  email: "hello@mikebastin.com",
  address: ADDRESS,
  areaServed: "Worldwide",
  knowsLanguage: ["en", "fr", "es", "nl"],
  // The wave mark, 180x180, comfortably over Google's 112x112 floor for an
  // organisation logo. `image` repeats it because the business has no
  // premises photograph and inventing one is not an option.
  logo: abs("/apple-icon.png"),
  image: abs("/apple-icon.png"),
  founder: { "@id": PERSON_ID },
  sameAs: SAME_AS,
};

export type BreadcrumbItem = { name: string; url: string };

/** BreadcrumbList matching the actual nav hierarchy a template renders. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Service schema for a /services/[slug]/ page, referencing the shared entities. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  url: string;
  /** Absolute URL of a real image for this service, where one exists. */
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    // Omitted rather than filled with the wave mark. No service page
    // carries a photograph of its own today, and a logo dressed as the
    // service's image is the substitution the style guide warns against.
    ...(opts.image ? { image: opts.image } : {}),
    provider: { "@id": BUSINESS_ID },
    areaServed: "Worldwide",
  };
}

/** BlogPosting schema for a /blog/[slug]/ page. Dates must already be ISO 8601. */
export function blogPostingSchema(opts: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
  /**
   * Absolute URL of the post's own photograph. 57 of the posts have one in
   * lib/blog-images.ts and it is what PostImage renders, so the structured
   * data and the visible hero agree. The rest fall back to PostArt, which
   * draws a wave from the slug and has no file behind it, so they pass
   * nothing and the property is omitted.
   */
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.headline.slice(0, 110),
    description: opts.description,
    datePublished: new Date(opts.datePublished).toISOString(),
    dateModified: new Date(opts.dateModified).toISOString(),
    ...(opts.image ? { image: opts.image } : {}),
    author: { "@id": PERSON_ID },
    publisher: { "@id": BUSINESS_ID },
    mainEntityOfPage: opts.url,
    url: opts.url,
  };
}
