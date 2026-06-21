import { IStructuralStep, IMdmFinalMomentsPayload } from '../../shared/types/step-protocol';
import { INode, IMember, IFrameSupport, IFrameLoad } from '../../../features/frame-solver/types/frame';
import { solveMatrixEquations } from '../matrixSolver';
import { getCantileverM0, getSimpleSpanM0 } from './forceMethodHelpers';

/**
 * Solves continuous beams using the Force Method (Flexibility Method).
 */
export function solveForceMethod(
  nodes: INode[],
  members: IMember[],
  supports: IFrameSupport[],
  loads: IFrameLoad[]
): {
  finalMoments: Map<string, { M_ab: number; M_ba: number }>;
  steps: IStructuralStep[];
} {
  const steps: IStructuralStep[] = [];
  
  // Sort nodes by x-coordinate to process left-to-right continuous beam
  const sortedNodes = [...nodes].sort((a, b) => a.x - b.x);
  const L_total = sortedNodes[sortedNodes.length - 1]!.x - sortedNodes[0]!.x;

  // Map memberId to global x interval
  const memberMap = new Map<string, { startX: number; endX: number }>();
  members.forEach(member => {
    const start = nodes.find(n => n.id === member.startNodeId)!;
    const end = nodes.find(n => n.id === member.endNodeId)!;
    memberMap.set(member.id, {
      startX: Math.min(start.x, end.x),
      endX: Math.max(start.x, end.x)
    });
  });

  // Identify boundary condition at rightmost Node N
  const rightNode = sortedNodes[sortedNodes.length - 1]!;
  const rightSupport = supports.find(s => s.nodeId === rightNode.id);
  const isRightFixed = rightSupport?.type === 'fixed';

  // 1. Redundant Selection and Primary Structure setup
  const redundantNodeIds: string[] = [];
  let primaryDesc = '';

  if (isRightFixed) {
    // Primary Structure: Cantilever fixed at rightmost node
    // Redundants: vertical reactions at all other support nodes
    sortedNodes.slice(0, -1).forEach(node => {
      if (supports.some(s => s.nodeId === node.id)) {
        redundantNodeIds.push(node.id);
      }
    });
    primaryDesc = `Cantilever beam fixed at Node ${rightNode.id}`;
  } else {
    // Primary Structure: Simple span beam supported at Node 0 and Node N
    // Redundants: vertical reactions at intermediate support nodes
    sortedNodes.slice(1, -1).forEach(node => {
      if (supports.some(s => s.nodeId === node.id)) {
        redundantNodeIds.push(node.id);
      }
    });
    const leftNode = sortedNodes[0]!;
    primaryDesc = `Simple span beam supported at Node ${leftNode.id} and Node ${rightNode.id}`;
  }

  const dsi = redundantNodeIds.length;
  steps.push({
    stepId: `force_primary_${Date.now()}`,
    type: 'FORCE_PRIMARY_SETUP',
    payload: {
      dsi,
      redundantReactions: redundantNodeIds.map(nodeId => ({
        nodeId,
        reactionType: 'Vertical Support Reaction'
      })),
      primaryStructureDescription: primaryDesc
    }
  });

  // Calculate V0 (reaction at left node) for simple beam external loads
  let V0_ext = 0;
  if (!isRightFixed) {
    let sumMomentsRight = 0;
    loads.forEach(load => {
      if (load.attachedTo !== 'member' || !load.memberId) return;
      const span = memberMap.get(load.memberId)!;
      const loadX = span.startX + (load.position ?? 0.5) * (span.endX - span.startX);
      const distToRight = L_total - loadX;
      
      if (load.type === 'point') {
        sumMomentsRight += load.magnitude * distToRight;
      } else if (load.type === 'udl') {
        const u = span.startX;
        const v = span.endX;
        const W = load.magnitude * (v - u);
        const centroid = (u + v) / 2;
        sumMomentsRight += W * (L_total - centroid);
      }
    });
    V0_ext = sumMomentsRight / L_total;
  }

  // 2. Define unit moment functions m_i(x) and load moment M0(x)
  const getM0 = (x: number) => {
    return isRightFixed 
      ? getCantileverM0(x, loads, memberMap)
      : getSimpleSpanM0(x, V0_ext, loads, memberMap);
  };

  const getMi = (i: number, x: number) => {
    const nodeX = nodes.find(n => n.id === redundantNodeIds[i])!.x;
    if (isRightFixed) {
      // Cantilever: unit upward load at nodeX causes moment to the right (x >= nodeX)
      return x >= nodeX ? (x - nodeX) : 0;
    } else {
      // Simple span: standard point load moment diagram on simple beam of length L_total
      return x < nodeX 
        ? (x * (L_total - nodeX)) / L_total
        : (nodeX * (L_total - x)) / L_total;
    }
  };

  // 3. Numerical Integration (Simpson's / Trapezoidal rule)
  const f = Array.from({ length: dsi }, () => new Array<number>(dsi).fill(0));
  const delta0 = new Array<number>(dsi).fill(0);
  const N_steps = 100; // Intervals per member span

  members.forEach(member => {
    const span = memberMap.get(member.id)!;
    const L_span = span.endX - span.startX;
    const dx = L_span / N_steps;

    const E = member.E ?? 200;
    const I = member.I ?? 100;
    const EI = E * I; // kN * m^2

    for (let s = 0; s <= N_steps; s++) {
      const localX = s * dx;
      const globalX = span.startX + localX;
      const weight = (s === 0 || s === N_steps) ? 0.5 : 1.0;

      const M0_val = getM0(globalX);

      for (let i = 0; i < dsi; i++) {
        const mi_val = getMi(i, globalX);
        delta0[i]! += (weight * M0_val * mi_val * dx) / EI;

        for (let j = 0; j < dsi; j++) {
          const mj_val = getMi(j, globalX);
          f[i]![j]! += (weight * mi_val * mj_val * dx) / EI;
        }
      }
    }
  });

  // 4. Solve Compatibility Equations [f]{R} = {-delta0}
  const RHS = delta0.map(d => -d);
  let solvedRedundants = new Array<number>(dsi).fill(0);

  if (dsi > 0) {
    const solveStep = solveMatrixEquations(f, RHS);
    solvedRedundants = solveStep.payload.vectorD ?? [];
    steps.push(solveStep);
  }

  steps.push({
    stepId: `force_compatibility_${Date.now()}`,
    type: 'FORCE_COMPATIBILITY_SETUP',
    payload: {
      flexibilityMatrix: f,
      displacementVector0: delta0,
      solvedRedundants
    }
  });

  // 5. Calculate Final End Moments using Superposition
  const finalMoments = new Map<string, { M_ab: number; M_ba: number }>();
  const finalMomentsList: IMdmFinalMomentsPayload['memberEndMoments'] = [];

  members.forEach(member => {
    const startNode = nodes.find(n => n.id === member.startNodeId)!;
    const endNode = nodes.find(n => n.id === member.endNodeId)!;

    const getMomentAtGlobal = (globalX: number) => {
      let M = getM0(globalX);
      for (let i = 0; i < dsi; i++) {
        M += solvedRedundants[i]! * getMi(i, globalX);
      }
      return M;
    };

    // Evaluate moment at both start and end coordinates
    // Convert to Clockwise-Positive member-end convention:
    // Left end moment M_ab is positive sagging (clockwise). Right end moment M_ba is negative sagging.
    let M_ab = getMomentAtGlobal(startNode.x);
    let M_ba = -getMomentAtGlobal(endNode.x);

    M_ab = parseFloat(M_ab.toFixed(3));
    M_ba = parseFloat(M_ba.toFixed(3));

    finalMoments.set(member.id, { M_ab, M_ba });
    finalMomentsList.push({
      memberId: member.id,
      startMoment: M_ab,
      endMoment: M_ba
    });
  });

  steps.push({
    stepId: `force_final_moments_${Date.now()}`,
    type: 'MDM_FINAL_MOMENTS',
    payload: { memberEndMoments: finalMomentsList }
  });

  return { finalMoments, steps };
}
