/**
 * Cookie and storage consent (GDPR and ePrivacy). The site sets no
 * analytics, advertising or embed cookies today; this is the gate any of
 * them goes through when added. Nothing optional may run, load or write
 * until `hasConsent(category)` is true, and it is false until the visitor
 * chooses.
 *
 * The record itself is strictly necessary (it remembers the choice), so it
 * is written without asking. It lives in localStorage, never a cookie, and
 * expires after six months so the question is asked again.
 *
 *   necessary   always on: the choice record and the theme preference
 *   analytics   audience measurement
 *   media       embedded content from other sites (video, maps, social posts)
 *
 * To gate a script: `if (hasConsent("analytics")) load()`, and listen for
 * CONSENT_CHANGE to load it when the visitor agrees later, or to stop it
 * when they withdraw. docs/CONSENT.md has the full recipe.
 */
export type ConsentCategory = "analytics" | "media";

export type Consent = { v: 1; at: number; analytics: boolean; media: boolean };

export const CONSENT_KEY = "mb-consent";
export const CONSENT_CHANGE = "mb:consent";
export const CONSENT_OPEN = "mb:consent-open";
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== 1 || typeof c.at !== "number" || Date.now() - c.at > MAX_AGE_MS) return null;
    return { v: 1, at: c.at, analytics: c.analytics === true, media: c.media === true };
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; media: boolean }): Consent {
  const c: Consent = { v: 1, at: Date.now(), analytics: choice.analytics, media: choice.media };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* storage blocked: the choice still applies for this page view */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE, { detail: c }));
  return c;
}

export function hasConsent(category: ConsentCategory): boolean {
  return readConsent()?.[category] === true;
}

/** Reopen the banner on its preferences panel (the footer's "Cookie settings"). */
export function openConsent() {
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN));
}
