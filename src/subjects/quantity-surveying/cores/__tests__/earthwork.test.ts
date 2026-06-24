import { describe, test, expect } from 'vitest';
import {
  calculateRoadwayArea,
  calculateRoadwayVolumeMidSectional,
  calculateRoadwayVolumeTrapezoidal,
  calculateRoadwayVolumePrismoidal,
  calculateTransitVolume,
  calculateRequiredExcavation,
  calculateExtraLeadsAndLifts,
  calculateGridEarthworkVolume,
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

  test('should calculate correct volume using trapezoidal (average end area) method', () => {
    // Embankment: B = 10.0, sFill = 2.0, sCut = 1.5, d1 = 1.2, d2 = 0.6, L = 30.0
    // area1 = 10 * 1.2 + 2 * 1.2^2 = 12 + 2.88 = 14.88
    // area2 = 10 * 0.6 + 2 * 0.6^2 = 6 + 0.72 = 6.72
    // areaMean = (14.88 + 6.72) / 2 = 10.80
    // volume = 10.80 * 30 = 324.0
    const result = calculateRoadwayVolumeTrapezoidal(10.0, 1.5, 2.0, 1.2, 0.6, 30.0);
    expect(result.area1).toBe(14.88);
    expect(result.area2).toBe(6.72);
    expect(result.areaMean).toBe(10.8);
    expect(result.volume).toBe(324.0);
  });

  test('should calculate correct volume using prismoidal method', () => {
    // Embankment: B = 10.0, sFill = 2.0, sCut = 1.5, d1 = 1.2, d2 = 0.6, L = 30.0
    // area1 = 14.88, area2 = 6.72
    // dMid = (1.2 + 0.6) / 2 = 0.9
    // areaMid = 10 * 0.9 + 2 * 0.9^2 = 9 + 1.62 = 10.62
    // volume = (30 / 6) * (14.88 + 4 * 10.62 + 6.72) = 5 * (14.88 + 42.48 + 6.72) = 5 * 64.08 = 320.400
    const result = calculateRoadwayVolumePrismoidal(10.0, 1.5, 2.0, 1.2, 0.6, 30.0);
    expect(result.area1).toBe(14.88);
    expect(result.area2).toBe(6.72);
    expect(result.areaMid).toBe(10.62);
    expect(result.volume).toBe(320.4);
  });

  test('should calculate correct volume using grid method', () => {
    // 2x2 grid cell with area 25 m2 and corner depths [1.2, 1.5, 0.8, 1.1]
    // avgDepth = (1.2 + 1.5 + 0.8 + 1.1) / 4 = 4.6 / 4 = 1.15
    // volume = 1.15 * 25 = 28.750
    const result = calculateGridEarthworkVolume([1.2, 1.5, 0.8, 1.1], 25.0);
    expect(result).toBe(28.75);
  });
});
