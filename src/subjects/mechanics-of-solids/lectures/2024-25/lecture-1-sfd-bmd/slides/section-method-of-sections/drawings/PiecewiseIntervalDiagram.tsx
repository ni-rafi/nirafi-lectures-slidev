import React from 'react';

interface PiecewiseIntervalDiagramProps {
  activeStep: number;
}

export const PiecewiseIntervalDiagram: React.FC<PiecewiseIntervalDiagramProps> = ({ activeStep }) => {
  return (
    <div className="w-full max-w-[500px] mx-auto py-2">
      <svg viewBox="0 0 400 160" className="w-full h-auto overflow-visible select-none">
        {/* Support lines/ground */}
        <line x1="20" y1="120" x2="380" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

        {/* 2D Beam member */}
        <rect x="50" y="80" width="300" height="15" rx="2" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1.5" />

        {/* Support A (Hinge) at x=50 */}
        <polygon points="50,95 42,112 58,112" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1.2" />
        <line x1="35" y1="112" x2="65" y2="112" stroke="#64748b" strokeWidth="1.5" />
        <text x="50" y="126" textAnchor="middle" className="text-[10px] font-black fill-slate-500">A</text>

        {/* Support B (Roller) at x=350 */}
        <polygon points="350,95 342,107 358,107" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1.2" />
        <circle cx="346" cy="110" r="2.5" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
        <circle cx="354" cy="110" r="2.5" className="fill-slate-400 dark:fill-slate-500 stroke-slate-500" strokeWidth="1" />
        <line x1="335" y1="112" x2="365" y2="112" stroke="#64748b" strokeWidth="1.5" />
        <text x="350" y="126" textAnchor="middle" className="text-[10px] font-black fill-slate-500">B</text>

        {/* Point Load P at x=150 */}
        <g className="animate-in fade-in duration-300">
          <path d="M 150,30 L 150,72" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 145,65 L 150,72 L 155,65" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <text x="150" y="40" textAnchor="middle" className="text-[10px] font-black fill-red-500 font-mono">P = 20 kN</text>
          <text x="150" y="91" textAnchor="middle" className="text-[8px] font-black fill-slate-700 dark:fill-slate-300 font-mono">C</text>
        </g>

        {/* Uniformly Distributed Load (UDL) from x=250 to B (x=350) */}
        <g className="animate-in fade-in duration-300">
          {/* UDL Arcs */}
          <path
            d="M 250,68 Q 262.5,53 275,68 Q 287.5,53 300,68 Q 312.5,53 325,68 Q 337.5,53 350,68"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* UDL Downward Arrows */}
          {[262.5, 287.5, 312.5, 337.5].map((xArrow) => (
            <g key={xArrow} className="stroke-emerald-500" strokeWidth="1.2">
              <line x1={xArrow} y1="63" x2={xArrow} y2="78" />
              <path d={`M ${xArrow - 3},74 L ${xArrow},78 L ${xArrow + 3},74`} fill="none" strokeLinejoin="round" />
            </g>
          ))}
          <text x="300" y="44" textAnchor="middle" className="text-[9px] font-black fill-emerald-600 dark:fill-emerald-400 font-mono">w = 5 kN/m</text>
        </g>

        {/* Dimension Indicators */}
        <g className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="0.8">
          <line x1="50" y1="135" x2="50" y2="145" />
          <line x1="150" y1="135" x2="150" y2="145" />
          <line x1="250" y1="135" x2="250" y2="145" />
          <line x1="350" y1="135" x2="350" y2="145" />
          
          {/* Dimension arrows */}
          <path d="M 55,140 L 145,140" fill="none" />
          <path d="M 58,137 L 50,140 L 58,143" fill="none" />
          <path d="M 142,137 L 150,140 L 142,143" fill="none" />

          <path d="M 155,140 L 245,140" fill="none" />
          <path d="M 158,137 L 150,140 L 158,143" fill="none" />
          <path d="M 242,137 L 250,140 L 242,143" fill="none" />

          <path d="M 255,140 L 345,140" fill="none" />
          <path d="M 258,137 L 250,140 L 258,143" fill="none" />
          <path d="M 342,137 L 350,140 L 342,143" fill="none" />
        </g>
        <text x="100" y="151" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">5 m</text>
        <text x="200" y="151" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">5 m</text>
        <text x="300" y="151" textAnchor="middle" className="text-[9px] font-mono fill-slate-500">6 m</text>

        {/* STEP 1: Discontinuity boundary dashed lines */}
        {activeStep >= 1 && (
          <g className="transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-top-2">
            <line x1="50" y1="10" x2="50" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="150" y1="10" x2="150" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="250" y1="10" x2="250" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="350" y1="10" x2="350" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" />
            <text x="50" y="8" textAnchor="middle" className="text-[8px] font-mono fill-indigo-500">x = 0</text>
            <text x="150" y="8" textAnchor="middle" className="text-[8px] font-mono fill-indigo-500">x = 5m</text>
            <text x="250" y="8" textAnchor="middle" className="text-[8px] font-mono fill-indigo-500">x = 10m</text>
            <text x="350" y="8" textAnchor="middle" className="text-[8px] font-mono fill-indigo-500">x = 16m</text>
          </g>
        )}

        {/* STEP 2: Zone Labels */}
        {activeStep >= 2 && (
          <g className="transition-all duration-500 ease-in-out animate-in fade-in duration-300">
            {/* Zone 1 Label */}
            <rect x="53" y="14" width="94" height="18" rx="3" fill="#4f46e5" fillOpacity="0.08" stroke="#4f46e5" strokeWidth="1" />
            <text x="100" y="26" textAnchor="middle" className="text-[7.5px] font-black font-mono fill-indigo-600 dark:fill-indigo-400">
              Zone 1: 0 &le; x &lt; 5 m
            </text>

            {/* Zone 2 Label */}
            <rect x="153" y="14" width="94" height="18" rx="3" fill="#3b82f6" fillOpacity="0.08" stroke="#3b82f6" strokeWidth="1" />
            <text x="200" y="26" textAnchor="middle" className="text-[7.5px] font-black font-mono fill-blue-600 dark:fill-blue-400">
              Zone 2: 5 &le; x &lt; 10 m
            </text>

            {/* Zone 3 Label */}
            <rect x="253" y="14" width="94" height="18" rx="3" fill="#10b981" fillOpacity="0.08" stroke="#10b981" strokeWidth="1" />
            <text x="300" y="26" textAnchor="middle" className="text-[7.5px] font-black font-mono fill-emerald-600 dark:fill-emerald-400">
              Zone 3: 10 &le; x &le; 16 m
            </text>
          </g>
        )}

        {/* STEP 3: Section lines & labels */}
        {activeStep >= 3 && (
          <g className="transition-all duration-500 ease-in-out animate-in fade-in duration-500">
            {/* Section 1 */}
            <line x1="100" y1="70" x2="100" y2="110" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="100" cy="87.5" r="4" className="fill-red-500/10 stroke-red-500" strokeWidth="1" />
            <text x="100" y="117" textAnchor="middle" className="text-[8px] font-black fill-rose-500 font-mono">Section 1</text>

            {/* Section 2 */}
            <line x1="200" y1="70" x2="200" y2="110" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="200" cy="87.5" r="4" className="fill-red-500/10 stroke-red-500" strokeWidth="1" />
            <text x="200" y="117" textAnchor="middle" className="text-[8px] font-black fill-rose-500 font-mono">Section 2</text>

            {/* Section 3 */}
            <line x1="300" y1="70" x2="300" y2="110" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
            <circle cx="300" cy="87.5" r="4" className="fill-red-500/10 stroke-red-500" strokeWidth="1" />
            <text x="300" y="117" textAnchor="middle" className="text-[8px] font-black fill-rose-500 font-mono">Section 3</text>
          </g>
        )}
      </svg>
    </div>
  );
};
