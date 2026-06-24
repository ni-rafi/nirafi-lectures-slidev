/**
 * Helper to round values to exactly 3 decimal places.
 */
function roundTo3(val: number): number {
  return Math.round(val * 1000) / 1000;
}

/**
 * Calculates road pavement layer volume.
 * Formula: V = Length * Width * Thickness * Compaction Factor
 * Inputs should be in SI units (meters).
 */
export function calculatePavementLayerVolume(
  length: number,
  width: number,
  thickness: number,
  compactionFactor: number = 1.0
): number {
  const l = length < 0 ? 0 : length;
  const w = width < 0 ? 0 : width;
  const t = thickness < 0 ? 0 : thickness;
  const cf = compactionFactor < 0 ? 0 : compactionFactor;
  return roundTo3(l * w * t * cf);
}

/**
 * Calculates weight of bituminous material required for road surfacing.
 * Formula: Weight (kg) = Area (m²) * Application Rate (kg/m²)
 */
export function calculateBitumenWeight(
  area: number,
  rate: number
): number {
  const a = area < 0 ? 0 : area;
  const r = rate < 0 ? 0 : rate;
  return roundTo3(a * r);
}

/**
 * Calculates retaining wall concrete stem volume using the trapezoidal cross-section.
 * Formula: V = [(Top Width + Bottom Width) / 2] * Height * Length
 */
export function calculateRetainingWallVolume(
  topWidth: number,
  bottomWidth: number,
  height: number,
  length: number
): number {
  const w1 = topWidth < 0 ? 0 : topWidth;
  const w2 = bottomWidth < 0 ? 0 : bottomWidth;
  const h = height < 0 ? 0 : height;
  const l = length < 0 ? 0 : length;
  return roundTo3(((w1 + w2) / 2) * h * l);
}

/**
 * Calculates concrete volume for box culverts with hydraulic opening void deductions.
 * Formula: Concrete Vol = [Outer Width * Outer Height - Inner Void Width * Inner Void Height] * Length
 */
export function calculateBoxCulvertVolume(
  length: number,
  outerWidth: number,
  outerHeight: number,
  voidWidth: number,
  voidHeight: number
): number {
  const l = length < 0 ? 0 : length;
  const ow = outerWidth < 0 ? 0 : outerWidth;
  const oh = outerHeight < 0 ? 0 : outerHeight;
  const vw = voidWidth < 0 ? 0 : voidWidth;
  const vh = voidHeight < 0 ? 0 : voidHeight;

  const grossArea = ow * oh;
  const voidArea = vw * vh;
  const netArea = Math.max(0, grossArea - voidArea);

  return roundTo3(netArea * l);
}

/**
 * Calculates concrete volume for Slab Culvert Abutments.
 * If applyDeduction is true, deducts the space occupied by the slab bearing.
 */
export function calculateSlabCulvertAbutmentConcrete(
  length: number,
  width: number,
  height: number,
  bearingWidth: number,
  slabThickness: number,
  applyDeduction: boolean
): number {
  const l = length < 0 ? 0 : length;
  const w = width < 0 ? 0 : width;
  const h = height < 0 ? 0 : height;
  const bw = bearingWidth < 0 ? 0 : bearingWidth;
  const st = slabThickness < 0 ? 0 : slabThickness;

  const grossVol = l * w * h;
  const deduction = applyDeduction ? bw * st * l : 0;
  return roundTo3(Math.max(0, grossVol - deduction));
}

/**
 * Calculates the length of steel reinforcement bars running along the inclined (tapered) face of a retaining wall stem.
 */
export function calculateRetainingWallInclinedBarLength(
  height: number,
  topWidth: number,
  bottomWidth: number,
  coverM: number
): number {
  const h = height < 0 ? 0 : height;
  const tw = topWidth < 0 ? 0 : topWidth;
  const bw = bottomWidth < 0 ? 0 : bottomWidth;
  const c = coverM < 0 ? 0 : coverM;

  const bSlope = Math.abs(bw - tw);
  const inclinedLength = Math.sqrt(h * h + bSlope * bSlope);
  return roundTo3(Math.max(0, inclinedLength - 2 * c));
}

/**
 * Calculates reinforcement bar count for Slab Culvert Wing Walls.
 * Does NOT add the (+1) starter bar because the corner contains the terminal bar of the abutment's run.
 */
export function calculateSlabCulvertWingWallReinforcementCount(
  wallLength: number,
  spacing: number
): number {
  const wl = wallLength < 0 ? 0 : wallLength;
  const s = spacing <= 0 ? 1 : spacing;
  return Math.round(wl / s);
}
