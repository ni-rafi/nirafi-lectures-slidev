import React from 'react';

interface BeamBendingDrawingProps {
  activeStep?: number; // 0: straight, 1: curved, 2: arrows + neutral axis
  descriptionCard?: React.ReactNode;
}

export const BeamBendingDrawing: React.FC<BeamBendingDrawingProps> = ({
  activeStep = 0,
  descriptionCard,
}) => {
  const isCurved = activeStep >= 1;
  const showStress = activeStep >= 1;
  const showArrows = activeStep >= 2;

  // Deflection scale factor for the midpoint of the beam
  const dy = isCurved ? 50 : 0;

  // CSS transitions for dynamic bending morphing
  const transitionClass = "transition-all duration-700 ease-in-out";

  // EXACT quadratic bezier curve deflection formula matching the SVG Q curve (shifted right by 100px)
  const getDeflection = (x: number) => {
    const t = (x - 250) / 500;
    return dy * 2 * t * (1 - t);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 py-0.5 select-none animate-in fade-in duration-300">
      {descriptionCard && (
        <div className="w-full lg:w-[220px] bg-background/95 dark:bg-slate-900/95 border border-border/50 p-3 rounded-lg shadow-sm shrink-0">
          {descriptionCard}
        </div>
      )}
      <div className="flex-1 w-full max-w-[650px] overflow-visible">
        <svg className="w-full h-auto overflow-visible" viewBox="210 15 620 245">
        <defs>
          <pattern id="grid-pattern-bend" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
          
          <linearGradient id="comp-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="tens-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <rect x="210" y="15" width="620" height="245" fill="url(#grid-pattern-bend)" className="opacity-60" />

        {/* ==================== 3D SUPPORT SHAPES (Rendered behind the beam) ==================== */}
        {/* Left Support: Hinge shape */}
        <g>
          {/* Back face triangle */}
          <polygon points="270,130 262,145 278,145" className="fill-slate-400/80 dark:fill-slate-700/80 stroke-slate-500/60 dark:stroke-slate-600/60" strokeWidth="1" />
          {/* Base plate face */}
          <polygon points="242,165 258,165 278,145 262,145" className="fill-slate-350 dark:fill-slate-750 stroke-slate-400/60 dark:stroke-slate-550" strokeWidth="1" />
          {/* Left sloped face */}
          <polygon points="250,150 270,130 262,145 242,165" className="fill-slate-200/90 dark:fill-slate-700 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          {/* Right sloped face */}
          <polygon points="250,150 270,130 278,145 258,165" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          {/* Front face triangle */}
          <polygon points="250,150 242,165 258,165" className="fill-slate-300 dark:fill-slate-550 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          
          {/* Ground lines */}
          <line x1="235" y1="165" x2="265" y2="165" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="255" y1="145" x2="285" y2="145" className="stroke-slate-400/60 dark:stroke-slate-500/60" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* Right Support: Roller shape */}
        <g>
          {/* Back face triangle */}
          <polygon points="770,130 762,142 778,142" className="fill-slate-400/80 dark:fill-slate-700/80 stroke-slate-500/60 dark:stroke-slate-600/60" strokeWidth="1" />
          {/* Left sloped face */}
          <polygon points="750,150 770,130 762,142 742,162" className="fill-slate-200/90 dark:fill-slate-700 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          {/* Right sloped face */}
          <polygon points="750,150 770,130 778,142 758,162" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400/80 dark:stroke-slate-500" strokeWidth="1" />
          {/* Front face triangle */}
          <polygon points="750,150 742,162 758,162" className="fill-slate-300 dark:fill-slate-550 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          
          {/* Roller Cylinder 1 */}
          <line x1="746" y1="165" x2="766" y2="145" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="746" cy="165" r="2.5" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
          
          {/* Roller Cylinder 2 */}
          <line x1="754" y1="165" x2="774" y2="145" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="5.5" strokeLinecap="round" />
          <circle cx="754" cy="165" r="2.5" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.5" />
          
          {/* Base plate and ground lines */}
          <line x1="735" y1="168" x2="765" y2="168" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="735" y1="170" x2="765" y2="170" className="stroke-slate-500/80 dark:stroke-slate-550/80" strokeWidth="1" />
        </g>

        {/* ==================== 3D BENT BEAM GEOMETRY ==================== */}
        {/* Left side face */}
        <path d="M 250,130 L 270,110 V 130 L 250,150 Z" className="fill-slate-200 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Top Face */}
        <path
          d={`M 250,130 Q 500,${130 + dy} 750,130 L 770,110 Q 520,${110 + dy} 270,110 Z`}
          className={`fill-slate-200/90 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600 ${transitionClass}`}
          strokeWidth="1.5"
        />

        {/* Right end face outline */}
        <path d="M 750,130 L 770,110 V 130 L 750,150 Z" className="fill-slate-200 dark:fill-slate-700/80 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Front Face top-half (Compression zone, shown on step 1) */}
        <path
          d={`M 250,130 Q 500,${130 + dy} 750,130 V 140 Q 500,${140 + dy} 250,140 Z`}
          fill={showStress ? "url(#comp-grad)" : "none"}
          className={`stroke-slate-400/20 dark:stroke-slate-600/10 ${transitionClass}`}
          strokeWidth="0.5"
        />
        
        {/* Front Face bottom-half (Tension zone, shown on step 1) */}
        <path
          d={`M 250,140 Q 500,${140 + dy} 750,140 V 150 Q 500,${150 + dy} 250,150 Z`}
          fill={showStress ? "url(#tens-grad)" : "none"}
          className={`stroke-slate-400/20 dark:stroke-slate-600/10 ${transitionClass}`}
          strokeWidth="0.5"
        />
        
        {/* Combined Front Border Outline */}
        <path
          d={`M 250,130 Q 500,${130 + dy} 750,130 V 150 Q 500,${150 + dy} 250,150 Z`}
          fill="none"
          className={`stroke-slate-400 dark:stroke-slate-600 ${transitionClass}`}
          strokeWidth="2"
        />

        {/* ==================== STRESS MARKS (Step 2) ==================== */}
        {/* Neutral Axis (NA) */}
        <g className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}>
          <path d={`M 250,140 Q 500,${140 + dy} 750,140`} fill="none" className="stroke-indigo-500/80" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x="500" y={168 + dy} textAnchor="middle" className="text-[10px] font-bold font-mono fill-indigo-500">Neutral Axis (Zero Stress)</text>
        </g>

        {/* Compression Stress Vectors (pointing inward to the center) */}
        <g
          stroke="#ef4444"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Left half: points right */}
          <path d={`M 305,${135 + getDeflection(305)} L 330,${135 + getDeflection(330)} M 324,${131 + getDeflection(330)} L 330,${135 + getDeflection(330)} L 324,${139 + getDeflection(330)}`} />
          <path d={`M 345,${135 + getDeflection(345)} L 370,${135 + getDeflection(370)} M 364,${131 + getDeflection(370)} L 370,${135 + getDeflection(370)} L 364,${139 + getDeflection(370)}`} />
          
          {/* Right half: points left */}
          <path d={`M 695,${135 + getDeflection(695)} L 670,${135 + getDeflection(670)} M 676,${131 + getDeflection(670)} L 670,${135 + getDeflection(670)} L 676,${139 + getDeflection(670)}`} />
          <path d={`M 655,${135 + getDeflection(655)} L 630,${135 + getDeflection(630)} M 636,${131 + getDeflection(630)} L 630,${135 + getDeflection(630)} L 636,${139 + getDeflection(630)}`} />
        </g>

        {/* Tension Stress Vectors (pointing outward to the ends) */}
        <g
          stroke="#10b981"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-opacity duration-500 ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Left half: points left */}
          <path d={`M 330,${145 + getDeflection(330)} L 305,${145 + getDeflection(305)} M 311,${141 + getDeflection(305)} L 305,${145 + getDeflection(305)} L 311,${149 + getDeflection(305)}`} />
          <path d={`M 370,${145 + getDeflection(370)} L 345,${145 + getDeflection(345)} M 351,${141 + getDeflection(345)} L 345,${145 + getDeflection(345)} L 351,${149 + getDeflection(345)}`} />
          
          {/* Right half: points right */}
          <path d={`M 630,${145 + getDeflection(630)} L 655,${145 + getDeflection(655)} M 649,${141 + getDeflection(655)} L 655,${145 + getDeflection(655)} L 649,${149 + getDeflection(655)}`} />
          <path d={`M 670,${145 + getDeflection(670)} L 695,${145 + getDeflection(695)} M 689,${141 + getDeflection(695)} L 695,${145 + getDeflection(695)} L 689,${149 + getDeflection(695)}`} />
        </g>

        {/* ==================== LOAD P ==================== */}
        <g>
          <path d={`M 500,20 L 500,${130 + dy/2} M 494,${122 + dy/2} L 500,${130 + dy/2} L 506,${122 + dy/2}`} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={transitionClass} />
          <text x="508" y="32" className="text-[11px] font-black font-mono fill-rose-500">LOAD P</text>
        </g>

        {/* ==================== SUPPORT REACTION VECTOR ARROWS (Rendered Above Beam) ==================== */}
        {/* Left reaction arrow */}
        <g>
          <path d="M 250,195 L 250,167 M 246,174 L 250,167 L 254,174" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="258" y="172" width="70" height="25">
            <div className="text-[9.5px] font-mono font-bold text-emerald-500 dark:text-emerald-400 select-text leading-none">
              R<sub>A</sub> = P/2
            </div>
          </foreignObject>
        </g>

        {/* Right reaction arrow */}
        <g>
          <path d="M 750,198 L 750,170 M 746,177 L 750,170 L 754,177" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <foreignObject x="758" y="175" width="70" height="25">
            <div className="text-[9.5px] font-mono font-bold text-emerald-500 dark:text-emerald-400 select-text leading-none">
              R<sub>B</sub> = P/2
            </div>
          </foreignObject>
        </g>

        {/* Dynamic bottom caption */}
        <text x="500" y="240" textAnchor="middle" className="text-[11.5px] fill-muted-foreground font-medium transition-all duration-300">
          {activeStep === 0 && "Step 0: Straight, undeflected beam member."}
          {activeStep === 1 && "Step 1: Applied Load P bends the span downwards, compressing the top and stretching the bottom."}
          {activeStep >= 2 && "Step 2: Internal fiber stresses (compression/tension vectors) and neutral axis exposed."}
        </text>
      </svg>
      </div>
    </div>
  );
};
