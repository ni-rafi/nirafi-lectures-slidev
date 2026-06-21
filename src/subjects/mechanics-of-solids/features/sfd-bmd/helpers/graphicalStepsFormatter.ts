import { ICalculationStep } from '../types/stepTypes';
import { IGraphicalStepData } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';

export function generateGraphicalStepsUI(graphicalStepsData: IGraphicalStepData[]): ICalculationStep[] {
  const steps: ICalculationStep[] = [];

  steps.push({
    id: 'graph-intro',
    type: 'graph-intro',
    text: `### Graphical Method Calculation Steps\n\nThe Graphical Method utilizes the integral relationships between Load, Shear Force, and Bending Moment:\n\n- **Shear Force:** $V(x_2) = V(x_1) - \\int_{x_1}^{x_2} w(x) \\, dx$ (Shear changes by the negative area of the load diagram).\n- **Bending Moment:** $M(x_2) = M(x_1) + \\int_{x_1}^{x_2} V(x) \\, dx$ (Moment changes by the area under the Shear Force Diagram).`,
  });

  steps.push({
    id: 'graph-sfd-header',
    type: 'graph-header',
    text: `\n#### 1. Shear Force Diagram (SFD) Steps`,
  });

  // Split into SFD and BMD steps
  const sfdSteps = graphicalStepsData.filter(s => s.type.startsWith('sfd'));
  const bmdSteps = graphicalStepsData.filter(s => s.type.startsWith('bmd'));

  sfdSteps.forEach((step, idx) => {
    if (step.type === 'sfd-start') {
      steps.push({
        id: `graph-sfd-start`,
        type: 'graphical-sfd-step',
        text: `- **Start ($x = 0$):** $V(0^-) = 0$`,
        highlightX: 0,
      });
    } else if (step.type === 'sfd-segment') {
      const startX = step.startX ?? 0;
      const endX = step.endX ?? 0;
      const loadArea = step.loadArea ?? 0;
      const vStart = step.vStart ?? 0;
      const vEnd = step.vEnd ?? 0;
      if (loadArea !== 0) {
        steps.push({
          id: `graph-sfd-seg-${idx}`,
          type: 'graphical-sfd-step',
          text: `- **Segment $x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]$:** UDL/UVL Load Area = $${loadArea.toFixed(2)}\\text{ kN}$.`,
          latex: `V(${endX.toFixed(2)}^-) = V(${startX.toFixed(2)}^+) - \\text{Load Area} = ${vStart.toFixed(2)} - ${loadArea.toFixed(2)} = ${vEnd.toFixed(2)}\\text{ kN}`,
          highlightX: (startX + endX) / 2,
          metadata: { startX, endX },
        });
      } else {
        steps.push({
          id: `graph-sfd-seg-${idx}`,
          type: 'graphical-sfd-step',
          text: `- **Segment $x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]$:** No distributed load. $V(${endX.toFixed(2)}^-) = V(${startX.toFixed(2)}^+) = ${vStart.toFixed(2)}\\text{ kN}$.`,
          highlightX: (startX + endX) / 2,
          metadata: { startX, endX },
        });
      }
    } else if (step.type === 'sfd-jump') {
      const posX = step.x ?? 0;
      const vStart = step.vStart ?? 0;
      const jump = step.jump ?? 0;
      const vEnd = step.vEnd ?? 0;
      steps.push({
        id: `graph-sfd-jump-${idx}`,
        type: 'graphical-sfd-step',
        text: `- **At $x = ${posX.toFixed(2)}\\text{ m}$:** Concentrated force jump: ${step.description || ''}.`,
        latex: `V(${posX.toFixed(2)}^+) = V(${posX.toFixed(2)}^-) + \\Delta V = ${vStart.toFixed(2)} + (${jump.toFixed(2)}) = ${vEnd.toFixed(2)}\\text{ kN}`,
        highlightX: posX,
      });
    }
  });

  steps.push({
    id: 'graph-bmd-header',
    type: 'graph-header',
    text: `\n#### 2. Bending Moment Diagram (BMD) Steps`,
  });

  bmdSteps.forEach((step, idx) => {
    if (step.type === 'bmd-start') {
      steps.push({
        id: `graph-bmd-start`,
        type: 'graphical-bmd-step',
        text: `- **Start ($x = 0$):** $M(0^-) = 0$`,
        highlightX: 0,
      });
    } else if (step.type === 'bmd-segment') {
      const startX = step.startX ?? 0;
      const endX = step.endX ?? 0;
      const shearArea = step.shearArea ?? 0;
      const mStart = step.mStart ?? 0;
      const mEnd = step.mEnd ?? 0;
      steps.push({
        id: `graph-bmd-seg-${idx}`,
        type: 'graphical-bmd-step',
        text: `- **Segment $x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]$:** Shear diagram area = $${shearArea.toFixed(2)}\\text{ kNm}$.`,
        latex: `M(${endX.toFixed(2)}^-) = M(${startX.toFixed(2)}^+) + \\text{Shear Area} = ${mStart.toFixed(2)} + (${shearArea.toFixed(2)}) = ${mEnd.toFixed(2)}\\text{ kNm}`,
        highlightX: (startX + endX) / 2,
        metadata: { startX, endX },
      });
    } else if (step.type === 'bmd-jump') {
      const posX = step.x ?? 0;
      const mStart = step.mStart ?? 0;
      const jump = step.jump ?? 0;
      const mEnd = step.mEnd ?? 0;
      steps.push({
        id: `graph-bmd-jump-${idx}`,
        type: 'graphical-bmd-step',
        text: `- **At $x = ${posX.toFixed(2)}\\text{ m}$:** Concentrated moment jump: ${step.description || ''}.`,
        latex: `M(${posX.toFixed(2)}^+) = M(${posX.toFixed(2)}^-) + \\Delta M = ${mStart.toFixed(2)} + (${jump.toFixed(2)}) = ${mEnd.toFixed(2)}\\text{ kNm}`,
        highlightX: posX,
      });
    }
  });

  return steps;
}
