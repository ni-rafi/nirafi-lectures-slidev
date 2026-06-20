import React from 'react';
import { IStressState } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { StressTransformationEngine } from '@/cores/mechanics-of-solids/stress/stress-transformation.engine';

interface StressElementBlockProps {
  state: IStressState;
  thetaRad: number;
}

export const StressElementBlock: React.FC<StressElementBlockProps> = ({ state, thetaRad }) => {
  // Transform the stress state to the inspected rotation angle
  const transformed = StressTransformationEngine.transform(state, thetaRad);
  const { sigmaX, sigmaY, tauXY } = transformed;

  const width = 160;
  const height = 160;
  const cx = 80;
  const cy = 80;
  const size = 50; // Side length of the square block

  // Rotation angle in degrees (CCW in physical plane means negative rotation in SVG's CW coordinate system)
  const rotationDeg = -((thetaRad * 180) / Math.PI);

  const format = (val: number) => (val / 1e6).toFixed(2); // MPa

  // Arrow size parameters
  const arrowLength = 22;
  const halfS = size / 2;

  // Render normal stress arrows (tensile points out, compressive points in)
  const renderNormalArrow = (
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    value: number,
    label: string
  ) => {
    if (Math.abs(value) < 1e4) return null; // Hide if less than 0.01 MPa (10 kPa)

    const isTension = value > 0;
    const arrowDir = isTension ? 1 : -1;

    // Line endpoints
    const x1 = startX;
    const y1 = startY;
    const x2 = startX + dx * arrowLength * arrowDir;
    const y2 = startY + dy * arrowLength * arrowDir;

    // Arrow tip points
    const tipX = isTension ? x2 : x1;
    const tipY = isTension ? y2 : y1;
    const headSize = 3;

    // Determine tip polygon points
    let points = '';
    if (dx !== 0) {
      const dirX = dx * arrowDir;
      points = `${tipX},${tipY} ${tipX - headSize * dirX},${tipY - headSize} ${tipX - headSize * dirX},${tipY + headSize}`;
    } else {
      const dirY = dy * arrowDir;
      points = `${tipX},${tipY} ${tipX - headSize},${tipY - headSize * dirY} ${tipX + headSize},${tipY - headSize * dirY}`;
    }

    const strokeColor = isTension ? '#10b981' : '#3b82f6';

    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={1.5} strokeLinecap="round" />
        <polygon points={points} fill={strokeColor} />
        {/* Label text */}
        <text
          x={x2 + dx * 8}
          y={y2 + dy * 8 + 3}
          textAnchor="middle"
          className="text-[7.5px] font-mono font-bold"
          fill={strokeColor}
        >
          {label}
        </text>
      </g>
    );
  };

  // Render shear stress arrows (along the faces of the block)
  const renderShearArrows = (tauVal: number) => {
    if (Math.abs(tauVal) < 1e4) return null; // Hide if less than 0.01 MPa (10 kPa)

    const isPositive = tauVal > 0;
    const dir = isPositive ? 1 : -1;
    const offset = 5; // offset from square face

    // Face coordinates relative to center (0,0)
    // Positive tauXY:
    // Right face: pointing UP (y goes from positive to negative in SVG, so dy = -1)
    // Left face: pointing DOWN (dy = 1)
    // Top face: pointing LEFT (dx = -1)
    // Bottom face: pointing RIGHT (dx = 1)
    const arrowSpecs = [
      // Right face (x = halfS)
      { x1: halfS + offset, y1: halfS - 5, x2: halfS + offset, y2: -halfS + 5, tipY: -halfS + 5 * dir, tipX: halfS + offset, points: isPositive ? `${halfS + offset},${-halfS + 5} ${halfS + offset - 2.5},${-halfS + 9} ${halfS + offset + 2.5},${-halfS + 9}` : `${halfS + offset},${halfS - 5} ${halfS + offset - 2.5},${halfS - 9} ${halfS + offset + 2.5},${halfS - 9}` },
      // Left face (x = -halfS)
      { x1: -halfS - offset, y1: -halfS + 5, x2: -halfS - offset, y2: halfS - 5, tipY: halfS - 5 * dir, tipX: -halfS - offset, points: isPositive ? `${-halfS - offset},${halfS - 5} ${-halfS - offset - 2.5},${halfS - 9} ${-halfS - offset + 2.5},${halfS - 9}` : `${-halfS - offset},${-halfS + 5} ${-halfS - offset - 2.5},${-halfS + 9} ${-halfS - offset + 2.5},${-halfS + 9}` },
      // Top face (y = -halfS)
      { x1: halfS - 5, y1: -halfS - offset, x2: -halfS + 5, y2: -halfS - offset, tipX: -halfS + 5 * dir, tipY: -halfS - offset, points: isPositive ? `${-halfS + 5},${-halfS - offset} ${-halfS + 9},${-halfS - offset - 2.5} ${-halfS + 9},${-halfS - offset + 2.5}` : `${halfS - 5},${-halfS - offset} ${halfS - 9},${-halfS - offset - 2.5} ${halfS - 9},${-halfS - offset + 2.5}` },
      // Bottom face (y = halfS)
      { x1: -halfS + 5, y1: halfS + offset, x2: halfS - 5, y2: halfS + offset, tipX: halfS - 5 * dir, tipY: halfS + offset, points: isPositive ? `${halfS - 5},${halfS + offset} ${halfS - 9},${halfS + offset - 2.5} ${halfS - 9},${halfS + offset + 2.5}` : `${-halfS + 5},${halfS + offset} ${-halfS + 9},${halfS + offset - 2.5} ${-halfS + 9},${halfS + offset + 2.5}` },
    ];

    return (
      <g>
        {arrowSpecs.map((spec, i) => (
          <g key={i}>
            <line x1={spec.x1} y1={spec.y1} x2={spec.x2} y2={spec.y2} stroke="#f59e0b" strokeWidth={1} />
            <polygon points={spec.points} fill="#f59e0b" />
          </g>
        ))}
        {/* Label for shear (positioned at the top-right corner to avoid normal stress arrow overlapping) */}
        <text
          x={halfS + 10}
          y={-halfS - 6}
          textAnchor="start"
          className="fill-amber-500 text-[7.5px] font-mono font-bold"
        >
          τ={Math.abs(parseFloat(format(tauVal)))}
        </text>
      </g>
    );
  };

  return (
    <div className="flex justify-center border border-border/30 bg-muted/5 rounded-2xl p-6 max-w-[400px] mx-auto w-full shadow-inner">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full aspect-square overflow-visible">
        {/* Rotated Container */}
        <g transform={`translate(${cx}, ${cy}) rotate(${rotationDeg})`}>
          {/* Rotated Stress Square Block */}
          <rect
            x={-halfS}
            y={-halfS}
            width={size}
            height={size}
            className="fill-muted/20 stroke-foreground"
            strokeWidth={1.5}
          />

          {/* Normal Stress Arrows: X-face */}
          {renderNormalArrow(halfS, 0, 1, 0, sigmaX, `${format(sigmaX)}`)}
          {renderNormalArrow(-halfS, 0, -1, 0, sigmaX, '')}

          {/* Normal Stress Arrows: Y-face */}
          {renderNormalArrow(0, -halfS, 0, -1, sigmaY, `${format(sigmaY)}`)}
          {renderNormalArrow(0, halfS, 0, 1, sigmaY, '')}

          {/* Shear Stress Arrows along the sides */}
          {renderShearArrows(tauXY)}
        </g>
      </svg>
    </div>
  );
};
