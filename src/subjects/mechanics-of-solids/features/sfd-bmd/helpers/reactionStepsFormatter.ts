import { ICalculationStep } from '../types/stepTypes';
import { IReactionEquationDetails } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { formatNumber } from './numberFormatter';

export function generateReactionStepsUI(reactionEquations: IReactionEquationDetails): ICalculationStep[] {
  const steps: ICalculationStep[] = [];

  reactionEquations.equations.forEach((eq, eqIdx) => {
    let eqText = '';
    const rhsVal = eq.rhsValue;

    if (eq.loadsDetailSteps && eq.loadsDetailSteps !== eq.loadsDetailTerms && eq.loadsDetailTerms !== '0') {
      eqText = eq.type.includes('moment') || eq.type === 'hinge-moment'
        ? ` = -[${eq.loadsDetailTerms}] = -[${eq.loadsDetailSteps}] = ${formatNumber(rhsVal)}\\text{ kNm}`
        : ` = ${eq.loadsDetailTerms} = ${eq.loadsDetailSteps} = ${formatNumber(rhsVal)}\\text{ kN}`;
    } else if (eq.loadsDetailTerms !== '0') {
      eqText = eq.type.includes('moment') || eq.type === 'hinge-moment'
        ? ` = -[${eq.loadsDetailTerms}] = ${formatNumber(rhsVal)}\\text{ kNm}`
        : ` = ${eq.loadsDetailTerms} = ${formatNumber(rhsVal)}\\text{ kN}`;
    } else {
      eqText = eq.type.includes('moment') || eq.type === 'hinge-moment'
        ? ` = ${formatNumber(rhsVal)}\\text{ kNm}`
        : ` = ${formatNumber(rhsVal)}\\text{ kN}`;
    }

    steps.push({
      id: `reaction-equation-${eqIdx}`,
      type: 'reaction-equation',
      text: eq.title,
      latex: `${eq.hMStr}${eqText}`,
      highlightX: eq.position,
    });
  });

  // Solved values step
  let solvedText = `**Solved Support Reactions**\n\nBased on the system of equilibrium equations, the solved support reactions are:`;
  reactionEquations.solvedValues.forEach((val) => {
    const isMoment = val.name.startsWith('M');
    solvedText += `\n- $${val.name} = ${formatNumber(val.value)}\\text{ ${isMoment ? 'kNm' : 'kN'}}$`;
  });

  steps.push({
    id: 'reaction-solved-summary',
    type: 'reaction-summary',
    text: solvedText,
  });

  return steps;
}
