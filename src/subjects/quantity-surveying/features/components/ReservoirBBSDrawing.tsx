import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

export interface ReservoirBBSDrawingProps {
  activeHighlight?: 'none' | 'base' | 'wall' | 'cover';
  className?: string;
}

export const ReservoirBBSDrawing: React.FC<ReservoirBBSDrawingProps> = ({
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
  const defaultRebarColor = '#ef4444'; // red-500
  const defaultStroke = 'currentColor';

  const isBaseActive = activeHighlight === 'base';
  const isWallActive = activeHighlight === 'wall';
  const isCoverActive = activeHighlight === 'cover';

  return (
    <div className={containerClasses}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-0.5">
        Reservoir Reinforcement Cross-Section
      </span>
      <svg
        width="100%"
        height="150"
        viewBox="0 0 320 180"
        className="overflow-visible select-none text-foreground"
      >
        {/* Concrete Outlines (Grey fill/stroke) */}
        <path
          d="M 30,170 H 290 V 150 H 270 V 55 H 250 V 150 H 70 V 55 H 50 V 150 H 30 Z"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={defaultStroke}
          strokeWidth="1.5"
          className="text-foreground/30"
        />
        {/* Cover Slab Concrete (separate path for representation) */}
        <rect
          x="50"
          y="40"
          width="220"
          height="15"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={defaultStroke}
          strokeWidth="1.5"
          className="text-foreground/30"
        />
        {/* Shear Key Notches */}
        <polygon
          points="53,150 67,150 64,158 56,158"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={defaultStroke}
          strokeWidth="1.5"
          className="text-foreground/30"
        />
        <polygon
          points="253,150 267,150 264,158 256,158"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={defaultStroke}
          strokeWidth="1.5"
          className="text-foreground/30"
        />

        {/* 1. Base Slab Reinforcement (Highlighted when isBaseActive) */}
        <g opacity={activeHighlight === 'none' || isBaseActive ? '1' : '0.2'} className="transition-all duration-300">
          {/* Main bottom bar with hooks */}
          <path
            d="M 36,156 V 164 H 284 V 156"
            fill="none"
            stroke={isBaseActive ? activeColor : defaultRebarColor}
            strokeWidth={isBaseActive ? '3.5' : '1.5'}
          />
          {/* Main top bar with hooks */}
          <path
            d="M 36,158 V 154 H 284 V 158"
            fill="none"
            stroke={isBaseActive ? activeColor : defaultRebarColor}
            strokeWidth={isBaseActive ? '3.5' : '1.5'}
          />
          {/* Distribution dots */}
          {Array.from({ length: 9 }).map((_, idx) => (
            <circle
              key={`base-dot-${idx}`}
              cx={46 + idx * 28}
              cy="160"
              r="2.5"
              fill={isBaseActive ? activeColor : '#3b82f6'}
            />
          ))}
          {isBaseActive && (
            <text x="160" y="145" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
              Base: #6 Main @ 5" c/c &amp; #5 Dist @ 6" c/c
            </text>
          )}
        </g>

        {/* 2. Vertical Wall Reinforcement (Highlighted when isWallActive) */}
        <g opacity={activeHighlight === 'none' || isWallActive ? '1' : '0.2'} className="transition-all duration-300">
          {/* Left Wall Vertical Outer Bar */}
          <line
            x1="56"
            y1="165"
            x2="56"
            y2="45"
            stroke={isWallActive ? activeColor : defaultRebarColor}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          {/* Shear Key Dowel Bars (L-bent vertical reinforcement) */}
          <path
            d="M 60,115 V 163 H 78"
            fill="none"
            stroke={isWallActive ? activeColor : '#fbbf24'}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          <path
            d="M 260,115 V 163 H 242"
            fill="none"
            stroke={isWallActive ? activeColor : '#fbbf24'}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          {/* Left Wall Vertical Inner Bar */}
          <line
            x1="64"
            y1="160"
            x2="64"
            y2="45"
            stroke={isWallActive ? activeColor : defaultRebarColor}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          {/* Right Wall Vertical Outer Bar */}
          <line
            x1="264"
            y1="165"
            x2="264"
            y2="45"
            stroke={isWallActive ? activeColor : defaultRebarColor}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          {/* Right Wall Vertical Inner Bar */}
          <line
            x1="256"
            y1="160"
            x2="256"
            y2="45"
            stroke={isWallActive ? activeColor : defaultRebarColor}
            strokeWidth={isWallActive ? '3.5' : '1.5'}
          />
          {/* Horizontal dots on walls */}
          {[60, 80, 100, 120, 140].map((y, idx) => (
            <g key={`wall-horiz-${idx}`}>
              {/* Left Wall dots */}
              <circle cx="56" cy={y} r="2" fill={isWallActive ? activeColor : '#3b82f6'} />
              <circle cx="64" cy={y} r="2" fill={isWallActive ? activeColor : '#3b82f6'} />
              {/* Right Wall dots */}
              <circle cx="256" cy={y} r="2" fill={isWallActive ? activeColor : '#3b82f6'} />
              <circle cx="264" cy={y} r="2" fill={isWallActive ? activeColor : '#3b82f6'} />
            </g>
          ))}
          {isWallActive && (
            <text x="160" y="100" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
              Walls: #4 Verts &amp; #3 Horizontals @ 5" c/c
            </text>
          )}
        </g>

        {/* 3. Cover Slab Reinforcement (Highlighted when isCoverActive) */}
        <g opacity={activeHighlight === 'none' || isCoverActive ? '1' : '0.2'} className="transition-all duration-300">
          {/* Cover Slab Bottom Bar */}
          <path
            d="M 54,51 H 266"
            fill="none"
            stroke={isCoverActive ? activeColor : defaultRebarColor}
            strokeWidth={isCoverActive ? '3.5' : '1.5'}
          />
          {/* Cover Slab Top Bar with hooks */}
          <path
            d="M 54,47 H 266"
            fill="none"
            stroke={isCoverActive ? activeColor : defaultRebarColor}
            strokeWidth={isCoverActive ? '3.5' : '1.5'}
          />
          {/* Distribution dots */}
          {Array.from({ length: 7 }).map((_, idx) => (
            <circle
              key={`cover-dot-${idx}`}
              cx={68 + idx * 30}
              cy="49"
              r="2"
              fill={isCoverActive ? activeColor : '#3b82f6'}
            />
          ))}
          {isCoverActive && (
            <text x="160" y="30" textAnchor="middle" className="font-sans text-[11px] fill-primary font-bold">
              Cover: #6 grids (Top &amp; Bottom)
            </text>
          )}
        </g>
      </svg>
    </div>
  );
};

export default ReservoirBBSDrawing;
