import { ICalculateFemStep } from '../shared/types/step-protocol';

/**
 * Calculates Fixed-End Moments (FEM) for a member under a point load.
 * @param memberId Unique member identifier
 * @param L Length of the member in meters
 * @param P Magnitude of the point load in kN
 * @param position Relative position along the member (0 to 1)
 */
export function calculatePointLoadFEM(
  memberId: string,
  L: number,
  P: number,
  position: number
): ICalculateFemStep {
  const a = position * L;
  const b = L - a;
  
  let M_ab = 0;
  let M_ba = 0;
  let loadType: 'POINT_CENTER' | 'POINT_ANY' = 'POINT_ANY';

  // If load is within 1% of center, treat as center load for simpler educational display
  if (Math.abs(position - 0.5) < 0.01) {
    M_ab = (P * L) / 8;
    M_ba = -(P * L) / 8;
    loadType = 'POINT_CENTER';
  } else {
    M_ab = (P * a * b * b) / (L * L);
    M_ba = -(P * a * a * b) / (L * L);
    loadType = 'POINT_ANY';
  }

  return {
    stepId: `fem_${memberId}_point_${Date.now()}`,
    type: 'CALCULATE_FEM',
    highlightMembers: [memberId],
    payload: {
      memberId,
      loadType,
      variables: { P, a, b, L },
      results: { M_ab, M_ba }
    }
  };
}

/**
 * Calculates Fixed-End Moments (FEM) for a member under a UDL (full or partial).
 * @param memberId Unique member identifier
 * @param L Length of the member in meters
 * @param w Magnitude of the UDL in kN/m
 * @param u Start position of UDL from start node (0 to L)
 * @param v End position of UDL from start node (0 to L)
 */
export function calculateUDLFEM(
  memberId: string,
  L: number,
  w: number,
  u: number,
  v: number
): ICalculateFemStep {
  let M_ab = 0;
  let M_ba = 0;
  let loadType: 'UDL_FULL' | 'UDL_PARTIAL' = 'UDL_PARTIAL';

  // If UDL covers full span (within 1cm at ends)
  if (u < 0.01 && Math.abs(v - L) < 0.01) {
    M_ab = (w * L * L) / 12;
    M_ba = -(w * L * L) / 12;
    loadType = 'UDL_FULL';
  } else {
    // Polynomial integrations
    // M_ab = w / L^2 * [ L^2 * x^2 / 2 - 2 * L * x^3 / 3 + x^4 / 4 ] from u to v
    const evalAb = (x: number) => 
      ((L * L * x * x) / 2 - (2 * L * x * x * x) / 3 + (x * x * x * x) / 4);
    
    // M_ba = -w / L^2 * [ L * x^3 / 3 - x^4 / 4 ] from u to v
    const evalBa = (x: number) => 
      ((L * x * x * x) / 3 - (x * x * x * x) / 4);

    M_ab = (w / (L * L)) * (evalAb(v) - evalAb(u));
    M_ba = -(w / (L * L)) * (evalBa(v) - evalBa(u));
    loadType = 'UDL_PARTIAL';
  }

  return {
    stepId: `fem_${memberId}_udl_${Date.now()}`,
    type: 'CALCULATE_FEM',
    highlightMembers: [memberId],
    payload: {
      memberId,
      loadType,
      variables: { w, u, v, L },
      results: { M_ab, M_ba }
    }
  };
}

/**
 * Calculates Fixed-End Moments (FEM) caused by nodal support settlement.
 * @param memberId Unique member identifier
 * @param L Length of the member in meters
 * @param E Young's Modulus in GPa
 * @param I Moment of Inertia in 10^6 mm^4
 * @param delta Perpendicular relative joint displacement (settlement) in meters
 */
export function calculateSettlementFEM(
  memberId: string,
  L: number,
  E: number,
  I: number,
  delta: number
): ICalculateFemStep {
  // Conversion: E (GPa) * I (10^6 mm^4) = EI (kN * m^2)
  const EI = E * I;
  
  // FEM_ab = FEM_ba = 6 * E * I * delta / L^2
  const momentVal = (6 * EI * delta) / (L * L);

  return {
    stepId: `fem_${memberId}_settlement_${Date.now()}`,
    type: 'CALCULATE_FEM',
    highlightMembers: [memberId],
    payload: {
      memberId,
      loadType: 'SETTLEMENT',
      variables: { E, I, delta, L },
      results: { M_ab: momentVal, M_ba: momentVal }
    }
  };
}
