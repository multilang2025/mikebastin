"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONSENT_OPEN, readConsent, writeConsent } from "@/lib/consent";
import { localeOfPath } from "@/lib/locale-href";
import type { Locale } from "@/lib/posts";


const T: Record<
  Locale,
  {
    title: string;
    text: string;
    accept: string;
    reject: string;
    choose: string;
    save: string;
    privacy: string;
    privacyHref: string;
    necessary: string;
    necessaryText: string;
    analytics: string;
    analyticsText: string;
    media: string;
    mediaText: string;
    always: string;
  }
> = {
  en: {
    title: "Cookies and privacy",
    text: "We keep a small record in your browser of your choices and your theme. Anything beyond that, such as audience measurement or embedded content, stays off until you allow it.",
    accept: "Accept all",
    reject: "Reject all",
    choose: "Choose",
    save: "Save choices",
    privacy: "Privacy and cookies",
    privacyHref: "/privacy/",
    necessary: "Necessary",
    necessaryText: "Remembers your choices and your light or dark theme.",
    analytics: "Analytics",
    analyticsText: "Shows us which pages help, so we can improve them.",
    media: "Embedded content",
    mediaText: "Videos, maps and social posts from other sites.",
    always: "Always on",
  },
  fr: {
    title: "Cookies et confidentialité",
    text: `Nous conservons dans votre navigateur un petit enregistrement de vos choix et de votre mode d’affichage. Tout le reste, comme la mesure d’audience ou les contenus intégrés, reste désactivé tant que vous ne l’autorisez pas.`,
    accept: "Tout accepter",
    reject: "Tout refuser",
    choose: "Personnaliser",
    save: "Enregistrer mes choix",
    privacy: "Confidentialité et cookies",
    privacyHref: "/fr/confidentialite/",
    necessary: "Nécessaires",
    necessaryText: "Mémorisent vos choix et votre mode d’affichage clair ou sombre.",
    analytics: "Mesure d’audience",
    analyticsText: "Nous montre quelles pages sont utiles, pour les améliorer.",
    media: "Contenus intégrés",
    mediaText: "Vidéos, cartes et publications de réseaux sociaux d’autres sites.",
    always: "Toujours actifs",
  },
  es: {
    title: "Cookies y privacidad",
    text: "Guardamos en tu navegador un pequeño registro de tus decisiones y de tu tema. Todo lo demás, como la analítica o los contenidos incrustados, sigue desactivado hasta que lo permitas.",
    accept: "Aceptar todo",
    reject: "Rechazar todo",
    choose: "Configurar",
    save: "Guardar mis decisiones",
    privacy: "Privacidad y cookies",
    privacyHref: "/es/privacidad/",
    necessary: "Necesarias",
    necessaryText: "Recuerdan tus decisiones y tu tema claro u oscuro.",
    analytics: "Analítica",
    analyticsText: "Nos muestra qué páginas ayudan, para mejorarlas.",
    media: "Contenido incrustado",
    mediaText: "Vídeos, mapas y publicaciones de redes sociales de otros sitios.",
    always: "Siempre activas",
  },
};

/**
 * The consent banner (GDPR and ePrivacy). Accept all and Reject all carry
 * the same weight, nothing optional is on before the visitor chooses, and
 * the footer's "Cookie settings" reopens this panel so withdrawing is as
 * easy as agreeing. It does not take focus on first load; it does when the
 * visitor asks for it. The rules for what it gates are in lib/consent.ts.
 */
export default function CookieConsent() {
  const pathname = usePathname() ?? "/";
  const t = T[localeOfPath(pathname)];
  // Open in the static HTML, so the banner paints with the page instead of
  // after hydration, where it became the LCP element on mobile (CWV audit,
  // 3 Oct 2026). A visitor who already chose never sees it: the pre-paint
  // script in app/layout.tsx sets html.mb-consented, which hides it in CSS
  // before the first paint, and the effect below then unmounts it.
  const [open, setOpen] = useState(true);
  const [panel, setPanel] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [media, setMedia] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const asked = useRef(false);

  useEffect(() => {
    if (readConsent()) setOpen(false);
    const reopen = () => {
      document.documentElement.classList.remove("mb-consented");
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setMedia(c?.media ?? false);
      setPanel(true);
      setOpen(true);
      asked.current = true;
    };
    window.addEventListener(CONSENT_OPEN, reopen);
    return () => window.removeEventListener(CONSENT_OPEN, reopen);
  }, []);

  useEffect(() => {
    if (open && asked.current) box.current?.focus();
  }, [open, panel]);

  const decide = (a: boolean, m: boolean) => {
    writeConsent({ analytics: a, media: m });
    setAnalytics(a);
    setMedia(m);
    setOpen(false);
    setPanel(false);
    asked.current = false;
  };

  if (!open) return null;

  return (
    <div className="mb-consent pointer-events-none fixed inset-x-0 bottom-0 z-[90] p-3 sm:p-4" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}>
      <div
        ref={box}
        role="dialog"
        aria-modal="false"
        aria-labelledby="mb-consent-title"
        aria-describedby="mb-consent-text"
        tabIndex={-1}
        className="pointer-events-auto max-h-[85vh] w-full overflow-y-auto rounded-[10px] border p-5 shadow-[0_12px_40px_rgba(0,0,0,.28)] outline-none sm:max-w-[560px]"
        style={{ background: "var(--bg)", color: "var(--ink)", borderColor: "var(--rule)" }}
      >
        <h2 id="mb-consent-title" className="mb-2 text-[1.1rem] font-semibold leading-[1.25]">
          {t.title}
        </h2>
        <p id="mb-consent-text" className="mb-4 text-[.92rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
          {t.text}{" "}
          <Link href={t.privacyHref} className="ulink">
            {t.privacy}
          </Link>
        </p>

        {panel && (
          <ul className="mb-4 flex flex-col gap-3 border-t pt-4" style={{ borderColor: "var(--rule)" }}>
            <li className="flex items-start gap-3">
              <input id="mb-c-necessary" type="checkbox" checked disabled className="mt-1 h-4 w-4 shrink-0" style={{ accentColor: "var(--berry)" }} />
              <label htmlFor="mb-c-necessary" className="text-[.88rem] leading-[1.45]">
                <span className="font-semibold">{t.necessary}</span> <span style={{ color: "var(--dim)" }}>({t.always})</span>
                <span className="block" style={{ color: "var(--dim)" }}>
                  {t.necessaryText}
                </span>
              </label>
            </li>
            <li className="flex items-start gap-3">
              <input id="mb-c-analytics" type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" style={{ accentColor: "var(--berry)" }} />
              <label htmlFor="mb-c-analytics" className="text-[.88rem] leading-[1.45]">
                <span className="font-semibold">{t.analytics}</span>
                <span className="block" style={{ color: "var(--dim)" }}>
                  {t.analyticsText}
                </span>
              </label>
            </li>
            <li className="flex items-start gap-3">
              <input id="mb-c-media" type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} className="mt-1 h-4 w-4 shrink-0" style={{ accentColor: "var(--berry)" }} />
              <label htmlFor="mb-c-media" className="text-[.88rem] leading-[1.45]">
                <span className="font-semibold">{t.media}</span>
                <span className="block" style={{ color: "var(--dim)" }}>
                  {t.mediaText}
                </span>
              </label>
            </li>
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => decide(true, true)}>
            {t.accept}
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => decide(false, false)}>
            {t.reject}
          </button>
          {panel ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => decide(analytics, media)}>
              {t.save}
            </button>
          ) : (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPanel(true)} aria-expanded={false}>
              {t.choose}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
