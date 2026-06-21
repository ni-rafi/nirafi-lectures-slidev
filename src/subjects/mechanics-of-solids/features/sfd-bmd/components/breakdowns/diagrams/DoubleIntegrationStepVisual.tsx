import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { MiniBeamVisual } from './MiniBeamVisual';

import { ICalculationStep } from '../../../types/stepTypes';

interface DoubleIntegrationStepVisualProps {
  step: ICalculationStep;
}

export const DoubleIntegrationStepVisual: React.FC<DoubleIntegrationStepVisualProps> = ({ step }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  if (!beamCtx) return null;

  const { supports } = beamCtx;

  const lockPos = step.highlightX !== undefined ? step.highlightX : null;
  const isSlopeLock = step.text.toLowerCase().includes('slope');


  const hasLock = lockPos !== null;

  const handleRenderOverlay = (toPixel: (x: number) => number) => {
    const yBeam = 70;
    if (!hasLock) return null;
    const lockPx = toPixel(lockPos!);

    return (
      <g transform={`translate(${lockPx}, ${yBeam + 24})`}>
        {/* Padlock loop */}
        <path
          d="M -3 -1 A 3 3 0 0 1 3 -1 L 3 2 L -3 2 Z"
          fill="none"
          stroke="var(--destructive)"
          strokeWidth={1}
        />
        {/* Padlock body */}
        <rect x={-5} y={1} width={10} height={8} rx={1} fill="var(--destructive)" />
        {/* Keyhole */}
        <circle cx={0} cy={4} r={1} fill="var(--background)" />

        {/* Label text next to the lock */}
        <text
          x={8}
          y={7}
          textAnchor="start"
          className="fill-destructive text-[11px] font-bold select-none"
        >
          {isSlopeLock ? 'θ = 0' : 'y = 0'}
        </text>

        {/* Glowing lock ring */}
        <circle cx={0} cy={0} r={12} fill="none" stroke="var(--destructive)" strokeWidth={0.75} strokeDasharray="1.5,1.5" opacity={0.6} />
      </g>
    );
  };

  return (
    <MiniBeamVisual
      highlightedSupportId={hasLock ? supports.find(s => Math.abs(s.position - lockPos!) < 0.05)?.id : null}
      onRenderOverlay={handleRenderOverlay}
    />
  );
};
