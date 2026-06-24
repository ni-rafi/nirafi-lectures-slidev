import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface RebarBbsLedgerDrawingProps {
  selectedRowIndex: number; // 0: Straight, 1: Cranked, 2: Stirrups
  className?: string;
}

export const RebarBbsLedgerDrawing: React.FC<RebarBbsLedgerDrawingProps> = ({
  selectedRowIndex,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Highlight colors
  const activeColor = 'var(--chart-1)';
  const dimColor = 'currentColor';
  const activeWidth = '3.5';
  const dimWidth = '1.5';

  const isStraightSelected = selectedRowIndex === 0;
  const isCrankedSelected = selectedRowIndex === 1;
  const isStirrupSelected = selectedRowIndex === 2;

  // Stirrup coordinates (multiple rectangles along the beam span)
  const stirrupPositions = [80, 110, 140, 170, 200, 230, 260, 290];

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        BBS Structural Detailing Visualizer
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 380 220"
        className="overflow-visible select-none"
      >
        {/* Concrete Beam Profile (Dashed Envelope) */}
        <rect
          x="50"
          y="50"
          width="280"
          height="100"
          fill="currentColor"
          className="text-foreground/5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.4"
        />
        <text x="55" y="45" className="fill-muted-foreground font-sans text-[8px] font-bold">
          CONCRETE BEAM ENVELOPE (CLEAR COVER = 25mm)
        </text>

        {/* 1. Main Straight Longitudinal Bars */}
        {/* Top Straight Bar */}
        <line
          x1="55"
          y1="60"
          x2="325"
          y2="60"
          stroke={isStraightSelected ? activeColor : dimColor}
          strokeWidth={isStraightSelected ? activeWidth : dimWidth}
          opacity={isStraightSelected ? '1' : '0.3'}
          className="transition-all duration-300"
        />
        {/* Bottom Straight Bar */}
        <line
          x1="55"
          y1="140"
          x2="325"
          y2="140"
          stroke={isStraightSelected ? activeColor : dimColor}
          strokeWidth={isStraightSelected ? activeWidth : dimWidth}
          opacity={isStraightSelected ? '1' : '0.3'}
          className="transition-all duration-300"
        />

        {/* 2. Cranked Slab/Beam Bar */}
        <path
          d="M 55,140 L 110,140 L 135,60 L 245,60 L 270,140 L 325,140"
          fill="none"
          stroke={isCrankedSelected ? activeColor : dimColor}
          strokeWidth={isCrankedSelected ? activeWidth : dimWidth}
          opacity={isCrankedSelected ? '1' : '0.3'}
          className="transition-all duration-300"
        />

        {/* 3. Transverse Stirrups */}
        {stirrupPositions.map((pos, idx) => (
          <rect
            key={`stirrup-${idx}`}
            x={pos}
            y="58"
            width="10"
            height="84"
            fill="none"
            stroke={isStirrupSelected ? activeColor : dimColor}
            strokeWidth={isStirrupSelected ? activeWidth : dimWidth}
            opacity={isStirrupSelected ? '1' : '0.3'}
            className="transition-all duration-300"
          />
        ))}

        {/* Dimension Lines & Annotation */}
        <g className="font-mono text-[9px] fill-muted-foreground">
          {isStraightSelected && (
            <g>
              <text x="190" y="180" textAnchor="middle" className="fill-chart-1 font-bold">
                Selected: Main Straight Bars (Ø16mm)
              </text>
              <text x="190" y="195" textAnchor="middle">
                Cut Length = Clear Span - 2 × Cover + 2 × Hook Additions
              </text>
            </g>
          )}
          {isCrankedSelected && (
            <g>
              <text x="190" y="180" textAnchor="middle" className="fill-chart-1 font-bold">
                Selected: Cranked Rebar (Ø12mm)
              </text>
              <text x="190" y="195" textAnchor="middle">
                Cut Length = Straight Length + 2 × Crank Addition (+0.42D)
              </text>
            </g>
          )}
          {isStirrupSelected && (
            <g>
              <text x="190" y="180" textAnchor="middle" className="fill-chart-1 font-bold">
                Selected: Transverse Stirrups (Ø8mm)
              </text>
              <text x="190" y="195" textAnchor="middle">
                Stirrup Count = (Span / Spacing) + 1. Loop perimeter = 2(A+B) + hook.
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

export default RebarBbsLedgerDrawing;
