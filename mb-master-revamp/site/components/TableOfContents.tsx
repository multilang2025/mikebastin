import type { TocItem } from "@/lib/toc";
import TocSpy from "@/components/TocSpy";

/**
 * "On this page" outline for a blog post, built from that post's own h2/h3
 * tags (lib/toc.ts). The caller decides when there is enough of an outline
 * to bother showing (see app/blog/[slug]/page.tsx).
 *
 * Two renderings of one list. `inline` is a native <details> above the
 * body, for phones and tablets, where there is no room beside the text.
 * `rail` sits in the empty column beside the body on desktop and stays in
 * view while the reader scrolls, which is what makes a 3,000 word post
 * navigable. Both are plain links and work with JS off; TocSpy only adds
 * the current-section highlight on top.
 */
function Links({ items }: { items: TocItem[] }) {
  return (
    <ol className="flex flex-col gap-2 text-[.95rem]">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ml-5" : undefined}>
          <a
            href={`#${item.id}`}
            data-toc-link={item.id}
            className="toc-link ulink"
            style={{ color: item.level === 3 ? "var(--dim)" : undefined }}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function TableOfContents({
  items,
  variant = "inline",
}: {
  items: TocItem[];
  variant?: "inline" | "rail";
}) {
  if (variant === "rail") {
    return (
      <nav aria-label="On this page" className="toc-rail">
        <p className="mb-4 text-[.78rem] font-semibold uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
          On this page
        </p>
        <Links items={items} />
        <TocSpy ids={items.map((i) => i.id)} />
      </nav>
    );
  }
  return (
    <details
      className="mb-10 max-w-[68ch] rounded-[4px] border px-6 py-4 open:pb-5"
      style={{ borderColor: "var(--rule)" }}
      open
    >
      <summary className="cursor-pointer select-none text-[.9rem] font-semibold uppercase tracking-[.08em]" style={{ color: "var(--dim)" }}>
        On this page
      </summary>
      <nav aria-label="Table of contents" className="mt-4">
        <Links items={items} />
      </nav>
    </details>
  );
}
