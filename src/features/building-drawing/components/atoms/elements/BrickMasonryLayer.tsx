import React, { useId } from 'react';
import { BoxGeometry } from '../../../types/geometry';

interface BrickMasonryLayerProps {
  geo: BoxGeometry;
  brickWidth?: number;  // visual width in pattern (default 24)
  brickHeight?: number; // visual height in pattern (default 10)
  colorClass?: string;
}

export const BrickMasonryLayer: React.FC<BrickMasonryLayerProps> = ({
  geo,
  brickWidth = 24,
  brickHeight = 10,
  colorClass = 'stroke-muted-foreground/20 fill-muted/10',
}) => {
  const patternId = useId();

  // Pattern dimensions are based on two rows to achieve running bond pattern
  const patternWidth = brickWidth;
  const patternHeight = brickHeight * 2;

  return (
    <g>
      <defs>
        <pattern
          id={patternId}
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
        >
          {/* Row 1 */}
          <rect
            x={0}
            y={0}
            width={brickWidth}
            height={brickHeight}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="stroke-muted-foreground/30"
          />
          {/* Row 2 (offset by half brick width for running bond) */}
          <rect
            x={-brickWidth / 2}
            y={brickHeight}
            width={brickWidth}
            height={brickHeight}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="stroke-muted-foreground/30"
          />
          <rect
            x={brickWidth / 2}
            y={brickHeight}
            width={brickWidth}
            height={brickHeight}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="stroke-muted-foreground/30"
          />
        </pattern>
      </defs>

      {/* Wall area filled with the brick pattern */}
      <rect
        x={geo.topLeft.x}
        y={geo.topLeft.y}
        width={geo.width}
        height={geo.height}
        fill={`url(#${patternId})`}
        className={colorClass}
        pointerEvents="none"
      />
    </g>
  );
};
