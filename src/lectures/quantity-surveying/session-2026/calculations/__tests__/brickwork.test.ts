import { describe, test, expect } from 'vitest';
import { calculateBrickwork } from '../brickwork';

describe('Brickwork Masonry & Mortar Estimation', () => {
  test('should calculate correct brick count and mortar volume with standard parameters', () => {
    // Wall Area = 10m2, Wall Thickness = 0.24m (volume = 2.4m3)
    // Brick dimensions: 0.24 x 0.115 x 0.07 (volume = 0.001932 m3)
    // Mortar joint thickness: 0.01
    // Brick + Mortar dimensions: 0.25 x 0.125 x 0.08 (volume = 0.0025 m3)
    // Expected Brick Count = Math.ceil(2.4 / 0.0025) = 960 bricks
    // Expected Mortar Volume = 2.4 - (960 * 0.001932) = 2.4 - 1.85472 = 0.54528 -> 0.545 m3
    const result = calculateBrickwork(10, 0.24, 0.24, 0.115, 0.07, 0.01);
    expect(result.brickCount).toBe(960);
    expect(result.mortarVolume).toBe(0.545);
  });

  test('should fallback to default brick dimensions if invalid (zero or negative) values are passed', () => {
    // default size is 0.24 x 0.115 x 0.07
    const result = calculateBrickwork(10, 0.24, -0.1, 0, 0, 0.01);
    expect(result.brickCount).toBe(960);
  });

  test('should return 0 bricks and 0 mortar volume if wall dimensions are negative or zero', () => {
    const resultArea = calculateBrickwork(-10, 0.24, 0.24, 0.115, 0.07, 0.01);
    expect(resultArea.brickCount).toBe(0);
    expect(resultArea.mortarVolume).toBe(0);

    const resultThickness = calculateBrickwork(10, 0, 0.24, 0.115, 0.07, 0.01);
    expect(resultThickness.brickCount).toBe(0);
    expect(resultThickness.mortarVolume).toBe(0);
  });

  test('should fallback to 0.01m mortar thickness if a negative mortar thickness is passed', () => {
    const result = calculateBrickwork(10, 0.24, 0.24, 0.115, 0.07, -0.05);
    expect(result.brickCount).toBe(960);
  });
});
