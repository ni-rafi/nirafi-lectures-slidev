import React from 'react';
import { BoxGeometry } from '../../../types/geometry';

interface ColumnPlanPrimitiveProps {
  geo: BoxGeometry;
  isActive: boolean;
  onSelect: (id: string) => void;
  onMouseDown?: (e: React.MouseEvent, id: string) => void;
  fillColor?: string;
  strokeColor?: string;
}

export const ColumnPlanPrimitive: React.FC<ColumnPlanPrimitiveProps> = ({
  geo,
  isActive,
  onSelect,
  onMouseDown,
  fillColor,
  strokeColor,
}) => {
  const defaultFill = fillColor || (isActive ? 'var(--color-primary, #f59e0b)' : 'var(--color-muted, #3b82f6)');
  const defaultStroke = strokeColor || (isActive ? 'var(--color-primary, #ef4444)' : 'var(--color-border, #60a5fa)');

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(geo.id);
    if (onMouseDown) {
      onMouseDown(e, geo.id);
    }
  };

  return (
    <g
      onMouseDown={handleMouseDown}
      className="cursor-pointer select-none transition-transform duration-150 active:scale-95"
    >
      {/* Outer Glow for Active Column */}
      {isActive && (
        <rect
          x={geo.topLeft.x - 3}
          y={geo.topLeft.y - 3}
          width={geo.width + 6}
          height={geo.height + 6}
          rx={2}
          fill="none"
          stroke="var(--color-primary, #ef4444)"
          strokeWidth="1"
          strokeDasharray="3,1"
          className="animate-[pulse_2s_infinite]"
        />
      )}
      
      {/* Structural Column Rectangle */}
      <rect
        x={geo.topLeft.x}
        y={geo.topLeft.y}
        width={geo.width}
        height={geo.height}
        rx={1}
        fill={defaultFill}
        fillOpacity={isActive ? 0.35 : 0.6}
        stroke={defaultStroke}
        strokeWidth={isActive ? 2 : 1.5}
        className="transition-colors duration-200"
      />
    </g>
  );
};
