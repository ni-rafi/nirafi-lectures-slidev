import React from 'react';

interface DiagramCoincidenceDrawingProps {
  activeStep?: number; // 0: baseline, 1: V=0, 2: V>0 (left half), 3: V<0 (right half)
}

export const DiagramCoincidenceDrawing: React.FC<DiagramCoincidenceDrawingProps> = ({
  activeStep = 0,
}) => {
  const isNeutral = activeStep === 0;
  const isStep1 = activeStep === 1;
  const isStep2 = activeStep === 2;
  const isStep3 = activeStep === 3;

  // Opacity classes based on the active step
  const leftOpacity = isNeutral || isStep2 ? 'opacity-100' : 'opacity-20';
  const rightOpacity = isNeutral || isStep3 ? 'opacity-100' : 'opacity-20';
  const centerOpacity = isNeutral || isStep1 ? 'opacity-100 font-bold' : 'opacity-20';

  return (
    <div className="w-full flex justify-center py-4 select-none">
      <svg className="w-full max-w-[300px] h-32 overflow-visible" viewBox="0 0 300 120">
        {/* Shear Force Diagram base lines */}
        <line x1="20" y1="30" x2="260" y2="30" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1" />
        
        {/* Shear Left Half (V > 0) */}
        <path
          d="M 20 10 L 140 30"
          fill="none"
          className={`stroke-rose-400 transition-all duration-300 ${leftOpacity} ${isStep2 ? 'stroke-[3px]' : 'stroke-[2.5px]'}`}
        />
        {/* Shear Right Half (V < 0) */}
        <path
          d="M 140 30 L 260 50"
          fill="none"
          className={`stroke-rose-400 transition-all duration-300 ${rightOpacity} ${isStep3 ? 'stroke-[3px]' : 'stroke-[2.5px]'}`}
        />
        
        {/* Shear Zero Point */}
        <g className={`transition-all duration-300 ${centerOpacity}`}>
          <circle cx="140" cy="30" r={isStep1 ? 5.5 : 4.5} className="fill-rose-500 animate-pulse" />
          <text x="148" y="24" className="text-[11px] font-bold font-mono fill-rose-500 dark:fill-rose-400">V = 0</text>
        </g>
        <text x="26" y="20" className="text-[11px] font-mono fill-slate-500 dark:fill-slate-400 uppercase">Shear (V)</text>

        {/* Connector line (V=0 to M_max) */}
        <line
          x1="140"
          y1="30"
          x2="140"
          y2="85"
          className={`stroke-indigo-400/50 transition-all duration-300 ${centerOpacity}`}
          strokeWidth={isStep1 ? 1.5 : 1}
          strokeDasharray="3 3"
        />

        {/* Bending Moment Diagram base lines */}
        <line x1="20" y1="100" x2="260" y2="100" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1" />
        
        {/* Moment Left Half (Increasing, slope > 0) */}
        <path
          d="M 20 100 Q 80 85 140 85"
          fill="none"
          className={`stroke-indigo-400 transition-all duration-300 ${leftOpacity} ${isStep2 ? 'stroke-[3px]' : 'stroke-[2.5px]'}`}
        />
        {/* Moment Right Half (Decreasing, slope < 0) */}
        <path
          d="M 140 85 Q 200 85 260 100"
          fill="none"
          className={`stroke-indigo-400 transition-all duration-300 ${rightOpacity} ${isStep3 ? 'stroke-[3px]' : 'stroke-[2.5px]'}`}
        />

        {/* Slope indicators */}
        <g className={`transition-opacity duration-300 ${isStep2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Green up-right arrow for positive slope */}
          <path d="M 75 96 L 85 88 M 85 88 L 79 88 M 85 88 L 85 94" fill="none" className="stroke-emerald-500" strokeWidth="2" strokeLinecap="round" />
          <text x="50" y="80" className="text-[9px] font-bold fill-emerald-500">Slope &gt; 0 (Up)</text>
        </g>
        
        <g className={`transition-opacity duration-300 ${isStep3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Red down-right arrow for negative slope */}
          <path d="M 195 88 L 205 96 M 205 96 L 199 96 M 205 96 L 205 90" fill="none" className="stroke-rose-500" strokeWidth="2" strokeLinecap="round" />
          <text x="202" y="80" className="text-[9px] font-bold fill-rose-500">Slope &lt; 0 (Down)</text>
        </g>

        {/* Moment Peak Point */}
        <g className={`transition-all duration-300 ${centerOpacity}`}>
          <circle cx="140" cy="85" r={isStep1 ? 5.5 : 4.5} className="fill-indigo-500 animate-pulse" />
          <text x="148" y="78" className="text-[11px] font-bold font-mono fill-indigo-500 dark:fill-indigo-400">M_max (Slope = 0)</text>
        </g>
        <text x="26" y="112" className="text-[11px] font-mono fill-slate-500 dark:fill-slate-400 uppercase">Moment (M)</text>
      </svg>
    </div>
  );
};
