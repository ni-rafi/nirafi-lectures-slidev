import { IBeam, IDOIResult } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IInfluenceResult, ITargetSection, IMovingVehicle, IMovingLoadMaxResult } from './influence-lines.interface';
import { IVehicleStepResult } from '../moving-loads/vehicle-stepper.engine';

/**
 * Output wrapper for Influence Line solvers.
 */
export interface IInfluenceLinesSolverOutput {
    success: boolean;
    ildPoints: IInfluenceResult;
    kinematicPoints: IInfluenceResult;
    calculationSteps: string[];
    doiResult: IDOIResult;
    error?: string;
}

/**
 * Output wrapper for moving vehicle transit simulation.
 */
export interface IMovingLoadTransitOutput {
    success: boolean;
    transitSteps: IVehicleStepResult[];
    maxPositive?: IMovingLoadMaxResult;
    maxNegative?: IMovingLoadMaxResult;
    absoluteMaxShear?: IMovingLoadMaxResult;
    absoluteMaxMoment?: IMovingLoadMaxResult;
}

/**
 * Interface contract for the structural analysis Influence Lines and Moving Loads service.
 */
export interface IInfluenceLinesService {
    /** Calculates ILD for a support reaction */
    calculateReactionILD(beam: IBeam, targetSupportX: number): IInfluenceLinesSolverOutput;
    
    /** Calculates ILD for internal shear force at a target cut section */
    calculateShearILD(beam: IBeam, target: ITargetSection): IInfluenceLinesSolverOutput;
    
    /** Calculates ILD for internal bending moment at a target cut section */
    calculateMomentILD(beam: IBeam, target: ITargetSection): IInfluenceLinesSolverOutput;

    /** Runs transit convolution and absolute max checks for moving vehicles */
    transitMovingLoad(
        ildPoints: IInfluenceResult,
        beam: IBeam,
        analysisType: 'reaction' | 'shear' | 'moment',
        targetX: number,
        vehicle: IMovingVehicle
    ): IMovingLoadTransitOutput;
}
