import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface SteelMacroBudgetDrawingProps {
  concreteVolM3: number;
  ratioPercent: number;
  className?: string;
}

export const SteelMacroBudgetDrawing: React.FC<SteelMacroBudgetDrawingProps> = ({
  concreteVolM3,
  ratioPercent,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Determine grid density and rebar thickness based on steel ratio
  const gridDensity = ratioPercent < 1.0 ? 3 : ratioPercent < 1.8 ? 4 : 5;
  const strokeWidth = ratioPercent < 1.0 ? 1.5 : ratioPercent < 1.8 ? 2.5 : 3.5;
  const steelWeightKg = concreteVolM3 * (ratioPercent / 100) * 7850;

  // Generate grid lines coordinates inside the 3D block
  const lines: React.ReactNode[] = [];

  // Renders a grid of rebars inside the isometric box
  // Isometric translation offsets
  const startX = 80;
  const startY = 60;
  const sizeX = 140;
  const sizeY = 80;
  const depthX = 50;
  const depthY = -35;

  for (let i = 1; i < gridDensity; i++) {
    const offsetFactor = i / gridDensity;
    const x = startX + sizeX * offsetFactor;

    // Vertical rebars
    lines.push(
      <line
        key={`vert-${i}`}
        x1={x}
        y1={startY - (sizeY * 0.1)}
        x2={x}
        y2={startY + sizeY + (sizeY * 0.1) + 40}
        stroke="var(--chart-1)"
        strokeWidth={strokeWidth}
        opacity="0.85"
        className="transition-all duration-300"
      />
    );

    // Horizontal rebars
    const horizontalY = startY + sizeY * offsetFactor + 20;
    lines.push(
      <line
        key={`horiz-${i}`}
        x1={startX - (sizeX * 0.1)}
        y1={horizontalY}
        x2={startX + sizeX + (sizeX * 0.1)}
        y2={horizontalY}
        stroke="var(--chart-1)"
        strokeWidth={strokeWidth}
        opacity="0.85"
        className="transition-all duration-300"
      />
    );

    // Depth rebars (3D perspective)
    const zX = startX + sizeX * offsetFactor;
    const zY = startY + sizeY * offsetFactor + 20;
    lines.push(
      <line
        key={`depth-${i}`}
        x1={zX}
        y1={zY}
        x2={zX + depthX}
        y2={zY + depthY}
        stroke="var(--chart-1)"
        strokeWidth={strokeWidth}
        opacity="0.8"
        className="transition-all duration-300"
      />
    );
  }

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Macro Steel/Concrete Volumetric Ratio
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 360 220"
        className="overflow-visible select-none"
      >
        {/* Draw Concrete Box (Isometric View) */}
        {/* Top Face */}
        <polygon
          points={`${startX},${startY} ${startX + depthX},${startY + depthY} ${startX + sizeX + depthX},${startY + depthY + sizeY} ${startX + sizeX},${startY + sizeY}`}
          fill="currentColor"
          className="text-foreground/5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2,2"
        />

        {/* Back Grid/Steel representation */}
        <g>{lines}</g>

        {/* Front Face (Semi-transparent) */}
        <polygon
          points={`${startX},${startY} ${startX + sizeX},${startY + sizeY} ${startX + sizeX},${startY + sizeY + 80} ${startX},${startY + 80}`}
          fill="currentColor"
          className="text-foreground/10"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Right Face (Semi-transparent) */}
        <polygon
          points={`${startX + sizeX},${startY + sizeY} ${startX + sizeX + depthX},${startY + depthY + sizeY} ${startX + sizeX + depthX},${startY + depthY + sizeY + 80} ${startX + sizeX},${startY + sizeY + 80}`}
          fill="currentColor"
          className="text-foreground/15"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Dimension Annotations */}
        <g className="font-mono text-[9px] fill-muted-foreground">
          {/* Concrete Volume label */}
          <text x="180" y="15" textAnchor="middle" className="font-bold fill-foreground">
            RCC Concrete Volume = {concreteVolM3.toFixed(1)} m³
          </text>

          {/* Steel Ratio label */}
          <text x="180" y="30" textAnchor="middle" className="fill-chart-1 font-extrabold text-[10px]">
            Steel Ratio = {ratioPercent.toFixed(1)}% of Vol
          </text>

          {/* Estimated Weight Output */}
          <rect
            x="50"
            y="180"
            width="260"
            height="22"
            fill="var(--chart-1-opacity, rgba(var(--chart-1), 0.1))"
            stroke="var(--chart-1)"
            strokeWidth="0.5"
            rx="4"
            className="fill-muted/40"
          />
          <text x="180" y="194" textAnchor="middle" className="fill-foreground font-black text-[10px]">
            Estimated Steel Weight = {steelWeightKg.toFixed(1)} kg ({ (steelWeightKg / 1000).toFixed(3) } Tons)
          </text>
        </g>
      </svg>
    </div>
  );
};

export default SteelMacroBudgetDrawing;
