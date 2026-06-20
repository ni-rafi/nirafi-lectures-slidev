import { IMovingLoadMaxResult, IMovingVehicle } from '../influence-lines/influence-lines.interface';
import { IVehicleStepResult } from './vehicle-stepper.engine';

/**
 * Encapsulates both the maximum positive shear and maximum negative shear
 * at a specific target section.
 */
export interface IShearExtremes {
    maxPositive: IMovingLoadMaxResult;
    maxNegative: IMovingLoadMaxResult;
}

/**
 * Analyzes the transit data of a moving vehicle across a Shear Force ILD.
 * Identifies the critical vehicle placements that exploit the structural "jump"
 * at the section cut to cause absolute maximum positive and negative shear.
 */
export class MovingShearAnalyzer {
    /**
     * Scans the full numerical transit results to find the extreme shear values at section x_c.
     * @param transitResults The step-by-step convolution data from the VehicleStepperEngine
     * @param targetSectionX The location of the section cut (x_c) being analyzed
     * @param vehicle The moving load train
     * @returns The maximum positive and negative shears with step-by-step calculation proofs
     */
    static analyze(
        transitResults: IVehicleStepResult[],
        targetSectionX: number,
        vehicle: IMovingVehicle
    ): IShearExtremes {
        if (transitResults.length === 0) {
            throw new Error("Transit results cannot be empty. Run VehicleStepperEngine first.");
        }

        let maxPosStep = transitResults[0]!;
        let maxNegStep = transitResults[0]!;

        // 1. Scan the transited envelope for extreme values
        for (const step of transitResults) {
            if (step.totalResponse > maxPosStep.totalResponse) {
                maxPosStep = step;
            }
            if (step.totalResponse < maxNegStep.totalResponse) {
                maxNegStep = step;
            }
        }

        return {
            maxPositive: {
                absoluteMax: this.round3(maxPosStep.totalResponse),
                criticalLeadingAxlePosition: maxPosStep.leadingAxlePosition,
                calculationSteps: this.generateSteps(maxPosStep, targetSectionX, vehicle.name, 'Maximum Positive Shear')
            },
            maxNegative: {
                absoluteMax: this.round3(maxNegStep.totalResponse),
                criticalLeadingAxlePosition: maxNegStep.leadingAxlePosition,
                calculationSteps: this.generateSteps(maxNegStep, targetSectionX, vehicle.name, 'Maximum Negative Shear')
            }
        };
    }

    /**
     * Generates localized, step-by-step LaTeX strings for the UI Breakdown Panel.
     * Emphasizes the positioning of heavy axles near the critical section cut.
     */
    private static generateSteps(
        criticalStep: IVehicleStepResult,
        sectionX: number,
        vehicleName: string,
        extremeType: string
    ): string[] {
        const steps: string[] = [
            `\\text{1. Analyze the } \\text{${vehicleName}} \\text{ transit across the Influence Line Diagram (ILD) for } V_{${sectionX}}.`,
            `\\text{2. The critical placement for } \\textbf{${extremeType}} \\text{ occurs when the leading axle is at } x = ${this.round3(criticalStep.leadingAxlePosition)}\\text{m}.`
        ];

        if (criticalStep.axleSnapshots.length === 0) {
            steps.push(`\\text{3. No axles are present on the beam. Shear = 0.}`);
            return steps;
        }

        // Map each active axle's contribution: (Load x ILD Ordinate)
        const activeAxles = criticalStep.axleSnapshots;
        const sumTerms = activeAxles.map(
            (axle) => `(${this.round3(axle.load)} \\times ${this.round3(axle.ordinate)})`
        );

        const detailTerms = activeAxles.map(
            (axle) => `\\text{Axle } \\text{${axle.id}} \\text{ at } x=${this.round3(axle.position)}\\text{m } (y=${this.round3(axle.ordinate)})`
        );

        steps.push(`\\text{3. Multiply the load of each axle currently on the span by the corresponding ILD ordinate:}`);

        // Add specific detail mapping for micro-diagram UI
        detailTerms.forEach(detail => {
            steps.push(`\\quad \\rightarrow ${detail}`);
        });

        // Educational Note: Identify if an axle is exploiting the shear jump (within a small transit step delta)
        const axleNearCut = activeAxles.find(a => Math.abs(a.position - sectionX) <= 0.15);
        if (axleNearCut) {
            steps.push(`\\quad \\textit{*Note: Axle ${axleNearCut.id} is positioned right at the section cut } (x_c = ${sectionX}\\text{m}) \\textit{ to exploit the maximum peak.}`);
        }

        steps.push(`\\text{4. Superposition (Summing the effects):}`);
        steps.push(`\\quad V_{${sectionX}, max} = \\sum (P_i \\times y_i)`);
        steps.push(`\\quad V_{${sectionX}, max} = ${sumTerms.join(' + ')}`);
        steps.push(`\\quad V_{${sectionX}, max} = ${this.round3(criticalStep.totalResponse)}\\text{ kN}`);

        return steps;
    }

    /**
     * Enforces Rule 003: Rounding precision to 3 decimal places for calculation consistency.
     */
    private static round3(val: number): number {
        return Math.round(val * 1000) / 1000;
    }
}