import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface WaterPipeNetworkProps {
  horizontalLengthM: number;
  verticalRiseM: number;
  verticalDropM: number;
  pipeClass: 'PPR' | 'CPVC' | 'GI';
  showAnnotation?: boolean;
}

export const WaterPipeNetworkDrawing: React.FC<WaterPipeNetworkProps> = ({
  horizontalLengthM,
  verticalRiseM,
  verticalDropM,
  pipeClass,
  showAnnotation = true,
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Scale: max expected dimension ~10m. We map 1m to ~20px.
  const scale = 20;

  // Let's set up isometric-like coordinates
  // Start point (Booster Pump / Source)
  const startX = 80;
  const startY = 170;

  // Riser (Straight Up)
  const riserHeight = verticalRiseM * scale;
  const riserX = startX;
  const riserY = startY - riserHeight;

  // Horizontal main run (Isometric X-axis: 30 degrees right and down)
  const isoAngleRad = (30 * Math.PI) / 180;
  const horizPixel = horizontalLengthM * scale;
  const branchX = riserX + horizPixel * Math.cos(isoAngleRad);
  const branchY = riserY + horizPixel * Math.sin(isoAngleRad);

  // Drop inside wet wall (Straight Down)
  const dropHeight = verticalDropM * scale;
  const dropEndX = branchX;
  const dropEndY = branchY + dropHeight;

  // Colors based on class
  let strokeColor = 'var(--chart-1, #3b82f6)';
  if (pipeClass === 'CPVC') strokeColor = 'var(--chart-3, #ef4444)';
  if (pipeClass === 'GI') strokeColor = 'var(--chart-4, #9ca3af)';

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Isometric Pipeline Trajectory ({pipeClass} Pipe)
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Grids and Service Shaft Indicator */}
        <rect
          x={startX - 15}
          y={riserY - 10}
          width="30"
          height={riserHeight + 20}
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          className="text-muted-foreground/30"
        />
        <text
          x={startX}
          y={riserY - 15}
          textAnchor="middle"
          className="font-sans text-[7.5px] fill-muted-foreground font-bold"
        >
          Service Shaft
        </text>

        {/* Wet Wall Box Indicator */}
        <rect
          x={branchX - 10}
          y={branchY - 10}
          width="20"
          height={dropHeight + 20}
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2,2"
          className="text-muted-foreground/30"
        />
        <text
          x={branchX}
          y={branchY - 15}
          textAnchor="middle"
          className="font-sans text-[7.5px] fill-muted-foreground font-bold"
        >
          Wet Wall
        </text>

        {/* The Pipeline Network path */}
        <g stroke={strokeColor} fill="none" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300">
          {/* Vertical Riser */}
          <line x1={startX} y1={startY} x2={riserX} y2={riserY} strokeWidth="4" />
          {/* Horizontal run */}
          <line x1={riserX} y1={riserY} x2={branchX} y2={branchY} strokeWidth="4" />
          {/* Vertical Drop */}
          <line x1={branchX} y1={branchY} x2={dropEndX} y2={dropEndY} strokeWidth="4" />
        </g>

        {/* Pipeline fixtures (valve, tap) */}
        {/* Source pump at start */}
        <circle cx={startX} cy={startY} r="6" fill="var(--chart-2, #eab308)" stroke="currentColor" strokeWidth="1" />
        <text x={startX - 12} y={startY + 4} textAnchor="end" className="font-mono text-[8px] fill-muted-foreground">Source</text>

        {/* Bibcock/Tap at end of drop */}
        <path d={`M ${dropEndX},${dropEndY} h 10 v 5`} stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx={dropEndX + 10} cy={dropEndY + 5} r="2" fill="currentColor" />

        {/* Annotations & Dimension Labels */}
        {showAnnotation && (
          <g className="font-mono text-[9.5px] fill-muted-foreground font-bold">
            {/* Riser Label */}
            <line x1={startX - 25} y1={startY} x2={startX - 25} y2={riserY} stroke="currentColor" strokeWidth="0.5" />
            <path d={`M ${startX - 28},${startY} H ${startX - 22} M ${startX - 28},${riserY} H ${startX - 22}`} stroke="currentColor" strokeWidth="0.5" />
            <text x={startX - 32} y={riserY + riserHeight / 2 + 3} textAnchor="end" className="fill-foreground">
              Riser = {verticalRiseM.toFixed(2)}m
            </text>

            {/* Horizontal Branch Label */}
            <path
              d={`M ${riserX + 5},${riserY - 8} L ${branchX + 5},${branchY - 8}`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
            <text
              x={riserX + (branchX - riserX) / 2 + 10}
              y={riserY + (branchY - riserY) / 2 - 12}
              textAnchor="middle"
              className="fill-foreground"
            >
              Horizontal Run = {horizontalLengthM.toFixed(2)}m
            </text>

            {/* Drop Label */}
            <line x1={branchX + 20} y1={branchY} x2={branchX + 20} y2={dropEndY} stroke="currentColor" strokeWidth="0.5" />
            <path d={`M ${branchX + 17},${branchY} H ${branchX + 23} M ${branchX + 17},${dropEndY} H ${branchX + 23}`} stroke="currentColor" strokeWidth="0.5" />
            <text x={branchX + 25} y={branchY + dropHeight / 2 + 3} textAnchor="start" className="fill-foreground">
              Wall Drop = {verticalDropM.toFixed(2)}m
            </text>

            {/* Calculations block */}
            <rect x="230" y="10" width="200" height="60" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
            <text x="240" y="25" textAnchor="start" className="fill-foreground text-[8.5px] font-bold">Center-line Sum:</text>
            <text x="240" y="38" textAnchor="start" className="fill-chart-2 text-[8px] font-bold">
              Net = {(verticalRiseM + horizontalLengthM + verticalDropM).toFixed(2)} m
            </text>
            <text x="240" y="50" textAnchor="start" className="fill-muted-foreground text-[7.5px] font-normal">
              Billed (+5% PWD Joint Allowance) = {((verticalRiseM + horizontalLengthM + verticalDropM) * 1.05).toFixed(3)} m
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default WaterPipeNetworkDrawing;
