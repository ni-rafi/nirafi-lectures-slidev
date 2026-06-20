import { IInfluenceResult, ITargetSection } from './influence-lines.interface';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { ILDReactionEngine } from './ild-reaction.engine';
import { ILDShearEngine } from './ild-shear.engine';
import { ILDMomentEngine } from './ild-moment.engine';

/**
 * Interface specific to the kinematic properties needed for Müller-Breslau calculations.
 * All units are strictly in SI (meters).
 * @deprecated Use IBeam from sfd-bmd instead.
 */
export interface IKinematicBeam {
    length: number;
    /** Array of x-coordinates where vertical displacement is restrained (pins/rollers) */
    supports: number[];
}

/**
 * The Müller-Breslau Kinematic Engine.
 * Calculates the exact geometric vertices of the deflected shape (Influence Line)
 * for statically determinate beams by releasing restraints and applying unit displacements.
 * Since the structure is statically determinate, the kinematic shape matches the equilibrium ILD.
 */
export class MullerBreslauEngine {
    /**
     * Generates the deflected shape for a Support Reaction ILD.
     * Kinematic action: Remove vertical restraint at targetSupportX, apply +1.0 unit displacement.
     */
    static calculateReactionShape(
        beam: IBeam,
        targetSupportX: number
    ): IInfluenceResult {
        return ILDReactionEngine.calculate(beam, targetSupportX);
    }

    /**
     * Generates the deflected shape for a Shear Force ILD.
     * Kinematic action: Cut the beam at target.xc, apply a unit transverse displacement (jump) 
     * while keeping the adjacent slopes parallel.
     */
    static calculateShearShape(
        beam: IBeam,
        target: ITargetSection
    ): IInfluenceResult {
        return ILDShearEngine.calculate(beam, target.xc);
    }

    /**
     * Generates the deflected shape for a Bending Moment ILD.
     * Kinematic action: Insert an internal hinge at target.xc, apply a +1.0 unit relative rotation.
     */
    static calculateMomentShape(
        beam: IBeam,
        target: ITargetSection
    ): IInfluenceResult {
        return ILDMomentEngine.calculate(beam, target.xc);
    }
}
export default MullerBreslauEngine;