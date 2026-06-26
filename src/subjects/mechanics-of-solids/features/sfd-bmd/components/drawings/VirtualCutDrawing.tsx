import React from 'react';

interface VirtualCutDrawingProps {
  activeStep?: number; // 0: baseline, 1: Cut Span (x), 2: Expose Actions (V, M), 3: Apply Equilibrium
  reactionForceValue?: string | number;
  shearForceLabel?: string;
  bendingMomentLabel?: string;
  distanceLabel?: string;
}

export const VirtualCutDrawing: React.FC<VirtualCutDrawingProps> = ({
  activeStep = 0,
  reactionForceValue = 'R_A = 10 kN',
  shearForceLabel = 'V(x)',
  bendingMomentLabel = 'M(x)',
  distanceLabel = 'Distance x',
}) => {
  const isNeutral = activeStep === 0;
  const isStep1 = activeStep === 1;
  const isStep2 = activeStep === 2;
  const isStep3 = activeStep === 3;

  // Dynamic opacities / colors for interactive stepping
  const cutSliceStyle = isStep1 
    ? 'opacity-100 stroke-indigo-500 dark:stroke-indigo-400 font-bold text-indigo-600 dark:text-indigo-400' 
    : 'opacity-30 stroke-rose-500/50 text-rose-500/50';

  const dimensionStyle = isNeutral || isStep1
    ? 'opacity-100 stroke-slate-500 dark:stroke-slate-400 fill-slate-500 dark:fill-slate-400 font-bold'
    : 'opacity-30 stroke-slate-400 dark:stroke-slate-600 fill-slate-400 dark:fill-slate-600';

  const internalActionsStyle = isStep2
    ? 'opacity-100 scale-105 transition-all duration-350'
    : activeStep >= 3
      ? 'opacity-70 transition-all duration-350'
      : 'opacity-0 pointer-events-none transition-all duration-350';

  const reactionStyle = isStep3
    ? 'text-emerald-500 dark:text-emerald-400 font-bold scale-105 transition-all duration-350'
    : 'text-slate-600 dark:text-slate-300 opacity-80';

  return (
    <div className="w-full flex justify-center py-4 select-none">
      <svg className="w-full max-w-[300px] h-32 overflow-visible" viewBox="0 0 300 120">
        {/* isolated cut block */}
        <rect
          x="15"
          y="40"
          width="130"
          height="40"
          className="fill-slate-100 dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600 transition-all duration-350"
          strokeWidth="2"
          rx="3"
        />
        
        {/* Virtual Slice Cut Section Line */}
        <line 
          x1="145" 
          y1="40" 
          x2="145" 
          y2="80" 
          className={`transition-all duration-350 ${cutSliceStyle}`} 
          strokeWidth="1.5" 
          strokeDasharray="3 3" 
        />
        <text 
          x="145" 
          y="32" 
          textAnchor="middle" 
          className={`text-[10px] font-mono transition-all duration-350 ${cutSliceStyle}`}
        >
          Virtual Slice at x
        </text>

        {/* Reaction force (R_A) */}
        <g className={`transition-all duration-350 ${reactionStyle}`}>
          <path 
            d="M15 72 L15 48 M15 48 L12 52 M15 48 L18 52" 
            fill="none" 
            className={isStep3 ? 'stroke-emerald-500 dark:stroke-emerald-400' : 'stroke-indigo-400'} 
            strokeWidth="2" 
          />
        </g>
        <text 
          x="8" 
          y="92" 
          className={`text-[11px] font-mono transition-all duration-350 ${reactionStyle}`}
        >
          {reactionForceValue}
        </text>

        {/* Internal shear arrow on cut face pointing down */}
        <g className={`text-rose-500 dark:text-rose-400 ${internalActionsStyle}`}>
          <path d="M145 44 L145 76 M145 76 L141 70 M145 76 L149 70" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <text x="154" y="68" className="text-[11px] font-bold font-mono fill-rose-500 dark:fill-rose-400">
            {shearForceLabel}
          </text>
        </g>

        {/* Internal moment arrow counter-clockwise around cut centroid */}
        <g className={`text-indigo-500 dark:text-indigo-400 ${internalActionsStyle}`}>
          <path d="M 142 46 Q 160 52 142 66" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M 142 66 l 4 -4 M 142 66 l -1 -5" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="154" y="50" className="text-[11px] font-bold font-mono fill-indigo-500 dark:fill-indigo-400">
            {bendingMomentLabel}
          </text>
        </g>

        {/* dimension arrow x */}
        <g className={`transition-all duration-350 ${dimensionStyle}`} strokeWidth="1">
          <line x1="15" y1="110" x2="145" y2="110" stroke="currentColor" />
          <line x1="15" y1="106" x2="15" y2="114" stroke="currentColor" />
          <line x1="145" y1="106" x2="145" y2="114" stroke="currentColor" />
        </g>
        <text 
          x="80" 
          y="104" 
          textAnchor="middle" 
          className={`text-[11px] font-mono transition-all duration-350 ${dimensionStyle}`}
        >
          {distanceLabel}
        </text>
      </svg>
    </div>
  );
};
