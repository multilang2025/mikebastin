"use client";

import { Children, useState, type ReactNode } from "react";

/**
 * A journal card grid that shows the first `limit` cards and keeps the rest
 * behind a Load more button. The hidden cards are still in the exported HTML
 * (display none, not left out), so crawlers and the in-page outline see every
 * post and only the first screen of a long topic is visible. Cards past the
 * limit come back in one go.
 */
export default function PostGridMore({
  limit,
  className,
  label = "Load more posts",
  children,
}: {
  limit: number;
  className: string;
  label?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const items = Children.toArray(children);
  const more = items.length > limit;

  return (
    <>
      <ul className={className}>
        {items.map((child, i) => (
          <div key={i} className={!open && i >= limit ? "hidden" : "contents"}>
            {child}
          </div>
        ))}
      </ul>
      {more && !open && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-secondary"
          >
            {label}
          </button>
        </div>
      )}
    </>
  );
}
