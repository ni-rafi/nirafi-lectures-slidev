import React from 'react';

interface CantileverBendingDrawingProps {
  activeStep?: number; // 0: straight, 1: curved deflection, 2: arrows + reactions
  descriptionCard?: React.ReactNode;
}

export const CantileverBendingDrawing: React.FC<CantileverBendingDrawingProps> = ({
  activeStep = 0,
  descriptionCard,
}) => {
  const isCurved = activeStep >= 1;
  const showStress = activeStep >= 1;
  const showArrows = activeStep >= 2;

  // Downward deflection of the cantilever tip (45px at step >= 1)
  const dy = isCurved ? 45 : 0;

  // CSS transitions for dynamic bending morphing
  const transitionClass = "transition-all duration-700 ease-in-out";

  // EXACT cubic bezier curve deflection formula matching the SVG C curve (shifted right by 140px)
  const getDeflection = (x: number) => {
    const t = (x - 260) / 500;
    return dy * (1.5 * t * t - 0.5 * t * t * t);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 py-0.5 select-none animate-in fade-in duration-300">
      {descriptionCard && (
        <div className="w-full lg:w-[220px] bg-background/95 dark:bg-slate-900/95 border border-border/50 p-3 rounded-lg shadow-sm shrink-0">
          {descriptionCard}
        </div>
      )}
      <div className="flex-1 w-full max-w-[640px] overflow-visible">
        <svg className="w-full h-auto overflow-visible" viewBox="200 15 610 245">
        <defs>
          <pattern id="grid-pattern-cant" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
          
          <linearGradient id="comp-grad-cant" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="tens-grad-cant" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <rect x="200" y="15" width="610" height="245" fill="url(#grid-pattern-cant)" className="opacity-60" />

        {/* ==================== 3D FIXED LEFT WALL BASE (Rendered behind the beam) ==================== */}
        <g>
          {/* Concrete wall face */}
          <polygon points="260,40 280,20 280,210 260,230" className="fill-slate-100/90 dark:fill-slate-800/90 stroke-slate-350 dark:stroke-slate-700" strokeWidth="1" />
          {/* Hatching lines on the 3D wall face */}
          {[55, 75, 95, 115, 135, 155, 175, 195].map((y) => (
            <line key={y} x1="260" y1={y} x2="280" y2={y - 20} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
          ))}
        </g>
        {/* Fixed Wall text placed above the beam and to the right of the wall base */}
        <text x="295" y="75" className="text-[9.5px] font-bold font-mono fill-slate-400 dark:fill-slate-500 uppercase tracking-wide">Fixed Wall</text>

        {/* ==================== 3D BENT BEAM GEOMETRY ==================== */}
        {/* Left end fixed face */}
        <path d="M 260,110 L 280,90 V 120 L 260,140 Z" className="fill-slate-300 dark:fill-slate-600/80 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

        {/* Top Face */}
        <path
          d={`M 260,110 C 460,110 610,${110 + dy/2} 760,${110 + dy} L 780,${90 + dy} C 630,${90 + dy/2} 480,90 280,90 Z`}
          className={`fill-slate-200/90 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600 ${transitionClass}`}
          strokeWidth="1.5"
        />

        {/* Right end face outline */}
        <path
          d={`M 760,${110 + dy} L 780,${90 + dy} V ${120 + dy} L 760,${140 + dy} Z`}
          className={`fill-slate-200 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600 ${transitionClass}`}
          strokeWidth="1.5"
        />

        {/* Front Face: Split into top-half (Tension) and bottom-half (Compression) */}
        {/* Top Half: Tension (Green tint - top stretches) */}
        <path
          d={`M 260,110 C 460,110 610,${110 + dy/2} 760,${110 + dy} V ${125 + dy} C 610,${125 + dy/2} 460,125 260,125 Z`}
          fill={showStress ? "url(#tens-grad-cant)" : "none"}
          className={`stroke-slate-400/20 dark:stroke-slate-600/10 ${transitionClass}`}
          strokeWidth="0.5"
        />

        {/* Bottom Half: Compression (Red tint - bottom squishes) */}
        <path
          d={`M 260,125 C 460,125 610,${125 + dy/2} 760,${125 + dy} V ${140 + dy} C 610,${140 + dy/2} 460,140 260,140 Z`}
          fill={showStress ? "url(#comp-grad-cant)" : "none"}
          className={`stroke-slate-400/20 dark:stroke-slate-600/10 ${transitionClass}`}
          strokeWidth="0.5"
        />

        {/* Combined Front Border Outline */}
        <path
          d={`M 260,110 C 460,110 610,${110 + dy/2} 760,${110 + dy} V ${140 + dy} C 610,${140 + dy/2} 460,140 260,140 Z`}
          fill="none"
          className={`stroke-slate-400 dark:stroke-slate-600 ${transitionClass}`}
          strokeWidth="2"
        />

        {/* ==================== FIBER STRESS ARROWS (Step 2) ==================== */}
        {/* Neutral Axis (NA) */}
        <g className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
          <path d={`M 260,125 C 460,125 610,${125 + dy/2} 760,${125 + dy}`} fill="none" className="stroke-indigo-500/80" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="510" y={146 + dy/2} className="text-[10px] font-bold font-mono fill-indigo-500">Neutral Axis (Zero Stress)</text>
        </g>

        {/* Tension Arrows (Top, pointing outward to the free end: points right) */}
        <g
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        >
          <path d={`M 360,${117.5 + getDeflection(360)} L 385,${117.5 + getDeflection(385)} M 379,${113.5 + getDeflection(385)} L 385,${117.5 + getDeflection(385)} L 379,${121.5 + getDeflection(385)}`} />
          <path d={`M 460,${117.5 + getDeflection(460)} L 485,${117.5 + getDeflection(485)} M 479,${113.5 + getDeflection(485)} L 485,${117.5 + getDeflection(485)} L 479,${121.5 + getDeflection(485)}`} />
        </g>

        {/* Compression Arrows (Bottom, pointing inward to fixed wall: points left) */}
        <g
          stroke="#ef4444"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        >
          <path d={`M 385,${132.5 + getDeflection(385)} L 360,${132.5 + getDeflection(360)} M 366,${128.5 + getDeflection(360)} L 360,${132.5 + getDeflection(360)} L 366,${136.5 + getDeflection(360)}`} />
          <path d={`M 485,${132.5 + getDeflection(485)} L 460,${132.5 + getDeflection(460)} M 466,${128.5 + getDeflection(460)} L 460,${132.5 + getDeflection(460)} L 466,${136.5 + getDeflection(460)}`} />
        </g>

        {/* ==================== TIP LOAD P (Always visible) ==================== */}
        <g>
          <path d={`M 760,30 L 760,${110 + dy} M 754,${102 + dy} L 760,${110 + dy} L 766,${102 + dy}`} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={transitionClass} />
          <text x="768" y="42" className="text-[11px] font-black font-mono fill-rose-500">LOAD P</text>
        </g>

        {/* ==================== FIXED WALL REACTIONS LAYER (Drawn Above Beam Geometry) ==================== */}
        {/* Force reaction R_A */}
        <g className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
          <path d="M 260,185 L 260,135 M 256,142 L 260,135 L 264,142" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="215" y="152" width="40" height="25">
            <div className="text-[9.5px] font-mono font-bold text-emerald-500 dark:text-emerald-400 select-text leading-none text-right">
              R<sub>A</sub> = P
            </div>
          </foreignObject>
        </g>

        {/* Moment reaction M_A (CCW vector arc, arrow tip points left/down-left to follow rotation) */}
        <g className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
          <path d="M 260,150 A 25,25 0 0,0 260,100" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 266,105 L 260,100 L 266,96" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="285" y="93" width="70" height="25">
            <div className="text-[9.5px] font-mono font-bold text-indigo-500 dark:text-indigo-400 select-text leading-none">
              M<sub>A</sub> = P · L
            </div>
          </foreignObject>
        </g>

        {/* Dynamic bottom caption */}
        <text x="510" y="240" textAnchor="middle" className="text-[11.5px] fill-muted-foreground font-medium transition-all duration-300">
          {activeStep === 0 && "Step 0: Straight, undeflected cantilever beam."}
          {activeStep === 1 && "Step 1: Lateral Tip Load P bends the beam down, creating top tension and bottom compression."}
          {activeStep >= 2 && "Step 2: Internal fiber stresses (compression/tension vectors) and neutral axis exposed."}
        </text>
      </svg>
      </div>
    </div>
  );
};
