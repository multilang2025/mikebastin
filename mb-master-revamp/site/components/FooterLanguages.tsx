"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocaleData } from "@/components/LocaleData";
import { localeHref, localeOfPath } from "@/lib/locale-href";
import type { Locale } from "@/lib/posts";

const LABEL: { locale: Locale; code: string; name: string }[] = [
  { locale: "en", code: "EN", name: "English" },
  { locale: "fr", code: "FR", name: "Français" },
  { locale: "es", code: "ES", name: "Español" },
];

const ARIA: Record<Locale, string> = { en: "Language versions", fr: "Versions linguistiques", es: "Versiones de idioma" };

/**
 * The language row at the foot of every page, as on valenciamove.com: EN,
 * FR and ES, always all three. The current language is marked and is not a
 * link; the others go to this page's sibling, or that language's homepage
 * when the page has none.
 */
export default function FooterLanguages() {
  const pathname = usePathname() ?? "/";
  const { localeManifest, pagePairs } = useLocaleData();
  const current = localeOfPath(pathname);
  return (
    <nav aria-label={ARIA[current]} className="flex items-center gap-x-4">
      {LABEL.map(({ locale, code, name }) =>
        locale === current ? (
          <span key={locale} aria-current="true" title={name} style={{ color: "var(--berry)" }} className="font-semibold">
            {code}
          </span>
        ) : (
          <Link key={locale} href={localeHref(pathname, localeManifest, pagePairs, locale)} hrefLang={locale} lang={locale} title={name} className="ulink">
            {code}
          </Link>
        ),
      )}
    </nav>
  );
}
