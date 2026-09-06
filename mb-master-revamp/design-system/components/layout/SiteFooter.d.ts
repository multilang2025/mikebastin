import * as React from "react";

/**
 * Contact block and footer navigation in one. Replaces the block that used to
 * be copy-pasted into every page.
 *
 * @startingPoint section="Layout" subtitle="Contact block plus footer nav" viewport="700x420"
 */
export interface SiteFooterProps {
  /** Shows the Valencia postal address. On the homepage only. */
  address?: boolean;
  eyebrow?: string;
  heading?: string;
  /** Slot under the contact details. Where the /contact/ form goes. */
  children?: React.ReactNode;
}

export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
