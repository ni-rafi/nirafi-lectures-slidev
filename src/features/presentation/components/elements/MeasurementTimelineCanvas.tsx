import React, { useContext } from 'react';
import { PresentationContext } from '../../context/PresentationContext';

interface MeasurementTimelineCanvasProps {
  currentClick: number;
  className?: string;
}

export const MeasurementTimelineCanvas: React.FC<MeasurementTimelineCanvasProps> = ({
  currentClick,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none'
    : 'relative border border-border/40 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none';

  return (
    <div className={`${containerClasses} ${className}`}>
      <svg width="240" height="260" viewBox="0 0 240 260" className="overflow-visible">
        {/* Background grey vertical path line */}
        <line x1="30" y1="20" x2="30" y2="230" stroke="currentColor" strokeWidth="2" opacity="0.12" />

        {/* Active vertical progress line */}
        <line
          x1="30"
          y1="20"
          x2="30"
          y2={currentClick >= 5 ? 230 : currentClick >= 4 ? 160 : currentClick >= 2 ? 90 : 20}
          stroke="var(--color-primary, #0284c7)"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Node 1: Feasibility */}
        <g className="transition-all duration-500 ease-in-out opacity-100">
          <circle cx="30" cy="20" r="5" fill="var(--color-primary, #0284c7)" stroke="var(--color-background, #fff)" strokeWidth="1.5" />
          <text x="48" y="16" fill="currentColor" fontWeight="bold" fontSize="10">1. Feasibility Stage</text>
          <text x="48" y="27" fill="currentColor" fontSize="8" opacity="0.7">Budget pricing &amp; feasibility study</text>
        </g>

        {/* Node 2: Pre-Tender */}
        <g className={`transition-all duration-500 ease-in-out ${currentClick >= 2 ? 'opacity-100' : 'opacity-20'}`}>
          <circle cx="30" cy="90" r="5" fill={currentClick >= 2 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
          <text x="48" y="86" fill="currentColor" fontWeight="bold" fontSize="10">2. Pre-Tender Stage</text>
          <text x="48" y="97" fill="currentColor" fontSize="8" opacity="0.7">Detailed estimates &amp; BoQ creation</text>
        </g>

        {/* Node 3: Construction */}
        <g className={`transition-all duration-500 ease-in-out ${currentClick >= 4 ? 'opacity-100' : 'opacity-20'}`}>
          <circle cx="30" cy="160" r="5" fill={currentClick >= 4 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
          <text x="48" y="156" fill="currentColor" fontWeight="bold" fontSize="10">3. Construction Stage</text>
          <text x="48" y="167" fill="currentColor" fontSize="8" opacity="0.7">Variation orders &amp; progress bill logs</text>
        </g>

        {/* Node 4: Closeout */}
        <g className={`transition-all duration-500 ease-in-out ${currentClick >= 5 ? 'opacity-100' : 'opacity-20'}`}>
          <circle cx="30" cy="230" r="5" fill={currentClick >= 5 ? "var(--color-primary, #0284c7)" : "currentColor"} stroke="var(--color-background, #fff)" strokeWidth="1.5" />
          <text x="48" y="226" fill="currentColor" fontWeight="bold" fontSize="10">4. Closeout Stage</text>
          <text x="48" y="237" fill="currentColor" fontSize="8" opacity="0.7">Final accounts &amp; commercial audit</text>
        </g>
      </svg>
    </div>
  );
};
