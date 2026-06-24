import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

export interface PipeFittingsDrawingProps {
  activeHighlight?: 'none' | 'elbow' | 'tee' | 'union' | 'valve';
  className?: string;
}

export const PipeFittingsDrawing: React.FC<PipeFittingsDrawingProps> = ({
  activeHighlight = 'none',
  className = ''
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Helper colors
  const highlightColor = '#10b981'; // emerald-500
  const defaultStroke = 'currentColor';

  const isElbowActive = activeHighlight === 'none' || activeHighlight === 'elbow';
  const isTeeActive = activeHighlight === 'none' || activeHighlight === 'tee';
  const isUnionActive = activeHighlight === 'none' || activeHighlight === 'union';
  const isValveActive = activeHighlight === 'none' || activeHighlight === 'valve';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Standard Piping Fittings Profiles
      </span>
      <svg
        width="100%"
        height="180"
        viewBox="0 0 400 180"
        className="overflow-visible select-none"
      >
        {/* Grids and dividers */}
        <line x1="200" y1="10" x2="200" y2="170" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-muted-foreground/20" />
        <line x1="10" y1="90" x2="390" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-muted-foreground/20" />

        {/* 1. 90° Elbow (Top Left) */}
        <g opacity={isElbowActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* External outline */}
          <path
            d="M 50,30 H 70 C 85,30 95,40 95,55 V 75"
            fill="none"
            stroke={activeHighlight === 'elbow' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'elbow' ? '4' : '2'}
            className={activeHighlight !== 'elbow' ? 'text-foreground/80' : ''}
          />
          {/* Internal curve */}
          <path
            d="M 50,45 H 65 C 70,45 75,50 75,55 V 75"
            fill="none"
            stroke={activeHighlight === 'elbow' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'elbow' ? '2' : '1.5'}
            className={activeHighlight !== 'elbow' ? 'text-foreground/60' : ''}
          />
          {/* Socket collars */}
          <rect x="45" y="27" width="5" height="21" fill="currentColor" className="text-muted-foreground" />
          <rect x="72" y="70" width="26" height="5" fill="currentColor" className="text-muted-foreground" />
          <text x="75" y="20" textAnchor="middle" className="font-sans text-[11px] fill-foreground font-bold">90° Elbow</text>
        </g>

        {/* 2. Equal Tee (Top Right) */}
        <g opacity={isTeeActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* Main horizontal line */}
          <line
            x1="260"
            y1="50"
            x2="340"
            y2="50"
            stroke={activeHighlight === 'tee' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'tee' ? '4' : '2'}
            className={activeHighlight !== 'tee' ? 'text-foreground/80' : ''}
          />
          {/* Branch vertical line */}
          <line
            x1="300"
            y1="50"
            x2="300"
            y2="80"
            stroke={activeHighlight === 'tee' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'tee' ? '4' : '2'}
            className={activeHighlight !== 'tee' ? 'text-foreground/80' : ''}
          />
          {/* Socket collars */}
          <rect x="255" y="44" width="5" height="12" fill="currentColor" className="text-muted-foreground" />
          <rect x="340" y="44" width="5" height="12" fill="currentColor" className="text-muted-foreground" />
          <rect x="294" y="75" width="12" height="5" fill="currentColor" className="text-muted-foreground" />
          <text x="300" y="20" textAnchor="middle" className="font-sans text-[11px] fill-foreground font-bold">Equal Tee</text>
        </g>

        {/* 3. Threaded Union (Bottom Left) */}
        <g opacity={isUnionActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* Pipe left */}
          <line
            x1="40"
            y1="130"
            x2="70"
            y2="130"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground/60"
          />
          {/* Pipe right */}
          <line
            x1="130"
            y1="130"
            x2="160"
            y2="130"
            stroke="currentColor"
            strokeWidth="2"
            className="text-foreground/60"
          />
          {/* Hexagonal central nut body */}
          <rect
            x="85"
            y="118"
            width="30"
            height="24"
            fill="none"
            stroke={activeHighlight === 'union' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'union' ? '3' : '2'}
            className={activeHighlight !== 'union' ? 'text-foreground/80' : ''}
            rx="2"
          />
          {/* Collars on each side of nut */}
          <rect x="70" y="122" width="15" height="16" fill="currentColor" className="text-muted-foreground/60" />
          <rect x="115" y="122" width="15" height="16" fill="currentColor" className="text-muted-foreground/60" />
          <line x1="100" y1="118" x2="100" y2="142" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
          <text x="100" y="110" textAnchor="middle" className="font-sans text-[11px] fill-foreground font-bold">Pipe Union</text>
        </g>

        {/* 4. Gate Valve / Stop Cock (Bottom Right) */}
        <g opacity={isValveActive ? '1' : '0.15'} className="transition-all duration-300">
          {/* Valve Body (Triangles) */}
          <path
            d="M 260,130 L 290,115 V 145 Z M 340,130 L 310,115 V 145 Z"
            fill="none"
            stroke={activeHighlight === 'valve' ? highlightColor : defaultStroke}
            strokeWidth={activeHighlight === 'valve' ? '2.5' : '1.5'}
            className={activeHighlight !== 'valve' ? 'text-foreground/80' : ''}
          />
          {/* Center stem */}
          <line
            x1="300"
            y1="130"
            x2="300"
            y2="105"
            stroke={activeHighlight === 'valve' ? highlightColor : defaultStroke}
            strokeWidth="2"
          />
          {/* Turning wheel handle */}
          <ellipse
            cx="300"
            cy="105"
            rx="12"
            ry="4"
            fill="none"
            stroke={activeHighlight === 'valve' ? highlightColor : defaultStroke}
            strokeWidth="2.5"
          />
          <text x="300" y="98" textAnchor="middle" className="font-sans text-[11px] fill-foreground font-bold">Stop Cock (Valve)</text>
        </g>
      </svg>
    </div>
  );
};

export default PipeFittingsDrawing;
