"use client";

import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export type ScrollScale = { scale: number; zoom?: number };

/**
 * Scroll-scrubbed image scale: the frame grows from `scale` to 1 while the photo inside settles from `zoom` to 1,
 * as the element's top moves from the bottom of the viewport to 20% from the top. Eased and smoothed.
 * Writes --s0 / --z0 / --sp; the transforms live in motion.css ([data-scale]).
 */
export function useScrollScale<T extends HTMLElement>(ref: RefObject<T | null>, opts?: ScrollScale) {
  const scale = opts?.scale,
    zoom = opts?.zoom ?? 1;
  useEffect(() => {
    const el = ref.current;
    if (!el || scale === undefined || prefersReducedMotion()) return;
    el.style.setProperty("--s0", String(scale));
    el.style.setProperty("--z0", String(zoom));
    el.style.willChange = "transform";
    let top = 0,
      cur = 0,
      raf = 0;
    const measure = () => {
      let y = 0,
        n: HTMLElement | null = el;
      while (n) {
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      top = y;
    };
    const target = () => {
      const vh = innerHeight,
        p = Math.min(1, Math.max(0, (scrollY + vh - top) / (vh * 0.8)));
      return 1 - (1 - p) * (1 - p);
    };
    const step = () => {
      raf = 0;
      const t = target(),
        d = t - cur;
      cur = Math.abs(d) < 0.0008 ? t : cur + d * 0.14;
      el.style.setProperty("--sp", cur.toFixed(4));
      if (cur !== t) raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const remeasure = () => {
      measure();
      kick();
    };
    measure();
    cur = target();
    el.style.setProperty("--sp", cur.toFixed(4));
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", remeasure);
    addEventListener("load", remeasure);
    return () => {
      removeEventListener("scroll", kick);
      removeEventListener("resize", remeasure);
      removeEventListener("load", remeasure);
      cancelAnimationFrame(raf);
    };
  }, [ref, scale, zoom]);
}
