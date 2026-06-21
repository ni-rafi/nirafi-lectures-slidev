import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult, IDoubleIntegrationInterval, ICriticalDeflectionPoint, IDeflectionPoint, IDoubleIntegrationBC } from './types';
import { IDeflectionMethod } from './deflection.interface';
import { getMergedIntervals, evalPoly, integratePolyOnce, integratePolyTwice, getCriticalCoords, getCriticalLabel } from './deflection.shared';
import { solveLinearSystem } from '../sfd-bmd/reactionSolver';

export class DoubleIntegrationMethod implements IDeflectionMethod {
  solve(
    beam: IBeam,
    _reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    customInspectX: number | null
  ): IDeflectionResult {
    const N = beam.length;
    const mergedIntervals = getMergedIntervals(sfdBmdIntervals, eiSegments, N);
    const numSegs = mergedIntervals.length;

    // Pad coefficients to [a, b, c, d] for cubic M(x) = ax^3 + bx^2 + cx + d
    const padCoeffs = (coeffs: number[]): [number, number, number, number] => {
      const padded: [number, number, number, number] = [0, 0, 0, 0];
      const offset = 4 - coeffs.length;
      for (let i = 0; i < coeffs.length; i++) {
        const c = coeffs[i];
        if (c !== undefined && offset + i >= 0 && offset + i < 4) {
          padded[offset + i] = c;
        }
      }
      return padded;
    };

    // Calculate integrals for each segment
    const slopePolys = mergedIntervals.map(inv => integratePolyOnce(padCoeffs(inv.mCoeffs)));
    const deflPolys = mergedIntervals.map(inv => integratePolyTwice(padCoeffs(inv.mCoeffs)));

    // Variables mapper: C_1,i is at 2*i, C_2,i is at 2*i + 1
    const numEq = 2 * numSegs;
    const A: number[][] = Array.from({ length: numEq }, () => new Array(numEq).fill(0));
    const B: number[] = new Array(numEq).fill(0);
    let eq = 0;

    const boundaryConditions: IDoubleIntegrationBC[] = [];

    // Helper to find segment index containing coordinate x
    const getSegIndex = (x: number) => {
      for (let i = 0; i < numSegs; i++) {
        const inv = mergedIntervals[i];
        if (inv && x >= inv.startX - 1e-5 && x <= inv.endX + 1e-5) {
          return i;
        }
      }
      return numSegs - 1;
    };

    // 1. Support Deflection Boundary Conditions: v(x_s) = 0
    beam.supports.forEach((s) => {
      const k = getSegIndex(s.position);
      const invK = mergedIntervals[k];
      if (!invK) return;
      
      // EI_k * v_k(x_s) = F_defl(x_s) + C_1,k * x_s + C_2,k = 0
      // C_1,k * x_s + C_2,k = -F_defl(x_s)
      const valF = evalPoly(deflPolys[k]!, s.position);
      
      A[eq]![2 * k] = s.position;
      A[eq]![2 * k + 1] = 1;
      B[eq] = -valF;
      boundaryConditions.push({
        type: 'deflection-support',
        position: s.position,
        segmentIndex1: k,
        supportType: s.type,
      });
      eq++;
    });

    // 2. Fixed Support Slope Boundary Conditions: theta(x_s) = 0
    beam.supports.forEach((s) => {
      if (s.type === 'fixed') {
        const k = getSegIndex(s.position);
        
        // EI_k * theta_k(x_s) = F_slope(x_s) + C_1,k = 0
        // C_1,k = -F_slope(x_s)
        const valF = evalPoly(slopePolys[k]!, s.position);
        
        A[eq]![2 * k] = 1;
        B[eq] = -valF;
        boundaryConditions.push({
          type: 'slope-fixed',
          position: s.position,
          segmentIndex1: k,
        });
        eq++;
      }
    });

    // 3. Continuity Conditions at Segment Boundaries
    for (let j = 0; j < numSegs - 1; j++) {
      const invJ = mergedIntervals[j];
      const invJ1 = mergedIntervals[j + 1];
      if (!invJ || !invJ1) continue;
      const x_b = invJ.endX;
      const EI_j = invJ.EI;
      const EI_j1 = invJ1.EI;

      // Deflection continuity: v_j(x_b) = v_j+1(x_b)
      // (F_defl,j(x_b) + C_1,j * x_b + C_2,j) / EI_j = (F_defl,j+1(x_b) + C_1,j+1 * x_b + C_2,j+1) / EI_j1
      // C_1,j * (x_b / EI_j) + C_2,j * (1 / EI_j) - C_1,j+1 * (x_b / EI_j1) - C_2,j+1 * (1 / EI_j1) = F_defl,j1(x_b)/EI_j1 - F_defl,j(x_b)/EI_j
      const valFj = evalPoly(deflPolys[j]!, x_b);
      const valFj1 = evalPoly(deflPolys[j + 1]!, x_b);

      A[eq]![2 * j] = x_b / EI_j;
      A[eq]![2 * j + 1] = 1 / EI_j;
      A[eq]![2 * (j + 1)] = -x_b / EI_j1;
      A[eq]![2 * (j + 1) + 1] = -1 / EI_j1;
      B[eq] = valFj1 / EI_j1 - valFj / EI_j;
      boundaryConditions.push({
        type: 'deflection-continuity',
        position: x_b,
        segmentIndex1: j,
        segmentIndex2: j + 1,
      });
      eq++;

      // Slope continuity: theta_j(x_b) = theta_j+1(x_b) (only if there is no internal release hinge)
      const hasHinge = beam.releases.some(r => Math.abs(r.position - x_b) < 1e-4);
      if (!hasHinge) {
        // (F_slope,j(x_b) + C_1,j) / EI_j = (F_slope,j+1(x_b) + C_1,j+1) / EI_j1
        // C_1,j * (1 / EI_j) - C_1,j+1 * (1 / EI_j1) = F_slope,j1(x_b)/EI_j1 - F_slope,j(x_b)/EI_j
        const valSj = evalPoly(slopePolys[j]!, x_b);
        const valSj1 = evalPoly(slopePolys[j + 1]!, x_b);

        A[eq]![2 * j] = 1 / EI_j;
        A[eq]![2 * (j + 1)] = -1 / EI_j1;
        B[eq] = valSj1 / EI_j1 - valSj / EI_j;
        boundaryConditions.push({
          type: 'slope-continuity',
          position: x_b,
          segmentIndex1: j,
          segmentIndex2: j + 1,
        });
        eq++;
      } else {
        boundaryConditions.push({
          type: 'hinge-discontinuity',
          position: x_b,
          segmentIndex1: j,
          segmentIndex2: j + 1,
        });
      }
    }

    // Solve system of equations
    const constants = solveLinearSystem(A, B);
    if (!constants) {
      return {
        success: false,
        points: [],
        criticalPoints: [],
      };
    }

    const solvedConstants = [];
    for (let i = 0; i < numSegs; i++) {
      solvedConstants.push({ name: `C_{1,${i + 1}}`, value: parseFloat((constants[2 * i] ?? 0).toFixed(4)) });
      solvedConstants.push({ name: `C_{2,${i + 1}}`, value: parseFloat((constants[2 * i + 1] ?? 0).toFixed(4)) });
    }

    // Evaluate slope and deflection at 100 points
    const points: IDeflectionPoint[] = [];
    const numPoints = 100;
    const dx = N / numPoints;
    for (let pIdx = 0; pIdx <= numPoints; pIdx++) {
      const x = Math.min(N, pIdx * dx);
      const k = getSegIndex(x);
      const invK = mergedIntervals[k]!;
      const EI = invK.EI;
      
      const c1 = constants[2 * k]!;
      const c2 = constants[2 * k + 1]!;

      // Slope (rad) = (F_slope(x) + c1) / EI
      const slope = (evalPoly(slopePolys[k]!, x) + c1) / EI;
      // Deflection (m) = (F_defl(x) + c1 * x + c2) / EI
      // Deflection in mm = Deflection in m * 1000
      const deflection = ((evalPoly(deflPolys[k]!, x) + c1 * x + c2) / EI) * 1000;

      points.push({
        x: parseFloat(x.toFixed(3)),
        slope: parseFloat(slope.toFixed(6)),
        deflection: parseFloat(deflection.toFixed(4)),
      });
    }

    // Find coordinate of maximum deflection
    let maxDeflPoint = points[0]!;
    points.forEach(p => {
      if (Math.abs(p.deflection) > Math.abs(maxDeflPoint.deflection)) {
        maxDeflPoint = p;
      }
    });

    const coords = getCriticalCoords(beam, customInspectX, eiSegments, maxDeflPoint.x);

    const criticalPoints: ICriticalDeflectionPoint[] = coords.map(x => {
      const k = getSegIndex(x);
      const invK = mergedIntervals[k]!;
      const EI = invK.EI;
      const c1 = constants[2 * k]!;
      const c2 = constants[2 * k + 1]!;

      const slope = (evalPoly(slopePolys[k]!, x) + c1) / EI;
      const deflection = ((evalPoly(deflPolys[k]!, x) + c1 * x + c2) / EI) * 1000;
      const label = getCriticalLabel(x, N, maxDeflPoint.x, beam.supports, eiSegments, beam.releases);

      return {
        x: parseFloat(x.toFixed(3)),
        label,
        slope: parseFloat(slope.toFixed(6)),
        deflection: parseFloat(deflection.toFixed(4)),
      };
    });

    // Format LaTeX intervals details
    const intervalsDetails: IDoubleIntegrationInterval[] = mergedIntervals.map((inv, idx) => {
      const c1 = constants[2 * idx]!;
      const c2 = constants[2 * idx + 1]!;

      return {
        startX: inv.startX,
        endX: inv.endX,
        mCoeffs: inv.mCoeffs,
        slopeCoeffs: slopePolys[idx]!,
        deflCoeffs: deflPolys[idx]!,
        C1: parseFloat(c1.toFixed(4)),
        C2: parseFloat(c2.toFixed(4)),
        EI: inv.EI,
        latexM: inv.latexM,
      };
    });

    return {
      success: true,
      points,
      criticalPoints,
      doubleIntegration: {
        intervals: intervalsDetails,
        boundaryConditions,
        solvedConstants,
      },

    };
  }
}
