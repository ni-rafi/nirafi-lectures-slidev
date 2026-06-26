import { describe, test, expect } from 'vitest';
import { SFDBmdService } from '../sfdBmdService';
import { IBeam } from '../types';

describe('SFDBmdService Solver Tests', () => {
  const solver = new SFDBmdService();

  test('Simply Supported Beam with Mid-span Point Load (determinate, stable)', () => {
    // 6m beam, Hinge at 0, Roller at 6, Point Load of 10kN at 3m
    const beam: IBeam = {
      length: 6,
      supports: [
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'roller', position: 6 },
      ],
      releases: [],
      loads: [
        { id: 'l1', type: 'point', position: 3, magnitude: 10 },
      ],
    };

    const result = solver.solve(beam);

    expect(result.success).toBe(true);
    expect(result.doiResult.doi).toBe(0);
    expect(result.doiResult.isDeterminate).toBe(true);

    // Reactions: Ry at s1 (0m) = 5kN, Ry at s2 (6m) = 5kN
    const r1 = result.reactions.find(r => r.supportId === 's1' && r.type === 'R_y');
    const r2 = result.reactions.find(r => r.supportId === 's2' && r.type === 'R_y');
    expect(r1?.value).toBe(5);
    expect(r2?.value).toBe(5);

    // Bending moment at midspan (3m) = PL/4 = 10 * 6 / 4 = 15 kNm
    const midPt = result.criticalPoints.find(p => Math.abs(p.x - 3) < 1e-3);
    expect(midPt?.m).toBe(15);
  });

  test('Cantilever Beam with Point Load at Free End (determinate, stable)', () => {
    // 4m beam, Fixed support at 0, Point Load of 5kN at 4m
    const beam: IBeam = {
      length: 4,
      supports: [
        { id: 's1', type: 'fixed', position: 0 },
      ],
      releases: [],
      loads: [
        { id: 'l1', type: 'point', position: 4, magnitude: 5 },
      ],
    };

    const result = solver.solve(beam);

    expect(result.success).toBe(true);
    expect(result.doiResult.doi).toBe(0);

    // Reactions: Ry = 5kN, M = -20kNm (since 5 * 4 = 20 clockwise load, support moment must be -20, or opposite)
    const rY = result.reactions.find(r => r.supportId === 's1' && r.type === 'R_y');
    const rM = result.reactions.find(r => r.supportId === 's1' && r.type === 'M');
    expect(rY?.value).toBe(5);
    expect(rM?.value).toBe(-20); // support reaction value matches the load moment to balance it

    // Bending moment at x = 0 is -20 kNm, bending moment at x = 4 is 0 kNm
    const pt0 = result.criticalPoints.find(p => Math.abs(p.x - 0) < 1e-3);
    const pt4 = result.criticalPoints.find(p => Math.abs(p.x - 4) < 1e-3);
    expect(pt0?.m).toBe(-20);
    expect(pt4?.m).toBe(0);
  });

  test('Gerber Beam with Internal Hinge (determinate, stable)', () => {
    // Gerber beam: 8m span
    // Support Hinge at 0, Support Roller at 4, Support Roller at 8
    // Internal Hinge at 6m
    // Loads: point load of 12kN at 2m (left span) and UDL of 4kN/m from 6m to 8m (right span)
    const beam: IBeam = {
      length: 8,
      supports: [
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'roller', position: 4 },
        { id: 's3', type: 'roller', position: 8 },
      ],
      releases: [
        { id: 'h1', type: 'hinge', position: 6 },
      ],
      loads: [
        { id: 'l1', type: 'point', position: 2, magnitude: 12 },
        { id: 'l2', type: 'udl', startPosition: 6, endPosition: 8, magnitude: 4 },
      ],
    };

    const result = solver.solve(beam);

    expect(result.success).toBe(true);
    expect(result.doiResult.doi).toBe(0); // reactions=4 (2+1+1), conditions=1, 4 - 3 - 1 = 0

    // Moment at internal hinge (6m) must be 0
    const hingePt = result.criticalPoints.find(p => Math.abs(p.x - 6) < 1e-3);
    expect(hingePt?.m).toBe(0);
  });

  test('Statically Indeterminate Beam (unsolvable in determinate solver)', () => {
    // Fixed support at 0, Roller support at 6 (Propped Cantilever, DOI = 4 - 3 = 1)
    const beam: IBeam = {
      length: 6,
      supports: [
        { id: 's1', type: 'fixed', position: 0 },
        { id: 's2', type: 'roller', position: 6 },
      ],
      releases: [],
      loads: [
        { id: 'l1', type: 'point', position: 3, magnitude: 10 },
      ],
    };

    const result = solver.solve(beam);

    expect(result.success).toBe(false);
    expect(result.doiResult.doi).toBe(1);
    expect(result.doiResult.isIndeterminate).toBe(true);
  });

  test('Unstable support configuration (unsolvable)', () => {
    // Only roller supports (horizontally unstable)
    const beam: IBeam = {
      length: 6,
      supports: [
        { id: 's1', type: 'roller', position: 0 },
        { id: 's2', type: 'roller', position: 6 },
      ],
      releases: [],
      loads: [
        { id: 'l1', type: 'point', position: 3, magnitude: 10 },
      ],
    };

    const result = solver.solve(beam);

    expect(result.success).toBe(false);
    expect(result.doiResult.isUnstable).toBe(true);
  });

  test('Graphical steps generated correctly with vCoeffs and diagramRole', () => {
    const beam: IBeam = {
      length: 6,
      supports: [
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'roller', position: 6 },
      ],
      releases: [],
      loads: [
        { id: 'l1', type: 'udl', startPosition: 0, endPosition: 6, magnitude: 4 },
      ],
    };

    const result = solver.solve(beam);
    expect(result.success).toBe(true);
    expect(result.graphicalStepsData).toBeDefined();
    expect(result.graphicalStepsData!.length).toBeGreaterThan(0);

    const sfdSegs = result.graphicalStepsData!.filter(s => s.type === 'sfd-segment');
    const bmdSegs = result.graphicalStepsData!.filter(s => s.type === 'bmd-segment');

    expect(sfdSegs.length).toBeGreaterThan(0);
    expect(bmdSegs.length).toBeGreaterThan(0);

    expect(sfdSegs[0]!.vCoeffs).toBeDefined();
    expect(bmdSegs[0]!.vCoeffs).toBeDefined();

    expect(bmdSegs[0]!.startX).toBe(0);
    expect(bmdSegs[0]!.endX).toBe(6);
  });

  test('Flat three-hinged arch (Hinge + Hinge + Internal Hinge) is detected as unstable mechanism', () => {
    // 8m beam, Hinge at 0, Hinge at 8, Internal Hinge at 4 (r=4, c=1, DOI=0)
    // Vertically: r_vert = 2, eq_vert = 3. Since r_vert < eq_vert, it is unstable.
    const beam: IBeam = {
      length: 8,
      supports: [
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'hinge', position: 8 },
      ],
      releases: [
        { id: 'r1', type: 'hinge', position: 4 },
      ],
      loads: [
        { id: 'l1', type: 'point', position: 2, magnitude: 10 },
      ],
    };

    const result = solver.solve(beam);
    expect(result.success).toBe(false);
    expect(result.doiResult.isUnstable).toBe(true);
    expect(result.doiResult.isDeterminate).toBe(false);
    expect(result.error).toContain('statically unstable');
  });

  test('Stable Gerber beam (Hinge + Roller + Roller + Internal Hinge) solves successfully', () => {
    // 8m beam, Hinge at 0, Roller at 4, Roller at 8, Internal Hinge at 6 (r=4, c=1, DOI=0)
    // Vertically: r_vert = 3, eq_vert = 3. Stable!
    const beam: IBeam = {
      length: 8,
      supports: [
        { id: 's1', type: 'hinge', position: 0 },
        { id: 's2', type: 'roller', position: 4 },
        { id: 's3', type: 'roller', position: 8 },
      ],
      releases: [
        { id: 'r1', type: 'hinge', position: 6 },
      ],
      loads: [
        { id: 'l1', type: 'point', position: 2, magnitude: 12 },
        { id: 'l2', type: 'udl', startPosition: 6, endPosition: 8, magnitude: 4 },
      ],
    };

    const result = solver.solve(beam);
    expect(result.success).toBe(true);
    expect(result.doiResult.doi).toBe(0);
    expect(result.doiResult.isDeterminate).toBe(true);
    expect(result.doiResult.isUnstable).toBe(false);
  });
});
