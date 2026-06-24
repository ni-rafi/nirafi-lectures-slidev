import { describe, test, expect } from 'vitest';
import {
  calculateRoadwayArea,
  calculateRoadwayVolumeMidSectional,
  calculateTransitVolume,
  calculateRequiredExcavation,
  calculateExtraLeadsAndLifts,
} from '../earthwork';

describe('Roadway Earthwork Core Calculations', () => {
  test('should calculate correct roadway cross-sectional area', () => {
    // Embankment: B = 10.0, s = 2.0, d = 1.5
    // Area = 10 * 1.5 + 2 * 1.5^2 = 15 + 4.5 = 19.5
    const areaFill = calculateRoadwayArea(10.0, 2.0, 1.5);
    expect(areaFill).toBe(19.5);

    // Cutting: B = 10.0, s = 1.5, d = -1.0
    // Area = 10 * 1.0 + 1.5 * 1.0^2 = 11.5
    const areaCut = calculateRoadwayArea(10.0, 1.5, -1.0);
    expect(areaCut).toBe(11.5);
  });

  test('should compute correct mid-sectional area and volume', () => {
    // B = 10.0, sFill = 2.0, sCut = 1.5, d1 = 1.2, d2 = 0.6, L = 30.0
    // dMean = 0.9 (filling)
    // Area = 10 * 0.9 + 2.0 * 0.9^2 = 9 + 1.62 = 10.620
    // Volume = 10.620 * 30 = 318.600
    const result = calculateRoadwayVolumeMidSectional(10.0, 1.5, 2.0, 1.2, 0.6, 30.0);
    expect(result.dMean).toBe(0.9);
    expect(result.isFilling).toBe(true);
    expect(result.s).toBe(2.0);
    expect(result.area).toBe(10.62);
    expect(result.volume).toBe(318.6);
  });

  test('should compute loose transit volume with bulking factor', () => {
    // Net = 500, bulking = 1.25 -> Loose = 625.0
    const result = calculateTransitVolume(500, 1.25);
    expect(result).toBe(625.0);
  });

  test('should compute raw excavation volume with compaction shrinkage', () => {
    // Net = 500, compaction = 0.90 -> Exc = 500 / 0.9 = 555.556
    const result = calculateRequiredExcavation(500, 0.90);
    expect(result).toBe(555.556);
  });

  test('should calculate correct extra leads and lifts based on PWD rules', () => {
    // horizontal distance 80m -> extraLeads = ceil((80-30)/30) = ceil(1.66) = 2
    // vertical height 2.5m -> extraLifts = ceil((2.5-1.5)/1.5) = ceil(0.66) = 1
    const { extraLeads, extraLifts } = calculateExtraLeadsAndLifts(80, 2.5);
    expect(extraLeads).toBe(2);
    expect(extraLifts).toBe(1);
  });
});
