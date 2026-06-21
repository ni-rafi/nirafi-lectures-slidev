import React from 'react';
import { GridSystem } from '../../../types/layoutSchema';

interface PlanGridlinesProps {
  grid: GridSystem;
}

export const PlanGridlines: React.FC<PlanGridlinesProps> = ({ grid }) => {
  const minX = Math.min(...grid.xAxes.map(a => a.offset));
  const maxX = Math.max(...grid.xAxes.map(a => a.offset));
  const minY = Math.min(...grid.yAxes.map(a => a.offset));
  const maxY = Math.max(...grid.yAxes.map(a => a.offset));

  return (
    <g className="stroke-muted-foreground/15 font-mono text-[9px] fill-muted-foreground/60">
      {/* Vertical grid lines (X axes) */}
      {grid.xAxes.map(x => (
        <g key={x.id}>
          <line
            x1={x.offset}
            y1={minY - 20}
            x2={x.offset}
            y2={maxY + 20}
            strokeDasharray="4,4"
            strokeWidth="0.75"
          />
          <circle cx={x.offset} cy={minY - 25} r={8} className="fill-muted stroke-muted-foreground/25" />
          <text x={x.offset} y={minY - 22} textAnchor="middle" fontWeight="bold">
            {x.label}
          </text>
        </g>
      ))}

      {/* Horizontal grid lines (Y axes) */}
      {grid.yAxes.map(y => (
        <g key={y.id}>
          <line
            x1={minX - 20}
            y1={y.offset}
            x2={maxX + 20}
            y2={y.offset}
            strokeDasharray="4,4"
            strokeWidth="0.75"
          />
          <circle cx={minX - 25} cy={y.offset} r={8} className="fill-muted stroke-muted-foreground/25" />
          <text x={minX - 25} y={y.offset + 3} textAnchor="middle" fontWeight="bold">
            {y.label}
          </text>
        </g>
      ))}
    </g>
  );
};
