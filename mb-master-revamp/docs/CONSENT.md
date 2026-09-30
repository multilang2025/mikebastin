# Consent banner, language row and privacy pages (owner, 30 Sep 2026)

"Add a bottom language switcher like on valenciamove.com. Add GDPR banner."

## Footer language row
`components/FooterLanguages.tsx`, in the sign-off line of every footer: EN, FR
and ES, always all three, as on valenciamove.com ("Language versions"). The
current language is marked and is not a link. The others go to this page's
sibling, read from the same manifests the header switcher uses
(`components/LocaleData.tsx`, provided once by the root layout), or to that
language's homepage when the page has none (`lib/locale-href.ts`).

## Consent banner
`components/CookieConsent.tsx` (EN, FR, ES), mounted in the root layout.
- Accept all and Reject all carry the same weight; "Choose" opens
  Necessary (always on), Analytics and Embedded content, all off by default.
- The choice is stored in `localStorage` (`mb-consent`), expires after six
  months, and the footer's "Cookie settings" reopens the panel, so
  withdrawing is as easy as agreeing.
- It does not take focus on first load; it does when the visitor opens it.

## What it gates
Nothing optional runs today: the site sets no analytics, advertising or embed
cookies. Anything added later goes through `lib/consent.ts`:

```ts
import { hasConsent, CONSENT_CHANGE } from "@/lib/consent";
if (hasConsent("analytics")) loadAnalytics();
window.addEventListener(CONSENT_CHANGE, () => { /* load or stop */ });
```

Categories are `analytics` and `media` (embedded content from other sites,
such as X posts or maps). Load third-party scripts only after consent.

## Privacy and cookies pages
`/privacy/`, `/fr/confidentialite/`, `/es/privacidad/`
(`lib/privacy-copy.ts`, `components/PrivacyPage.tsx`), linked from the banner,
the footer and the contact forms. A draft that says only what the repo shows:
the contact form (`public/contact.php`), the two items kept in the browser
(`mb-theme`, `mb-consent`) and no analytics. The legal entity, the retention
period, the hosting provider and the analytics plan need the owner
(`docs/OPEN-ITEMS.md` Q25).

## English pages show English reviews
`components/ServiceProof.tsx` now draws from the English reviews only (owner,
30 Sep 2026: "Remove French reviews text on EN pages"). French, Dutch and
Spanish reviews stay on the pages in their own language.
