import * as React from "react";

/**
 * The unit of page composition. Colour comes from the band, never from the
 * component inside it.
 *
 * @startingPoint section="Layout" subtitle="Alternating page section, either ground" viewport="700x260"
 */
export interface BandProps {
  /** "a" is Morning Glass, "b" is Night Swell. The theme toggle flips which is which. */
  variant?: "a" | "b";
  /** SVG noise overlay at 3.5%. Use on hero and other large flat bands. */
  grain?: boolean
  /** Radial berry glow. Hero band only, one per page. */
  glow?: boolean;
  /** Taller top padding for the first band on a page. */
  hero?: boolean;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare function Band(props: BandProps): JSX.Element;
