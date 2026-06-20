import { useMemo } from 'react';
import { useInfluenceWorkspace } from '../context/InfluenceLinesWorkspaceContext';
import { InfluenceLinesService } from '../../../cores/influence-lines/influenceLinesService';
import { IInfluenceLinesSolverOutput, IMovingLoadTransitOutput } from '../../../cores/influence-lines/IInfluenceLinesService';
import { calculateDOI } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/doiCalculator';

export const useInfluenceLinesEngine = (): {
    solverResult: IInfluenceLinesSolverOutput;
    transitResult: IMovingLoadTransitOutput;
} => {
    const {
        length,
        supports,
        releases,
        targetSection,
        targetSupportX,
        analysisType,
        activeVehicle,
    } = useInfluenceWorkspace();

    const service = useMemo(() => new InfluenceLinesService(), []);

    const beam = useMemo(() => ({
        length,
        supports,
        releases,
        loads: [], // influence lines do not use static loads
    }), [length, supports, releases]);

    const solverResult = useMemo(() => {
        if (analysisType === 'reaction') {
            if (targetSupportX === null) {
                return {
                    success: false,
                    ildPoints: [],
                    kinematicPoints: [],
                    calculationSteps: [],
                    doiResult: calculateDOI(beam),
                    error: 'No target support selected.',
                };
            }
            return service.calculateReactionILD(beam, targetSupportX);
        } else if (analysisType === 'shear') {
            return service.calculateShearILD(beam, targetSection);
        } else {
            return service.calculateMomentILD(beam, targetSection);
        }
    }, [service, beam, analysisType, targetSupportX, targetSection]);

    const transitResult = useMemo(() => {
        if (!solverResult.success || !activeVehicle) {
            return { success: false, transitSteps: [] };
        }
        return service.transitMovingLoad(
            solverResult.ildPoints,
            beam,
            analysisType,
            analysisType === 'reaction' ? (targetSupportX ?? 0) : targetSection.xc,
            activeVehicle
        );
    }, [service, beam, analysisType, targetSupportX, targetSection, activeVehicle, solverResult]);

    return { solverResult, transitResult };
};
export default useInfluenceLinesEngine;
