import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface ManholeSectionProps {
  lengthMm: number;
  widthMm: number;
  depthMm: number;
  wallThicknessMm: number;
  showAnnotation?: boolean;
  activeHighlight?: 'none' | 'masonry' | 'benching' | 'plaster';
}

export const ManholeSectionDrawing: React.FC<ManholeSectionProps> = ({
  lengthMm,
  widthMm,
  depthMm,
  wallThicknessMm,
  showAnnotation = true,
  activeHighlight = 'none',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const isMasonryActive = activeHighlight === 'none' || activeHighlight === 'masonry';
  const isBenchingActive = activeHighlight === 'none' || activeHighlight === 'benching';
  const isPlasterActive = activeHighlight === 'none' || activeHighlight === 'plaster';


  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Scale: Max expected depth/width ~1500mm. Scale 1500mm to ~130px.
  const scale = 120 / 1500;

  const cx = 180; // center x
  const gY = 40; // ground level y

  const clearWidth = widthMm * scale;
  const depth = depthMm * scale;
  const wallWidth = wallThicknessMm * scale;

  const innerLeft = cx - clearWidth / 2;
  const innerRight = cx + clearWidth / 2;
  const outerLeft = innerLeft - wallWidth;
  const outerRight = innerRight + wallWidth;

  const bottomY = gY + depth;
  const foundationThick = 20; // base concrete thickness in pixels
  const foundationOffset = 15; // base concrete extends beyond wall outer

  // Calculations for brickwork volume (wall outer - inner)
  const outerL = lengthMm / 1000 + (2 * wallThicknessMm) / 1000;
  const outerW = widthMm / 1000 + (2 * wallThicknessMm) / 1000;
  const wallVol = (outerL * outerW - (lengthMm / 1000) * (widthMm / 1000)) * (depthMm / 1000);
  const plasterArea = 2 * (lengthMm / 1000 + widthMm / 1000) * (depthMm / 1000);

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Inspection Chamber Structural Section
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Ground Surface */}
        <line x1="20" y1={gY} x2="340" y2={gY} stroke="currentColor" strokeWidth="1" className="text-muted-foreground/60" />

        {/* Foundation CC Slab (at the bottom) */}
        <g opacity={isBenchingActive ? "1" : "0.15"} className="transition-all duration-300">
          <rect
            x={outerLeft - foundationOffset}
            y={bottomY}
            width={outerRight - outerLeft + 2 * foundationOffset}
            height={foundationThick}
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.15))"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text
            x={cx}
            y={bottomY + foundationThick / 2 + 3}
            textAnchor="middle"
            className="font-sans text-[7.5px] fill-muted-foreground font-bold"
          >
            CC Foundation Base (1:3:6)
          </text>
        </g>

        {/* Brick Walls (Left & Right) */}
        <g opacity={isMasonryActive ? "1" : "0.15"} className="transition-all duration-300">
          {/* Left Wall */}
          <rect
            x={outerLeft}
            y={gY}
            width={wallWidth}
            height={depth}
            fill="var(--chart-3-opacity, rgba(239, 68, 68, 0.15))"
            stroke="var(--chart-3, #ef4444)"
            strokeWidth="1.8"
          />
          {/* Right Wall */}
          <rect
            x={innerRight}
            y={gY}
            width={wallWidth}
            height={depth}
            fill="var(--chart-3-opacity, rgba(239, 68, 68, 0.15))"
            stroke="var(--chart-3, #ef4444)"
            strokeWidth="1.8"
          />
        </g>

        {/* Internal Concrete Benching (Slopped bottom channel inside) */}
        <g opacity={isBenchingActive ? "1" : "0.15"} className="transition-all duration-300">
          <path
            d={`
              M ${innerLeft},${bottomY} 
              Q ${innerLeft + clearWidth * 0.35},${bottomY} ${innerLeft + clearWidth * 0.4},${bottomY - 12}
              h ${clearWidth * 0.2}
              Q ${innerRight - clearWidth * 0.35},${bottomY} ${innerRight},${bottomY}
              Z
            `}
            fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.2))"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Curved channel outlet indicators */}
          <circle cx={cx} cy={bottomY - 6} r="6" fill="var(--background, #fff)" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <text x={cx} y={bottomY + 1} textAnchor="middle" className="font-sans text-[6px] fill-muted-foreground font-bold">Outlet</text>
        </g>

        {/* Internal Plaster line (thin coating on inside wall faces) */}
        <g opacity={isPlasterActive ? "1" : "0.15"} className="transition-all duration-300">
          <line x1={innerLeft + 1} y1={gY} x2={innerLeft + 1} y2={bottomY} stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
          <line x1={innerRight - 1} y1={gY} x2={innerRight - 1} y2={bottomY} stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
        </g>

        {/* Cast Iron Manhole Cover (at the top opening) */}
        <g opacity={activeHighlight === 'none' ? "1" : "0.15"} className="transition-all duration-300">
          <rect
            x={innerLeft - 10}
            y={gY - 5}
            width={clearWidth + 20}
            height="5"
            fill="var(--chart-4, #9ca3af)"
            stroke="currentColor"
            strokeWidth="1"
            rx="1.5"
          />
          <text
            x={cx}
            y={gY - 10}
            textAnchor="middle"
            className="font-sans text-[7.5px] fill-foreground font-bold"
          >
            C.I. Cover & Frame
          </text>
        </g>

        {/* Annotations & Quantifications */}
        {showAnnotation && (
          <g className="font-mono text-[9px] fill-muted-foreground font-bold">
            {/* Wall Thickness */}
            <g opacity={isMasonryActive ? "1" : "0.15"} className="transition-all duration-300">
              <path d={`M ${outerLeft},${gY + 20} H ${innerLeft}`} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${outerLeft},${gY + 17} V ${gY + 23} M ${innerLeft},${gY + 17} V ${gY + 23}`} stroke="currentColor" strokeWidth="0.5" />
              <text x={outerLeft + wallWidth / 2} y={gY + 32} textAnchor="middle" className="text-[7.5px] fill-chart-3">
                t={wallThicknessMm}
              </text>
            </g>

            {/* Depth label */}
            <g opacity={activeHighlight === 'none' || activeHighlight === 'masonry' || activeHighlight === 'plaster' ? "1" : "0.15"} className="transition-all duration-300">
              <line x1={cx} y1={gY} x2={cx} y2={bottomY} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
              <path d={`M ${cx - 4},${gY} H ${cx + 4} M ${cx - 4},${bottomY} H ${cx + 4}`} stroke="currentColor" strokeWidth="0.5" />
              <text x={cx + 8} y={gY + depth / 2 + 3} textAnchor="start" className="fill-foreground font-bold">
                Depth = {depthMm}mm
              </text>
            </g>

            {/* Internal Width */}
            <g opacity={isPlasterActive ? "1" : "0.15"} className="transition-all duration-300">
              <line x1={innerLeft} y1={gY + 60} x2={innerRight} y2={gY + 60} stroke="currentColor" strokeWidth="0.5" />
              <path d={`M ${innerLeft},${gY + 57} V ${gY + 63} M ${innerRight},${gY + 57} V ${gY + 63}`} stroke="currentColor" strokeWidth="0.5" />
              <text x={cx} y={gY + 54} textAnchor="middle" className="fill-foreground font-bold">
                Width = {widthMm}mm
              </text>
            </g>

            {/* Calculations results block - Brickwork */}
            <g opacity={isMasonryActive ? "1" : "0.15"} className="transition-all duration-300">
              <rect x="290" y="10" width="150" height="42" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
              <text x="298" y="22" className="fill-foreground text-[8px] font-bold">Wall brickwork Vol:</text>
              <text x="300" y="32" className="fill-chart-3 text-[7.5px] font-mono">Gross: {outerL.toFixed(3)}x{outerW.toFixed(3)}m</text>
              <text x="300" y="42" className="fill-chart-3 text-[7.5px] font-mono font-bold">Net Vol = {wallVol.toFixed(3)} m³</text>
            </g>
            
            {/* Calculations results block - Plastering */}
            <g opacity={isPlasterActive ? "1" : "0.15"} className="transition-all duration-300">
              <rect x="290" y="60" width="150" height="42" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="0.5" rx="3" className="text-muted-foreground/30" />
              <text x="298" y="70" className="fill-foreground text-[8px] font-bold">Internal Plaster (1:3):</text>
              <text x="300" y="80" className="fill-chart-1 text-[7.5px] font-mono">2 × (L + W) × D</text>
              <text x="300" y="90" className="fill-chart-1 text-[7.5px] font-mono font-bold">Area = {plasterArea.toFixed(2)} m²</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default ManholeSectionDrawing;
