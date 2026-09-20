/**
 * One line-drawn mark per service, for the cards on /services/.
 *
 * Inline SVG rather than an icon package or a set of image files: the
 * whole set is a few hundred bytes in the HTML, it needs no request, it
 * inherits `currentColor` so it works in both themes without a second
 * asset, and there is no dependency to keep current.
 *
 * Every mark is built from the same vocabulary as the site's own wave
 * rule: a 24-unit box, round caps and joins, 1.5 stroke, no fill. The six
 * language services carry their market's code, which is the one case
 * where a letterform reads faster than a glyph.
 *
 * Decorative, so `aria-hidden`: each card already carries the service
 * name as text, and a screen reader announcing a mark that repeats the
 * heading next to it is noise.
 */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Market code marks: a rounded tile with the two letters inside. */
function Code({ code }: { code: string }) {
  return (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" {...S} />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="7.5"
        fontWeight="600"
        fill="currentColor"
        stroke="none"
      >
        {code}
      </text>
    </>
  );
}

const MARKS: Record<string, React.ReactNode> = {
  // ---- Lead generation ----
  /** A funnel narrowing to a single drop: many visitors, one enquiry. */
  "lead-generation": (
    <>
      <path d="M3 4.5h18l-7 8v7l-4 2.5v-9.5z" {...S} />
    </>
  ),
  /** A bid arriving on target. */
  "multilingual-sem": (
    <>
      <circle cx="11" cy="13" r="7.5" {...S} />
      <circle cx="11" cy="13" r="3" {...S} />
      <path d="M16.5 7.5 21 3M17.5 3h3.5v3.5" {...S} />
    </>
  ),
  /** A measured climb, with the point where it was counted. */
  "conversion-tracking": (
    <>
      <path d="M3 20h18" {...S} />
      <path d="M4.5 16.5 9 11l3.5 3L20 5.5" {...S} />
      <circle cx="20" cy="5.5" r="1.8" {...S} />
    </>
  ),

  // ---- Search ----
  /** One entity, several languages: a globe read on its meridians. */
  "multilingual-seo": (
    <>
      <circle cx="12" cy="12" r="8.5" {...S} />
      <path d="M12 3.5c3 2.8 3 14.2 0 17M12 3.5c-3 2.8-3 14.2 0 17" {...S} />
      <path d="M3.9 9h16.2M3.9 15h16.2" {...S} />
    </>
  ),
  "french-seo": <Code code="FR" />,
  "german-seo": <Code code="DE" />,
  "spanish-seo": <Code code="ES" />,
  "dutch-seo": <Code code="NL" />,
  "italian-seo": <Code code="IT" />,
  "portuguese-seo": <Code code="PT" />,
  /** A pin on a place, which is the whole of local. */
  "local-seo": (
    <>
      <path d="M12 21.5s6.5-6.1 6.5-10.6a6.5 6.5 0 0 0-13 0C5.5 15.4 12 21.5 12 21.5z" {...S} />
      <circle cx="12" cy="10.7" r="2.4" {...S} />
    </>
  ),
  /** The plumbing under a site: layers that have to line up. */
  "technical-seo": (
    <>
      <path d="M12 2.8 21 7.4l-9 4.6-9-4.6z" {...S} />
      <path d="M3 12.2 12 16.8l9-4.6M3 16.8 12 21.4l9-4.6" {...S} />
    </>
  ),

  // ---- Localisation ----
  /** A window carrying the site's own wave. */
  "website-localisation": (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" {...S} />
      <path d="M2.5 8.5h19" {...S} />
      <path d="M6 14.8c1.5-2.4 3-2.4 4.5 0s3 2.4 4.5 0" {...S} />
    </>
  ),
  /** Two tongues, one meaning. */
  "translation-services": (
    <>
      <path d="M2.5 5.5h9v7h-4l-3 2.5v-2.5h-2z" {...S} />
      <path d="M12.5 11.5h9v7h-2V21l-3-2.5h-4z" {...S} />
    </>
  ),
  /** A handset, because an app is localised at the interface. */
  "app-and-software-localisation": (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" {...S} />
      <path d="M10.5 18.5h3" {...S} />
      <path d="M9 9.2c1.1-1.8 2.2-1.8 3.3 0s2.2 1.8 3.3 0" {...S} />
    </>
  ),
  /** Words set in a frame: content built per market, not poured in. */
  "multilingual-content": (
    <>
      <path d="M5 2.8h9l5 5v13.4H5z" {...S} />
      <path d="M14 2.8v5h5" {...S} />
      <path d="M8.5 12.5h7M8.5 16h4.5" {...S} />
    </>
  ),

  // ---- AI ----
  /** A model as what it is: nodes and the weights between them. */
  "ai-consulting": (
    <>
      <circle cx="5" cy="6" r="2.2" {...S} />
      <circle cx="5" cy="18" r="2.2" {...S} />
      <circle cx="18" cy="12" r="2.6" {...S} />
      <path d="M7.1 7.1 15.7 10.9M7.1 16.9 15.7 13.1" {...S} />
    </>
  ),
  /** Machine output, then a human hand on it. */
  "ai-translation-and-post-editing": (
    <>
      <rect x="2.5" y="4.5" width="13" height="10" rx="2.5" {...S} />
      <path d="M6 9.3c1-1.6 2-1.6 3 0s2 1.6 3 0" {...S} />
      <path d="m13.5 21 1-3.6 5.2-5.2 2.6 2.6-5.2 5.2z" {...S} />
    </>
  ),
  /** An answer generated rather than listed. */
  "generative-engine-optimization": (
    <>
      <path d="M12 2.5 13.9 8l5.6 1.9-5.6 1.9L12 17.4l-1.9-5.6L4.5 9.9 10.1 8z" {...S} />
      <path d="M18.5 16.5 19.3 19l2.2.8-2.2.8-.8 2.2" {...S} />
    </>
  ),
};

/** Fallback: the site's own wave, for a service with no mark of its own. */
const WAVE = <path d="M3 13.5c2.6-4.2 5.2-4.2 7.8 0s5.2 4.2 7.8 0" {...S} />;

export default function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="26"
      height="26"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {MARKS[slug] ?? WAVE}
    </svg>
  );
}
