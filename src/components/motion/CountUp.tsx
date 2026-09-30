"use client";

import { useEffect, useRef, useState } from "react";
import { motionOn } from "@/lib/motion";

const parse = (v: string) => {
  const m = v.match(/^(\D*)([\d.]+)(.*)$/);
  return m ? { pre: m[1], to: parseFloat(m[2]), dec: (m[2].split(".")[1] || "").length, suf: m[3] } : null;
};

/**
 * Counts the number inside a string ("Rs 2.4 Cr", "99.2%") up from 0 when `start` turns true.
 * Renders the final value on the server and when motion is off.
 */
export function CountUp({
  value,
  start,
  delay = 0,
  duration = 1600,
}: {
  value: string;
  start: boolean;
  delay?: number;
  duration?: number;
}) {
  const [text, setText] = useState(value);
  const done = useRef(false);

  // before the card is revealed, sit at zero so the count is visible
  useEffect(() => {
    const p = parse(value);
    if (p && motionOn() && !done.current) setText(p.pre + (0).toFixed(p.dec) + p.suf);
  }, [value]);

  useEffect(() => {
    const p = parse(value);
    if (!start || done.current || !p || !motionOn()) return;
    let raf = 0;
    const timer = setTimeout(
      () => {
        done.current = true;
        const t0 = performance.now();
        const step = (now: number) => {
          const u = Math.min(1, Math.max(0, (now - t0) / duration)), // rAF's frame time can predate t0
            e = 1 - Math.pow(1 - u, 4);
          setText(p.pre + (p.to * e).toFixed(p.dec) + p.suf);
          if (u < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      delay * 1000 + 150,
    );
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [start, delay, duration, value]);

  return <span aria-label={value}>{text}</span>;
}
