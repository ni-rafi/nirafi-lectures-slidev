export interface SignSegment {
  isPos: boolean;
  points: { x: number; y: number }[];
}

/**
 * Splits a list of continuous coordinates into segments that are strictly positive or negative.
 * Interpolates zero-crossing coordinates to prevent white gaps and ensure perfect sign coloring.
 */
export function splitIntoSignSegments(pts: { x: number; y: number }[]): SignSegment[] {
  if (pts.length === 0) return [];
  const segments: SignSegment[] = [];
  let current = [pts[0]!];
  let isPos = pts[0]!.y >= 0;

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]!;
    const curr = pts[i]!;
    const prevIsPos = prev.y >= 0;
    const currIsPos = curr.y >= 0;

    if (prevIsPos === currIsPos) {
      current.push(curr);
    } else {
      // Sign change! Linearly interpolate the zero-crossing x
      const dy = curr.y - prev.y;
      const t = -prev.y / (dy || 1e-12);
      const zeroPt = { x: prev.x + t * (curr.x - prev.x), y: 0 };

      // End the current segment with the zero point
      current.push(zeroPt);
      segments.push({ isPos, points: current });

      // Start a new segment with the zero point and the current point
      current = [zeroPt, curr];
      isPos = currIsPos;
    }
  }

  if (current.length > 0) {
    segments.push({ isPos, points: current });
  }

  return segments;
}

export const formatCoordinate = (x: number): string => `${x.toFixed(2)}m`;
export const formatForce = (f: number): string => `${f.toFixed(3)} kN`;
export const formatMoment = (m: number): string => `${m.toFixed(3)} kNm`;
export const formatSlope = (rad: number): string => `${rad.toFixed(6)} rad`;
export const formatDeflection = (defl: number): string => `${defl.toFixed(4)} mm`;

export function evalPoly(coeffs: number[], xVal: number): number {
  let val = 0;
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i];
    if (c !== undefined) {
      val = val * xVal + c;
    }
  }
  return val;
}
