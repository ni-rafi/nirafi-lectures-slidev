import { describe, test, expect } from 'vitest';
import {
  calculateReservoirExcavation,
  calculateReservoirRaft,
  calculateReservoirWalls,
  calculateReservoirPlasterArea,
  calculatePudloRequirement,
  calculateSoakPitNetVolume,
  calculateSoakPitLooseVolume,
} from '../reservoir';

describe('Water Reservoir & Soak Pit Core Calculations', () => {
  test('should calculate correct excavation volume', () => {
    const vol = calculateReservoirExcavation(6.0, 4.0, 3.0, 0.5);
    expect(vol).toBe(105.0);
  });

  test('should calculate correct base raft volume', () => {
    const vol = calculateReservoirRaft(5.0, 3.0, 0.25, 0.3);
    expect(vol).toBe(5.775);
  });

  test('should calculate correct concrete walls volume', () => {
    const vol = calculateReservoirWalls(5.0, 3.0, 0.25, 2.5);
    expect(vol).toBe(10.625);
  });

  test('should calculate correct plaster area', () => {
    const area = calculateReservoirPlasterArea(5.0, 3.0, 2.5);
    expect(area).toBe(55.0);
  });

  test('should calculate correct Pudlo chemical requirement', () => {
    const kg = calculatePudloRequirement(55.0, 0.015, 50.0);
    expect(kg).toBe(41.250);
  });

  test('should calculate correct soak pit net volume', () => {
    const vol = calculateSoakPitNetVolume(2.0, 3.0);
    expect(vol).toBe(9.425); // Math.round(PI * 1 * 3 * 1000) / 1000 = 9.425
  });

  test('should calculate correct soak pit loose volume', () => {
    const vol = calculateSoakPitLooseVolume(9.425, 1.33);
    expect(vol).toBe(12.535);
  });
});
