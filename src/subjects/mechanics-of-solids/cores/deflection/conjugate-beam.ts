import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult, IConjugateReaction } from './types';
import { IDeflectionMethod } from './deflection.interface';
import { DoubleIntegrationMethod } from './double-integration';

export class ConjugateBeamMethod implements IDeflectionMethod {
  solve(
    beam: IBeam,
    reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    customInspectX: number | null
  ): IDeflectionResult {
    // 1. Solve the beam deflection/slope using Double Integration (the general math solver)
    const diSolver = new DoubleIntegrationMethod();
    const diResult = diSolver.solve(beam, reactions, sfdBmdIntervals, eiSegments, customInspectX);
    if (!diResult.success) return diResult;

    // 2. Perform Conjugate Support transformations
    // Real Pin/Roller at End -> Conjugate Pin/Roller
    // Real Fixed -> Conjugate Free
    // Real Free -> Conjugate Fixed
    // Real Internal Support -> Conjugate Internal Hinge
    // Real Internal Hinge -> Conjugate Internal Support
    const N = beam.length;
    const conjSupports: { position: number; type: string }[] = [];

    // Map boundary supports
    const supportPositions = new Set<number>();
    beam.supports.forEach(s => supportPositions.add(s.position));

    const internalSupports = beam.supports.filter(s => s.position > 0 && s.position < N);

    // Left end (0) support
    const leftSupport = beam.supports.find(s => s.position === 0);
    if (leftSupport) {
      if (leftSupport.type === 'fixed') {
        conjSupports.push({ position: 0, type: 'Free End' });
      } else {
        conjSupports.push({ position: 0, type: leftSupport.type === 'roller' ? 'Roller Support' : 'Hinged Support' });
      }
    } else {
      // Free end
      conjSupports.push({ position: 0, type: 'Fixed Support' });
    }

    // Right end (N) support
    const rightSupport = beam.supports.find(s => s.position === N);
    if (rightSupport) {
      if (rightSupport.type === 'fixed') {
        conjSupports.push({ position: N, type: 'Free End' });
      } else {
        conjSupports.push({ position: N, type: rightSupport.type === 'roller' ? 'Roller Support' : 'Hinged Support' });
      }
    } else {
      // Free end
      conjSupports.push({ position: N, type: 'Fixed Support' });
    }

    // Internal supports and releases mapping
    internalSupports.forEach(s => {
      conjSupports.push({ position: s.position, type: 'Internal Hinge' });
    });

    beam.releases.forEach(r => {
      conjSupports.push({ position: r.position, type: 'Internal Roller' });
    });

    // 3. Compute Conjugate Reactions
    const conjReactions: IConjugateReaction[] = [];

    // Helper to robustly find critical point with fallback
    const findCriticalPoint = (targetX: number) => {
      // 1. Try exact match (within tolerance for floats)
      let p = diResult.criticalPoints.find(pt => Math.abs(pt.x - targetX) < 1e-3);
      if (p) return p;

      // 2. Try looser match
      p = diResult.criticalPoints.find(pt => Math.abs(pt.x - targetX) < 1e-2);
      if (p) return p;

      // 3. Fallback to closest point in 100-point slope array
      if (diResult.points.length > 0) {
        let closest = diResult.points[0]!;
        let minDist = Math.abs(closest.x - targetX);
        diResult.points.forEach(pt => {
          const dist = Math.abs(pt.x - targetX);
          if (dist < minDist) {
            minDist = dist;
            closest = pt;
          }
        });
        return { x: closest.x, slope: closest.slope, deflection: closest.deflection, label: 'Point' };
      }

      // 4. Absolute fallback to prevent crash
      return { x: targetX, slope: 0, deflection: 0, label: 'Point' };
    };

    // Left end reactions
    if (!leftSupport) {
      // Real free end is conjugate fixed end
      // R_y,conj = theta(0), M_conj = v(0)
      const p = findCriticalPoint(0);
      conjReactions.push({ supportId: 'conj-left-force', type: 'R_y', value: p.slope });
      conjReactions.push({ supportId: 'conj-left-moment', type: 'M', value: p.deflection / 1000 });
    } else if (leftSupport.type !== 'fixed') {
      const p = findCriticalPoint(0);
      conjReactions.push({ supportId: leftSupport.id, type: 'R_y', value: p.slope });
    }

    // Right end reactions
    if (!rightSupport) {
      // Real free end is conjugate fixed end
      const p = findCriticalPoint(N);
      conjReactions.push({ supportId: 'conj-right-force', type: 'R_y', value: -p.slope });
      conjReactions.push({ supportId: 'conj-right-moment', type: 'M', value: -p.deflection / 1000 });
    } else if (rightSupport.type !== 'fixed') {
      const p = findCriticalPoint(N);
      conjReactions.push({ supportId: rightSupport.id, type: 'R_y', value: -p.slope });
    }

    // Internal Hinge/Support reactions
    beam.releases.forEach((r, idx) => {
      // Real hinge becomes conjugate support
      // Reaction is the jump in slope (shear jump)
      const p = findCriticalPoint(r.position);
      conjReactions.push({ supportId: `conj-internal-${idx}`, type: 'R_y', value: p.slope });
    });

    return {
      success: true,
      points: diResult.points,
      criticalPoints: diResult.criticalPoints,
      conjugateBeam: {
        supports: conjSupports,
        reactions: conjReactions,
      },
    };

  }
}
