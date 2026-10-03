"use client";

import { useEffect, useState } from "react";

const UI = {
  en: { label: "Share", via: "Share on", email: "Share by email", copy: "Copy link", copied: "Link copied", more: "More options" },
  fr: { label: "Partager", via: "Partager sur", email: "Partager par e-mail", copy: "Copier le lien", copied: "Lien copié", more: "Plus d’options" },
  es: { label: "Compartir", via: "Compartir en", email: "Compartir por correo", copy: "Copiar el enlace", copied: "Enlace copiado", more: "Más opciones" },
} as const;

const ICON: Record<string, React.ReactNode> = {
  email: <path d="M4 7h16v10H4zM4 7l8 6 8-6" />,
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
  share: <path d="M12 4v11M8 8l4-4 4 4M5 13v6h14v-6" />,
};

function Icon({ name }: { name: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICON[name]}
    </svg>
  );
}

/**
 * Share buttons for an article: plain share URLs for LinkedIn, X, Facebook,
 * WhatsApp and email, a copy-link button, and the phone's own share sheet
 * where the browser offers one. No third-party script or iframe loads, so
 * nothing here needs cookie consent and nothing slows the page.
 */
export default function ShareLinks({
  url,
  title,
  locale = "en",
}: {
  url: string;
  title: string;
  locale?: "en" | "fr" | "es";
}) {
  const t = UI[locale];
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator !== "undefined" && "share" in navigator), []);

  const u = encodeURIComponent(url);
  const ti = encodeURIComponent(title);
  const links = [
    { key: "linkedin", name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { key: "x", name: "X", href: `https://x.com/intent/post?url=${u}&text=${ti}&via=mikebastin` },
    { key: "facebook", name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { key: "whatsapp", name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ];

  const btn =
    "grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 hover:bg-[var(--berry-soft)]";
  const style = { borderColor: "var(--rule)", color: "var(--berry)" };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-[.78rem] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
        {t.label}
      </span>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.via} ${l.name}`}
          className="inline-flex h-10 items-center rounded-full border px-4 text-[.85rem] font-medium transition-colors duration-200 hover:bg-[var(--berry-soft)]"
          style={style}
        >
          {l.name}
        </a>
      ))}
      <a href={`mailto:?subject=${ti}&body=${u}`} aria-label={t.email} title={t.email} className={btn} style={style}>
        <Icon name="email" />
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
        aria-label={t.copy}
        title={t.copy}
        className={btn}
        style={style}
      >
        <Icon name="copy" />
      </button>
      {canShare && (
        <button
          type="button"
          onClick={() => navigator.share({ title, url }).catch(() => {})}
          aria-label={t.more}
          title={t.more}
          className={btn}
          style={style}
        >
          <Icon name="share" />
        </button>
      )}
      <span role="status" aria-live="polite" className="ml-1 text-[.82rem]" style={{ color: "var(--dim)" }}>
        {copied ? t.copied : ""}
      </span>
    </div>
  );
}
