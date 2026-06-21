import { ICalculationStep } from '../types/stepTypes';
import { IMomentAreaDetails } from '@/subjects/mechanics-of-solids/cores/deflection/types';

export function generateMomentAreaStepsUI(momentArea: IMomentAreaDetails): ICalculationStep[] {
  const steps: ICalculationStep[] = [];

  steps.push({
    id: 'ma-intro',
    type: 'ma-intro',
    text: `### Moment-Area Calculation Steps\n\nMohr's theorems are applied using the geometric area and centroid of the $M/EI$ curve:\n\n- **Theorem I (Slope change):** $\\theta_B - \\theta_A = \\text{Area under } \\frac{M}{EI} \\text{ curve}$\n- **Theorem II (Tangential deviation):** $t_{B/A} = \\text{Area} \\times \\bar{x}_B$, where $\\bar{x}_B$ is measured from $B$.`,
  });

  steps.push({
    id: 'ma-seg-header',
    type: 'ma-header',
    text: `#### Step 1: Segmentation of the beam stiffness`,
  });

  momentArea.segments.forEach((seg, idx) => {
    if (!seg) return;
    const startX = seg.startX ?? 0;
    const endX = seg.endX ?? 0;
    const area = seg.area ?? 0;
    const centroidX = seg.centroidX ?? 0;
    steps.push({
      id: `ma-seg-${idx}`,
      type: 'ma-segment',
      text: `- **Segment ${idx + 1} ($x \\in [${startX.toFixed(2)}, ${endX.toFixed(2)}]$)**:\n  - Area under $M/EI = ${area.toFixed(5)}\\text{ rad}$\n  - Centroid $\\bar{x} = ${centroidX.toFixed(3)}\\text{ m}$`,
      highlightX: centroidX,
    });
  });

  steps.push({
    id: 'ma-ref-header',
    type: 'ma-header',
    text: `#### Step 2: Establish the reference tangent`,
  });

  const xA = momentArea.referencePoint ?? 0;
  const xB = momentArea.referencePointB;

  if (momentArea.isCantilever) {
    steps.push({
      id: 'ma-ref-tangent',
      type: 'ma-reference-tangent',
      text: `Fixed support at $A = ${xA.toFixed(2)}\\text{ m}$ selected as the reference point.\n\nSince support $A$ is fixed, the tangent line is horizontal:\n\n$$\\theta_A = 0\\text{ rad}$$`,
      highlightX: xA,
    });
  } else if (xB !== undefined && momentArea.tBA !== undefined && momentArea.thetaA !== undefined) {
    const xBVal = xB ?? 0;
    const tBAVal = momentArea.tBA ?? 0;
    const thetaAVal = momentArea.thetaA ?? 0;
    steps.push({
      id: 'ma-ref-tangent',
      type: 'ma-reference-tangent',
      text: `Reference supports chosen at $A = ${xA.toFixed(2)}\\text{ m}$ and $B = ${xBVal.toFixed(2)}\\text{ m}$.\n\nTangential deviation of $B$ relative to $A$ ($t_{B/A}$):\n\n$$t_{B/A} = \\int_{${xA.toFixed(2)}}^{${xBVal.toFixed(2)}} \\frac{M(x)}{EI} (${xBVal.toFixed(2)} - x) dx = ${tBAVal.toFixed(6)}\\text{ m}$$\n\nInitial slope of the tangent at $A$ ($\\theta_A$):\n\n$$\\theta_A = -\\frac{t_{B/A}}{x_B - x_A} = -\\frac{${tBAVal.toFixed(6)}}{${(xBVal - xA).toFixed(2)}} = ${thetaAVal.toFixed(6)}\\text{ rad}$$`,
      highlightX: xA,
    });
  }

  steps.push({
    id: 'ma-eval-header',
    type: 'ma-header',
    text: `#### Step 3: Evaluate deflection at points\n\nFor any coordinate $x$, the deflection is calculated using:\n\n$$v(x) = \\theta_A (x - x_A) + t_{x/A}$$\n\nwhere $t_{x/A} = \\int_{x_A}^{x} \\frac{M(u)}{EI} (x - u) du$.`,
  });

  return steps;
}
