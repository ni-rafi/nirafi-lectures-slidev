export interface INode {
  id: string;
  x: number; // coordinate in meters
  y: number; // coordinate in meters
}

export interface IMember {
  id: string;
  startNodeId: string;
  endNodeId: string;
  E: number; // Young's modulus (GPa)
  I: number; // Moment of inertia (10^6 mm^4)
  A: number; // Cross-section area (mm^2)
  releases?: {
    start: boolean; // Pinned joint at start node
    end: boolean;   // Pinned joint at end node
  };
}

export type FrameSupportType = 'fixed' | 'hinge' | 'roller';

export interface IFrameSupport {
  id: string;
  nodeId: string;
  type: FrameSupportType;
  angle: number; // Rotation angle in degrees (default 0 for vertical)
}

export type FrameLoadDirection = 'global-vertical' | 'global-horizontal' | 'local-transverse';

export interface IFrameLoad {
  id: string;
  type: 'point' | 'moment' | 'udl';
  magnitude: number; // kN or kNm
  direction: FrameLoadDirection;
  
  // Placement: either attached to a node, or a position along a member
  attachedTo: 'node' | 'member';
  nodeId?: string;
  memberId?: string;
  
  // Position along member (relative: 0 to 1)
  position?: number;
}
