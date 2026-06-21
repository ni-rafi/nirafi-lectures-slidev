import React from 'react';

interface ConcreteSectionBoxProps {
  width: number;
  depth: number;
  isActive?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

export const ConcreteSectionBox: React.FC<ConcreteSectionBoxProps> = ({
  width,
  depth,
  isActive = false,
  fillColor,
  strokeColor,
}) => {
  const fill = fillColor || 'fill-muted/30';
  const stroke = strokeColor || (isActive ? 'stroke-primary' : 'stroke-foreground/65');

  return (
    <g>
      {/* Outer Concrete Bounding Box */}
      <rect
        x={0}
        y={0}
        width={width}
        height={depth}
        rx={4}
        className={`${fill} ${stroke} stroke-2 transition-all duration-200`}
        strokeDasharray={isActive ? '5,2' : undefined}
      />
      {/* Engineering Hatch Lines (subtle diagonal corner ticks to signify concrete section) */}
      <line x1={0} y1={10} x2={10} y2={0} className="stroke-muted-foreground/20" strokeWidth="0.5" />
      <line x1={width - 10} y1={depth} x2={width} y2={depth - 10} className="stroke-muted-foreground/20" strokeWidth="0.5" />
    </g>
  );
};
