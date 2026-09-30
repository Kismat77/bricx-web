"use client";

import { useEffect, type RefObject } from "react";
import { finePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Tilt + spotlight (motion-primitives style). Rotates toward the pointer up to `max` degrees
 * and feeds --mx/--my to the ::after spotlight defined in motion.css ([data-tilt]).
 */
export function useTilt<T extends HTMLElement>(ref: RefObject<T | null>, max?: number) {
  useEffect(() => {
    const card = ref.current;
    if (!card || !max || prefersReducedMotion() || !finePointer()) return;
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0,
      raf = 0,
      on = false;
    const step = () => {
      raf = 0;
      rx += (tx - rx) * 0.14;
      ry += (ty - ry) * 0.14;
      card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (Math.abs(tx - rx) > 0.02 || Math.abs(ty - ry) > 0.02) raf = requestAnimationFrame(step);
      else if (!on) card.style.transform = "";
    };
    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width,
        py = (e.clientY - r.top) / r.height;
      ty = (px - 0.5) * 2 * max;
      tx = -(py - 0.5) * 2 * max;
      on = true;
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
      if (!raf) raf = requestAnimationFrame(step);
    };
    const leave = () => {
      tx = ty = 0;
      on = false;
      if (!raf) raf = requestAnimationFrame(step);
    };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [ref, max]);
}

/** Magnetic pull toward the pointer (buttons). */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || prefersReducedMotion() || !finePointer()) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`;
    };
    const leave = () => (el.style.translate = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, enabled]);
}
