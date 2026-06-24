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

/**
 * Calculates roadway volume using the Trapezoidal (Average End Area) Method.
 * Returned values are rounded to exactly 3 decimal places.
 */
export function calculateRoadwayVolumeTrapezoidal(
  B: number,
  sCut: number,
  sFill: number,
  d1: number,
  d2: number,
  L: number
): {
  area1: number;
  area2: number;
  areaMean: number;
  volume: number;
} {
  const s1 = d1 >= 0 ? sFill : sCut;
  const s2 = d2 >= 0 ? sFill : sCut;
  const absD1 = Math.abs(d1);
  const absD2 = Math.abs(d2);
  const area1 = B * absD1 + s1 * absD1 * absD1;
  const area2 = B * absD2 + s2 * absD2 * absD2;
  const areaMean = (area1 + area2) / 2;
  const volume = areaMean * L;

  return {
    area1: Math.round(area1 * 1000) / 1000,
    area2: Math.round(area2 * 1000) / 1000,
    areaMean: Math.round(areaMean * 1000) / 1000,
    volume: Math.round(volume * 1000) / 1000,
  };
}

/**
 * Calculates roadway volume using the Prismoidal Method (Simpson's Rule).
 * Returned values are rounded to exactly 3 decimal places.
 */
export function calculateRoadwayVolumePrismoidal(
  B: number,
  sCut: number,
  sFill: number,
  d1: number,
  d2: number,
  L: number
): {
  area1: number;
  area2: number;
  areaMid: number;
  volume: number;
} {
  const s1 = d1 >= 0 ? sFill : sCut;
  const s2 = d2 >= 0 ? sFill : sCut;
  const absD1 = Math.abs(d1);
  const absD2 = Math.abs(d2);
  const area1 = B * absD1 + s1 * absD1 * absD1;
  const area2 = B * absD2 + s2 * absD2 * absD2;

  const dMid = (d1 + d2) / 2;
  const sMid = dMid >= 0 ? sFill : sCut;
  const absDMid = Math.abs(dMid);
  const areaMid = B * absDMid + sMid * absDMid * absDMid;

  const volume = (L / 6) * (area1 + 4 * areaMid + area2);

  return {
    area1: Math.round(area1 * 1000) / 1000,
    area2: Math.round(area2 * 1000) / 1000,
    areaMid: Math.round(areaMid * 1000) / 1000,
    volume: Math.round(volume * 1000) / 1000,
  };
}

/**
 * Calculates earthwork volume using the Grid Method (Spot Levels corner depths).
 * Returned values are rounded to exactly 3 decimal places.
 */
export function calculateGridEarthworkVolume(
  cornerDepths: number[],
  cellArea: number
): number {
  if (cornerDepths.length === 0) return 0;
  const sum = cornerDepths.reduce((acc, val) => acc + val, 0);
  const avgDepth = sum / cornerDepths.length;
  const volume = avgDepth * cellArea;
  return Math.round(volume * 1000) / 1000;
}
