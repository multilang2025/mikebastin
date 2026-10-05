"use client";

import { useEffect, useRef } from "react";

export default function BastinIdeasGraphic() {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const track = trackRef.current;
    const arrow = arrowRef.current;
    const container = svg?.parentElement;
    const maskPath = maskPathRef.current;
    if (!svg || !track || !maskPath || !arrow || !container) return;

    let points: { x: number; y: number; pageY: number }[] = [];
    let pathLength = 0;
    let frame = 0;
    let animationFrame = 0;
    let arrowDistance = 0;
    let trailDistance = 0;
    let targetDistance = 0;
    let initialized = false;

    const measure = () => {
      const bounds = container.getBoundingClientRect();
      const letters = Array.from(container.querySelectorAll<HTMLElement>("[data-bastin-letter]"));
      const descriptions = Array.from(container.querySelectorAll<HTMLElement>("[data-bastin-copy]"));
      if (letters.length === 0) return;

      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      const textRight = descriptions.map((description) => {
        const range = document.createRange();
        range.selectNodeContents(description);
        const rects = Array.from(range.getClientRects());
        return rects.length ? Math.max(...rects.map((rect) => rect.right)) - bounds.left : 0;
      });
      const furthestText = textRight.length
        ? Math.max(...textRight)
        : Math.max(
            ...letters.map((letter) => letter.getBoundingClientRect().right - bounds.left),
          );
      const trailLaneX = Math.min(furthestText + 34, bounds.width - 18);
      points = letters.map((letter, index) => {
        const rect = letter.getBoundingClientRect();
        return {
          x: Math.min(trailLaneX + (index % 2 === 0 ? 8 : -8), bounds.width - 18),
          y: rect.top + rect.height / 2 - bounds.top,
          pageY: rect.top + window.scrollY + rect.height / 2,
        };
      });

      const curve = points.reduce((d, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;
        const previous = points[index - 1];
        const middleY = (previous.y + point.y) / 2;
        const bend = index % 2 === 0 ? 26 : -26;
        return `${d} Q ${(previous.x + point.x) / 2 + bend} ${middleY} ${point.x} ${point.y}`;
      }, "");
      track.setAttribute("d", curve);
      maskPath.setAttribute("d", curve);
      pathLength = track.getTotalLength();
      arrowDistance = Math.min(arrowDistance, pathLength);
      trailDistance = Math.min(trailDistance, pathLength);
      updateArrow();
    };

    const renderArrow = () => {
      const position = track.getPointAtLength(arrowDistance);
      const next = track.getPointAtLength(Math.min(pathLength, arrowDistance + 1));
      const angle =
        arrowDistance >= pathLength - 0.5
          ? 90
          : (Math.atan2(next.y - position.y, next.x - position.x) * 180) / Math.PI;
      arrow.setAttribute("transform", `translate(${position.x} ${position.y}) rotate(${angle})`);
    };

    const updateArrow = () => {
      if (points.length === 0 || pathLength === 0) return;
      const readingLine = window.scrollY + window.innerHeight * 0.48;
      const index = points.findIndex((point) => point.pageY >= readingLine);
      let progress = 0;
      if (index < 0) {
        progress = 1;
      } else if (index > 0) {
        const before = points[index - 1];
        const after = points[index];
        const amount = Math.max(
          0,
          Math.min(1, (readingLine - before.pageY) / (after.pageY - before.pageY)),
        );
        progress = (index - 1 + amount) / (points.length - 1);
      }

      targetDistance = pathLength * progress;

      if (!initialized) {
        arrowDistance = targetDistance;
        trailDistance = targetDistance;
        initialized = true;
        renderArrow();
        maskPath.setAttribute("stroke-dasharray", `${trailDistance} ${pathLength}`);
      } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (animationFrame) window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        arrowDistance = targetDistance;
        trailDistance = targetDistance;
        renderArrow();
        maskPath.setAttribute("stroke-dasharray", `${trailDistance} ${pathLength}`);
      } else if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(advancePath);
      }
    };

    const advancePath = () => {
      const arrowGap = targetDistance - arrowDistance;
      arrowDistance += arrowGap * 0.3;
      if (Math.abs(arrowGap) < 0.5) arrowDistance = targetDistance;

      const trailGap = arrowDistance - trailDistance;
      trailDistance += trailGap * 0.48;
      if (Math.abs(trailGap) < 0.5) trailDistance = arrowDistance;

      renderArrow();
      maskPath.setAttribute("stroke-dasharray", `${trailDistance} ${pathLength}`);

      if (Math.abs(targetDistance - arrowDistance) < 0.5 && Math.abs(arrowDistance - trailDistance) < 0.5) {
        animationFrame = 0;
      } else {
        animationFrame = window.requestAnimationFrame(advancePath);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateArrow();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(container);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="bastin-letter-trail absolute inset-0 h-full w-full overflow-visible"
    >
      <defs>
        <mask id="bastin-letter-trail-mask" maskUnits="userSpaceOnUse">
          <path ref={maskPathRef} className="bastin-letter-trail-mask" />
        </mask>
      </defs>
      <path
        ref={trackRef}
        className="bastin-letter-trail-path"
        mask="url(#bastin-letter-trail-mask)"
      />
      <g ref={arrowRef} className="bastin-letter-trail-arrow">
        <path d="M-5 -6 L3 0 L-5 6" />
      </g>
    </svg>
  );
}
