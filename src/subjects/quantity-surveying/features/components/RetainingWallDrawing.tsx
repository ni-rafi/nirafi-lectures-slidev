import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface RetainingWallDrawingProps {
  activeHighlight?: 'none' | 'base' | 'stem' | 'weepholes' | 'drainage';
  className?: string;
  showAnnotation?: boolean;
}

export const RetainingWallDrawing: React.FC<RetainingWallDrawingProps> = ({
  activeHighlight = 'none',
  className = '',
  showAnnotation = true,
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  const isBaseActive = activeHighlight === 'none' || activeHighlight === 'base';
  const isStemActive = activeHighlight === 'none' || activeHighlight === 'stem';
  const isWeepActive = activeHighlight === 'none' || activeHighlight === 'weepholes';
  const isDrainActive = activeHighlight === 'none' || activeHighlight === 'drainage';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Retaining Wall Structural Profile
      </span>
      <svg
        width="100%"
        height="180"
        viewBox="0 0 450 180"
        className="overflow-visible select-none"
      >
        {/* Ground level behind the wall (retained side) */}
        <line x1="220" y1="40" x2="380" y2="40" stroke="currentColor" strokeWidth="0.8" className="text-muted-foreground/30" strokeDasharray="3,3" />
        {/* Ground level in front of the wall (exposed side) */}
        <line x1="20" y1="125" x2="140" y2="125" stroke="currentColor" strokeWidth="0.8" className="text-muted-foreground/30" strokeDasharray="3,3" />

        {/* Backfill structural soil (Right side) */}
        <polygon
          points="220,40 370,40 370,145 280,145 220,125"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          opacity={isDrainActive ? 1 : 0.15}
          className="transition-all duration-300"
        />

        {/* Coarse Gravel Drainage Packing (Wedge behind the stem) */}
        <polygon
          points="220,40 255,40 255,125 220,125"
          fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.15))"
          stroke="var(--chart-2, #eab308)"
          strokeWidth={activeHighlight === 'drainage' ? '2.5' : '1'}
          className="transition-all duration-300"
          opacity={isDrainActive ? 1 : 0.15}
        />
        {/* Gravel circles */}
        {isDrainActive && (
          <g fill="currentColor" className="text-muted-foreground/50 transition-opacity duration-300">
            <circle cx="230" cy="55" r="2" />
            <circle cx="245" cy="75" r="1.5" />
            <circle cx="235" cy="95" r="2" />
            <circle cx="245" cy="115" r="1.5" />
          </g>
        )}

        {/* Concrete Base Footing Slab */}
        <rect
          x="100"
          y="125"
          width="180"
          height="25"
          fill="var(--chart-3-opacity, rgba(239, 68, 68, 0.1))"
          stroke={activeHighlight === 'base' ? 'var(--chart-3)' : 'currentColor'}
          strokeWidth={activeHighlight === 'base' ? '3.5' : '2'}
          className="transition-all duration-300"
          opacity={isBaseActive ? 1 : 0.15}
          rx="1.5"
        />

        {/* Tapered Stem Wall (Front/left sloped, back/right vertical) */}
        <polygon
          points="140,125 220,125 220,35 180,35"
          fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
          stroke={activeHighlight === 'stem' ? 'var(--chart-1)' : 'currentColor'}
          strokeWidth={activeHighlight === 'stem' ? '3.5' : '2'}
          className="transition-all duration-300"
          opacity={isStemActive ? 1 : 0.15}
        />

        {/* Weep Hole Pipe Insert */}
        <g opacity={isWeepActive ? 1 : 0.15} className="transition-opacity duration-300">
          <line
            x1="180"
            y1="95"
            x2="225"
            y2="95"
            stroke="var(--chart-2, #eab308)"
            strokeWidth={activeHighlight === 'weepholes' ? '4' : '2.5'}
            className="transition-all duration-300"
          />
          {/* Water drips coming out of weep hole */}
          {isWeepActive && (
            <g fill="var(--chart-1, #3b82f6)">
              <circle cx="173" cy="98" r="1.2" className="animate-pulse" />
              <circle cx="168" cy="104" r="0.8" className="animate-pulse" />
            </g>
          )}
        </g>

        {/* Annotations */}
        {showAnnotation && (
          <g className="font-mono text-[9px] fill-muted-foreground font-bold">
            {/* Top Stem Width */}
            <g opacity={isStemActive ? 1 : 0.15} className="transition-opacity duration-300">
              <line x1="180" y1="23" x2="220" y2="23" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 180,20 V 26 M 220,20 V 26" stroke="currentColor" strokeWidth="0.5" />
              <text x="200" y="16" textAnchor="middle" className="fill-chart-1">w₁=450mm</text>
            </g>

            {/* Bottom Stem Width */}
            <g opacity={isStemActive ? 1 : 0.15} className="transition-opacity duration-300">
              <line x1="140" y1="115" x2="220" y2="115" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 140,112 V 118 M 220,112 V 118" stroke="currentColor" strokeWidth="0.5" />
              <text x="180" y="109" textAnchor="middle" className="fill-chart-1">w₂=900mm</text>
            </g>

            {/* Stem Height */}
            <g opacity={isStemActive ? 1 : 0.15} className="transition-opacity duration-300">
              <line x1="85" y1="35" x2="85" y2="125" stroke="currentColor" strokeWidth="0.5" />
              <path d="M 82,35 H 88 M 82,125 H 88" stroke="currentColor" strokeWidth="0.5" />
              <text x="75" y="83" textAnchor="middle" className="fill-foreground rotate-90 origin-center">Height (H) = 3.0m</text>
            </g>

            {/* Base Slab width */}
            <g opacity={isBaseActive ? 1 : 0.15} className="transition-opacity duration-300">
              <text x="190" y="141" textAnchor="middle" className="fill-chart-3">Base Raft (2.4m wide)</text>
            </g>

            {/* Labels */}
            <text x="260" y="99" textAnchor="start" className={`fill-chart-2 ${isWeepActive ? 'opacity-100' : 'opacity-15'} transition-all text-[8px]`}>75mm PVC Weep Hole</text>
            <text x="260" y="60" textAnchor="start" className={`fill-chart-2 ${isDrainActive ? 'opacity-100' : 'opacity-15'} transition-all text-[8.5px]`}>Gravel Filter Packing</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default RetainingWallDrawing;
