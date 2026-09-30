"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { useInView } from "./useInView";

/**
 * Text split into animated units (styles in motion.css, [data-te]).
 * - "line": words rise together line by line (headings, Yuchat style). With `gradient`, the heading gets the
 *            navy → green fill, washed in after the lines land.
 * - "word": words fade in with blur one after another.
 * - "char": letters appear one by one; on `.eyebrow` a typing caret follows them.
 * `play` forces the reveal (the hero starts on load, not on scroll).
 */
type Props = {
  text: string;
  mode: "line" | "word" | "char";
  as?: ElementType;
  className?: string;
  id?: string;
  delay?: number;
  gradient?: boolean;
  /** Words from this index on get the accent fill (e.g. the second sentence). */
  accentFrom?: number;
  play?: boolean;
  style?: CSSProperties;
};

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function SplitText({ text, mode, as, className, id, delay, gradient, accentFrom, play, style }: Props) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref);
  const inView = play ?? seen;
  const parts = mode === "char" ? [...text] : text.split(/(\s+)/);
  const [lines, setLines] = useState<number[] | null>(null);
  const [grad, setGrad] = useState<{ w: number; h: number; pos: [number, number][] } | null>(null);

  // group words into lines at the moment they come into view (line breaks are final by then)
  useIsoLayoutEffect(() => {
    if (mode !== "line" || !inView || !ref.current) return;
    const ws = [...ref.current.querySelectorAll<HTMLElement>(".tw")];
    let ln = -1,
      last: number | null = null;
    setLines(
      ws.map((w) => {
        const t = w.offsetTop;
        if (last === null || Math.abs(t - last) > 4) {
          ln++;
          last = t;
        }
        return ln;
      }),
    );
  }, [inView, mode]);

  // one gradient laid over the whole heading: each word gets its slice
  useEffect(() => {
    if (!gradient || !ref.current) return;
    const el = ref.current;
    const paint = () => {
      const ws = [...el.querySelectorAll<HTMLElement>(".tw")];
      if (!ws.length) return;
      let x0 = 1e9,
        y0 = 1e9,
        x1 = -1e9,
        y1 = -1e9;
      ws.forEach((w) => {
        x0 = Math.min(x0, w.offsetLeft);
        y0 = Math.min(y0, w.offsetTop);
        x1 = Math.max(x1, w.offsetLeft + w.offsetWidth);
        y1 = Math.max(y1, w.offsetTop + w.offsetHeight);
      });
      setGrad({ w: x1 - x0, h: y1 - y0, pos: ws.map((w) => [w.offsetLeft - x0, w.offsetTop - y0]) });
    };
    paint();
    document.fonts?.ready.then(paint);
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => ro.disconnect();
  }, [gradient, text]);

  let i = 0,
    wi = 0;
  const units = parts.map((p, k) => {
    if (/^\s+$/.test(p)) {
      if (mode === "char") i++;
      return p;
    }
    const idx = i++;
    const word = wi++;
    const accent = accentFrom !== undefined && mode !== "char" && word >= accentFrom;
    const g = grad?.pos[word];
    const s = {
      "--i": mode === "line" ? (lines?.[word] ?? 0) : idx,
      ...(g ? { "--gx": `${g[0]}px`, "--gy": `${g[1]}px` } : {}),
    } as CSSProperties;
    return (
      <span key={k} className={accent ? "tw hl2" : "tw"} aria-hidden="true" style={s}>
        {p}
      </span>
    );
  });

  const isEyebrow = mode === "char" && className?.split(" ").includes("eyebrow");
  const st = {
    ...(delay ? { "--d": `${delay}s` } : {}),
    ...(grad ? { "--gw": `${grad.w}px`, "--gh": `${grad.h}px` } : {}),
    ...(isEyebrow ? { "--n": i } : {}),
    ...style,
  } as CSSProperties;
  const cls = [className, gradient ? "grad" : "", inView ? "in" : ""].filter(Boolean).join(" ");

  return (
    <Tag ref={ref} id={id} className={cls} style={st} data-te={mode} aria-label={text.trim()}>
      {units}
      {isEyebrow && <span className="caret" aria-hidden="true" />}
    </Tag>
  );
}
