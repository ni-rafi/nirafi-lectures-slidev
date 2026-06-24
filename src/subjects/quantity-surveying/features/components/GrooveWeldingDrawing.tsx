import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface GrooveWeldingProps {
  wallType?: 'brick' | 'rcc';
  highlightType?: 'none' | 'groove' | 'joint';
  className?: string;
}

export const GrooveWeldingDrawing: React.FC<GrooveWeldingProps> = ({
  wallType = 'brick',
  highlightType = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isGrooveActive = highlightType === 'none' || highlightType === 'groove';
  const isJointActive = highlightType === 'none' || highlightType === 'joint';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Concealment Groove & Electro-Fusion Joint Detail
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 520 220"
        className="overflow-visible select-none"
      >
        {/* Vertical divider line */}
        <line
          x1="250"
          y1="10"
          x2="250"
          y2="210"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4,4"
          className="text-muted-foreground/30"
        />

        {/* --- LEFT PANEL: Groove Cutting & Concealment --- */}
        <g opacity={isGrooveActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* Wall cross section background (isometric block representation) */}
          <polygon
            points="30,170 150,170 190,130 70,130"
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
            stroke="currentColor"
            strokeWidth="0.8"
          />
          {/* Front Face of Wall */}
          <rect
            x="30"
            y="70"
            width="120"
            height="100"
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.03))"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          
          {/* Wall type hatchings or colors */}
          {wallType === 'brick' ? (
            // Brickwork diagonal lines
            <g className="text-muted-foreground/20">
              <line x1="30" y1="90" x2="150" y2="90" stroke="currentColor" strokeWidth="0.8" />
              <line x1="30" y1="120" x2="150" y2="120" stroke="currentColor" strokeWidth="0.8" />
              <line x1="30" y1="150" x2="150" y2="150" stroke="currentColor" strokeWidth="0.8" />
              <line x1="60" y1="70" x2="60" y2="90" stroke="currentColor" strokeWidth="0.8" />
              <line x1="110" y1="70" x2="110" y2="90" stroke="currentColor" strokeWidth="0.8" />
              <line x1="85" y1="90" x2="85" y2="120" stroke="currentColor" strokeWidth="0.8" />
              <line x1="60" y1="120" x2="60" y2="150" stroke="currentColor" strokeWidth="0.8" />
              <line x1="110" y1="120" x2="110" y2="150" stroke="currentColor" strokeWidth="0.8" />
            </g>
          ) : (
            // RCC concrete triangles/dots
            <g className="text-muted-foreground/30" fill="currentColor">
              <polygon points="45,95 50,85 55,95" />
              <circle cx="70" cy="110" r="1.5" />
              <circle cx="120" cy="95" r="1" />
              <polygon points="100,145 105,135 110,145" />
              <circle cx="55" cy="140" r="1.5" />
              <circle cx="130" cy="130" r="2" />
            </g>
          )}

          {/* Groove (Chased Slot) - Vertical cut in the center */}
          <rect
            x="80"
            y="70"
            width="20"
            height="100"
            fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.1))"
            stroke="var(--chart-3, #10b981)"
            strokeWidth="1.2"
            strokeDasharray="2,1"
          />

          {/* Embedded Water Pipe (PPR Green or uPVC Blue) */}
          <rect
            x="86"
            y="70"
            width="8"
            height="100"
            fill="var(--chart-1, #3b82f6)"
            stroke="var(--chart-1-hover, #2563eb)"
            strokeWidth="1"
          />
          {/* Mortar/Concrete Seal representation */}
          <rect
            x="80"
            y="70"
            width="20"
            height="100"
            fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.05))"
            opacity="0.6"
          />

          {/* Text Labels */}
          <text x="40" y="55" className="fill-foreground font-semibold text-[11px]">
            {wallType === 'brick' ? '125mm Brick Wall' : 'RCC Structural Shear Wall'}
          </text>
          <text x="106" y="90" className="font-mono fill-chart-3 text-[11px] font-bold">
            ← Groove (50x50mm)
          </text>
          <text x="106" y="115" className="font-mono fill-chart-1 text-[11px] font-bold">
            ← Concealed PPR/uPVC Pipe
          </text>
          <text x="106" y="140" className="font-mono fill-chart-2 text-[11px] font-bold">
            ← Cement Concrete Seal
          </text>
        </g>

        {/* --- RIGHT PANEL: HDPE Electro-fusion Joint Detail --- */}
        <g opacity={isJointActive ? '1' : '0.15'} className="transition-all duration-300">
          <text x="270" y="45" className="fill-foreground font-semibold text-[11px]">
            HDPE Electro-fusion Joint
          </text>

          {/* Left HDPE Pipe */}
          <rect
            x="270"
            y="95"
            width="80"
            height="30"
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <line x1="270" y1="110" x2="350" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />

          {/* Right HDPE Pipe */}
          <rect
            x="410"
            y="95"
            width="80"
            height="30"
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-foreground"
          />
          <line x1="410" y1="110" x2="490" y2="110" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />

          {/* Electro-fusion Coupler Sleeve */}
          <rect
            x="345"
            y="88"
            width="70"
            height="44"
            fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.15))"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="2.5"
            rx="3"
          />

          {/* Internal Heating Element Coils (Dotted copper representation inside sleeve) */}
          <line x1="355" y1="98" x2="355" y2="122" stroke="var(--chart-2, #eab308)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="365" y1="98" x2="365" y2="122" stroke="var(--chart-2, #eab308)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="395" y1="98" x2="395" y2="122" stroke="var(--chart-2, #eab308)" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="405" y1="98" x2="405" y2="122" stroke="var(--chart-2, #eab308)" strokeWidth="1" strokeDasharray="2,2" />

          {/* Welding terminal pin connectors */}
          <rect x="360" y="80" width="8" height="8" fill="currentColor" rx="1" />
          <rect x="392" y="80" width="8" height="8" fill="currentColor" rx="1" />

          {/* Electro-fusion welding cables connection representation */}
          <path d="M 364,80 C 364,70 330,65 330,55" fill="none" stroke="var(--chart-2, #eab308)" strokeWidth="1.5" />
          <path d="M 396,80 C 396,70 430,65 430,55" fill="none" stroke="var(--chart-2, #eab308)" strokeWidth="1.5" />

          {/* Text Labels */}
          <text x="270" y="152" className="font-mono fill-muted-foreground text-[11px]">
            HDPE Pipe Drop
          </text>
          <text x="320" y="180" className="font-mono fill-chart-1 text-[11px] font-bold">
            Electro-fusion Coupler Sleeve
          </text>
          <text x="345" y="72" className="font-mono fill-chart-2 text-[11px] font-bold">
            Welding Pins
          </text>
          <text x="430" y="152" className="font-mono fill-muted-foreground text-[11px]">
            API / HDPE Conduit
          </text>
        </g>
      </svg>
    </div>
  );
};

export default GrooveWeldingDrawing;
