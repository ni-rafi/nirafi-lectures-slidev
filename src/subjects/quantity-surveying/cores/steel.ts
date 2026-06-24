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

export interface SlabBarsResult {
  straightCount: number;
  crankedCount: number;
  extraTopCount: number;
}

/**
 * Calculates numbers of straight, cranked, and extra top bars in a slab span.
 * Straight Bars: No. = [(Total Length - 2 * Clear Cover) / Spacing] + 1 (always round up)
 * Cranked Bars: No. = Straight Bars - 1
 * Extra Top Bars (One Side): No. = (Cranked Bars - 1) * 2
 * Inputs: spanLengthM (meters), clearCoverM (meters), spacingM (meters)
 */
export function calculateSlabBarsCountInternal(
  spanLengthM: number,
  clearCoverM: number,
  spacingM: number
): SlabBarsResult {
  if (spanLengthM <= 0 || spacingM <= 0) {
    return { straightCount: 0, crankedCount: 0, extraTopCount: 0 };
  }

  const netSpan = spanLengthM - 2 * clearCoverM;
  if (netSpan <= 0) {
    return { straightCount: 0, crankedCount: 0, extraTopCount: 0 };
  }

  const ratio = netSpan / spacingM;
  const adjustedRatio = Math.round(ratio * 100000) / 100000;
  const straightCount = Math.ceil(adjustedRatio) + 1;
  const crankedCount = Math.max(0, straightCount - 1);
  const extraTopCount = crankedCount > 1 ? (crankedCount - 1) * 2 : 0;

  return {
    straightCount,
    crankedCount,
    extraTopCount,
  };
}

/**
 * Calculates total weight of a ledger row.
 * Formula: Weight = Quantity * Length * Unit Weight
 * All inputs are numbers. Output rounded to 3 decimal places.
 */
export function calculateSteelLedgerRowInternal(
  qty: number,
  length: number,
  unitWeight: number
): number {
  if (qty <= 0 || length <= 0 || unitWeight <= 0) return 0;
  const total = qty * length * unitWeight;
  return Math.round(total * 1000) / 1000;
}

/**
 * Calculates clear reinforcement bar length (with covers and hooks).
 */
export function calculateBarLengthInternal(
  clearSpanM: number,
  clearCoverM: number,
  hookAdditionM: number
): number {
  if (clearSpanM <= 0) return 0;
  const len = clearSpanM - 2 * clearCoverM + hookAdditionM;
  return Math.round(Math.max(0, len) * 1000) / 1000;
}

export const PWD_REBAR_WEIGHTS: Record<number, number> = {
  8: 0.395,
  10: 0.616,
  12: 0.888,
  16: 1.579,
  20: 2.466,
  22: 2.984,
  25: 3.853,
  28: 4.834,
  32: 6.313
};

export function calculateSteelMacroBudget(
  concreteVolM3: number,
  ratioPercent: number
): { steelWeightKg: number } {
  if (concreteVolM3 <= 0 || ratioPercent <= 0) return { steelWeightKg: 0 };
  const steelVol = concreteVolM3 * (ratioPercent / 100);
  const weight = steelVol * 7850;
  return {
    steelWeightKg: Math.round(weight * 1000) / 1000
  };
}

export function calculateHookAdditionDetailed(
  diameterMm: number,
  hookCount: number,
  angle: 90 | 135 | 180,
  barType: 'plain' | 'deformed'
): { additionM: number; multiplier: number } {
  if (diameterMm <= 0 || hookCount <= 0) return { additionM: 0, multiplier: 0 };
  let multiplier = 0;
  if (angle === 180) {
    multiplier = 9;
  } else if (angle === 90) {
    multiplier = barType === 'deformed' ? 12 : 16;
  } else if (angle === 135) {
    multiplier = barType === 'deformed' ? 6 : 8;
  }
  const additionM = (hookCount * multiplier * diameterMm) / 1000;
  return {
    additionM: Math.round(additionM * 1000) / 1000,
    multiplier
  };
}

export function calculateCouplerComparison(
  barDiaMm: number,
  columnHeightM: number,
  numBars: number,
  steelRateBdt: number,
  couplerRateBdt: number
): {
  lapWeightKg: number;
  lapCostBdt: number;
  couplersCostBdt: number;
  netSavingsBdt: number;
  weightSavedKg: number;
} {
  if (barDiaMm <= 0 || columnHeightM <= 0 || numBars <= 0) {
    return { lapWeightKg: 0, lapCostBdt: 0, couplersCostBdt: 0, netSavingsBdt: 0, weightSavedKg: 0 };
  }
  const unitWeight = PWD_REBAR_WEIGHTS[barDiaMm] || (barDiaMm * barDiaMm) / 162;
  const lapLengthM = (50 * barDiaMm) / 1000;
  const lapWeightKg = numBars * lapLengthM * unitWeight;
  const lapCostBdt = lapWeightKg * steelRateBdt;
  const couplersCostBdt = numBars * couplerRateBdt;
  const netSavingsBdt = lapCostBdt - couplersCostBdt;

  return {
    lapWeightKg: Math.round(lapWeightKg * 1000) / 1000,
    lapCostBdt: Math.round(lapCostBdt * 1000) / 1000,
    couplersCostBdt: Math.round(couplersCostBdt * 1000) / 1000,
    netSavingsBdt: Math.round(netSavingsBdt * 1000) / 1000,
    weightSavedKg: Math.round(lapWeightKg * 1000) / 1000
  };
}

export function calculateRebarWeightPwdVsFormula(
  diameterMm: number,
  lengthM: number
): {
  weightFormulaKg: number;
  weightPwdKg: number;
  diffKg: number;
} {
  if (diameterMm <= 0 || lengthM <= 0) {
    return { weightFormulaKg: 0, weightPwdKg: 0, diffKg: 0 };
  }
  const unitWeightFormula = (diameterMm * diameterMm) / 162;
  const unitWeightPwd = PWD_REBAR_WEIGHTS[diameterMm] || unitWeightFormula;

  const weightFormulaKg = unitWeightFormula * lengthM;
  const weightPwdKg = unitWeightPwd * lengthM;
  const diffKg = weightFormulaKg - weightPwdKg;

  return {
    weightFormulaKg: Math.round(weightFormulaKg * 1000) / 1000,
    weightPwdKg: Math.round(weightPwdKg * 1000) / 1000,
    diffKg: Math.round(diffKg * 1000) / 1000
  };
}





