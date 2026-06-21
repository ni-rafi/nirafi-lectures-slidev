import React from 'react';
import { Point2D } from '../../../types/geometry';

interface AnnotationOverlayProps {
  p1: Point2D;
  p2: Point2D;
  offset: number; // perpendicular distance to shift dimension line
  text: string;
  colorClass?: string;
  fontSize?: number;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  p1,
  p2,
  offset,
  text,
  colorClass = 'stroke-foreground/40 fill-foreground/60',
  fontSize = 9,
}) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len === 0) return null;

  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // Perpendicular vector
  const py = ux;

  // Offset points where the dimension line will be placed
  const op1 = { x: p1.x + px * offset, y: p1.y + py * offset };
  const op2 = { x: p2.x + px * offset, y: p2.y + py * offset };

  // Midpoint for text placement
  const mx = (op1.x + op2.x) / 2;
  const my = (op1.y + op2.y) / 2;

  // Text anchor offset (nudged slightly outwards from dimension line)
  const textSpacing = 6;
  const tx = mx - px * textSpacing;
  const ty = my - py * textSpacing;

  // Extension line lengths (starts slightly away from the element, ends slightly past dimension line)
  const extStartOffset = 2;
  const extEndExtension = 4;
  
  const extP1Start = { x: p1.x + px * extStartOffset * Math.sign(offset), y: p1.y + py * extStartOffset * Math.sign(offset) };
  const extP1End = { x: op1.x + px * extEndExtension * Math.sign(offset), y: op1.y + py * extEndExtension * Math.sign(offset) };
  
  const extP2Start = { x: p2.x + px * extStartOffset * Math.sign(offset), y: p2.y + py * extStartOffset * Math.sign(offset) };
  const extP2End = { x: op2.x + px * extEndExtension * Math.sign(offset), y: op2.y + py * extEndExtension * Math.sign(offset) };

  // Architectural diagonal tick vectors (rotated ~45 degrees)
  const tickSize = 4;
  const tick1_x1 = op1.x - (ux + px) * tickSize;
  const tick1_y1 = op1.y - (uy + py) * tickSize;
  const tick1_x2 = op1.x + (ux + px) * tickSize;
  const tick1_y2 = op1.y + (uy + py) * tickSize;

  const tick2_x1 = op2.x - (ux + px) * tickSize;
  const tick2_y1 = op2.y - (uy + py) * tickSize;
  const tick2_x2 = op2.x + (ux + px) * tickSize;
  const tick2_y2 = op2.y + (uy + py) * tickSize;

  return (
    <g className={colorClass}>
      {/* 1. Extension projection lines */}
      <line x1={extP1Start.x} y1={extP1Start.y} x2={extP1End.x} y2={extP1End.y} stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.4" />
      <line x1={extP2Start.x} y1={extP2Start.y} x2={extP2End.x} y2={extP2End.y} stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.4" />

      {/* 2. Main dimension line */}
      <line x1={op1.x} y1={op1.y} x2={op2.x} y2={op2.y} stroke="currentColor" strokeWidth="1" />

      {/* 3. Architectural diagonal ticks */}
      <line x1={tick1_x1} y1={tick1_y1} x2={tick1_x2} y2={tick1_y2} stroke="currentColor" strokeWidth="1.5" />
      <line x1={tick2_x1} y1={tick2_y1} x2={tick2_x2} y2={tick2_y2} stroke="currentColor" strokeWidth="1.5" />

      {/* 4. Text Label */}
      <text
        x={tx}
        y={ty + fontSize / 3.5}
        textAnchor="middle"
        fontSize={fontSize}
        fill="currentColor"
        fontWeight="bold"
        className="font-mono"
      >
        {text}
      </text>
    </g>
  );
};
