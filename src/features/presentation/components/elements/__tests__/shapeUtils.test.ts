import { describe, test, expect } from 'vitest';
import { samplePolygon, getShapePoints, getShapePath, resamplePath } from '../shapeUtils';

describe('Presentation Shape Geometry Utilities', () => {
  describe('samplePolygon', () => {
    test('should return N points for an empty vertices array', () => {
      const result = samplePolygon([], 10);
      expect(result).toHaveLength(10);
      result.forEach(p => {
        expect(p.x).toBe(0);
        expect(p.y).toBe(0);
      });
    });

    test('should sample points evenly along a simple shape perimeter', () => {
      // 10x10 square vertices
      const square = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: 10 },
      ];
      // Sample 4 points
      const result = samplePolygon(square, 4);
      expect(result).toHaveLength(4);
      // The sampled points should correspond to the corners/perimeter steps
      expect(result[0]).toEqual({ x: 0, y: 0 });
      expect(result[1]).toEqual({ x: 10, y: 0 });
      expect(result[2]).toEqual({ x: 10, y: 10 });
      expect(result[3]).toEqual({ x: 0, y: 10 });
    });
  });

  describe('getShapePoints', () => {
    test('should generate exactly N points for pre-built shape types', () => {
      const N = 80;
      const w = 100;
      const h = 100;

      const shapes = ['circle', 'rect', 'triangle', 'pentagon', 'hexagon', 'star', 'cross', 'arrow', 'parallelogram', 'rhombus', 'heart'];
      shapes.forEach(shape => {
        const points = getShapePoints(shape, w, h, N);
        expect(points, `Shape ${shape} did not return exactly ${N} points`).toHaveLength(N);
      });
    });

    test('should handle rectangle border radius correctly', () => {
      const pointsNoRadius = getShapePoints('rect', 100, 100, 100, undefined, 0);
      const pointsWithRadius = getShapePoints('rect', 100, 100, 100, undefined, 10);
      expect(pointsNoRadius).toHaveLength(100);
      expect(pointsWithRadius).toHaveLength(100);
      expect(pointsNoRadius).not.toEqual(pointsWithRadius);
    });

    test('should scale custom polygons', () => {
      const customPoly = [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 25, y: 50 }
      ];
      const points = getShapePoints('polygon', 100, 100, 30, customPoly);
      expect(points).toHaveLength(30);
    });
  });

  describe('getShapePath', () => {
    test('should return a valid path string starting with M and ending with Z', () => {
      const path = getShapePath('circle', 100, 100, 20);
      expect(path).toMatch(/^M\s/);
      expect(path).toMatch(/\sZ$/);
    });
  });

  describe('resamplePath', () => {
    test('should fallback gracefully to original path in Node environments', () => {
      const d = 'M 0,0 L 10,0 L 10,10 Z';
      const result = resamplePath(d, 50);
      expect(result).toBe(d); // returns input directly when document is undefined
    });
  });
});
