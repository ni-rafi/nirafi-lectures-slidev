import React from 'react';
import type { VectorElement } from '../../types';
import { getElementBounds } from '../../utils/bounds';

interface SvgElementsRendererProps {
  elements: VectorElement[];
  currentElement: VectorElement | null;
  activeTool: string;
  selectedId: string | null;
  onElementDown: (e: React.PointerEvent, el: VectorElement) => void;
}

export const SvgElementsRenderer: React.FC<SvgElementsRendererProps> = ({
  elements,
  currentElement,
  activeTool,
  selectedId,
  onElementDown,
}) => {
  const selectedElement = elements.find((el) => el.id === selectedId);
  const selectedBounds = selectedElement && getElementBounds(selectedElement);

  return (
    <>
      <defs>
        {elements.concat(currentElement ? [currentElement] : []).map((el) => {
          if (el.type === 'arrow') {
            return (
              <marker
                key={`marker-${el.id}`}
                id={`arrow-${el.id}`}
                viewBox="0 0 10 10"
                refX="6"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill={el.color} />
              </marker>
            );
          }
          return null;
        })}
      </defs>

      {/* Render Committed Elements */}
      {elements.map((el) => {
        const transform = `translate(${el.translate.x}, ${el.translate.y})`;
        const p1 = el.points[0]!, p2 = el.points[1];

        const commonProps = {
          'data-element-id': el.id,
          onPointerDown: (e: React.PointerEvent) => onElementDown(e, el),
          className: `vector-shape select-none ${
            activeTool === 'select'
              ? 'cursor-move hover:stroke-primary/40'
              : activeTool === 'eraser'
              ? 'cursor-crosshair'
              : 'pointer-events-auto'
          }`,
        };

        if (el.type === 'pencil') {
          return (
            <polygon
              key={el.id}
              points={el.points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill={el.color}
              transform={transform}
              {...commonProps}
            />
          );
        } else if (el.type === 'line' && p2) {
          return (
            <line
              key={el.id}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={el.color}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              transform={transform}
              {...commonProps}
            />
          );
        } else if (el.type === 'arrow' && p2) {
          return (
            <line
              key={el.id}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={el.color}
              strokeWidth={el.strokeWidth}
              strokeLinecap="round"
              markerEnd={`url(#arrow-${el.id})`}
              transform={transform}
              {...commonProps}
            />
          );
        } else if (el.type === 'rect' && p2) {
          const rx = Math.min(p1.x, p2.x), ry = Math.min(p1.y, p2.y);
          const rw = Math.abs(p1.x - p2.x), rh = Math.abs(p1.y - p2.y);
          return (
            <rect
              key={el.id}
              x={rx}
              y={ry}
              width={rw}
              height={rh}
              stroke={el.color}
              strokeWidth={el.strokeWidth}
              fill="none"
              transform={transform}
              {...commonProps}
            />
          );
        } else if (el.type === 'circle' && p2) {
          const r = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          return (
            <circle
              key={el.id}
              cx={p1.x}
              cy={p1.y}
              r={r}
              stroke={el.color}
              strokeWidth={el.strokeWidth}
              fill="none"
              transform={transform}
              {...commonProps}
            />
          );
        }
        return null;
      })}

      {/* Render Current Dragging element preview */}
      {currentElement && currentElement.points.length >= 2 && (() => {
        const p1 = currentElement.points[0]!, p2 = currentElement.points[1]!;
        const styleProps = {
          stroke: currentElement.color,
          strokeWidth: currentElement.strokeWidth,
          fill: 'none',
          strokeLinecap: 'round' as const,
        };

        if (currentElement.type === 'pencil') {
          return (
            <polygon
              points={currentElement.points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill={currentElement.color}
            />
          );
        } else if (currentElement.type === 'line') {
          return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} {...styleProps} />;
        } else if (currentElement.type === 'arrow') {
          return <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} markerEnd={`url(#arrow-${currentElement.id})`} {...styleProps} />;
        } else if (currentElement.type === 'rect') {
          const rx = Math.min(p1.x, p2.x), ry = Math.min(p1.y, p2.y);
          const rw = Math.abs(p1.x - p2.x), rh = Math.abs(p1.y - p2.y);
          return <rect x={rx} y={ry} width={rw} height={rh} {...styleProps} />;
        } else if (currentElement.type === 'circle') {
          const r = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          return <circle cx={p1.x} cy={p1.y} r={r} {...styleProps} />;
        }
        return null;
      })()}

      {/* Selected Element dashed bounding box overlay */}
      {activeTool === 'select' && selectedBounds && (
        <rect
          x={selectedBounds.x - 4}
          y={selectedBounds.y - 4}
          width={selectedBounds.w + 8}
          height={selectedBounds.h + 8}
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          className="pointer-events-none opacity-80"
        />
      )}
    </>
  );
};
