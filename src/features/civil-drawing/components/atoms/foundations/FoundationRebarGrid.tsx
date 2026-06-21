import React from 'react';
import { CapRebarDetails } from '../../../types/foundationSchema';
import { calculatePileMatrix } from '../../../engines/pileMatrixEngine';
import { Point2D } from '../../../../building-drawing/types/geometry';

interface FoundationRebarGridProps {
  capWidth: number;
  capDepth: number;
  clearCover: number;
  pileCount: number;
  pileDiameter: number;
  spacingFactor?: number;
  customPilePositions?: Point2D[];
  rebar?: CapRebarDetails;
}

export const FoundationRebarGrid: React.FC<FoundationRebarGridProps> = ({
  capWidth,
  capDepth,
  clearCover,
  pileCount,
  pileDiameter,
  spacingFactor = 2.5,
  customPilePositions,
  rebar,
}) => {
  const cc = clearCover;
  const bottomY = capDepth - cc;
  const topY = cc;

  const hookLength = 25;
  const barColor = 'stroke-blue-600 fill-none';
  const dotColor = 'fill-blue-500 stroke-blue-700';

  // Bottom mesh path with end hooks bending upwards
  const leftX = -capWidth / 2 + cc;
  const rightX = capWidth / 2 - cc;
  const bottomMeshPath = `M ${leftX} ${bottomY - hookLength} L ${leftX} ${bottomY} L ${rightX} ${bottomY} L ${rightX} ${bottomY - hookLength}`;

  // Top mesh path with end hooks bending downwards (optional)
  const topMeshPath = rebar?.showTopMesh
    ? `M ${leftX} ${topY + hookLength} L ${leftX} ${topY} L ${rightX} ${topY} L ${rightX} ${topY + hookLength}`
    : '';

  // Get distinct X coordinates of piles to draw pile anchor steel dowels
  const pilePoints = calculatePileMatrix(pileCount, pileDiameter, spacingFactor, customPilePositions);
  const distinctXCoords = Array.from(new Set(pilePoints.map(pt => Math.round(pt.x))));

  // Column starter bars (defaulting to 2 main reinforcing bars in section projection)
  const colWidth = 100; // visual representation of column width
  const starterLeftX = -colWidth / 2 + 10;
  const starterRightX = colWidth / 2 - 10;
  const starterDepth = capDepth - cc - 10; // terminates near bottom mesh

  return (
    <g strokeWidth="1.5">
      {/* 1. Bottom Cap Reinforcement Mesh & Transverse Dots */}
      <path d={bottomMeshPath} className={barColor} />
      {Array.from({ length: 9 }).map((_, i) => {
        const x = leftX + 15 + ((rightX - leftX - 30) / 8) * i;
        return <circle key={`bot-dot-${i}`} cx={x} cy={bottomY - 4} r="2" className={dotColor} strokeWidth="0.5" />;
      })}

      {/* 2. Top Cap Reinforcement Mesh (Optional) */}
      {rebar?.showTopMesh && (
        <g>
          <path d={topMeshPath} className={barColor} />
          {Array.from({ length: 9 }).map((_, i) => {
            const x = leftX + 15 + ((rightX - leftX - 30) / 8) * i;
            return <circle key={`top-dot-${i}`} cx={x} cy={topY + 4} r="2" className={dotColor} strokeWidth="0.5" />;
          })}
        </g>
      )}

      {/* 3. Column Starter L-Bars extending from top down and bending outwards */}
      {/* Left Starter Bar */}
      <path
        d={`M ${starterLeftX} -40 L ${starterLeftX} ${starterDepth} L ${starterLeftX - 30} ${starterDepth}`}
        className="stroke-red-500 fill-none"
      />
      {/* Right Starter Bar */}
      <path
        d={`M ${starterRightX} -40 L ${starterRightX} ${starterDepth} L ${starterRightX + 30} ${starterDepth}`}
        className="stroke-red-500 fill-none"
      />

      {/* 4. Pile Anchor Dowels extending from pile shafts up into the cap */}
      {distinctXCoords.map((xCenter, idx) => {
        const pileLeftDoweling = xCenter - pileDiameter / 3;
        const pileRightDoweling = xCenter + pileDiameter / 3;

        return (
          <g key={idx} strokeWidth="1.2" className="stroke-destructive/80 fill-none">
            {/* Left anchor dowel */}
            <path d={`M ${pileLeftDoweling} 60 L ${pileLeftDoweling} ${capDepth - cc} L ${pileLeftDoweling - 15} ${capDepth - cc}`} />
            {/* Right anchor dowel */}
            <path d={`M ${pileRightDoweling} 60 L ${pileRightDoweling} ${capDepth - cc} L ${pileRightDoweling + 15} ${capDepth - cc}`} />
          </g>
        );
      })}
    </g>
  );
};
