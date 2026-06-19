import { describe, test, expect } from 'vitest';
import { calculateConcreteVolume } from '../concrete';

describe('Concrete Volumetric Estimation', () => {
  test('should calculate volume with default wastage factor of 5%', () => {
    // 10 * 0.3 * 0.4 * 1.05 = 1.26
    const result = calculateConcreteVolume(10, 0.3, 0.4);
    expect(result.volume).toBe(1.26);
  });

  test('should calculate volume with custom wastage factor', () => {
    // 10 * 0.3 * 0.4 * 1.10 = 1.32
    const result = calculateConcreteVolume(10, 0.3, 0.4, 0.10);
    expect(result.volume).toBe(1.32);
  });

  test('should round volume to exactly 3 decimal places', () => {
    // 10.123 * 0.345 * 0.456 * 1.05 = 1.672177878... -> 1.672
    const result = calculateConcreteVolume(10.123, 0.345, 0.456, 0.05);
    expect(result.volume).toBe(1.672);
  });

  test('should default negative dimensions to 0', () => {
    const resultLength = calculateConcreteVolume(-10, 0.3, 0.4);
    expect(resultLength.volume).toBe(0);

    const resultWidth = calculateConcreteVolume(10, -0.3, 0.4);
    expect(resultWidth.volume).toBe(0);

    const resultHeight = calculateConcreteVolume(10, 0.3, -0.4);
    expect(resultHeight.volume).toBe(0);
  });

  test('should handle negative wastage factor by defaulting to 0', () => {
    // 10 * 0.3 * 0.4 * 1.00 = 1.20
    const result = calculateConcreteVolume(10, 0.3, 0.4, -0.05);
    expect(result.volume).toBe(1.20);
  });
});
