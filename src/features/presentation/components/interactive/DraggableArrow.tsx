import React from 'react';
import Draggable, { type DragPosition } from './Draggable';

interface DraggableArrowProps {
  initialPos?: DragPosition;
  onPositionChange?: (pos: DragPosition) => void;
  className?: string;
  syncKey?: string;
}

/**
 * DraggableArrow renders a draggable arrow indicator inside slides,
 * useful for highlighting formulas, estimation spans, or structural elements.
 */
export const DraggableArrow: React.FC<DraggableArrowProps> = ({
  initialPos = { x: 100, y: 100, w: 150, h: 50, rotate: 0 },
  onPositionChange,
  className = '',
  syncKey,
}) => {
  const w = initialPos.w || 120;
  const h = initialPos.h || 40;

  return (
    <Draggable
      initialPos={initialPos}
      onPositionChange={onPositionChange}
      className={className}
      syncKey={syncKey}
    >
      {/* SVG canvas sheet drawing the arrow path */}
      <svg
        width={w}
        height={h}
        className="overflow-visible pointer-events-none select-none"
        style={{ display: 'block' }}
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" className="fill-primary" />
          </marker>
        </defs>
        
        {/* Main Line connecting start to end */}
        <line
          x1="0"
          y1={h / 2}
          x2={w - 6}
          y2={h / 2}
          stroke="var(--primary)"
          strokeWidth="3.5"
          markerEnd="url(#arrowhead)"
          className="stroke-primary"
        />
      </svg>
    </Draggable>
  );
};

export default DraggableArrow;
