import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface MechanicalCouplerDrawingProps {
  diameterMm: number;
  className?: string;
}

export const MechanicalCouplerDrawing: React.FC<MechanicalCouplerDrawingProps> = ({
  diameterMm,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  const rebarThickness = Math.max(4, diameterMm / 4);

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Traditional Lapping vs. Mechanical Splicing
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 380 220"
        className="overflow-visible select-none"
      >
        {/* Left Column: Lapped Joint */}
        <g transform="translate(10, 0)">
          <text x="80" y="20" textAnchor="middle" className="fill-foreground font-bold text-[10px]">
            Lapped Joint (Overlap 50d)
          </text>

          {/* Left Rebar (Bottom part) */}
          <line
            x1="70"
            y1="50"
            x2="70"
            y2="170"
            stroke="var(--chart-1)"
            strokeWidth={rebarThickness}
            strokeLinecap="round"
          />

          {/* Right Rebar (Top part overlapping) */}
          <line
            x1="82"
            y1="80"
            x2="82"
            y2="200"
            stroke="var(--chart-1)"
            strokeWidth={rebarThickness}
            strokeLinecap="round"
          />

          {/* Overlap dimension bracket */}
          <path d="M 94,80 L 100,80 L 100,170 L 94,170" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <text x="105" y="130" textAnchor="start" className="fill-muted-foreground font-mono text-[8px] font-bold">
            Lap Length = 50d
          </text>

          {/* Binding Wire wraps */}
          <circle cx="76" cy="95" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" className="text-foreground/60" />
          <circle cx="76" cy="125" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" className="text-foreground/60" />
          <circle cx="76" cy="155" r="8" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2,2" className="text-foreground/60" />

          {/* Visual warnings */}
          <text x="80" y="35" textAnchor="middle" className="fill-red-500 font-sans text-[8px] font-bold">
            Steel Congestion Risk 🚨
          </text>
        </g>

        {/* Vertical divider */}
        <line x1="190" y1="10" x2="190" y2="210" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" className="text-border" />

        {/* Right Column: Mechanical Coupler Joint */}
        <g transform="translate(190, 0)">
          <text x="85" y="20" textAnchor="middle" className="fill-foreground font-bold text-[10px]">
            Mechanical Coupler (Joint)
          </text>

          {/* Top Rebar */}
          <line
            x1="85"
            y1="35"
            x2="85"
            y2="110"
            stroke="var(--chart-2)"
            strokeWidth={rebarThickness}
            strokeLinecap="round"
          />

          {/* Bottom Rebar */}
          <line
            x1="85"
            y1="130"
            x2="85"
            y2="200"
            stroke="var(--chart-2)"
            strokeWidth={rebarThickness}
            strokeLinecap="round"
          />

          {/* Mechanical Coupler Sleeve */}
          <rect
            x={85 - 8}
            y="108"
            width="16"
            height="24"
            fill="currentColor"
            className="text-foreground/90 dark:text-foreground/80"
            stroke="var(--chart-2)"
            strokeWidth="1.5"
            rx="2"
          />
          {/* Thread lines on coupler */}
          <line x1={85-8} y1="114" x2={85+8} y2="114" stroke="currentColor" strokeWidth="0.5" className="text-background" />
          <line x1={85-8} y1="120" x2={85+8} y2="120" stroke="currentColor" strokeWidth="0.5" className="text-background" />
          <line x1={85-8} y1="126" x2={85+8} y2="126" stroke="currentColor" strokeWidth="0.5" className="text-background" />

          {/* Labels */}
          <text x="105" y="124" textAnchor="start" className="fill-chart-2 font-bold font-sans text-[8.5px]">
            Steel Sleeve
          </text>
          <text x="105" y="136" textAnchor="start" className="fill-muted-foreground font-mono text-[7px]">
            No overlapping bar
          </text>

          <text x="85" y="35" textAnchor="middle" className="fill-green-600 dark:fill-green-400 font-sans text-[8px] font-bold">
            Zero Congestion ✅
          </text>
        </g>
      </svg>
    </div>
  );
};

export default MechanicalCouplerDrawing;
