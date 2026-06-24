import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface HookGeometryDrawingProps {
  barType: 'plain' | 'deformed';
  angle: 90 | 135 | 180;
  diameterMm: number;
  multiplier: number;
  additionM: number;
  className?: string;
}

export const HookGeometryDrawing: React.FC<HookGeometryDrawingProps> = ({
  barType,
  angle,
  diameterMm,
  multiplier,
  additionM,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Core dimensions and offsets
  const startX = 40;
  const startY = 120;
  const barLength = 220;
  const hookColor = barType === 'plain' ? 'var(--chart-1)' : 'var(--chart-2)';

  // Determine path based on hook angle
  let pathD = '';
  let additionHighlight: React.ReactNode = null;
  const radius = Math.max(12, diameterMm * 1.25);

  if (angle === 180) {
    // 180° anchor hook: L-to-R, wrap back L
    pathD = `M ${startX},${startY} L ${startX + barLength},${startY} A ${radius},${radius} 0 0,0 ${startX + barLength + radius},${startY - radius} A ${radius},${radius} 0 0,0 ${startX + barLength},${startY - 2 * radius} L ${startX + barLength - 30},${startY - 2 * radius}`;
    
    additionHighlight = (
      <g>
        <circle cx={startX + barLength} cy={startY - radius} r={radius} fill="none" stroke="red" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
        <path d={`M ${startX + barLength},${startY} A ${radius},${radius} 0 0,0 ${startX + barLength + radius},${startY - radius} A ${radius},${radius} 0 0,0 ${startX + barLength},${startY - 2 * radius} L ${startX + barLength - 30},${startY - 2 * radius}`} fill="none" stroke="red" strokeWidth="4" opacity="0.3" />
        <text x={startX + barLength + radius + 15} y={startY - radius + 4} className="fill-red-500 font-bold font-mono text-[9px] text-start">
          Hook Zone (+{multiplier}d)
        </text>
      </g>
    );
  } else if (angle === 90) {
    // 90° bend: L-to-R, bend down 90 deg
    pathD = `M ${startX},${startY} L ${startX + barLength},${startY} A ${radius},${radius} 0 0,1 ${startX + barLength + radius},${startY + radius} L ${startX + barLength + radius},${startY + radius + 50}`;
    
    additionHighlight = (
      <g>
        <circle cx={startX + barLength} cy={startY + radius} r={radius} fill="none" stroke="red" strokeWidth="1" strokeDasharray="2,2" opacity="0.4" />
        <path d={`M ${startX + barLength},${startY} A ${radius},${radius} 0 0,1 ${startX + barLength + radius},${startY + radius} L ${startX + barLength + radius},${startY + radius + 50}`} fill="none" stroke="red" strokeWidth="4" opacity="0.3" />
        <text x={startX + barLength + radius + 15} y={startY + radius + 25} className="fill-red-500 font-bold font-mono text-[9px] text-start">
          Bend Zone (+{multiplier}d)
        </text>
      </g>
    );
  } else if (angle === 135) {
    // 135° seismic hook: L-to-R, bend back down-left at 45 degrees
    const endX = startX + barLength + radius * Math.cos(-Math.PI / 4) - 45;
    const endY = startY + radius * Math.sin(-Math.PI / 4) + 45;
    pathD = `M ${startX},${startY} L ${startX + barLength},${startY} A ${radius},${radius} 0 0,1 ${startX + barLength + radius * 0.7},${startY + radius * 0.7} L ${endX},${endY}`;
    
    additionHighlight = (
      <g>
        <path d={`M ${startX + barLength},${startY} A ${radius},${radius} 0 0,1 ${startX + barLength + radius * 0.7},${startY + radius * 0.7} L ${endX},${endY}`} fill="none" stroke="red" strokeWidth="4" opacity="0.3" />
        <text x={startX + barLength + radius + 15} y={startY + 20} className="fill-red-500 font-bold font-mono text-[9px] text-start">
          Seismic Hook (+{multiplier}d)
        </text>
      </g>
    );
  }

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        {angle}° Hook/Bend Detailing Visualizer
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 380 220"
        className="overflow-visible select-none"
      >
        {/* Draw main rebar */}
        <path
          d={pathD}
          fill="none"
          stroke={hookColor}
          strokeWidth={Math.max(3, diameterMm / 3)}
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Draw ribs if deformed bar */}
        {barType === 'deformed' && (
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            strokeWidth={Math.max(4, diameterMm / 2.5)}
            strokeDasharray="1,5"
            strokeLinecap="square"
            opacity="0.3"
            className="transition-all duration-300"
          />
        )}

        {/* Highlight addition zone */}
        {additionHighlight}

        {/* Annotation & Output values */}
        <g className="font-mono text-[9px] fill-muted-foreground">
          {/* Legend */}
          <rect x="10" y="10" width="10" height="10" fill="var(--chart-1)" rx="2" />
          <text x="25" y="18" className="text-[8.5px]">Plain Round Bar</text>

          <rect x="120" y="10" width="10" height="10" fill="var(--chart-2)" rx="2" />
          <text x="135" y="18" className="text-[8.5px]">Deformed Bar (Lugs)</text>

          {/* Core outputs */}
          <text x="190" y="185" textAnchor="middle" className="font-bold fill-foreground">
            {barType === 'plain' ? 'Plain Round MS' : 'Deformed High-Strength'} Bar: Ø{diameterMm}mm
          </text>
          <text x="190" y="198" textAnchor="middle" className="fill-chart-1 font-extrabold text-[10px]">
            Single Hook Addition = {multiplier} × d = {(multiplier * diameterMm).toFixed(0)} mm ({additionM.toFixed(3)} m)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default HookGeometryDrawing;
