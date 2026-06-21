import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AxialInterval {
  startX: number;
  endX: number;
  value: number; // positive = tension, negative = compression
}

interface AxialForceChartProps {
  length: number;
  hoverX: number | null;
  setHoverX: (x: number | null) => void;
  supports?: { position: number }[];
  releases?: { position: number }[];
  axialResult?: {
    success: boolean;
    intervals: AxialInterval[];
  };
}

export const AxialForceChart: React.FC<AxialForceChartProps> = ({
  length,
  hoverX,
  setHoverX,
  supports = [],
  releases = [],
  axialResult
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!axialResult || !axialResult.success || !axialResult.intervals || axialResult.intervals.length === 0) {
    return null;
  }

  const sortedSupports = [...supports].sort((a, b) => a.position - b.position);
  const supportPosToLetter = new Map<number, string>();
  sortedSupports.forEach((s, idx) => {
    supportPosToLetter.set(s.position, String.fromCharCode(65 + idx));
  });

  const refPointsRaw = [
    { x: 0, label: '0.0m' },
    { x: length, label: `${length.toFixed(1)}m` }
  ];
  supports.forEach((s) => {
    const letter = supportPosToLetter.get(s.position) || '';
    refPointsRaw.push({ x: s.position, label: letter });
  });
  releases.forEach((r) => {
    refPointsRaw.push({ x: r.position, label: 'H' });
  });

  const refPoints: { x: number; label: string }[] = [];
  refPointsRaw.sort((a, b) => a.x - b.x).forEach(pt => {
    const match = refPoints.find(u => Math.abs(u.x - pt.x) < 0.15);
    if (match) {
      match.label += `/${pt.label}`;
    } else {
      refPoints.push(pt);
    }
  });

  const paddingX = 60;
  const width = 800;
  const height = 150;
  const chartW = width - paddingX * 2;
  const midY = height / 2;

  const toPixelX = (x: number) => paddingX + (x / length) * chartW;
  const toMeterX = (pixel: number) => ((pixel - paddingX) / chartW) * length;

  // Find overall maximum absolute axial value for scaling
  let maxAbsA = 1.0;
  axialResult.intervals.forEach((inv) => {
    const absVal = Math.abs(inv.value);
    if (absVal > maxAbsA) maxAbsA = absVal;
  });
  const scaleY = 55 / maxAbsA;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const xMeter = Math.max(0, Math.min(length, toMeterX(clientX)));
    setHoverX(parseFloat(xMeter.toFixed(2)));
  };

  // Evaluate value at hoverX
  let hoverData = null;
  if (hoverX !== null) {
    const inv = axialResult.intervals.find(i => hoverX >= i.startX - 1e-9 && hoverX <= i.endX + 1e-9);
    if (inv) {
      const aVal = inv.value;
      const projX = toPixelX(hoverX);
      const projY = midY - aVal * scaleY;
      hoverData = {
        x: hoverX,
        a: parseFloat(aVal.toFixed(2)),
        px: (projX / width) * 100,
        py: (projY / height) * 100,
      };
    }
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Axial Force Diagram (AFD) - kN</div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          <defs>
            <linearGradient id="axialGradPos" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="axialGradNeg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Reference guidelines */}
          {refPoints.map((pt, idx) => {
            const px = toPixelX(pt.x);
            return (
              <g key={idx} className="opacity-[0.18]">
                <line x1={px} y1={10} x2={px} y2={height - 22} stroke="var(--foreground)" strokeWidth={1} strokeDasharray="3,3" />
                <text x={px} y={height - 10} textAnchor="middle" className="fill-foreground text-[8px] font-bold">{pt.label}</text>
              </g>
            );
          })}

          {/* Grid lines */}
          <line x1={paddingX} y1={midY - 40} x2={paddingX + chartW} y2={midY - 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <line x1={paddingX} y1={midY + 40} x2={paddingX + chartW} y2={midY + 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />

          {/* Baseline */}
          <line x1={paddingX} y1={midY} x2={paddingX + chartW} y2={midY} stroke="var(--border)" strokeWidth={1.5} />

          {/* Render axial force intervals */}
          {axialResult.intervals.map((inv, idx) => {
            const startPx = toPixelX(inv.startX);
            const endPx = toPixelX(inv.endX);
            const py = midY - inv.value * scaleY;
            const isPos = inv.value >= 0;
            const fillColor = isPos ? 'url(#axialGradPos)' : 'url(#axialGradNeg)';
            const strokeColor = isPos ? '#06b6d4' : '#f43f5e';

            // Area path
            const areaD = `M ${startPx} ${midY} L ${startPx} ${py} L ${endPx} ${py} L ${endPx} ${midY} Z`;
            // Line path
            const lineD = `M ${startPx} ${py} L ${endPx} ${py}`;

            return (
              <g key={idx}>
                <motion.path
                  layout
                  d={areaD}
                  fill={fillColor}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
                <motion.path
                  layout
                  d={lineD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={2}
                  strokeLinecap="round"
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
                
                {/* Vertical end bars */}
                <line x1={startPx} y1={midY} x2={startPx} y2={py} stroke={strokeColor} strokeWidth={1} strokeDasharray="2,2" opacity={0.7} />
                <line x1={endPx} y1={midY} x2={endPx} y2={py} stroke={strokeColor} strokeWidth={1} strokeDasharray="2,2" opacity={0.7} />
              </g>
            );
          })}

          {/* Text Labels at starts and ends of intervals */}
          {axialResult.intervals.map((inv, idx) => {
            const startPx = toPixelX(inv.startX);
            const endPx = toPixelX(inv.endX);
            const py = midY - inv.value * scaleY;
            const isAbove = inv.value >= 0;

            return (
              <g key={idx} className="opacity-90">
                {/* Value at start */}
                <text
                  x={startPx + 15}
                  y={isAbove ? py - 6 : py + 12}
                  textAnchor="start"
                  className="fill-muted-foreground text-[9px] font-bold"
                >
                  {inv.value.toFixed(1)} kN
                </text>
                {/* Value at end if it's the last interval or different value */}
                {idx === axialResult.intervals.length - 1 && (
                  <text
                    x={endPx - 15}
                    y={isAbove ? py - 6 : py + 12}
                    textAnchor="end"
                    className="fill-muted-foreground text-[9px] font-bold"
                  >
                    {inv.value.toFixed(1)} kN
                  </text>
                )}
              </g>
            );
          })}

          {/* Hover indicator */}
          {hoverData && (
            <g>
              <motion.line
                x1={toPixelX(hoverData.x)}
                y1={10}
                x2={toPixelX(hoverData.x)}
                y2={height - 10}
                stroke={hoverData.a >= 0 ? '#06b6d4' : '#f43f5e'}
                strokeWidth={1}
                strokeDasharray="3,3"
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
              <motion.circle
                cx={toPixelX(hoverData.x)}
                cy={midY - hoverData.a * scaleY}
                r={4}
                fill={hoverData.a >= 0 ? '#06b6d4' : '#f43f5e'}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
            </g>
          )}
        </svg>

        {/* HTML Tooltip Box */}
        <AnimatePresence>
          {hoverData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className="absolute pointer-events-none rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-left shadow-lg backdrop-blur-md"
              style={{
                left: `${hoverData.px}%`,
                top: `${hoverData.py}%`,
                transform: `translate(${hoverData.px > 80 ? '-110%' : '15px'}, -50%)`,
              }}
            >
              <div className="text-[10px] font-semibold text-muted-foreground">Coordinate: {hoverData.x} m</div>
              <div
                className="text-xs font-bold"
                style={{ color: hoverData.a >= 0 ? '#06b6d4' : '#f43f5e' }}
              >
                Axial Force: {hoverData.a.toFixed(2)} kN ({hoverData.a >= 0 ? 'Tension' : 'Compression'})
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
