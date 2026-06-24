/**
 * Roadway Earthwork Calculation Engine (SI Base Units)
 * Implements equations from B.N. Dutta Chapter 9 & PWD Rate Analysis rules.
 */

/**
 * Calculates roadway cross-sectional area.
 * Formula: A = B * |d| + s * d^2
 * Returned value is rounded to exactly 3 decimal places.
 */
export function calculateRoadwayArea(B: number, s: number, d: number): number {
  const absD = Math.abs(d);
  const area = B * absD + s * absD * absD;
  return Math.round(area * 1000) / 1000;
}

/**
 * Calculates roadway volume using the Mid-Sectional Area Method.
 * Returned values are rounded to exactly 3 decimal places.
 */
export function calculateRoadwayVolumeMidSectional(
  B: number,
  sCut: number,
  sFill: number,
  d1: number,
  d2: number,
  L: number
): {
  dMean: number;
  isFilling: boolean;
  s: number;
  area: number;
  volume: number;
} {
  const dMean = (d1 + d2) / 2;
  const isFilling = dMean >= 0;
  const s = isFilling ? sFill : sCut;
  const absD = Math.abs(dMean);
  const area = B * absD + s * absD * absD;
  const volume = area * L;

  return {
    dMean: Math.round(dMean * 1000) / 1000,
    isFilling,
    s,
    area: Math.round(area * 1000) / 1000,
    volume: Math.round(volume * 1000) / 1000,
  };
}

/**
 * Calculates transit loose volume with bulking factor.
 */
export function calculateTransitVolume(netVolume: number, bulkingFactor: number): number {
  return Math.round(netVolume * bulkingFactor * 1000) / 1000;
}

/**
 * Calculates required excavation bank volume with compaction factor.
 */
export function calculateRequiredExcavation(netVolume: number, compactionFactor: number): number {
  if (compactionFactor <= 0) return 0;
  return Math.round((netVolume / compactionFactor) * 1000) / 1000;
}

/**
 * Calculates PWD extra leads and lifts.
 * Base Lead is 30m, base Lift is 1.5m.
 */
export function calculateExtraLeadsAndLifts(
  horizontalDistance: number,
  verticalHeight: number
): { extraLeads: number; extraLifts: number } {
  const extraLeads = Math.max(0, Math.ceil((horizontalDistance - 30) / 30));
  const extraLifts = Math.max(0, Math.ceil((verticalHeight - 1.5) / 1.5));
  return { extraLeads, extraLifts };
}
