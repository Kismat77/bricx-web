/** True when scroll-in motion is on (html.anim is set before paint in app/layout.tsx). */
export const motionOn = () => typeof document !== "undefined" && document.documentElement.classList.contains("anim");

/** True when the user asked the OS for reduced motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Fine pointer with hover (desktop mouse / trackpad). */
export const finePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const sstep = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/** Seconds → CSS custom property value used by the motion presets (`--d`). */
export const delayVar = (s?: number) => (s ? { ["--d" as string]: `${s}s` } : {});
