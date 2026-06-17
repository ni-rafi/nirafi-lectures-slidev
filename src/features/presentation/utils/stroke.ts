import { Point } from '../types';

export interface PointWithPressure extends Point {
  pressure: number;
}

/**
 * Calculates a closed polygon outline path for a stylus/mouse stroke.
 * For each point, it computes normal vectors relative to direction, offsets left and right
 * based on current pressure, and returns the joined closed loop.
 */
export function getStrokePolygon(points: PointWithPressure[], baseWidth: number): Point[] {
  if (points.length === 0) return [];
  
  if (points.length === 1) {
    const p = points[0]!;
    const r = (baseWidth * (0.2 + 1.2 * p.pressure)) / 2;
    // Return a small octagon approximation of a circle
    return [
      { x: p.x - r, y: p.y },
      { x: p.x - r * 0.7, y: p.y - r * 0.7 },
      { x: p.x, y: p.y - r },
      { x: p.x + r * 0.7, y: p.y - r * 0.7 },
      { x: p.x + r, y: p.y },
      { x: p.x + r * 0.7, y: p.y + r * 0.7 },
      { x: p.x, y: p.y + r },
      { x: p.x - r * 0.7, y: p.y + r * 0.7 },
    ];
  }

  const leftPoints: Point[] = [];
  const rightPoints: Point[] = [];

  for (let i = 0; i < points.length; i++) {
    const curr = points[i]!;
    
    // Determine direction vector
    let dx = 0;
    let dy = 0;

    if (i === 0) {
      const next = points[i + 1]!;
      dx = next.x - curr.x;
      dy = next.y - curr.y;
    } else if (i === points.length - 1) {
      const prev = points[i - 1]!;
      dx = curr.x - prev.x;
      dy = curr.y - prev.y;
    } else {
      const prev = points[i - 1]!;
      const next = points[i + 1]!;
      dx = next.x - prev.x;
      dy = next.y - prev.y;
    }

    const len = Math.sqrt(dx * dx + dy * dy);
    
    // Normal perpendicular vector (pointing to the left)
    const nx = len === 0 ? 0 : -dy / len;
    const ny = len === 0 ? 0 : dx / len;

    // Calligraphy pressure-based half-width: from 20% to 140% of base brush width
    const r = (baseWidth * (0.3 + 1.1 * curr.pressure)) / 2;

    leftPoints.push({
      x: curr.x + nx * r,
      y: curr.y + ny * r,
    });
    rightPoints.push({
      x: curr.x - nx * r,
      y: curr.y - ny * r,
    });
  }

  // Connect left points (start to end) and right points (end to start) to form a closed loop
  return [...leftPoints, ...rightPoints.reverse()];
}
