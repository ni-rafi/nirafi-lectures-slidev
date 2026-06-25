import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface SepticSteppedProps {
  activeStepIndex?: number; // 0: none, 1: 1st step wall, 2: 2nd step wall, 3: floor plaster, 4: wall plaster
  className?: string;
}

export const SepticSteppedDrawing: React.FC<SepticSteppedProps> = ({
  activeStepIndex = 0,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isStep1Active = activeStepIndex === 0 || activeStepIndex === 1;
  const isStep2Active = activeStepIndex === 0 || activeStepIndex === 2;
  const isFloorPlasterActive = activeStepIndex === 0 || activeStepIndex === 3;
  const isWallPlasterActive = activeStepIndex === 0 || activeStepIndex === 4;

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/60 bg-muted/10 dark:bg-muted/5 rounded-xl p-1.5 flex flex-col items-center shadow-xs select-none w-full justify-center ${className}`;

  const defaultStroke = 'currentColor';

  return (
    <div className={containerClasses}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-0.5">
        Septic Tank Stepped Wall &amp; Plaster Cross-Section
      </span>
      <svg
        width="100%"
        height="150"
        viewBox="0 0 450 180"
        className="overflow-visible select-none text-foreground"
      >
        {/* Concrete Bed Footing Base */}
        <rect
          x="30"
          y="155"
          width="320"
          height="15"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke={defaultStroke}
          strokeWidth="1.2"
          className="text-foreground/30"
        />
        <text x="360" y="166" className="fill-muted-foreground text-[11px] font-semibold">
          RCC Base Slab
        </text>

        {/* --- Masonry: 1st Step Wall (Wider Base) --- */}
        <g opacity={isStep1Active ? '1' : '0.15'} className="transition-all duration-300">
          {/* Left Wall 1st Step */}
          <rect
            x="40"
            y="110"
            width="40"
            height="45"
            fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          {/* Right Wall 1st Step */}
          <rect
            x="300"
            y="110"
            width="40"
            height="45"
            fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="1.5"
            strokeDasharray="2,2"
          />
          <text x="350" y="136" className="fill-chart-1 font-mono text-[11px] font-bold">
            1st Step Wall (375mm)
          </text>
        </g>

        {/* --- Masonry: 2nd Step Wall (Narrower Upper) --- */}
        <g opacity={isStep2Active ? '1' : '0.15'} className="transition-all duration-300">
          {/* Left Wall 2nd Step */}
          <rect
            x="50"
            y="30"
            width="30"
            height="80"
            fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.15))"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="2"
          />
          {/* Right Wall 2nd Step */}
          <rect
            x="300"
            y="30"
            width="30"
            height="80"
            fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.15))"
            stroke="var(--chart-1, #3b82f6)"
            strokeWidth="2"
          />
          <text x="340" y="75" className="fill-chart-1 font-mono text-[11px] font-bold">
            2nd Step Wall (250mm)
          </text>
        </g>

        {/* Partition Wall in Center (straight) */}
        <rect
          x="190"
          y="45"
          width="20"
          height="110"
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground/50"
        />
        <text x="175" y="24" className="fill-muted-foreground text-[11px] font-semibold">
          Partition Wall
        </text>

        {/* --- Plaster: Differential Thickness Layers --- */}
        {/* Floor Plaster (Thicker 20mm) */}
        <g opacity={isFloorPlasterActive ? '1' : '0.15'} className="transition-all duration-300 text-chart-3">
          <line
            x1="80"
            y1="153"
            x2="300"
            y2="153"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <text x="140" y="145" className="fill-chart-3 font-mono text-[11px] font-bold">
            20mm Floor Plaster (1:3)
          </text>
        </g>

        {/* Wall Plaster (Thinner 12mm) */}
        <g opacity={isWallPlasterActive ? '1' : '0.15'} className="transition-all duration-300 text-chart-2">
          {/* Left Wall inner plaster */}
          <line x1="82" y1="30" x2="82" y2="151" stroke="currentColor" strokeWidth="1.5" />
          {/* Right Wall inner plaster */}
          <line x1="298" y1="30" x2="298" y2="151" stroke="currentColor" strokeWidth="1.5" />
          {/* Partition wall plaster on both sides */}
          <line x1="188" y1="45" x2="188" y2="155" stroke="currentColor" strokeWidth="1" />
          <line x1="212" y1="45" x2="212" y2="155" stroke="currentColor" strokeWidth="1" />
          <text x="88" y="70" className="fill-chart-2 font-mono text-[11px] font-bold">
            12mm Plaster
          </text>
          <text x="218" y="70" className="fill-chart-2 font-mono text-[11px] font-bold">
            12mm Plaster
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SepticSteppedDrawing;
