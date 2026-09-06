repo: multilang2025/mikebastin
branch: refs/pull/53/head (PR #53)
path: mb-master-revamp

## Last sync
date: 2026-08-21T15:39:03Z
tree: 873209987e0e

### Updated in this project
- Built the mikebastin.com design system from PR #53: tokens, 22 components, 16 foundation cards, one website UI kit.
- Token layer copied from site/app/globals.css: closed Night Swell / Morning Glass palette, band system, type scale with body weight 350.
- Added the form set and button variants the handoff lists as gaps one and two; Journal, index cards and the dashboard surface are still open.
- Copied the three woff2 fonts, the favicons and seven client screenshots into assets/.

## Screen map
| Screen | Repo files |
|---|---|
| ui_kits/web/index.html (Spread) | site/app/page.tsx, site/components/Spread.tsx, site/lib/projects.ts |
| ui_kits/web/index.html (Ledger) | site/app/results/page.tsx, site/components/{ImpressionsChart,LocaleTable,Counter}.tsx |
| ui_kits/web/index.html (Service) | site/app/services/page.tsx, site/components/{ConsolidationDiagram,Testimonials}.tsx |
| ui_kits/web/index.html (Plain) | site/components/SiteFooter.tsx, docs/DESIGN-SYSTEM-HANDOFF.md §6 (no form exists in the repo) |
| tokens/*.css | site/app/globals.css |
| components/layout, actions, core, data, portfolio, motion | site/components/*.tsx |
| components/forms | new: docs/DESIGN-SYSTEM-HANDOFF.md §6 |

## Notes
- The handoff doc lives only on PR #53's branch, not on main or the default branch (claude/sharp-mendel-e2p23s).
- Live DesignSync cannot run from a cloud session. Routes back: "Send to Claude Code Web", or paste the files for wiring into site/components/ and site/app/globals.css.
- No commit sha recorded: 873209987e0e is the resolved tree, not a commit.
