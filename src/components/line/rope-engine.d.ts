export type RopeOptions = {
  reduce: boolean;
  green: string;
  heroEvent: string;
  minWidth: number;
  ropeD: string;
  offset: [number, number];
  /** Page-y box of the closing band (its top, and the footer's top). The rope's tail is routed around it. */
  end?: () => { top: number; bottom: number } | null;
  /** Box (page-frame x, page y) the rope covers like a highlighter: the x-height band of the hero's last headline line. */
  highlight?: () => { x0: number; x1: number; top: number; bottom: number } | null;
};
/** Starts drawing the rope on the canvas; returns a stop function. */
export function startRope(canvas: HTMLCanvasElement, opts: RopeOptions): () => void;
