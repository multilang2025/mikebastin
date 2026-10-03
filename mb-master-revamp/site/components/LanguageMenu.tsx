"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLocaleData } from "@/components/LocaleData";
import { localeHref, localeOfPath } from "@/lib/locale-href";
import type { Locale } from "@/lib/posts";

const OPTIONS: { locale: Locale; code: string; name: string }[] = [
  { locale: "en", code: "EN", name: "English" },
  { locale: "fr", code: "FR", name: "Français" },
  { locale: "es", code: "ES", name: "Español" },
];

const LABEL: Record<Locale, string> = { en: "Language", fr: "Langue", es: "Idioma" };

/**
 * The language menu in the header, as on valenciamove.com: a globe button
 * that opens a short list, on every page and at every width. EN, FR and ES
 * are always all listed; the current one is marked and the others go to this
 * page's sibling, or that language's homepage when the page has none (the
 * same rule as the footer row, through localeHref).
 */
export default function LanguageMenu() {
  const pathname = usePathname() ?? "/";
  const { localeManifest, pagePairs } = useLocaleData();
  const current = localeOfPath(pathname);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = LABEL[current];

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        title={label}
        className="flex h-10 min-w-10 shrink-0 items-center justify-center gap-1 rounded-full px-2.5 transition-colors duration-200"
        style={{ color: "var(--berry)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
          <path d="M3 12h18M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
        <span className="hidden text-[.8rem] font-semibold tracking-[.04em] sm:inline">{OPTIONS.find((o) => o.locale === current)!.code}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className="hidden sm:block" style={{ opacity: 0.7 }}>
          <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="menu"
          aria-label={label}
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[10.5rem] overflow-hidden rounded-[6px] border py-1 shadow-lg"
          style={{ background: "var(--bg)", borderColor: "var(--rule)" }}
        >
          {OPTIONS.map(({ locale, code, name }) => {
            const active = locale === current;
            return (
              <li key={locale} role="none">
                {active ? (
                  <span
                    role="menuitem"
                    aria-current="true"
                    className="flex items-center justify-between gap-6 px-4 py-2.5 text-[.95rem] font-semibold"
                    style={{ color: "var(--berry)" }}
                  >
                    {name}
                    <span className="text-[.75rem] tracking-[.06em]">{code}</span>
                  </span>
                ) : (
                  <Link
                    role="menuitem"
                    href={localeHref(pathname, localeManifest, pagePairs, locale)}
                    hrefLang={locale}
                    lang={locale}
                    className="flex items-center justify-between gap-6 px-4 py-2.5 text-[.95rem] transition-colors duration-150 hover:bg-[var(--berry-soft)]"
                    style={{ color: "var(--ink)" }}
                  >
                    {name}
                    <span className="text-[.75rem] tracking-[.06em]" style={{ color: "var(--dim)" }}>
                      {code}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
