import { getPosts } from "@/lib/posts";
import { OG_SIZE, OG_CONTENT_TYPE, renderBlogOgImage } from "@/lib/og-card";

// Static export (output: "export") needs every route handler without
// generateStaticParams to declare it renders to a fixed file at build time.
export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// The index card reuses the same renderer, called with a framing line
// rather than one post's own cluster. The count is read from getPosts()
// so it can never drift stale against the real list.
export default async function Image() {
  return renderBlogOgImage({
    title: "Journal",
    label: `${getPosts().length} posts, six clusters`,
  });
}
