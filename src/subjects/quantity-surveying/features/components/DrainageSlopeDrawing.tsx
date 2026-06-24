import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface DrainageSlopeProps {
  lengthM: number;
  trenchWidthMm: number;
  sandThicknessMm: number;
  gradientRatio: number;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'slope' | 'sand';
}

export const DrainageSlopeDrawing: React.FC<DrainageSlopeProps> = ({
  lengthM,
  trenchWidthMm,
  sandThicknessMm,
  gradientRatio,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isSlopeActive = activeHighlight === 'none' || activeHighlight === 'slope';
  const isSandActive = activeHighlight === 'none' || activeHighlight === 'sand';


  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Base coordinates for side-elevation viewport
  const startX = 60;
  const endX = 340;

  // Let's model the slope fall visually
  // Rise/Fall = lengthM / gradientRatio. Typical difference is 0.15m to 0.75m.
  // Let's amplify for visual readability:
  const fallM = lengthM / gradientRatio;
  const verticalScale = 80; // scale meters to pixels for depth

  const startDepth = 60; // top ground is y=40, trench starts y=60 at left
  const slopeDiff = Math.min(60, fallM * verticalScale);
  const endDepth = startDepth + slopeDiff;

  const sandPx = Math.max(4, (sandThicknessMm / 1000) * verticalScale);

  // Ground level line (y=40)
  const gY = 40;

  // Trench bottom points (accounting for sand bed base slope)
  const tbLeftY = startDepth + sandPx;
  const tbRightY = endDepth + sandPx;

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Drainage Trench Longitudinal Profile (Slope 1:{gradientRatio})
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Ground Surface (soil hatch representation) */}
        <g opacity={isSlopeActive ? "1" : "0.2"} className="transition-all duration-300">
          <line x1={startX - 30} y1={gY} x2={endX + 30} y2={gY} stroke="currentColor" strokeWidth="2" className="text-muted-foreground/60" />
          <path d={`M ${startX - 20},${gY} l -5,5 M ${startX},${gY} l -5,5 M ${startX + 40},${gY} l -5,5 M ${endX},${gY} l -5,5`} stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30" />
        </g>

        {/* Excavation Trench Boundary Outline */}
        <polygon
          points={`
            ${startX},${gY} 
            ${startX},${tbLeftY} 
            ${endX},${tbRightY} 
            ${endX},${gY}
          `}
          fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.03))"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeDasharray="4,2"
          opacity={isSandActive ? "1" : "0.2"}
          className="text-muted-foreground/40 transition-all duration-300"
        />

        {/* Sand Cushion Base (Shaded polygon) */}
        <polygon
          points={`
            ${startX},${startDepth} 
            ${startX},${tbLeftY} 
            ${endX},${tbRightY} 
            ${endX},${endDepth}
          `}
          fill="var(--chart-2-opacity, rgba(234, 179, 8, 0.15))"
          stroke="var(--chart-2, #eab308)"
          strokeWidth="0.8"
          opacity={isSandActive ? "1" : "0.15"}
          className="transition-all duration-300"
        />

        {/* Gravity Sewerage Pipe (Thick gray/blue line) */}
        <line
          x1={startX}
          y1={startDepth - 6}
          x2={endX}
          y2={endDepth - 6}
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity={isSlopeActive ? "1" : "0.15"}
          className="transition-all duration-300"
        />
        {/* Pipe inner bore line */}
        <line
          x1={startX}
          y1={startDepth - 6}
          x2={endX}
          y2={endDepth - 6}
          stroke="var(--background, #fff)"
          strokeWidth="1"
          strokeDasharray="5,3"
          opacity={isSlopeActive ? "1" : "0.15"}
          className="transition-all duration-300"
        />

        {/* Fluid flow direction arrows */}
        <g stroke="var(--chart-1)" strokeWidth="1" fill="none" opacity={isSlopeActive ? "0.7" : "0.15"} className="text-primary/70 transition-all duration-300">
          <path d={`M ${startX + 50},${startDepth - 18} l 10,2 -8,-8 M ${startX + 50},${startDepth - 18} l -15, -4`} />
          <path d={`M ${endX - 50},${endDepth - 18} l 10,2 -8,-8 M ${endX - 50},${endDepth - 18} l -15, -4`} />
          <text x={startX + 65} y={startDepth - 22} stroke="none" className="font-sans text-[8px] fill-chart-1 font-semibold">Fluid Flow</text>
        </g>

        {/* Annotations & Calculations */}
        {showAnnotation && (
          <g className="font-mono text-[9px] fill-muted-foreground font-bold">
            {/* Start Invert Level */}
            <g opacity={isSlopeActive ? "1" : "0.15"} className="transition-all duration-300">
              <line x1={startX - 15} y1={gY} x2={startX - 5} y2={gY} stroke="currentColor" strokeWidth="0.5" />
              <line x1={startX - 15} y1={startDepth} x2={startX - 5} y2={startDepth} stroke="currentColor" strokeWidth="0.5" />
              <line x1={startX - 10} y1={gY} x2={startX - 10} y2={startDepth} stroke="currentColor" strokeWidth="0.5" />
              <text x={startX - 14} y={startDepth - 15} textAnchor="end" className="fill-foreground">
                Start Depth = {(startDepth / verticalScale).toFixed(2)}m
              </text>
            </g>

            {/* End Invert Level */}
            <g opacity={isSlopeActive ? "1" : "0.15"} className="transition-all duration-300">
              <line x1={endX + 5} y1={gY} x2={endX + 15} y2={gY} stroke="currentColor" strokeWidth="0.5" />
              <line x1={endX + 5} y1={endDepth} x2={endX + 15} y2={endDepth} stroke="currentColor" strokeWidth="0.5" />
              <line x1={endX + 10} y1={gY} x2={endX + 10} y2={endDepth} stroke="currentColor" strokeWidth="0.5" />
              <text x={endX + 14} y={endDepth - 15} textAnchor="start" className="fill-foreground">
                End Depth = {(endDepth / verticalScale).toFixed(2)}m
              </text>
            </g>

            {/* Trench Length */}
            <g opacity={isSlopeActive ? "1" : "0.15"} className="transition-all duration-300">
              <line x1={startX} y1={gY - 15} x2={endX} y2={gY - 15} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${startX},${gY - 18} V ${gY - 12} M ${endX},${gY - 18} V ${gY - 12}`} stroke="currentColor" strokeWidth="0.5" />
              <text x={(startX + endX) / 2} y={gY - 20} textAnchor="middle" className="fill-foreground">
                Trench Run = {lengthM.toFixed(2)}m
              </text>
            </g>

            {/* Sand Cushion Thickness */}
            <g opacity={isSandActive ? "1" : "0.15"} className="transition-all duration-300">
              <path d={`M ${startX},${startDepth} H ${startX + 40}`} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x={startX + 45} y={startDepth + sandPx / 2 + 3} textAnchor="start" className="fill-chart-2 text-[8px] font-bold">
                Sand Bed = {sandThicknessMm}mm
              </text>
            </g>

            {/* Gradient ratio */}
            <g opacity={isSlopeActive ? "1" : "0.15"} className="transition-all duration-300">
              <text x={(startX + endX) / 2} y={tbRightY + 25} textAnchor="middle" className="fill-chart-1 font-bold text-[8.5px]">
                Slope Gradient = 1 : {gradientRatio} (Fall = {fallM.toFixed(3)}m)
              </text>
            </g>

            {/* Volume box */}
            <g opacity={activeHighlight === 'none' || activeHighlight === 'sand' ? "1" : "0.15"} className="transition-all duration-300">
              <rect x="230" y="140" width="200" height="42" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
              <text x="240" y="152" className="fill-foreground text-[8px] font-bold">Sand Cushion Vol (PWD):</text>
              <text x="240" y="164" className="fill-chart-2 text-[7.5px] font-mono font-bold">
                Size: {lengthM.toFixed(2)}m × {(trenchWidthMm / 1000).toFixed(3)}m × {(sandThicknessMm / 1000).toFixed(3)}m
              </text>
              <text x="240" y="174" className="fill-foreground text-[8px] font-bold">
                Volume = {(lengthM * (trenchWidthMm / 1000) * (sandThicknessMm / 1000)).toFixed(3)} m³
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default DrainageSlopeDrawing;
