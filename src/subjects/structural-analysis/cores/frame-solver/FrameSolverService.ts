import { SFDBmdService } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/sfdBmdService';
import { DeflectionService } from '@/subjects/mechanics-of-solids/cores/deflection/deflectionService';
import { INode, IMember, IFrameSupport, IFrameLoad } from '../../features/frame-solver/types/frame';
import { IBeam, ILoad, ISolverOutput } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IEISegment, IDeflectionResult } from '@/subjects/mechanics-of-solids/cores/deflection/types';

interface AxialInterval {
  startX: number;
  endX: number;
  value: number;
}

export interface IFrameMemberSolveResult {
  success: boolean;
  length: number;
  sfdBmdResult: ISolverOutput | null;
  deflectionResult: IDeflectionResult | null;
  axialResult: {
    success: boolean;
    intervals: AxialInterval[];
  } | null;
}

export class FrameSolverService {
  private sfdBmdService = new SFDBmdService();
  private deflectionService = new DeflectionService();

  public solveMember(
    memberId: string,
    nodes: INode[],
    members: IMember[],
    supports: IFrameSupport[],
    loads: IFrameLoad[]
  ): IFrameMemberSolveResult {
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return { success: false, length: 0, sfdBmdResult: null, deflectionResult: null, axialResult: null };
    }

    const startNode = nodes.find(n => n.id === member.startNodeId);
    const endNode = nodes.find(n => n.id === member.endNodeId);
    if (!startNode || !endNode) {
      return { success: false, length: 0, sfdBmdResult: null, deflectionResult: null, axialResult: null };
    }

    // 1. Calculate Geometry
    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1e-3) {
      return { success: false, length: 0, sfdBmdResult: null, deflectionResult: null, axialResult: null };
    }

    const cosTheta = dx / L;
    const sinTheta = dy / L;

    // 2. Project Member Loads
    const memberLoads = loads.filter(l => l.attachedTo === 'member' && l.memberId === memberId);

    const virtualLoads: ILoad[] = [];

    // Direct loads on member
    memberLoads.forEach(load => {
      const pos = load.position ?? 0.5;
      const mag = load.magnitude;

      if (load.type === 'moment') {
        virtualLoads.push({
          id: `virtual_${load.id}`,
          type: 'moment',
          position: pos * L,
          magnitude: mag
        });
      } else if (load.type === 'point') {
        let fTr = 0;

        if (load.direction === 'global-vertical') {
          fTr = mag * cosTheta;
        } else if (load.direction === 'global-horizontal') {
          fTr = -mag * sinTheta;
        } else {
          // local-transverse
          fTr = mag;
        }

        // 1D solver treats positive point loads as downward (i.e. in the direction of local transverse force)
        virtualLoads.push({
          id: `virtual_${load.id}`,
          type: 'point',
          position: pos * L,
          magnitude: fTr
        });
      } else if (load.type === 'udl') {
        let wTr = 0;

        if (load.direction === 'global-vertical') {
          wTr = mag * cosTheta;
        } else if (load.direction === 'global-horizontal') {
          wTr = -mag * sinTheta;
        } else {
          wTr = mag;
        }

        virtualLoads.push({
          id: `virtual_${load.id}`,
          type: 'udl',
          startPosition: 0,
          endPosition: L,
          magnitude: wTr
        });
      }
    });

    // 3. Determine boundary conditions & simulate end moments
    // Check if start/end nodes have supports
    const startSupport = supports.find(s => s.nodeId === member.startNodeId);
    const endSupport = supports.find(s => s.nodeId === member.endNodeId);

    // Releases at joint
    const hasStartRelease = member.releases?.start === true;
    const hasEndRelease = member.releases?.end === true;

    // Fixed end moments simulation (using standard FEM formulae)
    let femStart = 0;
    let femEnd = 0;

    virtualLoads.forEach(vl => {
      if (vl.type === 'point' && vl.position !== undefined && vl.magnitude !== undefined) {
        const a = vl.position;
        const b = L - a;
        const P = vl.magnitude;
        femStart += (P * a * b * b) / (L * L);
        femEnd -= (P * a * a * b) / (L * L);
      } else if (vl.type === 'udl' && vl.magnitude !== undefined) {
        const w = vl.magnitude;
        femStart += (w * L * L) / 12;
        femEnd -= (w * L * L) / 12;
      }
    });

    // Apply joint stiffness and boundary conditions to simulated end moments
    let M_start = femStart;
    let M_end = femEnd;

    if (hasStartRelease || (startSupport && (startSupport.type === 'hinge' || startSupport.type === 'roller'))) {
      M_start = 0;
    }
    if (hasEndRelease || (endSupport && (endSupport.type === 'hinge' || endSupport.type === 'roller'))) {
      M_end = 0;
    }

    // Add these end moments as concentrated moments to the virtual beam loads
    if (Math.abs(M_start) > 1e-4) {
      virtualLoads.push({
        id: `fem_start_${memberId}`,
        type: 'moment',
        position: 0,
        magnitude: M_start
      });
    }
    if (Math.abs(M_end) > 1e-4) {
      virtualLoads.push({
        id: `fem_end_${memberId}`,
        type: 'moment',
        position: L,
        magnitude: M_end
      });
    }

    // 4. Construct Virtual Beam
    const virtualBeam: IBeam = {
      length: parseFloat(L.toFixed(3)),
      supports: [
        { id: `virtual_supp_start`, type: 'hinge', position: 0 },
        { id: `virtual_supp_end`, type: 'roller', position: parseFloat(L.toFixed(3)) }
      ],
      releases: [],
      loads: virtualLoads
    };

    // 5. Solve SFD & BMD
    const sfdBmdResult = this.sfdBmdService.solve(virtualBeam);

    // 6. Solve Deflection
    let deflectionResult: IDeflectionResult | null = null;
    if (sfdBmdResult.success) {
      const eiSegments: IEISegment[] = [
        {
          id: `ei_${memberId}`,
          startPosition: 0,
          endPosition: parseFloat(L.toFixed(3)),
          E: member.E ?? 200,
          I: member.I ?? 100
        }
      ];
      deflectionResult = this.deflectionService.calculateDeflection(
        virtualBeam,
        sfdBmdResult.reactions,
        sfdBmdResult.intervals,
        eiSegments,
        'double-integration',
        null
      );
    }

    // 7. Solve Axial Forces
    // Heuristic: Sum up external load effects on frame to calculate base column compression/beam tension
    let baseAxial = 0;
    
    // Sum global downward load
    let totalDownwardLoad = 0;
    let totalLateralLoad = 0;
    loads.forEach(l => {
      if (l.type === 'point') {
        if (l.direction === 'global-vertical' && l.magnitude > 0) totalDownwardLoad += l.magnitude;
        if (l.direction === 'global-horizontal') totalLateralLoad += l.magnitude;
      } else if (l.type === 'udl') {
        if (l.direction === 'global-vertical' && l.magnitude > 0) {
          // Find member length
          const m = members.find(mem => mem.id === l.memberId);
          if (m) {
            const sn = nodes.find(n => n.id === m.startNodeId);
            const en = nodes.find(n => n.id === m.endNodeId);
            if (sn && en) {
              const len = Math.sqrt((en.x - sn.x) ** 2 + (en.y - sn.y) ** 2);
              totalDownwardLoad += l.magnitude * len;
            }
          }
        }
      }
    });

    const isVertical = Math.abs(cosTheta) < 0.1; // Column
    const isHorizontal = Math.abs(sinTheta) < 0.1; // Beam

    if (isVertical) {
      // Column takes roughly half of the gravity loads as compression
      baseAxial = -totalDownwardLoad / 2;
      // Add shear contribution from lateral load
      baseAxial += (totalLateralLoad * sinTheta) / 2;
    } else if (isHorizontal) {
      // Beam takes tension/compression from lateral loads
      baseAxial = -totalLateralLoad / 2;
    } else {
      // Inclined member
      baseAxial = -totalDownwardLoad / 3;
    }

    // Adjust base axial if direct loads have local axial components
    const axialIntervals: AxialInterval[] = [];
    const pointLoadsOnMember = memberLoads.filter(l => {
      if (l.type !== 'point') return false;
      let fAx = 0;
      if (l.direction === 'global-vertical') {
        fAx = l.magnitude * sinTheta;
      } else if (l.direction === 'global-horizontal') {
        fAx = l.magnitude * cosTheta;
      }
      return Math.abs(fAx) > 1e-4;
    });
    pointLoadsOnMember.sort((a, b) => (a.position ?? 0.5) - (b.position ?? 0.5));

    let currentAxial = baseAxial;
    let lastX = 0;

    pointLoadsOnMember.forEach(load => {
      const pos = load.position ?? 0.5;
      const mag = load.magnitude;
      const posX = pos * L;

      let fAx = 0;
      if (load.direction === 'global-vertical') {
        fAx = mag * sinTheta;
      } else if (load.direction === 'global-horizontal') {
        fAx = mag * cosTheta;
      }

      if (posX > lastX + 1e-3) {
        axialIntervals.push({
          startX: parseFloat(lastX.toFixed(3)),
          endX: parseFloat(posX.toFixed(3)),
          value: parseFloat(currentAxial.toFixed(3))
        });
      }

      // Point load axial component causes jump in axial diagram
      currentAxial -= fAx;
      lastX = posX;
    });

    if (L > lastX + 1e-3) {
      axialIntervals.push({
        startX: parseFloat(lastX.toFixed(3)),
        endX: parseFloat(L.toFixed(3)),
        value: parseFloat(currentAxial.toFixed(3))
      });
    }

    return {
      success: true,
      length: parseFloat(L.toFixed(3)),
      sfdBmdResult,
      deflectionResult,
      axialResult: {
        success: true,
        intervals: axialIntervals
      }
    };
  }
}
