"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { localeOfPath } from "@/lib/locale-href";

const LABEL = { en: "Back to top", fr: "Haut de page", es: "Volver arriba" } as const;

/**
 * A floating arrow that returns to the top once the page has scrolled
 * past the first screen (owner, 30 Sep 2026: "Add Top arrow"). It sits
 * bottom right, clear of the consent banner (which it yields to while
 * open), and honours reduced motion.
 */
export default function BackToTop() {
  const pathname = usePathname() ?? "/";
  const label = LABEL[localeOfPath(pathname)];
  const [show, setShow] = useState(false);
  const [banner, setBanner] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const seen = () => setBanner(Boolean(document.getElementById("mb-consent-title")));
    const mo = new MutationObserver(seen);
    mo.observe(document.body, { childList: true, subtree: true });
    seen();
    return () => {
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
    };
  }, []);

  if (!show || banner) return null;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className="fixed right-4 z-[80] grid h-11 w-11 place-items-center rounded-full border shadow-[0_6px_20px_rgba(0,0,0,.25)] transition-colors"
      style={{ bottom: "max(16px, calc(env(safe-area-inset-bottom, 0px) + 16px))", background: "var(--bg)", color: "var(--berry)", borderColor: "var(--rule)" }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
