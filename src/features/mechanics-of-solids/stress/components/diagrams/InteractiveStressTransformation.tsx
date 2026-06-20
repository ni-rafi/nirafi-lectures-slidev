import React from 'react';
import { useBeamWorkspace } from '../../../sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../sfd-bmd/hooks/useBeamEngine';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';
import { StaticalMomentEngine } from '@/cores/mechanics-of-solids/stress/statical-moment.engine';
import { StressTransformationEngine } from '@/cores/mechanics-of-solids/stress/stress-transformation.engine';
import { TransformationSliders } from './TransformationSliders';
import { StressElementBlock } from './StressElementBlock';
import { MohrsCircleChart } from './MohrsCircleChart';

export const InteractiveStressTransformation: React.FC = () => {
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

  if (!solverResult.success || !solverResult.intervals) return null;

  const inspectX = hoverX !== null ? hoverX : (customInspectX !== null ? customInspectX : length / 2);
  const seg = eiSegments.find(s => inspectX >= s.startPosition - 1e-4 && inspectX <= s.endPosition + 1e-4) || eiSegments[0]!;
  const shape = seg.shape ?? { type: 'custom' };

  if (shape.type === 'custom') return null;

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

  return (
    <div className="rounded-xl border border-border bg-card/40 p-5 backdrop-blur-md flex flex-col gap-6">
      {/* Row 1: Header and Snap Controls */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Interactive 2D Stress Transformation</span>
          <p className="text-[10px] text-muted-foreground">Snap to critical planes or use the sliders below to transform stresses</p>
        </div>
        
        {/* Snap Controls */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/75">Snap to Plane:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInspectAngle(0)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                Math.round((inspectAngle * 180) / Math.PI) === 0
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-background hover:bg-muted hover:text-foreground'
              }`}
            >
              Original (0°)
            </button>
            <button
              onClick={() => setInspectAngle(principal.thetaP)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                Math.round((inspectAngle * 180) / Math.PI) === thetaPDeg
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 shadow-sm'
                  : 'border-border bg-background hover:bg-emerald-50/10 hover:text-emerald-500'
              }`}
            >
              Principal Plane (θp = {thetaPDeg}°)
            </button>
            <button
              onClick={() => setInspectAngle(principal.thetaS)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                Math.round((inspectAngle * 180) / Math.PI) === thetaSDeg
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600 shadow-sm'
                  : 'border-border bg-background hover:bg-amber-50/10 hover:text-amber-500'
              }`}
            >
              Max Shear Plane (θs = {thetaSDeg}°)
            </button>
            <button
              onClick={() => setInspectAngle((45 * Math.PI) / 180)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-all ${
                Math.round((inspectAngle * 180) / Math.PI) === 45
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-background hover:bg-muted hover:text-foreground'
              }`}
            >
              45° Plane
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Sliders Area */}
      <div className="w-full border-t border-border/40 pt-4">
        <TransformationSliders
          length={length}
          inspectX={inspectX}
          setInspectX={setCustomInspectX}
          yMinMm={yMinMm}
          yMaxMm={yMaxMm}
          clampedYMm={clampedYMm}
          setInspectY={setInspectY}
          inspectAngle={inspectAngle}
          setInspectAngle={setInspectAngle}
        />
      </div>

      <div className="w-full border-t border-border/40" />

      {/* Row 3: Graphics Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch justify-center">
        <div className="flex flex-col gap-2 items-center bg-muted/5 border border-border/30 rounded-2xl p-5 shadow-sm">
          <span className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">Rotated Element Block</span>
          <StressElementBlock state={stressState} thetaRad={inspectAngle} />
        </div>
        <div className="flex flex-col gap-2 items-center bg-muted/5 border border-border/30 rounded-2xl p-5 shadow-sm">
          <span className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase">Mohr's Stress Circle</span>
          <MohrsCircleChart state={stressState} thetaRad={inspectAngle} />
        </div>
      </div>
    </div>
  );
};
