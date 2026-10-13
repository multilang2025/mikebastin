import type { ReactNode } from "react";

/**
 * The right-hand hero column that holds an illustration. Recycled
 * illustrations (`visibleOnMobile`) stack under the hero text on phones,
 * centred and capped at 320px like the originals' own mobile rule, and sit
 * to the right from lg up; the generic hero motifs stay desktop only, as
 * before, because on a phone they would push the lede off screen.
 */
export default function HeroArtSlot({
  children,
  visibleOnMobile,
  compactOnMobile = false,
}: {
  children: ReactNode;
  visibleOnMobile: boolean;
  compactOnMobile?: boolean;
}) {
  return (
    <div
      className={
        visibleOnMobile
          ? compactOnMobile
            ? "order-first mx-auto mb-5 w-[88px] lg:order-none lg:mx-0 lg:mb-0 lg:mt-24 lg:w-[min(360px,30vw)] lg:max-w-none"
            : "mx-auto mt-12 w-full max-w-[320px] lg:mx-0 lg:mt-24 lg:w-[min(360px,30vw)] lg:max-w-none"
          : "hidden w-[min(360px,30vw)] lg:mt-24 lg:block"
      }
    >
      {children}
    </div>
  );
}
