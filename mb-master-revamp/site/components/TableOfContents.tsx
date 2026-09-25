import type { TocItem } from "@/lib/toc";

/**
 * "On this page" outline for a blog post, built from that post's own h2/h3
 * tags (lib/toc.ts). A native <details> disclosure, open by default: no
 * scroll-spy, no client JS, so it costs nothing if a reader never touches
 * it and still works with JS off. The caller decides when there is enough
 * of an outline to bother showing (see app/blog/[slug]/page.tsx).
 */
export default function TableOfContents({ items }: { items: TocItem[] }) {
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
        <ol className="flex flex-col gap-2 text-[.95rem]">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? "ml-5" : undefined}>
              <a href={`#${item.id}`} className="ulink" style={{ color: item.level === 3 ? "var(--dim)" : undefined }}>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
