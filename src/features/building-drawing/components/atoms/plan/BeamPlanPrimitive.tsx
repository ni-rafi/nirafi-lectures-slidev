import React from 'react';
import { LineGeometry } from '../../../types/geometry';
import { ElementColorOverride } from '../../../types/layoutSchema';
import { computeFractionalSegments } from '../../../engines/fractionalSplitter';

interface BeamPlanPrimitiveProps {
  geo: LineGeometry;
  isActive: boolean;
  onSelect: (id: string) => void;
  highlights?: ElementColorOverride[];
  fillColor?: string;
  strokeColor?: string;
}

export const BeamPlanPrimitive: React.FC<BeamPlanPrimitiveProps> = ({
  geo,
  isActive,
  onSelect,
  highlights = [],
  strokeColor,
}) => {
  const segments = computeFractionalSegments(geo.start, geo.end, highlights);
  const baseStroke = strokeColor || (isActive ? 'var(--color-primary, #f59e0b)' : 'var(--color-muted-foreground, #6b7280)');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(geo.id);
  };

  return (
    <g onClick={handleClick} className="cursor-pointer select-none">
      {/* Invisible thick helper to make selection click targets easier to hit */}
      <line
        x1={geo.start.x}
        y1={geo.start.y}
        x2={geo.end.x}
        y2={geo.end.y}
        stroke="transparent"
        strokeWidth={geo.thickness + 12}
        strokeLinecap="square"
      />

      {/* Base Structural Beam Path */}
      <line
        x1={geo.start.x}
        y1={geo.start.y}
        x2={geo.end.x}
        y2={geo.end.y}
        stroke={baseStroke}
        strokeWidth={geo.thickness}
        strokeLinecap="square"
        opacity={isActive ? 0.9 : 0.65}
        className="transition-all duration-200"
      />

      {/* Overlay Highlights */}
      {segments.map((seg, idx) => {
        const strokeClass = seg.strokeClass || 'stroke-destructive/70';
        return (
          <line
            key={idx}
            x1={seg.p1.x}
            y1={seg.p1.y}
            x2={seg.p2.x}
            y2={seg.p2.y}
            strokeWidth={geo.thickness}
            strokeLinecap="square"
            className={`${strokeClass} fill-none`}
            style={{ stroke: seg.strokeClass ? undefined : 'var(--color-destructive, #ef4444)' }}
          />
        );
      })}
    </g>
  );
};
