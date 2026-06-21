import { describe, it, expect } from 'vitest';
import { calculatePointLoadFEM, calculateUDLFEM, calculateSettlementFEM } from '../fixedEndMoments';

describe('fixedEndMoments calculation engine', () => {
  it('correctly calculates point load FEM at center position', () => {
    // Member length = 6m, Point load = 20kN at center (position = 0.5)
    const step = calculatePointLoadFEM('member_1', 6, 20, 0.5);
    
    expect(step.type).toBe('CALCULATE_FEM');
    expect(step.payload.loadType).toBe('POINT_CENTER');
    expect(step.payload.variables.P).toBe(20);
    expect(step.payload.variables.L).toBe(6);
    // FEM_ab = P*L / 8 = 20 * 6 / 8 = 15 kNm
    expect(step.payload.results.M_ab).toBeCloseTo(15, 4);
    // FEM_ba = -P*L / 8 = -15 kNm
    expect(step.payload.results.M_ba).toBeCloseTo(-15, 4);
  });

  it('correctly calculates point load FEM at arbitrary position', () => {
    // Member length = 5m, Point load = 30kN at 2m from node A (relative position = 0.4)
    const step = calculatePointLoadFEM('member_1', 5, 30, 0.4);
    
    expect(step.payload.loadType).toBe('POINT_ANY');
    // a = 2m, b = 3m
    expect(step.payload.variables.a).toBeCloseTo(2, 4);
    expect(step.payload.variables.b).toBeCloseTo(3, 4);
    // FEM_ab = P*a*b^2 / L^2 = 30 * 2 * 9 / 25 = 21.6 kNm
    expect(step.payload.results.M_ab).toBeCloseTo(21.6, 4);
    // FEM_ba = -P*a^2*b / L^2 = -30 * 4 * 3 / 25 = -14.4 kNm
    expect(step.payload.results.M_ba).toBeCloseTo(-14.4, 4);
  });

  it('correctly calculates full span UDL FEM', () => {
    // Member length = 6m, UDL w = 12kN/m over full span (u=0, v=6)
    const step = calculateUDLFEM('member_1', 6, 12, 0, 6);
    
    expect(step.payload.loadType).toBe('UDL_FULL');
    // FEM_ab = w*L^2 / 12 = 12 * 36 / 12 = 36 kNm
    expect(step.payload.results.M_ab).toBeCloseTo(36, 4);
    expect(step.payload.results.M_ba).toBeCloseTo(-36, 4);
  });

  it('correctly integrates partial span UDL FEM', () => {
    // Member length = 6m, UDL w = 12kN/m from u=2m to v=5m
    const step = calculateUDLFEM('member_1', 6, 12, 2, 5);
    
    expect(step.payload.loadType).toBe('UDL_PARTIAL');
    expect(step.payload.variables.u).toBe(2);
    expect(step.payload.variables.v).toBe(5);

    // Manual integration validation:
    // M_ab = w/L^2 * [ L^2*x^2/2 - 2*L*x^3/3 + x^4/4 ] from 2 to 5
    // L=6, w=12, L^2=36, w/L^2 = 12/36 = 1/3
    // F(x) = 18*x^2 - 4*x^3 + 0.25*x^4
    // F(5) = 18*(25) - 4*(125) + 0.25*(625) = 450 - 500 + 156.25 = 106.25
    // F(2) = 18*(4) - 4*(8) + 0.25*(16) = 72 - 32 + 4 = 44
    // M_ab = 1/3 * (106.25 - 44) = 1/3 * 62.25 = 20.75 kNm
    expect(step.payload.results.M_ab).toBeCloseTo(20.75, 4);

    // M_ba = -w/L^2 * [ L*x^3/3 - x^4/4 ] from 2 to 5
    // G(x) = 2*x^3 - 0.25*x^4
    // G(5) = 2*(125) - 0.25*(625) = 250 - 156.25 = 93.75
    // G(2) = 2*(8) - 0.25*(16) = 16 - 4 = 12
    // M_ba = -1/3 * (93.75 - 12) = -1/3 * 81.75 = -27.25 kNm
    expect(step.payload.results.M_ba).toBeCloseTo(-27.25, 4);
  });

  it('correctly calculates support settlement FEM with proper signs and magnitude', () => {
    // L = 4m, E = 200GPa, I = 100 * 10^6 mm^4, delta = -0.01m (10mm downwards settlement)
    const step = calculateSettlementFEM('member_1', 4, 200, 100, -0.01);
    
    expect(step.payload.loadType).toBe('SETTLEMENT');
    expect(step.payload.variables.delta).toBe(-0.01);
    
    // EI = E * I = 200 * 100 = 20000 kNm^2
    // FEM_ab = FEM_ba = 6 * EI * delta / L^2 = 6 * 20000 * (-0.01) / 16 = -1200 / 16 = -75 kNm
    expect(step.payload.results.M_ab).toBeCloseTo(-75, 4);
    expect(step.payload.results.M_ba).toBeCloseTo(-75, 4);
  });
});
