import { describe, test, expect } from 'vitest';
import { calculateRebarMatrix } from '../rebarMatrixEngine';
import { CrossSectionSpec } from '../../types/sectionSchema';

describe('calculateRebarMatrix', () => {
  test('should compute correct stirrup rectangle dimensions', () => {
    const spec: CrossSectionSpec = {
      id: 'beam-1',
      componentType: 'beam',
      width: 300,
      depth: 500,
      clearCover: 30,
      longitudinalLayers: [],
      stirrups: { diameter: 8, spacing: 200 },
    };

    const result = calculateRebarMatrix(spec);

    // width - 2*cc = 300 - 60 = 240
    // depth - 2*cc = 500 - 60 = 440
    expect(result.stirrupRect).toEqual({
      x: 30,
      y: 30,
      width: 240,
      height: 440,
    });
  });

  test('should distribute longitudinal top and bottom bars symmetrically', () => {
    const spec: CrossSectionSpec = {
      id: 'beam-2',
      componentType: 'beam',
      width: 300,
      depth: 500,
      clearCover: 30,
      longitudinalLayers: [
        { barDiameter: 16, count: 2, side: 'top' },
        { barDiameter: 20, count: 3, side: 'bottom' },
      ],
      stirrups: { diameter: 8, spacing: 200 },
    };

    const result = calculateRebarMatrix(spec);

    // Top Layer: 2 bars
    // offset = 30 (cover) + 8 (stirrup) + 8 (half bar dia) = 46
    // x range: [46, 300 - 46] = [46, 254]
    const topBars = result.rebars.filter(rb => rb.diameter === 16);
    expect(topBars).toHaveLength(2);
    expect(topBars[0]!.point).toEqual({ x: 46, y: 46 });
    expect(topBars[1]!.point).toEqual({ x: 254, y: 46 });

    // Bottom Layer: 3 bars
    // offset = 30 (cover) + 8 (stirrup) + 10 (half bar dia) = 48
    // x range: [48, 150, 252]
    // y = 500 - 48 = 452
    const bottomBars = result.rebars.filter(rb => rb.diameter === 20);
    expect(bottomBars).toHaveLength(3);
    expect(bottomBars[0]!.point).toEqual({ x: 48, y: 452 });
    expect(bottomBars[1]!.point).toEqual({ x: 150, y: 452 });
    expect(bottomBars[2]!.point).toEqual({ x: 252, y: 452 });
  });
});
