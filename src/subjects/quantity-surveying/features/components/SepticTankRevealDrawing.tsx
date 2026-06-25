import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface SepticTankRevealDrawingProps {
  activeStep: number; // 0: Base, 1: Partition, 2: Enclosure, 3: Fittings
  className?: string;
}

export const SepticTankRevealDrawing: React.FC<SepticTankRevealDrawingProps> = ({
  activeStep,
  className = '',
}) => {
  const isBase = activeStep === 0;
  const isBaffle = activeStep === 1;
  const isExternal = activeStep === 2;
  const isFittings = activeStep === 3;

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/10 p-1.5 border border-border/60 rounded-xl ${className}`}>
      <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground mb-0.5 block text-center">
        Septic Tank Structural Anatomy
      </span>

      <div className="h-40 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 30 300 150" className="w-full h-full select-none overflow-visible">
          {/* Natural Ground Line */}
          <line x1="10" y1="50" x2="290" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-muted-foreground/40" />

          {/* 1. RCC Base slab */}
          <rect
            x="40"
            y="155"
            width="220"
            height="18"
            rx="1"
            className={`transition-all duration-300 ${
              isBase ? 'fill-primary/20 stroke-primary stroke-[2px]' : 'fill-muted/30 stroke-border/40'
            }`}
          />

          {/* 2. External Brick Enclosure Walls */}
          {/* Left Wall */}
          <rect
            x="40"
            y="55"
            width="25"
            height="100"
            className={`transition-all duration-300 ${
              isExternal ? 'fill-amber-600/30 stroke-amber-600 stroke-[2px]' : 'fill-muted/30 stroke-border/40'
            }`}
          />
          {/* Right Wall */}
          <rect
            x="235"
            y="55"
            width="25"
            height="100"
            className={`transition-all duration-300 ${
              isExternal ? 'fill-amber-600/30 stroke-amber-600 stroke-[2px]' : 'fill-muted/30 stroke-border/40'
            }`}
          />

          {/* 3. Internal Baffle / Partition Wall */}
          <rect
            x="135"
            y="70"
            width="12"
            height="85"
            className={`transition-all duration-300 ${
              isBaffle ? 'fill-emerald-500/30 stroke-emerald-500 stroke-[2px]' : 'fill-muted/30 stroke-border/40'
            }`}
          />
          {/* Baffle flow opening */}
          <circle cx="141" cy="110" r="4" className="fill-background stroke-muted-foreground/30 stroke-1" />

          {/* 4. Inlet/Outlet Sanitary Tees (Fittings) */}
          {/* Inlet Pipe (Left) */}
          <path
            d="M 20,68 H 55 M 55,58 V 83 M 55,58 H 50 M 55,83 H 50"
            fill="none"
            className={`transition-all duration-300 ${
              isFittings ? 'stroke-primary stroke-[3px]' : 'stroke-muted-foreground/40 stroke-2'
            }`}
          />
          {/* Outlet Pipe (Right) */}
          <path
            d="M 245,78 H 280 M 245,68 V 93 M 245,68 H 250 M 245,93 H 250"
            fill="none"
            className={`transition-all duration-300 ${
              isFittings ? 'stroke-primary stroke-[3px]' : 'stroke-muted-foreground/40 stroke-2'
            }`}
          />

          {/* Labels dynamically revealed */}
          {isBase && (
            <text x="150" y="167" textAnchor="middle" className="fill-primary text-[12px] font-mono font-bold animate-fadeIn">RCC Foundation Slab (m³)</text>
          )}
          {isExternal && (
            <text x="150" y="140" textAnchor="middle" className="fill-amber-600 text-[12px] font-mono font-bold animate-fadeIn">External Masonry Enclosure (m³)</text>
          )}
          {isBaffle && (
            <text x="150" y="140" textAnchor="middle" className="fill-emerald-600 text-[12px] font-mono font-bold animate-fadeIn">RCC/Masonry Baffle Wall (m² / m³)</text>
          )}
          {isFittings && (
            <text x="150" y="42" textAnchor="middle" className="fill-primary text-[12px] font-mono font-bold animate-fadeIn">Sanitary Tee Joints (Nos.)</text>
          )}
        </svg>

        {isExternal && (
          <div className="absolute bottom-2 left-2 right-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[9px] p-2 rounded-md font-mono flex items-center gap-1.5 animate-fadeIn z-10">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Apply bitumen coat externally to block dampness.</span>
          </div>
        )}
      </div>

      <span className="text-[9px] text-muted-foreground text-center mt-1 leading-relaxed h-7">
        {isBase && 'Foundation Base Slab is measured in cubic meters (m³), acting as the primary horizontal seal.'}
        {isBaffle && 'Baffle wall partitions slow down effluent flows. Measured based on wall thickness.'}
        {isExternal && 'External brickwork enclosure. Requires outer damp-proof bitumen coating.'}
        {isFittings && 'Inlet/Outlet Tees and vent pipelines are structural appurtenances, counted in Numbers (Nos.).'}
      </span>
    </div>
  );
};
