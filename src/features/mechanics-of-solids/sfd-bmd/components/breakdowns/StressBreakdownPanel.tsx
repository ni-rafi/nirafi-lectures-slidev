import React, { useState } from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';
import { StaticalMomentEngine } from '@/cores/mechanics-of-solids/stress/statical-moment.engine';
import { StressTransformationEngine } from '@/cores/mechanics-of-solids/stress/stress-transformation.engine';
import { MohrsCircleEngine } from '@/cores/mechanics-of-solids/stress/mohrs-circle.engine';

import { StepRow } from './StepRow';
import { StepListHeader } from './StepListHeader';
import { Info } from 'lucide-react';

export const StressBreakdownPanel: React.FC = () => {
  const {
    length,
    hoverX,
    customInspectX,
    setCustomInspectX,
    inspectY,
    setInspectY,
    inspectAngle,
    setInspectAngle,
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

  // Calculate critical angles for snapping presets
  const principal = StressTransformationEngine.calculatePrincipal(stressState);
  const thetaPDeg = Math.round((principal.thetaP * 180) / Math.PI);
  const thetaSDeg = Math.round((principal.thetaS * 180) / Math.PI);

  // Analytical steps generators
  const getBendingSteps = () => {
    const sigmaMPa = sigmaX / 1e6;
    return [
      `### Bending Stress Derivation (Flexure Formula)`,
      `- Inspected coordinate: $x = ${inspectX.toFixed(2)}\\text{ m}$, distance from neutral axis: $y = ${inspectYM.toFixed(4)}\\text{ m}$`,
      `- Bending moment at $x$: $M = ${(M / 1e3).toFixed(3)}\\text{ kN}\\cdot\\text{m}$`,
      `- Moment of Inertia: $I = ${(I * 1e6).toFixed(3)} \\times 10^{-6}\\text{ m}^4$, Centroid: $\\bar{y} = ${ybar.toFixed(3)}\\text{ m}$`,
      `#### Flexure Stress Formula:`,
      `$$\\sigma = -\\frac{M \\cdot y}{I}$$`,
      `- Resulting normal stress: $\\sigma_x = -\\frac{${M.toFixed(1)} \\cdot ${inspectYM.toFixed(4)}}{${I.toExponential(4)}} = ${sigmaMPa.toFixed(3)}\\text{ MPa}$`
    ];
  };

  const getShearSteps = () => {
    const tauMPa = tauXY / 1e6;
    return [
      `### Shear Stress Derivation (Shear Formula)`,
      `- Inspected coordinate: $x = ${inspectX.toFixed(2)}\\text{ m}$, height: $y = ${inspectYM.toFixed(4)}\\text{ m}$`,
      `- Shear force at $x$: $V = ${(V / 1e3).toFixed(3)}\\text{ kN}$`,
      `- First Moment of Area at $y$: $Q = ${(Q * 1e6).toFixed(3)} \\times 10^{-6}\\text{ m}^3$`,
      `- Width of cross-section at $y$: $t(y) = ${(t * 1000).toFixed(1)}\\text{ mm}$`,
      `#### Shear Stress Formula:`,
      `$$\\tau = \\frac{V \\cdot Q}{I \\cdot t}$$`,
      `- Resulting shear stress: $\\tau_{xy} = \\frac{${V.toFixed(1)} \\cdot ${Q.toExponential(4)}}{${I.toExponential(4)} \\cdot ${t.toFixed(4)}} = ${tauMPa.toFixed(3)}\\text{ MPa}$`
    ];
  };

  const getTransformationSteps = () => {
    const steps = [
      ...StressTransformationEngine.generateSteps(stressState, inspectAngle),
      ...MohrsCircleEngine.solveCircle(stressState, inspectAngle).steps
    ];
    // Add dummy tags to trigger wedge/rotation/mohr-radius graphics in StepDiagramRenderer
    steps.splice(2, 0, `Original stress block state elements on inclined wedge plane.`);
    steps.splice(6, 0, `Radius $R$ triangle construction parameters on Mohr's Circle graph.`);
    steps.splice(10, 0, `Principal plane rotation orientation showing theta_p angle.`);
    return steps;
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
              className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition-all ${
                subTab === t ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
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
