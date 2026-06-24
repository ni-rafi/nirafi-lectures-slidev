import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface MepSubNetworksProps {
  highlight?: 'none' | 'rwp' | 'gas' | 'all';
  className?: string;
}

export const MepSubNetworksDrawing: React.FC<MepSubNetworksProps> = ({
  highlight = 'all',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const showRwp = highlight === 'all' || highlight === 'rwp';
  const showGas = highlight === 'all' || highlight === 'gas';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Floor heights (y coordinates)
  const f1Y = 150;
  const f2Y = 110;
  const f3Y = 70;


  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Secondary MEP Pipeline Sub-Networks Elevation
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 520 220"
        className="overflow-visible select-none"
      >
        {/* Building Facade Backdrop */}
        <rect
          x="120"
          y="25"
          width="280"
          height="170"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.02))"
          stroke="currentColor"
          strokeWidth="0.8"
          className="text-muted-foreground/30"
        />

        {/* Floor Slab Lines */}
        <line x1="120" y1={f1Y} x2="400" y2={f1Y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-muted-foreground/30" />
        <line x1="120" y1={f2Y} x2="400" y2={f2Y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-muted-foreground/30" />
        <line x1="120" y1={f3Y} x2="400" y2={f3Y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" className="text-muted-foreground/30" />
        
        {/* Roof Gutter (slanted) */}
        <polygon
          points="110,20 410,22 410,27 110,25"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.2))"
          stroke="currentColor"
          strokeWidth="0.8"
        />
        <text x="135" y="16" className="font-mono fill-muted-foreground text-[11px] font-semibold">
          Roof Rain Gutter
        </text>

        {/* Drainage Gullies / Surface Channels at Ground */}
        <rect x="90" y="190" width="340" height="10" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))" stroke="currentColor" strokeWidth="0.8" />
        <text x="435" y="198" className="font-mono fill-muted-foreground text-[11px]">
          Drain
        </text>

        {/* --- Rainwater Downpipe (RWP) Pathway --- */}
        <g opacity={showRwp ? '1' : '0.15'} className="transition-all duration-300">
          {/* Left RWP Drop */}
          <line
            x1="135"
            y1="23"
            x2="135"
            y2="190"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Right RWP Drop */}
          <line
            x1="385"
            y1="23"
            x2="385"
            y2="190"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Wall clamping brackets along RWP */}
          <rect x="132" y="65" width="6" height="2" fill="currentColor" />
          <rect x="132" y="125" width="6" height="2" fill="currentColor" />
          <rect x="382" y="65" width="6" height="2" fill="currentColor" />
          <rect x="382" y="125" width="6" height="2" fill="currentColor" />

          {/* Shoe/bend at bottom */}
          <path d="M 135,190 q 0,5 -5,5" fill="none" stroke="var(--chart-1, #3b82f6)" strokeWidth="3.5" />
          <path d="M 385,190 q 0,5 5,5" fill="none" stroke="var(--chart-1, #3b82f6)" strokeWidth="3.5" />

          <text x="25" y="100" className="font-mono fill-chart-1 text-[11px] font-bold">
            uPVC Rainwater
          </text>
          <text x="25" y="115" className="font-mono fill-chart-1 text-[11px] font-bold">
            Downpipe (RWP)
          </text>
          <text x="145" y="60" className="font-mono fill-muted-foreground text-[11px]">
            Clamped Drop
          </text>
        </g>

        {/* --- Gas Connection Sub-network --- */}
        <g opacity={showGas ? '1' : '0.15'} className="transition-all duration-300">
          {/* Main Gas Riser (Threaded M.S.) */}
          <line
            x1="320"
            y1="190"
            x2="320"
            y2="50"
            stroke="var(--chart-2, #eab308)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Floor 1 Branch */}
          <line x1="320" y1="160" x2="250" y2="160" stroke="var(--chart-2, #eab308)" strokeWidth="1.8" />
          {/* Floor 2 Branch */}
          <line x1="320" y1="120" x2="250" y2="120" stroke="var(--chart-2, #eab308)" strokeWidth="1.8" />
          {/* Floor 3 Branch */}
          <line x1="320" y1="80" x2="250" y2="80" stroke="var(--chart-2, #eab308)" strokeWidth="1.8" />

          {/* Branch isolation valves (stop cocks) */}
          <circle cx="320" cy="160" r="3.5" fill="currentColor" className="text-primary" />
          <circle cx="320" cy="120" r="3.5" fill="currentColor" className="text-primary" />
          <circle cx="320" cy="80" r="3.5" fill="currentColor" className="text-primary" />

          {/* Labels */}
          <text x="210" y="75" className="font-mono fill-chart-2 text-[11px] font-bold">
            MS Gas Branch
          </text>
          <text x="310" y="42" className="font-mono fill-chart-2 text-[11px] font-bold">
            MS Riser
          </text>
          <text x="238" y="138" className="font-mono fill-muted-foreground text-[11px]">
            T-Joint & Valve
          </text>

          {/* Supply arrow at ground */}
          <path d="M 305,210 h 15 v -5" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="320,200 316,206 324,206" fill="currentColor" />
          <text x="220" y="212" className="font-mono fill-muted-foreground text-[11px] font-semibold">
            From District Gas Mains
          </text>
        </g>

        {/* Building outline title */}
        <text x="200" y="180" className="fill-muted-foreground/40 font-extrabold text-[12px] uppercase">
          Multi-Story Facade
        </text>
      </svg>
    </div>
  );
};

export default MepSubNetworksDrawing;
