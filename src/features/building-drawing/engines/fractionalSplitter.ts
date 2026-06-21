import { Point2D } from '../types/geometry';
import { ElementColorOverride } from '../types/layoutSchema';

export interface HighlightPathSegment {
  p1: Point2D;
  p2: Point2D;
  fillClass?: string;
  strokeClass?: string;
}

/**
 * Computes coordinate segments for fractional color highlighting.
 */
export function computeFractionalSegments(
  start: Point2D,
  end: Point2D,
  highlights: ElementColorOverride[]
): HighlightPathSegment[] {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  return highlights.map(hl => {
    // Clamp fractions to [0, 1] bounds
    const s = Math.max(0, Math.min(1, hl.startFraction));
    const e = Math.max(0, Math.min(1, hl.endFraction));

    return {
      p1: { x: start.x + dx * s, y: start.y + dy * s },
      p2: { x: start.x + dx * e, y: start.y + dy * e },
      fillClass: hl.fillClass,
      strokeClass: hl.strokeClass,
    };
  });
}
