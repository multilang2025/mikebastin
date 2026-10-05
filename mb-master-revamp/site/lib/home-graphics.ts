/**
 * One place to switch the homepage graphics from PR #134 (Victoria, 5 Oct
 * 2026) on or off. Each switch restores what the page showed before the
 * merge, so a graphic the owner does not like is one line to undo:
 *
 *   heroPortrait   "bubble"  the round portrait with a floating stats badge
 *                  "cutout"  the owner-approved chest-height cut-out (3 Oct)
 *   heroChartBadge the rising-search chart on the bubble portrait
 *   marketFlow     the EN, FR, ES, NL diagram beside "Why it works"
 *   bastinTrail    the scroll-driven arrow beside the six BASTIN ideas
 *   loopingMotion  false keeps every entrance animation and removes the
 *                  endless ones (float, marching dashes, pulse), which is
 *                  what the declaudify brief of 3 Oct asks for
 *
 * The whole PR can also be undone in one step: `git revert -m 1` on its
 * merge commit, or `git checkout before-victoria-homepage` for the page as
 * it stood before. The FR and ES homepages share FounderPortrait, so
 * heroPortrait and heroChartBadge reach them too.
 */
export const HOME_GRAPHICS = {
  heroPortrait: "bubble" as "bubble" | "cutout",
  heroChartBadge: true,
  marketFlow: true,
  bastinTrail: true,
  loopingMotion: true,
};
