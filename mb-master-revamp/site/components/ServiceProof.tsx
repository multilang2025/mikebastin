import { TESTIMONIALS, GBP_URL, type Testimonial } from "@/lib/testimonials";

/**
 * One review, on a service page.
 *
 * Measured on 20 September 2026: 18 of the 19 service pages carried no
 * proof of any kind, while ten Google reviews sat in lib/testimonials.ts
 * used only on the homepage, /results/ and the one hand-built service
 * page. A service page with no proof asks to be taken on trust by
 * somebody who has never heard of us, which is the hardest thing any page
 * here has to do and the cheapest to fix.
 *
 * Training reviews are excluded on purpose. Four of the ten are about SEO
 * training, which is a real thing we did and not what a service page is
 * selling, so quoting one under "Website localization" would imply we
 * delivered localization for that person. Only `delivery` and `expertise`
 * appear here.
 *
 * The pick is a hash of the slug rather than the first match, so the six
 * eligible reviews spread across the nineteen pages instead of one voice
 * speaking on all of them. It is stable across builds.
 *
 * No Review or AggregateRating schema, per the warning in
 * lib/testimonials.ts: Google excludes reviews collected elsewhere and
 * self-serving ratings about the host entity, and marking these up would
 * risk a manual action. The value here is the reader believing us.
 */

const ELIGIBLE: Testimonial[] = TESTIMONIALS.filter(
  (t) => t.theme === "delivery" || t.theme === "expertise"
);

/** First name plus last initial, matching components/Testimonials.tsx. */
function displayName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return full;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

function pick(slug: string): Testimonial | undefined {
  if (ELIGIBLE.length === 0) return undefined;
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return ELIGIBLE[hash % ELIGIBLE.length];
}

export default function ServiceProof({ slug }: { slug: string }) {
  const t = pick(slug);
  if (!t) return null;

  // A review written in Dutch is shown in Dutch first, with the English
  // underneath. Showing only the translation would hide that the person
  // is a real client in a real market, which is most of the point.
  return (
    <figure
      className="flex max-w-[62ch] flex-col gap-4 rounded-[4px] border p-7"
      style={{ borderColor: "var(--rule)", background: "var(--shade)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex gap-[2px]" aria-label="Five out of five">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 24 24" aria-hidden style={{ fill: "var(--berry)" }}>
              <path d="M12 2.5l2.9 6.06 6.6.86-4.83 4.6 1.22 6.55L12 17.5l-5.89 3.07 1.22-6.55L2.5 9.42l6.6-.86z" />
            </svg>
          ))}
        </span>
        <span
          className="rounded-[3px] px-2 py-[2px] text-[.66rem] uppercase tracking-[.1em]"
          style={{ background: "var(--chip)", color: "var(--dim)" }}
        >
          {t.langLabel}
        </span>
      </div>

      <blockquote lang={t.lang} className="text-[.97rem] leading-[1.6]" style={{ color: "var(--ink)" }}>
        {t.quote}
      </blockquote>

      {t.english && (
        <p className="text-[.9rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
          {t.english}
        </p>
      )}

      {/* `when` reads "One year ago", capitalised for standalone use, so it
          is given its own element rather than dropped mid-sentence where
          the capital would break sentence case. The dot separator is the
          same one the nav and post bylines use. */}
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[.84rem]" style={{ color: "var(--dim)" }}>
        <span>
          {displayName(t.name)}, on{" "}
          <a href={GBP_URL} className="ulink" target="_blank" rel="noopener noreferrer">
            Google
          </a>
        </span>
        <i aria-hidden="true" className="block h-[3px] w-[3px] rounded-full" style={{ background: "var(--berry)" }} />
        <span>{t.when}</span>
      </figcaption>
    </figure>
  );
}
