"use client";

import { useEffect } from "react";
import { CONSENT_CHANGE, hasConsent } from "@/lib/consent";

/**
 * GA4, Microsoft Clarity and Ahrefs Web Analytics, loaded only after the
 * visitor allows analytics in the consent banner (owner, 2 Oct 2026: the
 * three tools the legacy site already ran; IDs read from its live HTML).
 *
 * Two gates, both required:
 *   - consent: nothing loads, sets a cookie or sends a hit before
 *     hasConsent("analytics"), and the CONSENT_CHANGE listener loads them the
 *     moment the visitor agrees later;
 *   - host: only on the production domain, so preview.mikebastin.com and
 *     localhost never send traffic into the live properties.
 *
 * Withdrawing reloads the page, which drops the loaded scripts; the gate then
 * keeps them out. docs/CONSENT.md has the recipe this follows.
 */
const GA4_ID = "G-8TSFDZTWL3";
const CLARITY_ID = "r517do2v6j";
const AHREFS_KEY = "3n7c9KyXlST2/alHOvSIgw";
const PRODUCTION_HOSTS = ["mikebastin.com", "www.mikebastin.com"];

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  __mbAnalytics?: boolean;
};

function addScript(src: string, attrs: Record<string, string> = {}) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

function load() {
  const w = window as Win;
  if (w.__mbAnalytics) return;
  w.__mbAnalytics = true;

  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag reads `arguments`, not a spread array.
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA4_ID, { anonymize_ip: true });
  addScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);

  if (!w.clarity) {
    const queue: unknown[] = [];
    w.clarity = Object.assign((...args: unknown[]) => void queue.push(args), { q: queue });
  }
  addScript(`https://www.clarity.ms/tag/${CLARITY_ID}`);

  addScript("https://analytics.ahrefs.com/analytics.js", { "data-key": AHREFS_KEY });
}

export default function Analytics() {
  useEffect(() => {
    if (!PRODUCTION_HOSTS.includes(window.location.hostname)) return;
    if (hasConsent("analytics")) load();
    const onChange = () => {
      if (hasConsent("analytics")) load();
      else if ((window as Win).__mbAnalytics) window.location.reload();
    };
    window.addEventListener(CONSENT_CHANGE, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE, onChange);
  }, []);
  return null;
}
