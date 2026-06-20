import { IInfluenceResult } from './influence-lines.interface';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { solveReactions } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/reactionSolver';

/**
 * Core engine for calculating the Influence Line Diagram (ILD) of Shear Force at a specific section.
 * Uses the General Equilibrium Method for compound systems.
 */
export class ILDShearEngine {
    /**
     * Calculates the exact coordinates for the Shear ILD at section x_c.
     * Accurately handles the structural "jump" drop of magnitude 1.0 at the cut.
     * @param beam The full IBeam structural definition
     * @param targetSectionX The x-coordinate of the cut section (x_c)
     * @returns IInfluenceResult strictly rounded to 3 decimal places
     */
    static calculate(
        beam: IBeam,
        targetSectionX: number
    ): IInfluenceResult {
        // To draw a precise ILD, we evaluate the geometric break points:
        // ends of the beam, support locations, internal releases, and specifically the target section cut.
        const rawPoints = new Set([
            0,
            beam.length,
            ...beam.supports.map((s) => s.position),
            ...beam.releases.map((r) => r.position),
            targetSectionX
        ]);
        const criticalPoints = Array.from(rawPoints).sort((a, b) => a - b);

        const result: IInfluenceResult = [];

        // Identify which supports are structurally to the left of our section cut
        const leftSupports = beam.supports.filter((s) => s.position <= targetSectionX);

        criticalPoints.forEach((x) => {
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

            const getSumLeftReactions = () => {
                if (!solverRes.success) return 0;
                return leftSupports.reduce((sum, s) => {
                    const rxn = solverRes.reactions.find(
                        (r) => r.supportId === s.id && r.type === 'R_y'
                    );
                    return sum + (rxn ? rxn.value : 0);
                }, 0);
            };

            if (x === targetSectionX) {
                // CRITICAL SECTION JUMP:
                // As the unit load infinitesimally crosses the section cut, 
                // the shear value abruptly drops by exactly 1.0. We push BOTH limits to draw the vertical line.

                // 1. Limit approaching from the left (x -> x_c^-)
                const vLeftLimit = getSumLeftReactions() - 1;
                result.push({ x: this.round3(x), ordinate: this.round3(vLeftLimit) });

                // 2. Limit approaching from the right (x -> x_c^+)
                const vRightLimit = getSumLeftReactions() - 0;
                result.push({ x: this.round3(x), ordinate: this.round3(vRightLimit) });
            } else {
                // Equilibrium: Sum of forces in Y direction to the left of the cut.
                // If load is to the left (x < x_c), it pushes down (-1). If to the right (x > x_c), it does not affect left FBD.
                const unitLoadEffect = x < targetSectionX ? 1 : 0;
                const shearOrdinate = getSumLeftReactions() - unitLoadEffect;

                result.push({
                    x: this.round3(x),
                    ordinate: this.round3(shearOrdinate)
                });
            }
        });

        return result;
    }

    /**
     * Generates the step-by-step LaTeX formula strings for the UI Breakdown Panel.
     * @param targetSectionX The x-coordinate of the cut section
     * @param supports Array of all support x-coordinates
     * @returns Array of LaTeX formatted strings explaining the piecewise math
     */
    static getCalculationSteps(targetSectionX: number, supports: number[]): string[] {
        if (supports.length === 2) {
            const leftSupports = supports.filter(s => s <= targetSectionX);
            const leftReactionsStr = leftSupports.map(s => `R_{${s}}`).join(' + ') || '0';

            return [
                `1. Cut the beam at section $x_c = ${targetSectionX}\\text{ m}$. Use the Equilibrium Method.`,
                `2. When the unit load is to the left of the cut ($x < ${targetSectionX}\\text{ m}$):`,
                `Using the left Free Body Diagram (FBD):`,
                `$$V_c = \\sum F_{y,\\text{left}} = (${leftReactionsStr}) - 1$$`,
                `3. When the unit load is to the right of the cut ($x > ${targetSectionX}\\text{ m}$):`,
                `The unit load is no longer on the left FBD.`,
                `$$V_c = (${leftReactionsStr}) - 0$$`,
                `4. The sudden drop at $x = ${targetSectionX}\\text{ m}$ is exactly $1.000$ as the load crosses the cut.`
            ];
        }

        return [
            `1. Cut the beam at section $x_c = ${targetSectionX}\\text{ m}$.`,
            `2. Solve the support reactions for a unit load at position $x$.`,
            `3. Sum the vertical forces on the left FBD (reactions left of cut minus the unit load if $x < x_c$):`,
            `$$V_c = \\sum R_{y,\\text{left}} - \\delta\\quad \\text{where } \\delta = 1 \\text{ if } x < x_c \\text{ else } 0$$`,
            `4. The shear jump at $x = x_c$ has a magnitude of exactly $1.0$.`
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
export default ILDShearEngine;