import { IBeam, IReaction } from './types';
import { solveLinearSystem } from './utils/linearSystemSolver';
import { getLoadForceAndMoment, getLoadsLeftOf } from './utils/loadCalculator';

export { solveLinearSystem } from './utils/linearSystemSolver';
export { getLoadForceAndMoment, getLoadsLeftOf } from './utils/loadCalculator';

export function solveReactions(beam: IBeam): { reactions: IReaction[]; steps: string[]; success: boolean } {
  const steps: string[] = [];
  const reactions: IReaction[] = [];

  // Identify vertical & moment reactions
  interface IReactionVariable {
    supportId: string;
    type: 'R_y' | 'M';
    x: number;
    label: string;
  }

  const vars: IReactionVariable[] = [];
  const sortedSupports = [...beam.supports].sort((a, b) => a.position - b.position);
  const supportIdToLetter = new Map<string, string>();
  sortedSupports.forEach((s, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C...
    supportIdToLetter.set(s.id, letter);
  });

  sortedSupports.forEach((s) => {
    const letter = supportIdToLetter.get(s.id)!;
    if (s.type === 'roller' || s.type === 'hinge') {
      vars.push({ supportId: s.id, type: 'R_y', x: s.position, label: `R_{y${letter}}` });
    } else if (s.type === 'fixed') {
      vars.push({ supportId: s.id, type: 'R_y', x: s.position, label: `R_{y${letter}}` });
      vars.push({ supportId: s.id, type: 'M', x: s.position, label: `M_{${letter}}` });
    }
  });

  // Number of equations = number of variables (which is 2 + c for determinate stable beams)
  const n = vars.length;
  if (n === 0) {
    return { reactions: [], steps: ['No supports to solve.'], success: false };
  }

  const A: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const B: number[] = new Array(n).fill(0);

  // 1. Vertical force equation: sum(R_y) = sum(Load_y)
  steps.push(`**Step 1: Vertical Equilibrium Equation ($\\sum F_y = 0$)**`);
  let eqFyStr = '';
  vars.forEach((v, idx) => {
    if (v.type === 'R_y') {
      A[0]![idx] = 1;
      eqFyStr += `${eqFyStr ? ' + ' : ''}${v.label}`;
    }
  });

  let totalDownwardForce = 0;
  beam.loads.forEach(load => {
    const res = getLoadForceAndMoment(load, 0);
    totalDownwardForce += res.force;
  });
  B[0] = totalDownwardForce;
  steps.push(`$$${eqFyStr} = ${totalDownwardForce.toFixed(3)}\\text{ kN}$$`);

  // 2. Moment equilibrium about x=0
  steps.push(`**Step 2: Moment Equilibrium Equation about $x=0$ ($\\sum M_{x=0} = 0$)**`);
  let eqMStr = '';
  vars.forEach((v, idx) => {
    if (v.type === 'R_y') {
      A[1]![idx] = v.x;
      eqMStr += `${eqMStr ? ' + ' : ''}${v.label}(${v.x})`;
    } else if (v.type === 'M') {
      A[1]![idx] = -1;
      eqMStr += `${eqMStr ? ' - ' : ''}${v.label}`;
    }
  });

  let totalMomentsAboutZero = 0;
  beam.loads.forEach(load => {
    const res = getLoadForceAndMoment(load, 0);
    totalMomentsAboutZero += res.moment;
  });
  B[1] = totalMomentsAboutZero;
  steps.push(`$$${eqMStr} = ${totalMomentsAboutZero.toFixed(3)}\\text{ kNm}$$`);

  // 3. Equations of condition from internal releases
  let eqIdx = 2;
  beam.releases.forEach(rel => {
    if (rel.type === 'hinge' || rel.type === 'roller') {
      // Hinge adds: M_left = 0
      steps.push(`**Step ${eqIdx + 1}: Equation of condition from Hinge at $x = ${rel.position}\\text{ m}$ ($\\sum M_{\\text{left}, x_h} = 0$)**`);
      let hMStr = '';
      vars.forEach((v, vIdx) => {
        if (v.x < rel.position) {
          if (v.type === 'R_y') {
            A[eqIdx]![vIdx] = rel.position - v.x;
            hMStr += `${hMStr ? ' + ' : ''}${v.label}(${(rel.position - v.x).toFixed(2)})`;
          } else if (v.type === 'M') {
            A[eqIdx]![vIdx] = -1;
            hMStr += `${hMStr ? ' - ' : ''}${v.label}`;
          }
        }
      });
      const loadsLeft = getLoadsLeftOf(beam, rel.position);
      B[eqIdx] = -loadsLeft.moment;
      steps.push(`$$${hMStr || '0'} = ${(-loadsLeft.moment).toFixed(3)}\\text{ kNm}$$`);
      eqIdx++;
    }

    if (rel.type === 'roller') {
      // Roller also adds: V_left = 0
      steps.push(`**Step ${eqIdx + 1}: Equation of condition from Roller at $x = ${rel.position}\\text{ m}$ ($\\sum V_{\\text{left}, x_h} = 0$)**`);
      let hVStr = '';
      vars.forEach((v, vIdx) => {
        if (v.x < rel.position && v.type === 'R_y') {
          A[eqIdx]![vIdx] = 1;
          hVStr += `${hVStr ? ' + ' : ''}${v.label}`;
        }
      });
      const loadsLeft = getLoadsLeftOf(beam, rel.position);
      B[eqIdx] = loadsLeft.force;
      steps.push(`$$${hVStr || '0'} = ${loadsLeft.force.toFixed(3)}\\text{ kN}$$`);
      eqIdx++;
    }
  });

  // Solve the system of equations
  const solution = solveLinearSystem(A, B);
  if (!solution) {
    return { reactions: [], steps: [...steps, 'Error: Support system is unstable or statically redundant.'], success: false };
  }

  steps.push(`**Step ${eqIdx + 1}: Solved Support Reactions**`);
  vars.forEach((v, idx) => {
    const val = parseFloat(solution[idx]!.toFixed(3));
    reactions.push({
      supportId: v.supportId,
      type: v.type === 'R_y' ? 'R_y' : 'M',
      value: val,
    });
    steps.push(`- $${v.label} = ${val.toFixed(3)}\\text{ ${v.type === 'R_y' ? 'kN' : 'kNm'}}$`);
  });

  // Add horizontal reaction as 0
  beam.supports.forEach(s => {
    if (s.type === 'hinge' || s.type === 'fixed') {
      reactions.push({ supportId: s.id, type: 'R_x', value: 0 });
    }
  });

  return { reactions, steps, success: true };
}
