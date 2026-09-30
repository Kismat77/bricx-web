"use client";

import { useEffect, useState, type RefObject } from "react";
import { motionOn } from "@/lib/motion";

type Options = { rootMargin?: string; threshold?: number; once?: boolean };

/**
 * Reports when an element scrolls into view. Matches the original page:
 * trigger 10% above the bottom of the viewport, 12% visible, once.
 * When motion is off it reports `true` immediately so nothing stays hidden.
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px 0px -10% 0px", threshold = 0.12, once = true }: Options = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionOn()) {
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}
