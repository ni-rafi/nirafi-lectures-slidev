import { IInfluenceResult } from './influence-lines.interface';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { solveReactions } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/reactionSolver';

/**
 * Core engine for calculating the Influence Line Diagram (ILD) of Support Reactions.
 * Uses the General Equilibrium Method for compound systems.
 */
export class ILDReactionEngine {
    /**
     * Calculates the exact coordinates for the Reaction ILD as a unit load moves across the beam.
     * @param beam The full IBeam structural definition
     * @param targetSupportX The x-coordinate of the support we are finding the reaction for
     * @returns IInfluenceResult strictly rounded to 3 decimal places
     */
    static calculate(
        beam: IBeam,
        targetSupportX: number
    ): IInfluenceResult {
        // Find the support ID matching the target position
        const targetSupport = beam.supports.find(s => Math.abs(s.position - targetSupportX) < 1e-5);
        if (!targetSupport) {
            throw new Error(`Target support not found at x = ${targetSupportX}`);
        }

        // To draw a linear ILD, we evaluate the critical geometric breaks:
        // the start of the beam, the end of the beam, support locations, and internal hinges.
        const rawPoints = new Set([
            0,
            beam.length,
            ...beam.supports.map((s) => s.position),
            ...beam.releases.map((r) => r.position)
        ]);
        const criticalPoints = Array.from(rawPoints).sort((a, b) => a - b);

        return criticalPoints.map((x) => {
            const tempBeam: IBeam = {
                ...beam,
                loads: [
                    {
                        id: 'unit-load',
                        type: 'point',
                        magnitude: 1,
                        position: x
                    }
                ]
            };

            const solverRes = solveReactions(tempBeam);
            if (!solverRes.success) {
                return { x: this.round3(x), ordinate: 0 };
            }

            const rxn = solverRes.reactions.find(
                (r) => r.supportId === targetSupport.id && r.type === 'R_y'
            );
            const ordinate = rxn ? rxn.value : 0;

            return {
                x: this.round3(x),
                ordinate: this.round3(ordinate)
            };
        });
    }

    static getCalculationSteps(targetSupportX: number, supports: number[]): string[] {
        if (supports.length === 2) {
            const pivotX = supports.find((x) => x !== targetSupportX);
            if (pivotX !== undefined) {
                return [
                    `1. Place a moving unit load ($P = 1\\text{ kN}$) at an arbitrary distance $x$.`,
                    `2. Take moments about the pivot support at $x = ${pivotX}\\text{ m}$: $\\sum M_{${pivotX}} = 0$`,
                    `$$R_{target} \\times (${targetSupportX} - ${pivotX}) + 1 \\times (${pivotX} - x) = 0$$`,
                    `$$R_{target}(x) = \\frac{${pivotX} - x}{${pivotX} - ${targetSupportX}}$$`,
                    `3. Note: The maximum ordinate is exactly $1.000$ when the load is directly over the support.`
                ];
            }
        }

        return [
            `1. Place a moving unit load $P = 1\\text{ kN}$ at position $x$.`,
            `2. Solve the support reactions using the equations of equilibrium and internal hinge condition ($M_{hinge} = 0$).`,
            `3. The ordinate of the reaction influence line at $x$ is equal to the solved reaction value.`
        ];
    }

    /**
     * Enforces Rule 003: Rounding precision to 3 decimal places for SVG stability.
     */
    private static round3(val: number): number {
        const rounded = Math.round(val * 1000) / 1000;
        return Math.abs(rounded) < 0.005 ? 0 : rounded;
    }
}
export default ILDReactionEngine;