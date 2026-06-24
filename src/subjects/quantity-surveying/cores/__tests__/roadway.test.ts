import { describe, test, expect } from 'vitest';
import {
  calculatePavementLayerVolume,
  calculateBitumenWeight,
  calculateRetainingWallVolume,
  calculateBoxCulvertVolume,
  calculateSlabCulvertAbutmentConcrete,
  calculateRetainingWallInclinedBarLength,
  calculateSlabCulvertWingWallReinforcementCount
} from '../roadway';

describe('Roadway and Structures Core Calculations', () => {
  test('should calculate pavement layer volume correctly', () => {
    // 100m length, 7.3m width, 0.15m thickness, compaction factor 1.0
    // Vol = 100 * 7.3 * 0.15 = 109.5
    expect(calculatePavementLayerVolume(100, 7.3, 0.15, 1.0)).toBe(109.5);
    
    // Compaction factor 1.15 -> 109.5 * 1.15 = 125.925
    expect(calculatePavementLayerVolume(100, 7.3, 0.15, 1.15)).toBe(125.925);
  });

  test('should calculate bitumen weight correctly', () => {
    // 500 m2 area, 1.2 kg/m2 rate -> 600 kg
    expect(calculateBitumenWeight(500, 1.2)).toBe(600);
  });

  test('should calculate retaining wall concrete stem volume correctly', () => {
    // topWidth = 0.3, bottomWidth = 0.6, height = 3.0, length = 15.0
    // Area = (0.3 + 0.6)/2 * 3 = 1.35
    // Vol = 1.35 * 15 = 20.25
    expect(calculateRetainingWallVolume(0.3, 0.6, 3.0, 15.0)).toBe(20.25);
  });

  test('should calculate box culvert concrete volume correctly', () => {
    // length = 6.0, outerWidth = 4.0, outerHeight = 3.0, voidWidth = 3.4, voidHeight = 2.4
    // Gross Area = 12.0
    // Void Area = 3.4 * 2.4 = 8.16
    // Net Area = 3.84
    // Vol = 3.84 * 6 = 23.04
    expect(calculateBoxCulvertVolume(6.0, 4.0, 3.0, 3.4, 2.4)).toBe(23.04);
  });

  test('should calculate slab culvert abutment concrete with and without bearing deduction', () => {
    // length = 6.0, width = 0.4, height = 2.5
    // Gross Vol = 6.0 * 0.4 * 2.5 = 6.0
    // Without deduction:
    expect(calculateSlabCulvertAbutmentConcrete(6.0, 0.4, 2.5, 0.2, 0.25, false)).toBe(6.0);
    // With deduction:
    // Deduction = 6.0 * 0.2 * 0.25 = 0.3
    // Net Vol = 6.0 - 0.3 = 5.7
    expect(calculateSlabCulvertAbutmentConcrete(6.0, 0.4, 2.5, 0.2, 0.25, true)).toBe(5.7);
  });

  test('should calculate retaining wall stem inclined bar length using Pythagoras', () => {
    // height = 4.0, topWidth = 0.3, bottomWidth = 0.6, cover = 0.075
    // bSlope = 0.3
    // inclinedLength = sqrt(4^2 + 0.3^2) = sqrt(16.09) = 4.01123
    // minus 2 * cover (0.15) = 3.8612 -> rounded to 3.861
    expect(calculateRetainingWallInclinedBarLength(4.0, 0.3, 0.6, 0.075)).toBe(3.861);
  });

  test('should calculate wing wall reinforcement count without the starter +1 bar', () => {
    // wallLength = 5.0, spacing = 0.2 -> 25 bars
    expect(calculateSlabCulvertWingWallReinforcementCount(5.0, 0.2)).toBe(25);
    // wallLength = 5.3, spacing = 0.25 -> 21.2 -> rounded to 21 bars
    expect(calculateSlabCulvertWingWallReinforcementCount(5.3, 0.25)).toBe(21);
  });
});
