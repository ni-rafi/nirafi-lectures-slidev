import React from 'react';
import { ISolverOutput } from '@/cores/mechanics-of-solids/sfd-bmd/types';

interface ReactionVectorsProps {
  px: number;
  yBeam: number;
  supportId: string;
  letter: string;
  solverResult: ISolverOutput;
  formatForce: (f: number) => string;
  formatMoment: (m: number) => string;
}

export const ReactionVectors: React.FC<ReactionVectorsProps> = ({
  px,
  yBeam,
  supportId,
  letter,
  solverResult,
  formatForce,
  formatMoment,
}) => {
  if (!solverResult.success) return null;

  const ryReaction = solverResult.reactions.find(r => r.supportId === supportId && r.type === 'R_y');
  const mReaction = solverResult.reactions.find(r => r.supportId === supportId && r.type === 'M');

  return (
    <>
      {/* Render reaction Ry arrow and text if solved */}
      {ryReaction && Math.abs(ryReaction.value) > 1e-4 && (() => {
        const val = ryReaction.value;
        const isUp = val > 0;
        const arrowYStart = isUp ? yBeam + 105 : yBeam + 65;
        const arrowYEnd = isUp ? yBeam + 65 : yBeam + 105;
        
        const isRightHalf = px > 400;
        const textX = isRightHalf ? px - 8 : px + 8;
        const textAnchor = isRightHalf ? 'end' : 'start';

        return (
          <g key={`ry-${supportId}`}>
            {/* Green Arrow line */}
            <line
              x1={px}
              y1={arrowYStart}
              x2={px}
              y2={arrowYEnd}
              stroke="var(--success, #10b981)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Green Arrowhead */}
            <polygon
              points={isUp 
                ? `${px},${arrowYEnd} ${px-4},${arrowYEnd+6} ${px+4},${arrowYEnd+6}`
                : `${px},${arrowYEnd} ${px-4},${arrowYEnd-6} ${px+4},${arrowYEnd-6}`
              }
              fill="var(--success, #10b981)"
            />
            {/* Label Text */}
            <text
              x={textX}
              y={(arrowYStart + arrowYEnd) / 2 + 4}
              textAnchor={textAnchor}
              className="text-[10px] font-bold select-none"
              style={{ fill: 'var(--success, #10b981)' }}
            >
              R<tspan baselineShift="sub" fontSize="70%">y{letter}</tspan> = {formatForce(Math.abs(val))}
            </text>
          </g>
        );
      })()}

      {/* Render reaction Moment arc and text if solved */}
      {mReaction && Math.abs(mReaction.value) > 1e-4 && (() => {
        const val = mReaction.value;
        const cw = val > 0;
        const r = 20;
        const pathD = cw
          ? `M ${px - 14.14} ${yBeam + 14.14} A ${r} ${r} 0 1 1 ${px + 14.14} ${yBeam + 14.14}`
          : `M ${px + 14.14} ${yBeam + 14.14} A ${r} ${r} 0 1 0 ${px - 14.14} ${yBeam + 14.14}`;
        
        const textY = yBeam - 30;

        return (
          <g key={`m-${supportId}`}>
            {/* Green Arc */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--success, #10b981)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Green Arc Arrowhead */}
            <polygon
              points={cw
                ? `${px + 14.14},${yBeam + 14.14} ${px + 18},${yBeam + 6} ${px + 6},${yBeam + 12}`
                : `${px - 14.14},${yBeam + 14.14} ${px - 18},${yBeam + 6} ${px - 6},${yBeam + 12}`
              }
              fill="var(--success, #10b981)"
            />
            {/* Label Text */}
            {(() => {
              const isRightEdge = px > 760;
              const isLeftEdge = px < 40;
              const mTextX = isRightEdge ? px - 12 : (isLeftEdge ? px + 12 : px);
              const mAnchor = isRightEdge ? 'end' : (isLeftEdge ? 'start' : 'middle');
              return (
                <text
                  x={mTextX}
                  y={textY}
                  textAnchor={mAnchor}
                  className="text-[10px] font-bold select-none"
                  style={{ fill: 'var(--success, #10b981)' }}
                >
                  M<tspan baselineShift="sub" fontSize="70%">{letter}</tspan> = {formatMoment(Math.abs(val))}
                </text>
              );
            })()}
          </g>
        );
      })()}
    </>
  );
};
