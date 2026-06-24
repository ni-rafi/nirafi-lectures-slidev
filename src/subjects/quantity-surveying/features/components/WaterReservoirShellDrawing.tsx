import React from 'react';
import { HelpCircle } from 'lucide-react';

interface WaterReservoirShellDrawingProps {
  mode: 'excavation' | 'shell' | 'waterproofing';
  currentClick?: number;
  className?: string;
}

export const WaterReservoirShellDrawing: React.FC<WaterReservoirShellDrawingProps> = ({
  mode,
  currentClick,
  className = '',
}) => {
  const isExc = mode === 'excavation';
  const isShell = mode === 'shell';
  const isWater = mode === 'waterproofing';

  // Helper to determine if a highlight step is active (supports static usage if currentClick is undefined)
  const isStepActive = (step: number) => {
    return currentClick === undefined || currentClick >= step;
  };

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Reservoir Section Visualizer
      </span>

      <div className="h-44 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 25 300 155" className="w-full h-full select-none overflow-visible">
          {/* Ground Level Line */}
          <line
            x1="10"
            y1="40"
            x2="290"
            y2="40"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="text-muted-foreground/50"
          />
          <text x="250" y="32" className="fill-muted-foreground text-[12px] font-mono">EGL</text>

          {/* Excavation Trench Boundary */}
          <path
            d="M 40,40 L 40,175 L 260,175 L 260,40"
            fill="none"
            className={`transition-all duration-300 ${
              isExc && isStepActive(3) ? 'stroke-amber-500 stroke-[2px]' : 'stroke-muted-foreground/30 stroke-1'
            }`}
            strokeDasharray={isExc && isStepActive(3) ? 'none' : '3 3'}
          />

          {/* Working space arrows & labels (c) */}
          {isExc && isStepActive(2) && (
            <g className="animate-fadeIn text-amber-500">
              {/* Left space */}
              <line x1="40" y1="140" x2="70" y2="140" stroke="currentColor" strokeWidth="1" />
              <polygon points="40,140 45,137 45,143" className="fill-amber-500" />
              <polygon points="70,140 65,137 65,143" className="fill-amber-500" />
              {/* Right space */}
              <line x1="230" y1="140" x2="260" y2="140" stroke="currentColor" strokeWidth="1" />
              <polygon points="230,140 235,137 235,143" className="fill-amber-500" />
              <polygon points="260,140 255,137 255,143" className="fill-amber-500" />
              
              <text x="55" y="130" textAnchor="middle" className="fill-amber-500 text-[12px] font-mono font-bold">c</text>
              <text x="245" y="130" textAnchor="middle" className="fill-amber-500 text-[12px] font-mono font-bold">c</text>
            </g>
          )}

          {/* RCC Concrete Shell components */}
          {/* Base Raft slab */}
          <rect
            x="70"
            y="160"
            width="160"
            height="15"
            rx="1"
            className={`transition-all duration-300 ${
              isShell && isStepActive(1) ? 'fill-primary/20 stroke-primary stroke-[1.5px]' : 'fill-muted/40 stroke-border/50'
            }`}
          />
          {/* Left Vertical Retaining Wall */}
          <rect
            x="70"
            y="65"
            width="15"
            height="95"
            rx="1"
            className={`transition-all duration-300 ${
              isShell && isStepActive(2) ? 'fill-primary/20 stroke-primary stroke-[1.5px]' : 'fill-muted/40 stroke-border/50'
            }`}
          />
          {/* Right Vertical Retaining Wall */}
          <rect
            x="215"
            y="65"
            width="15"
            height="95"
            rx="1"
            className={`transition-all duration-300 ${
              isShell && isStepActive(2) ? 'fill-primary/20 stroke-primary stroke-[1.5px]' : 'fill-muted/40 stroke-border/50'
            }`}
          />
          {/* Roof Slab */}
          <path
            d="M 70,65 L 125,65 M 155,65 L 230,65"
            className={`transition-all duration-300 fill-none ${
              isShell && isStepActive(3) ? 'stroke-primary stroke-[12px]' : 'stroke-border/50 stroke-[12px]'
            }`}
            strokeLinecap="square"
          />
          <text x="140" y="70" className="fill-muted-foreground text-[11px] text-center font-mono font-semibold">Manhole</text>

          {/* Waterproofing plaster line (Internal surface area) */}
          <path
            d="M 86,65 L 86,159 L 214,159 L 214,65"
            fill="none"
            className={`transition-all duration-300 ${
              isWater && isStepActive(2) ? 'stroke-emerald-500 stroke-[2px] animate-pulse' : 'stroke-transparent'
            }`}
          />
          
          {/* Water inside (Waterproofing mode) */}
          <rect
            x="86"
            y="95"
            width="128"
            height="64"
            className={`transition-all duration-300 ${
              isWater && isStepActive(1) ? 'fill-blue-500/20' : 'fill-transparent'
            }`}
          />
          {isWater && isStepActive(1) && (
            <line
              x1="86"
              y1="95"
              x2="214"
              y2="95"
              className="stroke-blue-500/40 stroke-1"
              strokeDasharray="3 2"
            />
          )}

          {/* Dimension markings for shell */}
          {isShell && (
            <g className="text-primary text-[11px] font-mono font-bold animate-fadeIn">
              {isStepActive(1) && <text x="150" y="171" textAnchor="middle" className="fill-primary font-extrabold">Base Raft</text>}
              {isStepActive(2) && (
                <>
                  <text x="77" y="115" textAnchor="middle" className="fill-primary font-extrabold rotate-90">Wall</text>
                  <text x="222" y="115" textAnchor="middle" className="fill-primary font-extrabold rotate-90">Wall</text>
                </>
              )}
            </g>
          )}
        </svg>

        {isWater && isStepActive(2) && (
          <div className="absolute bottom-2 left-2 right-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[10px] p-2 rounded-md font-mono flex items-center justify-between animate-fadeIn z-10">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Plaster Area = 2(l + b) × h + l × b
            </span>
          </div>
        )}
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-2 leading-relaxed h-8">
        {isExc && (isStepActive(2) ? 'Amber lines show excavation trench. working clearance (c) is added on each side.' : 'Net reservoir base profile. clearance space c is needed for forms.')}
        {isShell && (isStepActive(2) ? 'Monolithic concrete shell complete: Raft, vertical walls, and roof slab.' : isStepActive(1) ? 'Concrete retaining walls. short walls must deduct overlap corners.' : 'Concrete raft footing base slab.')}
        {isWater && (isStepActive(2) ? 'Green line shows internal plaster coating. Applied for hydraulic sealing.' : isStepActive(1) ? 'Water storage requires Pudlo admixture to seal micro-pores.' : 'Impermeability finishes prevent seepage.')}
      </span>
    </div>
  );
};
