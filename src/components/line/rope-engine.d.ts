export type RopeOptions = {
  reduce: boolean;
  green: string;
  heroEvent: string;
  minWidth: number;
  ropeD: string;
  offset: [number, number];
};
/** Starts drawing the rope on the canvas; returns a stop function. */
export function startRope(canvas: HTMLCanvasElement, opts: RopeOptions): () => void;
