import { describe, test, expect } from 'vitest';
import { calculateSteelWeight } from '../steel';

describe('Steel Reinforcement Weight Estimation', () => {
  test('should calculate correct weight for standard reinforcement bars', () => {
    // Diameter = 12mm, Length = 100m
    // Unit weight = 12^2 / 162 = 144 / 162 = 0.88888... kg/m
    // Total weight = 0.88888... * 100 = 88.888... kg -> rounded to 88.889 kg
    const result = calculateSteelWeight(12, 100);
    expect(result.weightKg).toBe(88.889);
  });

  test('should handle negative diameter or length by returning 0', () => {
    const resultDiameter = calculateSteelWeight(-12, 100);
    expect(resultDiameter.weightKg).toBe(0);

    const resultLength = calculateSteelWeight(12, -100);
    expect(resultLength.weightKg).toBe(0);
  });

  test('should return 0 weight when length or diameter is 0', () => {
    const resultZeroLength = calculateSteelWeight(12, 0);
    expect(resultZeroLength.weightKg).toBe(0);

    const resultZeroDiameter = calculateSteelWeight(0, 100);
    expect(resultZeroDiameter.weightKg).toBe(0);
  });
});
