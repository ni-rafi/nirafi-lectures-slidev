import React from 'react';

interface EarthworkMethodDrawingProps {
  method: 'mid' | 'trapezoidal' | 'prismoidal' | 'none';
  className?: string;
}

export const EarthworkMethodDrawing: React.FC<EarthworkMethodDrawingProps> = ({
  method,
  className = '',
}) => {
  // 3D coordinates for Station 1 (Left), Mid (Center), and Station 2 (Right)
  // Left: x = 60, Ground y = 120, Depth h = 40 (d1 = 1.6m)
  // Right: x = 240, Ground y = 105, Depth h = 20 (d2 = 0.8m)
  // Mid: x = 150, Ground y = 112.5, Depth h = 30 (d_mid = 1.2m)
  
  const sLeft = {
    xTL: 45, yTL: 80,
    xTR: 75, yTR: 80,
    xBL: 30, yBL: 120,
    xBR: 90, yBR: 120,
    lbl: 'A1 (Station 1)'
  };

  const sRight = {
    xTL: 225, yTL: 80,
    xTR: 255, yTR: 80,
    xBL: 217.5, yBL: 105,
    xBR: 262.5, yBR: 105,
    lbl: 'A2 (Station 2)'
  };

  const sMid = {
    xTL: 135, yTL: 80,
    xTR: 165, yTR: 80,
    xBL: 123.75, yBL: 112.5,
    xBR: 176.25, yBR: 112.5,
    lbl: 'Amid (Mid-Section)'
  };

  const getPath = (s: typeof sLeft) => {
    return `M ${s.xBL},${s.yBL} L ${s.xTL},${s.yTL} L ${s.xTR},${s.yTR} L ${s.xBR},${s.yBR} Z`;
  };

  // Determine highlighting based on current method
  const isMidActive = method === 'mid' || method === 'prismoidal';
  const isEndsActive = method === 'trapezoidal' || method === 'prismoidal';

  return (
    <div className={`w-full flex flex-col justify-between bg-muted/20 p-4 border border-border/40 rounded-xl ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground mb-2 block text-center">
        Longitudinal Prismoid Wireframe (Station Spacing L)
      </span>

      <div className="h-44 bg-background rounded-lg border border-border/20 relative flex items-center justify-center overflow-hidden">
        <svg viewBox="0 20 300 130" className="w-full h-full select-none overflow-visible">
          {/* Natural Ground Line connecting station beds */}
          <line
            x1={sLeft.xBL}
            y1={sLeft.yBL}
            x2={sRight.xBL}
            y2={sRight.yBL}
            className="stroke-muted-foreground/30 stroke-[1px] stroke-dasharray-[3 3]"
          />
          <line
            x1={sLeft.xBR}
            y1={sLeft.yBR}
            x2={sRight.xBR}
            y2={sRight.yBR}
            className="stroke-muted-foreground/30 stroke-[1px] stroke-dasharray-[3 3]"
          />

          {/* Road Bed (Formation) edge lines connecting top vertices */}
          <line
            x1={sLeft.xTL}
            y1={sLeft.yTL}
            x2={sRight.xTL}
            y2={sRight.yTL}
            className="stroke-primary/50 stroke-[1.5px]"
          />
          <line
            x1={sLeft.xTR}
            y1={sLeft.yTR}
            x2={sRight.xTR}
            y2={sRight.yTR}
            className="stroke-primary/50 stroke-[1.5px]"
          />

          {/* Shaded Volumes or Slices */}
          
          {/* Station 1 Slice (Left End) */}
          <path
            d={getPath(sLeft)}
            className={`transition-all duration-300 ${
              isEndsActive
                ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[2px]'
                : 'fill-muted/10 stroke-border/40 stroke-[1px]'
            }`}
          />

          {/* Station 2 Slice (Right End) */}
          <path
            d={getPath(sRight)}
            className={`transition-all duration-300 ${
              isEndsActive
                ? 'fill-indigo-500/20 stroke-indigo-600 stroke-[2px]'
                : 'fill-muted/10 stroke-border/40 stroke-[1px]'
            }`}
          />

          {/* Mid-Section Slice (Center) */}
          <path
            d={getPath(sMid)}
            className={`transition-all duration-300 ${
              isMidActive
                ? method === 'prismoidal'
                  ? 'fill-emerald-500/20 stroke-emerald-600 stroke-[2.5px]'
                  : 'fill-indigo-500/30 stroke-indigo-600 stroke-[2.5px]'
                : 'fill-muted/5 stroke-border/20 stroke-[1px] stroke-dasharray-[2 2]'
            }`}
          />

          {/* Dimension/Labels text overlays */}
          <text x={sLeft.xTL - 15} y={sLeft.yTL - 5} className="fill-muted-foreground text-[8px] font-mono">d1 = 1.6m</text>
          <text x={sRight.xTR + 5} y={sRight.yTL - 5} className="fill-muted-foreground text-[8px] font-mono">d2 = 0.8m</text>
          
          {isMidActive && (
            <text x={sMid.xTL} y={sMid.yTL - 5} className="fill-indigo-600 text-[8px] font-mono font-bold">
              dm = 1.2m
            </text>
          )}

          {/* Length Dimension Indicator L */}
          <g className="text-muted-foreground">
            <line x1={sLeft.xBL} y1={sLeft.yBL + 15} x2={sRight.xBL} y2={sRight.yBL + 15} stroke="currentColor" strokeWidth="1" />
            <polygon points={`${sLeft.xBL},${sLeft.yBL + 15} ${sLeft.xBL + 4},${sLeft.yBL + 12} ${sLeft.xBL + 4},${sLeft.yBL + 18}`} className="fill-current" />
            <polygon points={`${sRight.xBL},${sRight.yBL + 15} ${sRight.xBL - 4},${sRight.yBL + 12} ${sRight.xBL - 4},${sRight.yBL + 18}`} className="fill-current" />
            <text x="150" y={sMid.yBL + 22} textAnchor="middle" className="fill-current text-[9px] font-mono font-bold">Length (L)</text>
          </g>
        </svg>

        {/* Dynamic visual legends */}
        {method !== 'none' && (
          <div className="absolute bottom-2 left-2 right-2 bg-background/90 border border-border text-[9px] px-2 py-1 rounded-md font-mono flex justify-between items-center shadow-sm">
            {method === 'mid' && (
              <>
                <span className="text-indigo-600 font-bold">Mid-Section Method</span>
                <span>Volume = A_mid × L = 324.0 m³</span>
              </>
            )}
            {method === 'trapezoidal' && (
              <>
                <span className="text-indigo-600 font-bold">Trapezoidal Method</span>
                <span>Volume = [(A1 + A2) / 2] × L = 324.0 m³</span>
              </>
            )}
            {method === 'prismoidal' && (
              <>
                <span className="text-emerald-600 font-bold">Prismoidal Formula</span>
                <span>Volume = (L/6) × (A1 + 4·A_mid + A2) = 320.4 m³</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
