/**
 * Quantity Surveying Plumbing & Drainage Calculations Engine
 */

/**
 * Calculates total billed pipe length with fittings/wastage allowance percentage
 * W = L * (1 + P / 100)
 */
export function calculatePipeLengthWithAllowanceInternal(
  measuredM: number,
  allowancePercent: number
): number {
  if (measuredM <= 0 || allowancePercent < 0) {
    return 0;
  }
  const total = measuredM * (1 + allowancePercent / 100);
  return Math.round(total * 1000) / 1000;
}

/**
 * Calculates horizontal invert level fall depth difference
 * h = L / slopeRatio
 */
export function calculateInvertLevelDifferenceInternal(
  lengthM: number,
  gradientRatio: number
): number {
  if (lengthM <= 0 || gradientRatio <= 0) {
    return 0;
  }
  const diff = lengthM / gradientRatio;
  return Math.round(diff * 1000) / 1000;
}

/**
 * Calculates sand cushion volume for horizontal subgrade runs
 * Vol = L * B * T
 */
export function calculateSandCushionVolumeInternal(
  lengthM: number,
  widthM: number,
  thicknessM: number
): number {
  if (lengthM <= 0 || widthM <= 0 || thicknessM <= 0) {
    return 0;
  }
  const vol = lengthM * widthM * thicknessM;
  return Math.round(vol * 1000) / 1000;
}

/**
 * Calculates brick masonry wall volume for rectangular manholes/inspection pits
 * Length & Width represent INTERNAL brickwork dimensions.
 * Vol = ((L + 2*T_w) * (W + 2*T_w) - (L * W)) * D
 */
export function calculateManholeBrickworkVolumeInternal(
  lengthM: number,
  widthM: number,
  depthM: number,
  wallThicknessM: number
): number {
  if (lengthM <= 0 || widthM <= 0 || depthM <= 0 || wallThicknessM <= 0) {
    return 0;
  }
  const outerL = lengthM + 2 * wallThicknessM;
  const outerW = widthM + 2 * wallThicknessM;
  const outerVol = outerL * outerW * depthM;
  const innerVol = lengthM * widthM * depthM;
  const wallVol = outerVol - innerVol;
  return Math.round(wallVol * 1000) / 1000;
}

/**
 * Calculates internal cement plaster area of 4 manhole vertical walls
 * Area = 2 * (L + W) * D
 */
export function calculateManholePlasterAreaInternal(
  lengthM: number,
  widthM: number,
  depthM: number
): number {
  if (lengthM <= 0 || widthM <= 0 || depthM <= 0) {
    return 0;
  }
  const area = 2 * (lengthM + widthM) * depthM;
  return Math.round(area * 1000) / 1000;
}
