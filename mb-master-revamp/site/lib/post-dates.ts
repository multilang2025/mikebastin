/**
 * How a post's dates read, in every language (owner, 15 Oct 2026: "Blog
 * post need to show the date when they were edited"). `modified` is the
 * last edit from git (lib/last-edited.ts). Plain functions with no Node
 * imports, so any component can format a date with them.
 */
type Locale = "en" | "fr" | "es";

const LANG = { en: "en-GB", fr: "fr-FR", es: "es-ES" } as const;
const UPDATED = { en: "Updated", fr: "Mis à jour le", es: "Actualizado el" } as const;

export function formatPostDate(iso: string, locale: Locale = "en") {
  return new Date(iso).toLocaleDateString(LANG[locale], { day: "numeric", month: "long", year: "numeric" });
}

/** The edit date, when it falls on a later day than publication. */
function edited(post: { date: string; modified?: string }) {
  return post.modified && post.modified.slice(0, 10) > post.date.slice(0, 10) ? post.modified : null;
}

/** One line for a card: the last edit when there is one, else the publication date. */
export function cardDate(post: { date: string; modified?: string }, locale: Locale = "en") {
  const e = edited(post);
  return e ? `${UPDATED[locale]} ${formatPostDate(e, locale)}` : formatPostDate(post.date, locale);
}

/** The edit line under a post's byline, or null when it was never edited after publication. */
export function updatedLine(post: { date: string; modified?: string }, locale: Locale = "en") {
  const e = edited(post);
  return e ? `${UPDATED[locale]} ${formatPostDate(e, locale)}` : null;
}
