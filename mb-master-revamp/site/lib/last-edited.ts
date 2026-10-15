/**
 * When each content file was last edited, from git (owner, 15 Oct 2026:
 * "Blog post need to show the date when they were edited").
 *
 * The frontmatter `modified` is the WordPress date carried over by the
 * migration and nobody bumps it by hand, so it drifts: the copy passes,
 * the figures and the 14 Oct French and Spanish polish all left it behind.
 * The last commit that touched the file is the date that stays true. One
 * `git log` over content/ at build time, read once.
 *
 * Both workflows check out full history (fetch-depth: 0) so this works in
 * CI. In a shallow clone, or with no git at all, every file falls back to
 * its frontmatter date, so a build never fails for want of history.
 */
import { execFileSync } from "node:child_process";
import { REPO_ROOT } from "@/lib/content-locale";

let index: Map<string, string> | null = null;

function build(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { cwd: REPO_ROOT, encoding: "utf8" }).trim();
    if (shallow === "true") return map;
    // Newest commit first, so the first date seen for a path is its last edit.
    const out = execFileSync("git", ["log", "--relative", "--format=@%cI", "--name-only", "--", "site/content"], {
      cwd: REPO_ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    let date = "";
    for (const line of out.split("\n")) {
      if (line.startsWith("@")) date = line.slice(1);
      else if (line && !map.has(line)) map.set(line, date);
    }
  } catch {
    // No git: fall back to frontmatter everywhere.
  }
  return map;
}

/**
 * The later of the frontmatter `modified` and the file's last commit.
 * `contentPath` is relative to the repository root, as in
 * redirects/content-map.json ("site/content/en/posts/x.md").
 */
export function lastEdited(contentPath: string, frontmatter: string | undefined): string {
  index ??= build();
  const git = index.get(contentPath);
  if (!git) return frontmatter ?? "";
  if (!frontmatter) return git;
  return new Date(git) > new Date(frontmatter) ? git : frontmatter;
}
