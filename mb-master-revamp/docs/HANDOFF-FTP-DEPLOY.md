# Handoff to Andre: preview deploy is blocked on FTP auth

Michael cannot see straight on this one and is handing it to you. Everything
below is what has actually been tried, in order, so you do not repeat it.

## The goal

`preview.mikebastin.com` is a Hostinger subdomain serving the static export
of `mb-master-revamp/site/`. It works today: Michael built it locally and
uploaded the zip by hand through hPanel's File Manager. The ask was to stop
doing that by hand, so `.github/workflows/deploy-preview.yml` was added:
build on every push to `main` that touches `mb-master-revamp/site/`, then
push the `out/` export to the subdomain over FTP using
[SamKirkland/FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action).

The build side works. Four runs in a row, the build step succeeds cleanly
every time: `npm ci`, `npm run build`, static export generated. The failure
is always the deploy step, always the same shape.

## The account

Created in hPanel → Files → FTP Accounts, scoped to the preview folder only
(not the account-wide FTP login), so a leaked credential cannot reach
anything outside `public_html/preview`:

- Directory: `/home/u586375813/domains/mikebastin.com/public_html/preview/`
- Active hostname shown in hPanel: `ftp.mikebastin.com`
- Username shown in hPanel's active-accounts table: `u586375813.preview`

Three GitHub Actions repository secrets carry the credential:
`FTP_HOST`, `FTP_USERNAME`, `FTP_PASSWORD`. Values were entered directly by
Michael in the GitHub Settings UI. Nobody in this chat has ever seen the
password; that is by design and should stay that way.

## What has been tried, all four attempts got `530 Login incorrect`

| Run | Change tested | Result |
|---|---|---|
| 1 | Initial workflow | `ENOENT: no such file or directory, scandir './out/'` — `local-dir: ./out/` was wrong because `defaults.run.working-directory` only applies to `run:` shell steps, not `uses:` action steps. Fixed in PR #36 by pointing at `./mb-master-revamp/site/out/`. |
| 2 | Path fixed | `FTPError: 530 Login incorrect`. First real auth failure. |
| 3 | `FTP_USERNAME` re-verified against hPanel's active-accounts table (an earlier reading of the one-time account-creation screen had shown a different string, `u586375813.mikebastin.com`, than the accounts table's `u586375813.preview`) | Same `530`. |
| 4 | `protocol: ftps` added, on the theory that Hostinger requires explicit TLS and answers a plaintext login attempt with the same generic `530` | TLS handshake completes this time (stack trace shows `TLSSocket` instead of a plain `Socket`), so FTPS itself works — but login still fails with the identical `530`. This rules protocol out and points back at the credential or the account. |

Every run's job log is on GitHub Actions:
[`Deploy preview`](https://github.com/multilang2025/mikebastin/actions/workflows/deploy-preview.yml).
Runs 1 to 4 are all there with full logs.

## Where this stands

Path is right, protocol is right, username has been cross-checked against
the authoritative hPanel table rather than the one-time creation screen.
Four attempts, three different hypotheses, same `530` every time once the
path was fixed. That is a real credential or account problem on the
Hostinger side, not a workflow bug, and it needs someone who can either see
the password or reach Hostinger support, neither of which the chat can do.

## What Andre should do, in order

1. **Test the credential outside of GitHub Actions first.** A real FTP
   client (FileZilla, Cyberduck) against `ftp.mikebastin.com`,
   `u586375813.preview`, port 21, with the same password that is in the
   `FTP_PASSWORD` secret. If this also fails, the problem is confirmed to be
   the account or password, not the workflow, and go to step 3.
2. **If the FTP client connects fine**, the password in the GitHub secret
   does not match what was tested. The most common cause is a stray space or
   line break pasted alongside the password. Delete `FTP_PASSWORD` in
   GitHub Settings → Secrets and variables → Actions and recreate it,
   pasting directly from hPanel's copy button with nothing in between.
3. **If the FTP client also fails**, this is a Hostinger account issue.
   Options, cheapest first: regenerate the FTP password from hPanel (Files →
   FTP Accounts → this account → Change password) and retest before opening
   a support ticket; if that does not fix it, Hostinger live chat can
   confirm the account is actually active and not something silently
   disabled (rate limiting, an IP allowlist, the account created in a
   pending state).
4. **Once a client connects successfully outside Actions**, update
   `FTP_PASSWORD` (and `FTP_USERNAME`/`FTP_HOST` if either changed) in
   GitHub, then push any trivial change under `mb-master-revamp/site/` to
   `main` to re-trigger the workflow, or ask whoever has repo admin to grant
   `workflow_dispatch` permission to the app account so this chat can
   trigger runs directly instead of needing a throwaway commit each time.
   The 403 on `workflow_dispatch` from the Claude Code GitHub App is a
   separate, minor annoyance worth fixing while in there: **Settings → Actions →
   General → Workflow permissions**, but it is not blocking anything by
   itself.

## What is explicitly not the problem

Ruled out with evidence, do not re-test these:

- The static build itself — succeeds every run.
- The export path (`mb-master-revamp/site/out/`) — fixed in PR #36 and
  confirmed correct in every run since.
- Plaintext FTP being blocked — tested directly in run 4 with `protocol:
  ftps`; TLS negotiates fine, the failure is still at the login step after
  that.
- `noindex`/`robots.txt`/`.htaccess` on the site itself — unrelated,
  verified separately when the zip was first hand-uploaded and confirmed
  working at that time.

## Where the workflow file lives

`.github/workflows/deploy-preview.yml`, on `main`. Triggers on push to
`main` touching `mb-master-revamp/site/**`, plus `workflow_dispatch` for
manual runs once someone has the permission to use it.
