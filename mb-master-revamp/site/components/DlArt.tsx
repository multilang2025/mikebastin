import { DL_ART, DL_ART_CSS } from "@/lib/dl-art-data";

/**
 * One of the animated illustrations recycled from the Delaguía y Luzón
 * proposal (design/dl-art, scripts/build-dl-art.mjs). Markup and animation
 * are the originals; colour comes from this site's band tokens through the
 * `.dl-art` variables carried in each illustration's style. Decorative, so `aria-hidden`;
 * reduced motion is handled by the illustration's own media query.
 *
 * Its CSS ships with it as a React 19 hoisted <style>: `href` and
 * `precedence` make React place it in the head once per page however many
 * times the illustration appears, so a page carries only the styles of the
 * art it draws (CWV audit, 3 Oct 2026).
 */
export default function DlArt({ name }: { name: string }) {
  const art = DL_ART[name];
  if (!art) return null;
  return (
    <>
      <style href={`dl-art-${art.css}`} precedence="default">
        {DL_ART_CSS[art.css]}
      </style>
      <div className={`dl-art ${art.cls}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.svg }} />
    </>
  );
}
