/**
 * Sets <html lang> for a FR/ES route before paint.
 *
 * The static export has one root layout (`app/layout.tsx`) shared by every
 * route, so it cannot vary `<html lang>` per segment the way a nested
 * layout normally would -- only the root layout may render `<html>`.
 * Splitting into per-locale root layouts (the pattern valenciamove.com
 * uses) would mean moving every existing route under a route group, which
 * touches files this PR is explicitly told not to touch (four open PRs
 * against app/page.tsx, app/services/page.tsx, app/results/page.tsx,
 * app/services/[slug]/page.tsx). This mirrors the theme flash-prevention
 * script already in app/layout.tsx: an inline, synchronous script,
 * rendered as early as possible in the page, so it runs before the rest
 * of the page paints rather than after hydration.
 */
export default function LocaleHtmlLang({ lang }: { lang: "fr" | "es" }) {
  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang=${JSON.stringify(lang)};`,
      }}
    />
  );
}
