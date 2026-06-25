import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface EcoStpPrefabProps {
  activeHighlight?: 'none' | 'ecostp' | 'prefab';
  className?: string;
}

export const EcoStpPrefabDrawing: React.FC<EcoStpPrefabProps> = ({
  activeHighlight = 'none',
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const showEcoStp = activeHighlight === 'none' || activeHighlight === 'ecostp';
  const showPrefab = activeHighlight === 'none' || activeHighlight === 'prefab';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/60 bg-muted/10 dark:bg-muted/5 rounded-xl p-1.5 flex flex-col items-center shadow-xs select-none w-full justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <span className="text-[10px] uppercase tracking-wider font-extrabold text-primary mb-0.5">
        Eco STP &amp; Prefabricated Storage System Details
      </span>
      <svg
        width="100%"
        height="180"
        viewBox="0 0 520 220"
        className="overflow-visible select-none text-foreground"
      >
        {/* Vertical divider line */}
        <line
          x1="250"
          y1="10"
          x2="250"
          y2="210"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4,4"
          className="text-muted-foreground/30"
        />

        {/* --- LEFT PANEL: non-electric Eco STP --- */}
        <g opacity={showEcoStp ? '1' : '0.15'} className="transition-all duration-300">
          <text x="35" y="35" className="fill-foreground font-semibold text-[11px]">
            Non-Electric Eco STP
          </text>

          {/* RCC floor slab (125mm) */}
          <rect
            x="40"
            y="160"
            width="170"
            height="15"
            fill="var(--chart-3-opacity, rgba(16, 185, 129, 0.1))"
            stroke="var(--chart-3, #10b981)"
            strokeWidth="1.5"
            rx="1"
          />
          <text x="46" y="172" className="fill-chart-3 font-mono text-[11px] font-bold">
            125mm RCC Floor (1:2:4)
          </text>

          {/* Wall sections */}
          <rect x="40" y="50" width="15" height="110" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
          <rect x="195" y="50" width="15" height="110" fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />

          {/* Inner wall flush pointing (1:2) (represented by a dashed orange border inside walls) */}
          <path d="M 57,50 V 158 H 193 V 50" fill="none" stroke="var(--chart-2, #eab308)" strokeWidth="1.2" strokeDasharray="3,2" />
          <text x="65" y="105" className="fill-chart-2 font-mono text-[11px] font-bold">
            Flush Pointing (1:2)
          </text>

          {/* Start-up biological charge bucket/drops */}
          <g transform="translate(110, 42)">
            {/* Funnel/charging tube */}
            <path d="M 0,-15 v 15 H 10 v -15 M 0,0 L 5,8 H 5 L 10,0" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="5" cy="18" r="1.5" fill="var(--chart-2, #eab308)" />
            <circle cx="5" cy="28" r="1.2" fill="var(--chart-2, #eab308)" />
            <text x="18" y="-4" className="fill-chart-2 font-mono text-[11px] font-bold">
              Startup Charge
            </text>
          </g>
        </g>

        {/* --- RIGHT PANEL: Prefabricated Tanks --- */}
        <g opacity={showPrefab ? '1' : '0.15'} className="transition-all duration-300">
          <text x="270" y="35" className="fill-foreground font-semibold text-[11px]">
            Prefabricated Storage Tanks
          </text>

          {/* Food-graded Plastic overhead tank */}
          <g transform="translate(275, 60)">
            {/* Cylindrical body with ridges */}
            <path
              d="M 5,10 H 65 V 100 H 5 Z"
              fill="var(--chart-1-opacity, rgba(59, 130, 246, 0.1))"
              stroke="var(--chart-1, #3b82f6)"
              strokeWidth="2.2"
            />
            {/* Ridges */}
            <line x1="5" y1="30" x2="65" y2="30" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
            <line x1="5" y1="55" x2="65" y2="55" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
            <line x1="5" y1="80" x2="65" y2="80" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
            {/* Manhole neck and lid */}
            <rect x="25" y="0" width="20" height="10" fill="none" stroke="var(--chart-1, #3b82f6)" strokeWidth="1.5" />
            <line x1="20" y1="0" x2="50" y2="0" stroke="var(--chart-1, #3b82f6)" strokeWidth="2.5" />
            <text x="0" y="116" className="fill-chart-1 font-mono text-[11px] font-bold">
              Plastic (1000L-5000L)
            </text>
          </g>

          {/* Ferro-Cement water tank */}
          <g transform="translate(390, 60)">
            {/* Cylindrical body */}
            <path
              d="M 5,10 H 65 V 100 H 5 Z"
              fill="var(--muted-foreground-opacity, rgba(120, 120, 120, 0.05))"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            {/* Mesh grid pattern inside (representing ferro-cement wire grid) */}
            <g opacity="0.15" className="text-muted-foreground">
              <line x1="5" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="0.5" />
              <line x1="5" y1="40" x2="65" y2="40" stroke="currentColor" strokeWidth="0.5" />
              <line x1="5" y1="60" x2="65" y2="60" stroke="currentColor" strokeWidth="0.5" />
              <line x1="5" y1="80" x2="65" y2="80" stroke="currentColor" strokeWidth="0.5" />
              <line x1="20" y1="10" x2="20" y2="100" stroke="currentColor" strokeWidth="0.5" />
              <line x1="35" y1="10" x2="35" y2="100" stroke="currentColor" strokeWidth="0.5" />
              <line x1="50" y1="10" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
            </g>
            {/* Top neck and connections */}
            <rect x="25" y="0" width="20" height="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <line x1="20" y1="0" x2="50" y2="0" stroke="currentColor" strokeWidth="2" />
            {/* Faucet connection line out */}
            <path d="M 65,85 h 15 v 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <text x="-5" y="116" className="fill-foreground font-mono text-[11px] font-bold">
              Ferro-Cement (400 Gal)
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default EcoStpPrefabDrawing;
