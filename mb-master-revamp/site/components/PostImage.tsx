import PostArt from "@/components/PostArt";
import { getBlogImage } from "@/lib/blog-images";

/**
 * The picture at the head of a post and on a post card.
 *
 * Every post that came across from WordPress already had a featured
 * image chosen for it, so it gets that image back. `PostArt` draws its
 * generated wave composition only for a post with no picture of its
 * own, which today is none of the 56 migrated ones and will be every
 * newly written one until a photograph is picked for it.
 *
 * Plain `img` rather than `next/image`: the build is `output: "export"`
 * with `images: { unoptimized: true }`, so `next/image` would ship the
 * same bytes through a component that cannot optimize them. The sizes
 * that matter are baked at build time by scripts/fetch-legacy-images.mjs
 * instead, which is also why `compact` has a real 160px file behind it
 * rather than a full-width image scaled down in the browser.
 *
 * `width` and `height` are the file's own, so the box is reserved
 * before the bytes land. The aspect ratio comes from the caller's
 * className and the picture is cropped to it, because the legacy set
 * runs from 1.33 to 2.82 and a card grid needs one shape.
 */
export default function PostImage({
  slug,
  cluster,
  className,
  rounded = false,
  compact = false,
  priority = false,
  sizes = "(min-width: 1280px) 1200px, 100vw",
}: {
  slug: string;
  cluster?: string;
  className?: string;
  rounded?: boolean;
  /** The 160px square file, for the footer's 56px thumbnails. */
  compact?: boolean;
  /** Set on the one image above the fold on a post page. */
  priority?: boolean;
  /** How wide the slot is drawn, for picking between the 640 and 1200
   *  files. Defaults to a full-width post head. */
  sizes?: string;
}) {
  const image = getBlogImage(slug);

  if (!image) {
    return (
      <PostArt slug={slug} cluster={cluster} className={className} rounded={rounded} compact={compact} />
    );
  }

  const src = compact
    ? `/images/blog/${slug}-thumb.webp`
    : `/images/blog/${slug}.webp`;
  // Every file is cut to the 1200:630 slot (scripts/optimize-blog-images.mjs),
  // with a 640-wide sibling for cards and phones. A source no wider than
  // 640 has nothing smaller to offer, so it gets a plain src.
  const srcSet = compact || image.width <= 640
    ? undefined
    : `/images/blog/${slug}-640.webp 640w, ${src} ${image.width}w`;

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={image.alt}
      width={compact ? 160 : image.width}
      height={compact ? 84 : image.height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={`block w-full object-cover ${className ?? ""}`}
      style={rounded ? { borderRadius: "4px" } : undefined}
    />
  );
}
