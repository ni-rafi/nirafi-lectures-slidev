import { Point2D, BoxGeometry } from '../types/geometry';

/**
 * Trims a beam centerline vector to start and end at the column faces
 * rather than their centers, accounting for a transverse eccentricity offset.
 */
export function trimBeamToColumnFaces(
  startCenter: Point2D,
  endCenter: Point2D,
  eccentricity: number = 0,
  startColumn?: BoxGeometry,
  endColumn?: BoxGeometry
): { start: Point2D; end: Point2D } {
  const dx = endCenter.x - startCenter.x;
  const dy = endCenter.y - startCenter.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  if (length === 0) {
    return { start: { ...startCenter }, end: { ...endCenter } };
  }

  const ux = dx / length;
  const uy = dy / length;

  // Calculate perpendicular vector for eccentricity offset
  const px = -uy;
  const py = ux;

  // Apply eccentricity translation
  const startShifted = {
    x: startCenter.x + px * eccentricity,
    y: startCenter.y + py * eccentricity,
  };
  const endShifted = {
    x: endCenter.x + px * eccentricity,
    y: endCenter.y + py * eccentricity,
  };

  const start = { ...startShifted };
  const end = { ...endShifted };

  // Helper to calculate projection distance to rectangle edges from center
  const getIntersectionT = (width: number, height: number, dirX: number, dirY: number): number => {
    const tx = dirX === 0 ? Infinity : (width / 2) / Math.abs(dirX);
    const ty = dirY === 0 ? Infinity : (height / 2) / Math.abs(dirY);
    return Math.min(tx, ty);
  };

  if (startColumn) {
    const t = getIntersectionT(startColumn.width, startColumn.height, ux, uy);
    if (isFinite(t) && t < length) {
      start.x = startShifted.x + ux * t;
      start.y = startShifted.y + uy * t;
    }
  }

  if (endColumn) {
    const t = getIntersectionT(endColumn.width, endColumn.height, ux, uy);
    if (isFinite(t) && t < length) {
      end.x = endShifted.x - ux * t;
      end.y = endShifted.y - uy * t;
    }
  }

  return { start, end };
}
