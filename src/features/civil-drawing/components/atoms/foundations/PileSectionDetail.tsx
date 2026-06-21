import React from 'react';
import { calculatePileMatrix } from '../../../engines/pileMatrixEngine';
import { Point2D } from '../../../../building-drawing/types/geometry';

interface PileSectionDetailProps {
  pileCount: number;
  pileDiameter: number;
  pileDepth: number;
  capWidth: number;
  capDepth: number;
  spacingFactor?: number;
  customPilePositions?: Point2D[];
}

export const PileSectionDetail: React.FC<PileSectionDetailProps> = ({
  pileCount,
  pileDiameter,
  pileDepth,
  capWidth,
  capDepth,
  spacingFactor = 2.5,
  customPilePositions,
}) => {
  const pilePoints = calculatePileMatrix(pileCount, pileDiameter, spacingFactor, customPilePositions);

  // Filter distinct X coordinates of piles to draw vertical elevation shafts
  const distinctXCoords = Array.from(new Set(pilePoints.map(pt => Math.round(pt.x))));

  const embedmentDepth = 15; // standard 50-75mm embedment represented visually
  const blindingThickness = 12; // 100mm PCC blinding concrete
  const blindingProjection = 15; // 150mm extension past cap edge

  const capTopY = 0;
  const capBottomY = capDepth;

  return (
    <g>
      {/* 1. Sand/PCC Blinding Layer at base of cap */}
      <rect
        x={-capWidth / 2 - blindingProjection}
        y={capBottomY}
        width={capWidth + 2 * blindingProjection}
        height={blindingThickness}
        className="fill-muted-foreground/10 stroke-foreground/20 stroke-[0.5]"
      />
      {/* Blinding hatch pattern text tag */}
      <text
        x={-capWidth / 2 - 10}
        y={capBottomY + blindingThickness - 3}
        fontSize="6"
        className="fill-muted-foreground/60 font-mono"
      >
        PCC Blinding (1:4:8)
      </text>

      {/* 2. Pile Shafts (Vertical Bored concrete piers) */}
      {distinctXCoords.map((xCenter, idx) => {
        const px = xCenter - pileDiameter / 2;
        const shaftTopY = capBottomY - embedmentDepth;
        const shaftBottomY = capBottomY + pileDepth;

        return (
          <g key={idx}>
            {/* Pile Shaft concrete rect */}
            <rect
              x={px}
              y={shaftTopY}
              width={pileDiameter}
              height={pileDepth + embedmentDepth}
              className="fill-muted/70 stroke-foreground/40 stroke-[1.2]"
            />
            {/* Embedment dashed indicator line inside the cap */}
            <line
              x1={px}
              y1={shaftTopY}
              x2={px + pileDiameter}
              y2={shaftTopY}
              className="stroke-foreground/35"
              strokeDasharray="2,2"
            />
            {/* Helical cage centerline dashes */}
            <line
              x1={xCenter}
              y1={shaftTopY + 10}
              x2={xCenter}
              y2={shaftBottomY - 10}
              className="stroke-muted-foreground/20"
              strokeWidth="0.5"
              strokeDasharray="5,5"
            />
          </g>
        );
      })}

      {/* 3. Main Pile Cap Concrete Rectangle (Elevation View) */}
      <rect
        x={-capWidth / 2}
        y={capTopY}
        width={capWidth}
        height={capDepth}
        rx={1}
        className="fill-muted/30 stroke-foreground/65 stroke-2"
      />
    </g>
  );
};
