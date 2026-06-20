import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IInfluenceResult, ITargetSection } from './influence-lines.interface';

/**
 * Strategy contract for calculating Influence Line Diagrams (ILD).
 * Enables plugging in alternative solvers (e.g. Determinate vs Indeterminate solvers).
 */
export interface IInfluenceLinesSolverStrategy {
    /** Calculates static reaction ILD ordinate points */
    calculateReactionILD(beam: IBeam, targetSupportX: number): IInfluenceResult;
    
    /** Calculates static shear force ILD ordinate points */
    calculateShearILD(beam: IBeam, target: ITargetSection): IInfluenceResult;
    
    /** Calculates static bending moment ILD ordinate points */
    calculateMomentILD(beam: IBeam, target: ITargetSection): IInfluenceResult;

    /** Calculates kinematic deflected shape for reaction ILD (Müller-Breslau) */
    calculateReactionKinematicShape(beam: IBeam, targetSupportX: number): IInfluenceResult;

    /** Calculates kinematic deflected shape for shear force ILD (Müller-Breslau) */
    calculateShearKinematicShape(beam: IBeam, target: ITargetSection): IInfluenceResult;

    /** Calculates kinematic deflected shape for bending moment ILD (Müller-Breslau) */
    calculateMomentKinematicShape(beam: IBeam, target: ITargetSection): IInfluenceResult;

    /** LaTeX step explanations for support reaction calculations */
    getReactionCalculationSteps(targetSupportX: number, supports: number[]): string[];

    /** LaTeX step explanations for shear force calculations */
    getShearCalculationSteps(targetSectionX: number, supports: number[]): string[];

    /** LaTeX step explanations for bending moment calculations */
    getMomentCalculationSteps(targetSectionX: number, supports: number[]): string[];
}
