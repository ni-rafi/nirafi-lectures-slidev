import { describe, test, expect } from 'vitest';
import {
  toPixelX,
  toPixelY,
  toMeterX,
  toMeterY,
  getSnappedPosition
} from '../hooks/useFrameBuilder';
import { INode } from '../types/frame';

describe('2D Frame Coordinate Mapping', () => {
  test('should map meter coordinates to pixels and back accurately', () => {
    const x = 5.5; // meters
    const y = 3.25; // meters

    const px = toPixelX(x);
    const py = toPixelY(y);

    expect(toMeterX(px)).toBe(x);
    expect(toMeterY(py)).toBe(y);
  });

  test('should handle origin coordinate mapping correctly', () => {
    expect(toPixelX(0)).toBe(80); // X_ORIGIN
    expect(toPixelY(0)).toBe(370); // Y_ORIGIN

    expect(toMeterX(80)).toBe(0);
    expect(toMeterY(370)).toBe(0);
  });
});

describe('2D Frame Grid Snapping', () => {
  const mockNodes: INode[] = [
    { id: 'node_1', x: 2.0, y: 1.0 },
    { id: 'node_2', x: 4.0, y: 3.0 }
  ];

  test('should snap to existing nodes if within threshold', () => {
    // 2.1, 0.95 is very close to node_1 (2.0, 1.0)
    const result = getSnappedPosition(2.1, 0.95, true, 0.5, mockNodes, 0.25);
    expect(result.snappedNode).toEqual(mockNodes[0]);
    expect(result.x).toBe(2.0);
    expect(result.y).toBe(1.0);
  });

  test('should not snap to node if outside threshold, but snap to grid', () => {
    // 2.3, 0.9 is outside 0.25m threshold from node_1, so it should snap to nearest grid 0.5m point (2.5, 1.0)
    const result = getSnappedPosition(2.35, 0.9, true, 0.5, mockNodes, 0.25);
    expect(result.snappedNode).toBeNull();
    expect(result.x).toBe(2.5);
    expect(result.y).toBe(1.0);
  });

  test('should snap to grid points when snapToGrid is enabled', () => {
    const result = getSnappedPosition(1.68, 2.12, true, 0.5, [], 0.25);
    expect(result.x).toBe(1.5);
    expect(result.y).toBe(2.0);
  });

  test('should return exact coordinates (rounded) when snapToGrid is disabled', () => {
    const result = getSnappedPosition(1.683, 2.127, false, 0.5, [], 0.25);
    expect(result.x).toBe(1.68);
    expect(result.y).toBe(2.13);
  });
});
