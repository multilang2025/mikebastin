import Link from "next/link";
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
];

/**
 * Column headings per locale. The English services column says "Top
 * services" because lib/services.ts carries a real `pillar` flag: the six
 * are an editorial designation, not a guess. FR and ES have no equivalent
 * flag, so their heading claims nothing beyond "services" and the list is
 * chosen by the rule documented on servicesFor() below.
 */
const T: Record<
  Locale,
  { about: string; services: string; posts: string; contact: string; more: string; eyebrow: string; cta: string }
> = {
  en: {
    about: "About",
    services: "Top services",
    posts: "Recent posts",
    contact: "Get in touch",
    more: "All services",
    eyebrow: "Clean face, no crowd",
    cta: "Tell us which language is losing you money.",
  },
  fr: {
    about: "À propos",
    services: "Services",
    posts: "Articles récents",
    contact: "Nous contacter",
    more: "Tous les services",
    eyebrow: "Sans détour",
    cta: "Dites-nous quelle langue vous coûte de l'argent.",
  },
  es: {
    about: "Quiénes somos",
    services: "Servicios",
    posts: "Artículos recientes",
    contact: "Contacta con nosotros",
    more: "Todos los servicios",
    eyebrow: "Sin rodeos",
    cta: "Dinos qué idioma te está costando dinero.",
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
function recentFor(locale: Locale): { href: string; label: string; date: string }[] {
  return [...getPostsForLocale(locale)]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((p) => ({ href: postPath(locale, p.slug), label: p.title, date: p.date }));
}

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[.78rem] font-semibold uppercase tracking-[.14em]" style={{ color: "var(--dim)" }}>
      {children}
    </h2>
  );
}

/**
 * The one shared footer, replacing the identical contact block that used
 * to be copy-pasted into every page.tsx. Every page gets the same
 * navigation and the same way to get in touch, in one place.
 *
 * It renders on the FR and ES routes too (app/fr/[slug], app/es/[slug] and
 * their service routes), so the columns are locale-aware. The site has no
 * FR or ES index for services or the journal, so those locales get no link
 * to one: sending a French reader to an English index is worse than
 * offering nothing.
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

  return (
    <footer id="contact" className={`band band-${band} py-[clamp(64px,9vw,120px)]`}>
      <div className="shell">
        <Reveal>
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <h2 className="mb-8 max-w-[18ch] text-[clamp(1.8rem,4.4vw,3rem)] font-semibold leading-[1.08]">
            {t.cta}
          </h2>
        </Reveal>

        <Reveal i={1}>
          <div
            className="mt-12 grid gap-x-10 gap-y-12 border-t pt-12 text-[.92rem] sm:grid-cols-2 lg:grid-cols-4"
            style={{ borderColor: "var(--rule)" }}
          >
            <div>
              <ColumnHeading>{t.about}</ColumnHeading>
              <p className="max-w-[38ch] leading-[1.6]" style={{ color: "var(--dim)" }}>
                {ABOUT[locale]}
              </p>
              {locale === "en" && (
                <ul className="mt-4 flex flex-col gap-2">
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

            <div>
              <ColumnHeading>{t.services}</ColumnHeading>
              <ul className="flex flex-col gap-2">
                {services.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className="ulink">
                      {s.label}
                    </Link>
                  </li>
                ))}
                {locale === "en" && (
                  <li className="mt-1">
                    <Link href="/services/" className="ulink" style={{ color: "var(--berry)" }}>
                      {t.more}
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <ColumnHeading>{t.posts}</ColumnHeading>
              <ul className="flex flex-col gap-3">
                {recent.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="ulink block max-w-[34ch] leading-[1.45]">
                      {p.label}
                    </Link>
                    <span className="text-[.78rem]" style={{ color: "var(--dim)" }}>
                      {dateFormat.format(new Date(p.date))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ColumnHeading>{t.contact}</ColumnHeading>
              <div className="flex flex-col gap-2">
                <a href="mailto:hello@mikebastin.com" className="ulink w-fit">
                  hello@mikebastin.com
                </a>
                <a href="tel:+34671175774" className="ulink w-fit">
                  +34 671 17 57 74
                </a>
                {address && (
                  <span style={{ color: "var(--dim)" }}>
                    Calle Rugat 12 to 2, 46021 Valencia, Spain
                  </span>
                )}
              </div>
              <ul className="mt-5 flex flex-col gap-2">
                {SOCIALS.map((sc) => (
                  <li key={sc.href}>
                    <a
                      href={sc.href}
                      className="ulink"
                      target="_blank"
                      rel="me noopener noreferrer"
                    >
                      {sc.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {locale === "en" && (
          <Reveal i={2}>
            <nav
              className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t pt-6 text-[.88rem]"
              style={{ borderColor: "var(--rule)", color: "var(--dim)" }}
            >
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="ulink">
                  {l.label}
                </Link>
              ))}
            </nav>
          </Reveal>
        )}
      </div>
    </footer>
  );
}
