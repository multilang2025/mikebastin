import { Fragment } from "react";

/**
 * Prose containing `backticked` search terms.
 *
 * The backtick is a house convention, not decoration: `copy-lint-code.mjs`
 * exempts backticked spans from the copy lints because a search query is
 * quoted verbatim and must not be corrected into house style. `seo france`
 * is lower case and ungrammatical on purpose, because that is what people
 * type.
 *
 * The convention had no renderer, so five service pages printed the
 * backticks to the reader: "Largest of the six. `seo france` alone pays".
 * Markdown does not run in these strings, they are plain text in JSX.
 *
 * Setting the term apart is worth more than merely hiding the character.
 * A reader meeting a lower-case fragment mid-sentence needs to see it is a
 * quoted query rather than a typo, so it gets the chip treatment the rest
 * of the site already uses for metadata.
 */
export default function QueryTerms({ text }: { text: string }) {
  // Odd indices are the backticked spans. An unmatched trailing backtick
  // leaves its text in an even slot, so it renders as ordinary prose
  // instead of swallowing the rest of the sentence.
  const parts = text.split("`");

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className="rounded-[3px] px-[5px] py-[1px] text-[.92em]"
            style={{ background: "var(--chip)", color: "var(--ink)" }}
          >
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
