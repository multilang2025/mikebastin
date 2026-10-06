/**
 * A review at a uniform length (owner, 6 Oct 2026: "Reviews should have the
 * same length, if longer, show remaining text as infotip when hovering the
 * ellipsis"). Text up to `limit` characters shows whole; a longer review is
 * cut at the last word before the limit, and the ellipsis carries the rest
 * as a tooltip on hover and on keyboard or touch focus. The quote stays
 * verbatim: nothing is dropped, the rest is one hover away, and screen
 * readers get the whole review in reading order.
 *
 * The tooltip is positioned against the nearest `.review-q` ancestor (see
 * globals.css), so it spans the card instead of running off a narrow screen.
 */
export const REVIEW_LIMIT = 200;

export default function ReviewText({ text, limit = REVIEW_LIMIT }: { text: string; limit?: number }) {
  if (text.length <= limit) return <>{text}</>;
  const space = text.lastIndexOf(" ", limit);
  const at = space > limit * 0.6 ? space : limit;
  const shown = text.slice(0, at).trimEnd().replace(/[,;:.\-]+$/, "");
  const rest = text.slice(at).trim();
  return (
    <>
      {shown}
      <span className="review-more" tabIndex={0} role="note" aria-label="The rest of the review">
        …
        <span className="review-more-tip" aria-hidden="true">
          …{rest}
        </span>
      </span>
      <span className="sr-only"> {rest}</span>
    </>
  );
}
