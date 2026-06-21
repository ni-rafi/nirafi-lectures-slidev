import React from 'react';
import { calculatePileMatrix } from '../../../engines/pileMatrixEngine';
import { Point2D } from '../../../../building-drawing/types/geometry';

interface PileLayoutPlanProps {
  pileCount: number;
  pileDiameter: number;
  capWidth: number;
  capDepth: number;
  spacingFactor?: number;
  customPilePositions?: Point2D[];
}

export const PileLayoutPlan: React.FC<PileLayoutPlanProps> = ({
  pileCount,
  pileDiameter,
  capWidth,
  capDepth,
  spacingFactor = 2.5,
  customPilePositions,
}) => {
  const pilePoints = calculatePileMatrix(pileCount, pileDiameter, spacingFactor, customPilePositions);

  return (
    <g>
      {/* 1. Outer Pile Cap Boundary Rect (Plan view centered at 0, 0) */}
      <rect
        x={-capWidth / 2}
        y={-capDepth / 2}
        width={capWidth}
        height={capDepth}
        rx={4}
        className="fill-muted/20 stroke-foreground/40 stroke-[1.5]"
      />
      {/* Dynamic diagonal ticks on cap corners */}
      <line x1={-capWidth / 2} y1={-capDepth / 2 + 10} x2={-capWidth / 2 + 10} y2={-capDepth / 2} className="stroke-foreground/15" strokeWidth="0.5" />
      <line x1={capWidth / 2 - 10} y1={capDepth / 2} x2={capWidth / 2} y2={capDepth / 2 - 10} className="stroke-foreground/15" strokeWidth="0.5" />

      {/* 2. Pile Circles & Center Crosshairs */}
      {pilePoints.map((pt, idx) => {
        const r = pileDiameter / 2;
        return (
          <g key={idx}>
            {/* Pile body */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={r}
              className="fill-muted stroke-foreground/60 stroke-[1.2] hover:fill-primary/25 transition-all duration-150"
            />
            {/* Center crosshair */}
            <line
              x1={pt.x - r - 4}
              y1={pt.y}
              x2={pt.x + r + 4}
              y2={pt.y}
              className="stroke-foreground/20"
              strokeWidth="0.75"
              strokeDasharray="2,2"
            />
            <line
              x1={pt.x}
              y1={pt.y - r - 4}
              x2={pt.x}
              y2={pt.y + r + 4}
              className="stroke-foreground/20"
              strokeWidth="0.75"
              strokeDasharray="2,2"
            />
            {/* Inner rebar helical cage representation (concentric dashed circle) */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={r - 6}
              fill="none"
              className="stroke-destructive/40"
              strokeWidth="0.75"
              strokeDasharray="3,1"
            />
          </g>
        );
      })}
    </g>
  );
};
