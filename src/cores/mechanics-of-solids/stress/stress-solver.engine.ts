import { ICrossSection, IStressPoint } from './stress.interface';
import { CrossSectionEngine } from './cross-section.engine';
import { StaticalMomentEngine } from './statical-moment.engine';

export class StressSolverEngine {
  static solveDistribution(
    shape: ICrossSection,
    M: number, // Bending moment in N-m
    V: number, // Shear force in N
    defaultI: number = 100e-6
  ): {
    points: IStressPoint[];
    maxBendingTension: number;
    maxBendingCompression: number;
    maxShear: number;
  } {
    const props = CrossSectionEngine.calculateProperties(shape, defaultI);
    const H = shape.type === 'circular' ? (shape.diameter ?? 0.1) : (shape.height ?? 0.2);
    const ybar = props.centroid;
    const I = props.I;

    // Generate list of y coordinates relative to neutral axis
    const yCoordinates: number[] = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      yCoordinates.push(-ybar + (i / steps) * H);
    }

    // Add junction coordinates to capture shear stress jumps
    const junctions: { y: number; flangeWidth: number }[] = [];
    const tf = shape.thicknessFlange ?? 0.01;
    const tfBot = shape.thicknessFlangeBottom ?? tf;
    const yBotJunction = (shape.type === 'i-beam' || shape.type === 'channel') ? tfBot - ybar : null;
    const yTopJunction = (shape.type === 'i-beam' || shape.type === 'channel' || shape.type === 't-beam') ? H - tf - ybar : null;

    if (shape.type === 'i-beam' || shape.type === 'channel') {
      // Bottom junction
      junctions.push({
        y: yBotJunction!,
        flangeWidth: shape.widthBottom ?? (shape.width ?? 0.15),
      });
      // Top junction
      junctions.push({
        y: yTopJunction!,
        flangeWidth: shape.width ?? 0.15,
      });
    } else if (shape.type === 't-beam') {
      junctions.push({
        y: yTopJunction!,
        flangeWidth: shape.width ?? 0.15,
      });
    }

    // Evaluate stresses at all coordinates
    const points: IStressPoint[] = [];

    // Standard coordinates
    yCoordinates.forEach(y => {
      // Skip coordinates that are extremely close to junctions to avoid duplicate overlaps
      if (junctions.some(j => Math.abs(j.y - y) < 1e-4)) return;

      const { Q, t } = StaticalMomentEngine.calculateQAndWidth(shape, y, props);
      const sigma = I > 1e-12 ? -(M * y) / I : 0;
      const tau = I > 1e-12 && t > 1e-6 ? (V * Q) / (I * t) : 0;

      points.push({ y, sigma, tau });
    });

    // Junctions with both widths (flange vs web)
    junctions.forEach(({ y, flangeWidth }) => {
      // 1. Evaluate with flange width
      const { Q } = StaticalMomentEngine.calculateQAndWidth(shape, y, props);
      const sigma = I > 1e-12 ? -(M * y) / I : 0;
      const tauFlange = I > 1e-12 && flangeWidth > 1e-6 ? (V * Q) / (I * flangeWidth) : 0;
      points.push({ y, sigma, tau: tauFlange });

      // 2. Evaluate with web width
      const tw = shape.thicknessWeb ?? (shape.type === 't-beam' ? 0.008 : 0.006);
      const tauWeb = I > 1e-12 && tw > 1e-6 ? (V * Q) / (I * tw) : 0;
      points.push({ y, sigma, tau: tauWeb });
    });

    // Sort points by y coordinate from bottom to top
    // For identical y (junctions), sort by tau so the jump renders correctly in charts.
    // If it's near the top junction, we go from web (high tau) to flange (low tau), so sort descending.
    // If it's near the bottom junction, we go from flange (low tau) to web (high tau), so sort ascending.
    points.sort((a, b) => {
      if (Math.abs(a.y - b.y) < 1e-4) {
        if (yTopJunction !== null && Math.abs(a.y - yTopJunction) < 1e-4) {
          return b.tau - a.tau;
        }
        if (yBotJunction !== null && Math.abs(a.y - yBotJunction) < 1e-4) {
          return a.tau - b.tau;
        }
        return a.y > 0 ? b.tau - a.tau : a.tau - b.tau;
      }
      return a.y - b.y;
    });

    // Compute maximums
    let maxBendingTension = 0;     // Positive stress
    let maxBendingCompression = 0;  // Negative stress
    let maxShear = 0;

    points.forEach(p => {
      if (p.sigma > maxBendingTension) maxBendingTension = p.sigma;
      if (p.sigma < maxBendingCompression) maxBendingCompression = p.sigma;
      if (Math.abs(p.tau) > maxShear) maxShear = Math.abs(p.tau);
    });

    return {
      points,
      maxBendingTension,
      maxBendingCompression,
      maxShear,
    };
  }
}
