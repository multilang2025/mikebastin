# Branch cleanup, 4 Oct 2026

Owner approved the cleanup (Q33, "YES"). **Nothing is deleted yet**: this
session's git proxy and GitHub integration refuse branch deletes, so the 57
branches below still exist. Every one is safe to delete: 47 are already merged
into `main`, and 10 are not merged but have every commit in `main` by patch or
are obsolete (audit in `OPEN-ITEMS.md` Q33). Each row records the commit the
branch pointed at, so any of them can be restored:

    git push origin <sha>:refs/heads/<name>

## Delete them

From any clone with push access:

```sh
git push origin --delete \
  claude/add-portrait \
  claude/blog-conversion-paths \
  claude/blog-post-cover-images \
  claude/blog-prune-audit-content-map \
  claude/blog-scope-correction \
  claude/conversion-copy-pass \
  claude/decruft-visible-copy \
  claude/deoptimise-blog-titles \
  claude/eyebrow-inflections \
  claude/fix-uncategorised-valencia-alt \
  claude/geo-consolidation \
  claude/h1-audit \
  claude/homepage-keyword-hero \
  claude/journal-blog-templates \
  claude/keyword-targeting-audit \
  claude/local-seo-geo-keyword-research \
  claude/locale-routing-fr-es \
  claude/locale-services-fr-es \
  claude/mb-billing-scope \
  claude/mb-chatbot-image \
  claude/mb-content-architecture \
  claude/mb-pillar-row-image \
  claude/mb-service-page-rewrite \
  claude/onpage-schema-eeat \
  claude/prune-audit-htaccess-301s \
  claude/seo-heading-pass \
  claude/service-body-content \
  claude/service-og-cards \
  claude/services-redirects-and-how-i-work \
  claude/spread-shot-under-name \
  claude/tender-euler-e9dm5w \
  claude/wire-valencia-exodus-redirects \
  claude/youtube-post-confirmed-remove \
  feature/google-analytics-integration \
  feature/gsc-skill-and-mcp-skills-list \
  fix/wpcs-plugin-lint \
  michael/ahrefs-seo-intelligence \
  michael/bastin-acronym-section \
  michael/brand-board-agents \
  michael/fix-checklist-numbering \
  michael/fix-stale-consolidation-diagram \
  michael/fix-timeout-tool-dispatch \
  michael/fix-updater-cache \
  michael/fix-utf8-json-encoding \
  michael/fix-working-indicator \
  michael/fix-working-indicator-pin \
  michael/gemini-chat-rate-limited \
  michael/gemini-image-generation \
  michael/homepage-standard-content \
  michael/mcp-focus-ui \
  michael/multi-feature-0.6.0 \
  michael/palette-doc-sync \
  michael/remove-fallback-token \
  michael/retire-gold-silver \
  michael/tx-international-freight-shot \
  michael/ui-polish-0.6.1 \
  michael/wpvibe-parity
```

Or delete them in the GitHub UI under Branches. **Keep** `main`,
`claude/mb-master-revamp-setup-qx16hw` until its PR merges, and the plugin
lineage (`claude/sharp-mendel-e2p23s` and the four `feature/*` branches inside
it, `connect-site-link`, `multi-site-switching`, `postgres-supabase`,
`self-service-connect`) until the plugin has moved (`PLUGIN-REPO-MOVE.md`).

## Record

| Branch | Commit |
|---|---|
| `claude/add-portrait` | `585f0c6fbafc` |
| `claude/blog-conversion-paths` | `eca64cba407a` |
| `claude/blog-post-cover-images` | `af0d6d49a9c9` |
| `claude/blog-prune-audit-content-map` | `4cad204f3f16` |
| `claude/blog-scope-correction` | `bee2f98927b6` |
| `claude/conversion-copy-pass` | `a10b734d62d9` |
| `claude/decruft-visible-copy` | `fb7bf60abb3c` |
| `claude/deoptimise-blog-titles` | `fd513f959413` |
| `claude/eyebrow-inflections` | `37cb2f68e76e` |
| `claude/fix-uncategorised-valencia-alt` | `22711788045e` |
| `claude/geo-consolidation` | `cd6d29851021` |
| `claude/h1-audit` | `e1165beb4f28` |
| `claude/homepage-keyword-hero` | `dae7df935111` |
| `claude/journal-blog-templates` | `aed189f97149` |
| `claude/keyword-targeting-audit` | `107d6cc7071b` |
| `claude/local-seo-geo-keyword-research` | `214667aff751` |
| `claude/locale-routing-fr-es` | `926e831b823f` |
| `claude/locale-services-fr-es` | `a0ad6be0e28a` |
| `claude/mb-billing-scope` | `dbacee511b36` |
| `claude/mb-chatbot-image` | `c7f18554164f` |
| `claude/mb-content-architecture` | `ef1fb94de25a` |
| `claude/mb-pillar-row-image` | `5e8155d6cd16` |
| `claude/mb-service-page-rewrite` | `46f203512218` |
| `claude/onpage-schema-eeat` | `439c75b9256c` |
| `claude/prune-audit-htaccess-301s` | `13b3f5d75fe8` |
| `claude/seo-heading-pass` | `3426f6f1e854` |
| `claude/service-body-content` | `191382a882fc` |
| `claude/service-og-cards` | `19d9e0d8464a` |
| `claude/services-redirects-and-how-i-work` | `373fcd86e931` |
| `claude/spread-shot-under-name` | `1deec0ff449b` |
| `claude/tender-euler-e9dm5w` | `b2c6c1321938` |
| `claude/wire-valencia-exodus-redirects` | `3227d3871a3c` |
| `claude/youtube-post-confirmed-remove` | `85ddc1874753` |
| `feature/google-analytics-integration` | `01c9dd20e7a5` |
| `feature/gsc-skill-and-mcp-skills-list` | `2a70645a776f` |
| `fix/wpcs-plugin-lint` | `8884a5fffcd3` |
| `michael/ahrefs-seo-intelligence` | `f41837bc828c` |
| `michael/bastin-acronym-section` | `8c93627ba2ab` |
| `michael/brand-board-agents` | `1c3a31284684` |
| `michael/fix-checklist-numbering` | `daba30806f82` |
| `michael/fix-stale-consolidation-diagram` | `0076379d3820` |
| `michael/fix-timeout-tool-dispatch` | `85c79b586372` |
| `michael/fix-updater-cache` | `2c87a4e1f7d6` |
| `michael/fix-utf8-json-encoding` | `a76fe114d1b5` |
| `michael/fix-working-indicator` | `db99126c693c` |
| `michael/fix-working-indicator-pin` | `78ad70e459d6` |
| `michael/gemini-chat-rate-limited` | `bfbac5eb2311` |
| `michael/gemini-image-generation` | `ef0049d4b018` |
| `michael/homepage-standard-content` | `5ec045684c52` |
| `michael/mcp-focus-ui` | `f26c3765d885` |
| `michael/multi-feature-0.6.0` | `d0d2ba2af223` |
| `michael/palette-doc-sync` | `a00a62828901` |
| `michael/remove-fallback-token` | `a3d696158a3c` |
| `michael/retire-gold-silver` | `d54370f4c03d` |
| `michael/tx-international-freight-shot` | `0a7e355f1587` |
| `michael/ui-polish-0.6.1` | `07bf13e46c54` |
| `michael/wpvibe-parity` | `595018191afa` |
