# Moving the AISA plugin to its own repository

Owner decision, 4 Oct 2026 (Q33): "Yes, move to its own repo." Not done yet:
this session could not create the repository (the GitHub integration returns
403 on repository creation, and the permission classifier denied it as a
public surface). Everything below is ready to run by the owner, or by a
session that is allowed to create the repo.

## Why a copy is not enough

`AISA_Updater::REPO` in `ai-site-assistant/includes/class-aisa-updater.php` is
hard-coded to `multilang2025/mikebastin`. Every installed site polls that
repo's Releases (`/releases/latest`, asset `ai-site-assistant.zip`). The latest
is `v2.4.0`. So the old repo has to publish one **transition release** that
points the updater at the new repo, and only then can releases move.

## What lives where today

- `claude/sharp-mendel-e2p23s` holds the plugin (v2.4.0), `php-mcp-bridge`,
  `.github/workflows/{ci,release}.yml` and all **94 tags** (`v*` and
  `bridge-v*`). Its history is unrelated to `main`.
- The four `feature/*` branches are all ancestors of it.
- `main` carries a v1.4.0 seed of `ai-site-assistant` and `php-mcp-bridge` next
  to the website (`mb-master-revamp/`), and the website's own `.github`
  (deploy preview). Do not remove `.github` from `main`.
- Release workflow: triggers on tags `v*` and `bridge-v*`. Pushing **more than
  three tags at once triggers no workflow runs**, so pushing all tags in one
  command will not create 94 releases.

## Steps

1. **Create** `multilang2025/aisa-connector`, public (the current repo is
   public, and a public repo lets sites update without a token). No README.
2. **Copy the history:**

   ```sh
   git clone --mirror https://github.com/multilang2025/mikebastin.git /tmp/aisa.git
   cd /tmp/aisa.git
   git push https://github.com/multilang2025/aisa-connector.git \
     refs/heads/claude/sharp-mendel-e2p23s:refs/heads/main
   git push https://github.com/multilang2025/aisa-connector.git --tags
   ```

3. **In the new repo:** copy the Actions secrets and variables the release and
   deploy workflows use (secrets do not travel with a push), and set the
   default branch to `main`.
4. **Transition release (in the OLD repo, from the plugin lineage):** change
   `REPO` in `class-aisa-updater.php` to `multilang2025/aisa-connector`, change
   the two links in `class-aisa-settings.php`, bump the version (v2.4.1),
   tag it in `mikebastin`, and let its Release workflow publish
   `ai-site-assistant.zip`. Installed sites update to it and from then on poll
   the new repo.
5. **Cut the same version in the new repo** so the first release there exists.
   From here on, release only from `aisa-connector`.
6. **Wait until the sites have updated** (check the sites' plugin versions),
   then, in `mikebastin`: remove `ai-site-assistant/`, `php-mcp-bridge/` and
   the plugin's root `CLAUDE.md`, `HANDOFF.md` notes from `main`; delete
   `claude/sharp-mendel-e2p23s` and the four `feature/*` branches. Keep the
   old Releases and tags, which installed sites and bridge clients may still
   fetch.
7. Update `OPEN-ITEMS.md` Q33 and the root `CLAUDE.md` repo-settings note.

## Risks

- A site that never receives the transition release keeps polling the old
  repo, so keep the old Releases and tags indefinitely.
- The bridge (`php-mcp-bridge`, tags `bridge-v*`) may deploy from the old
  repo's workflow; check `release.yml` and `.github` secrets before step 6.
