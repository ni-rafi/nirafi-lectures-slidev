import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface FixturePackageProps {
  fixtureType: 'Indian' | 'European';
  hasCistern: boolean;
  hasPushShower: boolean;
  hasLowBibcock: boolean;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'indian' | 'european' | 'accessories';
}

export const FixturePackageDrawing: React.FC<FixturePackageProps> = ({
  fixtureType,
  hasCistern,
  hasPushShower,
  hasLowBibcock,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isIndianActive = activeHighlight === 'none' || activeHighlight === 'indian';
  const isEuropeanActive = activeHighlight === 'none' || activeHighlight === 'european' || activeHighlight === 'accessories';
  const isAccessoriesActive = activeHighlight === 'none' || activeHighlight === 'accessories';


  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  const cx = 200; // WC center x
  const cy = 130; // base y

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        {fixtureType} WC Assembly Configuration
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Wall & Floor Background guide lines */}
        <line x1="20" y1={cy + 40} x2="350" y2={cy + 40} stroke="currentColor" strokeWidth="0.8" className="text-muted-foreground/30" />
        <line x1="80" y1="20" x2="80" y2={cy + 40} stroke="currentColor" strokeWidth="0.8" strokeDasharray="3,3" className="text-muted-foreground/30" />

        {/* Indian Squatting Pan Drawing */}
        {fixtureType === 'Indian' && (
          <g opacity={isIndianActive ? "1" : "0.15"} className="transition-all duration-300">
            {/* Floor Slab Cutout representation */}
            <ellipse cx={cx} cy={cy + 10} rx="50" ry="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <ellipse cx={cx} cy={cy + 10} rx="40" ry="18" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.1))" stroke="currentColor" strokeWidth="1" />
            
            {/* Left Footrest */}
            <rect x={cx - 38} y={cy - 5} width="12" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" rx="2" />
            <line x1={cx - 38} y1={cy + 5} x2={cx - 26} y2={cy + 5} stroke="currentColor" strokeWidth="0.8" />
            <line x1={cx - 38} y1={cy + 15} x2={cx - 26} y2={cy + 15} stroke="currentColor" strokeWidth="0.8" />

            {/* Right Footrest */}
            <rect x={cx + 26} y={cy - 5} width="12" height="30" fill="none" stroke="currentColor" strokeWidth="1.2" rx="2" />
            <line x1={cx + 26} y1={cy + 5} x2={cx + 38} y2={cy + 5} stroke="currentColor" strokeWidth="0.8" />
            <line x1={cx + 26} y1={cy + 15} x2={cx + 38} y2={cy + 15} stroke="currentColor" strokeWidth="0.8" />

            {/* P-Trap dashed underneath */}
            <path d={`M ${cx},${cy + 15} v 20 c 0,10 -20,10 -20,0 v -10`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,2" className="text-muted-foreground/60" />
            <text x={cx - 35} y={cy + 42} className="font-mono text-[8px] fill-muted-foreground">P-Trap</text>
          </g>
        )}

        {/* European Pedestal Closet Drawing */}
        {fixtureType === 'European' && (
          <g opacity={isEuropeanActive ? "1" : "0.15"} className="transition-all duration-300">
            {/* Commode Pedestal Front Profile */}
            <path
              d={`M ${cx - 25},${cy + 40} L ${cx - 20},${cy + 10} C ${cx - 35},${cy + 10} ${cx - 35},${cy - 20} ${cx - 25},${cy - 20} H ${cx + 25} C ${cx + 35},${cy - 20} ${cx + 35},${cy + 10} ${cx + 20},${cy + 10} L ${cx + 25},${cy + 40} Z`}
              fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.05))"
              stroke="var(--chart-1, #3b82f6)"
              strokeWidth="2"
            />
            {/* Seat Rim */}
            <ellipse cx={cx} cy={cy - 20} rx="26" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* Commode base bolts */}
            <circle cx={cx - 18} cy={cy + 35} r="2" fill="currentColor" />
            <circle cx={cx + 18} cy={cy + 35} r="2" fill="currentColor" />
          </g>
        )}

        {/* Flushing Cistern Accessories */}
        {hasCistern && (
          <g opacity={isAccessoriesActive ? "1" : "0.15"} className="transition-all duration-300">
            {/* Cistern Box on the wall (left side) */}
            <rect
              x="50"
              y="30"
              width="40"
              height="50"
              fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.08))"
              stroke="currentColor"
              strokeWidth="1.5"
              rx="3"
            />
            <line x1="70" y1="30" x2="70" y2="80" stroke="currentColor" strokeWidth="0.5" />
            {/* Flushing Lever */}
            <circle cx="82" cy="45" r="3" fill="var(--chart-2, #eab308)" />
            {/* Flush pipe connecting cistern to W.C. */}
            {fixtureType === 'Indian' ? (
              <path
                d={`M 70,80 V ${cy - 10} Q 70,${cy + 10} ${cx - 42},${cy + 10}`}
                fill="none"
                stroke="var(--chart-2, #eab308)"
                strokeWidth="2"
              />
            ) : (
              <path
                d={`M 70,80 V ${cy - 10} H ${cx - 26}`}
                fill="none"
                stroke="var(--chart-2, #eab308)"
                strokeWidth="2"
              />
            )}
            <text x="50" y="24" className="font-mono text-[7.5px] fill-muted-foreground font-semibold">10L Flushing Cistern</text>
          </g>
        )}

        {/* Push Shower */}
        {hasPushShower && (
          <g transform={`translate(${cx + 70}, 80)`} opacity={isAccessoriesActive ? "1" : "0.15"} className="transition-all duration-300 text-chart-2">
            {/* Spray Head */}
            <path d="M 0,0 C 5,-10 10,-5 10,5 L 5,15 h -5 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <line x1="5" y1="5" x2="15" y2="10" stroke="currentColor" strokeWidth="1" />
            {/* Flexible Hose */}
            <path d={`M 2,13 C 2,25 -20,40 -20,70`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,1" />
            {/* Wall Mount bracket */}
            <rect x="-3" y="5" width="6" height="5" fill="currentColor" rx="1" />
            <text x="12" y="10" className="font-mono text-[7.5px] fill-muted-foreground font-semibold">Push Shower</text>
          </g>
        )}

        {/* Low-Level Bib-cock */}
        {hasLowBibcock && (
          <g transform={`translate(${cx - 70}, 110)`} opacity={isAccessoriesActive ? "1" : "0.15"} className="transition-all duration-300 text-chart-3">
            {/* Faucet body */}
            <path d="M -15,0 H 10 v 10 M 0,0 v 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="5" y="-5" width="4" height="5" fill="currentColor" />
            {/* Water drops */}
            <circle cx="10" cy="14" r="1.2" fill="var(--chart-1, #3b82f6)" />
            <circle cx="10" cy="20" r="0.8" fill="var(--chart-1, #3b82f6)" />
            <text x="-20" y="-8" className="font-mono text-[7.5px] fill-muted-foreground font-semibold">Ablution Bib-cock</text>
          </g>
        )}

        {/* Annotations & PWD Composite Billing Rules */}
        {showAnnotation && (
          <g opacity={activeHighlight === 'none' || activeHighlight === 'accessories' ? "1" : "0.15"} className="font-mono text-[9px] fill-muted-foreground font-bold transition-all duration-300">
            {/* PWD Pack components highlights */}
            <rect x="290" y="10" width="150" height="90" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
            <text x="298" y="22" className="fill-foreground text-[8px] font-bold">Composite WC Pack:</text>
            <text x="300" y="34" className={`${fixtureType === 'Indian' ? 'fill-chart-1' : 'fill-muted-foreground'} text-[7.5px]`}>• Squatting Pan (Nos.)</text>
            <text x="300" y="44" className={`${fixtureType === 'European' ? 'fill-chart-1' : 'fill-muted-foreground'} text-[7.5px]`}>• Pedestal Commode (Nos.)</text>
            <text x="300" y="54" className={`${hasCistern ? 'fill-chart-2' : 'fill-muted-foreground'} text-[7.5px]`}>• 10L Flush Cistern ({hasCistern ? 'OK' : 'MISSING'})</text>
            <text x="300" y="64" className={`${hasPushShower ? 'fill-chart-2' : 'fill-muted-foreground'} text-[7.5px]`}>• Chrome Push Shower ({hasPushShower ? 'OK' : 'MISSING'})</text>
            <text x="300" y="74" className={`${hasLowBibcock ? 'fill-chart-3' : 'fill-muted-foreground'} text-[7.5px]`}>• Wall Bib-cock ({hasLowBibcock ? 'OK' : 'MISSING'})</text>
            <text x="300" y="86" className="fill-chart-1 text-[8px] font-bold">Billing Unit: assembly (Set)</text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default FixturePackageDrawing;
