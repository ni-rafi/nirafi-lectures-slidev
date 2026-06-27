import React from 'react';

interface ShearVectorArrowProps {
  x: number;
  y: number;
  direction: 'up' | 'down';
  color?: string;
  height?: number;
  strokeWidth?: number;
  className?: string;
}

export const ShearVectorArrow: React.FC<ShearVectorArrowProps> = ({
  x,
  y,
  direction,
  color = '#f43f5e',
  height = 30,
  strokeWidth = 2.5,
  className = '',
}) => {
  const yEnd = direction === 'down' ? y + height : y - height;
  const tipY = direction === 'down' ? yEnd - 7 : yEnd + 7;

  return (
    <g className={className}>
      {/* Arrow line body */}
      <line
        x1={x}
        y1={y}
        x2={x}
        y2={yEnd}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrow tip (correctly points towards yEnd) */}
      <path
        d={`M ${x - 4.5},${tipY} L ${x},${yEnd} L ${x + 4.5},${tipY}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};

interface MomentVectorArcProps {
  x: number; // Cut face center x
  y: number; // Cut face center y
  direction: 'cw' | 'ccw';
  side: 'left' | 'right';
  color?: string;
  radius?: number;
  strokeWidth?: number;
  className?: string;
  arrowTip?: 'top' | 'bottom';
}

export const MomentVectorArc: React.FC<MomentVectorArcProps> = ({
  x,
  y,
  direction,
  side,
  color = '#6366f1',
  radius = 20,
  strokeWidth = 2.5,
  className = '',
  arrowTip,
}) => {
  const dx = side === 'right' ? radius : -radius;
  const dy = radius * 0.72; // Standard aspect ratio matching CAD drawings

  // Determine tip position (top or bottom)
  const finalTip = arrowTip || (direction === 'ccw' ? 'top' : 'bottom');

  // Arc path: start from opposite of tip, end at tip
  const startY = finalTip === 'top' ? y + dy : y - dy;
  const endY = finalTip === 'top' ? y - dy : y + dy;

  // Sweep flag controls which direction the arc bulges (outwards from center)
  const sweepFlag = side === 'right'
    ? (finalTip === 'top' ? 0 : 1)
    : (finalTip === 'top' ? 1 : 0);

  const tipX = x + dx;

  // Compute arrowhead offsets dynamically based on layout quadrant
  const headDX = side === 'right' ? 6 : -6;
  const headDY = finalTip === 'top' ? 6 : -6;

  const headPath = `M ${tipX + headDX},${endY} L ${tipX},${endY} L ${tipX},${endY + headDY}`;

  return (
    <g className={className}>
      {/* Moment rotational arc */}
      <path
        d={`M ${x + dx},${startY} A ${radius},${radius} 0 0,${sweepFlag} ${x + dx},${endY}`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Rotational arrow head */}
      <path
        d={headPath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
};
