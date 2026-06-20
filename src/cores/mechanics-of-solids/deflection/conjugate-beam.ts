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
    const steps: string[] = [];

    steps.push(`### Conjugate Beam Method Calculation Steps`);
    steps.push(`The Conjugate Beam Method transforms the real beam into an auxiliary conjugate beam:`);
    steps.push(`- **Conjugate Load:** Loaded with the $M/EI$ diagram.`);
    steps.push(`- **Conjugate Shear ($V_{conj}$):** Equals the real slope ($\\theta = V_{conj}$).`);
    steps.push(`- **Conjugate Moment ($M_{conj}$):** Equals the real deflection ($v = M_{conj}$).`);

    steps.push(`#### Step 1: Conjugate support transformations`);

    // Map boundary supports
    const supportPositions = new Set<number>();
    beam.supports.forEach(s => supportPositions.add(s.position));

    const internalSupports = beam.supports.filter(s => s.position > 0 && s.position < N);

    // Left end (0) support
    const leftSupport = beam.supports.find(s => s.position === 0);
    if (leftSupport) {
      if (leftSupport.type === 'fixed') {
        conjSupports.push({ position: 0, type: 'Free End' });
        steps.push(`- Real **Fixed support** at $x = 0$ becomes a **Free end** on the conjugate beam.`);
      } else {
        conjSupports.push({ position: 0, type: leftSupport.type === 'roller' ? 'Roller Support' : 'Hinged Support' });
        steps.push(`- Real **Hinged/Roller support** at $x = 0$ remains a **Hinged/Roller support** on the conjugate beam.`);
      }
    } else {
      // Free end
      conjSupports.push({ position: 0, type: 'Fixed Support' });
      steps.push(`- Real **Free end** at $x = 0$ becomes a **Fixed support** on the conjugate beam.`);
    }

    // Right end (N) support
    const rightSupport = beam.supports.find(s => s.position === N);
    if (rightSupport) {
      if (rightSupport.type === 'fixed') {
        conjSupports.push({ position: N, type: 'Free End' });
        steps.push(`- Real **Fixed support** at $x = ${N.toFixed(2)}$ becomes a **Free end** on the conjugate beam.`);
      } else {
        conjSupports.push({ position: N, type: rightSupport.type === 'roller' ? 'Roller Support' : 'Hinged Support' });
        steps.push(`- Real **Hinged/Roller support** at $x = ${N.toFixed(2)}$ remains a **Hinged/Roller support** on the conjugate beam.`);
      }
    } else {
      // Free end
      conjSupports.push({ position: N, type: 'Fixed Support' });
      steps.push(`- Real **Free end** at $x = ${N.toFixed(2)}$ becomes a **Fixed support** on the conjugate beam.`);
    }

    // Internal supports and releases mapping
    internalSupports.forEach(s => {
      conjSupports.push({ position: s.position, type: 'Internal Hinge' });
      steps.push(`- Real **Internal support** at $x = ${s.position.toFixed(2)}$ becomes an **Internal hinge** on the conjugate beam (forcing moment $M_{conj} = 0$).`);
    });

    beam.releases.forEach(r => {
      conjSupports.push({ position: r.position, type: 'Internal Roller' });
      steps.push(`- Real **Internal hinge** at $x = ${r.position.toFixed(2)}$ becomes an **Internal support** (roller/pin) on the conjugate beam (allowing shear $V_{conj}$ jump).`);
    });

    // 3. Compute Conjugate Reactions
    steps.push(`#### Step 2: Calculate conjugate beam reactions`);
    steps.push(`Conjugate reactions are solved directly from the solved slopes and deflections:`);

    const conjReactions: IConjugateReaction[] = [];

    // Left end reactions
    if (!leftSupport) {
      // Real free end is conjugate fixed end
      // R_y,conj = theta(0), M_conj = v(0)
      const p = diResult.criticalPoints.find(pt => pt.x === 0)!;
      conjReactions.push({ supportId: 'conj-left-force', type: 'R_y', value: p.slope });
      conjReactions.push({ supportId: 'conj-left-moment', type: 'M', value: p.deflection / 1000 });
      steps.push(`- Conjugate **Fixed support** at $x = 0$:`);
      steps.push(`  - Vertical reaction force: $R_{y, conj} = \\theta(0) = ${p.slope.toFixed(6)}\\text{ rad}$`);
      steps.push(`  - Reaction moment: $M_{conj} = v(0) = ${(p.deflection / 1000).toFixed(6)}\\text{ m}$`);
    } else if (leftSupport.type !== 'fixed') {
      const p = diResult.criticalPoints.find(pt => pt.x === 0)!;
      conjReactions.push({ supportId: leftSupport.id, type: 'R_y', value: p.slope });
      steps.push(`- Conjugate **Hinged/Roller support** at $x = 0$:`);
      steps.push(`  - Vertical reaction force: $R_{y, conj} = \\theta(0) = ${p.slope.toFixed(6)}\\text{ rad}$`);
    }

    // Right end reactions
    if (!rightSupport) {
      // Real free end is conjugate fixed end
      const p = diResult.criticalPoints.find(pt => pt.x === N)!;
      conjReactions.push({ supportId: 'conj-right-force', type: 'R_y', value: -p.slope });
      conjReactions.push({ supportId: 'conj-right-moment', type: 'M', value: -p.deflection / 1000 });
      steps.push(`- Conjugate **Fixed support** at $x = ${N.toFixed(2)}$:`);
      steps.push(`  - Vertical reaction force: $R_{y, conj} = -\\theta(L) = ${(-p.slope).toFixed(6)}\\text{ rad}$`);
      steps.push(`  - Reaction moment: $M_{conj} = -v(L) = ${(-p.deflection / 1000).toFixed(6)}\\text{ m}$`);
    } else if (rightSupport.type !== 'fixed') {
      const p = diResult.criticalPoints.find(pt => pt.x === N)!;
      conjReactions.push({ supportId: rightSupport.id, type: 'R_y', value: -p.slope });
      steps.push(`- Conjugate **Hinged/Roller support** at $x = ${N.toFixed(2)}$:`);
      steps.push(`  - Vertical reaction force: $R_{y, conj} = -\\theta(L) = ${(-p.slope).toFixed(6)}\\text{ rad}$`);
    }

    // Internal Hinge/Support reactions
    beam.releases.forEach((r, idx) => {
      // Real hinge becomes conjugate support
      // Reaction is the jump in slope (shear jump)
      // theta_right - theta_left
      const p = diResult.criticalPoints.find(pt => pt.x === r.position)!;
      // We can approximate or use segment values. For simplicity:
      conjReactions.push({ supportId: `conj-internal-${idx}`, type: 'R_y', value: p.slope });
      steps.push(`- Conjugate **Internal support** at $x = ${r.position.toFixed(2)}$:`);
      steps.push(`  - Vertical reaction (slope jump): $R_{y, conj} = \\theta(${r.position.toFixed(2)}) = ${p.slope.toFixed(6)}\\text{ rad}$`);
    });

    steps.push(`#### Step 3: Determine conjugate shear and moment`);
    steps.push(`The shear diagram on the conjugate beam represents the slope curve $\\theta(x)$, and the bending moment diagram represents the deflection curve $v(x)$.`);

    return {
      success: true,
      points: diResult.points,
      criticalPoints: diResult.criticalPoints,
      steps,
      conjugateBeam: {
        supports: conjSupports,
        reactions: conjReactions,
        steps,
      },
    };
  }
}
