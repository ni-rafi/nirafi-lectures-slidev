import React from 'react';

interface StaticEquilibriumDrawingProps {
  length?: number;
  loadMagnitude?: number;
  showReactions?: boolean;
  resolvedReactions?: boolean;
  reactionAValue?: number | string;
  reactionBValue?: number | string;
}

export const StaticEquilibriumDrawing: React.FC<StaticEquilibriumDrawingProps> = ({
  length = 8,
  loadMagnitude = 20,
  showReactions = false,
  resolvedReactions = false,
  reactionAValue = 'R_A',
  reactionBValue = 'R_B',
}) => {
  return (
    <div className="w-full flex flex-col items-center py-4 select-none">
      <svg className="w-full max-w-[320px] h-36 overflow-visible" viewBox="0 0 320 140">
        {/* Load Force Arrow (Point Load at center) */}
        <g className="transition-all duration-350">
          <text x="160" y="15" textAnchor="middle" className="text-xs font-mono font-bold fill-rose-400">
            {loadMagnitude} kN
          </text>
          <path
            d="M160 20 L160 50 M160 50 L156 44 M160 50 L164 44"
            fill="none"
            className="stroke-rose-500 animate-bounce"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Beam member */}
        <rect
          x="40"
          y="50"
          width="240"
          height="14"
          className="fill-slate-700 stroke-slate-500"
          strokeWidth="1.5"
          rx="2"
        />

        {/* Beam label tags */}
        <text x="42" y="44" className="text-xs font-mono font-bold fill-slate-700 dark:fill-slate-300">A</text>
        <text x="272" y="44" className="text-xs font-mono font-bold fill-slate-700 dark:fill-slate-300">B</text>
        <text x="156" y="44" className="text-xs font-mono font-bold fill-slate-700 dark:fill-slate-300">C</text>

        {/* Support at A (Hinge/Pin) */}
        <path d="M40 64 L30 78 L50 78 Z" className="fill-slate-500 stroke-slate-400" strokeWidth="1" />
        <line x1="25" y1="78" x2="55" y2="78" className="stroke-slate-500" strokeWidth="1.5" />

        {/* Support at B (Roller) */}
        <path d="M280 64 L270 76 L290 76 Z" className="fill-slate-500 stroke-slate-400" strokeWidth="1" />
        <circle cx="275" cy="78" r="2.5" className="fill-slate-500" />
        <circle cx="285" cy="78" r="2.5" className="fill-slate-500" />
        <line x1="265" y1="80" x2="295" y2="80" className="stroke-slate-500" strokeWidth="1.5" />

        {/* Dimensions Chain */}
        <g className="stroke-slate-400 dark:stroke-slate-600" strokeWidth="1">
          <line x1="40" y1="92" x2="280" y2="92" strokeDasharray="3 3" />
          <line x1="40" y1="88" x2="40" y2="96" />
          <line x1="160" y1="88" x2="160" y2="96" />
          <line x1="280" y1="88" x2="280" y2="96" />
        </g>
        <text x="100" y="106" textAnchor="middle" className="text-[11px] font-mono fill-slate-500 dark:fill-slate-400">
          {(length / 2).toFixed(1)}m
        </text>
        <text x="220" y="106" textAnchor="middle" className="text-[11px] font-mono fill-slate-500 dark:fill-slate-400">
          {(length / 2).toFixed(1)}m
        </text>

        {/* Support reactions vectors */}
        {showReactions && (
          <g className="transition-all duration-350">
            {/* Reaction A arrow */}
            <path
              d="M40 130 L40 100 M40 100 L37 104 M40 100 L43 104"
              fill="none"
              className="stroke-indigo-400"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="48" y="118" className="text-xs font-mono font-bold fill-indigo-400">
              {resolvedReactions ? `${reactionAValue} kN` : 'R_A'}
            </text>

            {/* Reaction B arrow */}
            <path
              d="M280 130 L280 100 M280 100 L277 104 M280 100 L283 104"
              fill="none"
              className="stroke-indigo-400"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="288" y="118" className="text-xs font-mono font-bold fill-indigo-400">
              {resolvedReactions ? `${reactionBValue} kN` : 'R_B'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
