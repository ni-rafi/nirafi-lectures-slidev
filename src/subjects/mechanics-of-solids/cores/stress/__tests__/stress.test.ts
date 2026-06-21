import { describe, it, expect } from 'vitest';
import { CrossSectionEngine } from '../cross-section.engine';
import { StaticalMomentEngine } from '../statical-moment.engine';
import { StressSolverEngine } from '../stress-solver.engine';
import { StressTransformationEngine } from '../stress-transformation.engine';
import { MohrsCircleEngine } from '../mohrs-circle.engine';

describe('CrossSectionEngine', () => {
  it('should calculate rectangular properties correctly', () => {
    const shape = { type: 'rectangular' as const, width: 0.1, height: 0.2 };
    const props = CrossSectionEngine.calculateProperties(shape);

    expect(props.area).toBeCloseTo(0.02, 6);
    expect(props.centroid).toBeCloseTo(0.1, 6);
    expect(props.I).toBeCloseTo(6.666667e-5, 8);
  });

  it('should calculate circular properties correctly', () => {
    const shape = { type: 'circular' as const, diameter: 0.1 };
    const props = CrossSectionEngine.calculateProperties(shape);

    expect(props.area).toBeCloseTo(Math.PI * 0.05 * 0.05, 6);
    expect(props.centroid).toBeCloseTo(0.05, 6);
    expect(props.I).toBeCloseTo(4.9087385e-6, 9);
  });

  it('should calculate W-shape I-beam properties correctly', () => {
    const shape = {
      type: 'i-beam' as const,
      width: 0.15,
      height: 0.2,
      thicknessFlange: 0.01,
      thicknessWeb: 0.006,
    };
    const props = CrossSectionEngine.calculateProperties(shape);

    const expectedArea = 2 * 0.15 * 0.01 + 0.006 * 0.18;
    expect(props.area).toBeCloseTo(expectedArea, 6);
    expect(props.centroid).toBeCloseTo(0.1, 6);
    // I = (bf*d^3 - (bf-tw)*(d-2tf)^3) / 12
    const expectedI = (0.15 * Math.pow(0.2, 3) - 0.144 * Math.pow(0.18, 3)) / 12;
    expect(props.I).toBeCloseTo(expectedI, 9);
  });
});

describe('StaticalMomentEngine', () => {
  it('should calculate Q(y) at neutral axis for rectangular shape', () => {
    const shape = { type: 'rectangular' as const, width: 0.1, height: 0.2 };
    const props = CrossSectionEngine.calculateProperties(shape);
    const { Q, t } = StaticalMomentEngine.calculateQAndWidth(shape, 0, props);

    // Q_max at y=0 is b*h^2/8
    expect(Q).toBeCloseTo(0.1 * 0.04 / 8, 6);
    expect(t).toBe(0.1);
  });

  it('should calculate Q(y) inside flange and web for W-shape', () => {
    const shape = {
      type: 'i-beam' as const,
      width: 0.15,
      height: 0.2,
      thicknessFlange: 0.01,
      thicknessWeb: 0.006,
    };
    const props = CrossSectionEngine.calculateProperties(shape);

    // Flange point: y = 0.095m (within tf=0.01m from top)
    const flangeResult = StaticalMomentEngine.calculateQAndWidth(shape, 0.095, props);
    expect(flangeResult.t).toBe(0.15);

    // Web point: y = 0 (neutral axis)
    const webResult = StaticalMomentEngine.calculateQAndWidth(shape, 0, props);
    expect(webResult.t).toBe(0.006);
    // Q_max = bf*tf*(d/2 - tf/2) + tw/2 * (d/2 - tf)^2
    const expectedQ = 0.15 * 0.01 * 0.095 + (0.006 / 2) * Math.pow(0.09, 2);
    expect(webResult.Q).toBeCloseTo(expectedQ, 8);
  });
});

describe('StressSolverEngine', () => {
  it('should compute correct bending and shear distributions', () => {
    const shape = { type: 'rectangular' as const, width: 0.1, height: 0.2 };
    // Moment = 10 kN-m, Shear = 50 kN
    const { points, maxBendingTension, maxShear } = StressSolverEngine.solveDistribution(shape, 10000, 50000);

    // Max bending stress at outer fiber y = 0.1m
    // sigma = -M*y/I = -10000 * 0.1 / 6.6667e-5 = -15.0 MPa
    expect(Math.abs(maxBendingTension)).toBeCloseTo(15e6, 2);

    // Max shear stress at y = 0
    // tau = V*Q/(I*t) = 50000 * 5e-4 / (6.6667e-5 * 0.1) = 3.75 MPa
    expect(maxShear).toBeCloseTo(3.75e6, 2);
    expect(points.length).toBeGreaterThan(40);
  });
});

describe('StressTransformationEngine', () => {
  const originalState = {
    sigmaX: 80e6,  // 80 MPa
    sigmaY: 20e6,  // 20 MPa
    tauXY: 40e6,   // 40 MPa
  };

  it('should calculate principal stresses correctly', () => {
    const res = StressTransformationEngine.calculatePrincipal(originalState);

    // sigma_avg = 50 MPa
    // diff = 30 MPa, tau = 40 MPa -> R = 50 MPa
    // sigma_1 = 100 MPa, sigma_2 = 0 MPa, tau_max = 50 MPa
    expect(res.sigma1 / 1e6).toBeCloseTo(100, 1);
    expect(res.sigma2 / 1e6).toBeCloseTo(0, 1);
    expect(res.tauMax / 1e6).toBeCloseTo(50, 1);

    // 2*theta_p = atan2(80, 60) = 0.92729 rad -> theta_p = 0.4636 rad (26.57 degrees)
    expect(res.thetaP * 180 / Math.PI).toBeCloseTo(26.57, 1);
  });

  it('should transform stresses to a given angle correctly', () => {
    // Transform to theta = 30 degrees (0.52359 rad)
    const angle = 30 * Math.PI / 180;
    const res = StressTransformationEngine.transform(originalState, angle);

    // sigma_x' = 50 + 30*cos(60) + 40*sin(60) = 50 + 15 + 34.641 = 99.641 MPa
    expect(res.sigmaX / 1e6).toBeCloseTo(99.641, 3);
    // tau_x'y' = -30*sin(60) + 40*cos(60) = -25.981 + 20 = -5.981 MPa
    expect(res.tauXY / 1e6).toBeCloseTo(-5.981, 3);
  });
});

describe('MohrsCircleEngine', () => {
  it('should calculate center and radius correctly matching analytical stresses', () => {
    const state = { sigmaX: 80e6, sigmaY: 20e6, tauXY: 40e6 };
    const res = MohrsCircleEngine.solveCircle(state, 30 * Math.PI / 180);

    expect(res.center / 1e6).toBeCloseTo(50, 1);
    expect(res.radius / 1e6).toBeCloseTo(50, 1);
    expect(res.pointAPrime.x / 1e6).toBeCloseTo(99.641, 3);
    expect(res.pointAPrime.y / 1e6).toBeCloseTo(5.981, 3); // y-coordinate is -tauXY' = 5.981 MPa
  });
});
