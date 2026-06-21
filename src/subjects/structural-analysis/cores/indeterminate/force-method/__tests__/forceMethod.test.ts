import { describe, it, expect } from 'vitest';
import { solveForceMethod } from '../forceMethod';
import { INode, IMember, IFrameSupport, IFrameLoad } from '../../../../features/frame-solver/types/frame';

describe('Force Method (Flexibility Method) Module', () => {
  it('correctly solves moments for a continuous 2-span beam (fixed at end) using cantilever primary structure', () => {
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 6, y: 0 },
      { id: 'node_3', x: 10, y: 0 }
    ];
    const members: IMember[] = [
      { id: 'member_1', startNodeId: 'node_1', endNodeId: 'node_2', E: 200, I: 100, A: 5000 },
      { id: 'member_2', startNodeId: 'node_2', endNodeId: 'node_3', E: 200, I: 100, A: 5000 }
    ];
    const supports: IFrameSupport[] = [
      { id: 'sup_1', nodeId: 'node_1', type: 'roller', angle: 0 },
      { id: 'sup_2', nodeId: 'node_2', type: 'roller', angle: 0 },
      { id: 'sup_3', nodeId: 'node_3', type: 'fixed', angle: 0 } // Fixed end Node 3 -> Cantilever model
    ];
    // w = 12kN/m UDL on Member 1
    const loads: IFrameLoad[] = [
      { id: 'load_1', type: 'udl', magnitude: 12, direction: 'global-vertical', attachedTo: 'member', memberId: 'member_1' }
    ];

    const { finalMoments, steps } = solveForceMethod(nodes, members, supports, loads);

    expect(steps.some(s => s.type === 'FORCE_PRIMARY_SETUP')).toBe(true);
    expect(steps.some(s => s.type === 'FORCE_COMPATIBILITY_SETUP')).toBe(true);
    expect(steps.some(s => s.type === 'MATRIX_INVERSION')).toBe(true);

    const m1 = finalMoments.get('member_1')!;
    const m2 = finalMoments.get('member_2')!;

    // Pin end is 0
    expect(m1.M_ab).toBeCloseTo(0, 1);

    // Support 2 moment is 36 kNm (Clockwise reaction at right end of member 1, counterclockwise at left end of member 2)
    expect(m1.M_ba).toBeCloseTo(36.0, 1);
    expect(m2.M_ab).toBeCloseTo(-36.0, 1);

    // Fixed end moment is -18.0 kNm (reaction moment)
    expect(m2.M_ba).toBeCloseTo(-18.0, 1);
  });

  it('correctly solves moments for a continuous 2-span beam (pinned at both ends) using simple span primary structure', () => {
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 6, y: 0 },
      { id: 'node_3', x: 10, y: 0 }
    ];
    const members: IMember[] = [
      { id: 'member_1', startNodeId: 'node_1', endNodeId: 'node_2', E: 200, I: 100, A: 5000 },
      { id: 'member_2', startNodeId: 'node_2', endNodeId: 'node_3', E: 200, I: 100, A: 5000 }
    ];
    const supports: IFrameSupport[] = [
      { id: 'sup_1', nodeId: 'node_1', type: 'roller', angle: 0 },
      { id: 'sup_2', nodeId: 'node_2', type: 'roller', angle: 0 },
      { id: 'sup_3', nodeId: 'node_3', type: 'roller', angle: 0 } // All roller/pinned -> Simple span model
    ];
    // w = 12kN/m UDL on Member 1
    const loads: IFrameLoad[] = [
      { id: 'load_1', type: 'udl', magnitude: 12, direction: 'global-vertical', attachedTo: 'member', memberId: 'member_1' }
    ];

    const { finalMoments } = solveForceMethod(nodes, members, supports, loads);

    const m1 = finalMoments.get('member_1')!;
    const m2 = finalMoments.get('member_2')!;

    // Pin ends are 0
    expect(m1.M_ab).toBeCloseTo(0, 1);
    expect(m2.M_ba).toBeCloseTo(0, 1);

    // Support 2 moment is 32.4 kNm
    expect(m1.M_ba).toBeCloseTo(32.4, 1);
    expect(m2.M_ab).toBeCloseTo(-32.4, 1);
  });
});
