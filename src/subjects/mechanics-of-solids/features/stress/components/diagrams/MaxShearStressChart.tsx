import React, { useRef } from 'react';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '../../../sfd-bmd/hooks/useBeamEngine';
import { StressSolverEngine } from '@/subjects/mechanics-of-solids/cores/stress/stress-solver.engine';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

export const MaxShearStressChart: React.FC = () => {
  const { length, hoverX, setHoverX, supports, releases, eiSegments } = useBeamWorkspace();
  const { solverResult } = useBeamEngine();
  const svgRef = useRef<SVGSVGElement>(null);

  if (!solverResult.success || !solverResult.intervals) return null;

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

  const allCustom = eiSegments.every(s => !s.shape || s.shape.type === 'custom');
  if (allCustom) {
    return (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-500 backdrop-blur-md flex gap-2.5 items-start">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-wider text-[9px]">Shear Stress Envelope Unavailable</p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            Please define a rectangular, circular, or flanged section template in the Cross-Section Builder to enable shear stress envelopes.
          </p>
        </div>
      </div>
    );
  }

  const paddingX = 60;
  const width = 800;
  const height = 130;
  const chartW = width - paddingX * 2;
  const bottomY = height - 15;

  const toPixelX = (x: number) => paddingX + (x / length) * chartW;
  const toMeterX = (pixel: number) => ((pixel - paddingX) / chartW) * length;

  // Evaluate M at any x
  const getMAt = (x: number): number => {
    const interval = solverResult.intervals.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c, d] = interval.mCoeffs;
    return a * x * x * x + b * x * x + c * x + d;
  };

  // Evaluate V at any x
  const getVAt = (x: number): number => {
    const interval = solverResult.intervals.find(
      inv => x >= inv.startX - 1e-4 && x <= inv.endX + 1e-4
    );
    if (!interval) return 0;
    const [a, b, c] = interval.vCoeffs;
    return a * x * x + b * x + c;
  };

  // Calculate maximum shear stress along the span
  const numPoints = 80;
  const dataPoints: { x: number; maxShear: number }[] = [];
  let maxAbsShear = 1e-4; // in Pa for scaling

  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * length;
    const seg = eiSegments.find(s => x >= s.startPosition - 1e-4 && x <= s.endPosition + 1e-4) || eiSegments[0]!;
    const shape = seg.shape ?? { type: 'custom' };
    const M = getMAt(x) * 1000;
    const V = getVAt(x) * 1000;

    if (shape.type === 'custom') {
      dataPoints.push({ x, maxShear: 0 });
    } else {
      const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);
      dataPoints.push({ x, maxShear: res.maxShear });

      if (Math.abs(res.maxShear) > maxAbsShear) maxAbsShear = Math.abs(res.maxShear);
    }
  }

  const scaleY = 90 / maxAbsShear; // Max peak maps to 90px

  // Paths
  let areaD = `M ${toPixelX(0)} ${bottomY}`;
  let lineD = '';

  dataPoints.forEach((pt, idx) => {
    const px = toPixelX(pt.x);
    const py = bottomY - pt.maxShear * scaleY;

    areaD += ` L ${px} ${py}`;

    if (idx === 0) {
      lineD = `M ${px} ${py}`;
    } else {
      lineD += ` L ${px} ${py}`;
    }
  });

  areaD += ` L ${toPixelX(length)} ${bottomY} Z`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const xMeter = Math.max(0, Math.min(length, toMeterX(clientX)));
    setHoverX(parseFloat(xMeter.toFixed(2)));
  };

  // Hover data
  let hoverData = null;
  if (hoverX !== null) {
    const seg = eiSegments.find(s => hoverX >= s.startPosition - 1e-4 && hoverX <= s.endPosition + 1e-4) || eiSegments[0]!;
    const shape = seg.shape ?? { type: 'custom' };
    if (shape.type !== 'custom') {
      const M = getMAt(hoverX) * 1000;
      const V = getVAt(hoverX) * 1000;
      const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);

      const px = toPixelX(hoverX);
      const py = bottomY - res.maxShear * scaleY;

      hoverData = {
        x: hoverX,
        maxShear: res.maxShear / 1e6, // MPa
        px: (px / width) * 100,
        py: (py / height) * 100,
        pxNum: px,
        pyNum: py,
      };
    }
  }

  const getShearCriticalPoints = () => {
    const xCoords = Array.from(new Set([
      0,
      length,
      ...solverResult.criticalPoints.map(cp => cp.x),
      ...eiSegments.map(s => s.startPosition),
      ...eiSegments.map(s => s.endPosition),
    ])).sort((a, b) => a - b);

    const filteredX: number[] = [];
    xCoords.forEach(x => {
      if (x < 0 || x > length) return;
      const last = filteredX[filteredX.length - 1];
      if (last === undefined || Math.abs(x - last) > 0.3) {
        filteredX.push(x);
      }
    });

    const cps: { x: number; maxShear: number }[] = [];
    filteredX.forEach(x => {
      const seg = eiSegments.find(s => x >= s.startPosition - 1e-4 && x <= s.endPosition + 1e-4) || eiSegments[0]!;
      const shape = seg.shape ?? { type: 'custom' };
      if (shape.type !== 'custom') {
        const M = getMAt(x) * 1000;
        const V = getVAt(x) * 1000;
        const res = StressSolverEngine.solveDistribution(shape, M, V, seg.I * 1e-6);
        cps.push({
          x,
          maxShear: res.maxShear,
        });
      }
    });
    return cps;
  };

  const shearCriticalPoints = getShearCriticalPoints();

  return (
    <div className="relative w-full rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Maximum Shear Stress Envelope (τ<sub>max</sub>) - MPa
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverX(null)}
        >
          <defs>
            <linearGradient id="shearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
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
          <line x1={paddingX} y1={bottomY - 40} x2={paddingX + chartW} y2={bottomY - 40} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />
          <line x1={paddingX} y1={bottomY - 80} x2={paddingX + chartW} y2={bottomY - 80} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4,4" opacity={0.4} />

          {/* Baseline */}
          <line x1={paddingX} y1={bottomY} x2={paddingX + chartW} y2={bottomY} stroke="var(--border)" strokeWidth={1.5} />

          {/* Shading (Amber) */}
          <path d={areaD} fill="url(#shearGrad)" />
          <path d={lineD} fill="none" stroke="#f59e0b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* Critical points labels */}
          {shearCriticalPoints.map((cp, idx) => {
            const px = toPixelX(cp.x);
            const py = bottomY - cp.maxShear * scaleY;
            const showShear = Math.abs(cp.maxShear) > 1e3;

            return (
              <g key={idx} opacity={0.85}>
                {/* Baseline x tick */}
                <line x1={px} y1={bottomY - 3} x2={px} y2={bottomY + 3} stroke="var(--border)" strokeWidth={1} />
                <text x={px} y={bottomY + 14} textAnchor="middle" className="fill-muted-foreground/60 text-[9px]">
                  {cp.x.toFixed(1)}m
                </text>

                {showShear && (
                  <g>
                    <circle cx={px} cy={py} r={3} className="fill-amber-500 stroke-background" strokeWidth={0.8} />
                    <text
                      x={px}
                      y={py - 8}
                      textAnchor="middle"
                      className="fill-amber-500 text-[10px] font-bold"
                    >
                      {(cp.maxShear / 1e6).toFixed(1)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Hover indicator lines and dots */}
          {hoverData && (
            <g>
              <line
                x1={hoverData.pxNum}
                y1={10}
                x2={hoverData.pxNum}
                y2={bottomY}
                stroke="var(--muted-foreground)"
                strokeWidth={1}
                strokeDasharray="3,3"
                opacity={0.6}
              />
              <circle cx={hoverData.pxNum} cy={hoverData.pyNum} r={4} fill="#f59e0b" />
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
              className="absolute pointer-events-none rounded-xl border border-border/80 bg-background/85 px-3 py-2 text-left shadow-lg backdrop-blur-md z-30"
              style={{
                left: `${hoverData.px}%`,
                top: `${hoverData.py}%`,
                transform: `translate(${hoverData.px > 80 ? '-110%' : '15px'}, -50%)`,
              }}
            >
              <div className="text-[10px] font-semibold text-muted-foreground">Coordinate: {hoverData.x} m</div>
              <div className="text-xs font-bold text-amber-500">
                Max Shear: {hoverData.maxShear.toFixed(2)} MPa
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
