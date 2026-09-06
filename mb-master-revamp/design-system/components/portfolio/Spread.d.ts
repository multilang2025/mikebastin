import * as React from "react";

export interface Project {
  slug: string;
  /** Roman numeral, I to VIII. */
  numeral: string;
  name: string;
  domain: string;
  /** One short line, set in the script italic. */
  angle: string;
  body: string;
  metrics?: Array<{ v: string; k: string }>;
  services?: string[];
  /** Screenshot of the client's live homepage. Falls back to a --deep gradient plate. */
  shot?: string;
}

/**
 * One portfolio project, as it appears on the Spread template.
 *
 * @startingPoint section="Portfolio" subtitle="Numbered client spread, image and metrics" viewport="700x420"
 */
export interface SpreadProps {
  project: Project;
  /** Puts the text left and the image right. Alternate down the page. */
  flip?: boolean;
}

export declare function Spread(props: SpreadProps): JSX.Element;
