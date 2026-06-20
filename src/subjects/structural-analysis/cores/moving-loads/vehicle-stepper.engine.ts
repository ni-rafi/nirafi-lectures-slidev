import {
    IMovingVehicle,
    IInfluenceResult,
    IAxleLoad,
    IInfluenceOrdinate
} from '../influence-lines/influence-lines.interface';

/**
 * Breakdown of a single axle's contribution at a specific snapshot in time.
 */
export interface IAxleSnapshot {
    id: string;
    load: number;
    position: number;    // Absolute position on the beam
    ordinate: number;    // Interpolated ILD ordinate at this position
    response: number;    // load * ordinate
}

/**
 * The total system response at a specific position of the leading axle.
 */
export interface IVehicleStepResult {
    leadingAxlePosition: number;
    totalResponse: number;
    axleSnapshots: IAxleSnapshot[];
}

/**
 * Core engine responsible for driving a vehicle across an influence line.
 * Performs numerical convolution by stepping the load train and interpolating ordinates.
 */
export class VehicleStepperEngine {
    /**
     * "Drives" the vehicle across the ILD from left to right.
     * @param vehicle The moving load train
     * @param ild The geometric influence line diagram
     * @param beamLength Total span of the beam (meters)
     * @param stepSize Increment distance for the simulation (default: 0.1m)
     */
    static transitVehicle(
        vehicle: IMovingVehicle,
        ild: IInfluenceResult,
        beamLength: number,
        stepSize: number = 0.1
    ): IVehicleStepResult[] {
        const results: IVehicleStepResult[] = [];

        // 1. Calculate relative distances of all axles from the leading axle (axle 0)
        const relativePositions = this.calculateRelativeAxlePositions(vehicle.axles);
        const totalVehicleLength = Math.abs(relativePositions[relativePositions.length - 1]!);

        // 2. We must drive the vehicle until the LAST axle leaves the beam.
        // Leading axle starts at 0, ends at beamLength + totalVehicleLength
        const totalDistance = beamLength + totalVehicleLength;
        const numSteps = Math.ceil(totalDistance / stepSize);

        for (let step = 0; step <= numSteps; step++) {
            const leadingX = this.round3(step * stepSize);
            let totalStepResponse = 0;
            const snapshots: IAxleSnapshot[] = [];

            // 3. Evaluate each axle's position on the beam at this step
            for (let i = 0; i < vehicle.axles.length; i++) {
                const axle = vehicle.axles[i]!;
                // Relative positions are negative (trailing behind the leader)
                const absoluteAxleX = this.round3(leadingX + relativePositions[i]!);

                // If the axle is physically on the beam, calculate its contribution
                if (absoluteAxleX >= 0 && absoluteAxleX <= beamLength) {
                    const ordinate = this.interpolateOrdinate(ild, absoluteAxleX);
                    const response = this.round3(axle.load * ordinate);

                    totalStepResponse += response;

                    snapshots.push({
                        id: axle.id,
                        load: axle.load,
                        position: absoluteAxleX,
                        ordinate: ordinate,
                        response: response
                    });
                }
            }

            results.push({
                leadingAxlePosition: leadingX,
                totalResponse: this.round3(totalStepResponse),
                axleSnapshots: snapshots
            });
        }

        return results;
    }

    /**
     * Helper: Linearly interpolates the exact y-ordinate on the ILD for any x-coordinate.
     * Safely handles vertical "jumps" (like in Shear ILDs) by taking the maximum absolute value.
     */
    private static interpolateOrdinate(ild: IInfluenceResult, targetX: number): number {
        // Exact match (or handling structural jumps where 2 points share the same X)
        const exactMatches = ild.filter((pt: IInfluenceOrdinate) => Math.abs(pt.x - targetX) < 0.001);
        if (exactMatches.length > 0) {
            // If there's a jump (e.g., +0.6 and -0.4 at the same section), take the highest absolute effect 
            // to ensure conservative maximum design envelopes.
            return exactMatches.reduce((maxPt: IInfluenceOrdinate, currentPt: IInfluenceOrdinate) =>
                Math.abs(currentPt.ordinate) > Math.abs(maxPt.ordinate) ? currentPt : maxPt
            ).ordinate;
        }

        // Linear interpolation between the two closest points
        let leftPt = ild[0]!;
        let rightPt = ild[ild.length - 1]!;

        for (let i = 0; i < ild.length - 1; i++) {
            if (ild[i]!.x <= targetX && ild[i + 1]!.x >= targetX) {
                leftPt = ild[i]!;
                rightPt = ild[i + 1]!;
                break;
            }
        }

        // Similar triangles interpolation
        const span = rightPt.x - leftPt.x;
        if (span === 0) return leftPt.ordinate; // Prevent division by zero

        const fraction = (targetX - leftPt.x) / span;
        const interpolatedY = leftPt.ordinate + fraction * (rightPt.ordinate - leftPt.ordinate);

        return this.round3(interpolatedY);
    }

    /**
     * Helper: Maps discrete spacing values into absolute distances behind the leading axle.
     * Example: Spacings [0, 4m, 4m] -> Relative [0, -4m, -8m]
     */
    private static calculateRelativeAxlePositions(axles: IAxleLoad[]): number[] {
        const positions: number[] = [0];
        let currentPos = 0;

        // Start at index 1 since index 0 is the leading axle (0 spacing)
        for (let i = 1; i < axles.length; i++) {
            currentPos -= axles[i]!.spacingFromPrevious;
            positions.push(this.round3(currentPos));
        }

        return positions;
    }

    /**
     * Enforces Rule 003: Rounding precision to 3 decimal places.
     */
    private static round3(val: number): number {
        return Math.round(val * 1000) / 1000;
    }
}