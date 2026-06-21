import { IDoiKinematicStep } from '../shared/types/step-protocol';
import { INode, IMember, IFrameSupport } from '../../features/frame-solver/types/frame';

/**
 * Calculates Degrees of Kinematic Indeterminacy (DKI) for a 2D frame.
 * @param nodes List of nodes in the frame topology
 * @param members List of members connecting the nodes
 * @param supports List of supports attached to nodes
 */
export function calculateKinematicIndeterminacy(
  nodes: INode[],
  members: IMember[],
  supports: IFrameSupport[]
): IDoiKinematicStep {
  const nodesCount = nodes.length;
  
  // Calculate support restraints
  let restraintsCount = 0;
  let fixedCount = 0;
  let hingeCount = 0;
  let rollerCount = 0;

  supports.forEach(supp => {
    if (supp.type === 'fixed') {
      restraintsCount += 3;
      fixedCount++;
    } else if (supp.type === 'hinge') {
      restraintsCount += 2;
      hingeCount++;
    } else if (supp.type === 'roller') {
      restraintsCount += 1;
      rollerCount++;
    }
  });

  // Calculate internal releases (hinged member ends add extra rotation sways)
  let rotationalReleasesCount = 0;
  members.forEach(member => {
    if (member.releases?.start) rotationalReleasesCount++;
    if (member.releases?.end) rotationalReleasesCount++;
  });

  // Total raw kinematic degrees of freedom: 3 * nodesCount
  // Restraints subtract degrees of freedom, releases add degrees of freedom (independent rotations)
  const dki = (3 * nodesCount) - restraintsCount + rotationalReleasesCount;

  // Estimate rotational vs. translational sway degrees
  const rotationalDegrees = nodesCount - fixedCount + rotationalReleasesCount;
  const swayDegrees = Math.max(0, dki - rotationalDegrees);

  const details: string[] = [
    `Total nodes: ${nodesCount} (yielding ${3 * nodesCount} initial degrees of freedom)`,
    `Support constraints: ${restraintsCount} restraints (${fixedCount} fixed, ${hingeCount} hinge, ${rollerCount} roller)`,
    `Rotational internal member releases: ${rotationalReleasesCount}`,
    `DKI = (3 * Nodes) - Restraints + Releases = ${dki}`
  ];

  return {
    stepId: `dki_calc_${Date.now()}`,
    type: 'DOI_KINEMATIC',
    highlightNodes: supports.map(s => s.nodeId),
    payload: {
      dki,
      nodesCount,
      restraintsCount,
      swayDegrees,
      rotationalDegrees,
      details
    }
  };
}
