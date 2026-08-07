export interface AnalyticsHeatmapProps {
  rows: number;
  cols: number;
  cells: number[];
}

/**
 * A density grid, not a rendered page screenshot — each cell's opacity
 * reflects click volume in that region of the page (x/y stored as % of
 * document width/height, so this scales to any viewport). Simple and
 * dependency-free rather than a canvas-based gradient overlay.
 */
export function AnalyticsHeatmap({ rows, cols, cells }: AnalyticsHeatmapProps) {
  const max = Math.max(1, ...cells);

  return (
    <div
      className="grid w-full overflow-hidden border border-rule"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        aspectRatio: `${cols} / ${rows}`,
      }}
    >
      {cells.map((count, index) => {
        const intensity = count / max;
        return (
          <div
            key={index}
            title={count > 0 ? `${count} click${count === 1 ? "" : "s"}` : undefined}
            className="border border-rule/40"
            style={{
              backgroundColor:
                intensity > 0 ? `color-mix(in srgb, var(--color-accent) ${Math.round(intensity * 90)}%, transparent)` : "transparent",
            }}
          />
        );
      })}
    </div>
  );
}
