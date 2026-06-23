import { describe, test, expect } from 'vitest';
import {
  calculateSteelWeightInternal,
  calculateStirrupsCountInternal,
  calculateHookAdditionInternal,
  calculateCrankAdditionInternal,
  calculatePlateWeightInternal,
  calculateRafterLengthInternal,
  calculatePurlinsCountInternal
} from '../steel';

describe('Steel Reinforcement Module', () => {
  test('should calculate correct rebar weight in kilograms', () => {
    // Formula: Weight = (D^2 / 162) * L
    // D = 16mm, L = 100m -> (256 / 162) * 100 = 1.5802469 * 100 = 158.025
    const result = calculateSteelWeightInternal(16, 100);
    expect(result.weightKg).toBe(158.025);
  });

  test('should return 0 weight if inputs are negative', () => {
    const result1 = calculateSteelWeightInternal(-16, 100);
    expect(result1.weightKg).toBe(0);

    const result2 = calculateSteelWeightInternal(16, -100);
    expect(result2.weightKg).toBe(0);
  });

  test('should compute weight correctly for standard diameters like 10mm and 12mm', () => {
    // D=10mm, L=10m -> (100 / 162) * 10 = 6.173
    const result10 = calculateSteelWeightInternal(10, 10);
    expect(result10.weightKg).toBe(6.173);

    // D=12mm, L=10m -> (144 / 162) * 10 = 8.889
    const result12 = calculateSteelWeightInternal(12, 10);
    expect(result12.weightKg).toBe(8.889);
  });

  describe('Stirrup Count Calculation', () => {
    test('should return correct number of stirrups for basic cases', () => {
      // Clear span = 3.0m, Spacing = 0.15m -> (3.0 / 0.15) + 1 = 20 + 1 = 21
      expect(calculateStirrupsCountInternal(3.0, 0.15)).toBe(21);

      // Clear span = 2.0m, Spacing = 0.20m -> (2.0 / 0.20) + 1 = 10 + 1 = 11
      expect(calculateStirrupsCountInternal(2.0, 0.20)).toBe(11);
    });

    test('should round down if clear span / spacing does not divide evenly', () => {
      // Clear span = 3.05m, Spacing = 0.15m -> floor(20.33) + 1 = 21
      expect(calculateStirrupsCountInternal(3.05, 0.15)).toBe(21);

      // Clear span = 3.14m, Spacing = 0.15m -> floor(20.93) + 1 = 21
      expect(calculateStirrupsCountInternal(3.14, 0.15)).toBe(21);
    });

    test('should return 0 for negative or zero inputs', () => {
      expect(calculateStirrupsCountInternal(-3.0, 0.15)).toBe(0);
      expect(calculateStirrupsCountInternal(3.0, -0.15)).toBe(0);
      expect(calculateStirrupsCountInternal(0, 0.15)).toBe(0);
    });
  });

  describe('Hook Addition Length', () => {
    test('should calculate correct hook length addition in meters', () => {
      // 16mm diameter, 2 hooks -> 2 * 9 * 16 = 288mm = 0.288m
      expect(calculateHookAdditionInternal(16, 2)).toBe(0.288);

      // 10mm diameter, 1 hook -> 1 * 9 * 10 = 90mm = 0.090m
      expect(calculateHookAdditionInternal(10, 1)).toBe(0.09);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateHookAdditionInternal(-10, 2)).toBe(0);
      expect(calculateHookAdditionInternal(10, -2)).toBe(0);
    });
  });

  describe('Crank Addition Length', () => {
    test('should calculate correct crank length addition in meters', () => {
      // effective depth = 0.12m, 2 cranks -> 2 * 0.42 * 0.12 = 0.1008 -> 0.101m
      expect(calculateCrankAdditionInternal(0.12, 2)).toBe(0.101);

      // effective depth = 0.15m, 1 crank -> 1 * 0.42 * 0.15 = 0.063m
      expect(calculateCrankAdditionInternal(0.15, 1)).toBe(0.063);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateCrankAdditionInternal(-0.12, 2)).toBe(0);
      expect(calculateCrankAdditionInternal(0.12, 0)).toBe(0);
    });
  });

  describe('Plate Weight Calculation', () => {
    test('should calculate correct plate weight in kilograms', () => {
      // 0.4m * 0.4m * 0.012m (12mm) * 7850 kg/m³ = 1.92 * 7.85 = 15.072 kg
      expect(calculatePlateWeightInternal(0.4, 0.4, 0.012)).toBe(15.072);

      // 0.3m * 0.3m * 0.008m (8mm) * 7850 = 0.72 * 7.85 = 5.652 kg
      expect(calculatePlateWeightInternal(0.3, 0.3, 0.008)).toBe(5.652);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculatePlateWeightInternal(-0.4, 0.4, 0.012)).toBe(0);
      expect(calculatePlateWeightInternal(0.4, 0.4, 0)).toBe(0);
    });
  });

  describe('Rafter Length Calculation', () => {
    test('should calculate correct sloped rafter length in meters', () => {
      // Rise = 2.5m, Half-span = 6.0m -> sqrt(6.25 + 36) = sqrt(42.25) = 6.50m
      expect(calculateRafterLengthInternal(2.5, 6.0)).toBe(6.5);

      // Rise = 3.0m, Half-span = 4.0m -> sqrt(9 + 16) = sqrt(25) = 5.0m
      expect(calculateRafterLengthInternal(3.0, 4.0)).toBe(5);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateRafterLengthInternal(-2.5, 6.0)).toBe(0);
      expect(calculateRafterLengthInternal(2.5, -6.0)).toBe(0);
    });
  });

  describe('Purlin Count Calculation', () => {
    test('should calculate correct number of purlins', () => {
      // Rafter = 6.5m, Spacing = 1.3m -> (6.5 / 1.3) + 1 = 5 + 1 = 6
      expect(calculatePurlinsCountInternal(6.5, 1.3)).toBe(6);

      // Rafter = 5.0m, Spacing = 1.2m -> floor(4.166) + 1 = 5
      expect(calculatePurlinsCountInternal(5.0, 1.2)).toBe(5);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculatePurlinsCountInternal(-6.5, 1.3)).toBe(0);
      expect(calculatePurlinsCountInternal(6.5, -1.3)).toBe(0);
    });
  });
});


