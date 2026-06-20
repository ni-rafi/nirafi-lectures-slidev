import React from 'react';

interface MicroMohrRadiusTriangleProps {
  text: string;
}

export const MicroMohrRadiusTriangle: React.FC<MicroMohrRadiusTriangleProps> = () => {
  const width = 160;
  const height = 110;

  // Triangle coordinates
  const cx = 35;  // Center C
  const cy = 85;
  const bx = 125; // Base corner
  const by = 85;
  const ax = 125; // Point A (top-right)
  const ay = 35;

  return (
    <div className="mt-2.5 mb-1.5 overflow-hidden rounded-lg border border-border/30 bg-muted/5 p-2 max-w-xs">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none overflow-visible">
        {/* Horizontal Axis */}
        <line x1={15} y1={cy} x2={145} y2={cy} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3,3" />

        {/* Right Triangle */}
        <polygon
          points={`${cx},${cy} ${bx},${by} ${ax},${ay}`}
          fill="rgba(59, 130, 246, 0.08)"
          stroke="var(--primary)"
          strokeWidth={1.5}
        />

        {/* Right-angle square */}
        <rect x={bx - 6} y={by - 6} width={6} height={6} fill="none" stroke="var(--primary)" strokeWidth={0.8} />

        {/* Hypotenuse Label: R */}
        <text x={(cx + ax) / 2 - 8} y={(cy + ay) / 2 - 4} className="fill-foreground text-[8px] font-bold">
          R
        </text>

        {/* Base Label: (σ_x - σ_y)/2 */}
        <text x={(cx + bx) / 2} y={cy + 10} textAnchor="middle" className="fill-muted-foreground text-[7.5px] font-mono font-semibold">
          (σ_x - σ_y)/2
        </text>

        {/* Height Label: τ_xy */}
        <text x={bx + 6} y={(ay + by) / 2 + 3} textAnchor="start" className="fill-amber-500 text-[7.5px] font-mono font-bold">
          τ_xy
        </text>

        {/* Center label point */}
        <circle cx={cx} cy={cy} r={2} fill="var(--destructive)" />
        <text x={cx} y={cy - 5} textAnchor="middle" className="fill-destructive text-[7px] font-bold">C</text>

        {/* Reference point A */}
        <circle cx={ax} cy={ay} r={2} fill="var(--foreground)" />
        <text x={ax + 4} y={ay - 2} className="fill-foreground text-[7px] font-bold">A</text>
      </svg>
    </div>
  );
};
