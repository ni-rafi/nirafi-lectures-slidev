import React from 'react';

interface SectionIsolationDrawingProps {
  activeStep?: number; // 0: continuous, 1: cut line, 2: separation, 3: Axial P, 4: Shear V, 5: Moment M, 6: Torque T, 7: Focus SFD/BMD
}

export const SectionIsolationDrawing: React.FC<SectionIsolationDrawingProps> = ({
  activeStep = 0,
}) => {
  const showCutLine = activeStep >= 1;
  const isSeparated = activeStep >= 2;
  const showSeamOutline = activeStep >= 1; // Appends the cut lines at Step 1 before separation
  const showP = activeStep >= 3;
  const showV = activeStep >= 4;
  const showM = activeStep >= 5;
  const showT = activeStep >= 6;

  const showPArrow = showP && activeStep < 7;
  const showTArrow = showT && activeStep < 7;

  // Translation values for the left and right segments
  // At step 0 and 1, they meet in the middle at X = 390
  // At step >= 2, they slide apart by 90px each (left to X = 300, right to X = 480)
  const leftTransform = !isSeparated ? 'translate(90px, 0)' : 'translate(0, 0)';
  const rightTransform = !isSeparated ? 'translate(-90px, 0)' : 'translate(0, 0)';

  const cutFaceOpacity = isSeparated ? 1 : 0;

  // Opacities for the text panels inside the canvas
  const getPanelClass = (targetStep: number) => {
    const isRevealed = activeStep >= targetStep;
    const isDeactivated = activeStep === 7 && (targetStep === 3 || targetStep === 6);
    const isActive = activeStep === targetStep;

    if (!isRevealed) return 'opacity-0 scale-95 duration-300 pointer-events-none transition-all';
    if (isDeactivated) return 'opacity-15 line-through saturate-50 scale-98 transition-all duration-300';
    if (isActive) return 'opacity-100 scale-100 transition-all duration-300 font-bold';
    return 'opacity-85 transition-all duration-300';
  };

  return (
    <div className="w-full flex justify-center py-1 select-none animate-in fade-in duration-300">
      <svg className="w-full max-w-[800px] h-[270px] overflow-visible" viewBox="0 0 800 305">
        <defs>
          <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-slate-200/40 dark:stroke-slate-800/40" strokeWidth="0.5" />
          </pattern>
        </defs>
        
        {/* Background Grid */}
        <rect width="800" height="305" fill="url(#grid-pattern)" className="opacity-60" />

        {/* Central dashed Cut Line (visible from Step 1 onwards) */}
        <g className={`transition-opacity duration-500 ${showCutLine ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <line
            x1="390"
            y1="50"
            x2="390"
            y2="210"
            className="stroke-rose-500/80"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x="390"
            y="42"
            textAnchor="middle"
            className="text-[10px] font-bold font-mono fill-rose-500 uppercase tracking-wider"
          >
            Virtual Cut Plane
          </text>
        </g>

        {/* ==================== LEFT SEGMENT GROUP ==================== */}
        <g
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: leftTransform }}
        >
          {/* Top distributed load (UDL) */}
          <line x1="100" y1="85" x2="300" y2="85" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3 3" />
          {[100, 140, 180, 220, 260, 300].map((x) => (
            <g key={x} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1">
              <path d={`M ${x},85 L ${x},107 M ${x-3},102 L ${x},107 L ${x+3},102`} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
          <text x="195" y="78" className="text-[10px] font-bold font-mono fill-slate-400 dark:fill-slate-500">w</text>

          {/* Left support: Hinge */}
          <polygon points="140,150 132,165 148,165" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="125" y1="165" x2="155" y2="165" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
          <path d="M 140,195 L 140,168 M 136,175 L 140,168 L 144,175" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="148" y="188" className="text-[10px] font-mono fill-emerald-500 dark:fill-emerald-400 font-bold">R_A</text>

          {/* 3D Beam Block: Left segment fills */}
          <path d="M 100,110 L 120,90 V 130 L 100,150 Z" className="fill-slate-200 dark:fill-slate-700/80" />
          <path d="M 100,110 L 300,110 L 320,90 L 120,90 Z" className="fill-slate-200/90 dark:fill-slate-700" />
          <rect x="100" y="110" width="200" height="40" className="fill-slate-100 dark:fill-slate-800" />

          {/* Right Cut Face (Exposed cross section fill) */}
          <path
            d="M 300,110 L 320,90 L 320,130 L 300,150 Z"
            className="fill-indigo-500/15 dark:fill-indigo-500/25 transition-opacity duration-300"
            style={{ opacity: cutFaceOpacity }}
          />

          {/* Outlines & Strokes (Dynamically deactivating contact lines when uncut) */}
          {/* Left end outline */}
          <path d="M 100,110 L 120,90 V 130 L 100,150 Z" fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          {/* Front top & bottom lines */}
          <line x1="100" y1="110" x2="300" y2="110" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          <line x1="100" y1="150" x2="300" y2="150" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          {/* Back top edge line */}
          <line x1="120" y1="90" x2="320" y2="90" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          
          {/* Contact junction strokes (Visible from Step 1 onwards) */}
          <line x1="300" y1="110" x2="300" y2="150" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="300" y1="110" x2="320" y2="90" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="320" y1="90" x2="320" y2="130" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="300" y1="150" x2="320" y2="130" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />

          <text x="200" y="135" textAnchor="middle" className="text-[11px] font-bold font-mono fill-slate-500 dark:fill-slate-400">Left Side</text>

          {/* ==================== INTERNAL ACTIONS ON LEFT FACE ==================== */}
          {/* Axial Force P */}
          <g className={`transition-opacity duration-300 ${showPArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 310,120 L 350,120 M 343,115 L 350,120 L 343,125" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="335" y="112" className="text-[11px] font-black font-mono fill-blue-500 dark:fill-blue-400">P</text>
          </g>

          {/* Shear Force V (Downward) */}
          <g className={`transition-opacity duration-300 ${showV ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 310,120 L 310,160 M 305,153 L 310,160 L 315,153" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="318" y="155" className="text-[11px] font-black font-mono fill-rose-500 dark:fill-rose-400">V</text>
          </g>

          {/* Bending Moment M (CCW) */}
          <g className={`transition-opacity duration-300 ${showM ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 325,138 A 25,25 0 0,1 325,102 M 318,101 L 325,102 L 325,109" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="282" y="123" className="text-[11px] font-black font-mono fill-indigo-500 dark:fill-indigo-400">M</text>
          </g>

          {/* Torque T */}
          <g className={`transition-opacity duration-300 ${showTArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 280,98 C 265,98 265,130 280,142" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M 280,142 C 295,150 305,135 295,105" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 291,109 L 295,105 L 299,110" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="290" y="90" className="text-[11px] font-black font-mono fill-amber-500 dark:fill-amber-400">T</text>
          </g>
        </g>

        {/* ==================== RIGHT SEGMENT GROUP ==================== */}
        <g
          className="transition-transform duration-500 ease-in-out"
          style={{ transform: rightTransform }}
        >
          {/* Top distributed load (UDL) */}
          <line x1="480" y1="85" x2="680" y2="85" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1" strokeDasharray="3 3" />
          {[480, 520, 560, 600, 640, 680].map((x) => (
            <g key={x} className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1">
              <path d={`M ${x},85 L ${x},107 M ${x-3},102 L ${x},107 L ${x+3},102`} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
          <text x="575" y="78" className="text-[10px] font-bold font-mono fill-slate-400 dark:fill-slate-500">w</text>

          {/* Right support: Roller */}
          <polygon points="540,150 532,162 548,162" className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <circle cx="536" cy="165" r="2.5" className="fill-slate-400 dark:fill-slate-500" />
          <circle cx="544" cy="165" r="2.5" className="fill-slate-400 dark:fill-slate-500" />
          <line x1="525" y1="168" x2="555" y2="168" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" />
          <path d="M 540,195 L 540,169 M 536,176 L 540,169 L 544,176" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="548" y="188" className="text-[10px] font-mono fill-emerald-500 dark:fill-emerald-400 font-bold">R_B</text>

          {/* 3D Beam Block: Right segment fills */}
          {/* Right end face fill */}
          <path d="M 680,110 L 700,90 V 130 L 680,150 Z" className="fill-slate-200 dark:fill-slate-700/80" />
          {/* Top face fill */}
          <path d="M 480,110 L 680,110 L 700,90 L 500,90 Z" className="fill-slate-200/90 dark:fill-slate-700" />
          {/* Front face fill */}
          <rect x="480" y="110" width="200" height="40" className="fill-slate-100 dark:fill-slate-800" />

          {/* Left Cut Face (Exposed cross section fill) */}
          <path
            d="M 480,110 L 500,90 L 500,130 L 480,150 Z"
            className="fill-indigo-500/15 dark:fill-indigo-500/25 transition-opacity duration-300"
            style={{ opacity: cutFaceOpacity }}
          />

          {/* Outlines & Strokes */}
          {/* Right end outline */}
          <path d="M 680,110 L 700,90 V 130 L 680,150 Z" fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          {/* Front top & bottom lines */}
          <line x1="480" y1="110" x2="680" y2="110" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          <line x1="480" y1="150" x2="680" y2="150" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />
          {/* Back top edge line */}
          <line x1="500" y1="90" x2="700" y2="90" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" />

          {/* Contact junction strokes (Visible from Step 1 onwards) */}
          <line x1="480" y1="110" x2="480" y2="150" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="480" y1="110" x2="500" y2="90" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="500" y1="90" x2="500" y2="130" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />
          <line x1="480" y1="150" x2="500" y2="130" className={`stroke-slate-400 dark:stroke-slate-600 transition-opacity duration-300 ${showSeamOutline ? 'opacity-100' : 'opacity-0'}`} strokeWidth="2" />

          <text x="580" y="135" textAnchor="middle" className="text-[11px] font-bold font-mono fill-slate-500 dark:fill-slate-400">Right Side</text>

          {/* ==================== INTERNAL ACTIONS ON RIGHT FACE ==================== */}
          {/* Axial Force P */}
          <g className={`transition-opacity duration-300 ${showPArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 490,120 L 450,120 M 457,115 L 450,120 L 457,125" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="465" y="112" className="text-[11px] font-black font-mono fill-blue-500 dark:fill-blue-400">P</text>
          </g>

          {/* Shear Force V (Upward) */}
          <g className={`transition-opacity duration-300 ${showV ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 490,120 L 490,80 M 485,87 L 490,80 L 495,87" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="498" y="90" className="text-[11px] font-black font-mono fill-rose-500 dark:fill-rose-400">V</text>
          </g>

          {/* Bending Moment M (CW) */}
          <g className={`transition-opacity duration-300 ${showM ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 475,102 A 25,25 0 0,1 475,138 M 481,139 L 475,138 L 475,131" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="502" y="123" className="text-[11px] font-black font-mono fill-indigo-500 dark:fill-indigo-400">M</text>
          </g>

          {/* Torque T */}
          <g className={`transition-opacity duration-300 ${showTArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <path d="M 500,98 C 515,98 515,130 500,142" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 3" />
            <path d="M 500,142 C 485,150 475,135 485,105" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 489,109 L 485,105 L 481,110" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <text x="500" y="90" className="text-[11px] font-black font-mono fill-amber-500 dark:fill-amber-400">T</text>
          </g>
        </g>

        {/* ==================== INTEGRATED TEXT PANEL OVERLAYS ==================== */}

        {/* 1. Virtual Cut Text Panel (Top-Left) */}
        <foreignObject x="10" y="10" width="220" height="75" className={`transition-all duration-300 ${getPanelClass(1)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-indigo-500/25 p-2 rounded-lg shadow-xs select-text">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wide block mb-0.5">01. Virtual Cut</span>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Identify section coordinate x where you want to analyze internal actions.
            </p>
          </div>
        </foreignObject>

        {/* 2. Separation Text Panel (Bottom-Left) */}
        <foreignObject x="10" y="170" width="220" height="75" className={`transition-all duration-300 ${getPanelClass(2)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-indigo-500/25 p-2 rounded-lg shadow-xs select-text">
            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wide block mb-0.5">02. Separation</span>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Separate left & right segments to isolate their Free Body Diagrams.
            </p>
          </div>
        </foreignObject>

        {/* 3. Axial Force Text Panel (Top-Center) */}
        <foreignObject x="290" y="5" width="220" height="85" className={`transition-all duration-300 ${getPanelClass(3)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-blue-500/25 p-2 rounded-lg shadow-xs select-text">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wide block">03. Axial Force (P)</span>
              <span className="text-[9.5px] font-black text-blue-500">σ = P/A</span>
            </div>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Acts normal to cut face. Outward tension vectors pull outward on both segments.
            </p>
          </div>
        </foreignObject>

        {/* 4. Shear Force Text Panel (Top-Right) */}
        <foreignObject x="570" y="10" width="220" height="95" className={`transition-all duration-300 ${getPanelClass(4)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-rose-500/25 p-2 rounded-lg shadow-xs select-text">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wide block">04. Shear Force (V)</span>
              <span className="text-[9.5px] font-black text-rose-500">τ = VQ/Ib</span>
            </div>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Acts parallel to cut face. Downward shear on left cut, upward shear on right cut.
            </p>
          </div>
        </foreignObject>

        {/* 5. Bending Moment Text Panel (Bottom-Right) */}
        <foreignObject x="570" y="170" width="220" height="95" className={`transition-all duration-300 ${getPanelClass(5)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-indigo-500/25 p-2 rounded-lg shadow-xs select-text">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-wide block">05. Bending Moment</span>
              <span className="text-[9.5px] font-black text-indigo-500">σ = My/I</span>
            </div>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Rotational bending couple. CCW moment on left cut, CW moment on right cut.
            </p>
          </div>
        </foreignObject>

        {/* 6. Torque Text Panel (Bottom-Center) */}
        <foreignObject x="290" y="170" width="220" height="75" className={`transition-all duration-300 ${getPanelClass(6)}`}>
          <div className="bg-background/95 dark:bg-slate-900/95 border border-amber-500/25 p-2 rounded-lg shadow-xs select-text">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide block">06. Torque (T)</span>
              <span className="text-[9.5px] font-black text-amber-500">τ = Tr/J</span>
            </div>
            <p className="text-[9.5px] text-muted-foreground leading-snug">
              Torsional twist couple rotating around the member longitudinal axis.
            </p>
          </div>
        </foreignObject>

        {/* 7. Focus Banner Overlay (Bottom-Center, wider span) */}
        <foreignObject x="30" y="242" width="740" height="58" className={`transition-all duration-300 ${activeStep >= 7 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/35 text-emerald-800 dark:text-emerald-300 p-2 rounded-xl text-[10px] text-center font-mono leading-normal shadow-xs backdrop-blur-xs select-text animate-pulse">
            <strong>Key Focus:</strong> For typical beam profiles, we prioritize tracking <strong>Shear Force (V)</strong> and <strong>Bending Moment (M)</strong>. Axial (P) and Torque (T) are deactivated here (will be covered in respective topics elsewhere).
          </div>
        </foreignObject>
      </svg>
    </div>
  );
};
