import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IInfluenceLinesSolverStrategy } from './IInfluenceLinesSolverStrategy';
import { IInfluenceResult, ITargetSection } from './influence-lines.interface';
import { ILDReactionEngine } from './ild-reaction.engine';
import { ILDShearEngine } from './ild-shear.engine';
import { ILDMomentEngine } from './ild-moment.engine';
import { MullerBreslauEngine } from './muller-breslau.engine';

/**
 * Concrete strategy solving influence lines statically and kinematically 
 * for determinate, stable beam systems.
 */
export class DeterminateInfluenceLinesSolver implements IInfluenceLinesSolverStrategy {
    calculateReactionILD(beam: IBeam, targetSupportX: number): IInfluenceResult {
        return ILDReactionEngine.calculate(beam, targetSupportX);
    }

    calculateShearILD(beam: IBeam, target: ITargetSection): IInfluenceResult {
        return ILDShearEngine.calculate(beam, target.xc);
    }

    calculateMomentILD(beam: IBeam, target: ITargetSection): IInfluenceResult {
        return ILDMomentEngine.calculate(beam, target.xc);
    }

    calculateReactionKinematicShape(beam: IBeam, targetSupportX: number): IInfluenceResult {
        return MullerBreslauEngine.calculateReactionShape(beam, targetSupportX);
    }

    calculateShearKinematicShape(beam: IBeam, target: ITargetSection): IInfluenceResult {
        return MullerBreslauEngine.calculateShearShape(beam, target);
    }

    calculateMomentKinematicShape(beam: IBeam, target: ITargetSection): IInfluenceResult {
        return MullerBreslauEngine.calculateMomentShape(beam, target);
    }

    getReactionCalculationSteps(targetSupportX: number, supports: number[]): string[] {
        return ILDReactionEngine.getCalculationSteps(targetSupportX, supports);
    }

    getShearCalculationSteps(targetSectionX: number, supports: number[]): string[] {
        return ILDShearEngine.getCalculationSteps(targetSectionX, supports);
    }

    getMomentCalculationSteps(targetSectionX: number, supports: number[]): string[] {
        return ILDMomentEngine.getCalculationSteps(targetSectionX, supports);
    }
}
export default DeterminateInfluenceLinesSolver;
