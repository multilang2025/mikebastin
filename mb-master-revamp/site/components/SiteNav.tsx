"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

// Service pages' manifest entries (merged into getLocaleManifest() by
// lib/services-locale.ts) use a different URL shape than posts'
// (/services/<slug>/ vs /blog/<slug>/), so the switcher decides which
// shape to reconstruct from whether the current page is itself a service
// page, rather than from anything the manifest value carries.
function servicePath(locale: Locale, slug: string): string {
  return locale === "en" ? `/services/${slug}/` : `/${locale}/services/${slug}/`;
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

  const isService = pathname.includes("/services/");
  const buildPath = isService ? servicePath : postPath;

  const locales = (Object.keys(siblings) as Locale[]).sort(
    (a, b) => ["en", "fr", "es"].indexOf(a) - ["en", "fr", "es"].indexOf(b)
  );

  return (
    <ul className="flex shrink-0 items-center gap-x-3 text-[.8rem] uppercase tracking-[.06em]" style={{ color: "var(--dim)" }}>
      {locales.map((locale) => {
        const href = buildPath(locale, siblings[locale]!);
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

/**
 * The mobile menu.
 *
 * Until now the link list simply ran off the side of a phone behind the
 * floating theme toggle: `overflow-x-auto` meant it scrolled sideways
 * rather than wrapped, so the only visible affordance on a 412px screen
 * was the toggle, and four of the six links were unreachable without
 * knowing to swipe a strip of text.
 *
 * The button sits inside the nav's right padding, to the left of the
 * toggle's fixed position, so the two never overlap.
 */
export default function SiteNav({ localeManifest }: { localeManifest: Record<string, LocaleSlugs> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
        <ul className="hidden items-center gap-x-6 text-[.86rem] sm:flex" style={{ color: "var(--dim)" }}>
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

        <div className="hidden sm:block">
          <LocaleSwitcher manifest={localeManifest} pathname={pathname ?? ""} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mb-mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 grid h-11 w-11 shrink-0 place-items-center rounded-full sm:hidden"
          style={{ color: "var(--berry)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {open ? (
              <path
                d="m5 5 14 14M19 5 5 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3.5 7h17M3.5 12h17M3.5 17h17"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mb-mobile-menu"
          className="border-t sm:hidden"
          style={{ borderColor: "var(--rule)", background: "var(--bg)" }}
        >
          <ul className="shell flex flex-col py-2 text-[1rem]">
            {LINKS.map((l) => {
              const active = l.href !== "/#work" && l.href !== "/#contact" && pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b py-3.5"
                    style={{
                      borderColor: "var(--rule)",
                      color: active ? "var(--berry)" : "var(--ink)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="shell pb-4" onClickCapture={() => setOpen(false)}>
            <LocaleSwitcher manifest={localeManifest} pathname={pathname ?? ""} />
          </div>
        </div>
      )}
    </header>
  );
}
