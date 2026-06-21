import { GridSystem } from '../types/layoutSchema';
import { Point2D } from '../types/geometry';

/**
 * Resolves grid alphanumeric intersection ids into absolute coordinates.
 * Returns (0, 0) if ids cannot be found.
 */
export function resolveGridIntersection(
  gridXId: string,
  gridYId: string,
  grid: GridSystem
): Point2D {
  const xLine = grid.xAxes.find(a => a.id === gridXId);
  const yLine = grid.yAxes.find(a => a.id === gridYId);
  return {
    x: xLine ? xLine.offset : 0,
    y: yLine ? yLine.offset : 0,
  };
}
