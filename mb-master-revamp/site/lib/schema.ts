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
 * Deliberately absent: Review, AggregateRating, LocalBusiness. See
 * docs/CONTENT-ARCHITECTURE.md section 4b -- self-hosted/scraped reviews are
 * ineligible for review rich results under Google's own guidelines, and the
 * project has already decided ProfessionalService is the entity type
 * (HANDOFF.md section 13), not LocalBusiness alongside it.
 */

export const SITE_URL = "https://mikebastin.com";

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
  // BeTranslated is the agency Mike Bastin founded and still runs (see
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
  description:
    "Multilingual SEO, localisation and AI consulting from Valencia, Spain.",
  url: SITE_URL,
  telephone: "+34671175774",
  email: "hello@mikebastin.com",
  address: ADDRESS,
  areaServed: "Worldwide",
  knowsLanguage: ["en", "fr", "es", "nl"],
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: opts.name,
    name: opts.name,
    description: opts.description,
    url: opts.url,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.headline.slice(0, 110),
    description: opts.description,
    datePublished: new Date(opts.datePublished).toISOString(),
    dateModified: new Date(opts.dateModified).toISOString(),
    author: { "@id": PERSON_ID },
    publisher: { "@id": BUSINESS_ID },
    mainEntityOfPage: opts.url,
    url: opts.url,
  };
}
