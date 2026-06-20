import { IBeam, IReaction, IIntervalEquation } from '../sfd-bmd/types';
import { IEISegment, IDeflectionResult } from './types';

export interface IDeflectionMethod {
  solve(
    beam: IBeam,
    reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    customInspectX: number | null
  ): IDeflectionResult;
}

export interface IDeflectionService {
  calculateDeflection(
    beam: IBeam,
    reactions: IReaction[],
    sfdBmdIntervals: IIntervalEquation[],
    eiSegments: IEISegment[],
    method: 'double-integration' | 'moment-area' | 'conjugate-beam',
    customInspectX: number | null
  ): IDeflectionResult;
}
