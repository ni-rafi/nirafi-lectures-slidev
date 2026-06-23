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
  fillColor,
  strokeColor,
}) => {
  const segments = computeFractionalSegments(geo.start, geo.end, highlights);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(geo.id);
  };

  // Calculate outline coordinates for double-line architectural wall style
  const dx = geo.end.x - geo.start.x;
  const dy = geo.end.y - geo.start.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = len > 0 ? -dy / len : 0;
  const ny = len > 0 ? dx / len : 0;
  const h = geo.thickness / 2;

  // Corner points of the wall rectangle (polygon)
  const x1_a = geo.start.x + h * nx;
  const y1_a = geo.start.y + h * ny;
  const x2_a = geo.end.x + h * nx;
  const y2_a = geo.end.y + h * ny;
  const x2_b = geo.end.x - h * nx;
  const y2_b = geo.end.y - h * ny;
  const x1_b = geo.start.x - h * nx;
  const y1_b = geo.start.y - h * ny;

  const pointsString = `${x1_a},${y1_a} ${x2_a},${y2_a} ${x2_b},${y2_b} ${x1_b},${y1_b}`;

  // CSS classes matching the original design system defaults
  const activeClass = "fill-primary stroke-primary";
  const defaultClass = "fill-muted stroke-border";
  const combinedClass = `${isActive ? activeClass : defaultClass} transition-colors duration-200`;

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

      {/* Base Structural Beam Rectangle (rendered as Polygon) */}
      <polygon
        points={pointsString}
        className={combinedClass}
        style={{
          fill: fillColor || undefined,
          stroke: strokeColor || undefined,
        }}
        fillOpacity={isActive ? 0.2 : 0.8}
        strokeOpacity={isActive ? 0.9 : 0.6}
        strokeWidth={1.5}
      />

      {/* Overlay Highlights (e.g. clash zones) */}
      {segments.map((seg, idx) => {
        // Calculate corner points of the highlight segment polygon using the beam's normal vectors
        const h_x1_a = seg.p1.x + h * nx;
        const h_y1_a = seg.p1.y + h * ny;
        const h_x2_a = seg.p2.x + h * nx;
        const h_y2_a = seg.p2.y + h * ny;
        const h_x2_b = seg.p2.x - h * nx;
        const h_y2_b = seg.p2.y - h * ny;
        const h_x1_b = seg.p1.x - h * nx;
        const h_y1_b = seg.p1.y - h * ny;

        const hPointsString = `${h_x1_a},${h_y1_a} ${h_x2_a},${h_y2_a} ${h_x2_b},${h_y2_b} ${h_x1_b},${h_y1_b}`;

        return (
          <polygon
            key={idx}
            points={hPointsString}
            className={seg.strokeClass || seg.fillClass || ""}
            style={{
              fill: seg.fillClass ? undefined : "var(--color-destructive, #ef4444)",
              stroke: seg.strokeClass ? undefined : "var(--color-destructive, #ef4444)",
            }}
            fillOpacity={seg.fillClass ? undefined : 0.45}
            strokeWidth={1.5}
          />
        );
      })}
    </g>
  );
};
