import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

/**
 * Primary, secondary and ghost, resolved on either band.
 *
 * No colour is passed in and none is hardcoded: the band decides what
 * --berry and --ink are, so the same markup works on light and dark
 * without a prop. Hover, active and disabled live in globals.css rather
 * than in React state, which keeps this a server component.
 */
function classes(variant: Variant, size: Size, full: boolean, extra?: string) {
  return [
    "btn",
    `btn-${variant}`,
    size !== "md" && `btn-${size}`,
    full && "btn-full",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={classes(variant, size, full, className)} {...rest}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
};

/**
 * The same skin on a link. Kept separate rather than polymorphic,
 * because a call to action that navigates is an anchor and one that
 * submits is a button, and collapsing them into one component is how
 * sites end up with buttons that a keyboard cannot reach.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, full, className)} {...rest}>
      {children}
    </Link>
  );
}
