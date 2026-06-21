import React from 'react';
import { Point2D } from '../../../types/geometry';

interface WallOpeningPrimitiveProps {
  beamStart: Point2D;
  beamEnd: Point2D;
  relativeOffset: number; // 0.0 to 1.0 along span
  clearanceWidth: number;
  type: 'door' | 'window';
  thickness: number;
}

export const WallOpeningPrimitive: React.FC<WallOpeningPrimitiveProps> = ({
  beamStart,
  beamEnd,
  relativeOffset,
  clearanceWidth,
  type,
  thickness,
}) => {
  const dx = beamEnd.x - beamStart.x;
  const dy = beamEnd.y - beamStart.y;
  const len = Math.sqrt(dx * dx + dy * dy);

  if (len === 0) return null;

  const ux = dx / len;
  const uy = dy / len;
  const px = -uy; // Perpendicular vector for offset
  const py = ux;

  // Center coordinate of the opening
  const cx = beamStart.x + dx * relativeOffset;
  const cy = beamStart.y + dy * relativeOffset;

  // Start and end coordinates of the opening gap
  const halfW = clearanceWidth / 2;
  const x1 = cx - ux * halfW;
  const y1 = cy - uy * halfW;
  const x2 = cx + ux * halfW;
  const y2 = cy + uy * halfW;

  if (type === 'door') {
    // 1. Draw a door leaf at 90 degrees
    const doorLeafX = x1 + px * clearanceWidth;
    const doorLeafY = y1 + py * clearanceWidth;

    // 2. Draw a swing arc (quarter circle path) from leaf to other side
    // SVG arc format: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    const swingPath = `M ${doorLeafX} ${doorLeafY} A ${clearanceWidth} ${clearanceWidth} 0 0 0 ${x2} ${y2}`;

    return (
      <g className="stroke-foreground/60 fill-none">
        {/* Door Gap Clip Underlay (Paints background color to cover the beam) */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--background, #ffffff)"
          strokeWidth={thickness + 1}
        />
        {/* Door Frame Leaf Line */}
        <line x1={x1} y1={y1} x2={doorLeafX} y2={doorLeafY} strokeWidth="1.5" />
        {/* Swing Arc */}
        <path d={swingPath} strokeWidth="1" strokeDasharray="3,3" />
      </g>
    );
  } else {
    // Window representation: clean double line frame
    const winOffset = thickness / 4;
    return (
      <g className="stroke-foreground/60">
        {/* Window Gap Clip Underlay */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="var(--background, #ffffff)"
          strokeWidth={thickness + 1}
        />
        {/* Double Frame Lines */}
        <line
          x1={x1 + px * winOffset}
          y1={y1 + py * winOffset}
          x2={x2 + px * winOffset}
          y2={y2 + py * winOffset}
          strokeWidth="1.2"
        />
        <line
          x1={x1 - px * winOffset}
          y1={y1 - py * winOffset}
          x2={x2 - px * winOffset}
          y2={y2 - py * winOffset}
          strokeWidth="1.2"
        />
        {/* End Caps */}
        <line
          x1={x1 - px * (thickness / 2)}
          y1={y1 - py * (thickness / 2)}
          x2={x1 + px * (thickness / 2)}
          y2={y1 + py * (thickness / 2)}
          strokeWidth="1"
        />
        <line
          x1={x2 - px * (thickness / 2)}
          y1={y2 - py * (thickness / 2)}
          x2={x2 + px * (thickness / 2)}
          y2={y2 + py * (thickness / 2)}
          strokeWidth="1"
        />
      </g>
    );
  }
};
