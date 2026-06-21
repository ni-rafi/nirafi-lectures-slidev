import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult } from './types';
import { IDeflectionService } from './deflection.interface';
import { DoubleIntegrationMethod } from './double-integration';
import { MomentAreaMethod } from './moment-area';
import { ConjugateBeamMethod } from './conjugate-beam';

export class DeflectionService implements IDeflectionService {
  calculateDeflection(
    beam: IBeam,
    reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    method: 'double-integration' | 'moment-area' | 'conjugate-beam',
    customInspectX: number | null
  ): IDeflectionResult {
    // Basic checks
    if (!beam || !reactions || !sfdBmdIntervals || !eiSegments || eiSegments.length === 0) {
      return {
        success: false,
        points: [],
        criticalPoints: [],
      };
    }

    let solver;
    switch (method) {
      case 'double-integration':
        solver = new DoubleIntegrationMethod();
        break;
      case 'moment-area':
        solver = new MomentAreaMethod();
        break;
      case 'conjugate-beam':
        solver = new ConjugateBeamMethod();
        break;
      default:
        solver = new DoubleIntegrationMethod();
        break;
    }

    try {
      return solver.solve(beam, reactions, sfdBmdIntervals, eiSegments, customInspectX);
    } catch (err) {
      console.error('Deflection calculations crash:', err);
      return {
        success: false,
        points: [],
        criticalPoints: [],
      };
    }
  }
}
