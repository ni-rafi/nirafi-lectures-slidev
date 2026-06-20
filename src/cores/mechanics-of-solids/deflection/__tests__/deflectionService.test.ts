import { describe, test, expect } from 'vitest';
import { DeflectionService } from '../deflectionService';
import { IBeam, IReaction, IIntervalEquation } from '../../sfd-bmd/types';
import { IEISegment } from '../types';

describe('Beam Deflection Solver Engine', () => {
  const deflectionService = new DeflectionService();

  test('Simply Supported Beam with Mid-span Point Load (Constant EI)', () => {
    const beam: IBeam = {
      length: 6,
      supports: [
        { id: 's-hinge', type: 'hinge', position: 0 },
        { id: 's-roller', type: 'roller', position: 6 },
      ],
      releases: [],
      loads: [
        { id: 'l-point', type: 'point', position: 3, magnitude: 10 },
      ],
    };

    const reactions: IReaction[] = [
      { supportId: 's-hinge', type: 'R_y', value: 5 },
      { supportId: 's-roller', type: 'R_y', value: 5 },
    ];

    const sfdBmdIntervals: IIntervalEquation[] = [
      {
        startX: 0,
        endX: 3,
        vCoeffs: [0, 0, 5],
        mCoeffs: [0, 0, 5, 0],
        latexV: '5',
        latexM: '5x',
      },
      {
        startX: 3,
        endX: 6,
        vCoeffs: [0, 0, -5],
        mCoeffs: [0, 0, -5, 30],
        latexV: '-5',
        latexM: '30 - 5x',
      },
    ];

    const eiSegments: IEISegment[] = [
      { id: 'default', startPosition: 0, endPosition: 6, E: 200, I: 100 }, // EI = 20,000 kN.m^2
    ];

    // Double Integration Method
    const resultDI = deflectionService.calculateDeflection(
      beam,
      reactions,
      sfdBmdIntervals,
      eiSegments,
      'double-integration',
      3 // Inspect mid-span
    );

    expect(resultDI.success).toBe(true);
    // Theoretical max deflection = P * L^3 / (48 * E * I)
    // = 10 * 6^3 / (48 * 200 * 100) = 2160 / 960000 = 0.00225 m = 2.25 mm
    const midPoint = resultDI.criticalPoints.find(p => Math.abs(p.x - 3) < 1e-3);
    expect(midPoint).toBeDefined();
    expect(Math.abs(midPoint!.deflection)).toBeCloseTo(2.25, 2);

    // Moment-Area Method
    const resultMA = deflectionService.calculateDeflection(
      beam,
      reactions,
      sfdBmdIntervals,
      eiSegments,
      'moment-area',
      3
    );
    expect(resultMA.success).toBe(true);
    const midPointMA = resultMA.criticalPoints.find(p => Math.abs(p.x - 3) < 1e-3);
    expect(midPointMA).toBeDefined();
    expect(Math.abs(midPointMA!.deflection)).toBeCloseTo(2.25, 2);

    // Conjugate Beam Method
    const resultCB = deflectionService.calculateDeflection(
      beam,
      reactions,
      sfdBmdIntervals,
      eiSegments,
      'conjugate-beam',
      3
    );
    expect(resultCB.success).toBe(true);
    const midPointCB = resultCB.criticalPoints.find(p => Math.abs(p.x - 3) < 1e-3);
    expect(midPointCB).toBeDefined();
    expect(Math.abs(midPointCB!.deflection)).toBeCloseTo(2.25, 2);
  });

  test('Cantilever Beam with Point Load at Free End (Constant EI)', () => {
    const beam: IBeam = {
      length: 3,
      supports: [
        { id: 's-fixed', type: 'fixed', position: 0 },
      ],
      releases: [],
      loads: [
        { id: 'l-point', type: 'point', position: 3, magnitude: 10 },
      ],
    };

    const reactions: IReaction[] = [
      { supportId: 's-fixed', type: 'R_y', value: 10 },
      { supportId: 's-fixed', type: 'M', value: -30 },
    ];

    const sfdBmdIntervals: IIntervalEquation[] = [
      {
        startX: 0,
        endX: 3,
        vCoeffs: [0, 0, 10],
        mCoeffs: [0, 0, 10, -30],
        latexV: '10',
        latexM: '10x - 30',
      },
    ];

    const eiSegments: IEISegment[] = [
      { id: 'default', startPosition: 0, endPosition: 3, E: 200, I: 100 }, // EI = 20,000 kN.m^2
    ];

    // Double Integration
    const resultDI = deflectionService.calculateDeflection(
      beam,
      reactions,
      sfdBmdIntervals,
      eiSegments,
      'double-integration',
      3
    );

    expect(resultDI.success).toBe(true);
    // Theoretical max deflection = P * L^3 / (3 * E * I)
    // = 10 * 3^3 / (3 * 20000) = 270 / 60000 = 0.0045 m = 4.5 mm
    // Note: Since reaction moment is negative, the moment diagram is negative, yielding negative deflection.
    const freeEnd = resultDI.criticalPoints.find(p => Math.abs(p.x - 3) < 1e-3);
    expect(freeEnd).toBeDefined();
    expect(Math.abs(freeEnd!.deflection)).toBeCloseTo(4.5, 2);
    // Slope at fixed end should be 0
    const fixedEnd = resultDI.criticalPoints.find(p => Math.abs(p.x - 0) < 1e-3);
    expect(fixedEnd).toBeDefined();
    expect(fixedEnd!.slope).toBeCloseTo(0, 5);
  });

  test('Simply Supported Beam with Segmented Stiffness (Varying EI)', () => {
    const beam: IBeam = {
      length: 4,
      supports: [
        { id: 's-hinge', type: 'hinge', position: 0 },
        { id: 's-roller', type: 'roller', position: 4 },
      ],
      releases: [],
      loads: [
        { id: 'l-point', type: 'point', position: 2, magnitude: 10 },
      ],
    };

    const reactions: IReaction[] = [
      { supportId: 's-hinge', type: 'R_y', value: 5 },
      { supportId: 's-roller', type: 'R_y', value: 5 },
    ];

    const sfdBmdIntervals: IIntervalEquation[] = [
      {
        startX: 0,
        endX: 2,
        vCoeffs: [0, 0, 5],
        mCoeffs: [0, 0, 5, 0],
        latexV: '5',
        latexM: '5x',
      },
      {
        startX: 2,
        endX: 4,
        vCoeffs: [0, 0, -5],
        mCoeffs: [0, 0, -5, 20],
        latexV: '-5',
        latexM: '20 - 5x',
      },
    ];

    // Segment 1: double stiffness (I=200), Segment 2: single stiffness (I=100)
    const eiSegments: IEISegment[] = [
      { id: 'seg1', startPosition: 0, endPosition: 2, E: 200, I: 200 },
      { id: 'seg2', startPosition: 2, endPosition: 4, E: 200, I: 100 },
    ];

    const result = deflectionService.calculateDeflection(
      beam,
      reactions,
      sfdBmdIntervals,
      eiSegments,
      'double-integration',
      2
    );

    expect(result.success).toBe(true);
    // Should solve successfully without singularity, ensuring continuity at interface
    const midPoint = result.criticalPoints.find(p => Math.abs(p.x - 2) < 1e-3);
    expect(midPoint).toBeDefined();
    expect(midPoint!.deflection).not.toBeNaN();
    expect(midPoint!.slope).not.toBeNaN();
  });
});
