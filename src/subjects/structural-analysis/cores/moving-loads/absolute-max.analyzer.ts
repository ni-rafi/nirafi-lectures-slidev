import { IMovingLoadMaxResult, IMovingVehicle, IAxleLoad } from '../influence-lines/influence-lines.interface';

export interface IAbsoluteMaxResult {
    maxShear: IMovingLoadMaxResult;
    maxMoment: IMovingLoadMaxResult;
}

/**
 * Analyzes a moving load train to find the absolute maximum shear and bending moment 
 * ANYWHERE on a simply supported beam. 
 * Uses the Resultant Force (Centroid) Method for Bending Moment.
 */
export class AbsoluteMaxAnalyzer {
    /**
     * Calculates the absolute maximum responses.
     * @param beamLength The total span of the simply supported beam (meters)
     * @param vehicle The moving load train
     */
    static analyze(beamLength: number, vehicle: IMovingVehicle): IAbsoluteMaxResult {
        const { axles } = vehicle;
        if (axles.length === 0) throw new Error("Vehicle must have at least one axle.");

        // 1. Pre-calculate relative distances of all axles from the leading axle (x=0)
        const distancesFromLead = this.getAxleDistances(axles);

        // 2. Find Total Resultant Force (F_R) and its Centroid (x_bar)
        const Fr = axles.reduce((sum: number, a: IAxleLoad) => sum + a.load, 0);
        const sumMomentsAboutLead = axles.reduce((sum: number, a: IAxleLoad, i: number) => sum + (a.load * distancesFromLead[i]!), 0);
        const xBar = sumMomentsAboutLead / Fr; // Distance of resultant from leading axle

        // Calculate Absolute Maximums
        const maxMomentResult = this.findAbsoluteMaxMoment(beamLength, vehicle, distancesFromLead, Fr, xBar);
        const maxShearResult = this.findAbsoluteMaxShear(beamLength, vehicle, distancesFromLead);

        return {
            maxMoment: maxMomentResult,
            maxShear: maxShearResult
        };
    }

    /**
     * Finds absolute max moment by systematically bisecting the distance between the 
     * Resultant Force and each individual axle across the beam's centerline.
     */
    private static findAbsoluteMaxMoment(
        L: number,
        vehicle: IMovingVehicle,
        distances: number[],
        Fr: number,
        xBar: number
    ): IMovingLoadMaxResult {
        let absoluteMaxM = 0;
        let criticalLeadPos = 0;
        let criticalAxleId = "";
        let criticalSteps: string[] = [];

        // Test the placement for every axle
        for (let i = 0; i < vehicle.axles.length; i++) {
            const axleDistance = distances[i]!;

            // The beam centerline (L/2) must bisect the distance between the Resultant (xBar) and the Axle (axleDistance)
            const midpointFromLead = (axleDistance + xBar) / 2;
            const leadAxleGlobalX = (L / 2) - midpointFromLead;
            const targetAxleGlobalX = leadAxleGlobalX + axleDistance;

            // If the target axle is not even on the beam, skip
            if (targetAxleGlobalX < 0 || targetAxleGlobalX > L) continue;

            // Calculate Left Reaction (R_A) based ONLY on axles currently on the span
            let leftReaction = 0;
            let isOnSpanCount = 0;
            for (let j = 0; j < vehicle.axles.length; j++) {
                const globalX = leadAxleGlobalX + distances[j]!;
                if (globalX >= 0 && globalX <= L) {
                    leftReaction += vehicle.axles[j]!.load * (L - globalX) / L;
                    isOnSpanCount++;
                }
            }

            // Calculate Moment strictly under the targeted Axle 'i'
            // M = (R_A * x_axle) - Sum of moments from loads strictly to the left of the axle
            let internalMoment = leftReaction * targetAxleGlobalX;
            for (let j = 0; j < i; j++) {
                const globalX = leadAxleGlobalX + distances[j]!;
                if (globalX >= 0 && globalX < targetAxleGlobalX) {
                    internalMoment -= vehicle.axles[j]!.load * (targetAxleGlobalX - globalX);
                }
            }

            // Track the maximum configuration found
            if (internalMoment > absoluteMaxM) {
                absoluteMaxM = internalMoment;
                criticalLeadPos = leadAxleGlobalX;
                criticalAxleId = vehicle.axles[i]!.id;

                // Generate the step-by-step mathematical proof
                criticalSteps = [
                    `1. Calculate Resultant Force ($F_R$):`,
                    `$$F_R = \\sum P_i = ${this.round3(Fr)}\\text{ kN}$$`,
                    `2. Find Centroid ($\\bar{x}$) from lead axle:`,
                    `$$\\bar{x} = \\frac{\\sum P_i x_i}{F_R} = ${this.round3(xBar)}\\text{ m}$$`,
                    `3. To maximize moment under Axle **${criticalAxleId}**, place the beam centerline ($L/2 = ${L / 2}\\text{ m}$) exactly halfway between $F_R$ and Axle **${criticalAxleId}**.`,
                    `4. This optimal placement puts the leading axle at $x = ${this.round3(criticalLeadPos)}\\text{ m}$.`,
                    `5. ${isOnSpanCount} axles are on the span. Calculate left reaction:`,
                    `$$R_A = ${this.round3(leftReaction)}\\text{ kN}$$`,
                    `6. Calculate Bending Moment directly under Axle **${criticalAxleId}** ($x = ${this.round3(targetAxleGlobalX)}\\text{ m}$):`,
                    `$$M_{abs(max)} = (R_A \\times x) - \\sum P_{left} \\times d$$`,
                    `$$M_{abs(max)} = ${this.round3(absoluteMaxM)}\\text{ kN}\\cdot\\text{m}$$`
                ];
            }
        }

        return {
            absoluteMax: this.round3(absoluteMaxM),
            criticalLeadingAxlePosition: this.round3(criticalLeadPos),
            calculationSteps: criticalSteps
        };
    }

    /**
     * Finds absolute max shear. In simple beams, this always occurs at the supports
     * when the heaviest concentration of axles is placed as close to the support as possible.
     */
    private static findAbsoluteMaxShear(
        L: number,
        vehicle: IMovingVehicle,
        distances: number[]
    ): IMovingLoadMaxResult {
        let maxShear = 0;
        let criticalLeadPos = 0;

        // Test placing every axle exactly at x=0
        for (let i = 0; i < vehicle.axles.length; i++) {
            const leadAxleGlobalX = -distances[i]!; // Shifts the whole train left so Axle 'i' sits at x=0

            let leftReaction = 0;
            for (let j = 0; j < vehicle.axles.length; j++) {
                const globalX = leadAxleGlobalX + distances[j]!;
                if (globalX >= 0 && globalX <= L) {
                    leftReaction += vehicle.axles[j]!.load * (L - globalX) / L;
                }
            }

            if (leftReaction > maxShear) {
                maxShear = leftReaction;
                criticalLeadPos = leadAxleGlobalX;
            }
        }

        return {
            absoluteMax: this.round3(maxShear),
            criticalLeadingAxlePosition: this.round3(criticalLeadPos),
            calculationSteps: [
                `1. Absolute maximum shear in simply supported beams occurs at the reactions.`,
                `2. Place heavy axles directly over the supports to maximize the reaction.`,
                `3. The critical placement occurs when the leading axle is at $x = ${this.round3(criticalLeadPos)}\\text{ m}$.`,
                `$$V_{abs(max)} = R_{max} = ${this.round3(maxShear)}\\text{ kN}$$`
            ]
        };
    }

    /**
     * Helper: Converts relative spacing between consecutive axles into absolute 
     * distances from the leading axle (Axle 0).
     */
    private static getAxleDistances(axles: IAxleLoad[]): number[] {
        let currentDist = 0;
        return axles.map((a) => {
            currentDist += a.spacingFromPrevious;
            return currentDist;
        });
    }

    /**
     * Enforces Rule 003: Strict rounding precision.
     */
    private static round3(val: number): number {
        return Math.round(val * 1000) / 1000;
    }
}