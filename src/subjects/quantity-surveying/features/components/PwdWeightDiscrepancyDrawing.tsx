import React, { useContext } from 'react';
import { PresentationContext } from '@/features/presentation/context/PresentationContext';

interface PwdWeightDiscrepancyDrawingProps {
  diameterMm: number;
  lengthM: number;
  weightFormulaKg: number;
  weightPwdKg: number;
  diffKg: number;
  className?: string;
}

export const PwdWeightDiscrepancyDrawing: React.FC<PwdWeightDiscrepancyDrawingProps> = ({
  diameterMm,
  lengthM,
  weightFormulaKg,
  weightPwdKg,
  diffKg,
  className = '',
}) => {
  const presentation = useContext(PresentationContext);
  const isBlog = presentation?.viewMode === 'blog';

  const containerClasses = isBlog
    ? 'bg-transparent border-none shadow-none p-0 flex flex-col items-center select-none w-full'
    : `relative border border-border/80 bg-muted/20 dark:bg-muted/5 rounded-xl p-4 flex flex-col items-center shadow-sm select-none w-full justify-center min-h-[220px] ${className}`;

  // Balance scale geometry constants
  const scaleCenterX = 180;
  const scaleCenterY = 110;
  
  // Calculate dynamic tilt angle based on difference (capped at 8 degrees)
  const maxTilt = 8;
  const tilt = diffKg === 0 ? 0 : Math.max(1.5, Math.min(maxTilt, (diffKg / weightPwdKg) * 300));
  const tiltRad = (tilt * Math.PI) / 180;

  // End points of the scale beam
  const armLength = 90;
  const leftArmX = scaleCenterX - armLength * Math.cos(tiltRad);
  const leftArmY = scaleCenterY + armLength * Math.sin(tiltRad);
  const rightArmX = scaleCenterX + armLength * Math.cos(tiltRad);
  const rightArmY = scaleCenterY - armLength * Math.sin(tiltRad);

  return (
    <div className={containerClasses}>
      <span className="text-xs uppercase tracking-wider font-extrabold text-primary mb-3">
        PWD Constants vs. Formula Discrepancy Scale
      </span>
      <svg
        width="100%"
        height="220"
        viewBox="0 0 360 220"
        className="overflow-visible select-none"
      >
        {/* Scale Base Pillar */}
        <path d="M 175,180 L 178,110 L 182,110 L 185,180 Z" fill="currentColor" className="text-foreground/40" />
        <rect x="150" y="180" width="60" height="8" fill="currentColor" className="text-foreground/50" rx="2" />
        
        {/* Center pivot point pin */}
        <circle cx={scaleCenterX} cy={scaleCenterY} r="4" fill="var(--chart-3)" />

        {/* Scale Beam (tilted) */}
        <line
          x1={leftArmX}
          y1={leftArmY}
          x2={rightArmX}
          y2={rightArmY}
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-foreground/80 transition-all duration-300"
        />

        {/* Left Side: Formula Pan (Heavier) */}
        <g className="transition-all duration-300">
          {/* Pan hangers */}
          <line x1={leftArmX} y1={leftArmY} x2={leftArmX - 25} y2={leftArmY + 45} stroke="currentColor" strokeWidth="0.8" className="text-foreground/40" />
          <line x1={leftArmX} y1={leftArmY} x2={leftArmX + 25} y2={leftArmY + 45} stroke="currentColor" strokeWidth="0.8" className="text-foreground/40" />
          {/* Pan base */}
          <path d={`M ${leftArmX - 30},${leftArmY + 45} L ${leftArmX + 30},${leftArmY + 45} A 30,8 0 0,1 ${leftArmX - 30},${leftArmY + 45}`} fill="currentColor" className="text-foreground/25" stroke="currentColor" strokeWidth="0.5" />
          {/* Left Weight box */}
          <rect x={leftArmX - 16} y={leftArmY + 23} width="32" height="22" fill="var(--chart-1)" rx="3" opacity="0.9" />
          <text x={leftArmX} y={leftArmY + 36} textAnchor="middle" className="fill-primary-foreground font-sans font-bold text-[8.5px]">
            Formula
          </text>
          {/* Label output */}
          <text x={leftArmX} y={leftArmY + 62} textAnchor="middle" className="fill-chart-1 font-mono text-[9px] font-bold">
            {weightFormulaKg.toFixed(2)} kg
          </text>
        </g>

        {/* Right Side: PWD Pan (Lighter) */}
        <g className="transition-all duration-300">
          {/* Pan hangers */}
          <line x1={rightArmX} y1={rightArmY} x2={rightArmX - 25} y2={rightArmY + 45} stroke="currentColor" strokeWidth="0.8" className="text-foreground/40" />
          <line x1={rightArmX} y1={rightArmY} x2={rightArmX + 25} y2={rightArmY + 45} stroke="currentColor" strokeWidth="0.8" className="text-foreground/40" />
          {/* Pan base */}
          <path d={`M ${rightArmX - 30},${rightArmY + 45} L ${rightArmX + 30},${rightArmY + 45} A 30,8 0 0,1 ${rightArmX - 30},${rightArmY + 45}`} fill="currentColor" className="text-foreground/25" stroke="currentColor" strokeWidth="0.5" />
          {/* Right Weight box */}
          <rect x={rightArmX - 16} y={rightArmY + 25} width="32" height="20" fill="var(--chart-2)" rx="3" opacity="0.9" />
          <text x={rightArmX} y={rightArmY + 37} textAnchor="middle" className="fill-primary-foreground font-sans font-bold text-[8.5px]">
            PWD SoR
          </text>
          {/* Label output */}
          <text x={rightArmX} y={rightArmY + 62} textAnchor="middle" className="fill-chart-2 font-mono text-[9px] font-bold">
            {weightPwdKg.toFixed(2)} kg
          </text>
        </g>

        {/* Center rebar spec label */}
        <text x="180" y="25" textAnchor="middle" className="fill-muted-foreground font-sans text-[9px] font-bold">
          SPEC: {lengthM}m of Ø{diameterMm}mm Rebar
        </text>

        {/* Center deviation warning */}
        {diffKg > 0 && (
          <g className="font-mono text-[8px] fill-red-500 font-bold">
            <text x="180" y="45" textAnchor="middle">
              ⚠️ FORMULA OVERESTIMATES
            </text>
            <text x="180" y="55" textAnchor="middle">
              BY { (diffKg).toFixed(2) } kg (+{((diffKg/weightPwdKg)*100).toFixed(2)}%)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default PwdWeightDiscrepancyDrawing;
