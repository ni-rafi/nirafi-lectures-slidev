import React, { useRef } from 'react';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../hooks/useBeamEngine';
import { ISolverOutput } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';
import { IDeflectionPoint, IDeflectionResult } from '@/subjects/mechanics-of-solids/cores/deflection/types';
import { motion, AnimatePresence } from 'motion/react';
import { splitIntoSignSegments } from '../../utils/chartUtils';

interface DeflectionChartProps {
  length?: number;
  hoverX?: number | null;
  setHoverX?: (x: number | null) => void;
  supports?: { position: number }[];
  releases?: { position: number }[];
  eiSegments?: { startPosition: number; endPosition: number }[];
  solverResult?: ISolverOutput;
  deflectionResult?: IDeflectionResult;
}

export const DeflectionChart: React.FC<DeflectionChartProps> = ({
  length: propsLength,
  hoverX: propsHoverX,
  setHoverX: propsSetHoverX,
  supports: propsSupports,
  releases: propsReleases,
  eiSegments: propsEiSegments,
  solverResult: propsSolverResult,
  deflectionResult: propsDeflectionResult
}) => {
  let workspaceContext: any = null;
  try {
    workspaceContext = useBeamWorkspace();
  } catch (e) {
    // context is not available when rendered inside Frame Solver
  }

  let engineContext: any = null;
  try {
    engineContext = useBeamEngine();
  } catch (e) {
    // context is not available when rendered inside Frame Solver
  }

  const length = propsLength ?? workspaceContext?.length ?? 6;
  const hoverX = propsHoverX !== undefined ? propsHoverX : (workspaceContext?.hoverX ?? null);
  const setHoverX = propsSetHoverX ?? workspaceContext?.setHoverX ?? (() => {});
  const supports: { position: number }[] = propsSupports ?? workspaceContext?.supports ?? [];
  const releases: { position: number }[] = propsReleases ?? workspaceContext?.releases ?? [];
  const eiSegments: { startPosition: number; endPosition: number }[] = propsEiSegments ?? workspaceContext?.eiSegments ?? [];
  const solverResult: ISolverOutput | undefined = propsSolverResult ?? engineContext?.solverResult;
  const deflectionResult: IDeflectionResult | undefined = propsDeflectionResult ?? engineContext?.deflectionResult;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (
    !solverResult ||
    !solverResult.success ||
    !deflectionResult ||
    !deflectionResult.success ||
    !deflectionResult.points ||
    deflectionResult.points.length === 0
  ) {
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
  eiSegments.forEach((seg) => {
    refPointsRaw.push({ x: seg.startPosition, label: 'S' });
    refPointsRaw.push({ x: seg.endPosition, label: 'S' });
  });

  const refPoints: { x: number; label: string }[] = [];
  refPointsRaw.sort((a, b) => a.x - b.x).forEach(pt => {
    const match = refPoints.find(u => Math.abs(u.x - pt.x) < 0.15);
    if (match) {
      const tokens = match.label.split('/');
      if (!tokens.includes(pt.label)) {
        match.label += `/${pt.label}`;
      }
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

  const { points } = deflectionResult;
  const firstPoint = points[0];
  if (!firstPoint) return null;

  // Find max absolute deflection value for scaling
  let maxAbsD = 1e-4;
  points.forEach((p: IDeflectionPoint) => {
    if (Math.abs(p.deflection) > maxAbsD) {
      maxAbsD = Math.abs(p.deflection);
    }
  });
  const scaleY = 55 / maxAbsD;

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
    let closest = firstPoint;
    let minDist = Math.abs(firstPoint.x - hoverX);
    points.forEach(p => {
      const dist = Math.abs(p.x - hoverX);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    });

    const projX = toPixelX(hoverX);
    const projY = midY - closest.deflection * scaleY;
    hoverData = {
      x: hoverX,
      deflection: closest.deflection,
      px: (projX / width) * 100,
      py: (projY / height) * 100,
    };
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deflection Diagram (Δ) - mm</div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          <defs>
            <linearGradient id="deflGradPos" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="deflGradNeg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
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

          {/* Render continuous sign-based segments with zero-crossing detection */}
          {splitIntoSignSegments(points.map(p => ({ x: p.x, y: p.deflection }))).map((seg, idx) => {
            const isPos = seg.isPos;
            const strokeColor = isPos ? '#10b981' : '#ef4444';
            const fillGradient = isPos ? 'url(#deflGradPos)' : 'url(#deflGradNeg)';

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
              <g key={idx}>
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
          })}

          {/* Labels at key points */}
          {deflectionResult.criticalPoints.map((cp, idx) => {
            const px = toPixelX(cp.x);
            const py = midY - cp.deflection * scaleY;
            const isAbove = cp.deflection >= 0;
            const ptColor = cp.deflection >= 0 ? '#10b981' : '#ef4444';
            return (
              <g key={idx}>
                <circle cx={px} cy={py} r={3.5} fill={ptColor} />
                <text
                  x={px}
                  y={isAbove ? py - 8 : py + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px] font-bold"
                >
                  {cp.deflection.toFixed(3)}
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
                stroke={hoverData.deflection >= 0 ? '#10b981' : '#ef4444'}
                strokeWidth={1}
                strokeDasharray="3,3"
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              />
              <motion.circle
                cx={toPixelX(hoverData.x)}
                cy={midY - hoverData.deflection * scaleY}
                r={4}
                fill={hoverData.deflection >= 0 ? '#10b981' : '#ef4444'}
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
              <div className="text-xs font-bold text-emerald-500" style={{ color: hoverData.deflection >= 0 ? '#10b981' : '#ef4444' }}>
                Deflection: {hoverData.deflection.toFixed(4)} mm
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default DeflectionChart;
