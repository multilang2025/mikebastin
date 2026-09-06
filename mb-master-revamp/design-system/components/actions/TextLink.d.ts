import * as React from "react";

/** Inline link. Berry, no text-decoration, hairline underline draws in on hover. */
export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** CSS font-size, e.g. ".88rem". Inherits when omitted. */
  size?: string;
  weight?: number;
  /** Adds target and rel for off-site links. */
  external?: boolean;
  children?: React.ReactNode;
}

export declare function TextLink(props: TextLinkProps): JSX.Element;
