import React from 'react';

interface CantileverShearDrawingProps {
  activeStep?: number; // 0: aligned, 1: shear slip, 2: shear stress vectors exposed
}

export const CantileverShearDrawing: React.FC<CantileverShearDrawingProps> = ({
  activeStep = 0,
}) => {
  const isSheared = activeStep >= 1;
  const showStress = activeStep >= 2;
  const showArrows = activeStep >= 2;

  // Vertical relative slip distance
  const dy = isSheared ? 22 : 0;

  // CSS transitions for sliding animation
  const transitionClass = "transition-all duration-700 ease-in-out";

  return (
    <div className="w-full flex justify-center py-2 select-none animate-in fade-in duration-300">
      <svg className="w-full max-w-[850px] h-[280px] overflow-visible" viewBox="0 0 850 280">
        <defs>
          <pattern id="grid-pattern-shear-cant" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="850" height="280" fill="url(#grid-pattern-shear-cant)" className="opacity-60" />

        {/* ==================== 3D FIXED LEFT WALL BASE ==================== */}
        <g>
          {/* Concrete wall face */}
          <polygon points="260,40 280,20 280,210 260,230" className="fill-slate-100/90 dark:fill-slate-800/90 stroke-slate-350 dark:stroke-slate-700" strokeWidth="1" />
          {/* Hatching lines on the 3D wall face */}
          {[55, 75, 95, 115, 135, 155, 175, 195].map((y) => (
            <line key={y} x1="260" y1={y} x2="280" y2={y - 20} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
          ))}
        </g>
        <text x="295" y="75" className="text-[9.5px] font-bold font-mono fill-slate-400 dark:fill-slate-500 uppercase tracking-wide">Fixed Wall</text>

        {/* ==================== LEFT BEAM SEGMENT (X = 260 to 480, stays at Y = 130) ==================== */}
        <g>
          {/* Left end face */}
          <path d="M 260,110 L 280,90 V 120 L 260,140 Z" className="fill-slate-300 dark:fill-slate-650/80 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          {/* Top face */}
          <path d="M 260,110 L 480,110 L 500,90 L 280,90 Z" className="fill-slate-200 dark:fill-slate-700/90 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Front face outline */}
          <path d="M 260,110 L 480,110 V 140 L 260,140 Z" className="fill-slate-200/90 dark:fill-slate-700/70 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          
          {/* Right cut face */}
          <path d="M 480,110 L 500,90 V 120 L 480,140 Z" className="fill-slate-350 dark:fill-slate-650 stroke-slate-450 dark:stroke-slate-550" strokeWidth="1.5" />
        </g>

        {/* ==================== RIGHT BEAM SEGMENT (X = 490 to 760, drops by dy) ==================== */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          {/* Left cut face */}
          <path d="M 490,110 L 510,90 V 120 L 490,140 Z" className="fill-slate-350 dark:fill-slate-650 stroke-slate-450 dark:stroke-slate-550" strokeWidth="1.5" />
          {/* Top face */}
          <path d="M 490,110 L 760,110 L 780,90 L 510,90 Z" className="fill-slate-200 dark:fill-slate-700/90 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Right end face */}
          <path d="M 760,110 L 780,90 V 120 L 760,140 Z" className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Front face outline */}
          <path d="M 490,110 L 760,110 V 140 L 490,140 Z" className="fill-slate-200/90 dark:fill-slate-700/70 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
        </g>

        {/* Interface Cut Indicator Lines */}
        {!isSheared && (
          <line x1="485" y1="90" x2="485" y2="140" className="stroke-indigo-500/80 stroke-2" strokeDasharray="3 3" />
        )}

        {/* ==================== SHEAR FORCE VECTOR ARROWS (Step 2) ==================== */}
        {showStress && (
          <g className="animate-in fade-in duration-500">
            {/* Left Segment Cut: Shear Force acts DOWNWARDS (V) */}
            <path d="M 490,95 L 490,125 M 486,118 L 490,125 L 494,118" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <foreignObject x="450" y="98" width="35" height="25">
              <div className="text-[10px] font-mono font-bold text-rose-500 text-right leading-none">
                V<sub>int</sub>
              </div>
            </foreignObject>

            {/* Right Segment Cut: Shear Force acts UPWARDS (V) */}
            <path d="M 480,105 L 480,135 M 476,112 L 480,105 L 484,112" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateY(${dy}px)` }} />
            <foreignObject x="502" y={100 + dy} width="35" height="25">
              <div className="text-[10px] font-mono font-bold text-rose-500 leading-none">
                V<sub>int</sub>
              </div>
            </foreignObject>
            
            {/* Shear deformation strain angle gamma */}
            <path d="M 480,110 A 15,15 0 0,0 488,122" fill="none" className="stroke-amber-500" strokeWidth="1.5" />
            <text x="474" y="125" className="text-[9.5px] font-mono font-bold fill-amber-500">&gamma;</text>
          </g>
        )}

        {/* ==================== TIP LOAD P ==================== */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          <path d="M 760,30 L 760,110 M 754,102 L 760,110 L 766,102" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Moment reaction M_A */}
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
        <text x="510" y="248" textAnchor="middle" className="text-[11.5px] fill-muted-foreground font-medium transition-all duration-300">
          {activeStep === 0 && "Step 0: Straight cantilever beam showing slice plane cut in the middle."}
          {activeStep === 1 && "Step 1: Tip Load P produces relative vertical sliding (shear slip) at the slice cut."}
          {activeStep >= 2 && "Step 2: Internal shear forces (V_int) and wall reactions (R_A, M_A) exposed."}
        </text>
      </svg>
    </div>
  );
};
