import { describe, test, expect } from 'vitest';
import { InfluenceLinesService } from '../influenceLinesService';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IMovingVehicle } from '../influence-lines.interface';

describe('InfluenceLinesService Solver Tests', () => {
    const service = new InfluenceLinesService();

    test('Support Reaction ILD calculation (determinate simple beam)', () => {
        const beam: IBeam = {
            length: 6,
            supports: [
                { id: 's1', type: 'hinge', position: 0 },
                { id: 's2', type: 'roller', position: 6 },
            ],
            releases: [],
            loads: [],
        };

        const result = service.calculateReactionILD(beam, 0);

        expect(result.success).toBe(true);
        expect(result.error).toBeUndefined();

        // Support reaction ILD at s1 (x=0): 1.0 at x=0, 0.0 at x=6
        const pt0 = result.ildPoints.find((p) => Math.abs(p.x - 0) < 1e-3);
        const pt6 = result.ildPoints.find((p) => Math.abs(p.x - 6) < 1e-3);

        expect(pt0?.ordinate).toBe(1);
        expect(pt6?.ordinate).toBe(0);
    });

    test('Shear Force ILD calculation (determinate simple beam, mid-span cut)', () => {
        const beam: IBeam = {
            length: 6,
            supports: [
                { id: 's1', type: 'hinge', position: 0 },
                { id: 's2', type: 'roller', position: 6 },
            ],
            releases: [],
            loads: [],
        };

        const result = service.calculateShearILD(beam, { xc: 3 });

        expect(result.success).toBe(true);

        // At x = 3, there's a shear drop of 1.0 (limit approaching from left is -0.5, from right is +0.5)
        const ptsAt3 = result.ildPoints.filter((p) => Math.abs(p.x - 3) < 1e-3);
        expect(ptsAt3.length).toBe(2);

        const ordinates = ptsAt3.map(p => p.ordinate).sort((a, b) => a - b);
        expect(ordinates[0]).toBe(-0.5);
        expect(ordinates[1]).toBe(0.5);
    });

    test('Bending Moment ILD calculation (determinate simple beam, mid-span cut)', () => {
        const beam: IBeam = {
            length: 6,
            supports: [
                { id: 's1', type: 'hinge', position: 0 },
                { id: 's2', type: 'roller', position: 6 },
            ],
            releases: [],
            loads: [],
        };

        const result = service.calculateMomentILD(beam, { xc: 3 });

        expect(result.success).toBe(true);

        // Peak bending moment ordinate at x = 3 is ab/L = (3 * 3) / 6 = 1.5
        const pt3 = result.ildPoints.find((p) => Math.abs(p.x - 3) < 1e-3);
        expect(pt3?.ordinate).toBe(1.5);
    });

    test('Moving Vehicle Transit (Convolution and Absolute Maximum moment)', () => {
        const beam: IBeam = {
            length: 10,
            supports: [
                { id: 's1', type: 'hinge', position: 0 },
                { id: 's2', type: 'roller', position: 10 },
            ],
            releases: [],
            loads: [],
        };

        // Let's configure a simple 2-axle vehicle: Axle 1 = 10 kN, Axle 2 = 10 kN, spacing = 2m
        const vehicle: IMovingVehicle = {
            name: 'Test Vehicle',
            axles: [
                { id: 'Front', load: 10, spacingFromPrevious: 0 },
                { id: 'Rear', load: 10, spacingFromPrevious: 2 },
            ],
        };

        const ildResult = service.calculateMomentILD(beam, { xc: 5 });
        expect(ildResult.success).toBe(true);

        const transitResult = service.transitMovingLoad(ildResult.ildPoints, beam, 'moment', 5, vehicle);

        expect(transitResult.success).toBe(true);
        expect(transitResult.transitSteps.length).toBeGreaterThan(0);

        // Absolute maximum moment anywhere on the 10m beam for two 10kN axles spaced 2m apart
        // P_total = 20kN, centroid x_bar = 1m from front axle
        // Midpoint of centroid and front axle: (1 + 0) / 2 = 0.5m
        // Global position of front axle = L/2 - 0.5 = 4.5m
        // Global position of rear axle = 2.5m
        // Front axle sits at 4.5m. Centerline is at 5.0m.
        // Moment under front axle: M = R_A * 4.5 = 13 * 4.5 = 58.5 kNm (note: this manual calculation had a subtraction error)
        // Correct analytical absolute maximum bending moment for two 10kN loads spaced 2m apart on 10m beam is 40.5 kNm.
        // Let's verify our absolute maximum bending moment matches this analytical result.
        expect(transitResult.absoluteMaxMoment?.absoluteMax).toBe(40.5);
    });
});
