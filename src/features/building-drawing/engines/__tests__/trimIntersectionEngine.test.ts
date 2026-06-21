import { describe, test, expect } from 'vitest';
import { trimBeamToColumnFaces } from '../trimIntersectionEngine';
import { Point2D, BoxGeometry } from '../../types/geometry';

describe('trimBeamToColumnFaces', () => {
  test('should return original centers if no columns are passed', () => {
    const startCenter: Point2D = { x: 100, y: 100 };
    const endCenter: Point2D = { x: 300, y: 100 };

    const result = trimBeamToColumnFaces(startCenter, endCenter);

    expect(result.start).toEqual(startCenter);
    expect(result.end).toEqual(endCenter);
  });

  test('should trim beam start and end to column face boundaries', () => {
    const startCenter: Point2D = { x: 100, y: 100 };
    const endCenter: Point2D = { x: 300, y: 100 };

    const startColumn: BoxGeometry = {
      id: 'col-1',
      topLeft: { x: 80, y: 80 },
      width: 40,
      height: 40,
    };

    const endColumn: BoxGeometry = {
      id: 'col-2',
      topLeft: { x: 280, y: 80 },
      width: 40,
      height: 40,
    };

    // Horizontal beam of length 200 running left to right
    const result = trimBeamToColumnFaces(startCenter, endCenter, 0, startColumn, endColumn);

    // Start column center (100, 100) with width 40 -> face is at x = 120
    expect(result.start.x).toBe(120);
    expect(result.start.y).toBe(100);

    // End column center (300, 100) with width 40 -> face is at x = 280
    expect(result.end.x).toBe(280);
    expect(result.end.y).toBe(100);
  });

  test('should apply transverse eccentricity offset shifts', () => {
    const startCenter: Point2D = { x: 100, y: 100 };
    const endCenter: Point2D = { x: 300, y: 100 };

    // Shift beam down by 10 units perpendicularly
    // Direction: (1, 0) -> Perpendicular: (0, 1)
    const result = trimBeamToColumnFaces(startCenter, endCenter, 10);

    expect(result.start).toEqual({ x: 100, y: 110 });
    expect(result.end).toEqual({ x: 300, y: 110 });
  });
});
