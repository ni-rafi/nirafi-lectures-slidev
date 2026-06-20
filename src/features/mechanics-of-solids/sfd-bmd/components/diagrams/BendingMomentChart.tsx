import React, { useRef } from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { IIntervalEquation } from '@/cores/mechanics-of-solids/sfd-bmd/types';
import { motion, AnimatePresence } from 'motion/react';
import { splitIntoSignSegments, evalPoly } from '../../utils/chartUtils';

export const BendingMomentChart: React.FC = () => {
  const { length, hoverX, setHoverX } = useBeamWorkspace();
  const { solverResult } = useBeamEngine();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (!solverResult.success || solverResult.intervals.length === 0) return null;

  const paddingX = 60;
  const width = 800;
  const height = 150;
  const chartW = width - paddingX * 2;
  const midY = height / 2;

  const toPixelX = (x: number) => paddingX + (x / length) * chartW;
  const toMeterX = (pixel: number) => ((pixel - paddingX) / chartW) * length;

  // Find overall maximum absolute value for scaling
  let maxAbsM = 1.0;
  solverResult.intervals.forEach((inv: IIntervalEquation) => {
    const mStart = Math.abs(evalPoly(inv.mCoeffs, inv.startX));
    const mEnd = Math.abs(evalPoly(inv.mCoeffs, inv.endX));
    if (mStart > maxAbsM) maxAbsM = mStart;
    if (mEnd > maxAbsM) maxAbsM = mEnd;
  });
  const scaleY = 55 / maxAbsM;

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
    const inv = solverResult.intervals.find(i => hoverX >= i.startX - 1e-9 && hoverX <= i.endX + 1e-9);
    if (inv) {
      const mVal = evalPoly(inv.mCoeffs, hoverX);
      const projX = toPixelX(hoverX);
      const projY = midY - mVal * scaleY;
      hoverData = {
        x: hoverX,
        m: parseFloat(mVal.toFixed(2)),
        px: (projX / width) * 100,
        py: (projY / height) * 100,
      };
    }
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bending Moment Diagram (BMD) - kNm</div>
      
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          <defs>
            <linearGradient id="momentGradPos" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="momentGradNeg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={midY - 40} x2={paddingX + chartW} y2={midY - 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <line x1={paddingX} y1={midY + 40} x2={paddingX + chartW} y2={midY + 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          
          {/* Baseline */}
          <line x1={paddingX} y1={midY} x2={paddingX + chartW} y2={midY} stroke="var(--border)" strokeWidth={1.5} />

          {/* Render each interval as a separate path for custom positive/negative segment coloring */}
          {solverResult.intervals.map((inv: IIntervalEquation, idx: number) => {
            const steps = 25; // Dense steps for moment curve smooth path
            const dx = (inv.endX - inv.startX) / steps;
            
            const segmentPoints: { x: number; y: number }[] = [];
            for (let j = 0; j <= steps; j++) {
              const currX = inv.startX + j * dx;
              const mVal = evalPoly(inv.mCoeffs, currX);
              segmentPoints.push({ x: currX, y: mVal });
            }

            const subSegments = splitIntoSignSegments(segmentPoints);

            return subSegments.map((seg, subIdx) => {
              const isPos = seg.isPos;
              const strokeColor = isPos ? '#10b981' : '#ef4444';
              const fillGradient = isPos ? 'url(#momentGradPos)' : 'url(#momentGradNeg)';

              const firstPt = seg.points[0];
              const lastPt = seg.points[seg.points.length - 1];
              if (!firstPt || !lastPt) return null;

              let segAreaD = `M ${toPixelX(firstPt.x)} ${midY}`;
              let segLineD = '';
              seg.points.forEach((p, sIdx) => {
                const px = toPixelX(p.x);
                const py = midY - p.y * scaleY;
                segAreaD += ` L ${px} ${py}`;
                if (sIdx === 0) {
                  segLineD = `M ${px} ${py}`;
                } else {
                  segLineD += ` L ${px} ${py}`;
                }
              });
              segAreaD += ` L ${toPixelX(lastPt.x)} ${midY} Z`;

              return (
                <g key={`${idx}-${subIdx}`}>
                  <motion.path
                    layout
                    d={segAreaD}
                    fill={fillGradient}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                  <motion.path
                    layout
                    d={segLineD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  />
                </g>
              );
            });
          })}

          {/* Labels at key points */}
          {solverResult.criticalPoints.map((cp, idx) => {
            const prevPt = solverResult.criticalPoints[idx - 1];
            if (idx > 0 && prevPt && Math.abs(cp.x - prevPt.x) < 0.25) return null;
            const px = toPixelX(cp.x);
            const py = midY - cp.m * scaleY;
            const isAbove = cp.m >= 0;
            return (
              <g key={idx}>
                <circle cx={px} cy={py} r={3.5} fill={isAbove ? '#10b981' : '#ef4444'} />
                <text
                  x={px}
                  y={isAbove ? py - 8 : py + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-bold"
                >
                  {cp.m.toFixed(1)}
                </text>
                <text x={px} y={midY + 14} textAnchor="middle" className="fill-muted-foreground/60 text-[9px]">
                  {cp.x.toFixed(1)}m
                </text>
              </g>
            );
          })}

          {/* Vertical indicator line and hover dot inside SVG */}
          {hoverData && (
            <g>
              <motion.line
                x1={toPixelX(hoverData.x)}
                y1={10}
                x2={toPixelX(hoverData.x)}
                y2={height - 10}
                stroke={hoverData.m >= 0 ? '#10b981' : '#ef4444'}
                strokeWidth={1}
                strokeDasharray="3,3"
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
              <motion.circle
                cx={toPixelX(hoverData.x)}
                cy={midY - hoverData.m * scaleY}
                r={4}
                fill={hoverData.m >= 0 ? '#10b981' : '#ef4444'}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
            </g>
          )}
        </svg>

        {/* Premium HTML Tooltip Box floating above */}
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
              <div className={`text-xs font-bold ${hoverData.m >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                Moment: {hoverData.m} kNm
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default BendingMomentChart;
