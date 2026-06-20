import React from 'react';
import { IStressState } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { MohrsCircleEngine } from '@/cores/mechanics-of-solids/stress/mohrs-circle.engine';

interface MohrsCircleChartProps {
  state: IStressState;
  thetaRad: number;
}

export const MohrsCircleChart: React.FC<MohrsCircleChartProps> = ({ state, thetaRad }) => {
  const result = MohrsCircleEngine.solveCircle(state, thetaRad);
  const { center, radius, pointA, pointB, pointAPrime, pointBPrime } = result;

  const width = 200;
  const height = 200;
  const cx = 100;
  const cy = 100;

  // Scaling factor to fit circle and reference points inside the 200x200 canvas
  // Scale the circle to always be large and clear (55px radius), leaving enough room for labels.
  const scale = 55 / Math.max(1e5, radius);

  const toPxX = (val: number) => cx + (val - center) * scale;
  const toPxY = (val: number) => cy - val * scale; // Standard Cartesian coordinate: +tau is upwards

  const rPx = radius * scale;

  // Determine whether to show static initial points A & B to avoid overlapping when rotation is near zero
  const distAPx = Math.hypot(toPxX(pointA.x) - toPxX(pointAPrime.x), toPxY(pointA.y) - toPxY(pointAPrime.y));
  const showStaticAB = distAPx > 5;

  const format = (val: number) => (val / 1e6).toFixed(2); // MPa

  return (
    <div className="flex justify-center border border-border/30 bg-muted/5 rounded-2xl p-6 max-w-[400px] mx-auto w-full shadow-inner">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full aspect-square select-none overflow-visible">
        {/* Horizontal Axis (Normal Stress σ) */}
        <line x1={15} y1={cy} x2={width - 15} y2={cy} stroke="var(--border)" strokeWidth={1} />
        <polygon points={`${width - 15},${cy} ${width - 19},${cy - 2.5} ${width - 19},${cy + 2.5}`} fill="var(--border)" />
        <text x={width - 8} y={cy + 3} className="fill-muted-foreground text-[8px] font-bold text-center">σ</text>

        {/* Vertical Axis (Shear Stress τ) */}
        <line x1={cx} y1={height - 15} x2={cx} y2={15} stroke="var(--border)" strokeWidth={1} />
        <polygon points={`${cx},15 ${cx - 2.5},19 ${cx + 2.5},19`} fill="var(--border)" />
        <text x={cx} y={10} textAnchor="middle" className="fill-muted-foreground text-[8px] font-bold">τ</text>

        {/* Actual Origin (σ = 0) line if within bounds */}
        {toPxX(0) >= 15 && toPxX(0) <= width - 15 && (
          <g opacity={0.35}>
            <line x1={toPxX(0)} y1={15} x2={toPxX(0)} y2={height - 15} stroke="var(--foreground)" strokeWidth={0.8} strokeDasharray="2,2" />
            <text x={toPxX(0) + 3} y={23} className="fill-muted-foreground text-[6px] font-mono">σ=0</text>
          </g>
        )}

        {/* Center of Circle (C) */}
        <circle cx={toPxX(center)} cy={cy} r={2} fill="var(--destructive)" />
        <text x={toPxX(center)} y={cy + 10} textAnchor="middle" className="fill-destructive text-[7.5px] font-bold">
          C={format(center)}
        </text>

        {/* Mohr's Circle Outline */}
        <circle
          cx={toPxX(center)}
          cy={cy}
          r={rPx}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={1.2}
          opacity={0.8}
        />

        {/* Reference points: original state diameter line AB */}
        {showStaticAB && (
          <g opacity={0.5}>
            {/* Diameter line */}
            <line
              x1={toPxX(pointA.x)}
              y1={toPxY(pointA.y)}
              x2={toPxX(pointB.x)}
              y2={toPxY(pointB.y)}
              stroke="var(--muted-foreground)"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            {/* Reference point A */}
            <circle cx={toPxX(pointA.x)} cy={toPxY(pointA.y)} r={2.5} fill="var(--muted-foreground)" />
            <text x={toPxX(pointA.x) + 4} y={toPxY(pointA.y) - 4} className="fill-muted-foreground text-[7px] font-bold">
              A({format(pointA.x)},{format(pointA.y)})
            </text>
            {/* Reference point B */}
            <circle cx={toPxX(pointB.x)} cy={toPxY(pointB.y)} r={2.5} fill="var(--muted-foreground)" />
            <text x={toPxX(pointB.x) - 4} y={toPxY(pointB.y) + 8} textAnchor="end" className="fill-muted-foreground text-[7px] font-bold">
              B({format(pointB.x)},{format(pointB.y)})
            </text>
          </g>
        )}

        {/* Rotated state diameter line A'B' */}
        <g>
          {/* Diameter line */}
          <line
            x1={toPxX(pointAPrime.x)}
            y1={toPxY(pointAPrime.y)}
            x2={toPxX(pointBPrime.x)}
            y2={toPxY(pointBPrime.y)}
            stroke="var(--primary)"
            strokeWidth={1.2}
          />
          {/* Rotated Point A' */}
          <circle cx={toPxX(pointAPrime.x)} cy={toPxY(pointAPrime.y)} r={3} fill="var(--primary)" />
          <text x={toPxX(pointAPrime.x) + 5} y={toPxY(pointAPrime.y) + 3} className="fill-primary text-[7.5px] font-bold">
            A'({format(pointAPrime.x)},{format(-pointAPrime.y)})
          </text>
          {/* Rotated Point B' */}
          <circle cx={toPxX(pointBPrime.x)} cy={toPxY(pointBPrime.y)} r={3} fill="var(--primary)" />
          <text x={toPxX(pointBPrime.x) - 5} y={toPxY(pointBPrime.y) + 3} textAnchor="end" className="fill-primary text-[7.5px] font-bold">
            B'
          </text>
        </g>

        {/* Principal Stresses (Intersections) */}
        <g>
          {/* sigma_1 */}
          <circle cx={toPxX(center + radius)} cy={cy} r={2} fill="var(--success, #10b981)" />
          {/* sigma_2 */}
          <circle cx={toPxX(center - radius)} cy={cy} r={2} fill="var(--success, #10b981)" />
        </g>
      </svg>
    </div>
  );
};
