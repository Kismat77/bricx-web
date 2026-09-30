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
    });
  }, []);
  return <canvas ref={ref} className="page-line" aria-hidden="true" />;
}
