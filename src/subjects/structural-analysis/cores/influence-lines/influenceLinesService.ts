import { IBeam, IDOIResult } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { calculateDOI } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/doiCalculator';
import { IInfluenceLinesService, IInfluenceLinesSolverOutput, IMovingLoadTransitOutput } from './IInfluenceLinesService';
import { IInfluenceResult, ITargetSection, IMovingVehicle } from './influence-lines.interface';
import { IInfluenceLinesSolverStrategy } from './IInfluenceLinesSolverStrategy';
import { DeterminateInfluenceLinesSolver } from './DeterminateInfluenceLinesSolver';
import { VehicleStepperEngine } from '../moving-loads/vehicle-stepper.engine';
import { MovingReactionAnalyzer } from '../moving-loads/moving-reaction.analyzer';
import { MovingShearAnalyzer } from '../moving-loads/moving-shear.analyzer';
import { MovingMomentAnalyzer } from '../moving-loads/moving-moment.analyzer';
import { AbsoluteMaxAnalyzer } from '../moving-loads/absolute-max.analyzer';

/**
 * Concrete coordinator class for Influence Line and Moving Load transit solver services.
 * Implements dependency injection by accepting solver strategies (determinate vs future indeterminate).
 */
export class InfluenceLinesService implements IInfluenceLinesService {
    private strategy: IInfluenceLinesSolverStrategy;

    constructor(strategy?: IInfluenceLinesSolverStrategy) {
        this.strategy = strategy || new DeterminateInfluenceLinesSolver();
    }

    calculateReactionILD(beam: IBeam, targetSupportX: number): IInfluenceLinesSolverOutput {
        const doiResult = calculateDOI(beam);
        const preCheck = this.performPreFlightCheck(doiResult);
        if (!preCheck.success) {
            return {
                success: false,
                ildPoints: [],
                kinematicPoints: [],
                calculationSteps: doiResult.explanationSteps || [],
                doiResult,
                error: preCheck.error,
            };
        }

        try {
            const ildPoints = this.strategy.calculateReactionILD(beam, targetSupportX);
            const kinematicPoints = this.strategy.calculateReactionKinematicShape(beam, targetSupportX);
            const supportPositions = beam.supports.map((s) => s.position);
            const calculationSteps = this.strategy.getReactionCalculationSteps(targetSupportX, supportPositions);

            return { success: true, ildPoints, kinematicPoints, calculationSteps, doiResult };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, ildPoints: [], kinematicPoints: [], calculationSteps: [], doiResult, error: message };
        }
    }

    calculateShearILD(beam: IBeam, target: ITargetSection): IInfluenceLinesSolverOutput {
        const doiResult = calculateDOI(beam);
        const preCheck = this.performPreFlightCheck(doiResult);
        if (!preCheck.success) {
            return {
                success: false,
                ildPoints: [],
                kinematicPoints: [],
                calculationSteps: doiResult.explanationSteps || [],
                doiResult,
                error: preCheck.error,
            };
        }

        try {
            const ildPoints = this.strategy.calculateShearILD(beam, target);
            const kinematicPoints = this.strategy.calculateShearKinematicShape(beam, target);
            const supportPositions = beam.supports.map((s) => s.position);
            const calculationSteps = this.strategy.getShearCalculationSteps(target.xc, supportPositions);

            return { success: true, ildPoints, kinematicPoints, calculationSteps, doiResult };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, ildPoints: [], kinematicPoints: [], calculationSteps: [], doiResult, error: message };
        }
    }

    calculateMomentILD(beam: IBeam, target: ITargetSection): IInfluenceLinesSolverOutput {
        const doiResult = calculateDOI(beam);
        const preCheck = this.performPreFlightCheck(doiResult);
        if (!preCheck.success) {
            return {
                success: false,
                ildPoints: [],
                kinematicPoints: [],
                calculationSteps: doiResult.explanationSteps || [],
                doiResult,
                error: preCheck.error,
            };
        }

        try {
            const ildPoints = this.strategy.calculateMomentILD(beam, target);
            const kinematicPoints = this.strategy.calculateMomentKinematicShape(beam, target);
            const supportPositions = beam.supports.map((s) => s.position);
            const calculationSteps = this.strategy.getMomentCalculationSteps(target.xc, supportPositions);

            return { success: true, ildPoints, kinematicPoints, calculationSteps, doiResult };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return { success: false, ildPoints: [], kinematicPoints: [], calculationSteps: [], doiResult, error: message };
        }
    }

    transitMovingLoad(
        ildPoints: IInfluenceResult,
        beam: IBeam,
        analysisType: 'reaction' | 'shear' | 'moment',
        targetX: number,
        vehicle: IMovingVehicle
    ): IMovingLoadTransitOutput {
        if (ildPoints.length === 0) {
            return { success: false, transitSteps: [] };
        }

        try {
            // Step size 0.1m transit stepper
            const transitSteps = VehicleStepperEngine.transitVehicle(vehicle, ildPoints, beam.length, 0.1);

            let maxPositive, maxNegative;
            if (analysisType === 'reaction') {
                const result = MovingReactionAnalyzer.analyze(transitSteps, targetX, vehicle);
                maxPositive = result.maxPositive;
                maxNegative = result.maxNegative;
            } else if (analysisType === 'shear') {
                const result = MovingShearAnalyzer.analyze(transitSteps, targetX, vehicle);
                maxPositive = result.maxPositive;
                maxNegative = result.maxNegative;
            } else {
                const result = MovingMomentAnalyzer.analyze(transitSteps, targetX, vehicle);
                maxPositive = result.maxPositive;
                maxNegative = result.maxNegative;
            }

            // Run absolute max check anywhere on simple determinate spans
            const absoluteResult = AbsoluteMaxAnalyzer.analyze(beam.length, vehicle);

            return {
                success: true,
                transitSteps,
                maxPositive,
                maxNegative,
                absoluteMaxShear: absoluteResult.maxShear,
                absoluteMaxMoment: absoluteResult.maxMoment,
            };
        } catch {
            return { success: false, transitSteps: [] };
        }
    }

    /**
     * Reuses mechanics-of-solids static determinacy calculator to verify structure stability.
     */
    private performPreFlightCheck(doiResult: IDOIResult): { success: boolean; error?: string } {
        if (doiResult.isUnstable) {
            return {
                success: false,
                error: 'Unstable support configuration.',
            };
        }
        if (doiResult.isIndeterminate) {
            // For now, statically determinate strategy handles only determinate cases
            if (this.strategy instanceof DeterminateInfluenceLinesSolver) {
                return {
                    success: false,
                    error: 'Structure is statically indeterminate. The current determinate solver strategy cannot analyze this configuration.',
                };
            }
        }
        return { success: true };
    }
}
export default InfluenceLinesService;
