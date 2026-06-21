import { ICalculationStep } from '../types/stepTypes';
import { IIntervalEquation } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';

export function generateSectionStepsUI(intervals: IIntervalEquation[]): ICalculationStep[] {
  const steps: ICalculationStep[] = [];

  steps.push({
    id: 'section-intro',
    type: 'section-intro',
    text: `### Section Method Calculation Steps\n\nThe Section Method cuts the beam into segments and applies local equations of equilibrium.`,
  });

  intervals.forEach((inv, idx) => {
    if (!inv) return;
    const startX = inv.startX ?? 0;
    const endX = inv.endX ?? 0;
    steps.push({
      id: `section-interval-${idx}`,
      type: 'section-interval',
      text: `#### Interval ${idx + 1}: $x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]\\text{ m}$\n\n- **Shear Force Equation:**\n  $$${inv.latexV || '0'}$$\\n- **Bending Moment Equation:**\n  $$${inv.latexM || '0'}$$`,
      highlightX: (startX + endX) / 2,
      metadata: { startX, endX },
    });
  });

  return steps;
}
