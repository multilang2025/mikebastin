/**
 * Mike Bastin's cut-out portrait for the homepage heroes (declaudify brief,
 * 3 Oct 2026): the agency is recognisable through the person who leads it,
 * so the portrait replaces the animated market radar. The source is the
 * legacy WordPress Mike_home-1.png (769x959, transparent), served as WebP
 * at 400 and 760 wide. It sits straight on the band with no halo, badge or
 * shadow, right of the copy on desktop and after the call to action on
 * phones, where the grid stacks it.
 */
export default function FounderPortrait({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="mx-auto mt-12 w-full max-w-[300px] lg:mx-0 lg:mt-0 lg:w-[360px] lg:max-w-none">
      <img
        src="/images/mike-bastin-portrait-760.webp"
        srcSet="/images/mike-bastin-portrait-400.webp 400w, /images/mike-bastin-portrait-760.webp 760w"
        sizes="(min-width: 1024px) 360px, 300px"
        width={760}
        height={948}
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
