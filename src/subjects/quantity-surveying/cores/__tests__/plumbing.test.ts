import { describe, test, expect } from 'vitest';
import {
  calculatePipeLengthWithAllowanceInternal,
  calculateInvertLevelDifferenceInternal,
  calculateSandCushionVolumeInternal,
  calculateManholeBrickworkVolumeInternal,
  calculateManholePlasterAreaInternal,
  calculateGrooveCuttingAndConcealment,
  calculateMepSubNetworks,
} from '../plumbing';

describe('Plumbing Core Math Engine', () => {
  describe('Pipe Length with Allowance', () => {
    test('should calculate correct centerline pipe length with allowance', () => {
      // 10.0m + 5% = 10.5m
      expect(calculatePipeLengthWithAllowanceInternal(10.0, 5)).toBe(10.5);
      // 24.3m + 7% = 26.001m
      expect(calculatePipeLengthWithAllowanceInternal(24.3, 7)).toBe(26.001);
    });

    test('should return 0 for negative or zero inputs', () => {
      expect(calculatePipeLengthWithAllowanceInternal(-10, 5)).toBe(0);
      expect(calculatePipeLengthWithAllowanceInternal(10, -5)).toBe(0);
      expect(calculatePipeLengthWithAllowanceInternal(0, 5)).toBe(0);
    });
  });

  describe('Invert Level Difference', () => {
    test('should calculate slope vertical drop correctly', () => {
      // 15.0m run at 1:40 gradient -> 15.0 / 40 = 0.375m
      expect(calculateInvertLevelDifferenceInternal(15.0, 40)).toBe(0.375);
      // 20.0m run at 1:60 gradient -> 20.0 / 60 = 0.333m
      expect(calculateInvertLevelDifferenceInternal(20.0, 60)).toBe(0.333);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateInvertLevelDifferenceInternal(-15, 40)).toBe(0);
      expect(calculateInvertLevelDifferenceInternal(15, -40)).toBe(0);
      expect(calculateInvertLevelDifferenceInternal(0, 40)).toBe(0);
    });
  });

  describe('Sand Cushion Volume', () => {
    test('should compute correct rectangular cushion volume', () => {
      // 15m * 0.5m * 0.1m = 0.75m³
      expect(calculateSandCushionVolumeInternal(15.0, 0.5, 0.1)).toBe(0.75);
      // 20m * 0.45m * 0.075m = 0.675m³
      expect(calculateSandCushionVolumeInternal(20.0, 0.45, 0.075)).toBe(0.675);
    });

    test('should return 0 for invalid dimensions', () => {
      expect(calculateSandCushionVolumeInternal(-10, 0.5, 0.1)).toBe(0);
      expect(calculateSandCushionVolumeInternal(10, -0.5, 0.1)).toBe(0);
      expect(calculateSandCushionVolumeInternal(10, 0.5, 0)).toBe(0);
    });
  });

  describe('Manhole Wall Brickwork Volume', () => {
    test('should calculate wall brickwork volume correctly', () => {
      // Internal: 0.8m x 0.8m x 1.1m, Wall: 0.125m
      // Outer: 1.05m x 1.05m
      // Outer Vol = 1.05 * 1.05 * 1.1 = 1.21275
      // Inner Vol = 0.8 * 0.8 * 1.1 = 0.704
      // Wall Vol = 1.21275 - 0.704 = 0.50875 -> 0.509
      expect(calculateManholeBrickworkVolumeInternal(0.8, 0.8, 1.1, 0.125)).toBe(0.509);
    });

    test('should return 0 for invalid parameters', () => {
      expect(calculateManholeBrickworkVolumeInternal(-0.8, 0.8, 1.1, 0.125)).toBe(0);
      expect(calculateManholeBrickworkVolumeInternal(0.8, 0.8, 0, 0.125)).toBe(0);
    });
  });

  describe('Manhole Internal Plaster Area', () => {
    test('should calculate correct surface area of 4 internal walls', () => {
      // 2 * (0.8 + 0.8) * 1.1 = 2 * 1.6 * 1.1 = 3.52m²
      expect(calculateManholePlasterAreaInternal(0.8, 0.8, 1.1)).toBe(3.52);
    });

    test('should return 0 for invalid inputs', () => {
      expect(calculateManholePlasterAreaInternal(-0.8, 0.8, 1.1)).toBe(0);
      expect(calculateManholePlasterAreaInternal(0.8, 0.8, 0)).toBe(0);
    });
  });

  describe('Groove Cutting and Concealment', () => {
    test('should calculate correct cost and filling volume for brickwork', () => {
      const res = calculateGrooveCuttingAndConcealment(10, 'brick', 150, 450);
      expect(res.grooveCostBdt).toBe(1500);
      // 10m * 0.05m * 0.05m = 0.025m3
      expect(res.concreteFillingVolM3).toBe(0.025);
    });

    test('should calculate correct cost and filling volume for rcc', () => {
      const res = calculateGrooveCuttingAndConcealment(5.5, 'rcc', 150, 450);
      expect(res.grooveCostBdt).toBe(2475);
      // 5.5m * 0.05m * 0.05m = 0.01375 -> 0.014
      expect(res.concreteFillingVolM3).toBe(0.014);
    });

    test('should return 0 for invalid inputs', () => {
      const res = calculateGrooveCuttingAndConcealment(-10, 'brick', 150, 450);
      expect(res.grooveCostBdt).toBe(0);
      expect(res.concreteFillingVolM3).toBe(0);
    });
  });

  describe('MEP Sub-Networks', () => {
    test('should calculate correct pipe lengths and costs', () => {
      // floorsCount = 5, height = 3m -> building height = 15m.
      // RWP = 4 * 15 = 60m. Cost = 60 * 120 = 7200.
      // Gas = 15 + 5 * 2 = 25m. Cost = 25 * 300 = 7500.
      // Total = 7200 + 7500 = 14700.
      const res = calculateMepSubNetworks(5, 3.0, 2.0, 300, 120);
      expect(res.rwpLengthM).toBe(60);
      expect(res.gasPipeLengthM).toBe(25);
      expect(res.rwpCostBdt).toBe(7200);
      expect(res.gasPipeCostBdt).toBe(7500);
      expect(res.totalMepCostBdt).toBe(14700);
    });

    test('should return 0 for invalid inputs', () => {
      const res = calculateMepSubNetworks(0, 3.0, 2.0, 300, 120);
      expect(res.rwpLengthM).toBe(0);
      expect(res.totalMepCostBdt).toBe(0);
    });
  });
});
