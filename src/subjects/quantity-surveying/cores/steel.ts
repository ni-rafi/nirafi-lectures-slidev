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

export const PWD_CGI_WEIGHTS: Record<number, number> = {
  18: 10.60,
  20: 8.50,
  22: 6.80,
  24: 5.40
};

export function calculateCgiRoofingInternal(
  spanM: number,
  riseM: number,
  buildingLengthM: number,
  sideOverhangM: number,
  eavesOverhangM: number,
  corrugationFactor: number,
  bwgGauge: number
): {
  rafterSlopeM: number;
  coveredAreaM2: number;
  sheetWeightKg: number;
  ridgingLengthM: number;
} {
  if (spanM <= 0 || riseM <= 0 || buildingLengthM <= 0) {
    return { rafterSlopeM: 0, coveredAreaM2: 0, sheetWeightKg: 0, ridgingLengthM: 0 };
  }
  const rafterSlope = Math.sqrt(riseM * riseM + (spanM / 2) * (spanM / 2));
  const slopeWithOverhang = rafterSlope + eavesOverhangM;
  const netLength = buildingLengthM + 2 * sideOverhangM;
  const coveredAreaRaw = 2 * slopeWithOverhang * netLength;
  const coveredAreaM2 = coveredAreaRaw * corrugationFactor;
  const unitWeight = PWD_CGI_WEIGHTS[bwgGauge] || 5.40;
  const sheetWeightKg = coveredAreaM2 * unitWeight;
  const ridgingLengthM = buildingLengthM;

  return {
    rafterSlopeM: Math.round(rafterSlope * 1000) / 1000,
    coveredAreaM2: Math.round(coveredAreaM2 * 1000) / 1000,
    sheetWeightKg: Math.round(sheetWeightKg * 1000) / 1000,
    ridgingLengthM: Math.round(ridgingLengthM * 1000) / 1000
  };
}

export const PWD_FLAT_WEIGHTS: Record<string, number> = {
  '25x5': 0.981,
  '40x6': 1.884,
  '50x6': 2.355
};

export const PWD_Z_WEIGHTS: Record<string, number> = {
  '20x20x3': 1.120,
  '25x25x3': 1.450
};

export const PWD_TEE_WEIGHTS: Record<string, number> = {
  '25x25x3': 1.120,
  '40x40x5': 2.980,
  '50x50x6': 4.440
};

export function calculatePwdSectionWeightInternal(
  shape: 'flat' | 'z' | 'tee',
  sizeKey: string,
  lengthM: number
): {
  pwdWeightKg: number;
  formulaWeightKg: number;
  diffKg: number;
} {
  if (lengthM <= 0) {
    return { pwdWeightKg: 0, formulaWeightKg: 0, diffKg: 0 };
  }
  let pwdUnitWeight = 0;
  let crossSectionAreaM2 = 0;

  if (shape === 'flat') {
    pwdUnitWeight = PWD_FLAT_WEIGHTS[sizeKey] || 0;
    const parts = sizeKey.split('x').map(Number);
    const widthMm = parts[0] || 0;
    const thicknessMm = parts[1] || 0;
    crossSectionAreaM2 = (widthMm * thicknessMm) / 1000000;
  } else if (shape === 'z') {
    pwdUnitWeight = PWD_Z_WEIGHTS[sizeKey] || 0;
    const parts = sizeKey.split('x').map(Number);
    const w = parts[0] || 0;
    const h = parts[1] || 0;
    const t = parts[2] || 0;
    crossSectionAreaM2 = ((w + h + w - 2 * t) * t) / 1000000;
  } else if (shape === 'tee') {
    pwdUnitWeight = PWD_TEE_WEIGHTS[sizeKey] || 0;
    const parts = sizeKey.split('x').map(Number);
    const w = parts[0] || 0;
    const h = parts[1] || 0;
    const t = parts[2] || 0;
    crossSectionAreaM2 = (w * t + (h - t) * t) / 1000000;
  }

  const formulaUnitWeight = crossSectionAreaM2 * 7850;
  const pwdWeightKg = pwdUnitWeight * lengthM;
  const formulaWeightKg = formulaUnitWeight * lengthM;
  const diffKg = formulaWeightKg - pwdWeightKg;

  return {
    pwdWeightKg: Math.round(pwdWeightKg * 1000) / 1000,
    formulaWeightKg: Math.round(formulaWeightKg * 1000) / 1000,
    diffKg: Math.round(diffKg * 1000) / 1000
  };
}

export function calculateSecondaryFramingInternal(
  rafterSlopeM: number,
  bayLengthM: number,
  numBays: number,
  purlinSpacingM: number,
  purlinCount: number,
  sagrodDiaMm: number,
  bracingWeightPerM: number,
  strutWeightPerM: number
): {
  sagrodWeightKg: number;
  bracingWeightKg: number;
  strutWeightKg: number;
  totalSecondaryWeightKg: number;
} {
  if (rafterSlopeM <= 0 || bayLengthM <= 0 || numBays <= 0 || purlinSpacingM <= 0 || purlinCount <= 1) {
    return { sagrodWeightKg: 0, bracingWeightKg: 0, strutWeightKg: 0, totalSecondaryWeightKg: 0 };
  }

  const sagrodUnitWeight = (sagrodDiaMm * sagrodDiaMm) / 162;
  const totalSagrodLength = (purlinCount - 1) * numBays * 2 * purlinSpacingM;
  const sagrodWeightKg = totalSagrodLength * sagrodUnitWeight;

  const diagonalLength = Math.sqrt(bayLengthM * bayLengthM + rafterSlopeM * rafterSlopeM);
  const totalBracingLength = 16 * diagonalLength;
  const bracingWeightKg = totalBracingLength * bracingWeightPerM;

  const totalStrutLength = 3 * (bayLengthM * numBays);
  const strutWeightKg = totalStrutLength * strutWeightPerM;

  const totalSecondaryWeightKg = sagrodWeightKg + bracingWeightKg + strutWeightKg;

  return {
    sagrodWeightKg: Math.round(sagrodWeightKg * 1000) / 1000,
    bracingWeightKg: Math.round(bracingWeightKg * 1000) / 1000,
    strutWeightKg: Math.round(strutWeightKg * 1000) / 1000,
    totalSecondaryWeightKg: Math.round(totalSecondaryWeightKg * 1000) / 1000
  };
}






