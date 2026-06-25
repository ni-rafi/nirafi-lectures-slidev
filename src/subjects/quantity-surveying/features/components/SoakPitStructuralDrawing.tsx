import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface SoakPitStructuralProps {
  activeHighlight?: 'none' | 'honeycomb' | 'solid' | 'curb';
  className?: string;
}

export const SoakPitStructuralDrawing: React.FC<SoakPitStructuralProps> = ({
  activeHighlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const showHoneycomb = activeHighlight === 'none' || activeHighlight === 'honeycomb';
  const showSolid = activeHighlight === 'none' || activeHighlight === 'solid';
  const showCurb = activeHighlight === 'none' || activeHighlight === 'curb';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/60 bg-muted/10 dark:bg-muted/5 rounded-xl p-1.5 flex flex-col items-center shadow-xs select-none w-full justify-center ${className}`;

  // Dimensions
  const lwcx = 100; // Left wall outer x
  const rwcx = 290; // Right wall inner x
  const wallW = 25;  // Wall thickness (250mm)
  const curbW = 35;  // Curb width (350mm)
  
  const curbY = 155;
  const honeycombY = 75;
  const solidY = 30;

  return (
    <div className={containerClasses}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-0.5">
        Soak Pit Enclosure &amp; Curb Cross-Section
      </span>
      <svg
        width="100%"
        height="150"
        viewBox="0 0 450 180"
        className="overflow-visible select-none text-foreground"
      >
        {/* Soil profile backdrop */}
        <line x1="20" y1="40" x2="430" y2="40" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" className="text-muted-foreground/30" />
        <text x="390" y="32" className="fill-muted-foreground text-[11px] font-mono">G.L.</text>

        {/* --- R.C.C. Well Curb (Bottom Ring) --- */}
        <g opacity={showCurb ? '1' : '0.15'} className="transition-all duration-300">
          {/* Left Curb */}
          <rect
            x={lwcx - 5}
            y={curbY}
            width={curbW}
            height="20"
            fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.1))"
            stroke="var(--chart-3, #10b981)"
            strokeWidth="1.8"
            rx="1"
          />
          {/* Right Curb */}
          <rect
            x={rwcx - 5}
            y={curbY}
            width={curbW}
            height="20"
            fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.1))"
            stroke="var(--chart-3, #10b981)"
            strokeWidth="1.8"
            rx="1"
          />
          {/* Rebar inside Curb */}
          <rect x={lwcx} y={curbY + 4} width={curbW - 10} height="12" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2,2" />
          <rect x={rwcx} y={curbY + 4} width={curbW - 10} height="12" fill="none" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2,2" />
          
          <text x="330" y="168" className="fill-chart-3 font-mono text-[11px] font-bold">
            RCC Well Curb (1% Steel)
          </text>
        </g>

        {/* --- Solid Brickwork (Upper Collar) --- */}
        <g opacity={showSolid ? '1' : '0.15'} className="transition-all duration-300 text-chart-2">
          {/* Left Solid */}
          <rect
            x={lwcx}
            y={solidY}
            width={wallW}
            height="45"
            fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.05))"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          {/* Right Solid */}
          <rect
            x={rwcx}
            y={solidY}
            width={wallW}
            height="45"
            fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.05))"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <text x="330" y="55" className="fill-chart-2 font-mono text-[11px] font-bold">
            Solid Brickwork (250mm)
          </text>
        </g>

        {/* --- Honeycomb Brickwork (Perforated Seepage Walls) --- */}
        <g opacity={showHoneycomb ? '1' : '0.15'} className="transition-all duration-300 text-chart-1">
          {/* Left Honeycomb courses */}
          <g>
            <rect x={lwcx} y={honeycombY} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 12} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx + 17} y={honeycombY + 12} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 24} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 36} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx + 17} y={honeycombY + 36} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 48} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 60} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx + 17} y={honeycombY + 60} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={lwcx} y={honeycombY + 72} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
          </g>

          {/* Right Honeycomb courses */}
          <g>
            <rect x={rwcx} y={honeycombY} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 12} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx + 17} y={honeycombY + 12} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 24} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 36} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx + 17} y={honeycombY + 36} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 48} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 60} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx + 17} y={honeycombY + 60} width="8" height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
            <rect x={rwcx} y={honeycombY + 72} width={wallW} height="8" fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.2))" stroke="currentColor" strokeWidth="0.8" />
          </g>

          {/* Seepage arrows showing effluent flow */}
          <path d="M 100,110 h -15 M 100,134 h -15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <polygon points="85,110 90,107 90,113" fill="currentColor" />
          <polygon points="85,134 90,131 90,137" fill="currentColor" />

          <path d="M 315,110 h 15 M 315,134 h 15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <polygon points="330,110 325,107 325,113" fill="currentColor" />
          <polygon points="330,134 325,131 325,137" fill="currentColor" />

          <text x="330" y="110" className="fill-chart-1 font-mono text-[11px] font-bold">
            Honeycomb Brick (250mm)
          </text>
          <text x="330" y="125" className="fill-chart-1 font-mono text-[11px]">
            • 25% Seepage Voids
          </text>
        </g>

        {/* Aggregate filling representation inside the center pit */}
        <g opacity="0.35" className="text-muted-foreground/40">
          <circle cx="160" cy="140" r="4" fill="currentColor" />
          <circle cx="180" cy="145" r="5" fill="currentColor" />
          <circle cx="210" cy="138" r="4.5" fill="currentColor" />
          <circle cx="240" cy="142" r="3.8" fill="currentColor" />
          <circle cx="260" cy="148" r="5.2" fill="currentColor" />
          <text x="160" y="90" className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
            Aggregate Filter Core
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SoakPitStructuralDrawing;
