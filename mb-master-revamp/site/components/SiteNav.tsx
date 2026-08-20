"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/services/lead-generation/", label: "Services" },
  { href: "/results/", label: "Results" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{ borderColor: "var(--rule)", background: "color-mix(in oklab, var(--bg) 82%, transparent)" }}
    >
      <nav className="shell flex h-[62px] items-center justify-between gap-6 pr-[64px] sm:pr-[70px]">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden className="shrink-0">
            <path
              d="M8 30 C 17 20, 25 20, 33 27 S 49 40, 56 25"
              fill="none" stroke="var(--gold)" strokeWidth="4.4" strokeLinecap="round"
            />
            <path
              d="M8 44 C 18 35, 26 35, 34 41 S 49 51, 56 40"
              fill="none" stroke="var(--silver)" strokeWidth="3.4" strokeLinecap="round" opacity=".85"
            />
          </svg>
          <span className="display text-[1.05rem] font-semibold tracking-tight">Mike Bastin</span>
        </Link>
        <ul className="flex items-center gap-x-6 gap-y-1 overflow-x-auto text-[.86rem]" style={{ color: "var(--dim)" }}>
          {LINKS.map((l) => {
            const active = l.href !== "/#work" && l.href !== "/#contact" && pathname === l.href;
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
      </nav>
    </header>
  );
}
