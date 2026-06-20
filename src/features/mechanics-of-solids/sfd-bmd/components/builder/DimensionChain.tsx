import React from 'react';
import { ISupport, IInternalRelease, ILoad } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';

interface DimensionChainProps {
  length: number;
  supports: ISupport[];
  releases: IInternalRelease[];
  loads: ILoad[];
  eiSegments: IEISegment[];
  toPixel: (pos: number) => number;
  yBeam: number;
  getBeamThicknessAt: (x: number) => number;
  setSelectedId: (id: string | null) => void;
}

export const DimensionChain: React.FC<DimensionChainProps> = ({
  length,
  supports,
  releases,
  loads,
  eiSegments,
  toPixel,
  yBeam,
  getBeamThicknessAt,
  setSelectedId,
}) => {
  // Collect all coordinates of interest
  const rawCoords = [
    0,
    length,
    ...supports.map(s => s.position),
    ...releases.map(r => r.position),
    ...loads.flatMap(l => l.position !== undefined ? [l.position] : []),
    ...loads.flatMap(l => l.startPosition !== undefined ? [l.startPosition] : []),
    ...loads.flatMap(l => l.endPosition !== undefined ? [l.endPosition] : []),
    ...eiSegments.map(s => s.startPosition),
    ...eiSegments.map(s => s.endPosition),
  ];

  // Map to 2 decimal places to round values, then keep unique values
  const uniqueCoords = Array.from(
    new Set(rawCoords.map(x => parseFloat(x.toFixed(2))))
  ).sort((a, b) => a - b);

  // Merge points that are within 0.05m of each other
  const mergedCoords: number[] = [];
  uniqueCoords.forEach(x => {
    if (mergedCoords.length === 0) {
      mergedCoords.push(x);
    } else {
      const last = mergedCoords[mergedCoords.length - 1]!;
      if (x - last > 0.05) {
        mergedCoords.push(x);
      }
    }
  });

  const yDim = 135;

  return (
    <g
      className="cursor-pointer group"
      onClick={(e) => {
        e.stopPropagation();
        setSelectedId('beam');
      }}
    >
      {/* Horizontal Dimension baseline */}
      {mergedCoords.length > 1 && (
        <line
          x1={toPixel(mergedCoords[0]!)}
          y1={yDim}
          x2={toPixel(mergedCoords[mergedCoords.length - 1]!)}
          y2={yDim}
          stroke="var(--muted-foreground)"
          className="group-hover:stroke-primary transition-colors"
          strokeWidth={1}
        />
      )}

      {/* Draw extension lines, ticks, and interval text */}
      {mergedCoords.map((x, idx) => {
        const px = toPixel(x);
        const thickness = getBeamThicknessAt(x);
        const yBeamBottom = yBeam + thickness / 2;

        // Vertical dashed extension line from bottom of the beam to slightly above the dimension line
        const extYStart = yBeamBottom + 4;
        const extYEnd = yDim - 4;

        // Oblique architectural tick (45-degree slash)
        const tickSlash = (
          <line
            x1={px - 3}
            y1={yDim + 3}
            x2={px + 3}
            y2={yDim - 3}
            stroke="var(--muted-foreground)"
            className="group-hover:stroke-primary transition-colors"
            strokeWidth={1.5}
          />
        );

        // Next coordinate interval details
        const nextX = mergedCoords[idx + 1];
        const showIntervalText = nextX !== undefined && (nextX - x) >= 0.10;
        const intervalText = showIntervalText && nextX !== undefined ? (
          <text
            x={(px + toPixel(nextX)) / 2}
            y={yDim + 14}
            textAnchor="middle"
            className="fill-muted-foreground group-hover:fill-primary text-[10px] font-bold transition-colors select-none"
          >
            {(nextX - x).toFixed(2)}m
          </text>
        ) : null;

        return (
          <g key={`dim-${x}-${idx}`}>
            {/* Extension Line */}
            {extYStart < extYEnd && (
              <line
                x1={px}
                y1={extYStart}
                x2={px}
                y2={extYEnd}
                stroke="var(--muted-foreground)"
                className="opacity-40 group-hover:stroke-primary group-hover:opacity-70 transition-all"
                strokeWidth={1}
                strokeDasharray="2,2"
              />
            )}
            {/* Tick */}
            {tickSlash}
            {/* Interval Length */}
            {intervalText}
          </g>
        );
      })}
    </g>
  );
};
