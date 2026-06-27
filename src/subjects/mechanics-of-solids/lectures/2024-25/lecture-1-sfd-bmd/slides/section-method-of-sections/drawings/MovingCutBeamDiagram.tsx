import React from 'react';

interface MovingCutBeamDiagramProps {
  showMomentArm?: boolean;
  cutPositionX?: number; // 0 to 100 representing percentage along span
}

export const MovingCutBeamDiagram: React.FC<MovingCutBeamDiagramProps> = ({
  showMomentArm = false,
  cutPositionX = 65, // default cut position
}) => {
  // Map 0-100 percentage to 50-350 pixel range
  const startX = 50;
  const endX = 350;
  const width = endX - startX;
  const cutPixel = startX + (cutPositionX / 100) * width;
  
  // Point load P is fixed at 40% (8m of 20m, or similar)
  const loadPixel = startX + 0.4 * width; // 170

  return (
    <div className="w-full max-w-[500px] mx-auto py-2">
      <svg viewBox="0 0 400 170" className="w-full h-auto overflow-visible select-none">
        {/* Support line */}
        <line x1="20" y1="110" x2="380" y2="110" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

        {/* 2D Isolated segment / beam */}
        <rect x="50" y="70" width="300" height="15" rx="2" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Support A Hinge at x=50 */}
        <polygon points="50,85 42,102 58,102" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1.2" />
        <line x1="35" y1="102" x2="65" y2="102" stroke="#64748b" strokeWidth="1.5" />
        <text x="50" y="115" textAnchor="middle" className="text-[10px] font-black fill-slate-500 font-mono">A (x=0)</text>

        {/* Point Load P at 40% */}
        <g>
          <path d={`M ${loadPixel},25 L ${loadPixel},62`} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d={`M ${loadPixel - 5},55 L ${loadPixel},62 L ${loadPixel + 5},55`} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x={loadPixel} y="18" textAnchor="middle" className="text-[10px] font-black fill-red-500 font-mono">P</text>
        </g>

        {/* Red Cut Line at variable cutPixel */}
        <g className="transition-all duration-300 ease-in-out">
          <line x1={cutPixel} y1="20" x2={cutPixel} y2="110" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
          <rect x={cutPixel - 15} y="45" width="30" height="12" rx="2" className="fill-red-500 stroke-red-600" strokeWidth="1" />
          <text x={cutPixel} y="54" textAnchor="middle" className="text-[8px] font-black fill-white font-mono">Cut</text>
        </g>

        {/* Dimension indicator: x (from Support A to Cut Plane) */}
        <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.8">
          <line x1="50" y1="125" x2="50" y2="135" />
          <line x1={cutPixel} y1="125" x2={cutPixel} y2="135" />
          <path d={`M 55,130 L ${cutPixel - 5},130`} fill="none" />
          <path d="M 58,127 L 50,130 L 58,133" fill="none" />
          <path d={`M ${cutPixel - 8},127 L ${cutPixel},130 L ${cutPixel - 8},133`} fill="none" />
        </g>
        <text x={(50 + cutPixel) / 2} y="141" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-600 dark:fill-indigo-400">x (variable coordinate)</text>

        {/* Moment Arm Principle annotations */}
        {showMomentArm && (
          <g className="animate-in fade-in duration-300">
            {/* Dimension load position: d */}
            <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.8">
              <line x1={loadPixel} y1="125" x2={loadPixel} y2="135" />
              <path d={`M 55,130 L ${loadPixel - 5},130`} fill="none" className="stroke-slate-400" />
            </g>
            {/* We draw a label for d */}
            <rect x="95" y="122" width="30" height="15" className="fill-slate-100 dark:fill-slate-800" />
            <text x="110" y="132" textAnchor="middle" className="text-[9px] font-mono fill-slate-500 font-bold">d</text>

            {/* Dimension from load P to Cut: x - d */}
            <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.8">
              <path d={`M ${loadPixel + 5},130 L ${cutPixel - 5},130`} fill="none" />
              <path d={`M ${loadPixel + 8},127 L ${loadPixel},130 L ${loadPixel + 8},133`} fill="none" />
              <path d={`M ${cutPixel - 8},127 L ${cutPixel},130 L ${cutPixel - 8},133`} fill="none" />
            </g>
            <text x={(loadPixel + cutPixel) / 2} y="141" textAnchor="middle" className="text-[9px] font-mono font-bold fill-red-500">x - d</text>
          </g>
        )}
      </svg>
    </div>
  );
};
