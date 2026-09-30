"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from "react";
import { useInView } from "./useInView";
import { useMagnetic, useTilt } from "./useTilt";
import { useScrollScale, type ScrollScale } from "./useScrollScale";

/**
 * Scroll-in presets (styles in src/styles/motion.css):
 * - blur-slide  fade + 20px rise + 4px blur (motion-primitives AnimatedGroup)
 * - fade-blur   fade + 12px blur (body copy, buttons)
 * - slide       fade + 16px rise (list rows)
 * - fade-up     fade + 90px rise (metric cards)
 * - card        fade + 64px rise, contents cascade in via `.kid` (job card, Core modules)
 * - fade        opacity only (images that also scroll-scale)
 * - pop / note  spring scale (doodles, sticky notes)
 * - rise        slow 60px rise with blur (footer wordmark)
 */
export type RevealVariant =
  "blur-slide" | "fade-blur" | "slide" | "fade-up" | "card" | "fade" | "pop" | "note" | "rise";

type OwnProps<T extends ElementType> = {
  as?: T;
  /** Omit for no scroll-in (e.g. a button its parent reveals). */
  variant?: RevealVariant;
  /** Seconds before this element starts (stagger). */
  delay?: number;
  /** Tilt toward the pointer, max degrees. Adds the green spotlight. */
  tilt?: number;
  /** Buttons: pull toward the pointer. */
  magnetic?: boolean;
  /** Scroll-scrubbed scale for images. */
  scrollScale?: ScrollScale;
  /** Glass shine sweep: once when the card lands, or looping (The Core). */
  shine?: "once" | "loop";
  onInView?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

type Props<T extends ElementType> = OwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof OwnProps<T>>;

export function Reveal<T extends ElementType = "div">({
  as,
  variant,
  delay,
  tilt,
  magnetic,
  scrollScale,
  shine,
  onInView,
  className,
  style,
  children,
  ...rest
}: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  useTilt(ref, tilt);
  useMagnetic(ref, !!magnetic);
  useScrollScale(ref, scrollScale);
  const fired = useRef(false);
  useEffect(() => {
    if (inView && variant && !fired.current) {
      fired.current = true;
      onInView?.();
    }
  }, [inView, variant, onInView]);

  const cls = [className, variant && inView ? "in" : ""].filter(Boolean).join(" ") || undefined;
  const st = { ...(delay ? { "--d": `${delay}s` } : {}), ...style } as CSSProperties;

  return (
    <Tag
      ref={ref}
      className={cls}
      style={st}
      data-reveal={variant}
      data-tilt={tilt}
      data-scale={scrollScale ? scrollScale.scale : undefined}
      data-shine={shine}
      {...rest}
    >
      {children}
      {shine && <span className="shine" aria-hidden="true" />}
    </Tag>
  );
}
