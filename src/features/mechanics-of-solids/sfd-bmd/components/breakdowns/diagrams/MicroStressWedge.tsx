import React from 'react';

interface MicroStressWedgeProps {
  text: string;
}

export const MicroStressWedge: React.FC<MicroStressWedgeProps> = ({ text }) => {
  // Parse angle theta from text
  let theta = 30;
  const match = text.match(/theta\s*=\s*([\d.-]+)/) || text.match(/angle\s*([\d.-]+)/);
  if (match && match[1]) {
    theta = parseFloat(match[1]);
  }

  const width = 160;
  const height = 110;

  // Triangular wedge vertices
  const x1 = 30; // left
  const y1 = 85;
  const x2 = 120; // right-bottom
  const y2 = 85;
  const x3 = 120; // right-top
  const y3 = 35;

  return (
    <div className="mt-2.5 mb-1.5 overflow-hidden rounded-lg border border-border/30 bg-muted/5 p-2 max-w-xs">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full select-none overflow-visible">
        {/* Horizontal reference line */}
        <line x1={15} y1={y1} x2={145} y2={y1} stroke="var(--border)" strokeWidth={0.8} strokeDasharray="3,3" />

        {/* Triangular Wedge */}
        <polygon
          points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
          className="fill-primary/10 stroke-foreground"
          strokeWidth={1.5}
        />

        {/* Right-angle square indicator */}
        <rect x={x2 - 6} y={y2 - 6} width={6} height={6} fill="none" stroke="var(--foreground)" strokeWidth={0.8} />

        {/* Angle Theta arc */}
        <path
          d={`M ${x1 + 18} ${y1} A 18 18 0 0 0 ${x1 + 16} ${y1 - 9}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1}
        />
        <text x={x1 + 22} y={y1 - 3} className="fill-primary text-[7.5px] font-bold">
          θ={theta.toFixed(0)}°
        </text>

        {/* Normal Stress Vector perpendicular to inclined plane */}
        {/* Inclined vector: dx = y2-y1, dy = x1-x2 -> perpendicular: dx = y3-y1 = -50, dy = -(x3-x1) = -90 */}
        {/* Let's draw arrows manually centered at midpoint of inclined plane */}
        <g>
          const midX = (x1 + x3) / 2;
          const midY = (y1 + y3) / 2;
          {/* normal arrow pointing out-up-left */}
          <line x1={75} y1={60} x2={60} y2={35} stroke="var(--success, #10b981)" strokeWidth={1.5} />
          <polygon points="60,35 64,39 59,42" fill="var(--success, #10b981)" />
          <text x={54} y={32} className="fill-success text-[7.5px] font-bold font-mono">σ_θ</text>

          {/* shear arrow parallel to inclined face */}
          <line x1={75} y1={60} x2={95} y2={48} stroke="#f59e0b" strokeWidth={1.5} />
          <polygon points="95,48 90,50 93,45" fill="#f59e0b" />
          <text x={99} y={48} className="fill-amber-500 text-[7.5px] font-bold font-mono">τ_θ</text>
        </g>
      </svg>
    </div>
  );
};
