import "@/app/dl-art.css";
import { DL_ART } from "@/lib/dl-art-data";

/**
 * One of the animated illustrations recycled from the Delaguía y Luzón
 * proposal (design/dl-art, scripts/build-dl-art.mjs). Markup and animation
 * are the originals; colour comes from this site's band tokens through the
 * `.dl-art` variables. Decorative, so `aria-hidden`; reduced motion is
 * handled by the illustration's own media query.
 */
export default function DlArt({ name }: { name: string }) {
  const art = DL_ART[name];
  if (!art) return null;
  return <div className={`dl-art ${art.cls}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: art.svg }} />;
}
