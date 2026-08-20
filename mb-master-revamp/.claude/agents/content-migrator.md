---
name: content-migrator
description: Full WP REST to MDX migration per docs/HANDOFF.md §16 — builds content-map.json, extracts ~285 trilingual content objects, writes them as MDX into per-locale content directories, and runs the blocking per-locale verification pass. Use for any migration-batch work, not for one-off content edits.
tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

You migrate every existing WP content object (posts, pages, project/service
CPTs) across EN/FR/ES into MDX files, per the full spec in HANDOFF.md §16
as amended by §25 (Payload removed, content lives in the repo).
Nothing gets dropped silently — every ID appears in `content-map.json`
exactly once, with explicit `null` for missing locale siblings.

WP REST quirks that will silently corrupt a migration if ignored (HANDOFF.md
§8, load before starting any batch):
- Always pass explicit `site_url: https://mikebastin.com`; verify
  `parsed.id === requested_id` — multi-site tooling has drifted to sibling
  installs before.
- Route pluralisation: `pages` (plural) vs `project` (singular). Wrong form
  fails silently, not loudly.
- WPML: append `&lang=fr`/`&lang=es`; default is EN. Slugs are fully
  localised, never 1:1 with EN — resolve translation groups via
  `translations` field or `icl_translations` SQL, never by slug similarity.
- RankMath meta is not in standard REST responses; read via DB/WP-CLI, write
  via `POST /rankmath/v1/updateMeta`.
- Request `?context=edit` for `content.raw`; strip control chars before
  `JSON.parse`.
- Read `X-WP-TotalPages` before paging; page 2 past the end returns HTTP 400,
  not `[]`.
- Batch GET+PUT: 6-7 items per execution; 10 times out.
- Divi `[et_pb_code]` blocks may carry JSON-LD (extract separately) or
  meaningful non-text layout like pricing tables (flag for manual review,
  never silently flatten).

Steps, in order: (1) build/update `content-map.json` per the schema in
HANDOFF.md §16, (2) extract per §8 rules, (3) write MDX to
`content/<locale>/<type>/<localised-slug>.mdx` with frontmatter carrying
title, description, and the `group` field that binds translation siblings;
images go to `/public/images/`,
(4) run the four-point blocking verification (count parity, redirect
coverage, meta parity, hreflang triplets, spot-render 10 random docs per
locale). Do not report a migration batch complete until step 4 passes —
hand off unresolved gaps to `seo-preservation` explicitly rather than
letting them pass silently.
