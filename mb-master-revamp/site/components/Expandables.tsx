import type { CSSProperties } from "react";

/**
 * Collapsible detail, for material that belongs on a page without lengthening
 * it. Used to fold an absorbed article into the service page that now owns its
 * query, so the page keeps the depth and loses the scroll.
 *
 * Native <details>/<summary>, deliberately. It needs no JavaScript, so the
 * content is in the static HTML and readable if a bundle never arrives, which
 * is the same rule the scroll reveal follows (components/Reveal.tsx). Crawlers
 * and AI answer engines read closed <details> content, which matters here
 * because the absorbed article was ranking on its own.
 */
export default function Expandables({
  items,
}: {
  items: { q: string; a: string[] }[];
}) {
  return (
    <div className="grid gap-px" style={{ background: "var(--rule)" }}>
      {items.map((item) => (
        <details key={item.q} className="band faq-item group px-7 py-6">
          <summary className="flex cursor-pointer list-none items-center gap-4">
            {/* A question mark in a round chip, in place of the 01, 02, 03
                numbering (owner, 7 Oct 2026). */}
            <span
              aria-hidden="true"
              className="faq-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.1 9a3 3 0 1 1 4.4 2.6c-.9.5-1.5 1.1-1.5 2.2" />
                <path d="M12 17.5h.01" />
              </svg>
            </span>
            <span className="text-[1.02rem] font-semibold leading-[1.35]">
              {item.q}
            </span>
            <span
              aria-hidden="true"
              className="ml-auto shrink-0 text-[1rem] leading-none transition-transform duration-300 group-open:rotate-45"
              style={{ color: "var(--berry)" }}
            >
              +
            </span>
          </summary>
          <div className="mt-4 max-w-[64ch] space-y-3 pl-[calc(1.75rem+1rem)]">
            {item.a.map((p, j) => (
              <p
                key={j}
                className="text-[.97rem] leading-[1.65]"
                style={{ color: "var(--dim)" as CSSProperties["color"] }}
              >
                {p}
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
