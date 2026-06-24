/**
 * Water Reservoir & Septic Tank/Soak Pit Calculation Engine
 * Implements equations from sessional design rules.
 */

/**
 * Calculates total reservoir excavation volume.
 * Formula: (L + 2c) * (B + 2c) * H
 */
export function calculateReservoirExcavation(
  L: number,
  B: number,
  H: number,
  c: number
): number {
  if (L <= 0 || B <= 0 || H <= 0 || c < 0) return 0;
  const vol = (L + 2 * c) * (B + 2 * c) * H;
  return Math.round(vol * 1000) / 1000;
}

/**
 * Calculates base raft concrete volume.
 * Formula: (L + 2 * t_wall) * (B + 2 * t_wall) * t_raft
 */
export function calculateReservoirRaft(
  L: number,
  B: number,
  tWall: number,
  tRaft: number = 0.3
): number {
  if (L <= 0 || B <= 0 || tWall < 0 || tRaft <= 0) return 0;
  const vol = (L + 2 * tWall) * (B + 2 * tWall) * tRaft;
  return Math.round(vol * 1000) / 1000;
}

/**
 * Calculates vertical concrete walls volume (deducting overlaps).
 * Formula: 2 * (L + B + 2 * t_wall) * t_wall * H
 */
export function calculateReservoirWalls(
  L: number,
  B: number,
  tWall: number,
  H: number
): number {
  if (L <= 0 || B <= 0 || tWall <= 0 || H <= 0) return 0;
  const vol = 2 * (L + B + 2 * tWall) * tWall * H;
  return Math.round(vol * 1000) / 1000;
}

/**
 * Calculates internal plastering area of walls + floor.
 * Formula: 2 * (L + B) * H + L * B
 */
export function calculateReservoirPlasterArea(
  L: number,
  B: number,
  H: number
): number {
  if (L <= 0 || B <= 0 || H <= 0) return 0;
  const area = 2 * (L + B) * H + L * B;
  return Math.round(area * 1000) / 1000;
}

/**
 * Calculates Pudlo waterproofing chemical requirement in kg.
 * Formula: plasterArea * admixtureRatio * cementBagWeightKg
 */
export function calculatePudloRequirement(
  plasterArea: number,
  admixtureRatio: number = 0.015,
  cementBagWeightKg: number = 50
): number {
  if (plasterArea <= 0 || admixtureRatio < 0 || cementBagWeightKg <= 0) return 0;
  const kg = plasterArea * admixtureRatio * cementBagWeightKg;
  return Math.round(kg * 1000) / 1000;
}

/**
 * Calculates soak pit net cylindrical volume.
 * Formula: PI * R^2 * H
 */
export function calculateSoakPitNetVolume(
  diameter: number,
  depth: number
): number {
  if (diameter <= 0 || depth <= 0) return 0;
  const radius = diameter / 2;
  const vol = Math.PI * radius * radius * depth;
  return Math.round(vol * 1000) / 1000;
}

/**
 * Calculates soak pit loose aggregate volume.
 * Formula: netVolume * containerFactor
 */
export function calculateSoakPitLooseVolume(
  netVolume: number,
  containerFactor: number = 1.33
): number {
  if (netVolume <= 0 || containerFactor <= 0) return 0;
  const vol = netVolume * containerFactor;
  return Math.round(vol * 1000) / 1000;
}
