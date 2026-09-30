import { LETTER_DS, LOGO_VIEWBOX, MARK_D } from "./logo-paths";

/** Bricx logo: green rope mark + navy wordmark. `mono` renders both in one colour (footer). */
export function Logo({ width = 141, height = 40, mono }: { width?: number; height?: number; mono?: string }) {
  return (
    <svg width={width} height={height} viewBox={LOGO_VIEWBOX} aria-hidden="true">
      <path fill={mono ?? "#2BE080"} fillRule="evenodd" d={MARK_D} />
      <g fill={mono ?? "#03314B"}>
        {LETTER_DS.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </g>
    </svg>
  );
}
