import { useMemo } from 'react';
import { useBeamWorkspace } from '../context/BeamWorkspaceContext';
import { SFDBmdService } from '@/cores/mechanics-of-solids/sfd-bmd/sfdBmdService';
import { DeflectionService } from '@/cores/mechanics-of-solids/deflection/deflectionService';
import { ISolverOutput } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { IDeflectionResult } from '@/cores/mechanics-of-solids/deflection/types';

export const useBeamEngine = (): {
  solverResult: ISolverOutput;
  deflectionResult: IDeflectionResult;
} => {
  const { length, supports, releases, loads, eiSegments, deflMethod, customInspectX } = useBeamWorkspace();

  const solverResult = useMemo(() => {
    const service = new SFDBmdService();
    return service.solve({
      length,
      supports,
      releases,
      loads,
    });
  }, [length, supports, releases, loads]);

  const deflectionResult = useMemo(() => {
    const service = new DeflectionService();
    if (!solverResult.success) {
      return {
        success: false,
        points: [],
        criticalPoints: [],
        steps: ['Solver is halted: supports must be stable and determinate.']
      };
    }
    return service.calculateDeflection(
      { length, supports, releases, loads },
      solverResult.reactions,
      solverResult.intervals,
      eiSegments,
      deflMethod,
      customInspectX
    );
  }, [length, supports, releases, loads, solverResult, eiSegments, deflMethod, customInspectX]);

  return { solverResult, deflectionResult };
};
