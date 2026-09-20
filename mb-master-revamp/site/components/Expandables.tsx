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
      {items.map((item, i) => (
        <details
          key={item.q}
          className="band group px-7 py-6"
          style={{ background: "var(--bg)" }}
        >
          <summary className="flex cursor-pointer list-none items-baseline gap-4">
            <span
              className="display shrink-0 text-[.9rem] font-semibold tabular-nums"
              style={{ color: "var(--berry)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[1.02rem] font-semibold leading-[1.35]">
              {item.q}
            </span>
            <span
              aria-hidden="true"
              className="ml-auto shrink-0 pt-[.35em] text-[.8rem] transition-transform duration-300 group-open:rotate-45"
              style={{ color: "var(--berry)" }}
            >
              +
            </span>
          </summary>
          <div className="mt-4 max-w-[64ch] space-y-3 pl-[calc(.9rem+1rem)]">
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
