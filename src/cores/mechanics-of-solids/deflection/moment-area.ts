import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult, IMomentAreaSegment, ICriticalDeflectionPoint, IDeflectionPoint } from './types';
import { IDeflectionMethod } from './deflection.interface';
import { getMergedIntervals, IMergedInterval, getCriticalCoords, getCriticalLabel } from './deflection.shared';
import { DoubleIntegrationMethod } from './double-integration';

export class MomentAreaMethod implements IDeflectionMethod {
  solve(
    beam: IBeam,
    reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    customInspectX: number | null
  ): IDeflectionResult {
    const N = beam.length;
    const hasHinges = beam.releases.length > 0;

    // For Gerber beams with internal release hinges, we fall back to Double Integration for points,
    // but we can still document that we use Double Integration because of slope discontinuity.
    if (hasHinges) {
      const diSolver = new DoubleIntegrationMethod();
      const result = diSolver.solve(beam, reactions, sfdBmdIntervals, eiSegments, customInspectX);
      if (!result.success) return result;
      result.steps = [
        `### Moment-Area Method Calculation Steps`,
        `The Moment-Area Method utilizes Mohr's Theorems to compute slopes and deflections.`,
        `**Note:** This structure is a Gerber Beam with internal hinges ($H > 0$).`,
        `Because internal hinges introduce slope discontinuities (angles/hinge rotations), the moment-area theorems cannot be applied as a single continuous integration across the entire beam.`,
        `Instead, the slope and deflection curves are solved segment-by-segment using the Double Integration method (refer to the Double Integration tab).`
      ];
      return result;
    }

    const mergedIntervals = getMergedIntervals(sfdBmdIntervals, eiSegments, N);

    // Identify reference supports
    const fixedSupport = beam.supports.find(s => s.type === 'fixed');
    const simpleSupports = beam.supports.filter(s => s.type === 'hinge' || s.type === 'roller');

    let xA = 0;
    let xB = 0;
    let thetaA = 0;
    let isCantilever = false;

    if (fixedSupport) {
      xA = fixedSupport.position;
      thetaA = 0;
      isCantilever = true;
    } else if (simpleSupports.length >= 2) {
      // Sort supports by position
      simpleSupports.sort((a, b) => a.position - b.position);
      xA = simpleSupports[0]!.position;
      xB = simpleSupports[1]!.position;
    } else if (simpleSupports.length === 1) {
      // Single support - unstable unless it has a moment reaction, but we assume determinate & stable
      xA = simpleSupports[0]!.position;
      xB = N;
    } else {
      xA = 0;
      xB = N;
    }

    // Helper to integrate moment and moment*x on segment
    const integrateSegment = (s: number, e: number, inv: IMergedInterval) => {
      const padded: [number, number, number, number] = [0, 0, 0, 0];
      const offset = 4 - inv.mCoeffs.length;
      for (let i = 0; i < inv.mCoeffs.length; i++) {
        if (offset + i >= 0 && offset + i < 4) {
          padded[offset + i] = inv.mCoeffs[i] ?? 0;
        }
      }
      const [a, b, c, d] = padded;
      const EI = inv.EI;

      // Area = \int M(u)/EI du = [a u^4/4 + b u^3/3 + c u^2/2 + d u] / EI
      const areaAt = (u: number) => (a * Math.pow(u, 4) / 4 + b * Math.pow(u, 3) / 3 + c * Math.pow(u, 2) / 2 + d * u) / EI;
      const area = areaAt(e) - areaAt(s);

      // Moment = \int M(u)*u/EI du = [a u^5/5 + b u^4/4 + c u^3/3 + d u^2/2] / EI
      const momentAt = (u: number) => (a * Math.pow(u, 5) / 5 + b * Math.pow(u, 4) / 4 + c * Math.pow(u, 3) / 3 + d * Math.pow(u, 2) / 2) / EI;
      const moment = momentAt(e) - momentAt(s);

      return { area, moment };
    };

    // Calculate Area and Moment of Area between two coordinates x1 and x2
    const getAreaAndMoment = (x1: number, x2: number) => {
      const isReverse = x1 > x2;
      const s = isReverse ? x2 : x1;
      const e = isReverse ? x1 : x2;

      let totalArea = 0;
      let totalMoment = 0;

      mergedIntervals.forEach(inv => {
        const overlapS = Math.max(s, inv.startX);
        const overlapE = Math.min(e, inv.endX);
        if (overlapE > overlapS + 1e-5) {
          const { area, moment } = integrateSegment(overlapS, overlapE, inv);
          totalArea += area;
          totalMoment += moment;
        }
      });

      if (isReverse) {
        return { area: -totalArea, moment: -totalMoment };
      }
      return { area: totalArea, moment: totalMoment };
    };

    // Solve for reference tangent slope thetaA if simply supported
    const calculations: string[] = [];
    if (!isCantilever) {
      const { area: A_AB, moment: M_AB } = getAreaAndMoment(xA, xB);
      // t_B/A = x_B * Area - Moment
      const t_BA = xB * A_AB - M_AB;
      thetaA = -t_BA / (xB - xA);

      calculations.push(`Reference supports chosen at $A = ${xA.toFixed(2)}\\text{ m}$ and $B = ${xB.toFixed(2)}\\text{ m}$.`);
      calculations.push(`Tangential deviation of $B$ relative to $A$ ($t_{B/A}$):`);
      calculations.push(`$$t_{B/A} = \\int_{${xA.toFixed(2)}}^{${xB.toFixed(2)}} \\frac{M(x)}{EI} (${xB.toFixed(2)} - x) dx = ${t_BA.toFixed(6)}\\text{ m}$$`);
      calculations.push(`Initial slope of the tangent at $A$ ($\\theta_A$):`);
      calculations.push(`$$\\theta_A = -\\frac{t_{B/A}}{x_B - x_A} = -\\frac{${t_BA.toFixed(6)}}{${(xB - xA).toFixed(2)}} = ${thetaA.toFixed(6)}\\text{ rad}$$`);
    } else {
      calculations.push(`Fixed support at $A = ${xA.toFixed(2)}\\text{ m}$ selected as the reference point.`);
      calculations.push(`Since support $A$ is fixed, the tangent line is horizontal:`);
      calculations.push(`$$\\theta_A = 0\\text{ rad}$$`);
    }

    // Evaluate deflection at 100 points
    const points: IDeflectionPoint[] = [];
    const numPoints = 100;
    const dx = N / numPoints;
    for (let pIdx = 0; pIdx <= numPoints; pIdx++) {
      const x = Math.min(N, pIdx * dx);
      const { area: A_Ax, moment: M_Ax } = getAreaAndMoment(xA, x);
      
      const t_xA = x * A_Ax - M_Ax;
      const slope = thetaA + A_Ax;
      const deflection = (thetaA * (x - xA) + t_xA) * 1000; // in mm

      points.push({
        x: parseFloat(x.toFixed(3)),
        slope: parseFloat(slope.toFixed(6)),
        deflection: parseFloat(deflection.toFixed(4)),
      });
    }

    // Centroid segments compilation for the breakdown UI
    const segments: IMomentAreaSegment[] = mergedIntervals.map((inv, idx) => {
      const { area, moment } = integrateSegment(inv.startX, inv.endX, inv);
      const centroidX = Math.abs(area) > 1e-7 ? moment / area : (inv.startX + inv.endX) / 2;

      return {
        startX: inv.startX,
        endX: inv.endX,
        description: `Segment ${idx + 1} ($x \\in [${inv.startX.toFixed(2)}, ${inv.endX.toFixed(2)}]$)`,
        area,
        centroidX,
        momentOfAreaAboutLeft: area * (centroidX - inv.startX),
        momentOfAreaAboutRight: area * (inv.endX - centroidX),
      };
    });

    let maxDeflPoint = points[0]!;
    points.forEach(p => {
      if (Math.abs(p.deflection) > Math.abs(maxDeflPoint.deflection)) {
        maxDeflPoint = p;
      }
    });

    const coords = getCriticalCoords(beam, customInspectX, eiSegments, maxDeflPoint.x);

    const criticalPoints: ICriticalDeflectionPoint[] = coords.map(x => {
      const { area: A_Ax, moment: M_Ax } = getAreaAndMoment(xA, x);
      const t_xA = x * A_Ax - M_Ax;
      const slope = thetaA + A_Ax;
      const deflection = (thetaA * (x - xA) + t_xA) * 1000;
      const label = getCriticalLabel(x, N, maxDeflPoint.x, beam.supports, eiSegments);

      return {
        x: parseFloat(x.toFixed(3)),
        label,
        slope: parseFloat(slope.toFixed(6)),
        deflection: parseFloat(deflection.toFixed(4)),
      };
    });

    // Step-by-step descriptions
    const steps: string[] = [];
    steps.push(`### Moment-Area Calculation Steps`);
    steps.push(`Mohr's theorems are applied using the geometric area and centroid of the $M/EI$ curve:`);
    steps.push(`- **Theorem I (Slope change):** $\\theta_B - \\theta_A = \\text{Area under } \\frac{M}{EI} \\text{ curve}$`);
    steps.push(`- **Theorem II (Tangential deviation):** $t_{B/A} = \\text{Area} \\times \\bar{x}_B$, where $\\bar{x}_B$ is measured from $B$.`);

    steps.push(`#### Step 1: Segmentation of the beam stiffness`);
    segments.forEach(seg => {
      steps.push(`- **${seg.description}**: Area under $M/EI = ${seg.area.toFixed(5)}\\text{ rad}$, Centroid $\\bar{x} = ${seg.centroidX.toFixed(3)}\\text{ m}$.`);
    });

    steps.push(`#### Step 2: Establish the reference tangent`);
    calculations.forEach(calc => steps.push(`- ${calc}`));

    steps.push(`#### Step 3: Evaluate deflection at points`);
    steps.push(`For any coordinate $x$, the deflection is calculated using:`);
    steps.push(`$$v(x) = \\theta_A (x - x_A) + t_{x/A}$$`);
    steps.push(`where $t_{x/A} = \\int_{x_A}^{x} \\frac{M(u)}{EI} (x - u) du$.`);

    return {
      success: true,
      points,
      criticalPoints,
      steps,
      momentArea: {
        segments,
        referencePoint: xA,
        calculations,
      },
    };
  }
}
