import React, { useContext } from 'react';
import { BeamWorkspaceContext } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { MiniBeamVisual } from './MiniBeamVisual';
import { useBeamEngine } from '../../../hooks/useBeamEngine';
import { processReactionsForces } from './helpers/reactionsLoadHelper';
import { ReactionsOverlay } from './components/ReactionsOverlay';

import { ICalculationStep } from '../../../types/stepTypes';

interface ReactionsStepVisualProps {
  step: ICalculationStep;
}

export const ReactionsStepVisual: React.FC<ReactionsStepVisualProps> = ({ step }) => {
  const beamCtx = useContext(BeamWorkspaceContext);
  const { solverResult } = useBeamEngine();
  if (!beamCtx) return null;

  const { supports, loads } = beamCtx;

  const {
    pivotPos,
    opacityRightOfX,
    opacitySide,
    activeLoadVisuals,
    activeReactions,
    dimTargets,
  } = processReactionsForces(step.text, supports, loads);

  const dimCount = dimTargets.length;
  const yBeam = Math.max(90, 69 + Math.max(0, dimCount - 1) * 12);
  const height = yBeam + 95;

  return (
    <MiniBeamVisual
      height={height}
      yBeam={yBeam}
      opacityRightOfX={opacityRightOfX}
      opacitySide={opacitySide}
      onRenderOverlay={(toPixel) => (
        <ReactionsOverlay
          pivotPos={pivotPos}
          yBeam={yBeam}
          activeReactions={activeReactions}
          activeLoadVisuals={activeLoadVisuals}
          dimTargets={dimTargets}
          reactions={solverResult.reactions}
          toPixel={toPixel}
        />
      )}
    />
  );
};
