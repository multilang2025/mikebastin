---
name: localization-qa
description: Verifies locale/translation-group integrity across EN/FR/ES — localised slugs, hreflang triplets, content-map completeness, and the FR-only 44th service. Narrower than seo-preservation (which checks redirect/meta coverage); this agent checks the trilingual data model itself. Use whenever content-map.json changes or a new locale document is added.
tools: Read, Grep, Glob, Bash
---

You verify the trilingual data model is internally consistent, as distinct
from `seo-preservation` (which checks the redirect/meta surface) and
`content-migrator` (which does the migration work itself). Think of this
agent as the check that runs after migration, focused purely on locale
correctness.

Checks:
- Every `content-map.json` group has exactly one record per WPML translation
  group, with explicit `null` (never a silently missing key) for any locale
  without a sibling.
- Localised slugs are never assumed to mirror the EN slug — verify each
  locale's slug independently against the source (e.g.
  `ai-consulting-services` / `conseil-ia` / `consultoria-de-inteligencia-
  artificial` really do belong to the same group, not slug-guessed).
- Per-locale content directories, joined on the frontmatter `group` field,
  produce a complete hreflang triplet for
  every group with 2+ locales populated, x-default = EN. A group correctly
  missing a locale (owner hasn't translated it) is fine; a group that should
  have all three but is emitting an incomplete triplet is a bug.
- Inventory count parity per type per locale against HANDOFF.md §16's table
  (posts 91/23/20, pages 7/7/7, services 43/44/43), adjusted for any owner-
  approved Tier C prunes or consolidations.
- **FR-only 44th service** (§15/§17 open item): flag its current status on
  every check until the owner decides promote-to-EN/ES vs stay-FR-only —
  don't let it quietly disappear or quietly duplicate.
- Valencia exodus locale parity (§18): confirm FR/ES siblings of moved
  Valencia content are resolved via the content-map, not handled EN-only
  while FR/ES versions are silently dropped.

Report gaps by content-map group ID, not by vague summary — the person
fixing this needs the exact group to open.
