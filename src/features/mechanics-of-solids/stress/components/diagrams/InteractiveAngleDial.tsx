import React, { useRef, useState } from 'react';

interface InteractiveAngleDialProps {
  angleRad: number;
  onChange: (angleRad: number) => void;
}

export const InteractiveAngleDial: React.FC<InteractiveAngleDialProps> = ({ angleRad, onChange }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const angleDeg = Math.round((angleRad * 180) / Math.PI);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateAngleFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    updateAngleFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const updateAngleFromEvent = (e: React.PointerEvent<SVGSVGElement> | PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.8; // Align slightly lower for sweep arc
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    
    // Rotation angle calculation relative to vertical (upward Y is 0 rad)
    let angle = Math.atan2(dx, -dy);
    
    // Clamp to -90 to +90 degrees range (-PI/2 to PI/2)
    const maxAngle = Math.PI / 2;
    if (angle < -maxAngle) angle = -maxAngle;
    if (angle > maxAngle) angle = maxAngle;
    
    onChange(angle);
  };

  const width = 160;
  const height = 100;
  const cx = 80;
  const cy = 85;
  const r = 60;

  const needleX = cx + r * Math.sin(angleRad);
  const needleY = cy - r * Math.cos(angleRad);

  const ticks = [];
  for (let deg = -90; deg <= 90; deg += 15) {
    const rad = (deg * Math.PI) / 180;
    const x1 = cx + (r - 5) * Math.sin(rad);
    const y1 = cy - (r - 5) * Math.cos(rad);
    const x2 = cx + r * Math.sin(rad);
    const y2 = cy - r * Math.cos(rad);
    const isMajor = deg % 30 === 0 || deg === -45 || deg === 45;
    const lx = cx + (r - 13) * Math.sin(rad);
    const ly = cy - (r - 13) * Math.cos(rad);

    ticks.push({
      deg,
      x1,
      y1,
      x2,
      y2,
      lx,
      ly,
      isMajor,
    });
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-muted/20 border border-border/30 rounded-2xl backdrop-blur-md max-w-[200px] w-full select-none shadow-sm">
      <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/80 mb-2">Dial Rotation (θ)</span>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-40 h-24 cursor-pointer overflow-visible touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Arc Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="var(--border)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Active Sweep Highlight */}
        <path
          d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 ${angleRad > 0 ? 1 : 0} ${needleX} ${needleY}`}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={Math.abs(angleRad) > 0.01 ? 0.8 : 0}
        />

        {/* Ticks and Degrees Labels */}
        {ticks.map((t) => (
          <g key={t.deg} opacity={t.isMajor ? 0.75 : 0.35}>
            <line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="var(--foreground)"
              strokeWidth={t.isMajor ? 1.2 : 0.8}
            />
            {t.isMajor && (
              <text
                x={t.lx}
                y={t.ly + 2.5}
                textAnchor="middle"
                className="text-[7.5px] font-mono font-bold fill-muted-foreground"
              >
                {t.deg}°
              </text>
            )}
          </g>
        ))}

        {/* Center Knob Base */}
        <circle cx={cx} cy={cy} r={22} className="fill-background stroke-border/40" strokeWidth={1} />
        
        {/* Value Overlay */}
        <text x={cx} y={cy - 2} textAnchor="middle" className="text-[10px] font-mono font-black fill-primary">
          {angleDeg}°
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" className="text-[6.5px] font-bold uppercase tracking-wider fill-muted-foreground/80">
          Rotate
        </text>

        {/* Glowing needle indicator */}
        <line
          x1={cx + 8 * Math.sin(angleRad)}
          y1={cy - 8 * Math.cos(angleRad)}
          x2={needleX}
          y2={needleY}
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Draggable needle head handle */}
        <circle
          cx={needleX}
          cy={needleY}
          r={5}
          className="fill-primary stroke-background cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
};
