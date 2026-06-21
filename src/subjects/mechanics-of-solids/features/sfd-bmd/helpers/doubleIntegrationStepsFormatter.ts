import { ICalculationStep } from '../types/stepTypes';
import { IDoubleIntegrationDetails } from '@/subjects/mechanics-of-solids/cores/deflection/types';

export function generateDoubleIntegrationStepsUI(doubleIntegration: IDoubleIntegrationDetails): ICalculationStep[] {
  const steps: ICalculationStep[] = [];
  const numSegs = doubleIntegration.intervals.length;
  const numEq = doubleIntegration.boundaryConditions.length;

  steps.push({
    id: 'di-intro',
    type: 'di-intro',
    text: `### Double Integration Calculation Steps\n\nThe Double Integration Method solves the differential equation:\n\n$$EI \\frac{d^2v}{dx^2} = M(x)$$\n\nIntegrating once gives the slope $\\theta(x)$, and twice gives the deflection $v(x)$:\n\n$$EI \\theta(x) = \\int M(x) dx + C_1$$\n\n$$EI v(x) = \\iint M(x) dx + C_1 x + C_2$$`,
  });

  steps.push({
    id: 'di-seg-header',
    type: 'di-header',
    text: `#### Step 1: Segmentation of the beam`,
  });

  doubleIntegration.intervals.forEach((inv, idx) => {
    if (!inv) return;
    const startX = inv.startX ?? 0;
    const endX = inv.endX ?? 0;
    const EI = inv.EI ?? 0;
    steps.push({
      id: `di-seg-${idx}`,
      type: 'di-segmentation',
      text: `- **Segment ${idx + 1}** ($x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]\\text{ m}$): $EI = ${EI.toFixed(1)}\\text{ kN}\\cdot\\text{m}^2$ (based on segment stiffness).`,
      highlightX: (startX + endX) / 2,
    });
  });

  steps.push({
    id: 'di-eq-header',
    type: 'di-header',
    text: `#### Step 2: Formulate integration equations`,
  });

  doubleIntegration.intervals.forEach((inv, idx) => {
    if (!inv) return;
    const startX = inv.startX ?? 0;
    const endX = inv.endX ?? 0;
    const EI = inv.EI ?? 0;
    const C1 = inv.C1 ?? 0;
    const C2 = inv.C2 ?? 0;
    steps.push({
      id: `di-eq-${idx}`,
      type: 'di-equations',
      text: `- **Segment ${idx + 1}** ($x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]\\text{ m}$):\n  - Bending Moment: $M(x) = ${inv.latexM ?? '0'}$\n  - Slope: $EI_{${idx + 1}} \\theta_{${idx + 1}}(x) = F_{\\theta, ${idx + 1}}(x) + C_{1, ${idx + 1}}$\n  - Deflection: $EI_{${idx + 1}} v_{${idx + 1}}(x) = F_{v, ${idx + 1}}(x) + C_{1, ${idx + 1}}x + C_{2, ${idx + 1}}$`,
      latex: `v_{${idx + 1}}(x) = \\frac{1}{${EI.toFixed(1)}} \\left( \\iint M(x) dx + (${C1.toFixed(3)})x + (${C2.toFixed(3)}) \\right)`,
      highlightX: (startX + endX) / 2,
    });
  });

  steps.push({
    id: 'di-bc-header',
    type: 'di-header',
    text: `#### Step 3: Set up boundary and continuity conditions\n\nWe have $${numEq}$ unknowns constants $C_{1,i}, C_{2,i}$ ($i = 1 \\dots ${numSegs}$) solved by:`,
  });

  doubleIntegration.boundaryConditions.forEach((bc, idx) => {
    if (!bc) return;
    const posVal = bc.position ?? 0;
    const pos = posVal.toFixed(2);
    const k = (bc.segmentIndex1 ?? 0) + 1;
    const k2 = (bc.segmentIndex2 ?? 0) + 1;
    let bcText = '';

    if (bc.type === 'deflection-support') {
      bcText = `Deflection at support ${bc.supportType ?? ''} at $x = ${pos}\\text{ m}$: $v_{${k}}(${pos}) = 0$`;
    } else if (bc.type === 'slope-fixed') {
      bcText = `Slope at fixed support at $x = ${pos}\\text{ m}$: $\\theta_{${k}}(${pos}) = 0$`;
    } else if (bc.type === 'deflection-continuity') {
      bcText = `Deflection continuity at $x = ${pos}\\text{ m}$: $v_{${k}}(${pos}) = v_{${k2}}(${pos})$`;
    } else if (bc.type === 'slope-continuity') {
      bcText = `Slope continuity at $x = ${pos}\\text{ m}$: $\\theta_{${k}}(${pos}) = \\theta_{${k2}}(${pos})$`;
    } else if (bc.type === 'hinge-discontinuity') {
      bcText = `Internal Hinge at $x = ${pos}\\text{ m}$: allows slope discontinuity $\\theta_{${k}} \\neq \\theta_{${k2}}$`;
    }

    steps.push({
      id: `di-bc-${idx}`,
      type: 'di-boundary-condition',
      text: `- ${bcText}`,
      highlightX: posVal,
    });
  });

  steps.push({
    id: 'di-constants-header',
    type: 'di-header',
    text: `#### Step 4: Solved constants of integration`,
  });

  let constantsText = `Based on the boundary and continuity equations, the integration constants are:`;
  doubleIntegration.solvedConstants.forEach((c) => {
    if (!c) return;
    const val = c.value ?? 0;
    constantsText += `\n- $${c.name ?? 'C'} = ${val.toFixed(4)}$`;
  });

  steps.push({
    id: 'di-constants-solved',
    type: 'di-solved-constants',
    text: constantsText,
  });

  return steps;
}
