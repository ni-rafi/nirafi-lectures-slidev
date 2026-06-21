import React from 'react';
import { CrossSectionSpec } from '../../../types/sectionSchema';
import { calculateRebarMatrix } from '../../../engines/rebarMatrixEngine';

interface RebarSectionPrimitiveProps {
  spec: CrossSectionSpec;
  isActive?: boolean;
}

export const RebarSectionPrimitive: React.FC<RebarSectionPrimitiveProps> = ({
  spec,
  isActive = false,
}) => {
  const { rebars, stirrupRect } = calculateRebarMatrix(spec);

  const stirrupStroke = spec.stirrups.colorClass || 'stroke-destructive';
  const barFill = isActive ? 'fill-amber-500' : 'fill-blue-600';
  const barStroke = isActive ? 'stroke-amber-700' : 'stroke-blue-800';

  return (
    <g>
      {/* 1. Closed Stirrup/Link Rectangular Loop */}
      {stirrupRect.width > 0 && stirrupRect.height > 0 && (
        <rect
          x={stirrupRect.x}
          y={stirrupRect.y}
          width={stirrupRect.width}
          height={stirrupRect.height}
          rx={2}
          fill="none"
          className={`${stirrupStroke} stroke-[1.5]`}
          style={{ stroke: spec.stirrups.colorClass ? undefined : 'var(--color-destructive, #ef4444)' }}
        />
      )}

      {/* 2. Rebar Circles */}
      {rebars.map((rb, idx) => {
        // Convert real barDiameter (e.g. 16mm) to scaled canvas radius
        // Standard mapping: 16mm bar maps to radius of 4-6 pixels
        const r = Math.max(3, rb.diameter / 3);

        return (
          <g key={idx}>
            {/* Rebar circle dot */}
            <circle
              cx={rb.point.x}
              cy={rb.point.y}
              r={r}
              className={`${barFill} ${barStroke} stroke-[1] transition-colors duration-200`}
            />
            {/* Center crosshair for engineering style */}
            <line
              x1={rb.point.x - r - 1}
              y1={rb.point.y}
              x2={rb.point.x + r + 1}
              y2={rb.point.y}
              className="stroke-background/40"
              strokeWidth="0.5"
            />
          </g>
        );
      })}
    </g>
  );
};
