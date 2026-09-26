"use client";

import { useEffect } from "react";

/**
 * Marks the section being read in the desktop TOC rail. The current
 * heading is the last one that has scrolled past a line 30% down the
 * viewport, so a short section still gets its turn. Renders nothing:
 * the links are server HTML, this only toggles aria-current on them.
 */
export default function TocSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    const heads = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (heads.length === 0) return;
    const links = new Map(
      Array.from(document.querySelectorAll<HTMLAnchorElement>(".toc-rail [data-toc-link]")).map((a) => [
        a.dataset.tocLink,
        a,
      ]),
    );

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current = heads[0].id;
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      links.forEach((a, id) => {
        if (id === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids]);

  return null;
}
