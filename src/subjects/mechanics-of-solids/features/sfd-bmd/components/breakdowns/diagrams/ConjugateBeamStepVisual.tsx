import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../hooks/useBeamEngine';
import { MiniBeamVisual } from './MiniBeamVisual';
import { ISupport, IInternalRelease } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IConjugateReaction } from '@/subjects/mechanics-of-solids/cores/deflection/types';

import { ICalculationStep } from '../../../types/stepTypes';

interface ConjugateBeamStepVisualProps {
  step: ICalculationStep;
}

export const ConjugateBeamStepVisual: React.FC<ConjugateBeamStepVisualProps> = ({ step }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  const { solverResult, deflectionResult } = useBeamEngine();
  const conjugateBeam = deflectionResult.conjugateBeam;

  if (!beamCtx || !conjugateBeam) return null;

  const { length, supports, releases } = beamCtx;

  const isTransformStep = step.type === 'cb-transformation';
  const isReactionStep = step.type === 'cb-reaction';
  const isShearMomentStep = step.id === 'cb-shear-header';

  // Map conjugate supports to ISupport and IInternalRelease
  const mappedSupports: ISupport[] = conjugateBeam.supports
    .map((s, idx) => {
      let type: ISupport['type'] = 'roller';
      if (s.type === 'Fixed Support') type = 'fixed';
      else if (s.type === 'Hinged Support' || s.type === 'Hinged/Roller support') type = 'hinge';
      else if (s.type === 'Roller Support' || s.type === 'Roller Support on the conjugate beam' || s.type === 'Internal Roller' || s.type === 'Internal Support') type = 'roller';
      else if (s.type === 'Free End') return null;
      else if (s.type === 'Internal Hinge') return null;

      return {
        id: `conj-support-${idx}`,
        type,
        position: s.position,
      };
    })
    .filter((s): s is ISupport => s !== null);

  const mappedReleases: IInternalRelease[] = conjugateBeam.supports
    .filter(s => s.type === 'Internal Hinge')
    .map((s, idx) => ({
      id: `conj-release-${idx}`,
      type: 'hinge',
      position: s.position,
    }));

  const getReactionPosition = (rx: IConjugateReaction): number => {
    if (rx.supportId === 'conj-left-force' || rx.supportId === 'conj-left-moment') return 0;
    if (rx.supportId === 'conj-right-force' || rx.supportId === 'conj-right-moment') return length;
    if (rx.supportId.startsWith('conj-internal-')) {
      const idx = parseInt(rx.supportId.replace('conj-internal-', ''), 10);
      return releases[idx]?.position ?? 0;
    }
    const realSupport = supports.find(s => s.id === rx.supportId);
    return realSupport ? realSupport.position : 0;
  };

  if (isTransformStep) {
    const highlightPos = step.highlightX !== undefined ? step.highlightX : null;

    const matchingRealSupport = highlightPos !== null ? supports.find(s => Math.abs(s.position - highlightPos!) < 0.05) : null;
    const matchingRealRelease = highlightPos !== null ? releases.find(r => Math.abs(r.position - highlightPos!) < 0.05) : null;
    const matchingConjSupport = highlightPos !== null ? mappedSupports.find(s => Math.abs(s.position - highlightPos!) < 0.05) : null;
    const matchingConjRelease = highlightPos !== null ? mappedReleases.find(r => Math.abs(r.position - highlightPos!) < 0.05) : null;

    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider pl-1">Real Beam</span>
          <MiniBeamVisual
            highlightedSupportId={matchingRealSupport?.id}
            highlightedReleaseId={matchingRealRelease?.id}
            showSupportLetters={false}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider pl-1">Conjugate Beam</span>
          <MiniBeamVisual
            customSupports={mappedSupports}
            customReleases={mappedReleases}
            customLoads={[]}
            highlightedSupportId={matchingConjSupport?.id}
            highlightedReleaseId={matchingConjRelease?.id}
            showSupportLetters={false}
          />
        </div>
      </div>
    );
  }

  if (isReactionStep) {
    const handleRenderOverlay = (toPixel: (x: number) => number) => {
      const yBeam = 70;
      return (
        <g>
          {conjugateBeam.reactions.map((rx, i) => {
            const rxPx = toPixel(getReactionPosition(rx));
            const isMoment = rx.type === 'M';

            if (isMoment) {
              const isCw = rx.value > 0;
              const r = 16;
              const pathD = isCw
                ? `M ${rxPx - 11.3} ${yBeam + 11.3} A ${r} ${r} 0 1 1 ${rxPx + 11.3} ${yBeam + 11.3}`
                : `M ${rxPx + 11.3} ${yBeam + 11.3} A ${r} ${r} 0 1 0 ${rxPx - 11.3} ${yBeam + 11.3}`;

              return (
                <g key={`rx-${i}`}>
                  <path d={pathD} fill="none" stroke="var(--success, #10b981)" strokeWidth={1.8} strokeLinecap="round" />
                  <polygon
                    points={isCw
                      ? `${rxPx - 11.3},${yBeam + 11.3} ${isCw ? rxPx - 14 : rxPx - 8},${yBeam + 6} ${isCw ? rxPx - 8 : rxPx - 14},${yBeam + 8}`
                      : `${rxPx + 11.3},${yBeam + 11.3} ${isCw ? rxPx + 8 : rxPx + 14},${yBeam + 6} ${isCw ? rxPx + 14 : rxPx + 8},${yBeam + 8}`
                    }
                    fill="var(--success, #10b981)"
                  />
                  <text x={rxPx} y={yBeam - 22} textAnchor="middle" className="fill-success text-[11px] font-bold">
                    {Math.abs(rx.value).toFixed(4)}m
                  </text>
                </g>
              );
            } else {
              const isUp = rx.value > 0;
              const arrowYStart = isUp ? yBeam + 45 : yBeam - 45;
              const arrowYEnd = isUp ? yBeam + 10 : yBeam - 10;

              return (
                <g key={`rx-${i}`}>
                  <line x1={rxPx} y1={arrowYStart} x2={rxPx} y2={arrowYEnd} stroke="var(--success, #10b981)" strokeWidth={1.8} strokeLinecap="round" />
                  <polygon
                    points={isUp
                      ? `${rxPx},${arrowYEnd} ${rxPx - 3},${arrowYEnd + 4} ${rxPx + 3},${arrowYEnd + 4}`
                      : `${rxPx},${arrowYEnd} ${rxPx - 3},${arrowYEnd - 4} ${rxPx + 3},${arrowYEnd - 4}`
                    }
                    fill="var(--success, #10b981)"
                  />
                  <text x={rxPx + 7} y={isUp ? yBeam + 24 : yBeam - 16} textAnchor="start" className="fill-success text-[11px] font-bold">
                    {Math.abs(rx.value).toFixed(4)} rad
                  </text>
                </g>
              );
            }
          })}
        </g>
      );
    };

    return (
      <MiniBeamVisual
        customSupports={mappedSupports}
        customReleases={mappedReleases}
        customLoads={[]}
        showSupportLetters={false}
        onRenderOverlay={handleRenderOverlay}
      />
    );
  }

  if (isShearMomentStep) {
    const handleRenderOverlay = (toPixel: (x: number) => number) => {
      const yBaseline = 70;

      const getMAt = (x: number): number => {
        if (!solverResult.success || !solverResult.intervals) return 0;
        const interval = solverResult.intervals.find(
          inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
        );
        if (!interval) return 0;
        const [a, b, c, d] = interval.mCoeffs;
        return (a * x * x * x + b * x * x + c * x + d) / 20.0;
      };

      let maxM = 1;
      const points: { x: number; m: number }[] = [];
      const numSteps = 50;
      for (let i = 0; i <= numSteps; i++) {
        const x = (i / numSteps) * length;
        const m = getMAt(x);
        points.push({ x, m });
        if (Math.abs(m) > maxM) maxM = Math.abs(m);
      }

      const scaleY = (m: number) => yBaseline + (m / maxM) * 35;

      let pathD = `M ${toPixel(0)} ${yBaseline}`;
      points.forEach(pt => {
        pathD += ` L ${toPixel(pt.x)} ${scaleY(pt.m)}`;
      });
      pathD += ` L ${toPixel(length)} ${yBaseline} Z`;

      return (
        <g>
          {/* Shaded M/EI Load Profile */}
          <path d={pathD} fill="rgba(59, 130, 246, 0.15)" stroke="var(--primary)" strokeWidth={1.2} />

          {/* Small Load Arrows inside the profile */}
          {Array.from({ length: 9 }).map((_, i) => {
            const x = (i / 8) * length;
            const px = toPixel(x);
            const m = getMAt(x);
            if (Math.abs(m) < 0.1) return null;
            const py = scaleY(m);
            const isUp = m < 0;

            return (
              <g key={i} opacity={0.6}>
                <line x1={px} y1={yBaseline} x2={px} y2={py} stroke="var(--primary)" strokeWidth={0.8} />
                <polygon
                  points={isUp
                    ? `${px},${yBaseline} ${px - 1.5},${yBaseline - 3} ${px + 1.5},${yBaseline - 3}`
                    : `${px},${yBaseline} ${px - 1.5},${yBaseline + 3} ${px + 1.5},${yBaseline + 3}`
                  }
                  fill="var(--primary)"
                />
              </g>
            );
          })}
        </g>
      );
    };

    return (
      <MiniBeamVisual
        customSupports={mappedSupports}
        customReleases={mappedReleases}
        customLoads={[]}
        showSupportLetters={false}
        onRenderOverlay={handleRenderOverlay}
      />
    );
  }

  return (
    <MiniBeamVisual
      customSupports={mappedSupports}
      customReleases={mappedReleases}
      customLoads={[]}
      showSupportLetters={false}
    />
  );
};
export default ConjugateBeamStepVisual;
