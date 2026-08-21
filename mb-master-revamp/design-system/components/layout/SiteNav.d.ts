import * as React from "react";

/**
 * The one header. Wave mark plus wordmark left, five links right.
 *
 * @startingPoint section="Layout" subtitle="Sticky 62px header with the wave mark" viewport="700x120"
 */
export interface SiteNavProps {
  links?: Array<{ href: string; label: string }>;
  /** href of the current page. Renders that link in berry. */
  active?: string;
}

export declare function SiteNav(props: SiteNavProps): JSX.Element;
