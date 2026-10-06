import BrandMark from "@/components/BrandMark";
import FooterLanguages from "@/components/FooterLanguages";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/services";
import { getPostsForLocale, imageSlugFor, postPath, type Locale } from "@/lib/posts";
import { getServicesForLocale, servicePath } from "@/lib/services-locale";

/** Real profiles, recorded in docs/CONTENT-ARCHITECTURE.md section 1. */
export const SOCIALS = [
  { href: "https://x.com/mikebastin", label: "X" },
  { href: "https://www.linkedin.com/in/michaelbastin/", label: "LinkedIn" },
  { href: "https://www.google.com/maps?cid=5084624758674071823", label: "Google Business Profile" },
];

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/blog/", label: "Journal" },
  { href: "/results/", label: "Results" },
  { href: "/sitemap/", label: "Sitemap" },
];

/**
 * Strings per locale.
 *
 * The English services column says "Top services" because lib/services.ts
 * carries a real `pillar` flag: the six are an editorial designation, not
 * a guess. FR and ES have no equivalent flag, so their heading claims
 * nothing beyond "services" and the list is chosen by the rule documented
 * on servicesFor() below.
 */
const T: Record<
  Locale,
  {
    about: string;
    services: string;
    posts: string;
    contact: string;
    more: string;
    eyebrow: string;
    cta: string;
    ctaButton: string;
    ctaSecondary: string;
    reply: string;
    based: string;
    top: string;
    motto: string;
    privacy: string;
    cookies: string;
  }
> = {
  en: {
    about: "About",
    services: "Top services",
    posts: "Recent posts",
    contact: "Get in touch",
    more: "All services",
    eyebrow: "Straight to the point",
    cta: "Tell us which language you want selling next.",
    ctaButton: "Book a free consultation",
    ctaSecondary: "See client results",
    reply: "Mike reads every message and replies, usually within a working day.",
    based: "Multilingual search, from Valencia",
    top: "Back to top",
    motto: "Automating business. Translating ideas. Connecting people.",
    privacy: "Privacy and cookies",
    cookies: "Cookie settings",
  },
  fr: {
    about: "À propos",
    services: "Services",
    posts: "Articles récents",
    contact: "Nous contacter",
    more: "Tous les services",
    eyebrow: "Droit au but",
    cta: "Dites-nous dans quelle langue vous voulez vendre ensuite.",
    ctaButton: "Parlons de votre projet",
    ctaSecondary: "Voir les résultats de nos clients",
    reply: "Mike lit chaque message et vous répond, en général sous un jour ouvré.",
    based: "Référencement multilingue, depuis Valencia",
    top: "Haut de page",
    motto: "Automatiser l’entreprise. Traduire les idées. Relier les personnes.",
    privacy: "Confidentialité et cookies",
    cookies: "Réglages des cookies",
  },
  es: {
    about: "Quiénes somos",
    services: "Servicios",
    posts: "Artículos recientes",
    contact: "Contacta con nosotros",
    more: "Todos los servicios",
    eyebrow: "Directo al grano",
    cta: "Cuéntanos qué clientes quieres ganar, en Valencia o fuera.",
    ctaButton: "Hablemos de tu proyecto",
    ctaSecondary: "Ver resultados de clientes",
    reply: "Mike lee cada mensaje y te responde, por lo general en un día laborable.",
    based: "Posicionamiento multilingüe, desde Valencia",
    top: "Volver arriba",
    motto: "Automatizar negocios. Traducir ideas. Conectar personas.",
    privacy: "Privacidad y cookies",
    cookies: "Ajustes de cookies",
  },
};

const PRIVACY_HREF: Record<Locale, string> = { en: "/privacy/", fr: "/fr/confidentialite/", es: "/es/privacidad/" };

// Where the sign-off button and the "all services" link go per locale. A
// locale with no index of its own gets no link rather than an English one:
// sending a French reader to an English page is worse than offering nothing.
const CONTACT_HREF: Record<Locale, string> = { en: "/contact/", fr: "/fr/nous-contacter/", es: "/es/contactanos/" };
const SERVICES_INDEX: Record<Locale, string | null> = { en: "/services/", fr: "/fr/services/", es: "/es/services/" };

const ABOUT: Record<Locale, string> = {
  en: "We are a multilingual SEO and localization practice in Valencia, working across European markets. Enquiries are what we count, market by market.",
  fr: "Nous sommes un cabinet de référencement multilingue et de localisation basé à Valencia, actif sur les marchés européens. Nous mesurons notre travail aux demandes reçues, marché par marché.",
  es: "Somos un equipo de posicionamiento multilingüe y localización con sede en Valencia, que trabaja en los mercados europeos. Medimos nuestro trabajo por las consultas recibidas, mercado a mercado.",
};

/**
 * The services column.
 *
 * EN uses the six `pillar: true` services, so the footer cannot drift from
 * lib/services.ts the way a hand-typed list would.
 *
 * FR and ES have no pillar flag and only two of the six EN pillars have a
 * translated sibling at all (multilingual-seo and website-localisation, per
 * redirects/content-map.json), so mapping the EN six across would render a
 * column of two. Those locales list their own longest service pages
 * instead: deterministic, and "longest" is a claim about the page rather
 * than about the service, which is why their heading does not say "top".
 */
const FR_FOOTER = ["seo", "referencement-multilingue", "seo-espagnol", "seo-neerlandais", "seo-allemand", "sem-multilingue"];
// Spanish: what a Valencia company hires us for first (owner, 3 Oct 2026),
// then the market it most often sells into.
const ES_FOOTER = ["optimizacion-seo", "seo-local", "publicidad-multilingue", "traduccion-profesional", "consultoria-de-inteligencia-artificial", "seo-frances"];

function servicesFor(locale: Locale): { href: string; label: string }[] {
  if (locale === "en") {
    return SERVICES.filter((s) => s.pillar).map((s) => ({
      href: `/services/${s.slug}/`,
      label: s.name,
    }));
  }

  // French has a curated list since the phase 4 rewrite (30 Sep 2026): the
  // main page and the key markets (Spain, Benelux, Germany), by their short
  // names. Spanish keeps the longest-pages rule until it is rebuilt.
  const all = getServicesForLocale(locale);
  const picked =
    locale === "fr" || locale === "es"
      ? (locale === "fr" ? FR_FOOTER : ES_FOOTER).map((slug) => all.find((s) => s.slug === slug)).filter((s) => s !== undefined)
      : [...all].sort((a, b) => b.words - a.words).slice(0, 6);
  return picked.map((s) => ({ href: servicePath(locale, s.slug), label: s.name ?? s.title }));
}

/**
 * The four newest posts in `locale`.
 *
 * Worth knowing that /blog/ deliberately organises by subject and says so
 * on the page ("a date is not a subject"), because a river of dated posts
 * is not how anyone browses this site. A footer column is the other job:
 * a freshness signal and a crawl path into new writing, which is why it is
 * the one place ordering by date earns its keep.
 */
function recentFor(locale: Locale) {
  return [...getPostsForLocale(locale)]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((p) => ({
      href: postPath(locale, p.slug),
      label: p.title,
      date: p.date,
      slug: imageSlugFor(locale, p.slug),
      cluster: (p as { cluster?: string }).cluster,
    }));
}

const COUNTRY: Record<Locale, string> = { en: "Spain", fr: "Espagne", es: "España" };

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="display mb-5 text-[1.12rem] font-semibold leading-tight" style={{ color: "var(--ink)" }}>
      {children}
    </h2>
  );
}


/**
 * The one shared footer, on all 150 built pages including the 404.
 *
 * Four columns under a sign-off: who we are, what we sell, what we have
 * written lately, and how to reach us. The first version of this was a
 * bare list of links per column, which read as a sitemap rather than as
 * part of the site, so the columns now carry the things that make the
 * rest of the site recognisable: the wave mark, the accent-coloured
 * headings, hairline rules between columns, and thumbnails of the same
 * generated art the journal uses.
 *
 * The sign-off leads with an actual button. Before, the footer carried
 * the "tell us" heading and then made a reader hunt for a mailto in the
 * fourth column, which is a strange thing for the page's conversion
 * moment to do.
 *
 * It renders on the FR and ES routes too (app/fr/[slug], app/es/[slug]
 * and their service routes), so everything here is locale-aware. The site
 * has no FR or ES index for services or the journal, so those locales get
 * no link to one: sending a French reader to an English index is worse
 * than offering nothing.
 */
export default function SiteFooter({
  band = "a",
  locale = "en",
}: {
  /** Kept for existing callers; the address now shows on every footer. */
  address?: boolean;
  /** Most pages fix the footer to band-a; a page with a variable number of
   * bands above it (e.g. app/services/[slug]/) computes this instead, so
   * the footer never ends up on the same surface as the section before it. */
  band?: "a" | "b";
  locale?: Locale;
}) {
  const t = T[locale];
  const services = servicesFor(locale);
  const recent = recentFor(locale);
  const dateFormat = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
    month: "short",
    year: "numeric",
  });
  // Baked at build. Every merge rebuilds and redeploys, so it cannot drift
  // far, and a hardcoded year drifts the moment it is written.
  const year = new Date().getFullYear();

  const col = "lg:border-l lg:pl-10";

  return (
    <footer id="contact" className={`band band-${band} pb-[clamp(40px,5vw,64px)] pt-[clamp(64px,9vw,120px)]`}>
      <div className="shell">
        {/* ---------- sign-off ---------- */}
        {/* Owner, 3 Oct 2026: "the footer is too dull". The closing
            invitation is the one contrasting surface the declaudify brief
            keeps (a teal panel in both themes), and it is personal: Mike's
            face, the person who answers, and the email and phone set large
            enough to use. Static, no motion beyond the shared reveal. */}
        <Reveal>
          <div className="footer-cta grid items-center gap-10 rounded-[10px] px-[clamp(24px,5vw,64px)] py-[clamp(32px,5vw,56px)] lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="footer-cta-eyebrow mb-4 text-[.95rem] font-medium">{t.eyebrow}</p>
              <h2 className="mb-8 max-w-[20ch] text-[clamp(1.7rem,4vw,2.7rem)] font-semibold leading-[1.1]">
                {t.cta}
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href={CONTACT_HREF[locale]} className="btn btn-primary btn-lg">
                  {t.ctaButton}
                </Link>
                {locale === "en" && (
                  <Link href="/results/" className="ulink footer-cta-link text-[.98rem]">
                    {t.ctaSecondary}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-5 sm:flex-row">
              <img
                src="/images/mike-bastin-192.webp"
                alt="Mike Bastin"
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-[72px] w-[72px] shrink-0 rounded-full object-cover sm:h-[96px] sm:w-[96px]"
              />
              <div className="min-w-0">
                <p className="mb-3 max-w-[30ch] text-[.95rem] leading-[1.5] footer-cta-dim">{t.reply}</p>
                <a href="mailto:hello@mikebastin.com" className="footer-cta-link display block whitespace-nowrap text-[clamp(1.15rem,2vw,1.45rem)] font-semibold">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="footer-cta-link mt-1 block text-[1.02rem]">
                  +34 671 17 57 74
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ---------- columns ---------- */}
        <Reveal i={1}>
          <div
            className="mt-14 grid gap-x-10 gap-y-12 border-t pt-12 text-[.92rem] sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "var(--rule)" }}
          >
            <div>
              <div className="mb-3 flex items-center gap-2.5">
                <BrandMark width={41} />
                <span className="display text-[1.05rem] font-semibold tracking-tight">Mike Bastin</span>
              </div>
              {/* The owner's motto, 20 Sep. It sits under the wordmark, where
                  a motto belongs, rather than competing with the sign-off
                  heading above it. Also emitted as schema.org `slogan` on the
                  ProfessionalService node in lib/schema.ts. */}
              <p className="eyebrow mb-4 max-w-[30ch] text-[1rem] leading-[1.45]">
                {t.motto}
              </p>
              <p className="max-w-[38ch] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {ABOUT[locale]}
              </p>
              {locale === "en" && (
                <ul className="mt-5 flex flex-col gap-2">
                  <li>
                    <Link href="/how-i-work/" className="ulink flink">
                      How we work
                    </Link>
                  </li>
                  <li>
                    <Link href="/results/" className="ulink flink">
                      Results
                    </Link>
                  </li>
                  <li>
                    <Link href="/#work" className="ulink flink">
                      Client work
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div className={col} style={{ borderColor: "var(--rule)" }}>
              <ColumnHeading>{t.services}</ColumnHeading>
              <ul className="flex flex-col gap-2.5">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="ulink flink">
                      {s.label}
                    </Link>
                  </li>
                ))}
                {SERVICES_INDEX[locale] && (
                  <li className="mt-2">
                    <Link
                      href={SERVICES_INDEX[locale]!}
                      className="ulink inline-flex items-center gap-1.5 font-semibold"
                      style={{ color: "var(--berry)" }}
                    >
                      {t.more}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div className={col} style={{ borderColor: "var(--rule)" }}>
              <ColumnHeading>{t.posts}</ColumnHeading>
              <ul className="flex flex-col gap-4">
                {recent.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="group flex items-start gap-3">
                      <span
                        className="mt-[3px] w-14 shrink-0 overflow-hidden rounded-[3px] border"
                        style={{ borderColor: "var(--rule)" }}
                      >
                        <PostImage
                          slug={p.slug}
                          cluster={p.cluster}
                          alt={locale === "en" ? undefined : ""}
                          compact
                          className="aspect-[1200/630] w-full"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="ulink flink block text-[.88rem] leading-[1.4]">{p.label}</span>
                        <span className="mt-1 block text-[.74rem]" style={{ color: "var(--dim)" }}>
                          {dateFormat.format(new Date(p.date))}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={col} style={{ borderColor: "var(--rule)" }}>
              <ColumnHeading>{t.contact}</ColumnHeading>
              {/* Email and phone sit large in the closing panel above; this
                  column carries where to find us. */}
              <p className="leading-[1.5]" style={{ color: "var(--dim)" }}>
                Calle Rugat 12 - 2
                <br />
                46021 Valencia, {COUNTRY[locale]}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {SOCIALS.map((sc) => (
                  <li key={sc.href}>
                    <a
                      href={sc.href}
                      target="_blank"
                      rel="me noopener noreferrer"
                      className="inline-block rounded-full border px-3 py-1 text-[.78rem] transition-colors"
                      style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
                    >
                      {sc.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* ---------- sign-off line ---------- */}
        <Reveal i={2}>
          <div
            className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6 text-[.82rem]"
            style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
          >
            <span>
              &copy; {year} Mike Bastin. {t.based}.
            </span>
            {locale === "en" && (
              <nav className="flex flex-wrap gap-x-6 gap-y-2">
                {LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="ulink flink">
                    {l.label}
                  </Link>
                ))}
              </nav>
            )}
            <Link href={PRIVACY_HREF[locale]} className="ulink flink">
              {t.privacy}
            </Link>
            <CookieSettingsLink label={t.cookies} />
            <FooterLanguages />
            <a href="#main" className="ulink ml-auto inline-flex items-center gap-1.5">
              {t.top}
              <span aria-hidden="true">&uarr;</span>
            </a>
          </div>
        </Reveal>
        <div className="mt-12 flex justify-center" aria-hidden="true">
          <BrandMark
            width={360}
            className="h-auto w-[min(76vw,360px)] opacity-[.14]"
          />
        </div>
      </div>
    </footer>
  );
}
