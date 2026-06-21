import React from 'react';

import { ICalculationStep } from '../../../types/stepTypes';

interface MicroPrincipalRotationProps {
  step: ICalculationStep;
}

export const MicroPrincipalRotation: React.FC<MicroPrincipalRotationProps> = ({ step }) => {
  const thetaP = (step.metadata?.thetaP as number) ?? 0;
  const angleDeg = thetaP * 180 / Math.PI;

  const width = 160;
  const height = 110;
  const cx = 80;
  const cy = 55;
  const size = 30;
  const halfS = size / 2;

  // CCW rotation in physical plane means negative rotation in SVG's CW coordinate system
  const rotationDeg = -angleDeg;

  return (
    <div className="mt-2.5 mb-1.5 overflow-hidden rounded-lg border border-border/30 bg-muted/5 p-2 max-w-xs">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none overflow-visible">
        {/* Horizontal reference axis */}
        <line x1={15} y1={cy} x2={145} y2={cy} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3,3" opacity={0.6} />

        {/* Faded Original Element Block (0 degrees) */}
        <g opacity={0.25}>
          <rect
            x={cx - halfS}
            y={cy - halfS}
            width={size}
            height={size}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={1}
            strokeDasharray="2,2"
          />
          <text x={cx + halfS + 4} y={cy + 3} className="fill-muted-foreground text-[6px]">x</text>
        </g>

        {/* Rotated Element Block */}
        <g transform={`translate(${cx}, ${cy}) rotate(${rotationDeg})`}>
          <rect
            x={-halfS}
            y={-halfS}
            width={size}
            height={size}
            className="fill-primary/10 stroke-primary"
            strokeWidth={1.5}
          />
          <line x1={0} y1={0} x2={halfS + 12} y2={0} stroke="var(--primary)" strokeWidth={1} />
          <polygon points={`${halfS + 12},0 ${halfS + 9},-2 ${halfS + 9},2`} fill="var(--primary)" />
          <text x={halfS + 16} y={3} className="fill-primary text-[6px] font-bold">x'</text>
        </g>

        {/* Rotation Arc */}
        {Math.abs(angleDeg) > 0.1 && (
          <g>
            <path
              d={`M ${cx + 42} ${cy} A 42 42 0 0 ${angleDeg > 0 ? 0 : 1} ${cx + 42 * Math.cos(-angleDeg * Math.PI / 180)} ${cy + 42 * Math.sin(-angleDeg * Math.PI / 180)}`}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={1}
            />
            <text
              x={cx + 46 * Math.cos(-angleDeg / 2 * Math.PI / 180)}
              y={cy + 46 * Math.sin(-angleDeg / 2 * Math.PI / 180) + 3}
              textAnchor="start"
              className="fill-primary text-[7.5px] font-bold"
            >
              θ={angleDeg.toFixed(1)}°
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
