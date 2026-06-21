import { ISFDBmdService } from './ISFDBmdService';
import { IBeam, ISolverOutput, ICriticalPoint, IIntervalEquation } from './types';
import { calculateDOI } from './doiCalculator';
import { solveReactions } from './reactionSolver';
import { generateIntervals } from './sectionMethodEngine';
import { calculateGraphicalMethod } from './graphicalMethodEngine';

// Evaluate a polynomial represented by coefficients at coordinate x
function evalPoly(coeffs: number[], x: number): number {
  let val = 0;
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i];
    if (c !== undefined) {
      val = val * x + c;
    }
  }
  return val;
}

// Find roots of V(x) = a*x^2 + b*x + c in (startX, endX)
function findShearRoots(interval: IIntervalEquation): number[] {
  const [a, b, c] = interval.vCoeffs;
  const roots: number[] = [];

  if (Math.abs(a) < 1e-9) {
    if (Math.abs(b) > 1e-9) {
      const r = -c / b;
      if (r > interval.startX + 1e-9 && r < interval.endX - 1e-9) {
        roots.push(r);
      }
    }
  } else {
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const sqrtD = Math.sqrt(disc);
      const r1 = (-b + sqrtD) / (2 * a);
      const r2 = (-b - sqrtD) / (2 * a);
      [r1, r2].forEach(r => {
        if (r > interval.startX + 1e-9 && r < interval.endX - 1e-9) {
          roots.push(r);
        }
      });
    }
  }
  return roots;
}

export class SFDBmdService implements ISFDBmdService {
  public solve(beam: IBeam): ISolverOutput {
    // 1. Calculate DOI & Stability
    const doiResult = calculateDOI(beam);

    if (doiResult.isUnstable || doiResult.isIndeterminate) {
      return {
        success: false,
        doiResult,
        reactions: [],
        intervals: [],
        criticalPoints: [],
      };
    }

    // 2. Solve Reactions
    const rxnResult = solveReactions(beam);
    if (!rxnResult.success) {
      return {
        success: false,
        doiResult,
        reactions: [],
        intervals: [],
        criticalPoints: [],
      };
    }

    // Round reactions to 3 decimal places
    const reactions = rxnResult.reactions.map(r => ({
      ...r,
      value: parseFloat(r.value.toFixed(3)),
    }));

    // 3. Generate Intervals & Equations
    const intervals = generateIntervals(beam, reactions);

    // 4. Calculate Graphical Method steps
    const graphResult = calculateGraphicalMethod(beam, reactions, intervals);

    // 5. Gather Critical Points & Evaluate values
    const pointsSet = new Set<number>();
    pointsSet.add(0);
    pointsSet.add(beam.length);

    beam.supports.forEach(s => pointsSet.add(s.position));
    beam.releases.forEach(r => pointsSet.add(r.position));
    beam.loads.forEach(l => {
      if (l.position !== undefined) pointsSet.add(l.position);
      if (l.startPosition !== undefined) pointsSet.add(l.startPosition);
      if (l.endPosition !== undefined) pointsSet.add(l.endPosition);
    });

    // Solve for local max/min moment by finding roots of shear V(x) = 0
    intervals.forEach(inv => {
      findShearRoots(inv).forEach(r => pointsSet.add(r));
    });

    const sortedPoints = Array.from(pointsSet).sort((a, b) => a - b);
    const criticalPoints: ICriticalPoint[] = [];

    sortedPoints.forEach(x => {
      // Find the interval this point belongs to.
      // If it's a boundary point, we evaluate left and right limits.
      let vLeft = 0;
      let mLeft = 0;
      let vRight = 0;
      let mRight = 0;

      // Find interval immediately to the left
      const leftInv = intervals.find(inv => x > inv.startX - 1e-9 && x <= inv.endX + 1e-9);
      if (leftInv) {
        vLeft = evalPoly(leftInv.vCoeffs, x);
        mLeft = evalPoly(leftInv.mCoeffs, x);
      }

      // Find interval immediately to the right
      const rightInv = intervals.find(inv => x >= inv.startX - 1e-9 && x < inv.endX + 1e-9);
      if (rightInv) {
        vRight = evalPoly(rightInv.vCoeffs, x);
        mRight = evalPoly(rightInv.mCoeffs, x);
      }

      const vVal = Math.abs(vLeft) > Math.abs(vRight) ? vLeft : vRight;
      const mVal = Math.abs(mLeft) > Math.abs(mRight) ? mLeft : mRight;

      // Check if it's a zero shear crossing (V = 0)
      const isZeroShear = Math.abs(vLeft) < 1e-2 || Math.abs(vRight) < 1e-2 || (vLeft * vRight < 0);

      criticalPoints.push({
        x: parseFloat(x.toFixed(3)),
        v: parseFloat(vVal.toFixed(3)),
        m: parseFloat(mVal.toFixed(3)),
        isLocalMaxMinM: isZeroShear,
      });
    });

    return {
      success: true,
      doiResult,
      reactions,
      intervals,
      criticalPoints,
      reactionEquations: rxnResult.reactionEquations,
      graphicalStepsData: graphResult.graphicalSteps,
    };
  }
}
