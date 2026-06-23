import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface SteelSectionsDrawingProps {
  sectionType: 'ISMB' | 'ISA' | 'ISMC';
  depthMm: number;
  widthMm: number;
  flangeThicknessMm: number;
  webThicknessMm: number;
}

export const SteelSectionsDrawing: React.FC<SteelSectionsDrawingProps> = ({
  sectionType,
  depthMm,
  widthMm,
  flangeThicknessMm,
  webThicknessMm,
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : 'relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-6 flex flex-col items-center shadow-sm select-none w-full h-full justify-center min-h-[300px]';

  // Base coordinates and scaling to fit a 450x220 viewBox
  // Let's cap the maximum dimension to 400 pixels for SVG drawing
  const maxDim = 400; // max expected mm input
  const scale = 150 / maxDim; // scale mm to pixels

  const d = depthMm * scale;
  const w = widthMm * scale;
  const tf = flangeThicknessMm * scale;
  const tw = webThicknessMm * scale;

  const cx = 225; // center x
  const cy = 110; // center y

  // Render variables depending on section type
  let pathD = '';
  let labels: { x: number; y: number; text: string; anchor: 'start' | 'end' | 'middle'; rotate?: number }[] = [];

  if (sectionType === 'ISMB') {
    // I-Beam centered
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - d / 2;
    const bottom = cy + d / 2;

    pathD = `
      M ${left},${top} 
      H ${right} 
      V ${top + tf} 
      H ${cx + tw / 2} 
      V ${bottom - tf} 
      H ${right} 
      V ${bottom} 
      H ${left} 
      V ${bottom - tf} 
      H ${cx - tw / 2} 
      V ${top + tf} 
      H ${left} 
      Z
    `.replace(/\s+/g, ' ');

    labels = [
      { x: cx, y: top - 8, text: `Flange Width (B): ${widthMm} mm`, anchor: 'middle' },
      { x: right + 15, y: cy, text: `Depth (h): ${depthMm} mm`, anchor: 'start' },
      { x: cx - tw / 2 - 8, y: cy, text: `t_w: ${webThicknessMm} mm`, anchor: 'end' },
      { x: left - 15, y: top + tf / 2, text: `t_f: ${flangeThicknessMm} mm`, anchor: 'end' }
    ];
  } else if (sectionType === 'ISA') {
    // Angle Section (L shape)
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - d / 2;
    const bottom = cy + d / 2;

    pathD = `
      M ${left},${top} 
      H ${left + tw} 
      V ${bottom - tf} 
      H ${right} 
      V ${bottom} 
      H ${left} 
      Z
    `.replace(/\s+/g, ' ');

    labels = [
      { x: left + tw / 2, y: top - 8, text: `t: ${flangeThicknessMm} mm`, anchor: 'middle' },
      { x: right + 10, y: bottom - tf / 2, text: `t: ${flangeThicknessMm} mm`, anchor: 'start' },
      { x: cx, y: bottom + 16, text: `Width (B): ${widthMm} mm`, anchor: 'middle' },
      { x: left - 15, y: cy, text: `Depth (A): ${depthMm} mm`, anchor: 'end' }
    ];
  } else if (sectionType === 'ISMC') {
    // Channel Section (C shape)
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - d / 2;
    const bottom = cy + d / 2;

    pathD = `
      M ${right},${top} 
      H ${left} 
      V ${bottom} 
      H ${right} 
      V ${bottom - tf} 
      H ${left + tw} 
      V ${top + tf} 
      H ${right} 
      Z
    `.replace(/\s+/g, ' ');

    labels = [
      { x: cx, y: top - 8, text: `Flange Width (B): ${widthMm} mm`, anchor: 'middle' },
      { x: left - 15, y: cy, text: `Depth (h): ${depthMm} mm`, anchor: 'end' },
      { x: left + tw / 2, y: cy, text: `t_w: ${webThicknessMm} mm`, anchor: 'middle' },
      { x: right + 15, y: top + tf / 2, text: `t_f: ${flangeThicknessMm} mm`, anchor: 'start' }
    ];
  }

  // Draw dimension lines
  const renderDimensionLines = () => {
    const left = cx - w / 2;
    const right = cx + w / 2;
    const top = cy - d / 2;
    const bottom = cy + d / 2;

    return (
      <g stroke="currentColor" strokeWidth="0.8" className="text-muted-foreground/40" fill="none">
        {/* Height dimension guide */}
        <line x1={right + 10} y1={top} x2={right + 10} y2={bottom} />
        <path d={`M ${right + 7},${top} L ${right + 13},${top} M ${right + 7},${bottom} L ${right + 13},${bottom}`} />

        {/* Width dimension guide */}
        {sectionType !== 'ISA' && (
          <>
            <line x1={left} y1={top - 5} x2={right} y2={top - 5} />
            <path d={`M ${left},${top - 8} L ${left},${top - 2} M ${right},${top - 8} L ${right},${top - 2}`} />
          </>
        )}
        {sectionType === 'ISA' && (
          <>
            <line x1={left} y1={bottom + 10} x2={right} y2={bottom + 10} />
            <path d={`M ${left},${bottom + 7} L ${left},${bottom + 13} M ${right},${bottom + 7} L ${right},${bottom + 13}`} />
            {/* Height dimension guide on left */}
            <line x1={left - 10} y1={top} x2={left - 10} y2={bottom} />
            <path d={`M ${left - 13},${top} L ${left - 7},${top} M ${left - 13},${bottom} L ${left - 7},${bottom}`} />
          </>
        )}
      </g>
    );
  };

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        Rolled Steel Section ({sectionType})
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 450 220"
        className="overflow-visible select-none"
      >
        {/* Profile Path */}
        <path
          d={pathD}
          fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
          stroke="var(--chart-1, #3b82f6)"
          strokeWidth="3"
          strokeLinejoin="round"
          className="transition-all duration-300"
        />

        {/* Dimension Guides */}
        {renderDimensionLines()}

        {/* Dynamic Labels */}
        <g className="font-mono text-[10px] fill-muted-foreground font-bold">
          {labels.map((label, idx) => (
            <text
              key={idx}
              x={label.x}
              y={label.y}
              textAnchor={label.anchor}
              className="fill-foreground font-semibold"
            >
              {label.text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SteelSectionsDrawing;
