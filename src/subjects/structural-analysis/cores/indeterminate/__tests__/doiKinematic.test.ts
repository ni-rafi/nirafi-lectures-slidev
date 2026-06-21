import { describe, it, expect } from 'vitest';
import { calculateKinematicIndeterminacy } from '../doiKinematic';
import { INode, IMember, IFrameSupport } from '../../../features/frame-solver/types/frame';

describe('kinematic indeterminacy calculator', () => {
  it('correctly calculates DKI for a simple cantilever column (fixed at base, free at top)', () => {
    // Column from node_1 (0,0) to node_2 (0,3)
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 0, y: 3 }
    ];
    const members: IMember[] = [
      { id: 'member_1', startNodeId: 'node_1', endNodeId: 'node_2', E: 200, I: 100, A: 5000 }
    ];
    const supports: IFrameSupport[] = [
      { id: 'supp_1', nodeId: 'node_1', type: 'fixed', angle: 0 }
    ];

    const step = calculateKinematicIndeterminacy(nodes, members, supports);

    expect(step.type).toBe('DOI_KINEMATIC');
    
    // Total raw DOF = 3 * 2 = 6
    // Fixed support adds 3 restraints.
    // DKI = 6 - 3 = 3 (horizontal translation, vertical translation, and rotation at node_2)
    expect(step.payload.dki).toBe(3);
    expect(step.payload.nodesCount).toBe(2);
    expect(step.payload.restraintsCount).toBe(3);
    expect(step.payload.rotationalDegrees).toBe(1); // Node 2 can rotate
    expect(step.payload.swayDegrees).toBe(2); // Node 2 can sway horizontally and vertically
  });

  it('correctly calculates DKI for a portal frame with internal pinned releases', () => {
    // 4 nodes portal frame: 1, 2 (columns base), 3, 4 (top beam joints)
    const nodes: INode[] = [
      { id: 'node_1', x: 0, y: 0 },
      { id: 'node_2', x: 6, y: 0 },
      { id: 'node_3', x: 0, y: 4 },
      { id: 'node_4', x: 6, y: 4 }
    ];
    const members: IMember[] = [
      { id: 'member_col1', startNodeId: 'node_1', endNodeId: 'node_3', E: 200, I: 100, A: 5000 },
      { id: 'member_col2', startNodeId: 'node_2', endNodeId: 'node_4', E: 200, I: 100, A: 5000 },
      // Beam with rotational releases (pinned joints) at start and end
      { 
        id: 'member_beam', 
        startNodeId: 'node_3', 
        endNodeId: 'node_4', 
        E: 200, 
        I: 100, 
        A: 5000,
        releases: { start: true, end: true } 
      }
    ];
    // Pinned supports at ground level
    const supports: IFrameSupport[] = [
      { id: 'supp_1', nodeId: 'node_1', type: 'hinge', angle: 0 },
      { id: 'supp_2', nodeId: 'node_2', type: 'hinge', angle: 0 }
    ];

    const step = calculateKinematicIndeterminacy(nodes, members, supports);

    // Total raw DOF = 3 * 4 = 12
    // Hinge supports: 2 + 2 = 4 restraints.
    // Releases: 2 rotational releases.
    // DKI = 12 - 4 + 2 = 10
    expect(step.payload.dki).toBe(10);
    expect(step.payload.restraintsCount).toBe(4);
    expect(step.payload.details.length).toBeGreaterThan(0);
  });
});
