import Link from "next/link";
import PostImage from "@/components/PostImage";

/**
 * One journal card, the same in every language and on every listing: the
 * index, the topic pages and the related posts under an article.
 *
 * Cards sit apart with real space between them (POST_GRID). A 1px hairline
 * grid put one photograph directly against the next and read as a single
 * collage (owner, 22 Sep and again 3 Oct 2026: "the images are glued to
 * each other"). The picture is rounded and framed so a pale photograph
 * still has an edge on the light theme.
 */
export const POST_GRID = "grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3";

export default function PostCard({
  href,
  imageSlug,
  cluster,
  title,
  excerpt,
  date,
  alt,
}: {
  href: string;
  imageSlug: string;
  cluster?: string;
  title: string;
  excerpt: string;
  /** Already formatted for the page language. */
  date: string;
  alt?: string;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col">
      <span
        className="block overflow-hidden rounded-[6px] border"
        style={{ borderColor: "var(--rule)" }}
      >
        <PostImage
          slug={imageSlug}
          cluster={cluster}
          alt={alt}
          className="aspect-[1200/630] w-full transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
        />
      </span>
      <span className="flex flex-1 flex-col pt-5">
        <span className="ulink mb-2 text-[1.05rem] font-semibold leading-[1.3]">{title}</span>
        <span className="mb-4 line-clamp-3 text-[.9rem] leading-[1.55]" style={{ color: "var(--dim)" }}>
          {excerpt}
        </span>
        <span className="mt-auto text-[.72rem] uppercase tracking-[.1em]" style={{ color: "var(--dim)" }}>
          {date}
        </span>
      </span>
    </Link>
  );
}
