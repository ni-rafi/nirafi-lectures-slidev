import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

export interface InspectionPitDrawingProps {
  activeHighlight?: 'none' | 'excavation' | 'concrete' | 'brickwork';
  className?: string;
}

export const InspectionPitDrawing: React.FC<InspectionPitDrawingProps> = ({
  activeHighlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/60 bg-muted/10 dark:bg-muted/5 rounded-xl p-1.5 flex flex-col items-center shadow-xs select-none w-full justify-center ${className}`;

  // Highlight colors
  const activeColor = '#10b981'; // emerald-500
  const defaultStroke = 'currentColor';

  const isExcavationActive = activeHighlight === 'excavation';
  const isConcreteActive = activeHighlight === 'concrete';
  const isBrickworkActive = activeHighlight === 'brickwork';

  return (
    <div className={containerClasses}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-0.5">
        Inspection Pit Detail Cross-Section
      </span>
      <svg
        width="100%"
        height="150"
        viewBox="0 0 320 180"
        className="overflow-visible select-none text-foreground"
      >
        {/* Ground level line */}
        <line x1="20" y1="35" x2="300" y2="35" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" className="text-muted-foreground/40" />
        <text x="25" y="30" className="font-mono text-[8px] fill-muted-foreground">G.L.</text>

        {/* 1. Earthwork Excavation Boundary (Highlighted when isExcavationActive) */}
        <path
          d="M 40,35 V 170 H 280 V 35"
          fill="none"
          stroke={isExcavationActive ? activeColor : 'transparent'}
          strokeWidth="3"
          strokeDasharray="4,4"
          className="transition-all duration-300"
        />
        {isExcavationActive && (
          <text x="160" y="25" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
            Excavation Boundary: Earthwork (m³)
          </text>
        )}

        {/* 2. Concrete Base (Highlighted when isConcreteActive) */}
        <rect
          x="50"
          y="150"
          width="220"
          height="20"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={isConcreteActive ? activeColor : defaultStroke}
          strokeWidth={isConcreteActive ? '3' : '1.5'}
          className={isConcreteActive ? '' : 'text-foreground/40'}
        />
        {/* Concrete hatch representation */}
        <line x1="60" y1="160" x2="65" y2="160" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
        <line x1="120" y1="160" x2="125" y2="160" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
        <line x1="180" y1="160" x2="185" y2="160" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
        <line x1="240" y1="160" x2="245" y2="160" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
        {isConcreteActive && (
          <text x="160" y="140" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
            CC Base (1:3:6): Foundation Cushion (m³)
          </text>
        )}

        {/* 3. Brick Masonry Walls (Highlighted when isBrickworkActive) */}
        {/* Left Wall */}
        <rect
          x="60"
          y="40"
          width="25"
          height="110"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={isBrickworkActive ? activeColor : defaultStroke}
          strokeWidth={isBrickworkActive ? '3' : '1.5'}
          className={isBrickworkActive ? '' : 'text-foreground/40'}
        />
        {/* Right Wall */}
        <rect
          x="235"
          y="40"
          width="25"
          height="110"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={isBrickworkActive ? activeColor : defaultStroke}
          strokeWidth={isBrickworkActive ? '3' : '1.5'}
          className={isBrickworkActive ? '' : 'text-foreground/40'}
        />
        {/* Brick diagonal hatch lines */}
        {[50, 70, 90, 110, 130].map((y, idx) => (
          <g key={`brick-hatch-${idx}`} className="text-muted-foreground/20">
            <line x1="60" y1={y} x2="85" y2={y + 10} stroke="currentColor" strokeWidth="0.8" />
            <line x1="235" y1={y} x2="260" y2={y + 10} stroke="currentColor" strokeWidth="0.8" />
          </g>
        ))}
        {isBrickworkActive && (
          <text x="160" y="100" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
            1st Class Brickwork (1:4 Mortar) (m³)
          </text>
        )}

        {/* Inlet Pipe */}
        <path d="M 20,70 H 60" fill="none" stroke="currentColor" strokeWidth="4" className="text-chart-1/80" />
        <text x="25" y="62" className="font-mono text-[8px] fill-muted-foreground font-semibold">Inlet (From House)</text>

        {/* Outlet Pipe */}
        <path d="M 260,90 H 300" fill="none" stroke="currentColor" strokeWidth="4" className="text-chart-1/80" />
        <text x="295" y="82" textAnchor="end" className="font-mono text-[8px] fill-muted-foreground font-semibold">Outlet (To Septic Tank)</text>

        {/* Cast Iron Cover (Access Cover) */}
        <rect x="110" y="32" width="100" height="8" fill="currentColor" className="text-muted-foreground" rx="1" />
        <text x="160" y="22" textAnchor="middle" className="font-sans text-[8px] fill-muted-foreground font-bold">C.I. Manhole Cover (Nos.)</text>
      </svg>
    </div>
  );
};

export default InspectionPitDrawing;
