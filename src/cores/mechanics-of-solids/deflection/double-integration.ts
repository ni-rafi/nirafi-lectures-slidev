import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult, IDoubleIntegrationInterval, ICriticalDeflectionPoint, IDeflectionPoint } from './types';
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

    const bcSteps: string[] = [];

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
      bcSteps.push(`Deflection at support ${s.type} at $x = ${s.position.toFixed(2)}\\text{ m}$: $v_{${k + 1}}(${s.position.toFixed(2)}) = 0$`);
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
        bcSteps.push(`Slope at fixed support at $x = ${s.position.toFixed(2)}\\text{ m}$: $\\theta_{${k + 1}}(${s.position.toFixed(2)}) = 0$`);
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
      bcSteps.push(`Deflection continuity at $x = ${x_b.toFixed(2)}\\text{ m}$: $v_{${j + 1}}(${x_b.toFixed(2)}) = v_{${j + 2}}(${x_b.toFixed(2)})$`);
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
        bcSteps.push(`Slope continuity at $x = ${x_b.toFixed(2)}\\text{ m}$: $\\theta_{${j + 1}}(${x_b.toFixed(2)}) = \\theta_{${j + 2}}(${x_b.toFixed(2)})$`);
        eq++;
      } else {
        bcSteps.push(`Internal Hinge at $x = ${x_b.toFixed(2)}\\text{ m}$: allows slope discontinuity $\\theta_{${j + 1}} \\neq \\theta_{${j + 2}}$`);
      }
    }

    // Solve system of equations
    const constants = solveLinearSystem(A, B);
    if (!constants) {
      return {
        success: false,
        points: [],
        criticalPoints: [],
        steps: [
          '### Boundary Conditions Solve Failed',
          'Error: The deflection system of equations is singular or unstable.',
          'Please verify that the beam is stable and has sufficient supports. For example, a hinge or internal release requires a corresponding support or restraint to prevent collapse.'
        ]
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
      const label = getCriticalLabel(x, N, maxDeflPoint.x, beam.supports, eiSegments);

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

      // Formulate equations
      // M(x) = ax^3 + bx^2 + cx + d
      const mStr = inv.latexM;

      const slopeEq = `\\theta_{${idx + 1}}(x) = \\frac{1}{EI_{${idx + 1}}} \\left( \\int M(x) dx + C_{1,${idx + 1}} \\right) = \\frac{1}{${inv.EI.toFixed(1)}} \\left( \\text{integrated Moment} + (${c1.toFixed(3)}) \\right)`;
      const deflEq = `v_{${idx + 1}}(x) = \\frac{1}{EI_{${idx + 1}}} \\left( \\iint M(x) dx + C_{1,${idx + 1}}x + C_{2,${idx + 1}} \\right) = \\frac{1}{${inv.EI.toFixed(1)}} \\left( \\text{integrated twice} + (${c1.toFixed(3)})x + (${c2.toFixed(3)}) \\right)`;

      return {
        startX: inv.startX,
        endX: inv.endX,
        equationM: `M(x) = ${mStr}`,
        equationSlope: slopeEq,
        equationDeflection: deflEq,
        C1: parseFloat(c1.toFixed(4)),
        C2: parseFloat(c2.toFixed(4)),
      };
    });

    // Compile step-by-step markdown explanations
    const steps: string[] = [];
    steps.push(`### Double Integration Calculation Steps`);
    steps.push(`The Double Integration Method solves the differential equation:`);
    steps.push(`$$EI \\frac{d^2v}{dx^2} = M(x)$$`);
    steps.push(`Integrating once gives the slope $\\theta(x)$, and twice gives the deflection $v(x)$:`);
    steps.push(`$$EI \\theta(x) = \\int M(x) dx + C_1$$`);
    steps.push(`$$EI v(x) = \\iint M(x) dx + C_1 x + C_2$$`);

    steps.push(`#### Step 1: Segmentation of the beam`);
    steps.push(`Based on moment intervals and $EI$ segments, the beam is divided into $${numSegs}$ segment(s):`);
    mergedIntervals.forEach((inv, idx) => {
      steps.push(`- **Segment ${idx + 1}** ($x \\in [${inv.startX.toFixed(2)}, ${inv.endX.toFixed(2)}]\\text{ m}$): $EI = ${inv.EI.toFixed(1)}\\text{ kN}\\cdot\\text{m}^2$ ($E = ${inv.E}\\text{ GPa}$, $I = ${inv.I}\\text{ }10^6\\text{ mm}^4$).`);
    });

    steps.push(`#### Step 2: Formulate integration equations`);
    intervalsDetails.forEach((invDetails, idx) => {
      steps.push(`- **Segment ${idx + 1}** ($x \\in [${invDetails.startX.toFixed(2)}, ${invDetails.endX.toFixed(2)}]\\text{ m}$):`);
      steps.push(`  - Bending Moment: $${invDetails.equationM}$`);
      steps.push(`  - Slope: $EI_{${idx + 1}} \\theta_{${idx + 1}}(x) = F_{\\theta, ${idx + 1}}(x) + C_{1, ${idx + 1}}$`);
      steps.push(`  - Deflection: $EI_{${idx + 1}} v_{${idx + 1}}(x) = F_{v, ${idx + 1}}(x) + C_{1, ${idx + 1}}x + C_{2, ${idx + 1}}$`);
    });

    steps.push(`#### Step 3: Set up boundary and continuity conditions`);
    steps.push(`We have $${numEq}$ unknowns constants $C_{1,i}, C_{2,i}$ ($i = 1 \\dots ${numSegs}$) solved by:`);
    bcSteps.forEach(bc => steps.push(`- ${bc}`));

    steps.push(`#### Step 4: Solved constants of integration`);
    solvedConstants.forEach(c => {
      steps.push(`- $${c.name} = ${c.value.toFixed(4)}$`);
    });

    return {
      success: true,
      points,
      criticalPoints,
      steps,
      doubleIntegration: {
        intervals: intervalsDetails,
        boundaryConditions: bcSteps,
        solvedConstants,
      },
    };
  }
}
