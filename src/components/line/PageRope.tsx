"use client";

import { useEffect, useRef } from "react";
import { startRope } from "./rope-engine";
import { ROPE_D, ROPE_OFFSET } from "./rope-path";
import { HERO_GO_EVENT } from "@/components/sections/Hero";
import { siteConfig } from "@/config/site";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * The Bricx rope: a fixed canvas behind every section that draws the rope as you scroll.
 * Starts its intro with the hero headline (HERO_GO_EVENT). Hidden below 1280px.
 */
export function PageRope() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return startRope(ref.current, {
      reduce: prefersReducedMotion(),
      green: siteConfig.ropeColor,
      heroEvent: HERO_GO_EVENT,
      minWidth: siteConfig.ropeMinWidth,
      ropeD: ROPE_D,
      offset: ROPE_OFFSET,
      highlight: () => {
        // x-height band of the headline's last line ("one platform."): covers o n e a r m; l t f and the p's tail may overflow.
        // From font metrics, so the rising words' transforms don't matter.
        const h1 = document.getElementById("heroTitle"), ws = h1 ? [...h1.querySelectorAll<HTMLElement>(".w")] : [];
        if (!h1 || !ws.length) return null;
        const lastTop = Math.max(...ws.map((w) => w.offsetTop)), line = ws.filter((w) => Math.abs(w.offsetTop - lastTop) < 4);
        const cs = getComputedStyle(h1), ctx = document.createElement("canvas").getContext("2d");
        if (!ctx) return null;
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText("onearm");
        const r0 = line[0].getBoundingClientRect(), r1 = line[line.length - 1].getBoundingClientRect();
        const lh = parseFloat(cs.lineHeight), fx = document.documentElement.clientWidth / 2 - 720;
        const base = r0.top + scrollY + (lh - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
        return { x0: r0.left - fx, x1: r1.right - fx, top: base - m.actualBoundingBoxAscent, bottom: base + m.actualBoundingBoxDescent };
      },
      end: () => {
        const band = document.getElementById("demo"), foot = document.querySelector("footer");
        if (!band || !foot) return null;
        return { top: band.getBoundingClientRect().top + scrollY, bottom: foot.getBoundingClientRect().top + scrollY };
      },
    });
  }, []);
  return <canvas ref={ref} className="page-line" aria-hidden="true" />;
}
