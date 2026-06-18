import React from 'react';
import { useClickStepsContext } from '../../context/ClickStepsContext';
import { ShapeMorph } from './ShapeMorph';
import { VisualCanvasShape, PhysicalUnit } from '../../types/schema';

interface SlideVisualCanvasProps {
  elements: VisualCanvasShape[];
  scaleFactor?: {
    pixelsPerUnit: number;
    unit: PhysicalUnit;
  };
  editable?: boolean;
  onLabelClick?: (
    elementId: string,
    dimensionKey: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2',
    currentValue: number,
    clientX: number,
    clientY: number
  ) => void;
  showLayoutBodyBorder?: boolean;
}

export const SlideVisualCanvas: React.FC<SlideVisualCanvasProps> = ({
  elements,
  scaleFactor = { pixelsPerUnit: 150, unit: 'm' },
  editable = false,
  onLabelClick,
  showLayoutBodyBorder = false,
}) => {
  const { currentClick } = useClickStepsContext();

  const handleLabelPointerDown = (
    e: React.MouseEvent,
    elId: string,
    key: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2',
    val: number
  ) => {
    if (!editable || !onLabelClick) return;
    e.stopPropagation();
    onLabelClick(elId, key, val, e.clientX, e.clientY);
  };

  const renderDimLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    labelText: string,
    dimKey: 'length' | 'height' | 'diameter' | 'diagonal1' | 'diagonal2',
    val: number,
    elId: string,
    isDotted = false
  ) => {
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const isVertical = Math.abs(x1 - x2) < 2;
    const textAngle = isVertical ? -90 : 0;

    return (
      <g className="select-none font-mono">
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={isDotted ? '3 3' : undefined}
          markerStart={isDotted ? undefined : 'url(#dim-arrow)'}
          markerEnd={isDotted ? undefined : 'url(#dim-arrow)'}
          className="text-primary/70"
        />
        <g
          transform={`translate(${cx}, ${cy}) rotate(${textAngle})`}
          onClick={(e) => handleLabelPointerDown(e, elId, dimKey, val)}
          className={editable ? 'cursor-pointer hover:text-primary' : ''}
        >
          <rect
            x="-24"
            y="-7"
            width="48"
            height="14"
            fill="var(--background, #030712)"
            rx="3"
            className="stroke-border/30 stroke-[0.5]"
          />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fontWeight="bold"
            className="fill-foreground font-sans tracking-wide"
          >
            {labelText}
          </text>
        </g>
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 980 551.25"
      className="w-full h-full overflow-visible pointer-events-none select-none"
    >
      <defs>
        <marker
          id="dim-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 2 L 10 5 L 0 8 z" fill="currentColor" className="text-primary/70" />
        </marker>
        <marker
          id="canvas-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="currentColor" className="text-primary" />
        </marker>
      </defs>

      {showLayoutBodyBorder && (
        <g className="pointer-events-none">
          <rect
            x="40"
            y="85"
            width="900"
            height="425"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            className="opacity-20"
          />
          <text
            x="45"
            y="78"
            fontSize="9"
            fontWeight="bold"
            className="fill-primary font-mono opacity-40 tracking-wider"
          >
            LAYOUT BODY BOUNDS (SAFE AREA)
          </text>
        </g>
      )}

      {elements.map((el) => {
        const isVisible =
          editable ||
          (currentClick >= el.enterAt && (el.exitAt === undefined || currentClick < el.exitAt));
        if (!isVisible) return null;

        const transform = `translate(${el.x}, ${el.y}) rotate(${el.rotate || 0})`;
        const fill = el.fill || 'var(--primary)';
        const stroke = el.stroke || 'rgba(255,255,255,0.15)';
        const sw = el.strokeWidth || 1.5;
        const animationClass =
          !editable && el.animation && el.animation !== 'none'
            ? `slidev-vclick-anim-${el.animation}`
            : '';

        const cx = el.x + el.w / 2;
        const cy = el.y + el.h / 2;

        return (
          <g key={el.id} className={`${animationClass} pointer-events-auto`}>
            {/* Draw standard visual shapes */}
            {el.type === 'arrow' ? (
              <line
                x1={el.x}
                y1={el.y}
                x2={el.x + el.w}
                y2={el.y + el.h}
                stroke={fill}
                strokeWidth={el.strokeWidth || 3.5}
                markerEnd="url(#canvas-arrow)"
              />
            ) : el.type === 'text' ? (
              <text
                x={el.x}
                y={el.y}
                transform={`rotate(${el.rotate || 0}, ${el.x}, ${el.y})`}
                className="fill-foreground font-mono text-[11px] font-bold"
              >
                {el.label || 'Text'}
              </text>
            ) : (
              <g transform={transform}>
                <foreignObject width={el.w} height={el.h} className="overflow-visible">
                  <div className="w-full h-full flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full overflow-visible">
                      <ShapeMorph
                        type={el.type}
                        w={el.w}
                        h={el.h}
                        points={el.points}
                        borderRadius={el.borderRadius}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={sw}
                      />
                    </svg>
                    {el.label && (
                      <span className="relative z-10 text-[9px] font-mono font-bold text-foreground text-center px-1">
                        {el.label}
                      </span>
                    )}
                  </div>
                </foreignObject>
              </g>
            )}

            {/* Architectural Dimension Annotations overlay */}
            {el.showDimensionLines && el.dimensions && (() => {
              const dims = el.dimensions;
              const unit = scaleFactor.unit;
              const offset = 20;

              if (el.type === 'circle' && dims.diameter !== undefined) {
                const r = Math.min(el.w, el.h) / 2;
                const dx = r * Math.cos(Math.PI / 4);
                const dy = r * Math.sin(Math.PI / 4);
                return renderDimLine(
                  cx - dx,
                  cy + dy,
                  cx + dx,
                  cy - dy,
                  `ø ${dims.diameter}${unit}`,
                  'diameter',
                  dims.diameter,
                  el.id
                );
              }

              if (el.type === 'triangle') {
                const baseVal = dims.length || 0;
                const heightVal = dims.height || 0;
                return (
                  <g>
                    {/* Base */}
                    {renderDimLine(
                      el.x,
                      el.y + el.h + offset,
                      el.x + el.w,
                      el.y + el.h + offset,
                      `b: ${baseVal}${unit}`,
                      'length',
                      baseVal,
                      el.id
                    )}
                    {/* Height altitude */}
                    {renderDimLine(
                      cx,
                      el.y,
                      cx,
                      el.y + el.h,
                      `h: ${heightVal}${unit}`,
                      'height',
                      heightVal,
                      el.id,
                      true
                    )}
                  </g>
                );
              }

              if (el.type === 'rhombus') {
                const d1Val = dims.diagonal1 || 0;
                const d2Val = dims.diagonal2 || 0;
                return (
                  <g>
                    {renderDimLine(
                      el.x,
                      cy,
                      el.x + el.w,
                      cy,
                      `d1: ${d1Val}${unit}`,
                      'diagonal1',
                      d1Val,
                      el.id,
                      true
                    )}
                    {renderDimLine(
                      cx,
                      el.y,
                      cx,
                      el.y + el.h,
                      `d2: ${d2Val}${unit}`,
                      'diagonal2',
                      d2Val,
                      el.id,
                      true
                    )}
                  </g>
                );
              }

              // Default standard Horizontal / Vertical bounds (Rectangle, Hexagon, Star, Heart, Cross, etc.)
              const wVal = dims.length || 0;
              const hVal = dims.height || 0;
              return (
                <g>
                  {wVal > 0 &&
                    renderDimLine(
                      el.x,
                      el.y + el.h + offset,
                      el.x + el.w,
                      el.y + el.h + offset,
                      `${wVal}${unit}`,
                      'length',
                      wVal,
                      el.id
                    )}
                  {hVal > 0 &&
                    renderDimLine(
                      el.x + el.w + offset,
                      el.y,
                      el.x + el.w + offset,
                      el.y + el.h,
                      `${hVal}${unit}`,
                      'height',
                      hVal,
                      el.id
                    )}
                </g>
              );
            })()}
          </g>
        );
      })}
    </svg>
  );
};

export default SlideVisualCanvas;
