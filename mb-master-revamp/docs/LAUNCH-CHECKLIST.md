# Launch checklist

Everything here is reversible except the first item, which is the one that
decides whether the site exists as far as search is concerned.

Run `npm run verify` in `site/` first. It typechecks, runs all three copy
lints, builds, and reports the launch switches. CI runs the same chain on
every pull request.

## 1. The two switches that make the site visible

Both are correct for a preview and fatal for a launch, and they live in
different files with nothing tying them together. **Flip both or neither.**

| Where | What | Preview | Launch |
|---|---|---|---|
| `site/app/layout.tsx` | `robots: { index: false, follow: false, nocache: true }` | present | **removed** |
| `site/public/robots.txt` | `Disallow: /` | present | **removed** |

`node scripts/launch-check.mjs --live` fails while either is still set, and
prints which. The plain form runs in CI and fails on a half-flipped state,
where one switch has been changed and the other forgotten: a site that
looks launched and is not, or looks private and is not.

Keep the `Sitemap:` line in `robots.txt`. It is inert under the Disallow
and correct the moment the Disallow goes.

Four pages keep their own `noindex` at launch and are counted separately:
`/404/`, the not-found route, and the two post-submit contact pages. A
sitemap is a list of pages worth indexing, so none of them is in it.

## 2. DNS and the redirects

`site/public/.htaccess` is generated, never hand-edited. Regenerate with
the `scripts/gen-*-redirects.mjs` family and confirm coverage against
`docs/sitemap-MB-EN.txt`, which is the URL inventory of record: every
legacy URL in it must resolve 200 or 301, never 404.

Check for chains rather than assuming single hops. A redirect whose target
is itself redirected costs the link equity the redirect existed to keep,
and the project has shipped a two-hop chain once already.

## 3. Search Console

- Add the property for the new site if the host changes.
- Submit `https://mikebastin.com/sitemap.xml`.
- Set the geotargeting where a generic domain needs it.
- Expect a reporting gap while Google recrawls, and do not read the first
  fortnight as a ranking change.

## 4. What is deliberately not done at launch

- **French and Spanish index pages.** Deferred (owner, 20 Sep). The
  individual `[slug]` routes exist and are in both sitemaps; the indexes
  above them do not. `SiteFooter` gives those locales no index link rather
  than sending a French reader to an English one.
- **Topic pages in FR and ES.** `getTopics()` reads the EN clusters.
- **The FR and ES motto renderings.** A first pass, unreviewed.

## 5. After launch

- Re-run `launch-check.mjs --live` against the deployed output, not just
  the build, so the thing that shipped is the thing that was checked.
- Watch the highest-impression URLs specifically rather than the totals:
  `/services/global-seo-solutions/` alone took 51,064 impressions over 450
  days and now 301s to `/services/multilingual-seo/`, so that hop is worth
  more than most pages on the site.
