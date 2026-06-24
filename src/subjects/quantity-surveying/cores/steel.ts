import type { SteelResult } from './IQSEngine';

/**
 * Calculates reinforcement steel weight in kg.
 * Formula: W = (D^2 / 162) * Length
 * diameterMm is in millimeters (e.g. 10, 12, 16).
 * totalLengthMeters is in meters.
 */
export function calculateSteelWeightInternal(
  diameterMm: number,
  totalLengthMeters: number
): SteelResult {
  const d = diameterMm < 0 ? 0 : diameterMm;
  const l = totalLengthMeters < 0 ? 0 : totalLengthMeters;

  const unitWeight = (d * d) / 162;
  const totalWeight = unitWeight * l;

  return {
    weightKg: Math.round(totalWeight * 1000) / 1000,
  };
}

/**
 * Calculates number of stirrups/ties.
 * Formula: No. = (Clear Span / Spacing) + 1 (rounded down)
 * inputs are in meters (SI base units).
 */
export function calculateStirrupsCountInternal(
  clearSpanM: number,
  spacingM: number
): number {
  if (clearSpanM <= 0 || spacingM <= 0) return 0;
  // Guard against float precision issues (e.g. 3.0 / 0.15 = 20.000000000004)
  const ratio = clearSpanM / spacingM;
  return Math.floor(Math.round(ratio * 100000) / 100000) + 1;
}

/**
 * Calculates additional length needed for hooks in meters.
 * Standard addition: +9d per hook (semi-circular 180 bend)
 * diameterMm is in millimeters (e.g. 10, 12, 16).
 * hookCount is count (e.g. 2 hooks for a simple bar).
 * returns addition in meters.
 */
export function calculateHookAdditionInternal(
  diameterMm: number,
  hookCount: number
): number {
  if (diameterMm <= 0 || hookCount <= 0) return 0;
  const additionM = (hookCount * 9 * diameterMm) / 1000;
  return Math.round(additionM * 1000) / 1000;
}

/**
 * Calculates additional length needed for crank bends in meters.
 * Standard addition: +0.42 * D per crank bend (45 degrees)
 * effectiveDepthM is in meters.
 * crankCount is count (e.g. 2 cranks for standard main bar).
 * returns addition in meters.
 */
export function calculateCrankAdditionInternal(
  effectiveDepthM: number,
  crankCount: number
): number {
  if (effectiveDepthM <= 0 || crankCount <= 0) return 0;
  const additionM = crankCount * 0.42 * effectiveDepthM;
  return Math.round(additionM * 1000) / 1000;
}

/**
 * Calculates standard flat plate weight in kg.
 * Formula: Weight = L * B * T * 7850
 * inputs are in meters (SI base units).
 */
export function calculatePlateWeightInternal(
  lengthM: number,
  widthM: number,
  thicknessM: number
): number {
  if (lengthM <= 0 || widthM <= 0 || thicknessM <= 0) return 0;
  const weight = lengthM * widthM * thicknessM * 7850;
  return Math.round(weight * 1000) / 1000;
}

/**
 * Calculates sloped rafter length in meters using Pythagoras theorem.
 * Formula: Length = sqrt(rise^2 + halfSpan^2)
 * inputs are in meters (SI base units).
 */
export function calculateRafterLengthInternal(
  riseM: number,
  halfSpanM: number
): number {
  if (riseM <= 0 || halfSpanM <= 0) return 0;
  const length = Math.sqrt(riseM * riseM + halfSpanM * halfSpanM);
  return Math.round(length * 1000) / 1000;
}

/**
 * Calculates total number of purlin lines.
 * Formula: No. = (Rafter Length / Spacing) + 1 (rounded down)
 * inputs are in meters (SI base units).
 */
export function calculatePurlinsCountInternal(
  rafterLengthM: number,
  spacingM: number
): number {
  if (rafterLengthM <= 0 || spacingM <= 0) return 0;
  const ratio = rafterLengthM / spacingM;
  return Math.floor(Math.round(ratio * 100000) / 100000) + 1;
}

/**
 * Calculates effective depth of a reinforced concrete section (in mm).
 */
export function calculateEffectiveDepth(
  depthMm: number,
  clearCoverMm: number,
  stirrupDiaMm: number = 10,
  barDiaMm: number = 16
): number {
  const h = depthMm < 0 ? 0 : depthMm;
  const cc = clearCoverMm < 0 ? 0 : clearCoverMm;
  const sd = stirrupDiaMm < 0 ? 0 : stirrupDiaMm;
  const bd = barDiaMm < 0 ? 0 : barDiaMm;
  const effDepth = h - cc - sd - bd / 2;
  return Math.round(Math.max(0, effDepth) * 1000) / 1000;
}


