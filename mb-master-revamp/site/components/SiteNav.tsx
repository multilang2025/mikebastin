"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
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
  return locale === "en"
    ? `/services/${slug}/`
    : `/${locale}/services/${slug}/`;
}

/**
 * Language switcher, shown only on a page whose manifest entry names
 * siblings (built from getLocaleManifest() -- groups with a single
 * published locale never get an entry). It links straight to each
 * sibling's real localised URL, never to a 404 or the homepage.
 */
function LocaleSwitcher({
  manifest,
  pathname,
}: {
  manifest: Record<string, LocaleSlugs>;
  pathname: string;
}) {
  const siblings = manifest[pathname];
  if (!siblings) return null;

  const isService = pathname.includes("/services/");
  const buildPath = isService ? servicePath : postPath;

  const locales = (Object.keys(siblings) as Locale[]).sort(
    (a, b) => ["en", "fr", "es"].indexOf(a) - ["en", "fr", "es"].indexOf(b),
  );

  return (
    <ul
      className="flex shrink-0 items-center gap-x-3 text-[.8rem] uppercase tracking-[.06em]"
      style={{ color: "var(--dim)" }}
    >
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
 * The button and the theme toggle are both items in the nav row now, so
 * neither can overlap the other and the nav needs no reserved gutter.
 *
 * The menu is a panel rather than a list of rows. On a phone it is the
 * one moment where someone has stopped reading and is deciding what to
 * do next, so it is built to answer that: the links in the display face
 * at a size worth tapping, then the call to action, then the contact
 * details, then the language switcher.
 *
 * Carrying the contact details matters more here than anywhere else.
 * Someone who wants to ring or mail while the page is still in front of
 * them should not have to load the contact page to find an address.
 */
export default function SiteNav({
  localeManifest,
}: {
  localeManifest: Record<string, LocaleSlugs>;
}) {
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

  // The page behind an open menu should not scroll under it. Restoring
  // the previous value rather than clearing the property leaves anything
  // else that sets overflow alone.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Each link closes the menu itself, which covers a tap. Closing on the
  // path as well covers the back button, where the menu would otherwise
  // still be sitting open over a page the reader did not ask for.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        borderColor: "var(--rule)",
        background: "color-mix(in oklab, var(--bg) 82%, transparent)",
      }}
    >
      <nav className="shell flex h-[62px] items-center justify-between gap-4 sm:gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 64 64"
            aria-hidden
            className="shrink-0"
          >
            <path
              d="M8 36 C 17 26, 25 26, 33 33 S 49 46, 56 31"
              fill="none"
              stroke="var(--berry)"
              strokeWidth="4.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="display text-[1.05rem] font-semibold tracking-tight">
            Mike Bastin
          </span>
        </Link>
        <ul
          className="hidden items-center gap-x-6 text-[.86rem] sm:flex"
          style={{ color: "var(--dim)" }}
        >
          {LINKS.map((l) => {
            const active =
              l.href !== "/#work" &&
              l.href !== "/#contact" &&
              pathname === l.href;
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

        {/* The two controls are one group, so `justify-between` spreads the
            logo against the pair rather than stranding the menu button in
            the middle of the row once the desktop links are hidden. */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mb-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full sm:hidden"
            style={{ color: "var(--berry)" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
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

          <ThemeToggle />
        </div>
      </nav>

      {open && (
        <div
          id="mb-mobile-menu"
          className="mb-menu border-t sm:hidden"
          style={{ borderColor: "var(--rule)", background: "var(--bg)" }}
        >
          <nav aria-label="Site" className="shell pt-3">
            <ul className="flex flex-col">
              {LINKS.map((l, i) => {
                const active =
                  l.href !== "/#work" &&
                  l.href !== "/#contact" &&
                  pathname === l.href;
                return (
                  <li
                    key={l.href}
                    className="mb-menu-row"
                    style={{ animationDelay: `${20 + i * 22}ms` }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="display flex items-center justify-between border-b py-4 text-[1.22rem] font-semibold leading-[1.2]"
                      style={{
                        borderColor: "var(--rule)",
                        color: active ? "var(--berry)" : "var(--ink)",
                      }}
                    >
                      {l.label}
                      {active ? (
                        <span
                          aria-hidden="true"
                          className="h-[6px] w-[6px] shrink-0 rounded-full"
                          style={{ background: "var(--berry)" }}
                        />
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          className="shrink-0 opacity-30"
                        >
                          <path
                            d="m9 5 7 7-7 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* The menu is the one place on a phone where someone has
              stopped reading and is deciding what to do next, so it ends
              with the thing the site is for rather than trailing off
              after the last link. */}
          <div
            className="mb-menu-row shell pt-6"
            style={{ animationDelay: `${20 + LINKS.length * 22}ms` }}
          >
            <Link
              href="/contact/"
              onClick={() => setOpen(false)}
              className="btn btn-primary btn-lg btn-full"
            >
              Book the discovery call
            </Link>
          </div>

          <div
            className="mb-menu-row shell flex flex-col gap-3 pb-7 pt-7"
            style={{ animationDelay: `${40 + LINKS.length * 22}ms` }}
          >
            <p className="eyebrow">Or reach us directly</p>
            <a
              href="mailto:hello@mikebastin.com"
              onClick={() => setOpen(false)}
              className="text-[1.02rem]"
              style={{ color: "var(--ink)" }}
            >
              hello@mikebastin.com
            </a>
            <a
              href="tel:+34671175774"
              onClick={() => setOpen(false)}
              className="text-[1.02rem]"
              style={{ color: "var(--ink)" }}
            >
              +34 671 17 57 74
            </a>
            <p className="text-[.88rem]" style={{ color: "var(--dim)" }}>
              Valencia, Spain, since 2016
            </p>

            {/* LocaleSwitcher renders nothing on a page with no published
                siblings, which is most of them. Asking the manifest here
                too keeps the rule and its spacing from being drawn round
                an empty element. */}
            {localeManifest[pathname ?? ""] && (
              <div
                className="mt-2 border-t pt-4"
                style={{ borderColor: "var(--rule)" }}
                onClickCapture={() => setOpen(false)}
              >
                <LocaleSwitcher
                  manifest={localeManifest}
                  pathname={pathname ?? ""}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
