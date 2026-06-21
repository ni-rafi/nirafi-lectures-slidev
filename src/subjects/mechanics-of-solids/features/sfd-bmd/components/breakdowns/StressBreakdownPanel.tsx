import React, { useState } from 'react';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { CrossSectionEngine } from '@/subjects/mechanics-of-solids/cores/stress/cross-section.engine';
import { StaticalMomentEngine } from '@/subjects/mechanics-of-solids/cores/stress/statical-moment.engine';
import { StressTransformationEngine } from '@/subjects/mechanics-of-solids/cores/stress/stress-transformation.engine';
import { MohrsCircleEngine } from '@/subjects/mechanics-of-solids/cores/stress/mohrs-circle.engine';
import { ICalculationStep } from '../../types/stepTypes';

import { StepRow } from './StepRow';
import { StepListHeader } from './StepListHeader';
import { Info } from 'lucide-react';

export const StressBreakdownPanel: React.FC = () => {
  const {
    length,
    hoverX,
    customInspectX,
    inspectY,
    inspectAngle,
    eiSegments,
  } = useBeamWorkspace();

  const { solverResult } = useBeamEngine();
  const [subTab, setSubTab] = useState<'bending' | 'shear' | 'transformation'>('bending');
  const [expandedDiagrams, setExpandedDiagrams] = useState<Record<string, boolean>>({});

  if (!solverResult.success || !solverResult.intervals) return null;

  const inspectX = hoverX !== null ? hoverX : (customInspectX !== null ? customInspectX : length / 2);
  const seg = eiSegments.find(s => inspectX >= s.startPosition - 1e-4 && inspectX <= s.endPosition + 1e-4) || eiSegments[0]!;
  const shape = seg.shape ?? { type: 'custom' };

  if (shape.type === 'custom') {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs text-amber-500 backdrop-blur-md flex gap-3">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[10px]">Stress Derivations Disabled</p>
          <p className="mt-1 text-muted-foreground text-[10px] leading-relaxed">
            Step-by-step mathematical calculations and stress element block/Mohr's circle plots are disabled for segments using **Custom (Manual I)** stiffness properties.
            Please define a standard rectangular, circular, or flanged section template in the Cross-Section Builder to enable full derivation details.
          </p>
        </div>
      </div>
    );
  }

  const getMAt = (x: number): number => {
    const interval = solverResult.intervals!.find(inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4);
    if (!interval) return 0;
    const [a, b, c, d] = interval.mCoeffs;
    return a * x * x * x + b * x * x + c * x + d;
  };

  const getVAt = (x: number): number => {
    const interval = solverResult.intervals!.find(inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4);
    if (!interval) return 0;
    const [a, b, c] = interval.vCoeffs;
    return a * x * x + b * x + c;
  };

  const M = getMAt(inspectX) * 1000;
  const V = getVAt(inspectX) * 1000;

  const props = CrossSectionEngine.calculateProperties(shape, seg.I * 1e-6);
  const H = shape.type === 'circular' ? (shape.diameter ?? 0.1) : (shape.height ?? 0.2);
  const ybar = props.centroid;
  const I = props.I;

  const yMinMm = -ybar * 1000;
  const yMaxMm = (H - ybar) * 1000;
  const clampedYMm = Math.max(yMinMm, Math.min(yMaxMm, inspectY));
  const inspectYM = clampedYMm / 1000;

  // Stresses at inspected coordinates
  const sigmaX = I > 1e-12 ? -(M * inspectYM) / I : 0;
  const sigmaY = 0;
  const { Q, t } = StaticalMomentEngine.calculateQAndWidth(shape, inspectYM, props);
  const tauXY = I > 1e-12 && t > 1e-6 ? (V * Q) / (I * t) : 0;
  const stressState = { sigmaX, sigmaY, tauXY };



  // Analytical steps generators
  const getBendingSteps = (): ICalculationStep[] => {
    const sigmaMPa = sigmaX / 1e6;
    return [
      {
        id: 'stress-bending-1',
        type: 'stress-bending-step',
        text: `### Bending Stress Derivation (Flexure Formula)\n\n- Inspected coordinate: $x = ${inspectX.toFixed(2)}\\text{ m}$, distance from neutral axis: $y = ${inspectYM.toFixed(4)}\\text{ m}$\n- Bending moment at $x$: $M = ${(M / 1e3).toFixed(3)}\\text{ kN}\\cdot\\text{m}$\n- Moment of Inertia: $I = ${(I * 1e6).toFixed(3)} \\times 10^{-6}\\text{ m}^4$, Centroid: $\\bar{y} = ${ybar.toFixed(3)}\\text{ m}$`,
      },
      {
        id: 'stress-bending-2',
        type: 'stress-bending-step',
        text: `#### Flexure Stress Formula:\n\n$$\\sigma = -\\frac{M \\cdot y}{I}$$`,
        latex: `\\sigma_x = -\\frac{${M.toFixed(1)} \\cdot ${inspectYM.toFixed(4)}}{${I.toExponential(4)}} = ${sigmaMPa.toFixed(3)}\\text{ MPa}`,
        highlightX: inspectX,
      }
    ];
  };

  const getShearSteps = (): ICalculationStep[] => {
    const tauMPa = tauXY / 1e6;
    return [
      {
        id: 'stress-shear-1',
        type: 'stress-shear-step',
        text: `### Shear Stress Derivation (Shear Formula)\n\n- Inspected coordinate: $x = ${inspectX.toFixed(2)}\\text{ m}$, height: $y = ${inspectYM.toFixed(4)}\\text{ m}$\n- Shear force at $x$: $V = ${(V / 1e3).toFixed(3)}\\text{ kN}$\n- First Moment of Area at $y$: $Q = ${(Q * 1e6).toFixed(3)} \\times 10^{-6}\\text{ m}^3$\n- Width of cross-section at $y$: $t(y) = ${(t * 1000).toFixed(1)}\\text{ mm}$`,
      },
      {
        id: 'stress-shear-2',
        type: 'stress-shear-step',
        text: `#### Shear Stress Formula:\n\n$$\\tau = \\frac{V \\cdot Q}{I \\cdot t}$$`,
        latex: `\\tau_{xy} = \\frac{${V.toFixed(1)} \\cdot ${Q.toExponential(4)}}{${I.toExponential(4)} \\cdot ${t.toFixed(4)}} = ${tauMPa.toFixed(3)}\\text{ MPa}`,
        highlightX: inspectX,
      }
    ];
  };

  const getTransformationSteps = (): ICalculationStep[] => {
    const principal = StressTransformationEngine.calculatePrincipal(stressState);
    const transformed = StressTransformationEngine.transform(stressState, inspectAngle);
    const circle = MohrsCircleEngine.solveCircle(stressState, inspectAngle);

    const radToDeg = (r: number) => (r * 180 / Math.PI).toFixed(1);
    const fmt = StressTransformationEngine.formatMPa;

    const avg = (sigmaX + sigmaY) / 2;
    const diff = (sigmaX - sigmaY) / 2;
    const R = Math.sqrt(diff * diff + tauXY * tauXY);

    return [
      {
        id: 'trans-intro',
        type: 'stress-trans-intro',
        text: `### Stress Transformation Analytical Steps`,
      },
      {
        id: 'trans-state',
        type: 'stress-trans-state',
        text: `#### Step 1: Identify the original stress state\n\nFrom the beam internal loading at the inspected point:\n- Normal stress in x-direction: $\\sigma_x = ${fmt(sigmaX)}\\text{ MPa}$\n- Normal stress in y-direction: $\\sigma_y = ${fmt(sigmaY)}\\text{ MPa}$\n- Shear stress in xy-plane: $\\tau_{xy} = ${fmt(tauXY)}\\text{ MPa}$`,
      },
      {
        id: 'trans-wedge-graphic',
        type: 'stress-wedge-graphic',
        text: `Original stress block state elements on inclined wedge plane.`,
        highlightX: inspectX,
        metadata: { theta: inspectAngle },
      },
      {
        id: 'trans-avg',
        type: 'stress-trans-avg',
        text: `#### Step 2: Calculate average and differential normal stresses\n- Average normal stress: $\\sigma_{\\text{avg}} = \\frac{\\sigma_x + \\sigma_y}{2} = ${fmt(avg)}\\text{ MPa}$\n- Differential normal stress: $\\sigma_{\\text{diff}} = \\frac{\\sigma_x - \\sigma_y}{2} = ${fmt(diff)}\\text{ MPa}$`,
      },
      {
        id: 'trans-principal',
        type: 'stress-trans-principal',
        text: `#### Step 3: Calculate principal stresses and max shear stress\n- Maximum shear stress (Mohr's radius): $R = \\tau_{\\text{max}} = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}$\n  $R = \\sqrt{${fmt(diff)}^2 + ${fmt(tauXY)}^2} = ${fmt(R)}\\text{ MPa}$\n- Maximum principal stress: $\\sigma_1 = \\sigma_{\\text{avg}} + R = ${fmt(avg)} + ${fmt(R)} = ${fmt(principal.sigma1)}\\text{ MPa}$\n- Minimum principal stress: $\\sigma_2 = \\sigma_{\\text{avg}} - R = ${fmt(avg)} - ${fmt(R)} = ${fmt(principal.sigma2)}\\text{ MPa}$`,
      },
      {
        id: 'trans-circle-radius',
        type: 'stress-circle-radius',
        text: `Radius $R$ triangle construction parameters on Mohr's Circle graph.`,
      },
      {
        id: 'trans-orientations',
        type: 'stress-trans-orientations',
        text: `#### Step 4: Calculate plane orientations\n- Principal plane angle: $\\theta_p = \\frac{1}{2} \\tan^{-1}\\left(\\frac{2\\tau_{xy}}{\\sigma_x - \\sigma_y}\\right) = ${radToDeg(principal.thetaP)}^\\circ$\n- Maximum shear plane angle: $\\theta_s = \\theta_p - 45^\\circ = ${radToDeg(principal.thetaS)}^\\circ$`,
      },
      {
        id: 'trans-principal-rotation',
        type: 'stress-principal-rotation',
        text: `Principal plane rotation orientation showing theta_p angle.`,
        metadata: { thetaP: principal.thetaP },
      },
      {
        id: 'trans-transformed-val',
        type: 'stress-trans-transformed-val',
        text: `#### Step 5: Transformed stresses at selected angle $\\theta = ${radToDeg(inspectAngle)}^\\circ$\n- Transformed normal stress $\\sigma_{x'} = \\sigma_{\\text{avg}} + \\sigma_{\\text{diff}}\\cos(2\\theta) + \\tau_{xy}\\sin(2\\theta) = ${fmt(transformed.sigmaX)}\\text{ MPa}$\n- Transformed normal stress $\\sigma_{y'} = \\sigma_{\\text{avg}} - \\sigma_{\\text{diff}}\\cos(2\\theta) - \\tau_{xy}\\sin(2\\theta) = ${fmt(transformed.sigmaY)}\\text{ MPa}$\n- Transformed shear stress $\\tau_{x'y'} = -\\sigma_{\\text{diff}}\\sin(2\\theta) + \\tau_{xy}\\cos(2\\theta) = ${fmt(transformed.tauXY)}\\text{ MPa}$`,
      },
      {
        id: 'trans-mohrs-intro',
        type: 'stress-mohrs-intro',
        text: `### Mohr's Circle Method Construction Steps\n\nMohr's Circle graphically represents 2D stress transformations as a circle in the $\\sigma$-$\\tau$ coordinate system:`,
      },
      {
        id: 'trans-mohrs-center',
        type: 'stress-mohrs-center',
        text: `#### Step 1: Locate the Center of the circle\nThe center $C$ is on the normal stress axis (horizontal) at the average stress:\n$C = \\left(\\sigma_{\\text{avg}}, 0\\right) = \\left(\\frac{\\sigma_x + \\sigma_y}{2}, 0\\right) = \\left(${fmt(circle.center)}, 0\\right)\\text{ MPa}$`,
      },
      {
        id: 'trans-mohrs-plot',
        type: 'stress-mohrs-plot',
        text: `#### Step 2: Plot reference points A and B\n- Reference point $A$ (represents the x-face stress state): $A(\\sigma_x, -\\tau_{xy}) = A(${fmt(sigmaX)}, ${fmt(-tauXY)})\\text{ MPa}$\n- Reference point $B$ (represents the y-face stress state): $B(\\sigma_y, \\tau_{xy}) = B(${fmt(sigmaY)}, ${fmt(tauXY)})\\text{ MPa}$`,
      },
      {
        id: 'trans-mohrs-radius',
        type: 'stress-mohrs-radius',
        text: `#### Step 3: Calculate the Radius (Max Shear Stress)\nThe radius $R$ is the distance from Center $C$ to point $A$:\n$R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} = ${fmt(circle.radius)}\\text{ MPa}$`,
      },
      {
        id: 'trans-mohrs-draw',
        type: 'stress-mohrs-draw',
        text: `#### Step 4: Draw the circle and identify principal stresses\nDrawing the circle centered at $C$ with radius $R$, the intersection points with the horizontal $\\sigma$-axis represent the principal stresses (where shear stress $\\tau = 0$):\n- Max principal stress: $\\sigma_1 = C + R = ${fmt(circle.center + circle.radius)}\\text{ MPa}$\n- Min principal stress: $\\sigma_2 = C - R = ${fmt(circle.center - circle.radius)}\\text{ MPa}$`,
      },
      {
        id: 'trans-mohrs-rotate',
        type: 'stress-mohrs-rotate',
        text: `#### Step 5: Rotate coordinates by $2\\theta = ${radToDeg(2 * inspectAngle)}^\\circ$\nIn Mohr's Circle, physical rotations of angle $\\theta$ correspond to double angle $2\\theta$ rotations in the opposite direction. Rotating the diameter line $AB$ about Center $C$ by $2\\theta = ${radToDeg(2 * inspectAngle)}^\\circ$ yields the new transformed coordinates:\n- Point $A'(\\sigma_{x'}, -\\tau_{x'y'}) = A'(${fmt(transformed.sigmaX)}, ${fmt(-transformed.tauXY)})\\text{ MPa}$\n- Point $B'(\\sigma_{y'}, \\tau_{x'y'}) = B'(${fmt(transformed.sigmaY)}, ${fmt(transformed.tauXY)})\\text{ MPa}$`,
      }
    ];
  };

  const steps = subTab === 'bending' ? getBendingSteps() : subTab === 'shear' ? getShearSteps() : getTransformationSteps();

  return (
    <div className="flex flex-col gap-4">
      {/* Coordinates inspector inputs */}
      {/* Sub-tab selectors */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3 gap-3">
        <span className="text-xs font-semibold text-muted-foreground">Select Derivation Tab</span>
        <div className="flex gap-1 rounded bg-muted/30 p-0.5 border border-border/20">
          {(['bending', 'shear', 'transformation'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSubTab(t)}
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${subTab === t ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main steps list */}
      <div className="flex flex-col gap-2.5">
        <StepListHeader
          title={`${subTab.toUpperCase()} Stress derivation details`}
          steps={steps}
          tab="stress"
          expandedDiagrams={expandedDiagrams}
          setExpandedDiagrams={setExpandedDiagrams}
        />
        <div className="flex flex-col gap-2.5">
          {steps.map((step, idx) => (
            <StepRow
              key={idx}
              step={step}
              tab="stress"
              isExpanded={!!expandedDiagrams[`stress-${idx}`]}
              onToggle={() =>
                setExpandedDiagrams(prev => ({
                  ...prev,
                  [`stress-${idx}`]: !prev[`stress-${idx}`],
                }))
              }
            />
          ))}
        </div>
      </div>

    </div>
  );
};
