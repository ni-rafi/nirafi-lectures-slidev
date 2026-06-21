import React from 'react';
import { Point2D } from '../../../../building-drawing/types/geometry';

interface EGLProfileLineProps {
  eglPoints: Point2D[];
  colorClass?: string;
  showPoints?: boolean;
}

export const EGLProfileLine: React.FC<EGLProfileLineProps> = ({
  eglPoints,
  colorClass = 'stroke-amber-600 dark:stroke-amber-500 fill-none',
  showPoints = true,
}) => {
  if (eglPoints.length < 2) return null;

  // Build SVG path string "M x1 y1 L x2 y2 ..."
  const pathD = eglPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <g>
      {/* 1. Ground fill representation beneath the line */}
      {/* (Created by extending path to a bottom bounding box level) */}
      <path
        d={`${pathD} L ${eglPoints[eglPoints.length - 1]!.x} ${eglPoints[eglPoints.length - 1]!.y + 100} L ${eglPoints[0]!.x} ${eglPoints[0]!.y + 100} Z`}
        className="fill-amber-950/5 dark:fill-amber-100/5 stroke-none"
      />

      {/* 2. Main Ground Level Line */}
      <path
        d={pathD}
        className={`${colorClass} stroke-[2.5]`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Optional Survey Points and Height Callouts */}
      {showPoints &&
        eglPoints.map((pt, idx) => (
          <g key={idx}>
            {/* Small vertical dashed grid indicator */}
            <line
              x1={pt.x}
              y1={pt.y}
              x2={pt.x}
              y2={pt.y + 20}
              className="stroke-foreground/15 stroke-[0.75]"
              strokeDasharray="2,2"
            />
            {/* Ground node dot */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              className="fill-amber-600 dark:fill-amber-400 stroke-background stroke-2 hover:r-5 transition-all duration-150 cursor-crosshair"
            />
            {/* Label coordinate helper on hover (simple title tooltip) */}
            <title>{`EGL Point #${idx + 1}: (${pt.x.toFixed(0)}, ${pt.y.toFixed(0)})`}</title>
          </g>
        ))}
    </g>
  );
};
