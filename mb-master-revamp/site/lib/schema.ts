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

/** The person's own profiles. The Business Profile describes the business,
 *  so it sits only on the ProfessionalService (schema audit, 3 Oct 2026). */
const PERSON_SAME_AS = ["https://x.com/mikebastin", "https://www.linkedin.com/in/michaelbastin/"];
const SAME_AS = [...PERSON_SAME_AS, "https://www.google.com/maps?cid=5084624758674071823"];
export const WEBSITE_ID = `${SITE_URL}/#website`;

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Calle Rugat 12 - 2",
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
  url: `${SITE_URL}/`,
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
  sameAs: PERSON_SAME_AS,
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
  url: `${SITE_URL}/`,
  telephone: "+34671175774",
  email: "hello@mikebastin.com",
  address: ADDRESS,
  areaServed: "Worldwide",
  /** The legal entity behind every brand on the site (owner, 2 Oct 2026),
   *  as the privacy pages name it. The office shown stays `address`. */
  parentOrganization: {
    "@type": "Organization",
    name: "BeTranslated",
    url: "https://www.betranslated.com",
    taxID: "B40654865",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle Doctor Ferran 13",
      postalCode: "46021",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
  },
  knowsLanguage: ["en", "fr", "es", "nl"],
  // The wave mark, 180x180, comfortably over Google's 112x112 floor for an
  // organisation logo. `image` repeats it because the business has no
  // premises photograph and inventing one is not an option.
  logo: abs("/apple-icon.png"),
  image: abs("/apple-icon.png"),
  founder: { "@id": PERSON_ID },
  sameAs: SAME_AS,
};

/**
 * WebSite node, for Google's site name (schema audit, 3 Oct 2026). No
 * SearchAction: the site has no search.
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Mike Bastin",
  url: `${SITE_URL}/`,
  inLanguage: ["en", "fr", "es"],
  publisher: { "@id": BUSINESS_ID },
};

/** The author and publisher written out in full, not only by @id, so a
 *  parser that reads one block alone still finds a name and a url. */
const AUTHOR = { "@type": "Person", "@id": PERSON_ID, name: "Mike Bastin", url: `${SITE_URL}/` };
const PUBLISHER = {
  "@type": "Organization",
  "@id": BUSINESS_ID,
  name: "Mike Bastin",
  logo: { "@type": "ImageObject", url: abs("/apple-icon.png"), width: 180, height: 180 },
};

/** Cut at a word boundary, for Google's 110-character headline guidance. */
function headline110(h: string) {
  if (h.length <= 110) return h;
  const cut = h.slice(0, 110);
  return cut.slice(0, cut.lastIndexOf(" "));
}

/**
 * ContactPage or AboutPage for the contact and team pages (schema audit,
 * 3 Oct 2026): no rich result, but it names what the page is and ties it
 * to the business and its lead.
 */
export function pageSchema(type: "ContactPage" | "AboutPage", url: string, name: string, inLanguage: string) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    url,
    name,
    inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": type === "AboutPage" ? PERSON_ID : BUSINESS_ID },
  };
}

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
  /** "en", "fr" or "es". */
  inLanguage?: string;
  /** Defaults to worldwide; a city-level service passes its city. */
  areaServed?: string | { "@type": string; name: string };
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
    areaServed: opts.areaServed ?? "Worldwide",
    ...(opts.inLanguage ? { inLanguage: opts.inLanguage } : {}),
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
  /** "en", "fr" or "es". */
  inLanguage?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: headline110(opts.headline),
    description: opts.description,
    datePublished: new Date(opts.datePublished).toISOString(),
    dateModified: new Date(opts.dateModified).toISOString(),
    ...(opts.image ? { image: opts.image } : {}),
    author: AUTHOR,
    publisher: PUBLISHER,
    mainEntityOfPage: opts.url,
    url: opts.url,
    inLanguage: opts.inLanguage ?? "en",
  };
}
