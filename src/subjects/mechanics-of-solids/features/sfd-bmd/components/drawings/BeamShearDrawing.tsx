import React from 'react';

interface BeamShearDrawingProps {
  activeStep?: number; // 0: aligned, 1: shear slip, 2: shear stress vectors exposed
}

export const BeamShearDrawing: React.FC<BeamShearDrawingProps> = ({
  activeStep = 0,
}) => {
  const isSheared = activeStep >= 1;
  const showStress = activeStep >= 2;

  // Vertical relative slip distance
  const dy = isSheared ? 22 : 0;

  // CSS transitions for sliding animation
  const transitionClass = "transition-all duration-700 ease-in-out";

  return (
    <div className="w-full flex justify-center py-2 select-none animate-in fade-in duration-300">
      <svg className="w-full max-w-[850px] h-[280px] overflow-visible" viewBox="0 0 850 280">
        <defs>
          <pattern id="grid-pattern-shear-bend" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="850" height="280" fill="url(#grid-pattern-shear-bend)" className="opacity-60" />

        {/* ==================== 3D SUPPORT SHAPES (Rendered behind the beam) ==================== */}
        {/* Left Support Hinge (Stays fixed at Y=150) */}
        <g>
          <polygon points="270,130 262,145 278,145" className="fill-slate-400/80 dark:fill-slate-700/80 stroke-slate-500/60 dark:stroke-slate-600/60" strokeWidth="1" />
          <polygon points="242,165 258,165 278,145 262,145" className="fill-slate-350 dark:fill-slate-750 stroke-slate-400/60 dark:stroke-slate-550" strokeWidth="1" />
          <polygon points="250,150 270,130 262,145 242,165" className="fill-slate-200/90 dark:fill-slate-650 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          <polygon points="250,150 270,130 278,145 258,165" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          <polygon points="250,150 242,165 258,165" className="fill-slate-300 dark:fill-slate-550 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="235" y1="165" x2="265" y2="165" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="255" y1="145" x2="285" y2="145" className="stroke-slate-400/60 dark:stroke-slate-500/60" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* Right Support Roller (Moves with the sheared right segment) */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          <polygon points="770,130 762,142 778,142" className="fill-slate-400/80 dark:fill-slate-700/80 stroke-slate-500/60 dark:stroke-slate-600/60" strokeWidth="1" />
          <polygon points="750,150 770,130 762,142 742,162" className="fill-slate-200/90 dark:fill-slate-700 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          <polygon points="750,150 770,130 778,142 758,162" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          <polygon points="750,150 742,162 758,162" className="fill-slate-300 dark:fill-slate-550 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          
          <line x1="746" y1="165" x2="766" y2="145" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="746" cy="165" r="2.5" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
          <line x1="754" y1="165" x2="774" y2="145" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="754" cy="165" r="2.5" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
          
          <line x1="735" y1="168" x2="765" y2="168" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="735" y1="170" x2="765" y2="170" className="stroke-slate-500/80 dark:stroke-slate-550/80" strokeWidth="1" />
        </g>

        {/* ==================== LEFT BEAM SEGMENT (X = 250 to 480, stays at Y = 130) ==================== */}
        <g>
          {/* Left end face */}
          <path d="M 250,130 L 270,110 V 130 L 250,150 Z" className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Top face */}
          <path d="M 250,130 L 480,130 L 500,110 L 270,110 Z" className="fill-slate-200 dark:fill-slate-700/90 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Front face outline */}
          <path d="M 250,130 L 480,130 V 150 L 250,150 Z" className="fill-slate-200/90 dark:fill-slate-700/70 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          
          {/* Right cut face (exposed vertical slice face) */}
          <path d="M 480,130 L 500,110 V 130 L 480,150 Z" className="fill-slate-350 dark:fill-slate-650 stroke-slate-450 dark:stroke-slate-550" strokeWidth="1.5" />
        </g>

        {/* ==================== RIGHT BEAM SEGMENT (X = 490 to 750, drops by dy) ==================== */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          {/* Left cut face (exposed vertical slice face) */}
          <path d="M 490,130 L 510,110 V 130 L 490,150 Z" className="fill-slate-350 dark:fill-slate-650 stroke-slate-450 dark:stroke-slate-550" strokeWidth="1.5" />
          {/* Top face */}
          <path d="M 490,130 L 750,130 L 770,110 L 510,110 Z" className="fill-slate-200 dark:fill-slate-700/90 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Right end face */}
          <path d="M 750,130 L 770,110 V 130 L 750,150 Z" className="fill-slate-250 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />
          {/* Front face outline */}
          <path d="M 490,130 L 750,130 V 150 L 490,150 Z" className="fill-slate-200/90 dark:fill-slate-700/70 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
        </g>

        {/* Interface Cut Indicator Lines (Dashed boundary shown at step 0) */}
        {!isSheared && (
          <line x1="485" y1="110" x2="485" y2="150" className="stroke-indigo-500/80 stroke-2" strokeDasharray="3 3" />
        )}

        {/* ==================== SHEAR FORCE VECTOR ARROWS (Step 2) ==================== */}
        {showStress && (
          <g className="animate-in fade-in duration-500">
            {/* Left Segment Cut: Shear Force acts DOWNWARDS (V) */}
            <path d="M 490,115 L 490,145 M 486,138 L 490,145 L 494,138" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <foreignObject x="450" y="118" width="35" height="25">
              <div className="text-[10px] font-mono font-bold text-rose-500 text-right leading-none">
                V<sub>int</sub>
              </div>
            </foreignObject>

            {/* Right Segment Cut: Shear Force acts UPWARDS (V) */}
            <path d="M 480,${125 + dy} L 480,${155 + dy} M 476,${132 + dy} L 480,${125 + dy} L 484,${132 + dy}" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: `translateY(${dy}px)` }} />
            <foreignObject x="502" y={120 + dy} width="35" height="25">
              <div className="text-[10px] font-mono font-bold text-rose-500 leading-none">
                V<sub>int</sub>
              </div>
            </foreignObject>

            {/* Shear stress distribution curve overlay in the sheared zone */}
            <path d={`M 500,${110 + dy} Q 525,${120 + dy/2} 500,130`} fill="none" className="stroke-rose-400/50" strokeWidth="1.5" strokeDasharray="2 2" />
            
            {/* Shear deformation strain angle gamma indicator */}
            <path d="M 480,130 A 15,15 0 0,0 488,142" fill="none" className="stroke-amber-500" strokeWidth="1.5" />
            <text x="474" y="145" className="text-[9.5px] font-mono font-bold fill-amber-500">&gamma;</text>
          </g>
        )}

        {/* ==================== EXTERNAL POINT LOAD P (Tip Load at Center) ==================== */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          <path d="M 500,20 L 500,130 M 494,122 L 500,130 L 506,122" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="508" y="32" className="text-[11px] font-black font-mono fill-rose-500">LOAD P</text>
        </g>

        {/* ==================== SUPPORT REACTION VECTOR ARROWS (Rendered Above Beam) ==================== */}
        {/* Left reaction force */}
        <g>
          <path d="M 250,195 L 250,167 M 246,174 L 250,167 L 254,174" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="258" y="172" width="70" height="25">
            <div className="text-[9.5px] font-mono font-bold text-emerald-500 dark:text-emerald-400 select-text leading-none">
              R<sub>A</sub> = P/2
            </div>
          </foreignObject>
        </g>

        {/* Right reaction force */}
        <g className={transitionClass} style={{ transform: `translateY(${dy}px)` }}>
          <path d="M 750,198 L 750,170 M 746,177 L 750,170 L 754,177" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="758" y="175" width="70" height="25">
            <div className="text-[9.5px] font-mono font-bold text-emerald-500 dark:text-emerald-400 select-text leading-none">
              R<sub>B</sub> = P/2
            </div>
          </foreignObject>
        </g>

        {/* Dynamic bottom caption */}
        <text x="500" y="248" textAnchor="middle" className="text-[11.5px] fill-muted-foreground font-medium transition-all duration-300">
          {activeStep === 0 && "Step 0: Straight beam showing transverse slice plane at the center."}
          {activeStep === 1 && "Step 1: Shear force P induces vertical relative sliding (slip) of adjacent slices."}
          {activeStep >= 2 && "Step 2: Internal shear stress vectors (V_int) and strain distortion (gamma) exposed."}
        </text>
      </svg>
    </div>
  );
};
