import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface GussetPlateBoundingDrawingProps {
  widthMm: number;
  heightMm: number;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'gusset' | 'envelope';
}

export const GussetPlateBoundingDrawing: React.FC<GussetPlateBoundingDrawingProps> = ({
  widthMm,
  heightMm,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Scales for drawing (fit inside 450x220 viewBox)
  // Max dimension is ~500mm. We scale to about 150px.
  const scale = 140 / 500;

  const w = widthMm * scale;
  const h = heightMm * scale;

  const cx = 225; // center x
  const cy = 110; // center y

  const left = cx - w / 2;
  const right = cx + w / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;

  // Let's define the points of an irregular polygonal gusset plate
  // It must touch the bounding box boundaries to justify the circumscribed rect:
  // - Top at some x: topPoint = (cx, top)
  // - Right at some y: rightPoint = (right, cy + h*0.1)
  // - Bottom at some x: bottomPoint1 = (cx + w*0.3, bottom), bottomPoint2 = (cx - w*0.3, bottom)
  // - Left at some y: leftPoint = (left, cy - h*0.2)
  const ptTop = `${cx},${top}`;
  const ptRight = `${right},${cy + h * 0.1}`;
  const ptBottomRight = `${cx + w * 0.3},${bottom}`;
  const ptBottomLeft = `${cx - w * 0.3},${bottom}`;
  const ptLeft = `${left},${cy - h * 0.2}`;

  const polyPoints = `${ptTop} ${ptRight} ${ptBottomRight} ${ptBottomLeft} ${ptLeft}`;

  const isGussetHighlighted = activeHighlight === 'gusset';
  const isEnvelopeHighlighted = activeHighlight === 'envelope';
  const hasHighlightActive = activeHighlight !== 'none';

  const gussetOpacity = isGussetHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const envelopeOpacity = isEnvelopeHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const restOpacity = hasHighlightActive ? 'opacity-15' : 'opacity-100';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Gusset Plate Envelope Rule
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Gross Bounding Box (Minimum Circumscribing Rectangle) */}
        <rect
          x={left}
          y={top}
          width={w}
          height={h}
          fill="none"
          stroke="var(--chart-2, #eab308)"
          strokeWidth={isEnvelopeHighlighted ? '3.5' : '1.5'}
          strokeDasharray={isEnvelopeHighlighted ? 'none' : '4,3'}
          className={`transition-all duration-300 ${envelopeOpacity}`}
        />

        {/* Shaded area outside the gusset plate but inside the bounding box (waste) */}
        <polygon
          points={polyPoints}
          fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.15))"
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={isGussetHighlighted ? '3.5' : '2.5'}
          strokeLinejoin="round"
          className={`transition-all duration-300 ${gussetOpacity}`}
        />

        {/* Bolt Holes on Gusset Plate */}
        <g fill="currentColor" className={`text-muted-foreground/80 transition-opacity duration-300 ${gussetOpacity}`}>
          <circle cx={cx} cy={top + 15} r="3" />
          <circle cx={cx - w * 0.15} cy={cy} r="3" />
          <circle cx={cx + w * 0.15} cy={cy} r="3" />
          <circle cx={cx - w * 0.2} cy={bottom - 15} r="3" />
          <circle cx={cx + w * 0.2} cy={bottom - 15} r="3" />
        </g>

        {/* Member outlines connecting to the gusset plate (dashed lines indicating structural angles) */}
        <g stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" className={`text-muted-foreground/30 transition-opacity duration-300 ${restOpacity}`}>
          {/* Top member */}
          <line x1={cx} y1={top - 30} x2={cx} y2={top + 20} strokeWidth="6" />
          {/* Bottom left member */}
          <line x1={left - 20} y1={bottom} x2={cx - w * 0.2} y2={bottom - 15} strokeWidth="6" />
          {/* Bottom right member */}
          <line x1={right + 20} y1={bottom} x2={cx + w * 0.2} y2={bottom - 15} strokeWidth="6" />
        </g>

        {/* Dimension Indicators */}
        {showAnnotation && (
          <g className="font-mono text-[9.5px] fill-muted-foreground font-bold">
            {/* Bounding Width Label */}
            <g className={`transition-opacity duration-300 ${envelopeOpacity}`}>
              <line x1={left} y1={bottom + 15} x2={right} y2={bottom + 15} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${left},${bottom + 12} L ${left},${bottom + 18} M ${right},${bottom + 12} L ${right},${bottom + 18}`} />
              <text x={cx} y={bottom + 27} textAnchor="middle" className="fill-chart-2 font-bold">
                Envelope Width (W) = {widthMm} mm
              </text>
            </g>

            {/* Bounding Height Label */}
            <g className={`transition-opacity duration-300 ${envelopeOpacity}`}>
              <line x1={right + 15} y1={top} x2={right + 15} y2={bottom} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${right + 12},${top} H ${right + 18} M ${right + 12},${bottom} H ${right + 18}`} />
              <text x={right + 22} y={cy + 3} textAnchor="start" className="fill-chart-2 font-bold">
                Envelope Height (H) = {heightMm} mm
              </text>
            </g>

            {/* Explanatory pointers */}
            <g className={`transition-opacity duration-300 ${gussetOpacity}`}>
              <text x={cx} y={cy - 15} textAnchor="middle" className="fill-chart-1 font-bold text-[8px]">
                Irregular Gusset Plate
              </text>
              <text x={cx} y={cy - 5} textAnchor="middle" className="fill-muted-foreground text-[7.5px] font-normal">
                (Net Vol. is less than Gross)
              </text>
            </g>

            <g className={`transition-opacity duration-300 ${envelopeOpacity}`}>
              <rect x="20" y="10" width="130" height="42" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
              <text x="25" y="22" textAnchor="start" className="fill-foreground text-[8px] font-bold">IS:1200 Standard Rule:</text>
              <text x="25" y="34" textAnchor="start" className="fill-chart-2 text-[7.5px] font-bold">Gross Bounding Box</text>
              <text x="25" y="44" textAnchor="start" className="fill-muted-foreground text-[7px] font-normal">area is used for billing.</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default GussetPlateBoundingDrawing;
