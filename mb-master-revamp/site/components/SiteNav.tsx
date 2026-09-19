"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, LocaleSlugs } from "@/lib/posts";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/", label: "Services" },
  { href: "/blog/", label: "Journal" },
  { href: "/results/", label: "Results" },
  { href: "/contact/", label: "Contact" },
];

const LOCALE_LABEL: Record<Locale, string> = { en: "EN", fr: "FR", es: "ES" };

function postPath(locale: Locale, slug: string): string {
  return locale === "en" ? `/blog/${slug}/` : `/${locale}/${slug}/`;
}

/**
 * Language switcher, shown only on a page whose manifest entry names
 * siblings (built from getLocaleManifest() -- groups with a single
 * published locale never get an entry). It links straight to each
 * sibling's real localised URL, never to a 404 or the homepage.
 */
function LocaleSwitcher({ manifest, pathname }: { manifest: Record<string, LocaleSlugs>; pathname: string }) {
  const siblings = manifest[pathname];
  if (!siblings) return null;

  const locales = (Object.keys(siblings) as Locale[]).sort(
    (a, b) => ["en", "fr", "es"].indexOf(a) - ["en", "fr", "es"].indexOf(b)
  );

  return (
    <ul className="flex shrink-0 items-center gap-x-3 text-[.8rem] uppercase tracking-[.06em]" style={{ color: "var(--dim)" }}>
      {locales.map((locale) => {
        const href = postPath(locale, siblings[locale]!);
        const active = href === pathname;
        return (
          <li key={locale}>
            {active ? (
              <span aria-current="page" style={{ color: "var(--berry)" }}>
                {LOCALE_LABEL[locale]}
              </span>
            ) : (
              <Link href={href} className="ulink">
                {LOCALE_LABEL[locale]}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function SiteNav({ localeManifest }: { localeManifest: Record<string, LocaleSlugs> }) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ borderColor: "var(--rule)", background: "color-mix(in oklab, var(--bg) 82%, transparent)" }}
    >
      <nav className="shell flex h-[62px] items-center justify-between gap-6 pr-[64px] sm:pr-[70px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden className="shrink-0">
            <path
              d="M8 36 C 17 26, 25 26, 33 33 S 49 46, 56 31"
              fill="none" stroke="var(--berry)" strokeWidth="4.4" strokeLinecap="round"
            />
          </svg>
          <span className="display text-[1.05rem] font-semibold tracking-tight">Mike Bastin</span>
        </Link>
        <ul className="flex items-center gap-x-6 gap-y-1 overflow-x-auto text-[.86rem]" style={{ color: "var(--dim)" }}>
          {LINKS.map((l) => {
            const active = l.href !== "/#work" && l.href !== "/#contact" && pathname === l.href;
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  className="ulink"
                  style={active ? { color: "var(--berry)" } : undefined}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <LocaleSwitcher manifest={localeManifest} pathname={pathname ?? ""} />
      </nav>
    </header>
  );
}
