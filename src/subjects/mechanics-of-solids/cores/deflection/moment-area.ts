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
    let t_BA: number | undefined;
    if (!isCantilever) {
      const { area: A_AB, moment: M_AB } = getAreaAndMoment(xA, xB);
      t_BA = xB * A_AB - M_AB;
      thetaA = -t_BA / (xB - xA);
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
    const segments: IMomentAreaSegment[] = mergedIntervals.map((inv) => {
      const { area, moment } = integrateSegment(inv.startX, inv.endX, inv);
      const centroidX = Math.abs(area) > 1e-7 ? moment / area : (inv.startX + inv.endX) / 2;

      return {
        startX: inv.startX,
        endX: inv.endX,
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
      const label = getCriticalLabel(x, N, maxDeflPoint.x, beam.supports, eiSegments, beam.releases);

      return {
        x: parseFloat(x.toFixed(3)),
        label,
        slope: parseFloat(slope.toFixed(6)),
        deflection: parseFloat(deflection.toFixed(4)),
      };
    });

    return {
      success: true,
      points,
      criticalPoints,
      momentArea: {
        segments,
        referencePoint: xA,
        referencePointB: isCantilever ? undefined : xB,
        tBA: t_BA,
        thetaA,
        isCantilever,
      },
    };
  }
}

