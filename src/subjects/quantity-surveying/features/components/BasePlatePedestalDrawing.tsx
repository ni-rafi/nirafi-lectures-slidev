import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface BasePlatePedestalDrawingProps {
  plateLengthMm: number;
  plateWidthMm: number;
  plateThicknessMm: number;
  boltCount: number;
  boltDiameterMm: number;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'plate' | 'bolts' | 'pedestal';
}

export const BasePlatePedestalDrawing: React.FC<BasePlatePedestalDrawingProps> = ({
  plateLengthMm,
  plateWidthMm,
  plateThicknessMm,
  boltCount,
  boltDiameterMm,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Scales for drawing (fit inside 450x220 viewBox)
  // Max plateLength is ~600mm. We scale to about 200px width max.
  const scale = 200 / 600; 

  const pLength = plateLengthMm * scale;
  const pThick = Math.max(4, plateThicknessMm * scale * 1.5); // minimum thickness for visual clarity
  const bDia = Math.max(3, boltDiameterMm * scale * 1.5);

  const cx = 225; // center x
  const cy = 110; // center y

  // Pedestal box parameters (concrete block)
  const pedWidth = pLength + 60; // pedestal is wider than plate
  const pedHeight = 80;
  const pedTop = cy + 10;
  const pedLeft = cx - pedWidth / 2;

  // Base plate bounds
  const plateTop = pedTop - pThick;
  const plateLeft = cx - pLength / 2;

  // Column profile (simplified ISMB profile on top)
  const colWidth = Math.max(30, pLength * 0.4);
  const colHeight = 50;
  const colLeft = cx - colWidth / 2;
  const colTop = plateTop - colHeight;

  // Bolt positions (drawing 2 bolts in front elevation, or more if 6)
  // Let's place them symmetrically
  const boltOffset = pLength * 0.35;
  const leftBoltX = cx - boltOffset;
  const rightBoltX = cx + boltOffset;

  const isPlateHighlighted = activeHighlight === 'plate';
  const isBoltsHighlighted = activeHighlight === 'bolts';
  const isPedestalHighlighted = activeHighlight === 'pedestal';
  const hasHighlightActive = activeHighlight !== 'none';

  const plateOpacity = isPlateHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const boltsOpacity = isBoltsHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const pedestalOpacity = isPedestalHighlighted ? 'opacity-100' : hasHighlightActive ? 'opacity-15' : 'opacity-100';
  const restOpacity = hasHighlightActive ? 'opacity-15' : 'opacity-100';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Base Plate & Pedestal Interface
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Concrete Pedestal */}
        <g className={`transition-opacity duration-300 ${pedestalOpacity}`}>
          <rect
            x={pedLeft}
            y={pedTop}
            width={pedWidth}
            height={pedHeight}
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))"
            stroke={isPedestalHighlighted ? 'var(--chart-3)' : 'currentColor'}
            strokeWidth={isPedestalHighlighted ? '2.5' : '1.5'}
            strokeDasharray={isPedestalHighlighted ? 'none' : '4,2'}
            className="text-muted-foreground/50 transition-all duration-300"
          />
          {/* Concrete texture/dots */}
          <g fill="currentColor" className="text-muted-foreground/30">
            <circle cx={pedLeft + 20} cy={pedTop + 20} r="1.5" />
            <circle cx={pedLeft + pedWidth - 30} cy={pedTop + 40} r="1" />
            <circle cx={cx - 50} cy={pedTop + 50} r="1.5" />
            <circle cx={cx + 60} cy={pedTop + 30} r="1" />
            <circle cx={pedLeft + 40} cy={pedTop + 60} r="1" />
          </g>
          <text x={cx} y={pedTop + pedHeight - 15} textAnchor="middle" className="font-sans text-[10px] fill-muted-foreground font-bold">
            Concrete Pedestal
          </text>
        </g>

        {/* Steel Base Plate */}
        <rect
          x={plateLeft}
          y={plateTop}
          width={pLength}
          height={pThick}
          fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth={isPlateHighlighted ? '3.5' : '2'}
          className={`transition-all duration-300 ${plateOpacity}`}
        />

        {/* Column (Resting on plate) */}
        <g className={`transition-opacity duration-300 ${restOpacity}`}>
          <path
            d={`M ${colLeft},${colTop} h ${colWidth} v ${colHeight} h -${colWidth} Z`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* I-beam flanges indicator */}
          <line x1={colLeft + 5} x2={colLeft + 5} y1={colTop} y2={plateTop} stroke="currentColor" strokeWidth="1" />
          <line x1={cx - colWidth / 2} x2={cx + colWidth / 2} y1={plateTop - 1} y2={plateTop - 1} stroke="currentColor" strokeWidth="3" />
          <text x={cx} y={colTop + 25} textAnchor="middle" className="font-mono text-[9px] fill-muted-foreground">
            Steel Column
          </text>
        </g>

        {/* Anchor Bolts */}
        {/* Left Bolt */}
        <g className={`transition-all duration-300 ${boltsOpacity}`}>
          {/* Embedded part (dashed/solid inside concrete) */}
          <line
            x1={leftBoltX}
            y1={pedTop}
            x2={leftBoltX}
            y2={pedTop + 50}
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            strokeDasharray="3,3"
            className="transition-colors duration-300"
          />
          {/* Hook at the bottom */}
          <path
            d={`M ${leftBoltX},${pedTop + 50} c 0,10 -15,10 -15,0`}
            fill="none"
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            strokeDasharray="3,3"
            className="transition-colors duration-300"
          />
          {/* Projected part above pedestal through plate */}
          <line
            x1={leftBoltX}
            y1={plateTop}
            x2={leftBoltX}
            y2={plateTop - 15}
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            className="transition-colors duration-300"
          />
          {/* Nut and Washer */}
          <rect
            x={leftBoltX - bDia - 2}
            y={plateTop - 6}
            width={bDia * 2 + 4}
            height="5"
            fill={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            className="transition-colors duration-300"
            rx="1"
          />
        </g>

        {/* Right Bolt */}
        <g className={`transition-all duration-300 ${boltsOpacity}`}>
          <line
            x1={rightBoltX}
            y1={pedTop}
            x2={rightBoltX}
            y2={pedTop + 50}
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            strokeDasharray="3,3"
            className="transition-colors duration-300"
          />
          <path
            d={`M ${rightBoltX},${pedTop + 50} c 0,10 15,10 15,0`}
            fill="none"
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            strokeDasharray="3,3"
            className="transition-colors duration-300"
          />
          <line
            x1={rightBoltX}
            y1={plateTop}
            x2={rightBoltX}
            y2={plateTop - 15}
            stroke={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            strokeWidth={bDia}
            className="transition-colors duration-300"
          />
          <rect
            x={rightBoltX - bDia - 2}
            y={plateTop - 6}
            width={bDia * 2 + 4}
            height="5"
            fill={isBoltsHighlighted ? 'var(--chart-2)' : 'currentColor'}
            className="transition-colors duration-300"
            rx="1"
          />
        </g>

        {/* Annotations & Dimension Labels */}
        {showAnnotation && (
          <g className="font-mono text-[9.5px] fill-muted-foreground font-bold">
            {/* Plate length */}
            <g className={`transition-opacity duration-300 ${plateOpacity}`}>
              <line x1={plateLeft} y1={plateTop - 10} x2={cx - 15} y2={plateTop - 10} stroke="currentColor" strokeWidth="0.5" />
              <line x1={cx + 15} y1={plateTop - 10} x2={plateLeft + pLength} y2={plateTop - 10} stroke="currentColor" strokeWidth="0.5" />
              <text x={cx} y={plateTop - 7} textAnchor="middle" className="fill-chart-1 font-bold">
                L = {plateLengthMm} mm, B = {plateWidthMm} mm
              </text>
            </g>

            {/* Plate Thickness */}
            <g className={`transition-opacity duration-300 ${plateOpacity}`}>
              <path d={`M ${plateLeft - 15},${plateTop} H ${plateLeft - 2}`} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${plateLeft - 15},${pedTop} H ${plateLeft - 2}`} stroke="currentColor" strokeWidth="0.5" />
              <line x1={plateLeft - 10} y1={plateTop} x2={plateLeft - 10} y2={pedTop} stroke="currentColor" strokeWidth="0.5" />
              <text x={plateLeft - 18} y={plateTop + pThick/2 + 3} textAnchor="end" className="fill-chart-1 font-bold">
                t = {plateThicknessMm} mm
              </text>
            </g>

            {/* Bolt label */}
            <g className={`transition-opacity duration-300 ${boltsOpacity}`}>
              <text x={rightBoltX + 15} y={plateTop - 15} textAnchor="start" className="fill-chart-2 font-bold">
                {boltCount} Nos Anchor Bolts
              </text>
              <text x={rightBoltX + 15} y={plateTop - 5} textAnchor="start" className="fill-muted-foreground text-[8px]">
                Dia (d) = {boltDiameterMm} mm
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default BasePlatePedestalDrawing;
