import { IMovingLoadMaxResult, IMovingVehicle } from '../influence-lines/influence-lines.interface';
import { IVehicleStepResult } from './vehicle-stepper.engine';

/**
 * Encapsulates both the maximum downward (positive) compression 
 * and maximum upward (negative) uplift reactions.
 */
export interface IReactionExtremes {
    maxPositive: IMovingLoadMaxResult;
    maxNegative: IMovingLoadMaxResult;
}

/**
 * Analyzes the transit data of a moving vehicle across a Support Reaction ILD.
 * Identifies the critical vehicle placements that cause absolute maximum compression and uplift.
 */
export class MovingReactionAnalyzer {
    /**
     * Scans the full transit results to find the extreme reaction values.
     * * @param transitResults The step-by-step convolution data from the VehicleStepperEngine
     * @param targetSupportX The location of the support being analyzed (for labeling)
     * @param vehicle The vehicle that was transited
     * @returns The maximum positive and negative reactions with step-by-step calculation proofs
     */
    static analyze(
        transitResults: IVehicleStepResult[],
        targetSupportX: number,
        vehicle: IMovingVehicle
    ): IReactionExtremes {
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
                calculationSteps: this.generateSteps(maxPosStep, targetSupportX, vehicle.name, 'Maximum Positive (Compression)')
            },
            maxNegative: {
                absoluteMax: this.round3(maxNegStep.totalResponse),
                criticalLeadingAxlePosition: maxNegStep.leadingAxlePosition,
                calculationSteps: this.generateSteps(maxNegStep, targetSupportX, vehicle.name, 'Maximum Negative (Uplift)')
            }
        };
    }

    /**
     * Generates localized, step-by-step LaTeX strings for the UI Breakdown Panel.
     * Extracts exactly which axle multiplied with which ILD ordinate to prove the result.
     */
    private static generateSteps(
        criticalStep: IVehicleStepResult,
        supportX: number,
        vehicleName: string,
        extremeType: string
    ): string[] {
        const steps: string[] = [
            `\\text{1. Analyze the } \\text{${vehicleName}} \\text{ transit across the Influence Line Diagram (ILD) for } R_{${supportX}}.`,
            `\\text{2. The critical position for } \\textbf{${extremeType}} \\text{ occurs when the leading axle is at } x = ${this.round3(criticalStep.leadingAxlePosition)}\\text{m}.`
        ];

        if (criticalStep.axleSnapshots.length === 0) {
            steps.push(`\\text{3. No axles are present on the beam. Reaction = 0.}`);
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

        steps.push(`\\text{3. Multiply the load of each axle currently on the span by the corresponding ILD ordinate underneath it:}`);

        // Add specific detail mapping for micro-diagram UI
        detailTerms.forEach(detail => {
            steps.push(`\\quad \\rightarrow ${detail}`);
        });

        steps.push(`\\text{4. Superposition (Summing the effects):}`);
        steps.push(`\\quad R_{${supportX}, max} = \\sum (P_i \\times y_i)`);
        steps.push(`\\quad R_{${supportX}, max} = ${sumTerms.join(' + ')}`);
        steps.push(`\\quad R_{${supportX}, max} = ${this.round3(criticalStep.totalResponse)}\\text{ kN}`);

        return steps;
    }

    /**
     * Enforces Rule 003: Rounding precision to 3 decimal places for calculation consistency.
     */
    private static round3(val: number): number {
        return Math.round(val * 1000) / 1000;
    }
}