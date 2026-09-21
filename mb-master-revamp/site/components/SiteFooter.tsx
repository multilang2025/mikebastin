import Link from "next/link";
import PostImage from "@/components/PostImage";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/lib/services";
import { getPostsForLocale, postPath, type Locale } from "@/lib/posts";
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
    based: string;
    top: string;
    motto: string;
  }
> = {
  en: {
    about: "About",
    services: "Top services",
    posts: "Recent posts",
    contact: "Get in touch",
    more: "All services",
    eyebrow: "Clean face, no crowd",
    cta: "Tell us which language you want selling next.",
    ctaButton: "Book a discovery call",
    ctaSecondary: "See what the numbers did",
    based: "Multilingual search, from Valencia",
    top: "Back to top",
    motto: "Automating business. Translating ideas. Connecting people.",
  },
  fr: {
    about: "À propos",
    services: "Services",
    posts: "Articles récents",
    contact: "Nous contacter",
    more: "Tous les services",
    eyebrow: "Sans détour",
    cta: "Dites-nous quelle langue vous voulez faire vendre.",
    ctaButton: "Réserver un premier échange",
    ctaSecondary: "Voir ce que les chiffres ont donné",
    based: "Référencement multilingue, depuis Valencia",
    top: "Haut de page",
    motto: "Automatiser les entreprises. Traduire les idées. Rapprocher les gens.",
  },
  es: {
    about: "Quiénes somos",
    services: "Servicios",
    posts: "Artículos recientes",
    contact: "Contacta con nosotros",
    more: "Todos los servicios",
    eyebrow: "Sin rodeos",
    cta: "Dinos qué idioma quieres que venda.",
    ctaButton: "Reservar una primera conversación",
    ctaSecondary: "Mira lo que hicieron los números",
    based: "Posicionamiento multilingüe, desde Valencia",
    top: "Volver arriba",
    motto: "Automatizar negocios. Traducir ideas. Conectar personas.",
  },
};

const ABOUT: Record<Locale, string> = {
  en: "We are a multilingual SEO and localisation practice in Valencia, working across European markets. Enquiries are what we count, not rankings.",
  fr: "Nous sommes un cabinet de référencement multilingue et de localisation basé à Valencia, actif sur les marchés européens. Ce que nous comptons, ce sont les demandes entrantes, pas les positions.",
  es: "Somos un equipo de posicionamiento multilingüe y localización con base en Valencia, trabajando en los mercados europeos. Contamos consultas, no posiciones.",
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
function servicesFor(locale: Locale): { href: string; label: string }[] {
  if (locale === "en") {
    return SERVICES.filter((s) => s.pillar).map((s) => ({
      href: `/services/${s.slug}/`,
      label: s.name,
    }));
  }

  return [...getServicesForLocale(locale)]
    .sort((a, b) => b.words - a.words)
    .slice(0, 6)
    .map((s) => ({ href: servicePath(locale, s.slug), label: s.title }));
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
      slug: p.slug,
      cluster: (p as { cluster?: string }).cluster,
    }));
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-5 text-[.72rem] font-semibold uppercase tracking-[.16em]"
      style={{ color: "var(--berry)" }}
    >
      {children}
    </h2>
  );
}

/** The site's own wave, drawn large and faint behind the sign-off. */
function WaveMark({ className, width = 22 }: { className?: string; width?: number }) {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 36 C 17 26, 25 26, 33 33 S 49 46, 56 31"
        fill="none"
        stroke="currentColor"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
    </svg>
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
  address = false,
  band = "a",
  locale = "en",
}: {
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
        <Reveal>
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <p className="eyebrow mb-4">{t.eyebrow}</p>
              {/* leading-[1.08] pulls the descenders of "losing you money"
                  below the heading's own box, so the gap to the button is
                  measured from a line that is not where the ink stops. */}
              <h2 className="mb-10 max-w-[18ch] text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.08]">
                {t.cta}
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/contact/" className="btn btn-primary btn-lg">
                  {t.ctaButton}
                </Link>
                <Link href="/results/" className="ulink text-[.98rem]">
                  {t.ctaSecondary}
                </Link>
              </div>
            </div>
            <div className="hidden justify-end lg:flex" style={{ color: "var(--rule)" }} aria-hidden="true">
              <WaveMark width={210} />
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
                <WaveMark className="shrink-0" width={20} />
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
                    <Link href="/how-i-work/" className="ulink">
                      How we work
                    </Link>
                  </li>
                  <li>
                    <Link href="/results/" className="ulink">
                      Results
                    </Link>
                  </li>
                  <li>
                    <Link href="/#work" className="ulink">
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
                    <Link href={s.href} className="ulink">
                      {s.label}
                    </Link>
                  </li>
                ))}
                {locale === "en" && (
                  <li className="mt-2">
                    <Link
                      href="/services/"
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
                          compact
                          className="aspect-[1200/630] w-full"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="ulink block text-[.88rem] leading-[1.4]">{p.label}</span>
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
              <div className="flex flex-col gap-2">
                <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="ulink w-fit">
                  +34 671 17 57 74
                </a>
                {address && (
                  <span className="leading-[1.5]" style={{ color: "var(--dim)" }}>
                    Calle Rugat 12 to 2, 46021 Valencia, Spain
                  </span>
                )}
              </div>
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
                  <Link key={l.href} href={l.href} className="ulink">
                    {l.label}
                  </Link>
                ))}
              </nav>
            )}
            <a href="#main" className="ulink ml-auto inline-flex items-center gap-1.5">
              {t.top}
              <span aria-hidden="true">&uarr;</span>
            </a>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
