import Image from "next/image";

/**
 * Hero portrait: a circular crop of Mike's headshot, matching the button
 * card at the footer, with a small stats bubble layered beneath it to hint at
 * performance without crowding the composition.
 */
export default function FounderPortrait({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="mx-auto mt-12 w-full max-w-[420px] lg:mx-0 lg:mt-0">
      <div className="relative flex w-full items-start justify-start pb-[clamp(100px,15vw,132px)]">
        <div
          className="hero-portrait-bubble relative -top-16 -translate-x-3 overflow-hidden rounded-full border-[4px] border-[var(--bg)] bg-[var(--chip)] shadow-[0_20px_40px_rgba(12,18,28,0.15)]"
          style={{ width: "min(72vw, 320px)", aspectRatio: "1" }}
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

        <div
          aria-label="Rising search performance"
          className="hero-chart-bubble absolute bottom-0 right-[-0.5rem] z-10 flex rotate-[3deg] items-center justify-center overflow-hidden rounded-full border-[4px] border-[var(--bg)] bg-[var(--bg)] shadow-[0_14px_32px_rgba(15,23,42,0.18)]"
          style={{ width: "clamp(190px, 46vw, 216px)", aspectRatio: "1" }}
        >
          <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-hidden="true">
            <rect x="0" y="0" width="120" height="120" fill="var(--bg)" />
            <path d="M12 88 L30 57 L42 66 L57 40 L79 55 L98 26 L108 26 L108 100 L12 100 Z" fill="rgba(40, 115, 255, 0.12)"/>
            <path className="hero-chart-line" pathLength="1" d="M12 88 L30 57 L42 66 L57 40 L79 55 L98 26" fill="none" stroke="var(--berry)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="98" cy="26" r="5" fill="var(--berry)"/>
            <path d="M20 18 L20 98 M12 98 L108 98" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M23 26 L28 26 M23 46 L28 46 M23 66 L28 66 M23 86 L28 86" stroke="var(--dim)" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <path d="M92 72 L95 69 L99 74 L104 67" fill="none" stroke="var(--berry)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <text x="60" y="108" textAnchor="middle" fontSize="10" fill="var(--ink)" fontWeight="700">+42%</text>
          </svg>
        </div>
      </div>

      <figcaption className="mt-6 text-center text-[.82rem]" style={{ color: "var(--dim)" }}>
        {caption}
      </figcaption>
    </figure>
  );
}
