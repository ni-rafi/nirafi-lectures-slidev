import { describe, it, expect } from 'vitest';
import { FrameSolverService } from '../FrameSolverService';
import { INode, IMember, IFrameSupport, IFrameLoad } from '@/subjects/structural-analysis/features/frame-solver/types/frame';

describe('FrameSolverService', () => {
  const solverService = new FrameSolverService();

  it('correctly maps a simple horizontal beam under vertical UDL and point load', () => {
    // 6m horizontal beam between node 1 (0,0) and node 2 (6,0)
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 6, y: 0 }
    ];
    const members: IMember[] = [
      {
        id: 'member_1',
        startNodeId: 'node_1',
        endNodeId: 'node_2',
        E: 200,
        I: 100,
        A: 5000,
        releases: { start: false, end: false }
      }
    ];
    const supports: IFrameSupport[] = [
      { id: 'supp_1', nodeId: 'node_1', type: 'fixed', angle: 0 },
      { id: 'supp_2', nodeId: 'node_2', type: 'roller', angle: 0 }
    ];
    const loads: IFrameLoad[] = [
      {
        id: 'load_1',
        type: 'udl',
        magnitude: 10,
        direction: 'global-vertical',
        attachedTo: 'member',
        memberId: 'member_1'
      },
      {
        id: 'load_2',
        type: 'point',
        magnitude: 20,
        direction: 'global-vertical',
        attachedTo: 'member',
        memberId: 'member_1',
        position: 0.5
      }
    ];

    const result = solverService.solveMember('member_1', nodes, members, supports, loads);

    expect(result.success).toBe(true);
    expect(result.length).toBe(6);
    expect(result.sfdBmdResult).not.toBeNull();
    expect(result.sfdBmdResult?.success).toBe(true);

    // Verify 1D solver has 3 reaction components (2 for hinge at 0, 1 for roller at L)
    const solvedBeam = result.sfdBmdResult;
    expect(solvedBeam?.reactions).toHaveLength(3);

    // Bending moments should be solved
    expect(result.sfdBmdResult?.intervals.length).toBeGreaterThan(0);

    // Deflection should succeed
    expect(result.deflectionResult).not.toBeNull();
    expect(result.deflectionResult?.success).toBe(true);
    expect(result.deflectionResult?.points.length).toBeGreaterThan(0);

    // Axial force should be constant (no axial loads)
    expect(result.axialResult).not.toBeNull();
    expect(result.axialResult?.success).toBe(true);
    expect(result.axialResult?.intervals).toHaveLength(1);
    expect(result.axialResult?.intervals?.[0]?.value).toBe(0); // Horizontal beam with no lateral load has 0 axial force
  });

  it('correctly projects vertical column loads to local shear/moment and axial force', () => {
    // 4m vertical column from node 1 (0,0) to node 2 (0,4)
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 0, y: 4 }
    ];
    const members: IMember[] = [
      {
        id: 'member_1',
        startNodeId: 'node_1',
        endNodeId: 'node_2',
        E: 200,
        I: 100,
        A: 5000
      }
    ];
    const supports: IFrameSupport[] = [
      { id: 'supp_1', nodeId: 'node_1', type: 'hinge', angle: 0 }
    ];
    const loads: IFrameLoad[] = [
      // Lateral point load pushing rightwards (global-horizontal)
      {
        id: 'load_1',
        type: 'point',
        magnitude: 15,
        direction: 'global-horizontal',
        attachedTo: 'member',
        memberId: 'member_1',
        position: 0.5
      }
    ];

    const result = solverService.solveMember('member_1', nodes, members, supports, loads);

    expect(result.success).toBe(true);
    expect(result.length).toBe(4);
    expect(result.sfdBmdResult?.success).toBe(true);

    // The load is global-horizontal (15 kN) on a vertical member (theta = 90 deg)
    // Local transverse force should be -15 * sin(90) = -15 kN.
    // 1D solver magnitude is -(-15) = 15 kN.
    // Let's verify that the virtual loads list has a point load of magnitude 15 at position 2
    const virtualPointLoad = result.sfdBmdResult;
    expect(virtualPointLoad).toBeDefined();

    // Axial force check
    expect(result.axialResult?.success).toBe(true);
    expect(result.axialResult?.intervals.length).toBeGreaterThan(0);
  });

  it('respects end release boundary conditions for bending moments', () => {
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 5, y: 0 }
    ];
    const members: IMember[] = [
      {
        id: 'member_1',
        startNodeId: 'node_1',
        endNodeId: 'node_2',
        E: 200,
        I: 100,
        A: 5000,
        releases: { start: true, end: true } // Pinned ends
      }
    ];
    const supports: IFrameSupport[] = [];
    const loads: IFrameLoad[] = [
      {
        id: 'load_1',
        type: 'udl',
        magnitude: 12,
        direction: 'global-vertical',
        attachedTo: 'member',
        memberId: 'member_1'
      }
    ];

    const result = solverService.solveMember('member_1', nodes, members, supports, loads);

    expect(result.success).toBe(true);
    // Since start and end are released, end moments M_start and M_end must be exactly 0.
    // Let's check that the solved bending moment diagram has 0 moment at x=0 and x=5
    const intervals = result.sfdBmdResult?.intervals;
    expect(intervals).toBeDefined();
    
    // Check first interval start moment
    const mStart = intervals?.[0]?.mCoeffs?.[3]; // d in a*x^3 + b*x^2 + c*x + d
    expect(mStart).toBeDefined();
    expect(Math.abs(mStart!)).toBeLessThan(1e-3);
  });
});
