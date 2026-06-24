import { describe, test, expect } from 'vitest';
import {
  calculateSteelWeightInternal,
  calculateStirrupsCountInternal,
  calculateHookAdditionInternal,
  calculateCrankAdditionInternal,
  calculatePlateWeightInternal,
  calculateRafterLengthInternal,
  calculatePurlinsCountInternal,
  calculateSlabBarsCountInternal,
  calculateSteelLedgerRowInternal,
  calculateBarLengthInternal,
  calculateSteelMacroBudget,
  calculateHookAdditionDetailed,
  calculateCouplerComparison,
  calculateRebarWeightPwdVsFormula
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

  describe('Slab Bar Count Calculation', () => {
    test('should calculate correct number of straight, cranked, and extra top bars', () => {
      // Span = 5.0m, Cover = 0.05m, Spacing = 0.15m
      // Net span = 5.0 - 2 * 0.05 = 4.90m
      // Ratio = 4.9 / 0.15 = 32.6667 -> ceil to 33 -> 33 + 1 = 34 straight bars.
      // Cranked bars = 34 - 1 = 33.
      // Extra top bars = (33 - 1) * 2 = 64.
      const result = calculateSlabBarsCountInternal(5.0, 0.05, 0.15);
      expect(result.straightCount).toBe(34);
      expect(result.crankedCount).toBe(33);
      expect(result.extraTopCount).toBe(64);
    });

    test('should return all zeros for invalid or negative inputs', () => {
      const result = calculateSlabBarsCountInternal(-5.0, 0.05, 0.15);
      expect(result.straightCount).toBe(0);
      expect(result.crankedCount).toBe(0);
      expect(result.extraTopCount).toBe(0);
    });
  });

  describe('Steel Calculation Ledger Row', () => {
    test('should calculate correct total weight for a ledger row', () => {
      // 12 Qty * 7.453 ft * 5.40 lb/ft = 482.9544 -> 482.954
      expect(calculateSteelLedgerRowInternal(12, 7.453, 5.40)).toBe(482.954);
      // 5 Qty * 25 ft * 9.80 lb/ft = 1225
      expect(calculateSteelLedgerRowInternal(5, 25, 9.80)).toBe(1225);
    });

    test('should return 0 for negative or zero inputs', () => {
      expect(calculateSteelLedgerRowInternal(-12, 7.453, 5.40)).toBe(0);
      expect(calculateSteelLedgerRowInternal(12, 0, 5.40)).toBe(0);
    });
  });

  describe('Clear Reinforcement Bar Length', () => {
    test('should calculate correct clear length with hooks', () => {
      // span = 5.0m, cover = 0.05m, hooks = 0.18m
      // 5.0 - 2*0.05 + 0.18 = 4.90 + 0.18 = 5.08
      expect(calculateBarLengthInternal(5.0, 0.05, 0.18)).toBe(5.08);
    });

    test('should return 0 for invalid or negative spans', () => {
      expect(calculateBarLengthInternal(-5.0, 0.05, 0.18)).toBe(0);
      expect(calculateBarLengthInternal(0, 0.05, 0.18)).toBe(0);
    });

    test('should handle zero cover or zero hooks correctly', () => {
      expect(calculateBarLengthInternal(6.0, 0, 0.20)).toBe(6.20);
      expect(calculateBarLengthInternal(4.5, 0.04, 0)).toBe(4.42);
    });
  });

  describe('Macro Steel Estimation (Thumb Rules)', () => {
    test('should calculate correct macro budget steel weight', () => {
      const result = calculateSteelMacroBudget(10, 1.0);
      expect(result.steelWeightKg).toBe(785);
    });

    test('should return 0 for negative or zero inputs', () => {
      expect(calculateSteelMacroBudget(-10, 1.0).steelWeightKg).toBe(0);
      expect(calculateSteelMacroBudget(10, 0).steelWeightKg).toBe(0);
    });
  });

  describe('Detailed Hook Addition Geometry', () => {
    test('should calculate correct hook additions for different angles and bar types', () => {
      const result180 = calculateHookAdditionDetailed(10, 2, 180, 'plain');
      expect(result180.additionM).toBe(0.180);
      expect(result180.multiplier).toBe(9);

      const result90Def = calculateHookAdditionDetailed(16, 2, 90, 'deformed');
      expect(result90Def.additionM).toBe(0.384);
      expect(result90Def.multiplier).toBe(12);

      const result90Plain = calculateHookAdditionDetailed(16, 2, 90, 'plain');
      expect(result90Plain.additionM).toBe(0.512);

      const result135Def = calculateHookAdditionDetailed(10, 2, 135, 'deformed');
      expect(result135Def.additionM).toBe(0.120);
    });
  });

  describe('Mechanical Splicing Coupler Comparison', () => {
    test('should calculate savings and weights of lap vs couplers correctly', () => {
      const comparison = calculateCouplerComparison(20, 3.5, 8, 95, 250);
      expect(comparison.lapWeightKg).toBe(19.728);
      expect(comparison.lapCostBdt).toBe(1874.16);
      expect(comparison.couplersCostBdt).toBe(2000.0);
      expect(comparison.netSavingsBdt).toBe(-125.84);
      expect(comparison.weightSavedKg).toBe(19.728);
    });
  });

  describe('PWD Weight vs Theoretical Formula Weight', () => {
    test('should compare weights using formula vs PWD constants correctly', () => {
      const result = calculateRebarWeightPwdVsFormula(10, 1000);
      expect(result.weightFormulaKg).toBe(617.284);
      expect(result.weightPwdKg).toBe(616.000);
      expect(result.diffKg).toBe(1.284);
    });
  });
});


