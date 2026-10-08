import Image from "next/image";
import { HOME_GRAPHICS } from "@/lib/home-graphics";

/**
 * Hero portrait, in two forms chosen in lib/home-graphics.ts.
 *
 * "bubble" (PR #134, Victoria, 5 Oct 2026): a circular crop of Mike's
 * headshot, matching the button card at the footer, with a small chart
 * bubble layered beneath it to hint at performance. The chart carries no
 * figure: a percentage there would be a statistic with no source.
 *
 * "cutout" (declaudify brief, 3 Oct 2026): Mike Bastin's cut-out portrait,
 * cropped at chest height (owner: "see less of my belly", top 540px with a
 * 70px alpha fade at the bottom edge) and served as WebP at 400, 560 and
 * 760 wide. It sits straight on the band with no halo, badge or shadow,
 * right of the copy on desktop and after the call to action on phones.
 */
export default function FounderPortrait({
  alt,
  caption,
  className = "",
  mobileOptimized = false,
}: {
  alt: string;
  caption: string;
  className?: string;
  mobileOptimized?: boolean;
}) {
  if (HOME_GRAPHICS.heroPortrait === "cutout") {
    return (
      <figure className={`mx-auto mt-12 w-full max-w-[320px] lg:mx-0 lg:mt-0 lg:w-[420px] lg:max-w-none ${className}`}>
        <img
          src="/images/mike-bastin-portrait-760.webp"
          srcSet="/images/mike-bastin-portrait-400.webp 400w, /images/mike-bastin-portrait-560.webp 560w, /images/mike-bastin-portrait-760.webp 760w"
          sizes="(min-width: 1024px) 420px, 320px"
          width={760}
          height={534}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full"
        />
        <figcaption className="mt-3 text-center text-[.82rem]" style={{ color: "var(--dim)" }}>
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={`mx-auto mt-12 w-full max-w-[420px] lg:mx-0 lg:mt-0 ${className}`}>
      <div
        className={`relative flex w-full items-start justify-center lg:justify-start ${
          HOME_GRAPHICS.heroChartBadge
            ? mobileOptimized
              ? "pb-0 lg:pb-[clamp(100px,15vw,132px)]"
              : "pb-[clamp(100px,15vw,132px)]"
            : "pb-8"
        }`}
      >
        <div
          className="hero-portrait-bubble relative overflow-hidden lg:-top-16 lg:-translate-x-3 rounded-full border-[4px] border-[var(--bg)] bg-[var(--chip)] shadow-[0_20px_40px_rgba(12,18,28,0.15)]"
          style={{
            width: mobileOptimized ? "min(62vw, 240px)" : "min(72vw, 320px)",
            aspectRatio: "1",
          }}
        >
          <Image
            src="/images/mike-bastin.webp"
            alt={alt}
            width={389}
            height={389}
            priority
            unoptimized
            className="block h-full w-full object-cover object-center"
          />
        </div>

        {HOME_GRAPHICS.heroChartBadge && (
          <div
            aria-hidden="true"
            className={`hero-chart-bubble absolute bottom-0 right-[-0.5rem] z-10 flex rotate-[3deg] items-center justify-center overflow-hidden rounded-full border-[4px] border-[var(--bg)] bg-[var(--bg)] shadow-[0_14px_32px_rgba(15,23,42,0.18)]${mobileOptimized ? " hidden lg:flex" : ""}`}
            style={{ width: "clamp(190px, 46vw, 216px)", aspectRatio: "1" }}
          >
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
              <rect x="0" y="0" width="120" height="120" fill="var(--bg)" />
              <path d="M12 88 L30 57 L42 66 L57 40 L79 55 L98 26 L108 26 L108 100 L12 100 Z" fill="rgba(40, 115, 255, 0.12)" />
              <path className="hero-chart-line" pathLength="1" d="M12 88 L30 57 L42 66 L57 40 L79 55 L98 26" fill="none" stroke="var(--berry)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="98" cy="26" r="5" fill="var(--berry)" />
              <path d="M20 18 L20 98 M12 98 L108 98" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round" />
              <path d="M23 26 L28 26 M23 46 L28 46 M23 66 L28 66 M23 86 L28 86" stroke="var(--dim)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M92 72 L95 69 L99 74 L104 67" fill="none" stroke="var(--berry)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <figcaption className="mt-3 text-center text-[.82rem] lg:mt-6" style={{ color: "var(--dim)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}
