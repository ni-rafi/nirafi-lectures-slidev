import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { MiniBeamVisual } from './MiniBeamVisual';
import { processSectionForces } from './sectionLoadHelper';
import { SectionOverlay } from './components/SectionOverlay';
import { useBeamEngine } from '../../../hooks/useBeamEngine';

import { ICalculationStep } from '../../../types/stepTypes';

interface SectionStepVisualProps {
  step: ICalculationStep;
}

export const SectionStepVisual: React.FC<SectionStepVisualProps> = ({ step }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  const { solverResult } = useBeamEngine();
  if (!beamCtx) return null;

  const { length, hoverX, supports, loads } = beamCtx;

  // Extract interval limits from step metadata
  const startX = (step.metadata?.startX as number) ?? 0;
  const endX = (step.metadata?.endX as number) ?? length;

  let cutX = (startX + endX) / 2;
  if (hoverX !== null && hoverX >= startX && hoverX <= endX) {
    cutX = hoverX;
  }

  const isMoment = step.text.toLowerCase().includes('moment') || step.text.includes('M(x)');

  const { activeSide, activeReactions, activeLoadVisuals, dimTargets } = processSectionForces(
    supports,
    loads,
    cutX,
    length,
    isMoment
  );

  const dimCount = dimTargets.length;
  const yBeam = Math.max(90, 69 + Math.max(0, dimCount - 1) * 12);
  const height = yBeam + 120;

  return (
    <MiniBeamVisual
      height={height}
      yBeam={yBeam}
      opacityRightOfX={cutX}
      opacitySide={activeSide === 'left' ? 'right' : 'left'}
      onRenderOverlay={(toPixel) => (
        <SectionOverlay
          cutX={cutX}
          length={length}
          activeSide={activeSide}
          activeReactions={activeReactions}
          activeLoadVisuals={activeLoadVisuals}
          dimTargets={dimTargets}
          yBeam={yBeam}
          reactions={solverResult.reactions}
          toPixel={toPixel}
        />
      )}
    />
  );
};
